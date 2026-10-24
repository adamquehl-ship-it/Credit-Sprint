/* Creds and the pet market. Creds you EARN are counted from your synced progress (capped per day, like league XP).
   Creds you SPEND or RECEIVE in trades, and pets that move between students, live in a server-side ledger that only
   this code writes. Your app applies new ledger rows (pets in or out) to your collection the next time it loads the market. */
export const DAY_CAP = 700;            // most creds anyone can earn in one day (600 + 10% Pro boost, with headroom)
export const FEE = 0.10;               // the market keeps 10% of each sale, so creds don't pile up forever
export const MIN_PRICE = 5, MAX_PRICE = 50000, MAX_OPEN = 10;
export const RARITIES = ["common", "uncommon", "rare", "epic", "legendary", "mythical", "supreme"];

let ready = null;
export function ensureMarket(DB) {
  return ready || (ready = DB.batch([
    DB.prepare("CREATE TABLE IF NOT EXISTS listings (id INTEGER PRIMARY KEY AUTOINCREMENT, seller_id TEXT NOT NULL, seller_name TEXT, pet_id TEXT NOT NULL, rarity TEXT NOT NULL, price INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'open', buyer_id TEXT, to_user TEXT, to_name TEXT, created_at INTEGER NOT NULL, closed_at INTEGER)"),
    DB.prepare("CREATE INDEX IF NOT EXISTS listings_open ON listings(status, created_at)"),
    DB.prepare("CREATE TABLE IF NOT EXISTS ledger (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT NOT NULL, creds INTEGER NOT NULL DEFAULT 0, pet_id TEXT, pet_delta INTEGER NOT NULL DEFAULT 0, reason TEXT NOT NULL, ref INTEGER, created_at INTEGER NOT NULL)"),
    DB.prepare("CREATE INDEX IF NOT EXISTS ledger_user ON ledger(user_id, id)")
  ]).catch(e => { ready = null; throw e; }));
}
async function blob(DB, userId) {
  const r = await DB.prepare("SELECT data FROM progress WHERE user_id = ?").bind(userId).first();
  try { return r ? JSON.parse(r.data) : {}; } catch { return {}; }
}
/* creds earned by studying, from the synced progress, never more than DAY_CAP on any day and never in the future */
export function earnedFrom(shared) {
  const days = (shared && shared.creds && shared.creds.days) || {}, today = new Date(Date.now() + 864e5).toISOString().slice(0, 10);
  let n = 0; for (const [d, v] of Object.entries(days)) if (/^\d{4}-\d\d-\d\d$/.test(d) && d <= today) n += Math.min(DAY_CAP, Math.max(0, Math.floor(+v || 0)));
  return n;
}
export async function wallet(DB, userId) {
  await ensureMarket(DB);
  const b = await blob(DB, userId), shared = b.shared || {};
  const led = await DB.prepare("SELECT COALESCE(SUM(creds), 0) AS c FROM ledger WHERE user_id = ?").bind(userId).first();
  const earned = earnedFrom(shared);
  return {earned, traded: led.c, balance: earned + led.c, shared};
}
/* how many of a pet the student has right now: synced copies plus ledger rows their app hasn't applied yet */
export async function petCount(DB, userId, petId, shared) {
  const seen = +(shared && shared.creds && shared.creds.ledgerSeen) || 0;
  const o = shared && shared.pets && shared.pets.owned && shared.pets.owned[petId];
  const synced = o ? Math.max(1, +o.copies || 1) : 0;
  const pend = await DB.prepare("SELECT COALESCE(SUM(pet_delta), 0) AS d FROM ledger WHERE user_id = ? AND pet_id = ? AND id > ?").bind(userId, petId, seen).first();
  return synced + pend.d;
}
export async function deleteMarket(DB, userId) {
  await ensureMarket(DB);
  await DB.batch([DB.prepare("UPDATE listings SET status = 'cancelled', closed_at = ? WHERE seller_id = ? AND status = 'open'").bind(Date.now(), userId),
    DB.prepare("DELETE FROM ledger WHERE user_id = ?").bind(userId)]);
}
