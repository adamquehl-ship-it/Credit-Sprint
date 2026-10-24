/* Friends: search by username, send/accept requests, a weekly friends leaderboard, and friends-only pet trades.
   Pairs are stored once with a < b. status is 'pending' (sent by requester) or 'accepted'. */
import {weekKey} from "./auth.js";
import {weekXP} from "./league.js";
export const MAX_FRIENDS = 100;
let ready = null;
export function ensureFriends(DB) {
  return ready || (ready = DB.batch([
    DB.prepare("CREATE TABLE IF NOT EXISTS friendships (a TEXT NOT NULL, b TEXT NOT NULL, status TEXT NOT NULL, requester TEXT NOT NULL, created_at INTEGER NOT NULL, PRIMARY KEY (a, b))"),
    DB.prepare("CREATE INDEX IF NOT EXISTS friendships_b ON friendships(b)")
  ]).catch(e => { ready = null; throw e; }));
}
export const pair = (x, y) => x < y ? [x, y] : [y, x];
export async function friendIds(DB, userId) {
  await ensureFriends(DB);
  const rows = (await DB.prepare("SELECT a, b FROM friendships WHERE status = 'accepted' AND (a = ? OR b = ?)").bind(userId, userId).all()).results || [];
  return rows.map(r => r.a === userId ? r.b : r.a);
}
export async function areFriends(DB, x, y) {
  await ensureFriends(DB);
  const [a, b] = pair(x, y);
  return !!(await DB.prepare("SELECT 1 FROM friendships WHERE a = ? AND b = ? AND status = 'accepted'").bind(a, b).first());
}
/* this week's XP for a list of students, from their synced progress */
/* quest streak still alive today or yesterday */
function dqStreak(sh) { const d = sh && sh.dqs; if (!d || !d.last) return 0; const t = new Date(), k = n => new Date(t.getTime() - n * 864e5).toISOString().slice(0, 10); return (d.last === k(0) || d.last === k(1)) ? Math.max(0, +d.n || 0) : 0; }
export async function weekBoard(DB, ids) {
  if (!ids.length) return [];
  const wk = weekKey(), out = [];
  for (let i = 0; i < ids.length; i += 50) {
    const chunk = ids.slice(i, i + 50), qs = chunk.map(() => "?").join(",");
    const rows = (await DB.prepare(`SELECT u.id, u.username, u.display_name, p.data FROM users u LEFT JOIN progress p ON p.user_id = u.id WHERE u.id IN (${qs})`).bind(...chunk).all()).results || [];
    for (const r of rows) { let sh = {}; try { sh = r.data ? (JSON.parse(r.data).shared || {}) : {}; } catch {}
      out.push({id: r.id, username: r.username, name: r.display_name || r.username || "Student", xp: weekXP(sh, wk), streak: 0, dq: dqStreak(sh), level: Math.floor(Math.sqrt((+sh.xp || 0) / 50)) + 1}); }
  }
  return out.sort((x, y) => y.xp - x.xp);
}
export async function deleteFriends(DB, userId) {
  await ensureFriends(DB);
  await DB.prepare("DELETE FROM friendships WHERE a = ? OR b = ?").bind(userId, userId).run();
}
