/* Shared helper for Credit Sprint's AI endpoints (Cloudflare Pages Functions).
   Set ANTHROPIC_API_KEY in Cloudflare: Pages project → Settings → Variables and secrets (type: Secret).
   Optional: TUTOR_MODEL, SCORE_MODEL, ALLOWED_ORIGIN (e.g. https://creditsprintprep.com). */
export const json = (obj, status = 200) => new Response(JSON.stringify(obj), {status, headers: {"content-type": "application/json", "cache-control": "no-store"}});

export function guard(request, env) {
  if (!env.ANTHROPIC_API_KEY) return json({error: "AI is not configured yet."}, 503);
  const origin = request.headers.get("origin") || "";
  if (env.ALLOWED_ORIGIN && origin && origin !== env.ALLOWED_ORIGIN) return json({error: "Not allowed."}, 403);
  const len = +(request.headers.get("content-length") || 0);
  if (len > 20000) return json({error: "Request too large."}, 413);
  return null;
}

/* Who may spend the API key: a signed-in student with Pro for this class (or any signed-in student while payments are off),
   capped per day. Optional: AI_TUTOR_DAILY (default 60), AI_SCORE_DAILY (default 20). */
export async function gate(request, env, course, kind) {
  if (!env.DB) return json({error: "Sign in to use the AI tutor."}, 401);
  const {currentUser} = await import("./auth.js");
  const {accessFor, paymentsOn, COURSES} = await import("./billing.js");
  const u = await currentUser(env, request);
  if (!u) return json({error: "Sign in to use the AI tutor."}, 401);
  if (!COURSES.includes(course)) return json({error: "Unknown class."}, 400);
  if (paymentsOn(env)) {
    const {access} = await accessFor(env.DB, u.id);
    if (!access.some(a => a.course === "all" || a.course === course)) return json({error: "The AI tutor is part of Pro for this class."}, 402);
  }
  const cap = +(kind === "score" ? env.AI_SCORE_DAILY || 20 : env.AI_TUTOR_DAILY || 60);
  const key = "ai:" + kind + ":" + u.id + ":" + new Date().toISOString().slice(0, 10);
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS stripe_events (id TEXT PRIMARY KEY, at INTEGER NOT NULL)").run();
  await env.DB.prepare("INSERT INTO stripe_events (id, at) VALUES (?, 1) ON CONFLICT(id) DO UPDATE SET at = at + 1").bind(key).run();
  const row = await env.DB.prepare("SELECT at FROM stripe_events WHERE id = ?").bind(key).first();
  if (row && row.at > cap) return json({error: "You've hit today's AI limit. It resets at midnight UTC."}, 429);
  return null;
}

export async function claude(env, {model, system, messages, max_tokens}) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {"x-api-key": env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json"},
    body: JSON.stringify({model, system, messages, max_tokens})
  });
  if (!r.ok) throw new Error("Anthropic API error " + r.status + ": " + (await r.text()).slice(0, 300));
  const j = await r.json();
  return (j.content || []).filter(b => b.type === "text").map(b => b.text).join("").trim();
}
