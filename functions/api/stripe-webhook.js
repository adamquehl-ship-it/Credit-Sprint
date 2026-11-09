/* POST /api/stripe-webhook — Stripe tells us about payments here. Add this URL in Stripe → Developers → Webhooks with
   events: checkout.session.completed, checkout.session.async_payment_succeeded, customer.subscription.created, customer.subscription.updated,
   customer.subscription.deleted, charge.refunded. Every message is checked against STRIPE_WEBHOOK_SECRET. */
import {json} from "../../lib/auth.js";
import {ensureBilling, verifyStripe, passUntil, parseCourses, refFor, stripe} from "../../lib/billing.js";
/* Monthly plans only last for the month that's been paid. GRACE is a 1-day cushion so a renewal that's paid on time never
   locks anyone out while Stripe's renewal message is on its way. */
const DAY = 864e5, GRACE = 1 * DAY;
/* the subscription behind a refunded charge, if it was a monthly payment. Older Stripe API versions put the invoice on the
   charge; newer ones only link it through invoice_payments. Returns null for one-time payments or if Stripe can't be reached. */
async function subscriptionForCharge(env, ch) {
  try {
    let inv = ch.invoice || null;
    if (!inv && env.STRIPE_SECRET_KEY && ch.payment_intent) {
      const ip = await stripe(env, "invoice_payments?limit=1&payment[type]=payment_intent&payment[payment_intent]=" + encodeURIComponent(ch.payment_intent));
      inv = ip && ip.data && ip.data[0] && ip.data[0].invoice;
    }
    if (!inv) return null;
    if (typeof inv === "string") { if (!env.STRIPE_SECRET_KEY) return null; inv = await stripe(env, "invoices/" + encodeURIComponent(inv)); }
    const s = inv.subscription || (inv.parent && inv.parent.subscription_details && inv.parent.subscription_details.subscription);
    return s ? (typeof s === "string" ? s : s.id) : null;
  } catch (e) { console.error("refund lookup failed:", e && e.message); return null; }
}
async function stopMonthly(env, customer, user) {
  try {
    const subs = await stripe(env, "subscriptions?status=active&limit=20&customer=" + encodeURIComponent(customer));
    for (const sub of (subs && subs.data) || []) {
      if (sub.cancel_at_period_end) continue;
      if (sub.metadata && sub.metadata.user && sub.metadata.user !== user) continue;
      await stripe(env, "subscriptions/" + encodeURIComponent(sub.id), {cancel_at_period_end: "true"});
    }
  } catch (e) { console.error("stopping monthly plan failed:", e && e.message); }
}
export async function onRequestPost({request, env}) {
  if (!env.DB) return json({error: "No database."}, 503);
  const raw = await request.text();
  if (!(await verifyStripe(raw, request.headers.get("stripe-signature"), env.STRIPE_WEBHOOK_SECRET))) return json({error: "Bad signature."}, 400);
  let ev; try { ev = JSON.parse(raw); } catch { return json({error: "Bad body."}, 400); }
  await ensureBilling(env.DB);
  if (await env.DB.prepare("SELECT 1 FROM stripe_events WHERE id = ?").bind(ev.id).first()) return json({ok: true, duplicate: true});
  const o = (ev.data && ev.data.object) || {}, m = o.metadata || {}, now = Date.now(), DB = env.DB, q = [];
  /* one row per class: multi-class purchases are stored as "<stripe id>:<class>" */
  const put = (base, user, plan, course, until) => { const list = parseCourses(plan, course); if (!list) return false;
    for (const c of list) q.push(DB.prepare("INSERT INTO entitlements (ref, user_id, plan, course, until, created_at) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(ref) DO UPDATE SET until = excluded.until").bind(refFor(base, c, list), user, plan, c, until, now));
    return true; };
  const setUntil = (base, until) => q.push(DB.prepare("UPDATE entitlements SET until = ? WHERE ref = ? OR substr(ref, 1, ?) = ?").bind(until, base, base.length + 1, base + ":"));
  /* async_payment_succeeded: bank debits and other delayed methods finish later; access turns on when the money arrives */
  if (ev.type === "checkout.session.completed" || ev.type === "checkout.session.async_payment_succeeded") {
    const user = o.client_reference_id || m.user;
    if (user && o.customer) q.push(DB.prepare("INSERT INTO customers (user_id, customer_id) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET customer_id = excluded.customer_id").bind(user, o.customer));
    if (user) {
      /* "no_payment_required" = a 100%-off promotion code: nothing was charged, but the student still gets the plan */
      if (o.mode === "payment" && (o.payment_status === "paid" || o.payment_status === "no_payment_required")) put(o.payment_intent || o.id, user, m.plan, m.course, passUntil(m.plan, (o.created || now / 1000) * 1000));
      if (o.mode === "subscription" && o.subscription) put(o.subscription, user, m.plan, m.course, now + 31 * DAY + GRACE);   // one month; refined by subscription events
      /* an All-Class Exam Pass covers everything a monthly plan does, so stop the student's monthly plans from renewing.
         They keep the month they already paid for (cancel at period end, no refund). A Stripe error never blocks the pass. */
      if (m.plan === "examall" && o.mode === "payment" && o.customer && env.STRIPE_SECRET_KEY) await stopMonthly(env, o.customer, user);
    }
  } else if (ev.type.startsWith("customer.subscription.")) {
    const item = (o.items && o.items.data && o.items.data[0]) || {};
    const end = o.current_period_end || item.current_period_end, startP = o.current_period_start || item.current_period_start;
    const live = ["active", "trialing"].includes(o.status) && ev.type !== "customer.subscription.deleted";
    /* paid up: through the end of the paid month. Renewal failed (past_due/unpaid): only until the unpaid month began,
       so nobody gets a new month without paying. It unlocks again as soon as the renewal is paid. Canceled: now. */
    const until = live && end ? end * 1000 + GRACE : o.status === "past_due" && startP ? Math.min(now, startP * 1000 + GRACE) : now;
    if (!(m.user && put(o.id, m.user, m.plan, m.course, until))) setUntil(o.id, until);
  } else if (ev.type === "charge.refunded" && o.refunded && o.payment_intent) {
    setUntil(o.payment_intent, now);
    /* a refunded monthly charge belongs to a subscription invoice: lock that subscription's classes too.
       (If the subscription keeps running, its next paid renewal turns access back on.) */
    const sub = await subscriptionForCharge(env, o);
    if (sub) setUntil(sub, now);
  }
  q.push(DB.prepare("INSERT OR IGNORE INTO stripe_events (id, at) VALUES (?, ?)").bind(ev.id, now));
  await DB.batch(q);
  return json({ok: true});
}
