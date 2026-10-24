/* GET /api/me — the signed-in student, or 401.  POST /api/me {name?, username?} — set the leaderboard name, or choose a username (once).  DELETE /api/me — delete the account and its data. */
import {json, start, currentUser, publicUser, cleanName, clearCookie} from "../../lib/auth.js";
import {avatarVersion, deleteAvatar} from "../../lib/avatars.js";
import {accessFor, deleteBilling} from "../../lib/billing.js";
import {deleteMarket} from "../../lib/market.js";
import {deleteFriends} from "../../lib/friends.js";
const validUsername = un => /^[a-z0-9_]{3,20}$/.test(un);
const RESERVED = ["admin", "creditsprint", "support", "moderator", "official"];
export async function onRequestGet({request, env}) {
  const s = await start(request, env, {needBody: false}); if (s.error) return s.error;
  const u = await currentUser(env, request); if (!u) return json({error: "Not signed in."}, 401);
  return json({user: {...publicUser(u), avatar: await avatarVersion(env.DB, u.id), ...(await accessFor(env.DB, u.id))}});
}
export async function onRequestPost({request, env}) {
  const s = await start(request, env); if (s.error) return s.error;
  let u = await currentUser(env, request); if (!u) return json({error: "Not signed in."}, 401);
  const b = s.body || {};
  if (b.username != null) {
    if (u.username) return json({error: "Your username is already set."}, 409);
    const un = String(b.username || "").trim().toLowerCase();
    if (!validUsername(un)) return json({error: "Usernames are 3–20 letters, numbers or underscores."}, 400);
    if (RESERVED.some(r => un.includes(r))) return json({error: "That username isn't allowed. Try another one."}, 400);
    if (await env.DB.prepare("SELECT 1 FROM users WHERE username = ?").bind(un).first()) return json({error: "That username is taken. Try another one."}, 409);
    await env.DB.prepare("UPDATE users SET username = ? WHERE id = ? AND username IS NULL").bind(un, u.id).run();
    u = {...u, username: un};
  }
  if (b.name != null) {
    const name = cleanName(b.name);
    if (name.length < 2) return json({error: "Enter your first name (and last initial if you like)."}, 400);
    await env.DB.prepare("UPDATE users SET display_name = ? WHERE id = ?").bind(name, u.id).run();
    u = {...u, display_name: name};
  }
  return json({user: {...publicUser(u), avatar: await avatarVersion(env.DB, u.id), ...(await accessFor(env.DB, u.id))}});
}
export async function onRequestDelete({request, env}) {
  const s = await start(request, env, {needBody: false}); if (s.error) return s.error;
  const u = await currentUser(env, request); if (!u) return json({error: "Not signed in."}, 401);
  await deleteAvatar(env.DB, u.id);
  await deleteBilling(env.DB, u.id);
  await deleteMarket(env.DB, u.id);
  await deleteFriends(env.DB, u.id);
  await env.DB.batch(["sessions", "progress", "league_members", "league_tiers"].map(t => env.DB.prepare(`DELETE FROM ${t} WHERE user_id = ?`).bind(u.id))
    .concat(u.email ? [env.DB.prepare("DELETE FROM email_codes WHERE email = ?").bind(u.email)] : [], [env.DB.prepare("DELETE FROM users WHERE id = ?").bind(u.id)]));
  return json({ok: true}, 200, {"set-cookie": clearCookie(request)});
}
