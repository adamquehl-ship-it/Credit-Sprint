/* GET /api/showcase?username=maya — a student's profile showcase: the 3 pets and 3 badges they chose to display.
   You can see your own, and your friends'. Nobody else's. The showcase is saved with synced progress
   (progress.data.shared.showcase), and only pets they still own and badges they really earned are shown. */
import {json, start, currentUser} from "../../lib/auth.js";
import {areFriends} from "../../lib/friends.js";
const str = (v, n = 60) => typeof v === "string" && v.length <= n ? v : null;
export async function onRequestGet({request, env}) {
  const s = await start(request, env, {needBody: false}); if (s.error) return s.error;
  const me = await currentUser(env, request); if (!me) return json({error: "Sign in to see profiles."}, 401);
  const un = String(new URL(request.url).searchParams.get("username") || "").trim().toLowerCase().replace(/^@/, "");
  const who = un && un !== me.username ? await env.DB.prepare("SELECT id, username, display_name FROM users WHERE username = ?").bind(un).first() : me;
  if (!who) return json({error: "That student wasn't found."}, 404);
  if (who.id !== me.id && !(await areFriends(env.DB, me.id, who.id))) return json({error: "Only friends can see each other's showcase."}, 403);
  const row = await env.DB.prepare("SELECT data FROM progress WHERE user_id = ?").bind(who.id).first();
  let sh = {}; try { sh = row ? (JSON.parse(row.data).shared || {}) : {}; } catch {}
  const owned = (sh.pets && sh.pets.owned) || {}, earned = sh.badges || {}, sc = sh.showcase || {};
  const pets = (Array.isArray(sc.pets) ? sc.pets : []).map(x => str(x)).filter(id => id && owned[id]).slice(0, 3)
    .map(id => ({id, growth: Math.max(0, +owned[id].growth || 0)}));
  const badges = (Array.isArray(sc.badges) ? sc.badges : []).map(x => str(x)).filter(k => k && earned[k]).slice(0, 3);
  const xp = Math.max(0, +sh.xp || 0);
  return json({user: {username: who.username, name: who.display_name || who.username || "Student", me: who.id === me.id,
    level: Math.floor(Math.sqrt(xp / 50)) + 1, pets: Object.keys(owned).length, badges: Object.keys(earned).length}, pets, badges});
}
