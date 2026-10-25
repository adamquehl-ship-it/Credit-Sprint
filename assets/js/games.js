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
  {k:"boss", n:"Boss Battle", ic:"sword", d:"Take on a unit boss. Every correct answer deals damage; three misses and you're out.", best:()=>{ const n = Object.values(S().bosses).filter(Boolean).length; return `${n}/${CS.UNITS.length} bosses beaten`; }},
  ...(CS.hasGraphs() ? [{k:"shift", n:"Shift It", ic:"chart", d:"A headline hits the economy. Shift the right curve the right way before the clock runs out.", best:()=>S().best.shift!=null?`Best: ${S().best.shift}/10`:"Not played yet"}] : []),
  ...(CS.COURSE==="bio" ? [{k:"cross", n:"Cross It", ic:"dna", d:"Genetics at speed: Punnett squares, dihybrid ratios, sex-linked traits and blood types. Predict the offspring before time runs out.", best:()=>S().best.cross!=null?`Best: ${S().best.cross}/8`:"Not played yet", isNew:true}] : []),
  ...(CS.COURSE==="macro" ? [{k:"crisis", n:"Crisis Desk", ic:"bank", d:"A headline breaks. Call what happens to real GDP, the price level and unemployment in the short run.", best:()=>S().best.crisis!=null?`Best: ${S().best.crisis}/24`:"Not played yet", isNew:true}] : []),
  ...(CS.COURSE==="micro" ? [{k:"elastic", n:"Elasticity Sprint", ic:"chart", d:"Read the price and quantity data, then call the elasticity and what happens to total revenue.", best:()=>S().best.elastic!=null?`Best: ${S().best.elastic}/10`:"Not played yet", isNew:true}] : []),
  ...(CS.COURSE==="bio" ? [{k:"sorter", n:"Cell Sorter", ic:"cards", d:"60 seconds. Sort each fact into the right bucket: prokaryote or eukaryote, mitosis or meiosis, DNA or RNA and more.", best:()=>S().best.sorter!=null?`Best: ${S().best.sorter} sorted`:"Not played yet", isNew:true}] : []),
  ...(CS.COURSE==="chem" ? [{k:"periodic", n:"Periodic Hunt", ic:"flask", d:"Clues lead you to an element. Tap it on the periodic table: groups, valence electrons, trends and atomic numbers.", best:()=>S().best.periodic!=null?`Best: ${S().best.periodic}/8`:"Not played yet", isNew:true}] : []),
  ...(CS.COURSE==="chem" ? [{k:"balance", n:"Balance It", ic:"flask", d:"Balance chemical equations at speed. Set the coefficients so every atom is conserved, in the smallest whole numbers.", best:()=>S().best.balance!=null?`Best: ${S().best.balance}/8`:"Not played yet", isNew:true}] : []),
  ...(CS.COURSE==="mkt" ? [{k:"mix", n:"Mix Master", ic:"cards", d:"60 seconds. Sort each marketing move into the right P: Product, Price, Place or Promotion. A mistake costs 3 seconds.", best:()=>S().best.mix!=null?`Best: ${S().best.mix} sorted`:"Not played yet", isNew:true}] : []),
  ...(CS.COURSE==="mkt" ? [{k:"position", n:"Perceptual Map", ic:"chart", d:"Read the brand description, then tap the quadrant of the perceptual map where it sits. Positioning, fast.", best:()=>S().best.position!=null?`Best: ${S().best.position}/8`:"Not played yet", isNew:true}] : []),
  ...((CS.COURSE==="apush"||CS.COURSE==="apworld") ? [{k:"timeline", n:"Timeline Sort", ic:"link", d:"Four events appear out of order. Tap them from earliest to latest. Chronological reasoning is the heart of AP® history.", best:()=>S().best.timeline!=null?`Best: ${S().best.timeline}/8`:"Not played yet", isNew:true}] : []),
  ...((CS.COURSE==="apush"||CS.COURSE==="apworld"||CS.COURSE==="apgov") ? [{k:"source", n:"Source Match", ic:"cards", d:"Read a short original excerpt in the style of an exam source, then pick the event, movement or person it comes from.", best:()=>S().best.source!=null?`Best: ${S().best.source}/8`:"Not played yet", isNew:true}] : []),
  ...(CS.COURSE==="appsych" ? [
    {k:"studies", n:"Famous Studies Match", ic:"cards", d:"A classic finding appears. Pick the researcher who found it, from Pavlov to Milgram.", best:()=>S().best.studies!=null?`Best: ${S().best.studies}/8`:"Not played yet", isNew:true},
    {k:"brainreg", n:"Brain Check", ic:"bolt", d:"60 seconds. A clue describes a brain region or chemical messenger; name it before time runs out.", best:()=>S().best.brainreg!=null?`Best: ${S().best.brainreg} named`:"Not played yet", isNew:true},
    {k:"dsort", n:"Disorder Sort", ic:"cards", d:"60 seconds. Sort each set of symptoms into the right family of disorders. A mistake costs 3 seconds.", best:()=>S().best.dsort!=null?`Best: ${S().best.dsort} sorted`:"Not played yet", isNew:true},
    {k:"bias", n:"Bias Spotter", ic:"cards", d:"A short scenario describes a thinking error, social effect or defense mechanism. Name it.", best:()=>S().best.bias!=null?`Best: ${S().best.bias}/8`:"Not played yet", isNew:true}] : []),
  ...(CS.COURSE==="apgov" ? [
    {k:"court", n:"Court Case Match", ic:"cards", d:"A landmark Supreme Court case appears. Pick the ruling that matches it, from Marbury to Dobbs.", best:()=>S().best.court!=null?`Best: ${S().best.court}/8`:"Not played yet", isNew:true},
    {k:"branch", n:"Branch Check", ic:"cards", d:"60 seconds. Sort each power into the legislative, executive or judicial branch. A mistake costs 3 seconds.", best:()=>S().best.branch!=null?`Best: ${S().best.branch} sorted`:"Not played yet", isNew:true},
    {k:"amend", n:"Amendment Sprint", ic:"bolt", d:"60 seconds. A clue describes an amendment; name it before time runs out.", best:()=>S().best.amend!=null?`Best: ${S().best.amend} named`:"Not played yet", isNew:true}] : []),
  {k:"sprint", n:"Sprint", ic:"bolt", d:"60 seconds of rapid-fire questions. Streaks multiply your points; misses cost 3 seconds.", best:()=>S().best.sprint!=null?`Best: ${S().best.sprint} pts`:"Not played yet"},
  {k:"chain", n:"Chain Reaction", ic:"link", d:CS.C.chainDesc || (CS.COURSE==="micro"?"Put the cause-and-effect steps in order, from a market shock to the long-run outcome.":"Put the cause-and-effect steps in order, from the Fed's move to what happens to GDP."), best:()=>S().best.chainRounds!=null?`Best: ${S().best.chainRounds} perfect chains`:"Not played yet", isNew:true},
  {k:"tf", n:"True or False", ic:"tf", d:"45 seconds. Decide if each statement is true or false. Fast and brutal on misconceptions.", best:()=>S().best.tf!=null?`Best: ${S().best.tf} pts`:"Not played yet", isNew:true},
  {k:"crunch", n:"Number Crunch", ic:"calc", d:CS.C.crunchDesc || (CS.COURSE==="micro"?"Two minutes of calculations: elasticity, costs, profit, MRP, surplus. Type the number.":"Two minutes of calculations: multipliers, CPI, money creation, growth. Type the number."), best:()=>S().best.crunch!=null?`Best: ${S().best.crunch} correct`:"Not played yet", isNew:true},
  ...(CS.COURSE==="macro" ? [{k:"fed", n:"Fed Chair", ic:"bank", d:"Run the economy for 8 quarters. Keep inflation near 2% and unemployment near 4.5%.", best:()=>S().best.fed!=null?`Best: ${S().best.fed}/100`:"Not played yet"}] : []),
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
      <div class="gamegrid">${GAMES.map((g,i)=>`<button class="gamecard ${i===0?"feature":""}" data-g="${g.k}"><span class="g-ico">${I(g.ic)}</span>${CS.FREE_GAMES.includes(g.k)?"":CS.proTag()}<span class="stack" style="gap:6px"><h3>${g.n}</h3><span class="muted small">${g.d}</span><span class="eyebrow" style="color:var(--accent)">${esc(g.best())}</span></span>${g.isNew?`<span class="tag acc new">New</span>`:""}${i===0&&!dc?`<span class="tag good new">Today</span>`:""}</button>`).join("")}</div>`;
    $$("#v-games [data-g]").forEach(b => b.onclick = () => CS.render.games({game:b.dataset.g}));
    return;
  }
  let g = GAMES.find(x=>x.k===active); if (!g) { active = null; return CS.render.games({}); }
  if (!CS.FREE_GAMES.includes(g.k) && !CS.hasAccess()) { v.innerHTML = `<div class="row-wrap"><button class="btn ghost sm" id="g-back">← All games</button></div>` + CS.lockPanel(`${g.n} is a paid game`, `Free includes the Daily Challenge, True or False and Match-up. Unlock ${g.n}, every boss battle and every other game.`); $("#g-back").onclick = () => { active = null; CS.render.games({}); }; return; }
  v.innerHTML = `<div class="spread"><div class="row-wrap" style="gap:12px"><span class="g-ico" style="width:44px;height:44px;border-radius:12px;display:grid;place-items:center;background:var(--accent-soft);color:var(--accent)">${I(g.ic)}</span><div><span class="eyebrow">Games</span><h2>${g.n}</h2></div></div><button class="btn sm ghost" id="g-back">← All games</button></div><div class="panel" id="g-area"></div>`;
  $("#g-back").onclick = () => { active = null; CS.render.games({}); };
  ({daily, boss, shift, sprint, chain, tf, crunch, fed, match, profit, nash, cross, balance, crisis, elastic, sorter, periodic, mix, position, timeline, source, court, branch, amend, studies, brainreg, dsort, bias})[active]($("#g-area"));
};
function finish(points){ CS.addXP(Math.max(5, Math.round(points))); CS.markTask("game"); if (CS.dqEvent) CS.dqEvent("game", active);
  { const g = GAMES.find(x => x.k === active), pts = Math.max(5, Math.round(points)); setTimeout(() => { if (CS.shareBar && active !== "daily") CS.shareBar($("#g-area"), {game: g ? g.n : "a game", points: pts}); }, 150); } S().games = (S().games||0)+1; CS.refresh(); }
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
  const BOSSES = CS.C.bosses || (CS.COURSE === "micro" ? {1:"The Scarcity Specter",2:"The Elasticity Eel",3:"The Marginal Cost Golem",4:"The Monopoly Overlord",5:"The Wage Warden",6:"The Externality Ooze"}
    : {1:"The Opportunity Costumer",2:"The Index Inflator",3:"The Multiplier Monster",4:"The Reserve Wraith",5:"The Phillips Phantom",6:"The Currency Kraken"});
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
  area.innerHTML = `<p style="max-width:62ch">Each round gives you the steps of ${CS.C.cat==="History"?"a chain of events":["Government","Social science"].includes(CS.C.cat)?"a process":"a chain reaction"}, scrambled. Tap them in the right order. Every wrong tap is a strike.</p><div><button class="btn lg" id="c-go">Start · ${ROUNDS} chains</button></div>`;
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
  area.innerHTML = `<p style="max-width:62ch">${CS.C.cat==="History"?"Two minutes of timeline recall with fresh events every time. Type the era or period number and press Enter.":`Two minutes of ${CS.C.short.toLowerCase()} math with fresh numbers every time. Type your answer and press Enter.`} Skipping costs 5 seconds.</p><div><button class="btn lg" id="n-go">Start</button></div>`;
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

/* ---------- Cross It (Biology): genetics predictions ---------- */
function cross(area){
  const ROUNDS = 8; let i = 0, right = 0, streak = 0, pts = 0;
  const pick = a => a[Math.floor(Math.random()*a.length)];
  const GENES = [["A","a","purple flowers","white flowers"],["T","t","tall","short"],["B","b","brown fur","white fur"],["R","r","round seeds","wrinkled seeds"],["G","g","green pods","yellow pods"]];
  const sq = (p1, p2) => { const arr = p => Array.isArray(p) ? p : p.split(""), g1 = arr(p1), g2 = arr(p2);
    const cell = (x, y) => x.length > 1 || y.length > 1 ? [x, y].sort((m, n) => (m === "Y") - (n === "Y")).join("") : [x, y].sort((m, n) => (m === m.toLowerCase()) - (n === n.toLowerCase())).join("");
    return `<table class="matrix punnett"><thead><tr><th class="corner"></th>${g2.map(g => `<th>${g}</th>`).join("")}</tr></thead><tbody>${g1.map(a => `<tr><th>${a}</th>${g2.map(b => `<td>${cell(a, b)}</td>`).join("")}</tr>`).join("")}</tbody></table>`; };
  function make(){
    const k = pick(["mono","mono","test","dihy","dihytest","xlinked","incomplete","blood","tri"]), G = pick(GENES), [D, r, dp, rp] = G;
    if (k === "mono") { const p1 = pick([D+r, D+r, D+D]), p2 = pick([D+r, r+r]); const kids = [];
      p1.split("").forEach(a => p2.split("").forEach(b => kids.push(a === D || b === D ? 1 : 0)));
      const frac = kids.filter(x => !x).length; const ans = ["0","1/4","1/2","3/4","1"][frac];
      return {q:`Cross ${p1} × ${p2}. ${D} (${dp}) is dominant to ${r} (${rp}). What fraction of offspring will have ${rp}?`, opts:["0","1/4","1/2","3/4"].concat(ans === "1" ? ["1"] : []), ans, extra:sq(p1, p2), why:`Count the ${r}${r} boxes: ${frac} of 4.`}; }
    if (k === "test") { const het = Math.random() < .5;
      return {q:`A ${dp} plant is test-crossed with a ${rp} (${r}${r}) plant. ${het ? "About half" : "All"} of the offspring are ${dp}. What is the ${dp} parent's genotype?`, opts:[D+D, D+r, r+r, "Can't tell"], ans: het ? D+r : D+D, extra:sq(het ? D+r : D+D, r+r), why: het ? `A 1:1 ratio means the parent made ${D} and ${r} gametes.` : `No ${rp} offspring means every gamete carried ${D}.`}; }
    if (k === "dihy") return {q:`Two plants heterozygous for two independent genes (AaBb × AaBb) are crossed. What phenotype ratio do you expect?`, opts:["9:3:3:1","3:1","1:1:1:1","1:2:1"], ans:"9:3:3:1", why:"Multiply the 3:1 ratios: 9 A_B_ : 3 A_bb : 3 aaB_ : 1 aabb."};
    if (k === "dihytest") return {q:`A dihybrid (AaBb) is crossed with aabb, and the genes are on different chromosomes. What phenotype ratio do you expect?`, opts:["1:1:1:1","9:3:3:1","3:1","1:2:1"], ans:"1:1:1:1", why:"The dihybrid makes AB, Ab, aB and ab gametes equally; aabb adds only ab."};
    if (k === "xlinked") { const son = Math.random() < .6;
      return {q:`Color blindness is X-linked recessive. A carrier mother (XᴮXᵇ) and a father with normal vision (XᴮY) have a ${son ? "son" : "daughter"}. What's the chance the ${son ? "son" : "daughter"} is color-blind?`, opts:["0","1/4","1/2","1"], ans: son ? "1/2" : "0", extra:sq(["Xᴮ","Xᵇ"], ["Xᴮ","Y"]), why: son ? "A son gets his X from Mom: Xᴮ or Xᵇ, 1/2 each." : "A daughter always gets Dad's normal Xᴮ, so she can be a carrier but not color-blind."}; }
    if (k === "incomplete") return {q:`In snapdragons, red (RR) × white (WW) gives pink (RW). Two pink plants are crossed. What phenotype ratio do you expect?`, opts:["1 red : 2 pink : 1 white","3 red : 1 white","All pink","1 red : 1 white"], ans:"1 red : 2 pink : 1 white", why:"Incomplete dominance: phenotypes match the 1:2:1 genotype ratio."};
    if (k === "blood") { const kind = pick(["O","AB"]);
      return {q:`Parents with blood types A (Iᴬi) and B (Iᴮi) have a child. What's the probability the child has type ${kind}?`, opts:["0","1/4","1/2","3/4"], ans:"1/4", why: kind === "O" ? "Both must pass i: 1/2 × 1/2 = 1/4." : "Iᴬ from one parent and Iᴮ from the other: 1/2 × 1/2 = 1/4."}; }
    return {q:`AaBbCc × AaBbCc (independent genes). What's the probability of an aabbcc offspring?`, opts:["1/64","1/8","1/16","27/64"], ans:"1/64", why:"Each gene: 1/4 for homozygous recessive. 1/4 × 1/4 × 1/4 = 1/64."};
  }
  intro();
  function intro(){
    area.innerHTML = `<p style="max-width:62ch">Each round is a genetics cross. Predict the offspring. Quick answers and streaks earn bonus points. Sketch a Punnett square if you need to: the answer shows one.</p><div><button class="btn accent" id="cx-go">Start · ${ROUNDS} crosses</button></div>`;
    $("#cx-go").onclick = round;
  }
  function round(){
    if (i >= ROUNDS) return end();
    const g = make(), t0 = Date.now(), opts = CS.shuffle(Array.from(new Set(g.opts)));
    area.innerHTML = `<div class="hud"><span>Cross <b>${i+1}</b>/${ROUNDS}</span><span>Correct <b>${right}</b></span><span>Streak <b>${streak}</b></span><span>Points <b>${pts}</b></span></div>
      <p class="qtext">${esc(g.q)}</p><div class="opts">${opts.map((o,j)=>`<button class="opt" data-j="${j}"><span class="k">${CS.L[j]}</span><span>${esc(o)}</span></button>`).join("")}</div><div id="cx-fb"></div>`;
    let done = false;
    const pickOpt = j => { if (done) return; done = true; const ok = opts[j] === g.ans; CS.record({u:5}, ok, false);
      if (ok) { right++; streak++; pts += 100 + Math.max(0, 40 - Math.round((Date.now()-t0)/1000)*2) + (streak>=3?25:0); } else streak = 0;
      $$(".opt", area).forEach((b,k) => { b.disabled = true; if (opts[k] === g.ans) b.classList.add("right"); else if (k === j) b.classList.add("wrong"); });
      $("#cx-fb").innerHTML = `<div class="feedback ${ok?"good":"bad"}"><b>${ok?(streak>=3?"Streak bonus!":"Correct."):`Answer: ${esc(g.ans)}.`}</b> ${esc(g.why)}</div>${g.extra?`<div class="matrix-wrap" style="max-width:260px">${g.extra}</div>`:""}<div style="margin-top:10px"><button class="btn" id="cx-next">${i+1<ROUNDS?"Next cross":"See results"}</button></div>`;
      $("#cx-next").onclick = () => { i++; round(); }; $("#cx-next").focus({preventScroll:true}); area._key = e => { if (e.key==="Enter") $("#cx-next").click(); };
    };
    $$(".opt", area).forEach(b => b.onclick = () => pickOpt(+b.dataset.j));
    area._key = e => { if (["1","2","3","4","5"].includes(e.key) && +e.key <= opts.length) pickOpt(+e.key-1); };
  }
  function end(){
    area._key = null; const nb = CS.setBest("cross", right); finish(pts/10);
    area.innerHTML = `<span class="eyebrow">Cross It · results</span><div class="result-big">${right}/${ROUNDS}</div><p class="muted">${pts} points${nb?" · new personal best":""}. ${right>=7?"Mendel would be proud.":"Draw the Punnett square every time, and multiply probabilities for independent genes."}</p>
      <div class="row-wrap"><button class="btn" id="cx-again">Play again</button><button class="btn ghost" data-go="learn" data-unit="5">Review Unit 5</button></div>`;
    $("#cx-again").onclick = () => { i = 0; right = 0; streak = 0; pts = 0; round(); };
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

/* Balance It (Chemistry): set the coefficients so every atom is conserved, in lowest whole numbers */
const EQS = [
  [["H2","O2"],["H2O"],[2,1,2]],[["N2","H2"],["NH3"],[1,3,2]],[["CH4","O2"],["CO2","H2O"],[1,2,1,2]],[["Na","H2O"],["NaOH","H2"],[2,2,2,1]],
  [["Mg","HCl"],["MgCl2","H2"],[1,2,1,1]],[["KClO3"],["KCl","O2"],[2,2,3]],[["Fe","O2"],["Fe2O3"],[4,3,2]],[["Al","O2"],["Al2O3"],[4,3,2]],
  [["C2H6","O2"],["CO2","H2O"],[2,7,4,6]],[["C3H8","O2"],["CO2","H2O"],[1,5,3,4]],[["Al","HCl"],["AlCl3","H2"],[2,6,2,3]],[["NH3","O2"],["NO","H2O"],[4,5,4,6]],
  [["Fe2O3","CO"],["Fe","CO2"],[1,3,2,3]],[["C6H12O6","O2"],["CO2","H2O"],[1,6,6,6]],[["Pb(NO3)2","KI"],["PbI2","KNO3"],[1,2,1,2]],[["C4H10","O2"],["CO2","H2O"],[2,13,8,10]],
  [["Ca(OH)2","H3PO4"],["Ca3(PO4)2","H2O"],[3,2,1,6]],[["Al(OH)3","H2SO4"],["Al2(SO4)3","H2O"],[2,3,1,6]]
];
CS.EQUATIONS = EQS;
CS.atomCount = (formula) => { const st = [{}]; const re = /([A-Z][a-z]?|\(|\))(\d*)/g; let m;
  while ((m = re.exec(formula))) { const [, t, d] = m, n = d ? +d : 1;
    if (t === "(") st.push({}); else if (t === ")") { const top = st.pop(); for (const e in top) st[st.length-1][e] = (st[st.length-1][e]||0) + top[e]*n; } else st[st.length-1][t] = (st[st.length-1][t]||0) + n; }
  return st[0]; };
CS.sideCount = (list, coef) => { const out = {}; list.forEach((f, i) => { const c = CS.atomCount(f); for (const e in c) out[e] = (out[e]||0) + c[e]*coef[i]; }); return out; };
CS.isBalanced = (eq, coef) => { const nr = eq[0].length, L = CS.sideCount(eq[0], coef.slice(0, nr)), R = CS.sideCount(eq[1], coef.slice(nr)); const ks = new Set([...Object.keys(L), ...Object.keys(R)]); return [...ks].every(k => (L[k]||0) === (R[k]||0)); };
const gcd = (a, b) => b ? gcd(b, a % b) : a;
function balance(area){
  const ROUNDS = 8; let i = 0, right = 0, streak = 0, pts = 0; const order = CS.shuffle(EQS.slice()).slice(0, ROUNDS);
  const fm = f => esc(f).replace(/(\d+)/g, "<sub>$1</sub>");
  intro();
  function intro(){
    area.innerHTML = `<p style="max-width:62ch">Each round shows an unbalanced equation. Set a coefficient for every substance so that each element has the same number of atoms on both sides. Use the smallest whole numbers.</p><div><button class="btn accent" id="bl-go">Start · ${ROUNDS} equations</button></div>`;
    $("#bl-go").onclick = round;
  }
  function round(){
    if (i >= ROUNDS) return end();
    const eq = order[i], nr = eq[0].length, all = eq[0].concat(eq[1]), t0 = Date.now();
    const cell = (f, j) => `<span class="bl-sp"><input class="bl-in" type="number" inputmode="numeric" min="1" max="20" value="1" data-j="${j}" aria-label="Coefficient for ${esc(f)}"><span class="bl-f">${fm(f)}</span></span>`;
    area.innerHTML = `<div class="hud"><span>Equation <b>${i+1}</b>/${ROUNDS}</span><span>Correct <b>${right}</b></span><span>Streak <b>${streak}</b></span><span>Points <b>${pts}</b></span></div>
      <div class="bl-eq">${eq[0].map((f, j) => cell(f, j)).join('<span class="bl-op">+</span>')}<span class="bl-arrow">→</span>${eq[1].map((f, j) => cell(f, nr + j)).join('<span class="bl-op">+</span>')}</div>
      <div id="bl-fb"></div><div style="margin-top:10px"><button class="btn accent" id="bl-check">Check</button></div>`;
    $("#bl-check").onclick = check; $(".bl-in", area).focus({preventScroll:true});
    area._key = e => { if (e.key === "Enter") { const b = $("#bl-check") || $("#bl-next"); b && b.click(); } };
    function check(){
      const coef = $$(".bl-in", area).map(x => Math.max(1, Math.round(+x.value || 1)));
      const bal = CS.isBalanced(eq, coef), g = coef.reduce(gcd);
      if (bal && g > 1) { $("#bl-fb").innerHTML = `<div class="feedback bad"><b>Balanced, but not in lowest terms.</b> Divide every coefficient by ${g}.</div>`; return; }
      const ok = bal; CS.record({u:4}, ok, false);
      if (ok) { right++; streak++; pts += 100 + Math.max(0, 40 - Math.round((Date.now()-t0)/1000)) + (streak>=3?25:0); } else streak = 0;
      const L = CS.sideCount(eq[0], coef.slice(0, nr)), R = CS.sideCount(eq[1], coef.slice(nr)), ks = [...new Set([...Object.keys(L), ...Object.keys(R)])];
      $$(".bl-in", area).forEach((x, j) => { x.disabled = true; if (!ok) x.value = eq[2][j]; });
      $("#bl-check").remove();
      $("#bl-fb").innerHTML = `<div class="feedback ${ok?"good":"bad"}"><b>${ok?(streak>=3?"Streak bonus!":"Balanced."):"Not balanced. The answer is shown above."}</b> ${ok ? "Every element has the same count on both sides." : ks.filter(k => (L[k]||0) !== (R[k]||0)).map(k => `${k}: ${L[k]||0} on the left, ${R[k]||0} on the right`).join("; ") + "."}</div>
        <div class="matrix-wrap" style="max-width:300px"><table class="matrix"><thead><tr><th>Element</th><th>Left</th><th>Right</th></tr></thead><tbody>${ks.map(k => `<tr><th>${esc(k)}</th><td>${L[k]||0}</td><td>${R[k]||0}</td></tr>`).join("")}</tbody></table></div>
        <div style="margin-top:10px"><button class="btn" id="bl-next">${i+1<ROUNDS?"Next equation":"See results"}</button></div>`;
      $("#bl-next").onclick = () => { i++; round(); }; $("#bl-next").focus({preventScroll:true});
    }
  }
  function end(){
    area._key = null; const nb = CS.setBest("balance", right); finish(pts/10);
    area.innerHTML = `<span class="eyebrow">Balance It · results</span><div class="result-big">${right}/${ROUNDS}</div><p class="muted">${pts} points${nb?" · new personal best":""}. ${right>=7?"Lavoisier would approve.":"Balance the elements that appear in the fewest places first, and save lone elements like O and H for last."}</p>
      <div class="row-wrap"><button class="btn" id="bl-again">Play again</button><button class="btn ghost" data-go="learn" data-unit="4">Review Unit 4</button></div>`;
    $("#bl-again").onclick = () => { i = 0; right = 0; streak = 0; pts = 0; order.splice(0, order.length, ...CS.shuffle(EQS.slice()).slice(0, ROUNDS)); round(); };
  }
}

/* ---------- Crisis Desk (Macro): predict the short-run effect of a shock on GDP, prices and unemployment ---------- */
const CRISES = [
  ["Consumer confidence collapses and households cut spending.",-1,-1,1,"Aggregate demand shifts left."],
  ["Congress cuts income taxes during a recession.",1,1,-1,"Disposable income rises, so AD shifts right."],
  ["A world oil shock raises production costs across the economy.",-1,1,1,"Short-run aggregate supply shifts left: stagflation."],
  ["The Fed buys bonds on the open market.",1,1,-1,"Reserves rise, interest rates fall, and AD shifts right."],
  ["The Fed raises the reserve requirement.",-1,-1,1,"Banks lend less, the money supply falls, and AD shifts left."],
  ["A wave of productivity gains lowers costs for firms.",1,-1,-1,"Short-run aggregate supply shifts right."],
  ["Booming foreign economies buy more U.S. exports.",1,1,-1,"Net exports rise, so AD shifts right."],
  ["The government sharply cuts spending.",-1,-1,1,"Government purchases fall, so AD shifts left."],
  ["The dollar appreciates against other currencies.",-1,-1,1,"Exports fall and imports rise, so net exports fall and AD shifts left."],
  ["Nominal wages fall throughout the economy.",1,-1,-1,"Input costs fall, so SRAS shifts right."],
  ["Business optimism jumps and firms build new factories.",1,1,-1,"Investment rises, so AD shifts right."],
  ["The Fed raises the federal funds rate target.",-1,-1,1,"Higher rates reduce investment and consumption, so AD shifts left."],
  ["Congress raises taxes on households.",-1,-1,1,"Disposable income falls, so AD shifts left."],
  ["A drought wrecks harvests and raises food costs nationwide.",-1,1,1,"SRAS shifts left, raising prices while output falls."]
];
function crisis(area){
  const ROUNDS = 8; let i = 0, pts = 0; const order = CS.shuffle(CRISES.slice()).slice(0, ROUNDS);
  const NAMES = ["Real GDP", "Price level", "Unemployment"], SYM = {"1":"Up","-1":"Down"};
  area.innerHTML = `<p style="max-width:62ch">Each round is a headline. For each of the three indicators, choose whether it rises or falls in the short run. Each correct call scores a point, 24 in all.</p><div><button class="btn accent" id="cr-go">Start · ${ROUNDS} headlines</button></div>`;
  $("#cr-go").onclick = round;
  function round(){
    if (i >= ROUNDS) return end();
    const c = order[i], pick = [0, 0, 0];
    area.innerHTML = `<div class="hud"><span>Headline <b>${i+1}</b>/${ROUNDS}</span><span>Points <b>${pts}</b>/${i*3}</span></div>
      <p class="qtext">${esc(c[0])}</p>
      <div class="stack" style="gap:10px">${NAMES.map((n, k) => `<div class="spread cr-row"><b>${n}</b><div class="row-wrap" style="gap:8px"><button class="btn ghost sm cr-b" data-k="${k}" data-v="1">▲ Rises</button><button class="btn ghost sm cr-b" data-k="${k}" data-v="-1">▼ Falls</button></div></div>`).join("")}</div>
      <div id="cr-fb"></div><div style="margin-top:10px"><button class="btn accent" id="cr-ok" disabled>Lock in</button></div>`;
    $$(".cr-b", area).forEach(b => b.onclick = () => { pick[+b.dataset.k] = +b.dataset.v; $$(".cr-b", area).filter(x => x.dataset.k === b.dataset.k).forEach(x => x.classList.toggle("accent", x === b)); $("#cr-ok").disabled = pick.includes(0); });
    $("#cr-ok").onclick = () => {
      const good = pick.map((v, k) => v === c[k+1]); const n = good.filter(Boolean).length; pts += n; CS.record({u:3}, n === 3, false);
      $$(".cr-b", area).forEach(b => { b.disabled = true; const k = +b.dataset.k, v = +b.dataset.v; if (v === c[k+1]) b.classList.add("accent"); else if (v === pick[k]) b.classList.add("wrong"); });
      $("#cr-ok").remove();
      $("#cr-fb").innerHTML = `<div class="feedback ${n===3?"good":"bad"}"><b>${n}/3 correct.</b> ${esc(c[4])} Real GDP ${c[1]>0?"rises":"falls"}, the price level ${c[2]>0?"rises":"falls"} and unemployment ${c[3]>0?"rises":"falls"}.</div><div style="margin-top:10px"><button class="btn" id="cr-next">${i+1<ROUNDS?"Next headline":"See results"}</button></div>`;
      $("#cr-next").onclick = () => { i++; round(); }; $("#cr-next").focus({preventScroll:true});
    };
  }
  function end(){
    const nb = CS.setBest("crisis", pts); finish(pts*3);
    area.innerHTML = `<span class="eyebrow">Crisis Desk · results</span><div class="result-big">${pts}/${ROUNDS*3}</div><p class="muted">${nb?"New personal best. ":""}${pts>=20?"The Fed would hire you.":"Ask first: did aggregate demand or short-run aggregate supply move, and in which direction?"}</p>
      <div class="row-wrap"><button class="btn" id="cr-again">Play again</button><button class="btn ghost" data-go="learn" data-unit="3">Review Unit 3</button></div>`;
    $("#cr-again").onclick = () => { i = 0; pts = 0; order.splice(0, order.length, ...CS.shuffle(CRISES.slice()).slice(0, ROUNDS)); round(); };
  }
}

/* ---------- Elasticity Sprint (Micro): midpoint elasticity and the total revenue test ---------- */
function elastic(area){
  const ROUNDS = 10; let i = 0, right = 0, streak = 0, pts = 0;
  const pick = a => a[Math.floor(Math.random()*a.length)], ri = (a, b) => a + Math.floor(Math.random()*(b-a+1));
  function make(){
    const P1 = pick([2,4,5,8,10,12,20,25,40]), Q1 = pick([100,200,300,400,500,800]);
    for (let t = 0; t < 50; t++) {
      const up = Math.random() < .5, dP = pick([.1,.2,.25,.3,.5]) * P1, P2 = Math.max(1, Math.round(up ? P1 + dP : P1 - dP));
      const e = pick([.3,.5,.8,1,1.4,2,3]), pctP = Math.abs(P2-P1)/((P1+P2)/2), Q2 = Math.max(1, Math.round(Q1 * (up ? 1 - e*pctP : 1 + e*pctP)));
      if (P2 === P1 || Q2 === Q1) continue;
      const E = (Math.abs(Q2-Q1)/((Q1+Q2)/2)) / pctP, kind = E > 1.05 ? "Elastic" : E < .95 ? "Inelastic" : "Unit elastic";
      const tr1 = P1*Q1, tr2 = P2*Q2, trw = tr2 > tr1 ? "rises" : tr2 < tr1 ? "falls" : "stays the same";
      if (Math.random() < .5) return {q:`When the price changes from $${P1} to $${P2}, quantity demanded changes from ${Q1} to ${Q2}. Using the midpoint method, demand over this range is:`, opts:["Elastic","Inelastic","Unit elastic"], ans:kind, why:`%ΔQ ÷ %ΔP = ${(Math.abs(Q2-Q1)/((Q1+Q2)/2)*100).toFixed(1)}% ÷ ${(pctP*100).toFixed(1)}% = ${E.toFixed(2)}, which is ${kind.toLowerCase()}.`};
      return {q:`The price moves from $${P1} to $${P2} and quantity demanded moves from ${Q1} to ${Q2}. What happens to total revenue?`, opts:["Rises","Falls","Stays the same"], ans:trw.replace("stays the same","Stays the same").replace(/^./, c => c.toUpperCase()), why:`Total revenue goes from $${tr1.toLocaleString()} to $${tr2.toLocaleString()}. Demand is ${kind.toLowerCase()} (E ≈ ${E.toFixed(2)}).`};
    }
    return {q:"If price rises and total revenue falls, demand is:", opts:["Elastic","Inelastic","Unit elastic"], ans:"Elastic", why:"Quantity falls by a larger percentage than price rises."};
  }
  area.innerHTML = `<p style="max-width:62ch">Each round gives price and quantity data. Use the midpoint method, or the total revenue test, and pick the answer. Speed and streaks earn bonus points.</p><div><button class="btn accent" id="el-go">Start · ${ROUNDS} rounds</button></div>`;
  $("#el-go").onclick = round;
  function round(){
    if (i >= ROUNDS) return end();
    const g = make(), t0 = Date.now(), opts = g.opts;
    area.innerHTML = `<div class="hud"><span>Round <b>${i+1}</b>/${ROUNDS}</span><span>Correct <b>${right}</b></span><span>Streak <b>${streak}</b></span><span>Points <b>${pts}</b></span></div>
      <p class="qtext">${esc(g.q)}</p><div class="opts">${opts.map((o,j)=>`<button class="opt" data-j="${j}"><span class="k">${CS.L[j]}</span><span>${esc(o)}</span></button>`).join("")}</div><div id="el-fb"></div>`;
    let done = false;
    const pickOpt = j => { if (done) return; done = true; const ok = opts[j] === g.ans; CS.record({u:2}, ok, false);
      if (ok) { right++; streak++; pts += 100 + Math.max(0, 40 - Math.round((Date.now()-t0)/1000)*2) + (streak>=3?25:0); } else streak = 0;
      $$(".opt", area).forEach((b,k) => { b.disabled = true; if (opts[k] === g.ans) b.classList.add("right"); else if (k === j) b.classList.add("wrong"); });
      $("#el-fb").innerHTML = `<div class="feedback ${ok?"good":"bad"}"><b>${ok?(streak>=3?"Streak bonus!":"Correct."):`Answer: ${esc(g.ans)}.`}</b> ${esc(g.why)}</div><div style="margin-top:10px"><button class="btn" id="el-next">${i+1<ROUNDS?"Next round":"See results"}</button></div>`;
      $("#el-next").onclick = () => { i++; round(); }; $("#el-next").focus({preventScroll:true}); area._key = e => { if (e.key==="Enter") $("#el-next").click(); };
    };
    $$(".opt", area).forEach(b => b.onclick = () => pickOpt(+b.dataset.j));
    area._key = e => { if (["1","2","3"].includes(e.key)) pickOpt(+e.key-1); };
  }
  function end(){
    area._key = null; const nb = CS.setBest("elastic", right); finish(pts/10);
    area.innerHTML = `<span class="eyebrow">Elasticity Sprint · results</span><div class="result-big">${right}/${ROUNDS}</div><p class="muted">${pts} points${nb?" · new personal best":""}. ${right>=8?"You think like a pricing analyst.":"Remember: elastic means quantity moves by a bigger percentage than price, so total revenue moves opposite to price."}</p>
      <div class="row-wrap"><button class="btn" id="el-again">Play again</button><button class="btn ghost" data-go="learn" data-unit="2">Review Unit 2</button></div>`;
    $("#el-again").onclick = () => { i = 0; right = 0; streak = 0; pts = 0; round(); };
  }
}

/* ---------- Cell Sorter (Bio): 60-second two-bucket sorting ---------- */
const SORTS = [
  [["Prokaryote","Eukaryote"],[["No nucleus",0],["Membrane-bound organelles",1],["Circular chromosome",0],["Linear chromosomes",1],["Mitochondria",1],["Nucleoid region",0],["Golgi apparatus",1],["Plasmids",0],["Divides by binary fission",0],["Histone proteins",1],["70S ribosomes",0],["Endoplasmic reticulum",1]],1],
  [["Mitosis","Meiosis"],[["Makes two identical cells",0],["Makes four haploid cells",1],["Crossing over",1],["Growth and repair",0],["One round of division",0],["Two rounds of division",1],["Independent assortment",1],["Daughter cells are diploid",0],["Makes gametes",1],["Sister chromatids separate in anaphase only once",0]],5],
  [["Photosynthesis","Cellular respiration"],[["Occurs in chloroplasts",0],["Occurs in mitochondria",1],["Makes glucose",0],["Breaks down glucose",1],["Releases O₂",0],["Consumes O₂",1],["Calvin cycle",0],["Krebs cycle",1],["Uses light energy",0],["Makes most ATP by oxidative phosphorylation",1]],3],
  [["DNA","RNA"],[["Contains thymine",0],["Contains uracil",1],["Usually double-stranded",0],["Usually single-stranded",1],["Deoxyribose sugar",0],["Ribose sugar",1],["mRNA, tRNA and rRNA are types",1],["Stores the genetic code long term",0],["Carries codons to the ribosome",1],["Replication copies it",0]],6],
  [["Passive transport","Active transport"],[["Needs no ATP",0],["Uses ATP",1],["Down the concentration gradient",0],["Against the concentration gradient",1],["Osmosis",0],["Sodium-potassium pump",1],["Facilitated diffusion",0],["Moves ions uphill",1],["Simple diffusion of O₂",0],["Endocytosis",1]],2]
];
function sorter(area){
  let time = 60, score = 0, miss = 0, timer = null, items = [], set = null;
  area.innerHTML = `<p style="max-width:62ch">You have 60 seconds. Each fact belongs in one of two buckets. Tap a bucket, or press ← and →. A mistake costs 3 seconds.</p><div><button class="btn accent" id="so-go">Start</button></div>`;
  $("#so-go").onclick = start;
  function nextSet(){ set = CS.shuffle(SORTS)[0]; items = CS.shuffle(set[1].slice()); }
  function start(){ nextSet(); show(); timer = setInterval(() => { time--; const t = $("#so-t"); if (t) t.textContent = Math.max(0, time); if (time <= 0) end(); }, 1000); }
  function show(){
    if (!items.length) nextSet();
    const it = items[0];
    area.innerHTML = `<div class="hud"><span>Time <b id="so-t">${Math.max(0,time)}</b></span><span>Sorted <b>${score}</b></span><span>Misses <b>${miss}</b></span></div>
      <div class="so-card">${esc(it[0])}</div>
      <div class="so-btns"><button class="btn big" data-b="0">← ${esc(set[0][0])}</button><button class="btn big" data-b="1">${esc(set[0][1])} →</button></div><div id="so-fb" class="tiny muted" style="min-height:1.4em"></div>`;
    const choose = b => { const ok = b === it[1]; CS.record({u:set[2]}, ok, false); items.shift();
      if (ok) score++; else { miss++; time -= 3; if (time <= 0) return end(); }
      show(); if (!ok) { const f = $("#so-fb"); if (f) f.textContent = `Not quite: "${it[0]}" is ${set[0][it[1]]}.`; } };
    $$(".so-btns .btn", area).forEach(x => x.onclick = () => choose(+x.dataset.b));
    area._key = e => { if (e.key === "ArrowLeft") choose(0); else if (e.key === "ArrowRight") choose(1); };
  }
  function end(){
    clearInterval(timer); area._key = null; const nb = CS.setBest("sorter", score); finish(score*8);
    area.innerHTML = `<span class="eyebrow">Cell Sorter · results</span><div class="result-big">${score}</div><p class="muted">facts sorted, ${miss} missed${nb?" · new personal best":""}. ${score>=25?"Your cell membrane is very selective.":"Think about the key difference between the two buckets first, then sort."}</p>
      <div class="row-wrap"><button class="btn" id="so-again">Play again</button><button class="btn ghost" data-go="learn" data-unit="2">Review Unit 2</button></div>`;
    $("#so-again").onclick = () => { time = 60; score = 0; miss = 0; start(); };
  }
}

/* ---------- Periodic Hunt (Chem): find the element on the periodic table ---------- */
const SYMS = "H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr".split(" ");
const ENAME = "Hydrogen,Helium,Lithium,Beryllium,Boron,Carbon,Nitrogen,Oxygen,Fluorine,Neon,Sodium,Magnesium,Aluminum,Silicon,Phosphorus,Sulfur,Chlorine,Argon,Potassium,Calcium,Scandium,Titanium,Vanadium,Chromium,Manganese,Iron,Cobalt,Nickel,Copper,Zinc,Gallium,Germanium,Arsenic,Selenium,Bromine,Krypton".split(",");
const ELS = SYMS.map((s, i) => { const z = i + 1; let per = z <= 2 ? 1 : z <= 10 ? 2 : z <= 18 ? 3 : 4, off = z <= 2 ? 0 : z <= 10 ? 2 : z <= 18 ? 10 : 18, g;
  if (per === 1) g = z === 1 ? 1 : 18; else if (per === 4) g = z - 18; else { const k = z - (per === 2 ? 2 : 10); g = k <= 2 ? k : k + 10; }
  return {z, s, n:ENAME[i], per, g}; });
const EN = {H:2.20,Li:.98,Be:1.57,B:2.04,C:2.55,N:3.04,O:3.44,F:3.98,Na:.93,Mg:1.31,Al:1.61,Si:1.90,P:2.19,S:2.58,Cl:3.16,K:.82,Ca:1.00,Ga:1.81,Ge:2.01,As:2.18,Se:2.55,Br:2.96};
const FAM = {1:"alkali metal",2:"alkaline earth metal",17:"halogen",18:"noble gas"};
function periodic(area){
  const ROUNDS = 8; let i = 0, right = 0;
  const pick = a => a[Math.floor(Math.random()*a.length)];
  const by = (per, g) => ELS.find(e => e.per === per && e.g === g);
  function make(){
    const t = pick(["fam","fam","val","val","z","en","trans","ie"]);
    if (t === "fam") { const g = pick([1,2,17,18]), per = g === 1 ? pick([2,3,4]) : pick([2,3,4]), e = by(per, g); return {q:`Find the ${FAM[g]} in period ${per}.`, ans:e, why:`Group ${g} is the ${FAM[g]}s. In period ${per} that is ${e.n}.`}; }
    if (t === "val") { const per = pick([2,3]), g = pick([1,2,13,14,15,16,17]), e = by(per, g), v = g < 13 ? g : g - 10; return {q:`Find the element in period ${per} whose atoms have ${v} valence electron${v>1?"s":""}.`, ans:e, why:`${e.n} (group ${g}) has ${v} valence electron${v>1?"s":""}.`}; }
    if (t === "z") { const e = pick(ELS.filter(x => x.z <= 36)); return {q:`Find the element with atomic number ${e.z}.`, ans:e, why:`Atomic number ${e.z} is ${e.n} (${e.s}).`}; }
    if (t === "en") { const per = pick([2,3,4]), ps = ELS.filter(e => e.per === per && EN[e.s]), best = ps.sort((a,b) => EN[b.s]-EN[a.s])[0]; return {q:`Find the most electronegative element in period ${per}.`, ans:best, why:`Electronegativity rises across a period, so it is the halogen: ${best.n} (${EN[best.s]}).`}; }
    if (t === "trans") { const g = pick([3,4,5,6,7,8,9,10,11,12]), e = by(4, g); return {q:`Find the period 4 transition metal in group ${g}.`, ans:e, why:`${e.n} (${e.s}) sits in group ${g} of period 4.`}; }
    const per = pick([2,3]), e = by(per, 18); return {q:`Find the element in period ${per} with the highest first ionization energy.`, ans:e, why:`Ionization energy rises across a period, so the noble gas ${e.n} is highest.`};
  }
  const grid = () => { let h = ""; for (let p = 1; p <= 4; p++) for (let g = 1; g <= 18; g++) { const e = by(p, g); h += e ? `<button class="pt-c" data-z="${e.z}" aria-label="${e.n}"><small>${e.z}</small>${e.s}</button>` : `<span class="pt-e"></span>`; } return `<div class="pt-grid">${h}</div>`; };
  area.innerHTML = `<p style="max-width:62ch">Each round gives a clue. Tap the matching element on the periodic table (elements 1 to 36).</p><div><button class="btn accent" id="pt-go">Start · ${ROUNDS} clues</button></div>`;
  $("#pt-go").onclick = round;
  function round(){
    if (i >= ROUNDS) return end();
    const g = make();
    area.innerHTML = `<div class="hud"><span>Clue <b>${i+1}</b>/${ROUNDS}</span><span>Correct <b>${right}</b></span></div><p class="qtext">${esc(g.q)}</p>${grid()}<div id="pt-fb"></div>`;
    let done = false;
    $$(".pt-c", area).forEach(b => b.onclick = () => { if (done) return; done = true; const ok = +b.dataset.z === g.ans.z; CS.record({u:1}, ok, false); if (ok) right++;
      $$(".pt-c", area).forEach(x => { x.disabled = true; if (+x.dataset.z === g.ans.z) x.classList.add("right"); else if (x === b) x.classList.add("wrong"); });
      $("#pt-fb").innerHTML = `<div class="feedback ${ok?"good":"bad"}"><b>${ok?"Correct.":`Answer: ${g.ans.n}.`}</b> ${esc(g.why)}</div><div style="margin-top:10px"><button class="btn" id="pt-next">${i+1<ROUNDS?"Next clue":"See results"}</button></div>`;
      $("#pt-next").onclick = () => { i++; round(); }; $("#pt-next").focus({preventScroll:true}); area._key = e => { if (e.key==="Enter") $("#pt-next").click(); }; });
  }
  function end(){
    area._key = null; const nb = CS.setBest("periodic", right); finish(right*12);
    area.innerHTML = `<span class="eyebrow">Periodic Hunt · results</span><div class="result-big">${right}/${ROUNDS}</div><p class="muted">${nb?"New personal best. ":""}${right>=7?"Mendeleev would be proud.":"Rows are periods (shells) and columns are groups (valence electrons). Use both to locate any element."}</p>
      <div class="row-wrap"><button class="btn" id="pt-again">Play again</button><button class="btn ghost" data-go="learn" data-unit="1">Review Unit 1</button></div>`;
    $("#pt-again").onclick = () => { i = 0; right = 0; round(); };
  }
}

/* ---------- Mix Master (Marketing): sort each move into Product, Price, Place or Promotion ---------- */
const MIX = [
 ["Redesigning the package so it is easier to open",0],["Adding a two-year warranty",0],["Launching a new flavor",0],["Changing the brand name and logo",0],["Adding a longer battery to the next model",0],["Offering free installation and support",0],["Building a line of travel-size versions",0],["Dropping a weak product from the line",0],["Improving quality control on the factory floor",0],["Adding a recyclable, eco-friendly material",0],["Creating a premium version for top-end buyers",0],["Putting nutrition facts on the label",0],
 ["Cutting the price by 20% to gain market share",1],["Offering a 2/10, net 30 cash discount",1],["Launching with a high skimming price",1],["Pricing at $9.99 instead of $10",1],["Bundling three items for one lower price",1],["Giving a quantity discount on orders over 1,000",1],["Raising the price to signal prestige",1],["Offering a rebate after purchase",1],["Setting a student discount",1],["Using penetration pricing for a new snack",1],["Matching a competitor's lower price",1],["Charging a low price for the razor and more for blades",1],
 ["Selling through a network of independent dealers",2],["Opening a store in the mall",2],["Shipping direct to buyers from the website",2],["Choosing intensive distribution for a candy bar",2],["Using rail to move bulk goods to a warehouse",2],["Adding a regional distribution center to cut delivery time",2],["Selecting only a few upscale department stores",2],["Setting up a franchise system",2],["Stocking shelves so the product never sells out",2],["Delivering by drone to nearby customers",2],["Negotiating shelf space with a supermarket",2],["Selling through an app and in stores",2],
 ["Running a Super Bowl commercial",3],["Handing out free samples at the mall",3],["Sponsoring a local youth soccer team",3],["Sending a coupon in the mail",3],["Training the sales team to present to buyers",3],["Paying an influencer to post about the product",3],["Sending a press release to the news media",3],["Running a sweepstakes",3],["Buying search ads for the brand",3],["Building an email newsletter for customers",3],["Placing the brand in a hit movie",3],["Putting up a billboard on the highway",3]
];
function mix(area){
  const NAMES = ["Product", "Price", "Place", "Promotion"];
  let time = 60, score = 0, miss = 0, timer = null, items = [];
  area.innerHTML = `<p style="max-width:62ch">You have 60 seconds. Each move belongs to one of the four Ps. Tap a button, or press 1 to 4. A mistake costs 3 seconds.</p><div><button class="btn accent" id="mx-go">Start</button></div>`;
  $("#mx-go").onclick = start;
  function start(){ items = CS.shuffle(MIX.slice()); show(); timer = setInterval(() => { time--; const t = $("#mx-t"); if (t) t.textContent = Math.max(0, time); if (time <= 0) end(); }, 1000); }
  function show(){
    if (!items.length) items = CS.shuffle(MIX.slice());
    const it = items[0];
    area.innerHTML = `<div class="hud"><span>Time <b id="mx-t">${Math.max(0,time)}</b></span><span>Sorted <b>${score}</b></span><span>Misses <b>${miss}</b></span></div>
      <div class="so-card">${esc(it[0])}</div>
      <div class="mx-btns">${NAMES.map((n, i) => `<button class="btn big" data-b="${i}">${i+1} · ${n}</button>`).join("")}</div><div id="mx-fb" class="tiny muted" style="min-height:1.4em"></div>`;
    const choose = b => { const ok = b === it[1]; CS.record({u:2}, ok, false); items.shift();
      if (ok) score++; else { miss++; time -= 3; if (time <= 0) return end(); }
      show(); if (!ok) { const f = $("#mx-fb"); if (f) f.textContent = `Not quite: "${it[0]}" is a ${NAMES[it[1]]} decision.`; } };
    $$(".mx-btns .btn", area).forEach(x => x.onclick = () => choose(+x.dataset.b));
    area._key = e => { if (/^[1-4]$/.test(e.key)) choose(+e.key - 1); };
  }
  function end(){
    clearInterval(timer); area._key = null; const nb = CS.setBest("mix", score); finish(score*8);
    area.innerHTML = `<span class="eyebrow">Mix Master · results</span><div class="result-big">${score}</div><p class="muted">moves sorted, ${miss} missed${nb?" · new personal best":""}. ${score>=25?"Your marketing mix is perfectly balanced.":"Ask what the move changes: the offer (product), what it costs (price), where it is sold (place), or how it is communicated (promotion)."}</p>
      <div class="row-wrap"><button class="btn" id="mx-again">Play again</button><button class="btn ghost" data-go="learn" data-unit="2">Review Unit 2</button></div>`;
    $("#mx-again").onclick = () => { time = 60; score = 0; miss = 0; start(); };
  }
}

/* ---------- Perceptual Map (Marketing): tap the quadrant where the brand sits ---------- */
/* each: [x axis low, x axis high, y axis low, y axis high, description, x (0 low, 1 high), y (0 low, 1 high), why] */
const MAPS = [
 ["Low price","High price","Low quality","High quality","A luxury watch brand sold at very high prices with exceptional craftsmanship.",1,1,"High on both price and quality."],
 ["Low price","High price","Low quality","High quality","A discount store brand with basic goods at the lowest prices.",0,0,"Low price and basic quality."],
 ["Low price","High price","Low quality","High quality","A premium brand that charges a lot but is known for average, ordinary quality.",1,0,"High price but low quality is overpriced."],
 ["Low price","High price","Low quality","High quality","A value brand that offers excellent quality at a low price.",0,1,"Low price with high quality is a strong value position."],
 ["Traditional","Modern","Affordable","Expensive","A trendy tech startup selling pricey, cutting-edge gadgets.",1,1,"Modern and expensive."],
 ["Traditional","Modern","Affordable","Expensive","A classic family diner with an old-fashioned menu and low prices.",0,0,"Traditional and affordable."],
 ["Traditional","Modern","Affordable","Expensive","A heritage luxury house known for timeless, costly products.",0,1,"Traditional but expensive."],
 ["Traditional","Modern","Affordable","Expensive","A new budget app that looks sleek and costs very little.",1,0,"Modern and affordable."],
 ["Slow service","Fast service","Basic menu","Wide menu","A drive-thru chain serving a huge menu in under two minutes.",1,1,"Fast service and wide menu."],
 ["Slow service","Fast service","Basic menu","Wide menu","A sit-down restaurant with a long menu and leisurely service.",0,1,"Slow but wide."],
 ["Slow service","Fast service","Basic menu","Wide menu","A food truck serving three items quickly.",1,0,"Fast but a basic menu."],
 ["Slow service","Fast service","Basic menu","Wide menu","A small cafe with a short menu where each coffee is made slowly by hand.",0,0,"Slow and basic."],
 ["Casual","Formal","Low price","High price","A tuxedo rental shop with premium prices for formal events.",1,1,"Formal and high priced."],
 ["Casual","Formal","Low price","High price","A thrift store selling cheap jeans and t-shirts.",0,0,"Casual and low priced."],
 ["Casual","Formal","Low price","High price","A designer streetwear brand selling expensive hoodies.",0,1,"Casual but high priced."],
 ["Casual","Formal","Low price","High price","An office-wear chain selling affordable dress shirts.",1,0,"Formal but low priced."],
 ["Mass market","Niche","Mainstream","Innovative","A specialty brand selling cutting-edge gear for a small group of climbers.",1,1,"Niche and innovative."],
 ["Mass market","Niche","Mainstream","Innovative","A household-name soda sold everywhere with a classic recipe.",0,0,"Mass market and mainstream."],
 ["Mass market","Niche","Mainstream","Innovative","A popular phone maker that launches breakthrough features for millions of buyers.",0,1,"Mass market but innovative."],
 ["Mass market","Niche","Mainstream","Innovative","A small shop selling traditional hand-made pottery to collectors.",1,0,"Niche but mainstream style."],
 ["Healthy","Indulgent","Low price","High price","A premium chocolate that is rich, decadent and expensive.",1,1,"Indulgent and high priced."],
 ["Healthy","Indulgent","Low price","High price","A budget salad bar offering light, low-priced meals.",0,0,"Healthy and low priced."],
 ["Healthy","Indulgent","Low price","High price","An organic juice bar selling nutritious drinks at a high price.",0,1,"Healthy and high priced."],
 ["Healthy","Indulgent","Low price","High price","A dollar menu with fried, sugary treats.",1,0,"Indulgent and low priced."]
];
function position(area){
  const ROUNDS = 8; let i = 0, right = 0, pool = [];
  area.innerHTML = `<p style="max-width:62ch">Each round describes a brand and shows a two-axis perceptual map. Tap the quadrant where the brand sits. Eight maps per game.</p><div><button class="btn accent" id="pm-go">Start · ${ROUNDS} maps</button></div>`;
  $("#pm-go").onclick = () => { pool = CS.shuffle(MAPS.slice()); round(); };
  function round(){
    if (i >= ROUNDS) return end();
    const m = pool[i], lab = (x, y) => `${x === 1 ? m[1] : m[0]} and ${y === 1 ? m[3] : m[2]}`.toLowerCase();
    const cell = (x, y) => `<button class="pm-q" data-x="${x}" data-y="${y}" aria-label="${esc(lab(x, y))}"><span>${esc(x === 1 ? m[1] : m[0])}</span><span>${esc(y === 1 ? m[3] : m[2])}</span></button>`;
    area.innerHTML = `<div class="hud"><span>Map <b>${i+1}</b>/${ROUNDS}</span><span>Correct <b>${right}</b></span></div><p class="qtext">${esc(m[4])}</p>
      <div class="pm-wrap"><div class="pm-yl">${esc(m[3])} ↑</div><div class="pm-grid">${cell(0,1)}${cell(1,1)}${cell(0,0)}${cell(1,0)}</div><div class="pm-xl">← ${esc(m[0])} · ${esc(m[1])} →</div><div class="pm-yl">↓ ${esc(m[2])}</div></div><div id="pm-fb"></div>`;
    let done = false;
    $$(".pm-q", area).forEach(b => b.onclick = () => { if (done) return; done = true; const ok = +b.dataset.x === m[5] && +b.dataset.y === m[6]; CS.record({u:5}, ok, false); if (ok) right++;
      $$(".pm-q", area).forEach(q => { q.disabled = true; if (+q.dataset.x === m[5] && +q.dataset.y === m[6]) q.classList.add("right"); else if (q === b) q.classList.add("wrong"); });
      $("#pm-fb").innerHTML = `<div class="feedback ${ok?"good":"bad"}"><b>${ok?"Correct.":`It sits in the ${esc(lab(m[5], m[6]))} quadrant.`}</b> ${esc(m[7])}</div><div style="margin-top:10px"><button class="btn" id="pm-next">${i+1<ROUNDS?"Next map":"See results"}</button></div>`;
      $("#pm-next").onclick = () => { i++; round(); }; $("#pm-next").focus({preventScroll:true}); area._key = e => { if (e.key==="Enter") $("#pm-next").click(); }; });
  }
  function end(){
    area._key = null; const nb = CS.setBest("position", right); finish(right*12);
    area.innerHTML = `<span class="eyebrow">Perceptual Map · results</span><div class="result-big">${right}/${ROUNDS}</div><p class="muted">${nb?"New personal best. ":""}${right>=7?"You can see exactly where every brand sits in buyers' minds.":"A perceptual map plots how buyers see brands on two attributes. Find each axis first, then place the brand."}</p>
      <div class="row-wrap"><button class="btn" id="pm-again">Play again</button><button class="btn ghost" data-go="learn" data-unit="5">Review Unit 5</button></div>`;
    $("#pm-again").onclick = () => { i = 0; right = 0; pool = CS.shuffle(MAPS.slice()); round(); };
  }
}

/* ---------- Timeline Sort (U.S. History): tap four events from earliest to latest ---------- */
function timeline(area){
  const ROUNDS = 8; let i = 0, right = 0, misses = 0, pool = [], pickedEv = null;
  const EVS = () => ((CS.COURSE==="apworld" ? window.CS_WORLD_EV : window.CS_APUSH_EV) || []).map(e => ({n: e[0], y: e[1], u: e[2]}));
  area.innerHTML = `<p style="max-width:62ch">Each round shows four events in a random order. Tap them from the earliest to the latest. A wrong tap costs the round its perfect score. Eight rounds per game.</p><div><button class="btn accent" id="tl-go">Start · ${ROUNDS} rounds</button></div>`;
  $("#tl-go").onclick = () => { pool = CS.shuffle(EVS()); i = 0; right = 0; round(); };
  function deal(){
    for (let tries = 0; tries < 60; tries++) {
      const four = CS.shuffle(EVS()).slice(0, 4).sort((a, b) => a.y - b.y);
      if (four.every((e, j) => j === 0 || e.y - four[j-1].y >= 4)) return four;
    }
    return CS.shuffle(EVS()).slice(0, 4).sort((a, b) => a.y - b.y);
  }
  function round(){
    if (i >= ROUNDS) return end();
    const sorted = deal(), show = CS.shuffle(sorted.slice()); let next = 0, missed = false;
    area.innerHTML = `<div class="hud"><span>Round <b>${i+1}</b>/${ROUNDS}</span><span>Perfect <b>${right}</b></span></div><p class="qtext">Tap the events in order, earliest first.</p>
      <div class="tl-list">${show.map((e, j) => `<button class="tl-ev" data-j="${j}">${esc(e.n.charAt(0).toUpperCase() + e.n.slice(1))}</button>`).join("")}</div><div id="tl-fb" style="min-height:2.6em" class="tiny muted"></div>`;
    $$(".tl-ev", area).forEach(b => b.onclick = () => {
      if (b.disabled) return; const e = show[+b.dataset.j];
      if (e === sorted[next]) { b.disabled = true; b.classList.add("right"); b.insertAdjacentHTML("beforeend", `<span class="tl-yr">${e.y}</span>`); CS.record({u: e.u}, true, false); next++;
        if (next === 4) { if (!missed) right++; const f = $("#tl-fb"); f.innerHTML = `<div class="feedback ${missed?"bad":"good"}"><b>${missed?"All four placed, with a slip.":"Perfect order."}</b></div><div style="margin-top:10px"><button class="btn" id="tl-next">${i+1<ROUNDS?"Next round":"See results"}</button></div>`; $("#tl-next").onclick = () => { i++; round(); }; $("#tl-next").focus({preventScroll:true}); } }
      else { missed = true; misses++; CS.record({u: e.u}, false, false); b.classList.add("wrong"); setTimeout(() => b.classList.remove("wrong"), 500); const f = $("#tl-fb"); if (f && next < 4) f.textContent = "Not the earliest one left. Try again."; }
    });
  }
  function end(){
    area._key = null; const nb = CS.setBest("timeline", right); finish(right*12);
    area.innerHTML = `<span class="eyebrow">Timeline Sort · results</span><div class="result-big">${right}/${ROUNDS}</div><p class="muted">${nb?"New personal best. ":""}${right>=7?"You hold the whole timeline in your head.":"Anchor each event to its period first, then order them within it."} ${misses} wrong tap${misses===1?"":"s"}.</p>
      <div class="row-wrap"><button class="btn" id="tl-again">Play again</button><button class="btn ghost" data-go="learn" data-unit="1">Review the periods</button></div>`;
    $("#tl-again").onclick = () => { i = 0; right = 0; misses = 0; pool = []; round(); };
  }
}

/* ---------- Source Match (U.S. History): which event or movement does this original excerpt come from? ---------- */
/* each: [excerpt, correct answer, [3 wrong answers], explanation, unit] */
const SRC = [
 ["\"We came to this land to build a community that all the world can see, a city on a hill.\"","The Puritan settlement of Massachusetts Bay",["The Virginia Company at Jamestown","The Spanish missions of New Mexico","The Quaker colony of Pennsylvania"],"Winthrop's 'city upon a hill' described the Puritans' hope to model a godly society.",2],
 ["\"Parliament has no right to tax us when we send no one to speak for us there.\"","Colonial protest of the Stamp Act",["The Whiskey Rebellion","The nullification crisis","The Seneca Falls Convention"],"'No taxation without representation' marked colonial objections to Parliament's taxes after 1765.",3],
 ["\"The union is too weak. Each state does as it pleases, and Congress cannot even pay its debts.\"","A Federalist argument for a new Constitution",["An Anti-Federalist argument against ratification","A Loyalist argument against independence","A Populist argument for free silver"],"Federalists said the Articles of Confederation left the national government too weak.",3],
 ["\"The government should not mix its treasure with private banks, which favor the rich over the farmer.\"","Andrew Jackson's fight with the Second Bank",["Hamilton's plan for a national bank","Henry Clay's American System","Carnegie's Gospel of Wealth"],"Jackson attacked the Bank of the United States as a privileged institution.",4],
 ["\"Our factory girls work from dawn to dusk, and we have decided to leave our looms until our pay is restored.\"","The Lowell mill strikes of the 1830s",["The Pullman Strike","The Triangle Fire protests","The Haymarket Affair"],"Mill women protested wage cuts in the 1830s, in an early women's labor action.",4],
 ["\"We hold these truths to be self-evident, that all men and women are created equal.\"","The Declaration of Sentiments at Seneca Falls",["The Declaration of Independence","The Gettysburg Address","The Nineteenth Amendment"],"The 1848 declaration rewrote Jefferson's words to include women.",4],
 ["\"The land is open, the soil is rich, and it is our destiny to spread across the whole continent.\"","Manifest Destiny",["The Monroe Doctrine","The Open Door Policy","Containment"],"Manifest Destiny justified westward expansion in the 1840s.",5],
 ["\"A house divided against itself cannot stand. This government cannot endure permanently half slave and half free.\"","Lincoln's 1858 speech on slavery",["Calhoun's defense of nullification","John Brown's last speech","Jefferson Davis's inaugural address"],"Lincoln warned that the nation could not stay divided over slavery.",5],
 ["\"Freedom came, but the land stayed with the planters, and we worked their fields for a share of the crop.\"","Sharecropping in the Reconstruction South",["The Homestead Act","The Dust Bowl migration","The Great Migration"],"Sharecropping tied freedpeople to planters through debt and shares of the crop.",5],
 ["\"The rich have grown richer by the labor of the poor, and the farmers cry out for relief from the railroads and the banks.\"","The Populist movement of the 1890s",["The Progressive movement","The New Deal","The Civil Rights Movement"],"Populists demanded reforms to help farmers against banks and railroads.",6],
 ["\"Let us work hard, learn trades, and earn respect, and equality will follow.\"","Booker T. Washington's Atlanta Compromise",["W. E. B. Du Bois's Niagara Movement","Marcus Garvey's Back-to-Africa movement","The Black Power movement"],"Washington urged economic progress over immediate demands for political rights.",6],
 ["\"The nation that does not extend its markets will fall behind, and our flag must follow our trade.\"","American imperialism in the 1890s",["Isolationism of the 1930s","The Marshall Plan","Washington's Farewell Address"],"Imperialists stressed markets, naval power and national greatness.",7],
 ["\"The meat was rotten, the workers were sick, and nobody in the government seemed to care.\"","A muckraking exposé of the meatpacking industry",["A report on the Dust Bowl","A critique of the New Deal","A defense of Social Darwinism"],"Muckrakers exposed unsafe food and labor, which led to the Pure Food and Drug Act.",7],
 ["\"We have nothing to fear but fear itself, and the government will act to put people back to work.\"","Franklin Roosevelt's first inaugural address",["Herbert Hoover's rugged individualism","Woodrow Wilson's war message","Calvin Coolidge's business speech"],"Roosevelt promised action to fight the Great Depression.",7],
 ["\"Our boys are overseas, and we at home must grow our own food and buy war bonds.\"","The home front in World War II",["The Red Scare","Prohibition enforcement","The Progressive movement"],"The home front involved rationing, victory gardens and war bonds.",7],
 ["\"If we do not stop them there, one nation after another will fall, like a row of dominoes.\"","The domino theory of the Cold War",["The Roosevelt Corollary","Isolationism","Détente"],"The domino theory justified U.S. involvement in Vietnam.",8],
 ["\"We shall not be moved. We will sit at the counter until we are served, without raising a hand in anger.\"","The 1960 sit-in movement",["The Black Power movement","The Niagara Movement","The Harlem Renaissance"],"Sit-ins used nonviolent direct action against segregation.",8],
 ["\"The government must help the poor, the old and the sick, and build a Great Society.\"","Lyndon Johnson's Great Society",["Reagan's New Federalism","Nixon's Southern strategy","Eisenhower's Modern Republicanism"],"Great Society programs expanded Medicare, Medicaid and education aid.",8],
 ["\"Government is not the solution to our problem; government is the problem.\"","Ronald Reagan's conservative message",["Franklin Roosevelt's New Deal","Lyndon Johnson's Great Society","Theodore Roosevelt's New Nationalism"],"Reagan's 1981 inaugural address expressed distrust of big government.",9],
 ["\"Tear down this wall.\"","Reagan's call at the Berlin Wall",["Kennedy's speech on Cuba","Truman's speech on the Marshall Plan","Nixon's trip to China"],"Reagan challenged Gorbachev in 1987 at the Brandenburg Gate.",9],
 ["\"Remember the ladies, and be more generous and favorable to them than your ancestors were.\"","Abigail Adams's letter to John Adams",["Seneca Falls Declaration of Sentiments","Betty Friedan's The Feminine Mystique","Susan B. Anthony's trial speech"],"Abigail Adams asked for women's rights in the new laws of 1776.",3],
 ["\"Under this agreement, colonists in the West shall stay west of the mountains to avoid conflict with native nations.\"","The Proclamation of 1763",["The Northwest Ordinance","The Louisiana Purchase","The Homestead Act"],"The proclamation limited westward settlement after the French and Indian War.",3],
 ["\"No European power shall plant new colonies in the Americas, and we shall not meddle in Europe's wars.\"","The Monroe Doctrine",["The Truman Doctrine","The Open Door Policy","The Roosevelt Corollary"],"The 1823 doctrine warned Europe away from new colonization.",4],
 ["\"The wealthy owe a duty to use their fortunes for the good of the community, such as libraries and schools.\"","Carnegie's Gospel of Wealth",["Social Darwinism","The Populist platform","The Wagner Act"],"Carnegie urged philanthropy by the rich.",6]
];
/* ---------- U.S. Government: Court Case Match, Branch Check, Amendment Sprint ---------- */
function court(area){
  const ROUNDS = 8; let i = 0, right = 0, pool = [];
  area.innerHTML = `<p style="max-width:62ch">A Supreme Court case appears. Pick the ruling that matches it. Eight cases per game, including all the required AP&reg; cases.</p><div><button class="btn accent" id="cc-go">Start · ${ROUNDS} cases</button></div>`;
  $("#cc-go").onclick = () => { pool = CS.shuffle((window.CS_GOV_CASES||[]).slice()); i = 0; right = 0; round(); };
  function round(){
    if (i >= ROUNDS) return end();
    const q = pool[i], others = CS.shuffle((window.CS_GOV_CASES||[]).filter(c => c[0] !== q[0])).slice(0,3), opts = CS.shuffle([q].concat(others));
    area.innerHTML = `<div class="hud"><span>Case <b>${i+1}</b>/${ROUNDS}</span><span>Correct <b>${right}</b></span></div><blockquote class="sm-quote"><b>${esc(q[0])}</b> (${q[1]})</blockquote><p class="muted tiny">What did the Court rule?</p>
      <div class="sm-opts">${opts.map((o,k) => `<button class="btn ghost sm-o" data-o="${k}">${esc(o[2])}</button>`).join("")}</div><div id="sm-fb"></div>`;
    let done = false;
    $$(".sm-o", area).forEach(b => b.onclick = () => { if (done) return; done = true; const pick = opts[+b.dataset.o], ok = pick[0] === q[0]; CS.record({u: q[3]}, ok, false); if (ok) right++;
      $$(".sm-o", area).forEach(x => { x.disabled = true; if (opts[+x.dataset.o][0] === q[0]) x.classList.add("right"); else if (x === b) x.classList.add("wrong"); });
      $("#sm-fb").innerHTML = `<div class="feedback ${ok?"good":"bad"}"><b>${ok?"Correct.":"Not quite."}</b> ${esc(q[0])} (${q[1]}): ${esc(q[2])}${ok?"":` That ruling belongs to ${esc(pick[0])}.`}</div><div style="margin-top:10px"><button class="btn" id="sm-next">${i+1<ROUNDS?"Next case":"See results"}</button></div>`;
      $("#sm-next").onclick = () => { i++; round(); }; $("#sm-next").focus({preventScroll:true}); area._key = e => { if (e.key === "Enter") $("#sm-next").click(); }; });
  }
  function end(){
    area._key = null; const nb = CS.setBest("court", right); finish(right*12);
    area.innerHTML = `<span class="eyebrow">Court Case Match · results</span><div class="result-big">${right}/${ROUNDS}</div><p class="muted">${nb?"New personal best. ":""}${right>=7?"You could argue before the Court.":"Tie each case to its clause: First Amendment, due process, equal protection or federal power."}</p>
      <div class="row-wrap"><button class="btn" id="cc-again">Play again</button><button class="btn ghost" data-go="frq">Try a SCOTUS Comparison</button></div>`;
    $("#cc-again").onclick = () => { pool = CS.shuffle((window.CS_GOV_CASES||[]).slice()); i = 0; right = 0; round(); };
  }
}
function branch(area){
  const NAMES = ["Legislative", "Executive", "Judicial"];
  let time = 60, score = 0, miss = 0, timer = null, items = [];
  const all = () => window.CS_GOV_BRANCH || [];
  area.innerHTML = `<p style="max-width:62ch">You have 60 seconds. Each power or action belongs to one branch of the national government. Tap a button, or press 1 to 3. A mistake costs 3 seconds.</p><div><button class="btn accent" id="br-go">Start</button></div>`;
  $("#br-go").onclick = start;
  function start(){ items = CS.shuffle(all().slice()); show(); timer = setInterval(() => { time--; const t = $("#mx-t"); if (t) t.textContent = Math.max(0, time); if (time <= 0) end(); }, 1000); }
  function show(){
    if (!items.length) items = CS.shuffle(all().slice());
    const it = items[0];
    area.innerHTML = `<div class="hud"><span>Time <b id="mx-t">${Math.max(0,time)}</b></span><span>Sorted <b>${score}</b></span><span>Misses <b>${miss}</b></span></div>
      <div class="so-card">${esc(it[0])}</div>
      <div class="mx-btns">${NAMES.map((n, i) => `<button class="btn big" data-b="${i}">${i+1} · ${n}</button>`).join("")}</div><div id="mx-fb" class="tiny muted" style="min-height:1.4em"></div>`;
    const choose = b => { const ok = b === it[1]; CS.record({u:it[2]||2}, ok, false); items.shift();
      if (ok) score++; else { miss++; time -= 3; if (time <= 0) return end(); }
      show(); if (!ok) { const f = $("#mx-fb"); if (f) f.textContent = `Not quite: "${it[0]}" belongs to the ${NAMES[it[1]].toLowerCase()} branch.`; } };
    $$(".mx-btns .btn", area).forEach(x => x.onclick = () => choose(+x.dataset.b));
    area._key = e => { if (/^[1-3]$/.test(e.key)) choose(+e.key - 1); };
  }
  function end(){
    clearInterval(timer); area._key = null; const nb = CS.setBest("branch", score); finish(score*8);
    area.innerHTML = `<span class="eyebrow">Branch Check · results</span><div class="result-big">${score}</div><p class="muted">powers sorted, ${miss} missed${nb?" · new personal best":""}. ${score>=25?"You know who does what.":"Congress makes laws, the president carries them out and the courts interpret them."}</p>
      <div class="row-wrap"><button class="btn" id="br-again">Play again</button><button class="btn ghost" data-go="learn" data-unit="2">Review Unit 2</button></div>`;
    $("#br-again").onclick = () => { time = 60; score = 0; miss = 0; start(); };
  }
}
function amend(area){
  let time = 60, score = 0, miss = 0, timer = null, items = [];
  const all = () => window.CS_GOV_AMEND || [];
  area.innerHTML = `<p style="max-width:62ch">You have 60 seconds. A clue describes an amendment; pick which one it is. Tap a button, or press 1 to 4. A mistake costs 3 seconds.</p><div><button class="btn accent" id="am-go">Start</button></div>`;
  $("#am-go").onclick = start;
  function start(){ items = CS.shuffle(all().slice()); show(); timer = setInterval(() => { time--; const t = $("#mx-t"); if (t) t.textContent = Math.max(0, time); if (time <= 0) end(); }, 1000); }
  function show(){
    if (!items.length) items = CS.shuffle(all().slice());
    const it = items[0], opts = CS.shuffle([it].concat(CS.shuffle(all().filter(a => a[0] !== it[0])).slice(0,3)));
    area.innerHTML = `<div class="hud"><span>Time <b id="mx-t">${Math.max(0,time)}</b></span><span>Correct <b>${score}</b></span><span>Misses <b>${miss}</b></span></div>
      <div class="so-card">Which amendment ${esc(it[2].replace(/\.$/,"").replace(/^([A-Z])/,(m)=>m.toLowerCase()))}?</div>
      <div class="mx-btns">${opts.map((o, i) => `<button class="btn big" data-b="${o[0]}">${i+1} · ${esc(o[1])}</button>`).join("")}</div><div id="mx-fb" class="tiny muted" style="min-height:1.4em"></div>`;
    const choose = n => { const ok = n === it[0]; CS.record({u: it[0] <= 10 ? 1 : 5}, ok, false); items.shift();
      if (ok) score++; else { miss++; time -= 3; if (time <= 0) return end(); }
      show(); if (!ok) { const f = $("#mx-fb"); if (f) f.textContent = `Not quite: the ${it[1]} Amendment ${it[2].replace(/\.$/,"").replace(/^([A-Z])/,(m)=>m.toLowerCase())}.`; } };
    const btns = $$(".mx-btns .btn", area); btns.forEach(x => x.onclick = () => choose(+x.dataset.b));
    area._key = e => { if (/^[1-4]$/.test(e.key)) choose(+btns[+e.key - 1].dataset.b); };
  }
  function end(){
    clearInterval(timer); area._key = null; const nb = CS.setBest("amend", score); finish(score*8);
    area.innerHTML = `<span class="eyebrow">Amendment Sprint · results</span><div class="result-big">${score}</div><p class="muted">amendments named, ${miss} missed${nb?" · new personal best":""}. ${score>=18?"You know your Constitution.":"Start with the Bill of Rights, then the Reconstruction and voting amendments."}</p>
      <div class="row-wrap"><button class="btn" id="am-again">Play again</button><button class="btn ghost" data-go="cards">Review flashcards</button></div>`;
    $("#am-again").onclick = () => { time = 60; score = 0; miss = 0; start(); };
  }
}

/* ---------- Psychology: Famous Studies Match, Brain Check, Disorder Sort, Bias Spotter ---------- */
function studies(area){
  const ROUNDS = 8; let i = 0, right = 0, pool = [];
  const all = () => window.CS_PSY_STUDIES || [];
  area.innerHTML = `<p style="max-width:62ch">A classic psychology finding appears. Pick the researcher who is known for it. Eight findings per game, from conditioning to conformity.</p><div><button class="btn accent" id="fs-go">Start · ${ROUNDS} findings</button></div>`;
  $("#fs-go").onclick = () => { pool = CS.shuffle(all().slice()); i = 0; right = 0; round(); };
  function round(){
    if (i >= ROUNDS) return end();
    const q = pool[i], others = CS.shuffle(all().filter(c => c[0] !== q[0])).slice(0,3), opts = CS.shuffle([q].concat(others));
    area.innerHTML = `<div class="hud"><span>Finding <b>${i+1}</b>/${ROUNDS}</span><span>Correct <b>${right}</b></span></div><blockquote class="sm-quote">${esc(q[2])}</blockquote><p class="muted tiny">Which researcher is known for this?</p>
      <div class="sm-opts">${opts.map((o,k) => `<button class="btn ghost sm-o" data-o="${k}">${esc(o[0])}</button>`).join("")}</div><div id="sm-fb"></div>`;
    let done = false;
    $$(".sm-o", area).forEach(b => b.onclick = () => { if (done) return; done = true; const pick = opts[+b.dataset.o], ok = pick[0] === q[0]; CS.record({u: q[3]}, ok, false); if (ok) right++;
      $$(".sm-o", area).forEach(x => { x.disabled = true; if (opts[+x.dataset.o][0] === q[0]) x.classList.add("right"); else if (x === b) x.classList.add("wrong"); });
      $("#sm-fb").innerHTML = `<div class="feedback ${ok?"good":"bad"}"><b>${ok?"Correct.":"Not quite."}</b> ${esc(q[0])} (${q[1]}): ${esc(q[2])}${ok?"":` ${esc(pick[0])} is known for a different finding.`}</div><div style="margin-top:10px"><button class="btn" id="sm-next">${i+1<ROUNDS?"Next finding":"See results"}</button></div>`;
      $("#sm-next").onclick = () => { i++; round(); }; $("#sm-next").focus({preventScroll:true}); area._key = e => { if (e.key === "Enter") $("#sm-next").click(); }; });
  }
  function end(){
    area._key = null; const nb = CS.setBest("studies", right); finish(right*12);
    area.innerHTML = `<span class="eyebrow">Famous Studies Match · results</span><div class="result-big">${right}/${ROUNDS}</div><p class="muted">${nb?"New personal best. ":""}${right>=7?"You know your classic studies.":"Link each study to its big idea: conditioning, memory, development, conformity or treatment."}</p>
      <div class="row-wrap"><button class="btn" id="fs-again">Play again</button><button class="btn ghost" data-go="frq">Try an Article Analysis</button></div>`;
    $("#fs-again").onclick = () => { pool = CS.shuffle(all().slice()); i = 0; right = 0; round(); };
  }
}
function brainreg(area){
  let time = 60, score = 0, miss = 0, timer = null, items = [];
  const all = () => window.CS_PSY_BRAIN || [];
  area.innerHTML = `<p style="max-width:62ch">You have 60 seconds. A clue describes a brain region, neuron part, sense organ or chemical messenger; pick which one it is. Tap a button, or press 1 to 4. A mistake costs 3 seconds.</p><div><button class="btn accent" id="bc-go">Start</button></div>`;
  $("#bc-go").onclick = start;
  function start(){ items = CS.shuffle(all().slice()); show(); timer = setInterval(() => { time--; const t = $("#mx-t"); if (t) t.textContent = Math.max(0, time); if (time <= 0) end(); }, 1000); }
  function show(){
    if (!items.length) items = CS.shuffle(all().slice());
    const it = items[0], opts = CS.shuffle([it].concat(CS.shuffle(all().filter(a => a[0] !== it[0])).slice(0,3)));
    area.innerHTML = `<div class="hud"><span>Time <b id="mx-t">${Math.max(0,time)}</b></span><span>Correct <b>${score}</b></span><span>Misses <b>${miss}</b></span></div>
      <div class="so-card">Which of these ${esc(it[2])}?</div>
      <div class="mx-btns">${opts.map((o, i) => `<button class="btn big" data-b="${o[0]}">${i+1} · ${esc(o[1])}</button>`).join("")}</div><div id="mx-fb" class="tiny muted" style="min-height:1.4em"></div>`;
    const choose = n => { const ok = n === it[0]; CS.record({u: it[3]||1}, ok, false); items.shift();
      if (ok) score++; else { miss++; time -= 3; if (time <= 0) return end(); }
      show(); if (!ok) { const f = $("#mx-fb"); if (f) f.textContent = `Not quite: ${it[1]} ${it[2].replace(/^(is|are) /,m=>m)}.`; } };
    const btns = $$(".mx-btns .btn", area); btns.forEach(x => x.onclick = () => choose(+x.dataset.b));
    area._key = e => { if (/^[1-4]$/.test(e.key)) choose(+btns[+e.key - 1].dataset.b); };
  }
  function end(){
    clearInterval(timer); area._key = null; const nb = CS.setBest("brainreg", score); finish(score*8);
    area.innerHTML = `<span class="eyebrow">Brain Check · results</span><div class="result-big">${score}</div><p class="muted">named, ${miss} missed${nb?" · new personal best":""}. ${score>=18?"You know your neuroscience.":"Start with the lobes, the limbic system and the main neurotransmitters."}</p>
      <div class="row-wrap"><button class="btn" id="bc-again">Play again</button><button class="btn ghost" data-go="cards">Review flashcards</button></div>`;
    $("#bc-again").onclick = () => { time = 60; score = 0; miss = 0; start(); };
  }
}
function dsort(area){
  const NAMES = ["Anxiety-related", "Mood", "Psychotic or dissociative", "Neurodevelopmental, eating or personality"];
  let time = 60, score = 0, miss = 0, timer = null, items = [];
  const all = () => window.CS_PSY_DIS || [];
  area.innerHTML = `<p style="max-width:62ch">You have 60 seconds. Each set of symptoms belongs to one family of disorders. Tap a button, or press 1 to 4. A mistake costs 3 seconds.</p><div><button class="btn accent" id="ds-go">Start</button></div>`;
  $("#ds-go").onclick = start;
  function start(){ items = CS.shuffle(all().slice()); show(); timer = setInterval(() => { time--; const t = $("#mx-t"); if (t) t.textContent = Math.max(0, time); if (time <= 0) end(); }, 1000); }
  function show(){
    if (!items.length) items = CS.shuffle(all().slice());
    const it = items[0];
    area.innerHTML = `<div class="hud"><span>Time <b id="mx-t">${Math.max(0,time)}</b></span><span>Sorted <b>${score}</b></span><span>Misses <b>${miss}</b></span></div>
      <div class="so-card">${esc(it[0])}.</div>
      <div class="mx-btns">${NAMES.map((n, i) => `<button class="btn big" data-b="${i}">${i+1} · ${n}</button>`).join("")}</div><div id="mx-fb" class="tiny muted" style="min-height:1.4em"></div>`;
    const choose = b => { const ok = b === it[1]; CS.record({u:5}, ok, false); items.shift();
      if (ok) score++; else { miss++; time -= 3; if (time <= 0) return end(); }
      show(); if (!ok) { const f = $("#mx-fb"); if (f) f.textContent = `Not quite: those symptoms fit ${it[2]}, which is in the ${NAMES[it[1]].toLowerCase()} group.`; } };
    $$(".mx-btns .btn", area).forEach(x => x.onclick = () => choose(+x.dataset.b));
    area._key = e => { if (/^[1-4]$/.test(e.key)) choose(+e.key - 1); };
  }
  function end(){
    clearInterval(timer); area._key = null; const nb = CS.setBest("dsort", score); finish(score*8);
    area.innerHTML = `<span class="eyebrow">Disorder Sort · results</span><div class="result-big">${score}</div><p class="muted">sorted, ${miss} missed${nb?" · new personal best":""}. ${score>=20?"You can sort the DSM families.":"Anxiety-related disorders center on fear, mood disorders on depression and mania, and psychotic disorders on lost contact with reality."}</p>
      <div class="row-wrap"><button class="btn" id="ds-again">Play again</button><button class="btn ghost" data-go="learn" data-unit="5">Review Unit 5</button></div>`;
    $("#ds-again").onclick = () => { time = 60; score = 0; miss = 0; start(); };
  }
}
function bias(area){
  const ROUNDS = 8; let i = 0, right = 0, pool = [];
  const all = () => window.CS_PSY_BIAS || [];
  area.innerHTML = `<p style="max-width:62ch">Each round describes a short everyday scenario. Name the thinking error, social effect or defense mechanism it shows. Eight scenarios per game.</p><div><button class="btn accent" id="bs-go">Start · ${ROUNDS} scenarios</button></div>`;
  $("#bs-go").onclick = () => { pool = CS.shuffle(all().slice()); i = 0; right = 0; round(); };
  function round(){
    if (i >= ROUNDS) return end();
    const q = pool[i], others = CS.shuffle(all().filter(c => c[1] !== q[1] && c[4] === q[4])).slice(0,3), opts = CS.shuffle([q].concat(others));
    area.innerHTML = `<div class="hud"><span>Scenario <b>${i+1}</b>/${ROUNDS}</span><span>Correct <b>${right}</b></span></div><blockquote class="sm-quote">${esc(q[0])}</blockquote><p class="muted tiny">This best illustrates:</p>
      <div class="sm-opts">${opts.map((o,k) => `<button class="btn ghost sm-o" data-o="${k}">${esc(o[1])}</button>`).join("")}</div><div id="sm-fb"></div>`;
    let done = false;
    $$(".sm-o", area).forEach(b => b.onclick = () => { if (done) return; done = true; const pick = opts[+b.dataset.o], ok = pick[1] === q[1]; CS.record({u: q[3]}, ok, false); if (ok) right++;
      $$(".sm-o", area).forEach(x => { x.disabled = true; if (opts[+x.dataset.o][1] === q[1]) x.classList.add("right"); else if (x === b) x.classList.add("wrong"); });
      $("#sm-fb").innerHTML = `<div class="feedback ${ok?"good":"bad"}"><b>${ok?"Correct.":"Not quite: "+esc(q[1])+"."}</b> ${esc(q[2])}</div><div style="margin-top:10px"><button class="btn" id="sm-next">${i+1<ROUNDS?"Next scenario":"See results"}</button></div>`;
      $("#sm-next").onclick = () => { i++; round(); }; $("#sm-next").focus({preventScroll:true}); area._key = e => { if (e.key === "Enter") $("#sm-next").click(); }; });
  }
  function end(){
    area._key = null; const nb = CS.setBest("bias", right); finish(right*12);
    area.innerHTML = `<span class="eyebrow">Bias Spotter · results</span><div class="result-big">${right}/${ROUNDS}</div><p class="muted">${nb?"New personal best. ":""}${right>=7?"Nothing gets past you.":"Ask whether the scenario is about thinking (heuristics and biases), groups (social effects) or protecting the ego (defense mechanisms)."}</p>
      <div class="row-wrap"><button class="btn" id="bs-again">Play again</button><button class="btn ghost" data-go="cards">Review flashcards</button></div>`;
    $("#bs-again").onclick = () => { i = 0; right = 0; pool = CS.shuffle(all().slice()); round(); };
  }
}

const srcFor = () => CS.COURSE==="apworld" ? (window.CS_WORLD_SRC||[]) : CS.COURSE==="apgov" ? (window.CS_GOV_SRC||[]) : SRC;
function source(area){
  const ROUNDS = 8; let i = 0, right = 0, pool = [];
  area.innerHTML = `<p style="max-width:62ch">Each round shows a short original excerpt written in the style of an exam source. Choose the event, movement or person it comes from. Eight excerpts per game.</p><div><button class="btn accent" id="sm-go">Start · ${ROUNDS} excerpts</button></div>`;
  $("#sm-go").onclick = () => { pool = CS.shuffle(srcFor().slice()); i = 0; right = 0; round(); };
  function round(){
    if (i >= ROUNDS) return end();
    const q = pool[i], opts = CS.shuffle([q[1]].concat(q[2]));
    area.innerHTML = `<div class="hud"><span>Source <b>${i+1}</b>/${ROUNDS}</span><span>Correct <b>${right}</b></span></div><blockquote class="sm-quote">${q[0]}</blockquote><p class="muted tiny">This excerpt comes from or best fits:</p>
      <div class="sm-opts">${opts.map(o => `<button class="btn ghost sm-o" data-o="${esc(o)}">${esc(o)}</button>`).join("")}</div><div id="sm-fb"></div>`;
    let done = false;
    $$(".sm-o", area).forEach(b => b.onclick = () => { if (done) return; done = true; const ok = b.dataset.o === q[1]; CS.record({u: q[4]}, ok, false); if (ok) right++;
      $$(".sm-o", area).forEach(x => { x.disabled = true; if (x.dataset.o === q[1]) x.classList.add("right"); else if (x === b) x.classList.add("wrong"); });
      $("#sm-fb").innerHTML = `<div class="feedback ${ok?"good":"bad"}"><b>${ok?"Correct.":"Not quite: "+esc(q[1])+"."}</b> ${esc(q[3])}</div><div style="margin-top:10px"><button class="btn" id="sm-next">${i+1<ROUNDS?"Next excerpt":"See results"}</button></div>`;
      $("#sm-next").onclick = () => { i++; round(); }; $("#sm-next").focus({preventScroll:true}); area._key = e => { if (e.key === "Enter") $("#sm-next").click(); }; });
  }
  function end(){
    area._key = null; const nb = CS.setBest("source", right); finish(right*12);
    area.innerHTML = `<span class="eyebrow">Source Match · results</span><div class="result-big">${right}/${ROUNDS}</div><p class="muted">${nb?"New personal best. ":""}${right>=7?"You read sources like a historian.":"Look for date clues, audience and purpose before choosing."}</p>
      <div class="row-wrap"><button class="btn" id="sm-again">Play again</button><button class="btn ghost" data-go="frq">Try a DBQ</button></div>`;
    $("#sm-again").onclick = () => { i = 0; right = 0; pool = CS.shuffle(srcFor().slice()); round(); };
  }
}
})();
