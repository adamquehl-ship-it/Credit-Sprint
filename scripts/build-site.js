/* Builds Credit Sprint's public pages from the same data the app uses:
   index.html (landing), guides/*.html, practice/*.html, sitemap.xml, robots.txt.
   Run from the repo root:  node scripts/build-site.js  */
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = path.join(__dirname, ".."), SITE = "https://creditsprintprep.com";
/* cache-busting version: changes on every build so browsers fetch fresh CSS/JS after an update */
const VER = Date.now().toString(36);
const load = (dir, files) => { const ctx = {window:{}}; vm.createContext(ctx); files.forEach(f => vm.runInContext(fs.readFileSync(path.join(ROOT,dir,f),"utf8"), ctx)); return ctx.window; };
const W = load("assets/data", ["questions.js","questions2.js","fifth.js","content.js","content2.js","drills.js","content3.js"]);
const WM = load("assets/data/micro", ["questions.js","questions2.js","content.js","content2.js","drills.js"]);
const UNITS = W.CS_UNITS, Q = W.CS_QUESTIONS_RAW, FIFTH = W.CS_FIFTH;
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const slug = s => s.toLowerCase().replace(/®/g,"").replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const LOGO = `<svg class="mark" viewBox="0 0 40 40" role="img" aria-label="Credit Sprint"><rect x="1" y="1" width="38" height="38" rx="10" fill="#4F46E5"/><path d="M20 1 H29 A10 10 0 0 1 39 11 V29 A10 10 0 0 1 29 39 H20 Z" fill="#10B981"/><text x="11" y="26.2" text-anchor="middle" font-family="Manrope, Arial, sans-serif" font-weight="800" font-size="16.5" fill="#FFFFFF">C</text><text x="29.5" y="26.2" text-anchor="middle" font-family="Manrope, Arial, sans-serif" font-weight="800" font-size="16.5" fill="#06281C">S</text></svg>`;
const ICON = {
  target:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/>', check:'<path d="M5 12.5 10 17l9-10"/>', chart:'<path d="M4 4v16h16"/><path d="M7 15 11 10l3 3 5-6"/>',
  spark:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>', cards:'<rect x="3" y="7" width="13" height="13" rx="2"/><path d="M8 7V5a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-4"/>',
  pen:'<path d="M4 20h4L19 9l-4-4L4 16z"/>', cal:'<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>', star:'<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8L3.5 9.7l5.9-.8z"/>',
  sword:'<path d="M14.5 4H20v5.5L10 19.5 4.5 14z"/>', bolt:'<path d="M13 3 5 14h6l-1 7 8-11h-6z"/>', link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  tf:'<path d="M4 12.5 8 16.5 15 7.5"/><path d="M15 15l5 5M20 15l-5 5"/>', calc:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8"/>', bank:'<path d="M3 9.5 12 4l9 5.5H3z"/><path d="M5 10v7M9.5 10v7M14.5 10v7M19 10v7M3 20h18"/>',
  paw:'<circle cx="7" cy="10" r="2.2"/><circle cx="11" cy="6.5" r="2.2"/><circle cx="15.5" cy="7" r="2.2"/><circle cx="18.5" cy="11" r="2.2"/><path d="M12 12.5c-3 0-6 3.5-6 6 0 1.6 1.4 2.5 3 2.5 1.2 0 2-.6 3-.6s1.8.6 3 .6c1.6 0 3-.9 3-2.5 0-2.5-3-6-6-6z"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  flame:'<path d="M12 21c-3.9 0-6.5-2.6-6.5-6.2 0-3.4 2.4-5.3 3.6-8 .9 1.6 1.6 2.5 2.9 3.1-.2-2.4.7-4.7 2.6-6.4.4 3.5 4.9 5.6 4.9 11.1 0 3.7-3 6.4-7.5 6.4z"/>'
};
const ic = (k, sz=20) => `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k]}</svg>`;
const DISC = "AP® and CLEP® are trademarks registered by the College Board, which is not affiliated with, and does not endorse, this site. All practice questions are original.";
const FAV = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect x='1' y='1' width='38' height='38' rx='10' fill='%234F46E5'/%3E%3Cpath d='M20 1 H29 A10 10 0 0 1 39 11 V29 A10 10 0 0 1 29 39 H20 Z' fill='%2310B981'/%3E%3Ctext x='11' y='26.2' text-anchor='middle' font-family='Arial,sans-serif' font-weight='800' font-size='16.5' fill='%23fff'%3EC%3C/text%3E%3Ctext x='29.5' y='26.2' text-anchor='middle' font-family='Arial,sans-serif' font-weight='800' font-size='16.5' fill='%2306281C'%3ES%3C/text%3E%3C/svg%3E`;

function page({title, desc, canon, depth=0, body, ld}){
  const up = "../".repeat(depth);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE}${canon}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:type" content="website"><meta property="og:url" content="${SITE}${canon}">
<meta name="theme-color" content="#4F46E5">
<link rel="icon" href="${FAV}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&display=swap">
<style>:root{color-scheme:light}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
<link rel="stylesheet" href="${up}assets/styles.css?v=${VER}"><link rel="stylesheet" href="${up}assets/site.css?v=${VER}">
${ld?`<script type="application/ld+json">${JSON.stringify(ld)}</script>`:""}
</head>
<body><div class="site">
<header class="snav"><div class="wrap"><a class="brand" href="${up}index.html">${LOGO}<span>Credit Sprint</span></a>
<nav aria-label="Site"><a href="${up}index.html#courses">Courses</a><a href="${up}index.html#features">Features</a><a href="${up}index.html#games">Games</a><a href="${up}guides/index.html">Study guides</a><a href="${up}index.html#pricing">Pricing</a><a href="${up}index.html#faq">FAQ</a></nav>
<a class="btn sm" href="${up}index.html#courses">Start free</a></div></header>
${body}
<footer class="sfoot"><div class="wrap"><div class="cols">
<div class="stack" style="gap:8px"><a class="brand" href="${up}index.html" style="display:flex;align-items:center;gap:10px;font-weight:800;color:var(--ink)">${LOGO}Credit Sprint</a><span>Study smarter for AP® and CLEP® Macroeconomics and Microeconomics.</span></div>
<div><b>Study</b><a href="${up}app.html?course=macro">Macroeconomics app</a><a href="${up}app.html?course=micro">Microeconomics app</a><a href="${up}guides/index.html">Unit study guides</a><a href="${up}practice/index.html">Practice problems</a></div>
<div><b>Company</b><a href="${up}index.html#pricing">Pricing</a><a href="${up}index.html#faq">FAQ</a></div>
</div><p class="disc">${DISC} © ${new Date().getFullYear()} Credit Sprint.</p></div></footer>
</div></body></html>
`;
}
const out = (rel, html) => { const p = path.join(ROOT, rel); fs.mkdirSync(path.dirname(p), {recursive:true}); fs.writeFileSync(p, html); urls.push(rel === "index.html" ? "/" : "/"+rel); };
const urls = [];

/* ---------- landing ---------- */
const nQ = Q.length + WM.CS_QUESTIONS_RAW.length, nF = W.CS_FRQS.length + WM.CS_FRQS.length, nC = W.CS_CARDS_RAW.length + WM.CS_CARDS_RAW.length;
const COURSES = [
  {k:"macro", name:"Macroeconomics", col:"#4F46E5", soft:"#EEF2FF", ic:"bank", q:Q.length, f:W.CS_FRQS.length, c:W.CS_CARDS_RAW.length, units:UNITS.map(u=>u.short), blurb:"GDP, inflation, money and banking, fiscal and monetary policy, international trade.", games:"Fed Chair, Shift It, Chain Reaction"},
  {k:"micro", name:"Microeconomics", col:"#059669", soft:"#ECFDF5", ic:"chart", q:WM.CS_QUESTIONS_RAW.length, f:WM.CS_FRQS.length, c:WM.CS_CARDS_RAW.length, units:WM.CS_UNITS.map(u=>u.short), blurb:"Supply and demand, elasticity, costs, perfect competition, monopoly, game theory, labor markets, externalities.", games:"Profit Max, Nash Hunt, Shift It"}
];
const courseCard = c => `<a class="ccard" href="app.html?course=${c.k}" style="--cc:${c.col};--cs:${c.soft}">
  <span class="ccard-top"><span class="ccard-ico">${ic(c.ic,26)}</span><span class="stack" style="gap:2px"><b>${c.name}</b><span class="muted small">AP® and CLEP®</span></span></span>
  <span class="small">${c.blurb}</span>
  <span class="ccard-stats"><span><b>${c.q}</b> questions</span><span><b>${c.f}</b> FRQs</span><span><b>${c.c}</b> flashcards</span></span>
  <span class="ccard-go">Start ${c.name.replace("economics","")} free ${ic("arrow",18)}</span></a>`;
const GAMES = [["star","Daily Challenge"],["sword","Boss Battle"],["chart","Shift It"],["bolt","Sprint"],["link","Chain Reaction"],["tf","True or False"],["calc","Number Crunch"],["cards","Match-up"],["bank","Fed Chair · Macro"],["calc","Profit Max · Micro"],["sword","Nash Hunt · Micro"],["paw","Pet collecting"]];
const check = ic("check",18);
out("index.html", page({
  title:"Credit Sprint · Study for AP® & CLEP® Macroeconomics and Microeconomics", canon:"/",
  desc:`Earn college credit in macroeconomics and microeconomics. ${nQ} practice questions with explanations, ${nF} free-response questions, flashcards, games and timed practice exams. Free to start.`,
  ld:{"@context":"https://schema.org","@type":"WebSite","name":"Credit Sprint","url":SITE},
  body:`<main>
<section class="wrap hero2" id="courses">
  <div class="stack" style="gap:20px">
    <div class="pillrow"><span class="pill">AP® Macroeconomics</span><span class="pill">AP® Microeconomics</span><span class="pill">CLEP® Macro</span><span class="pill">CLEP® Micro</span></div>
    <h1>Earn the credit. <em>Skip the intro course.</em></h1>
    <p class="lead">Credit Sprint turns econ into a daily habit: a 10-minute diagnostic, a plan built around your weakest units, ${nQ} practice questions that explain every answer, and games that make the graphs stick.</p>
    <div class="stack" style="gap:10px"><span class="eyebrow">Choose your course</span>
      <div class="ccards">${COURSES.map(courseCard).join("")}</div></div>
    <span class="muted small">No account needed. Take both: your streak, XP and pets carry over.</span>
  </div>
  <div class="mock-stack" aria-hidden="true">
    <div class="mock-a"><div class="hero-card" style="--hero1:#059669;--hero2:#065F46"><span class="eyebrow">Good evening · AP® Microeconomics</span><h1 style="font-size:1.7rem">12-day streak. Keep it alive.</h1>
      <div class="countdown"><div><b>58</b><span>days left</span></div><div><b>4</b><span>predicted score</span></div><div><b>842</b><span>answered</span></div></div>
      <div class="row-wrap"><span class="btn sm">Play Profit Max →</span></div></div></div>
    <div class="mock-b"><div class="panel"><span class="eyebrow">Unit 3 · Perfect competition</span><b>Price is above AVC but below ATC. What should the firm do in the short run?</b>
      <div class="mini-opt r">✓ Keep producing where P = MC</div><div class="mini-opt">Shut down immediately</div>
      <span class="muted tiny">Price covers variable costs, so the loss is smaller than fixed cost.</span></div></div>
  </div>
</section>
<section class="wrap" style="padding-bottom:56px"><div class="statrow">
  <div><b>${nQ}</b><span>practice questions</span></div><div><b>${nF}</b><span>free-response prompts</span></div><div><b>${nC}</b><span>flashcards</span></div><div><b>11</b><span>study games</span></div><div><b>58</b><span>pets to collect</span></div>
</div></section>
<section class="sec alt"><div class="wrap">
  <div class="sec-head"><span class="eyebrow">Two courses, four exams</span><h2>Four ways to earn college credit</h2><p>AP® and CLEP® cover the same core material in each course. Study once and you're ready for both. If May doesn't go your way, CLEP® is a second shot.</p></div>
  <div class="two">
    ${COURSES.map(c=>`<div class="examcard" style="border-top:4px solid ${c.col}"><span class="row-wrap" style="gap:10px"><span class="ccard-ico" style="--cc:${c.col}">${ic(c.ic,22)}</span><h3>${c.name}</h3></span>
      <p class="muted small">${c.blurb}</p>
      <ul><li><b>AP®:</b> 60 multiple-choice questions in 70 minutes, then 3 free-response questions</li><li><b>CLEP®:</b> about 80 multiple-choice questions in 90 minutes; a 50 earns credit at many colleges</li><li><b>Units:</b> ${c.units.join(" · ")}</li><li><b>Signature games:</b> ${c.games}</li></ul>
      <a class="btn" href="app.html?course=${c.k}" style="align-self:flex-start;background:${c.col}">Study ${c.name}</a></div>`).join("")}
  </div>
</div></section>
<section class="sec" id="features"><div class="wrap">
  <div class="sec-head"><span class="eyebrow">Features</span><h2>Everything you need to pass, nothing you don't</h2><p>Built around how the exams actually work: graphs, cause and effect, and a lot of practice.</p></div>
  <div class="feat">
    <div class="card2"><span class="fi">${ic("target")}</span><h3>Diagnostic and study plan</h3><p>Twelve questions find your weak units, then a weekly plan, or a 30-day cram plan, puts them first.</p></div>
    <div class="card2"><span class="fi">${ic("check")}</span><h3>Every answer explained</h3><p>Five choices like the real exam, and an explanation for every single one, so you learn from wrong answers too.</p></div>
    <div class="card2"><span class="fi">${ic("chart")}</span><h3>Draw the graph</h3><p>Drag supply, demand, AD, the money supply and more yourself. Graphs are worth real points on the FRQ section.</p></div>
    <div class="card2"><span class="fi">${ic("spark")}</span><h3>AI tutor and FRQ feedback</h3><p>Stuck? Ask for a different explanation. Wrote an FRQ? Get it scored against the rubric in seconds.</p></div>
    <div class="card2"><span class="fi">${ic("cards")}</span><h3>Spaced repetition</h3><p>Flashcards and missed questions come back at the right time, so what you learn in October is still there in May.</p></div>
    <div class="card2"><span class="fi">${ic("pen")}</span><h3>Timed practice exams</h3><p>Full-length and mini exams weighted like the real thing, with a score estimate when you finish.</p></div>
  </div>
</div></section>
<section class="sec alt" id="games"><div class="wrap">
  <div class="sec-head"><span class="eyebrow">Games</span><h2>Studying that feels like playing</h2><p>Streaks, XP, levels, badges and games built for each course. Plus pets: earn a mystery egg for every 25 questions you answer, hatch it with correct answers, and collect 58 original econ creatures across both courses, from Common all the way up to a 1-in-2,000 Supreme Mythical.</p></div>
  <div class="gamechips">${GAMES.map(([k,n])=>`<span class="gamechip"><span>${ic(k)}</span>${n}</span>`).join("")}</div>
</div></section>
<section class="sec" id="how"><div class="wrap">
  <div class="sec-head"><span class="eyebrow">How it works</span><h2>Ten minutes a day to exam-ready</h2></div>
  <div class="steps">
    <div><h3>Pick a course</h3><p>Macro, Micro or both. Take a 12-question diagnostic and see your weak units right away.</p></div>
    <div><h3>Plan</h3><p>Set your exam date. Get a week-by-week plan or a 30-day sprint.</p></div>
    <div><h3>Practice daily</h3><p>Hit your daily goal with quests, flashcards and the daily challenge.</p></div>
    <div><h3>Prove it</h3><p>Beat all six unit bosses and ace a practice exam. Then go earn the credit.</p></div>
  </div>
</div></section>
<section class="sec alt" id="pricing"><div class="wrap">
  <div class="sec-head"><span class="eyebrow">Pricing</span><h2>Start free. Upgrade when it's crunch time.</h2></div>
  <div class="beta">Early access: every feature is free while Credit Sprint is in beta.</div>
  <div class="price">
    <div class="plan"><span class="eyebrow">Free</span><div class="amt">$0</div><ul><li>${check}Both courses: every unit guide and explainer</li><li>${check}Diagnostic and study plan</li><li>${check}Daily challenge, flashcards and pets</li><li>${check}One quiz per unit each day</li></ul><a class="btn ghost" href="#courses">Start free</a></div>
    <div class="plan best"><span class="eyebrow" style="color:var(--accent)">Pass Plan · most popular</span><div class="amt">$9<small> / month</small></div><span class="muted small">or $39 for the whole exam season</span><ul><li>${check}Unlimited practice and calculation drills</li><li>${check}Full timed practice exams</li><li>${check}AI tutor and AI FRQ scoring</li><li>${check}Every game and boss battle</li></ul><a class="btn" href="#courses">Try it free in beta</a></div>
    <div class="plan"><span class="eyebrow">Pass Guarantee</span><div class="amt">$59<small> / exam</small></div><ul><li>${check}Everything in Pass Plan</li><li>${check}Miss a 3 on AP®? Free access until your CLEP® retake</li><li>${check}Priority feedback on FRQs</li></ul><a class="btn ghost" href="#courses">Try it free in beta</a></div>
  </div>
</div></section>
<section class="sec" id="faq"><div class="wrap">
  <div class="sec-head"><span class="eyebrow">FAQ</span><h2>Questions students ask</h2></div>
  <div class="faq">
    <details><summary>Is Credit Sprint affiliated with the College Board?</summary><p>No. Credit Sprint is an independent study tool. AP® and CLEP® are trademarks of the College Board, which doesn't endorse this site. Every practice question is written by Credit Sprint.</p></details>
    <details><summary>Can I study Macro and Micro at the same time?</summary><p>Yes. Switch courses any time from the top of the dashboard. Each course keeps its own scores and study plan, while your streak, XP, badges and pets carry over.</p></details>
    <details><summary>Does it work for both AP® and CLEP®?</summary><p>Yes. Switch exams any time. The practice exam length, unit weights, score estimate and study plan all change to match.</p></details>
    <details><summary>How accurate is the score prediction?</summary><p>It's a rough estimate based on your recent answers in each unit, weighted like the real exam. Use it to see whether you're trending up, not as an official score.</p></details>
    <details><summary>Do I need an account?</summary><p>Not right now. Your progress is saved in your browser. Accounts that sync across devices are coming soon.</p></details>
    <details><summary>How much time do I need?</summary><p>Ten to fifteen minutes a day is enough to make steady progress. With less than a month to go, switch on the 30-day cram plan.</p></details>
  </div>
</div></section>
<section class="wrap" style="padding-bottom:72px"><div class="cta-band"><div class="stack" style="gap:6px"><h2>Your first 10 minutes start now.</h2><span style="opacity:.85">Pick a course, take the diagnostic and see exactly where you stand.</span></div><div class="row-wrap"><a class="btn lg" href="app.html?course=macro">Start Macro</a><a class="btn lg" href="app.html?course=micro">Start Micro</a></div></div></section>
</main>`}));

/* ---------- unit guide pages ---------- */
const qsFor = u => Q.map((q,i)=>({q,i})).filter(x=>x.q[0]===u);
const qBlock = ({q,i,F}, n) => { const fifth = F===undefined ? FIFTH : F; const opts = [q[2][0], ...q[3].map(x=>x[0]), ...(fifth && fifth["q"+i] ? [fifth["q"+i][0]] : [])].sort((a,b)=>(a.length*7+a.charCodeAt(0))%11-(b.length*7+b.charCodeAt(0))%11);
  return `<div class="q"><b>${n}. ${esc(q[1])}</b><ol type="A">${opts.map(o=>`<li>${esc(o)}</li>`).join("")}</ol><details><summary>Show answer</summary><p><b>${esc(q[2][0])}.</b> ${esc(q[2][1])}</p></details></div>`; };
const guideLinks = [];
UNITS.forEach(u => {
  const file = `guides/macroeconomics-unit-${u.id}-${slug(u.name)}.html`;
  guideLinks.push({file, u});
  const sample = qsFor(u.id).filter((_,k)=>k%9===0).slice(0,5);
  const cards = W.CS_CARDS_RAW.filter(c=>c[0]===u.id);
  out(file, page({depth:1, canon:"/"+file,
    title:`Macroeconomics Unit ${u.id}: ${u.name} Study Guide (AP® & CLEP®) | Credit Sprint`,
    desc:`Free study guide for macroeconomics Unit ${u.id}, ${u.name}: key concepts, formulas, exam traps and practice questions with explanations.`,
    ld:{"@context":"https://schema.org","@type":"LearningResource","name":`Macroeconomics Unit ${u.id}: ${u.name}`,"educationalLevel":"High school / introductory college","provider":{"@type":"Organization","name":"Credit Sprint","url":SITE}},
    body:`<main class="wrap doc"><article>
<p class="crumbs"><a href="../index.html">Credit Sprint</a> / <a href="index.html">Study guides</a> / Unit ${u.id}</p>
<h1>Credit Sprint's Guide to Macroeconomics Unit ${u.id}: ${esc(u.name)}</h1>
<div class="row-wrap"><span class="tag acc">AP® weight ${u.ap}</span><span class="tag">CLEP® weight ${u.clep}</span></div>
<p style="font-size:1.08rem">${esc(u.summary)}</p>
<h2>What you need to know</h2><ul>${u.points.map(p=>`<li>${esc(p)}</li>`).join("")}</ul>
<h2>Formulas</h2>${u.formulas.map(f=>`<div class="formula">${esc(f)}</div>`).join("")}
<h2>Exam traps</h2>${u.traps.map(t=>`<div class="trap"><b>Watch for</b>${esc(t)}</div>`).join("")}
<h2>Key terms</h2><ul>${cards.map(c=>`<li><b>${esc(c[1])}:</b> ${esc(c[2])}</li>`).join("")}</ul>
<h2>Practice questions</h2><p class="muted">Five of the ${qsFor(u.id).length} Unit ${u.id} questions in Credit Sprint. Every choice is explained in the app.</p>
${sample.map((x,k)=>qBlock(x,k+1)).join("")}
</article>
<aside><div class="panel"><h3>Practice Unit ${u.id} free</h3><p class="muted small">${qsFor(u.id).length} questions, flashcards, a boss battle and a study plan built around your weak spots.</p><a class="btn" href="../app.html?course=macro">Start studying</a></div>
<div class="panel flat"><span class="eyebrow">All units</span>${UNITS.map(v=>`<a href="macroeconomics-unit-${v.id}-${slug(v.name)}.html" style="${v.id===u.id?"font-weight:800;color:var(--ink)":""}">Unit ${v.id}: ${esc(v.short)}</a>`).join("")}</div></aside></main>`}));
});
/* CLEP pages */
const C = W.CS_CLEP;
out("guides/clep-macroeconomics-economic-growth.html", page({depth:1, canon:"/guides/clep-macroeconomics-economic-growth.html",
  title:"Economic Growth and Productivity Study Guide (CLEP® Macroeconomics) | Credit Sprint",
  desc:"Free study guide to economic growth and productivity for the CLEP Principles of Macroeconomics exam: key ideas, the rule of 70 and practice questions.",
  body:`<main class="wrap doc"><article><p class="crumbs"><a href="../index.html">Credit Sprint</a> / <a href="index.html">Study guides</a> / Economic growth</p>
<h1>Credit Sprint's Guide to Economic Growth for CLEP® Principles of Macroeconomics</h1><span class="tag acc" style="align-self:flex-start">${esc(C.growth.weight)}</span>
<p style="font-size:1.08rem">${esc(C.growth.summary)}</p><h2>What you need to know</h2><ul>${C.growth.points.map(p=>`<li>${esc(p)}</li>`).join("")}</ul>
<h2>Practice questions</h2>${Q.map((q,i)=>({q,i})).filter(x=>C.growth.match.test(x.q[1]+" "+x.q[2][0])).slice(0,5).map((x,k)=>qBlock(x,k+1)).join("")}</article>
<aside><div class="panel"><h3>Practice growth questions</h3><p class="muted small">Open the CLEP® hub in the app for the full set.</p><a class="btn" href="../app.html?course=macro">Start studying</a></div></aside></main>`}));
out("guides/clep-macroeconomics-exam-guide.html", page({depth:1, canon:"/guides/clep-macroeconomics-exam-guide.html",
  title:"CLEP® Principles of Macroeconomics Exam Guide: Format, Scores, Retakes | Credit Sprint",
  desc:"How the CLEP Principles of Macroeconomics exam works: question count, timing, passing score, fees, at-home testing and the retake policy.",
  body:`<main class="wrap doc"><article><p class="crumbs"><a href="../index.html">Credit Sprint</a> / <a href="index.html">Study guides</a> / CLEP® exam guide</p>
<h1>Credit Sprint's Guide to the CLEP® Principles of Macroeconomics Exam</h1>
${C.guide.map(sec=>`<h2>${esc(sec.h)}</h2><ul>${sec.p.map(p=>`<li>${esc(p)}</li>`).join("")}</ul>`).join("")}
<p class="muted small">Sources: ${C.sources.map(([n,u])=>`<a href="${esc(u)}">${esc(n)}</a>`).join(" · ")}. Policies change; confirm details on the official CLEP® site.</p></article>
<aside><div class="panel"><h3>Get CLEP®-ready</h3><p class="muted small">About 80 questions in 90 minutes. Practice with a full-length timed exam in the app.</p><a class="btn" href="../app.html?course=macro">Start studying</a></div></aside></main>`}));

/* ---------- Microeconomics guide pages ---------- */
const MQ = WM.CS_QUESTIONS_RAW, MU = WM.CS_UNITS;
const mqsFor = u => MQ.map((q,i)=>({q,i,F:null})).filter(x=>x.q[0]===u);
const mGuideLinks = [];
MU.forEach(u => {
  const file = `guides/microeconomics-unit-${u.id}-${slug(u.name)}.html`; mGuideLinks.push({file, u});
  const sample = mqsFor(u.id).filter((_,k)=>k%8===0).slice(0,5), cards = WM.CS_CARDS_RAW.filter(c=>c[0]===u.id);
  out(file, page({depth:1, canon:"/"+file,
    title:`Microeconomics Unit ${u.id}: ${u.name} Study Guide (AP® & CLEP®) | Credit Sprint`,
    desc:`Free study guide for microeconomics Unit ${u.id}, ${u.name}: key concepts, formulas, exam traps and practice questions with explanations.`,
    ld:{"@context":"https://schema.org","@type":"LearningResource","name":`Microeconomics Unit ${u.id}: ${u.name}`,"educationalLevel":"High school / introductory college","provider":{"@type":"Organization","name":"Credit Sprint","url":SITE}},
    body:`<main class="wrap doc"><article>
<p class="crumbs"><a href="../index.html">Credit Sprint</a> / <a href="index.html">Study guides</a> / Micro Unit ${u.id}</p>
<h1>Credit Sprint's Guide to Microeconomics Unit ${u.id}: ${esc(u.name)}</h1>
<div class="row-wrap"><span class="tag good">AP® weight ${u.ap}</span><span class="tag">CLEP® weight ${u.clep}</span></div>
<p style="font-size:1.08rem">${esc(u.summary)}</p>
<h2>What you need to know</h2><ul>${u.points.map(p=>`<li>${esc(p)}</li>`).join("")}</ul>
<h2>Formulas</h2>${u.formulas.map(f=>`<div class="formula">${esc(f)}</div>`).join("")}
<h2>Exam traps</h2>${u.traps.map(t=>`<div class="trap"><b>Watch for</b>${esc(t)}</div>`).join("")}
<h2>Key terms</h2><ul>${cards.map(c=>`<li><b>${esc(c[1])}:</b> ${esc(c[2])}</li>`).join("")}</ul>
<h2>Practice questions</h2><p class="muted">Five of the ${mqsFor(u.id).length} Unit ${u.id} questions in Credit Sprint. Every choice is explained in the app.</p>
${sample.map((x,k)=>qBlock(x,k+1)).join("")}
</article>
<aside><div class="panel"><h3>Practice Micro Unit ${u.id} free</h3><p class="muted small">${mqsFor(u.id).length} questions, flashcards, a boss battle and a study plan built around your weak spots.</p><a class="btn" href="../app.html?course=micro">Start studying</a></div>
<div class="panel flat"><span class="eyebrow">All Micro units</span>${MU.map(v=>`<a href="microeconomics-unit-${v.id}-${slug(v.name)}.html" style="${v.id===u.id?"font-weight:800;color:var(--ink)":""}">Unit ${v.id}: ${esc(v.short)}</a>`).join("")}</div></aside></main>`}));
});
const MC2 = WM.CS_CLEP;
out("guides/clep-microeconomics-consumer-choice.html", page({depth:1, canon:"/guides/clep-microeconomics-consumer-choice.html",
  title:"Theory of Consumer Choice Study Guide (CLEP® Microeconomics) | Credit Sprint",
  desc:"Free study guide to consumer choice for the CLEP Principles of Microeconomics exam: marginal utility, the utility-maximizing rule and practice questions.",
  body:`<main class="wrap doc"><article><p class="crumbs"><a href="../index.html">Credit Sprint</a> / <a href="index.html">Study guides</a> / Consumer choice</p>
<h1>Credit Sprint's Guide to Consumer Choice for CLEP® Principles of Microeconomics</h1><span class="tag good" style="align-self:flex-start">${esc(MC2.growth.weight)}</span>
<p style="font-size:1.08rem">${esc(MC2.growth.summary)}</p><h2>What you need to know</h2><ul>${MC2.growth.points.map(p=>`<li>${esc(p)}</li>`).join("")}</ul>
<h2>Practice questions</h2>${MQ.map((q,i)=>({q,i,F:null})).filter(x=>MC2.growth.match.test(x.q[1]+" "+x.q[2][0])).slice(0,5).map((x,k)=>qBlock(x,k+1)).join("")}</article>
<aside><div class="panel"><h3>Practice consumer choice</h3><p class="muted small">Open the CLEP® hub in the Micro app for the full set.</p><a class="btn" href="../app.html?course=micro">Start studying</a></div></aside></main>`}));
out("guides/clep-microeconomics-exam-guide.html", page({depth:1, canon:"/guides/clep-microeconomics-exam-guide.html",
  title:"CLEP® Principles of Microeconomics Exam Guide: Format, Scores, Retakes | Credit Sprint",
  desc:"How the CLEP Principles of Microeconomics exam works: question count, timing, content areas, passing score, at-home testing and the retake policy.",
  body:`<main class="wrap doc"><article><p class="crumbs"><a href="../index.html">Credit Sprint</a> / <a href="index.html">Study guides</a> / CLEP® Micro exam guide</p>
<h1>Credit Sprint's Guide to the CLEP® Principles of Microeconomics Exam</h1>
${MC2.guide.map(sec=>`<h2>${esc(sec.h)}</h2><ul>${sec.p.map(p=>`<li>${esc(p)}</li>`).join("")}</ul>`).join("")}
<p class="muted small">Sources: ${MC2.sources.map(([n,u])=>`<a href="${esc(u)}">${esc(n)}</a>`).join(" · ")}. Policies change; confirm details on the official CLEP® site.</p></article>
<aside><div class="panel"><h3>Get CLEP®-ready</h3><p class="muted small">About 80 questions in 90 minutes. Practice with a full-length timed exam in the Micro app.</p><a class="btn" href="../app.html?course=micro">Start studying</a></div></aside></main>`}));
/* guides hub */
out("guides/index.html", page({depth:1, canon:"/guides/index.html",
  title:"Macroeconomics and Microeconomics Study Guides for AP® and CLEP® | Credit Sprint",
  desc:"Free unit-by-unit macroeconomics and microeconomics study guides with formulas, exam traps and practice questions.",
  body:`<main class="wrap" style="padding-block:44px 64px;display:flex;flex-direction:column;gap:24px"><p class="crumbs"><a href="../index.html">Credit Sprint</a> / Study guides</p>
<h1>Study guides</h1><p class="muted" style="max-width:60ch">One guide per unit, matched to the AP® courses and CLEP® exams for macroeconomics and microeconomics.</p>
<h2>Microeconomics</h2>
<div class="linkgrid">${mGuideLinks.map(({file,u})=>`<a href="${path.basename(file)}"><b>Unit ${u.id}: ${esc(u.name)}</b><span>AP® ${u.ap} · CLEP® ${u.clep}</span></a>`).join("")}
<a href="clep-microeconomics-consumer-choice.html"><b>Theory of Consumer Choice</b><span>CLEP® 5–10%</span></a><a href="clep-microeconomics-exam-guide.html"><b>CLEP® Micro exam guide</b><span>Format, scores, retakes</span></a></div>
<h2>Macroeconomics</h2>
<div class="linkgrid">${guideLinks.map(({file,u})=>`<a href="${path.basename(file)}"><b>Unit ${u.id}: ${esc(u.name)}</b><span>AP® ${u.ap} · CLEP® ${u.clep}</span></a>`).join("")}
<a href="clep-macroeconomics-economic-growth.html"><b>Economic Growth and Productivity</b><span>CLEP® 5–10%</span></a><a href="clep-macroeconomics-exam-guide.html"><b>CLEP® exam guide</b><span>Format, scores, fees, retakes</span></a>
<a href="../practice/index.html"><b>Practice problems</b><span>Worked calculation problems</span></a></div></main>`}));

/* ---------- practice problem pages ---------- */
const PRACTICE = [["mult","Spending multiplier"],["tax","Tax multiplier"],["gap","Closing an output gap"],["money","Money multiplier and money creation"],["omo","Open market operations"],["ur","Unemployment rate"],["real","Real GDP and the GDP deflator"],["infl","Inflation rate with the CPI"],["rir","Real interest rate"],["growth","Economic growth rate"],["r70","Rule of 70"],["gdp","GDP from its components"],["mv","Quantity theory of money"],["fx","Exchange rate conversions"],["oc","Opportunity cost"]];
const pLinks = [];
PRACTICE.forEach(([k,name]) => {
  const d = W.CS_DRILLS.find(x=>x.k===k); if (!d) return;
  const file = `practice/${slug(name)}-practice-problems.html`; pLinks.push({file,name,u:d.u});
  const probs = Array.from({length:6}, () => d.gen());
  out(file, page({depth:1, canon:"/"+file,
    title:`${name} Practice Problems with Solutions | Credit Sprint`,
    desc:`Six worked ${name.toLowerCase()} practice problems for macroeconomics, with step-by-step solutions. Unlimited new problems in the Credit Sprint app.`,
    body:`<main class="wrap doc"><article><p class="crumbs"><a href="../index.html">Credit Sprint</a> / <a href="index.html">Practice problems</a> / ${esc(name)}</p>
<h1>${esc(name)} practice problems</h1><p class="muted">Macroeconomics Unit ${d.u}. Try each one, then open the worked solution. The Credit Sprint app generates unlimited new versions with fresh numbers.</p>
${probs.map((c,i)=>`<div class="q"><b>Problem ${i+1}.</b><p>${esc(c.q)}</p><details><summary>Show solution</summary><p>${esc(c.work)}</p></details></div>`).join("")}</article>
<aside><div class="panel"><h3>Unlimited ${esc(name.toLowerCase())} problems</h3><p class="muted small">Fresh numbers every time, instant feedback, and a timed Number Crunch game.</p><a class="btn" href="../app.html?course=macro">Practice in the app</a></div></aside></main>`}));
});
const MPRACTICE = [["ped","Price elasticity of demand (midpoint)"],["tr","Total revenue and elasticity"],["eq","Equilibrium from supply and demand equations"],["cs","Consumer surplus"],["tax","Tax revenue and deadweight loss"],["mc","Marginal cost"],["atc","Average total cost"],["profit","Economic profit in perfect competition"],["monop","Monopoly price"],["mrp","Marginal revenue product"],["hire","Profit-maximizing hiring"],["oc","Opportunity cost (micro)"]];
const mpLinks = [];
MPRACTICE.forEach(([k,name]) => {
  const d = WM.CS_DRILLS.find(x=>x.k===k); if (!d) return;
  const file = `practice/${slug(name)}-practice-problems.html`; mpLinks.push({file,name,u:d.u});
  const probs = Array.from({length:6}, () => d.gen());
  out(file, page({depth:1, canon:"/"+file,
    title:`${name} Practice Problems with Solutions | Credit Sprint`,
    desc:`Six worked ${name.toLowerCase()} practice problems for microeconomics, with step-by-step solutions. Unlimited new problems in the Credit Sprint app.`,
    body:`<main class="wrap doc"><article><p class="crumbs"><a href="../index.html">Credit Sprint</a> / <a href="index.html">Practice problems</a> / ${esc(name)}</p>
<h1>${esc(name)} practice problems</h1><p class="muted">Microeconomics Unit ${d.u}. Try each one, then open the worked solution. The Credit Sprint app generates unlimited new versions with fresh numbers.</p>
${probs.map((c,i)=>`<div class="q"><b>Problem ${i+1}.</b><p>${esc(c.q)}</p><details><summary>Show solution</summary><p>${esc(c.work)}</p></details></div>`).join("")}</article>
<aside><div class="panel"><h3>Unlimited ${esc(name.toLowerCase())} problems</h3><p class="muted small">Fresh numbers every time, instant feedback, and a timed Number Crunch game.</p><a class="btn" href="../app.html?course=micro">Practice in the app</a></div></aside></main>`}));
});
out("practice/index.html", page({depth:1, canon:"/practice/index.html",
  title:"Economics Practice Problems with Worked Solutions | Credit Sprint",
  desc:"Free worked practice problems for elasticity, costs, profit, monopoly pricing, multipliers, money creation, inflation, real GDP and more.",
  body:`<main class="wrap" style="padding-block:44px 64px;display:flex;flex-direction:column;gap:24px"><p class="crumbs"><a href="../index.html">Credit Sprint</a> / Practice problems</p>
<h1>Practice problems</h1><p class="muted" style="max-width:60ch">Worked calculation problems for every formula on the AP® and CLEP® macro and micro exams.</p>
<h2>Microeconomics</h2><div class="linkgrid">${mpLinks.map(l=>`<a href="${path.basename(l.file)}"><b>${esc(l.name)}</b><span>Micro Unit ${l.u} · 6 worked problems</span></a>`).join("")}</div>
<h2>Macroeconomics</h2><div class="linkgrid">${pLinks.map(l=>`<a href="${path.basename(l.file)}"><b>${esc(l.name)}</b><span>Unit ${l.u} · 6 worked problems</span></a>`).join("")}</div></main>`}));

/* ---------- sitemap + robots ---------- */
const today = new Date().toISOString().slice(0,10);
urls.push("/app.html");
fs.writeFileSync(path.join(ROOT,"sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u=>`  <url><loc>${SITE}${u}</loc><lastmod>${today}</lastmod></url>`).join("\n")}\n</urlset>\n`);
fs.writeFileSync(path.join(ROOT,"robots.txt"), `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${SITE}/sitemap.xml\n`);
/* stamp the same version into app.html's CSS and script links */
const appPath = path.join(ROOT, "app.html");
fs.writeFileSync(appPath, fs.readFileSync(appPath, "utf8").replace(/\?v=[a-z0-9]+/g, "?v="+VER).replace(/window\.CS_V="[a-z0-9]*"/, 'window.CS_V="'+VER+'"'));
console.log("Built", urls.length, "pages", "· version", VER);
