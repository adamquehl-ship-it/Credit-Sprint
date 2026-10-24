/* Credit Sprint games: Daily Challenge, Boss Battle, Shift It, Sprint, Chain Reaction, True or False, Number Crunch, Match-up,
   plus Fed Chair (Macro) or Profit Max and Nash Hunt (Micro). */
(function(){
"use strict";
const CS = window.CS, $ = CS.$, $$ = CS.$$, esc = CS.esc, I = CS.icon;
const S = () => CS.S();
let timers = [];
const every = (fn, ms) => { const t = setInterval(fn, ms); timers.push(t); return t; };
CS.stopGames = () => { timers.forEach(clearInterval); timers = []; const a = $("#g-area"); if (a) a._key = null; };
let active = null, bossUnit = null;

const GAMES = [
  {k:"daily", n:"Daily Challenge", ic:"star", d:"Five questions, the same for every student today. Keep your daily streak going and compare your result.", best:()=>S().daily[CS.today()]?`Done today: ${S().daily[CS.today()].score}/5`:"Ready to play · +50 XP"},
  {k:"boss", n:"Boss Battle", ic:"sword", d:"Take on a unit boss. Every correct answer deals damage; three misses and you're out.", best:()=>{ const n = Object.values(S().bosses).filter(Boolean).length; return `${n}/6 bosses beaten`; }},
  {k:"shift", n:"Shift It", ic:"chart", d:"A headline hits the economy. Shift the right curve the right way before the clock runs out.", best:()=>S().best.shift!=null?`Best: ${S().best.shift}/10`:"Not played yet"},
  {k:"sprint", n:"Sprint", ic:"bolt", d:"60 seconds of rapid-fire questions. Streaks multiply your points; misses cost 3 seconds.", best:()=>S().best.sprint!=null?`Best: ${S().best.sprint} pts`:"Not played yet"},
  {k:"chain", n:"Chain Reaction", ic:"link", d:CS.COURSE==="micro"?"Put the cause-and-effect steps in order, from a market shock to the long-run outcome.":"Put the cause-and-effect steps in order, from the Fed's move to what happens to GDP.", best:()=>S().best.chainRounds!=null?`Best: ${S().best.chainRounds} perfect chains`:"Not played yet", isNew:true},
  {k:"tf", n:"True or False", ic:"tf", d:"45 seconds. Decide if each statement is true or false. Fast and brutal on misconceptions.", best:()=>S().best.tf!=null?`Best: ${S().best.tf} pts`:"Not played yet", isNew:true},
  {k:"crunch", n:"Number Crunch", ic:"calc", d:CS.COURSE==="micro"?"Two minutes of calculations: elasticity, costs, profit, MRP, surplus. Type the number.":"Two minutes of calculations: multipliers, CPI, money creation, growth. Type the number.", best:()=>S().best.crunch!=null?`Best: ${S().best.crunch} correct`:"Not played yet", isNew:true},
  ...(CS.COURSE==="micro" ? [] : [{k:"fed", n:"Fed Chair", ic:"bank", d:"Run the economy for 8 quarters. Keep inflation near 2% and unemployment near 4.5%.", best:()=>S().best.fed!=null?`Best: ${S().best.fed}/100`:"Not played yet"}]),
  ...(CS.COURSE==="micro" ? [
    {k:"profit", n:"Profit Max", ic:"calc", d:"You run the firm. Read the cost table, find where MR = MC, and pick the output that maximizes profit (or shut down).", best:()=>S().best.profit!=null?`Best: ${S().best.profit}/6`:"Not played yet"},
    {k:"nash", n:"Nash Hunt", ic:"sword", d:"Payoff matrices, fast. Spot dominant strategies and Nash equilibria before your rival does.", best:()=>S().best.nash!=null?`Best: ${S().best.nash}/8`:"Not played yet"}] : []),
  {k:"match", n:"Match-up", ic:"cards", d:"Match six terms to their definitions as fast as you can.", best:()=>S().best.match!=null?`Best: ${S().best.match.toFixed(1)}s`:"Not played yet"}
];

CS.render = CS.render || {};
CS.render.games = (o) => {
  CS.stopGames();
  if (o.game) active = o.game; else if (!o.keepScroll) active = null;
  if (o.unit) bossUnit = o.unit;
  const v = $("#v-games");
  if (!active) {
    const dc = S().daily[CS.today()];
    v.innerHTML = `<div class="page-head"><div class="stack" style="gap:6px"><span class="eyebrow">Learn it by playing it</span><h1>Games</h1><p class="muted">Every game earns XP, feeds your mastery scores and counts toward today's quests.</p></div></div>
      <div class="gamegrid">${GAMES.map((g,i)=>`<button class="gamecard ${i===0?"feature":""}" data-g="${g.k}"><span class="g-ico">${I(g.ic)}</span><span class="stack" style="gap:6px"><h3>${g.n}</h3><span class="muted small">${g.d}</span><span class="eyebrow" style="color:var(--accent)">${esc(g.best())}</span></span>${g.isNew?`<span class="tag acc new">New</span>`:""}${i===0&&!dc?`<span class="tag good new">Today</span>`:""}</button>`).join("")}</div>`;
    $$("#v-games [data-g]").forEach(b => b.onclick = () => CS.render.games({game:b.dataset.g}));
    return;
  }
  let g = GAMES.find(x=>x.k===active); if (!g) { active = null; return CS.render.games({}); }
  v.innerHTML = `<div class="spread"><div class="row-wrap" style="gap:12px"><span class="g-ico" style="width:44px;height:44px;border-radius:12px;display:grid;place-items:center;background:var(--accent-soft);color:var(--accent)">${I(g.ic)}</span><div><span class="eyebrow">Games</span><h2>${g.n}</h2></div></div><button class="btn sm ghost" id="g-back">← All games</button></div><div class="panel" id="g-area"></div>`;
  $("#g-back").onclick = () => { active = null; CS.render.games({}); };
  ({daily, boss, shift, sprint, chain, tf, crunch, fed, match, profit, nash})[active]($("#g-area"));
};
function finish(points){ CS.addXP(Math.max(5, Math.round(points))); CS.markTask("game"); S().games = (S().games||0)+1; CS.refresh(); }
document.addEventListener("keydown", e => { const a = $("#g-area"); if (a && a._key && !$("#v-games").hidden && !/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) a._key(e); });

/* ---------- Daily Challenge ---------- */
function daily(area){
  const key = CS.today(), done = S().daily[key];
  const rnd = CS.seeded("cs-daily-"+key);
  const pool = CS.QS.slice(), qs = [];
  while (qs.length < 5) { const q = pool.splice(Math.floor(rnd()*pool.length),1)[0]; qs.push({...q, opts: q.opts.slice().sort(()=>rnd()-0.5)}); }
  const dstreak = () => { let n = 0, k = key; if (!S().daily[k]) k = CS.addDays(k,-1); while (S().daily[k]) { n++; k = CS.addDays(k,-1); } return n; };
  if (done) return results(done);
  area.innerHTML = `<p style="max-width:62ch">Five questions, picked for everyone today. One attempt. Score 5/5 for a perfect day.</p>
    <div class="row-wrap"><span class="tag acc">${I("star","ico")} Daily streak: ${dstreak()} day${dstreak()===1?"":"s"}</span></div>
    <div><button class="btn lg" id="dc-go">Start today's challenge</button></div>`;
  $("#dc-go").onclick = () => play(0, []);
  function play(i, grid){
    if (i >= qs.length) { const score = grid.filter(Boolean).length; S().daily[key] = {score, grid}; CS.addXP(50 + score*5); CS.markTask("daily"); finish(0); return results(S().daily[key]); }
    const q = qs[i];
    area.innerHTML = `<div class="spread"><span class="eyebrow">Question ${i+1} of 5 · Unit ${q.u}</span><div class="grid5">${[0,1,2,3,4].map(k=>`<i class="${k<grid.length?(grid[k]?"r":"w"):""}"></i>`).join("")}</div></div>
      <p class="qtext">${esc(q.q)}</p><div class="opts">${q.opts.map((o,j)=>`<button class="opt" data-j="${j}"><span class="k">${CS.L[j]}</span><span>${esc(o.t)}</span></button>`).join("")}</div><div id="dc-fb"></div>`;
    const pick = j => { const ok = q.opts[j].ok; CS.record(q, ok, false);
      $$(".opt", area).forEach((b,k)=>{ b.disabled = true; if (q.opts[k].ok) { b.classList.add("right"); b.insertAdjacentHTML("beforeend",`<span class="why">${esc(q.opts[k].w)}</span>`); } else if (k===j) b.classList.add("wrong"); });
      $("#dc-fb").innerHTML = `<button class="btn" id="dc-next">${i<4?"Next":"See result"}</button>`; $("#dc-next").onclick = () => play(i+1, grid.concat(ok)); $("#dc-next").focus({preventScroll:true}); area._key = e => { if (e.key==="Enter") $("#dc-next").click(); }; };
    $$(".opt", area).forEach(b => b.onclick = () => pick(+b.dataset.j));
    area._key = e => { if (["1","2","3","4","5"].includes(e.key)) pick(+e.key-1); };
  }
  function results(r){
    area._key = null;
    const share = `Credit Sprint daily ${key}: ${r.score}/5 ` + r.grid.map(x=>x?"🟩":"🟥").join("");
    area.innerHTML = `<span class="eyebrow">Today's result</span><div class="row-wrap" style="gap:18px;align-items:center"><div class="result-big">${r.score}/5</div><div class="grid5">${r.grid.map(x=>`<i class="${x?"r":"w"}"></i>`).join("")}</div></div>
      <p class="muted">${r.score===5?"Perfect day.":r.score>=3?"Solid. Misses went to your mistakes notebook.":"Tough one. Review your mistakes notebook to lock these in."} Daily streak: <b>${dstreak()}</b>. A new challenge unlocks at midnight.</p>
      <div class="row-wrap"><button class="btn" id="dc-copy">Copy result to share</button><button class="btn ghost" data-go="practice" data-mode="mistakes">Review mistakes</button></div><p class="small muted" id="dc-msg"></p>`;
    $("#dc-copy").onclick = async () => { try { await navigator.clipboard.writeText(share); $("#dc-msg").textContent = "Copied. Paste it in your group chat."; } catch(e) { $("#dc-msg").textContent = share; } };
  }
}

/* ---------- Boss Battle ---------- */
function boss(area){
  const BOSSES = CS.COURSE === "micro" ? {1:"The Scarcity Specter",2:"The Elasticity Eel",3:"The Marginal Cost Golem",4:"The Monopoly Overlord",5:"The Wage Warden",6:"The Externality Ooze"}
    : {1:"The Opportunity Costumer",2:"The Index Inflator",3:"The Multiplier Monster",4:"The Reserve Wraith",5:"The Phillips Phantom",6:"The Currency Kraken"};
  if (!bossUnit) return choose();
  fight(bossUnit);
  function choose(){
    area.innerHTML = `<p style="max-width:62ch">Each unit has a boss with 100 HP. Correct answers deal 10 damage, and three in a row deal a critical 20. You have three hearts. Beat the boss to earn its badge and 150 XP.</p>
      <div class="units">${CS.UNITS.map(u=>`<button class="task" data-u="${u.id}"><span class="g-ico" style="width:40px;height:40px;border-radius:10px;display:grid;place-items:center;background:${S().bosses[u.id]?"var(--good-bg)":"var(--accent-soft)"};color:${S().bosses[u.id]?"var(--good)":"var(--accent)"}">${I(S().bosses[u.id]?"check":"sword")}</span><span class="stack" style="gap:2px"><h3>${esc(BOSSES[u.id])}</h3><span class="muted small">Unit ${u.id} · ${esc(u.short)}${S().bosses[u.id]?" · defeated":""}</span></span></button>`).join("")}</div>`;
    $$("[data-u]", area).forEach(b => b.onclick = () => { bossUnit = +b.dataset.u; fight(bossUnit); });
  }
  function fight(u){
    const unit = CS.UNITS[u-1], qs = CS.shuffle(CS.QS.filter(q=>q.u===u)).map(CS.prepQ);
    let hp = 100, hearts = 3, i = 0, combo = 0;
    const face = (mood) => `<svg viewBox="0 0 84 84" aria-hidden="true"><rect x="6" y="10" width="72" height="66" rx="20" fill="var(--accent)"/><path d="M14 14 L24 2 L30 14 M54 14 L60 2 L70 14" fill="var(--accent-2)"/><circle cx="30" cy="38" r="7" fill="#fff"/><circle cx="54" cy="38" r="7" fill="#fff"/><circle cx="${mood==="hurt"?28:31}" cy="39" r="3" fill="#111827"/><circle cx="${mood==="hurt"?52:55}" cy="39" r="3" fill="#111827"/><path d="${mood==="hurt"?"M28 60 Q42 52 56 60":"M28 56 Q42 64 56 56"}" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M22 28 L36 32 M62 28 L48 32" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/></svg>`;
    draw("idle");
    function draw(mood, fb){
      if (hp <= 0) return win(); if (hearts <= 0 || i >= qs.length) return lose();
      const q = qs[i];
      area.innerHTML = `<div class="boss">${face(mood)}<div class="stack" style="gap:6px"><div class="spread"><b>${esc(BOSSES[u])}</b><span class="hearts">${[0,1,2].map(k=>`<span class="${k<hearts?"":"lost"}">${I("heart")}</span>`).join("")}</span></div><div class="hp"><i style="width:${hp}%"></i></div><span class="muted tiny">${hp} HP left · Unit ${u}: ${esc(unit.short)}${combo>=2?` · combo ${combo}`:""}</span></div></div>
        ${fb||""}<p class="qtext">${esc(q.q)}</p><div class="opts">${q.opts.map((o,j)=>`<button class="opt" data-j="${j}"><span class="k">${CS.L[j]}</span><span>${esc(o.t)}</span></button>`).join("")}</div>`;
      const pick = j => { const ok = q.opts[j].ok; CS.record(q, ok); i++;
        if (ok) { combo++; const dmg = combo>=3 ? 20 : 10; hp = Math.max(0, hp-dmg); draw("hurt", `<div class="feedback good"><b>${dmg===20?"Critical hit! −20 HP.":"Hit! −10 HP."}</b> ${esc(q.opts[j].w)}</div>`); }
        else { combo = 0; hearts--; const c = q.opts.find(o=>o.ok); draw("idle", `<div class="feedback bad"><b>Ouch, you lost a heart.</b> Answer: ${esc(c.t)}. ${esc(c.w)}</div>`); } };
      $$(".opt", area).forEach(b => b.onclick = () => pick(+b.dataset.j));
      area._key = e => { if (["1","2","3","4","5"].includes(e.key)) pick(+e.key-1); };
    }
    function win(){ area._key = null; const first = !S().bosses[u]; S().bosses[u] = Date.now(); finish(first?150:60);
      area.innerHTML = `<div class="boss">${face("hurt")}<div><span class="eyebrow">Victory</span><h2>You defeated ${esc(BOSSES[u])}</h2></div></div><p class="muted">${first?"+150 XP and a boss badge.":"+60 XP for the rematch."} ${hearts} heart${hearts===1?"":"s"} left.</p>
        <div class="row-wrap"><button class="btn" id="b-next">Fight another boss</button><button class="btn ghost" data-go="home">Dashboard</button></div>`;
      $("#b-next").onclick = () => { bossUnit = null; choose(); }; }
    function lose(){ area._key = null; finish(15);
      area.innerHTML = `<div class="boss">${face("idle")}<div><span class="eyebrow">Defeated</span><h2>${esc(BOSSES[u])} wins this round</h2></div></div><p class="muted">The boss had ${hp} HP left. Your misses are in the mistakes notebook. Review the Unit ${u} guide and try again.</p>
        <div class="row-wrap"><button class="btn" id="b-retry">Rematch</button><button class="btn ghost" data-go="learn" data-unit="${u}">Review Unit ${u}</button></div>`;
      $("#b-retry").onclick = () => fight(u); }
  }
}

/* ---------- Chain Reaction ---------- */
function chain(area){
  const ROUNDS = 3, set = CS.shuffle(CS.CHAINS).slice(0, ROUNDS);
  let r = 0, perfect = 0, totalMiss = 0;
  area.innerHTML = `<p style="max-width:62ch">Each round gives you the steps of an economic chain reaction, scrambled. Tap them in the right order. Every wrong tap is a strike.</p><div><button class="btn lg" id="c-go">Start · ${ROUNDS} chains</button></div>`;
  $("#c-go").onclick = () => round();
  function round(){
    if (r >= ROUNDS) return end();
    const [title, u, steps] = set[r], order = CS.shuffle(steps.map((s,i)=>i)); let placed = 0, miss = 0;
    draw();
    function draw(fb){
      area.innerHTML = `<div class="spread"><span class="eyebrow">Chain ${r+1} of ${ROUNDS} · Unit ${u}</span><span class="eyebrow">${miss} strike${miss===1?"":"s"}</span></div><h3>${esc(title)}</h3>
        <div class="guide" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr)">
          <div class="chain-built"><span class="eyebrow">Your chain</span>${steps.slice(0,placed).map((s,i)=>`<div class="step placed"><span class="n">${i+1}</span>${esc(s)}</div>`).join("")}${placed<steps.length?`<div class="step" style="border-style:dashed;color:var(--faint)"><span class="n">${placed+1}</span>What happens next?</div>`:""}</div>
          <div class="chain-pool"><span class="eyebrow">Steps</span>${order.filter(i=>i>=placed).map(i=>`<button class="step" data-i="${i}"><span class="n">?</span>${esc(steps[i])}</button>`).join("")}</div>
        </div>${fb||""}`;
      $$(".chain-pool [data-i]", area).forEach(b => b.onclick = () => {
        if (+b.dataset.i === placed) { placed++; if (placed === steps.length) { if (!miss) perfect++; totalMiss += miss; r++; CS.addXP(miss?10:20);
            area.insertAdjacentHTML("beforeend", ""); draw(`<div class="feedback good"><b>${miss?"Chain complete.":"Perfect chain!"}</b></div><div><button class="btn" id="c-next">${r<ROUNDS?"Next chain":"See results"}</button></div>`); $("#c-next").onclick = round; return; }
          draw(); }
        else { miss++; b.classList.add("shake"); setTimeout(()=>b.classList.remove("shake"), 400); $$(".eyebrow", area)[1].textContent = `${miss} strike${miss===1?"":"s"}`; }
      });
    }
  }
  function end(){
    CS.setBest("chain", perfect>=1?1:0); const nb = CS.setBest("chainRounds", perfect); finish(perfect*15+10);
    area.innerHTML = `<span class="eyebrow">Chain Reaction · results</span><div class="result-big">${perfect}/${ROUNDS}</div><p class="muted">perfect chains, ${totalMiss} total strike${totalMiss===1?"":"s"}${nb?" · new personal best":""}. These chains are exactly what FRQs ask you to explain.</p>
      <div class="row-wrap"><button class="btn" id="c-again">Play again</button><button class="btn ghost" data-go="frq">Try an FRQ</button></div>`;
    $("#c-again").onclick = () => chain(area);
  }
}

/* ---------- True or False ---------- */
function tf(area){
  const SECS = 45;
  area.innerHTML = `<p style="max-width:62ch">Statements fly at you for ${SECS} seconds. Right answers score 10 (×2 after 5 in a row); wrong answers cost 2 seconds. Use <span class="kbd">←</span> for false and <span class="kbd">→</span> for true.</p><div><button class="btn lg" id="t-go">Start</button></div>`;
  $("#t-go").onclick = go;
  function go(){
    const deck = CS.shuffle(CS.TF); let i = 0, score = 0, streak = 0, right = 0, n = 0, end = Date.now()+SECS*1000, over = false, last = "";
    every(() => { const left = (end-Date.now())/1000, bar = $("#t-bar"), tm = $("#t-time"); if (bar) bar.style.width = Math.max(0,left/SECS*100)+"%"; if (tm) tm.textContent = Math.max(0,Math.ceil(left)); if (left <= 0) stop(); }, 100);
    show();
    function show(){
      if (over) return; const [u, st, truth, why] = deck[i % deck.length];
      area.innerHTML = `<div class="hud"><span>Time <b id="t-time">${Math.ceil((end-Date.now())/1000)}</b>s</span><span>Score <b>${score}</b></span><span>Streak <b>${streak}</b>${streak>=5?` <span class="tag good">×2</span>`:""}</span></div>
        <div class="timebar"><i id="t-bar" style="width:${Math.max(0,(end-Date.now())/SECS/10)}%"></i></div>
        <span class="eyebrow">Unit ${u}</span><p class="statement">${esc(st)}</p>
        <div class="tf"><button class="f" id="t-f">← False</button><button class="t" id="t-t">True →</button></div>
        <p class="small muted" style="min-height:1.5em">${last}</p>`;
      const ans = v => { if (over) return; n++; const ok = v === truth; CS.record({u}, ok, false);
        if (ok) { streak++; right++; score += streak>=5 ? 20 : 10; last = `✓ ${esc(why)}`; } else { streak = 0; end -= 2000; last = `<span style="color:var(--bad)">✗ ${truth?"True":"False"}: ${esc(why)}</span>`; }
        i++; show(); };
      $("#t-t").onclick = () => ans(true); $("#t-f").onclick = () => ans(false);
      area._key = e => { if (e.key==="ArrowRight"||e.key==="t") ans(true); if (e.key==="ArrowLeft"||e.key==="f") ans(false); };
    }
    function stop(){
      if (over) return; over = true; CS.stopGames();
      const nb = CS.setBest("tf", score); finish(score/6);
      area.innerHTML = `<span class="eyebrow">True or False · results</span><div class="result-big">${score}</div><p class="muted">${right} of ${n} correct${nb?" · new personal best":""}.</p>
        <div class="row-wrap"><button class="btn" id="t-again">Play again</button><button class="btn ghost" data-go="cards">Review flashcards</button></div>`;
      $("#t-again").onclick = () => tf(area);
    }
  }
}

/* ---------- Number Crunch ---------- */
function crunch(area){
  const SECS = 120;
  area.innerHTML = `<p style="max-width:62ch">Two minutes of ${CS.C.short.toLowerCase()} math with fresh numbers every time. Type your answer and press Enter. Skipping costs 5 seconds.</p><div><button class="btn lg" id="n-go">Start</button></div>`;
  $("#n-go").onclick = go;
  function go(){
    let right = 0, n = 0, end = Date.now()+SECS*1000, over = false, last = "";
    every(() => { const left = (end-Date.now())/1000, bar = $("#n-bar"), tm = $("#n-time"); if (bar) bar.style.width = Math.max(0,left/SECS*100)+"%"; if (tm) tm.textContent = Math.max(0,Math.ceil(left)); if (left <= 0) stop(); }, 100);
    show();
    function show(){
      if (over) return; const g = CS.DRILLS[Math.floor(Math.random()*CS.DRILLS.length)], c = g.gen();
      area.innerHTML = `<div class="hud"><span>Time <b id="n-time">${Math.ceil((end-Date.now())/1000)}</b>s</span><span>Correct <b>${right}</b></span></div>
        <div class="timebar"><i id="n-bar" style="width:${Math.max(0,(end-Date.now())/SECS/10)}%"></i></div>
        <span class="eyebrow">${esc(g.n)} · Unit ${g.u}</span><p class="qtext">${esc(c.q)}</p>
        <form class="numin" id="n-form" autocomplete="off"><input id="n-in" inputmode="decimal" placeholder="Answer" aria-label="Answer"><button class="btn" type="submit">Enter</button><button class="btn ghost" type="button" id="n-skip">Skip</button></form>
        <p class="small muted" style="min-height:1.5em">${last}</p>`;
      $("#n-in").focus({preventScroll:true});
      $("#n-form").onsubmit = e => { e.preventDefault(); const v = $("#n-in").value.trim(); if (!v) return; n++; const ok = CS.numOK(v, c.ans); CS.record({u:g.u}, ok, false);
        if (ok) { right++; last = `✓ ${esc(c.work)}`; } else { end -= 3000; last = `<span style="color:var(--bad)">✗ ${esc(c.work)}</span>`; } show(); };
      $("#n-skip").onclick = () => { end -= 5000; last = `Skipped. ${esc(c.work)}`; show(); };
    }
    function stop(){
      if (over) return; over = true; CS.stopGames();
      const nb = CS.setBest("crunch", right); finish(right*8);
      area.innerHTML = `<span class="eyebrow">Number Crunch · results</span><div class="result-big">${right}</div><p class="muted">correct out of ${n} attempted${nb?" · new personal best":""}.</p>
        <div class="row-wrap"><button class="btn" id="n-again">Play again</button><button class="btn ghost" data-go="practice" data-mode="drills">Practice drills untimed</button></div>`;
      $("#n-again").onclick = () => crunch(area);
    }
  }
}

/* ---------- Shift It ---------- */
function shift(area){
  const ROUNDS = 10, LIMIT = 12;
  const deck = CS.shuffle(CS.SHIFTS).slice(0, ROUNDS);
  let i = 0, correct = 0, pts = 0;
  intro();
  function intro(){
    area.innerHTML = `<p style="max-width:62ch">Each round shows a news headline and the right graph. Pick the curve that shifts and the direction. You have ${LIMIT} seconds, and faster answers score more.</p>
      <p class="muted small">Right = increase, left = decrease.${CS.COURSE==="macro"?" In Phillips-curve rounds, right also means up.":" For supply and cost curves, a shift left is the same as a shift up."}</p><div><button class="btn accent" id="s-go">Start · ${ROUNDS} rounds</button></div>`;
    $("#s-go").onclick = round;
  }
  function round(){
    CS.stopGames();
    if (i >= ROUNDS) return end();
    const [mk, text, ok, why] = deck[i], m = CS.MARKETS[mk];
    const t0 = Date.now();
    area.innerHTML = `<div class="hud"><span>Round <b>${i+1}</b>/${ROUNDS}</span><span>Correct <b>${correct}</b></span><span>Points <b>${pts}</b></span></div>
      <div class="timebar"><i id="s-bar" style="width:100%"></i></div>
      <div class="guide" style="grid-template-columns:minmax(0,1fr) 320px">
        <div class="stack"><span class="eyebrow">${esc(m.name)}</span><p class="event">${esc(text)}</p>
          <div class="shift-pad">${m.curves.map(c=>`<span class="curvebtn"><span>${esc(c.label||c.k)}</span><button data-c="${esc(c.k)}" data-d="-1" aria-label="${esc(c.k)} left">←</button><button data-c="${esc(c.k)}" data-d="1" aria-label="${esc(c.k)} right">→</button></span>`).join("")}</div>
          <div id="s-fb"></div></div>
        <div class="lab grid-paper" id="s-graph">${CS.market(mk).svg}</div>
      </div>`;
    every(() => { const left = LIMIT - (Date.now()-t0)/1000; const bar = $("#s-bar"); if (bar) bar.style.width = Math.max(0,left/LIMIT*100)+"%"; if (left <= 0) answer(null, null); }, 100);
    $$("[data-c]", area).forEach(b => b.onclick = () => answer(b.dataset.c, +b.dataset.d));
    let done = false;
    function answer(c, d){
      if (done) return; done = true; CS.stopGames();
      const hit = c && ok.some(([k,dir]) => k===c && dir===d);
      const secs = (Date.now()-t0)/1000;
      if (hit) { correct++; pts += 100 + Math.round(Math.max(0, LIMIT-secs)/LIMIT*50); }
      const [ck, cd] = hit ? [c,d] : ok[0];
      $("#s-graph").innerHTML = CS.market(mk, {[ck]: cd*16}).svg;
      $$("[data-c]", area).forEach(b => { b.disabled = true; });
      $("#s-fb").innerHTML = `<div class="feedback ${hit?"good":"bad"}"><b>${hit?"Correct.":c?"Not quite.":"Time's up."}</b> ${esc(why)}${!hit?` The answer: ${esc(ok[0][0])} shifts ${ok[0][1]>0?"right":"left"}.`:""}</div>
        <div style="margin-top:10px"><button class="btn" id="s-next">${i+1<ROUNDS?"Next headline":"See results"}</button></div>`;
      $("#s-next").onclick = () => { i++; round(); }; $("#s-next").focus({preventScroll:true});
    }
  }
  function end(){
    const nb = CS.setBest("shift", correct); CS.setBest("shiftPts", pts); finish(pts/10);
    area.innerHTML = `<span class="eyebrow">Shift It · results</span><div class="result-big mono">${correct}/${ROUNDS}</div>
      <p class="muted">${pts} points${nb?" · new personal best":""}. ${correct>=9?"You read graphs like an economist.":correct>=6?"Solid. The misses are worth a second look in Graph Lab.":"Open Graph Lab and practice shifting each curve."}</p>
      <div class="row-wrap"><button class="btn" id="s-again">Play again</button><button class="btn ghost" data-go="learn" data-lab="${CS.COURSE==="micro"?"sd":"adas"}">Open Graph Lab</button></div>`;
    $("#s-again").onclick = () => shift(area);
  }
}

/* ---------- Sprint ---------- */
function sprint(area){
  const SECS = 60;
  area.innerHTML = `<p style="max-width:62ch">Answer as many questions as you can in ${SECS} seconds. Every 3 in a row raises your multiplier (up to ×4). A miss resets it and costs 3 seconds.</p>
    <div class="row-wrap"><button class="btn accent" id="r-go">Start sprint</button><span class="muted small">Keys 1–5 answer.</span></div>`;
  $("#r-go").onclick = go;
  function go(){
    const pool = CS.shuffle(CS.QS).map(CS.prepQ); let qi = 0, score = 0, streak = 0, right = 0, total = 0, end = Date.now() + SECS*1000, over = false;
    const mult = () => Math.min(4, 1 + Math.floor(streak/3));
    show();
    every(() => { const left = (end - Date.now())/1000; const t = $("#r-time"), bar = $("#r-bar"); if (t) t.textContent = Math.max(0, Math.ceil(left)); if (bar) bar.style.width = Math.max(0,left/SECS*100)+"%"; if (left <= 0) stop(); }, 100);
    function show(){
      if (over) return; const q = pool[qi % pool.length];
      area.innerHTML = `<div class="hud"><span>Time <b id="r-time">${Math.ceil((end-Date.now())/1000)}</b>s</span><span>Score <b>${score}</b></span><span>Multiplier <b>×${mult()}</b></span><span>Streak <b>${streak}</b></span></div>
        <div class="timebar"><i id="r-bar" style="width:${(end-Date.now())/SECS/10}%"></i></div>
        <p class="qtext">${esc(q.q)}</p>
        <div class="opts">${q.opts.map((o,j)=>`<button class="opt" data-j="${j}"><span class="k">${CS.L[j]}</span><span>${esc(o.t)}</span></button>`).join("")}</div>`;
      $$(".opt", area).forEach(b => b.onclick = () => pick(+b.dataset.j));
      area._key = e => { if (["1","2","3","4","5"].includes(e.key)) pick(+e.key-1); };
      function pick(j){
        if (over) return; total++;
        const ok = q.opts[j].ok; CS.record(q, ok);
        if (ok) { streak++; right++; score += 10*mult(); } else { streak = 0; end -= 3000; }
        const btns = $$(".opt", area); btns.forEach(b => b.disabled = true);
        btns[j].classList.add(ok ? "right" : "wrong"); if (!ok) btns[q.opts.findIndex(o=>o.ok)].classList.add("right");
        qi++; setTimeout(show, ok ? 250 : 900);
      }
    }
    function stop(){
      if (over) return; over = true; CS.stopGames(); area._key = null;
      const nb = CS.setBest("sprint", score); finish(score/5);
      area.innerHTML = `<span class="eyebrow">Sprint · results</span><div class="result-big mono">${score}</div>
        <p class="muted">${right} of ${total} correct${nb?" · new personal best":""}. Misses went into your mistakes notebook.</p>
        <div class="row-wrap"><button class="btn" id="r-again">Run it back</button><button class="btn ghost" data-go="practice" data-mode="mistakes">Review mistakes</button></div>`;
      $("#r-again").onclick = () => sprint(area);
    }
  }
}

/* ---------- Fed Chair ---------- */
function fed(area){
  const QTRS = 8;
  const starts = [
    {n:"Recession", g:-2.0, pi:1.4, d:"Output is well below potential and unemployment is climbing."},
    {n:"Overheating", g:1.6, pi:4.2, d:"The economy is running hot and inflation is well above target."},
    {n:"Stagflation", g:-1.0, pi:4.0, d:"Supply shocks have pushed inflation up while output sags."}
  ];
  const sc = starts[Math.floor(Math.random()*starts.length)];
  const st = {q:0, g:sc.g, pi:sc.pi, hist:{pi:[sc.pi], u:[4.5-0.5*sc.g]}, scores:[], log:[], mon:0, fis:0, deficits:0};
  const events = CS.shuffle(CS.EVENTS);
  let ev = events[0];
  const MON = [["Cut rates",1,"Lower rates → more borrowing and investment → AD shifts right."],["Hold rates",0,"No change in the policy rate."],["Raise rates",-1,"Higher rates → less borrowing and investment → AD shifts left."]];
  const FIS = [["Stimulus",1,"More spending or tax cuts → AD shifts right (and a bigger deficit)."],["No change",0,"Fiscal policy stays put."],["Austerity",-1,"Less spending or higher taxes → AD shifts left."]];
  render();
  function u(){ return 4.5 - 0.5*st.g; }
  function render(){
    if (st.q >= QTRS) return end();
    const infl = st.pi, un = u();
    const tone = (v, t, tol) => Math.abs(v-t) <= tol ? "good" : Math.abs(v-t) <= tol*2.5 ? "warn" : "bad";
    area.innerHTML = `<div class="fed">
      <div class="stack" style="gap:16px">
        <div class="spread"><span class="eyebrow">Quarter ${st.q+1} of ${QTRS} · starting point: ${esc(sc.n)}</span><span class="mono small">Score so far: ${st.scores.length?Math.round(st.scores.reduce((a,b)=>a+b,0)/st.scores.length):"—"}</span></div>
        ${st.q===0?`<p class="muted">${esc(sc.d)}</p>`:""}
        <div class="gauges">
          <div class="gauge"><span class="eyebrow">Inflation</span><span class="big">${infl.toFixed(1)}%</span><span class="tag ${tone(infl,2,0.5)}">target 2%</span></div>
          <div class="gauge"><span class="eyebrow">Unemployment</span><span class="big">${un.toFixed(1)}%</span><span class="tag ${tone(un,4.5,0.5)}">natural 4.5%</span></div>
          <div class="gauge"><span class="eyebrow">Output gap</span><span class="big">${st.g>0?"+":""}${st.g.toFixed(1)}%</span><span class="tag">${st.g<-0.3?"recessionary":st.g>0.3?"inflationary":"closed"}</span></div>
        </div>
        <div class="panel grid-paper" style="padding:14px"><span class="eyebrow">This quarter's headline</span><p class="event">${esc(ev[0])}</p><p class="muted small">${esc(ev[3])}</p></div>
        <div class="stack" style="gap:8px"><span class="eyebrow">Monetary policy (the Fed)</span><div class="choice">${MON.map((m,j)=>`<button data-mon="${m[1]}" aria-pressed="${st.mon===m[1]}">${m[0]}</button>`).join("")}</div></div>
        <div class="stack" style="gap:8px"><span class="eyebrow">Fiscal policy (Congress)</span><div class="choice">${FIS.map((f,j)=>`<button data-fis="${f[1]}" aria-pressed="${st.fis===f[1]}">${f[0]}</button>`).join("")}</div></div>
        <div><button class="btn accent" id="f-go">Set policy for Q${st.q+1}</button></div>
      </div>
      <div class="stack">
        <div class="panel" style="padding:14px">${CS.lines([{vals:st.hist.pi,col:"--accent"},{vals:st.hist.u,col:"--curve2"}],{n:QTRS+1,lo:0,hi:10,title:"Inflation and unemployment by quarter",targets:[{v:2,col:"--accent"},{v:4.5,col:"--curve2"}]})}
          <div class="row-wrap small"><span style="color:var(--accent)">● Inflation</span><span style="color:var(--curve2)">● Unemployment</span><span class="muted">dashed = targets</span></div></div>
        <div class="log">${st.log.slice().reverse().map(l=>`<div>${l}</div>`).join("") || `<div class="muted">Your decisions and their effects will appear here.</div>`}</div>
      </div></div>`;
    $$("[data-mon]", area).forEach(b => b.onclick = () => { st.mon = +b.dataset.mon; render(); });
    $$("[data-fis]", area).forEach(b => b.onclick = () => { st.fis = +b.dataset.fis; render(); });
    $("#f-go").onclick = step;
  }
  function step(){
    const noise = () => (Math.random()-0.5)*0.3;
    if (st.fis === 1) st.deficits++;
    const crowd = st.deficits > 3 ? 0.25 : 0;
    const g2 = 0.6*st.g + 0.7*st.mon + 0.8*st.fis - crowd + ev[1] + noise();
    const pi2 = st.pi + 0.35*g2 + ev[2] + 0.15*(2 - st.pi) + noise();
    st.g = Math.max(-5, Math.min(5, g2)); st.pi = Math.max(-1, Math.min(12, pi2));
    const score = Math.max(0, Math.round(100 - 18*Math.abs(st.pi-2) - 14*Math.abs(u()-4.5)));
    st.scores.push(score); st.hist.pi.push(+st.pi.toFixed(2)); st.hist.u.push(+u().toFixed(2));
    const m = MON.find(x=>x[1]===st.mon), f = FIS.find(x=>x[1]===st.fis);
    st.log.push(`<b>Q${st.q+1}</b> · ${esc(ev[0])}. You chose <b>${m[0].toLowerCase()}</b> and <b>${f[0].toLowerCase()}</b>. ${esc(m[1]?m[2]:"")} ${esc(f[1]?f[2]:"")}${crowd&&st.fis===1?" Repeated deficits are starting to crowd out private investment.":""} Result: inflation ${st.pi.toFixed(1)}%, unemployment ${u().toFixed(1)}% · <span class="mono">${score} pts</span>`);
    st.q++; ev = events[st.q % events.length]; st.mon = 0; st.fis = 0;
    render();
  }
  function end(){
    const avg = Math.round(st.scores.reduce((a,b)=>a+b,0)/st.scores.length);
    const grade = avg>=90?"A":avg>=80?"B":avg>=70?"C":avg>=60?"D":"F";
    const nb = CS.setBest("fed", avg); finish(avg/2);
    area.innerHTML = `<div class="fed"><div class="stack" style="gap:14px"><span class="eyebrow">Fed Chair · term complete</span>
      <div class="row-wrap" style="gap:20px;align-items:end"><div class="result-big">${grade}</div><p class="muted">Average ${avg}/100${nb?" · new personal best":""}. Final inflation ${st.pi.toFixed(1)}%, unemployment ${u().toFixed(1)}%.</p></div>
      <p style="max-width:60ch">${grade==="A"||grade==="B"?"You leaned against shocks without overreacting. That's the job.":"Watch the direction of each move: when inflation is above target, tighten (raise rates or austerity); when output is below potential, ease. Remember policy works with a lag."}</p>
      <div class="row-wrap"><button class="btn" id="f-again">New term</button><button class="btn ghost" data-go="learn" data-unit="5">Review Unit 5</button></div></div>
      <div class="stack"><div class="panel" style="padding:14px">${CS.lines([{vals:st.hist.pi,col:"--accent"},{vals:st.hist.u,col:"--curve2"}],{n:QTRS+1,lo:0,hi:10,title:"Your term",targets:[{v:2,col:"--accent"},{v:4.5,col:"--curve2"}]})}</div>
      <div class="log">${st.log.slice().reverse().map(l=>`<div>${l}</div>`).join("")}</div></div></div>`;
    $("#f-again").onclick = () => fed(area);
  }
}

/* ---------- Profit Max (Micro) ---------- */
function profit(area){
  const ROUNDS = 6; let i = 0, right = 0, pts = 0;
  const ri = (a,b) => a + Math.floor(Math.random()*(b-a+1));
  function makeRound(){
    for (let tries = 0; tries < 200; tries++) {
      const mono = Math.random() < 0.45, sc = ri(1,2), m = ri(5,14), fc = ri(2,8)*5;
      const mc = [m+6, m, m+3, m+8, m+15, m+24].map(x=>x*sc);
      const tc = [fc]; mc.forEach((x,k)=>tc.push(tc[k]+x));
      let price = null, prices = null;
      if (mono) { const a = ri(14,30)*sc*2, b = ri(2,5)*sc; prices = [0,1,2,3,4,5,6].map(q=>a-b*q); if (prices[6] <= 0) continue; }
      else { price = ri(m-2, m+26)*sc; if (mc.includes(price)) continue; }
      const P = q => mono ? prices[q] : price, prof = [0,1,2,3,4,5,6].map(q => q === 0 ? -fc : P(q)*q - tc[q]);
      const best = Math.max(...prof); if (prof.filter(x=>x===best).length > 1) continue;
      return {mono, fc, mc, tc, price, prices, prof, ans:prof.indexOf(best)};
    }
  }
  intro();
  function intro(){
    area.innerHTML = `<p style="max-width:62ch">You're the manager. Each round gives you a cost table. Some rounds you're a price taker in perfect competition; some rounds you're a monopoly with a demand schedule. Choose the output that maximizes profit. Choose 0 to shut down.</p>
      <p class="muted small">Tip: find marginal cost (the change in TC), compare it with marginal revenue, and produce every unit where MR ≥ MC. Shut down if price can't cover average variable cost.</p><div><button class="btn accent" id="pm-go">Start · ${ROUNDS} rounds</button></div>`;
    $("#pm-go").onclick = round;
  }
  function round(){
    if (i >= ROUNDS) return end();
    const r = makeRound(), t0 = Date.now();
    const table = (reveal) => `<div class="ptable-wrap"><table class="ptable"><thead><tr><th>Q</th>${r.mono?"<th>Price</th>":""}<th>Total cost</th>${reveal?`<th>MC</th><th>MR</th><th>Profit</th>`:""}</tr></thead><tbody>
      ${[0,1,2,3,4,5,6].map(q=>{ const tr = (r.mono?r.prices[q]:r.price)*q, ptr = q?(r.mono?r.prices[q-1]:r.price)*(q-1):0;
        return `<tr class="${reveal&&q===r.ans?"best":""}"><td><b>${q}</b></td>${r.mono?`<td>${q?"$"+r.prices[q]:"—"}</td>`:""}<td>$${r.tc[q]}</td>${reveal?`<td>${q?"$"+r.mc[q-1]:"—"}</td><td>${q?"$"+(tr-ptr):"—"}</td><td class="${r.prof[q]<0?"neg":""}">${r.prof[q]<0?"−$"+(-r.prof[q]):"$"+r.prof[q]}</td>`:""}</tr>`; }).join("")}</tbody></table></div>`;
    area.innerHTML = `<div class="hud"><span>Round <b>${i+1}</b>/${ROUNDS}</span><span>Correct <b>${right}</b></span><span>Points <b>${pts}</b></span></div>
      <div class="guide" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:start">
        <div class="stack"><span class="eyebrow">${r.mono?"Monopoly · you set the price on demand":"Perfect competition · price taker"}</span>
          <p class="event">${r.mono?"Your firm is the only seller. The table shows the price you can charge at each output.":`The market price is <b>$${r.price}</b>. You can sell as many units as you want at that price.`}</p>
          <p class="muted small">Fixed cost is $${r.fc} (the total cost at Q = 0).</p>
          <span class="eyebrow">How many units should you produce?</span>
          <div class="qpick">${[0,1,2,3,4,5,6].map(q=>`<button data-q="${q}">${q}</button>`).join("")}</div><div id="pm-fb"></div></div>
        <div id="pm-table">${table(false)}</div></div>`;
    let done = false;
    const pick = q => { if (done) return; done = true; const ok = q === r.ans; CS.record({u:r.mono?4:3}, ok, false);
      if (ok) { right++; pts += 100 + Math.max(0, 50 - Math.round((Date.now()-t0)/1000)*2); }
      $$("[data-q]", area).forEach(b => { b.disabled = true; if (+b.dataset.q === r.ans) b.classList.add("right"); else if (+b.dataset.q === q) b.classList.add("wrong"); });
      $("#pm-table").innerHTML = table(true);
      const why = r.ans === 0 ? `Shut down: at every output the loss is bigger than the fixed cost of $${r.fc}, because price never covers average variable cost.`
        : `Produce ${r.ans}: profit is highest there (see the table).${r.ans<6?` Unit ${r.ans+1} would add more to cost (MC $${r.mc[r.ans]}) than to revenue.`:""} ${r.prof[r.ans]>=0?`Profit: $${r.prof[r.ans]}.`:`That's a loss of $${-r.prof[r.ans]}, but smaller than shutting down (−$${r.fc}).`}${r.mono?` Charge $${r.prices[r.ans]}, the price on demand.`:""}`;
      $("#pm-fb").innerHTML = `<div class="feedback ${ok?"good":"bad"}"><b>${ok?"Profit maximized.":"Not quite."}</b> ${esc(why)}</div><div style="margin-top:10px"><button class="btn" id="pm-next">${i+1<ROUNDS?"Next firm":"See results"}</button></div>`;
      $("#pm-next").onclick = () => { i++; round(); }; $("#pm-next").focus({preventScroll:true}); area._key = e => { if (e.key==="Enter") $("#pm-next").click(); };
    };
    $$("[data-q]", area).forEach(b => b.onclick = () => pick(+b.dataset.q));
    area._key = e => { if (/^[0-6]$/.test(e.key)) pick(+e.key); };
  }
  function end(){
    area._key = null; const nb = CS.setBest("profit", right); finish(pts/10);
    area.innerHTML = `<span class="eyebrow">Profit Max · results</span><div class="result-big">${right}/${ROUNDS}</div><p class="muted">${pts} points${nb?" · new personal best":""}. ${right>=5?"You think like an economist: every unit where MR ≥ MC.":"Remember: compare MR with MC one unit at a time, and shut down only if price is below AVC."}</p>
      <div class="row-wrap"><button class="btn" id="pm-again">Play again</button><button class="btn ghost" data-go="learn" data-unit="3">Review Unit 3</button></div>`;
    $("#pm-again").onclick = () => { i = 0; right = 0; pts = 0; round(); };
  }
}

/* ---------- Nash Hunt (Micro) ---------- */
function nash(area){
  const ROUNDS = 8; let i = 0, right = 0, streak = 0, pts = 0;
  const NAMES = [["Alpha","Beta"],["Nova","Orbit"],["Brewhaus","Daily Grind"],["Lin","Sam"],["Red Co","Blue Co"],["Kite","Comet"]];
  const STRATS = [["High price","Low price"],["Advertise","Don't"],["Expand","Wait"],["Enter","Stay out"],["Cooperate","Cheat"]];
  const ri = (a,b) => a + Math.floor(Math.random()*(b-a+1));
  function analyze(M){ // M[r][c] = [rowPay, colPay]
    const rowDom = [0,1].find(a => [0,1].every(c => M[a][c][0] > M[1-a][c][0]));
    const colDom = [0,1].find(b => [0,1].every(r => M[r][b][1] > M[r][1-b][1]));
    const ne = []; [0,1].forEach(r => [0,1].forEach(c => { if (M[r][c][0] >= M[1-r][c][0] && M[r][c][1] >= M[r][1-c][1]) ne.push(r*2+c); }));
    return {rowDom, colDom, ne};
  }
  function makeGame(){
    const ev = window.CS_EVENTS && Math.random() < .4 ? window.CS_EVENTS[ri(0, window.CS_EVENTS.length-1)] : null;
    if (ev) return {names:[ev[0],ev[1]], rs:[ev[2],ev[3]], cs:[ev[4],ev[5]], M:[[ev[6][0],ev[6][1]],[ev[6][2],ev[6][3]]]};
    for (;;) { const M = [[[ri(1,9),ri(1,9)],[ri(1,9),ri(1,9)]],[[ri(1,9),ri(1,9)],[ri(1,9),ri(1,9)]]];
      if ([0,1].some(c => M[0][c][0] === M[1][c][0]) || [0,1].some(r => M[r][0][1] === M[r][1][1])) continue;
      const nm = NAMES[ri(0,NAMES.length-1)], st = STRATS[ri(0,STRATS.length-1)];
      return {names:nm, rs:st, cs:st, M:M.map(row=>row.map(c=>c.map(x=>x*10)))}; }
  }
  intro();
  function intro(){
    area.innerHTML = `<p style="max-width:62ch">Each round shows a payoff matrix: the first number in each cell goes to the row player, the second to the column player. Answer fast: streaks earn bonus points.</p>
      <p class="muted small">Dominant strategy: best no matter what the other player does. Nash equilibrium: no one wants to switch alone.</p><div><button class="btn accent" id="nh-go">Start · ${ROUNDS} rounds</button></div>`;
    $("#nh-go").onclick = round;
  }
  function round(){
    if (i >= ROUNDS) return end();
    const g = makeGame(), A = analyze(g.M), t0 = Date.now(), kind = ["row","col","ne"][ri(0,2)], [rn, cn] = g.names;
    const cellTxt = k => { const r = k>>1, c = k&1; return `${g.rs[r]} / ${g.cs[c]}`; };
    let q, opts, isRight;
    if (kind === "row") { q = `Does ${rn} have a dominant strategy?`; opts = [`Yes: ${g.rs[0]}`, `Yes: ${g.rs[1]}`, "No dominant strategy"]; const a = A.rowDom==null?2:A.rowDom; isRight = j => j === a; }
    else if (kind === "col") { q = `Does ${cn} have a dominant strategy?`; opts = [`Yes: ${g.cs[0]}`, `Yes: ${g.cs[1]}`, "No dominant strategy"]; const a = A.colDom==null?2:A.colDom; isRight = j => j === a; }
    else { q = `Pick a Nash equilibrium (${rn} / ${cn}).`; opts = [0,1,2,3].map(cellTxt).concat(["No pure-strategy equilibrium"]); isRight = j => j === 4 ? !A.ne.length : A.ne.includes(j); }
    area.innerHTML = `<div class="hud"><span>Round <b>${i+1}</b>/${ROUNDS}</span><span>Correct <b>${right}</b></span><span>Streak <b>${streak}</b></span><span>Points <b>${pts}</b></span></div>
      <div class="guide" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:start">
        <div class="matrix-wrap"><table class="matrix"><thead><tr><th class="corner"><span>${esc(rn)} ↓</span><span>${esc(cn)} →</span></th><th>${esc(g.cs[0])}</th><th>${esc(g.cs[1])}</th></tr></thead><tbody>
          ${[0,1].map(r=>`<tr><th>${esc(g.rs[r])}</th>${[0,1].map(c=>`<td data-cell="${r*2+c}"><span class="rp">${g.M[r][c][0]}</span>, <span class="cp">${g.M[r][c][1]}</span></td>`).join("")}</tr>`).join("")}</tbody></table>
          <p class="tiny muted"><span class="rp">${esc(rn)}</span>'s payoff first, <span class="cp">${esc(cn)}</span>'s second.</p></div>
        <div class="stack"><p class="qtext">${esc(q)}</p><div class="opts">${opts.map((o,j)=>`<button class="opt" data-j="${j}"><span class="k">${CS.L[j]}</span><span>${esc(o)}</span></button>`).join("")}</div><div id="nh-fb"></div></div></div>`;
    let done = false;
    const pick = j => { if (done) return; done = true; const ok = isRight(j); CS.record({u:4}, ok, false);
      if (ok) { right++; streak++; pts += 100 + Math.max(0, 40 - Math.round((Date.now()-t0)/1000)*2) + (streak>=3?25:0); } else streak = 0;
      $$(".opt", area).forEach((b,k) => { b.disabled = true; if (isRight(k)) b.classList.add("right"); else if (k === j) b.classList.add("wrong"); });
      A.ne.forEach(k => { const td = $(`[data-cell="${k}"]`, area); if (td) td.classList.add("ne"); });
      const domTxt = (who, d, names) => d==null ? `${who} has no dominant strategy` : `${who}'s dominant strategy is ${names[d]}`;
      const why = `${domTxt(rn, A.rowDom, g.rs)}; ${domTxt(cn, A.colDom, g.cs)}. ${A.ne.length?`Nash equilibri${A.ne.length>1?"a":"um"}: ${A.ne.map(cellTxt).join(" and ")} (highlighted).`:"There's no pure-strategy Nash equilibrium."}`;
      $("#nh-fb").innerHTML = `<div class="feedback ${ok?"good":"bad"}"><b>${ok?(streak>=3?"Streak bonus!":"Correct."):"Not quite."}</b> ${esc(why)}</div><div style="margin-top:10px"><button class="btn" id="nh-next">${i+1<ROUNDS?"Next matrix":"See results"}</button></div>`;
      $("#nh-next").onclick = () => { i++; round(); }; $("#nh-next").focus({preventScroll:true}); area._key = e => { if (e.key==="Enter") $("#nh-next").click(); };
    };
    $$(".opt", area).forEach(b => b.onclick = () => pick(+b.dataset.j));
    area._key = e => { if (["1","2","3","4","5"].includes(e.key) && +e.key <= opts.length) pick(+e.key-1); };
  }
  function end(){
    area._key = null; const nb = CS.setBest("nash", right); finish(pts/10);
    area.innerHTML = `<span class="eyebrow">Nash Hunt · results</span><div class="result-big">${right}/${ROUNDS}</div><p class="muted">${pts} points${nb?" · new personal best":""}. ${right>=7?"Game theorist status.":"Check one player at a time: cover up the other player's numbers and compare."}</p>
      <div class="row-wrap"><button class="btn" id="nh-again">Play again</button><button class="btn ghost" data-go="learn" data-unit="4">Review Unit 4</button></div>`;
    $("#nh-again").onclick = () => { i = 0; right = 0; streak = 0; pts = 0; round(); };
  }
}

/* ---------- Match-up ---------- */
function match(area){
  const unitOpts = [["all","All units"]].concat(CS.UNITS.map(u=>[u.id,"Unit "+u.id]));
  let pickU = "all";
  intro();
  function intro(){
    area.innerHTML = `<p style="max-width:62ch">Six terms, six definitions. Tap a term, then its definition. Wrong matches add 3 seconds.</p>
      <div class="chips">${unitOpts.map(([k,t])=>`<button class="chip" aria-pressed="${String(k)===String(pickU)}" data-u="${k}">${t}</button>`).join("")}</div>
      <div><button class="btn accent" id="m-go">Start</button></div>`;
    $$("[data-u]", area).forEach(b => b.onclick = () => { pickU = b.dataset.u === "all" ? "all" : +b.dataset.u; intro(); });
    $("#m-go").onclick = go;
  }
  function go(){
    const pool = CS.CARDS.filter(c => pickU==="all" || c.u===pickU);
    const set = CS.shuffle(pool).slice(0,6), defs = CS.shuffle(set);
    let sel = null, left = set.length, penalty = 0; const t0 = Date.now();
    area.innerHTML = `<div class="hud"><span>Time <b id="m-time">0.0</b>s</span><span>Pairs left <b id="m-left">${left}</b></span></div>
      <div class="match"><div class="col">${set.map(c=>`<button class="tile term-t" data-t="${c.id}">${esc(c.front)}</button>`).join("")}</div>
      <div class="col">${defs.map(c=>`<button class="tile" data-d="${c.id}">${esc(c.back)}</button>`).join("")}</div></div>`;
    every(() => { const el = $("#m-time"); if (el) el.textContent = ((Date.now()-t0)/1000 + penalty).toFixed(1); }, 100);
    $$("[data-t]", area).forEach(b => b.onclick = () => { $$("[data-t]", area).forEach(x=>x.setAttribute("aria-pressed","false")); sel = b.dataset.t; b.setAttribute("aria-pressed","true"); });
    $$("[data-d]", area).forEach(b => b.onclick = () => {
      if (!sel) return;
      const tb = $(`[data-t="${sel}"]`, area);
      if (b.dataset.d === sel) { tb.classList.add("gone"); b.classList.add("gone"); tb.setAttribute("aria-pressed","false"); left--; $("#m-left").textContent = left; sel = null; if (!left) done(); }
      else { penalty += 3; b.classList.add("shake"); setTimeout(()=>b.classList.remove("shake"), 450); }
    });
    function done(){
      CS.stopGames(); const secs = (Date.now()-t0)/1000 + penalty;
      const nb = CS.setBest("match", +secs.toFixed(1), false); finish(Math.max(10, 60 - secs));
      area.innerHTML = `<span class="eyebrow">Match-up · results</span><div class="result-big mono">${secs.toFixed(1)}s</div>
        <p class="muted">${penalty?`Includes ${penalty}s of penalties.`:"No wrong matches."}${nb?" New personal best.":""}</p>
        <div class="row-wrap"><button class="btn" id="m-again">Play again</button><button class="btn ghost" data-go="cards">Review flashcards</button></div>`;
      $("#m-again").onclick = () => match(area);
    }
  }
}
})();
