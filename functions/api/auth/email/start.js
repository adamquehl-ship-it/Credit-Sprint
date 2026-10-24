/* POST /api/auth/email/start {email} — email a 6-digit sign-in code (valid 10 minutes). */
import {json, start, sha256, validEmail} from "../../../../lib/auth.js";
export async function onRequestPost({request, env}) {
  const s = await start(request, env); if (s.error) return s.error;
  if (!env.RESEND_API_KEY) return json({error: "Email sign-in isn't set up yet."}, 503);
  const email = String(s.body.email || "").trim().toLowerCase();
  if (!validEmail(email)) return json({error: "Enter a valid email address."}, 400);
  const prev = await env.DB.prepare("SELECT sent_at FROM email_codes WHERE email = ?").bind(email).first();
  if (prev && Date.now() - prev.sent_at < 60e3) return json({error: "We just sent a code. Wait a minute before asking for another."}, 429);
  const code = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1e6).padStart(6, "0");
  await env.DB.prepare("INSERT INTO email_codes (email, code_hash, expires_at, attempts, sent_at) VALUES (?, ?, ?, 0, ?) ON CONFLICT(email) DO UPDATE SET code_hash = excluded.code_hash, expires_at = excluded.expires_at, attempts = 0, sent_at = excluded.sent_at")
    .bind(email, await sha256(email + ":" + code), Date.now() + 10 * 60e3, Date.now()).run();
  const r = await fetch("https://api.resend.com/emails", {method: "POST", headers: {"authorization": "Bearer " + env.RESEND_API_KEY, "content-type": "application/json"},
    body: JSON.stringify({from: env.EMAIL_FROM || "Credit Sprint <onboarding@resend.dev>", to: [email], subject: `${code} is your Credit Sprint code`,
      text: `Your Credit Sprint sign-in code is ${code}. It expires in 10 minutes. If you didn't ask for it, you can ignore this email.`,
      html: `<div style="font-family:Arial,sans-serif;font-size:16px;color:#111827"><p>Your Credit Sprint sign-in code is</p><p style="font-size:32px;font-weight:800;letter-spacing:6px">${code}</p><p>It expires in 10 minutes. If you didn't ask for it, you can ignore this email.</p></div>`})});
  if (!r.ok) return json({error: "We couldn't send the email. Try again in a minute."}, 502);
  return json({ok: true});
}
