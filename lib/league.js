/* Weekly leagues: groups of up to 30 students in the same tier, ranked by XP earned that week (Monday–Sunday, UTC).
   At the start of a new week, last week's top 3 move up a tier and the bottom 2 move down (groups of 10+ only). */
import {weekKey, addDaysKey} from "./auth.js";
import {ensureAvatars} from "./avatars.js";
export const TIERS = ["Bronze", "Silver", "Emerald", "Sapphire", "Diamond"];
export const GROUP_SIZE = 30, PROMOTE = 3, DEMOTE = 2;
const DAY_CAP = 3000; // ignore impossible daily XP totals

/* XP earned this week, from the student's saved day-by-day XP */
export function weekXP(shared, week) {
  const days = (shared && shared.days) || {}; let x = 0;
  for (let i = 0; i < 7; i++) x += Math.min(DAY_CAP, Math.max(0, +days[addDaysKey(week, i)] || 0));
  return Math.round(x);
}

async function rankOf(DB, week, userId) {
  const me = await DB.prepare("SELECT tier, group_id, xp FROM league_members WHERE week = ? AND user_id = ?").bind(week, userId).first();
  if (!me) return null;
  const n = (await DB.prepare("SELECT COUNT(*) AS n FROM league_members WHERE week = ? AND tier = ? AND group_id = ?").bind(week, me.tier, me.group_id).first()).n;
  const above = (await DB.prepare("SELECT COUNT(*) AS n FROM league_members WHERE week = ? AND tier = ? AND group_id = ? AND (xp > ? OR (xp = ? AND updated_at < (SELECT updated_at FROM league_members WHERE week = ? AND user_id = ?)))")
    .bind(week, me.tier, me.group_id, me.xp, me.xp, week, userId).first()).n;
  return {rank: above + 1, n, tier: me.tier, xp: me.xp};
}

/* make sure the student has a seat this week; apply last week's promotion or demotion first */
export async function ensureMember(DB, userId, xp) {
  const week = weekKey(), now = Date.now();
  const have = await DB.prepare("SELECT tier, group_id FROM league_members WHERE week = ? AND user_id = ?").bind(week, userId).first();
  if (have) {
    if (xp != null) await DB.prepare("UPDATE league_members SET xp = ?, updated_at = CASE WHEN xp <> ? THEN ? ELSE updated_at END WHERE week = ? AND user_id = ?").bind(xp, xp, now, week, userId).run();
    return {week, tier: have.tier, group_id: have.group_id};
  }
  let t = await DB.prepare("SELECT tier, last_week FROM league_tiers WHERE user_id = ?").bind(userId).first();
  let tier = t ? t.tier : 0;
  if (t && t.last_week && t.last_week !== week) {
    const r = await rankOf(DB, t.last_week, userId);
    if (r && r.xp > 0) {
      if (r.rank <= PROMOTE) tier = Math.min(TIERS.length - 1, tier + 1);
      else if (r.n >= 10 && r.rank > r.n - DEMOTE) tier = Math.max(0, tier - 1);
    }
  }
  const g = await DB.prepare("SELECT group_id, COUNT(*) AS n FROM league_members WHERE week = ? AND tier = ? GROUP BY group_id HAVING n < ? ORDER BY group_id LIMIT 1").bind(week, tier, GROUP_SIZE).first();
  const group_id = g ? g.group_id : ((await DB.prepare("SELECT MAX(group_id) AS m FROM league_members WHERE week = ? AND tier = ?").bind(week, tier).first()).m ?? -1) + 1;
  await DB.batch([
    DB.prepare("INSERT OR IGNORE INTO league_members (week, user_id, tier, group_id, xp, updated_at) VALUES (?, ?, ?, ?, ?, ?)").bind(week, userId, tier, group_id, xp || 0, now),
    DB.prepare("INSERT INTO league_tiers (user_id, tier, last_week) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET tier = excluded.tier, last_week = excluded.last_week").bind(userId, tier, week)
  ]);
  return {week, tier, group_id};
}

export async function standings(DB, userId, seat) {
  await ensureAvatars(DB);
  const rows = (await DB.prepare("SELECT m.user_id, m.xp, m.updated_at, u.display_name, a.v AS av FROM league_members m JOIN users u ON u.id = m.user_id LEFT JOIN avatars a ON a.user_id = m.user_id AND a.hidden = 0 WHERE m.week = ? AND m.tier = ? AND m.group_id = ? ORDER BY m.xp DESC, m.updated_at ASC")
    .bind(seat.week, seat.tier, seat.group_id).all()).results || [];
  return {
    tier: seat.tier, league: TIERS[seat.tier], week: seat.week, endsAt: addDaysKey(seat.week, 7),
    promote: seat.tier < TIERS.length - 1 ? PROMOTE : 0, demote: seat.tier > 0 && rows.length >= 10 ? DEMOTE : 0,
    members: rows.map(r => ({id: r.user_id, name: r.display_name || "Student", xp: r.xp, av: r.av || null, me: r.user_id === userId}))
  };
}
