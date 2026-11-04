/* Landing page extras: live demo question, pet showcase strip, credit calculator, course finder quiz, founder card (scripts/founder.js). Used by build-site.js */
const fs = require("fs"), path = require("path"), founder = require("./founder.js");
module.exports = function(COURSES, ic) {
  const Q = JSON.parse(fs.readFileSync(path.join(__dirname, "landing-q.json"), "utf8"));
  const meta = COURSES.map(c => ({k:c.k, n:c.name, col:c.col, clepOnly:!!c.clepOnly, apOnly:!!c.apOnly}));
  const css = `<style>
.lp-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:start}
@media(max-width:860px){.lp-grid{grid-template-columns:1fr}}
.lp-q{display:flex;flex-direction:column;gap:10px}
.lp-q .opt{display:block;width:100%;text-align:left;border:1px solid var(--rule);background:var(--surface);border-radius:10px;padding:10px 12px;font:inherit;color:var(--ink);cursor:pointer}
.lp-q .opt:hover:not([disabled]){border-color:var(--accent)}
.lp-q .opt.ok{border-color:var(--good);background:var(--good-bg)}.lp-q .opt.no{border-color:var(--bad);background:var(--bad-bg)}
.lp-q .why{font-size:.88rem;color:var(--muted);margin:0}
.lp-tag{align-self:flex-start;font-size:.75rem;font-weight:800;padding:3px 9px;border-radius:999px;color:#fff}
.petstrip{overflow:hidden;mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);-webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
.petstrip-track{display:flex;gap:18px;width:max-content;animation:lpslide 55s linear infinite;padding:18px 0}
.petstrip:hover .petstrip-track{animation-play-state:paused}
.petcell{display:flex;flex-direction:column;align-items:center;gap:2px;min-width:118px;text-align:center;font-size:.78rem;font-weight:700}
.petcell small{color:var(--muted);font-weight:600}
@keyframes lpslide{to{transform:translateX(-50%)}}
@media(prefers-reduced-motion:reduce){.petstrip-track{animation:none;flex-wrap:wrap;width:auto;justify-content:center}.petcell.dup{display:none}}
.lp-chips{display:flex;flex-wrap:wrap;gap:8px}
.lp-chips button{border:1px solid var(--rule);background:var(--surface);border-radius:999px;padding:7px 13px;font:inherit;font-weight:700;font-size:.85rem;color:var(--muted);cursor:pointer}
.lp-chips button[aria-pressed="true"]{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
.lp-field{display:flex;flex-direction:column;gap:4px;font-size:.82rem;font-weight:700;color:var(--muted)}
.lp-field input{font:inherit;font-weight:700;color:var(--ink);background:var(--surface);border:1px solid var(--rule);border-radius:10px;padding:9px 11px;width:130px}
.lp-big{font-size:2.3rem;font-weight:800;letter-spacing:-.02em;color:var(--good);line-height:1.1}
${founder.css}
</style>`;
  const body = `${css}
<section class="sec" id="try"><div class="wrap">
  <div class="sec-head"><span class="eyebrow">Try it now</span><h2>Answer a real question. No signup.</h2><p>This is the kind of practice you get on every unit: five choices like the real exam, and every answer explained.</p></div>
  <div class="lp-grid"><div class="panel lp-q" id="lpq" aria-live="polite"></div>
  <div class="panel"><span class="eyebrow">Why it works</span><h3>You learn from the wrong answers too</h3><p class="muted">Every choice comes with its own explanation, so a miss teaches you something. Missed questions come back later with spaced repetition, and each course has its own flashcards, free-response practice, games and timed exams.</p><a class="btn" id="lpgo" href="app.html" style="align-self:flex-start">Keep practicing free ${ic("arrow",18)}</a></div></div>
</div></section>
<section class="sec alt" id="pets"><div class="wrap">
  <div class="sec-head"><span class="eyebrow">Collect them all</span><h2>Hatch pets that grow as you study</h2><p>Earn a mystery egg for every 25 questions. Every pet grows from baby to teen to adult, and the rarest ones glow, sparkle and wear crowns.</p></div>
  <div class="petstrip" id="petstrip" aria-label="A sample of Credit Sprint pets"><div class="petstrip-track" id="pettrack"></div></div>
  <p class="muted small" style="text-align:center">407 pets across fifteen courses. Pets you collect carry over between courses.</p>
</div></section>
<section class="sec" id="calc"><div class="wrap">
  <div class="sec-head"><span class="eyebrow">Plan your credit</span><h2>How much could you save?</h2><p>Pick the courses you want to test out of. Credit rules differ by college, so check your school's policy for the exact score and credits.</p></div>
  <div class="lp-grid">
    <div class="panel"><span class="eyebrow">1. Choose courses</span><div class="lp-chips" id="calcchips"></div>
      <div class="row-wrap" style="gap:16px"><label class="lp-field">Credit hours per course<input id="calch" type="number" min="1" max="8" value="3"></label><label class="lp-field">Tuition per credit hour ($)<input id="calcc" type="number" min="0" step="10" value="500"></label></div>
      <div><div class="lp-big" id="calcout">$0</div><span class="muted" id="calcsub">Select a course to see your estimate.</span></div></div>
    <div class="panel"><span class="eyebrow">Not sure where to start?</span><h3>Find your first course</h3><div id="quiz" class="stack" style="gap:10px"></div></div>
  </div>
</div></section>
${founder.teamSection()}
<script>(function(){
var Q=${JSON.stringify(Q)},C=${JSON.stringify(meta)};
var $=function(i){return document.getElementById(i)};
function esc(s){var d=document.createElement("div");d.textContent=s;return d.innerHTML}
function shuf(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
var order=shuf(Q),qi=0,cn=function(k){for(var i=0;i<C.length;i++)if(C[i].k===k)return C[i]};
function showQ(){var q=order[qi%order.length],c=cn(q.k),box=$("lpq"),opts=shuf(q.o);
 box.innerHTML='<span class="lp-tag" style="background:'+c.col+'">'+esc(c.n)+'</span><b>'+esc(q.q)+'</b>'+opts.map(function(o,i){return '<button class="opt" data-i="'+i+'">'+esc(o[0])+'</button>'}).join("")+'<p class="why" id="lpwhy"></p>';
 $("lpgo").href="app.html?course="+q.k;
 [].forEach.call(box.querySelectorAll(".opt"),function(b){b.onclick=function(){var o=opts[+b.dataset.i];
  [].forEach.call(box.querySelectorAll(".opt"),function(x,i){x.disabled=true;if(opts[i][2])x.classList.add("ok");});
  if(!o[2])b.classList.add("no");
  var right=opts.filter(function(x){return x[2]})[0];
  $("lpwhy").innerHTML='<b>'+(o[2]?"Correct. ":"Not quite. ")+'</b>'+esc(o[2]?o[1]:o[1]+" The right answer is: "+right[0]+". "+right[1])+'<br><button class="btn sm" id="lpnext" style="margin-top:10px">Try another question</button>';
  $("lpnext").onclick=function(){qi++;showQ()};}})}
showQ();
var sel={macro:1,micro:1,bio:1},chips=$("calcchips");
chips.innerHTML=C.map(function(c){return '<button type="button" data-k="'+c.k+'" aria-pressed="'+(!!sel[c.k])+'">'+esc(c.n)+'</button>'}).join("");
function calc(){var n=Object.keys(sel).filter(function(k){return sel[k]}).length,h=+$("calch").value||0,p=+$("calcc").value||0,t=n*h*p;
 $("calcout").textContent="$"+t.toLocaleString();
 $("calcsub").textContent=n?n+" course"+(n>1?"s":"")+" x "+h+" credit hours = "+(n*h)+" credit hours of tuition you could skip.":"Select a course to see your estimate."}
chips.onclick=function(e){var b=e.target.closest("button");if(!b)return;var k=b.dataset.k;sel[k]=!sel[k];b.setAttribute("aria-pressed",!!sel[k]);calc()};
$("calch").oninput=calc;$("calcc").oninput=calc;calc();
var ans={},steps=[["What are you studying (or thinking about)?",[["biz","Business or economics"],["sci","Science or health"],["hist","History, English or humanities"],["any","Not sure yet"]],"area"],["Which exam are you aiming for?",[["ap","AP in May"],["clep","CLEP anytime"],["either","Either one"]],"exam"],["How long until you test?",[["short","Under a month"],["mid","1 to 3 months"],["long","More than 3 months"]],"time"]];
function quiz(s){var box=$("quiz");if(s<steps.length){var st=steps[s];box.innerHTML='<span class="eyebrow">Question '+(s+1)+' of 3</span><b>'+st[0]+'</b>'+st[1].map(function(o){return '<button class="opt" style="border:1px solid var(--rule);background:var(--surface);border-radius:10px;padding:10px 12px;text-align:left;font:inherit;color:var(--ink);cursor:pointer" data-v="'+o[0]+'">'+o[1]+'</button>'}).join("");
 [].forEach.call(box.querySelectorAll("button"),function(b){b.onclick=function(){ans[st[2]]=b.dataset.v;quiz(s+1)}});return}
 var pool={biz:["macro","micro","mkt","apstat","calcab"],sci:["bio","chem","appsych","apstat","calcab","calcbc"],hist:["apush","apworld","apgov","aphug","aplang","aplit","appsych"],any:["macro","bio","apush","aphug","aplang","appsych","apstat"]}[ans.area].filter(function(k){var c=cn(k);return !(ans.exam==="ap"&&c.clepOnly)&&!(ans.exam==="clep"&&c.apOnly)});
 if(!pool.length)pool=["macro"];
 var tip={short:"With under a month, turn on the 30-day sprint plan and do the diagnostic first.",mid:"You have time for a weekly plan: ten to fifteen minutes a day is plenty.",long:"Start with the unit guides, then add practice a little each day so it sticks."}[ans.time];
 box.innerHTML='<span class="eyebrow">Your match</span>'+pool.map(function(k){var c=cn(k);return '<a class="btn" href="app.html?course='+k+'" style="background:'+c.col+';border-color:'+c.col+'">Start '+esc(c.n)+' free</a>'}).join("")+'<span class="muted small">'+tip+'</span><button class="btn sm" id="qre" style="background:none;color:var(--accent);align-self:flex-start">Start over</button>';
 $("qre").onclick=function(){ans={};quiz(0)}}
quiz(0)})();</script>
<div id="stickycta" hidden><a class="btn" href="app.html">Start free</a></div>
<style>#stickycta{position:fixed;left:0;right:0;bottom:0;z-index:50;padding:10px 16px calc(10px + env(safe-area-inset-bottom));background:var(--surface);border-top:1px solid var(--rule);box-shadow:0 -6px 20px rgba(17,24,39,.12);display:none}#stickycta .btn{width:100%;padding:13px;font-size:1rem}@media(max-width:700px){#stickycta:not([hidden]){display:block}}</style>
<script>(function(){var b=document.getElementById("stickycta");if(!b)return;function f(){b.hidden=window.scrollY<520}window.addEventListener("scroll",f,{passive:true});f()})();</script>
<script src="assets/landing-pets.js" defer></script>`;
  const pets = JSON.parse(fs.readFileSync(path.join(__dirname, "landing-pets.json"), "utf8"));
  const cell = (x, dup) => '<div class="petcell' + (dup ? ' dup" aria-hidden="true' : '') + '">' + x.svg + '<span>' + x.n + '</span><small>' + x.r + '</small></div>';
  fs.writeFileSync(path.join(__dirname, "..", "assets", "landing-pets.js"), "/* Generated by scripts/build-site.js from scripts/landing-pets.json. Do not edit by hand. */\n(function(){var t=document.getElementById('pettrack');if(!t)return;t.innerHTML=" + JSON.stringify(pets.map(x => cell(x, 0)).join("")) + ";[].slice.call(t.children).forEach(function(c){var d=c.cloneNode(true);d.className+=' dup';d.setAttribute('aria-hidden','true');t.appendChild(d)});})();\n");
  return body;
};
