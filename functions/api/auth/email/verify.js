/* POST /api/auth/email/verify {email, code, age13} — check the code and sign in (creating the account the first time). */
import {json, start, sha256, newId, createSession, publicUser} from "../../../../lib/auth.js";
export async function onRequestPost({request, env}) {
  const s = await start(request, env); if (s.error) return s.error;
  const email = String(s.body.email || "").trim().toLowerCase(), code = String(s.body.code || "").replace(/\D/g, "");
  const row = await env.DB.prepare("SELECT * FROM email_codes WHERE email = ?").bind(email).first();
  if (!row || row.expires_at < Date.now()) return json({error: "That code has expired. Ask for a new one."}, 400);
  if (row.attempts >= 5) return json({error: "Too many tries. Ask for a new code."}, 429);
  if (row.code_hash !== await sha256(email + ":" + code)) {
    await env.DB.prepare("UPDATE email_codes SET attempts = attempts + 1 WHERE email = ?").bind(email).run();
    return json({error: "That code isn't right. Check the email and try again."}, 400);
  }
  let u = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first(), created = false;
  /* new accounts must confirm age before the code is used up */
  if (!u && !s.body.age13) return json({error: "You need to be 13 or older to create an account.", needAge: true}, 400);
  await env.DB.prepare("DELETE FROM email_codes WHERE email = ?").bind(email).run();
  if (!u) {
    const id = newId();
    await env.DB.prepare("INSERT INTO users (id, email, created_at) VALUES (?, ?, ?)").bind(id, email, Date.now()).run();
    u = await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(id).first(); created = true;
  }
  return json({user: publicUser(u), created}, 200, {"set-cookie": await createSession(env, request, u.id)});
}
