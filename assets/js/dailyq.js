/* Credit Sprint daily quests: three new quests every day for each course (the same for every student), paying
   creds, gems, XP or a sellable egg. Progress is counted from real answers, games and tasks. Loaded after market.js. */
(function(){
"use strict";
const CS = window.CS, S = () => CS.S(), esc = CS.esc;
const COURSE_GAMES = {macro:[["fed","Fed Chair"],["crisis","Crisis Desk"],["shift","Shift It"]], micro:[["profit","Profit Max"],["elastic","Elasticity Sprint"],["nash","Nash Hunt"]],
  bio:[["cross","Cross It"],["sorter","Cell Sorter"]], chem:[["balance","Balance It"],["periodic","Periodic Hunt"]]};
const TASK_NAME = {quiz:"Finish a unit quiz", cards:"Review your flashcards", daily:"Play the Daily Challenge", game:"Play any game"};

function counters(){ const s = S(), d = CS.today(); if (!s.dqc || s.dqc.d !== d) s.dqc = {d, right:0, ans:0, run:0, best:0, units:{}, games:{}}; return s.dqc; }

/* build today's three quests from a seeded roll, so everyone on a course gets the same ones */
function make(){
  const r = CS.seeded("dq|" + CS.COURSE + "|" + CS.today()), pick = a => a[Math.floor(r() * a.length)];
  const nU = CS.UNITS.length, games = COURSE_GAMES[CS.COURSE] || [];
  const easy = pick([
    () => { const n = pick([12, 15, 20]); return {kind:"right", n, text:`Answer ${n} questions correctly`}; },
    () => ({kind:"task", key:"quiz", n:1, text:TASK_NAME.quiz}),
    () => ({kind:"task", key:"cards", n:1, text:TASK_NAME.cards}),
    () => ({kind:"task", key:"game", n:1, text:TASK_NAME.game})
  ])();
  const mid = pick([
    () => { const u = 1 + Math.floor(r() * nU), n = pick([6, 8, 10]); return {kind:"unit", u, n, text:`Get ${n} questions right in Unit ${u}: ${CS.UNITS[u-1].short}`}; },
    () => { const n = pick([6, 8]); return {kind:"run", n, text:`Get ${n} right in a row`}; },
    () => { const g = pick(games); return g ? {kind:"game", key:g[0], n:1, text:`Play ${g[1]}`} : {kind:"task", key:"daily", n:1, text:TASK_NAME.daily}; },
    () => ({kind:"task", key:"daily", n:1, text:TASK_NAME.daily})
  ])();
  const hard = pick([
    () => { const n = pick([30, 40]); return {kind:"right", n, text:`Answer ${n} questions correctly`}; },
    () => ({kind:"spread", n:3, text:"Get 5 right in each of 3 different units"}),
    () => ({kind:"run", n:12, text:"Get 12 right in a row"})
  ])();
  /* make sure the three are not the same kind of task */
  const list = [easy, mid, hard];
  easy.rw = pick([{t:"creds", a:40}, {t:"creds", a:60}, {t:"xp", a:60}, {t:"xp", a:80}]);
  mid.rw = pick([{t:"gems", a:20}, {t:"gems", a:30}, {t:"xp", a:100}, {t:"creds", a:80}]);
  hard.rw = pick([{t:"egg", a:1}, {t:"egg", a:1}, {t:"gems", a:50}, {t:"creds", a:120}]);
  list.forEach((q, i) => { q.id = "q" + i; q.done = false; if (i === 2 && q.kind === mid.kind && q.n <= mid.n) q.n = mid.n + 8; });
  return list;
}
function ensure(){ const s = S(), d = CS.today(); if (!s.dq || s.dq.d !== d) s.dq = {d, list:make(), bonus:false}; return s.dq; }
CS.dailyQuests = () => { counters(); return ensure(); };

function have(q){ const c = counters(), t = S().tasks[CS.today()] || {};
  switch (q.kind) {
    case "right": return c.right;
    case "unit": return c.units[q.u] || 0;
    case "run": return c.best;
    case "spread": return Object.values(c.units).filter(x => x >= 5).length;
    case "task": return t[q.key] ? 1 : 0;
    case "game": return c.games[q.key] ? 1 : 0;
  } return 0; }
const rwText = rw => rw.t === "egg" ? "Egg" : rw.t === "gems" ? `+${rw.a} gems` : rw.t === "creds" ? `+${rw.a} creds` : `+${rw.a} XP`;
function grant(rw){ const s = S();
  if (rw.t === "gems") s.gems = (s.gems || 0) + rw.a;
  else if (rw.t === "creds") CS.earnCreds(rw.a, "daily quest");
  else if (rw.t === "xp") CS.addXP(rw.a);
  else if (rw.t === "egg") CS.giveEgg();
  CS.save(); }
function check(){
  const dq = ensure(); let changed = false;
  dq.list.forEach(q => { if (!q.done && have(q) >= q.n) { q.done = true; changed = true; grant(q.rw); CS.toast(`Daily quest done: ${q.text}. ${q.rw.t === "egg" ? "You earned an egg (sellable)!" : rwText(q.rw)}`); } });
  if (!dq.bonus && dq.list.every(q => q.done)) { dq.bonus = true; changed = true; S().gems = (S().gems || 0) + 25; CS.addXP(60); CS.toast("All three daily quests done! +25 gems and +60 XP");
    /* quest streak: days in a row with all three done (any class). Shared across classes and shown to friends. */
    const s = S(), d = CS.today(), q = s.dqs || (s.dqs = {last:"", n:0});
    if (q.last !== d) { q.n = q.last === CS.addDays(d, -1) ? q.n + 1 : 1; q.last = d; const M = {3:30, 7:75, 14:150, 30:400}[q.n]; if (M) { s.gems = (s.gems || 0) + M; CS.toast(`${q.n}-day quest streak! +${M} gems`); } } }
  if (changed) { CS.save(); if (CS.chrome) CS.chrome(); const el = document.getElementById("dq-card"); if (el) el.outerHTML = card(); }
}
CS.dqEvent = (kind, key) => { const c = counters(); if (kind === "game") c.games[key] = true; check(); };

/* count every answered question */
const rec = CS.record;
CS.record = function(q, ok, ...rest){ const out = rec.call(this, q, ok, ...rest); try {
  const c = counters(); c.ans++; if (ok) { c.right++; c.run++; if (c.run > c.best) c.best = c.run; if (q && q.u) c.units[q.u] = (c.units[q.u] || 0) + 1; } else c.run = 0;
  check(); } catch (e) {} return out; };
const ot = CS.onTask;
CS.onTask = k => { if (ot) ot(k); try { check(); } catch (e) {} };

function streakNow(){ const q = S().dqs, d = CS.today(); return q && q.last && (q.last === d || q.last === CS.addDays(d, -1)) ? q.n : 0; }
CS.dqStreak = streakNow;
function card(){
  const dq = CS.dailyQuests(), done = dq.list.filter(q => q.done).length;
  return `<div class="stack" id="dq-card"><div class="spread"><h2>Daily quests</h2><span class="muted small">${streakNow() ? "🔥 " + streakNow() + "-day streak · " : ""}${done}/3 done${dq.bonus ? " · bonus earned" : " · finish all three for +25 gems and +60 XP"}</span></div>
    <div class="dq-list">${dq.list.map(q => { const h = Math.min(q.n, have(q)), p = Math.round(h / q.n * 100);
      return `<div class="dq ${q.done ? "done" : ""}"><span class="ck" aria-hidden="true">${q.done ? "✓" : ""}</span>
        <span class="stack" style="gap:4px;flex:1;min-width:0"><b class="small">${esc(q.text)}</b><span class="dq-bar" aria-hidden="true"><i style="width:${p}%"></i></span><span class="tiny muted">${h}/${q.n}</span></span>
        <span class="dq-rw dq-${q.rw.t}">${q.rw.t === "egg" ? "🥚 Egg" : q.rw.t === "gems" ? "💎 " + q.rw.a : q.rw.t === "creds" ? CS.credIcon(14) + " " + q.rw.a : "⚡ " + q.rw.a + " XP"}</span></div>`; }).join("")}</div></div>`;
}
CS.dqCard = card;
})();
