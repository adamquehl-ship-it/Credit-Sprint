/* Credit Sprint extras: shareable game results, "why you missed it" tags, free FRQ quick-check, and keyboard/screen-reader
   support for pop-up windows. Loaded after dailyq.js. */
(function(){
"use strict";
const CS = window.CS, $ = CS.$, esc = CS.esc, S = () => CS.S();
const COURSE_NAME = {macro:"Macroeconomics", micro:"Microeconomics", bio:"Biology", chem:"Chemistry", mkt:"Marketing", apush:"U.S. History", apworld:"World History", apgov:"U.S. Government", appsych:"Psychology", apstat:"Statistics", aplit:"English Literature", aplang:"English Language", calcab:"Calculus AB", calcbc:"Calculus BC", aphug:"Human Geography"};

/* ---------- share a result (picture + text) ---------- */
function card(title, big, sub){
  const c = document.createElement("canvas"); c.width = c.height = 1080; const g = c.getContext("2d");
  const grad = g.createLinearGradient(0, 0, 1080, 1080); grad.addColorStop(0, "#4F46E5"); grad.addColorStop(1, "#7C3AED");
  g.fillStyle = grad; g.fillRect(0, 0, 1080, 1080);
  g.fillStyle = "rgba(255,255,255,.12)"; g.beginPath(); g.arc(900, 180, 260, 0, 7); g.fill(); g.beginPath(); g.arc(150, 980, 200, 0, 7); g.fill();
  g.fillStyle = "#fff"; g.textAlign = "center"; const f = "Manrope, system-ui, -apple-system, Segoe UI, sans-serif";
  g.font = `800 52px ${f}`; g.fillText("CREDIT SPRINT", 540, 150);
  g.font = `700 64px ${f}`; g.fillText(title, 540, 400);
  g.font = `800 230px ${f}`; g.fillText(big, 540, 660);
  g.font = `600 48px ${f}`; g.fillText(sub, 540, 780);
  g.font = `700 44px ${f}`; g.fillText("creditsprintprep.com", 540, 960);
  return c;
}
CS.shareResult = async ({game, points, course}) => {
  const cn = COURSE_NAME[course || CS.COURSE] || "";
  const pts = Math.round(points), text = `I earned ${pts} XP playing ${game} on Credit Sprint (${cn}). Can you beat it? https://creditsprintprep.com`;
  const msg = document.getElementById("sh-msg"), say = t => { if (msg) msg.textContent = t; };
  try {
    const blob = await new Promise(r => card(game, String(pts), `${cn} · XP earned`).toBlob(r, "image/png"));
    const file = blob && new File([blob], "credit-sprint-result.png", {type:"image/png"});
    if (file && navigator.canShare && navigator.canShare({files:[file]})) { await navigator.share({files:[file], text}); return say("Shared."); }
    if (navigator.share) { await navigator.share({text}); return say("Shared."); }
    try { await navigator.clipboard.writeText(text); say("Copied. Paste it in your group chat."); } catch(e) { say(text); }
    if (blob) { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "credit-sprint-result.png"; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }
  } catch(e) { if (e && e.name === "AbortError") return; try { await navigator.clipboard.writeText(text); say("Copied."); } catch(e2) { say(text); } }
};
CS.shareBar = (area, info) => {
  if (!area || area.querySelector(".share-bar")) return;
  const d = document.createElement("div"); d.className = "share-bar";
  d.innerHTML = `<button class="btn ghost sm" type="button">Share your result</button><span class="small muted" id="sh-msg" role="status" aria-live="polite"></span>`;
  d.querySelector("button").onclick = () => CS.shareResult(info);
  area.appendChild(d);
};

/* ---------- "why did you miss it?" ---------- */
const WHY = [["know", "I didn't know it"], ["read", "I misread it"], ["calc", "Math slip"], ["mix", "Mixed up two ideas"], ["guess", "I guessed"]];
const TIPS = {know:"Most of your misses are content gaps. Open the unit guide before the next quiz, then use flashcards.", read:"You often misread the question. Underline the key word (NOT, EXCEPT, increase or decrease) before you look at the choices.",
  calc:"You lose points on arithmetic. Write each step down and try the calculation drills.", mix:"You mix up similar ideas. Make a two-column comparison of the pair you keep swapping.", guess:"Many answers are guesses. Skip the guess, read the explanation, and re-answer from your mistakes notebook."};
CS.whyChips = (q, wrong) => !wrong ? "" :
  `<div class="why-chips" role="group" aria-label="Why did you miss it?" data-q="${esc(q.id)}" data-u="${q.u}"><span class="small muted">Why did you miss it?</span>${WHY.map(([k, n]) => `<button type="button" class="chip" data-w="${k}" aria-pressed="false">${n}</button>`).join("")}</div>`;
document.addEventListener("click", e => {
  const b = e.target.closest && e.target.closest(".why-chips [data-w]"); if (!b) return;
  const box = b.closest(".why-chips"), id = box.dataset.q, u = box.dataset.u, s = S();
  const w = s.why || (s.why = {by:{}, n:{}, q:{}}); const old = w.q[id];
  if (old) { w.n[old] = Math.max(0, (w.n[old] || 0) - 1); if (w.by[u]) w.by[u][old] = Math.max(0, (w.by[u][old] || 0) - 1); }
  w.q[id] = b.dataset.w; w.n[b.dataset.w] = (w.n[b.dataset.w] || 0) + 1; (w.by[u] = w.by[u] || {})[b.dataset.w] = ((w.by[u] || {})[b.dataset.w] || 0) + 1;
  box.querySelectorAll("[data-w]").forEach(x => x.setAttribute("aria-pressed", String(x === b))); CS.save();
});
CS.whyCard = () => {
  const w = S().why; if (!w) return ""; const tot = WHY.reduce((a, [k]) => a + (w.n[k] || 0), 0); if (tot < 4) return "";
  const top = WHY.slice().sort((a, b) => (w.n[b[0]] || 0) - (w.n[a[0]] || 0))[0];
  return `<div class="stack" id="why-card"><div class="spread"><h2>Why you miss questions</h2><span class="muted small">from ${tot} tagged misses</span></div>
    <div class="why-bars">${WHY.map(([k, n]) => { const c = w.n[k] || 0; return `<div class="why-row"><span class="small">${n}</span><span class="dq-bar" aria-hidden="true"><i style="width:${Math.round(c / tot * 100)}%"></i></span><b class="small">${c}</b></div>`; }).join("")}</div>
    <p class="small"><b>Your biggest pattern: ${top[1].toLowerCase()}.</b> ${TIPS[top[0]]}</p></div>`;
};

/* ---------- free FRQ quick check (no AI): matches each rubric point against what you wrote ---------- */
const STOP = new Set("the a an and or of to in on is are be as at by for from with that this it its into than then so if not no will would can may more less because which when their there those these have has had also both each such only just does what your you they them while where over under".split(" "));
CS.autoCheck = (f, text) => {
  const t = String(text || "").toLowerCase().replace(/(\d),(\d)/g, "$1$2"), parts = {}, idx = []; let m; const re = /\(([a-h])\)/g;
  while ((m = re.exec(t))) idx.push([m[1], m.index]);
  idx.forEach(([k, i], j) => { parts[k] = t.slice(i, (idx[j + 1] || [0, t.length])[1]); });
  return f.rubric.map(r => {
    const lab = (r.match(/^\(([a-h])\)/) || [])[1], body = r.replace(/^\([a-h]\)\s*/, "").toLowerCase().replace(/(\d),(\d)/g, "$1$2");
    if (/^graph|^draw|^label/.test(body)) return {auto: false};
    const hay = (lab && parts[lab]) || t, nums = body.match(/\d+(\.\d+)?/g) || [];
    const words = [...new Set((body.replace(/\(.*?\)/g, " ").match(/[a-z]{4,}/g) || []).filter(x => !STOP.has(x)).map(x => x.slice(0, 5)))];
    const hit = words.filter(x => hay.includes(x)).length, frac = words.length ? hit / words.length : 1;
    const numOK = !nums.length || new RegExp("(^|[^\\d.])" + nums[0].replace(".", "\\.") + "(?![\\d])").test(hay);
    return {auto: true, earned: numOK && frac >= (nums.length ? 0.25 : 0.5)};
  });
};

/* ---------- pop-up windows: focus moves in, Tab stays inside, Escape closes, focus returns ---------- */
const FOC = 'button:not([disabled]),a[href],input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';
let stack = [];
new MutationObserver(list => { for (const rec of list) {
  rec.addedNodes.forEach(n => { if (n.nodeType === 1 && n.classList && n.classList.contains("modal-wrap")) {
    const prev = document.activeElement; stack.push({n, prev});
    const m = n.querySelector(".modal"); if (m && !m.hasAttribute("role")) { m.setAttribute("role", "dialog"); m.setAttribute("aria-modal", "true"); }
    setTimeout(() => { if (!n.contains(document.activeElement)) { const f = n.querySelector(FOC); if (f) f.focus({preventScroll:true}); else if (m) { m.tabIndex = -1; m.focus({preventScroll:true}); } } }, 30); } });
  rec.removedNodes.forEach(n => { const i = stack.findIndex(x => x.n === n); if (i >= 0) { const [x] = stack.splice(i, 1); if (x.prev && x.prev.isConnected) try { x.prev.focus({preventScroll:true}); } catch(e) {} } });
} }).observe(document.body, {childList:true});
document.addEventListener("keydown", e => {
  const top = stack[stack.length - 1]; if (!top || !top.n.isConnected) return;
  if (e.key === "Escape") { const x = top.n.querySelector("[data-x],#mg-ok,.btn.ghost[data-close]"); if (x) x.click(); else top.n.remove(); return; }
  if (e.key !== "Tab") return;
  const f = [...top.n.querySelectorAll(FOC)].filter(x => x.offsetParent !== null); if (!f.length) return;
  const a = document.activeElement, first = f[0], last = f[f.length - 1];
  if (e.shiftKey && (a === first || !top.n.contains(a))) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && (a === last || !top.n.contains(a))) { e.preventDefault(); first.focus(); }
});
})();
