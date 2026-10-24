/* POST /api/score — scores a free-response answer against its rubric and returns per-point feedback. */
import {json, guard, claude} from "../../lib/ai.js";

const clip = (s, n) => String(s || "").slice(0, n);

export async function onRequestPost({request, env}) {
  const blocked = guard(request, env); if (blocked) return blocked;
  let b; try { b = await request.json(); } catch { return json({error: "Bad JSON."}, 400); }
  const rubric = (b.rubric || []).slice(0, 10).map(r => clip(r, 300));
  if (!rubric.length || !b.answer) return json({error: "Missing rubric or answer."}, 400);
  const subj = b.course === "micro" ? "Microeconomics" : "Macroeconomics";
  const system = `You are an experienced AP ${subj} free-response reader. Score the student's answer strictly against the rubric, one point per rubric line, the way official readers do: award a point only if the answer clearly states the required idea; ignore spelling; do not award points for vague or contradictory answers. If a rubric point requires a graph, award it only if the student's written description clearly states the required labels and the shift.
Return ONLY valid JSON, no prose, in exactly this shape:
{"points":[{"earned":true|false,"note":"one short sentence telling the student why"}],"summary":"two sentences: what they did well and the single most important fix"}
The points array must have exactly ${rubric.length} items, in rubric order.`;
  const user = `Prompt: ${clip(b.prompt, 1200)}
Parts:
${(b.parts || []).slice(0, 10).map((p, i) => `(${"abcdefghij"[i]}) ${clip(p, 400)}`).join("\n")}
Rubric:
${rubric.map((r, i) => `${i + 1}. ${r}`).join("\n")}
Student answer:
${clip(b.answer, 6000)}`;
  try {
    const text = await claude(env, {model: env.SCORE_MODEL || "claude-sonnet-5-5", system, messages: [{role: "user", content: user}], max_tokens: 900});
    const m = text.match(/\{[\s\S]*\}/); if (!m) throw new Error("no json");
    const out = JSON.parse(m[0]);
    if (!Array.isArray(out.points)) throw new Error("bad shape");
    out.points = rubric.map((_, i) => ({earned: !!(out.points[i] && out.points[i].earned), note: clip(out.points[i] && out.points[i].note, 300)}));
    out.summary = clip(out.summary, 600);
    return json(out);
  } catch (e) { return json({error: "Scoring is unavailable right now."}, 502); }
}
