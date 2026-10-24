/* POST /api/redeem {code} — unlock Pro with an access code (for you, testers, teachers or giveaways).
   Codes live ONLY in Cloudflare (Settings → Variables and secrets → Secret ACCESS_CODES), never in this code:
     ACCESS_CODES = CODE:course:days, comma-separated. course is all, macro or micro. days 0 = forever.
     e.g.  CS-PRO-AW86-DENH-MUYC:all:0, TEACHER-FALL:all:30
   PET_CODES (a second secret) gives a pet instead: CODE:petid:maxUses, e.g.  RAHUL-XXXX-XXXX-XXXX:rahul:50
     Each account can use a pet code once, and the code stops working after maxUses different accounts.
   Each account can redeem a code once. Remove a code from the secret to stop new redemptions. */
import {json, start, currentUser} from "../../lib/auth.js";
import {ensureBilling, COURSES} from "../../lib/billing.js";
import {ensureMarket} from "../../lib/market.js";
const PETS = ["rahul"];
const norm = s => String(s || "").trim().toUpperCase().replace(/\s+/g, "");
const same = (a, b) => { if (a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0; };
export async function onRequestPost({request, env}) {
  const s = await start(request, env); if (s.error) return s.error;
  const u = await currentUser(env, request); if (!u) return json({error: "Sign in first, then enter your code."}, 401);
  await ensureBilling(env.DB);
  /* slow down guessing: 10 tries per account per hour */
  const hour = Math.floor(Date.now() / 36e5), key = "redeem:" + u.id + ":" + hour;
  await env.DB.prepare("INSERT INTO stripe_events (id, at) VALUES (?, 1) ON CONFLICT(id) DO UPDATE SET at = at + 1").bind(key).run().catch(() => {});
  const tries = await env.DB.prepare("SELECT at FROM stripe_events WHERE id = ?").bind(key).first();
  if (tries && tries.at > 10) return json({error: "Too many tries. Wait an hour and try again."}, 429);
  const code = norm(s.body.code);
  const list = String(env.ACCESS_CODES || "").split(",").map(x => x.trim()).filter(Boolean).map(x => { const [c, course = "all", days = "0"] = x.split(":"); return {c: norm(c), course: course.trim().toLowerCase(), days: +days || 0}; });
  const hit = code.length >= 6 && list.find(x => same(x.c, code));
  if (!hit) {
    const pl = String(env.PET_CODES || "").split(",").map(x => x.trim()).filter(Boolean).map(x => { const [c, pet = "", max = "1"] = x.split(":"); return {c: norm(c), pet: pet.trim().toLowerCase(), max: Math.max(1, +max || 1)}; });
    const ph = code.length >= 6 && pl.find(x => same(x.c, code));
    if (ph && PETS.includes(ph.pet)) return await redeemPet(env, u, ph);
  }
  if (!hit || !(hit.course === "all" || COURSES.includes(hit.course))) return json({error: "That code isn't valid."}, 400);
  const ref = "code:" + hit.c + ":" + u.id;
  if (await env.DB.prepare("SELECT 1 FROM entitlements WHERE ref = ?").bind(ref).first()) return json({error: "You've already used this code."}, 409);
  const until = hit.days ? Date.now() + hit.days * 864e5 : Date.UTC(2099, 0, 1);
  await env.DB.prepare("INSERT INTO entitlements (ref, user_id, plan, course, until, created_at) VALUES (?, ?, 'code', ?, ?, ?)").bind(ref, u.id, hit.course, until, Date.now()).run();
  return json({ok: true, course: hit.course, until});
}

async function redeemPet(env, u, ph) {
  await ensureMarket(env.DB);
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS pet_code_uses (code TEXT NOT NULL, user_id TEXT NOT NULL, at INTEGER NOT NULL, PRIMARY KEY (code, user_id))").run();
  if (await env.DB.prepare("SELECT 1 FROM pet_code_uses WHERE code = ? AND user_id = ?").bind(ph.c, u.id).first()) return json({error: "You've already used this code."}, 409);
  await env.DB.prepare("INSERT INTO pet_code_uses (code, user_id, at) VALUES (?, ?, ?)").bind(ph.c, u.id, Date.now()).run();
  /* claim a slot: if more accounts than allowed got in, the latest ones are rejected */
  const n = await env.DB.prepare("SELECT COUNT(*) AS n FROM pet_code_uses WHERE code = ? AND rowid <= (SELECT rowid FROM pet_code_uses WHERE code = ? AND user_id = ?)").bind(ph.c, ph.c, u.id).first();
  if (n && n.n > ph.max) {
    await env.DB.prepare("DELETE FROM pet_code_uses WHERE code = ? AND user_id = ?").bind(ph.c, u.id).run();
    return json({error: "All the pets from this code have been claimed."}, 410);
  }
  await env.DB.prepare("INSERT INTO ledger (user_id, creds, pet_id, pet_delta, reason, ref, created_at) VALUES (?, 0, ?, 1, 'code', NULL, ?)").bind(u.id, ph.pet, Date.now()).run();
  return json({ok: true, pet: ph.pet});
}
