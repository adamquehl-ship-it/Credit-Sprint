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
