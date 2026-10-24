/* GET /api/me — the signed-in student, or 401.  POST /api/me {name} — set the leaderboard name.  DELETE /api/me — delete the account and its data. */
import {json, start, currentUser, publicUser, cleanName, clearCookie} from "../../lib/auth.js";
import {avatarVersion, deleteAvatar} from "../../lib/avatars.js";
export async function onRequestGet({request, env}) {
  const s = await start(request, env, {needBody: false}); if (s.error) return s.error;
  const u = await currentUser(env, request); if (!u) return json({error: "Not signed in."}, 401);
  return json({user: {...publicUser(u), avatar: await avatarVersion(env.DB, u.id)}});
}
export async function onRequestPost({request, env}) {
  const s = await start(request, env); if (s.error) return s.error;
  const u = await currentUser(env, request); if (!u) return json({error: "Not signed in."}, 401);
  const name = cleanName(s.body.name);
  if (name.length < 2) return json({error: "Enter your first name (and last initial if you like)."}, 400);
  await env.DB.prepare("UPDATE users SET display_name = ? WHERE id = ?").bind(name, u.id).run();
  return json({user: {...publicUser({...u, display_name: name}), avatar: await avatarVersion(env.DB, u.id)}});
}
export async function onRequestDelete({request, env}) {
  const s = await start(request, env, {needBody: false}); if (s.error) return s.error;
  const u = await currentUser(env, request); if (!u) return json({error: "Not signed in."}, 401);
  await deleteAvatar(env.DB, u.id);
  await env.DB.batch(["sessions", "progress", "league_members", "league_tiers"].map(t => env.DB.prepare(`DELETE FROM ${t} WHERE user_id = ?`).bind(u.id))
    .concat(u.email ? [env.DB.prepare("DELETE FROM email_codes WHERE email = ?").bind(u.email)] : [], [env.DB.prepare("DELETE FROM users WHERE id = ?").bind(u.id)]));
  return json({ok: true}, 200, {"set-cookie": clearCookie(request)});
}
