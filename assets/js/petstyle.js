/* Credit Sprint pet styling: gives every pet a sticker outline, a halo, rarity auras, orbiting sparkles, a little motion and
   (for object pets) arms and legs, plus more vivid colors. Pet ids never change, so owned pets keep their new looks.
   Used by Biology, Chemistry and Marketing art, and by the Macro/Micro animal builder (no limbs there). */
(function(){
"use strict";
const RANK = {common:0, uncommon:1, rare:2, epic:3, legendary:4, mythical:5, supreme:6, secret:6};
const H = id => { let h = 7; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0; return h; };
const star = (n, r1, r2) => Array.from({length: n * 2}, (_, i) => { const a = Math.PI * i / n - Math.PI / 2, r = i % 2 ? r2 : r1; return (60 + r * Math.cos(a)).toFixed(1) + "," + (62 + r * Math.sin(a)).toFixed(1); }).join(" ");
const spark = (x, y, s = 1, c = "#FDE047") => `<path d="M${x} ${y-6*s} L${x+1.8*s} ${y-1.8*s} L${x+6*s} ${y} L${x+1.8*s} ${y+1.8*s} L${x} ${y+6*s} L${x-1.8*s} ${y+1.8*s} L${x-6*s} ${y} L${x-1.8*s} ${y-1.8*s}Z" fill="${c}"><animate attributeName="opacity" values=".3;1;.3" dur="${1.6+(x%7)/10}s" repeatCount="indefinite"/></path>`;
const rgb = x => [1,3,5].map(i => parseInt(x.slice(i,i+2),16));
const hex = a => "#" + a.map(v => Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,"0")).join("");
function vivid(c, k) {
  if (!/^#[0-9a-f]{6}$/i.test(c || "")) return c;
  let [r,g,b] = rgb(c).map(v => v/255); const mx = Math.max(r,g,b), mn = Math.min(r,g,b), l = (mx+mn)/2, d = mx-mn;
  if (d < .1) return c;                       /* greys, whites and blacks stay as designed */
  let s = d / (1 - Math.abs(2*l - 1)), hh;
  if (mx === r) hh = ((g-b)/d + (g<b?6:0)); else if (mx === g) hh = (b-r)/d + 2; else hh = (r-g)/d + 4;
  hh *= 60; s = Math.min(1, s * (k || 1.3)); const l2 = Math.max(.38, Math.min(.8, l));
  const C = (1 - Math.abs(2*l2 - 1)) * s, X = C * (1 - Math.abs((hh/60) % 2 - 1)), m = l2 - C/2;
  const [R,G,B] = hh<60?[C,X,0]:hh<120?[X,C,0]:hh<180?[0,C,X]:hh<240?[0,X,C]:hh<300?[X,0,C]:[C,0,X];
  return hex([(R+m)*255,(G+m)*255,(B+m)*255]);
}
function wrap(p, st, svg, limbs) {
  const h = H(p.id || "x"), rk = RANK[p.r] || 0, id = "q" + (h % 99999) + "s" + st;
  const pose = h % 4, motion = (h >>> 3) % 4, halo = (h >>> 5) % 4, c1 = p.c1, c2 = p.c2;
  const hb = x => `<circle cx="${x[0]}" cy="${x[1]}" r="6.5" fill="${c2}" stroke="#1F2430" stroke-opacity=".55" stroke-width="2.2"/>`;
  const arm = (x1, y1, x2, y2) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="#1F2430" stroke-opacity=".55" stroke-width="10" stroke-linecap="round"/><path d="M${x1} ${y1} L${x2} ${y2}" stroke="${c1}" stroke-width="6.4" stroke-linecap="round"/>` + hb([x2, y2]);
  const arms = !limbs || st < 2 ? "" : [arm(60,70,8,52)+arm(60,70,112,86), arm(60,66,10,30)+arm(60,66,110,30), arm(60,74,6,84)+arm(60,74,114,84), arm(60,70,10,90)+arm(60,66,108,26)][pose];
  const leg = x => `<path d="M${x} 92 V110" stroke="#1F2430" stroke-opacity=".55" stroke-width="10" stroke-linecap="round"/><path d="M${x} 92 V110" stroke="${c2}" stroke-width="6.4" stroke-linecap="round"/>`;
  const legs = !limbs ? "" : st === 3 ? leg(44) + leg(76) : st === 2 ? leg(48) + leg(72) : "";
  const hc = [c2, c1, "#FDE047", "#67E8F9"][halo];
  const haloShape = [`<circle cx="60" cy="62" r="54" fill="${hc}" opacity=".28"/>`, `<polygon points="${star(8, 58, 46)}" fill="${hc}" opacity=".3"/>`, `<rect x="10" y="12" width="100" height="100" rx="30" fill="${hc}" opacity=".28" transform="rotate(${(h % 5) * 9 + 8} 60 62)"/>`, `<polygon points="${star(6, 58, 38)}" fill="${hc}" opacity=".3"/>`][halo];
  const aura = rk >= 3 ? `<defs><radialGradient id="${id}g"><stop offset="0" stop-color="${c2}" stop-opacity=".85"/><stop offset="1" stop-color="${c2}" stop-opacity="0"/></radialGradient></defs><circle cx="60" cy="62" r="60" fill="url(#${id}g)"><animate attributeName="r" values="54;62;54" dur="2.6s" repeatCount="indefinite"/></circle>` : "";
  const ring = rk >= 4 ? `<g><circle cx="60" cy="62" r="58" fill="none" stroke="${rk >= 6 ? "#F472B6" : "#FDE047"}" stroke-width="2.4" stroke-dasharray="6 9" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" from="0 60 62" to="360 60 62" dur="${rk >= 6 ? 6 : 12}s" repeatCount="indefinite"/></circle></g>` : "";
  const orbit = rk >= 5 ? `<g><animateTransform attributeName="transform" type="rotate" from="0 60 62" to="-360 60 62" dur="9s" repeatCount="indefinite"/>${spark(60,6,.9,"#fff")}${spark(116,62,.8,"#FDE047")}${spark(8,70,.8,"#F9A8D4")}</g>` : rk >= 3 ? `<g><animateTransform attributeName="transform" type="rotate" from="0 60 62" to="360 60 62" dur="14s" repeatCount="indefinite"/>${spark(112,40,.7,"#fff")}${spark(10,84,.7,"#FDE047")}</g>` : "";
  const flt = `<filter id="${id}f" x="-15%" y="-15%" width="130%" height="130%"><feMorphology in="SourceAlpha" operator="dilate" radius="2.4" result="d"/><feFlood flood-color="#fff"/><feComposite in2="d" operator="in" result="o"/><feDropShadow dx="0" dy="3" stdDeviation="2.2" flood-color="#0F172A" flood-opacity=".35" result="sh"/><feMerge><feMergeNode in="sh"/><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
  const mot = [`<animateTransform attributeName="transform" type="rotate" values="-3 60 100;3 60 100;-3 60 100" dur="3s" repeatCount="indefinite"/>`,
    `<animateTransform attributeName="transform" type="scale" values="1 1;1.04 .96;1 1" dur="1.8s" additive="sum" repeatCount="indefinite"/>`,
    `<animateTransform attributeName="transform" type="translate" values="0 0;3 0;0 0;-3 0;0 0" dur="3.4s" repeatCount="indefinite"/>`, ""][motion];
  return `<defs>${flt}</defs>${aura}${haloShape}${ring}<g filter="url(#${id}f)"><g>${mot}${arms}${legs}${svg}</g></g>${orbit}`;
}
function applyTo(obj) {
  if (obj.__styled) return; Object.defineProperty(obj, "__styled", {value: true});
  Object.keys(obj).forEach(k => { const fn = obj[k];
    obj[k] = (p, st, m) => { const q = Object.assign({}, p, {c1: vivid(p.c1, 1.35), c2: vivid(p.c2, 1.25)}); return wrap(q, st, fn(q, st, m), true); };
  });
}
const apply = n => { if (["CS_BIOART", "CS_CHEMART", "CS_MKTART"].indexOf(n) >= 0 && window[n]) applyTo(window[n]); };
window.CS_PETSTYLE = {vivid, wrap, H, star, spark, RANK, apply};
["CS_BIOART", "CS_CHEMART", "CS_MKTART"].forEach(apply);
})();
