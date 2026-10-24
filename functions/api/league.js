/* GET /api/league — this week's league group for the signed-in student. */
import {json, start, currentUser, weekKey} from "../../lib/auth.js";
import {ensureMember, standings, weekXP} from "../../lib/league.js";
export async function onRequestGet({request, env}) {
  const s = await start(request, env, {needBody: false}); if (s.error) return s.error;
  const u = await currentUser(env, request); if (!u) return json({error: "Not signed in."}, 401);
  const row = await env.DB.prepare("SELECT data FROM progress WHERE user_id = ?").bind(u.id).first();
  const xp = row ? weekXP(JSON.parse(row.data).shared, weekKey()) : 0;
  const seat = await ensureMember(env.DB, u.id, xp);
  return json(await standings(env.DB, u.id, seat));
}
