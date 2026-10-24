/* POST /api/auth/register {username, password, name, age13} — create an account with a username and password. */
import {json, start, newId, hashPassword, createSession, publicUser, cleanName} from "../../../lib/auth.js";
export async function onRequestPost({request, env}) {
  const s = await start(request, env); if (s.error) return s.error;
  const username = String(s.body.username || "").trim().toLowerCase(), pw = String(s.body.password || ""), name = cleanName(s.body.name);
  if (!s.body.age13) return json({error: "You need to be 13 or older to create an account."}, 400);
  if (!/^[a-z0-9_]{3,20}$/.test(username)) return json({error: "Usernames are 3–20 letters, numbers or underscores."}, 400);
  if (pw.length < 8 || pw.length > 200) return json({error: "Use a password with at least 8 characters."}, 400);
  if (await env.DB.prepare("SELECT 1 FROM users WHERE username = ?").bind(username).first()) return json({error: "That username is taken. Try another one."}, 409);
  const id = newId();
  await env.DB.prepare("INSERT INTO users (id, username, pass_hash, display_name, created_at) VALUES (?, ?, ?, ?, ?)").bind(id, username, await hashPassword(pw, env), name || null, Date.now()).run();
  const u = await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(id).first();
  return json({user: publicUser(u), created: true}, 200, {"set-cookie": await createSession(env, request, id)});
}
