/* Builds Credit Sprint's public pages from the same data the app uses:
   index.html (landing), guides/*.html, practice/*.html, sitemap.xml, robots.txt.
   Run from the repo root:  node scripts/build-site.js  */
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = path.join(__dirname, ".."), SITE = "https://creditsprintprep.com";
/* cache-busting version: changes on every build so browsers fetch fresh CSS/JS after an update */
const VER = Date.now().toString(36);
const load = (dir, files) => { const ctx = {window:{}}; vm.createContext(ctx); files.forEach(f => vm.runInContext(fs.readFileSync(path.join(ROOT,dir,f),"utf8"), ctx)); return ctx.window; };
const W = load("assets/data", ["questions.js","questions2.js","questions3.js","questions4.js","questions5.js","fifth.js","content.js","content2.js","frqs2.js","drills.js","content3.js","extra.js"]);
const WM = load("assets/data/micro", ["questions.js","questions2.js","questions3.js","questions4.js","questions5.js","content.js","content2.js","frqs2.js","drills.js","extra.js"]);
const WC = load("assets/data/chem", ["questions.js","questions2.js","questions3.js","questions4.js","questions5.js","questions6.js","questions7.js","questions8.js","content.js","content2.js","frqs2.js","drills.js","extra.js"]);
const WB = load("assets/data/bio", ["questions.js","questions2.js","questions3.js","questions4.js","questions5.js","questions6.js","questions7.js","content.js","content2.js","frqs2.js","drills.js","extra.js"]);
const WK = load("assets/data/mkt", ["m1.js","m2.js","m3.js","m4.js","m5.js","m6.js","m7.js","m8.js","m9.js","m10.js","content.js","content2.js","frqs2.js","frqs3.js","drills.js"]);
const WH = load("assets/data/apush", ["cards.js","cards2.js","p1.js","p2.js","p3.js","p4.js","p5.js","p6.js","p7.js","p8.js","p9.js","content.js","content2.js","frqs2.js","frqs3.js","frqs4.js","drills.js"]);
const WW = load("assets/data/apworld", ["cards.js","cards2.js","p1.js","p2.js","p3.js","p4.js","p5.js","p6.js","p7.js","p8.js","p9.js","p10.js","p11.js","p12.js","p13.js","content.js","content2.js","frqs2.js","frqs4.js","drills.js","src.js"]);
const WG = load("assets/data/apgov", ["cards.js","cards2.js","p1.js","p2.js","p3.js","p4.js","p5.js","p6.js","p7.js","p8.js","p9.js","p10.js","p11.js","p12.js","p13.js","p14.js","p15.js","p16.js","p17.js","p18.js","p19.js","p20.js","p21.js","content.js","content2.js","frqs2.js","frqs4.js","drills.js","games.js"]);
const WY = load("assets/data/appsych", ["cards.js","cards2.js","p1.js","p2.js","p3.js","p4.js","p5.js","p6.js","p7.js","p8.js","p9.js","p10.js","p11.js","p12.js","p13.js","p14.js","p15.js","content.js","content2.js","frqs2.js","frqs4.js","drills.js","games.js"]);
const WS = load("assets/data/apstat", ["cards.js","cards2.js","p1.js","p2.js","p3.js","p4.js","p5.js","p6.js","g1.js","g2.js","g3.js","g4.js","g5.js","s1.js","s3.js","s4.js","s5.js","content.js","content2.js","frqs2.js","drills.js","games.js"]);
const WL = load("assets/data/aplit", ["cards.js","cards2.js","terms.js","x1.js","f1.js","f2.js","f3.js","f4.js","v1.js","v2.js","v3.js","v4.js","d1.js","a1.js","content.js","content2.js","essays1.js","essays2.js","essays3.js","games.js"]);
const WN = load("assets/data/aplang", ["cards.js","cards2.js","terms.js","x1.js","x2.js","r1.js","r2.js","r3.js","r4.js","w1.js","w2.js","w3.js","content.js","content2.js","essays1.js","essays2.js","essays3.js","games.js"]);
const CALC_AB = ["cards.js","c1.js","c2.js","g1.js","g2.js","g3.js","g4.js","g5.js","g6.js","g7.js","g8.js","content.js","content2.js","frqs.js","drills.js","games.js"];
const WCA = load("assets/data/calc", CALC_AB);
const WCB = load("assets/data/calc", CALC_AB.concat(["bc/cards.js","bc/c1.js","bc/g9.js","bc/g10.js","bc/content.js","bc/content2.js","bc/frqs.js","bc/drills.js","bc/games.js"]));
const UNITS = W.CS_UNITS, Q = W.CS_QUESTIONS_RAW, FIFTH = W.CS_FIFTH;
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const slug = s => s.toLowerCase().replace(/®/g,"").replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const LOGO = `<svg class="mark" viewBox="0 0 40 40" role="img" aria-label="Credit Sprint"><rect x="1" y="1" width="38" height="38" rx="10" fill="#4F46E5"/><path d="M20 1 H29 A10 10 0 0 1 39 11 V29 A10 10 0 0 1 29 39 H20 Z" fill="#10B981"/><text x="11" y="26.2" text-anchor="middle" font-family="Manrope, Arial, sans-serif" font-weight="800" font-size="16.5" fill="#FFFFFF">C</text><text x="29.5" y="26.2" text-anchor="middle" font-family="Manrope, Arial, sans-serif" font-weight="800" font-size="16.5" fill="#06281C">S</text></svg>`;
const ICON = {
  landmark:'<path d="M3 21h18M5 21V10M9.5 21V10M14.5 21V10M19 21V10M2 10l10-6 10 6z"/>',
  brain:'<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>',
  flag:'<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/>',
  flask:'<path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2.2h12.4a1.5 1.5 0 0 0 1.3-2.2L14 9V3"/><path d="M7.5 15h9"/>',
  dna:'<path d="M7 3c0 6 10 6 10 12M17 3c0 6-10 6-10 12M7 21c0-3 3-4.5 5-6M17 21c0-3-3-4.5-5-6"/><path d="M8.5 6h7M8.5 12h7M9 18h6"/>',
  target:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/>', check:'<path d="M5 12.5 10 17l9-10"/>', chart:'<path d="M4 4v16h16"/><path d="M7 15 11 10l3 3 5-6"/>',
  spark:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>', cards:'<rect x="3" y="7" width="13" height="13" rx="2"/><path d="M8 7V5a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-4"/>',
  pen:'<path d="M4 20h4L19 9l-4-4L4 16z"/>', cal:'<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>', star:'<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8L3.5 9.7l5.9-.8z"/>',
  sword:'<path d="M14.5 4H20v5.5L10 19.5 4.5 14z"/>', bolt:'<path d="M13 3 5 14h6l-1 7 8-11h-6z"/>', link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  tf:'<path d="M4 12.5 8 16.5 15 7.5"/><path d="M15 15l5 5M20 15l-5 5"/>', calc:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8"/>', integral:'<path d="M15.5 4.5c-.6-1.2-1.6-1.6-2.6-1.4-1.3.3-1.8 1.6-1.9 3L10.4 18c-.1 1.4-.7 2.6-2 2.9-1 .2-2-.2-2.6-1.4"/>', bank:'<path d="M3 9.5 12 4l9 5.5H3z"/><path d="M5 10v7M9.5 10v7M14.5 10v7M19 10v7M3 20h18"/>',
  paw:'<circle cx="7" cy="10" r="2.2"/><circle cx="11" cy="6.5" r="2.2"/><circle cx="15.5" cy="7" r="2.2"/><circle cx="18.5" cy="11" r="2.2"/><path d="M12 12.5c-3 0-6 3.5-6 6 0 1.6 1.4 2.5 3 2.5 1.2 0 2-.6 3-.6s1.8.6 3 .6c1.6 0 3-.9 3-2.5 0-2.5-3-6-6-6z"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  flame:'<path d="M12 21c-3.9 0-6.5-2.6-6.5-6.2 0-3.4 2.4-5.3 3.6-8 .9 1.6 1.6 2.5 2.9 3.1-.2-2.4.7-4.7 2.6-6.4.4 3.5 4.9 5.6 4.9 11.1 0 3.7-3 6.4-7.5 6.4z"/>'
};
const ic = (k, sz=20) => `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k]}</svg>`;
const DISC = "AP® and CLEP® are trademarks registered by the College Board, which is not affiliated with, and does not endorse, this site. All practice questions are original.";
const FAV = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect x='1' y='1' width='38' height='38' rx='10' fill='%234F46E5'/%3E%3Cpath d='M20 1 H29 A10 10 0 0 1 39 11 V29 A10 10 0 0 1 29 39 H20 Z' fill='%2310B981'/%3E%3Ctext x='11' y='26.2' text-anchor='middle' font-family='Arial,sans-serif' font-weight='800' font-size='16.5' fill='%23fff'%3EC%3C/text%3E%3Ctext x='29.5' y='26.2' text-anchor='middle' font-family='Arial,sans-serif' font-weight='800' font-size='16.5' fill='%2306281C'%3ES%3C/text%3E%3C/svg%3E`;

/* keep search titles near 60 characters: apply shortening steps in order, stopping as soon as the title fits */
const TITLE_MAX = 65;
const TITLE_STEPS = [
  t => t.replace(" Practice Problems with Solutions", " Practice Problems"),
  t => t.replace("(AP® and CLEP®)", "(AP® & CLEP®)"),
  t => t.replace("CLEP® Principles of Marketing", "CLEP® Marketing").replace("CLEP® History of the U.S.", "CLEP® U.S. History").replace("AP® U.S. Government and Politics", "AP® U.S. Gov"),
  t => t.replace(/(Study Guide \([^)]*\)):[^|]*(\s\|)/, "$1$2"),
  t => t.replace(/,? (c\. )?\d{3,4}( CE)? to (c\. )?(\d{3,4}|the Present)/, ""),
  t => t.replace(/ \| Credit Sprint$/, ""),
  t => t.replace(/ \((AP|CLEP)[^)]*\)/, ""),
  t => t.replace(/ Study Guide$/, " Guide"),
];
/* hand-written short forms where the generic steps can't get a title under the limit */
const TITLE_SHORT = [
  [/^CLEP® History of the United States Exam Guide/, "CLEP® U.S. History Exam Guide: Format, Scores, Credit, Retakes"],
  [/^CLEP® Principles of Macroeconomics Exam Guide/, "CLEP® Macroeconomics Exam Guide: Format, Scores, Retakes"],
  [/^CLEP® Principles of Microeconomics Exam Guide/, "CLEP® Microeconomics Exam Guide: Format, Scores, Retakes"],
  [/^Macroeconomics Unit 2:/, "AP® Macro Unit 2: Economic Indicators & Business Cycle Guide"],
  [/^Macroeconomics Unit 3:/, "AP® Macro Unit 3: National Income & Price Determination"],
  [/^Macroeconomics Unit 5:/, "AP® Macro Unit 5: Long-Run Stabilization Policy Study Guide"],
  [/^Macroeconomics Unit 6:/, "AP® Macro Unit 6: International Trade & Finance Study Guide"],
  [/^Microeconomics Unit 3:/, "AP® Micro Unit 3: Production, Cost & Perfect Competition"],
  [/^Microeconomics Unit 6:/, "AP® Micro Unit 6: Market Failure & Government Study Guide"],
  [/^U.S. History Period 5:/, "APUSH Period 5: Civil War and Reconstruction Study Guide"],
  [/^U.S. History Period 7:/, "APUSH Period 7: Progressivism, World Wars, Depression Guide"],
  [/^Marketing Unit 3:/, "CLEP® Marketing Unit 3: Environment & Research Study Guide"],
  [/^Credit Sprint · AP® & CLEP® Prep/, "Credit Sprint · AP® & CLEP® Prep for 12 Courses, Free to Start"],
];
function fitTitle(t){ if (t.length > TITLE_MAX) for (const [re, v] of TITLE_SHORT) if (re.test(t)) return v; for (const f of TITLE_STEPS) { if (t.length <= TITLE_MAX) break; t = f(t); } return t; }
function page({title, desc, canon, depth=0, body, ld}){
  title = fitTitle(title);
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
<div class="row-wrap" style="gap:8px;flex-wrap:nowrap"><a class="btn ghost sm" href="${up}app.html?signup=1">Sign up</a><a class="btn sm" href="${up}index.html#courses">Start free</a></div></div></header>
${body}
<footer class="sfoot"><div class="wrap"><div class="cols">
<div class="stack" style="gap:8px"><a class="brand" href="${up}index.html" style="display:flex;align-items:center;gap:10px;font-weight:800;color:var(--ink)">${LOGO}Credit Sprint</a><span>Study smarter for AP® and CLEP® exams in 12 subjects.</span></div>
<div><b>Study</b><a href="${up}app.html">Open the study app</a><a href="${up}index.html#courses">All 14 courses</a><a href="${up}guides/index.html">Unit study guides</a><a href="${up}practice/index.html">Practice problems</a></div>
<div><b>Company</b><a href="${up}index.html#pricing">Pricing</a><a href="${up}index.html#faq">FAQ</a><a href="${up}privacy.html">Privacy policy</a><a href="${up}terms.html">Terms of service</a></div>
</div><p class="disc">${DISC} © ${new Date().getFullYear()} Credit Sprint.</p></div></footer>
</div></body></html>
`;
}
const out = (rel, html) => { const p = path.join(ROOT, rel); fs.mkdirSync(path.dirname(p), {recursive:true}); fs.writeFileSync(p, html); urls.push(rel === "index.html" ? "/" : "/"+rel); };
const urls = [];

/* ---------- landing ---------- */
const nQ = Q.length + WM.CS_QUESTIONS_RAW.length + WB.CS_QUESTIONS_RAW.length + WC.CS_QUESTIONS_RAW.length + WK.CS_QUESTIONS_RAW.length + WH.CS_QUESTIONS_RAW.length + WW.CS_QUESTIONS_RAW.length + WG.CS_QUESTIONS_RAW.length + WY.CS_QUESTIONS_RAW.length + WS.CS_QUESTIONS_RAW.length + WL.CS_QUESTIONS_RAW.length + WN.CS_QUESTIONS_RAW.length + WCB.CS_QUESTIONS_RAW.length, nF = W.CS_FRQS.length + WM.CS_FRQS.length + WB.CS_FRQS.length + WC.CS_FRQS.length + WK.CS_FRQS.length + WH.CS_FRQS.length + WW.CS_FRQS.length + WG.CS_FRQS.length + WY.CS_FRQS.length + WS.CS_FRQS.length + WL.CS_FRQS.length + WN.CS_FRQS.length + WCB.CS_FRQS.length, nC = W.CS_CARDS_RAW.length + WM.CS_CARDS_RAW.length + WB.CS_CARDS_RAW.length + WC.CS_CARDS_RAW.length + WK.CS_CARDS_RAW.length + WH.CS_CARDS_RAW.length + WW.CS_CARDS_RAW.length + WG.CS_CARDS_RAW.length + WY.CS_CARDS_RAW.length + WS.CS_CARDS_RAW.length + WL.CS_CARDS_RAW.length + WN.CS_CARDS_RAW.length + WCB.CS_CARDS_RAW.length;
const COURSES = [
  {k:"macro", name:"Macroeconomics", col:"#4F46E5", soft:"#EEF2FF", ic:"bank", q:Q.length, f:W.CS_FRQS.length, c:W.CS_CARDS_RAW.length, units:UNITS.map(u=>u.short), blurb:"GDP, inflation, money and banking, fiscal and monetary policy, international trade.", games:"Fed Chair, Shift It, Chain Reaction"},
  {k:"micro", name:"Microeconomics", col:"#059669", soft:"#ECFDF5", ic:"chart", q:WM.CS_QUESTIONS_RAW.length, f:WM.CS_FRQS.length, c:WM.CS_CARDS_RAW.length, units:WM.CS_UNITS.map(u=>u.short), blurb:"Supply and demand, elasticity, costs, perfect competition, monopoly, game theory, labor markets, externalities.", games:"Profit Max, Nash Hunt, Shift It"},
  {k:"bio", name:"Biology", col:"#0891B2", soft:"#ECFEFF", ic:"dna", q:WB.CS_QUESTIONS_RAW.length, f:WB.CS_FRQS.length, c:WB.CS_CARDS_RAW.length, units:WB.CS_UNITS.map(u=>u.short), blurb:"Biochemistry, cells, energy, the cell cycle, genetics, gene expression, evolution and ecology, plus CLEP® organismal biology.", games:"Cross It, Chain Reaction, Number Crunch"},
  {k:"chem", name:"Chemistry", col:"#EA580C", soft:"#FFF7ED", ic:"flask", q:WC.CS_QUESTIONS_RAW.length, f:WC.CS_FRQS.length, c:WC.CS_CARDS_RAW.length, units:WC.CS_UNITS.map(u=>u.short), blurb:"Atomic structure, bonding, intermolecular forces, reactions, kinetics, thermodynamics, equilibrium, acids and bases, electrochemistry.", games:"Balance It, Chain Reaction, Number Crunch"},
  {k:"mkt", name:"Marketing", col:"#DB2777", soft:"#FDF2F8", ic:"target", clepOnly:true, q:WK.CS_QUESTIONS_RAW.length, f:WK.CS_FRQS.length, c:WK.CS_CARDS_RAW.length, units:WK.CS_UNITS.map(u=>u.short), blurb:"Marketing and society, the marketing concept, research, consumer behavior, segmentation and positioning, B2B, products and brands, pricing, distribution, promotion and e-commerce.", games:"Mix Master, Perceptual Map, Number Crunch"},
  {k:"apush", name:"U.S. History", col:"#B91C1C", soft:"#FEF2F2", ic:"flag", q:WH.CS_QUESTIONS_RAW.length, f:WH.CS_FRQS.length, c:WH.CS_CARDS_RAW.length, units:WH.CS_UNITS.map(u=>u.short), blurb:"Contact and colonization, the Revolution, the early republic, reform and expansion, the Civil War and Reconstruction, the Gilded Age, the world wars, the Cold War and civil rights, and today. AP® U.S. History plus CLEP® History of the U.S. I and II.", games:"Timeline Sort, Source Match, Chain Reaction", apLine:"55 multiple-choice questions in 55 minutes, then 3 short-answer questions, a DBQ and a long essay", clepLine:"about 120 multiple-choice questions in 90 minutes; a 50 earns credit at many colleges"},
  {k:"apworld", name:"World History", col:"#0F766E", soft:"#F0FDFA", ic:"globe", q:WW.CS_QUESTIONS_RAW.length, f:WW.CS_FRQS.length, c:WW.CS_CARDS_RAW.length, units:WW.CS_UNITS.map(u=>u.short), blurb:"Global tapestry and trade networks, land-based empires, the Atlantic world, revolutions, industrialization, the world wars, the Cold War and decolonization, and globalization. AP® World History: Modern only.", games:"Timeline Sort, Source Match, Chain Reaction", apOnly:true, apLine:"55 multiple-choice questions in 55 minutes, then 3 short-answer questions, a DBQ and a long essay"},
  {k:"apgov", name:"U.S. Government", col:"#1E3A8A", soft:"#EFF6FF", ic:"landmark", q:WG.CS_QUESTIONS_RAW.length, f:WG.CS_FRQS.length, c:WG.CS_CARDS_RAW.length, units:WG.CS_UNITS.map(u=>u.short), blurb:"Foundations of democracy, Congress, the presidency and the courts, civil liberties and civil rights, political beliefs and elections, with landmark cases and foundational documents. AP® U.S. Government and Politics plus CLEP® American Government.", games:"Court Case Match, Branch Check, Amendment Sprint"},  {k:"appsych", name:"Psychology", col:"#7C3AED", soft:"#F5F3FF", ic:"brain", q:WY.CS_QUESTIONS_RAW.length, f:WY.CS_FRQS.length, c:WY.CS_CARDS_RAW.length, units:WY.CS_UNITS.map(u=>u.short), blurb:"Biological bases of behavior, cognition, development and learning, social psychology and personality, mental and physical health, with famous studies and research methods. AP® Psychology plus CLEP® Introductory Psychology.", games:"Famous Studies Match, Brain Check, Disorder Sort"},
  {k:"apstat", name:"Statistics", col:"#0369A1", soft:"#F0F9FF", ic:"chart", q:WS.CS_QUESTIONS_RAW.length, f:WS.CS_FRQS.length, c:WS.CS_CARDS_RAW.length, units:WS.CS_UNITS.map(u=>u.short), blurb:"Exploring and collecting data, probability and distributions, inference for proportions and means, and regression, built for the redesigned AP\u00AE Statistics exam. AP\u00AE Statistics only.", games:"Which Test?, Shape Match, Probability Plinko", apOnly:true, apLine:"42 multiple-choice questions in 90 minutes, then 4 free-response questions in 90 minutes"},
  {k:"aplit", name:"English Literature", col:"#BE123C", soft:"#FFF1F2", ic:"book", q:WL.CS_QUESTIONS_RAW.length, f:WL.CS_FRQS.length, c:WL.CS_CARDS_RAW.length, units:WL.CS_UNITS.map(u=>u.short), blurb:"Short fiction, poetry, novels and drama with real reading passages, plus poetry, prose and literary argument essays with sample answers. AP\u00AE English Literature and CLEP\u00AE Analyzing and Interpreting Literature.", games:"Device Spotter, Name That Form, Tone Check"},
  {k:"calcab", name:"Calculus AB", col:"#65A30D", soft:"#F7FEE7", ic:"integral", q:WCA.CS_QUESTIONS_RAW.length, f:WCA.CS_FRQS.length, c:WCA.CS_CARDS_RAW.length, units:WCA.CS_UNITS.map(u=>u.short), blurb:"Limits, derivatives and their applications, integrals and the Fundamental Theorem, differential equations, and area and volume. AP\u00AE Calculus AB and CLEP\u00AE Calculus.", games:"Derivative Dash, Tangent Shot, Graph Detective", apLine:"42 multiple-choice questions in 1 hour 40 minutes, then 6 free-response questions in 90 minutes", clepLine:"about 44 multiple-choice questions in 90 minutes; a 50 earns credit at many colleges"},
  {k:"calcbc", name:"Calculus BC", col:"#A21CAF", soft:"#FDF4FF", ic:"integral", q:WCB.CS_QUESTIONS_RAW.length, f:WCB.CS_FRQS.length, c:WCB.CS_CARDS_RAW.length, units:WCB.CS_UNITS.map(u=>u.short), blurb:"All of Calculus AB plus integration by parts, improper integrals, Euler's method, logistic growth, parametric, polar and vector functions, and infinite series. AP\u00AE Calculus BC only.", games:"Series Court, Tangent Shot, Integral Sprint", apOnly:true, apLine:"42 multiple-choice questions in 1 hour 40 minutes, then 6 free-response questions in 90 minutes"},
  {k:"aplang", name:"English Language", col:"#B45309", soft:"#FFFBEB", ic:"pen", q:WN.CS_QUESTIONS_RAW.length, f:WN.CS_FRQS.length, c:WN.CS_CARDS_RAW.length, units:WN.CS_UNITS.map(u=>u.short), blurb:"Rhetoric and argument with nonfiction reading sets, revise-the-draft questions, and synthesis, rhetorical analysis and argument essays. AP\u00AE English Language and CLEP\u00AE College Composition.", games:"Appeal Sort, Fallacy Finder, Rhetoric Spotter"},
];
const courseCard = c => `<a class="ccard" href="app.html?course=${c.k}" style="--cc:${c.col};--cs:${c.soft}">
  <span class="ccard-top"><span class="ccard-ico">${ic(c.ic,26)}</span><span class="stack" style="gap:2px"><b>${c.name}</b><span class="muted small">${c.clepOnly?"CLEP® exam":c.apOnly?"AP® exam":"AP® and CLEP®"}</span></span></span>
  <span class="small">${c.blurb}</span>
  <span class="ccard-stats"><span><b>${c.q}</b> questions</span><span><b>${c.f}</b> FRQs</span><span><b>${c.c}</b> flashcards</span></span>
  <span class="ccard-go">Start ${c.name.replace("economics","")} free ${ic("arrow",18)}</span></a>`;
const GAMES = [["star","Daily Challenge"],["sword","Boss Battle"],["chart","Shift It"],["bolt","Sprint"],["link","Chain Reaction"],["tf","True or False"],["calc","Number Crunch"],["cards","Match-up"],["bank","Fed Chair · Macro"],["calc","Profit Max · Micro"],["sword","Nash Hunt · Micro"],["dna","Cross It · Biology"],["flask","Balance It · Chemistry"],["cards","Mix Master · Marketing"],["chart","Perceptual Map · Marketing"],["link","Timeline Sort · U.S. History"],["cards","Source Match · U.S. History"],["link","Timeline Sort · World History"],["cards","Source Match · World History"],["cards","Court Case Match · Government"],["cards","Branch Check · Government"],["bolt","Amendment Sprint · Government"],["cards","Famous Studies Match · Psychology"],["bolt","Brain Check · Psychology"],["cards","Disorder Sort · Psychology"],["cards","Bias Spotter · Psychology"],["cards","Which Test? · Statistics"],["chart","Shape Match · Statistics"],["cards","Bias Spotter · Statistics"],["star","Probability Plinko · Statistics"],["bolt","Derivative Dash · Calculus"],["target","Tangent Shot · Calculus"],["chart","Graph Detective · Calculus"],["calc","Integral Sprint · Calculus"],["sword","Series Court · Calculus BC"],["cards","Source Match · Government"],["paw","Pet collecting"]];
const landing = require("./landing.js");
const check = ic("check",18);
const lock = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>`;
out("index.html", page({
  title:"Credit Sprint · AP® & CLEP® Prep: Econ, Science, History, English, Psych & Stats", canon:"/",
  desc:`Earn college credit in economics, biology, chemistry, U.S. and world history, government, psychology, statistics, English literature, English language and marketing. ${Number(nQ).toLocaleString("en-US")} practice questions with explanations, ${nF} free-response questions, flashcards, games and timed practice exams. Free to start.`,
  ld:{"@context":"https://schema.org","@type":"WebSite","name":"Credit Sprint","url":SITE},
  body:`<main>
<section class="wrap hero2" id="courses">
  <div class="stack" style="gap:20px">
    <div class="pillrow"><span class="pill">AP® Macroeconomics</span><span class="pill">AP® Microeconomics</span><span class="pill">AP® Biology</span><span class="pill">AP® Chemistry</span><span class="pill">CLEP® Macro</span><span class="pill">CLEP® Micro</span><span class="pill">CLEP® Biology</span><span class="pill">CLEP® Marketing</span><span class="pill">AP® U.S. History</span><span class="pill">CLEP® U.S. History</span><span class="pill">AP® World History</span><span class="pill">AP® U.S. Government</span><span class="pill">CLEP® American Government</span></div>
    <h1>Earn the credit. <em>Skip the intro course.</em></h1>
    <p class="lead">Credit Sprint turns studying into a daily habit: a 10-minute diagnostic, a plan built around your weakest units, ${nQ} practice questions that explain every answer, and games that make the hard parts stick.</p>
    <div class="stack" style="gap:10px"><span class="eyebrow">Choose your course</span>
      <div class="ccards">${COURSES.map(courseCard).join("")}</div></div>
    <span class="muted small">Try it free, then make a free account to save progress. Take more than one course: your streak, XP, creds and pets carry over.</span>
  </div>
  <div class="mock-stack" aria-hidden="true">
    <div class="mock-a"><div class="hero-card" style="--hero1:#059669;--hero2:#065F46"><span class="eyebrow">Good evening · AP® Microeconomics</span><h2 style="font-size:1.7rem">12-day streak. Keep it alive.</h2>
      <div class="countdown"><div><b>58</b><span>days left</span></div><div><b>4</b><span>predicted score</span></div><div><b>842</b><span>answered</span></div></div>
      <div class="row-wrap"><span class="btn sm">Play Profit Max →</span></div></div></div>
    <div class="mock-b"><div class="panel"><span class="eyebrow">Unit 3 · Perfect competition</span><b>Price is above AVC but below ATC. What should the firm do in the short run?</b>
      <div class="mini-opt r">✓ Keep producing where P = MC</div><div class="mini-opt">Shut down immediately</div>
      <span class="muted tiny">Price covers variable costs, so the loss is smaller than fixed cost.</span></div></div>
  </div>
</section>
<section class="wrap" style="padding-bottom:56px"><div class="statrow">
  <div><b>${nQ}</b><span>practice questions</span></div><div><b>${nF}</b><span>free-response prompts</span></div><div><b>${nC}</b><span>flashcards</span></div><div><b>29</b><span>study games</span></div><div><b>261</b><span>pets to collect</span></div>
</div></section>
${landing(COURSES, ic)}
<section class="sec alt"><div class="wrap">
  <div class="sec-head"><span class="eyebrow">Twelve courses, twenty-one exams</span><h2>Twenty-one ways to earn college credit</h2><p>AP® and CLEP® cover the same core material in each course. Study once and you're ready for both. If May doesn't go your way, CLEP® is a second shot. Marketing is a CLEP® exam only, World History is an AP® exam only, and U.S. History pairs AP® with the two CLEP® U.S. History exams.</p></div>
  <div class="two">
    ${COURSES.map(c=>`<div class="examcard" style="border-top:4px solid ${c.col}"><span class="row-wrap" style="gap:10px"><span class="ccard-ico" style="--cc:${c.col}">${ic(c.ic,22)}</span><h3>${c.name}</h3></span>
      <p class="muted small">${c.blurb}</p>
      <ul>${c.clepOnly?"":`<li><b>AP®:</b> ${c.apLine||"60 multiple-choice questions in 70 minutes, then 3 free-response questions"}</li>`}${c.apOnly?"":`<li><b>CLEP®:</b> ${c.clepLine||"about 80 multiple-choice questions in 90 minutes; a 50 earns credit at many colleges"}</li>`}<li><b>Units:</b> ${c.units.join(" · ")}</li><li><b>Signature games:</b> ${c.games}</li></ul>
      <a class="btn" href="app.html?course=${c.k}" style="align-self:flex-start;background:${c.col}">Study ${c.name}</a></div>`).join("")}
  </div>
</div></section>
<section class="sec" id="features"><div class="wrap">
  <div class="sec-head"><span class="eyebrow">Features</span><h2>Everything you need to pass, nothing you don't</h2><p>Built around how the exams actually work: graphs, cause and effect, and a lot of practice.</p></div>
  <div class="feat">
    <div class="card2"><span class="fi">${ic("target")}</span><h3>Diagnostic and study plan</h3><p>A quick diagnostic (12 questions for Macro or Micro, 16 for Biology) finds your weak units, then a weekly plan, or a 30-day cram plan, puts them first.</p></div>
    <div class="card2"><span class="fi">${ic("check")}</span><h3>Every answer explained</h3><p>Five choices like the real exam, and an explanation for every single one, so you learn from wrong answers too.</p></div>
    <div class="card2"><span class="fi">${ic("chart")}</span><h3>Draw the graph</h3><p>Drag supply, demand, AD, the money supply and more yourself. Graphs are worth real points on the FRQ section.</p></div>
    <div class="card2"><span class="fi">${ic("spark")}</span><h3>AI tutor and FRQ feedback <span class="soon">Coming soon</span></h3><p>Stuck? Ask for a different explanation. Wrote an FRQ? Get it scored against the rubric in seconds.</p></div>
    <div class="card2"><span class="fi">${ic("cards")}</span><h3>Spaced repetition</h3><p>Flashcards and missed questions come back at the right time, so what you learn in October is still there in May.</p></div>
    <div class="card2"><span class="fi">${ic("pen")}</span><h3>Timed practice exams</h3><p>Full-length and mini exams weighted like the real thing, with a score estimate when you finish.</p></div>
  </div>
</div></section>
<section class="sec alt" id="games"><div class="wrap">
  <div class="sec-head"><span class="eyebrow">Games</span><h2>Studying that feels like playing</h2><p>Streaks, XP, levels, badges and games built for each course. Plus pets: earn a mystery egg for every 25 questions you answer, hatch it with correct answers, and collect hundreds of original creatures across all fourteen courses, from Common all the way up to a 1-in-2,000 Supreme Mythical.</p></div>
  <div class="gamechips">${GAMES.map(([k,n])=>`<span class="gamechip"><span>${ic(k)}</span>${n}</span>`).join("")}</div>
</div></section>
<section class="sec" id="how"><div class="wrap">
  <div class="sec-head"><span class="eyebrow">How it works</span><h2>Ten minutes a day to exam-ready</h2></div>
  <div class="steps">
    <div><h3>Pick a course</h3><p>Macro, Micro, Biology, Chemistry, Marketing, U.S. History, World History, U.S. Government, Psychology, Statistics or all ten. Take a quick diagnostic and see your weak units right away.</p></div>
    <div><h3>Plan</h3><p>Set your exam date. Get a week-by-week plan or a 30-day sprint.</p></div>
    <div><h3>Practice daily</h3><p>Walk the quest map with your pet, climb the 2-week season pass and race your weekly league.</p></div>
    <div><h3>Prove it</h3><p>Beat every unit boss and ace a practice exam. Then go earn the credit.</p></div>
  </div>
</div></section>
<section class="sec alt" id="pricing"><div class="wrap">
  <div class="sec-head"><span class="eyebrow">Pricing</span><h2>Start free. Unlock everything when it counts.</h2><p class="muted">Pay once through exam day, or go monthly. Every paid plan unlocks every feature.</p></div>
  <div class="price four">
    <div class="plan"><span class="eyebrow">Free</span><div class="amt">$0</div><span class="muted small">Try every course, no card needed.</span><ul><li>${check}Every unit guide and explainer</li><li>${check}Diagnostic and study plan</li><li>${check}3 quizzes a day and mini exams</li><li>${check}Daily Challenge, flashcards, pets and leagues</li><li class="no">${lock}Full practice exams, most games, mistakes notebook, cram plan</li></ul><a class="btn ghost" href="#courses">Start free</a></div>
    <div class="plan best"><span class="eyebrow" style="color:var(--accent)">Exam Pass · most popular</span><div class="amt">$29.99<small> one time</small></div><span class="muted small"><b>$19.99 early bird</b> through Dec 31. One class, all the way to exam day.</span><ul><li>${check}Unlimited quizzes and drills</li><li>${check}Full timed practice exams</li><li>${check}Every game and boss battle</li><li>${check}Mistakes notebook, every FRQ, cram plan</li><li>${check}No subscription. Lasts through your exam</li></ul><a class="btn" href="app.html?signup=1">Get the Exam Pass</a></div>
    <div class="plan"><span class="eyebrow">3-Class Exam Pass · best value</span><div class="amt">$40<small> one time</small></div><span class="muted small"><b>$25 early bird</b> through Dec 31. Any 3 classes, through exam day.</span><ul><li>${check}Every feature in all 3 classes</li><li>${check}Pick any mix of AP® and CLEP®</li><li>${check}No subscription</li></ul><a class="btn ghost" href="app.html?signup=1">Get 3 classes</a></div>
    <div class="plan"><span class="eyebrow">All-Class Exam Pass</span><div class="amt">$50<small> one time</small></div><span class="muted small"><b>$35 early bird</b> through Dec 31. Every class, through exam day.</span><ul><li>${check}Every feature, every course</li><li>${check}New subjects included</li><li>${check}No subscription</li></ul><a class="btn ghost" href="app.html?signup=1">Get every class</a></div>
  </div>
  <div class="price three-mo" style="margin-top:16px">
    <div class="plan"><span class="eyebrow">Monthly · 1 class</span><div class="amt">$7.99<small> / month</small></div><span class="muted small">Full access to one class, month to month.</span><ul><li>${check}Every feature for one class</li><li>${check}Great for CLEP® self-pacers</li><li>${check}Cancel anytime</li></ul><a class="btn ghost" href="app.html?signup=1">Go monthly</a></div>
    <div class="plan"><span class="eyebrow">Monthly · 3 classes</span><div class="amt">$14.99<small> / month</small></div><span class="muted small">Full access to any 3 classes, month to month.</span><ul><li>${check}Every feature in 3 classes</li><li>${check}Pick any mix of AP® and CLEP®</li><li>${check}Cancel anytime</li></ul><a class="btn ghost" href="app.html?signup=1">Get 3 classes monthly</a></div>
    <div class="plan"><span class="eyebrow">Monthly · All classes</span><div class="amt">$19.99<small> / month</small></div><span class="muted small">Every class, including new subjects.</span><ul><li>${check}Every feature, every course</li><li>${check}New subjects included</li><li>${check}Cancel anytime</li></ul><a class="btn ghost" href="app.html?signup=1">Get all classes monthly</a></div>
  </div>
  <p class="muted small" style="text-align:center;margin-top:14px">Secure checkout by Stripe · Apple Pay, Google Pay and cards · 7-day refund if you're not happy · AI tutor and AI FRQ scoring coming soon to every paid plan</p>
</div></section>
<section class="sec" id="faq"><div class="wrap">
  <div class="sec-head"><span class="eyebrow">FAQ</span><h2>Questions students ask</h2></div>
  <div class="faq">
    <details><summary>Is Credit Sprint affiliated with the College Board?</summary><p>No. Credit Sprint is an independent study tool. AP® and CLEP® are trademarks of the College Board, which doesn't endorse this site. Every practice question is written by Credit Sprint.</p></details>
    <details><summary>Can I study more than one course at the same time?</summary><p>Yes. Switch courses any time from the top of the dashboard. Each course keeps its own scores and study plan, while your streak, XP, badges and pets carry over.</p></details>
    <details><summary>Does it work for both AP® and CLEP®?</summary><p>Yes. Switch exams any time. The practice exam length, unit weights, score estimate and study plan all change to match.</p></details>
    <details><summary>How accurate is the score prediction?</summary><p>It's a rough estimate based on your recent answers in each unit, weighted like the real exam. Use it to see whether you're trending up, not as an official score.</p></details>
    <details><summary>Do I need an account?</summary><p>You can try any course right away as a guest, but guest progress is erased when you close the tab. To save your progress and join weekly leagues, create a free account with an email code, Google or a username. Anything you did as a guest carries into your new account.</p></details>
    <details><summary>What do I get on the free plan?</summary><p>Every unit study guide, the diagnostic and study plan, 3 quizzes a day, mini practice exams, the Daily Challenge, flashcards, pets and weekly leagues. Full practice exams, unlimited quizzes, most games, the mistakes notebook, every FRQ and the 30-day cram plan need a paid plan.</p></details>
    <details><summary>Exam Pass or monthly?</summary><p>Most AP® students should get the Exam Pass: one payment covers one class through exam day, with nothing to cancel. Taking several classes? The 3-Class Exam Pass covers any 3 classes and the All-Class Exam Pass covers every class, both through exam day. Monthly plans suit CLEP® students working at their own pace: $7.99 for 1 class, $14.99 for 3 or $19.99 for all classes.</p></details>
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
/* ---------- Biology guide pages ---------- */
const BQ = WB.CS_QUESTIONS_RAW, BU = WB.CS_UNITS;
const bqsFor = u => BQ.map((q,i)=>({q,i,F:null})).filter(x=>x.q[0]===u);
const bGuideLinks = [];
BU.forEach(u => {
  const file = `guides/biology-unit-${u.id}-${slug(u.name)}.html`; bGuideLinks.push({file, u});
  const sample = bqsFor(u.id).filter((_,k)=>k%5===0).slice(0,5), cards = WB.CS_CARDS_RAW.filter(c=>c[0]===u.id);
  const fig = WB.CS_FIGS && WB.CS_FIGS[u.graph] ? WB.CS_FIGS[u.graph](0) : "";
  out(file, page({depth:1, canon:"/"+file,
    title:`Biology Unit ${u.id}: ${u.name} Study Guide (AP® & CLEP®) | Credit Sprint`,
    desc:`Free study guide for biology Unit ${u.id}, ${u.name}: key concepts, equations, exam traps and practice questions with explanations.`,
    ld:{"@context":"https://schema.org","@type":"LearningResource","name":`Biology Unit ${u.id}: ${u.name}`,"educationalLevel":"High school / introductory college","provider":{"@type":"Organization","name":"Credit Sprint","url":SITE}},
    body:`<main class="wrap doc"><article>
<p class="crumbs"><a href="../index.html">Credit Sprint</a> / <a href="index.html">Study guides</a> / Biology Unit ${u.id}</p>
<h1>Credit Sprint's Guide to Biology Unit ${u.id}: ${esc(u.name)}</h1>
<div class="row-wrap"><span class="tag good">AP® weight ${u.ap}</span><span class="tag">CLEP® weight ${u.clep}</span></div>
<p style="font-size:1.08rem">${esc(u.summary)}</p>
${fig ? `<div class="figure" style="max-width:460px">${fig}</div>` : ""}
<h2>What you need to know</h2><ul>${u.points.map(p=>`<li>${esc(p)}</li>`).join("")}</ul>
<h2>Equations and rules</h2>${u.formulas.map(f=>`<div class="formula">${esc(f)}</div>`).join("")}
<h2>Exam traps</h2>${u.traps.map(t=>`<div class="trap"><b>Watch for</b>${esc(t)}</div>`).join("")}
<h2>Key terms</h2><ul>${cards.map(c=>`<li><b>${esc(c[1])}:</b> ${esc(c[2])}</li>`).join("")}</ul>
<h2>Practice questions</h2><p class="muted">Five of the ${bqsFor(u.id).length} Unit ${u.id} questions in Credit Sprint. Every choice is explained in the app.</p>
${sample.map((x,k)=>qBlock(x,k+1)).join("")}
</article>
<aside><div class="panel"><h3>Practice Biology Unit ${u.id} free</h3><p class="muted small">${bqsFor(u.id).length} questions, flashcards, a boss battle and a study plan built around your weak spots.</p><a class="btn" href="../app.html?course=bio">Start studying</a></div>
<div class="panel flat"><span class="eyebrow">All Biology units</span>${BU.map(v=>`<a href="biology-unit-${v.id}-${slug(v.name)}.html" style="${v.id===u.id?"font-weight:800;color:var(--ink)":""}">Unit ${v.id}: ${esc(v.short)}</a>`).join("")}</div></aside></main>`}));
});
const BC2 = WB.CS_CLEP;
out("guides/clep-biology-organismal-biology.html", page({depth:1, canon:"/guides/clep-biology-organismal-biology.html",
  title:"Organismal Biology Study Guide (CLEP® Biology): Plants and Animal Systems | Credit Sprint",
  desc:"Free study guide to organismal biology for the CLEP Biology exam: plant transport and hormones, nervous, endocrine, immune and other animal systems, with practice questions.",
  body:`<main class="wrap doc"><article><p class="crumbs"><a href="../index.html">Credit Sprint</a> / <a href="index.html">Study guides</a> / Organismal biology</p>
<h1>Credit Sprint's Guide to Organismal Biology for CLEP® Biology</h1><span class="tag good" style="align-self:flex-start">${esc(BC2.growth.weight)}</span>
<p style="font-size:1.08rem">${esc(BC2.growth.summary)}</p><div class="figure" style="max-width:420px">${WB.CS_FIGS.plant(0)}</div><h2>What you need to know</h2><ul>${BC2.growth.points.map(p=>`<li>${esc(p)}</li>`).join("")}</ul>
<h2>Practice questions</h2>${BQ.map((q,i)=>({q,i,F:null})).filter(x=>BC2.growth.match.test(x.q[1]+" "+x.q[2][0])).slice(0,6).map((x,k)=>qBlock(x,k+1)).join("")}</article>
<aside><div class="panel"><h3>Practice organismal biology</h3><p class="muted small">Open the CLEP® hub in the Biology app for the full set.</p><a class="btn" href="../app.html?course=bio">Start studying</a></div></aside></main>`}));
out("guides/clep-biology-exam-guide.html", page({depth:1, canon:"/guides/clep-biology-exam-guide.html",
  title:"CLEP® Biology Exam Guide: Format, Scores, Credit, Retakes | Credit Sprint",
  desc:"How the CLEP Biology exam works: about 115 questions in 90 minutes, the three content areas, the passing score, credit, at-home testing and the retake policy.",
  body:`<main class="wrap doc"><article><p class="crumbs"><a href="../index.html">Credit Sprint</a> / <a href="index.html">Study guides</a> / CLEP® Biology exam guide</p>
<h1>Credit Sprint's Guide to the CLEP® Biology Exam</h1>
${BC2.guide.map(sec=>`<h2>${esc(sec.h)}</h2><ul>${sec.p.map(p=>`<li>${esc(p)}</li>`).join("")}</ul>`).join("")}
<p class="muted small">Sources: ${BC2.sources.map(([n,u])=>`<a href="${esc(u)}">${esc(n)}</a>`).join(" · ")}. Policies change; confirm details on the official CLEP® site.</p></article>
<aside><div class="panel"><h3>Get CLEP®-ready</h3><p class="muted small">About 115 questions in 90 minutes. Practice with a full-length timed exam in the Biology app.</p><a class="btn" href="../app.html?course=bio">Start studying</a></div></aside></main>`}));

/* ---------- Chemistry guide pages ---------- */
const CQ = WC.CS_QUESTIONS_RAW, CU = WC.CS_UNITS;
const cqsFor = u => CQ.map((q,i)=>({q,i,F:null})).filter(x=>x.q[0]===u);
const cGuideLinks = [];
CU.forEach(u => {
  const file = `guides/chemistry-unit-${u.id}-${slug(u.name)}.html`; cGuideLinks.push({file, u});
  const sample = cqsFor(u.id).filter((_,k)=>k%5===0).slice(0,5), cards = WC.CS_CARDS_RAW.filter(c=>c[0]===u.id);
  const fig = WC.CS_FIGS && WC.CS_FIGS[u.graph] ? WC.CS_FIGS[u.graph](0) : "";
  out(file, page({depth:1, canon:"/"+file,
    title:`Chemistry Unit ${u.id}: ${u.name} Study Guide (AP® & CLEP®) | Credit Sprint`,
    desc:`Free study guide for chemistry Unit ${u.id}, ${u.name}: key concepts, equations, exam traps and practice questions with explanations.`,
    ld:{"@context":"https://schema.org","@type":"LearningResource","name":`Chemistry Unit ${u.id}: ${u.name}`,"educationalLevel":"High school / introductory college","provider":{"@type":"Organization","name":"Credit Sprint","url":SITE}},
    body:`<main class="wrap doc"><article>
<p class="crumbs"><a href="../index.html">Credit Sprint</a> / <a href="index.html">Study guides</a> / Chemistry Unit ${u.id}</p>
<h1>Credit Sprint's Guide to Chemistry Unit ${u.id}: ${esc(u.name)}</h1>
<div class="row-wrap"><span class="tag good">AP® weight ${u.ap}</span><span class="tag">CLEP® weight ${u.clep}</span></div>
<p style="font-size:1.08rem">${esc(u.summary)}</p>
${fig ? `<div class="figure" style="max-width:460px">${fig}</div>` : ""}
<h2>What you need to know</h2><ul>${u.points.map(p=>`<li>${esc(p)}</li>`).join("")}</ul>
<h2>Equations and rules</h2>${u.formulas.map(f=>`<div class="formula">${esc(f)}</div>`).join("")}
<h2>Exam traps</h2>${u.traps.map(t=>`<div class="trap"><b>Watch for</b>${esc(t)}</div>`).join("")}
<h2>Key terms</h2><ul>${cards.map(c=>`<li><b>${esc(c[1])}:</b> ${esc(c[2])}</li>`).join("")}</ul>
<h2>Practice questions</h2><p class="muted">Five of the ${cqsFor(u.id).length} Unit ${u.id} questions in Credit Sprint. Every choice is explained in the app.</p>
${sample.map((x,k)=>qBlock(x,k+1)).join("")}
</article>
<aside><div class="panel"><h3>Practice Chemistry Unit ${u.id} free</h3><p class="muted small">${cqsFor(u.id).length} questions, flashcards, a boss battle and a study plan built around your weak spots.</p><a class="btn" href="../app.html?course=chem">Start studying</a></div>
<div class="panel flat"><span class="eyebrow">All Chemistry units</span>${CU.map(v=>`<a href="chemistry-unit-${v.id}-${slug(v.name)}.html" style="${v.id===u.id?"font-weight:800;color:var(--ink)":""}">Unit ${v.id}: ${esc(v.short)}</a>`).join("")}</div></aside></main>`}));
});
const CC2 = WC.CS_CLEP;
out("guides/clep-chemistry-descriptive-chemistry.html", page({depth:1, canon:"/guides/clep-chemistry-descriptive-chemistry.html",
  title:"Descriptive and Experimental Chemistry Study Guide (CLEP® Chemistry): Descriptive and Experimental Chemistry | Credit Sprint",
  desc:"Free study guide to descriptive and experimental chemistry for the CLEP Chemistry exam: colors of ions, precipitates, gases, flame tests and laboratory technique, with practice questions.",
  body:`<main class="wrap doc"><article><p class="crumbs"><a href="../index.html">Credit Sprint</a> / <a href="index.html">Study guides</a> / Organismal chemistry</p>
<h1>Credit Sprint's Guide to Descriptive and Experimental Chemistry for CLEP® Chemistry</h1><span class="tag good" style="align-self:flex-start">${esc(CC2.growth.weight)}</span>
<p style="font-size:1.08rem">${esc(CC2.growth.summary)}</p><div class="figure" style="max-width:420px">${WC.CS_FIGS.trends(0)}</div><h2>What you need to know</h2><ul>${CC2.growth.points.map(p=>`<li>${esc(p)}</li>`).join("")}</ul>
<h2>Practice questions</h2>${CQ.map((q,i)=>({q,i,F:null})).filter(x=>CC2.growth.match.test(x.q[1]+" "+x.q[2][0])).slice(0,6).map((x,k)=>qBlock(x,k+1)).join("")}</article>
<aside><div class="panel"><h3>Practice descriptive and experimental chemistry</h3><p class="muted small">Open the CLEP® hub in the Chemistry app for the full set.</p><a class="btn" href="../app.html?course=chem">Start studying</a></div></aside></main>`}));
out("guides/clep-chemistry-exam-guide.html", page({depth:1, canon:"/guides/clep-chemistry-exam-guide.html",
  title:"CLEP® Chemistry Exam Guide: Format, Scores, Credit, Retakes | Credit Sprint",
  desc:"How the CLEP Chemistry exam works: about 75 questions in 90 minutes, the main content areas, the passing score, credit, at-home testing and the retake policy.",
  body:`<main class="wrap doc"><article><p class="crumbs"><a href="../index.html">Credit Sprint</a> / <a href="index.html">Study guides</a> / CLEP® Chemistry exam guide</p>
<h1>Credit Sprint's Guide to the CLEP® Chemistry Exam</h1>
${CC2.guide.map(sec=>`<h2>${esc(sec.h)}</h2><ul>${sec.p.map(p=>`<li>${esc(p)}</li>`).join("")}</ul>`).join("")}
<p class="muted small">Sources: ${CC2.sources.map(([n,u])=>`<a href="${esc(u)}">${esc(n)}</a>`).join(" · ")}. Policies change; confirm details on the official CLEP® site.</p></article>
<aside><div class="panel"><h3>Get CLEP®-ready</h3><p class="muted small">About 75 questions in 90 minutes. Practice with a full-length timed exam in the Chemistry app.</p><a class="btn" href="../app.html?course=chem">Start studying</a></div></aside></main>`}));

/* ---------- Marketing guide pages (CLEP only) ---------- */
const KQ = WK.CS_QUESTIONS_RAW, KU = WK.CS_UNITS;
const kqsFor = u => KQ.map((q,i)=>({q,i,F:null})).filter(x=>x.q[0]===u);
const kGuideLinks = [];
KU.forEach(u => {
  const file = `guides/marketing-unit-${u.id}-${slug(u.name)}.html`; kGuideLinks.push({file, u});
  const sample = kqsFor(u.id).filter((_,k)=>k%6===0).slice(0,5), cards = WK.CS_CARDS_RAW.filter(c=>c[0]===u.id);
  const fig = WK.CS_FIGS && WK.CS_FIGS[u.graph] ? WK.CS_FIGS[u.graph](0) : "";
  out(file, page({depth:1, canon:"/"+file,
    title:`Marketing Unit ${u.id}: ${u.name} Study Guide (CLEP® Principles of Marketing) | Credit Sprint`,
    desc:`Free study guide for marketing Unit ${u.id}, ${u.name}: key concepts, formulas, exam traps and practice questions with explanations for the CLEP Principles of Marketing exam.`,
    ld:{"@context":"https://schema.org","@type":"LearningResource","name":`Marketing Unit ${u.id}: ${u.name}`,"educationalLevel":"High school / introductory college","provider":{"@type":"Organization","name":"Credit Sprint","url":SITE}},
    body:`<main class="wrap doc"><article>
<p class="crumbs"><a href="../index.html">Credit Sprint</a> / <a href="index.html">Study guides</a> / Marketing Unit ${u.id}</p>
<h1>Credit Sprint's Guide to Marketing Unit ${u.id}: ${esc(u.name)}</h1>
<div class="row-wrap"><span class="tag good">CLEP® weight ${u.clep}</span></div>
<p style="font-size:1.08rem">${esc(u.summary)}</p>
${fig ? `<div class="figure" style="max-width:460px">${fig}</div>` : ""}
<h2>What you need to know</h2><ul>${u.points.map(p=>`<li>${esc(p)}</li>`).join("")}</ul>
${u.formulas.length ? `<h2>Formulas and rules</h2>${u.formulas.map(f=>`<div class="formula">${esc(f)}</div>`).join("")}` : ""}
<h2>Exam traps</h2>${u.traps.map(t=>`<div class="trap"><b>Watch for</b>${esc(t)}</div>`).join("")}
<h2>Key terms</h2><ul>${cards.map(c=>`<li><b>${esc(c[1])}:</b> ${esc(c[2])}</li>`).join("")}</ul>
<h2>Practice questions</h2><p class="muted">Five of the ${kqsFor(u.id).length} Unit ${u.id} questions in Credit Sprint. Every choice is explained in the app.</p>
${sample.map((x,k)=>qBlock(x,k+1)).join("")}
</article>
<aside><div class="panel"><h3>Practice Marketing Unit ${u.id} free</h3><p class="muted small">${kqsFor(u.id).length} questions, flashcards, a boss battle and a study plan built around your weak spots.</p><a class="btn" href="../app.html?course=mkt">Start studying</a></div>
<div class="panel flat"><span class="eyebrow">All Marketing units</span>${KU.map(v=>`<a href="marketing-unit-${v.id}-${slug(v.name)}.html" style="${v.id===u.id?"font-weight:800;color:var(--ink)":""}">Unit ${v.id}: ${esc(v.short)}</a>`).join("")}</div></aside></main>`}));
});
const KC = WK.CS_CLEP;
out("guides/clep-marketing-ethics-global-online.html", page({depth:1, canon:"/guides/clep-marketing-ethics-global-online.html",
  title:"Ethics, Global and Online Marketing Study Guide (CLEP® Principles of Marketing) | Credit Sprint",
  desc:"Free study guide to ethics, social responsibility, global marketing and online marketing for the CLEP Principles of Marketing exam, with practice questions.",
  body:`<main class="wrap doc"><article><p class="crumbs"><a href="../index.html">Credit Sprint</a> / <a href="index.html">Study guides</a> / Ethics, global and online marketing</p>
<h1>Credit Sprint's Guide to Ethics, Global and Online Marketing for CLEP® Marketing</h1><span class="tag good" style="align-self:flex-start">${esc(KC.growth.weight)}</span>
<p style="font-size:1.08rem">${esc(KC.growth.summary)}</p><h2>What you need to know</h2><ul>${KC.growth.points.map(p=>`<li>${esc(p)}</li>`).join("")}</ul>
<h2>Practice questions</h2>${KQ.map((q,i)=>({q,i,F:null})).filter(x=>KC.growth.match.test(x.q[1]+" "+x.q[2][0])).slice(0,6).map((x,k)=>qBlock(x,k+1)).join("")}</article>
<aside><div class="panel"><h3>Practice ethics, global and online marketing</h3><p class="muted small">Open the CLEP® hub in the Marketing app for the full set.</p><a class="btn" href="../app.html?course=mkt">Start studying</a></div></aside></main>`}));
out("guides/clep-marketing-exam-guide.html", page({depth:1, canon:"/guides/clep-marketing-exam-guide.html",
  title:"CLEP® Principles of Marketing Exam Guide: Format, Scores, Credit, Retakes | Credit Sprint",
  desc:"How the CLEP Principles of Marketing exam works: about 100 questions in 90 minutes, the main content areas, the passing score, credit, at-home testing and the retake policy.",
  body:`<main class="wrap doc"><article><p class="crumbs"><a href="../index.html">Credit Sprint</a> / <a href="index.html">Study guides</a> / CLEP® Marketing exam guide</p>
<h1>Credit Sprint's Guide to the CLEP® Principles of Marketing Exam</h1>
${KC.guide.map(sec=>`<h2>${esc(sec.h)}</h2><ul>${sec.p.map(p=>`<li>${esc(p)}</li>`).join("")}</ul>`).join("")}
<p class="muted small">Sources: ${KC.sources.map(([n,u])=>`<a href="${esc(u)}">${esc(n)}</a>`).join(" · ")}. Policies change; confirm details on the official CLEP® site.</p></article>
<aside><div class="panel"><h3>Get CLEP®-ready</h3><p class="muted small">About 100 questions in 90 minutes. Practice with a full-length timed exam in the Marketing app.</p><a class="btn" href="../app.html?course=mkt">Start studying</a></div></aside></main>`}));

/* ---------- U.S. History guide pages (AP + CLEP) ---------- */
const HQ = WH.CS_QUESTIONS_RAW, HU = WH.CS_UNITS;
const hqsFor = u => HQ.map((q,i)=>({q,i,F:null})).filter(x=>x.q[0]===u);
const hGuideLinks = [];
HU.forEach(u => {
  const file = `guides/us-history-period-${u.id}-${slug(u.name.replace(/^Period \d+:\s*/,""))}.html`; hGuideLinks.push({file, u});
  const sample = hqsFor(u.id).filter((_,k)=>k%5===0).slice(0,5), cards = WH.CS_CARDS_RAW.filter(c=>c[0]===u.id);
  const fig = WH.CS_FIGS && WH.CS_FIGS[u.graph] ? WH.CS_FIGS[u.graph](0) : "";
  out(file, page({depth:1, canon:"/"+file,
    title:`U.S. History ${u.name} Study Guide (AP® and CLEP®) | Credit Sprint`,
    desc:`Free study guide for AP U.S. History ${u.name}: key ideas, exam traps, key terms and practice questions with explanations, also useful for CLEP History of the U.S.`,
    ld:{"@context":"https://schema.org","@type":"LearningResource","name":`U.S. History ${u.name}`,"educationalLevel":"High school / introductory college","provider":{"@type":"Organization","name":"Credit Sprint","url":SITE}},
    body:`<main class="wrap doc"><article>
<p class="crumbs"><a href="../index.html">Credit Sprint</a> / <a href="index.html">Study guides</a> / U.S. History ${esc(u.name.split(":")[0])}</p>
<h1>Credit Sprint's Guide to U.S. History, ${esc(u.name)}</h1>
<div class="row-wrap"><span class="tag good">AP® weight ${u.ap}</span><span class="tag">CLEP® ${u.clep}</span></div>
<p style="font-size:1.08rem">${esc(u.summary)}</p>
${fig ? `<div class="figure" style="max-width:460px">${fig}</div>` : ""}
<h2>What you need to know</h2><ul>${u.points.map(p=>`<li>${esc(p)}</li>`).join("")}</ul>
<h2>Exam traps</h2>${u.traps.map(t=>`<div class="trap"><b>Watch for</b>${esc(t)}</div>`).join("")}
<h2>Key terms</h2><ul>${cards.slice(0,16).map(c=>`<li><b>${esc(c[1])}:</b> ${esc(c[2])}</li>`).join("")}</ul>
<h2>Practice questions</h2><p class="muted">Five of the ${hqsFor(u.id).length} ${esc(u.name.split(":")[0])} questions in Credit Sprint. Every choice is explained in the app.</p>
${sample.map((x,k)=>qBlock(x,k+1)).join("")}
</article>
<aside><div class="panel"><h3>Practice ${esc(u.name.split(":")[0])} free</h3><p class="muted small">${hqsFor(u.id).length} questions, flashcards, a boss battle, SAQ, LEQ and DBQ practice and a study plan built around your weak spots.</p><a class="btn" href="../app.html?course=apush">Start studying</a></div>
<div class="panel flat"><span class="eyebrow">All U.S. History periods</span>${HU.map(v=>`<a href="${path.basename(hGuideLinks.find(l=>l.u.id===v.id)?hGuideLinks.find(l=>l.u.id===v.id).file:"")||"#"}" style="${v.id===u.id?"font-weight:800;color:var(--ink)":""}">${esc(v.name)}</a>`).join("")}</div></aside></main>`}));
});
const HC = WH.CS_CLEP;
out("guides/clep-us-history-social-cultural.html", page({depth:1, canon:"/guides/clep-us-history-social-cultural.html",
  title:"Social and Cultural History Study Guide (CLEP® History of the U.S.) | Credit Sprint",
  desc:"Free study guide to social and cultural history for AP U.S. History and CLEP History of the United States, with practice questions.",
  body:`<main class="wrap doc"><article><p class="crumbs"><a href="../index.html">Credit Sprint</a> / <a href="index.html">Study guides</a> / Social and cultural history</p>
<h1>Credit Sprint's Guide to Social and Cultural History for CLEP® U.S. History</h1><span class="tag good" style="align-self:flex-start">${esc(HC.growth.weight)}</span>
<p style="font-size:1.08rem">${esc(HC.growth.summary)}</p><h2>What you need to know</h2><ul>${HC.growth.points.map(p=>`<li>${esc(p)}</li>`).join("")}</ul>
<h2>Practice questions</h2>${HQ.map((q,i)=>({q,i,F:null})).filter(x=>HC.growth.match.test(x.q[1]+" "+x.q[2][0])).slice(0,6).map((x,k)=>qBlock(x,k+1)).join("")}</article>
<aside><div class="panel"><h3>Practice social and cultural history</h3><p class="muted small">Open the CLEP® hub in the U.S. History app for the full set.</p><a class="btn" href="../app.html?course=apush">Start studying</a></div></aside></main>`}));
out("guides/clep-us-history-exam-guide.html", page({depth:1, canon:"/guides/clep-us-history-exam-guide.html",
  title:"CLEP® History of the United States Exam Guide: Format, Scores, Credit, Retakes | Credit Sprint",
  desc:"How the CLEP History of the United States I and II exams work: about 120 questions in 90 minutes, the content areas, the passing score, credit, at-home testing and the retake policy.",
  body:`<main class="wrap doc"><article><p class="crumbs"><a href="../index.html">Credit Sprint</a> / <a href="index.html">Study guides</a> / CLEP® U.S. History exam guide</p>
<h1>Credit Sprint's Guide to the CLEP® History of the United States Exams</h1>
${HC.guide.map(sec=>`<h2>${esc(sec.h)}</h2><ul>${sec.p.map(p=>`<li>${esc(p)}</li>`).join("")}</ul>`).join("")}
<p class="muted small">Sources: ${HC.sources.map(([n,u])=>`<a href="${esc(u)}">${esc(n)}</a>`).join(" · ")}. Policies change; confirm details on the official CLEP® site.</p></article>
<aside><div class="panel"><h3>Get CLEP®-ready</h3><p class="muted small">About 120 questions in 90 minutes. Practice with a full-length timed exam in the U.S. History app.</p><a class="btn" href="../app.html?course=apush">Start studying</a></div></aside></main>`}));
/* ---------- World History guide pages (AP only) ---------- */
const WQ = WW.CS_QUESTIONS_RAW, WU = WW.CS_UNITS;
const wqsFor = u => WQ.map((q,i)=>({q,i,F:null})).filter(x=>x.q[0]===u);
const wGuideLinks = [];
WU.forEach(u => {
  const file = `guides/world-history-unit-${u.id}-${slug(u.name.replace(/^Unit \d+:\s*/,""))}.html`; wGuideLinks.push({file, u});
  const sample = wqsFor(u.id).filter((_,k)=>k%5===0).slice(0,5), cards = WW.CS_CARDS_RAW.filter(c=>c[0]===u.id);
  const fig = WW.CS_FIGS && WW.CS_FIGS[u.graph] ? WW.CS_FIGS[u.graph](0) : "";
  out(file, page({depth:1, canon:"/"+file,
    title:`AP® World History ${u.name.split(":")[0]}: ${u.short} Study Guide | Credit Sprint`,
    desc:`Free study guide for AP World History: Modern ${u.name}: key ideas, exam traps, key terms and practice questions with explanations.`,
    ld:{"@context":"https://schema.org","@type":"LearningResource","name":`AP World History ${u.name}`,"educationalLevel":"High school","provider":{"@type":"Organization","name":"Credit Sprint","url":SITE}},
    body:`<main class="wrap doc"><article>
<p class="crumbs"><a href="../index.html">Credit Sprint</a> / <a href="index.html">Study guides</a> / World History ${esc(u.name.split(":")[0])}</p>
<h1>Credit Sprint's Guide to AP® World History, ${esc(u.name)}</h1>
<div class="row-wrap"><span class="tag good">AP® weight ${u.ap}</span></div>
<p style="font-size:1.08rem">${esc(u.summary)}</p>
${fig ? `<div class="figure" style="max-width:460px">${fig}</div>` : ""}
<h2>What you need to know</h2><ul>${u.points.map(p=>`<li>${esc(p)}</li>`).join("")}</ul>
<h2>Exam traps</h2>${u.traps.map(t=>`<div class="trap"><b>Watch for</b>${esc(t)}</div>`).join("")}
<h2>Key terms</h2><ul>${cards.slice(0,16).map(c=>`<li><b>${esc(c[1])}:</b> ${esc(c[2])}</li>`).join("")}</ul>
<h2>Practice questions</h2><p class="muted">Five of the ${wqsFor(u.id).length} ${esc(u.name.split(":")[0])} questions in Credit Sprint. Every choice is explained in the app.</p>
${sample.map((x,k)=>qBlock(x,k+1)).join("")}
</article>
<aside><div class="panel"><h3>Practice ${esc(u.name.split(":")[0])} free</h3><p class="muted small">${wqsFor(u.id).length} questions, flashcards, a boss battle, SAQ, LEQ and DBQ practice and a study plan built around your weak spots.</p><a class="btn" href="../app.html?course=apworld">Start studying</a></div>
<div class="panel flat"><span class="eyebrow">All World History units</span>${WU.map(v=>`<a href="${path.basename(wGuideLinks.find(l=>l.u.id===v.id)?wGuideLinks.find(l=>l.u.id===v.id).file:"")||"#"}" style="${v.id===u.id?"font-weight:800;color:var(--ink)":""}">${esc(v.name)}</a>`).join("")}</div></aside></main>`}));
});
/* ---------- U.S. Government guide pages ---------- */
const GQ = WG.CS_QUESTIONS_RAW, GU = WG.CS_UNITS;
const gqsFor = u => GQ.map((q,i)=>({q,i,F:null})).filter(x=>x.q[0]===u);
const gGuideLinks = [];
GU.forEach(u => {
  const file = `guides/us-government-unit-${u.id}-${slug(u.name.replace(/^Unit \d+:\s*/,""))}.html`; gGuideLinks.push({file, u});
  const sample = gqsFor(u.id).filter((_,k)=>k%5===0).slice(0,5), cards = WG.CS_CARDS_RAW.filter(c=>c[0]===u.id);
  const fig = WG.CS_FIGS && WG.CS_FIGS[u.graph] ? WG.CS_FIGS[u.graph](0) : "";
  out(file, page({depth:1, canon:"/"+file,
    title:`AP® U.S. Government and Politics ${u.name.split(":")[0]}: ${u.short} Study Guide | Credit Sprint`,
    desc:`Free study guide for AP U.S. Government and Politics and CLEP American Government ${u.name}: key ideas, exam traps, key terms and practice questions with explanations.`,
    ld:{"@context":"https://schema.org","@type":"LearningResource","name":`AP U.S. Government and Politics ${u.name}`,"educationalLevel":"High school","provider":{"@type":"Organization","name":"Credit Sprint","url":SITE}},
    body:`<main class="wrap doc"><article>
<p class="crumbs"><a href="../index.html">Credit Sprint</a> / <a href="index.html">Study guides</a> / U.S. Government ${esc(u.name.split(":")[0])}</p>
<h1>Credit Sprint's Guide to AP® U.S. Government and Politics, ${esc(u.name)}</h1>
<div class="row-wrap"><span class="tag good">AP® weight ${u.ap}</span><span class="tag">CLEP® ${esc(u.clep)}</span></div>
<p style="font-size:1.08rem">${esc(u.summary)}</p>
${fig ? `<div class="figure" style="max-width:460px">${fig}</div>` : ""}
<h2>What you need to know</h2><ul>${u.points.map(p=>`<li>${esc(p)}</li>`).join("")}</ul>
<h2>Exam traps</h2>${u.traps.map(t=>`<div class="trap"><b>Watch for</b>${esc(t)}</div>`).join("")}
<h2>Key terms</h2><ul>${cards.slice(0,16).map(c=>`<li><b>${esc(c[1])}:</b> ${esc(c[2])}</li>`).join("")}</ul>
<h2>Practice questions</h2><p class="muted">Five of the ${gqsFor(u.id).length} ${esc(u.name.split(":")[0])} questions in Credit Sprint. Every choice is explained in the app.</p>
${sample.map((x,k)=>qBlock(x,k+1)).join("")}
</article>
<aside><div class="panel"><h3>Practice ${esc(u.name.split(":")[0])} free</h3><p class="muted small">${gqsFor(u.id).length} questions, flashcards, a boss battle, free-response practice and a study plan built around your weak spots.</p><a class="btn" href="../app.html?course=apgov">Start studying</a></div>
<div class="panel flat"><span class="eyebrow">All U.S. Government units</span>${GU.map(v=>`<a href="${path.basename(gGuideLinks.find(l=>l.u.id===v.id)?gGuideLinks.find(l=>l.u.id===v.id).file:"")||"#"}" style="${v.id===u.id?"font-weight:800;color:var(--ink)":""}">${esc(v.name)}</a>`).join("")}</div></aside></main>`}));
});
/* ---------- Psychology guide pages ---------- */
const YQ = WY.CS_QUESTIONS_RAW, YU = WY.CS_UNITS;
const yqsFor = u => YQ.map((q,i)=>({q,i,F:null})).filter(x=>x.q[0]===u);
const yGuideLinks = [];
YU.forEach(u => {
  const file = `guides/psychology-unit-${u.id}-${slug(u.name.replace(/^Unit \d+:\s*/,""))}.html`; yGuideLinks.push({file, u});
  const sample = yqsFor(u.id).filter((_,k)=>k%5===0).slice(0,5), cards = WY.CS_CARDS_RAW.filter(c=>c[0]===u.id);
  const fig = WY.CS_FIGS && WY.CS_FIGS[u.graph] ? WY.CS_FIGS[u.graph](0) : "";
  out(file, page({depth:1, canon:"/"+file,
    title:`AP® Psychology ${u.name.split(":")[0]}: ${u.short} Study Guide | Credit Sprint`,
    desc:`Free study guide for AP Psychology and CLEP Introductory Psychology ${u.name}: key ideas, exam traps, key terms and practice questions with explanations.`,
    ld:{"@context":"https://schema.org","@type":"LearningResource","name":`AP Psychology ${u.name}`,"educationalLevel":"High school","provider":{"@type":"Organization","name":"Credit Sprint","url":SITE}},
    body:`<main class="wrap doc"><article>
<p class="crumbs"><a href="../index.html">Credit Sprint</a> / <a href="index.html">Study guides</a> / Psychology ${esc(u.name.split(":")[0])}</p>
<h1>Credit Sprint's Guide to AP® Psychology, ${esc(u.name)}</h1>
<div class="row-wrap"><span class="tag good">AP® weight ${u.ap}</span><span class="tag">CLEP® ${esc(u.clep)}</span></div>
<p style="font-size:1.08rem">${esc(u.summary)}</p>
${fig ? `<div class="figure" style="max-width:460px">${fig}</div>` : ""}
<h2>What you need to know</h2><ul>${u.points.map(p=>`<li>${esc(p)}</li>`).join("")}</ul>
<h2>Exam traps</h2>${u.traps.map(t=>`<div class="trap"><b>Watch for</b>${esc(t)}</div>`).join("")}
<h2>Key terms</h2><ul>${cards.slice(0,16).map(c=>`<li><b>${esc(c[1])}:</b> ${esc(c[2])}</li>`).join("")}</ul>
<h2>Practice questions</h2><p class="muted">Five of the ${yqsFor(u.id).length} ${esc(u.name.split(":")[0])} questions in Credit Sprint. Every choice is explained in the app.</p>
${sample.map((x,k)=>qBlock(x,k+1)).join("")}
</article>
<aside><div class="panel"><h3>Practice ${esc(u.name.split(":")[0])} free</h3><p class="muted small">${yqsFor(u.id).length} questions, flashcards, a boss battle, free-response practice and a study plan built around your weak spots.</p><a class="btn" href="../app.html?course=appsych">Start studying</a></div>
<div class="panel flat"><span class="eyebrow">All Psychology units</span>${YU.map(v=>`<a href="${path.basename(yGuideLinks.find(l=>l.u.id===v.id)?yGuideLinks.find(l=>l.u.id===v.id).file:"")||"#"}" style="${v.id===u.id?"font-weight:800;color:var(--ink)":""}">${esc(v.name)}</a>`).join("")}</div></aside></main>`}));
});
/* ---------- English guide pages (Literature and Language) ---------- */
const engGuide = (Wd, ck, label, apName, clepName) => {
  const QQ = Wd.CS_QUESTIONS_RAW, UU = Wd.CS_UNITS, links = [];
  /* sample questions: short ones that stand alone (no reading passage), skipping plain definitions */
  const forU = u => QQ.map((q,i)=>({q,i,F:null})).filter(x=>x.q[0]===u);
  const samp = u => forU(u).filter(x=>!(x.q[4]&&x.q[4].p) && !/^Which (term best fits|statement best describes)/.test(x.q[1]));
  UU.forEach(u => {
    const file = `guides/${slug(label)}-unit-${u.id}-${slug(u.name)}.html`; links.push({file, u});
    let sample = samp(u.id).slice(0,5); if (sample.length < 3) sample = sample.concat(forU(u.id).filter(x=>!(x.q[4]&&x.q[4].p)).slice(0, 5 - sample.length));
    const cards = Wd.CS_CARDS_RAW.filter(c=>c[0]===u.id), fig = Wd.CS_FIGS && Wd.CS_FIGS[u.graph] ? Wd.CS_FIGS[u.graph](0) : "";
    const nP = new Set(forU(u.id).filter(x=>x.q[4]&&x.q[4].p).map(x=>x.q[4].p)).size;
    out(file, page({depth:1, canon:"/"+file,
      title:`${apName} Unit ${u.id}: ${u.short} Study Guide | Credit Sprint`,
      desc:`Free study guide for ${apName.replace(/®/g,"")} and ${clepName.replace(/®/g,"")} Unit ${u.id}, ${u.name}: key ideas, exam traps, key terms and practice questions with explanations.`,
      ld:{"@context":"https://schema.org","@type":"LearningResource","name":`${apName.replace(/®/g,"")} Unit ${u.id}: ${u.name}`,"educationalLevel":"High school","provider":{"@type":"Organization","name":"Credit Sprint","url":SITE}},
      body:`<main class="wrap doc"><article>
<p class="crumbs"><a href="../index.html">Credit Sprint</a> / <a href="index.html">Study guides</a> / ${esc(label)} Unit ${u.id}</p>
<h1>Credit Sprint's Guide to ${apName}, Unit ${u.id}: ${esc(u.name)}</h1>
<div class="row-wrap"><span class="tag good">AP® ${esc(u.ap)}</span><span class="tag">CLEP® ${esc(u.clep)}</span></div>
<p style="font-size:1.08rem">${esc(u.summary)}</p>
${fig ? `<div class="figure" style="max-width:460px">${fig}</div>` : ""}
<h2>What you need to know</h2><ul>${u.points.map(p=>`<li>${esc(p)}</li>`).join("")}</ul>
<h2>Exam traps</h2>${u.traps.map(t=>`<div class="trap"><b>Watch for</b>${esc(t)}</div>`).join("")}
<h2>Key terms</h2><ul>${cards.slice(0,16).map(c=>`<li><b>${esc(c[1])}:</b> ${esc(c[2])}</li>`).join("")}</ul>
<h2>Practice questions</h2><p class="muted">A few of the ${forU(u.id).length} Unit ${u.id} questions in Credit Sprint${nP ? `, which also include ${nP} full reading passages with question sets` : ""}. Every choice is explained in the app.</p>
${sample.map((x,k)=>qBlock(x,k+1)).join("")}
</article>
<aside><div class="panel"><h3>Practice Unit ${u.id} free</h3><p class="muted small">${forU(u.id).length} questions, flashcards, a boss battle, essay practice with sample essays and a study plan built around your weak spots.</p><a class="btn" href="../app.html?course=${ck}">Start studying</a></div>
<div class="panel flat"><span class="eyebrow">All ${esc(label)} units</span>${UU.map(v=>`<a href="${path.basename(`guides/${slug(label)}-unit-${v.id}-${slug(v.name)}.html`)}" style="${v.id===u.id?"font-weight:800;color:var(--ink)":""}">Unit ${v.id}: ${esc(v.name)}</a>`).join("")}</div></aside></main>`}));
  });
  return links;
};
const litGuideLinks = engGuide(WL, "aplit", "English Literature", "AP® English Literature", "CLEP® Analyzing and Interpreting Literature");
const langGuideLinks = engGuide(WN, "aplang", "English Language", "AP® English Language", "CLEP® College Composition");
/* ---------- Statistics guide pages ---------- */
const SQ = WS.CS_QUESTIONS_RAW, SU = WS.CS_UNITS;
const sqsFor = u => SQ.map((q,i)=>({q,i,F:null})).filter(x=>x.q[0]===u);
const sGuideLinks = [];
SU.forEach(u => {
  const file = `guides/statistics-unit-${u.id}-${slug(u.name.replace(/^Unit \d+:\s*/,""))}.html`; sGuideLinks.push({file, u});
  const sample = sqsFor(u.id).filter((_,k)=>k%5===0).slice(0,5), cards = WS.CS_CARDS_RAW.filter(c=>c[0]===u.id);
  const fig = WS.CS_FIGS && WS.CS_FIGS[u.graph] ? WS.CS_FIGS[u.graph](0) : "";
  out(file, page({depth:1, canon:"/"+file,
    title:`AP® Statistics ${u.name.split(":")[0]}: ${u.short} Study Guide | Credit Sprint`,
    desc:`Free study guide for AP Statistics ${u.name}: key ideas, exam traps, key terms and practice questions with explanations.`,
    ld:{"@context":"https://schema.org","@type":"LearningResource","name":`AP Statistics ${u.name}`,"educationalLevel":"High school","provider":{"@type":"Organization","name":"Credit Sprint","url":SITE}},
    body:`<main class="wrap doc"><article>
<p class="crumbs"><a href="../index.html">Credit Sprint</a> / <a href="index.html">Study guides</a> / Statistics ${esc(u.name.split(":")[0])}</p>
<h1>Credit Sprint's Guide to AP® Statistics, ${esc(u.name)}</h1>
<div class="row-wrap"><span class="tag good">AP® weight ${u.ap}</span></div>
<p style="font-size:1.08rem">${esc(u.summary)}</p>
${fig ? `<div class="figure" style="max-width:460px">${fig}</div>` : ""}
<h2>What you need to know</h2><ul>${u.points.map(p=>`<li>${esc(p)}</li>`).join("")}</ul>
<h2>Exam traps</h2>${u.traps.map(t=>`<div class="trap"><b>Watch for</b>${esc(t)}</div>`).join("")}
<h2>Key terms</h2><ul>${cards.slice(0,16).map(c=>`<li><b>${esc(c[1])}:</b> ${esc(c[2])}</li>`).join("")}</ul>
<h2>Practice questions</h2><p class="muted">Five of the ${sqsFor(u.id).length} ${esc(u.name.split(":")[0])} questions in Credit Sprint. Every choice is explained in the app.</p>
${sample.map((x,k)=>qBlock(x,k+1)).join("")}
</article>
<aside><div class="panel"><h3>Practice ${esc(u.name.split(":")[0])} free</h3><p class="muted small">${sqsFor(u.id).length} questions, flashcards, a boss battle, free-response practice and a study plan built around your weak spots.</p><a class="btn" href="../app.html?course=apstat">Start studying</a></div>
<div class="panel flat"><span class="eyebrow">All Statistics units</span>${SU.map(v=>`<a href="${path.basename(sGuideLinks.find(l=>l.u.id===v.id)?sGuideLinks.find(l=>l.u.id===v.id).file:"")||"#"}" style="${v.id===u.id?"font-weight:800;color:var(--ink)":""}">${esc(v.name)}</a>`).join("")}</div></aside></main>`}));
});
/* ---------- Calculus guide pages (units 1–8: AB and BC; units 9–10: BC) ---------- */
const CALC_Q = WCB.CS_QUESTIONS_RAW, CALC_U = WCB.CS_UNITS;
const calcQsFor = u => CALC_Q.map((q,i)=>({q,i,F:null})).filter(x=>x.q[0]===u);
const calcGuideLinks = [];
CALC_U.forEach(u => {
  const file = `guides/calculus-unit-${u.id}-${slug(u.name.replace(/^Unit \d+:\s*/,""))}.html`; calcGuideLinks.push({file, u});
  const bcOnly = u.id > 8, label = bcOnly ? "AP® Calculus BC" : "AP® Calculus AB and BC", ck = bcOnly ? "calcbc" : "calcab";
  const abU = WCA.CS_UNITS.find(x=>x.id===u.id);
  const sample = calcQsFor(u.id).filter((_,k)=>k%7===0).slice(0,5), cards = WCB.CS_CARDS_RAW.filter(c=>c[0]===u.id);
  const fig = WCB.CS_FIGS && WCB.CS_FIGS[u.graph] ? WCB.CS_FIGS[u.graph](0) : "";
  out(file, page({depth:1, canon:"/"+file,
    title:`${bcOnly ? "AP® Calculus BC" : "AP® Calculus"} ${u.name.split(":")[0]}: ${u.short} Study Guide | Credit Sprint`,
    desc:`Free study guide for ${label.replace(/®/g,"")} ${u.name}: key ideas, formulas, exam traps, key terms and practice questions with explanations.`,
    ld:{"@context":"https://schema.org","@type":"LearningResource","name":`${label.replace(/®/g,"")} ${u.name}`,"educationalLevel":"High school","provider":{"@type":"Organization","name":"Credit Sprint","url":SITE}},
    body:`<main class="wrap doc"><article>
<p class="crumbs"><a href="../index.html">Credit Sprint</a> / <a href="index.html">Study guides</a> / Calculus ${esc(u.name.split(":")[0])}</p>
<h1>Credit Sprint's Guide to ${label}, ${esc(u.name)}</h1>
<div class="row-wrap">${abU ? `<span class="tag good">AB weight ${abU.ap}</span>` : ""}<span class="tag good">BC weight ${u.ap}</span>${abU && abU.clep ? `<span class="tag">CLEP® ${esc(abU.clep)}</span>` : ""}</div>
<p style="font-size:1.08rem">${esc(u.summary)}</p>
${fig ? `<div class="figure" style="max-width:460px">${fig}</div>` : ""}
<h2>What you need to know</h2><ul>${u.points.map(p=>`<li>${esc(p)}</li>`).join("")}</ul>
<h2>Formulas</h2><ul>${(u.formulas||[]).map(p=>`<li>${esc(p)}</li>`).join("")}</ul>
<h2>Exam traps</h2>${u.traps.map(t=>`<div class="trap"><b>Watch for</b>${esc(t)}</div>`).join("")}
<h2>Key terms</h2><ul>${cards.slice(0,16).map(c=>`<li><b>${esc(c[1])}:</b> ${esc(c[2])}</li>`).join("")}</ul>
<h2>Practice questions</h2><p class="muted">Five of the ${calcQsFor(u.id).length} ${esc(u.name.split(":")[0])} questions in Credit Sprint. Every choice is explained in the app.</p>
${sample.map((x,k)=>qBlock(x,k+1)).join("")}
</article>
<aside><div class="panel"><h3>Practice ${esc(u.name.split(":")[0])} free</h3><p class="muted small">${calcQsFor(u.id).length} questions, flashcards, a boss battle, free-response practice and a study plan built around your weak spots.</p><a class="btn" href="../app.html?course=${ck}">Start studying</a>${bcOnly ? "" : `<a class="btn ghost" style="margin-top:8px" href="../app.html?course=calcbc">Taking BC? Study BC</a>`}</div>
<div class="panel flat"><span class="eyebrow">All Calculus units</span>${CALC_U.map(v=>`<a href="${path.basename(`guides/calculus-unit-${v.id}-${slug(v.name.replace(/^Unit \d+:\s*/,""))}.html`)}" style="${v.id===u.id?"font-weight:800;color:var(--ink)":""}">${esc(v.name)}${v.id > 8 ? " (BC)" : ""}</a>`).join("")}</div></aside></main>`}));
});
/* guides hub */
out("guides/index.html", page({depth:1, canon:"/guides/index.html",
  title:"Free AP® and CLEP® Study Guides for 14 Subjects | Credit Sprint",
  desc:"Free unit-by-unit study guides for Macroeconomics, Microeconomics, Biology, Chemistry, Marketing, U.S. History, World History, U.S. Government, Psychology, Statistics, Calculus AB and BC, English Literature and English Language, with key ideas, exam traps and practice questions.",
  body:`<main class="wrap" style="padding-block:44px 64px;display:flex;flex-direction:column;gap:24px"><p class="crumbs"><a href="../index.html">Credit Sprint</a> / Study guides</p>
<h1>Study guides</h1><p class="muted" style="max-width:60ch">One guide per unit, matched to the AP® courses and CLEP® exams for all 14 Credit Sprint courses.</p>
<h2>English Literature</h2>
<div class="linkgrid">${litGuideLinks.map(({file,u})=>`<a href="${path.basename(file)}"><b>Unit ${u.id}: ${esc(u.name)}</b><span>AP® ${esc(u.ap)}</span></a>`).join("")}</div>
<h2>English Language</h2>
<div class="linkgrid">${langGuideLinks.map(({file,u})=>`<a href="${path.basename(file)}"><b>Unit ${u.id}: ${esc(u.name)}</b><span>AP® ${esc(u.ap)}</span></a>`).join("")}</div>
<h2>Calculus AB and BC</h2>
<div class="linkgrid">${calcGuideLinks.map(({file,u})=>`<a href="${path.basename(file)}"><b>${esc(u.name)}</b><span>${u.id > 8 ? "BC only · " : "AB · "}BC weight ${u.ap}</span></a>`).join("")}</div>
<h2>Statistics</h2>
<div class="linkgrid">${sGuideLinks.map(({file,u})=>`<a href="${path.basename(file)}"><b>${esc(u.name)}</b><span>AP® ${u.ap}</span></a>`).join("")}</div>
<h2>Psychology</h2>
<div class="linkgrid">${yGuideLinks.map(({file,u})=>`<a href="${path.basename(file)}"><b>${esc(u.name)}</b><span>AP® ${u.ap} · CLEP® ${u.clep}</span></a>`).join("")}</div>
<h2>U.S. Government</h2>
<div class="linkgrid">${gGuideLinks.map(({file,u})=>`<a href="${path.basename(file)}"><b>${esc(u.name)}</b><span>AP® ${u.ap} · CLEP® ${u.clep}</span></a>`).join("")}</div>
<h2>World History</h2>
<div class="linkgrid">${wGuideLinks.map(({file,u})=>`<a href="${path.basename(file)}"><b>${esc(u.name.split(",")[0])}</b><span>AP® ${u.ap}</span></a>`).join("")}</div>
<h2>U.S. History</h2>
<div class="linkgrid">${hGuideLinks.map(({file,u})=>`<a href="${path.basename(file)}"><b>${esc(u.name)}</b><span>AP® ${u.ap} · CLEP® ${u.clep}</span></a>`).join("")}
<a href="clep-us-history-social-cultural.html"><b>Social and Cultural History</b><span>CLEP® about 20%</span></a><a href="clep-us-history-exam-guide.html"><b>CLEP® U.S. History exam guide</b><span>Format, scores, retakes</span></a></div>
<h2>Marketing</h2>
<div class="linkgrid">${kGuideLinks.map(({file,u})=>`<a href="${path.basename(file)}"><b>Unit ${u.id}: ${esc(u.name)}</b><span>CLEP® ${u.clep}</span></a>`).join("")}
<a href="clep-marketing-ethics-global-online.html"><b>Ethics, Global and Online Marketing</b><span>CLEP® about 10–20%</span></a><a href="clep-marketing-exam-guide.html"><b>CLEP® Marketing exam guide</b><span>Format, scores, retakes</span></a></div>
<h2>Chemistry</h2>
<div class="linkgrid">${cGuideLinks.map(({file,u})=>`<a href="${path.basename(file)}"><b>Unit ${u.id}: ${esc(u.name)}</b><span>AP® ${u.ap} · CLEP® ${u.clep}</span></a>`).join("")}
<a href="clep-chemistry-descriptive-chemistry.html"><b>Descriptive and Experimental Chemistry</b><span>CLEP® about 23%</span></a><a href="clep-chemistry-exam-guide.html"><b>CLEP® Chemistry exam guide</b><span>Format, scores, retakes</span></a></div>
<h2>Biology</h2>
<div class="linkgrid">${bGuideLinks.map(({file,u})=>`<a href="${path.basename(file)}"><b>Unit ${u.id}: ${esc(u.name)}</b><span>AP® ${u.ap} · CLEP® ${u.clep}</span></a>`).join("")}
<a href="clep-biology-organismal-biology.html"><b>Organismal Biology</b><span>CLEP® about 34%</span></a><a href="clep-biology-exam-guide.html"><b>CLEP® Biology exam guide</b><span>Format, scores, retakes</span></a></div>
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
const BPRACTICE = [["hwq","Hardy-Weinberg allele frequency"],["hwhet","Hardy-Weinberg heterozygote frequency"],["chi","Chi-square"],["psi","Solute potential"],["sav","Surface area to volume ratio"],["map","Recombination frequency and map distance"],["logi","Logistic population growth"],["npp","Net primary productivity"],["simpson","Simpson's diversity index"]];
const bpLinks = [];
BPRACTICE.forEach(([k,name]) => {
  const d = WB.CS_DRILLS.find(x=>x.k===k); if (!d) return;
  const file = `practice/${slug(name)}-practice-problems.html`; bpLinks.push({file,name,u:d.u});
  const probs = Array.from({length:6}, () => d.gen());
  out(file, page({depth:1, canon:"/"+file,
    title:`${name} Practice Problems with Solutions (AP® Biology) | Credit Sprint`,
    desc:`Six worked ${name.toLowerCase()} practice problems for AP and CLEP biology, with step-by-step solutions. Unlimited new problems in the Credit Sprint app.`,
    body:`<main class="wrap doc"><article><p class="crumbs"><a href="../index.html">Credit Sprint</a> / <a href="index.html">Practice problems</a> / ${esc(name)}</p>
<h1>${esc(name)} practice problems</h1><p class="muted">Biology Unit ${d.u}. Try each one, then open the worked solution. The Credit Sprint app generates unlimited new versions with fresh numbers.</p>
${probs.map((c,i)=>`<div class="q"><b>Problem ${i+1}.</b><p>${esc(c.q)}</p><details><summary>Show solution</summary><p>${esc(c.work)}</p></details></div>`).join("")}</article>
<aside><div class="panel"><h3>Unlimited ${esc(name.toLowerCase())} problems</h3><p class="muted small">Fresh numbers every time, instant feedback, and a timed Number Crunch game.</p><a class="btn" href="../app.html?course=bio">Practice in the app</a></div></aside></main>`}));
});
const CPRACTICE = [["moles","Moles and molar mass"],["molarity","Molarity"],["dilute","Dilution"],["yield","Percent yield"],["ideal","Ideal gas law"],["heat","Heat and specific heat"],["ph","pH of strong acids"],["weak","Weak acid pH"],["dg","Gibbs free energy"],["ecell","Cell potential"]];
const cpLinks = [];
CPRACTICE.forEach(([k,name]) => {
  const d = WC.CS_DRILLS.find(x=>x.k===k); if (!d) return;
  const file = `practice/${slug(name)}-practice-problems.html`; cpLinks.push({file,name,u:d.u});
  const probs = Array.from({length:6}, () => d.gen());
  out(file, page({depth:1, canon:"/"+file,
    title:`${name} Practice Problems with Solutions (AP® Chemistry) | Credit Sprint`,
    desc:`Six worked ${name.toLowerCase()} practice problems for AP and CLEP chemistry, with step-by-step solutions. Unlimited new problems in the Credit Sprint app.`,
    body:`<main class="wrap doc"><article><p class="crumbs"><a href="../index.html">Credit Sprint</a> / <a href="index.html">Practice problems</a> / ${esc(name)}</p>
<h1>${esc(name)} practice problems</h1><p class="muted">Chemistry Unit ${d.u}. Try each one, then open the worked solution. The Credit Sprint app generates unlimited new versions with fresh numbers.</p>
${probs.map((c,i)=>`<div class="q"><b>Problem ${i+1}.</b><p>${esc(c.q)}</p><details><summary>Show solution</summary><p>${esc(c.work)}</p></details></div>`).join("")}</article>
<aside><div class="panel"><h3>Unlimited ${esc(name.toLowerCase())} problems</h3><p class="muted small">Fresh numbers every time, instant feedback, and a timed Number Crunch game.</p><a class="btn" href="../app.html?course=chem">Practice in the app</a></div></aside></main>`}));
});

const KPRACTICE = [["markupcost","Selling price from a markup"],["markupsp","Markup percent on selling price"],["markupon","Markup percent on cost"],["breakevenu","Break-even quantity"],["breakevend","Break-even sales dollars"],["profit","Profit at a given volume"],["elastic","Price elasticity of demand"],["revchange","Revenue after a price change"],["share","Market share"],["relshare","Relative market share"],["cpm","Cost per thousand (CPM)"],["ctr","Click-through rate"],["conv","Conversion rate"],["cash","Cash discount"],["turn","Inventory turnover"],["clv","Customer lifetime value"],["margin","Gross margin percent"]];
const kpLinks = [];
KPRACTICE.forEach(([k,name]) => {
  const d = WK.CS_DRILLS.find(x=>x.k===k); if (!d) return;
  const file = `practice/marketing-${slug(name)}-practice-problems.html`; kpLinks.push({file,name,u:d.u});
  const probs = Array.from({length:6}, () => d.gen());
  out(file, page({depth:1, canon:"/"+file,
    title:`${name} Practice Problems with Solutions (CLEP® Marketing) | Credit Sprint`,
    desc:`Six worked ${name.toLowerCase()} practice problems for CLEP Principles of Marketing, with step-by-step solutions. Unlimited new problems in the Credit Sprint app.`,
    body:`<main class="wrap doc"><article><p class="crumbs"><a href="../index.html">Credit Sprint</a> / <a href="index.html">Practice problems</a> / ${esc(name)}</p>
<h1>${esc(name)} practice problems</h1><p class="muted">Marketing Unit ${d.u}. Try each one, then open the worked solution. The Credit Sprint app generates unlimited new versions with fresh numbers.</p>
${probs.map((c,i)=>`<div class="q"><b>Problem ${i+1}.</b><p>${esc(c.q)}</p><details><summary>Show solution</summary><p>${esc(c.work)}</p></details></div>`).join("")}</article>
<aside><div class="panel"><h3>Unlimited ${esc(name.toLowerCase())} problems</h3><p class="muted small">Fresh numbers every time, instant feedback, and a timed Number Crunch game.</p><a class="btn" href="../app.html?course=mkt">Practice in the app</a></div></aside></main>`}));
});

const HPRACTICE = [["period","Name the AP period"],["gap","Years between events"],["order","Which came first"]];
const hpLinks = [];
HPRACTICE.forEach(([k,name]) => {
  const d = WH.CS_DRILLS.find(x=>x.k===k); if (!d) return;
  const file = `practice/us-history-${slug(name)}-practice-problems.html`; hpLinks.push({file,name,u:d.u});
  const probs = Array.from({length:6}, () => d.gen());
  out(file, page({depth:1, canon:"/"+file,
    title:`${name} Timeline Practice (AP® and CLEP® U.S. History) | Credit Sprint`,
    desc:`Six worked ${name.toLowerCase()} timeline practice items for AP U.S. History and CLEP History of the U.S. Unlimited new items in the Credit Sprint app.`,
    body:`<main class="wrap doc"><article><p class="crumbs"><a href="../index.html">Credit Sprint</a> / <a href="index.html">Practice problems</a> / ${esc(name)}</p>
<h1>${esc(name)}: timeline practice</h1><p class="muted">U.S. History. Try each one, then open the answer. The Credit Sprint app generates unlimited new versions.</p>
${probs.map((c,i)=>`<div class="q"><b>Item ${i+1}.</b><p>${esc(c.q)}</p><details><summary>Show answer</summary><p>${esc(c.work)}</p></details></div>`).join("")}</article>
<aside><div class="panel"><h3>Unlimited timeline practice</h3><p class="muted small">Fresh events every time, plus the Timeline Sort game.</p><a class="btn" href="../app.html?course=apush">Practice in the app</a></div></aside></main>`}));
});
const WPRACTICE = [["period","Name the AP era"],["gap","Years between events"],["order","Which came first"]];
const wpLinks = [];
WPRACTICE.forEach(([k,name]) => {
  const d = WW.CS_DRILLS.find(x=>x.k===k); if (!d) return;
  const file = `practice/world-history-${slug(name)}-practice-problems.html`; wpLinks.push({file,name,u:d.u});
  const probs = Array.from({length:6}, () => d.gen());
  out(file, page({depth:1, canon:"/"+file,
    title:`${name} Timeline Practice (AP® World History) | Credit Sprint`,
    desc:`Six worked ${name.toLowerCase()} timeline practice items for AP World History: Modern. Unlimited new items in the Credit Sprint app.`,
    body:`<main class="wrap doc"><article><p class="crumbs"><a href="../index.html">Credit Sprint</a> / <a href="index.html">Practice problems</a> / ${esc(name)}</p>
<h1>${esc(name)}: timeline practice</h1><p class="muted">World History. Try each one, then open the answer. The Credit Sprint app generates unlimited new versions.</p>
${probs.map((c,i)=>`<div class="q"><b>Item ${i+1}.</b><p>${esc(c.q)}</p><details><summary>Show answer</summary><p>${esc(c.work)}</p></details></div>`).join("")}</article>
<aside><div class="panel"><h3>Unlimited timeline practice</h3><p class="muted small">Fresh events every time, plus the Timeline Sort game.</p><a class="btn" href="../app.html?course=apworld">Practice in the app</a></div></aside></main>`}));
});
const GPRACTICE = [["override","Veto override votes"],["elec","State electoral votes"],["turnout","Turnout percent"],["moe","Margin of error range"]];
const gpLinks = [];
GPRACTICE.forEach(([k,name]) => {
  const d = WG.CS_DRILLS.find(x=>x.k===k); if (!d) return;
  const file = `practice/us-government-${slug(name)}-practice-problems.html`; gpLinks.push({file,name,u:d.u});
  const probs = Array.from({length:6}, () => d.gen());
  out(file, page({depth:1, canon:"/"+file,
    title:`${name} Practice (AP® U.S. Government) | Credit Sprint`,
    desc:`Six worked ${name.toLowerCase()} practice items for AP U.S. Government and Politics quantitative analysis and CLEP American Government. Unlimited new items in the Credit Sprint app.`,
    body:`<main class="wrap doc"><article><p class="crumbs"><a href="../index.html">Credit Sprint</a> / <a href="index.html">Practice problems</a> / ${esc(name)}</p>
<h1>${esc(name)}: practice</h1><p class="muted">U.S. Government. Try each one, then open the answer. The Credit Sprint app generates unlimited new versions.</p>
${probs.map((c,i)=>`<div class="q"><b>Item ${i+1}.</b><p>${esc(c.q)}</p><details><summary>Show answer</summary><p>${esc(c.work)}</p></details></div>`).join("")}</article>
<aside><div class="panel"><h3>Unlimited civics math</h3><p class="muted small">Fresh numbers every time, plus the Number Crunch game.</p><a class="btn" href="../app.html?course=apgov">Practice in the app</a></div></aside></main>`}));
});
const YPRACTICE = [["zscore","Z-scores"],["iq","IQ and standard deviations"],["median","Median"],["empirical","Normal curve percent"]];
const ypLinks = [];
YPRACTICE.forEach(([k,name]) => {
  const d = WY.CS_DRILLS.find(x=>x.k===k); if (!d) return;
  const file = `practice/psychology-${slug(name)}-practice-problems.html`; ypLinks.push({file,name,u:d.u});
  const probs = Array.from({length:6}, () => d.gen());
  out(file, page({depth:1, canon:"/"+file,
    title:`${name} Practice (AP® Psychology) | Credit Sprint`,
    desc:`Six worked ${name.toLowerCase()} practice items for AP Psychology statistics and CLEP Introductory Psychology. Unlimited new items in the Credit Sprint app.`,
    body:`<main class="wrap doc"><article><p class="crumbs"><a href="../index.html">Credit Sprint</a> / <a href="index.html">Practice problems</a> / ${esc(name)}</p>
<h1>${esc(name)}: practice</h1><p class="muted">Psychology. Try each one, then open the answer. The Credit Sprint app generates unlimited new versions.</p>
${probs.map((c,i)=>`<div class="q"><b>Item ${i+1}.</b><p>${esc(c.q)}</p><details><summary>Show answer</summary><p>${esc(c.work)}</p></details></div>`).join("")}</article>
<aside><div class="panel"><h3>Unlimited statistics practice</h3><p class="muted small">Fresh numbers every time, plus the Number Crunch game.</p><a class="btn" href="../app.html?course=appsych">Practice in the app</a></div></aside></main>`}));
});
const SPRACTICE = [["zscore","Z-scores"],["binmean","Binomial mean and SD"],["sep","Standard error of p-hat"],["tstat","One-sample t statistic"],["resid","Residuals"]];
const spLinks = [];
SPRACTICE.forEach(([k,name]) => {
  const d = WS.CS_DRILLS.find(x=>x.k===k); if (!d) return;
  const file = `practice/statistics-${slug(name)}-practice-problems.html`; spLinks.push({file,name,u:d.u});
  const probs = Array.from({length:6}, () => d.gen());
  out(file, page({depth:1, canon:"/"+file,
    title:`${name} Practice (AP® Statistics) | Credit Sprint`,
    desc:`Six worked ${name.toLowerCase()} practice items for AP Statistics. Unlimited new items in the Credit Sprint app.`,
    body:`<main class="wrap doc"><article><p class="crumbs"><a href="../index.html">Credit Sprint</a> / <a href="index.html">Practice problems</a> / ${esc(name)}</p>
<h1>${esc(name)}: practice</h1><p class="muted">Statistics. Try each one, then open the answer. The Credit Sprint app generates unlimited new versions.</p>
${probs.map((c,i)=>`<div class="q"><b>Item ${i+1}.</b><p>${esc(c.q)}</p><details><summary>Show answer</summary><p>${esc(c.work)}</p></details></div>`).join("")}</article>
<aside><div class="panel"><h3>Unlimited statistics practice</h3><p class="muted small">Fresh numbers every time, plus the Number Crunch game.</p><a class="btn" href="../app.html?course=apstat">Practice in the app</a></div></aside></main>`}));
});
const CALC_PRACTICE = [["limit-factor","Limits by factoring"],["chain-rule","Chain rule derivatives"],["related-rates","Related rates"],["riemann","Riemann sums"],["definite-integral","Definite integrals"],["disc-volume","Disc method volumes"],["euler","Euler's method"],["taylor-coef","Taylor coefficients"]];
const calcPLinks = [];
CALC_PRACTICE.forEach(([k,name]) => {
  const d = WCB.CS_DRILLS.find(x=>x.k===k); if (!d) return;
  const bcOnly = d.u > 8 || ["euler","taylor-coef"].includes(k);
  const file = `practice/calculus-${slug(name)}-practice-problems.html`; calcPLinks.push({file,name,u:d.u,bc:bcOnly});
  const probs = Array.from({length:6}, () => d.gen());
  out(file, page({depth:1, canon:"/"+file,
    title:`${name} Practice (AP® Calculus${bcOnly ? " BC" : ""}) | Credit Sprint`,
    desc:`Six worked ${name.toLowerCase()} practice problems for AP Calculus ${bcOnly ? "BC" : "AB and BC"}${bcOnly ? "" : " and CLEP Calculus"}. Unlimited new problems in the Credit Sprint app.`,
    body:`<main class="wrap doc"><article><p class="crumbs"><a href="../index.html">Credit Sprint</a> / <a href="index.html">Practice problems</a> / ${esc(name)}</p>
<h1>${esc(name)}: practice</h1><p class="muted">Calculus${bcOnly ? " BC" : ""}. Try each one, then open the answer. The Credit Sprint app generates unlimited new versions.</p>
${probs.map((c,i)=>`<div class="q"><b>Problem ${i+1}.</b><p>${esc(c.q)}</p><details><summary>Show answer</summary><p>${esc(c.work)}</p></details></div>`).join("")}</article>
<aside><div class="panel"><h3>Unlimited calculus practice</h3><p class="muted small">Fresh numbers every time, plus the Number Crunch game.</p><a class="btn" href="../app.html?course=${bcOnly ? "calcbc" : "calcab"}">Practice in the app</a></div></aside></main>`}));
});
out("practice/index.html", page({depth:1, canon:"/practice/index.html",
  title:"Free AP® and CLEP® Practice Problems with Worked Solutions | Credit Sprint",
  desc:"Free worked practice problems for Hardy-Weinberg, chi-square, water potential, elasticity, costs, profit, multipliers, money creation, inflation, real GDP and more.",
  body:`<main class="wrap" style="padding-block:44px 64px;display:flex;flex-direction:column;gap:24px"><p class="crumbs"><a href="../index.html">Credit Sprint</a> / Practice problems</p>
<h1>Practice problems</h1><p class="muted" style="max-width:60ch">Worked problems with step-by-step answers for every Credit Sprint subject, from economics and science formulas to history and government skills.</p>
<h2>Calculus</h2><div class="linkgrid">${calcPLinks.map(l=>`<a href="${path.basename(l.file)}"><b>${esc(l.name)}</b><span>Calculus${l.bc ? " BC" : ""} · 6 worked problems</span></a>`).join("")}</div>
<h2>Statistics</h2><div class="linkgrid">${spLinks.map(l=>`<a href="${path.basename(l.file)}"><b>${esc(l.name)}</b><span>Statistics · 6 worked problems</span></a>`).join("")}</div>
<h2>Psychology</h2><div class="linkgrid">${ypLinks.map(l=>`<a href="${path.basename(l.file)}"><b>${esc(l.name)}</b><span>Psychology · 6 worked problems</span></a>`).join("")}</div>
<h2>U.S. Government</h2><div class="linkgrid">${gpLinks.map(l=>`<a href="${path.basename(l.file)}"><b>${esc(l.name)}</b><span>U.S. Government · 6 worked problems</span></a>`).join("")}</div>
<h2>World History</h2><div class="linkgrid">${wpLinks.map(l=>`<a href="${path.basename(l.file)}"><b>${esc(l.name)}</b><span>World History · 6 timeline items</span></a>`).join("")}</div>
<h2>U.S. History</h2><div class="linkgrid">${hpLinks.map(l=>`<a href="${path.basename(l.file)}"><b>${esc(l.name)}</b><span>U.S. History · 6 timeline items</span></a>`).join("")}</div>
<h2>Marketing</h2><div class="linkgrid">${kpLinks.map(l=>`<a href="${path.basename(l.file)}"><b>${esc(l.name)}</b><span>Marketing Unit ${l.u} · 6 worked problems</span></a>`).join("")}</div>
<h2>Chemistry</h2><div class="linkgrid">${cpLinks.map(l=>`<a href="${path.basename(l.file)}"><b>${esc(l.name)}</b><span>Chemistry Unit ${l.u} · 6 worked problems</span></a>`).join("")}</div>
<h2>Biology</h2><div class="linkgrid">${bpLinks.map(l=>`<a href="${path.basename(l.file)}"><b>${esc(l.name)}</b><span>Biology Unit ${l.u} · 6 worked problems</span></a>`).join("")}</div>
<h2>Microeconomics</h2><div class="linkgrid">${mpLinks.map(l=>`<a href="${path.basename(l.file)}"><b>${esc(l.name)}</b><span>Micro Unit ${l.u} · 6 worked problems</span></a>`).join("")}</div>
<h2>Macroeconomics</h2><div class="linkgrid">${pLinks.map(l=>`<a href="${path.basename(l.file)}"><b>${esc(l.name)}</b><span>Unit ${l.u} · 6 worked problems</span></a>`).join("")}</div></main>`}));


/* ---------- legal pages ---------- */
const EFFECTIVE = "October 23, 2026", CONTACT = "support@creditsprintprep.com";
const legal = (file, title, desc, intro, sections) => out(file, page({canon:"/"+file, title:`${title} | Credit Sprint`, desc,
  body:`<main class="wrap doc legal"><article><p class="crumbs"><a href="index.html">Credit Sprint</a> / ${esc(title)}</p>
<h1>${esc(title)}</h1><p class="muted">Effective ${EFFECTIVE}</p>${intro}
${sections.map(([h, html]) => `<h2>${esc(h)}</h2>${html}`).join("\n")}
<h2>Contact us</h2><p>Questions about this page? Email <a href="mailto:${CONTACT}">${CONTACT}</a>.</p></article>
<aside><div class="panel flat"><span class="eyebrow">Legal</span><a href="privacy.html" style="${file==="privacy.html"?"font-weight:800;color:var(--ink)":""}">Privacy policy</a><a href="terms.html" style="${file==="terms.html"?"font-weight:800;color:var(--ink)":""}">Terms of service</a></div></aside></main>`}));
const ul = items => `<ul>${items.map(x=>`<li>${x}</li>`).join("")}</ul>`;
legal("privacy.html", "Privacy Policy", "How Credit Sprint collects, uses and protects information from students who use the site.",
  `<p style="font-size:1.05rem">Credit Sprint is a study site for AP® and CLEP® exams. We collect only what we need to run it, we don't sell personal information, and we don't show ads. This policy explains what we collect and what you can do about it.</p>`,
[
 ["What we collect", `<p><b>If you don't create an account</b>, your study progress (answers, scores, streaks, pets, settings) stays in your browser tab and is erased when you close it. We don't receive it.</p>
  <p><b>If you create an account</b>, we store:</p>${ul([
   "How you sign in: your email address (email codes), your Google account's email, account ID and first name (Google sign-in), or your username and a scrambled (hashed) version of your password. We never see or store your Google password, and we can't read your Credit Sprint password.",
   "The name you choose for leaderboards. We show it as your first name and last initial only.",
   "A profile picture, only if you upload one (this feature is coming soon). We shrink it to a small 128×128 image in your browser before it's sent, remove hidden photo data such as location, and check it automatically with our AI provider to make sure it's appropriate before other students can see it. If other students report it, we keep a record of who reported it so the same student can't report it twice.",
   "Your study progress, so it can sync between your devices, and the XP you earn each week for leagues.",
   "A sign-in cookie that keeps you signed in for up to 60 days."])}
  <p><b>When you use AI features</b> (the AI tutor or AI free-response scoring, coming soon), the question and the text you type are sent to our AI provider to generate a response. Don't include personal information in those messages.</p>
  <p><b>If you buy a paid plan</b>, payment is handled by our payment processor (Stripe). Stripe shares your purchase details with us (such as your email and the plan you bought), never your full card number.</p>
  <p><b>Basic technical information</b> such as IP address and browser type is processed by our hosting provider to deliver the site and protect it from abuse.</p>`],
 ["How we use it", ul(["To run your account, sign you in and sync your progress.","To run weekly leagues and leaderboards.","To send sign-in codes and essential account emails. We don't send marketing emails without your permission.","To keep the site secure, prevent cheating and abuse, and fix problems."])],
 ["What other students can see", `<p>In weekly leagues, other students in your group see your leaderboard name (first name and last initial), your profile picture if you uploaded one, and your XP for the week. They can't see your email, username, scores by unit or any other details.</p>`],
 ["Who we share it with", `<p>We don't sell or rent personal information. We share it only with service providers that help us run Credit Sprint, under their own privacy and security commitments:</p>${ul([
   "Cloudflare: website hosting and our database.","Resend: delivering sign-in code emails.","Google: Google sign-in, only if you choose it, and Google Fonts, which loads the site's fonts (Google receives your IP address when fonts load).","Anthropic: the AI tutor and AI scoring when you use them, and automatic screening of profile pictures you upload.","Stripe: payments, only if you buy a plan."])}
  <p>We may also share information if the law requires it, or to protect the safety of our users or the public.</p>`],
 ["Students under 13", `<p>Credit Sprint accounts are for people 13 and older, and you must confirm your age to create one. We don't knowingly collect personal information from children under 13. If you believe a child under 13 has created an account, email us and we'll delete it.</p>`],
 ["Your choices and rights", ul([
   "<b>Delete your account</b> any time: open the app, click your name in the sidebar, then Delete my account. This removes your account, saved progress, profile picture and league history from our servers.",
   "<b>Change your leaderboard name or remove your profile picture</b> from the same account window.",
   "<b>Try the site without an account.</b> Guest mode works without signing in, but guest progress isn't saved after you close the tab and guests can't join leagues.",
   "<b>Clear local progress</b> by using Reset all progress in Settings or clearing your browser data.",
   "Depending on where you live, you may have the right to access, correct or delete your information. Email us and we'll help."])],
 ["How long we keep it", `<p>We keep account information while your account exists. When you delete your account, we remove it from our database right away. Sign-in codes expire after 10 minutes, and sign-in sessions after 60 days.</p>`],
 ["Security", `<p>Connections to the site are encrypted (HTTPS), passwords are stored only as salted hashes, sign-in cookies can't be read by scripts on the page, and email codes expire quickly and allow only a few tries. No system is perfectly secure, so please use a password you don't use anywhere else.</p>`],
 ["Changes to this policy", `<p>If we make important changes, we'll update the date at the top and post a notice on the site.</p>`]
]);
legal("terms.html", "Terms of Service", "The rules for using Credit Sprint, the AP and CLEP economics study site.",
  `<p style="font-size:1.05rem">These terms are an agreement between you and Credit Sprint. By using the site, you agree to them. If you're under 18, please review them with a parent or guardian.</p>`,
[
 ["Who can use Credit Sprint", `<p>Anyone can try the site as a guest without an account. Saving progress and joining leagues require a free account. To create an account you must be at least 13 years old. If you're under 18, you need permission from a parent or guardian.</p>`],
 ["Your account", ul(["Keep your sign-in details private. You're responsible for activity on your account.","Give accurate information, and choose a leaderboard name that isn't offensive, misleading or someone else's.","Profile pictures must be school-appropriate. Don't upload pictures of other people, anything offensive or violent, or anything showing personal information like your address, phone number or school ID. Only upload pictures you have the right to use. We may remove pictures that break these rules, and pictures reported by several students are hidden automatically.","You can delete your account at any time from the account window in the app."])],
 ["Fair play", `<p>Leagues, leaderboards, season passes and rewards are for fun and motivation. Don't use bots, scripts, shared accounts or tricks to inflate your XP or anyone else's. We may reset progress, remove someone from a league or suspend an account that breaks these rules.</p>`],
 ["Acceptable use", ul(["Don't try to break, overload or get around the security of the site.","Don't copy, resell or republish our questions, guides or other content.","Don't use the AI tutor to generate anything unrelated to studying, or anything harmful."])],
 ["Our content", `<p>The questions, explanations, guides, games, pets and designs on Credit Sprint are original and belong to Credit Sprint. You may use them for your own personal studying. AP® and CLEP® are trademarks registered by the College Board, which is not affiliated with, and does not endorse, Credit Sprint.</p>`],
 ["No score guarantees", `<p>Credit Sprint is a study tool. Score estimates are rough guides, not official scores. We can't promise any particular exam score or that a college will award credit; each college sets its own policy. Check your college's AP® and CLEP® credit rules before you test.</p>`],
 ["AI features", `<p>The AI tutor and AI scoring are coming soon. When they launch, they can make mistakes. Use them as a second opinion, alongside the built-in explanations and official scoring guidelines.</p>`],
 ["Paid plans", ul(["Some features require a paid plan. The price and how long it lasts are shown before you pay. You need a free account to buy a plan, and your plan is tied to that account.","<b>Exam Passes</b> (one class, 3 classes or all classes) are one-time payments. They last until June 1 after the next May exams, and at least 6 months. One-time passes don't renew.","<b>Monthly plans</b> (1 class, 3 classes or all classes) renew every month until you cancel. Cancel anytime from your account; you keep access until the end of the month you paid for.","<b>Refunds:</b> if you're not happy, email us within 7 days of your first payment for a full refund. Refunded purchases lose access.","Payments are processed by Stripe. We never see or store your full card number. Prices may change, but a change never affects a pass you've already bought, and we'll tell subscribers before a monthly price changes."])],
 ["Ending your use", `<p>You can stop using Credit Sprint and delete your account at any time. We may suspend or end accounts that break these terms, and we may change or discontinue features as the site grows.</p>`],
 ["Disclaimers and limits", `<p>Credit Sprint is provided "as is." To the extent the law allows, we aren't liable for indirect or consequential losses, or for exam results, and our total liability is limited to the amount you paid us in the 12 months before the claim. Some places don't allow these limits, so they may not apply to you.</p>`],
 ["Governing law", `<p>These terms are governed by the laws of the State of Ohio, United States.</p>`],
 ["Changes to these terms", `<p>We may update these terms. If we make important changes, we'll update the date at the top and post a notice on the site. Continuing to use the site after that means you accept the new terms.</p>`]
]);

/* ---------- sitemap + robots ---------- */
const today = new Date().toISOString().slice(0,10);
urls.push("/app.html");
fs.writeFileSync(path.join(ROOT,"sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u=>`  <url><loc>${SITE}${u}</loc><lastmod>${today}</lastmod></url>`).join("\n")}\n</urlset>\n`);
/* question counts for the app's course cards, course picker, onboarding and sign-up (other courses' data isn't loaded in the app) */
const stat = w => ({q:w.CS_QUESTIONS_RAW.length, f:w.CS_FRQS.length, c:w.CS_CARDS_RAW.length, u:w.CS_UNITS.length});
fs.writeFileSync(path.join(ROOT,"assets/js/course-stats.js"), `/* Generated by scripts/build-site.js. Do not edit by hand. */\nwindow.CS_COURSE_STATS = ${JSON.stringify({macro:stat(W), micro:stat(WM), bio:stat(WB), chem:stat(WC), mkt:stat(WK), apush:stat(WH), apworld:stat(WW), apgov:stat(WG), appsych:stat(WY), apstat:stat(WS), aplit:stat(WL), aplang:stat(WN), calcab:stat(WCA), calcbc:stat(WCB)})};\n`);
fs.writeFileSync(path.join(ROOT,"robots.txt"), `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${SITE}/sitemap.xml\n`);
/* stamp the same version into app.html's CSS and script links */
const appPath = path.join(ROOT, "app.html");
require("./landing-options.js");
/* the home page look Adam chose (Academic: warm ivory, serif headlines, credit-savings focus). See scripts/landing-pro.js. */
{ const fp = path.join(ROOT, "index.html"); fs.writeFileSync(fp, require("./landing-pro.js").apply(fs.readFileSync(fp, "utf8"), "p3")); }
{ const tag = '<link rel="manifest" href="/manifest.webmanifest"><link rel="apple-touch-icon" href="/brand/credit-sprint-logo-512.png">';
  for (const f of ["index.html", "app.html"]) { const fp = path.join(ROOT, f); let h = fs.readFileSync(fp, "utf8"); if (!h.includes("manifest.webmanifest")) { h = h.replace('<meta name="theme-color"', tag + '<meta name="theme-color"'); if (!h.includes("manifest.webmanifest")) h = h.replace("</head>", tag + "</head>"); fs.writeFileSync(fp, h); } } }
fs.writeFileSync(appPath, fs.readFileSync(appPath, "utf8").replace(/\?v=[a-z0-9]+/g, "?v="+VER).replace(/window\.CS_V="[a-z0-9]*"/, 'window.CS_V="'+VER+'"'));
console.log("Built", urls.length, "pages", "· version", VER);
