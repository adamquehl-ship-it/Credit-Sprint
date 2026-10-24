/* Profile pictures for leaderboards. Small square images (resized in the browser to 128×128) stored in D1.
   The tables are created automatically the first time they're needed, so no extra setup step is required.
   Three reports from different students hide a picture until its owner uploads a new one. */
export const MAX_CHARS = 60000;          // ~44 KB image, far more than a 128×128 JPEG needs
export const REPORTS_TO_HIDE = 3;
let ready = null;
export function ensureAvatars(DB) {
  return ready || (ready = DB.batch([
    DB.prepare("CREATE TABLE IF NOT EXISTS avatars (user_id TEXT PRIMARY KEY, data TEXT NOT NULL, v INTEGER NOT NULL, hidden INTEGER NOT NULL DEFAULT 0)"),
    DB.prepare("CREATE TABLE IF NOT EXISTS avatar_reports (user_id TEXT NOT NULL, reporter_id TEXT NOT NULL, created_at INTEGER NOT NULL, PRIMARY KEY (user_id, reporter_id))")
  ]).catch(e => { ready = null; throw e; }));
}
/* accept only real JPEG data (the browser always converts to JPEG), checked by the file's first bytes */
export function parseImage(dataUrl) {
  const m = /^data:image\/jpeg;base64,([A-Za-z0-9+/=]+)$/.exec(String(dataUrl || ""));
  if (!m || dataUrl.length > MAX_CHARS) return null;
  let bin; try { bin = atob(m[1]); } catch { return null; }
  if (!(bin.charCodeAt(0) === 0xFF && bin.charCodeAt(1) === 0xD8 && bin.charCodeAt(2) === 0xFF)) return null;
  return {type: "image/jpeg", bin};
}
/* remove hidden metadata (EXIF location, camera info, comments) from a JPEG before storing it */
export function stripJpeg(bin) {
  let out = bin.slice(0, 2), i = 2;
  while (i + 4 <= bin.length) {
    if (bin.charCodeAt(i) !== 0xFF) return null;
    const mk = bin.charCodeAt(i + 1);
    if (mk === 0xDA) return out + bin.slice(i);                       // start of image data: keep the rest
    if (mk === 0xD8 || (mk >= 0xD0 && mk <= 0xD7) || mk === 0x01) { out += bin.slice(i, i + 2); i += 2; continue; }
    const len = (bin.charCodeAt(i + 2) << 8) | bin.charCodeAt(i + 3);
    if (len < 2 || i + 2 + len > bin.length) return null;
    const drop = (mk >= 0xE1 && mk <= 0xEF) || mk === 0xFE;          // APP1–APP15 and comments
    if (!drop) out += bin.slice(i, i + 2 + len);
    i += 2 + len;
  }
  return null;
}
export const toDataUrl = bin => "data:image/jpeg;base64," + btoa(bin);

/* automatic screening with Claude's vision model before anyone else can see the picture.
   Fails closed: if the check can't run, the picture isn't accepted. */
const SCREEN_RULES = `You screen profile pictures for Credit Sprint, a study website whose users are students aged 13 and up. Pictures appear next to names on leaderboards that other students see.
Reply BLOCK if the picture contains ANY of: nudity, sexual or suggestive content, underwear or swimwear focus; violence, blood, gore, weapons; drugs, alcohol, vaping or smoking; hate symbols, extremist imagery, or offensive gestures; offensive, sexual or bullying text; personal information such as an address, phone number, email, social media handle, license plate, school ID or other ID card; screenshots of messages or documents; anything frightening or disturbing; or anything else not appropriate for a school setting.
Reply ALLOW for ordinary appropriate pictures, such as a casual photo, a pet, a cartoon or drawing, a landscape, a sports or hobby picture, or a plain logo.
When unsure, reply BLOCK. Reply with exactly one word: ALLOW or BLOCK.`;
export async function screenImage(env, bin) {
  if (!env.ANTHROPIC_API_KEY) return {ok: false, unavailable: true};
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {method: "POST",
      headers: {"x-api-key": env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json"},
      body: JSON.stringify({model: env.MODERATION_MODEL || "claude-haiku-5-5", max_tokens: 5, system: SCREEN_RULES,
        messages: [{role: "user", content: [{type: "image", source: {type: "base64", media_type: "image/jpeg", data: btoa(bin)}}, {type: "text", text: "ALLOW or BLOCK?"}]}]})});
    if (!r.ok) return {ok: false, unavailable: true};
    const j = await r.json(), t = (j.content || []).filter(b => b.type === "text").map(b => b.text).join("").trim().toUpperCase();
    return {ok: t.startsWith("ALLOW") && !t.includes("BLOCK")};
  } catch { return {ok: false, unavailable: true}; }
}
export async function avatarVersion(DB, userId) {
  await ensureAvatars(DB);
  const r = await DB.prepare("SELECT v FROM avatars WHERE user_id = ? AND hidden = 0").bind(userId).first();
  return r ? r.v : null;
}
export async function deleteAvatar(DB, userId) {
  await ensureAvatars(DB);
  await DB.batch([DB.prepare("DELETE FROM avatars WHERE user_id = ?").bind(userId), DB.prepare("DELETE FROM avatar_reports WHERE user_id = ? OR reporter_id = ?").bind(userId, userId)]);
}
