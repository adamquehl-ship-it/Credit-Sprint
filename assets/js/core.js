/* Credit Sprint core: content prep, saved state, XP/levels/streaks/freezes, badges, icons, logo, theme. */
(function(){
"use strict";
const CS = window.CS = {};

/* ---------- helpers ---------- */
CS.$ = (s, r=document) => r.querySelector(s);
CS.$$ = (s, r=document) => Array.from(r.querySelectorAll(s));
CS.esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
CS.shuffle = a => { a = a.slice(); for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
CS.pct = m => m==null ? "—" : Math.round(m*100)+"%";
CS.DAY = 864e5;
CS.L = "ABCDE";
CS.ymd = d => d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
CS.today = () => CS.ymd(new Date());
CS.addDays = (key, n) => { const d = new Date(key+"T12:00:00"); d.setDate(d.getDate()+n); return CS.ymd(d); };
/* seeded random for the daily challenge */
CS.seeded = seed => { let h = 2166136261; for (const c of String(seed)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h>>>0) % 1e6) / 1e6; }; };

/* ---------- content ---------- */
CS.UNITS = window.CS_UNITS;
/* history and government unit names already begin with "Unit 1:" or "Period 1:"; the app adds its own label */
CS.UNITS.forEach(u => { u.name = String(u.name).replace(/^(Unit|Period) \d+:\s*/, ""); });
CS.QS = window.CS_QUESTIONS_RAW.map((r,i)=>({
  id:"q"+i, u:r[0], q:r[1], p:(r[4] && r[4].p) || null,
  opts:[{t:r[2][0], w:r[2][1], ok:true}].concat(r[3].map(x=>({t:x[0], w:x[1], ok:false}))).concat((window.CS_FIFTH||{})["q"+i] ? [{t:window.CS_FIFTH["q"+i][0], w:window.CS_FIFTH["q"+i][1], ok:false}] : [])
}));
/* ---------- reading passages (English courses) ----------
   A passage is shared by a set of questions: CS_PASSAGES[id] = {t title, by author, y year, k kind, x text}.
   Poems and drama are numbered by line; prose by paragraph. Question decks keep each set together, in order. */
CS.PASSAGES = window.CS_PASSAGES || {};
CS.hasPassages = Object.keys(CS.PASSAGES).length > 0;
CS.QS.forEach(q => { if (q.p && !CS.PASSAGES[q.p]) q.p = null; });
const PSG_KIND = {poem:"Poem", prose:"Prose fiction", drama:"Drama", nonfiction:"Nonfiction", draft:"Student draft", source:"Source"};
CS.passageBody = (ps) => {
  const e = CS.esc, k = ps.k || "prose";
  if (k === "poem" || k === "drama") {
    let n = 0;
    return `<div class="psg-lines">${String(ps.x).split("\n").map(l => { if (!l.trim()) return `<div class="psg-gap"></div>`; n++;
      return `<div class="psg-l"><span class="psg-n">${n % 5 === 0 ? n : ""}</span><span class="psg-t">${e(l)}</span></div>`; }).join("")}</div>`;
  }
  return `<div class="psg-paras">${String(ps.x).split(/\n\s*\n/).map((para, i) => `<p><span class="psg-pn">${i+1}</span>${e(para.trim()).replace(/\n/g, "<br>")}</p>`).join("")}</div>`;
};
/* the passage panel shown above a question. Remembers if the student folded it away for this passage. */
let psgFolded = {};
CS.passageHTML = (id, o = {}) => {
  const ps = CS.PASSAGES[id]; if (!ps) return "";
  const e = CS.esc, open = o.compact ? false : !psgFolded[id];
  const meta = [ps.by, ps.y].filter(Boolean).join(", ");
  return `<details class="psg ${o.compact ? "compact" : ""}" data-psg="${e(id)}" ${open ? "open" : ""}><summary><span class="psg-kind">${PSG_KIND[ps.k] || "Passage"}</span><b>${e(ps.t)}</b>${meta ? `<span class="psg-by">${e(meta)}</span>` : ""}<span class="psg-tog"></span></summary>
    ${ps.note ? `<p class="psg-note">${e(ps.note)}</p>` : ""}<div class="psg-body" tabindex="0" aria-label="Passage text">${CS.passageBody(ps)}</div></details>`;
};
document.addEventListener("toggle", ev => { const d = ev.target; if (d && d.matches && d.matches("details.psg:not(.compact)")) psgFolded[d.dataset.psg] = !d.open; }, true);
/* question text, with its passage when it has one */
CS.qText = (q, o = {}) => (q.p ? CS.passageHTML(q.p, o) : "") + `<p class="qtext">${CS.esc(q.q)}</p>`;
/* keep passage sets together: questions that share a passage sit next to each other, in the order they were written */
CS.setOrder = list => {
  if (!CS.hasPassages) return list;
  const idx = q => +String(q.id).slice(1), out = [], seen = new Set();
  list.forEach(q => { if (!q.p) { out.push(q); return; } if (seen.has(q.p)) return; seen.add(q.p);
    out.push(...list.filter(x => x.p === q.p).sort((a, b) => idx(a) - idx(b))); });
  return out;
};
/* pick about n questions from a pool, taking whole passage sets where they fit (a set can run past n by a few) */
CS.takeQs = (pool, n) => {
  if (!CS.hasPassages) return CS.shuffle(pool).slice(0, n);
  const groups = {}, singles = [];
  pool.forEach(q => { if (q.p) (groups[q.p] = groups[q.p] || []).push(q); else singles.push([q]); });
  const units = CS.shuffle(Object.values(groups).concat(singles)), out = [];
  for (const g of units) { if (out.length >= n) break; if (out.length && out.length + g.length > n + 3) continue; out.push(...g); }
  if (out.length < n) for (const g of units) { if (out.length >= n) break; for (const q of g) { if (out.length >= n) break; if (!out.includes(q)) out.push(q); } }
  return CS.setOrder(out.length > n + 3 ? out.slice(0, n) : out);
};
CS.QBYID = Object.fromEntries(CS.QS.map(q=>[q.id,q]));
CS.CARDS = window.CS_CARDS_RAW.map((c,i)=>({id:"c"+i, u:c[0], front:c[1], back:c[2]}));
CS.FRQS = window.CS_FRQS;
CS.MARKETS = window.CS_MARKETS;
CS.hasGraphs = () => CS.C.graphs !== false && Object.keys(CS.MARKETS || {}).length > 0;
CS.SHIFTS = window.CS_SHIFTS;
CS.EVENTS = window.CS_EVENTS;
CS.TF = window.CS_TF;
CS.CHAINS = window.CS_CHAINS;
CS.DRILLS = window.CS_DRILLS;
CS.RESOURCES = window.CS_RESOURCES;
CS.prepQ = q => ({...q, opts: CS.shuffle(q.opts)});
/* which unit a graph belongs to */
CS.mkUnit = mk => (CS.MARKETS[mk] && CS.MARKETS[mk].u) || {sd:1,adas:3,money:4,lf:4,phillips:5,fx:6}[mk] || 1;
/* graph questions built from Shift It scenarios */
CS.graphQ = (sc) => {
  const [mk, text, ok, why] = sc, m = CS.MARKETS[mk];
  const all = []; m.curves.forEach(c => { all.push([c.k,1]); all.push([c.k,-1]); });
  const right = ok[0], label = ([k,d]) => `${(m.curves.find(c=>c.k===k).label||k)} shifts ${d>0?"right":"left"}`;
  const wrong = CS.shuffle(all.filter(a => !ok.some(o=>o[0]===a[0]&&o[1]===a[1]))).slice(0,3);
  return {id:"g"+CS.SHIFTS.indexOf(sc), u:CS.mkUnit(mk), q:`${text} In the ${m.name.toLowerCase()} graph, what happens?`, mk,
    opts: CS.shuffle([{t:label(right), w:why, ok:true}].concat(wrong.map(a=>({t:label(a), w:`Not this one. ${why}`, ok:false})))).concat([{t:"Neither curve shifts", w:`Something does shift. ${why}`, ok:false}])};
};
/* number answers: accept within 1% (or 0.06) */
CS.numOK = (input, ans) => {
  const v = parseFloat(String(input).replace(/[$,%¥\s]/g,"").replace(/[−–]/g,"-")); if (isNaN(v)) return false;
  return Math.abs(v-ans) <= Math.max(0.06, Math.abs(ans)*0.01);
};

/* ---------- exam dates ---------- */
CS.defaultDate = exam => {
  if (exam === "ap") { const t = new Date(), y = (t.getMonth() > 4 || (t.getMonth()===4 && t.getDate()>1)) ? t.getFullYear()+1 : t.getFullYear(); return y+"-05-01"; }
  return CS.addDays(CS.today(), 60);
};

/* ---------- state ----------
   Each course saves its own progress under its own key. Things that belong to the student (streak, XP, pets,
   badges, plan, appearance) live in a shared record so they follow you between Macro and Micro. */
const COURSE = window.CS_COURSE; CS.C = COURSE; CS.COURSE = COURSE.k;
const KEY = COURSE.key, SHARED_KEY = "creditsprint.shared";
CS.SHARED = ["xp","days","frozen","freezes","freezeAwarded","goal","theme","accent","name","remind","pets","badges","tier","proSince","uid","upHide","totalAnswered","gems","themes","seasons","league","account","creds","dqs","showcase"];
const fresh = () => ({v:3, exam:COURSE.clepOnly ? "clep" : "ap", onboarded:false, goal:60, theme:"system", dateSet:false,
  accent:"indigo", cram:{}, remind:"19:00", name:"",
  answers:{}, mistakes:{}, diag:null, cards:{}, reviews:0, frq:{}, plan:{date:CS.defaultDate(COURSE.clepOnly ? "clep" : "ap")},
  xp:0, days:{}, frozen:{}, freezes:0, freezeAwarded:{}, best:{}, badges:{}, exams:[], tasks:{}, daily:{}, bosses:{}, games:0,
  qok:{}, mocks:{}, target:50});
let S = fresh();
const readJSON = k => { try { const r = window.CS_STORE.get(k); return r ? JSON.parse(r) : null; } catch(e) { return null; } };
try {
  const raw = readJSON(KEY);
  if (raw) S = Object.assign(fresh(), raw);
  else if (COURSE.k === "macro") { const o = readJSON("creditsprint.v2"); if (o) S = Object.assign(fresh(), o, {v:3, onboarded:true, plan:{date:(o.plan&&o.plan.date)||CS.defaultDate(o.exam||"ap")}}); }
  /* shared fields: from the shared record, or (first run after the update) from the Macro save */
  let shared = readJSON(SHARED_KEY);
  if (!shared && COURSE.k !== "macro") shared = readJSON(window.CS_COURSES.macro.key);
  if (shared) CS.SHARED.forEach(f => { if (shared[f] !== undefined) S[f] = shared[f]; });
  /* a new course inherits the exam choice from the other course until the student changes it */
  if (!raw && shared && shared.exam && !S.onboarded && !COURSE.clepOnly && !COURSE.apOnly) S.exam = shared.exam;
  if (COURSE.clepOnly) { S.exam = "clep"; if (!S.dateSet) S.plan.date = CS.defaultDate("clep"); }
  if (COURSE.apOnly) { S.exam = "ap"; if (!S.dateSet) S.plan.date = CS.defaultDate("ap"); }
} catch(e) {}
/* migrate old mistakes format (number) to spaced-review records */
Object.keys(S.mistakes||{}).forEach(k => { if (typeof S.mistakes[k] === "number") S.mistakes[k] = {n:S.mistakes[k], due:0}; });
CS.S = () => S;
/* features that are built but switched off until launch. Set to false to turn one on. */
CS.SOON = {ai: true, pfp: true};
CS.mistakesDue = () => Object.entries(S.mistakes).filter(([k,m]) => (m.due||0) <= Date.now()).map(([k])=>k);
CS.save = () => { try {
  window.CS_STORE.set(KEY, JSON.stringify(S));
  const sh = (COURSE.clepOnly || COURSE.apOnly) ? {} : {exam:S.exam}; CS.SHARED.forEach(f => { if (S[f] !== undefined) sh[f] = S[f]; });
  window.CS_STORE.set(SHARED_KEY, JSON.stringify(sh));
} catch(e) {} };
CS.resetAll = () => { try { Object.values(window.CS_COURSES).forEach(c => window.CS_STORE.remove(c.key)); window.CS_STORE.remove(SHARED_KEY); window.CS_STORE.remove("creditsprint.v2"); } catch(e) {} S = fresh(); CS.save(); };
/* summary of any course's saved progress, for the course switcher */
CS.courseSummary = k => {
  const c = window.CS_COURSES[k], raw = k === COURSE.k ? S : readJSON(c.key);
  if (!raw) return {k, started:false, answered:0, units:0, exam:c.clepOnly ? "clep" : c.apOnly ? "ap" : (COURSE.clepOnly ? "ap" : S.exam), days:null, diag:false};
  const ans = raw.answers || {}, answered = Object.values(ans).reduce((s,a)=>s+a.length,0);
  const m = Object.values(ans).filter(a=>a.length).map(a=>a.reduce((x,y)=>x+y,0)/a.length);
  const date = raw.plan && raw.plan.date, days = date ? Math.round((new Date(date+"T12:00:00") - new Date())/CS.DAY) : null;
  return {k, started:!!raw.onboarded || answered>0, answered, units:m.length, avg:m.length?m.reduce((a,b)=>a+b,0)/m.length:null, exam:raw.exam||"ap", days, diag:!!raw.diag, bosses:Object.keys(raw.bosses||{}).length};
};
CS.switchCourse = k => { if (!window.CS_COURSES[k]) return; CS.save(); try { localStorage.setItem("creditsprint.course", k); } catch(e) {} location.href = location.pathname + "?course=" + k + "#home"; };

/* ---------- theme ---------- */
CS.ACCENTS = [
  {k:"indigo", n:"Indigo", lv:1, c:"#4F46E5"}, {k:"ocean", n:"Ocean", lv:3, c:"#0369A1"}, {k:"forest", n:"Forest", lv:5, c:"#15803D"},
  {k:"sunset", n:"Sunset", lv:8, c:"#C2410C"}, {k:"rose", n:"Rose", lv:12, c:"#BE185D"}, {k:"gold", n:"Gold", lv:16, c:"#A16207"}
];
CS.applyTheme = () => {
  const r = document.documentElement;
  const a = CS.ACCENTS.find(x=>x.k===S.accent);
  const g = (CS.GEM_THEMES || []).find(x=>x.k===S.accent);
  if (a && a.k !== "indigo" && CS.levelOf(S.xp).lv >= a.lv) r.setAttribute("data-accent", a.k);
  else if (g && (S.themes || []).includes(g.k)) r.setAttribute("data-accent", g.k);
  else r.removeAttribute("data-accent");
  if (S.theme === "light" || S.theme === "dark") r.setAttribute("data-theme", S.theme); else r.removeAttribute("data-theme");
};

/* ---------- answers + mastery (last 20 per unit) ---------- */
CS.record = (q, ok, xp=true) => {
  if (q.u) { const a = S.answers[q.u] || (S.answers[q.u] = []); a.push(ok?1:0); if (a.length > 20) a.shift(); }
  if (q.p) S.psgAns = (S.psgAns || 0) + 1;
  if (q.id && q.id[0] === "q") {
    (S.qok || (S.qok = {}))[q.id] = ok ? 1 : 0; /* last result per question, for the weak-spot drill and fresh-question picks */
    if (!ok) S.mistakes[q.id] = {n:0, due:Date.now() + CS.DAY};
    else if (q.id in S.mistakes) { const m = S.mistakes[q.id]; m.n++; if (m.n >= 3) delete S.mistakes[q.id]; else m.due = Date.now() + [1,3,7][m.n]*CS.DAY; }
  }
  if (xp) CS.addXP(ok ? 10 : 2);
};
CS.mastery = u => { const a = S.answers[u]; if (!a || !a.length) return null; return a.reduce((s,x)=>s+x,0)/a.length; };
CS.answeredCount = () => Object.values(S.answers).reduce((s,a)=>s+a.length,0);
CS.medal = m => m==null ? null : m>=0.85 ? "g" : m>=0.7 ? "s" : m>=0.5 ? "b" : null;

/* ---------- score predictor ---------- */
CS.predict = () => {
  const covered = CS.UNITS.filter(u => (S.answers[u.id]||[]).length >= 3);
  const n = CS.answeredCount();
  if (covered.length < 4 || n < 20) {
    if (S.exam === "clep" && CS.mockList && CS.mockList().length) { const pb = CS.blendMocks(null), sc = CS.scaled(pb); return {ready:true, p:pb, label:String(sc), sub:"Estimated CLEP® score", pass:sc>=50}; }
    return {ready:false, need:Math.max(0, 20-n), units:Math.max(0,4-covered.length)};
  }
  const wk = S.exam === "ap" ? "wAP" : "wCLEP";
  let num = 0, den = 0;
  CS.UNITS.forEach(u => { const m = CS.mastery(u.id); const w = u[wk]; den += w; num += w * (m==null ? 0.35 : m); });
  const p = num/den;
  if (S.exam === "ap") { const score = p>=0.72?5 : p>=0.58?4 : p>=0.45?3 : p>=0.32?2 : 1; return {ready:true, p, label:String(score), sub:"Estimated AP® score", pass:score>=3}; }
  const pb = CS.blendMocks(p);
  const scaled = CS.scaled(pb);
  return {ready:true, p:pb, label:String(scaled), sub:"Estimated CLEP® score", pass:scaled>=50};
};
/* CLEP® scale: 20–80, roughly linear in percent correct (50 ≈ half right). A rough guide, not an official conversion. */
CS.scaled = p => Math.max(20, Math.min(80, Math.round(20 + 60*p)));
CS.needP = score => Math.max(0, Math.min(1, (score - 20) / 60));
/* the last two CLEP® practice tests (if any) count for half of the estimate */
CS.mockList = () => Object.entries(S.mocks || {}).map(([k, m]) => ({k:+k, ...m})).filter(m => m.n).sort((a, b) => a.at - b.at);
CS.blendMocks = p => {
  if (S.exam !== "clep") return p;
  const ms = CS.mockList().slice(-2); if (!ms.length) return p;
  const pm = ms.reduce((s, m) => s + m.score / m.n, 0) / ms.length;
  return p == null ? pm : 0.5 * p + 0.5 * pm;
};

/* ---------- XP, levels, streaks, freezes ---------- */
CS.levelOf = xp => { let lv = 1, need = 200, base = 0; while (xp >= base + need) { base += need; lv++; need = Math.round(need*1.15/10)*10; } return {lv, into:xp-base, need}; };
CS.level = () => CS.levelOf(S.xp);
CS.addXP = n => {
  const before = CS.levelOf(S.xp).lv;
  S.xp += n; const d = CS.today(); const prev = S.days[d]||0; S.days[d] = prev + n;
  if (prev < S.goal && S.days[d] >= S.goal) CS.toast("Daily goal reached. Your streak is safe today.");
  const after = CS.levelOf(S.xp).lv;
  if (after > before) CS.levelUp(after);
  CS.streakRewards();
};
const active = k => (S.days[k]||0) > 0 || S.frozen[k];
CS.streak = () => {
  let n = 0, k = CS.today();
  if (!active(k)) k = CS.addDays(k, -1);
  while (active(k)) { n++; k = CS.addDays(k, -1); }
  return n;
};
/* streak freeze: if yesterday was missed but the day before was active, spend a freeze */
CS.applyFreezes = () => {
  const y = CS.addDays(CS.today(), -1), y2 = CS.addDays(CS.today(), -2);
  if (!active(y) && active(y2) && S.freezes > 0) { S.frozen[y] = true; S.freezes--; CS.save(); setTimeout(()=>CS.toast("A streak freeze saved your streak."), 600); }
};
CS.streakRewards = () => {
  const s = CS.streak();
  if (s > 0 && s % 7 === 0 && !S.freezeAwarded[CS.today()] && S.freezes < 2) { S.freezes++; S.freezeAwarded[CS.today()] = true; CS.toast(`${s}-day streak! You earned a streak freeze.`); }
};
CS.setBest = (k, v, higherIsBetter=true) => {
  const cur = S.best[k];
  if (cur == null || (higherIsBetter ? v > cur : v < cur)) { S.best[k] = v; return true; }
  return false;
};
CS.weekXP = () => { const out = []; for (let i=6;i>=0;i--) { const k = CS.addDays(CS.today(), -i); out.push({k, xp:S.days[k]||0, frozen:!!S.frozen[k], label:new Date(k+"T12:00:00").toLocaleDateString(undefined,{weekday:"narrow"})}); } return out; };

/* ---------- badges ---------- */
CS.BADGES = [
  {k:"diag", n:"First steps", d:"Finish the diagnostic", ic:"target", t:()=>!!S.diag},
  {k:"s3", n:"On a roll", d:"3-day streak", ic:"flame", t:()=>CS.streak()>=3},
  {k:"s7", n:"Week warrior", d:"7-day streak", ic:"flame", t:()=>CS.streak()>=7},
  {k:"s30", n:"Unstoppable", d:"30-day streak", ic:"flame", t:()=>CS.streak()>=30},
  {k:"q100", n:"Century", d:"Answer 100 questions", ic:"check", t:()=>CS.answeredCount()>=100 || (S.totalAnswered||0)>=100},
  {k:"cards", n:"Card shark", d:"100 flashcard reviews", ic:"cards", t:()=>S.reviews>=100},
  {k:"daily", n:"Daily devotee", d:"5 daily challenges", ic:"star", t:()=>Object.keys(S.daily).length>=5},
  {k:"boss", n:"Boss slayer", d:"Beat any unit boss", ic:"sword", t:()=>Object.values(S.bosses).some(Boolean)},
  {k:"bossall", n:"Final form", d:"Beat all six unit bosses", ic:"sword", t:()=>CS.UNITS.every(u=>S.bosses[u.id])},
  {k:"sprint", n:"Sprinter", d:"Score 150+ in Sprint", ic:"bolt", t:()=>(S.best.sprint||0)>=150},
  {k:"shift", n:"Curve whisperer", d:"9+ correct in Shift It", ic:"chart", t:()=>(S.best.shift||0)>=9},
  {k:"fed", n:"Steady hand", d:"Earn an A as Fed Chair", ic:"bank", t:()=>(S.best.fed||0)>=90},
  {k:"chain", n:"Chain master", d:"Perfect Chain Reaction", ic:"link", t:()=>(S.best.chain||0)>=1},
  {k:"crunch", n:"Number cruncher", d:"10+ in Number Crunch", ic:"calc", t:()=>(S.best.crunch||0)>=10},
  {k:"mock", n:"Mock master", d:"80%+ on a practice exam", ic:"pen", t:()=>S.exams.some(e=>e.score/e.n>=0.8)},
  {k:"gold", n:"Gold standard", d:"Gold medal in any unit", ic:"medal", t:()=>CS.UNITS.some(u=>CS.medal(CS.mastery(u.id))==="g")},
  {k:"all", n:"Exam ready", d:"70%+ mastery in every unit", ic:"cap", t:()=>CS.UNITS.every(u=>(CS.mastery(u.id)||0)>=0.7)}
];
CS.checkBadges = () => { CS.BADGES.forEach(b => { if (!S.badges[b.k] && b.t()) { S.badges[b.k] = Date.now(); CS.toast("Badge unlocked: " + b.n); } }); };

/* ---------- toast + level up ---------- */
let toastQ = [], toastOn = false;
CS.toast = msg => { if (toastQ.includes(msg)) return; toastQ.push(msg); if (toastQ.length > 3) toastQ.shift(); if (!toastOn) nextToast(); };
function nextToast(){
  const msg = toastQ.shift(); if (!msg) { toastOn = false; return; } toastOn = true;
  let el = CS.$("#toast");
  if (!el) { el = document.createElement("div"); el.id = "toast"; el.className = "toast"; el.setAttribute("role","status"); document.body.appendChild(el); }
  el.innerHTML = CS.icon("spark") + `<span>${CS.esc(msg)}</span>`; el.hidden = false;
  setTimeout(()=>{ el.hidden = true; setTimeout(nextToast, 200); }, 2400);
}
CS.levelUp = lv => {
  const el = document.createElement("div"); el.className = "levelup";
  const un = CS.ACCENTS.find(a=>a.lv===lv);
  el.innerHTML = `<div><span class="eyebrow">Level up</span><b>${lv}</b><span class="muted small">${un?`You unlocked the ${un.n} color theme. Try it in Settings.`:"Keep going. Every level is a step closer to exam day."}</span></div>`;
  document.body.appendChild(el); setTimeout(()=>el.remove(), 2200);
};

/* ---------- icons (24px stroke) ---------- */
const P = {
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  quill:'<path d="M20 4C11 5 6 10 4.5 19.5"/><path d="M20 4c-.5 6-4 10.5-11.5 12"/><path d="M8.5 12.5c3-.2 6-1.8 8-5"/>',
  speech:'<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>',
  x:'<path d="M6 6l12 12M18 6 6 18"/>',
  grid:'<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  landmark:'<path d="M3 21h18M5 21V10M9.5 21V10M14.5 21V10M19 21V10M2 10l10-6 10 6z"/>',
  brain:'<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>',
  flag:'<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  map:'<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/>',
  mega:'<path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z"/><path d="M15 9a4 4 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11"/>',
  flask:'<path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2.2h12.4a1.5 1.5 0 0 0 1.3-2.2L14 9V3"/><path d="M7.5 15h9"/>',
  dna:'<path d="M7 3c0 6 10 6 10 12M17 3c0 6-10 6-10 12M7 21c0-3 3-4.5 5-6M17 21c0-3-3-4.5-5-6"/><path d="M8.5 6h7M8.5 12h7M9 18h6"/>',
  lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  home:'<path d="M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/>',
  book:'<path d="M5 4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h9"/>',
  target:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r=".8" fill="currentColor"/>',
  cards:'<rect x="3" y="7" width="13" height="13" rx="2"/><path d="M8 7V5a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-4"/>',
  game:'<rect x="2.5" y="7" width="19" height="11" rx="4"/><path d="M7 11v3M5.5 12.5h3"/><circle cx="16" cy="11.5" r=".9" fill="currentColor"/><circle cx="18" cy="13.8" r=".9" fill="currentColor"/>',
  pen:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
  cal:'<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  flame:'<path d="M12 21c-3.9 0-6.5-2.6-6.5-6.2 0-3.4 2.4-5.3 3.6-8 .9 1.6 1.6 2.5 2.9 3.1-.2-2.4.7-4.7 2.6-6.4.4 3.5 4.9 5.6 4.9 11.1 0 3.7-3 6.4-7.5 6.4z"/>',
  bolt:'<path d="M13 3 5 14h6l-1 7 8-11h-6z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  auto:'<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 0 0 16z" fill="currentColor"/>',
  menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
  check:'<path d="M5 12.5 10 17l9-10"/>',
  star:'<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8L3.5 9.7l5.9-.8z"/>',
  sword:'<path d="M14.5 4H20v5.5L10 19.5 4.5 14z"/><path d="M7 16.5 4 19.5M5.5 12.5l6 6"/>',
  chart:'<path d="M4 4v16h16"/><path d="M7 15 11 10l3 3 5-6"/>',
  bank:'<path d="M3 9.5 12 4l9 5.5H3z"/><path d="M5 10v7M9.5 10v7M14.5 10v7M19 10v7M3 20h18"/>',
  link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  integral:'<path d="M15.5 4.5c-.6-1.2-1.6-1.6-2.6-1.4-1.3.3-1.8 1.6-1.9 3L10.4 18c-.1 1.4-.7 2.6-2 2.9-1 .2-2-.2-2.6-1.4"/><path d="M14 12h4.5M16.2 9.8v4.4" opacity=".55"/>',
  calc:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>',
  medal:'<circle cx="12" cy="14.5" r="5.5"/><path d="M8.5 9.5 6 3h4l2 4 2-4h4l-2.5 6.5"/>',
  cap:'<path d="M12 5 22 10l-10 5L2 10z"/><path d="M6 12v4c0 1.5 3 3 6 3s6-1.5 6-3v-4"/>',
  spark:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
  users:'<circle cx="9" cy="8" r="3.2"/><path d="M3.5 19c.6-3.2 2.9-5 5.5-5s4.9 1.8 5.5 5"/><circle cx="17" cy="9" r="2.6"/><path d="M15.8 14.2c2.3.2 4.1 1.8 4.7 4.8"/>',
  heart:'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="currentColor"/>',
  tf:'<path d="M4 12.5 8 16.5 15 7.5"/><path d="M15 15l5 5M20 15l-5 5"/>',
  bag:'<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  gem:'<path d="M6 4h12l4 6-10 11L2 10z"/><path d="M2 10h20M9 4l-2 6 5 11 5-11-2-6"/>',
  shield:'<path d="M12 3 19 6v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/>',
  ext:'<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  paw:'<circle cx="7" cy="10" r="2.2"/><circle cx="11" cy="6.5" r="2.2"/><circle cx="15.5" cy="7" r="2.2"/><circle cx="18.5" cy="11" r="2.2"/><path d="M12 12.5c-3 0-6 3.5-6 6 0 1.6 1.4 2.5 3 2.5 1.2 0 2-.6 3-.6s1.8.6 3 .6c1.6 0 3-.9 3-2.5 0-2.5-3-6-6-6z"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>'
};
CS.icon = (k, cls="ico") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[k]||""}</svg>`;

/* ---------- logo: option V, Split Square (fixed brand colors in both themes) ---------- */
CS.logo = (cls="mark") => `<svg class="${cls}" viewBox="0 0 40 40" role="img" aria-label="Credit Sprint"><rect x="1" y="1" width="38" height="38" rx="10" fill="#4F46E5"/><path d="M20 1 H29 A10 10 0 0 1 39 11 V29 A10 10 0 0 1 29 39 H20 Z" fill="#10B981"/><text x="11" y="26.2" text-anchor="middle" font-family="Manrope, system-ui, sans-serif" font-weight="800" font-size="16.5" fill="#FFFFFF">C</text><text x="29.5" y="26.2" text-anchor="middle" font-family="Manrope, system-ui, sans-serif" font-weight="800" font-size="16.5" fill="#06281C">S</text></svg>`;
CS.applyTheme();
})();
