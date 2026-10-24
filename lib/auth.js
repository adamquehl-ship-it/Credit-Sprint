/* Credit Sprint accounts: shared helpers for the /api/auth, /api/me, /api/progress and /api/league functions.
   Needs a D1 database bound as DB (Pages project → Settings → Bindings → D1 database, variable name "DB").
   Optional settings (Settings → Variables and secrets):
     RESEND_API_KEY  secret, for email sign-in codes (resend.com)
     EMAIL_FROM      e.g. "Credit Sprint <login@creditsprintprep.com>"
     GOOGLE_CLIENT_ID  for Google sign-in (console.cloud.google.com → Credentials → OAuth client ID, type Web)
     ALLOWED_ORIGIN  e.g. https://creditsprintprep.com */
export const json = (obj, status = 200, headers = {}) => new Response(JSON.stringify(obj), {status, headers: {"content-type": "application/json", "cache-control": "no-store", ...headers}});
export const SESSION_DAYS = 60;
const enc = new TextEncoder();
export const b64url = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
export const randomToken = (n = 32) => b64url(crypto.getRandomValues(new Uint8Array(n)));
export const sha256 = async s => b64url(await crypto.subtle.digest("SHA-256", enc.encode(s)));
export const newId = () => randomToken(12);

/* checks every request: database present, same origin, small JSON body */
export async function start(request, env, {needBody = true} = {}) {
  if (!env.DB) return {error: json({error: "Accounts aren't set up yet. Add the D1 database binding named DB."}, 503)};
  const origin = request.headers.get("origin") || "";
  if (env.ALLOWED_ORIGIN && origin && origin !== env.ALLOWED_ORIGIN) return {error: json({error: "Not allowed."}, 403)};
  if (!needBody) return {};
  if (+(request.headers.get("content-length") || 0) > 300000) return {error: json({error: "Request too large."}, 413)};
  try { return {body: await request.json()}; } catch { return {error: json({error: "Bad request."}, 400)}; }
}

/* ---------- sessions (HttpOnly cookie) ---------- */
export function cookie(name, request) {
  const m = (request.headers.get("cookie") || "").match(new RegExp("(?:^|;\\s*)" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[1]) : null;
}
const secure = request => new URL(request.url).protocol === "https:" ? "; Secure" : "";
export async function createSession(env, request, userId) {
  const token = randomToken(), exp = Date.now() + SESSION_DAYS * 864e5;
  await env.DB.prepare("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)").bind(await sha256(token), userId, exp).run();
  return `cs_sess=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_DAYS * 86400}${secure(request)}`;
}
export const clearCookie = request => `cs_sess=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${secure(request)}`;
export async function currentUser(env, request) {
  const t = cookie("cs_sess", request); if (!t) return null;
  const row = await env.DB.prepare("SELECT u.*, s.expires_at AS sx FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ?").bind(await sha256(t)).first();
  if (!row || row.sx < Date.now()) return null;
  return row;
}
export const publicUser = u => ({id: u.id, name: u.display_name || "", email: u.email || null, username: u.username || null, google: !!u.google_sub,
  methods: [u.email && "email", u.google_sub && "google", u.pass_hash && "password"].filter(Boolean)});

/* ---------- passwords (PBKDF2-SHA256; iterations kept modest for the free plan's CPU limit) ---------- */
export async function hashPassword(pw, env, salt = randomToken(16), iter = +(env.PBKDF2_ITER || 10000)) {
  const key = await crypto.subtle.importKey("raw", enc.encode(pw), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({name: "PBKDF2", hash: "SHA-256", salt: enc.encode(salt), iterations: iter}, key, 256);
  return `pbkdf2$${iter}$${salt}$${b64url(bits)}`;
}
export async function checkPassword(pw, stored, env) {
  const [, iter, salt] = String(stored || "").split("$"); if (!salt) return false;
  const again = await hashPassword(pw, env, salt, +iter);
  if (again.length !== stored.length) return false;
  let d = 0; for (let i = 0; i < again.length; i++) d |= again.charCodeAt(i) ^ stored.charCodeAt(i);
  return d === 0;
}

/* ---------- names shown on leaderboards: first name + last initial, letters only ---------- */
export function cleanName(s) {
  const parts = String(s || "").normalize("NFKC").replace(/[^\p{L}\s'-]/gu, "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "";
  const first = parts[0].slice(0, 16), init = parts[1] ? " " + parts[1][0].toUpperCase() + "." : "";
  return first[0].toUpperCase() + first.slice(1) + init;
}
export const validEmail = e => /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/.test(e || "");

/* ---------- weeks (UTC, Monday start) ---------- */
export function weekKey(d = new Date()) {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  t.setUTCDate(t.getUTCDate() - ((t.getUTCDay() + 6) % 7));
  return t.toISOString().slice(0, 10);
}
export const addDaysKey = (key, n) => { const t = new Date(key + "T00:00:00Z"); t.setUTCDate(t.getUTCDate() + n); return t.toISOString().slice(0, 10); };
