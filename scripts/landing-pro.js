/* Professional home page designs. Takes the index.html that build-site.js writes and rebuilds the top of the page,
   reorders and tightens the sections, and applies one of three looks:
     p1  Clean & bright   white page, product screenshot beside the headline
     p2  Dark premium     deep navy hero, centred headline, glowing product shot
     p3  Academic         warm ivory, serif headlines, credit-savings focus
   build-site.js applies the chosen look (p3) to index.html every time it runs.
   Usage: node scripts/landing-pro.js            → (on an index.html built without a look) writes landing-p1/p2/p3.html previews
          require("./landing-pro").apply(html, "p1") → returns the finished page (used by build-site.js for the chosen look) */
const fs = require("fs"), path = require("path");

const C = [["macro","Macroeconomics","#4F46E5","AP® · CLEP®"],["micro","Microeconomics","#059669","AP® · CLEP®"],["bio","Biology","#0891B2","AP® · CLEP®"],
  ["chem","Chemistry","#EA580C","AP® · CLEP®"],["apush","U.S. History","#B91C1C","AP® · CLEP®"],["apworld","World History","#0F766E","AP®"],
  ["apgov","U.S. Government","#1E3A8A","AP® · CLEP®"],["appsych","Psychology","#7C3AED","AP® · CLEP®"],["apstat","Statistics","#0369A1","AP®"],["aplit","English Literature","#BE123C","AP® · CLEP®"],["aplang","English Language","#B45309","AP® · CLEP®"],["calcab","Calculus AB","#65A30D","AP® · CLEP®"],["calcbc","Calculus BC","#A21CAF","AP®"],["aphug","Human Geography","#15803D","AP®"],["mkt","Marketing","#DB2777","CLEP®"]];

/* find a top-level <section …> by a test on its opening tag or its text, return [start, end] */
function sectionAt(html, test) {
  let i = 0;
  while ((i = html.indexOf("<section", i)) >= 0) {
    const end = html.indexOf("</section>", i) + 10, chunk = html.slice(i, end);
    if (test(chunk)) return [i, end];
    i = end;
  }
  return null;
}
/* scripts that sit between sections (not inside one we copy) */
function scriptsOutside(body, scripts) { const kept = []; for (const sc of scripts) { const i = body.indexOf(sc); let inSec = false, j = 0;
  while ((j = body.indexOf("<section", j)) >= 0 && j < i) { const e = body.indexOf("</section>", j) + 10; if (i < e) { inSec = true; break; } j = e; }
  if (!inSec) kept.push(sc); } return kept.join("\n"); }
const take = (html, test) => { const r = sectionAt(html, test); return r ? html.slice(r[0], r[1]) : ""; };

function apply(html, look) {
  const stat = k => ((html.match(new RegExp(`<b>(\\d+)</b><span>${k}`)) || [])[1] || "");
  const nQ = (+stat("practice questions")).toLocaleString(), nF = stat("free-response prompts"), nC = (+stat("flashcards")).toLocaleString(), nG = stat("study games"), nP = stat("pets to collect");
  const mainOpen = html.indexOf("<main>") + 6, mainClose = html.indexOf("</main>");
  const body = html.slice(mainOpen, mainClose);
  /* keep every inline <style> block from the old body (the try-a-question and calculator widgets need them) */
  const styles = (body.match(/<style>[\s\S]*?<\/style>/g) || []).join("\n");
  /* …and every inline <script> outside the sections (they run the widgets) */
  const scripts = (body.match(/<script[\s\S]*?<\/script>/g) || []).filter(x => !Object.values({}).includes(x));
  const S = {
    try: take(body, s => /id="try"/.test(s)), pets: take(body, s => /id="pets"/.test(s)), calc: take(body, s => /id="calc"/.test(s)),
    team: take(body, s => /id="team"/.test(s)), features: take(body, s => /id="features"/.test(s)), games: take(body, s => /id="games"/.test(s)),
    how: take(body, s => /id="how"/.test(s)), pricing: take(body, s => /id="pricing"/.test(s)), faq: take(body, s => /id="faq"/.test(s)),
    cta: take(body, s => /cta-band/.test(s))
  };
  const shot = look === "p2" ? "assets/img/app-dashboard-dark.jpg" : "assets/img/app-dashboard-light.jpg";
  const chips = C.map(([k, n, c]) => `<a class="pro-chip" href="app.html?course=${k}" style="--cc:${c}"><i></i>${n}</a>`).join("");
  const proof = `<div class="pro-proof"><div><b>${nQ}</b><span>practice questions</span></div><div><b>${nF}</b><span>free-response prompts</span></div><div><b>${nC}</b><span>flashcards</span></div><div><b>${C.length}</b><span>AP® and CLEP® courses</span></div><div><b>$0</b><span>to start</span></div></div>`;
  const ctas = (light) => `<div class="pro-ctas"><a class="btn lg pro-main" href="app.html">Start free</a><a class="btn lg ghost ${light ? "" : "pro-ghost"}" href="#try">Try a question</a></div>`;
  const ticks = `<ul class="pro-ticks"><li>No credit card</li><li>Every answer explained</li><li>Built around your exam date</li></ul>`;
  const frame = (src, alt) => `<figure class="pro-shot"><div class="pro-bar"><i></i><i></i><i></i><span>creditsprintprep.com</span></div><img src="${src}" alt="${alt}" width="1400" height="788" loading="eager"></figure>`;

  const heroes = {
    p1: `<section class="pro-hero p1"><div class="wrap pro-split">
        <div class="pro-copy"><span class="pro-eyebrow">AP® and CLEP® prep for 15 subjects</span>
          <h1>Earn college credit with ten minutes a day.</h1>
          <p class="pro-lead">Practice questions with every answer explained, a diagnostic that finds your weak units, and a study plan built around your exam date.</p>
          ${ctas(true)}${ticks}</div>
        ${frame(shot, "The Credit Sprint dashboard: a unit map and the season pass")}</div>
        <div class="wrap"><div class="pro-chips"><span>Courses</span>${chips}</div></div></section>`,
    p2: `<section class="pro-hero p2"><div class="wrap pro-center">
        <span class="pro-eyebrow">AP® and CLEP® prep for 15 subjects</span>
        <h1>The study app that makes AP® and CLEP® prep <em>feel like a game.</em></h1>
        <p class="pro-lead">Unit maps, a season pass and weekly leagues keep you coming back. Every question is written for the real exam, with every answer explained.</p>
        ${ctas(false)}${ticks}
        ${frame(shot, "The Credit Sprint dashboard: a unit map and the season pass")}
        <div class="pro-chips dark">${chips}</div></div></section>`,
    p3: `<section class="pro-hero p3"><div class="wrap pro-split">
        <div class="pro-copy"><span class="pro-eyebrow">Independent AP® and CLEP® preparation</span>
          <h1>Turn the exams you're already taking into college credit.</h1>
          <p class="pro-lead">A passing AP® or CLEP® score can replace a semester-long college course. Credit Sprint gives you a clear plan, original practice for fifteen courses and honest feedback on where you stand.</p>
          ${ctas(true)}${ticks}</div>
        <div class="pro-card">
          <span class="pro-eyebrow">How credit adds up</span>
          <div class="pro-math"><div><b>1</b><span>exam passed</span></div><i>→</i><div><b>3</b><span>credit hours, often</span></div><i>→</i><div><b>1</b><span>course you skip</span></div></div>
          <p class="small muted">Credit policies differ by college. Most publish the AP® and CLEP® scores they accept; check yours before you test.</p>
          <a class="pro-link" href="#calc">Estimate what you could save →</a>
          <img src="${shot}" alt="The Credit Sprint dashboard" width="1400" height="788" loading="eager">
        </div></div>
        <div class="wrap"><div class="pro-chips"><span>Fifteen courses</span>${chips}</div></div></section>`
  };
  const product = look === "p2" ? "" : `<section class="sec pro-product"><div class="wrap">
      <div class="sec-head"><span class="eyebrow">Inside the app</span><h2>Practice that keeps you coming back</h2><p class="muted">A unit map that shows where you are, a two-week season pass with rewards, weekly leagues and pets that react to every answer.</p></div>
      <div class="pro-feats3"><div><b>Find your weak units</b><p>A short diagnostic sets your mastery for every unit and builds a week-by-week plan to exam day.</p></div>
        <div><b>Learn from every miss</b><p>Each choice has its own explanation, and missed questions come back with spaced repetition.</p></div>
        <div><b>Prove you're ready</b><p>Unit bosses and timed practice exams weighted like the real test, with a score estimate.</p></div></div>
    </div></section>`;
  /* compact course grid replaces the long per-course detail cards */
  const courses = `<section class="sec alt" id="all-courses"><div class="wrap">
      <div class="sec-head"><span class="eyebrow">Courses</span><h2>Fifteen courses. One account.</h2><p class="muted">Study one class or stack several. Your streak, XP and pets carry across every course.</p></div>
      <div class="pro-courses">${C.map(([k, n, c, ex]) => `<a href="app.html?course=${k}" style="--cc:${c}"><b>${n}</b><span>${ex}</span><em>Start free →</em></a>`).join("")}</div>
      <p class="small muted" style="margin-top:12px">Unit-by-unit <a href="guides/index.html">study guides</a> and <a href="practice/index.html">worked practice problems</a> are free for everyone.</p>
    </div></section>`;
  const newBody = `<!-- home page look: ${look} -->\n${styles}\n${heroes[look]}\n<section class="wrap pro-proof-wrap">${proof}</section>\n${require("./founder.js").strip()}\n${S.how}\n${product}\n${S.try}\n${courses}\n${S.features}\n${S.games}\n${S.pets}\n${S.team}\n${S.pricing}\n${S.calc}\n${S.faq}\n${S.cta}\n${scriptsOutside(body, scripts)}\n<style>${CSS.base}\n${CSS[look]}</style>\n`;
  let out = html.slice(0, mainOpen) + newBody + html.slice(mainClose);
  out = out.replace('<a class="btn sm" href="index.html#courses">Start free</a>', '<a class="btn sm" href="app.html">Start free</a>').replace('<a href="index.html#courses">Courses</a>', '<a href="index.html#all-courses">Courses</a>');
  if (look === "p3") out = out.replace("family=Manrope:wght@500;600;700;800", "family=Manrope:wght@500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700");
  return out.replace("<body", `<body data-look="${look}"`);
}

const CSS = {
base: `
.pro-hero{padding:56px 0 34px}
.pro-eyebrow{font-size:.78rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--accent)}
.pro-hero h1{font-size:clamp(2.1rem,4.6vw,3.5rem);line-height:1.06;letter-spacing:-.025em;margin:12px 0 0}
.pro-lead{font-size:1.12rem;line-height:1.6;color:var(--muted);max-width:52ch;margin:16px 0 0}
.pro-ctas{display:flex;gap:12px;flex-wrap:wrap;margin-top:26px}
.pro-ctas .btn.lg{padding:14px 26px;font-size:1rem;border-radius:12px}
.pro-ticks{list-style:none;padding:0;margin:18px 0 0;display:flex;flex-wrap:wrap;gap:8px 20px;font-size:.88rem;color:var(--muted);font-weight:600}
.pro-ticks li::before{content:"✓";color:var(--good,#10B981);font-weight:900;margin-right:6px}
.pro-split{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:48px;align-items:center}
.pro-shot{margin:0;border-radius:16px;overflow:hidden;background:var(--surface);border:1px solid var(--rule);box-shadow:0 30px 80px -20px rgba(30,27,75,.35),0 0 0 1px rgba(0,0,0,.02)}
.pro-shot img{display:block;width:100%;height:auto}
.pro-bar{display:flex;align-items:center;gap:6px;padding:9px 12px;border-bottom:1px solid var(--rule);background:var(--surface-2)}
.pro-bar i{width:10px;height:10px;border-radius:50%;background:#E5E7EB}.pro-bar i:nth-child(1){background:#F87171}.pro-bar i:nth-child(2){background:#FBBF24}.pro-bar i:nth-child(3){background:#34D399}
.pro-bar span{margin-left:10px;font-size:.72rem;color:var(--muted);background:var(--surface);border-radius:6px;padding:2px 10px}
.pro-chips{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:40px;padding-top:22px;border-top:1px solid var(--rule)}
.pro-chips>span{font-size:.75rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-right:6px}
.pro-chip{display:inline-flex;align-items:center;gap:7px;padding:6px 12px;border-radius:999px;border:1px solid var(--rule);background:var(--surface);color:var(--ink);font-weight:700;font-size:.84rem;text-decoration:none;transition:border-color .15s,transform .15s}
.pro-chip i{width:8px;height:8px;border-radius:50%;background:var(--cc)}
.pro-chip:hover{border-color:var(--cc);transform:translateY(-1px)}
.pro-proof-wrap{padding:6px 0 30px}
.pro-proof{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));border:1px solid var(--rule);border-radius:16px;background:var(--surface);overflow:hidden}
.pro-proof div{padding:18px 20px;display:flex;flex-direction:column;gap:2px}.pro-proof div+div{border-left:1px solid var(--rule)}
.pro-proof b{font-size:1.6rem;letter-spacing:-.02em}.pro-proof span{font-size:.82rem;color:var(--muted);font-weight:600}
.pro-feats3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
.pro-feats3>div{border:1px solid var(--rule);border-radius:16px;padding:22px;background:var(--surface)}
.pro-feats3 b{font-size:1.05rem}.pro-feats3 p{color:var(--muted);margin:8px 0 0;line-height:1.55}
.pro-courses{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px}
.pro-courses a{display:flex;flex-direction:column;gap:4px;padding:16px;border-radius:14px;background:var(--surface);border:1px solid var(--rule);border-top:4px solid var(--cc);text-decoration:none;color:var(--ink);transition:transform .15s,box-shadow .15s}
.pro-courses a:hover{transform:translateY(-3px);box-shadow:0 12px 28px rgba(17,24,39,.08)}
.pro-courses b{font-size:.98rem}.pro-courses span{font-size:.78rem;color:var(--muted);font-weight:700}.pro-courses em{font-style:normal;font-size:.8rem;font-weight:800;color:var(--cc);margin-top:6px}
#team .sec-head h2{font-size:1.5rem}
@media (max-width:980px){.pro-split{grid-template-columns:minmax(0,1fr);gap:32px}.pro-courses{grid-template-columns:repeat(2,minmax(0,1fr))}.pro-proof{grid-template-columns:repeat(2,minmax(0,1fr))}.pro-proof div:nth-child(n){border-left:0;border-top:1px solid var(--rule)}.pro-proof div:nth-child(-n+2){border-top:0}.pro-proof div:nth-child(even){border-left:1px solid var(--rule)}.pro-proof div:last-child{grid-column:1/-1;border-left:0}.pro-feats3{grid-template-columns:minmax(0,1fr)}}
@media (max-width:560px){.pro-hero{padding:34px 0 24px}.pro-ctas .btn{flex:1}.pro-chips{margin-top:28px}}
`,
p1: `
body[data-look="p1"]{background:#fff}
.pro-hero.p1{background:radial-gradient(60% 70% at 85% 30%,#EEF2FF 0%,rgba(238,242,255,0) 70%),#fff}
.pro-hero.p1 .pro-shot{transform:perspective(1600px) rotateY(-6deg) rotateX(2deg);transform-origin:left center}
@media (max-width:980px){.pro-hero.p1 .pro-shot{transform:none}}
`,
p2: `
.pro-hero.p2{background:radial-gradient(80% 60% at 50% 0%,#312E81 0%,#0F0D2E 55%,#07061A 100%);color:#fff;padding:72px 0 48px;text-align:center}
.pro-center{display:flex;flex-direction:column;align-items:center}
.pro-hero.p2 .pro-eyebrow{color:#A5B4FC}
.pro-hero.p2 h1{color:#fff;max-width:18ch}
.pro-hero.p2 h1 em{font-style:normal;background:linear-gradient(90deg,#A5B4FC,#F0ABFC);-webkit-background-clip:text;background-clip:text;color:transparent}
.pro-hero.p2 .pro-lead{color:#C7C9F3;margin-inline:auto}
.pro-hero.p2 .pro-ctas,.pro-hero.p2 .pro-ticks{justify-content:center}
.pro-hero.p2 .pro-ticks{color:#C7C9F3}
.pro-hero.p2 .pro-main{background:#fff;color:#1E1B4B;border-color:#fff}
.pro-hero.p2 .pro-ghost{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.3);color:#fff}
.pro-hero.p2 .pro-shot{margin-top:48px;max-width:1040px;width:100%;border-color:rgba(255,255,255,.12);box-shadow:0 0 0 1px rgba(255,255,255,.06),0 40px 120px -20px rgba(129,140,248,.55)}
.pro-hero.p2 .pro-bar{background:#14122E;border-color:rgba(255,255,255,.08)}.pro-hero.p2 .pro-bar span{background:#0F0D2E;color:#A5B4FC}
.pro-chips.dark{justify-content:center;border-top-color:rgba(255,255,255,.12)}
.pro-chips.dark .pro-chip{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.14);color:#E0E7FF}
.pro-chips.dark .pro-chip:hover{border-color:var(--cc)}
`,
p3: `
body[data-look="p3"]{background:#FBF8F3}
body[data-look="p3"] .sec.alt{background:#F4EFE6}
body[data-look="p3"] h1,body[data-look="p3"] h2{font-family:Fraunces,Georgia,serif;font-weight:700;letter-spacing:-.015em}
.pro-hero.p3{background:#FBF8F3}
.pro-hero.p3 .pro-eyebrow{color:#9A6B1F}
.pro-hero.p3 h1{color:#1B2340}
.pro-hero.p3 .pro-main{background:#1B2340;border-color:#1B2340;color:#fff}
.pro-card{background:#fff;border:1px solid #E8E0D2;border-radius:20px;padding:26px;display:flex;flex-direction:column;gap:14px;box-shadow:0 24px 60px -24px rgba(27,35,64,.25)}
.pro-card .pro-eyebrow{color:#9A6B1F}
.pro-math{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.pro-math div{flex:1;min-width:90px;background:#FBF8F3;border:1px solid #EFE6D6;border-radius:14px;padding:12px;text-align:center;display:flex;flex-direction:column}
.pro-math b{font-family:Fraunces,Georgia,serif;font-size:2rem;color:#1B2340}.pro-math span{font-size:.78rem;color:var(--muted);font-weight:600}
.pro-math i{font-style:normal;color:#9A6B1F;font-weight:800}
.pro-link{font-weight:800;color:#1B2340}
.pro-card img{border-radius:12px;border:1px solid #EFE6D6;display:block;width:100%;height:auto}
body[data-look="p3"] .pro-proof,body[data-look="p3"] .pro-feats3>div,body[data-look="p3"] .pro-courses a{border-color:#E8E0D2}
body[data-look="p3"] .pro-proof b{font-family:Fraunces,Georgia,serif;color:#1B2340}
`
};

if (require.main === module) {
  const R = p => path.join(__dirname, "..", p), idx = fs.readFileSync(R("index.html"), "utf8");
  if (idx.includes("<!-- home page look:")) { console.log("index.html already has a look applied. Run build-site.js instead; it applies the chosen look."); process.exit(0); }
  for (const k of ["p1", "p2", "p3"]) fs.writeFileSync(R(`landing-${k}.html`), apply(idx, k));
  console.log("Wrote landing-p1.html, landing-p2.html, landing-p3.html");
}
module.exports = {apply};
