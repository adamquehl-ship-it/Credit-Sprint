/* Credit Sprint payments with Stripe Checkout. Access is recorded per course in the D1 database by the
   Stripe webhook, never in the browser.
   Cloudflare settings (Pages project → Settings → Variables and secrets):
     STRIPE_SECRET_KEY      secret, sk_/rk_test_… or sk_/rk_live_…
     STRIPE_WEBHOOK_SECRET  secret, whsec_… (Stripe → Developers → Webhooks → your endpoint)
     PRICE_EXAM             Exam Pass (1 class), $29.99 one time
     PRICE_EXAM_EARLY       Exam Pass early bird, $19.99 one time (charged July–December)
     PRICE_EXAM3            3-Class Exam Pass, $40 one time
     PRICE_EXAM3_EARLY      3-Class Exam Pass early bird, $25 one time
     PRICE_EXAM_ALL         All-Class Exam Pass, $50 one time
     PRICE_EXAM_ALL_EARLY   All-Class Exam Pass early bird, $35 one time
     PRICE_SPRINT           Final Sprint, $15 one time (plan switched off for now)
     PRICE_SUB_ONE          Monthly, 1 class, $7.99 / month
     PRICE_SUB_THREE        Monthly, 3 classes, $14.99 / month
     PRICE_SUB_ALL          Monthly, all classes, $19.99 / month
   A plan whose price isn't set yet simply can't be bought (the plans window hides it). */
export const COURSES = ["macro", "micro", "bio", "chem", "mkt", "apush", "apworld", "apgov", "appsych", "apstat", "aplit", "aplang", "calcab", "calcbc", "aphug", "precalc"];
/* n = how many classes the student picks (0 = every class, stored as course "all") */
export const PLANS = {
  exam:    {mode: "payment",      env: "PRICE_EXAM",      early: "PRICE_EXAM_EARLY",     n: 1, name: "Exam Pass"},
  exam3:   {mode: "payment",      env: "PRICE_EXAM3",     early: "PRICE_EXAM3_EARLY",    n: 3, name: "3-Class Exam Pass"},
  examall: {mode: "payment",      env: "PRICE_EXAM_ALL",  early: "PRICE_EXAM_ALL_EARLY", n: 0, name: "All-Class Exam Pass"},
  /* Final Sprint is switched off for now (off: true). To bring it back near exam time, delete "off: true" here and in assets/js/upgrade.js. */
  sprint:  {mode: "payment",      env: "PRICE_SPRINT",    n: 1, name: "Final Sprint", off: true},
  sub1:    {mode: "subscription", env: "PRICE_SUB_ONE",   n: 1, name: "Monthly (1 class)"},
  sub3:    {mode: "subscription", env: "PRICE_SUB_THREE", n: 3, name: "Monthly (3 classes)"},
  suball:  {mode: "subscription", env: "PRICE_SUB_ALL",   n: 0, name: "Monthly (all classes)"}
};
const DAY = 864e5;
/* early-bird price for Exam Passes bought July through December */
export const isEarly = (d = new Date()) => d.getUTCMonth() >= 6;
export function priceFor(env, plan, d = new Date()) {
  const P = PLANS[plan]; if (!P || P.off) return null;
  if (P.early && isEarly(d) && env[P.early]) return env[P.early];
  return env[P.env] || null;
}
/* plans that can be bought right now (their price is set in Cloudflare) */
export const plansOn = env => env.STRIPE_SECRET_KEY && env.STRIPE_WEBHOOK_SECRET ? Object.keys(PLANS).filter(k => priceFor(env, k)) : [];
export const paymentsOn = env => plansOn(env).length > 0;
/* the classes a purchase covers: "all", or a comma list like "macro,bio,chem" → ["all"] / ["macro","bio","chem"] */
export function parseCourses(plan, course) {
  const P = PLANS[plan]; if (!P) return null;
  if (P.n === 0) return course === "all" ? ["all"] : null;
  const list = [...new Set(String(course || "").split(",").map(c => c.trim()).filter(Boolean))];
  return list.length === P.n && list.every(c => COURSES.includes(c)) ? list : null;
}
/* one database row per class; multi-class purchases add ":course" to the Stripe reference */
export const refFor = (base, course, list) => list.length > 1 ? base + ":" + course : base;

/* how long a one-time purchase lasts */
export function passUntil(plan, now = Date.now()) {   /* exam, exam3 and examall all last through exam day */
  if (plan === "sprint") return now + 30 * DAY;
  /* Exam Pass: through June 1 after the next May exams, and never less than 6 months (for CLEP, which has no fixed date) */
  const d = new Date(now), y = d.getUTCFullYear(), june = Date.UTC(d.getUTCMonth() >= 5 ? y + 1 : y, 5, 1, 23, 59);
  return Math.max(june, now + 182 * DAY);
}

let ready = null;
export function ensureBilling(DB) {
  return ready || (ready = DB.batch([
    DB.prepare("CREATE TABLE IF NOT EXISTS entitlements (ref TEXT PRIMARY KEY, user_id TEXT NOT NULL, plan TEXT NOT NULL, course TEXT NOT NULL, until INTEGER NOT NULL, created_at INTEGER NOT NULL)"),
    DB.prepare("CREATE INDEX IF NOT EXISTS entitlements_user ON entitlements(user_id)"),
    DB.prepare("CREATE TABLE IF NOT EXISTS customers (user_id TEXT PRIMARY KEY, customer_id TEXT NOT NULL)"),
    DB.prepare("CREATE TABLE IF NOT EXISTS stripe_events (id TEXT PRIMARY KEY, at INTEGER NOT NULL)")
  ]).catch(e => { ready = null; throw e; }));
}
/* what the student can open right now: [{course, plan, until, sub}] */
export async function accessFor(DB, userId) {
  await ensureBilling(DB);
  const rows = (await DB.prepare("SELECT plan, course, until FROM entitlements WHERE user_id = ? AND until > ? ORDER BY until DESC").bind(userId, Date.now()).all()).results || [];
  const cust = await DB.prepare("SELECT 1 FROM customers WHERE user_id = ?").bind(userId).first();
  return {access: rows.map(r => ({course: r.course, plan: r.plan, until: r.until, sub: r.plan.startsWith("sub")})), billing: !!cust};
}
export async function deleteBilling(DB, userId) {
  await ensureBilling(DB);
  await DB.batch([DB.prepare("DELETE FROM entitlements WHERE user_id = ?").bind(userId), DB.prepare("DELETE FROM customers WHERE user_id = ?").bind(userId)]);
}

/* ---------- Stripe REST API (form-encoded) ---------- */
function form(obj, prefix = "", out = []) {
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    const key = prefix ? `${prefix}[${k}]` : k;
    if (typeof v === "object") form(v, key, out); else out.push(encodeURIComponent(key) + "=" + encodeURIComponent(v));
  }
  return out.join("&");
}
export async function stripe(env, path, body, method = body ? "POST" : "GET") {
  const r = await fetch("https://api.stripe.com/v1/" + path, {method,
    headers: {authorization: "Bearer " + env.STRIPE_SECRET_KEY, "content-type": "application/x-www-form-urlencoded"}, body: body ? form(body) : undefined});
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((j.error && j.error.message) || ("Stripe error " + r.status));
  return j;
}

/* ---------- webhook signature (Stripe-Signature: t=…,v1=…) ---------- */
const enc = new TextEncoder();
const hex = buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
export async function verifyStripe(raw, header, secret, toleranceSec = 300, nowSec = Math.floor(Date.now() / 1000)) {
  if (!header || !secret) return false;
  const parts = Object.fromEntries(header.split(",").map(p => p.split("=")).filter(p => p.length === 2).map(([k, v]) => [k.trim(), v]));
  const sigs = header.split(",").filter(p => p.trim().startsWith("v1=")).map(p => p.trim().slice(3));
  const t = +parts.t; if (!t || !sigs.length || Math.abs(nowSec - t) > toleranceSec) return false;
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), {name: "HMAC", hash: "SHA-256"}, false, ["sign"]);
  const want = hex(await crypto.subtle.sign("HMAC", key, enc.encode(t + "." + raw)));
  return sigs.some(s => { if (s.length !== want.length) return false; let d = 0; for (let i = 0; i < s.length; i++) d |= s.charCodeAt(i) ^ want.charCodeAt(i); return d === 0; });
}
