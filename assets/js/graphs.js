/* Credit Sprint graph engine: market diagrams, static figures, small line charts. */
(function(){
"use strict";
const CS = window.CS;
/* ---------- graph engine ---------- */
CS.GW = {W:360, PW:360-46-18};
const W = 360, H = 260, PL = 46, PT = 16, PR = 18, PB = 40, PW = W-PL-PR, PH = H-PT-PB;
const X = x => PL + x/100*PW, Y = y => PT + (100-y)/100*PH;
const MONO = 'font-family="Manrope, system-ui, sans-serif"';
function axes(xl, yl){
  return `<line x1="${PL}" y1="${PT}" x2="${PL}" y2="${PT+PH}" stroke="var(--ink)" stroke-width="1.4"/>`+
    `<line x1="${PL}" y1="${PT+PH}" x2="${PL+PW}" y2="${PT+PH}" stroke="var(--ink)" stroke-width="1.4"/>`+
    `<text x="${PL+PW}" y="${H-10}" text-anchor="end" font-size="11" fill="var(--muted)" ${MONO}>${CS.esc(xl)}</text>`+
    `<text x="12" y="${PT+PH/2}" transform="rotate(-90 12 ${PT+PH/2})" text-anchor="middle" font-size="11" fill="var(--muted)" ${MONO}>${CS.esc(yl)}</text>`;
}
const path = pts => pts.map((p,i)=>(i?"L":"M")+X(p[0]).toFixed(1)+" "+Y(p[1]).toFixed(1)).join(" ");
/* y as a function of x for each curve kind, shifted right by dx */
function fy(c, dx){
  dx += c.off || 0;
  if (c.kind === "down") return x => 100 - (x - dx);
  if (c.kind === "up") return x => (x - dx);
  if (c.kind === "convex") return x => 4 + 1800/((x - dx) + 10) - 12;
  return null;
}
function curvePts(c, dx){
  if (c.kind === "vert") { const x = c.at + dx; return [[x,5],[x,95]]; }
  const f = fy(c, dx), pts = [], d = dx + (c.off||0);
  for (let x=4; x<=96; x+=1) { const y = f(x); if (y>=4 && y<=96 && (x-d)>-9) pts.push([x,y]); }
  return pts;
}
function intersect(a, da, b, db){
  if (a.kind === "vert" && b.kind === "vert") return null;
  if (a.kind === "vert" || b.kind === "vert") {
    const v = a.kind === "vert" ? [a,da] : [b,db], o = a.kind === "vert" ? [b,db] : [a,da];
    const x = v[0].at + v[1], y = fy(o[0], o[1])(x); return (y>0&&y<100) ? [x,y] : null;
  }
  const fa = fy(a,da), fb = fy(b,db); let prev = null;
  for (let x=1; x<=99; x+=0.25) { const d = fa(x)-fb(x); if (prev!=null && Math.sign(d)!==Math.sign(prev)) return [x, fa(x)]; prev = d; }
  return null;
}
const SUB = ["₁","₂","₃","₄"];
CS.market = (key, shifts={}, opt={}) => {
  const m = CS.MARKETS[key]; let s = axes(opt.x||m.x, opt.y||m.y); const LB = opt.labels||{};
  const any = Object.values(shifts).some(v=>v);
  // ghosts of original positions
  if (any && opt.ghost !== false) m.curves.forEach(c => { if (shifts[c.k]) s += `<path d="${path(curvePts(c,0))}" fill="none" stroke="var(${c.alt?"--curve2":c.muted?"--muted":"--accent"})" stroke-opacity=".28" stroke-width="2"/>`; });
  // equilibrium (original + new)
  const [ka, kb] = m.eq, ca = m.curves.find(c=>c.k===ka), cb = m.curves.find(c=>c.k===kb);
  const e0 = intersect(ca,0,cb,0), e1 = intersect(ca,shifts[ka]||0,cb,shifts[kb]||0);
  const guide = (e, lab) => e ? `<path d="M${X(0)} ${Y(e[1])} L${X(e[0])} ${Y(e[1])} L${X(e[0])} ${Y(0)}" stroke="var(--ink)" stroke-width="1" stroke-dasharray="3 3" fill="none" opacity=".7"/>`+
     (lab ? `<text x="${X(0)-4}" y="${Y(e[1])+4}" text-anchor="end" font-size="10" fill="var(--muted)" ${MONO}>${lab[0]}</text><text x="${X(e[0])}" y="${Y(0)+13}" text-anchor="middle" font-size="10" fill="var(--muted)" ${MONO}>${lab[1]}</text>` : "") : "";
  if (opt.eq !== false) {
    if (any && e0 && e1 && (Math.abs(e0[0]-e1[0])>.5 || Math.abs(e0[1]-e1[1])>.5)) s += guide(e0, ["1","1"]);
    s += guide(e1, any ? ["2","2"] : null);
  }
  m.curves.forEach(c => {
    const dx = shifts[c.k]||0, pts = curvePts(c, dx); if (!pts.length) return;
    const col = c.alt ? "--curve2" : c.muted ? "--muted" : "--accent";
    s += `<path d="${path(pts)}" fill="none" stroke="var(${col})" stroke-width="2.6" stroke-linecap="round" ${c.muted?'stroke-dasharray="6 4"':""}/>`;
    const lp = c.kind==="vert" ? [pts[1][0], 91] : c.kind==="up" ? pts[pts.length-1] : pts[pts.length-1];
    const name = (LB[c.k]||c.label||c.k) + (dx && opt.sub!==false ? SUB[1] : "");
    const anchor = c.kind==="vert" ? "start" : "end";
    const ox = c.kind==="vert" ? 5 : c.kind==="up" ? -6 : -2, oy = c.kind==="up" ? 4 : c.kind==="vert" ? 0 : -8;
    s += `<text x="${X(lp[0])+ox}" y="${Y(lp[1])+oy}" text-anchor="${anchor}" font-size="12" font-weight="600" fill="var(${col})" ${MONO}>${CS.esc(name)}</text>`;
  });
  if (opt.eq !== false && e1) s += `<circle cx="${X(e1[0])}" cy="${Y(e1[1])}" r="5" fill="var(--ink)"/>`;
  /* wide invisible hit targets so curves can be dragged */
  if (opt.hit) m.curves.forEach(c => { const pts = curvePts(c, shifts[c.k]||0); if (pts.length) s += `<path d="${path(pts)}" data-k="${CS.esc(c.k)}" fill="none" stroke="transparent" stroke-width="22" style="cursor:ew-resize;touch-action:none" pointer-events="stroke"/>`; });
  return {svg:`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${CS.esc(m.name)} graph">${s}</svg>`, e0, e1};
};

/* static figures for the guides */
const range = (a,b,n) => Array.from({length:n+1},(_,i)=>a+(b-a)*i/n);
CS.figure = key => {
  if (CS.MARKETS[key]) return CS.market(key).svg;
  let s = "", title = "";
  if (key === "ppc") {
    title = "Production possibilities curve"; s = axes("Consumer goods","Capital goods");
    const pts = range(0,88,30).map(x=>[x,Math.sqrt(Math.max(0,88*88-x*x))]);
    s += `<path d="${path(pts)}" fill="none" stroke="var(--accent)" stroke-width="2.6"/>`;
    s += `<text x="${X(66)}" y="${Y(64)}" font-size="12" font-weight="600" fill="var(--accent)" ${MONO}>PPC</text>`;
    s += `<circle cx="${X(32)}" cy="${Y(40)}" r="4" fill="var(--ink)"/><text x="${X(32)+7}" y="${Y(40)+4}" font-size="11" fill="var(--ink)" ${MONO}>inefficient</text>`;
    s += `<circle cx="${X(80)}" cy="${Y(70)}" r="4" fill="none" stroke="var(--ink)"/><text x="${X(80)-6}" y="${Y(70)-8}" text-anchor="end" font-size="11" fill="var(--ink)" ${MONO}>unattainable</text>`;
  } else if (key === "cycle") {
    title = "Business cycle"; s = axes("Time","Real GDP");
    s += `<path d="${path([[4,20],[96,72]])}" stroke="var(--muted)" stroke-width="2" stroke-dasharray="6 4" fill="none"/><text x="${X(96)}" y="${Y(76)}" text-anchor="end" font-size="11" fill="var(--muted)" ${MONO}>trend</text>`;
    const pts = range(4,96,60).map(x=>[x,20+(x-4)*52/92+12*Math.sin((x-4)/92*2*Math.PI*1.5)]);
    s += `<path d="${path(pts)}" stroke="var(--accent)" stroke-width="2.6" fill="none"/>`;
    s += `<text x="${X(19)}" y="${Y(46)}" text-anchor="middle" font-size="11" fill="var(--ink)" ${MONO}>peak</text><text x="${X(50)}" y="${Y(38)}" text-anchor="middle" font-size="11" fill="var(--ink)" ${MONO}>trough</text>`;
    s += `<text x="${X(34)}" y="${Y(62)}" text-anchor="middle" font-size="10" fill="var(--muted)" ${MONO}>contraction</text><text x="${X(66)}" y="${Y(36)}" text-anchor="middle" font-size="10" fill="var(--muted)" ${MONO}>expansion</text>`;
  } else if (MICROFIG[key]) {
    const f = MICROFIG[key](); title = f.title; s = f.s;
  }
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${CS.esc(title)}">${s}</svg>`;
};

/* ---------- microeconomics figures (firm graphs) ---------- */
const fn = (f, a=4, b=96) => range(a, b, 92).map(x=>[x, f(x)]).filter(p=>p[1]>=3 && p[1]<=97);
const crv = (pts, col="--accent", dash) => `<path d="${path(pts)}" fill="none" stroke="var(${col})" stroke-width="2.6" stroke-linecap="round" ${dash?'stroke-dasharray="6 4"':""}/>`;
const lbl = (x, y, t, col="--accent", anchor="start") => `<text x="${X(x)}" y="${Y(y)}" text-anchor="${anchor}" font-size="11.5" font-weight="700" fill="var(${col})" ${MONO}>${CS.esc(t)}</text>`;
const dot = (x, y) => `<circle cx="${X(x)}" cy="${Y(y)}" r="4" fill="var(--ink)"/>`;
const drop = (x, y, ty, tx) => `<path d="M${X(0)} ${Y(y)} L${X(x)} ${Y(y)} L${X(x)} ${Y(0)}" stroke="var(--ink)" stroke-width="1" stroke-dasharray="3 3" fill="none" opacity=".65"/>` + (ty?`<text x="${X(0)-4}" y="${Y(y)+4}" text-anchor="end" font-size="10" fill="var(--muted)" ${MONO}>${ty}</text>`:"") + (tx?`<text x="${X(x)}" y="${Y(0)+13}" text-anchor="middle" font-size="10" fill="var(--muted)" ${MONO}>${tx}</text>`:"");
const rect = (x0, y0, x1, y1, col="--mint") => `<rect x="${X(x0)}" y="${Y(Math.max(y0,y1))}" width="${X(x1)-X(x0)}" height="${Math.abs(Y(y0)-Y(y1))}" fill="var(${col})" opacity=".22"/>`;
const poly = (pts, col="--bad") => `<path d="${path(pts)} Z" fill="var(${col})" opacity=".22"/>`;
const MC = x => 24.7 + 0.0325*(x-30)*(x-30), ATC = x => 45 + 0.013*(x-55)*(x-55), AVC = x => 32 + 0.012*(x-45)*(x-45);
const MICROFIG = {
  costs: () => ({title:"Short-run cost curves", s: axes("Quantity","Cost per unit") + crv(fn(MC,6,86)) + crv(fn(ATC,8,94),"--curve2") + crv(fn(AVC,8,94),"--muted",true)
    + crv(fn(x=>16*20/(x+4)+2,8,94),"--faint",true) + lbl(70,94,"MC") + lbl(94,ATC(94)+4,"ATC","--curve2","end") + lbl(94,AVC(94)-6,"AVC","--muted","end") + lbl(94,10,"AFC","--faint","end") + dot(55,45) + dot(45,32)}),
  pcfirm: () => { const P = 62, q = 30 + Math.sqrt((P-24.7)/0.0325), c = ATC(q);
    return {title:"Perfectly competitive firm earning a profit", s: axes("Quantity","Price and cost") + rect(0,c,q,P) + crv(fn(MC,6,86)) + crv(fn(ATC,8,94),"--curve2") + crv(fn(AVC,8,94),"--muted",true)
      + `<path d="M${X(0)} ${Y(P)} L${X(96)} ${Y(P)}" stroke="var(--ink)" stroke-width="2.2"/>` + lbl(3,P+3,"P = MR = D","--ink","start") + lbl(70,94,"MC") + lbl(94,ATC(94)+4,"ATC","--curve2","end") + lbl(94,AVC(94)-6,"AVC","--muted","end")
      + drop(q,c,"ATC",null) + drop(q,P,"P","q*") + dot(q,P) + lbl(q/2,(P+c)/2-1.5,"profit","--good","middle")}; },
  monopoly: () => { const D = x => 90-0.9*x, MR = x => 90-1.8*x, mc = x => 12+0.4*x, q = 78/2.2, p = D(q), c = 40+0.012*(q-45)*(q-45);
    return {title:"Monopoly", s: axes("Quantity","Price and cost") + rect(0,c,q,p) + poly([[q,p],[q,mc(q)],[60,36]]) + crv(fn(D,4,96)) + crv(fn(MR,4,49)) + crv(fn(mc,4,96),"--curve2") + crv(fn(x=>40+0.012*(x-45)*(x-45),6,94),"--muted",true)
      + lbl(92,D(92)+4,"D","--accent","end") + lbl(49,MR(49)+5,"MR") + lbl(94,mc(94)+4,"MC","--curve2","end") + lbl(10,40+0.012*35*35+4,"ATC","--muted")
      + drop(q,p,"Pm","Qm") + drop(60,36,null,"Qe") + dot(q,p) + lbl(q/2,(p+c)/2-1.5,"profit","--good","middle") + lbl(52,48,"DWL","--bad","middle")}; },
  mcomp: () => { const D = x => 61.6-0.48*x, MR = x => 61.6-0.96*x, mc = x => 26.5+0.015*(x-25)*(x-25), atc = x => 40+0.012*(x-55)*(x-55);
    return {title:"Monopolistic competition in the long run", s: axes("Quantity","Price and cost") + crv(fn(D,4,96)) + crv(fn(MR,4,62)) + crv(fn(mc,4,90),"--curve2") + crv(fn(atc,6,94),"--muted")
      + lbl(94,D(94)+4,"D","--accent","end") + lbl(60,MR(60)+5,"MR") + lbl(86,mc(86)+4,"MC","--curve2","end") + lbl(94,atc(94)+4,"ATC","--muted","end")
      + drop(35,D(35),"P","Q") + dot(35,D(35)) + drop(55,40,null,"min ATC") + lbl(45,14,"excess capacity","--bad","middle")}; },
  laborfirm: () => { const MRP = x => 92-1.15*x+0.004*x*x, W = 45, q = 44.2;
    return {title:"Firm in a perfectly competitive labor market", s: axes("Quantity of labor","Wage") + crv(fn(MRP,4,90)) + `<path d="M${X(0)} ${Y(W)} L${X(96)} ${Y(W)}" stroke="var(--curve2)" stroke-width="2.6"/>`
      + lbl(95,W+3,"W = MRC = S","--curve2","end") + lbl(84,MRP(84)+5,"MRP = D","--accent","end") + drop(q,W,"W","q*") + dot(q,W)}; },
  extfig: () => { const D = x => 90-0.9*x, S = x => 6+0.9*x, MSC = x => 26+0.9*x, qm = 84/1.8, qs = 64/1.8;
    return {title:"Negative externality", s: axes("Quantity","Price") + poly([[qs,D(qs)],[qm,MSC(qm)],[qm,D(qm)]]) + crv(fn(D)) + crv(fn(S),"--curve2") + crv(fn(MSC),"--bad",true)
      + lbl(92,D(92)+4,"D = MSB","--accent","end") + lbl(94,S(94)-6,"S = MPC","--curve2","end") + lbl(76,MSC(76)+4,"MSC","--bad","end") + drop(qm,D(qm),null,"Qm") + drop(qs,D(qs),null,"Qs") + lbl(qm+7,D(qm)+12,"DWL","--bad","middle")}; }
};

/* small sparkline chart for Fed Chair: series [{vals, col, label}], target lines */
CS.lines = (series, opt) => {
  const w=300,h=150,l=30,t=10,r=10,b=22,pw=w-l-r,ph=h-t-b, n=opt.n;
  const lo=opt.lo, hi=opt.hi, xx=i=>l+i/(n-1)*pw, yy=v=>t+(hi-Math.max(lo,Math.min(hi,v)))/(hi-lo)*ph;
  let s=`<line x1="${l}" y1="${t+ph}" x2="${l+pw}" y2="${t+ph}" stroke="var(--rule)"/>`;
  [lo, (lo+hi)/2, hi].forEach(v=>{ s+=`<text x="${l-4}" y="${yy(v)+3}" text-anchor="end" font-size="9" fill="var(--muted)" ${MONO}>${v}%</text>`; });
  (opt.targets||[]).forEach(tg=>{ s+=`<line x1="${l}" x2="${l+pw}" y1="${yy(tg.v)}" y2="${yy(tg.v)}" stroke="var(${tg.col})" stroke-opacity=".5" stroke-dasharray="4 3"/>`; });
  series.forEach(se=>{ if(!se.vals.length) return; const d=se.vals.map((v,i)=>(i?"L":"M")+xx(i).toFixed(1)+" "+yy(v).toFixed(1)).join(" ");
    s+=`<path d="${d}" fill="none" stroke="var(${se.col})" stroke-width="2.2"/>`;
    const li=se.vals.length-1; s+=`<circle cx="${xx(li)}" cy="${yy(se.vals[li])}" r="3.5" fill="var(${se.col})"/>`; });
  for(let i=0;i<n;i++) s+=`<text x="${xx(i)}" y="${h-6}" text-anchor="middle" font-size="9" fill="var(--muted)" ${MONO}>${i===0?"Start":"Q"+i}</text>`;
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${CS.esc(opt.title)}">${s}</svg>`;
};

/* ---------- draggable graph: students drag curves left/right, then check ---------- */
CS.drawGraph = (host, mk, opt={}) => {
  const m = CS.MARKETS[mk]; let shifts = {}, drag = null, done = false;
  host.innerHTML = `<div class="lab dg"><div class="dg-svg"></div>
    <div class="shift-pad">${m.curves.map(c=>`<span class="curvebtn"><span>${CS.esc((opt.labels||{})[c.k]||c.label||c.k)}</span><button type="button" data-c="${CS.esc(c.k)}" data-d="-1" aria-label="Shift ${CS.esc(c.k)} left">←</button><button type="button" data-c="${CS.esc(c.k)}" data-d="1" aria-label="Shift ${CS.esc(c.k)} right">→</button></span>`).join("")}
      <button type="button" class="btn ghost sm dg-reset">Reset</button></div>
    <p class="faint small">Drag a curve left or right (or use the arrows). Shift only what changes.</p>
    ${opt.check!==false?`<div class="row-wrap"><button type="button" class="btn sm dg-check">Check my graph</button></div>`:""}<div class="dg-fb"></div></div>`;
  const box = host.querySelector(".dg-svg");
  const draw = () => { box.innerHTML = CS.market(mk, shifts, {hit:!done, x:opt.x, y:opt.y, labels:opt.labels}).svg; };
  draw();
  box.addEventListener("pointerdown", e => { const k = e.target.getAttribute && e.target.getAttribute("data-k"); if (!k || done) return; e.preventDefault();
    drag = {k, x0:e.clientX, d0:shifts[k]||0}; box.setPointerCapture && box.setPointerCapture(e.pointerId); });
  box.addEventListener("pointermove", e => { if (!drag) return; const r = box.querySelector("svg").getBoundingClientRect();
    const dxg = (e.clientX - drag.x0) * (CS.GW.W / r.width) / CS.GW.PW * 100; shifts[drag.k] = Math.max(-30, Math.min(30, Math.round(drag.d0 + dxg))); draw(); });
  const end = () => { drag = null; }; box.addEventListener("pointerup", end); box.addEventListener("pointercancel", end);
  host.querySelectorAll("[data-c]").forEach(b => b.onclick = () => { if (done) return; const k = b.dataset.c; shifts[k] = Math.max(-30, Math.min(30, (shifts[k]||0) + 12*(+b.dataset.d))); draw(); });
  host.querySelector(".dg-reset").onclick = () => { if (done) return; shifts = {}; draw(); host.querySelector(".dg-fb").innerHTML = ""; };
  const api = {
    shifts: () => shifts,
    grade: () => {
      const moved = m.curves.filter(c => Math.abs(shifts[c.k]||0) >= 5).map(c => [c.k, Math.sign(shifts[c.k])]);
      return (opt.expect||[]).some(([k,d]) => moved.length === 1 && moved[0][0] === k && moved[0][1] === d);
    },
    lock: () => { done = true; draw(); host.querySelectorAll("[data-c],.dg-reset,.dg-check").forEach(b => b.disabled = true); },
    show: (k, d) => { shifts = {[k]: d*16}; draw(); }
  };
  const chk = host.querySelector(".dg-check");
  if (chk) chk.onclick = () => {
    const ok = api.grade(), [k,d] = opt.expect[0];
    host.querySelector(".dg-fb").innerHTML = `<div class="feedback ${ok?"good":"bad"}"><b>${ok?"Correct graph.":"Not quite."}</b> ${CS.esc(opt.why||"")} ${ok?"":`The answer: ${CS.esc((opt.labels||{})[k]||m.curves.find(c=>c.k===k).label||k)} shifts ${d>0?"right":"left"}.`}</div>`;
    if (!ok) api.show(k, d);
    api.lock(); if (opt.onDone) opt.onDone(ok);
  };
  return api;
};
})();
