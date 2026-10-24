/* POST /api/auth/login {username, password} */
import {json, start, checkPassword, createSession, publicUser} from "../../../lib/auth.js";
export async function onRequestPost({request, env}) {
  const s = await start(request, env); if (s.error) return s.error;
  const username = String(s.body.username || "").trim().toLowerCase();
  const u = await env.DB.prepare("SELECT * FROM users WHERE username = ?").bind(username).first();
  if (!u || !(await checkPassword(String(s.body.password || ""), u.pass_hash, env))) return json({error: "That username and password don't match."}, 401);
  return json({user: publicUser(u)}, 200, {"set-cookie": await createSession(env, request, u.id)});
}
