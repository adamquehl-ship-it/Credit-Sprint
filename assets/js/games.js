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
  ...((CS.COURSE==="macro"||CS.COURSE==="osu2002") ? [{k:"crisis", n:"Crisis Desk", ic:"bank", d:"A headline breaks. Call what happens to real GDP, the price level and unemployment in the short run.", best:()=>S().best.crisis!=null?`Best: ${S().best.crisis}/24`:"Not played yet", isNew:true}] : []),
  ...(((CS.COURSE==="micro"||CS.COURSE==="osu2001")||CS.COURSE==="osu2001") ? [{k:"elastic", n:"Elasticity Sprint", ic:"chart", d:"Read the price and quantity data, then call the elasticity and what happens to total revenue.", best:()=>S().best.elastic!=null?`Best: ${S().best.elastic}/10`:"Not played yet", isNew:true}] : []),
  ...(CS.COURSE==="bio" ? [{k:"sorter", n:"Cell Sorter", ic:"cards", d:"60 seconds. Sort each fact into the right bucket: prokaryote or eukaryote, mitosis or meiosis, DNA or RNA and more.", best:()=>S().best.sorter!=null?`Best: ${S().best.sorter} sorted`:"Not played yet", isNew:true}] : []),
  ...(CS.COURSE==="chem" ? [{k:"periodic", n:"Periodic Hunt", ic:"flask", d:"Clues lead you to an element. Tap it on the periodic table: groups, valence electrons, trends and atomic numbers.", best:()=>S().best.periodic!=null?`Best: ${S().best.periodic}/8`:"Not played yet", isNew:true}] : []),
  ...(CS.COURSE==="chem" ? [{k:"balance", n:"Balance It", ic:"flask", d:"Balance chemical equations at speed. Set the coefficients so every atom is conserved, in the smallest whole numbers.", best:()=>S().best.balance!=null?`Best: ${S().best.balance}/8`:"Not played yet", isNew:true}] : []),
  ...(CS.COURSE==="mkt" ? [{k:"mix", n:"Mix Master", ic:"cards", d:"60 seconds. Sort each marketing move into the right P: Product, Price, Place or Promotion. A mistake costs 3 seconds.", best:()=>S().best.mix!=null?`Best: ${S().best.mix} sorted`:"Not played yet", isNew:true}] : []),
  ...(CS.COURSE==="mkt" ? [
    {k:"segs", n:"Segment Sniper", ic:"target", d:"60 seconds. Each scenario uses one segmentation base: geographic, demographic, psychographic or behavioral. Shoot the right one; a mistake costs 3 seconds.", best:()=>S().best.segs!=null?`Best: ${S().best.segs} sorted`:"Not played yet", isNew:true},
    {k:"plc", n:"Lifecycle Ladder", ic:"chart", d:"A clue about sales, profits, rivals or strategy appears. Name the stage of the product life cycle: introduction, growth, maturity or decline.", best:()=>S().best.plc!=null?`Best: ${S().best.plc}/8`:"Not played yet", isNew:true},
    {k:"pricepick", n:"Pricing Pick", ic:"calc", d:"A pricing move appears. Pick the strategy: skimming, penetration, prestige, captive, bundle, loss leader, EDLP, dynamic and every discount on the exam.", best:()=>S().best.pricepick!=null?`Best: ${S().best.pricepick}/8`:"Not played yet", isNew:true},
    {k:"promomix", n:"Promo Mix Match", ic:"bolt", d:"60 seconds. Sort each move into advertising, personal selling, sales promotion, public relations or direct and digital marketing. A mistake costs 3 seconds.", best:()=>S().best.promomix!=null?`Best: ${S().best.promomix} sorted`:"Not played yet", isNew:true}] : []),
  ...(CS.COURSE==="mkt" ? [{k:"position", n:"Perceptual Map", ic:"chart", d:"Read the brand description, then tap the quadrant of the perceptual map where it sits. Positioning, fast.", best:()=>S().best.position!=null?`Best: ${S().best.position}/8`:"Not played yet", isNew:true}] : []),
  ...((CS.COURSE==="apush"||CS.COURSE==="apworld") ? [{k:"timeline", n:"Timeline Sort", ic:"link", d:"Four events appear out of order. Tap them from earliest to latest. Chronological reasoning is the heart of AP® history.", best:()=>S().best.timeline!=null?`Best: ${S().best.timeline}/8`:"Not played yet", isNew:true}] : []),
  ...((CS.COURSE==="apush"||CS.COURSE==="apworld"||CS.COURSE==="apgov") ? [{k:"source", n:"Source Match", ic:"cards", d:"Read a short original excerpt in the style of an exam source, then pick the event, movement or person it comes from.", best:()=>S().best.source!=null?`Best: ${S().best.source}/8`:"Not played yet", isNew:true}] : []),
  ...(CS.COURSE==="appsych" ? [
    {k:"studies", n:"Famous Studies Match", ic:"cards", d:"A classic finding appears. Pick the researcher who found it, from Pavlov to Milgram.", best:()=>S().best.studies!=null?`Best: ${S().best.studies}/8`:"Not played yet", isNew:true},
    {k:"brainreg", n:"Brain Check", ic:"bolt", d:"60 seconds. A clue describes a brain region or chemical messenger; name it before time runs out.", best:()=>S().best.brainreg!=null?`Best: ${S().best.brainreg} named`:"Not played yet", isNew:true},
    {k:"dsort", n:"Disorder Sort", ic:"cards", d:"60 seconds. Sort each set of symptoms into the right family of disorders. A mistake costs 3 seconds.", best:()=>S().best.dsort!=null?`Best: ${S().best.dsort} sorted`:"Not played yet", isNew:true},
    {k:"bias", n:"Bias Spotter", ic:"cards", d:"A short scenario describes a thinking error, social effect or defense mechanism. Name it.", best:()=>S().best.bias!=null?`Best: ${S().best.bias}/8`:"Not played yet", isNew:true}] : []),
  ...((CS.COURSE==="apstat"||CS.COURSE==="osu1430") ? [
    {k:"whichtest", n:"Which Test?", ic:"cards", d:"A study scenario appears. Pick the right procedure: one- or two-sample z or t, matched pairs, chi-square or regression.", best:()=>S().best.whichtest!=null?`Best: ${S().best.whichtest}/8`:"Not played yet", isNew:true},
    {k:"shapes", n:"Shape Match", ic:"chart", d:"60 seconds. A clue describes a distribution or scatterplot; name its shape, center or association. A mistake costs 3 seconds.", best:()=>S().best.shapes!=null?`Best: ${S().best.shapes} matched`:"Not played yet", isNew:true},
    {k:"sbias", n:"Bias Spotter", ic:"cards", d:"A short study description hides a flaw: undercoverage, voluntary response, confounding, no control group. Name it.", best:()=>S().best.sbias!=null?`Best: ${S().best.sbias}/8`:"Not played yet", isNew:true},
    {k:"plinko", n:"Probability Plinko", ic:"star", d:"Solve a probability problem and drop the ball. Right answers land in the jackpot slot. Binomial, independence, conditional probability and more.", best:()=>S().best.plinko!=null?`Best: ${S().best.plinko}/8`:"Not played yet", isNew:true}] : []),
  ...((CS.COURSE==="calcab"||CS.COURSE==="calcbc"||CS.COURSE==="osu1151") ? [
    {k:"deriv", n:"Derivative Dash", ic:"bolt", d:"60 seconds. A function appears; tap its derivative. Power, product, quotient and chain rules at speed. A mistake costs 3 seconds.", best:()=>S().best.deriv!=null?`Best: ${S().best.deriv} correct`:"Not played yet", isNew:true},
    {k:"tshot", n:"Tangent Shot", ic:"target", d:"A curve and a point. Four lines pass through it; only one is the tangent. Read the slope and take the shot.", best:()=>S().best.tshot!=null?`Best: ${S().best.tshot}/8`:"Not played yet", isNew:true},
    {k:"graphd", n:"Graph Detective", ic:"chart", d:"A clue about f′ or f″ appears. Decide what it tells you about f: increasing, concave down, a relative maximum, an inflection point and more.", best:()=>S().best.graphd!=null?`Best: ${S().best.graphd}/8`:"Not played yet", isNew:true},
    {k:"integ", n:"Integral Sprint", ic:"calc", d:"60 seconds of antiderivatives: power rule, trig, exponentials, logs and u-substitution. Tap the right one; a mistake costs 3 seconds.", best:()=>S().best.integ!=null?`Best: ${S().best.integ} correct`:"Not played yet", isNew:true},
    ...(CS.COURSE==="calcbc" ? [{k:"series", n:"Series Court", ic:"sword", d:"60 seconds. Each series takes the stand: converges absolutely, converges conditionally or diverges? Pick the verdict. A mistake costs 3 seconds.", best:()=>S().best.series!=null?`Best: ${S().best.series} judged`:"Not played yet", isNew:true}] : [])] : []),
  ...(CS.COURSE==="apgov" ? [
    {k:"court", n:"Court Case Match", ic:"cards", d:"A landmark Supreme Court case appears. Pick the ruling that matches it, from Marbury to Dobbs.", best:()=>S().best.court!=null?`Best: ${S().best.court}/8`:"Not played yet", isNew:true},
    {k:"branch", n:"Branch Check", ic:"cards", d:"60 seconds. Sort each power into the legislative, executive or judicial branch. A mistake costs 3 seconds.", best:()=>S().best.branch!=null?`Best: ${S().best.branch} sorted`:"Not played yet", isNew:true},
    {k:"amend", n:"Amendment Sprint", ic:"bolt", d:"60 seconds. A clue describes an amendment; name it before time runs out.", best:()=>S().best.amend!=null?`Best: ${S().best.amend} named`:"Not played yet", isNew:true}] : []),
  ...(CS.COURSE==="aphug" ? [
    {k:"models", n:"Model Match", ic:"cards", d:"A clue describes a model or theory. Name it: the DTM, von Thünen, Burgess, Rostow, Wallerstein, the gravity model and more.", best:()=>S().best.models!=null?`Best: ${S().best.models}/8`:"Not played yet", isNew:true},
    {k:"diffsort", n:"Diffusion Sort", ic:"bolt", d:"60 seconds. Sort each example into relocation, contagious, hierarchical or stimulus diffusion. A mistake costs 3 seconds.", best:()=>S().best.diffsort!=null?`Best: ${S().best.diffsort} sorted`:"Not played yet", isNew:true},
    {k:"pyramid", n:"Pyramid Reader", ic:"chart", d:"A population pyramid appears. Read its shape and name the demographic transition stage, from Stage 1 to Stage 5.", best:()=>S().best.pyramid!=null?`Best: ${S().best.pyramid}/8`:"Not played yet", isNew:true},
    {k:"sectsort", n:"Sector Sort", ic:"cards", d:"60 seconds. Sort each job into the primary, secondary, tertiary, quaternary or quinary sector. A mistake costs 3 seconds.", best:()=>S().best.sectsort!=null?`Best: ${S().best.sectsort} sorted`:"Not played yet", isNew:true}] : []),
  ...(CS.COURSE==="osu2200" ? [
    {k:"acctsort", n:"Account Sorter", ic:"cards", d:"60 seconds. An account appears; sort it as an asset, liability, equity, revenue or expense. A mistake costs 3 seconds.", best:()=>S().best.acctsort!=null?`Best: ${S().best.acctsort} sorted`:"Not played yet", isNew:true},
    {k:"entrybuild", n:"Entry Builder", ic:"calc", d:"A transaction appears. Pick the correct journal entry. Eight rounds, every answer explained.", best:()=>S().best.entrybuild!=null?`Best: ${S().best.entrybuild}/8`:"Not played yet", isNew:true}] : []),
  ...(CS.COURSE==="osu2300" ? [
    {k:"costsort", n:"Cost Sorter", ic:"cards", d:"60 seconds. A cost appears; sort it as direct materials, direct labor, overhead or a period cost. A mistake costs 3 seconds.", best:()=>S().best.costsort!=null?`Best: ${S().best.costsort} sorted`:"Not played yet", isNew:true},
    {k:"varcall", n:"Variance Call", ic:"calc", d:"A standard cost and an actual result appear. Pick the variance, favorable or unfavorable. Eight rounds.", best:()=>S().best.varcall!=null?`Best: ${S().best.varcall}/8`:"Not played yet", isNew:true}] : []),
  ...(CS.COURSE==="osu3220" ? [
    {k:"finsort", n:"Finance Sorter", ic:"cards", d:"60 seconds. A finance term or formula appears; sort it into ratios, time value, valuation, risk or capital budgeting. A mistake costs 3 seconds.", best:()=>S().best.finsort!=null?`Best: ${S().best.finsort} sorted`:"Not played yet", isNew:true},
    {k:"ratiorun", n:"Ratio Reader", ic:"calc", d:"Read a few numbers and compute the ratio or value. Eight rounds, every answer explained.", best:()=>S().best.ratiorun!=null?`Best: ${S().best.ratiorun}/8`:"Not played yet", isNew:true}] : []),
  ...(CS.COURSE==="osu2111" ? [
    {k:"fnsort", n:"Function Sort", ic:"cards", d:"60 seconds. A spreadsheet function appears; sort it into Logical, Lookup, Financial, Text, Date or Math and stats. A mistake costs 3 seconds.", best:()=>S().best.fnsort!=null?`Best: ${S().best.fnsort} sorted`:"Not played yet", isNew:true},
    {k:"fglab", n:"Formula Lab", ic:"calc", d:"A small sheet and a formula appear. Work out the result the cell will show. Eight rounds, with every answer explained.", best:()=>S().best.fglab!=null?`Best: ${S().best.fglab}/8`:"Not played yet", isNew:true}] : []),
  ...(CS.COURSE==="precalc" ? [
    {k:"famsort", n:"Function Family Sort", ic:"bolt", d:"60 seconds. Sort each clue, equation or real-world situation into its function family: linear, quadratic, exponential, logarithmic or sinusoidal. A mistake costs 3 seconds.", best:()=>S().best.famsort!=null?`Best: ${S().best.famsort} sorted`:"Not played yet", isNew:true},
    {k:"transform", n:"Transformation Match", ic:"chart", d:"A transformed function appears. Name what it does to the graph: shifts, stretches, reflections, new periods and moved asymptotes.", best:()=>S().best.transform!=null?`Best: ${S().best.transform}/8`:"Not played yet", isNew:true},
    {k:"ucircle", n:"Unit Circle Sprint", ic:"target", d:"60 seconds of exact values: sine, cosine, tangent and inverse trig at the special angles. Tap the right value; a mistake costs 3 seconds.", best:()=>S().best.ucircle!=null?`Best: ${S().best.ucircle} correct`:"Not played yet", isNew:true},
    {k:"logrules", n:"Log Rules", ic:"calc", d:"60 seconds. Evaluate logs and log expressions with the product, quotient and power rules. Tap the value; a mistake costs 3 seconds.", best:()=>S().best.logrules!=null?`Best: ${S().best.logrules} correct`:"Not played yet", isNew:true}] : []),
  ...(CS.COURSE==="aplit" ? [
    {k:"device", n:"Device Spotter", ic:"quill", d:"A line of poetry or prose appears. Name the literary device it uses: metaphor, apostrophe, enjambment, irony and more.", best:()=>S().best.device!=null?`Best: ${S().best.device}/8`:"Not played yet", isNew:true},
    {k:"form", n:"Name That Form", ic:"cards", d:"A clue describes a poem's form, a genre or a structure. Name it: sonnet, villanelle, ode, tragedy, frame story and more.", best:()=>S().best.form!=null?`Best: ${S().best.form}/8`:"Not played yet", isNew:true},
    {k:"pov", n:"Point of View Sort", ic:"bolt", d:"60 seconds. Sort each opening line by its narrator: first person, second person, third limited or third omniscient. A mistake costs 3 seconds.", best:()=>S().best.pov!=null?`Best: ${S().best.pov} sorted`:"Not played yet", isNew:true},
    {k:"tone", n:"Tone Check", ic:"spark", d:"60 seconds. Read a short passage and pick the word that best names its tone. Precise tone words earn essay points.", best:()=>S().best.tone!=null?`Best: ${S().best.tone} named`:"Not played yet", isNew:true}] : []),
  ...(CS.COURSE==="aplang" ? [
    {k:"appeal", n:"Appeal Sort", ic:"bolt", d:"60 seconds. Sort each line from a speech or essay by its main appeal: ethos, pathos, logos or kairos. A mistake costs 3 seconds.", best:()=>S().best.appeal!=null?`Best: ${S().best.appeal} sorted`:"Not played yet", isNew:true},
    {k:"fallacy", n:"Fallacy Finder", ic:"target", d:"A short argument hides a flaw in its reasoning. Name it: straw man, false dilemma, slippery slope, ad hominem and more.", best:()=>S().best.fallacy!=null?`Best: ${S().best.fallacy}/8`:"Not played yet", isNew:true},
    {k:"claimev", n:"Claim or Evidence?", ic:"cards", d:"60 seconds. Sort each sentence from an argument: claim, evidence, commentary or counterargument. The skill behind every body paragraph.", best:()=>S().best.claimev!=null?`Best: ${S().best.claimev} sorted`:"Not played yet", isNew:true},
    {k:"rhet", n:"Rhetoric Spotter", ic:"speech", d:"A sentence from a speech or essay appears. Name the rhetorical choice: anaphora, antithesis, concession, rhetorical question and more.", best:()=>S().best.rhet!=null?`Best: ${S().best.rhet}/8`:"Not played yet", isNew:true}] : []),
  {k:"sprint", n:"Sprint", ic:"bolt", d:"60 seconds of rapid-fire questions. Streaks multiply your points; misses cost 3 seconds.", best:()=>S().best.sprint!=null?`Best: ${S().best.sprint} pts`:"Not played yet"},
  {k:"chain", n:"Chain Reaction", ic:"link", d:CS.C.chainDesc || (((CS.COURSE==="micro"||CS.COURSE==="osu2001")||CS.COURSE==="osu2001")?"Put the cause-and-effect steps in order, from a market shock to the long-run outcome.":"Put the cause-and-effect steps in order, from the Fed's move to what happens to GDP."), best:()=>S().best.chainRounds!=null?`Best: ${S().best.chainRounds} perfect chains`:"Not played yet", isNew:true},
  {k:"tf", n:"True or False", ic:"tf", d:"45 seconds. Decide if each statement is true or false. Fast and brutal on misconceptions.", best:()=>S().best.tf!=null?`Best: ${S().best.tf} pts`:"Not played yet", isNew:true},
  ...(CS.DRILLS && CS.DRILLS.length ? [{k:"crunch", n:"Number Crunch", ic:"calc", d:CS.C.crunchDesc || (((CS.COURSE==="micro"||CS.COURSE==="osu2001")||CS.COURSE==="osu2001")?"Two minutes of calculations: elasticity, costs, profit, MRP, surplus. Type the number.":"Two minutes of calculations: multipliers, CPI, money creation, growth. Type the number."), best:()=>S().best.crunch!=null?`Best: ${S().best.crunch} correct`:"Not played yet", isNew:true}] : []),
  ...((CS.COURSE==="macro"||CS.COURSE==="osu2002") ? [{k:"fed", n:"Fed Chair", ic:"bank", d:"Run the economy for 8 quarters. Keep inflation near 2% and unemployment near 4.5%.", best:()=>S().best.fed!=null?`Best: ${S().best.fed}/100`:"Not played yet"}] : []),
  ...(((CS.COURSE==="micro"||CS.COURSE==="osu2001")||CS.COURSE==="osu2001") ? [
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
  ({acctsort, entrybuild, costsort, varcall, finsort, ratiorun, fnsort, fglab, daily, boss, shift, sprint, chain, tf, crunch, fed, match, profit, nash, cross, balance, crisis, elastic, sorter, periodic, mix, position, segs:segsniper, plc:plcladder, pricepick, promomix, timeline, source, court, branch, amend, studies, brainreg, dsort, bias, whichtest, shapes, sbias, plinko, deriv, tshot, graphd, integ, series, device, form, pov, tone, appeal, fallacy, claimev, rhet, models, diffsort, pyramid, sectsort, famsort, transform, ucircle, logrules})[active]($("#g-area"));
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
      ${CS.qText(q)}<div class="opts">${q.opts.map((o,j)=>`<button class="opt" data-j="${j}"><span class="k">${CS.L[j]}</span><span>${esc(o.t)}</span></button>`).join("")}</div><div id="dc-fb"></div>`;
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
  const BOSSES = CS.C.bosses || (((CS.COURSE==="micro"||CS.COURSE==="osu2001")||CS.COURSE==="osu2001") ? {1:"The Scarcity Specter",2:"The Elasticity Eel",3:"The Marginal Cost Golem",4:"The Monopoly Overlord",5:"The Wage Warden",6:"The Externality Ooze"}
    : {1:"The Opportunity Costumer",2:"The Index Inflator",3:"The Multiplier Monster",4:"The Reserve Wraith",5:"The Phillips Phantom",6:"The Currency Kraken"});
  if (!bossUnit) return choose();
  fight(bossUnit);
  function choose(){
    area.innerHTML = `<p style="max-width:62ch">Each unit has a boss with 100 HP. Correct answers deal 10 damage, and three in a row deal a critical 20. You have three hearts. Beat the boss to earn its badge and 150 XP.</p>
      <div class="units">${CS.UNITS.map(u=>`<button class="task" data-u="${u.id}">${CS.hasBossArt && CS.hasBossArt(CS.COURSE, u.id) ? `<span class="boss-mini ${S().bosses[u.id]?"done":""}">${CS.bossArt(CS.COURSE, u.id, "idle", {label: BOSSES[u.id]})}${S().bosses[u.id]?`<i>${I("check")}</i>`:""}</span>` : `<span class="g-ico" style="width:40px;height:40px;border-radius:10px;display:grid;place-items:center;background:${S().bosses[u.id]?"var(--good-bg)":"var(--accent-soft)"};color:${S().bosses[u.id]?"var(--good)":"var(--accent)"}">${I(S().bosses[u.id]?"check":"sword")}</span>`}<span class="stack" style="gap:2px"><h3>${esc(BOSSES[u.id])}</h3><span class="muted small">Unit ${u.id} · ${esc(u.short)}${S().bosses[u.id]?" · defeated":""}</span></span></button>`).join("")}</div>`;
    $$("[data-u]", area).forEach(b => b.onclick = () => { bossUnit = +b.dataset.u; fight(bossUnit); });
  }
  function fight(u){
    const unit = CS.UNITS[u-1], qs = CS.setOrder(CS.shuffle(CS.QS.filter(q=>q.u===u))).map(CS.prepQ);
    let hp = 100, hearts = 3, i = 0, combo = 0;
    const face = (mood) => `<svg viewBox="0 0 84 84" aria-hidden="true"><rect x="6" y="10" width="72" height="66" rx="20" fill="var(--accent)"/><path d="M14 14 L24 2 L30 14 M54 14 L60 2 L70 14" fill="var(--accent-2)"/><circle cx="30" cy="38" r="7" fill="#fff"/><circle cx="54" cy="38" r="7" fill="#fff"/><circle cx="${mood==="hurt"?28:31}" cy="39" r="3" fill="#111827"/><circle cx="${mood==="hurt"?52:55}" cy="39" r="3" fill="#111827"/><path d="${mood==="hurt"?"M28 60 Q42 52 56 60":"M28 56 Q42 64 56 56"}" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M22 28 L36 32 M62 28 L48 32" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/></svg>`;
    const art = st => CS.hasBossArt && CS.hasBossArt(CS.COURSE, u) ? CS.bossArt(CS.COURSE, u, st, {label: BOSSES[u]}) : face(st === "hurt" || st === "crit" || st === "defeat" ? "hurt" : "idle");
    draw("idle");
    function draw(mood, fb){
      if (hp <= 0) return win(); if (hearts <= 0 || i >= qs.length) return lose();
      const q = qs[i];
      area.innerHTML = `<div class="boss">${art(mood)}<div class="stack" style="gap:6px"><div class="spread"><b>${esc(BOSSES[u])}</b><span class="hearts">${[0,1,2].map(k=>`<span class="${k<hearts?"":"lost"}">${I("heart")}</span>`).join("")}</span></div><div class="hp"><i style="width:${hp}%"></i></div><span class="muted tiny">${hp} HP left · Unit ${u}: ${esc(unit.short)}${combo>=2?` · combo ${combo}`:""}</span></div></div>
        ${fb||""}${CS.qText(q)}<div class="opts">${q.opts.map((o,j)=>`<button class="opt" data-j="${j}"><span class="k">${CS.L[j]}</span><span>${esc(o.t)}</span></button>`).join("")}</div>`;
      const pick = j => { const ok = q.opts[j].ok; CS.record(q, ok); i++;
        if (ok) { combo++; const dmg = combo>=3 ? 20 : 10; hp = Math.max(0, hp-dmg); draw(dmg===20 ? "crit" : "hurt", `<div class="feedback good"><b>${dmg===20?"Critical hit! −20 HP.":"Hit! −10 HP."}</b> ${esc(q.opts[j].w)}</div>`); }
        else { combo = 0; hearts--; const c = q.opts.find(o=>o.ok); draw("attack", `<div class="feedback bad"><b>Ouch, you lost a heart.</b> Answer: ${esc(c.t)}. ${esc(c.w)}</div>`); } };
      $$(".opt", area).forEach(b => b.onclick = () => pick(+b.dataset.j));
      area._key = e => { if (["1","2","3","4","5"].includes(e.key)) pick(+e.key-1); };
    }
    function win(){ area._key = null; const first = !S().bosses[u]; S().bosses[u] = Date.now(); finish(first?150:60);
      area.innerHTML = `<div class="boss">${art("defeat")}<div><span class="eyebrow">Victory</span><h2>You defeated ${esc(BOSSES[u])}</h2></div></div><p class="muted">${first?"+150 XP and a boss badge.":"+60 XP for the rematch."} ${hearts} heart${hearts===1?"":"s"} left.</p>
        <div class="row-wrap"><button class="btn" id="b-next">Fight another boss</button><button class="btn ghost" data-go="home">Dashboard</button></div>`;
      $("#b-next").onclick = () => { bossUnit = null; choose(); }; }
    function lose(){ area._key = null; finish(15);
      area.innerHTML = `<div class="boss">${art("win")}<div><span class="eyebrow">Defeated</span><h2>${esc(BOSSES[u])} wins this round</h2></div></div><p class="muted">The boss had ${hp} HP left. Your misses are in the mistakes notebook. Review the Unit ${u} guide and try again.</p>
        <div class="row-wrap"><button class="btn" id="b-retry">Rematch</button><button class="btn ghost" data-go="learn" data-unit="${u}">Review Unit ${u}</button></div>`;
      $("#b-retry").onclick = () => fight(u); }
  }
}

/* ---------- Chain Reaction ---------- */
function chain(area){
  const ROUNDS = 3, set = CS.shuffle(CS.CHAINS).slice(0, ROUNDS);
  let r = 0, perfect = 0, totalMiss = 0;
  area.innerHTML = `<p style="max-width:62ch">Each round gives you the steps of ${CS.C.cat==="History"?"a chain of events":["Government","Social science","English"].includes(CS.C.cat)?"a process":"a chain reaction"}, scrambled. Tap them in the right order. Every wrong tap is a strike.</p><div><button class="btn lg" id="c-go">Start · ${ROUNDS} chains</button></div>`;
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
      <p class="muted small">Right = increase, left = decrease.${(CS.COURSE==="macro"||CS.COURSE==="osu2002")?" In Phillips-curve rounds, right also means up.":" For supply and cost curves, a shift left is the same as a shift up."}</p><div><button class="btn accent" id="s-go">Start · ${ROUNDS} rounds</button></div>`;
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
      <div class="row-wrap"><button class="btn" id="s-again">Play again</button><button class="btn ghost" data-go="learn" data-lab="${((CS.COURSE==="micro"||CS.COURSE==="osu2001")||CS.COURSE==="osu2001")?"sd":"adas"}">Open Graph Lab</button></div>`;
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
    const pool = CS.shuffle(CS.QS.filter(q => !q.p)).map(CS.prepQ); let qi = 0, score = 0, streak = 0, right = 0, total = 0, end = Date.now() + SECS*1000, over = false;
    const mult = () => Math.min(4, 1 + Math.floor(streak/3));
    show();
    every(() => { const left = (end - Date.now())/1000; const t = $("#r-time"), bar = $("#r-bar"); if (t) t.textContent = Math.max(0, Math.ceil(left)); if (bar) bar.style.width = Math.max(0,left/SECS*100)+"%"; if (left <= 0) stop(); }, 100);
    function show(){
      if (over) return; const q = pool[qi % pool.length];
      area.innerHTML = `<div class="hud"><span>Time <b id="r-time">${Math.ceil((end-Date.now())/1000)}</b>s</span><span>Score <b>${score}</b></span><span>Multiplier <b>×${mult()}</b></span><span>Streak <b>${streak}</b></span></div>
        <div class="timebar"><i id="r-bar" style="width:${(end-Date.now())/SECS/10}%"></i></div>
        ${CS.qText(q)}
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

/* ---------- Marketing (CLEP®) games, set 2: Segment Sniper, Lifecycle Ladder, Pricing Pick, Promo Mix Match ----------
   Two small engines: sortRun (60-second bucket sort, a miss costs 3 seconds) and pickRun (8 rounds, explain every answer). */
function sortRun(area, cfg){
  let time = 60, score = 0, miss = 0, timer = null, items = [];
  const keys = cfg.buckets.length;
  area.innerHTML = `<p style="max-width:62ch">${esc(cfg.intro)} Tap a button, or press 1 to ${keys}. A mistake costs 3 seconds.</p><div><button class="btn accent" id="sr-go">Start</button></div>`;
  $("#sr-go").onclick = start;
  function start(){ time = 60; score = 0; miss = 0; items = CS.shuffle(cfg.items.slice()); show(); clearInterval(timer); timer = every(() => { time--; const t = $("#sr-t"); if (t) t.textContent = Math.max(0, time); if (time <= 0) end(); }, 1000); }
  function show(msg){
    if (!items.length) items = CS.shuffle(cfg.items.slice());
    const it = items[0];
    area.innerHTML = `<div class="hud"><span>Time <b id="sr-t">${Math.max(0,time)}</b></span><span>Sorted <b>${score}</b></span><span>Misses <b>${miss}</b></span></div>
      <div class="so-card">${esc(it[0])}</div>
      <div class="mx-btns" style="grid-template-columns:repeat(${keys > 4 ? 3 : 2},minmax(0,1fr))">${cfg.buckets.map((n, i) => `<button class="btn big" data-b="${i}">${i+1} · ${esc(n)}</button>`).join("")}</div><div id="sr-fb" class="small" style="min-height:2.8em">${msg || ""}</div>`;
    $$(".mx-btns .btn", area).forEach(x => x.onclick = () => choose(+x.dataset.b));
    area._key = e => { const n = +e.key; if (n >= 1 && n <= keys) choose(n - 1); };
  }
  function choose(b){ if (time <= 0) return; const it = items.shift(), ok = b === it[1]; CS.record({u:cfg.unit}, ok, false);
    if (ok) { score++; show(); } else { miss++; time -= 3; if (time <= 0) return end(); show(`<span style="color:var(--bad)"><b>${esc(cfg.buckets[it[1]])}.</b></span> ${esc(it[2] || "")}`); } }
  function end(){
    clearInterval(timer); area._key = null; const nb = CS.setBest(cfg.k, score); finish(score*8);
    area.innerHTML = `<span class="eyebrow">${esc(cfg.name)} · results</span><div class="result-big">${score}</div><p class="muted">sorted, ${miss} missed${nb?" · new personal best":""}. ${esc(score >= 22 ? cfg.win : cfg.tip)}</p>
      <div class="row-wrap"><button class="btn" id="sr-again">Play again</button><button class="btn ghost" data-go="learn" data-unit="${cfg.unit}">Review Unit ${cfg.unit}</button></div>`;
    $("#sr-again").onclick = start;
  }
}
function pickRun(area, cfg){
  const ROUNDS = 8; let i = 0, right = 0, pool = [];
  area.innerHTML = `<p style="max-width:62ch">${esc(cfg.intro)} Eight rounds per game.</p><div><button class="btn accent" id="pr-go">Start · ${ROUNDS} rounds</button></div>`;
  $("#pr-go").onclick = () => { i = 0; right = 0; pool = CS.shuffle(cfg.items.slice()); round(); };
  function round(){
    if (i >= ROUNDS) return end();
    const it = pool[i], opts = cfg.options(it);
    area.innerHTML = `<div class="hud"><span>Round <b>${i+1}</b>/${ROUNDS}</span><span>Correct <b>${right}</b></span></div>${cfg.art ? cfg.art(it, null) : ""}<p class="qtext">${esc(it[0])}</p>
      <div class="opts">${opts.map((o, j) => `<button class="opt" data-j="${j}"><span class="k">${CS.L[j]}</span><span>${esc(o)}</span></button>`).join("")}</div><div id="pr-fb"></div>`;
    let done = false;
    const pick = j => { if (done) return; done = true; const ok = opts[j] === cfg.answer(it); CS.record({u:cfg.unit}, ok, false); if (ok) right++;
      $$(".opt", area).forEach((b, k) => { b.disabled = true; if (opts[k] === cfg.answer(it)) b.classList.add("right"); else if (k === j) b.classList.add("wrong"); });
      if (cfg.art) { const a = $(".pr-art", area); if (a) a.outerHTML = cfg.art(it, cfg.answer(it)); }
      $("#pr-fb").innerHTML = `<div class="feedback ${ok?"good":"bad"}"><b>${ok?"Correct.":`Answer: ${esc(cfg.answer(it))}.`}</b> ${esc(it[2])}</div><div style="margin-top:10px"><button class="btn" id="pr-next">${i+1<ROUNDS?"Next":"See results"}</button></div>`;
      $("#pr-next").onclick = () => { i++; round(); }; $("#pr-next").focus({preventScroll:true}); area._key = e => { if (e.key==="Enter") $("#pr-next").click(); }; };
    $$(".opt", area).forEach(b => b.onclick = () => pick(+b.dataset.j));
    area._key = e => { const n = +e.key; if (n >= 1 && n <= opts.length) pick(n - 1); };
  }
  function end(){
    area._key = null; const nb = CS.setBest(cfg.k, right); finish(right*12);
    area.innerHTML = `<span class="eyebrow">${esc(cfg.name)} · results</span><div class="result-big">${right}/${ROUNDS}</div><p class="muted">${nb?"New personal best. ":""}${esc(right >= 7 ? cfg.win : cfg.tip)}</p>
      <div class="row-wrap"><button class="btn" id="pr-again">Play again</button><button class="btn ghost" data-go="learn" data-unit="${cfg.unit}">Review Unit ${cfg.unit}</button></div>`;
    $("#pr-again").onclick = () => { i = 0; right = 0; pool = CS.shuffle(cfg.items.slice()); round(); };
  }
}

/* ACCTMIS 2200 / 2300 and BUSFIN 3220 games */
const ACCT_B = ["Asset","Liability","Equity","Revenue","Expense"];
const ACCT = [
 ["Cash",0,"Cash is an asset."],["Accounts receivable",0,"Money owed to the company is an asset."],["Inventory",0,"Goods held for sale are an asset."],["Equipment",0,"A long-term asset."],["Prepaid insurance",0,"Paid in advance, so an asset."],["Supplies",0,"Supplies on hand are an asset."],["Land",0,"A long-term asset that is not depreciated."],
 ["Accounts payable",1,"Money the company owes suppliers."],["Salaries payable",1,"Wages owed but not yet paid."],["Notes payable",1,"A debt the company owes."],["Unearned revenue",1,"The company owes goods or services."],["Bonds payable",1,"Long-term debt."],["Interest payable",1,"Interest owed but not yet paid."],
 ["Common stock",2,"Owners' invested capital."],["Retained earnings",2,"Accumulated profits kept in the business."],["Paid-in capital",2,"Owners' invested capital above par."],["Dividends",2,"A reduction of equity (contra equity)."],
 ["Service revenue",3,"Revenue earned from services."],["Sales revenue",3,"Revenue from selling goods."],["Interest revenue",3,"Revenue earned on investments."],["Rent revenue",3,"Revenue earned from renting property."],
 ["Rent expense",4,"The cost of using space."],["Salaries expense",4,"The cost of labor."],["Depreciation expense",4,"The allocated cost of assets used."],["Utilities expense",4,"The cost of services used."],["Advertising expense",4,"The cost of promotion."],["Cost of goods sold",4,"The cost of inventory sold."],["Interest expense",4,"The cost of borrowing."]
];
function acctsort(area){ sortRun(area, {k:"acctsort", name:"Account Sorter", unit:2, items:ACCT, buckets:ACCT_B,
  intro:"An account appears. Decide whether it is an asset, a liability, equity, a revenue or an expense.", win:"You know where every account lives.", tip:"Ask what it is: something owned (asset), owed (liability), owners' stake (equity), earned (revenue) or used up (expense)."}); }
const ENTRIES = [
 ["The owner invests $5,000 cash in the business.","Dr Cash; Cr Owner's Capital","Cash and equity both rise.",["Dr Owner's Capital; Cr Cash","Dr Cash; Cr Revenue","Dr Expense; Cr Cash"]],
 ["The company buys equipment for $2,000 on account.","Dr Equipment; Cr Accounts Payable","An asset and a liability both rise.",["Dr Equipment; Cr Cash","Dr Accounts Payable; Cr Equipment","Dr Expense; Cr Accounts Payable"]],
 ["The company performs $800 of services on account.","Dr Accounts Receivable; Cr Service Revenue","Revenue is earned before cash is received.",["Dr Cash; Cr Service Revenue","Dr Service Revenue; Cr Accounts Receivable","Dr Accounts Payable; Cr Revenue"]],
 ["The company pays $1,000 cash for rent.","Dr Rent Expense; Cr Cash","The expense rises and cash falls.",["Dr Cash; Cr Rent Expense","Dr Rent Payable; Cr Cash","Dr Rent Expense; Cr Revenue"]],
 ["A customer pays $300 on account.","Dr Cash; Cr Accounts Receivable","One asset replaces another.",["Dr Accounts Receivable; Cr Cash","Dr Cash; Cr Revenue","Dr Cash; Cr Accounts Payable"]],
 ["The company pays a $500 supplier bill (accounts payable).","Dr Accounts Payable; Cr Cash","The liability and cash both fall.",["Dr Cash; Cr Accounts Payable","Dr Expense; Cr Cash","Dr Accounts Receivable; Cr Cash"]],
 ["A customer pays $900 in advance for services to be done later.","Dr Cash; Cr Unearned Revenue","The company now owes services.",["Dr Cash; Cr Service Revenue","Dr Unearned Revenue; Cr Cash","Dr Accounts Receivable; Cr Unearned Revenue"]],
 ["At year-end, $2,000 of salaries are earned but unpaid.","Dr Salaries Expense; Cr Salaries Payable","An accrued expense and a liability.",["Dr Salaries Payable; Cr Salaries Expense","Dr Salaries Expense; Cr Cash","Dr Cash; Cr Salaries Payable"]],
 ["The company records $6,000 of depreciation.","Dr Depreciation Expense; Cr Accumulated Depreciation","The cost is allocated to expense.",["Dr Accumulated Depreciation; Cr Depreciation Expense","Dr Depreciation Expense; Cr Cash","Dr Equipment; Cr Depreciation Expense"]],
 ["The company declares and pays a $400 cash dividend.","Dr Dividends; Cr Cash","Dividends reduce equity.",["Dr Dividend Expense; Cr Cash","Dr Cash; Cr Dividends","Dr Retained Earnings; Cr Revenue"]],
 ["The company issues common stock for $10,000 cash.","Dr Cash; Cr Common Stock","Assets and equity rise.",["Dr Common Stock; Cr Cash","Dr Cash; Cr Bonds Payable","Dr Cash; Cr Revenue"]],
 ["The company borrows $8,000 from a bank.","Dr Cash; Cr Notes Payable","Cash rises and so does a liability.",["Dr Notes Payable; Cr Cash","Dr Cash; Cr Revenue","Dr Cash; Cr Common Stock"]]
];
function entrybuild(area){ pickRun(area, {k:"entrybuild", name:"Entry Builder", unit:2, items:ENTRIES,
  options:it => CS.shuffle([it[1]].concat(it[3])), answer:it => it[1],
  intro:"A transaction appears. Pick the journal entry that records it.", win:"Your entries balance.", tip:"Say what increases and what decreases, then use debit for assets and expenses and credit for liabilities, equity and revenue."}); }
const COST_B = ["Direct materials","Direct labor","Manufacturing overhead","Period cost"];
const COSTS = [
 ["Steel used to make a machine",0,"It becomes part of the product."],["Wood in a table",0,"Raw material in the product."],["Fabric in a shirt",0,"Raw material in the product."],["Computer chips in a laptop",0,"A part that becomes the product."],
 ["Wages of an assembly worker",1,"Labor that can be traced to the product."],["Pay of a machine operator making the product",1,"Traceable labor."],["Welder's pay on the line",1,"Traceable labor."],
 ["Factory rent",2,"A necessary factory cost not traceable to a unit."],["Factory supervisor's salary",2,"Indirect labor is overhead."],["Factory electricity",2,"Indirect factory cost."],["Depreciation on factory equipment",2,"An indirect factory cost."],["Machine lubricant",2,"An indirect material."],
 ["Sales commissions",3,"Selling costs are period costs."],["Advertising",3,"A selling cost."],["The CEO's salary",3,"An administrative cost."],["Headquarters office rent",3,"An administrative cost."],["Shipping to customers",3,"A selling cost."]
];
function costsort(area){ sortRun(area, {k:"costsort", name:"Cost Sorter", unit:1, items:COSTS, buckets:COST_B,
  intro:"A cost appears. Decide whether it is direct materials, direct labor, manufacturing overhead or a period cost.", win:"You classify costs like a controller.", tip:"Factory costs you can trace to the product are direct; other factory costs are overhead; selling and administrative costs are period costs."}); }
const VARS = [
 ["Standard price $5.00. Actual price $5.20 on 1,000 lbs. Materials price variance?","$200 unfavorable","(5.20 − 5.00) × 1,000, and the actual price is higher.",["$200 favorable","$260 unfavorable","$1,000 unfavorable"]],
 ["Standard price $4.00. Actual price $3.80 on 500 lbs. Materials price variance?","$100 favorable","(3.80 − 4.00) × 500, and the actual price is lower.",["$100 unfavorable","$200 favorable","$76 favorable"]],
 ["Standard quantity 950 lbs at $5. Actual 1,000 lbs. Quantity variance?","$250 unfavorable","(1,000 − 950) × 5, and more was used.",["$250 favorable","$50 unfavorable","$200 unfavorable"]],
 ["Standard quantity 400 lbs at $3. Actual 380 lbs. Quantity variance?","$60 favorable","(380 − 400) × 3, and less was used.",["$60 unfavorable","$20 favorable","$114 favorable"]],
 ["Standard labor rate $20. Actual $21 for 500 hours. Rate variance?","$500 unfavorable","(21 − 20) × 500, and the rate is higher.",["$500 favorable","$21 unfavorable","$420 unfavorable"]],
 ["Standard hours 480 at $20. Actual hours 500. Efficiency variance?","$400 unfavorable","(500 − 480) × 20, and more hours were used.",["$400 favorable","$20 unfavorable","$500 unfavorable"]],
 ["Standard hours 300 at $15. Actual hours 280. Efficiency variance?","$300 favorable","(280 − 300) × 15, and fewer hours were used.",["$300 unfavorable","$20 favorable","$280 favorable"]],
 ["Standard price $2.00. Actual price $2.10 on 2,000 units. Price variance?","$200 unfavorable","(2.10 − 2.00) × 2,000.",["$200 favorable","$210 unfavorable","$20 unfavorable"]]
];
function varcall(area){ pickRun(area, {k:"varcall", name:"Variance Call", unit:5, items:VARS,
  options:it => CS.shuffle([it[1]].concat(it[3])), answer:it => it[1],
  intro:"Read the standard and actual figures and pick the variance and its direction.", win:"You can call a variance fast.", tip:"Price: (actual price − standard price) × actual quantity. Quantity: (actual − standard quantity) × standard price. Positive means unfavorable."}); }
const FINB = ["Ratios","Time value","Valuation","Risk and return","Capital budgeting"];
const FINT = [
 ["Current ratio",0,"A liquidity ratio."],["Quick ratio",0,"A liquidity ratio."],["Times interest earned",0,"A coverage ratio."],["DuPont identity",0,"It breaks down ROE."],["Debt ratio",0,"A leverage ratio."],["Inventory turnover",0,"An efficiency ratio."],
 ["Future value",1,"Compounding forward."],["Annuity",1,"A stream of equal payments."],["Effective annual rate",1,"The true yearly rate."],["Rule of 72",1,"Estimates years to double."],["Perpetuity",1,"A payment that never ends."],
 ["Yield to maturity",2,"A bond's return if held to maturity."],["Constant growth model",2,"Values a stock from dividends."],["Coupon rate",2,"A bond's stated interest rate."],["Current yield",2,"Coupon divided by price."],["Preferred stock",2,"A fixed-dividend security."],
 ["Beta",3,"Sensitivity to the market."],["CAPM",3,"Links return to beta."],["Diversification",3,"Reduces unsystematic risk."],["Market risk premium",3,"The reward for bearing market risk."],["Standard deviation",3,"A measure of total risk."],
 ["Net present value",4,"Accept if positive."],["Internal rate of return",4,"The rate that makes NPV zero."],["WACC",4,"The usual discount rate."],["Payback period",4,"Years to recover the investment."],["Profitability index",4,"PV of inflows ÷ investment."],["Depreciation tax shield",4,"Depreciation × tax rate."]
];
function finsort(area){ sortRun(area, {k:"finsort", name:"Finance Sorter", unit:2, items:FINT, buckets:FINB,
  intro:"A finance term appears. Decide which topic it belongs to.", win:"You can place every finance idea.", tip:"Group by job: ratios read statements, time value moves money through time, valuation prices assets, risk and return links reward to risk, and capital budgeting picks projects."}); }
const RATIOS = [
 ["Current assets $200, current liabilities $100. Current ratio?","2.0","200 ÷ 100.",["0.5","100","1.0"]],
 ["Net income $60, equity $400. ROE?","15%","60 ÷ 400.",["6.7%","60%","1.5%"]],
 ["EBIT $120, interest $20. Times interest earned?","6.0","120 ÷ 20.",["0.17","100","12.0"]],
 ["Stock price $30, EPS $2. P/E?","15","30 ÷ 2.",["60","0.07","28"]],
 ["$1,000 at 5% for 3 years. Future value?","$1,157.63","1,000 × 1.05³.",["$1,150.00","$1,050.00","$1,215.51"]],
 ["Perpetuity of $50 a year at a 5% rate. Value?","$1,000","50 ÷ 0.05.",["$250","$2.50","$55"]],
 ["Next dividend $2, growth 4%, required return 10%. Stock price?","$33.33","2 ÷ (0.10 − 0.04).",["$20.00","$50.00","$14.29"]],
 ["Risk-free 3%, beta 1.2, market risk premium 6%. CAPM return?","10.2%","3 + 1.2 × 6.",["7.2%","9.0%","4.2%"]],
 ["Equity 60% at 12%, debt 40% at 8% pre-tax, tax rate 25%. WACC?","9.6%","0.6 × 12 + 0.4 × 8 × 0.75.",["10.4%","10.0%","8.0%"]],
 ["Days inventory 60, days receivables 40, days payables 30. Cash conversion cycle?","70 days","60 + 40 − 30.",["130 days","10 days","30 days"]]
];
function ratiorun(area){ pickRun(area, {k:"ratiorun", name:"Ratio Reader", unit:1, items:RATIOS,
  options:it => CS.shuffle([it[1]].concat(it[3])), answer:it => it[1],
  intro:"Read the numbers and compute the value.", win:"You calculate like an analyst.", tip:"Write the formula first, then plug in the numbers."}); }

/* CSE 2111: Function Sort (sortRun) and Formula Lab (pickRun) */
const FNSORT_B = ["Logical","Lookup","Financial","Text","Date","Math & stats"];
const FNSORT = [
 ["IF",0,"IF tests a condition and returns one of two results."],["AND",0,"AND is TRUE only if every test is true."],["OR",0,"OR is TRUE if any test is true."],["NOT",0,"NOT reverses TRUE and FALSE."],["IFERROR",0,"IFERROR replaces an error with another value, so it is a logical function."],["IFS",0,"IFS checks several conditions in order."],
 ["VLOOKUP",1,"VLOOKUP finds a value in the first column of a table."],["HLOOKUP",1,"HLOOKUP looks across the top row of a table."],["XLOOKUP",1,"XLOOKUP searches any column or row."],["INDEX",1,"INDEX returns the value at a position in a range."],["MATCH",1,"MATCH returns the position of a value in a range."],
 ["PMT",2,"PMT gives a loan payment."],["FV",2,"FV is a future value."],["PV",2,"PV is a present value."],["NPV",2,"NPV discounts cash flows."],["IRR",2,"IRR is the internal rate of return."],["RATE",2,"RATE finds the interest rate per period."],
 ["LEFT",3,"LEFT takes characters from the start of text."],["RIGHT",3,"RIGHT takes characters from the end of text."],["MID",3,"MID takes characters from the middle."],["LEN",3,"LEN counts characters."],["TRIM",3,"TRIM removes extra spaces."],["UPPER",3,"UPPER changes text to capitals."],["CONCAT",3,"CONCAT joins text."],
 ["TODAY",4,"TODAY returns the current date."],["NOW",4,"NOW returns the current date and time."],["EDATE",4,"EDATE adds months to a date."],["EOMONTH",4,"EOMONTH returns the last day of a month."],["YEAR",4,"YEAR extracts the year from a date."],["WEEKDAY",4,"WEEKDAY returns the day of the week."],
 ["SUM",5,"SUM adds numbers."],["AVERAGE",5,"AVERAGE finds the mean."],["ROUND",5,"ROUND sets the number of decimals."],["COUNTIF",5,"COUNTIF counts cells that meet a condition."],["SUMIF",5,"SUMIF adds cells that meet a condition."],["MAX",5,"MAX returns the largest value."],["MIN",5,"MIN returns the smallest value."],["COUNTA",5,"COUNTA counts non-empty cells."],["MEDIAN",5,"MEDIAN returns the middle value."]
];
function fnsort(area){ sortRun(area, {k:"fnsort", name:"Function Sort", unit:2, items:FNSORT, buckets:FNSORT_B,
  intro:"A spreadsheet function appears. Decide which family it belongs to.", win:"You know your way around the function library.", tip:"Group by job: Logical decides, Lookup finds, Financial values money over time, Text edits words, Date counts days and Math and stats summarize numbers."}); }
const FGLAB = [
 ["A1 = 4, A2 = 6, A3 = 10. What does =SUM(A1:A3)/COUNT(A1:A3) return?","6.67","The sum is 20 and there are 3 numbers: 20 ÷ 3 = 6.67.",["20","6","10"]],
 ["A1 = 5. What does =IF(A1>5,\"High\",\"Low\") return?","Low","5 is not greater than 5, so the false result appears.",["High","TRUE","5"]],
 ["A1 = 8, B1 = 3. What does =A1-B1*2 return?","2","Multiplication comes first: 3 × 2 = 6, then 8 − 6 = 2.",["10","5","16"]],
 ["A1 = 3. What does =A1^2+1 return?","10","3 squared is 9, then + 1.",["7","16","36"]],
 ["A1:A4 hold 2, 4, 6, 8. What does =COUNTIF(A1:A4,\">4\") return?","2","Only 6 and 8 are greater than 4.",["3","4","6"]],
 ["A1:A4 hold 2, 4, 6, 8 and B1:B4 hold 10, 20, 30, 40. What does =SUMIF(A1:A4,\">4\",B1:B4) return?","70","The rows with 6 and 8 match, so it adds 30 + 40.",["14","100","30"]],
 ["A1 = \"Ohio\". What does =LEFT(A1,2)&RIGHT(A1,1) return?","Oho","LEFT gives Oh, RIGHT gives o, and & joins them.",["Ohio","Oh","Ooo"]],
 ["A1 holds \"  Fisher  \" with two spaces on each side. What does =LEN(TRIM(A1)) return?","6","TRIM removes the extra spaces, leaving Fisher, which has 6 characters.",["10","8","4"]],
 ["A1 = 10, B1 = 0. What does =IFERROR(A1/B1,-1) return?","-1","Dividing by zero is an error, so IFERROR returns the second argument.",["#DIV/0!","0","10"]],
 ["A1 = TRUE, B1 = FALSE. What does =AND(A1,B1) return?","FALSE","AND needs every value to be TRUE.",["TRUE","1","#VALUE!"]],
 ["A1 = TRUE, B1 = FALSE. What does =OR(A1,B1) return?","TRUE","OR needs only one TRUE value.",["FALSE","#VALUE!","2"]],
 ["A2:C4 holds the rows 101 / Pens / 2, 102 / Ink / 5 and 103 / Pads / 3. What does =VLOOKUP(102,A2:C4,3,FALSE) return?","5","It finds 102 in column A and returns column 3 of that row.",["Ink","3","#N/A"]],
 ["Same table. What does =VLOOKUP(104,A2:C4,3,FALSE) return?","#N/A","104 is not in the first column, and an exact match was requested.",["0","3","#REF!"]],
 ["Same table. What does =VLOOKUP(103,A2:C4,2,FALSE) return?","Pads","Column 2 of the row for 103 holds Pads.",["3","103","Ink"]],
 ["Same table. What does =INDEX(B2:B4,MATCH(102,A2:A4,0)) return?","Ink","MATCH finds 102 in position 2, and INDEX returns the second value of B2:B4.",["2","5","Pens"]],
 ["About how much is =PMT(0.12/12,12,-1000)?","88.85","A 1% monthly rate over 12 months on 1,000 gives a payment of about 88.85.",["83.33","100.00","8.89"]],
 ["What does =FV(0.05,2,-100) return?","205","Two yearly deposits of 100 at 5%: 100 × 1.05 + 100 = 205.",["210.25","200","110.25"]],
 ["A1 = 2026-01-10 and B1 = 2026-02-10. What does =B1-A1 return?","31","Subtracting dates gives the number of days between them.",["1","30","32"]],
 ["What does =ROUND(7.46,1) return?","7.5","Rounded to one decimal place, 7.46 becomes 7.5.",["7.4","7","7.46"]],
 ["A1:A4 hold 2, 4, 6, 8. What does =MAX(A1:A4)-MIN(A1:A4) return?","6","8 − 2 = 6.",["8","2","20"]],
 ["A1 = 2 and B1 = 3. What does =A1&B1 return?","23","The & operator joins them as text.",["5","6","2 3"]],
 ["A1 = 50. What does =IF(AND(A1>=40,A1<=60),\"In range\",\"Out\") return?","In range","Both conditions are true for 50.",["Out","TRUE","50"]],
 ["C1 holds =A1*$B$1 with B1 = 3. It is copied to C3, where A3 = 5 and B3 = 100. What does C3 show?","15","C3 holds =A3*$B$1, which is 5 × 3. The $B$1 reference does not move.",["500","12","300"]],
 ["A1:A4 hold 2, 4, 6 and the word x. What does =AVERAGE(A1:A4) return?","4","AVERAGE ignores text: 12 ÷ 3 = 4.",["3","6","#VALUE!"]],
 ["A1:A4 hold 2, 4, 6 and the word x. What does =COUNTA(A1:A4) return?","4","COUNTA counts every non-empty cell, including text.",["3","12","0"]],
 ["What does =MID(\"Spreadsheet\",7,5) return?","sheet","Starting at character 7, it takes 5 characters.",["dshee","sprea","reads"]]
];
function fglab(area){ pickRun(area, {k:"fglab", name:"Formula Lab", unit:3, items:FGLAB,
  options:it => CS.shuffle([it[1]].concat(it[3])), answer:it => it[1],
  intro:"Read the sheet and the formula, then pick the value the cell will show.",
  win:"You read formulas like a spreadsheet does.", tip:"Evaluate from the inside out: references first, then operators in order, then the function."}); }

/* Segment Sniper: [scenario, bucket, why]. 0 geographic, 1 demographic, 2 psychographic, 3 behavioral */
const SEGS = [
 ["A snow-blower ad runs only in Minnesota and Maine",0,"Targeting by region and climate is geographic."],
 ["A burger chain adds spicy items only in its Texas stores",0,"Different offers by region are geographic segmentation."],
 ["A sunscreen brand spends most of its budget in coastal cities",0,"Location is the basis, so it is geographic."],
 ["A bank opens rural branches with farm-loan specialists",0,"Rural versus urban location is geographic."],
 ["A grocery chain stocks smaller packs in dense city stores",0,"City size and density are geographic bases."],
 ["A retirement community advertises to people over 60",1,"Age is a demographic base."],
 ["A razor brand designs a line for women",1,"Gender is demographic."],
 ["A luxury car targets households earning $250,000 or more",1,"Income is demographic."],
 ["A toy maker targets families with children under 5",1,"Family size and life stage are demographic."],
 ["A college savings plan targets parents with a bachelor's degree",1,"Education is a demographic base."],
 ["A magazine targets readers aged 18 to 24",1,"An age range is demographic."],
 ["A yoga studio targets people who value mindfulness and balance",2,"Values and lifestyle are psychographic."],
 ["A camping brand targets adventurous, outdoorsy people",2,"Personality and lifestyle are psychographic."],
 ["A brand targets status-seekers who love showing off new gadgets",2,"Status-seeking is a personality and lifestyle trait."],
 ["An electric car targets eco-minded buyers who want to cut their footprint",2,"Environmental values are psychographic."],
 ["A thrift app targets people whose hobby is hunting for vintage finds",2,"Interests and hobbies are psychographic."],
 ["A meal kit targets health-conscious foodies who love to cook",2,"Interests and attitudes are psychographic."],
 ["An airline rewards travelers who fly 50+ times a year",3,"Usage rate (heavy users) is behavioral."],
 ["A toothpaste is sold to people who want whiter teeth",3,"Benefits sought are a behavioral base."],
 ["A candy brand runs a big Halloween campaign",3,"The purchase occasion is behavioral."],
 ["A coffee chain sends offers to customers who haven't visited in 60 days",3,"Purchase behavior and loyalty status are behavioral."],
 ["A gym targets people who have never had a membership",3,"User status (nonusers) is behavioral."],
 ["A phone carrier offers deals to customers who often switch brands",3,"Loyalty status (switchers) is behavioral."],
 ["A florist targets Valentine's Day and Mother's Day shoppers",3,"Occasion segmentation is behavioral."],
 ["A shampoo brand targets buyers who want dandruff relief",3,"The benefit sought is the basis."],
 ["A streaming service targets people in the Pacific time zone with live sports times",0,"Time zone is a location factor."],
 ["A skincare line targets teens and people in their early twenties",1,"Age is demographic."],
 ["A watch brand targets thrill-seekers who skydive and climb",2,"Lifestyle and activities are psychographic."]
];
const PLC_ST = ["Introduction","Growth","Maturity","Decline"];
/* Lifecycle Ladder: [clue, stage index, why] */
const PLC = [
 ["Sales are low, few people know the product, and the firm is losing money on heavy promotion.",0,"Introduction: build awareness and trial; profits are usually negative."],
 ["The firm uses free samples and ads that explain what this new kind of product even does.",0,"Introduction: informative promotion builds primary demand."],
 ["Only a few stores carry it yet, and early buyers are mostly innovators.",0,"Introduction: limited distribution and innovator buyers."],
 ["There is only one brand on the market, and the price is high to recover research costs.",0,"Introduction: skimming prices and little competition are common."],
 ["Sales are climbing fast, and new competitors are rushing in with copycat versions.",1,"Growth: rapid sales growth attracts rivals."],
 ["Profits are rising, and the firm adds new models and more stores to keep up with demand.",1,"Growth: expand features and distribution while demand rises."],
 ["The early majority is starting to buy, and word of mouth is spreading quickly.",1,"Growth: adoption spreads from early adopters to the early majority."],
 ["Ads switch from explaining the product to saying why our brand is better than the new rivals.",1,"Growth: promotion shifts to building selective (brand) demand."],
 ["Sales have leveled off, and most people who want the product already own one.",2,"Maturity: the market is saturated and growth slows."],
 ["Competition is fierce, and brands fight with price cuts, coupons and small feature changes.",2,"Maturity: defend share through price, promotion and modification."],
 ["A cereal brand looks for new uses, such as baking recipes, to keep sales from slipping.",2,"Maturity: modify the market with new users or uses to extend the stage."],
 ["This is the longest stage, and weaker competitors are starting to drop out.",2,"Maturity: usually the longest stage, with a shakeout of weaker firms."],
 ["Reminder ads keep a well-known brand in mind among loyal buyers.",2,"Maturity: reminder advertising suits well-known products."],
 ["Sales and profits are falling as a newer technology replaces the product.",3,"Decline: substitutes pull buyers away."],
 ["The firm cuts promotion to almost zero and keeps selling to milk the remaining profit.",3,"Decline: harvesting reduces costs to collect remaining profit."],
 ["Several makers have dropped the product, and the rest sell to a small group of laggards.",3,"Decline: few firms and a shrinking, loyal base remain."],
 ["The company is deciding whether to discontinue the product or sell the brand to another firm.",3,"Decline: firms choose to maintain, harvest or drop the product."],
 ["Stores cut shelf space for DVD players as streaming takes over.",3,"Decline: distribution shrinks as sales fall."],
 ["The product reaches peak sales and the most competitors at the same time.",2,"Maturity: sales peak and competition is greatest."],
 ["Promotion spending as a share of sales is the highest it will ever be.",0,"Introduction: high spending on low sales."]
];
function plcArt(it, ans){
  const hi = ans == null ? -1 : PLC_ST.indexOf(ans), xs = [[10,70],[70,150],[150,240],[240,300]];
  return `<svg class="pr-art" viewBox="0 0 310 120" style="width:100%;max-width:420px;display:block" role="img" aria-label="Product life cycle curve">
    ${xs.map(([a,b],k) => `<rect x="${a}" y="8" width="${b-a}" height="92" fill="${k===hi?"var(--mint-soft)":"transparent"}" stroke="var(--rule)" stroke-dasharray="3 3"/>`).join("")}
    <path d="M10 98 C 40 97, 55 90, 70 80 S 120 30, 150 22 S 220 14, 240 24 S 285 70, 300 86" fill="none" stroke="var(--accent)" stroke-width="3"/>
    ${xs.map(([a,b],k) => `<text x="${(a+b)/2}" y="114" text-anchor="middle" font-size="10" font-weight="700" fill="${k===hi?"var(--good)":"var(--muted)"}">${PLC_ST[k]}</text>`).join("")}
    <text x="14" y="18" font-size="9" fill="var(--muted)">Sales</text></svg>`;
}
/* Pricing Pick: [scenario, strategy, why] */
const PRICES = [
 ["A new tablet launches at $1,099 for eager fans, then drops to $799 a year later.","Price skimming","Start high for buyers who will pay more, then lower the price over time."],
 ["A new meal-kit service starts at half the price of rivals to sign up customers fast.","Penetration pricing","A low launch price wins market share quickly."],
 ["A perfume is priced at $350 because a lower price would hurt its exclusive image.","Prestige pricing","High prices signal quality and status."],
 ["A store prices a lamp at $49.99 instead of $50.","Odd (psychological) pricing","Prices just under a round number seem lower."],
 ["A shop sells all of its sneakers at $60, $90 or $130.","Price lining","A few clear price points within a product line."],
 ["A game console is sold near cost, but the games for it carry high margins.","Captive-product pricing","The main product is cheap; the required add-ons earn the profit."],
 ["A cable company sells TV, internet and phone together for less than the three separately.","Bundle pricing","Combining products at one lower price."],
 ["A grocery store sells eggs below cost so shoppers come in and buy other things.","Loss-leader pricing","A below-cost item builds store traffic."],
 ["A giant retailer promises steady low prices instead of weekly sales.","Everyday low pricing (EDLP)","Consistently low prices with few promotions."],
 ["A department store keeps regular prices high but holds a big sale almost every weekend.","High-low pricing","High regular prices plus frequent discounts."],
 ["Hotel rates jump automatically when a big concert comes to town.","Dynamic pricing","Prices change in real time with demand."],
 ["A museum charges less for students and seniors.","Segmented pricing","Different prices for different customer groups."],
 ["A contractor adds 20% to the cost of materials and labor to set the price.","Cost-plus pricing","Price = cost + a markup."],
 ["A software firm prices its tool based on how much time it saves customers.","Value-based pricing","The price starts from the value buyers perceive."],
 ["A corner gas station charges whatever the station across the street charges.","Going-rate pricing","Pricing to match the market."],
 ["A phone plan charges a monthly fee plus a fee for each gigabyte over the limit.","Two-part pricing","A fixed fee plus a variable usage fee."],
 ["A freight seller charges every customer the same delivered price regardless of distance.","Uniform delivered pricing","One delivered price for all locations."],
 ["The buyer pays shipping from the factory, and title passes when the goods are loaded.","FOB origin pricing","The buyer takes title at the shipping point and pays freight."],
 ["A supplier gives 2% off if the invoice is paid within 10 days.","Cash discount","A discount for paying quickly."],
 ["A paper maker gives a lower unit price on orders of 1,000 boxes or more.","Quantity discount","Lower prices for buying more."],
 ["A swimsuit maker offers retailers a discount for ordering in November.","Seasonal discount","A discount for buying off-season."],
 ["A car dealer gives $3,000 credit for the buyer's old car toward a new one.","Trade-in allowance","Credit for an old item reduces the price of a new one."],
 ["A shopper mails in a form after buying a printer and gets $25 back.","Rebate","A partial refund after purchase."],
 ["A rideshare app charges a set fee to join its premium tier, then lower prices per ride.","Two-part pricing","A fixed fee plus a per-use charge."],
 ["A chain prices far below cost in one town until the local rival closes, then raises prices.","Predatory pricing (illegal)","Below-cost pricing meant to destroy competition."],
 ["An airline sells the last few seats on a flight for much more than the early seats.","Dynamic pricing","Prices respond to remaining capacity and demand."]
];
const PRICE_NAMES = [...new Set(PRICES.map(p => p[1]))];
/* Promo Mix Match: [move, bucket, why]. 0 advertising, 1 personal selling, 2 sales promotion, 3 public relations, 4 direct and digital */
const PROMO = [
 ["A 30-second TV spot during a playoff game",0,"Paid, nonpersonal mass media from a named sponsor is advertising."],
 ["A full-page ad in a fashion magazine",0,"Paid mass-media space is advertising."],
 ["A billboard on the interstate",0,"Out-of-home ads are advertising."],
 ["A radio jingle for a local car dealer",0,"Paid broadcast messages are advertising."],
 ["A sales rep demonstrates software to a company's IT team",1,"Face-to-face persuasion is personal selling."],
 ["A store clerk helps a customer choose a laptop",1,"Two-way, in-person selling is personal selling."],
 ["A rep handles a buyer's objections and closes a big order",1,"Handling objections and closing are steps of personal selling."],
 ["A sales team meets hospital buyers at their offices",1,"Direct, person-to-person selling."],
 ["A buy-one-get-one-free coupon",2,"Short-term incentives to buy now are sales promotion."],
 ["A $20 mail-in rebate",2,"Rebates are a consumer sales promotion."],
 ["Free samples handed out at a grocery store",2,"Sampling is sales promotion."],
 ["A sweepstakes to win a trip",2,"Contests and sweepstakes are sales promotion."],
 ["Slotting allowances paid to a supermarket",2,"Trade allowances are sales promotion aimed at resellers."],
 ["A booth at an industry trade show",2,"Trade shows are a form of trade promotion."],
 ["A punch card: buy nine, get the tenth free",2,"Loyalty rewards are sales promotion."],
 ["A press release about a new factory creating 500 jobs",3,"Press releases seek publicity, part of public relations."],
 ["Sponsoring a charity 5K run",3,"Sponsorships build goodwill, a public relations tool."],
 ["The CEO apologizes on the news after a recall",3,"Crisis communication is public relations."],
 ["A newspaper writes a story about the brand's founder",3,"Unpaid media coverage is publicity."],
 ["A company publishes an annual community-impact report",3,"Building goodwill with publics is PR."],
 ["A personalized email with a birthday offer",4,"Messages sent straight to one person and inviting a response are direct marketing."],
 ["A catalog mailed to past customers",4,"Direct mail is direct marketing."],
 ["A retargeting ad shown to a past site visitor",4,"Targeted digital ads to known individuals are direct and digital marketing."],
 ["A text message alert about a flash sale",4,"Mobile messages to opted-in customers are direct marketing."],
 ["An infomercial with a phone number to order now",4,"Direct-response TV asks for an immediate order."],
 ["A brand's Instagram post answering customer questions",4,"Interactive social media is digital marketing."],
 ["A telemarketing call offering a new plan",4,"Telemarketing is direct marketing."]
];
function segsniper(area){ sortRun(area, {k:"segs", name:"Segment Sniper", unit:5, items:SEGS, buckets:["Geographic","Demographic","Psychographic","Behavioral"],
  intro:"You have 60 seconds. Each scenario uses one segmentation base. Sniper rule: ask what the marketer is grouping buyers by.",
  win:"Sharp shooting. You can spot a segmentation base instantly.", tip:"Where they live is geographic, measurable traits are demographic, lifestyle and values are psychographic, and how they buy or use is behavioral."}); }
function plcladder(area){ pickRun(area, {k:"plc", name:"Lifecycle Ladder", unit:7, items:PLC, options:() => PLC_ST, answer:it => PLC_ST[it[1]], art:plcArt,
  intro:"Each clue describes a product's sales, profits, competitors or strategy. Climb the ladder: name its stage in the product life cycle.",
  win:"You read a product life cycle like a pro.", tip:"Introduction: low sales and losses. Growth: fast sales and new rivals. Maturity: flat sales and fierce competition. Decline: falling sales."}); }
function pricepick(area){ pickRun(area, {k:"pricepick", name:"Pricing Pick", unit:8, items:PRICES,
  options:it => CS.shuffle([it[1]].concat(CS.shuffle(PRICE_NAMES.filter(n => n !== it[1])).slice(0, 3))), answer:it => it[1],
  intro:"A pricing move appears. Pick the strategy or discount it uses.",
  win:"Pricing is the only P that brings in revenue, and you've got it down.", tip:"Ask what the price is trying to do: win share (penetration), signal status (prestige), cover cost (cost-plus), build traffic (loss leader) or follow demand (dynamic)."}); }
function promomix(area){ sortRun(area, {k:"promomix", name:"Promo Mix Match", unit:10, items:PROMO, buckets:["Advertising","Personal selling","Sales promotion","Public relations","Direct & digital"],
  intro:"You have 60 seconds. Sort each move into the right part of the promotion mix.",
  win:"Your integrated marketing communications are perfectly coordinated.", tip:"Paid mass media is advertising, face to face is personal selling, a short-term reason to buy now is sales promotion, goodwill and publicity are PR, and one-to-one messages asking for a response are direct marketing."}); }

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


/* ---------- English: three reusable game shapes, filled from each course's games.js data ----------
   spotGame: 8 rounds, a quote or scenario, pick its label (options from the same family).
   sortGame: 60 seconds, tap the right bucket; a miss costs 3 seconds.
   pickGame: 60 seconds, a short passage, pick the right word from four. */
function spotGame(area, c){
  const ROUNDS = 8; let i = 0, right = 0, pool = [];
  const all = () => window[c.data] || [];
  const go = () => { pool = CS.shuffle(all().slice()); i = 0; right = 0; round(); };
  area.innerHTML = `<p style="max-width:62ch">${c.intro}</p><div><button class="btn accent" id="sp-go">Start · ${ROUNDS} rounds</button></div>`;
  $("#sp-go").onclick = go;
  function round(){
    if (i >= ROUNDS) return end();
    const q = pool[i], labels = [...new Set(all().filter(x => x[1] !== q[1] && (x[4] == null || x[4] === q[4])).map(x => x[1]))];
    const opts = CS.shuffle([q[1]].concat(CS.shuffle(labels).slice(0, 3)));
    area.innerHTML = `<div class="hud"><span>Round <b>${i+1}</b>/${ROUNDS}</span><span>Correct <b>${right}</b></span></div><blockquote class="sm-quote">${esc(q[0])}</blockquote><p class="muted tiny">${c.ask}</p>
      <div class="sm-opts">${opts.map((o,k) => `<button class="btn ghost sm-o" data-o="${k}">${esc(o)}</button>`).join("")}</div><div id="sm-fb"></div>`;
    let done = false;
    $$(".sm-o", area).forEach(b => b.onclick = () => { if (done) return; done = true; const pick = opts[+b.dataset.o], ok = pick === q[1]; CS.record({u: q[3] || 1}, ok, false); if (ok) right++;
      $$(".sm-o", area).forEach(x => { x.disabled = true; if (opts[+x.dataset.o] === q[1]) x.classList.add("right"); else if (x === b) x.classList.add("wrong"); });
      $("#sm-fb").innerHTML = `<div class="feedback ${ok?"good":"bad"}"><b>${ok?"Correct.":"Not quite: "+esc(q[1])+"."}</b> ${esc(q[2])}</div><div style="margin-top:10px"><button class="btn" id="sm-next">${i+1<ROUNDS?"Next":"See results"}</button></div>`;
      $("#sm-next").onclick = () => { i++; round(); }; $("#sm-next").focus({preventScroll:true}); area._key = e => { if (e.key === "Enter") $("#sm-next").click(); }; });
    area._key = e => { if (/^[1-4]$/.test(e.key)) { const b = $$(".sm-o", area)[+e.key-1]; if (b) b.click(); } };
  }
  function end(){
    area._key = null; const nb = CS.setBest(c.k, right); finish(right*12);
    area.innerHTML = `<span class="eyebrow">${esc(c.n)} · results</span><div class="result-big">${right}/${ROUNDS}</div><p class="muted">${nb?"New personal best. ":""}${right>=7?c.win:c.tip}</p>
      <div class="row-wrap"><button class="btn" id="sp-again">Play again</button><button class="btn ghost" data-go="cards">Review flashcards</button></div>`;
    $("#sp-again").onclick = go;
  }
}
function sortGame(area, c){
  let time = 60, score = 0, miss = 0, timer = null, items = [];
  const all = () => window[c.data] || [];
  area.innerHTML = `<p style="max-width:62ch">${c.intro} Tap a button, or press 1 to ${c.names.length}. A mistake costs 3 seconds.</p><div><button class="btn accent" id="so-go">Start</button></div>`;
  $("#so-go").onclick = start;
  function start(){ time = 60; score = 0; miss = 0; items = CS.shuffle(all().slice()); show(); clearInterval(timer); timer = every(() => { time--; const t = $("#mx-t"); if (t) t.textContent = Math.max(0, time); if (time <= 0) end(); }, 1000); }
  function show(){
    if (!items.length) items = CS.shuffle(all().slice());
    const it = items[0];
    area.innerHTML = `<div class="hud"><span>Time <b id="mx-t">${Math.max(0,time)}</b></span><span>Sorted <b>${score}</b></span><span>Misses <b>${miss}</b></span></div>
      <div class="so-card">${esc(it[0])}</div>
      <div class="mx-btns">${c.names.map((n, i) => `<button class="btn big" data-b="${i}">${i+1} · ${esc(n)}</button>`).join("")}</div><div id="mx-fb" class="tiny muted" style="min-height:1.4em"></div>`;
    const choose = b => { if (time <= 0) return; const ok = b === it[1]; CS.record({u: it[3] || c.u || 1}, ok, false); items.shift();
      if (ok) score++; else { miss++; time -= 3; if (time <= 0) return end(); }
      show(); if (!ok) { const f = $("#mx-fb"); if (f) f.textContent = `Not quite: that one is ${c.names[it[1]].toLowerCase()}. ${it[2]}`; } };
    $$(".mx-btns .btn", area).forEach(x => x.onclick = () => choose(+x.dataset.b));
    area._key = e => { const n = +e.key; if (n >= 1 && n <= c.names.length) choose(n - 1); };
  }
  function end(){
    clearInterval(timer); area._key = null; const nb = CS.setBest(c.k, score); finish(score*8);
    area.innerHTML = `<span class="eyebrow">${esc(c.n)} · results</span><div class="result-big">${score}</div><p class="muted">sorted, ${miss} missed${nb?" · new personal best":""}. ${score>=16?c.win:c.tip}</p>
      <div class="row-wrap"><button class="btn" id="so-again">Play again</button><button class="btn ghost" data-go="cards">Review flashcards</button></div>`;
    $("#so-again").onclick = start;
  }
}
function pickGame(area, c){
  let time = 60, score = 0, miss = 0, timer = null, items = [];
  const all = () => window[c.data] || [];
  area.innerHTML = `<p style="max-width:62ch">${c.intro} Tap a button, or press 1 to 4. A mistake costs 3 seconds.</p><div><button class="btn accent" id="pk-go">Start</button></div>`;
  $("#pk-go").onclick = start;
  function start(){ time = 60; score = 0; miss = 0; items = CS.shuffle(all().slice()); show(); clearInterval(timer); timer = every(() => { time--; const t = $("#mx-t"); if (t) t.textContent = Math.max(0, time); if (time <= 0) end(); }, 1000); }
  function show(){
    if (!items.length) items = CS.shuffle(all().slice());
    const it = items[0], others = [...new Set(all().filter(x => x[1] !== it[1] && !(it[4] || []).includes(x[1])).map(x => x[1]))];
    const opts = CS.shuffle([it[1]].concat(CS.shuffle(others).slice(0, 3)));
    area.innerHTML = `<div class="hud"><span>Time <b id="mx-t">${Math.max(0,time)}</b></span><span>Correct <b>${score}</b></span><span>Misses <b>${miss}</b></span></div>
      <div class="so-card">${esc(it[0])}</div><p class="muted tiny">${c.ask}</p>
      <div class="mx-btns">${opts.map((o, i) => `<button class="btn big" data-b="${i}">${i+1} · ${esc(o)}</button>`).join("")}</div><div id="mx-fb" class="tiny muted" style="min-height:1.4em"></div>`;
    const choose = b => { if (time <= 0) return; const ok = opts[b] === it[1]; CS.record({u: it[3] || 1}, ok, false); items.shift();
      if (ok) score++; else { miss++; time -= 3; if (time <= 0) return end(); }
      show(); if (!ok) { const f = $("#mx-fb"); if (f) f.textContent = `Not quite: ${it[1]}. ${it[2]}`; } };
    $$(".mx-btns .btn", area).forEach(x => x.onclick = () => choose(+x.dataset.b));
    area._key = e => { if (/^[1-4]$/.test(e.key)) choose(+e.key - 1); };
  }
  function end(){
    clearInterval(timer); area._key = null; const nb = CS.setBest(c.k, score); finish(score*8);
    area.innerHTML = `<span class="eyebrow">${esc(c.n)} · results</span><div class="result-big">${score}</div><p class="muted">correct, ${miss} missed${nb?" · new personal best":""}. ${score>=14?c.win:c.tip}</p>
      <div class="row-wrap"><button class="btn" id="pk-again">Play again</button><button class="btn ghost" data-go="cards">Review flashcards</button></div>`;
    $("#pk-again").onclick = start;
  }
}
const device = a => spotGame(a, {k:"device", n:"Device Spotter", data:"CS_LIT_DEVICES", intro:"A line of poetry or prose appears. Name the literary device it uses. Eight lines per game.", ask:"Which device does this line use?", win:"Sharp eye. Now explain what each device does for the meaning; that's what earns essay points.", tip:"Learn the device, then ask what it does: a metaphor compares, an apostrophe addresses, enjambment carries a thought past the line break."});
const form = a => spotGame(a, {k:"form", n:"Name That Form", data:"CS_LIT_FORMS", intro:"A clue describes a poetic form, a genre or a story structure. Name it. Eight clues per game.", ask:"What is being described?", win:"You know your forms. Remember the exam asks how a form shapes meaning, not just its name.", tip:"Start with the counts: 14 lines is a sonnet, 19 lines with two refrains is a villanelle, 3 unrhymed lines is a haiku."});
const pov = a => sortGame(a, {k:"pov", n:"Point of View Sort", data:"CS_LIT_POV", u:2, names:["First person","Second person","Third limited","Third omniscient"], intro:"You have 60 seconds. Each line comes from a story. Decide who is telling it and how much the narrator knows.", win:"You can hear a narrator's voice fast.", tip:"Look for I and we (first), you (second), then ask whether the narrator knows one mind (limited) or many (omniscient)."});
const tone = a => pickGame(a, {k:"tone", n:"Tone Check", data:"CS_LIT_TONE", intro:"You have 60 seconds. Read each short passage and pick the word that best names its tone.", ask:"The tone is best described as:", win:"Your tone words are precise. Use them in your thesis.", tip:"Tone is the speaker's attitude. Look at word choice first: which words carry feeling, and is that feeling warm, bitter, amused or grave?"});
const appeal = a => sortGame(a, {k:"appeal", n:"Appeal Sort", data:"CS_LANG_APPEAL", u:1, names:["Ethos","Pathos","Logos","Kairos"], intro:"You have 60 seconds. Each line comes from a speech, letter or essay. Sort it by the appeal it leans on most.", win:"You can read an appeal at a glance. In an essay, go further: say why the writer chose it for this audience.", tip:"Ethos builds trust in the speaker, pathos stirs feeling, logos reasons with facts and logic, and kairos seizes the moment."});
const fallacy = a => spotGame(a, {k:"fallacy", n:"Fallacy Finder", data:"CS_LANG_FALLACY", intro:"Each round shows a short argument with a flaw in its reasoning. Name the fallacy. Eight arguments per game.", ask:"This argument commits:", win:"Nothing slips past you. Spotting weak reasoning is how you answer counterarguments.", tip:"Ask what the argument skips: a real choice (false dilemma), the real opponent (straw man), or the steps between cause and effect (slippery slope)."});
const claimev = a => sortGame(a, {k:"claimev", n:"Claim or Evidence?", data:"CS_LANG_CE", u:2, names:["Claim","Evidence","Commentary","Counterargument"], intro:"You have 60 seconds. Each sentence comes from an argument. Decide what job it does in the paragraph.", win:"You know how a paragraph is built. Most points on the essays come from commentary.", tip:"A claim is arguable, evidence is a fact, example or quotation, commentary explains how the evidence proves the claim, and a counterargument gives the other side."});
const rhet = a => spotGame(a, {k:"rhet", n:"Rhetoric Spotter", data:"CS_LANG_RHET", intro:"A sentence from a speech or essay appears. Name the rhetorical choice the writer makes. Eight sentences per game.", ask:"Which rhetorical choice is this?", win:"Strong ear for rhetoric. In an analysis, always add what the choice does for the purpose.", tip:"Look at the sentence's shape: repeated openings (anaphora), balanced opposites (antithesis), a question with no answer expected (rhetorical question)."});


/* ---------- Human Geography: Model Match, Diffusion Sort, Sector Sort, Pyramid Reader ---------- */
const models = a => spotGame(a, {k:"models", n:"Model Match", data:"CS_HUG_MODELS", intro:"A clue describes a geographic model or theory. Name it. Eight clues per game.", ask:"Which model or theory is this?", win:"You know your models. On the FRQs, also name a limitation of each one.", tip:"Sort models by unit first: population (DTM, Malthus, Ravenstein), cities (Burgess, Hoyt, rank-size), farming (von Thünen) and development (Rostow, Wallerstein, Weber)."});
const diffsort = a => sortGame(a, {k:"diffsort", n:"Diffusion Sort", data:"CS_HUG_DIFF", u:3, names:["Relocation","Contagious","Hierarchical","Stimulus"], intro:"You have 60 seconds. Each example shows a trait spreading. Decide which type of diffusion it is.", win:"You can name a diffusion type in a flash. Now explain the evidence, as the FRQs ask.", tip:"Did people move? Relocation. Did it spread to everyone nearby? Contagious. Did it start with big places or powerful people? Hierarchical. Did it change on the way? Stimulus."});
const sectsort = a => sortGame(a, {k:"sectsort", n:"Sector Sort", data:"CS_HUG_SECTOR", u:7, names:["Primary","Secondary","Tertiary","Quaternary","Quinary"], intro:"You have 60 seconds. Sort each job into its economic sector.", win:"Sector sorted. Remember: as countries develop, workers move from primary toward tertiary and beyond.", tip:"Primary takes from the earth, secondary makes things, tertiary serves people, quaternary handles information and quinary makes the top decisions."});
/* ---------- Precalculus: Function Family Sort, Transformation Match, Unit Circle Sprint, Log Rules ---------- */
const famsort = a => sortGame(a, {k:"famsort", n:"Function Family Sort", data:"CS_PC_FAMILY", u:1, names:["Linear","Quadratic","Exponential","Logarithmic","Sinusoidal"], intro:"You have 60 seconds. Each clue is a pattern, an equation or a real situation. Sort it into its function family.", win:"You can spot a function family fast. On the FRQs, also say why: constant differences, constant ratios or repeating values.", tip:"Constant differences: linear. Constant second differences: quadratic. Constant ratios: exponential. Slow growth with a vertical asymptote: logarithmic. Repeats: sinusoidal."});
const transform = a => spotGame(a, {k:"transform", n:"Transformation Match", data:"CS_PC_TRANSFORM", intro:"A transformed function appears. Name what it does to the graph. Eight functions per game.", ask:"What does this transformation do?", win:"Transformations mastered. Remember: changes inside the function act opposite to how they look.", tip:"Inside the parentheses works backward: f(x − 3) moves right and f(2x) squeezes. Outside works as you'd expect: f(x) + 3 moves up and 2f(x) stretches."});
const ucircle = a => pickGame(a, {k:"ucircle", n:"Unit Circle Sprint", data:"CS_PC_CIRCLE", intro:"You have 60 seconds. Each expression is a trig value at a special angle or an inverse trig value. Pick its exact value.", ask:"The exact value is:", win:"The unit circle is yours. That's a third of the exam made easier.", tip:"Learn quadrant I (1/2, √2/2, √3/2), then use reference angles and the signs: sine is positive in I and II, cosine in I and IV, tangent in I and III."});
const logrules = a => pickGame(a, {k:"logrules", n:"Log Rules", data:"CS_PC_LOGS", intro:"You have 60 seconds. Evaluate each logarithm or log expression.", ask:"The value is:", win:"Logs are just exponents, and you clearly know it.", tip:"Ask: what power of the base gives this number? Then use the rules: logs of products add, logs of quotients subtract, and powers come down in front."});
function pyramid(area){
  const ROUNDS = 8; let i = 0, right = 0, deck = [];
  /* bar widths (percent of population) for 5-year groups, youngest first, by DTM stage */
  const BASE = {
    1:[12,11.2,10.4,9.7,9,8.3,7.5,6.7,5.9,5,4.1,3.2,2.4,1.6,1,.5,.2],
    2:[17,15,13,11,9,8,7,5.5,4.5,3.6,2.8,2.2,1.6,1.1,.7,.4,.2],
    3:[10,10,9.5,9,8.5,8,7.5,7,6.5,6,5,4,3.2,2.4,1.6,1,.5],
    4:[6,6.2,6.4,6.6,6.8,7,7,7,6.9,6.8,6.5,6.2,5.6,4.8,3.8,2.8,2.4],
    5:[4,4.4,4.8,5.2,5.6,6,6.4,6.8,7.2,7.4,7.4,7.2,6.8,6,5,4,3.6]};
  const WHY = {1:"Wide base and a steep, narrow top: high births and high deaths, so few people live to old age.",
    2:"A very wide base that narrows fast: births stay high while deaths fall, so the population is young and booming.",
    3:"The base is starting to narrow: births are falling, and more people survive to middle age.",
    4:"Nearly a column: low births and low deaths keep each age group about the same size.",
    5:"Narrower at the base than in the middle: births are below replacement and the population is aging and shrinking."};
  const EX = {1:"no country today (some remote groups)",2:"Niger or Mali",3:"India or Mexico",4:"the United States or France",5:"Japan, Italy or South Korea"};
  const svg = st => { const b = BASE[st].map(v => v * (0.9 + Math.random()*0.2)), mx = Math.max(...b), H = 10;
    return `<svg viewBox="0 0 320 ${b.length*H+30}" class="biofig" role="img" aria-label="Population pyramid"><title>Population pyramid</title>
      <line x1="160" y1="6" x2="160" y2="${b.length*H+8}" stroke="var(--ink)" stroke-width="1"/>
      ${b.map((v,k)=>{ const w = v/mx*130, y = (b.length-1-k)*H+8, wf = w*(0.96 + Math.random()*0.06);
        return `<rect x="${160-w}" y="${y}" width="${w}" height="${H-1.5}" fill="#60A5FA"/><rect x="160" y="${y}" width="${wf}" height="${H-1.5}" fill="#F472B6"/>`; }).join("")}
      <text x="80" y="${b.length*H+24}" font-size="10" text-anchor="middle" fill="var(--muted)">Male</text><text x="240" y="${b.length*H+24}" font-size="10" text-anchor="middle" fill="var(--muted)">Female</text>
      <text x="6" y="${b.length*H+4}" font-size="9" fill="var(--muted)">0–4</text><text x="6" y="14" font-size="9" fill="var(--muted)">80+</text></svg>`; };
  const go = () => { deck = CS.shuffle([1,2,3,4,5,1,2,3,4,5].slice(1)).concat([CS.shuffle([2,3,4,5])[0]]).slice(0, ROUNDS); i = 0; right = 0; round(); };
  area.innerHTML = `<p style="max-width:62ch">A population pyramid appears. Read the shape of its base, middle and top, then pick the stage of the demographic transition model it shows. Eight pyramids per game.</p><div><button class="btn accent" id="py-go">Start · ${ROUNDS} pyramids</button></div>`;
  $("#py-go").onclick = go;
  function round(){
    if (i >= ROUNDS) return end();
    const st = deck[i];
    area.innerHTML = `<div class="hud"><span>Pyramid <b>${i+1}</b>/${ROUNDS}</span><span>Correct <b>${right}</b></span></div>
      <div style="max-width:420px">${svg(st)}</div><p class="muted tiny">Which DTM stage does this pyramid show?</p>
      <div class="sm-opts py-opts">${[1,2,3,4,5].map(n=>`<button class="btn ghost sm-o" data-o="${n}"><small>Stage</small> ${n}</button>`).join("")}</div><div id="sm-fb"></div>`;
    let done = false;
    $$(".sm-o", area).forEach(b => b.onclick = () => { if (done) return; done = true; const pick = +b.dataset.o, ok = pick === st; CS.record({u:2}, ok, false); if (ok) right++;
      $$(".sm-o", area).forEach(x => { x.disabled = true; if (+x.dataset.o === st) x.classList.add("right"); else if (x === b) x.classList.add("wrong"); });
      $("#sm-fb").innerHTML = `<div class="feedback ${ok?"good":"bad"}"><b>${ok?"Correct.":"Not quite: this is Stage "+st+"."}</b> ${WHY[st]} Example: ${EX[st]}.</div><div style="margin-top:10px"><button class="btn" id="sm-next">${i+1<ROUNDS?"Next":"See results"}</button></div>`;
      $("#sm-next").onclick = () => { i++; round(); }; $("#sm-next").focus({preventScroll:true}); area._key = e => { if (e.key === "Enter") $("#sm-next").click(); }; });
    area._key = e => { if (/^[1-5]$/.test(e.key)) { const b = $$(".sm-o", area)[+e.key-1]; if (b) b.click(); } };
  }
  function end(){
    area._key = null; const nb = CS.setBest("pyramid", right); finish(right*12);
    area.innerHTML = `<span class="eyebrow">Pyramid Reader · results</span><div class="result-big">${right}/${ROUNDS}</div><p class="muted">${nb?"New personal best. ":""}${right>=7?"You read pyramids like a demographer. On the exam, connect the shape to birth rates, death rates and policy.":"Look at the base first: wide means high births (Stages 1 and 2), narrowing means falling births (Stage 3), a column means Stage 4 and a narrow base means Stage 5."}</p>
      <div class="row-wrap"><button class="btn" id="py-again">Play again</button><button class="btn ghost" data-go="learn">Review Unit 2</button></div>`;
    $("#py-again").onclick = go;
  }
}

/* ---------- Calculus: Derivative Dash, Integral Sprint, Graph Detective, Tangent Shot, Series Court ---------- */
/* 60-second game where each item brings its own tempting wrong answers: [prompt, answer, why, unit, [w1, w2, w3]] */
function ownPick(area, c){
  let time = 60, score = 0, miss = 0, timer = null, items = [];
  const all = () => window[c.data] || [];
  area.innerHTML = `<p style="max-width:62ch">${c.intro} Tap a button, or press 1 to 4. A mistake costs 3 seconds.</p><div><button class="btn accent" id="op-go">Start</button></div>`;
  $("#op-go").onclick = start;
  function start(){ time = 60; score = 0; miss = 0; items = CS.shuffle(all().slice()); show(); clearInterval(timer); timer = every(() => { time--; const t = $("#mx-t"); if (t) t.textContent = Math.max(0, time); if (time <= 0) end(); }, 1000); }
  function show(){
    if (!items.length) items = CS.shuffle(all().slice());
    const it = items[0], opts = CS.shuffle([it[1]].concat((it[4] || []).slice(0, 3)));
    area.innerHTML = `<div class="hud"><span>Time <b id="mx-t">${Math.max(0,time)}</b></span><span>Correct <b>${score}</b></span><span>Misses <b>${miss}</b></span></div>
      <div class="so-card">${esc(it[0])}</div><p class="muted tiny">${c.ask}</p>
      <div class="mx-btns">${opts.map((o, i) => `<button class="btn big" data-b="${i}">${i+1} · ${esc(o)}</button>`).join("")}</div><div id="mx-fb" class="tiny muted" style="min-height:1.4em"></div>`;
    const choose = b => { if (time <= 0) return; const ok = opts[b] === it[1]; CS.record({u: it[3] || 1}, ok, false); items.shift();
      if (ok) score++; else { miss++; time -= 3; if (time <= 0) return end(); }
      show(); if (!ok) { const f = $("#mx-fb"); if (f) f.textContent = `Not quite: ${it[0]} → ${it[1]}. ${it[2]}`; } };
    $$(".mx-btns .btn", area).forEach(x => x.onclick = () => choose(+x.dataset.b));
    area._key = e => { if (/^[1-4]$/.test(e.key)) choose(+e.key - 1); };
  }
  function end(){
    clearInterval(timer); area._key = null; const nb = CS.setBest(c.k, score); finish(score*8);
    area.innerHTML = `<span class="eyebrow">${esc(c.n)} · results</span><div class="result-big">${score}</div><p class="muted">correct, ${miss} missed${nb?" · new personal best":""}. ${score>=14?c.win:c.tip}</p>
      <div class="row-wrap"><button class="btn" id="op-again">Play again</button><button class="btn ghost" data-go="practice">Practice ${esc(c.more)}</button></div>`;
    $("#op-again").onclick = start;
  }
}
const deriv = a => ownPick(a, {k:"deriv", n:"Derivative Dash", data:"CS_CALC_DD", ask:"Which is f′(x)?", more:"derivatives", intro:"You have 60 seconds. A function appears; tap its derivative.", win:"Fast and accurate. Now try the chain rule drills for multi-step functions.", tip:"Name the rule first: power, product, quotient or chain. Then remember the inside derivative."});
const integ = a => ownPick(a, {k:"integ", n:"Integral Sprint", data:"CS_CALC_INT", ask:"Which is the antiderivative?", more:"integrals", intro:"You have 60 seconds. An integral appears; tap its antiderivative.", win:"Your antiderivatives are automatic. Check each one by differentiating it in your head.", tip:"Check an answer by differentiating it: you should get the integrand back. For u-substitution, divide by the inside derivative."});
const graphd = a => spotGame(a, {k:"graphd", n:"Graph Detective", data:"CS_CALC_GRAPH", intro:"A clue describes f′ or f″, or the graph of f′. Decide what it tells you about f. Eight clues per game.", ask:"This tells you that:", win:"You read derivative graphs like an AP reader. Use the same language in your justifications.", tip:"Sign of f′: increasing or decreasing. Sign change of f′: extremum. Sign of f″ (or f′ rising or falling): concavity. Sign change of f″: inflection point."});
const series = a => sortGame(a, {k:"series", n:"Series Court", data:"CS_CALC_SERIES", u:10, names:["Converges absolutely","Converges conditionally","Diverges"], intro:"You have 60 seconds. Each series takes the stand. Decide the verdict.", win:"A fair and fast judge. Name the test that proves each verdict, as you must on the exam.", tip:"Start with the nth-term test, then look for geometric or p-series, then alternating, then the ratio test for factorials and exponentials."});
function tshot(area){
  const ROUNDS = 8; let i = 0, right = 0;
  const FN = [
    {t:"f(x) = x²", f:x=>x*x, d:x=>2*x, xs:[-1.5,-1,1,1.5], u:2},
    {t:"f(x) = x³ − 3x", f:x=>x*x*x-3*x, d:x=>3*x*x-3, xs:[-1.6,0,0.6,1.6], u:2},
    {t:"f(x) = sin x", f:Math.sin, d:Math.cos, xs:[0,0.8,2.2,-1], u:2},
    {t:"f(x) = eˣ", f:Math.exp, d:Math.exp, xs:[-1,0,0.5,-2], u:2},
    {t:"f(x) = √x", f:Math.sqrt, d:x=>0.5/Math.sqrt(x), xs:[0.5,1,2,3], u:2},
    {t:"f(x) = ln x", f:Math.log, d:x=>1/x, xs:[0.5,1,2,3], u:3},
    {t:"f(x) = 4 − x²", f:x=>4-x*x, d:x=>-2*x, xs:[-1,0.5,1,1.5], u:2},
    {t:"f(x) = cos x", f:Math.cos, d:x=>-Math.sin(x), xs:[0.6,1.6,-1,2.4], u:2}
  ];
  const r2 = x => String(Math.round(x*100)/100).replace("-", "−");
  area.innerHTML = `<p style="max-width:62ch">A curve and a point appear. Four lines pass through the point; only one is tangent to the curve there. Pick it by eye or by computing f′. Eight shots per game.</p><div><button class="btn accent" id="ts-go">Start · ${ROUNDS} shots</button></div>`;
  $("#ts-go").onclick = () => { i = 0; right = 0; round(); };
  function round(){
    if (i >= ROUNDS) return end();
    const F = FN[Math.floor(Math.random()*FN.length)], x0 = F.xs[Math.floor(Math.random()*F.xs.length)], y0 = F.f(x0), m = F.d(x0);
    const span = 2.4, X0 = x0 - span, X1 = x0 + span;
    const offs = CS.shuffle([m + 1.2, m - 1.1, m + 2.6, m - 2.4, m === 0 ? 1.5 : m*2.2 + 0.4, m === 0 ? -1.5 : -m]).filter(s => Math.abs(s - m) > 0.45).slice(0, 3);
    const slopes = CS.shuffle([m].concat(offs)), cols = ["#DC2626","#2563EB","#16A34A","#B45309"], L = ["A","B","C","D"];
    const ys = []; for (let k = 0; k <= 80; k++) { const x = X0 + (X1 - X0)*k/80, y = F.f(x); if (isFinite(y)) ys.push(y); }
    const half = s => Math.min(1.6, 2.6/Math.max(0.01, Math.abs(s)));
    slopes.forEach(s => ys.push(y0 + half(s)*s, y0 - half(s)*s));
    const lo = Math.max(Math.min(...ys), y0 - 4), hi = Math.min(Math.max(...ys), y0 + 4), pad = (hi - lo)*0.1 + 0.2;
    const Y0 = lo - pad, Y1 = hi + pad, W = 300, H = 230, px = x => 20 + (x - X0)/(X1 - X0)*(W - 48), py = y => H - 14 - (y - Y0)/(Y1 - Y0)*(H - 28);
    let path = ""; for (let k = 0; k <= 120; k++) { const x = X0 + (X1 - X0)*k/120, y = F.f(x); if (!isFinite(y)) continue; path += (path ? " L" : "M") + px(x).toFixed(1) + " " + Math.max(-20, Math.min(H + 20, py(y))).toFixed(1); }
    const line = (s, c, j) => { const xa = x0 - half(s), xb = x0 + half(s); return `<g><line x1="${px(xa)}" y1="${py(y0 + s*(xa - x0))}" x2="${px(xb)}" y2="${py(y0 + s*(xb - x0))}" stroke="${c}" stroke-width="2.6" stroke-linecap="round"/><text x="${px(xb) + 4}" y="${py(y0 + s*(xb - x0)) + 4}" font-size="13" font-weight="800" fill="${c}">${L[j]}</text></g>`; };
    const svg = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:460px;background:var(--surface,#fff);border-radius:14px" role="img" aria-label="${esc(F.t)} with four candidate lines"><defs><clipPath id="ts-c"><rect x="0" y="0" width="${W}" height="${H}"/></clipPath></defs><g clip-path="url(#ts-c)">
      ${(Y0 < 0 && Y1 > 0) ? `<line x1="10" y1="${py(0)}" x2="${W-10}" y2="${py(0)}" stroke="var(--line,#CBD5E1)"/>` : ""}${(X0 < 0 && X1 > 0) ? `<line x1="${px(0)}" y1="10" x2="${px(0)}" y2="${H-10}" stroke="var(--line,#CBD5E1)"/>` : ""}
      <path d="${path}" fill="none" stroke="var(--ink,#1F2430)" stroke-width="3.2"/>${slopes.map((s, j) => line(s, cols[j], j)).join("")}<circle cx="${px(x0)}" cy="${py(y0)}" r="5.5" fill="#FDE047" stroke="#1F2430" stroke-width="2"/></g></svg>`;
    area.innerHTML = `<div class="hud"><span>Shot <b>${i+1}</b>/${ROUNDS}</span><span>Hits <b>${right}</b></span></div><p><b>${esc(F.t)}</b> at x = ${r2(x0)}. Which line is tangent to the curve?</p><div style="display:grid;place-items:center">${svg}</div>
      <div class="sm-opts">${slopes.map((s, j) => `<button class="btn ghost sm-o" data-o="${j}" style="border-color:${cols[j]}">${L[j]}</button>`).join("")}</div><div id="sm-fb"></div>`;
    let done = false;
    $$(".sm-o", area).forEach(b => b.onclick = () => { if (done) return; done = true; const j = +b.dataset.o, ok = slopes[j] === m; CS.record({u: F.u}, ok, false); if (ok) right++;
      $$(".sm-o", area).forEach(x => { x.disabled = true; if (slopes[+x.dataset.o] === m) x.classList.add("right"); else if (x === b) x.classList.add("wrong"); });
      $("#sm-fb").innerHTML = `<div class="feedback ${ok?"good":"bad"}"><b>${ok?"Hit!":"Missed: it was line "+L[slopes.indexOf(m)]+"."}</b> The tangent slope is f′(${r2(x0)}) = ${r2(m)}. ${ok?"":"Line "+L[j]+" has slope "+r2(slopes[j])+"."}</div><div style="margin-top:10px"><button class="btn" id="sm-next">${i+1<ROUNDS?"Next shot":"See results"}</button></div>`;
      $("#sm-next").onclick = () => { i++; round(); }; $("#sm-next").focus({preventScroll:true}); area._key = e => { if (e.key === "Enter") $("#sm-next").click(); }; });
    area._key = e => { const k = "abcd".indexOf(String(e.key).toLowerCase()); if (k >= 0) { const b = $$(".sm-o", area)[k]; if (b) b.click(); } };
  }
  function end(){
    area._key = null; const nb = CS.setBest("tshot", right); finish(right*12);
    area.innerHTML = `<span class="eyebrow">Tangent Shot · results</span><div class="result-big">${right}/${ROUNDS}</div><p class="muted">${nb?"New personal best. ":""}${right>=7?"Sharpshooter. You can see a derivative.":"The tangent line hugs the curve at the point and matches its steepness there; it should not cut across the curve nearby (except at an inflection point)."}</p>
      <div class="row-wrap"><button class="btn" id="ts-again">Play again</button><button class="btn ghost" data-go="learn" data-unit="2">Review Unit 2</button></div>`;
    $("#ts-again").onclick = () => { i = 0; right = 0; round(); };
  }
}

/* ---------- Statistics: Which Test?, Shape Match, Bias Spotter, Probability Plinko ---------- */
function whichtest(area){
  const ROUNDS = 8; let i = 0, right = 0, pool = [];
  const all = () => window.CS_STAT_TESTS || [];
  area.innerHTML = `<p style="max-width:62ch">A study scenario appears. Choose the inference procedure that fits: the number of samples, whether the data are categorical or quantitative, and whether the groups are independent or paired. Eight scenarios per game.</p><div><button class="btn accent" id="wt-go">Start · ${ROUNDS} scenarios</button></div>`;
  $("#wt-go").onclick = () => { pool = CS.shuffle(all().slice()); i = 0; right = 0; round(); };
  function round(){
    if (i >= ROUNDS) return end();
    const q = pool[i], names = [...new Set(all().map(c => c[1]))].filter(n => n !== q[1]), opts = CS.shuffle([q[1]].concat(CS.shuffle(names).slice(0,3)));
    area.innerHTML = `<div class="hud"><span>Scenario <b>${i+1}</b>/${ROUNDS}</span><span>Correct <b>${right}</b></span></div><blockquote class="sm-quote">${esc(q[0])}</blockquote><p class="muted tiny">Which procedure should be used?</p>
      <div class="sm-opts">${opts.map((o,k) => `<button class="btn ghost sm-o" data-o="${k}">${esc(o)}</button>`).join("")}</div><div id="sm-fb"></div>`;
    let done = false;
    $$(".sm-o", area).forEach(b => b.onclick = () => { if (done) return; done = true; const pick = opts[+b.dataset.o], ok = pick === q[1]; CS.record({u: q[3]}, ok, false); if (ok) right++;
      $$(".sm-o", area).forEach(x => { x.disabled = true; if (opts[+x.dataset.o] === q[1]) x.classList.add("right"); else if (x === b) x.classList.add("wrong"); });
      $("#sm-fb").innerHTML = `<div class="feedback ${ok?"good":"bad"}"><b>${ok?"Correct.":"Not quite: "+esc(q[1])+"."}</b> ${esc(q[2])}</div><div style="margin-top:10px"><button class="btn" id="sm-next">${i+1<ROUNDS?"Next scenario":"See results"}</button></div>`;
      $("#sm-next").onclick = () => { i++; round(); }; $("#sm-next").focus({preventScroll:true}); area._key = e => { if (e.key === "Enter") $("#sm-next").click(); }; });
  }
  function end(){
    area._key = null; const nb = CS.setBest("whichtest", right); finish(right*12);
    area.innerHTML = `<span class="eyebrow">Which Test? · results</span><div class="result-big">${right}/${ROUNDS}</div><p class="muted">${nb?"New personal best. ":""}${right>=7?"You can pick the procedure every time.":"Ask three questions: categorical or quantitative? One sample, two samples or paired? Proportion, mean, counts or slope?"}</p>
      <div class="row-wrap"><button class="btn" id="wt-again">Play again</button><button class="btn ghost" data-go="frq">Try an Inference FRQ</button></div>`;
    $("#wt-again").onclick = () => { i = 0; right = 0; pool = CS.shuffle(all().slice()); round(); };
  }
}
function shapes(area){
  let time = 60, score = 0, miss = 0, timer = null, items = [];
  const all = () => window.CS_STAT_SHAPES || [];
  area.innerHTML = `<p style="max-width:62ch">You have 60 seconds. A clue describes a distribution or a scatterplot; pick the term that fits. Tap a button, or press 1 to 4. A mistake costs 3 seconds.</p><div><button class="btn accent" id="sh-go">Start</button></div>`;
  $("#sh-go").onclick = start;
  function start(){ items = CS.shuffle(all().slice()); show(); timer = setInterval(() => { time--; const t = $("#mx-t"); if (t) t.textContent = Math.max(0, time); if (time <= 0) end(); }, 1000); }
  function show(){
    if (!items.length) items = CS.shuffle(all().slice());
    const it = items[0], same = all().filter(a => a[4] === it[4] && a[1] !== it[1]), names = [...new Set(same.map(a => a[1]))],
      opts = CS.shuffle([it[1]].concat(CS.shuffle(names).slice(0,3)));
    area.innerHTML = `<div class="hud"><span>Time <b id="mx-t">${Math.max(0,time)}</b></span><span>Matched <b>${score}</b></span><span>Misses <b>${miss}</b></span></div>
      <div class="so-card">${esc(it[0])}</div>
      <div class="mx-btns">${opts.map((o, k) => `<button class="btn big" data-b="${esc(o)}">${k+1} · ${esc(o)}</button>`).join("")}</div><div id="mx-fb" class="tiny muted" style="min-height:1.4em"></div>`;
    const choose = n => { const ok = n === it[1]; CS.record({u: it[3]||1}, ok, false); items.shift();
      if (ok) score++; else { miss++; time -= 3; if (time <= 0) return end(); }
      show(); if (!ok) { const f = $("#mx-fb"); if (f) f.textContent = `Not quite: ${it[1]}. ${it[2]}`; } };
    const btns = $$(".mx-btns .btn", area); btns.forEach(x => x.onclick = () => choose(x.dataset.b));
    area._key = e => { if (/^[1-4]$/.test(e.key) && btns[+e.key - 1]) choose(btns[+e.key - 1].dataset.b); };
  }
  function end(){
    clearInterval(timer); area._key = null; const nb = CS.setBest("shapes", score); finish(score*8);
    area.innerHTML = `<span class="eyebrow">Shape Match · results</span><div class="result-big">${score}</div><p class="muted">matched, ${miss} missed${nb?" · new personal best":""}. ${score>=16?"You read distributions like a pro.":"Describe shape (symmetric or skewed toward the tail), center, spread and unusual values; for scatterplots add direction, form and strength."}</p>
      <div class="row-wrap"><button class="btn" id="sh-again">Play again</button><button class="btn ghost" data-go="cards">Review flashcards</button></div>`;
    $("#sh-again").onclick = () => { time = 60; score = 0; miss = 0; start(); };
  }
}
function sbias(area){
  const ROUNDS = 8; let i = 0, right = 0, pool = [];
  const all = () => window.CS_STAT_BIAS || [];
  area.innerHTML = `<p style="max-width:62ch">Each round describes a sampling method or a study. Name the flaw that could mislead the results. Eight scenarios per game.</p><div><button class="btn accent" id="sb-go">Start · ${ROUNDS} scenarios</button></div>`;
  $("#sb-go").onclick = () => { pool = CS.shuffle(all().slice()); i = 0; right = 0; round(); };
  function round(){
    if (i >= ROUNDS) return end();
    const q = pool[i], names = [...new Set(all().filter(c => c[4] === q[4] && c[1] !== q[1]).map(c => c[1]))], opts = CS.shuffle([q[1]].concat(CS.shuffle(names).slice(0,3)));
    area.innerHTML = `<div class="hud"><span>Scenario <b>${i+1}</b>/${ROUNDS}</span><span>Correct <b>${right}</b></span></div><blockquote class="sm-quote">${esc(q[0])}</blockquote><p class="muted tiny">This best illustrates:</p>
      <div class="sm-opts">${opts.map((o,k) => `<button class="btn ghost sm-o" data-o="${k}">${esc(o)}</button>`).join("")}</div><div id="sm-fb"></div>`;
    let done = false;
    $$(".sm-o", area).forEach(b => b.onclick = () => { if (done) return; done = true; const pick = opts[+b.dataset.o], ok = pick === q[1]; CS.record({u: q[3]}, ok, false); if (ok) right++;
      $$(".sm-o", area).forEach(x => { x.disabled = true; if (opts[+x.dataset.o] === q[1]) x.classList.add("right"); else if (x === b) x.classList.add("wrong"); });
      $("#sm-fb").innerHTML = `<div class="feedback ${ok?"good":"bad"}"><b>${ok?"Correct.":"Not quite: "+esc(q[1])+"."}</b> ${esc(q[2])}</div><div style="margin-top:10px"><button class="btn" id="sm-next">${i+1<ROUNDS?"Next scenario":"See results"}</button></div>`;
      $("#sm-next").onclick = () => { i++; round(); }; $("#sm-next").focus({preventScroll:true}); area._key = e => { if (e.key === "Enter") $("#sm-next").click(); }; });
  }
  function end(){
    area._key = null; const nb = CS.setBest("sbias", right); finish(right*12);
    area.innerHTML = `<span class="eyebrow">Bias Spotter · results</span><div class="result-big">${right}/${ROUNDS}</div><p class="muted">${nb?"New personal best. ":""}${right>=7?"No flawed study gets past you.":"Sampling flaws come from who is chosen (undercoverage, voluntary response, convenience); design flaws come from comparing groups (confounding, no control, no randomization)."}</p>
      <div class="row-wrap"><button class="btn" id="sb-again">Play again</button><button class="btn ghost" data-go="learn" data-unit="1">Review Unit 1</button></div>`;
    $("#sb-again").onclick = () => { i = 0; right = 0; pool = CS.shuffle(all().slice()); round(); };
  }
}
function plinko(area){
  const ROUNDS = 8, ROWS = 6; let i = 0, right = 0, qs = [];
  const pk = a => a[Math.floor(Math.random()*a.length)], ri = (a,b) => a + Math.floor(Math.random()*(b-a+1));
  const f3 = x => (Math.round(x*1000)/1000).toFixed(3).replace(/0+$/,"").replace(/\.$/,".0");
  const C = (n,k) => { let r = 1; for (let t = 1; t <= k; t++) r = r*(n-k+t)/t; return Math.round(r); };
  const nm = ["Maya","Jon","Priya","Luis","Ava","Sam","Zoe","Dev"];
  const mk = () => { const t = ri(0,4);
    if (t === 0) { const n = ri(3,5), p = pk([0.2,0.3,0.4,0.6,0.7,0.8]), k = ri(1,n-1), a = C(n,k)*Math.pow(p,k)*Math.pow(1-p,n-k);
      return {u:2, q:`${pk(nm)} makes each free throw with probability ${p}, independently. In ${n} shots, what is the probability of making exactly ${k}?`, a, w:[Math.pow(p,k), C(n,k)*Math.pow(p,k), C(n,k)*Math.pow(1-p,n-k)*p, a/ C(n,k)], why:`P(X = ${k}) = C(${n},${k})(${p})^${k}(${f3(1-p)})^${n-k} = ${f3(a)}. Forgetting the C(${n},${k}) or the failures term gives the wrong answers.`}; }
    if (t === 1) { const n = ri(2,4), p = pk([0.1,0.2,0.3]), a = 1-Math.pow(1-p,n);
      return {u:2, q:`Each of ${n} independent trials succeeds with probability ${p}. What is the probability of at least one success?`, a, w:[Math.pow(1-p,n), n*p > 0.99 ? p : n*p, Math.pow(p,n), p], why:`Use the complement: 1 − (${f3(1-p)})^${n} = ${f3(a)}.`}; }
    if (t === 2) { const pa = pk([0.2,0.3,0.4,0.5]), pb = pk([0.3,0.4,0.6]), a = pa+pb-pa*pb;
      return {u:2, q:`Events A and B are independent with P(A) = ${pa} and P(B) = ${pb}. What is P(A or B)?`, a, w:[pa+pb, pa*pb, 1-pa*pb, Math.abs(pa-pb)], why:`P(A or B) = P(A) + P(B) − P(A and B) = ${pa} + ${pb} − ${f3(pa*pb)} = ${f3(a)}.`}; }
    if (t === 3) { const n = pk([20,40,50,80,100]), p = pk([0.1,0.2,0.25,0.3,0.4,0.5]), a = n*p;
      return {u:2, q:`X is binomial with n = ${n} and p = ${p}. What is the expected value of X?`, a, w:[n*(1-p), p, Math.sqrt(n*p*(1-p)), n+p], why:`E(X) = np = ${n} × ${p} = ${f3(a)}.`, plain:1}; }
    const a1 = ri(10,30), b1 = ri(10,30), c1 = ri(10,30), d1 = ri(10,30), tot = a1+b1+c1+d1, a = a1/(a1+c1);
    return {u:2, q:`A table counts ${tot} people. ${a1} are in group A and also have trait T, ${b1} in group A without T, ${c1} not in group A but with T, and ${d1} in neither. What is P(in group A | has trait T)?`, a, w:[a1/tot, a1/(a1+b1), (a1+c1)/tot, c1/(a1+c1)], why:`Given T, the sample space is the ${a1+c1} people with T, so P(A | T) = ${a1}/${a1+c1} = ${f3(a)}.`}; };
  const build = () => { let q, guard = 0; do { q = mk(); const fmt = x => q.plain ? String(Math.round(x*100)/100) : f3(x); q.opts = [...new Set([q.a].concat(q.w).filter(x => isFinite(x) && x >= 0 && (q.plain || x <= 1)).map(fmt))]; q.right = fmt(q.a); q.opts = q.opts.filter(x => x !== q.right).slice(0,3); q.opts.push(q.right); } while (q.opts.length < 4 && ++guard < 30); q.opts = CS.shuffle(q.opts); return q; };
  const bx = r => 150 + (r) * 24, W = 300, H = 230;
  const board = () => { let g = ""; for (let r = 0; r < ROWS; r++) for (let c = 0; c <= r; c++) g += `<circle cx="${150 + (c - r/2)*34}" cy="${34 + r*26}" r="3.6" fill="#94A3B8"/>`;
    let bins = ""; for (let b = 0; b <= ROWS; b++) { const x = 150 + (b - ROWS/2)*34, win = b === ROWS/2; bins += `<rect x="${x-16}" y="${H-38}" width="32" height="34" rx="5" fill="${win ? "#FACC15" : "#E2E8F0"}" stroke="${win ? "#B45309" : "#94A3B8"}" stroke-width="1.6"/><text x="${x}" y="${H-16}" text-anchor="middle" font-size="${win ? 11 : 12}" font-weight="800" fill="${win ? "#7C2D12" : "#64748B"}" font-family="Manrope, sans-serif">${win ? "WIN" : "×"}</text>`; }
    return `<svg viewBox="0 0 ${W} ${H}" class="pl-svg" role="img" aria-label="Plinko board" style="width:100%;max-width:340px;display:block;margin:0 auto;background:var(--soft,#F8FAFC);border-radius:14px"><g>${g}</g>${bins}<g id="pl-ball" style="transform:translate(150px,10px);transition:transform .28s ease-in"><circle r="7" fill="#EF4444" stroke="#7F1D1D" stroke-width="1.6"/><circle cx="-2" cy="-2" r="2" fill="#fff" opacity=".8"/></g></svg>`; };
  area.innerHTML = `<p style="max-width:62ch">Solve each probability problem, then drop the ball. A correct answer sends it to the gold WIN slot; a wrong one bounces to the edge. Eight problems per game.</p><div><button class="btn accent" id="pl-go">Start · ${ROUNDS} drops</button></div>`;
  $("#pl-go").onclick = () => { qs = Array.from({length: ROUNDS}, build); i = 0; right = 0; round(); };
  function round(){
    if (i >= ROUNDS) return end();
    const q = qs[i];
    area.innerHTML = `<div class="hud"><span>Drop <b>${i+1}</b>/${ROUNDS}</span><span>Jackpots <b>${right}</b></span></div><div class="so-card">${esc(q.q)}</div>
      <div class="sm-opts">${q.opts.map((o,k) => `<button class="btn ghost sm-o" data-o="${k}">${esc(o)}</button>`).join("")}</div>${board()}<div id="sm-fb"></div>`;
    let done = false;
    $$(".sm-o", area).forEach(b => b.onclick = () => { if (done) return; done = true; const ok = q.opts[+b.dataset.o] === q.right; CS.record({u: q.u}, ok, false); if (ok) right++;
      $$(".sm-o", area).forEach(x => { x.disabled = true; if (q.opts[+x.dataset.o] === q.right) x.classList.add("right"); else if (x === b) x.classList.add("wrong"); });
      const target = ok ? ROWS/2 : pk([0,1,ROWS-1,ROWS]), moves = []; let need = target; for (let r = 0; r < ROWS; r++) { const left = ROWS - r; const goR = need >= left ? true : need <= 0 ? false : Math.random() < need/left; moves.push(goR); if (goR) need--; }
      const ball = $("#pl-ball"); let pos = 0, step = 0;
      const tick = () => { if (!ball) return; if (step < ROWS) { pos += moves[step] ? 1 : 0; const x = 150 + (pos - (step+1)/2)*34; ball.style.transform = `translate(${x}px,${34 + step*26 + 13}px)`; step++; setTimeout(tick, 290); } else { ball.style.transform = `translate(${150 + (pos - ROWS/2)*34}px,${H-22}px)`; setTimeout(fb, 350); } };
      const fb = () => { const el = $("#sm-fb"); if (!el) return; el.innerHTML = `<div class="feedback ${ok?"good":"bad"}"><b>${ok?"Jackpot.":"Not quite: "+esc(q.right)+"."}</b> ${esc(q.why)}</div><div style="margin-top:10px"><button class="btn" id="sm-next">${i+1<ROUNDS?"Next drop":"See results"}</button></div>`;
        $("#sm-next").onclick = () => { i++; round(); }; $("#sm-next").focus({preventScroll:true}); area._key = e => { if (e.key === "Enter" && $("#sm-next")) $("#sm-next").click(); }; };
      setTimeout(tick, 60); });
  }
  function end(){
    area._key = null; const nb = CS.setBest("plinko", right); finish(right*12);
    area.innerHTML = `<span class="eyebrow">Probability Plinko · results</span><div class="result-big">${right}/${ROUNDS}</div><p class="muted">${nb?"New personal best. ":""}${right>=7?"Jackpot machine.":"Remember: exactly k uses C(n,k)p^k(1−p)^(n−k); at least one uses the complement; and given information shrinks the sample space."}</p>
      <div class="row-wrap"><button class="btn" id="pl-again">Play again</button><button class="btn ghost" data-go="learn" data-unit="2">Review Unit 2</button></div>`;
    $("#pl-again").onclick = () => { qs = Array.from({length: ROUNDS}, build); i = 0; right = 0; round(); };
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
