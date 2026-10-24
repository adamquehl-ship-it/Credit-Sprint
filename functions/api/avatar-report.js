/* POST /api/avatar-report {id} — report another student's profile picture. Three reports hide it. */
import {json, start, currentUser} from "../../lib/auth.js";
import {ensureAvatars, REPORTS_TO_HIDE} from "../../lib/avatars.js";
export async function onRequestPost({request, env}) {
  const s = await start(request, env); if (s.error) return s.error;
  const u = await currentUser(env, request); if (!u) return json({error: "Not signed in."}, 401);
  const id = String(s.body.id || "").slice(0, 40);
  if (!id || id === u.id) return json({error: "Can't report that picture."}, 400);
  await ensureAvatars(env.DB);
  const has = await env.DB.prepare("SELECT 1 FROM avatars WHERE user_id = ?").bind(id).first();
  if (!has) return json({ok: true});
  await env.DB.prepare("INSERT OR IGNORE INTO avatar_reports (user_id, reporter_id, created_at) VALUES (?, ?, ?)").bind(id, u.id, Date.now()).run();
  const n = (await env.DB.prepare("SELECT COUNT(*) AS n FROM avatar_reports WHERE user_id = ?").bind(id).first()).n;
  if (n >= REPORTS_TO_HIDE) await env.DB.prepare("UPDATE avatars SET hidden = 1 WHERE user_id = ?").bind(id).run();
  return json({ok: true});
}
