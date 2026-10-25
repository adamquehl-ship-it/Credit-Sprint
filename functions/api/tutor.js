/* POST /api/tutor — explains a practice question in a new way and answers follow-ups. */
import {json, guard, claude} from "../../lib/ai.js";

const clip = (s, n) => String(s || "").slice(0, n);

export async function onRequestPost({request, env}) {
  const blocked = guard(request, env); if (blocked) return blocked;
  let body; try { body = await request.json(); } catch { return json({error: "Bad JSON."}, 400); }
  const c = body.ctx || {};
  const subj = ({micro:"Microeconomics", bio:"Biology", chem:"Chemistry", mkt:"Marketing", apush:"U.S. History", apworld:"World History", apgov:"U.S. Government"})[body.course] || "Macroeconomics";
  const exam = body.exam === "clep" ? (subj === "U.S. History" ? "CLEP History of the United States" : ["Biology", "Chemistry"].includes(subj) ? `CLEP ${subj}` : `CLEP Principles of ${subj}`) : `AP ${subj}`;
  const system = `You are Credit Sprint's ${subj.toLowerCase()} tutor for a student preparing for the ${exam} exam.
The student just answered this practice question:
Question: ${clip(c.q, 600)}
Choices: ${(c.options || []).map((o, i) => `(${"ABCDE"[i]}) ${clip(o, 200)}`).join(" ")}
Correct answer: ${clip(c.correct, 200)}
Student picked: ${clip(c.picked, 200)}
Built-in explanation: ${clip(c.why, 400)}

Rules:
- Explain in plain language a high school student understands, in 120 words or fewer unless asked for more.
- Use a fresh angle: an everyday analogy, a step-by-step chain (A → B → C), or a quick description of the graph shift.
- If the student was wrong, name the specific misconception behind their choice.
- End with one short check-for-understanding question when it helps.
- Stay on ${subj} and studying. Politely decline anything else.
- Never claim to be affiliated with the College Board.`;
  const messages = (body.messages || []).slice(-8).map(m => ({role: m.role === "assistant" ? "assistant" : "user", content: clip(m.content, 1500)}));
  if (!messages.length || messages[0].role !== "user") return json({error: "No question."}, 400);
  try {
    const reply = await claude(env, {model: env.TUTOR_MODEL || "claude-haiku-5-5", system, messages, max_tokens: 500});
    return json({reply});
  } catch (e) { return json({error: "The tutor is unavailable right now."}, 502); }
}
