/* Anti-tamper checks for synced progress. The app keeps gems and XP in the browser, so a determined student could
   edit them. Every save is compared with the last saved copy and anything that grows faster than honest play could
   is clamped: gems get a daily budget (covers daily quest, season pass and egg-sale gems), XP gets a per-day ceiling,
   and quest state is trimmed to what exists (3 quests and one bonus per class per day). Honest play never hits these. */
export const GEM_DAY = 1500;        // most gems anyone can gain in one day
export const GEM_FIRST = 6000;      // allowed on the very first save of a new account
export const XP_DAY = Infinity;     // no daily XP ceiling: the leaderboard counts all XP earned
export const QUEST_MAX_DONE = 12;   // 3 quests × 4 classes
let ready = null;
export function ensureGuard(DB) {
  return ready || (ready = DB.prepare("CREATE TABLE IF NOT EXISTS gem_budget (user_id TEXT NOT NULL, day TEXT NOT NULL, gained INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (user_id, day))").run().catch(e => { ready = null; throw e; }));
}
const dayKey = t => new Date(t).toISOString().slice(0, 10);
const num = v => { v = Math.round(+v); return Number.isFinite(v) ? v : 0; };

/* returns {data, clamped}; clamped lists the shared fields that were pulled back, so the app can adopt the saved value */
export async function guardProgress(DB, userId, prevRow, data, now = Date.now()) {
  await ensureGuard(DB);
  const clamped = {}, sh = data.shared || (data.shared = {});
  let prev = null; try { prev = prevRow ? (JSON.parse(prevRow.data).shared || {}) : null; } catch {}
  /* gems */
  if (sh.gems !== undefined) {
    let g = Math.max(0, num(sh.gems)); const p = prev ? Math.max(0, num(prev.gems)) : 0;
    const gain = g - p;
    if (gain > 0) {
      const day = dayKey(now), row = await DB.prepare("SELECT gained FROM gem_budget WHERE user_id = ? AND day = ?").bind(userId, day).first();
      const used = row ? row.gained : 0, room = prev ? Math.max(0, GEM_DAY - used) : GEM_FIRST, allow = Math.min(gain, room);
      if (allow < gain) { g = p + allow; clamped.gems = g; }
      if (allow > 0) await DB.prepare("INSERT INTO gem_budget (user_id, day, gained) VALUES (?, ?, ?) ON CONFLICT(user_id, day) DO UPDATE SET gained = gained + excluded.gained").bind(userId, day, allow).run();
    }
    sh.gems = g;
  }
  /* XP */
  if (sh.xp !== undefined && prev) {
    const x = Math.max(0, num(sh.xp)), p = Math.max(0, num(prev.xp));
    const days = Math.max(1, Math.ceil((now - (prevRow.updated_at || now)) / 864e5));
    const cap = p + XP_DAY * days;
    if (x > cap) { sh.xp = cap; clamped.xp = cap; } else sh.xp = x;
  }
  /* quests: at most 3 per class, only real ones, and no more than QUEST_MAX_DONE finished in total today */
  const today = dayKey(now); let done = 0;
  for (const c of Object.values(data.courses || {})) {
    const dq = c && c.dq; if (!dq || !Array.isArray(dq.list)) continue;
    dq.list = dq.list.slice(0, 3);
    for (const q of dq.list) { if (q.done && dq.d === today) { done++; if (done > QUEST_MAX_DONE) q.done = false; } }
  }
  return {data, clamped};
}
