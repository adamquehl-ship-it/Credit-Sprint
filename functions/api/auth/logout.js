/* POST /api/auth/logout */
import {json, start, cookie, sha256, clearCookie} from "../../../lib/auth.js";
export async function onRequestPost({request, env}) {
  const s = await start(request, env, {needBody: false}); if (s.error) return s.error;
  const t = cookie("cs_sess", request);
  if (t) await env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(await sha256(t)).run();
  return json({ok: true}, 200, {"set-cookie": clearCookie(request)});
}
