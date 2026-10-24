/* Friends (signed-in students only).
   GET  /api/friends            → {friends (with this week's XP, you included), incoming, outgoing}
   GET  /api/friends?q=maya     → up to 10 students whose username starts with "maya"
   POST /api/friends {action: "request"|"accept"|"decline"|"cancel"|"remove", username} */
import {json, start, currentUser} from "../../lib/auth.js";
import {ensureFriends, pair, friendIds, weekBoard, MAX_FRIENDS} from "../../lib/friends.js";
const pub = r => ({username: r.username, name: r.display_name || r.username});

async function state(DB, u) {
  await ensureFriends(DB);
  const ids = await friendIds(DB, u.id);
  const board = await weekBoard(DB, ids.concat(u.id));
  const pend = (await DB.prepare("SELECT f.requester, u.username, u.display_name, f.created_at FROM friendships f JOIN users u ON u.id = (CASE WHEN f.a = ? THEN f.b ELSE f.a END) WHERE f.status = 'pending' AND (f.a = ? OR f.b = ?) ORDER BY f.created_at DESC").bind(u.id, u.id, u.id).all()).results || [];
  return {
    me: u.username,
    friends: board.map(r => ({username: r.username, name: r.name, xp: r.xp, me: r.id === u.id})),
    incoming: pend.filter(r => r.requester !== u.id).map(pub),
    outgoing: pend.filter(r => r.requester === u.id).map(pub)
  };
}
export async function onRequestGet({request, env}) {
  const s = await start(request, env, {needBody: false}); if (s.error) return s.error;
  const u = await currentUser(env, request); if (!u) return json({error: "Sign in to use friends."}, 401);
  const q = String(new URL(request.url).searchParams.get("q") || "").trim().toLowerCase().replace(/^@/, "");
  if (q) {
    if (!/^[a-z0-9_]{2,20}$/.test(q)) return json({results: []});
    await ensureFriends(env.DB);
    const rows = (await env.DB.prepare("SELECT id, username, display_name FROM users WHERE username LIKE ? AND id <> ? ORDER BY username LIMIT 10").bind(q + "%", u.id).all()).results || [];
    const rel = {};
    for (const r of rows) { const [a, b] = pair(u.id, r.id); const f = await env.DB.prepare("SELECT status, requester FROM friendships WHERE a = ? AND b = ?").bind(a, b).first();
      rel[r.username] = !f ? "none" : f.status === "accepted" ? "friends" : f.requester === u.id ? "sent" : "incoming"; }
    return json({results: rows.map(r => ({...pub(r), status: rel[r.username]}))});
  }
  return json(await state(env.DB, u));
}
export async function onRequestPost({request, env}) {
  const s = await start(request, env); if (s.error) return s.error;
  const u = await currentUser(env, request); if (!u) return json({error: "Sign in to use friends."}, 401);
  if (!u.username) return json({error: "Choose a username first."}, 409);
  const DB = env.DB, act = String(s.body.action || ""), un = String(s.body.username || "").trim().toLowerCase().replace(/^@/, "");
  await ensureFriends(DB);
  const other = await DB.prepare("SELECT id, username FROM users WHERE username = ?").bind(un).first();
  if (!other) return json({error: "No student with that username."}, 404);
  if (other.id === u.id) return json({error: "That's you!"}, 400);
  const [a, b] = pair(u.id, other.id);
  const f = await DB.prepare("SELECT status, requester FROM friendships WHERE a = ? AND b = ?").bind(a, b).first();
  if (act === "request") {
    if (f && f.status === "accepted") return json({error: "You're already friends."}, 409);
    if (f && f.requester === u.id) return json({error: "Request already sent."}, 409);
    if (f) { await DB.prepare("UPDATE friendships SET status = 'accepted' WHERE a = ? AND b = ?").bind(a, b).run(); }   // they asked you first: accept
    else {
      const n = (await DB.prepare("SELECT COUNT(*) AS n FROM friendships WHERE (a = ? OR b = ?)").bind(u.id, u.id).first()).n;
      if (n >= MAX_FRIENDS + 50) return json({error: `You can have up to ${MAX_FRIENDS} friends and pending requests.`}, 409);
      await DB.prepare("INSERT INTO friendships (a, b, status, requester, created_at) VALUES (?, ?, 'pending', ?, ?)").bind(a, b, u.id, Date.now()).run();
    }
  } else if (act === "accept") {
    if (!f || f.status !== "pending" || f.requester === u.id) return json({error: "No request to accept."}, 409);
    await DB.prepare("UPDATE friendships SET status = 'accepted' WHERE a = ? AND b = ?").bind(a, b).run();
  } else if (["decline", "cancel", "remove"].includes(act)) {
    if (!f) return json({error: "Nothing to remove."}, 409);
    await DB.prepare("DELETE FROM friendships WHERE a = ? AND b = ?").bind(a, b).run();
  } else return json({error: "Unknown action."}, 400);
  return json(await state(DB, u));
}
