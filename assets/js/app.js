/* Credit Sprint app: shell, onboarding, settings, and views (dashboard, learn, practice, flashcards, FRQ, plan). Games live in games.js. */
(function(){
"use strict";
const CS = window.CS, $ = CS.$, $$ = CS.$$, esc = CS.esc, L = CS.L, I = CS.icon;
const S = () => CS.S();
const examName = () => S().exam === "ap" ? CS.C.ap : CS.C.clep;
const examShort = () => S().exam === "ap" ? "AP®" : "CLEP®";
const fmtDate = k => new Date(k+"T12:00:00").toLocaleDateString(undefined,{month:"long",day:"numeric",year:"numeric"});
const meter = (m, cls="") => `<div class="meter ${cls}" aria-hidden="true"><i style="width:${m==null?0:Math.round(Math.max(0,Math.min(1,m))*100)}%"></i></div>`;

/* ---------- router + chrome ---------- */
const NAV = [
  {k:"home", n:"Dashboard", ic:"home"}, {k:"learn", n:"Learn", ic:"book"}, {k:"practice", n:"Practice", ic:"target"},
  {k:"cards", n:"Flashcards", ic:"cards"}, {k:"games", n:"Games", ic:"game"}, {k:"pets", n:"Pets & badges", ic:"paw"}, {k:"store", n:"Store", ic:"bag"}, {k:"frq", n:"Free response", ic:"pen"}, {k:"plan", n:"Study plan", ic:"cal"}
];
const TITLES = {home:"Dashboard", learn:"Learn", practice:"Practice", cards:"Flashcards", games:"Games", pets:"Pets & badges", store:"Store", frq:"Free response", plan:"Study plan"};
const VIEWS = NAV.map(n=>n.k);
let current = "home";
CS.view = () => current;
const render = CS.render = CS.render || {};
CS.go = (v, opts={}) => {
  if (!VIEWS.includes(v)) v = "home";
  if (current === "games" && v !== "games" && CS.stopGames) CS.stopGames();
  current = v; closeDrawer();
  VIEWS.forEach(x => { $("#v-"+x).hidden = x !== v; });
  try { if (location.hash !== "#"+v) history.replaceState(null, "", "#"+v); } catch(e) {}
  render[v](opts);
  { const el = $("#v-"+v); if (el && !el.querySelector("h1")) el.insertAdjacentHTML("afterbegin", `<h1 class="sr-only">${TITLES[v]||v}</h1>`); }
  if (v === "home" && CS.focusPass) CS.focusPass();
  CS.chrome();
  if (!opts.keepScroll) window.scrollTo({top:0});
};
CS.refresh = () => { CS.checkBadges(); CS.save(); CS.chrome(); };
function dueCount(){ const now = Date.now(); return CS.CARDS.filter(c => (S().cards[c.id]?.due||0) <= now).length; }
function daysToExam(){ const ex = new Date(S().plan.date+"T12:00:00"), t = new Date(); t.setHours(12,0,0,0); return Math.round((ex - t)/CS.DAY); }
function ring(p, size=22, col="var(--mint)"){ const r = size/2-3, c = 2*Math.PI*r;
  return `<svg class="ring" viewBox="0 0 ${size} ${size}" aria-hidden="true"><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--surface-2)" stroke-width="3.5"/><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${col}" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="${(c*Math.min(1,p)).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 ${size/2} ${size/2})"/></svg>`; }
CS.chrome = () => {
  if (CS.petFlush) setTimeout(CS.petFlush, 300);
  const s = S(), st = CS.streak(), today = s.days[CS.today()]||0, lv = CS.level(), nm = Object.keys(s.mistakes).length, due = dueCount();
  $("#nav").innerHTML = NAV.map(n => `<button data-go="${n.k}" aria-current="${n.k===current?"page":"false"}">${I(n.ic)}<span>${n.n}</span>${n.k==="practice"&&nm?`<span class="count">${nm}</span>`:n.k==="cards"&&due?`<span class="count">${due}</span>`:""}</button>`).join("");
  $("#tabbar").innerHTML = NAV.filter(n=>["home","learn","practice","games","pets"].includes(n.k)).map(n => `<button data-go="${n.k}" aria-current="${n.k===current?"page":"false"}">${I(n.ic)}<span>${n.n==="Dashboard"?"Home":n.n==="Flashcards"?"Cards":n.k==="pets"?"Pets":n.n}</span></button>`).join("");
  $("#title").textContent = TITLES[current];
  $("#course-pill").innerHTML = `<span class="cpill-ico" style="background:${CS.C.col}">${I(CS.C.icon||"book")}</span><span class="cpill-txt"><small>Course</small><b>${esc(CS.C.short)}<span class="hide-sm">${S().exam==="clep"?" · CLEP®":" · AP®"}</span></b></span><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg>`;
  $("#chips").innerHTML = `
    <span class="chip-stat ${st?"flame":"dim"}" title="${st}-day streak${s.freezes?` · ${s.freezes} streak freeze${s.freezes>1?"s":""}`:""}">${I("flame")}${st}${s.freezes?`<span class="tiny faint" style="margin-left:2px">+${s.freezes}${I("shield","ico")}</span>`:""}</span>
    <span class="chip-stat hide-sm" title="Today's goal: ${today}/${s.goal} XP">${ring(today/s.goal)}${today}/${s.goal}</span>
    <span class="chip-stat hide-sm" title="Level ${lv.lv}: ${lv.into}/${lv.need} XP to next">${I("bolt")}Lv ${lv.lv}</span>`;
  if (CS.upgradeSide && $("#side-up")) $("#side-up").innerHTML = CS.upgradeSide();
  $$(".examseg button").forEach(b => { b.setAttribute("aria-pressed", b.dataset.exam === s.exam); if (CS.C.clepOnly && b.dataset.exam === "ap") b.hidden = true; if (CS.C.apOnly && b.dataset.exam === "clep") b.hidden = true; });
  if (CS.C.clepOnly || CS.C.apOnly) $$(".examseg").forEach(e => { e.style.gridTemplateColumns = "1fr"; });
  $$(".themeseg button").forEach(b => b.setAttribute("aria-pressed", b.dataset.th === s.theme));
  const dte = daysToExam();
  $("#exam-when").innerHTML = `${dte>=0?`<b>${dte}</b> days to go`:"Exam date passed"} · ${new Date(s.plan.date+"T12:00:00").toLocaleDateString(undefined,{month:"short",day:"numeric"})}${!s.dateSet?` <span class="tag warn">assumed</span>`:""}`;
  if (CS.afterChrome) CS.afterChrome();
};
document.addEventListener("click", e => {
  const g = e.target.closest("[data-go]");
  if (g) { e.preventDefault(); const o = {}; ["unit","mode","game","lab","tab"].forEach(k => { if (g.dataset[k]) o[k] = k==="unit" ? +g.dataset[k] : g.dataset[k]; }); CS.go(g.dataset.go, o); }
});
function setExam(x){ const s = S(); if (s.exam === x) return; s.exam = x; if (!s.dateSet) s.plan.date = CS.defaultDate(x); CS.save(); CS.go(current, {keepScroll:true}); }
$$(".examseg button").forEach(b => b.onclick = () => setExam(b.dataset.exam));
$$(".themeseg button").forEach(b => b.onclick = () => { S().theme = b.dataset.th; CS.applyTheme(); CS.save(); CS.chrome(); });
function openDrawer(){ $("#side").classList.add("open"); $("#scrim").classList.add("open"); }
function closeDrawer(){ $("#side").classList.remove("open"); $("#scrim").classList.remove("open"); }
$("#menu").onclick = openDrawer; $("#scrim").onclick = closeDrawer;
$("#settings").onclick = () => settings();
function markTask(k){ const d = CS.today(); const t = S().tasks[d] || (S().tasks[d] = {}); if (!t[k]) { t[k] = true; CS.save(); } if (CS.onTask) CS.onTask(k); }
CS.markTask = markTask;
function weakestUnit(){ return CS.UNITS.map(u=>({u, m:CS.mastery(u.id)})).sort((a,b)=>(a.m??-1)-(b.m??-1))[0].u; }

/* ---------- modals: onboarding + settings ---------- */
function modal(html){ const w = document.createElement("div"); w.className = "modal-wrap"; w.innerHTML = `<div class="modal" role="dialog" aria-modal="true">${html}</div>`; document.body.appendChild(w); return w; }
const GOALS = [[30,"Casual","About 5 minutes a day"],[60,"Regular","About 10 minutes a day"],[100,"Serious","About 15–20 minutes a day"],[150,"Intense","30+ minutes a day"]];
/* Welcome window. Three layouts (pick one with CS.OB_STYLE; ?ob=steps|compact|combined previews the others):
   steps    — two short steps that each fit on one screen, sign-up shown separately before the diagnostic
   compact  — everything on one compact screen, sign-up shown separately before the diagnostic
   combined — setup and sign-up side by side in one window (stacked on phones) */
CS.OB_STYLE = "combined";   // Adam chose the combined window
function obStyle(){ const q = (location.search.match(/[?&]ob=(steps|compact|combined)\b/) || [])[1]; return q || CS.OB_STYLE; }
function onboarding(){
  const s = S(), style = obStyle(); let ex = s.exam, goal = s.goal, date = s.plan.date, step = 0, tabM = "setup";
  const w = modal(""); const m = $(".modal", w);
  m.classList.add("ob", "ob-" + style);
  function courses(){ return `<div class="ob-courses">${Object.values(window.CS_COURSES).map(c=>`<button data-crs="${c.k}" aria-pressed="${c.k===CS.COURSE}" style="--cc:${c.col}"><span class="ob-ci" style="background:${c.col}">${I(c.icon||"book")}</span><span class="ob-cn"><b>${esc(c.name)}</b><small>${c.apOnly?"AP®":c.clepOnly?"CLEP®":"AP® · CLEP®"}</small></span></button>`).join("")}</div>`; }
  function examRow(){ return `<div class="ob-row">
      <div class="stack" style="gap:6px;flex:1;min-width:200px"><span class="eyebrow">Exam</span><div class="seg ob-seg">${CS.C.clepOnly ? "" : `<button data-ex="ap" aria-pressed="${ex==="ap"}">${esc(CS.C.ap)}</button>`}${CS.C.apOnly ? "" : `<button data-ex="clep" aria-pressed="${ex==="clep"}">${esc(CS.C.clepShort)}</button>`}</div></div>
      <div class="stack" style="gap:6px"><label class="eyebrow" for="ob-date">Exam date</label><input type="date" id="ob-date" value="${esc(date)}"></div></div>
      <span class="muted tiny">${ex==="ap"?"We'll assume May 1 until you set your school's AP® date.":"CLEP® can be taken any time. Pick a target date."}</span>`; }
  function goals(){ return `<div class="stack" style="gap:6px"><span class="eyebrow">Daily goal</span><div class="ob-goals">${GOALS.map(([v,n,d])=>`<button data-goal="${v}" aria-pressed="${goal===v}"><b>${n}</b><small>${d.replace("About ","~").replace(" a day","/day")}</small></button>`).join("")}</div></div>`; }
  const head = (t) => `<div class="ob-head">${CS.logo("mark")}<div><span class="eyebrow">Welcome to Credit Sprint</span><h2>${t}</h2></div></div>`;
  const actions = `<div class="row-wrap ob-actions"><button class="btn lg" id="ob-diag">Start the ${Math.round(CS.UNITS.length*1.6)}-minute diagnostic</button><button class="btn ghost" id="ob-skip">Explore first</button></div>`;
  draw();
  /* the sign-in check finished while this window is open: drop (or add) the sign-up side to match */
  const onAcct = () => { if (!document.body.contains(w)) return document.removeEventListener("cs:account", onAcct); if (style === "combined") { if (CS.account) tabM = "setup"; draw(); } };
  document.addEventListener("cs:account", onAcct);
  function draw(){
    if (style === "steps") {
      m.innerHTML = step === 0
        ? `${head("Which course are you studying?")}<span class="ob-dots"><i class="on"></i><i></i></span>${courses()}<span class="muted tiny">You can add more courses any time. Streak, XP and pets carry over.</span>
           <div class="row-wrap"><button class="btn lg" id="ob-next">Next</button></div>`
        : `${head("Set your exam and daily goal")}<span class="ob-dots"><i class="on"></i><i class="on"></i></span>${examRow()}${goals()}${actions}<button class="linklike" id="ob-back" style="align-self:flex-start">← Change course</button>`;
    } else if (style === "compact") {
      m.innerHTML = `${head("Let's set up your sprint to college credit")}<div class="stack" style="gap:6px"><span class="eyebrow">Course</span>${courses()}</div>${examRow()}${goals()}${actions}`;
    } else {
      const showAcct = !(CS.maybeSignedIn ? CS.maybeSignedIn() : CS.account) && online();
      m.innerHTML = `${head("Let's set up your sprint to college credit")}
        ${showAcct ? `<div class="seg ob-tabs"><button data-obt="setup" aria-pressed="${tabM==="setup"}">1 · Set up</button><button data-obt="acct" aria-pressed="${tabM==="acct"}">2 · Save progress</button></div>` : ""}
        <div class="ob-cols ${showAcct?"":"one"} show-${tabM}"><div class="stack ob-left" style="gap:14px"><div class="stack" style="gap:6px"><span class="eyebrow">Course</span>${courses()}</div>${examRow()}${goals()}</div>
        ${showAcct ? `<div class="ob-right"><span class="eyebrow">Step 2 · Save your progress</span><div id="ob-acct"></div></div>` : ""}</div>${actions}`;
      if (showAcct) { CS.openAccount({signup:true, host: $("#ob-acct", m)});
        $$("[data-obt]", m).forEach(b => b.onclick = () => { tabM = b.dataset.obt; $$("[data-obt]", m).forEach(x => x.setAttribute("aria-pressed", x === b)); $(".ob-cols", m).className = "ob-cols show-" + tabM; }); }
    }
    $$("[data-ex]", m).forEach(b => b.onclick = () => { ex = b.dataset.ex; if (!s.dateSet) date = CS.defaultDate(ex); draw(); });
    $$("[data-crs]", m).forEach(b => b.onclick = () => { if (b.dataset.crs !== CS.COURSE) { s.exam = ex; if (style === "steps") s.obStep = 1; CS.switchCourse(b.dataset.crs); } else if (style === "steps") { step = 1; draw(); } });
    $$("[data-goal]", m).forEach(b => b.onclick = () => { goal = +b.dataset.goal; draw(); });
    const d = $("#ob-date", m); if (d) d.onchange = e => { if (e.target.value) { date = e.target.value; s.dateSet = date !== CS.defaultDate(ex); } };
    const nx = $("#ob-next", m); if (nx) nx.onclick = () => { step = 1; draw(); };
    const bk = $("#ob-back", m); if (bk) bk.onclick = () => { step = 0; draw(); };
    const finish = (diag) => { s.exam = ex; s.goal = goal; s.plan.date = date; s.onboarded = true; delete s.obStep; CS.save(); w.remove();
      CS.go("home");
      if (diag) { const run = () => { CS._diagAuto = true; CS.go("practice",{mode:"diagnostic"}); };
        /* combined window already showed the sign-up form, so the diagnostic starts right away */
        (style === "combined" || !CS.beforeDiag) ? run() : CS.beforeDiag(run); } };
    const dg = $("#ob-diag", m); if (dg) dg.onclick = () => finish(true);
    const sk = $("#ob-skip", m); if (sk) sk.onclick = () => finish(false);
    m.setAttribute("tabindex", "-1"); m.focus({preventScroll: true});   // no button looks pre-selected by focus
  }
  if (style === "steps" && s.obStep) { step = 1; draw(); }
}
const online = () => location.protocol.startsWith("http");
function settings(){
  const s = S(); const w = modal(""); const m = $(".modal", w); let confirmReset = false;
  draw();
  function draw(){
    m.innerHTML = `<div class="spread"><h2>Settings</h2><button class="btn ghost sm" id="st-x">Done</button></div>
      <div class="stack"><span class="eyebrow">Course</span><div class="opt-grid">${Object.values(window.CS_COURSES).map(c=>`<button data-crs="${c.k}" aria-pressed="${c.k===CS.COURSE}"><b>${esc(c.name)}</b></button>`).join("")}</div></div>
      <div class="stack"><span class="eyebrow">Exam</span><div class="opt-grid">${CS.C.clepOnly ? "" : `<button data-ex="ap" aria-pressed="${s.exam==="ap"}"><b>${esc(CS.C.ap)}</b></button>`}${CS.C.apOnly ? "" : `<button data-ex="clep" aria-pressed="${s.exam==="clep"}"><b>${esc(CS.C.clepShort)}</b></button>`}</div></div>
      <div class="stack"><label class="eyebrow" for="st-date">Exam date</label><input type="date" id="st-date" value="${esc(s.plan.date)}" style="max-width:220px"></div>
      <div class="stack"><span class="eyebrow">Daily goal</span><div class="opt-grid">${GOALS.map(([v,n])=>`<button data-goal="${v}" aria-pressed="${s.goal===v}"><b>${n} · ${v} XP</b></button>`).join("")}</div></div>
      <div class="stack"><span class="eyebrow">Appearance</span><div class="seg three" style="max-width:320px">${[["light","sun","Light"],["dark","moon","Dark"],["system","auto","System"]].map(([k,ic,n])=>`<button data-th="${k}" aria-pressed="${s.theme===k}">${I(ic)}${n}</button>`).join("")}</div></div>
      <div class="stack"><span class="eyebrow">Plan</span><div class="row-wrap">${CS.hasAccess()&&CS.planFor()?`<span class="tag good">${esc(CS.planName(CS.planFor()))}</span><span class="muted small">Every feature unlocked for ${esc(CS.C.name)}.</span>${CS.account&&CS.account.billing?`<button class="btn ghost sm" data-billing>Manage billing</button>`:""}`:`<span class="tag">Free</span><button class="btn sm" data-up="open">See plans</button>`}</div></div>
      <div class="stack"><span class="eyebrow">Account</span><div class="row-wrap">${CS.account?`<span class="tag good">Signed in</span><span class="small">${esc(CS.account.name||"")}</span>`:`<span class="muted small">Sign in to save progress across devices and join weekly leagues.</span>`}<button class="btn ghost sm" data-account="open">${CS.account?"Manage account":"Sign in"}</button></div></div>
      <div class="stack"><span class="eyebrow">Color theme</span><div class="row-wrap">${CS.ACCENTS.concat((CS.GEM_THEMES||[]).filter(t=>(s.themes||[]).includes(t.k)).map(t=>({k:t.k,n:t.n,lv:0,c:t.c}))).map(a=>{ const ok = CS.level().lv >= a.lv; return `<button class="chip" data-ac="${a.k}" aria-pressed="${s.accent===a.k}" ${ok?"":"disabled"} title="${ok?a.n:`Unlocks at level ${a.lv}`}"><span style="display:inline-block;width:12px;height:12px;border-radius:4px;background:${a.c};vertical-align:-1px;margin-right:6px"></span>${a.n}${ok?"":` · Lv ${a.lv}`}</button>`; }).join("")}</div><span class="muted small">Level up to unlock more colors, or buy gem themes in the Store. You're level ${CS.level().lv}.</span></div>
      <div class="stack"><span class="eyebrow">Daily reminder</span><div class="row-wrap"><input type="time" id="st-time" value="${esc(s.remind)}" style="font:inherit;padding:7px 10px;border-radius:10px;border:1.5px solid var(--rule);background:var(--surface);color:var(--ink)">
        <a class="btn ghost sm" id="st-gcal" target="_blank" rel="noopener">Add to Google Calendar</a><button class="btn ghost sm" id="st-ics">Download calendar file</button></div>
        <span class="muted small">A daily 15-minute study block with an alert. Works with Apple, Google and Outlook calendars.</span><span class="small" id="st-ics-msg"></span></div>
      <div class="stack"><label class="eyebrow" for="st-name">Name on your certificate</label><input id="st-name" value="${esc(s.name)}" placeholder="Your name" style="font:inherit;padding:8px 10px;border-radius:10px;border:1.5px solid var(--rule);background:var(--surface);color:var(--ink);max-width:280px"></div>
      <div class="stack"><span class="eyebrow">Progress</span><p class="muted small">Your progress is saved in this browser. Clearing your browser data erases it.</p>
        <div><button class="btn ghost sm" id="st-reset" style="${confirmReset?"border-color:var(--bad);color:var(--bad)":""}">${confirmReset?"Tap again to erase all progress":"Reset all progress"}</button></div></div>`;
    $("#st-x", m).onclick = () => { w.remove(); CS.go(current, {keepScroll:true}); };
    $$("[data-ex]", m).forEach(b => b.onclick = () => { s.exam = b.dataset.ex; if (!s.dateSet) s.plan.date = CS.defaultDate(s.exam); CS.save(); draw(); });
    $$("[data-goal]", m).forEach(b => b.onclick = () => { s.goal = +b.dataset.goal; CS.save(); draw(); });
    $$("[data-crs]", m).forEach(b => b.onclick = () => { if (b.dataset.crs !== CS.COURSE) CS.switchCourse(b.dataset.crs); });
    $$("[data-th]", m).forEach(b => b.onclick = () => { s.theme = b.dataset.th; CS.applyTheme(); CS.save(); draw(); });
    $("#st-date", m).onchange = e => { if (e.target.value) { s.plan.date = e.target.value; s.dateSet = true; CS.save(); } };
    $$("[data-ac]", m).forEach(b => b.onclick = () => { s.accent = b.dataset.ac; CS.applyTheme(); CS.save(); draw(); });
    const setLinks = () => { const r = CS.reminder(s.remind); $("#st-gcal", m).href = r.google; return r; }; setLinks();
    $("#st-time", m).onchange = e => { s.remind = e.target.value || "19:00"; CS.save(); setLinks(); };
    $("#st-ics", m).onclick = () => { const r = setLinks(); try { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([r.ics], {type:"text/calendar"})); a.download = "credit-sprint-reminder.ics"; document.body.appendChild(a); a.click(); a.remove(); $("#st-ics-msg", m).textContent = "Calendar file downloaded. Open it to add the reminder."; } catch(e) { $("#st-ics-msg", m).textContent = "Downloads are blocked here. Use the Google Calendar button instead."; } };
    $("#st-name", m).onchange = e => { s.name = e.target.value.trim(); CS.save(); };
    $("#st-reset", m).onclick = () => { if (!confirmReset) { confirmReset = true; return draw(); } CS.resetAll(); w.remove(); location.reload(); };
  }
}

/* ---------- dashboard ---------- */
function dial(pred){
  const p = pred.ready ? pred.p : 0, r = 44, c = 2*Math.PI*r;
  return `<svg viewBox="0 0 104 104" aria-hidden="true"><circle cx="52" cy="52" r="${r}" fill="none" stroke="var(--surface-2)" stroke-width="10"/>
    <circle cx="52" cy="52" r="${r}" fill="none" stroke="var(${pred.ready&&pred.pass?"--mint":"--accent"})" stroke-width="10" stroke-linecap="round" stroke-dasharray="${(c*p).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 52 52)"/>
    <text x="52" y="61" text-anchor="middle" font-size="30" font-weight="800" fill="var(--ink)" font-family="Manrope, sans-serif">${pred.ready?esc(pred.label):"?"}</text></svg>`;
}
function greeting(){ const h = new Date().getHours(); return h<12?"Good morning":h<18?"Good afternoon":"Good evening"; }
render.home = () => {
  CS.checkBadges();
  const s = S(), pred = CS.predict(), lv = CS.level(), st = CS.streak(), todayXP = s.days[CS.today()]||0, dte = daysToExam();
  const wu = weakestUnit(), due = dueCount(), t = s.tasks[CS.today()] || {}, dcDone = !!s.daily[CS.today()];
  const next = !s.diag ? {go:"practice", mode:"diagnostic", t:"Take the diagnostic"} : !dcDone ? {go:"games", game:"daily", t:"Play today's challenge"} : {go:"practice", mode:"unit", unit:wu.id, t:`Practice Unit ${wu.id}`};
  const tasks = [
    {k:"daily", done:dcDone, h:"Daily challenge", p:"5 questions, same for everyone today.", xp:"+50 XP", go:"games", game:"daily"},
    !s.diag ? {k:"diag", done:!!t.diag, h:"Take the diagnostic", p:`Find your weak units in ${Math.round(CS.UNITS.length*1.6)} minutes.`, xp:"+120 XP", go:"practice", mode:"diagnostic"}
            : {k:"quiz", done:!!t.quiz, h:`Unit ${wu.id} quiz: ${wu.short}`, p:`Your weakest unit (${CS.pct(CS.mastery(wu.id))}).`, xp:"+110 XP", go:"practice", mode:"unit", unit:wu.id},
    CS.mistakesDue().length ? {k:"mist", done:!!t.mist, h:`Review ${CS.mistakesDue().length} missed question${CS.mistakesDue().length===1?"":"s"}`, p:"Spaced review: they come back at 1, 3 and 7 days.", xp:"+40 XP", go:"practice", mode:"mistakes"} :
    {k:"cards", done:!!t.cards, h: due ? `Review ${Math.min(due,15)} flashcards` : "Flashcards are clear", p: due ? `${due} due. Spaced repetition does the scheduling.` : "Study ahead in any unit.", xp:"+45 XP", go:"cards"}
  ];
  const doneN = tasks.filter(x=>x.done).length;
  const week = CS.weekXP(), maxW = Math.max(s.goal, ...week.map(w=>w.xp));
  const nBadges = Object.keys(s.badges).length;
  const hr = new Date().getHours(), risk = st > 0 && todayXP === 0 && hr >= 17;
  const banner = risk ? `<div class="feedback bad spread"><span><b>${I("flame")} Your ${st}-day streak ends at midnight.</b> One quick quest keeps it alive${s.freezes?` (or a streak freeze will cover today)`:""}.</span><button class="btn sm" data-go="games" data-game="daily">Save my streak</button></div>`
    : (!s.dateSet && s.exam==="ap" ? "" : "");
  const cert = CS.certificateReady();
  $("#v-home").innerHTML = CS.coursesBar() + banner + (CS.questBlock ? CS.questBlock() : "") + `
    <div class="hello">
      <div class="hero-card">
        <svg class="bg" viewBox="0 0 200 160" aria-hidden="true"><path d="M10 150 L190 10" stroke="#fff" stroke-width="10"/><path d="M10 10 L190 150" stroke="#fff" stroke-width="10"/><circle cx="100" cy="80" r="16" fill="#fff"/></svg>
        <span class="eyebrow">${greeting()} · ${esc(examName())}</span>
        <h1>${st>1?`${st}-day streak. Keep it alive.`:dte>0?`${dte} days to exam day.`:"Let's get you exam-ready."}</h1>
        <div class="countdown"><div><b>${Math.max(0,dte)}</b><span>days left</span></div><div><b>${Math.max(0,Math.ceil(dte/7))}</b><span>weeks</span></div><div><b>${CS.answeredCount()}</b><span>answered</span></div></div>
        <p class="small">Exam date: ${fmtDate(s.plan.date)}${!s.dateSet?" (assumed; set yours in Study plan)":""}.</p>
        <div class="row-wrap"><button class="btn" data-go="${next.go}" ${next.mode?`data-mode="${next.mode}"`:""} ${next.game?`data-game="${next.game}"`:""} ${next.unit?`data-unit="${next.unit}"`:""}>${esc(next.t)} →</button><button class="btn ghost" data-go="plan">View study plan</button></div>
      </div>
      <div class="panel">
        <span class="eyebrow">Exam readiness</span>
        <div class="ready">${dial(pred)}<div class="stack" style="gap:6px">
          ${pred.ready ? `<h3>${esc(pred.sub)}: ${esc(pred.label)}</h3><p class="muted small">${pred.pass?"On track to earn credit.":"Not on track yet. Your weakest units will move this most."} Based on your last 20 answers per unit, weighted like the real exam. A rough estimate, not an official score.</p>`
            : `<h3>Unlock your score estimate</h3><p class="muted small">Answer ${pred.need>0?`${pred.need} more questions`:`questions in ${pred.units} more units`} across at least 4 units and we'll predict your ${examShort()} score.</p>`}
        </div></div>
        <div class="stack" style="gap:6px">${CS.UNITS.map(u=>{ const m = CS.mastery(u.id); return `<div class="spread small" style="gap:8px"><span style="flex:1;min-width:0">${u.id}. ${esc(u.short)}</span><span style="width:46%">${meter(m,"thin")}</span><span class="muted" style="width:34px;text-align:right">${CS.pct(m)}</span></div>`; }).join("")}</div>
      </div>
    </div>
    <div class="kpis">
      <div class="kpi"><span class="eyebrow" style="color:color-mix(in srgb,var(--flame) 70%,var(--ink))">Streak</span><span class="v">${st}<small> day${st===1?"":"s"}</small></span><span class="muted small">${s.freezes?`${s.freezes} streak freeze${s.freezes>1?"s":""} ready`:"Hit 7 days to earn a streak freeze"}</span></div>
      <div class="kpi"><span class="eyebrow">Today</span><span class="v">${todayXP}<small> / ${s.goal} XP</small></span>${meter(todayXP/s.goal,"mint")}</div>
      <div class="kpi"><span class="eyebrow">Level ${lv.lv}</span><span class="v">${s.xp.toLocaleString()}<small> XP</small></span>${meter(lv.into/lv.need)}<span class="muted tiny">${lv.need-lv.into} XP to level ${lv.lv+1}</span></div>
      <div class="kpi"><span class="eyebrow">This week</span><div class="week">${week.map(w=>`<div title="${w.xp} XP"><i class="${w.xp>=s.goal||w.frozen?"on":""}" style="height:${Math.max(6,Math.round(w.xp/maxW*44))}px"></i><span>${esc(w.label)}</span></div>`).join("")}</div></div>
    </div>
    ${CS.upgradeCard ? CS.upgradeCard() : ""}
    ${CS.petCard ? CS.petCard() : ""}
    ${CS.dqCard ? CS.dqCard() : ""}${CS.whyCard ? CS.whyCard() : ""}
    <div class="stack">
      <div class="spread"><h2>Today's quests</h2><span class="muted small">${doneN}/3 done${doneN===3?" · nice work":""}</span></div>
      <div class="quest">${tasks.map(x=>`<button class="task ${x.done?"done":""}" data-go="${x.go}" ${x.mode?`data-mode="${x.mode}"`:""} ${x.unit?`data-unit="${x.unit}"`:""} ${x.game?`data-game="${x.game}"`:""}>
        <span class="ck" aria-hidden="true">${x.done?"✓":""}</span><span class="stack" style="gap:2px;flex:1"><h3>${esc(x.h)}</h3><span class="muted small">${esc(x.p)}</span></span><span class="xp">${x.xp}</span></button>`).join("")}</div>
    </div>
    <div class="stack">
      <div class="spread"><h2>Units</h2><span class="muted small">Medals: bronze 50% · silver 70% · gold 85%</span></div>
      <div class="units">${CS.UNITS.map(u=>{ const m = CS.mastery(u.id), md = CS.medal(m); return `<div class="unit">
        <div class="spread"><span class="eyebrow">Unit ${u.id}</span><span class="tag">${examShort()} ${s.exam==="ap"?u.ap:u.clep}</span></div>
        <h3>${esc(u.name)}</h3>
        <div class="spread small"><span class="muted">Mastery ${m==null?"· not started":CS.pct(m)}</span>${md?`<span class="medal ${md}"><i></i>${{b:"Bronze",s:"Silver",g:"Gold"}[md]}</span>`:""}${s.bosses[u.id]?`<span class="tag acc">Boss beaten</span>`:""}</div>${meter(m)}
        <div class="acts"><button class="btn sm ghost" data-go="learn" data-unit="${u.id}">Guide</button><button class="btn sm" data-go="practice" data-mode="unit" data-unit="${u.id}">Quiz</button><button class="btn sm ghost" data-go="games" data-game="boss" data-unit="${u.id}">Boss</button></div></div>`; }).join("")}</div>
    </div>
    <div class="panel flat" style="flex-direction:row;align-items:center;gap:18px;flex-wrap:wrap">
      <span class="g-ico" style="width:52px;height:52px;border-radius:14px;display:grid;place-items:center;background:${cert?"var(--mint-soft)":"var(--surface-2)"};color:${cert?"var(--good)":"var(--faint)"}">${I("cap")}</span>
      <div class="stack" style="gap:2px;flex:1;min-width:200px"><h3>Certificate of exam readiness</h3><span class="muted small">${cert?"Unlocked. Download it, share it, put it on a college application.":"Unlocks when you beat all six unit bosses or reach 70% mastery in every unit."}</span></div>
      <button class="btn ${cert?"":"ghost"}" id="cert-btn" ${cert?"":"disabled"}>${cert?"Get my certificate":`${Object.keys(s.bosses).length}/${CS.UNITS.length} bosses`}</button></div>
    ${CS.badgeSVG ? (() => { const got = Object.keys(s.badges).filter(k => CS.badgeDef(k)).sort((a, b) => s.badges[b] - s.badges[a]);
      const next = CS.BADGES.filter(b => !s.badges[b.k]).slice(0, Math.max(0, 6 - got.length));
      return `<div class="stack"><div class="spread"><h2>Badges</h2><button class="linklike" data-go="pets" data-tab="badges">See all ${got.length ? `· ${got.length} earned` : ""} →</button></div>
      <div class="bd-strip">${got.slice(0, 6).map(k => `<div class="bd-mini">${CS.badgeSVG(k, {size:46})}<span class="tiny">${esc(CS.badgeDef(k).n)}</span></div>`).join("")}${next.map(b => `<div class="bd-mini">${CS.badgeSVG(b.k, {size:46, locked:true})}<span class="tiny muted">${esc(b.d)}</span></div>`).join("")}</div></div>`; })()
      : `<div class="stack"><div class="spread"><h2>Badges</h2><span class="muted small">${nBadges} of ${CS.BADGES.length} unlocked</span></div>
      <div class="badges">${CS.BADGES.map(b=>`<div class="badge ${s.badges[b.k]?"on":""}"><span class="b-ico">${I(b.ic)}</span><span class="stack" style="gap:0"><b class="small">${esc(b.n)}</b><span class="muted tiny">${esc(b.d)}</span></span></div>`).join("")}</div></div>`}`;
  const cb = $("#cert-btn"); if (cb && cert) cb.onclick = certificate;
};

function certificate(){
  const s = S(); const w = modal(""); const m = $(".modal", w);
  m.innerHTML = `<div class="spread"><h2>Your certificate</h2><button class="btn ghost sm" id="c-x">Close</button></div>
    <div class="row-wrap"><input id="c-name" value="${esc(s.name)}" placeholder="Your name" style="font:inherit;padding:8px 10px;border-radius:10px;border:1.5px solid var(--rule);background:var(--surface);color:var(--ink);flex:1;min-width:0"><button class="btn sm" id="c-upd">Update</button></div>
    <canvas id="c-cv" style="width:100%;height:auto;border:1px solid var(--rule);border-radius:10px"></canvas>
    <div class="row-wrap"><button class="btn" id="c-dl">Download PNG</button><span class="small muted" id="c-msg"></span></div>`;
  const draw = () => CS.drawCertificate($("#c-cv", m), s.name); draw();
  $("#c-x", m).onclick = () => w.remove();
  $("#c-upd", m).onclick = () => { s.name = $("#c-name", m).value.trim(); CS.save(); draw(); };
  $("#c-dl", m).onclick = () => { try { const a = document.createElement("a"); a.href = $("#c-cv", m).toDataURL("image/png"); a.download = "credit-sprint-certificate.png"; document.body.appendChild(a); a.click(); a.remove(); } catch(e) { $("#c-msg", m).textContent = "Downloads are blocked in this preview. They work on the live site."; } };
}
CS.certificate = certificate;

/* ---------- learn ---------- */
let learnUnit = 1, labKey = "adas", labShift = {}, stopEx = null, vidSel = null;
render.learn = (o) => {
  if (CS.onLearn) CS.onLearn(o || {});
  if (o.unit) learnUnit = o.unit;
  if (o.lab) { learnUnit = "lab"; labKey = o.lab; labShift = {}; }
  if (o.mode === "vid") { learnUnit = "vid"; vidSel = o.game || null; }
  const items = CS.UNITS.map(u=>`<button aria-current="${u.id===learnUnit}" data-u="${u.id}"><span class="num">${u.id}</span>${esc(u.short)}</button>`).join("")
    + `<button aria-current="${learnUnit==="vid"}" data-u="vid"><span class="num">${I("spark")}</span>Animated explainers</button>${CS.hasGraphs()?`<button aria-current="${learnUnit==="lab"}" data-u="lab"><span class="num">${I("chart")}</span>Graph Lab</button>`:""}${CS.C.apOnly ? "" : `<button aria-current="${learnUnit==="clep"}" data-u="clep"><span class="num">${I("cap")}</span>CLEP® hub</button>`}<button aria-current="${learnUnit==="res"}" data-u="res"><span class="num">${I("ext")}</span>Official resources</button>`;
  $("#v-learn").innerHTML = `<div class="split"><nav class="sidelist" aria-label="Units">${items}</nav><article class="panel" id="learn-body"></article></div>`;
  $$("#v-learn .sidelist button").forEach(b => b.onclick = () => { const u = b.dataset.u; learnUnit = isNaN(+u) ? u : +u; render.learn({}); });
  if (stopEx) { stopEx(); stopEx = null; }
  if (learnUnit === "lab") { if (!CS.hasGraphs()) { learnUnit = 1; return render.learn({}); } return renderLab(); }
  if (learnUnit === "vid") return renderVids();
  if (learnUnit === "clep") return renderClep();
  if (learnUnit === "res") return renderRes();
  const u = CS.UNITS[learnUnit-1], m = CS.mastery(u.id);
  $("#learn-body").innerHTML = `
    <div class="row-wrap">${CS.C.clepOnly ? "" : `<span class="tag acc">AP® ${u.ap}</span>`}${CS.C.apOnly ? "" : `<span class="${CS.C.clepOnly ? "tag acc" : "tag"}">CLEP® ${u.clep}</span>`}<span class="tag">Your mastery ${CS.pct(m)}</span></div>
    <h2>${CS.C.unitWord||"Unit"} ${u.id}: ${esc(u.name)}</h2>
    <div class="guide">
      <div class="stack" style="gap:18px">
        <p style="font-size:1.04rem">${esc(u.summary)}</p>
        <div><h3 style="margin-bottom:8px">What you need to know</h3><ul>${u.points.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>
        <div class="stack" style="gap:8px"><h3>Formulas</h3>${u.formulas.map(f=>`<div class="formula">${esc(f)}</div>`).join("")}</div>
        <div class="stack" style="gap:10px"><h3>Exam traps</h3>${u.traps.map(t=>`<div class="trap"><b>Watch for</b>${esc(t)}</div>`).join("")}</div>
      </div>
      <div class="stack figure">${CS.figure(u.graph)}<span class="eyebrow">${CS.hasGraphs()?"Key graph":"Key diagram"}</span>
        <div class="stack" style="gap:8px"><button class="btn" data-go="practice" data-mode="unit" data-unit="${u.id}">Quiz this unit</button>
          <button class="btn ghost" id="learn-cards">${I("cards")}Unit ${u.id} flashcards</button>
          <button class="btn ghost" data-go="games" data-game="boss" data-unit="${u.id}">${I("sword")}Fight the Unit ${u.id} boss</button>
          ${u.lab?`<button class="btn ghost" data-go="learn" data-lab="${u.lab}">${I("chart")}Open in Graph Lab</button>`:""}
          ${(window.CS_EXPLAINERS||[]).filter(x=>x.u===u.id).map(x=>`<button class="btn ghost" data-go="learn" data-mode="vid" data-game="${x.id}">${I("spark")}Watch: ${esc(x.title)}</button>`).join("")}</div>
      </div>
    </div>`;
  $("#learn-cards").onclick = () => { CS.cardFilter = u.id; CS.go("cards"); };
};
function describeMove(m, e0, e1){
  if (!e0 || !e1) return "";
  const w = (d, name) => Math.abs(d) < .5 ? `${name} unchanged` : `${name} ${d>0?"↑":"↓"}`;
  return `${w(e1[1]-e0[1], m.y)}; ${w(e1[0]-e0[0], m.x)}.`;
}
function renderLab(){
  if (!CS.MARKETS[labKey]) { labKey = Object.keys(CS.MARKETS)[0]; labShift = {}; }
  const m = CS.MARKETS[labKey], g = CS.market(labKey, labShift);
  $("#learn-body").innerHTML = `
    <div class="spread"><div><span class="eyebrow">Graph Lab</span><h2>Shift the curves yourself</h2></div><button class="btn ghost sm" id="lab-reset">Reset</button></div>
    <div class="chips">${Object.entries(CS.MARKETS).map(([k,v])=>`<button class="chip" aria-pressed="${k===labKey}" data-k="${k}">${esc(v.name)}</button>`).join("")}</div>
    <div class="guide">
      <div class="lab">${g.svg}<div class="readout" aria-live="polite">${Object.values(labShift).some(v=>v) ? esc(describeMove(m, g.e0, g.e1)) : "Starting equilibrium. Shift a curve to see what changes."}</div></div>
      <div class="stack"><span class="eyebrow">Shift a curve</span>
        ${m.curves.map(c=>`<div class="curvebtn" style="justify-content:space-between"><span style="border:0">${esc(c.label||c.k)}</span><span style="display:flex;padding:0;border:0"><button data-c="${esc(c.k)}" data-d="-1">← Left</button><button data-c="${esc(c.k)}" data-d="1">Right →</button></span></div>`).join("")}
        <p class="muted small">Right means an increase (more at every price); left means a decrease. The faded line shows where the curve started.</p>
        <button class="btn" data-go="games" data-game="shift">Test yourself in Shift It</button></div>
    </div>`;
  $$("#learn-body [data-k]").forEach(b => b.onclick = () => { labKey = b.dataset.k; labShift = {}; renderLab(); });
  $$("#learn-body [data-c]").forEach(b => b.onclick = () => { const k = b.dataset.c; labShift[k] = Math.max(-30, Math.min(30, (labShift[k]||0) + 12*(+b.dataset.d))); renderLab(); });
  $("#lab-reset").onclick = () => { labShift = {}; renderLab(); };
}
function renderVids(){
  const X = window.CS_EXPLAINERS, sel = X.find(x=>x.id===vidSel) || X[0];
  const seen = S().seenEx || (S().seenEx = {});
  $("#learn-body").innerHTML = `<div><span class="eyebrow">Animated explainers</span><h2>${CS.hasGraphs()?"Watch the graphs move":"Watch the diagrams come to life"}</h2></div>
    <div class="guide"><div id="ex-host"></div>
      <div class="stack" style="gap:6px"><span class="eyebrow">${X.length} explainers</span>${X.map(x=>`<button class="task ${seen[x.id]?"done":""}" data-x="${x.id}" style="${x.id===sel.id?"border-color:var(--accent)":""}"><span class="ck">${seen[x.id]?"✓":""}</span><span class="stack" style="gap:0"><b class="small">${esc(x.title)}</b><span class="muted tiny">Unit ${x.u} · ${x.steps.length} steps</span></span></button>`).join("")}</div></div>`;
  $$("#learn-body [data-x]").forEach(b => b.onclick = () => { vidSel = b.dataset.x; if (stopEx) stopEx(); renderVids(); });
  stopEx = CS.explainer($("#ex-host"), sel, () => { if (!seen[sel.id]) { seen[sel.id] = true; CS.addXP(10); CS.refresh(); } });
}
function renderClep(){
  const C = window.CS_CLEP, g = C.growth;
  $("#learn-body").innerHTML = `<div class="row-wrap"><span class="tag acc">CLEP® only</span><span class="tag">${esc(g.weight)}</span></div>
    <h2>CLEP® hub</h2>
    <div class="guide">
      <div class="stack" style="gap:18px">
        <div class="stack" style="gap:8px"><h3>${esc(g.title)}</h3><p>${esc(g.summary)}</p><ul>${g.points.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
          <div><button class="btn" id="clep-growth">Practice ${esc(g.title.toLowerCase())} questions</button></div></div>
        <h3>Exam-day guide</h3>
        ${(C.guide||[]).map(sec=>`<div class="stack" style="gap:6px"><b>${esc(sec.h)}</b><ul>${sec.p.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>`).join("")}
        <p class="faint small">Sources: ${(C.sources||[]).map(([n,u])=>`<a href="${esc(u)}" target="_blank" rel="noopener">${esc(n)}</a>`).join(" · ")}. Policies change; check the official CLEP® site before you register.</p>
      </div>
      <div class="stack figure">${CS.figure(C.fig||"ppc")}<span class="eyebrow">${esc(C.figCap||"Growth shifts the PPC outward")}</span>
        <button class="btn ghost" data-go="plan">Build my CLEP® plan</button></div>
    </div>`;
  $("#clep-growth").onclick = () => { const qs = CS.QS.filter(q=>g.match.test(q.q+" "+q.opts.find(o=>o.ok).t)); run = {qs: CS.takeQs(qs,10).map(CS.prepQ), i:0, score:0, picked:null, kind:"mixed"}; pMode = "mixed"; CS.go("practice", {keepRun:true}); };
}
function renderRes(){
  $("#learn-body").innerHTML = `<div><span class="eyebrow">Official resources</span><h2>Practice with real exam material</h2></div>
    <p class="muted" style="max-width:66ch">These free resources come straight from the exam makers. Real past free-response questions with scoring guidelines are the best FRQ practice there is. Use them alongside Credit Sprint.</p>
    <div class="reslist">${CS.RESOURCES.map(r=>`<a class="res" href="${esc(r.url)}" target="_blank" rel="noopener"><b>${esc(r.name)} ${I("ext")}</b><span class="muted small">${esc(r.by)}</span><span class="small">${esc(r.note)}</span></a>`).join("")}</div>`;
}

/* ---------- practice ---------- */
let pMode = "unit", pUnit = 1, run = null, exam = null, examTimer = null, drill = null;
function sampleExam(n){
  const wk = S().exam === "ap" ? "wAP" : "wCLEP", tot = CS.UNITS.reduce((s,u)=>s+u[wk],0);
  const pools = Object.fromEntries(CS.UNITS.map(u=>[u.id, CS.shuffle(CS.QS.filter(q=>q.u===u.id))]));
  let picks = [];
  if (CS.hasPassages) { /* reading exams are built from passage sets (like the real exam), unit by unit, then everything in set order */
    const withP = CS.QS.filter(q=>q.p), base = withP.length >= n*1.5 ? withP : CS.QS;
    CS.UNITS.forEach(u => { const k = Math.round(n*u[wk]/tot); if (k > 0) picks = picks.concat(CS.takeQs(base.filter(q=>q.u===u.id), k)); });
    const have = new Set(picks.map(q=>q.id)); if (picks.length < n) picks = picks.concat(CS.takeQs(base.filter(q=>!have.has(q.id)), n - picks.length));
    picks = CS.setOrder(CS.shuffle(picks));
    /* trim to the exam's length: drop stand-alone questions first, then the tail of the last set */
    for (let i = picks.length - 1; i >= 0 && picks.length > n; i--) if (!picks[i].p) picks.splice(i, 1);
    return picks.slice(0, n).map(CS.prepQ);
  }
  CS.UNITS.forEach(u => { const k = Math.min(pools[u.id].length, Math.round(n*u[wk]/tot)); picks = picks.concat(pools[u.id].splice(0,k)); });
  const rest = CS.shuffle(Object.values(pools).flat()); while (picks.length < n && rest.length) picks.push(rest.pop());
  return CS.shuffle(picks.slice(0,n)).map(CS.prepQ);
}
function weightedMixed(n){
  const wts = CS.UNITS.map(u => ({u, w: 1.4 - (CS.mastery(u.id) ?? 0.4)})), out = [], used = new Set();
  let guard = 0;
  while (out.length < n && guard++ < 500) {
    const tot = wts.reduce((s,x)=>s+x.w,0); let r = Math.random()*tot, pick = wts[0].u;
    for (const x of wts) { r -= x.w; if (r <= 0) { pick = x.u; break; } }
    const pool = CS.QS.filter(q => q.u === pick.id && !used.has(q.id)); if (!pool.length) continue;
    const q = pool[Math.floor(Math.random()*pool.length)];
    const set = q.p ? CS.QS.filter(x => x.p === q.p && !used.has(x.id)) : [q]; set.forEach(x => { used.add(x.id); out.push(CS.prepQ(x)); });
  }
  return out;
}
const EXAMS = CS.C.exams || { ap:{full:{n:60, min:70, name:"Full AP® Section I"}, mini:{n:20, min:23, name:"Mini exam"}}, clep:{full:{n:80, min:90, name:"Full-length CLEP®"}, mini:{n:20, min:23, name:"Mini exam"}} };
const MODES = [
  {k:"unit", ic:"book", e:"By unit", n:"Unit quiz", d:CS.hasPassages ? "About 10 questions in full passage sets, with an explanation for every choice." : "10 questions with an explanation for every choice."},
  {k:"mixed", ic:"spark", e:"Adaptive", n:"Smart review", d:(CS.hasPassages ? "About 15" : "15") + " questions, weighted toward your weakest units."},
  {k:"mistakes", ic:"target", e:"Notebook", n:"Mistakes", d:"Every miss lands here until you get it right twice.", pro:true},
  {k:"exam", ic:"pen", e:"Timed", n:"Practice exam", d:"Full length, real timing, scored like the exam."},
  {k:"drills", ic:"calc", e:"Unlimited", n:"Calculation drills", d:CS.C.drillDesc || (CS.COURSE==="micro" ? "Elasticity, costs, profit, surplus: fresh numbers every time." : "Multipliers, CPI, money creation: fresh numbers every time."), pro:true},
  {k:"graphs", ic:"chart", e:"Visual", n:"Graph questions", d:"Read the scenario, pick the curve that shifts."},
  {k:"draw", ic:"pen", e:"Hands-on", n:"Draw the graph", d:"Drag the curves yourself, like the FRQ section asks you to.", pro:true}
];
if (!CS.hasGraphs()) for (let i = MODES.length - 1; i >= 0; i--) if (["graphs","draw"].includes(MODES[i].k)) MODES.splice(i, 1);
if (!(CS.DRILLS && CS.DRILLS.length)) for (let i = MODES.length - 1; i >= 0; i--) if (MODES[i].k === "drills") MODES.splice(i, 1);
render.practice = (o) => {
  if (o.mode) { pMode = o.mode; run = null; drill = null; drawRun = null; }
  if (o.keepRun) { /* run prepared by caller */ }
  if (o.unit) { pUnit = o.unit; if (o.mode === "unit") run = null; }
  if (exam && !exam.done) return renderExam();
  const v = $("#v-practice"), nm = Object.keys(S().mistakes).length, ex = EXAMS[S().exam];
  v.innerHTML = `
    <div class="page-head"><div class="stack" style="gap:6px"><span class="eyebrow">${esc(examName())}</span><h1>Practice</h1><p class="muted">${CS.QS.length} original multiple-choice questions, ${CS.SHIFTS.length ? `${CS.SHIFTS.length} graph scenarios and ` : ""}unlimited calculation drills.</p>${CS.hasAccess()?"":`<span class="tag" style="align-self:flex-start">${CS.roundsLeft()} of ${CS.FREE_ROUNDS} free quizzes left today · <button class="linklike" data-up="open">unlimited with a plan</button></span>`}</div>
      <button class="btn ghost" data-go="practice" data-mode="diagnostic">${I("target")}${S().diag?"Retake diagnostic":"Take the diagnostic"}</button></div>
    <div class="modes" style="grid-template-columns:repeat(auto-fill,minmax(210px,1fr))">${MODES.map(m=>`<button class="mode" aria-pressed="${pMode===m.k}" data-m="${m.k}"><span class="m-ico">${I(m.ic)}</span>${m.pro?CS.proTag():""}<span class="eyebrow">${m.k==="mistakes"?`${CS.mistakesDue().length} due · ${nm} saved`:m.e}</span><h3>${m.n}</h3><span class="muted small">${m.k==="exam"?`${ex.full.n} questions in ${ex.full.min} minutes, like the real ${examShort()} exam.`:m.d}</span></button>`).join("")}</div>
    <div id="p-body" class="stack" style="gap:16px"></div>`;
  $$("#v-practice .mode").forEach(b => b.onclick = () => { pMode = b.dataset.m; run = null; drill = null; drawRun = null; render.practice({keepScroll:true}); $("#p-body").scrollIntoView({behavior:"smooth", block:"start"}); });
  const body = $("#p-body");
  if (pMode === "diagnostic") return diagnostic(body);
  const mode = MODES.find(x => x.k === pMode);
  if (mode && mode.pro && !CS.hasAccess()) { body.innerHTML = CS.lockPanel(`${mode.n} is a paid feature`, {mistakes:"Every question you miss comes back after 1, 3 and 7 days until it sticks. It's the fastest way to fix weak spots before the exam.", drills:"Fresh numbers every time for every formula on the exam, with step-by-step solutions.", draw:"Drag the curves yourself and get instant feedback, just like the graphing questions on the FRQ section."}[mode.k] || ""); return; }
  const limit = el => { el.innerHTML = CS.lockPanel("You've used today's free quizzes", `Free includes ${CS.FREE_ROUNDS} quizzes a day. Unlock unlimited quizzes, full practice exams and every game.`); };
  if (pMode === "unit") {
    body.innerHTML = `<div class="chips">${CS.UNITS.map(u=>`<button class="chip" aria-pressed="${u.id===pUnit}" data-u="${u.id}">Unit ${u.id} · ${esc(u.short)} · ${CS.pct(CS.mastery(u.id))}</button>`).join("")}</div><div class="panel" id="p-run"></div>`;
    $$("#p-body [data-u]").forEach(b => b.onclick = () => { pUnit = +b.dataset.u; run = null; render.practice({keepScroll:true}); });
    if (!run) { if (!CS.takeRound()) return limit($("#p-run")); run = {qs: CS.takeQs(CS.QS.filter(q=>q.u===pUnit),10).map(CS.prepQ), i:0, score:0, picked:null, kind:"unit", unit:pUnit}; }
    return quiz($("#p-run"));
  }
  if (pMode === "mixed") { body.innerHTML = `<div class="panel" id="p-run"></div>`; if (!run) { if (!CS.takeRound()) return limit($("#p-run")); run = {qs: weightedMixed(15), i:0, score:0, picked:null, kind:"mixed"}; } return quiz($("#p-run")); }
  if (pMode === "graphs") {
    body.innerHTML = `<div class="panel" id="p-run"></div>`;
    if (!run) { if (!CS.takeRound()) return limit($("#p-run")); run = {qs: CS.shuffle(CS.SHIFTS).slice(0,10).map(CS.graphQ), i:0, score:0, picked:null, kind:"graphs"}; }
    return quiz($("#p-run"));
  }
  if (pMode === "mistakes") {
    const all = Object.keys(S().mistakes), due = CS.mistakesDue();
    const ids = due.length ? due : (run && run.all ? all : []);
    if (!due.length && all.length && !run) { body.innerHTML = `<div class="panel"><h3>Nothing due right now.</h3><p class="muted">You have ${all.length} saved mistake${all.length===1?"":"s"}. Each one comes back 1, 3 and 7 days after you miss it, and clears after three correct answers in a row. That spacing is what makes it stick.</p><div class="row-wrap"><button class="btn sm" id="m3">Review all ${all.length} anyway</button><button class="btn ghost sm" id="m2b">Do a smart review</button></div></div>`;
      $("#m3").onclick = () => { run = {qs: CS.setOrder(CS.shuffle(all).slice(0,15).map(id=>CS.QBYID[id]).filter(Boolean)).map(CS.prepQ), i:0, score:0, picked:null, kind:"mistakes", all:true}; render.practice({keepScroll:true}); };
      $("#m2b").onclick = () => { pMode = "mixed"; run = null; render.practice({keepScroll:true}); }; return; }
    if (!ids.length && !run) { body.innerHTML = `<div class="panel"><h3>Your notebook is empty.</h3><p class="muted">Any question you miss is saved here and comes back after 1, 3 and 7 days until you get it right three times.</p><div><button class="btn sm" id="m2">Do a smart review</button></div></div>`;
      $("#m2").onclick = () => { pMode = "mixed"; run = null; render.practice({keepScroll:true}); }; return; }
    body.innerHTML = `<div class="panel" id="p-run"></div>`;
    if (!run) run = {qs: CS.setOrder(CS.shuffle(ids).slice(0,15).map(id=>CS.QBYID[id]).filter(Boolean)).map(CS.prepQ), i:0, score:0, picked:null, kind:"mistakes"};
    return quiz($("#p-run"));
  }
  if (pMode === "drills") return drills(body);
  if (pMode === "draw") return drawMode(body);
  if (pMode === "exam") {
    const past = S().exams.filter(e=>e.exam===S().exam).slice(-5).reverse();
    body.innerHTML = `<div class="panel">
      <h3>${esc(examName())} practice exam</h3>
      <p class="muted" style="max-width:70ch">${S().exam==="ap" ? (CS.C.apExamText || "The real exam has 60 multiple-choice questions in 70 minutes (about two-thirds of your score), then 3 free-response questions in 60 minutes. Practice FRQs in the Free response tab.") : `The real exam has ${CS.C.clepQ || (CS.C.clepOnly ? "about 100" : "about 80")} multiple-choice questions in 90 minutes. Many colleges award credit for a score of 50. There's no free-response section.`} Questions are drawn in proportion to the official unit weights. No feedback until you submit.</p>
      <div class="row-wrap"><button class="btn" id="ex-full">${CS.hasAccess()?"":I("lock")}Start full exam · ${ex.full.n} Q · ${ex.full.min} min</button><button class="btn ghost" id="ex-mini">Mini exam · ${ex.mini.n} Q · ${ex.mini.min} min</button></div>
      ${past.length?`<div class="stack" style="gap:6px"><span class="eyebrow">Recent attempts</span>${past.map(e=>`<div class="spread small"><span>${new Date(e.at).toLocaleDateString()} · ${e.n} questions</span><span><b>${e.score}/${e.n}</b> · ${Math.round(e.score/e.n*100)}%</span></div>`).join("")}</div>`:""}
    </div>`;
    $("#ex-full").onclick = () => CS.hasAccess() ? startExam(ex.full) : CS.openUpgrade("exam"); $("#ex-mini").onclick = () => startExam(ex.mini);
  }
};

/* instant-feedback quiz runner */
function quiz(p){
  const r = run, qs = r.qs;
  if (r.i >= qs.length) {
    if (!r.finished) { r.finished = true; markTask("quiz"); if (r.kind==="mistakes") markTask("mist"); CS.addXP(10 + (r.score===qs.length?20:0)); CS.refresh(); if (r.score===qs.length) CS.toast("Perfect round! +20 bonus XP"); if (CS.milestone) setTimeout(() => CS.milestone("quiz"), 2500); }
    const u = r.unit ? CS.UNITS[r.unit-1] : null;
    p.innerHTML = `<span class="eyebrow">${u?`Unit ${u.id} complete`:r.kind==="mistakes"?"Notebook review complete":r.kind==="graphs"?"Graph round complete":"Smart review complete"}</span>
      <div class="result-big">${r.score}/${qs.length}</div>
      <p class="muted">${u?`Unit mastery is now ${CS.pct(CS.mastery(u.id))}.`:`${Object.keys(S().mistakes).length} questions left in your mistakes notebook.`}</p>
      <div class="row-wrap"><button class="btn" id="q-again">Go again</button>${u?`<button class="btn ghost" data-go="games" data-game="boss" data-unit="${u.id}">Fight the boss</button><button class="btn ghost" data-go="learn" data-unit="${u.id}">Review the guide</button>`:""}<button class="btn ghost" data-go="home">Dashboard</button></div>`;
    $("#q-again").onclick = () => { run = null; render.practice({keepScroll:true}); };
    return;
  }
  const q = qs[r.i], done = r.picked != null;
  p.innerHTML = `<div class="spread"><span class="eyebrow">Unit ${q.u} · ${esc(CS.UNITS[q.u-1].short)}</span><span class="eyebrow">${r.i+1} / ${qs.length} · ${r.score} correct${r.combo>=3?` · ${r.combo} in a row`:""}</span></div>
    <div class="progress"><i style="width:${(r.i+(done?1:0))/qs.length*100}%"></i></div>
    ${q.mk?`<div class="lab" style="max-width:380px">${CS.market(q.mk).svg}</div>`:""}
    ${CS.qText(q)}
    <div class="opts">${q.opts.map((o,j)=>{ const cls = done ? (o.ok?"right":(j===r.picked?"wrong":"")) : "";
      return `<button class="opt ${cls}" data-j="${j}" ${done?"disabled":""}><span class="k">${L[j]}</span><span>${esc(o.t)}</span>${done&&(o.ok||j===r.picked)?`<span class="why">${esc(o.w)}</span>`:""}</button>`; }).join("")}</div>
    ${done?`${q.id[0]==="q"?`<details class="small"><summary class="muted">Why the other choices are wrong</summary><ul style="margin:8px 0 0;padding-left:1.2em">${q.opts.filter((o,j)=>!o.ok&&j!==r.picked).map(o=>`<li><b>${esc(o.t)}:</b> ${esc(o.w)}</li>`).join("")}</ul></details>`:""}
      ${CS.whyChips ? CS.whyChips(q, r.picked != null && !q.opts[r.picked].ok) : ""}
      <div class="row-wrap"><button class="btn" id="q-next">${r.i+1<qs.length?"Next question":"See results"} <span class="kbd" style="color:inherit;border-color:currentColor">Enter</span></button>${CS.SOON.ai ? `<button class="btn ghost" disabled title="Coming soon">${I("spark")}AI tutor · coming soon</button>` : `<button class="btn ghost" id="q-tutor">${I("spark")}Explain it differently</button>`}</div><div id="q-tutor-box"></div>`:`<p class="faint small kbd-hint">Press <span class="kbd">1</span>–<span class="kbd">5</span> to answer.</p>`}`;
  if (!done) $$(".opt", p).forEach(b => b.onclick = () => pick(+b.dataset.j));
  else { $("#q-next").onclick = next; $("#q-next").focus({preventScroll:true}); if ($("#q-tutor")) $("#q-tutor").onclick = () => CS.tutor($("#q-tutor-box"), {q:q.q, options:q.opts.map(o=>o.t), correct:q.opts.find(o=>o.ok).t, picked:q.opts[r.picked].t, why:q.opts.find(o=>o.ok).w}); }
  function pick(j){ r.picked = j; const ok = q.opts[j].ok; if (ok) { r.score++; r.combo = (r.combo||0)+1; } else r.combo = 0; CS.record(q, ok); CS.refresh(); quiz(p); }
  function next(){ r.i++; r.picked = null; quiz(p); }
  r.key = e => { if (r.picked == null && ["1","2","3","4","5"].includes(e.key)) pick(+e.key-1); else if (r.picked != null && e.key === "Enter") { e.preventDefault(); next(); } };
}
document.addEventListener("keydown", e => {
  if (current !== "practice" || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || $(".modal-wrap")) return;
  if (exam && !exam.done) { if (["1","2","3","4","5"].includes(e.key)) { exam.ans[exam.i] = +e.key-1; renderExam(); } return; }
  if (run && run.key && !run.finished && $("#p-run")) run.key(e);
});

/* calculation drills (numeric input) */
function drills(body){
  if (!drill) drill = {type:"all", n:0, right:0, cur:null, answered:false};
  const pickGen = () => { const pool = drill.type==="all" ? CS.DRILLS : CS.DRILLS.filter(d=>d.k===drill.type); const g = pool[Math.floor(Math.random()*pool.length)]; return {...g.gen(), u:g.u, name:g.n}; };
  if (!drill.cur) drill.cur = pickGen();
  const c = drill.cur;
  body.innerHTML = `<div class="chips"><button class="chip" aria-pressed="${drill.type==="all"}" data-t="all">Mixed</button>${CS.DRILLS.map(d=>`<button class="chip" aria-pressed="${drill.type===d.k}" data-t="${d.k}">${esc(d.n)}</button>`).join("")}</div>
    <div class="panel">
      <div class="spread"><span class="eyebrow">${esc(c.name)} · Unit ${c.u}</span><span class="eyebrow">${drill.right}/${drill.n} correct this session</span></div>
      <p class="qtext">${esc(c.q)}</p>
      <form class="numin" id="dr-form" autocomplete="off"><input id="dr-in" inputmode="decimal" placeholder="Your answer" aria-label="Your answer" ${drill.answered?"disabled":""}>
        <span class="muted small">${c.unit==="$B"?"in $ billions":c.unit==="$M"?"in $ millions":c.unit==="%"?"in %":c.unit==="¥"?"in yen":c.unit==="$"?"in dollars":""}</span>
        ${drill.answered?"":`<button class="btn" type="submit">Check</button><button class="btn ghost" type="button" id="dr-show">Show me</button>`}</form>
      <div id="dr-fb"></div>
    </div>`;
  $$("#p-body [data-t]").forEach(b => b.onclick = () => { drill.type = b.dataset.t; drill.cur = null; drill.answered = false; drills(body); });
  const fb = $("#dr-fb");
  if (!drill.answered) $("#dr-in").focus({preventScroll:true});
  $("#dr-form").onsubmit = e => { e.preventDefault(); const val = $("#dr-in").value.trim(); if (!val) return; finish(CS.numOK(val, c.ans), val); };
  const sh = $("#dr-show"); if (sh) sh.onclick = () => finish(false, null);
  function finish(ok, val){
    drill.answered = true; drill.n++; if (ok) drill.right++;
    CS.record({u:c.u}, ok); CS.refresh();
    const cu = typeof c.unit==="string" ? c.unit : "";
    const unitTxt = cu==="%"?"%":cu==="¥"?" yen":"";
    const ansTxt = (cu.startsWith("$")?"$":"") + c.ans.toLocaleString() + (cu==="$B"?" billion":cu==="$M"?" million":unitTxt);
    drills(body);
    $("#dr-fb").innerHTML = `<div class="feedback ${ok?"good":"bad"}"><b>${ok?"Correct.":val==null?"Here's how it works.":`Not quite. You said ${esc(val)}.`}</b> Answer: <b>${esc(ansTxt)}</b>. ${esc(c.work)}</div>
      <div style="margin-top:12px"><button class="btn" id="dr-next">Next problem <span class="kbd" style="color:inherit;border-color:currentColor">Enter</span></button></div>`;
    $("#dr-next").onclick = nextQ; $("#dr-next").focus({preventScroll:true});
  }
  function nextQ(){ drill.cur = null; drill.answered = false; drills(body); }
}

/* draw-the-graph practice */
let drawRun = null;
function drawMode(body){
  if (!drawRun) drawRun = {deck: CS.shuffle(CS.SHIFTS).slice(0,8), i:0, right:0};
  const r = drawRun;
  if (r.i >= r.deck.length) {
    body.innerHTML = `<div class="panel"><span class="eyebrow">Draw the graph · results</span><div class="result-big">${r.right}/${r.deck.length}</div><p class="muted">Graphs drawn correctly. On the AP® exam, a correctly labeled graph is often worth several FRQ points.</p><div class="row-wrap"><button class="btn" id="dw-again">Draw 8 more</button><button class="btn ghost" data-go="frq">Try an FRQ</button></div></div>`;
    if (!r.done) { r.done = true; CS.addXP(10 + r.right*5); markTask("quiz"); CS.refresh(); }
    $("#dw-again").onclick = () => { drawRun = null; drawMode(body); }; return;
  }
  const [mk, text, ok, why] = r.deck[r.i], m = CS.MARKETS[mk];
  body.innerHTML = `<div class="panel"><div class="spread"><span class="eyebrow">Draw the graph · ${r.i+1} of ${r.deck.length} · ${esc(m.name)}</span><span class="eyebrow">${r.right} correct</span></div>
    <div class="progress"><i style="width:${r.i/r.deck.length*100}%"></i></div>
    <p class="qtext">${esc(text)} Show the effect on the graph.</p><div id="dw-host" style="max-width:520px"></div><div id="dw-next"></div></div>`;
  CS.drawGraph($("#dw-host"), mk, {expect:ok, why, onDone:(good)=>{ if (good) r.right++; CS.record({u:CS.mkUnit(mk)}, good); CS.refresh();
    $("#dw-next").innerHTML = `<button class="btn" id="dw-n">${r.i+1<r.deck.length?"Next graph":"See results"}</button>`; $("#dw-n").onclick = () => { r.i++; drawMode(body); }; }});
}

/* diagnostic */
let D = null;
function diagnostic(body){
  const DN = CS.UNITS.length * 2, DMIN = Math.round(DN * 0.8);
  body.innerHTML = `<div class="panel" id="p-run"></div>`; const p = $("#p-run");
  if (!D) {
    const last = S().diag;
    p.innerHTML = `<span class="eyebrow">Diagnostic · ${DN} questions · about ${DMIN} minutes</span><h2>Find your weak units</h2>
      <p style="max-width:62ch">Two questions from each unit, no hints until the end. Your results set your mastery levels, your study plan and your score estimate.</p>
      ${last?`<p class="muted">Last taken ${esc(new Date(last.at).toLocaleDateString())}: <b>${last.score}/${last.n||DN}</b>.</p>`:""}
      <div><button class="btn lg" id="d-start">${last?"Retake diagnostic":"Start diagnostic"}</button></div>`;
    const begin = () => { D = {i:0, picks:[], qs: CS.UNITS.flatMap(u=>CS.takeQs(CS.QS.filter(q=>q.u===u.id),2)).map(CS.prepQ)}; diagnostic(body); };
    /* guests are asked to make a free account first so their results and study plan are saved */
    $("#d-start").onclick = () => CS.beforeDiag ? CS.beforeDiag(begin) : begin();
    if (CS._diagAuto) { CS._diagAuto = false; begin(); }
    return;
  }
  if (D.i < D.qs.length) {
    const q = D.qs[D.i];
    p.innerHTML = `<div class="spread diag-run"><span class="eyebrow">Question ${D.i+1} of ${D.qs.length} · Unit ${q.u}</span></div>
      <div class="progress"><i style="width:${D.i/D.qs.length*100}%"></i></div>${CS.qText(q)}
      <div class="opts">${q.opts.map((o,j)=>`<button class="opt" data-j="${j}"><span class="k">${L[j]}</span><span>${esc(o.t)}</span></button>`).join("")}</div>`;
    $$(".opt", p).forEach(b => b.onclick = () => { D.picks.push(+b.dataset.j); D.i++; diagnostic(body); });
    return;
  }
  const by = {}; let score = 0;
  D.qs.forEach((q,i)=>{ const ok = q.opts[D.picks[i]].ok; if (ok) score++; (by[q.u]=by[q.u]||[]).push(ok); });
  if (!D.saved) { D.qs.forEach((q,i)=>CS.record(q, q.opts[D.picks[i]].ok)); S().diag = {at:Date.now(), score, n:D.qs.length}; markTask("diag"); markTask("quiz"); CS.addXP(20); CS.refresh(); D.saved = true; }
  const missed = D.qs.map((q,i)=>({q, pick:D.picks[i]})).filter(x=>!x.q.opts[x.pick].ok);
  p.innerHTML = `<div class="row-wrap" style="gap:24px;align-items:end"><div><span class="eyebrow">Your score</span><div class="result-big">${score}/${D.qs.length}</div></div>
      <div class="row-wrap"><button class="btn" data-go="plan">See my study plan</button><button class="btn ghost" id="d-again">Retake</button></div></div>
    <div class="rows">${CS.UNITS.map(u=>{ const c=(by[u.id]||[]).filter(Boolean).length; return `<div class="row"><span>${u.id}. ${esc(u.name)}</span>${meter(c/2)}<span><b>${c}/2</b></span></div>`; }).join("")}</div>
    ${missed.length?`<h3>Review what you missed</h3>`+missed.map(({q,pick})=>{ const c = q.opts.find(o=>o.ok); return `<div class="stack" style="gap:6px;border-top:1px solid var(--rule);padding-top:12px">
      <span class="eyebrow">Unit ${q.u}</span>${q.p?CS.passageHTML(q.p,{compact:true}):""}<p>${esc(q.q)}</p><p style="color:var(--bad)">You chose: ${esc(q.opts[pick].t)}. ${esc(q.opts[pick].w)}</p>
      <p style="color:var(--good)">Answer: ${esc(c.t)}. ${esc(c.w)}</p></div>`; }).join(""):`<p>Perfect score. Try a practice exam next.</p>`}`;
  $("#d-again").onclick = () => { D = null; diagnostic(body); };
}

/* timed exam */
function startExam(cfg){ exam = {qs: sampleExam(cfg.n), i:0, ans:{}, flags:{}, end: Date.now()+cfg.min*60e3, name:cfg.name, done:false}; renderExam(); }
function fmt(ms){ const s = Math.max(0, Math.round(ms/1000)); return Math.floor(s/60)+":"+String(s%60).padStart(2,"0"); }
function tick(){
  if (!exam || exam.done) { clearInterval(examTimer); examTimer = null; return; }
  const left = exam.end - Date.now(), el = $("#ex-timer");
  if (el) { el.textContent = fmt(left); el.classList.toggle("low", left < 5*60e3); }
  if (left <= 0) submitExam();
}
function renderExam(){
  const v = $("#v-practice"), q = exam.qs[exam.i], n = exam.qs.length, answered = Object.keys(exam.ans).length;
  v.innerHTML = `<div class="exam-top"><div><span class="eyebrow">${esc(exam.name)} · ${esc(examShort())}</span><div class="small"><b>${answered}/${n}</b> answered</div></div>
      <div class="row-wrap"><span class="timer" id="ex-timer">${fmt(exam.end-Date.now())}</span><button class="btn sm" id="ex-submit">Submit</button></div></div>
    <div class="guide" style="grid-template-columns:minmax(0,1fr) 260px">
      <div class="panel">
        <div class="spread"><span class="eyebrow">Question ${exam.i+1} of ${n}</span><button class="chip" id="ex-flag" aria-pressed="${!!exam.flags[exam.i]}">${exam.flags[exam.i]?"Flagged":"Flag for review"}</button></div>
        ${CS.qText(q)}
        <div class="opts">${q.opts.map((o,j)=>`<button class="opt ${exam.ans[exam.i]===j?"sel":""}" data-j="${j}"><span class="k">${L[j]}</span><span>${esc(o.t)}</span></button>`).join("")}</div>
        <div class="row-wrap"><button class="btn ghost sm" id="ex-prev" ${exam.i===0?"disabled":""}>← Previous</button><button class="btn sm" id="ex-next" ${exam.i===n-1?"disabled":""}>Next →</button></div>
      </div>
      <div class="panel"><span class="eyebrow">Question map</span><div class="qgrid">${exam.qs.map((_,i)=>`<button class="${exam.ans[i]!=null?"ans":""} ${exam.flags[i]?"flag":""} ${i===exam.i?"cur":""}" data-i="${i}" aria-label="Question ${i+1}">${i+1}</button>`).join("")}</div>
        <p class="muted small">Purple: answered. Orange underline: flagged.</p></div>
    </div>`;
  $$(".opt", v).forEach(b => b.onclick = () => { exam.ans[exam.i] = +b.dataset.j; renderExam(); });
  $$(".qgrid button", v).forEach(b => b.onclick = () => { exam.i = +b.dataset.i; renderExam(); });
  $("#ex-prev").onclick = () => { exam.i--; renderExam(); };
  $("#ex-next").onclick = () => { exam.i++; renderExam(); };
  $("#ex-flag").onclick = () => { exam.flags[exam.i] = !exam.flags[exam.i]; renderExam(); };
  $("#ex-submit").onclick = () => { const left = n - Object.keys(exam.ans).length, btn = $("#ex-submit");
    if (left && btn.dataset.confirm !== "1") { btn.dataset.confirm = "1"; btn.textContent = `${left} unanswered. Submit anyway?`; return; } submitExam(); };
  if (!examTimer) examTimer = setInterval(tick, 1000);
}
function submitExam(){
  exam.done = true; clearInterval(examTimer); examTimer = null;
  let score = 0; const by = {};
  exam.qs.forEach((q,i)=>{ const a = exam.ans[i]; const ok = a!=null && q.opts[a].ok; if (ok) score++; const b = by[q.u]||(by[q.u]={c:0,t:0}); b.t++; if (ok) b.c++; CS.record(q, ok, false); });
  S().exams.push({at:Date.now(), exam:S().exam, score, n:exam.qs.length}); CS.addXP(score*8 + 40); markTask("quiz"); CS.refresh();
  const p = score/exam.qs.length;
  const est = S().exam==="ap" ? `Estimated AP® score from this section: ${p>=0.72?5:p>=0.58?4:p>=0.45?3:p>=0.32?2:1} (rough, multiple choice only).` : `Estimated CLEP® score: ${Math.max(20,Math.min(80,Math.round(20+60*p)))} (rough; 50 is the usual credit score).`;
  const v = $("#v-practice"), done = exam;
  v.innerHTML = `<div class="panel"><span class="eyebrow">${esc(done.name)} results</span>
    <div class="row-wrap" style="gap:24px;align-items:end"><div class="result-big">${score}/${done.qs.length}</div><p class="muted" style="max-width:48ch">${esc(est)} You earned ${score*8+40} XP.</p></div>
    <div class="rows">${CS.UNITS.filter(u=>by[u.id]).map(u=>`<div class="row"><span>${u.id}. ${esc(u.name)}</span>${meter(by[u.id].c/by[u.id].t)}<span><b>${by[u.id].c}/${by[u.id].t}</b></span></div>`).join("")}</div>
    <div class="row-wrap"><button class="btn" id="ex-review">Review answers</button><button class="btn ghost" id="ex-back">Back to practice</button></div></div>
    <div id="ex-rev" class="stack" hidden></div>`;
  $("#ex-back").onclick = () => { exam = null; render.practice({}); };
  $("#ex-review").onclick = () => { const el = $("#ex-rev"); el.hidden = false;
    el.innerHTML = done.qs.map((q,i)=>{ const a = done.ans[i], c = q.opts.find(o=>o.ok), ok = a!=null && q.opts[a].ok;
      return `<div class="panel" style="gap:8px"><div class="spread"><span class="eyebrow">Question ${i+1} · Unit ${q.u}</span><span class="tag ${ok?"good":"bad"}">${ok?"Correct":a==null?"Blank":"Missed"}</span></div>
      ${q.p?CS.passageHTML(q.p,{compact:true}):""}<p>${esc(q.q)}</p>${!ok&&a!=null?`<p style="color:var(--bad)">You chose: ${esc(q.opts[a].t)}. ${esc(q.opts[a].w)}</p>`:""}<p style="color:var(--good)">Answer: ${esc(c.t)}. ${esc(c.w)}</p></div>`; }).join("");
    el.scrollIntoView({behavior:"smooth"}); };
}

/* ---------- flashcards ---------- */
CS.cardFilter = "due"; let flipped = false;
const cs = id => S().cards[id] || {due:0, int:0, ease:2.5, reps:0};
function cardList(){
  const now = Date.now(), f = CS.cardFilter;
  let pool = CS.CARDS.filter(c => f==="due" || f==="all" || c.u===f);
  if (f === "due") pool = pool.filter(c => cs(c.id).due <= now);
  else pool = pool.filter(c=>cs(c.id).due<=now).concat(pool.filter(c=>cs(c.id).due>now));
  return pool.sort((a,b)=>cs(a.id).due-cs(b.id).due);
}
function nextInt(st, g){
  if (g === 0) return 0;
  if (st.reps === 0) return [0,1,1,4][g];
  if (g === 1) return Math.max(1, Math.round(st.int*1.2));
  if (g === 2) return Math.max(st.reps===1?3:1, Math.round(st.int*st.ease));
  return Math.max(4, Math.round(st.int*st.ease*1.3));
}
const fmtInt = d => d===0 ? "<1 min" : d===1 ? "1 day" : d<30 ? d+" days" : Math.round(d/30)+" mo";
render.cards = () => {
  const v = $("#v-cards"), opts = [["due","Due now"],["all","All cards"]].concat(CS.UNITS.map(u=>[u.id,"Unit "+u.id]));
  const list = cardList(), c = list[0], now = Date.now();
  const due = CS.CARDS.filter(x=>cs(x.id).due<=now).length, learned = CS.CARDS.filter(x=>cs(x.id).int>=1).length, mature = CS.CARDS.filter(x=>cs(x.id).int>=21).length;
  v.innerHTML = `<div class="page-head"><div class="stack" style="gap:6px"><span class="eyebrow">Spaced repetition</span><h1>Flashcards</h1><p class="muted">${CS.CARDS.length} key terms. Rate each card honestly and the deck schedules itself, showing hard cards often and easy ones rarely.</p></div></div>
    <div class="chips">${opts.map(([k,t])=>`<button class="chip" aria-pressed="${k===CS.cardFilter}" data-v="${k}">${t}</button>`).join("")}</div>
    <div class="deck"><div class="stack" id="card-stage"></div>
      <aside class="panel"><span class="eyebrow">Your deck</span>
        <div class="stat"><span>Due now</span><b>${due}</b></div>
        <div class="stat"><span>Learned</span><b>${learned} / ${CS.CARDS.length}</b></div>
        <div class="stat"><span>Mastered (21+ days)</span><b>${mature}</b></div>
        <div class="stat"><span>Total reviews</span><b>${S().reviews}</b></div>
        ${meter(learned/CS.CARDS.length,"mint")}
        <p class="muted small"><span class="kbd">Space</span> flips the card. <span class="kbd">1</span>–<span class="kbd">4</span> rate it.</p></aside></div>`;
  $$("#v-cards [data-v]").forEach(b => b.onclick = () => { const k = b.dataset.v; CS.cardFilter = isNaN(+k) ? k : +k; flipped = false; render.cards(); });
  const stage = $("#card-stage");
  if (!c) { stage.innerHTML = `<div class="panel"><h3>All caught up.</h3><p class="muted">No cards are due. Pick a unit above to study ahead, or play Match-up.</p><div><button class="btn sm" data-go="games" data-game="match">Play Match-up</button></div></div>`; return; }
  const st = cs(c.id);
  stage.innerHTML = `<button class="card ${flipped?"flipped":""}" id="card" aria-label="Flashcard. ${flipped?"Showing definition":"Showing term"}. Press to flip.">
      <div class="card-inner"><div class="face"><span class="eyebrow">Unit ${c.u} · term</span><div class="term">${esc(c.front)}</div><span class="faint small">Tap or press space to flip</span></div>
      <div class="face back"><span class="eyebrow">${esc(c.front)}</span><p style="font-size:1.15rem;font-weight:600">${esc(c.back)}</p></div></div></button>
    <div class="rate" ${flipped?"":"hidden"}>${["Again","Hard","Good","Easy"].map((t,g)=>`<button data-g="${g}">${t}<small>${fmtInt(nextInt(st,g))}</small></button>`).join("")}</div>
    <p class="faint small">${list.length} in this stack</p>`;
  $("#card").onclick = () => { flipped = !flipped; render.cards(); };
  $$(".rate button", stage).forEach(b => b.onclick = () => {
    const g = +b.dataset.g, d = nextInt(st, g);
    S().cards[c.id] = {...st, int:d, reps:g===0?0:st.reps+1, ease:Math.max(1.3, st.ease+[-0.2,-0.15,0,0.15][g]), due: d===0 ? Date.now()+60e3 : Date.now()+d*CS.DAY};
    S().reviews++; CS.addXP(3);
    const tk = S().tasks[CS.today()] || (S().tasks[CS.today()] = {}); tk.rev = (tk.rev||0)+1;
    const left = CS.CARDS.filter(x=>cs(x.id).due<=Date.now()).length;
    if (left === 0 || tk.rev >= 15) markTask("cards");
    CS.refresh(); flipped = false; render.cards();
  });
};
document.addEventListener("keydown", e => {
  if (current !== "cards" || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || $(".modal-wrap")) return;
  if (e.code === "Space") { e.preventDefault(); flipped = !flipped; render.cards(); }
  if (flipped && ["1","2","3","4","5"].includes(e.key)) { const b = $(`.rate button[data-g="${+e.key-1}"]`); if (b) b.click(); }
});

/* ---------- FRQ ---------- */
let frqId = null, frqClock = null, frqTick = 0;
render.frq = () => {
  const v = $("#v-frq"), f = CS.FRQS.find(x=>x.id===frqId) || CS.FRQS[0]; frqId = f.id;
  const st = S().frq[f.id] || (S().frq[f.id] = {draft:"", show:false, checks:f.rubric.map(()=>false)});
  if (st.checks.length !== f.rubric.length) st.checks = f.rubric.map(()=>false);
  const got = st.checks.filter(Boolean).length, G = (window.CS_FRQ_GRAPHS||{})[f.id];
  const frqLocked = x => !CS.hasAccess() && CS.FRQS.indexOf(x) >= CS.FREE_FRQS;
  v.innerHTML = `<div class="page-head"><div class="stack" style="gap:6px"><span class="eyebrow">${S().exam==="ap"?(CS.C.frqHead||"AP® Section II · 1 long + 2 short · 60 minutes"):"Builds deep understanding"}</span><h1>Free response</h1>
      <p class="muted">${CS.FRQS.length} original prompts with point-by-point rubrics. ${S().exam==="clep"?"The CLEP® exam has no free-response section, but writing explanations is the fastest way to find gaps.":"For real past exam questions, see Learn → Official resources."}</p></div></div>
    <div class="split"><nav class="sidelist">${CS.FRQS.map((x,i)=>{ const s2 = S().frq[x.id]; const n = s2&&s2.scored?s2.checks.filter(Boolean).length:null;
        return `<button aria-current="${x.id===frqId}" data-f="${x.id}"><span class="num">${frqLocked(x)?I("lock"):i+1}</span><span>${esc(x.title)}<br><span class="faint tiny">${x.kind}${n!=null?` · ${n}/${x.rubric.length}`:""}</span></span></button>`; }).join("")}</nav>
      <article class="panel">
        <div class="row-wrap">${f.units.map(u=>`<span class="tag">Unit ${u}</span>`).join("")}<span class="tag acc">${f.kind} · ${f.rubric.length} points · ~${f.minutes} min</span></div>
        <h2>${esc(f.title)}</h2>${String(f.prompt).split(/\n\s*\n/).map(x=>`<p>${esc(x)}</p>`).join("")}
        ${f.passage ? CS.passageHTML(f.passage) : ""}
        ${f.sources ? `<div class="srcs"><div class="srcs-tabs" role="tablist">${f.sources.map((x,i)=>`<button role="tab" class="srcs-tab" data-src="${i}" aria-selected="${i===0}">Source ${String.fromCharCode(65+i)}</button>`).join("")}</div>${f.sources.map((x,i)=>`<div class="srcs-pane" data-pane="${i}" ${i?"hidden":""}><p class="srcs-cite"><b>Source ${String.fromCharCode(65+i)}</b> · ${esc(x.t)}</p>${String(x.x).split(/\n\s*\n/).map(y=>`<p>${esc(y)}</p>`).join("")}</div>`).join("")}</div>` : ""}
        ${f.essay ? `<div class="sample"><span class="eyebrow">How to plan it</span><ol style="margin:6px 0 0;padding-left:1.2em">${f.parts.map(x=>`<li>${esc(x)}</li>`).join("")}</ol></div>` : `<ol class="parts" type="a">${f.parts.map(x=>`<li>${esc(x)}</li>`).join("")}</ol>`}
        ${G?`<div class="stack" style="gap:8px"><span class="eyebrow">Graph task</span><p><b>${esc(G.task)}</b></p><div id="frq-graph" style="max-width:520px"></div></div>`:""}
        ${f.essay ? `<div class="spread"><label for="frq-draft" class="eyebrow">Your essay</label><span class="row-wrap" style="gap:10px"><span class="tiny muted" id="frq-wc">${(st.draft.match(/\S+/g)||[]).length} words</span><button class="btn ghost sm" id="frq-timer">${I("clock")}<span id="frq-tleft">Start ${f.minutes}:00 timer</span></button></span></div>` : `<label for="frq-draft" class="eyebrow">Your written answer</label>`}
        <textarea id="frq-draft" class="${f.essay?"essay":""}" placeholder="${f.essay?"Open with your thesis: one or two sentences that answer the prompt with a clear line of reasoning. Then build body paragraphs: evidence first, then explain how it supports your claim.":"(a) ...&#10;(b) ...&#10;Sketch graphs on paper, then describe them here."}">${esc(st.draft)}</textarea>
        <div class="row-wrap">${CS.SOON.ai ? `<button class="btn ghost" disabled title="Coming soon">${I("spark")}AI feedback · coming soon</button>` : `<button class="btn" id="frq-ai">${I("spark")}Get AI feedback</button>`}${f.essay?"":`<button class="btn ghost" id="frq-quick" title="Free. Matches each rubric point against what you wrote.">Quick check (free)</button>`}<button class="btn ${CS.SOON.ai ? "" : "ghost"}" id="frq-toggle">${st.show?"Hide rubric":"Score it myself"}</button></div>
        <div id="frq-ai-out"></div>
        <div ${st.show?"":"hidden"} class="stack" style="gap:14px">
          <div class="spread"><h3>Rubric: check each point you earned</h3><b id="frq-score">${got} / ${f.rubric.length}</b></div>
          <div class="rubric">${f.rubric.map((r,i)=>`<label for="rb-${f.id}-${i}"><input type="checkbox" id="rb-${f.id}-${i}" data-i="${i}" ${st.checks[i]?"checked":""}><span>${esc(r)}</span></label>`).join("")}</div>
          <div class="sample"><span class="eyebrow">${f.essay?"Sample high-scoring essay":"Sample full-credit answer"}</span>${String(f.sample).split(/\n\s*\n/).map((x,i)=>`<p style="margin-top:${i?10:6}px">${esc(x)}</p>`).join("")}</div>
        </div>
      </article></div>`;
  $$("#v-frq [data-f]").forEach(b => b.onclick = () => { frqId = b.dataset.f; render.frq(); });
  if (frqLocked(f)) { $("#v-frq article.panel").outerHTML = CS.lockPanel(`"${f.title}" is a paid FRQ`, `Free includes the first ${CS.FREE_FRQS} free-response questions. Unlock all ${CS.FRQS.length}, each with a point-by-point rubric and a sample full-credit answer.`); return; }
  $("#frq-draft").oninput = e => { st.draft = e.target.value; CS.save(); const wc = $("#frq-wc"); if (wc) wc.textContent = `${(st.draft.match(/\S+/g)||[]).length} words`; };
  $$("#v-frq .srcs-tab").forEach(b => b.onclick = () => { $$("#v-frq .srcs-tab").forEach(x => x.setAttribute("aria-selected", x === b)); $$("#v-frq .srcs-pane").forEach(x => x.hidden = x.dataset.pane !== b.dataset.src); });
  if ($("#frq-timer")) { const tb = $("#frq-timer"), show = () => { const t = $("#frq-tleft"); if (!t) return; if (!frqClock || frqClock.id !== f.id) { t.textContent = `Start ${f.minutes}:00 timer`; return; }
      const left = Math.max(0, Math.round((frqClock.end - Date.now())/1000)); t.textContent = left ? `${Math.floor(left/60)}:${String(left%60).padStart(2,"0")} left · stop` : "Time's up"; if (!left) { clearInterval(frqClock.t); } };
    clearInterval(frqTick); frqTick = setInterval(() => { if (!$("#frq-tleft")) return clearInterval(frqTick); show(); }, 1000); show();
    tb.onclick = () => { if (frqClock && frqClock.id === f.id) { frqClock = null; } else frqClock = {id:f.id, end: Date.now() + f.minutes*60000}; show(); }; }
  $("#frq-toggle").onclick = () => { st.show = !st.show; if (st.show && !st.scored) { st.scored = true; CS.addXP(30); } CS.refresh(); render.frq(); };
  if ($("#frq-quick")) $("#frq-quick").onclick = () => {
    const out = $("#frq-ai-out"), ans = $("#frq-draft").value.trim();
    if (ans.length < 20) { out.innerHTML = `<div class="feedback bad">Write an answer to each part first, then run the quick check.</div>`; return; }
    const res = CS.autoCheck(f, ans); let auto = 0, hit = 0;
    res.forEach((x, i) => { if (x.auto) { auto++; st.checks[i] = !!x.earned; if (x.earned) hit++; } });
    st.show = true; if (!st.scored) { st.scored = true; CS.addXP(30); } CS.save(); CS.refresh(); render.frq();
    $("#frq-ai-out").innerHTML = `<div class="sample"><span class="eyebrow">Quick check · ${hit}/${auto} points matched</span>
      <ul style="margin:8px 0 0;padding-left:1.2em">${f.rubric.map((r,i)=>`<li><b>${!res[i].auto?"?":res[i].earned?"✓":"✗"} ${esc(r.split(")")[0])})</b> ${!res[i].auto?"Graphs need your own check against the rubric.":res[i].earned?"Your answer mentions the key ideas.":"Missing a key idea or number. Compare with the rubric."}</li>`).join("")}</ul>
      <p class="faint tiny" style="margin-top:8px">This checks keywords and numbers, not reasoning. The rubric boxes below are pre-checked; adjust them to match your own judgment.</p></div>`;
  };
  if (G) CS.drawGraph($("#frq-graph"), G.mk, {expect:G.expect, why:G.why, x:G.x, y:G.y, labels:G.labels, onDone:(ok)=>{ CS.addXP(ok?15:5); CS.refresh(); }});
  if ($("#frq-ai")) $("#frq-ai").onclick = async () => {
    const out = $("#frq-ai-out"), ans = $("#frq-draft").value.trim();
    if (ans.length < 20) { out.innerHTML = `<div class="feedback bad">Write an answer to each part first, then ask for feedback.</div>`; return; }
    out.innerHTML = `<div class="feedback">${I("spark")} Scoring your answer against the rubric…</div>`;
    try {
      const res = await CS.aiScore(f, ans);
      st.show = true; st.scored = true; st.checks = f.rubric.map((_,i)=>!!(res.points[i]&&res.points[i].earned)); CS.addXP(30); CS.refresh(); render.frq();
      $("#frq-ai-out").innerHTML = `<div class="sample"><span class="eyebrow">AI feedback · ${st.checks.filter(Boolean).length}/${f.rubric.length} points</span><p style="margin-top:6px">${esc(res.summary||"")}</p>
        <ul style="margin:8px 0 0;padding-left:1.2em">${f.rubric.map((r,i)=>`<li><b>${res.points[i]&&res.points[i].earned?"✓":"✗"} ${esc(r.split(")")[0])})</b> ${esc((res.points[i]&&res.points[i].note)||"")}</li>`).join("")}</ul>
        <p class="faint tiny" style="margin-top:8px">AI scoring can make mistakes. The rubric boxes below are pre-checked; adjust them if you disagree.</p></div>`;
    } catch(e) { out.innerHTML = `<div class="feedback">AI scoring runs on the live site once it's connected. For now, use <b>Score it myself</b> with the rubric.</div>`; }
  };
  $$("#v-frq .rubric input").forEach(cb => cb.onchange = () => { st.checks[+cb.dataset.i] = cb.checked; CS.save(); $("#frq-score").textContent = st.checks.filter(Boolean).length+" / "+f.rubric.length; });
};

/* ---------- plan ---------- */
render.plan = () => {
  const s = S(), v = $("#v-plan"), days = daysToExam();
  v.innerHTML = `<div class="page-head"><div class="stack" style="gap:6px"><span class="eyebrow">Built from your results</span><h1>Study plan</h1></div></div>
    <div class="panel"><div class="plan-form">
      <div class="field"><label for="plan-exam">Exam</label><select id="plan-exam">${CS.C.clepOnly ? "" : `<option value="ap">${esc(CS.C.ap)}</option>`}${CS.C.apOnly ? "" : `<option value="clep">${esc(CS.C.clep)}</option>`}</select></div>
      <div class="field"><label for="plan-date">Exam date</label><input type="date" id="plan-date" value="${esc(s.plan.date)}"></div>
      <div class="field"><label for="plan-goal">Daily goal</label><select id="plan-goal">${GOALS.map(([g,n])=>`<option value="${g}">${n} · ${g} XP</option>`).join("")}</select></div>
      <button class="btn ghost sm" data-go="practice" data-mode="diagnostic">${s.diag?"Retake diagnostic":"Take the diagnostic"}</button></div>
      <p class="muted" id="plan-note"></p>
      <div class="seg" style="max-width:360px" role="group" aria-label="Plan type"><button data-pv="weeks" aria-pressed="${!s.cramOn}">Weekly plan</button><button data-pv="cram" aria-pressed="${!!s.cramOn}">${CS.hasAccess()?"":I("lock")}30-day cram plan</button></div></div>
    <ol class="weeks" id="plan-weeks"></ol>`;
  $$("[data-pv]", v).forEach(b => b.onclick = () => { if (b.dataset.pv === "cram" && !CS.hasAccess()) return CS.openUpgrade("exam"); s.cramOn = b.dataset.pv === "cram"; CS.save(); render.plan(); });
  if (s.cramOn && !CS.hasAccess()) s.cramOn = false;
  $("#plan-exam").value = s.exam; $("#plan-goal").value = s.goal;
  $("#plan-exam").onchange = e => setExam(e.target.value);
  $("#plan-goal").onchange = e => { s.goal = +e.target.value; CS.save(); CS.chrome(); };
  $("#plan-date").onchange = e => { if (e.target.value) { s.plan.date = e.target.value; s.dateSet = true; CS.save(); render.plan(); CS.chrome(); } };
  const ul = $("#plan-weeks");
  if (days < 1) { $("#plan-note").textContent = "Pick an exam date in the future to build your plan."; return; }
  if (s.cramOn) return renderCram(days);
  if (days <= 30 && !s.cramHint) { $("#plan-note").insertAdjacentHTML("beforeend", ` <b>Less than a month left? Try the 30-day cram plan.</b>`); }
  const weeks = Math.max(1, Math.ceil(days/7)), today = new Date(); today.setHours(12,0,0,0);
  const examD = new Date(s.plan.date+"T12:00:00");
  const order = CS.UNITS.map(u=>({u, m:CS.mastery(u.id)})).sort((a,b)=>(a.m??-1)-(b.m??-1));
  const has = order.some(x=>x.m!=null);
  $("#plan-note").innerHTML = `<b>${days} days</b> until your ${esc(examName())} exam on ${fmtDate(s.plan.date)}${!s.dateSet?` <span class="tag warn">assumed date: set yours above</span>`:""}. ${has ? "Units are ordered weakest first, based on your answers so far." : "Take the diagnostic so the plan can put your weakest units first."}`;
  // spread units across weeks; long runways get a second pass and spaced review
  const slots = weeks>1 ? weeks-1 : 1, items = [], NU = CS.UNITS.length;
  if (weeks === 1) items.push({final:true, units:order.map(x=>x.u)});
  else if (slots >= NU) { for (let i=0;i<slots;i++) items.push(i<NU ? {units:[order[i].u]} : {units:[order[(i-NU)%NU].u], second:true}); }
  else { const per = Math.ceil(NU/slots); for (let i=0;i<slots;i++){ const g = order.slice(i*per, i*per+per).map(x=>x.u); if (g.length) items.push({units:g}); } }
  if (weeks > 1) items.push({final:true, units:[]});
  const games = CS.C.planGames || (CS.COURSE === "micro" ? ["Shift It","Profit Max","Sprint","Nash Hunt","Match-up","Chain Reaction","Number Crunch"] : ["Shift It","Sprint","Match-up","Fed Chair","Chain Reaction","Number Crunch"]);
  ul.innerHTML = items.map((it,i)=>{
    const start = new Date(today.getTime()+i*7*CS.DAY), end = new Date(Math.min(examD.getTime(), start.getTime()+6*CS.DAY));
    const when = `Week ${i+1}<br>${start.toLocaleDateString(undefined,{month:"short",day:"numeric"})}–${end.toLocaleDateString(undefined,{month:"short",day:"numeric"})}`;
    if (it.final) return `<li class="final"><div class="when">${when}</div><div><h3>Final review${weeks===1?": all units":""}</h3><ul>
      <li>Take a full-length ${esc(examShort())} practice exam under time</li>${s.exam==="ap"?`<li>Write 3 FRQs (1 long, 2 short) in 60 minutes, then score them, including a real past exam from Official resources</li>`:""}
      <li>Clear your mistakes notebook</li><li>Clear every due flashcard daily</li><li>Beat any unit boss you haven't beaten</li></ul></div></li>`;
    const names = it.units.map(u=>`${CS.C.unitWord||"Unit"} ${u.id}: ${esc(u.name)}`).join(" + ");
    const frq = CS.FRQS.find(f=>f.units.some(x=>it.units.some(u=>u.id===x)));
    return `<li class="${i===0?"now":""}"><div class="when">${when}${i===0?`<br><span class="tag good">This week</span>`:""}</div><div><h3>${it.second?"Second pass · ":""}${names}</h3><ul>
      <li>Read the guide and redraw the key ${CS.hasGraphs()?"graph":"diagram"} from memory</li>
      <li>Unit quiz until you score 8/10 or better (now ${it.units.map(u=>CS.pct(CS.mastery(u.id))).join(", ")})</li>
      <li>Beat the Unit ${it.units.map(u=>u.id).join(" and ")} boss</li>
      <li>Daily: the daily challenge plus 10 minutes of flashcards</li><li>Game of the week: ${games[i%games.length]}</li>
      ${frq && s.exam==="ap" && i>0 ? `<li>FRQ: ${esc(frq.title)}</li>`:""}</ul></div></li>`;
  }).join("");
};

function renderCram(days){
  const s = S(), T = window.CS_CRAM, n = Math.max(1, Math.min(30, days));
  const order = CS.UNITS.map(u=>({u, m:CS.mastery(u.id)})).sort((a,b)=>(a.m??-1)-(b.m??-1)).map(x=>x.u);
  const pick = n === 30 ? T : Array.from({length:n}, (_,i) => T[Math.min(29, Math.round(i*29/Math.max(1,n-1)))]);
  const start = s.cramStart || (s.cramStart = CS.today()); CS.save();
  const doneN = pick.filter((_,i)=>s.cram[start+":"+i]).length;
  $("#plan-note").innerHTML = `<b>${n}-day cram plan</b> starting ${fmtDate(start)}, weakest units first. ${doneN}/${n} days done. <button class="btn ghost sm" id="cram-reset">Restart from today</button>`;
  $("#cram-reset").onclick = () => { s.cramStart = CS.today(); CS.save(); render.plan(); };
  $("#plan-weeks").innerHTML = pick.map((d,i) => {
    const key = start+":"+i, date = CS.addDays(start, i), u = d.u.startsWith("w") ? order[+d.u.slice(1)-1] : null, isToday = date === CS.today();
    return `<li class="${isToday?"now":""} ${s.cram[key]?"done":""}"><div class="when">Day ${i+1}<br>${new Date(date+"T12:00:00").toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"})}${isToday?`<br><span class="tag good">Today</span>`:""}</div>
      <div class="spread" style="align-items:flex-start"><div><h3>${u?`Unit ${u.id}: ${esc(u.short)}`:"Mixed review"}</h3><p class="muted small">${esc(d.t)}</p></div>
      <label class="row-wrap small" style="gap:6px"><input type="checkbox" data-ck="${key}" ${s.cram[key]?"checked":""} style="accent-color:var(--mint)">Done</label></div></li>`; }).join("");
  $$("[data-ck]").forEach(c => c.onchange = () => { s.cram[c.dataset.ck] = c.checked; if (c.checked) { CS.addXP(15); } CS.refresh(); renderCram(days); });
}

/* ---------- courses: switcher + dashboard bar ---------- */
function courseLine(sm){
  const c = window.CS_COURSES[sm.k], ex = sm.exam === "clep" ? "CLEP®" : "AP®";
  if (!sm.started) return c.clepOnly ? "CLEP® · not started" : c.apOnly ? "AP® · not started" : `${ex} or CLEP® · not started`;
  return `${ex} · ${sm.answered} answered${sm.avg!=null?` · ${CS.pct(sm.avg)} avg mastery`:""}${sm.days!=null&&sm.days>=0?` · ${sm.days} days to go`:""}`;
}
CS.coursesBar = () => {
  const all = Object.values(window.CS_COURSES).map(c => ({c, sm:CS.courseSummary(c.k)}));
  const list = all.filter(({c, sm}) => sm.answered > 0 || c.k === CS.COURSE), more = all.length - list.length;
  return `<section class="courses-bar" aria-label="My courses"><div class="spread"><h2>My courses</h2><span class="muted small">Streak, XP and pets are shared across courses</span></div>
    <div class="course-cards">${list.map(({c, sm}) => { const cur = c.k === CS.COURSE;
      return `<button class="course-card ${cur?"cur":""}" data-course="${c.k}" style="--cc:${c.col};--cs:${c.soft}">
        <span class="cc-ico">${I(c.icon)}</span>
        <span class="stack" style="gap:3px;flex:1;min-width:0"><span class="row-wrap" style="gap:8px"><b>${esc(c.name)}</b>${cur?`<span class="tag good">Studying now</span>`:sm.started?"":`<span class="tag">New</span>`}</span>
          <span class="muted small">${esc(courseLine(sm))}</span>
          ${CS_STATLINE(c.k)?`<span class="cc-stat">${esc(CS_STATLINE(c.k))}</span>`:""}
          <span class="cc-meter"><i style="width:${Math.round((sm.avg||0)*100)}%"></i></span></span>
        <span class="cc-go">${cur?"Continue":sm.started?"Switch →":"Start free →"}</span></button>`; }).join("")}</div>${more>0?`<div><button class="btn ghost sm" data-addcourse="1">+ Add a course (${more} more)</button></div>`:""}</section>`;
};
function coursePicker(){
  let pop = $("#course-pop"); if (pop) { closeCoursePicker(); return; }
  const mob = window.innerWidth <= 620;
  const sc = document.createElement("div"); sc.id = "course-scrim"; sc.className = "course-scrim"; sc.onclick = closeCoursePicker; document.body.appendChild(sc);
  pop = document.createElement("div"); pop.id = "course-pop"; pop.className = "course-pop" + (mob ? " sheet" : ""); pop.setAttribute("role","dialog"); pop.setAttribute("aria-label","Courses");
  const row = c => { const sm = CS.courseSummary(c.k), cur = c.k === CS.COURSE, m = Math.round((sm.avg||0)*100);
    const stat = !sm.started ? "Not started" : `${sm.answered} answered · ${m}% mastery`;
    return `<button data-course="${c.k}" class="cp-row ${cur?"cur":""}" style="--cc:${c.col};--cs:${c.soft}" ${cur?'aria-current="true"':""}>
      <span class="cp-ico">${I(c.icon||"book")}</span>
      <span class="cp-main"><span class="cp-name">${esc(c.name)}${cur?`<span class="cp-badge">Current</span>`:""}</span>
        <span class="cp-sub">${esc(c.blurb||"")}</span>
        <span class="cp-meta"><span>${c.nUnits||""} units · ${esc(CS_STATLINE(c.k)||"AP® & CLEP®")}</span><span>${esc(stat)}</span></span>
        <span class="cp-bar"><i style="width:${m}%"></i></span></span>
      <span class="cp-go">${cur?I("check"):`<span class="cp-btn">${sm.started?"Switch":"Start"}</span>`}</span></button>`; };
  const groups = {}; Object.values(window.CS_COURSES).forEach(c => (groups[c.cat||"Courses"] = groups[c.cat||"Courses"] || []).push(c));
  pop.innerHTML = `<div class="cp-head"><div><b>Courses</b><span class="tiny muted">Streak, XP, pets and creds carry across every course.</span></div><button class="cp-x" aria-label="Close">${I("x")}</button></div>
    <div class="cp-list">${Object.entries(groups).map(([g,cs]) => `<span class="cp-group">${esc(g)}</span>` + cs.map(row).join("")).join("")}</div>
    <div class="cp-foot">${I("spark")}<span>More subjects are on the way.</span></div>`;
  document.body.appendChild(pop);
  if (!mob) { const r = $("#course-pill").getBoundingClientRect(); pop.style.top = (r.bottom + 8) + "px"; pop.style.left = Math.max(8, Math.min(window.innerWidth - 428, r.left)) + "px"; }
  $(".cp-x", pop).onclick = closeCoursePicker;
  $("#course-pill").setAttribute("aria-expanded","true");
  document.addEventListener("keydown", cpEsc);
  const f = $(".cp-row.cur", pop) || $(".cp-row", pop); if (f) f.focus({preventScroll:true});
}
function cpEsc(e){ if (e.key === "Escape") closeCoursePicker(); }
function closeCoursePicker(){ const p = $("#course-pop"), s = $("#course-scrim"); if (p) p.remove(); if (s) s.remove(); document.removeEventListener("keydown", cpEsc); const b = $("#course-pill"); if (b) b.setAttribute("aria-expanded","false"); }
document.addEventListener("click", e => { if (e.target.closest("[data-addcourse]")) { coursePicker(); return; } const b = e.target.closest("[data-course]"); if (!b) return; if (b.dataset.course === CS.COURSE) { closeCoursePicker(); if (current !== "home") CS.go("home"); return; } CS.switchCourse(b.dataset.course); });

/* ---------- boot ---------- */
CS.applyFreezes();
$("#side-brand").innerHTML = CS.logo("mark") + `<span><b>Credit Sprint</b><small>${esc(CS.C.name)}</small></span>`;
document.documentElement.setAttribute("data-subject", CS.COURSE);
function renderCourseTabs(){ const el = $("#course-tabs"); if (el) el.remove(); }
renderCourseTabs();
/* course switcher in the top bar */
$("#course-pill").onclick = e => { e.stopPropagation(); coursePicker(); };
$("#mob-brand").innerHTML = CS.logo("mob-brand");
$("#menu").innerHTML = I("menu");
$("#settings").innerHTML = I("gear") + "<span>Settings</span>";
$$(".themeseg button").forEach(b => { b.innerHTML = I(b.dataset.th==="light"?"sun":b.dataset.th==="dark"?"moon":"auto") + `<span>${b.dataset.th[0].toUpperCase()+b.dataset.th.slice(1)}</span>`; });
const start = (location.hash||"").replace("#","");
CS.go(VIEWS.includes(start) ? start : "home");
if (!S().onboarded) onboarding();
})();
