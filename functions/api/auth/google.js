/* POST /api/auth/google {credential} — sign in with the ID token from Google's sign-in button. */
import {json, start, newId, createSession, publicUser, cleanName} from "../../../lib/auth.js";
export async function onRequestPost({request, env}) {
  const s = await start(request, env); if (s.error) return s.error;
  if (!env.GOOGLE_CLIENT_ID) return json({error: "Google sign-in isn't set up yet."}, 503);
  const r = await fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + encodeURIComponent(String(s.body.credential || "")));
  if (!r.ok) return json({error: "Google sign-in failed. Try again."}, 401);
  const t = await r.json();
  if (t.aud !== env.GOOGLE_CLIENT_ID || !["accounts.google.com", "https://accounts.google.com"].includes(t.iss) || +t.exp * 1000 < Date.now()) return json({error: "Google sign-in failed. Try again."}, 401);
  const email = t.email_verified === "true" || t.email_verified === true ? String(t.email || "").toLowerCase() : null;
  let u = await env.DB.prepare("SELECT * FROM users WHERE google_sub = ?").bind(t.sub).first();
  if (!u && email) { u = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first(); if (u) await env.DB.prepare("UPDATE users SET google_sub = ? WHERE id = ?").bind(t.sub, u.id).run(); }
  let created = false;
  if (!u) {
    const id = newId(), name = cleanName([t.given_name, t.family_name].filter(Boolean).join(" "));
    await env.DB.prepare("INSERT INTO users (id, email, google_sub, display_name, created_at) VALUES (?, ?, ?, ?, ?)").bind(id, email, t.sub, name || null, Date.now()).run();
    u = await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(id).first(); created = true;
  }
  return json({user: publicUser(u), created}, 200, {"set-cookie": await createSession(env, request, u.id)});
}
