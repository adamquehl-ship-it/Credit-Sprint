/* Credit Sprint extras: AI tutor, AI FRQ scoring, animated explainer player, certificate, calendar reminders. */
(function(){
"use strict";
const CS = window.CS, $ = CS.$, $$ = CS.$$, esc = CS.esc;
const S = () => CS.S();
const OFFLINE = "The AI tutor runs on the live site (creditsprintprep.com) once it's connected. In this preview, use the explanations above.";

/* ---------- AI tutor (Cloudflare Pages Function at /api/tutor) ---------- */
CS.tutor = (box, ctx) => {
  const msgs = [];
  box.innerHTML = `<div class="tutor"><div class="spread"><span class="eyebrow">${CS.icon("spark")} AI tutor</span><span class="faint tiny">Answers can be wrong. Check them against your notes.</span></div>
    <div class="t-log" aria-live="polite"></div>
    <form class="t-form" autocomplete="off"><input class="t-in" placeholder="Ask a follow-up, e.g. why not the other choice?" aria-label="Ask the tutor"><button class="btn sm" type="submit">Ask</button></form></div>`;
  const log = box.querySelector(".t-log"), form = box.querySelector(".t-form"), input = box.querySelector(".t-in");
  const add = (who, text) => { log.insertAdjacentHTML("beforeend", `<div class="t-msg ${who}">${esc(text)}</div>`); log.scrollTop = log.scrollHeight; };
  async function ask(text){
    msgs.push({role:"user", content:text}); add("me", text);
    const wait = document.createElement("div"); wait.className = "t-msg ai faint"; wait.textContent = "Thinking…"; log.appendChild(wait);
    try {
      const r = await fetch("/api/tutor", {method:"POST", headers:{"content-type":"application/json"}, body:JSON.stringify({ctx, messages:msgs.slice(-8), exam:S().exam, course:CS.COURSE})});
      const j = await r.json().catch(() => ({}));
      if (!r.ok) { wait.remove(); add("ai", j.error && r.status !== 503 ? j.error : OFFLINE); return; }
      wait.remove(); msgs.push({role:"assistant", content:j.reply}); add("ai", j.reply);
    } catch(e) { wait.remove(); add("ai", OFFLINE); }
  }
  form.onsubmit = e => { e.preventDefault(); const t = input.value.trim(); if (!t) return; input.value = ""; ask(t); };
  ask("Explain this question a different way, and why my answer was " + (ctx.picked === ctx.correct ? "right." : "wrong."));
  input.focus({preventScroll:true});
};

/* ---------- AI FRQ scoring (/api/score) ---------- */
CS.aiScore = async (frq, answer) => {
  const r = await fetch("/api/score", {method:"POST", headers:{"content-type":"application/json"},
    body:JSON.stringify({prompt:frq.prompt, parts:frq.parts, rubric:frq.rubric, answer, course:CS.COURSE})});
  const j = await r.json().catch(() => ({}));
  if (!r.ok) { const e = new Error(r.status); e.msg = j.error; throw e; }
  return j;
};

/* ---------- animated explainer player ---------- */
CS.explainer = (host, x, onDone) => {
  let i = 0, playing = true, timer = null, cur = {}, curMk = x.steps[0].mk, anim = null;
  host.innerHTML = `<div class="explainer"><div class="spread"><span class="eyebrow">Unit ${x.u} · animated explainer</span><span class="faint tiny ex-count"></span></div>
    <h3>${esc(x.title)}</h3><div class="lab ex-graph"></div><p class="ex-cap"></p>
    <div class="row-wrap"><button class="btn ghost sm ex-prev">← Back</button><button class="btn sm ex-play"></button><button class="btn ghost sm ex-next">Next →</button><span class="ex-dots"></span></div></div>`;
  const g = host.querySelector(".ex-graph"), cap = host.querySelector(".ex-cap");
  const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function drawAt(mk, sh){ g.innerHTML = CS.market(mk, sh, {ghost:true, sub:true}).svg; }
  function go(n){
    i = Math.max(0, Math.min(x.steps.length-1, n)); const st = x.steps[i];
    cap.textContent = st.cap; host.querySelector(".ex-count").textContent = `Step ${i+1} of ${x.steps.length}`;
    host.querySelector(".ex-dots").innerHTML = x.steps.map((_,k)=>`<i class="dot ${k===i?"on":""}"></i>`).join("");
    if (st.fig) { cancelAnimationFrame(anim); g.innerHTML = `<div class="ex-fig">${CS.figure(st.fig, st.v)}</div>`; curMk = null; schedule(); if (i === x.steps.length-1 && onDone) onDone(); return; }
    const from = st.mk === curMk ? {...cur} : {}, to = st.s || {}; curMk = st.mk;
    cancelAnimationFrame(anim); const t0 = performance.now(), D = reduce ? 0 : 700;
    const keys = Array.from(new Set(Object.keys(from).concat(Object.keys(to))));
    const frame = now => { const p = D ? Math.min(1,(now-t0)/D) : 1, e = 1-Math.pow(1-p,3); const sh = {};
      keys.forEach(k => { const v = (from[k]||0) + ((to[k]||0)-(from[k]||0))*e; if (Math.abs(v) > .3) sh[k] = v; });
      drawAt(st.mk, sh); if (p < 1) anim = requestAnimationFrame(frame); else cur = {...to}; };
    anim = requestAnimationFrame(frame);
    schedule();
    if (i === x.steps.length-1 && onDone) onDone();
  }
  function schedule(){ clearTimeout(timer); host.querySelector(".ex-play").textContent = playing ? "Pause" : "Play"; if (playing && i < x.steps.length-1) timer = setTimeout(()=>go(i+1), 3800); }
  host.querySelector(".ex-prev").onclick = () => { playing = false; go(i-1); };
  host.querySelector(".ex-next").onclick = () => { playing = false; go(i+1); };
  host.querySelector(".ex-play").onclick = () => { playing = !playing; if (playing && i === x.steps.length-1) go(0); else schedule(); };
  go(0);
  return () => { clearTimeout(timer); cancelAnimationFrame(anim); };
};

/* ---------- certificate (canvas → PNG) ---------- */
CS.certificateReady = () => !!S().badges.all || CS.UNITS.every(u=>S().bosses[u.id]);
CS.drawCertificate = (canvas, name) => {
  const W = 1600, H = 1100, c = canvas.getContext("2d"); canvas.width = W; canvas.height = H;
  c.fillStyle = "#FFFFFF"; c.fillRect(0,0,W,H);
  c.strokeStyle = "#4F46E5"; c.lineWidth = 18; c.strokeRect(40,40,W-80,H-80);
  c.strokeStyle = "#10B981"; c.lineWidth = 4; c.strokeRect(78,78,W-156,H-156);
  // logo
  c.fillStyle = "#4F46E5"; roundRect(c, W/2-60, 140, 120, 120, 28); c.fill();
  c.save(); roundRect(c, W/2-60, 140, 120, 120, 28); c.clip(); c.fillStyle = "#10B981"; c.fillRect(W/2, 140, 60, 120); c.restore();
  c.font = "800 64px Manrope, Arial, sans-serif"; c.textAlign = "center"; c.fillStyle = "#FFFFFF"; c.fillText("C", W/2-30, 223); c.fillStyle = "#06281C"; c.fillText("S", W/2+30, 223);
  c.fillStyle = "#5B6170"; c.font = "700 30px Manrope, Arial, sans-serif"; c.fillText("CREDIT SPRINT · CERTIFICATE OF EXAM READINESS", W/2, 340);
  c.fillStyle = "#111827"; c.font = "800 92px Manrope, Arial, sans-serif"; c.fillText(name || "Student Name", W/2, 500);
  c.fillStyle = "#4F46E5"; c.fillRect(W/2-260, 530, 520, 5);
  c.fillStyle = "#111827"; c.font = "600 38px Manrope, Arial, sans-serif";
  c.fillText(`completed Credit Sprint ${S().exam==="ap"?"AP®":"CLEP®"} ${CS.C.name} preparation`, W/2, 620);
  const s = S(); const lv = CS.level().lv;
  c.fillStyle = "#5B6170"; c.font = "500 32px Manrope, Arial, sans-serif";
  c.fillText(`Level ${lv} · ${s.xp.toLocaleString()} XP · ${CS.answeredCount()} recent answers · ${Object.keys(s.bosses).length}/6 unit bosses beaten`, W/2, 690);
  c.fillText(new Date().toLocaleDateString(undefined,{month:"long",day:"numeric",year:"numeric"}), W/2, 750);
  c.font = "500 22px Manrope, Arial, sans-serif"; c.fillStyle = "#8A90A0";
  c.fillText("AP® and CLEP® are trademarks registered by the College Board, which is not affiliated with, and does not endorse, this certificate.", W/2, H-120);
  function roundRect(ctx, x, y, w, h, r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
};

/* ---------- reminders: calendar file + Google Calendar link ---------- */
CS.reminder = (time) => {
  const [hh, mm] = (time||"19:00").split(":").map(Number);
  const d = new Date(); d.setDate(d.getDate()+1); d.setHours(hh, mm, 0, 0);
  const end = new Date(d.getTime() + 15*60e3);
  const z = x => x.getFullYear()+String(x.getMonth()+1).padStart(2,"0")+String(x.getDate()).padStart(2,"0")+"T"+String(x.getHours()).padStart(2,"0")+String(x.getMinutes()).padStart(2,"0")+"00";
  const title = "Credit Sprint: keep your streak alive", details = "15 minutes: daily challenge, due flashcards and one quiz. https://creditsprintprep.com/app.html";
  const ics = ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Credit Sprint//Study reminder//EN","BEGIN:VEVENT","UID:cs-daily-"+Date.now()+"@creditsprintprep.com",
    "DTSTAMP:"+z(new Date()),"DTSTART:"+z(d),"DTEND:"+z(end),"RRULE:FREQ=DAILY","SUMMARY:"+title,"DESCRIPTION:"+details,
    "BEGIN:VALARM","TRIGGER:-PT0M","ACTION:DISPLAY","DESCRIPTION:"+title,"END:VALARM","END:VEVENT","END:VCALENDAR"].join("\r\n");
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const google = "https://calendar.google.com/calendar/render?action=TEMPLATE&text="+encodeURIComponent(title)+"&dates="+z(d)+"/"+z(end)+"&ctz="+encodeURIComponent(tz)+"&recur="+encodeURIComponent("RRULE:FREQ=DAILY")+"&details="+encodeURIComponent(details);
  return {ics, google};
};
})();
