/* The pet market (signed-in students only).
   GET  /api/market?since=ID&rarity=epic  → open listings, your wallet, your listings, and your new ledger rows
   POST /api/market {action:"list", pet, rarity, price} | {action:"cancel", id} | {action:"buy", id} */
import {json, start, currentUser} from "../../lib/auth.js";
import {ensureMarket, wallet, petCount, FEE, MIN_PRICE, MAX_PRICE, MAX_OPEN, RARITIES} from "../../lib/market.js";
import {friendIds, areFriends} from "../../lib/friends.js";

async function snapshot(DB, u, since, rarity) {
  const w = await wallet(DB, u.id), fr = new Set(await friendIds(DB, u.id));
  const cols = "id, seller_id, seller_name, pet_id, rarity, price, to_user, created_at";
  const q = rarity === "friends" ? null : rarity && RARITIES.includes(rarity)
    ? DB.prepare(`SELECT ${cols} FROM listings WHERE status = 'open' AND rarity = ? AND (to_user IS NULL OR to_user = ?) ORDER BY created_at DESC LIMIT 60`).bind(rarity, u.id)
    : DB.prepare(`SELECT ${cols} FROM listings WHERE status = 'open' AND (to_user IS NULL OR to_user = ?) ORDER BY created_at DESC LIMIT 80`).bind(u.id);
  let rows = q ? ((await q.all()).results || []) : [];
  if (rarity === "friends" && fr.size) { const ids = [...fr].slice(0, 90); rows = (await DB.prepare(`SELECT ${cols} FROM listings WHERE status = 'open' AND seller_id IN (${ids.map(() => "?").join(",")}) AND (to_user IS NULL OR to_user = ?) ORDER BY created_at DESC LIMIT 80`).bind(...ids, u.id).all()).results || []; }
  /* offers made just for you come first */
  rows.sort((x, y) => (y.to_user === u.id) - (x.to_user === u.id));
  const open = rows.map(r => ({id: r.id, pet: r.pet_id, rarity: r.rarity, price: r.price, seller: r.seller_name || "Student", mine: r.seller_id === u.id, friend: fr.has(r.seller_id), forYou: r.to_user === u.id, at: r.created_at}));
  const mine = ((await DB.prepare("SELECT id, pet_id, rarity, price, status, to_name, created_at, closed_at FROM listings WHERE seller_id = ? ORDER BY created_at DESC LIMIT 30").bind(u.id).all()).results || [])
    .map(r => ({id: r.id, pet: r.pet_id, rarity: r.rarity, price: r.price, status: r.status, to: r.to_name || null, at: r.created_at, closed: r.closed_at}));
  const events = ((await DB.prepare("SELECT id, creds, pet_id, pet_delta, reason FROM ledger WHERE user_id = ? AND id > ? ORDER BY id LIMIT 200").bind(u.id, +since || 0).all()).results || [])
    .map(r => ({id: r.id, creds: r.creds, pet: r.pet_id, petDelta: r.pet_delta, reason: r.reason}));
  return {balance: w.balance, earned: w.earned, traded: w.traded, fee: FEE, listings: open, mine, events};
}

export async function onRequestGet({request, env}) {
  const s = await start(request, env, {needBody: false}); if (s.error) return s.error;
  const u = await currentUser(env, request); if (!u) return json({error: "Sign in to use the market."}, 401);
  const p = new URL(request.url).searchParams;
  return json(await snapshot(env.DB, u, p.get("since"), p.get("rarity")));
}

export async function onRequestPost({request, env}) {
  const s = await start(request, env); if (s.error) return s.error;
  const u = await currentUser(env, request); if (!u) return json({error: "Sign in to use the market."}, 401);
  const DB = env.DB, b = s.body || {}, now = Date.now();
  await ensureMarket(DB);
  if (b.action === "list") {
    const pet = String(b.pet || "").slice(0, 40), rarity = String(b.rarity || ""), price = Math.floor(+b.price);
    if (!/^[a-z0-9_-]+$/.test(pet) || !RARITIES.includes(rarity)) return json({error: "Pick a pet to sell."}, 400);
    /* optional: offer to one friend only (price 0 = a gift) */
    let to = null;
    if (b.to) { to = await DB.prepare("SELECT id, username FROM users WHERE username = ?").bind(String(b.to).toLowerCase()).first();
      if (!to || !(await areFriends(DB, u.id, to.id))) return json({error: "You can only send offers to friends."}, 403); }
    const min = to ? 0 : MIN_PRICE;
    if (!(price >= min && price <= MAX_PRICE)) return json({error: `Set a price from ${min} to ${MAX_PRICE.toLocaleString()} creds.`}, 400);
    const openN = (await DB.prepare("SELECT COUNT(*) AS n FROM listings WHERE seller_id = ? AND status = 'open'").bind(u.id).first()).n;
    if (openN >= MAX_OPEN) return json({error: `You can have up to ${MAX_OPEN} pets listed at once.`}, 409);
    const w = await wallet(DB, u.id);
    if ((await petCount(DB, u.id, pet, w.shared)) < 1) return json({error: "You don't have that pet to sell. If you just hatched it, wait a few seconds and try again."}, 409);
    const r = await DB.prepare("INSERT INTO listings (seller_id, seller_name, pet_id, rarity, price, status, to_user, to_name, created_at) VALUES (?, ?, ?, ?, ?, 'open', ?, ?, ?) RETURNING id").bind(u.id, u.display_name || "Student", pet, rarity, price, to ? to.id : null, to ? to.username : null, now).first();
    await DB.prepare("INSERT INTO ledger (user_id, creds, pet_id, pet_delta, reason, ref, created_at) VALUES (?, 0, ?, -1, 'listed', ?, ?)").bind(u.id, pet, r.id, now).run();
  } else if (b.action === "cancel") {
    const L = await DB.prepare("SELECT * FROM listings WHERE id = ?").bind(+b.id || 0).first();
    if (!L || L.seller_id !== u.id || L.status !== "open") return json({error: "That listing isn't open anymore."}, 409);
    await DB.prepare("UPDATE listings SET status = 'cancelled', closed_at = ? WHERE id = ? AND status = 'open'").bind(now, L.id).run();
    const chk = await DB.prepare("SELECT status FROM listings WHERE id = ?").bind(L.id).first();
    if (chk.status !== "cancelled") return json({error: "That pet just sold."}, 409);
    await DB.prepare("INSERT INTO ledger (user_id, creds, pet_id, pet_delta, reason, ref, created_at) VALUES (?, 0, ?, 1, 'unlisted', ?, ?)").bind(u.id, L.pet_id, L.id, now).run();
  } else if (b.action === "buy") {
    const L = await DB.prepare("SELECT * FROM listings WHERE id = ?").bind(+b.id || 0).first();
    if (!L || L.status !== "open") return json({error: "Someone else just bought that pet."}, 409);
    if (L.seller_id === u.id) return json({error: "That's your own listing."}, 400);
    if (L.to_user && L.to_user !== u.id) return json({error: "That offer is for someone else."}, 403);
    const w = await wallet(DB, u.id);
    if (w.balance < L.price) return json({error: `You need ${(L.price - w.balance).toLocaleString()} more creds.`}, 402);
    /* claim the listing first; only one buyer can flip it from open to sold */
    await DB.prepare("UPDATE listings SET status = 'sold', buyer_id = ?, closed_at = ? WHERE id = ? AND status = 'open'").bind(u.id, now, L.id).run();
    const chk = await DB.prepare("SELECT status, buyer_id FROM listings WHERE id = ?").bind(L.id).first();
    if (chk.status !== "sold" || chk.buyer_id !== u.id) return json({error: "Someone else just bought that pet."}, 409);
    const payout = Math.floor(L.price * (1 - FEE));
    await DB.batch([
      DB.prepare("INSERT INTO ledger (user_id, creds, pet_id, pet_delta, reason, ref, created_at) VALUES (?, ?, ?, 1, 'bought', ?, ?)").bind(u.id, -L.price, L.pet_id, L.id, now),
      DB.prepare("INSERT INTO ledger (user_id, creds, pet_id, pet_delta, reason, ref, created_at) VALUES (?, ?, ?, 0, 'sold', ?, ?)").bind(L.seller_id, payout, L.pet_id, L.id, now)
    ]);
  } else return json({error: "Unknown action."}, 400);
  const p = new URL(request.url).searchParams;
  return json(await snapshot(DB, u, b.since ?? p.get("since"), b.rarity_filter));
}
