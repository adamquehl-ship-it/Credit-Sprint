/* POST /api/auth/login {username, password}. Wrong passwords are limited to 10 per username per 15 minutes. */
import {json, start, checkPassword, createSession, publicUser} from "../../../lib/auth.js";
const WINDOW = 15 * 60e3, MAX_FAILS = 10;
export async function onRequestPost({request, env}) {
  const s = await start(request, env); if (s.error) return s.error;
  const username = String(s.body.username || "").trim().toLowerCase();
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS login_fails (username TEXT PRIMARY KEY, n INTEGER NOT NULL, since INTEGER NOT NULL)").run();
  const now = Date.now(), f = await env.DB.prepare("SELECT n, since FROM login_fails WHERE username = ?").bind(username).first();
  if (f && now - f.since < WINDOW && f.n >= MAX_FAILS) return json({error: "Too many wrong passwords. Wait 15 minutes and try again."}, 429);
  const u = await env.DB.prepare("SELECT * FROM users WHERE username = ?").bind(username).first();
  if (!u || !(await checkPassword(String(s.body.password || ""), u.pass_hash, env))) {
    await env.DB.prepare("INSERT INTO login_fails (username, n, since) VALUES (?, 1, ?) ON CONFLICT(username) DO UPDATE SET n = CASE WHEN ? - since < ? THEN n + 1 ELSE 1 END, since = CASE WHEN ? - since < ? THEN since ELSE excluded.since END")
      .bind(username, now, now, WINDOW, now, WINDOW).run();
    return json({error: "That username and password don't match."}, 401);
  }
  await env.DB.prepare("DELETE FROM login_fails WHERE username = ?").bind(username).run();
  return json({user: publicUser(u)}, 200, {"set-cookie": await createSession(env, request, u.id)});
}
