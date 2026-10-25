/* Builds three preview versions of the home page (landing-a/b/c.html) by swapping the hero. Run after build-site.js. Not linked or indexed. */
const fs = require("fs"), path = require("path"), R = p => path.join(__dirname, "..", p);
const idx = fs.readFileSync(R("index.html"), "utf8");
const pets = JSON.parse(fs.readFileSync(path.join(__dirname, "landing-pets.json"), "utf8"));
const cp = JSON.parse(fs.readFileSync(path.join(__dirname, "landing-course-pets.json"), "utf8"));
const nQ = (idx.match(/<b>(\d+)<\/b><span>practice questions/) || [])[1] || "3600";
const sz = (svg, n) => svg.replace(/width="\d+" height="\d+"/, `width="${n}" height="${n}"`);
const m0 = idx.indexOf('<section class="wrap hero2" id="courses">'), m1 = idx.indexOf("<style>\n.hA{");
const start = m0 >= 0 ? m0 : m1, end = idx.indexOf("</section>", start) + 10;
const C = {macro:["Macroeconomics","#4F46E5","AP + CLEP"], micro:["Microeconomics","#059669","AP + CLEP"], bio:["Biology","#0891B2","AP + CLEP"], chem:["Chemistry","#7C3AED","AP + CLEP"], mkt:["Marketing","#DB2777","CLEP"], apush:["U.S. History","#B45309","AP + CLEP"], apworld:["World History","#0F766E","AP"], apgov:["U.S. Government","#1E3A8A","AP + CLEP"], appsych:["Psychology","#7C3AED","AP + CLEP"]};
const nq = (+nQ).toLocaleString();
const heroes = {
a: `<style>
.hA{position:relative;overflow:hidden;background:radial-gradient(120% 90% at 20% 0%,#4338CA 0%,#1E1B4B 55%,#0B0A22 100%);color:#fff;padding:64px 0 72px}
.hA .wrap{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;text-align:center;gap:22px}
.hA h1{font-size:clamp(2.2rem,6vw,4rem);line-height:1.04;max-width:16ch;color:#fff}
.hA h1 em{font-style:normal;background:linear-gradient(90deg,#FDE047,#F472B6,#67E8F9);-webkit-background-clip:text;background-clip:text;color:transparent}
.hA .lead{color:#C7C9F3;max-width:54ch;font-size:1.12rem}
.hA .row-wrap{justify-content:center}
.hA .btn.big{padding:14px 24px;font-size:1.02rem;background:linear-gradient(90deg,#FACC15,#FB923C);border:0;color:#1E1B4B;box-shadow:0 8px 28px rgba(250,204,21,.35)}
.hA .btn.ghost{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.35);color:#fff;padding:14px 22px}
.hA .badges{display:flex;flex-wrap:wrap;gap:10px;justify-content:center}.hA .badges span{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:999px;padding:6px 14px;font-weight:700;font-size:.85rem}
.hA .fl{position:absolute;z-index:1;opacity:.95;animation:hAf 6s ease-in-out infinite}
@keyframes hAf{50%{transform:translateY(-14px) rotate(3deg)}}
@media(max-width:900px){.hA .fl{display:none}.hA .fl.keep{display:block;position:static;margin:0 auto}}
</style>
<section class="hA" id="courses"><div class="fl" style="left:3%;top:14%">${sz(pets[8].svg,150)}</div><div class="fl" style="right:4%;top:10%;animation-delay:-2s">${sz(pets[7].svg,160)}</div><div class="fl" style="left:2%;bottom:3%;animation-delay:-4s">${sz(pets[6].svg,120)}</div><div class="fl" style="right:2%;bottom:3%;animation-delay:-1s">${sz(pets[10].svg,130)}</div>
<div class="wrap"><span class="badges"><span>Free to start</span><span>AP® + CLEP®</span><span>${nq} questions</span></span>
<h1>Study like it's a game. <em>Pass like a pro.</em></h1>
<p class="lead">Hatch pets, beat unit bosses and keep your streak alive while you prepare for the AP® and CLEP® exams that turn into real college credit.</p>
<div class="row-wrap"><a class="btn big" href="app.html">Start free in 10 seconds</a><a class="btn ghost" href="#try">Try a question first</a></div>
<div class="badges" style="margin-top:8px">${[["macro","Macro"],["micro","Micro"],["bio","Biology"],["chem","Chemistry"],["mkt","Marketing"],["apush","U.S. History"],["apworld","World History"],["apgov","U.S. Government"],["appsych","Psychology"]].map(([k,n])=>`<a href="app.html?course=${k}" style="text-decoration:none;color:inherit"><span>${n}</span></a>`).join("")}</div></div></section>`,
b: `<style>
.hB{background:linear-gradient(180deg,#EEF0FF 0%,var(--bg) 100%);padding:56px 0 40px;position:relative;overflow:hidden}
.hB:before{content:"";position:absolute;right:-120px;top:-120px;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,#A5B4FC88,transparent 70%)}
.hB .wrap{display:grid;grid-template-columns:1.05fr .95fr;gap:40px;align-items:center;position:relative}
@media(max-width:900px){.hB .wrap{grid-template-columns:1fr}}
.hB h1{font-size:clamp(2.2rem,5.4vw,3.6rem);line-height:1.05}.hB h1 em{font-style:normal;color:var(--accent);position:relative}
.hB h1 em:after{content:"";position:absolute;left:0;right:0;bottom:2px;height:.28em;background:#FDE04788;z-index:-1;border-radius:4px}
.hB ul{list-style:none;padding:0;margin:0;display:grid;gap:8px}.hB li{display:flex;gap:10px;align-items:flex-start;font-weight:600}.hB li i{flex:none;width:22px;height:22px;border-radius:50%;background:var(--good-bg);color:var(--good);display:grid;place-items:center;font-style:normal;font-size:.8rem;font-weight:800}
.hB .stat{display:flex;gap:26px;flex-wrap:wrap}.hB .stat b{font-size:1.5rem;display:block;line-height:1}.hB .stat span{font-size:.8rem;color:var(--muted);font-weight:600}
.hB .card{background:var(--surface);border:1px solid var(--rule);border-radius:22px;box-shadow:0 24px 60px rgba(67,56,202,.18);padding:22px;display:flex;flex-direction:column;gap:12px;transform:rotate(1.5deg)}
.hB .ob{border:1px solid var(--rule);border-radius:10px;padding:10px 12px;font-weight:600}.hB .ob.ok{border-color:var(--good);background:var(--good-bg)}
.hB .pet{position:absolute;right:-14px;bottom:-24px}
.hB .stk{display:inline-flex;gap:6px;align-items:center;background:#FFF3E0;color:#B45309;font-weight:800;border-radius:999px;padding:4px 12px;font-size:.82rem;align-self:flex-start}
</style>
<section class="hB" id="courses"><div class="wrap"><div class="stack" style="gap:20px">
<span class="eyebrow">AP® and CLEP® prep · free to start</span>
<h1>Earn the credit. <em>Skip the intro course.</em></h1>
<p class="lead">A daily 10-minute habit, a plan built around your weakest units, and every answer explained. Study once, be ready for AP® and CLEP®.</p>
<ul><li><i>✓</i>${nq} original practice questions with an explanation for every choice</li><li><i>✓</i>Diagnostic, study plan, flashcards, free-response practice and timed exams</li><li><i>✓</i>Games, streaks and pets that grow as you learn</li></ul>
<div class="row-wrap"><a class="btn" style="padding:14px 24px;font-size:1rem" href="app.html">Start free</a><a class="btn" style="padding:14px 22px;background:var(--surface);color:var(--accent);border-color:var(--rule)" href="#try">Try a question</a></div>
<div class="stat"><div><b>9</b><span>courses</span></div><div><b>16</b><span>exams</span></div><div><b>261</b><span>pets</span></div><div><b>$0</b><span>to begin</span></div></div></div>
<div style="position:relative;padding-bottom:30px"><div class="card"><span class="stk">12-day streak</span><b style="font-size:1.05rem">Price is above AVC but below ATC. What should the firm do in the short run?</b><div class="ob ok">✓ Keep producing where P = MC</div><div class="ob">Shut down immediately</div><div class="ob">Raise output until P = ATC</div><span class="muted small">Price covers variable costs, so the loss is smaller than fixed cost.</span></div><div class="pet">${sz(pets[7].svg,128)}</div></div></div></section>`,
c: `<style>
.hC{padding:56px 0 40px;background:radial-gradient(80% 60% at 50% 0%,#EEF0FF,transparent)}
.hC .wrap{display:flex;flex-direction:column;align-items:center;text-align:center;gap:18px}
.hC h1{font-size:clamp(2.1rem,5.4vw,3.5rem);line-height:1.06;max-width:18ch}.hC h1 em{font-style:normal;color:var(--accent)}
.hC .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;width:100%;margin-top:10px}
@media(max-width:980px){.hC .grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:480px){.hC .grid{grid-template-columns:1fr}}
.hC a.cc{display:flex;flex-direction:column;align-items:center;gap:2px;background:var(--surface);border:1px solid var(--rule);border-top:5px solid var(--c);border-radius:18px;padding:12px 10px 16px;text-decoration:none;color:var(--ink);box-shadow:var(--shadow);transition:transform .15s,box-shadow .15s}
.hC a.cc:hover{transform:translateY(-4px);box-shadow:0 14px 34px rgba(17,24,39,.14)}
.hC a.cc b{font-size:1.02rem}.hC a.cc span{font-size:.78rem;font-weight:800;color:var(--c)}
.hC a.cc.last{background:var(--c);color:#fff;justify-content:center;border-top-color:var(--c)}.hC a.cc.last span{color:#fff}
</style>
<section class="hC" id="courses"><div class="wrap"><span class="eyebrow">Free to start · No card needed</span>
<h1>Pick your exam. <em>We'll build your sprint.</em></h1>
<p class="lead" style="max-width:58ch">Choose a course and get a 10-minute diagnostic, a plan around your weakest units, and ${nq} questions that explain every answer.</p>
<div class="grid">${cp.map(x => `<a class="cc" href="app.html?course=${x.k}" style="--c:${C[x.k][1]}">${sz(x.svg,104)}<b>${C[x.k][0]}</b><span>${C[x.k][2]}</span></a>`).join("")}<a class="cc last" href="#try" style="--c:#4F46E5"><b style="font-size:1.15rem">Not sure?</b><span>Try a question, then take the course quiz</span></a></div></div></section>`
};

const DARK = `.hX{position:relative;overflow:hidden;color:#fff;padding:60px 0 68px}
.hX h1{color:#fff;line-height:1.04;font-size:clamp(2.1rem,5.6vw,3.8rem)}
.hX .lead{color:#C7C9F3;font-size:1.1rem;max-width:52ch}
.hX .wrap{position:relative;z-index:2}
.hX .cta{display:flex;flex-wrap:wrap;gap:12px}
.hX .btn.big{padding:14px 24px;font-size:1.02rem;background:linear-gradient(90deg,#FACC15,#FB923C);border:0;color:#1E1B4B;box-shadow:0 8px 28px rgba(250,204,21,.35)}
.hX .btn.ghost{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.35);color:#fff;padding:14px 22px}
.hX .chip2{display:inline-flex;gap:6px;align-items:center;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:999px;padding:6px 14px;font-weight:800;font-size:.85rem;color:#fff;text-decoration:none}
.hX .fl{animation:hAf 6s ease-in-out infinite}@keyframes hAf{50%{transform:translateY(-12px) rotate(3deg)}}
.bar{height:16px;border-radius:99px;background:rgba(255,255,255,.14);overflow:hidden;border:1px solid rgba(255,255,255,.22)}.bar i{display:block;height:100%;border-radius:99px}
@media(max-width:900px){.hX .two2{grid-template-columns:1fr!important}}`;
const courseChips = [["macro","Macro"],["micro","Micro"],["bio","Biology"],["chem","Chemistry"],["mkt","Marketing"],["apush","U.S. History"],["apworld","World History"],["apgov","U.S. Government"],["appsych","Psychology"]].map(([k,n]) => `<a class="chip2" href="app.html?course=${k}">${n}</a>`).join("");
heroes.a1 = `<style>${DARK}.hX.a1{background:radial-gradient(100% 80% at 80% 0%,#7F1D1D 0%,#1E1B4B 45%,#0B0A22 100%)}
.hX .arena{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.2);border-radius:22px;padding:22px;display:flex;flex-direction:column;gap:14px;backdrop-filter:blur(6px)}
.hX .vs{display:flex;justify-content:space-between;align-items:flex-end;gap:10px}.hX .vs b{font-size:.8rem;letter-spacing:.06em;text-transform:uppercase;opacity:.8}
.hX .boss{width:120px;height:120px;display:grid;place-items:center;font-size:4.2rem;filter:drop-shadow(0 8px 18px #000a);animation:hAf 3s ease-in-out infinite}
.hX .qline{background:#fff;color:#111827;border-radius:12px;padding:12px 14px;font-weight:700}
.hX .ans{display:grid;grid-template-columns:1fr 1fr;gap:8px}.hX .ans span{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.25);border-radius:10px;padding:8px 10px;font-weight:700;font-size:.9rem}.hX .ans span.r{background:#16A34A55;border-color:#4ADE80}</style>
<section class="hX a1" id="courses"><div class="wrap" style="display:grid;grid-template-columns:1.05fr .95fr;gap:36px;align-items:center" ><div class="stack two2" style="gap:20px"><span class="chip2">Unit boss incoming</span><h1>Beat the boss. <em style="font-style:normal;color:#FDE047">Earn the credit.</em></h1><p class="lead">Every unit ends in a boss battle. Answer to deal damage, protect your pet and unlock the next unit on the way to AP® and CLEP® college credit.</p><div class="cta"><a class="btn big" href="app.html">Start the first fight free</a><a class="btn ghost" href="#try">Try a question</a></div><div style="display:flex;flex-wrap:wrap;gap:8px">${courseChips}</div></div>
<div class="arena" aria-hidden="true"><div class="vs"><div>${sz(pets[7].svg,110)}<b>Your pet · Lv 12</b></div><div style="text-align:right"><div class="boss">🐉</div><b>Unit 4 boss</b></div></div>
<div><b style="font-size:.8rem">BOSS HP</b><div class="bar"><i style="width:38%;background:linear-gradient(90deg,#EF4444,#F97316)"></i></div></div><div><b style="font-size:.8rem">YOUR HP</b><div class="bar"><i style="width:82%;background:linear-gradient(90deg,#22C55E,#A3E635)"></i></div></div>
<div class="qline">A price ceiling is set below equilibrium. What is the result?</div><div class="ans"><span class="r">✓ A shortage</span><span>A surplus</span><span>No change</span><span>Lower demand</span></div></div></div></section>`;
heroes.a2 = `<style>${DARK}.hX.a2{background:radial-gradient(70% 70% at 50% 40%,#5B21B6 0%,#1E1B4B 50%,#0B0A22 100%);text-align:center}
.hX.a2 .wrap{display:flex;flex-direction:column;align-items:center;gap:18px}
.egg{position:relative;width:190px;height:190px;display:grid;place-items:center}
.egg:before{content:"";position:absolute;inset:-30px;border-radius:50%;background:radial-gradient(circle,#F9A8D4aa,#7C3AED55 45%,transparent 70%);animation:eg 2.4s ease-in-out infinite}
@keyframes eg{50%{transform:scale(1.15);opacity:.7}}@keyframes wob{0%,60%,100%{transform:rotate(0)}70%{transform:rotate(-6deg)}80%{transform:rotate(6deg)}90%{transform:rotate(-4deg)}}
.egg svg{position:relative;animation:wob 3s ease-in-out infinite}
.row5{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;max-width:760px}.row5>div{opacity:.95}
.hX.a2 .cta{justify-content:center}</style>
<section class="hX a2" id="courses"><div class="wrap"><span class="chip2">Every 25 questions = 1 mystery egg</span><div class="egg"><svg width="150" height="180" viewBox="0 0 150 180"><defs><linearGradient id="eg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FDE68A"/><stop offset=".5" stop-color="#F9A8D4"/><stop offset="1" stop-color="#A78BFA"/></linearGradient></defs><path d="M75 6C112 6 140 70 140 112c0 36-28 62-65 62S10 148 10 112C10 70 38 6 75 6Z" fill="url(#eg1)" stroke="#fff" stroke-width="5"/><circle cx="52" cy="92" r="9" fill="#fff" opacity=".5"/><circle cx="98" cy="116" r="12" fill="#fff" opacity=".45"/><circle cx="64" cy="140" r="7" fill="#fff" opacity=".5"/><path d="M60 58l12 14-14 10 16 16" stroke="#7C3AED" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
<h1>Study. Hatch. <em style="font-style:normal;background:linear-gradient(90deg,#FDE047,#F472B6,#67E8F9);-webkit-background-clip:text;background-clip:text;color:transparent">Collect them all.</em></h1><p class="lead">Answer questions, earn eggs and hatch 203 pets across seven courses. Each one grows as you do, on your way to real AP® and CLEP® credit.</p>
<div class="cta"><a class="btn big" href="app.html">Hatch your first pet free</a><a class="btn ghost" href="#try">Try a question</a></div>
<div class="row5">${[0,3,5,6,7,8,10].map(i => `<div class="fl" style="animation-delay:-${i*.7}s">${sz(pets[i].svg,84)}</div>`).join("")}</div>
<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">${courseChips}</div></div></section>`;
heroes.a3 = `<style>${DARK}.hX.a3{background:linear-gradient(135deg,#0B0A22 0%,#1E1B4B 50%,#312E81 100%)}
.hud{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:6px}.hud div{color:#fff;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.2);border-radius:14px;padding:8px 14px;font-weight:800;min-width:110px}.hud small{display:block;font-size:.7rem;opacity:.7;text-transform:uppercase;letter-spacing:.06em}
.map{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.18);border-radius:22px;padding:14px;position:relative}.map svg{display:block;width:100%;height:auto}</style>
<section class="hX a3" id="courses"><div class="wrap" style="display:grid;grid-template-columns:1fr 1fr;gap:34px;align-items:center"><div class="stack two2" style="gap:20px">
<div class="hud"><div><small>Streak</small>🔥 12 days</div><div><small>Level</small>⭐ 18</div><div><small>XP today</small>240 / 300</div></div>
<div class="bar" style="max-width:380px"><i style="width:80%;background:linear-gradient(90deg,#FACC15,#FB923C)"></i></div>
<h1>Level up your <em style="font-style:normal;color:#67E8F9">transcript.</em></h1><p class="lead">Walk the quest map, keep your streak, climb the weekly league and collect pets. Ten minutes a day gets you ready to test out of intro courses.</p>
<div class="cta"><a class="btn big" href="app.html">Start your streak free</a><a class="btn ghost" href="#try">Try a question</a></div><div style="display:flex;flex-wrap:wrap;gap:8px">${courseChips}</div></div>
<div class="map" aria-hidden="true"><svg viewBox="0 0 420 300"><path d="M30 250 C120 250 90 170 180 170 S250 90 340 90 S390 60 390 40" stroke="#ffffff55" stroke-width="10" stroke-linecap="round" stroke-dasharray="2 16" fill="none"/>${[[30,250,1],[110,215,1],[180,170,1],[260,128,0],[340,90,0]].map(([x,y,d],i) => `<circle cx="${x}" cy="${y}" r="20" fill="${d?"#FACC15":"#ffffff22"}" stroke="#fff" stroke-width="3"/><text x="${x}" y="${y+6}" text-anchor="middle" font-size="16" font-weight="800" fill="${d?"#1E1B4B":"#fff"}">${d?"✓":i+1}</text>`).join("")}<g transform="translate(330 -10)"><text x="40" y="60" text-anchor="middle" font-size="46">🏆</text></g><foreignObject x="118" y="86" width="120" height="120"><div xmlns="http://www.w3.org/1999/xhtml">${sz(pets[6].svg,96)}</div></foreignObject></svg></div></div></section>`;
heroes.a4 = `<style>.hX.a4{background:linear-gradient(135deg,#FDE68A 0%,#F9A8D4 45%,#A5B4FC 100%);color:#1E1B4B}
.hX.a4 .chip2{display:inline-flex;align-items:center;border-radius:999px;padding:6px 14px;font-weight:800;font-size:.85rem;text-decoration:none;align-self:flex-start;background:#ffffffaa;border:1px solid #fff;color:#1E1B4B}.hX.a4 h1,.hX.a4 .lead{color:#1E1B4B}.hX.a4 .lead{opacity:.85}.hX.a4 .chip2{background:#fff9;border-color:#fff;color:#1E1B4B}
.hX.a4 .btn.ghost{background:#fff9;border-color:#1E1B4B33;color:#1E1B4B}${DARK.replace(/\.hX \.chip2\{[^}]*\}/, "").replace(/\.hX h1\{color:#fff;/, ".hX h1{")}</style>
<section class="hX a4" id="courses"><div class="wrap" style="display:grid;grid-template-columns:1.1fr .9fr;gap:30px;align-items:center"><div class="stack two2" style="gap:20px"><span class="chip2">Free to start · AP® + CLEP®</span><h1>Study like it's a game. <em style="font-style:normal;color:#7C3AED">Pass like a pro.</em></h1><p class="lead">Hatch pets, beat unit bosses and keep your streak alive while you prepare for exams that turn into real college credit.</p><div class="cta"><a class="btn big" href="app.html">Start free in 10 seconds</a><a class="btn ghost" href="#try">Try a question first</a></div><div style="display:flex;flex-wrap:wrap;gap:8px">${courseChips}</div></div>
<div style="display:flex;flex-wrap:wrap;gap:4px;justify-content:center">${[8,7,6,10,9].map((i,j) => `<div class="fl" style="animation-delay:-${j}s;margin-top:${j%2?26:0}px">${sz(pets[i].svg,j==0?150:120)}</div>`).join("")}</div></div></section>`;

if (require.main === module) {
  for (const k of Object.keys(heroes)) {
    let h = idx.slice(0, start) + heroes[k] + idx.slice(end);
    h = h.replace("<head>", '<head><meta name="robots" content="noindex">').replace(/<link rel="canonical"[^>]*>/, "");
    fs.writeFileSync(R(`landing-${k}.html`), h);
  }
  console.log("built landing-a/b/c");
} else {
  /* required from build-site.js: the chosen hero (A, arcade) goes live on index.html */
  fs.writeFileSync(R("index.html"), idx.slice(0, start) + heroes.a + idx.slice(end));
}
