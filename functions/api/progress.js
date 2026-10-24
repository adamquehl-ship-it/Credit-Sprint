/* GET /api/progress — the saved progress for this account.  PUT /api/progress {data, updatedAt} — save it (newest wins).
   data = {shared, courses:{macro, micro}} exactly as the app keeps it in the browser. Saving also updates this week's league XP. */
import {json, start, currentUser} from "../../lib/auth.js";
import {ensureMember, weekXP} from "../../lib/league.js";
import {weekKey} from "../../lib/auth.js";
export async function onRequestGet({request, env}) {
  const s = await start(request, env, {needBody: false}); if (s.error) return s.error;
  const u = await currentUser(env, request); if (!u) return json({error: "Not signed in."}, 401);
  const row = await env.DB.prepare("SELECT data, updated_at FROM progress WHERE user_id = ?").bind(u.id).first();
  return json(row ? {data: JSON.parse(row.data), updatedAt: row.updated_at} : {data: null, updatedAt: 0});
}
export async function onRequestPut({request, env}) {
  const s = await start(request, env); if (s.error) return s.error;
  const u = await currentUser(env, request); if (!u) return json({error: "Not signed in."}, 401);
  const data = s.body.data, at = Math.min(Date.now(), +s.body.updatedAt || Date.now());
  if (!data || typeof data !== "object" || !data.shared) return json({error: "Nothing to save."}, 400);
  const row = await env.DB.prepare("SELECT updated_at FROM progress WHERE user_id = ?").bind(u.id).first();
  if (row && row.updated_at > at && !s.body.force) return json({stale: true, updatedAt: row.updated_at}, 409);
  await env.DB.prepare("INSERT INTO progress (user_id, data, updated_at) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at")
    .bind(u.id, JSON.stringify(data), at).run();
  await ensureMember(env.DB, u.id, weekXP(data.shared, weekKey()));
  return json({ok: true, updatedAt: at});
}
