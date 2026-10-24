/* GET /api/avatar?id=…  — a student's profile picture (signed-in students only; hidden pictures return 404).
   PUT /api/avatar {image: "data:image/jpeg;base64,…"} — upload or replace your own picture. Metadata is stripped and the
   picture is screened automatically (lib/avatars.js) before it is saved; it needs ANTHROPIC_API_KEY.
   DELETE /api/avatar — remove your picture. */
import {json, start, currentUser} from "../../lib/auth.js";
import {ensureAvatars, parseImage, stripJpeg, toDataUrl, screenImage, deleteAvatar} from "../../lib/avatars.js";
export async function onRequestGet({request, env}) {
  const s = await start(request, env, {needBody: false}); if (s.error) return s.error;
  const u = await currentUser(env, request); if (!u) return json({error: "Not signed in."}, 401);
  const id = new URL(request.url).searchParams.get("id") || u.id;
  await ensureAvatars(env.DB);
  const row = await env.DB.prepare("SELECT data, hidden FROM avatars WHERE user_id = ?").bind(id).first();
  if (!row || (row.hidden && id !== u.id)) return json({error: "No picture."}, 404);
  const img = parseImage(row.data); if (!img) return json({error: "No picture."}, 404);
  const bytes = Uint8Array.from(img.bin, c => c.charCodeAt(0));
  return new Response(bytes, {headers: {"content-type": img.type, "cache-control": "private, max-age=604800", "x-content-type-options": "nosniff", "content-security-policy": "default-src 'none'"}});
}
export async function onRequestPut({request, env}) {
  const s = await start(request, env); if (s.error) return s.error;
  const u = await currentUser(env, request); if (!u) return json({error: "Not signed in."}, 401);
  const img = parseImage(s.body.image), clean = img && stripJpeg(img.bin);
  if (!clean) return json({error: "That picture couldn't be used. Try a JPEG or PNG photo."}, 400);
  const check = await screenImage(env, clean);
  if (check.unavailable) return json({error: "Picture uploads aren't available right now. Try again later."}, 503);
  if (!check.ok) return json({error: "That picture didn't pass our automatic check. Choose a school-appropriate picture without personal information.", blocked: true}, 422);
  await ensureAvatars(env.DB);
  const v = Date.now(), data = toDataUrl(clean);
  await env.DB.batch([
    env.DB.prepare("INSERT INTO avatars (user_id, data, v, hidden) VALUES (?, ?, ?, 0) ON CONFLICT(user_id) DO UPDATE SET data = excluded.data, v = excluded.v, hidden = 0").bind(u.id, data, v),
    env.DB.prepare("DELETE FROM avatar_reports WHERE user_id = ?").bind(u.id)
  ]);
  return json({avatar: v});
}
export async function onRequestDelete({request, env}) {
  const s = await start(request, env, {needBody: false}); if (s.error) return s.error;
  const u = await currentUser(env, request); if (!u) return json({error: "Not signed in."}, 401);
  await deleteAvatar(env.DB, u.id);
  return json({avatar: null});
}
