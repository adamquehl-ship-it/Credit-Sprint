/* Credit Sprint Marketing pet art: an original set of shopping, advertising and business characters, each with its own
   body design. Every drawing fits a 120×120 box with its base near y = 108. Each pet changes design as it grows
   (st: 1 = baby, 2 = teen, 3 = adult): a cart fills up, a megaphone gains sound waves, a trophy gleams.
   Babies also sit in their eggshell (added by pets.js). Used through CUSTOM.mkt → window.CS_MKTART[p.body](p, stage, mood). */
(function(){
"use strict";
const INK = "#1F2430";
const eye = (x, y, r = 4.2, mood) => mood === "sleepy" ? `<path d="M${x-r} ${y} q${r} ${r*.9} ${r*2} 0" stroke="${INK}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`
  : `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/><circle cx="${x+r*.35}" cy="${y-r*.35}" r="${r*.38}" fill="#fff"/>`;
const mouth = (x, y, mood, w = 5) => mood === "sad" ? `<path d="M${x-w} ${y+2} q${w} -4 ${w*2} 0" stroke="${INK}" stroke-width="2" fill="none" stroke-linecap="round"/>`
  : mood === "sleepy" ? `<ellipse cx="${x}" cy="${y+1}" rx="2" ry="1.6" fill="${INK}"/>` : `<path d="M${x-w} ${y} q${w} ${w*.9} ${w*2} 0" stroke="${INK}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
const blush = (x1, x2, y) => `<ellipse cx="${x1}" cy="${y}" rx="3.6" ry="2.2" fill="#FB7185" opacity=".45"/><ellipse cx="${x2}" cy="${y}" rx="3.6" ry="2.2" fill="#FB7185" opacity=".45"/>`;
const face = (cx, cy, mood, s = 1, st = 2) => { const r = st === 1 ? 5.2 : 4.2; return eye(cx - 8*s, cy, r*s, mood) + eye(cx + 8*s, cy, r*s, mood) + blush(cx - 14*s, cx + 14*s, cy + 6*s) + mouth(cx, cy + 7*s, mood, (st === 1 ? 3 : 4)*s); };
const crown = (y, x = 60) => `<path d="M${x-12} ${y} L${x-9} ${y-9} L${x-4} ${y-3} L${x} ${y-12} L${x+4} ${y-3} L${x+9} ${y-9} L${x+12} ${y}Z" fill="#FBBF24" stroke="#B45309" stroke-width="1.2"/><circle cx="${x}" cy="${y-5}" r="1.8" fill="#F43F5E"/>`;
const RANK = {common:0, uncommon:1, rare:2, epic:3, legendary:4, mythical:5, supreme:6};
const ac = (p, st, y, x) => st === 3 && RANK[p.r] >= 2 ? crown(y, x) : "";
const bob = (s, d = 2.6) => `<g><animateTransform attributeName="transform" type="translate" values="0 0;0 -2;0 0" dur="${d}s" repeatCount="indefinite"/>${s}</g>`;
const pick = (st, a, b, c) => st === 1 ? a : st === 2 ? b : c;
const spark = (x, y, s = 1, c = "#FDE047") => `<path d="M${x} ${y-6*s} L${x+1.8*s} ${y-1.8*s} L${x+6*s} ${y} L${x+1.8*s} ${y+1.8*s} L${x} ${y+6*s} L${x-1.8*s} ${y+1.8*s} L${x-6*s} ${y} L${x-1.8*s} ${y-1.8*s}Z" fill="${c}"><animate attributeName="opacity" values=".3;1;.3" dur="${1.6+(x%7)/10}s" repeatCount="indefinite"/></path>`;
const bubbles = (list, c = "#fff") => list.map(([x, y, r], i) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity=".7" stroke="#0EA5E9" stroke-opacity=".4"><animate attributeName="cy" values="${y};${y-10};${y}" dur="${2+i*.4}s" repeatCount="indefinite"/></circle>`).join("");

window.CS_MKTART = {
  /* shopping cart: empty, half full, then overflowing with a flag */
  cart: (p, st, m) => bob(`<path d="M14 30 H28 L40 82 H92 L100 44 H34" fill="none" stroke="#475569" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M32 48 H98 L90 82 H42Z" fill="${p.c1}" stroke="#475569" stroke-width="3" stroke-linejoin="round"/>
    ${st >= 2 ? `<rect x="44" y="34" width="14" height="14" rx="3" fill="${p.c2}" stroke="#475569" stroke-width="2"/>` : ""}${st === 3 ? `<rect x="62" y="28" width="16" height="20" rx="3" fill="#FDE68A" stroke="#475569" stroke-width="2"/><circle cx="88" cy="40" r="7" fill="#F87171" stroke="#475569" stroke-width="2"/>` : ""}
    <circle cx="48" cy="94" r="7" fill="#334155"/><circle cx="84" cy="94" r="7" fill="#334155"/>${face(66, 62, m, .8, st)}${ac(p, st, 26, 60)}`),
  /* price tag: plain tag, then a red SALE slash, then a golden tag with a star */
  tag: (p, st, m) => bob(`<path d="M60 4 q0 8 -6 12" stroke="#64748B" stroke-width="2.4" fill="none"/><path d="M26 22 H78 L100 64 L78 106 H26 Q18 106 18 98 V30 Q18 22 26 22Z" fill="${st === 3 ? "#FBBF24" : p.c1}" stroke="#7C2D12" stroke-opacity=".5" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="32" cy="64" r="5.5" fill="#fff" stroke="#7C2D12" stroke-opacity=".4" stroke-width="2"/>
    <text x="64" y="${st === 1 ? 52 : 46}" font-size="${st === 1 ? 13 : 12}" font-weight="800" fill="#7C2D12" text-anchor="middle">${pick(st, "$5", "$9.99", "SALE")}</text>${st >= 2 ? `<path d="M52 54 L74 34" stroke="#EF4444" stroke-width="3" stroke-linecap="round"/>` : ""}
    ${face(56, 76, m, .8, st)}${st === 3 ? spark(88, 34, 1.2) : ""}${ac(p, st, 20, 52)}`),
  /* coupon: a ticket with scalloped edges whose discount grows */
  coupon: (p, st, m) => bob(`<rect x="14" y="30" width="92" height="68" rx="10" fill="${p.c1}" stroke="#9D174D" stroke-opacity=".5" stroke-width="3"/>
    <rect x="21" y="37" width="78" height="54" rx="6" fill="none" stroke="${p.c2}" stroke-width="2.4" stroke-dasharray="5 4"/><circle cx="14" cy="64" r="8" fill="#fff"/><circle cx="106" cy="64" r="8" fill="#fff"/>
    <text x="60" y="55" font-size="${st === 3 ? 14 : 15}" font-weight="800" fill="#fff" text-anchor="middle">${pick(st, "5% OFF", "20% OFF", "50% OFF")}</text>${face(60, 74, m, .8, st)}${st === 3 ? spark(100, 26, 1.1) + spark(20, 26, .9) : ""}${ac(p, st, 28, 60)}`),
  /* megaphone: sound waves multiply as it grows */
  mega: (p, st, m) => bob(`<g transform="rotate(-12 60 64)"><path d="M24 50 L74 24 V104 L24 78Z" fill="${p.c1}" stroke="#7C2D12" stroke-opacity=".5" stroke-width="3" stroke-linejoin="round"/><rect x="12" y="48" width="20" height="32" rx="6" fill="${p.c2}" stroke="#7C2D12" stroke-opacity=".5" stroke-width="3"/><path d="M36 82 L40 104 H52 L50 90" fill="${p.c2}" stroke="#7C2D12" stroke-opacity=".5" stroke-width="2.4"/></g>
    ${[0, 1, 2].slice(0, pick(st, 1, 2, 3)).map(i => `<path d="M${84 + i*10} ${44 - i*3} q${8 + i*3} ${20 + i*3} 0 ${40 + i*6}" fill="none" stroke="${p.c1}" stroke-width="3.2" stroke-linecap="round"><animate attributeName="opacity" values=".25;1;.25" dur="${1.4 + i*.3}s" repeatCount="indefinite"/></path>`).join("")}
    ${face(48, 64, m, .7, st)}${ac(p, st, 20, 50)}`),
  /* barcode: bars, then a red scanner line, then a glowing checkout beep */
  barcode: (p, st, m) => { const xs = [14, 20, 28, 33, 42, 48, 54, 63, 69, 78, 84, 92, 98], n = pick(st, 9, 11, 13);
    return bob(`<rect x="8" y="22" width="104" height="82" rx="8" fill="${p.c2}" stroke="#334155" stroke-width="3"/>${xs.slice(0, n).map((x, i) => `<rect x="${x + (13 - n)*3}" y="30" width="${i % 3 === 0 ? 5 : 3}" height="44" fill="${p.c1}"/>`).join("")}
    ${st >= 2 ? `<rect x="10" y="50" width="100" height="3" fill="#EF4444"><animate attributeName="y" values="32;70;32" dur="2.4s" repeatCount="indefinite"/></rect>` : ""}${face(60, 88, m, .8, st)}${st === 3 ? `<text x="100" y="18" font-size="9" font-weight="800" fill="#16A34A">BEEP!</text>` : ""}${ac(p, st, 20, 60)}`); },
  /* shopping bag: handles, then goodies peeking out, then a ribbon and sparkles */
  bag: (p, st, m) => bob(`<path d="M42 38 Q42 14 60 14 Q78 14 78 38" fill="none" stroke="#475569" stroke-width="4.5" stroke-linecap="round"/>
    ${st >= 2 ? `<path d="M44 38 l-6 -14 l10 6 l6 -12 l6 12 l10 -6 l-6 14Z" fill="${p.c2}" stroke="#475569" stroke-width="2" stroke-linejoin="round"/>` : ""}
    <path d="M24 36 H96 L102 106 H18Z" fill="${p.c1}" stroke="#065F46" stroke-opacity=".5" stroke-width="3" stroke-linejoin="round"/>${st === 3 ? `<path d="M18 92 H102" stroke="#FDE68A" stroke-width="5"/><circle cx="60" cy="92" r="6" fill="#FDE68A"/>` : ""}
    ${face(60, 64, m, .95, st)}${st === 3 ? spark(100, 24, 1.1) + spark(18, 20, .9) : ""}${ac(p, st, 12, 60)}`),
  /* billboard: a small sign, then lights, then a huge lit board */
  billboard: (p, st, m) => { const w = pick(st, 70, 84, 96);
    return bob(`<rect x="${56}" y="${62}" width="8" height="46" fill="#64748B"/><rect x="${60 - w/2}" y="${pick(st, 36, 28, 22)}" width="${w}" height="${pick(st, 40, 44, 48)}" rx="6" fill="${p.c1}" stroke="#334155" stroke-width="3.5"/>
    ${st >= 2 ? [0, 1, 2].map(i => `<circle cx="${60 - w/2 + 12 + i*(w - 24)/2}" cy="${pick(st, 36, 28, 22) - 6}" r="3.4" fill="#FDE047"><animate attributeName="opacity" values=".4;1;.4" dur="${1.2 + i*.3}s" repeatCount="indefinite"/></circle>`).join("") : ""}
    <text x="60" y="${pick(st, 52, 48, 44)}" font-size="9" font-weight="800" fill="${p.c2}" text-anchor="middle">${pick(st, "AD", "BUY ME", "BEST BRAND")}</text>${face(60, pick(st, 62, 62, 64), m, .75, st)}${ac(p, st, pick(st, 34, 20, 14) , 60)}`); },
  /* clipboard survey: more checked boxes as it grows */
  clip: (p, st, m) => bob(`<rect x="22" y="16" width="76" height="92" rx="9" fill="${p.c1}" stroke="#92400E" stroke-opacity=".6" stroke-width="3"/><rect x="30" y="26" width="60" height="74" rx="4" fill="#fff"/><rect x="44" y="8" width="32" height="14" rx="5" fill="#94A3B8" stroke="#475569" stroke-width="2.4"/>
    ${[0, 1, 2].slice(0, pick(st, 1, 2, 3)).map(i => `<rect x="36" y="${32 + i*13}" width="8" height="8" rx="2" fill="none" stroke="#475569" stroke-width="2"/><path d="M37 ${36 + i*13} l3 3 l6 -8" stroke="#16A34A" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M50 ${36 + i*13} h30" stroke="#CBD5E1" stroke-width="3" stroke-linecap="round"/>`).join("")}
    ${face(60, 84, m, .75, st)}${ac(p, st, 8, 60)}`),
  /* funnel: dots enter, then a second stage narrows, then a customer comes out the bottom */
  funnel: (p, st, m) => bob(`<path d="M12 22 H108 L72 66 V100 Q72 106 66 106 H54 Q48 106 48 100 V66Z" fill="${p.c1}" stroke="#4C1D95" stroke-opacity=".5" stroke-width="3" stroke-linejoin="round"/>
    ${[26, 44, 62, 82, 96].slice(0, pick(st, 3, 4, 5)).map((x, i) => `<circle cx="${x}" cy="12" r="4" fill="${p.c2}"><animate attributeName="cy" values="4;20;4" dur="${1.8 + i*.25}s" repeatCount="indefinite"/></circle>`).join("")}
    ${st >= 2 ? `<path d="M30 40 H90" stroke="${p.c2}" stroke-width="2.4" stroke-dasharray="4 3" opacity=".8"/>` : ""}${st === 3 ? `<circle cx="60" cy="112" r="5" fill="#FDE047" stroke="#B45309" stroke-width="1.6"/>` : ""}${face(60, 44, m, .85, st)}${ac(p, st, 16, 60)}`),
  /* approval stamp: rubber stamp pressing, leaving an APPROVED mark */
  stamp: (p, st, m) => bob(`<rect x="24" y="96" width="72" height="12" rx="4" fill="${p.c2}" stroke="#7F1D1D" stroke-opacity=".5" stroke-width="2.4"/>${st >= 2 ? `<text x="60" y="106" font-size="9" font-weight="800" fill="#DC2626" text-anchor="middle" transform="rotate(-6 60 106)">${st === 3 ? "APPROVED" : "OK"}</text>` : ""}
    <rect x="30" y="64" width="60" height="30" rx="5" fill="${p.c1}" stroke="#7F1D1D" stroke-opacity=".5" stroke-width="3"/><path d="M48 64 V38 Q48 28 60 28 Q72 28 72 38 V64Z" fill="${p.c1}" stroke="#7F1D1D" stroke-opacity=".5" stroke-width="3"/><ellipse cx="60" cy="24" rx="14" ry="8" fill="${p.c1}" stroke="#7F1D1D" stroke-opacity=".5" stroke-width="3"/>
    ${face(60, 78, m, .8, st)}${ac(p, st, 18, 60)}`),
  /* market-share pie: a whole pie, then a pulled-out slice, then two slices and a star */
  pie: (p, st, m) => { const ang = pick(st, 70, 110, 150), a1 = (-90) * Math.PI/180, a2 = (-90 + ang) * Math.PI/180, R = 40, C = [60, 66];
    const pt = a => `${(C[0] + R*Math.cos(a)).toFixed(1)} ${(C[1] + R*Math.sin(a)).toFixed(1)}`;
    return bob(`<circle cx="${C[0]}" cy="${C[1]}" r="${R}" fill="${p.c1}" stroke="#334155" stroke-width="3"/><g transform="translate(${st >= 2 ? 6 : 0} ${st >= 2 ? -5 : 0})"><path d="M${C[0]} ${C[1]} L${pt(a1)} A${R} ${R} 0 ${ang > 180 ? 1 : 0} 1 ${pt(a2)}Z" fill="${p.c2}" stroke="#334155" stroke-width="3" stroke-linejoin="round"/></g>
    ${st === 3 ? `<path d="M30 84 Q40 94 52 90" stroke="#fff" stroke-width="3" fill="none" opacity=".5" stroke-linecap="round"/>` : ""}${face(46, 76, m, .75, st)}${st === 3 ? spark(100, 26, 1.1) : ""}${ac(p, st, 22, 60)}`); },
  /* delivery truck: boxes pile into the back as it grows */
  truck: (p, st, m) => bob(`<rect x="8" y="34" width="68" height="52" rx="6" fill="${p.c1}" stroke="#334155" stroke-width="3"/><path d="M76 48 H98 L112 66 V86 H76Z" fill="${p.c2}" stroke="#334155" stroke-width="3" stroke-linejoin="round"/><path d="M84 54 H96 L104 66 H84Z" fill="#BAE6FD" stroke="#334155" stroke-width="2"/>
    ${st >= 2 ? `<rect x="14" y="18" width="20" height="16" rx="2" fill="#FDE68A" stroke="#92400E" stroke-width="2"/>` : ""}${st === 3 ? `<rect x="38" y="14" width="22" height="20" rx="2" fill="#FCD34D" stroke="#92400E" stroke-width="2"/>` : ""}
    <circle cx="28" cy="90" r="9" fill="#1F2937"/><circle cx="28" cy="90" r="3.4" fill="#9CA3AF"/><circle cx="92" cy="90" r="9" fill="#1F2937"/><circle cx="92" cy="90" r="3.4" fill="#9CA3AF"/>${face(42, 60, m, .85, st)}${ac(p, st, 12, 70)}`),
  /* customer magnet: a horseshoe that pulls in coins */
  magnet: (p, st, m) => bob(`<path d="M28 100 V52 A32 32 0 0 1 92 52 V100" fill="none" stroke="${p.c1}" stroke-width="20" stroke-linecap="butt"/><rect x="18" y="88" width="20" height="14" fill="#E5E7EB" stroke="#64748B" stroke-width="2"/><rect x="82" y="88" width="20" height="14" fill="#E5E7EB" stroke="#64748B" stroke-width="2"/>
    ${[[60, 8], [42, 14], [78, 14]].slice(0, pick(st, 1, 2, 3)).map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="5" fill="#FBBF24" stroke="#B45309" stroke-width="1.6"><animate attributeName="cy" values="${y + 10};${y};${y + 10}" dur="${1.6 + i*.3}s" repeatCount="indefinite"/></circle>`).join("")}
    ${face(60, 66, m, .85, st)}${ac(p, st, 26, 60)}`),
  /* five-star review: stars light up as it grows */
  stars: (p, st, m) => { const n = pick(st, 3, 4, 5), star = (x, y, r, on) => `<path d="${Array.from({ length: 10 }, (_, i) => { const a = -Math.PI/2 + i*Math.PI/5, rr = i % 2 ? r*.45 : r; return (i ? "L" : "M") + (x + rr*Math.cos(a)).toFixed(1) + " " + (y + rr*Math.sin(a)).toFixed(1); }).join("")}Z" fill="${on ? p.c1 : "#E5E7EB"}" stroke="#B45309" stroke-opacity=".5" stroke-width="2" stroke-linejoin="round"/>`;
    return bob(`${[0, 1, 2, 3, 4].map(i => star(14 + i*23, 28, 11, i < n)).join("")}${star(60, 78, 34, true)}${face(60, 80, m, .85, st)}${ac(p, st, 40, 60)}`); },
  /* mailbox: flag up, envelopes arriving */
  mailbox: (p, st, m) => bob(`<rect x="54" y="74" width="12" height="34" fill="#92400E"/><path d="M24 74 V46 Q24 24 52 24 H72 Q96 24 96 46 V74Z" fill="${p.c1}" stroke="#1E3A8A" stroke-opacity=".5" stroke-width="3" stroke-linejoin="round"/>
    <rect x="92" y="${st === 1 ? 44 : 22}" width="4" height="${st === 1 ? 14 : 32}" fill="#334155"/><rect x="96" y="${st === 1 ? 44 : 22}" width="14" height="10" fill="#EF4444" stroke="#7F1D1D" stroke-width="1.6"/>
    ${st >= 2 ? `<rect x="30" y="10" width="26" height="18" rx="2" fill="#fff" stroke="#64748B" stroke-width="2"/><path d="M30 10 l13 10 l13 -10" fill="none" stroke="#64748B" stroke-width="2"/>` : ""}${st === 3 ? `<rect x="58" y="6" width="26" height="18" rx="2" fill="#FEF9C3" stroke="#64748B" stroke-width="2"/><path d="M58 6 l13 10 l13 -10" fill="none" stroke="#64748B" stroke-width="2"/>` : ""}
    ${face(58, 54, m, .9, st)}${ac(p, st, 22, 56)}`),
  /* target market: a bullseye whose rings multiply and arrow lands in the center */
  target: (p, st, m) => bob(`${[44, 32, 20].slice(0, pick(st, 2, 3, 3)).map((r, i) => `<circle cx="60" cy="64" r="${r}" fill="${i % 2 ? "#fff" : p.c1}" stroke="#7F1D1D" stroke-opacity=".5" stroke-width="2.4"/>`).join("")}${st === 3 ? `<circle cx="60" cy="64" r="8" fill="${p.c1}"/>` : ""}
    ${st >= 2 ? `<path d="M60 64 L104 22" stroke="#92400E" stroke-width="3" stroke-linecap="round"/><path d="M104 22 l2 -10 M104 22 l10 -2 M98 28 l2 -8 M98 28 l8 -2" stroke="#EF4444" stroke-width="3" stroke-linecap="round"/>` : ""}
    ${face(60, st === 3 ? 76 : 66, m, .65, st)}${ac(p, st, 18, 52)}`),
  /* positioning compass: the needle swings to the chosen spot */
  compass: (p, st, m) => bob(`<circle cx="60" cy="64" r="44" fill="${p.c2}" stroke="${p.c1}" stroke-width="6"/><circle cx="60" cy="64" r="36" fill="none" stroke="${p.c1}" stroke-width="1.6" stroke-dasharray="2 4"/>
    ${["N", "E", "S", "W"].map((t, i) => `<text x="${[60, 92, 60, 28][i]}" y="${[32, 68, 100, 68][i]}" font-size="9" font-weight="800" text-anchor="middle" fill="${p.c1}">${t}</text>`).join("")}
    <g><animateTransform attributeName="transform" type="rotate" values="${pick(st, "-15 60 64;15 60 64;-15 60 64", "-30 60 64;25 60 64;-30 60 64", "30 60 64;50 60 64;30 60 64")}" dur="${pick(st, 3, 2.6, 3.4)}s" repeatCount="indefinite"/><path d="M60 26 L68 64 H52Z" fill="#EF4444"/><path d="M60 102 L68 64 H52Z" fill="#94A3B8"/></g>
    ${face(60, 64, m, .6, st)}${ac(p, st, 18, 60)}`),
  /* cash register: drawer opens and a receipt prints */
  register: (p, st, m) => bob(`${st >= 2 ? `<rect x="78" y="14" width="22" height="${st === 3 ? 36 : 22}" fill="#fff" stroke="#94A3B8" stroke-width="2"/><path d="M82 24 h14 M82 31 h14 ${st === 3 ? "M82 38 h14 M82 45 h8" : ""}" stroke="#CBD5E1" stroke-width="2"/>` : ""}
    <path d="M18 56 L30 30 H78 L90 56Z" fill="${p.c2}" stroke="#334155" stroke-width="3" stroke-linejoin="round"/><rect x="14" y="56" width="80" height="44" rx="7" fill="${p.c1}" stroke="#334155" stroke-width="3"/><rect x="${st === 3 ? 20 : 24}" y="${st === 3 ? 90 : 92}" width="${st === 3 ? 68 : 60}" height="14" rx="3" fill="#64748B" stroke="#334155" stroke-width="2.4"/>
    ${st === 3 ? `<circle cx="40" cy="96" r="3.5" fill="#FBBF24"/><circle cx="56" cy="96" r="3.5" fill="#FBBF24"/><circle cx="72" cy="96" r="3.5" fill="#FBBF24"/>` : ""}<rect x="38" y="36" width="32" height="12" rx="2" fill="#BBF7D0" stroke="#334155" stroke-width="2"/><text x="54" y="46" font-size="9" font-weight="800" text-anchor="middle" fill="#14532D">$</text>
    ${face(54, 74, m, .85, st)}${ac(p, st, 26, 54)}`),
  /* smartphone: notifications pile up */
  phone: (p, st, m) => bob(`<rect x="30" y="8" width="60" height="104" rx="12" fill="${p.c1}" stroke="#1E293B" stroke-width="4"/><rect x="36" y="20" width="48" height="78" rx="4" fill="${p.c2}"/><rect x="50" y="12" width="20" height="3" rx="1.5" fill="#1E293B" opacity=".6"/>
    ${[0, 1, 2].slice(0, pick(st, 1, 2, 3)).map(i => `<rect x="40" y="${24 + i*10}" width="40" height="7" rx="3.5" fill="#fff" stroke="${p.c1}" stroke-opacity=".6" stroke-width="1.4"/><circle cx="44" cy="${27.5 + i*10}" r="2" fill="#EF4444"/>`).join("")}
    <circle cx="94" cy="${st === 1 ? 20 : 16}" r="${st === 1 ? 7 : 9}" fill="#EF4444" stroke="#fff" stroke-width="2"/><text x="94" y="${st === 1 ? 23.5 : 20}" font-size="${st === 1 ? 8 : 10}" font-weight="800" fill="#fff" text-anchor="middle">${pick(st, 1, 5, 9)}</text>
    ${face(60, 78, m, .75, st)}${ac(p, st, 8, 60)}`),
  /* store shelf: more and more products */
  shelf: (p, st, m) => bob(`<rect x="8" y="48" width="104" height="8" rx="3" fill="#92400E"/><rect x="8" y="100" width="104" height="8" rx="3" fill="#92400E"/><rect x="12" y="20" width="6" height="88" fill="#B45309"/><rect x="102" y="20" width="6" height="88" fill="#B45309"/>
    ${[[22, p.c1], [38, "#60A5FA"], [86, "#FBBF24"]].slice(0, pick(st, 1, 2, 3)).map(([x, c]) => `<rect x="${x}" y="22" width="14" height="26" rx="3" fill="${c}" stroke="#334155" stroke-width="2"/>`).join("")}${st >= 2 ? `<rect x="22" y="72" width="14" height="28" rx="3" fill="#F472B6" stroke="#334155" stroke-width="2"/>` : ""}${st === 3 ? `<rect x="88" y="74" width="14" height="26" rx="3" fill="#34D399" stroke="#334155" stroke-width="2"/>` : ""}
    <rect x="46" y="62" width="40" height="38" rx="6" fill="${p.c2}" stroke="#334155" stroke-width="3"/>${face(66, 80, m, .75, st)}${ac(p, st, 18, 60)}`),
  /* idea bulb: dim, glowing, then radiant rays */
  bulb: (p, st, m) => bob(`${st >= 2 ? Array.from({ length: pick(st, 5, 7, 9) }, (_, i) => { const t = -Math.PI + i*Math.PI/(pick(st, 5, 7, 9) - 1), x1 = 60 + 42*Math.cos(t), y1 = 54 + 42*Math.sin(t), x2 = 60 + 54*Math.cos(t), y2 = 54 + 54*Math.sin(t); return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${p.c1}" stroke-width="3" stroke-linecap="round"><animate attributeName="opacity" values=".3;1;.3" dur="${1.4 + i*.1}s" repeatCount="indefinite"/></path>`; }).join("") : ""}
    <path d="M42 80 Q26 66 30 46 Q36 22 60 22 Q84 22 90 46 Q94 66 78 80 V90 H42Z" fill="${p.c1}" fill-opacity="${pick(st, .55, .8, 1)}" stroke="#92400E" stroke-opacity=".6" stroke-width="3"/><rect x="44" y="90" width="32" height="8" rx="3" fill="#94A3B8" stroke="#475569" stroke-width="2"/><rect x="48" y="98" width="24" height="8" rx="3" fill="#94A3B8" stroke="#475569" stroke-width="2"/>
    <path d="M50 78 V66 l5 -5 l5 5 l5 -5 l5 5 V78" fill="none" stroke="#B45309" stroke-width="2" opacity=".7"/>${face(60, 48, m, .95, st)}${ac(p, st, 18, 60)}`),
  /* handshake deal: two partners meet, link and seal a deal */
  handshake: (p, st, m) => { const g = pick(st, 22, 12, 4);
    return bob(`<g transform="translate(${-g} 0)"><circle cx="38" cy="64" r="26" fill="${p.c1}" stroke="#7C2D12" stroke-opacity=".5" stroke-width="3"/>${face(38, 62, m, .7, st)}</g><g transform="translate(${g} 0)"><circle cx="82" cy="64" r="26" fill="${p.c2}" stroke="#7C2D12" stroke-opacity=".5" stroke-width="3"/>${face(82, 62, m, .7, st)}</g>
    <path d="M${50 + g/2} 92 q${10} 10 ${20 - g} 0" fill="none" stroke="#7C2D12" stroke-width="4" stroke-linecap="round"/>${st === 3 ? `<circle cx="60" cy="104" r="9" fill="#FBBF24" stroke="#B45309" stroke-width="2"/><text x="60" y="108" font-size="10" font-weight="800" fill="#7C2D12" text-anchor="middle">✓</text>` : ""}${st >= 2 ? spark(60, 28, 1) : ""}${ac(p, st, 32, 60)}`); },
  /* global market: a globe whose orbit ring and satellite grow with it */
  globe: (p, st, m) => bob(`<circle cx="60" cy="64" r="38" fill="${p.c1}" stroke="#075985" stroke-opacity=".6" stroke-width="3"/><path d="M60 26 Q36 64 60 102 M60 26 Q84 64 60 102 M22 64 H98 M28 44 H92 M28 84 H92" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2"/>
    <path d="M36 52 q8 -8 16 0 q4 10 -6 12 q-8 2 -10 -12Z M70 70 q10 -4 14 6 q-4 10 -14 4Z" fill="${p.c2}" opacity=".9"/>
    ${st >= 2 ? `<ellipse cx="60" cy="64" rx="56" ry="14" fill="none" stroke="${p.c2}" stroke-width="2.6" transform="rotate(-20 60 64)"/>` : ""}${st === 3 ? `<circle cx="104" cy="44" r="5" fill="#FBBF24" stroke="#B45309" stroke-width="1.6"><animate attributeName="opacity" values=".4;1;.4" dur="1.8s" repeatCount="indefinite"/></circle>` : ""}
    ${face(60, 62, m, .85, st)}${ac(p, st, 22, 60)}`),
  /* golden brand badge: ® seal with rotating shine */
  brandgold: (p, st, m) => bob(`<g><animateTransform attributeName="transform" type="rotate" from="0 60 64" to="360 60 64" dur="${pick(st, 40, 30, 20)}s" repeatCount="indefinite"/>${Array.from({ length: 12 }, (_, i) => `<path d="M60 8 L64 22 L56 22Z" fill="${p.c1}" opacity=".7" transform="rotate(${i*30} 60 64)"/>`).join("")}</g>
    <circle cx="60" cy="64" r="${pick(st, 34, 37, 40)}" fill="${p.c1}" stroke="#B45309" stroke-width="3.5"/><circle cx="60" cy="64" r="${pick(st, 28, 31, 34)}" fill="none" stroke="${p.c2}" stroke-width="2.2" stroke-dasharray="3 3"/>
    <text x="${pick(st, 86, 90, 94)}" y="${pick(st, 40, 34, 30)}" font-size="13" font-weight="800" fill="#B45309">®</text>${face(60, 62, m, .95, st)}${st === 3 ? spark(20, 26, 1.2, "#fff") + spark(100, 100, 1, "#fff") : ""}${ac(p, st, 22, 60)}`),
  /* trophy: a small cup, then handles and a star, then a gleaming champion */
  trophy: (p, st, m) => bob(`${st >= 2 ? `<path d="M30 30 Q8 30 14 52 Q18 62 34 62 M90 30 Q112 30 106 52 Q102 62 86 62" fill="none" stroke="${p.c1}" stroke-width="6" stroke-linecap="round"/>` : ""}
    <path d="M30 20 H90 V44 Q90 76 60 76 Q30 76 30 44Z" fill="${p.c1}" stroke="#B45309" stroke-width="3.5" stroke-linejoin="round"/><rect x="54" y="76" width="12" height="16" fill="${p.c1}" stroke="#B45309" stroke-width="2.6"/><rect x="34" y="92" width="52" height="14" rx="4" fill="${p.c2}" stroke="#B45309" stroke-width="3"/>
    ${st >= 2 ? `<text x="60" y="104" font-size="9" font-weight="800" fill="#92400E" text-anchor="middle">#1</text>` : ""}${face(60, 46, m, .9, st)}${st === 3 ? spark(24, 16, 1.2, "#fff") + spark(98, 14, 1, "#fff") : ""}${ac(p, st, 16, 60)}`),
  /* unicorn startup: a horn and rainbow mane that grow */
  unicorn: (p, st, m) => bob(`<path d="M32 50 Q18 66 28 94 Q34 76 40 70Z" fill="#F472B6"/>${st >= 2 ? `<path d="M30 40 Q10 56 20 84 Q26 62 36 58Z" fill="#60A5FA"/>` : ""}${st === 3 ? `<path d="M34 32 Q6 46 12 76 Q20 52 34 50Z" fill="#FACC15"/>` : ""}
    <ellipse cx="62" cy="70" rx="38" ry="34" fill="${p.c1}" stroke="#7E22CE" stroke-opacity=".4" stroke-width="3"/><ellipse cx="86" cy="84" rx="16" ry="12" fill="${p.c2}" opacity=".7"/><circle cx="82" cy="84" r="2" fill="#7E22CE"/><circle cx="92" cy="84" r="2" fill="#7E22CE"/>
    <path d="M46 40 L40 12 L58 36Z" fill="#FDE047" stroke="#B45309" stroke-width="2.4" stroke-linejoin="round"/><path d="M62 36 L78 24 L74 44Z" fill="${p.c1}" stroke="#7E22CE" stroke-opacity=".4" stroke-width="2.4" stroke-linejoin="round"/>
    ${eye(56, 66, st === 1 ? 5 : 4.2, m)}${blush(46, 72, 74)}${mouth(80, 94, m, 4)}${st === 3 ? spark(100, 30, 1.2) + spark(14, 24, 1) : ""}${ac(p, st, 36, 54)}`),
  /* rocket growth: a small rocket, then bigger flame, then a blazing launch with stars */
  rocket: (p, st, m) => bob(`<path d="M44 86 Q60 ${pick(st, 108, 114, 118)} 76 86Z" fill="#FB923C"><animate attributeName="opacity" values=".6;1;.6" dur=".5s" repeatCount="indefinite"/></path><path d="M50 86 Q60 ${pick(st, 100, 106, 110)} 70 86Z" fill="#FDE047"/>
    <path d="M60 8 Q86 30 82 70 L80 90 H40 L38 70 Q34 30 60 8Z" fill="${p.c2}" stroke="#334155" stroke-width="3.2" stroke-linejoin="round"/><path d="M38 66 L22 90 L40 84Z M82 66 L98 90 L80 84Z" fill="${p.c1}" stroke="#334155" stroke-width="2.6" stroke-linejoin="round"/><path d="M60 8 Q74 20 78 38 H42 Q46 20 60 8Z" fill="${p.c1}"/>
    <circle cx="60" cy="54" r="14" fill="#E0F2FE" stroke="#334155" stroke-width="3"/>${face(60, 54, m, .6, st)}${st >= 2 ? spark(16, 24, 1) : ""}${st === 3 ? spark(104, 40, 1.2) + spark(20, 60, .9) : ""}${ac(p, st, 12, 60)}`),
  /* phoenix: a brand that rises again, wings grow wider */
  phoenix: (p, st, m) => { const w = pick(st, 24, 36, 48);
    return bob(`<path d="M60 70 Q${60 - w} 50 ${60 - w - 4} ${pick(st, 40, 28, 18)} Q${60 - w + 10} 66 56 80Z" fill="${p.c1}" stroke="#9A3412" stroke-opacity=".5" stroke-width="2.4"/><path d="M60 70 Q${60 + w} 50 ${60 + w + 4} ${pick(st, 40, 28, 18)} Q${60 + w - 10} 66 64 80Z" fill="${p.c1}" stroke="#9A3412" stroke-opacity=".5" stroke-width="2.4"/>
    <path d="M44 100 Q60 124 76 100 Q74 112 60 116 Q46 112 44 100Z" fill="#F59E0B"><animate attributeName="opacity" values=".6;1;.6" dur=".8s" repeatCount="indefinite"/></path>
    <ellipse cx="60" cy="76" rx="22" ry="28" fill="${p.c2}" stroke="#9A3412" stroke-opacity=".5" stroke-width="3"/><circle cx="60" cy="48" r="16" fill="${p.c2}" stroke="#9A3412" stroke-opacity=".5" stroke-width="3"/><path d="M60 34 q-4 -14 2 -22 q2 10 8 14" fill="${p.c1}"/><path d="M56 54 L60 62 L64 54Z" fill="#FBBF24"/>
    ${eye(52, 46, st === 1 ? 4.6 : 3.8, m)}${eye(68, 46, st === 1 ? 4.6 : 3.8, m)}${st === 3 ? spark(16, 20, 1.1) + spark(104, 22, 1.1) : ""}${ac(p, st, 32, 60)}`); },
  /* marketing mix master: four P petals around a core */
  mixmaster: (p, st, m) => { const L = ["P", "$", "→", "!"], pos = [[60, 24], [96, 64], [60, 104], [24, 64]], col = ["#F472B6", "#FBBF24", "#34D399", "#60A5FA"];
    return bob(`<circle cx="60" cy="64" r="56" fill="${p.c2}" opacity=".14"><animate attributeName="r" values="50;58;50" dur="3s" repeatCount="indefinite"/></circle><g><animateTransform attributeName="transform" type="rotate" values="0 60 64;360 60 64" dur="${pick(st, 40, 30, 20)}s" repeatCount="indefinite"/>${pos.slice(0, pick(st, 2, 3, 4)).map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="13" fill="${col[i]}" stroke="#fff" stroke-width="2.6"/><text x="${x}" y="${y + 5}" font-size="14" font-weight="800" fill="#1F2430" text-anchor="middle">${L[i]}</text>`).join("")}</g>
    <circle cx="60" cy="64" r="${pick(st, 25, 28, 30)}" fill="${p.c1}" stroke="#fff" stroke-width="3"/><circle cx="52" cy="54" r="8" fill="#fff" opacity=".35"/>${face(60, 63, m, 1, st)}${st === 3 ? spark(14, 16, 1.2) + spark(106, 108, 1.2) : ""}${ac(p, st, 32, 60)}`); }
};
})();
