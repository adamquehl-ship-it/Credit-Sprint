/* Credit Sprint Precalculus pet art: original math creatures (graphs, functions, the unit circle, vectors and matrices), each with its own design that grows with the pet (st: 1 baby, 2 teen, 3 adult). Used through CUSTOM.pc -> window.CS_PCART[p.body]. */
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
const grow = (st, s) => `<g transform="translate(60 108) scale(${st === 1 ? .8 : st === 2 ? .92 : 1}) translate(-60 -108)">${s}</g>`;
const pick = (st, a, b, c) => st === 1 ? a : st === 2 ? b : c;
const spark = (x, y, s = 1, c = "#FDE047") => `<path d="M${x} ${y-6*s} L${x+1.8*s} ${y-1.8*s} L${x+6*s} ${y} L${x+1.8*s} ${y+1.8*s} L${x} ${y+6*s} L${x-1.8*s} ${y+1.8*s} L${x-6*s} ${y} L${x-1.8*s} ${y-1.8*s}Z" fill="${c}"><animate attributeName="opacity" values=".3;1;.3" dur="${1.6+(x%7)/10}s" repeatCount="indefinite"/></path>`;
const bubbles = (list, c = "#fff") => list.map(([x, y, r], i) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity=".7" stroke="#0EA5E9" stroke-opacity=".4"><animate attributeName="cy" values="${y};${y-10};${y}" dur="${2+i*.4}s" repeatCount="indefinite"/></circle>`).join("");

const so = (w = 2.8) => `stroke="#1E1B4B" stroke-opacity=".45" stroke-width="${w}"`;
const sym = (x, y, s, size = 16, c = "#fff") => `<text x="${x}" y="${y}" font-size="${size}" font-weight="900" text-anchor="middle" fill="${c}" font-family="Georgia, 'Times New Roman', serif" font-style="italic">${s}</text>`;
const ear = (x, y, r, c, rot = 0) => `<ellipse cx="${x}" cy="${y}" rx="${r * .6}" ry="${r}" fill="${c}" transform="rotate(${rot} ${x} ${y})" ${so(2.6)}/>`;
const EYEG = (x, y) => `<circle cx="${x}" cy="${y}" r="4" fill="#FDE047"><animate attributeName="r" values="3.4;4.4;3.4" dur="1.8s" repeatCount="indefinite"/></circle><circle cx="${x}" cy="${y}" r="1.6" fill="#1F2430"/>`;
window.CS_PCART = {
  /* a parabola-shaped pup */
  parab: (p, st, m) => bob(grow(st, `<path d="M22 30 Q60 150 98 30" fill="none" stroke="${p.c1}" stroke-width="14" stroke-linecap="round"/><ellipse cx="60" cy="78" rx="24" ry="18" fill="${p.c1}" ${so(3)}/><ellipse cx="60" cy="84" rx="13" ry="8" fill="${p.c2}"/>${face(60, 74, m, .8, st)}${ac(p, st, 56, 60)}`)),
  /* an S-shaped cubic critter */
  cubic: (p, st, m) => bob(grow(st, `<path d="M18 96 C30 20 50 30 60 62 C70 94 90 104 102 28" fill="none" stroke="${p.c2}" stroke-width="9" stroke-linecap="round"/><circle cx="60" cy="62" r="22" fill="${p.c1}" ${so(3)}/>${face(60, 60, m, .75, st)}${sym(60, 96, "x³", 14, p.c1)}${ac(p, st, 38, 60)}`)),
  /* a wiggly sine-wave worm */
  wave: (p, st, m) => bob(grow(st, `<path d="M12 72 Q27 42 42 72 T72 72 T102 72" fill="none" stroke="#1E1B4B" stroke-opacity=".45" stroke-width="22" stroke-linecap="round"/><path d="M12 72 Q27 42 42 72 T72 72 T102 72" fill="none" stroke="${p.c1}" stroke-width="16" stroke-linecap="round"/><circle cx="102" cy="68" r="15" fill="${p.c1}" ${so(2.6)}/><circle cx="102" cy="68" r="10" fill="${p.c2}" opacity=".5"/>${face(102, 66, m, .55, st)}${ac(p, st, 52, 102)}`)),
  /* a pi symbol with feet */
  pi: (p, st, m) => bob(grow(st, `<rect x="22" y="30" width="76" height="16" rx="8" fill="${p.c1}" ${so(3)}/><path d="M42 44 Q40 80 30 100" stroke="#1E1B4B" stroke-opacity=".45" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M42 44 Q40 80 30 100" stroke="${p.c1}" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M78 44 Q76 84 92 100" stroke="#1E1B4B" stroke-opacity=".45" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M78 44 Q76 84 92 100" stroke="${p.c1}" stroke-width="11" fill="none" stroke-linecap="round"/><circle cx="60" cy="66" r="15" fill="${p.c2}" ${so(2)}/>${face(60, 64, m, .6, st)}${ac(p, st, 26, 60)}`)),
  /* a wooden log that loves logarithms */
  logbody: (p, st, m) => bob(grow(st, `<rect x="18" y="52" width="80" height="44" rx="22" fill="${p.c1}" ${so(3)}/><ellipse cx="96" cy="74" rx="12" ry="22" fill="${p.c2}" ${so(2.4)}/><ellipse cx="96" cy="74" rx="6" ry="12" fill="none" stroke="${p.c1}" stroke-width="2"/><path d="M30 60 q10 4 20 0 M28 88 q12 -4 24 0" stroke="#78350F" stroke-width="2" fill="none"/>${face(56, 72, m, .75, st)}<text x="56" y="44" font-size="13" font-weight="900" text-anchor="middle" fill="${p.c1}" font-family="Georgia, serif" font-style="italic">log</text>${ac(p, st, 30, 56)}`)),
  /* a sprout whose leaves double */
  expo: (p, st, m) => bob(grow(st, `<path d="M60 104 V50" stroke="#15803D" stroke-width="5"/>${[[46, 78, 6], [74, 70, 8], [42, 58, 10], [78, 46, 13]].slice(0, st + 1).map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .6}" fill="${p.c1}" ${so(1.6)} transform="rotate(${x < 60 ? 25 : -25} ${x} ${y})"/>`).join("")}<path d="M38 104 H82 L76 86 H44Z" fill="${p.c2}" ${so(2.6)}/>${face(60, 95, m, .55, st)}${sym(60, 34, "2ˣ", 16, p.c1)}${ac(p, st, 20, 60)}`)),
  /* a round unit circle with axes */
  circle: (p, st, m) => bob(grow(st, `<circle cx="60" cy="64" r="36" fill="${p.c1}" ${so(3)}/><path d="M20 64 H100 M60 24 V104" stroke="${p.c2}" stroke-width="2.4" stroke-dasharray="4 3"/>${[[96, 64], [60, 28], [24, 64], [60, 100]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.6" fill="${p.c2}"/>`).join("")}<circle cx="60" cy="64" r="20" fill="#fff" opacity=".85"/>${face(60, 62, m, .7, st)}${ac(p, st, 26, 60)}`)),
  /* a friendly arrow vector */
  arrow: (p, st, m) => bob(grow(st, `<path d="M16 92 L72 44" stroke="#1E1B4B" stroke-opacity=".45" stroke-width="22" stroke-linecap="round"/><path d="M16 92 L72 44" stroke="${p.c1}" stroke-width="16" stroke-linecap="round"/><path d="M60 30 L104 22 L94 64Z" fill="${p.c1}" ${so(3)} stroke-linejoin="round"/><circle cx="42" cy="70" r="15" fill="${p.c2}" ${so(2)}/>${face(42, 68, m, .55, st)}${ac(p, st, 18, 92)}`)),
  /* a ghost that gets close to a dashed line but never touches */
  asym: (p, st, m) => bob(grow(st, `<path d="M96 8 V112" stroke="${p.c2}" stroke-width="3" stroke-dasharray="6 5"/><path d="M26 102 V56 A30 30 0 0 1 86 56 V102 l-10 -8 l-10 8 l-10 -8 l-10 8 l-10 -8 l-10 8Z" fill="${p.c1}" ${so(3)} stroke-linejoin="round"/>${face(56, 62, m, .8, st)}${ac(p, st, 26, 56)}`)),
  /* a donut with a hole: a removable discontinuity */
  hole: (p, st, m) => bob(grow(st, `<ellipse cx="60" cy="70" rx="40" ry="32" fill="${p.c1}" ${so(3)}/><path d="M26 62 Q34 48 50 46 Q70 40 90 54 Q96 64 88 66 Q74 58 60 62 Q42 66 30 70Z" fill="${p.c2}"/>${[[40, 56, "#22D3EE"], [70, 50, "#FDE047"], [82, 60, "#F472B6"]].map(([x, y, c]) => `<rect x="${x}" y="${y}" width="6" height="2.4" rx="1" fill="${c}" transform="rotate(30 ${x} ${y})"/>`).join("")}<ellipse cx="60" cy="74" rx="9" ry="6" fill="#fff" stroke="#1E1B4B" stroke-opacity=".4" stroke-dasharray="3 2"/>${face(60, 88, m, .6, st)}${ac(p, st, 36, 60)}`)),
  /* a snail whose shell is a sequence spiral */
  seq: (p, st, m) => bob(grow(st, `<path d="M14 100 H96 Q106 100 104 92 Q100 84 90 86 L40 86 Q20 86 14 100Z" fill="${p.c2}" ${so(2.6)}/><circle cx="56" cy="62" r="28" fill="${p.c1}" ${so(3)}/><path d="M56 62 m0 -4 a4 4 0 1 1 -4 4 a8 8 0 1 1 8 8 a14 14 0 1 1 -14 -14 a20 20 0 1 1 20 20" fill="none" stroke="${p.c2}" stroke-width="2.6"/><path d="M96 86 V70 M104 86 V72" stroke="${p.c2}" stroke-width="3"/><circle cx="96" cy="68" r="3" fill="#1F2430"/><circle cx="104" cy="70" r="3" fill="#1F2430"/>${face(90, 94, m, .45, st)}${ac(p, st, 32, 56)}`)),
  /* a pizza slice measured in radians */
  radian: (p, st, m) => bob(grow(st, `<path d="M60 104 L22 34 A80 80 0 0 1 98 34Z" fill="${p.c2}" ${so(3)} stroke-linejoin="round"/><path d="M22 34 A80 80 0 0 1 98 34" stroke="${p.c1}" stroke-width="9" fill="none" stroke-linecap="round"/>${[[48, 52], [72, 50], [60, 72]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#DC2626" opacity=".85"/>`).join("")}${face(60, 62, m, .65, st)}${sym(60, 24, "1 rad", 10, "#fff")}${ac(p, st, 14, 60)}`)),
  /* a block robot made of a matrix */
  matrix: (p, st, m) => bob(grow(st, `<rect x="24" y="30" width="72" height="72" rx="10" fill="${p.c1}" ${so(3)}/><path d="M32 38 v56 h4 M88 38 v56 h-4 M32 38 h4 M88 38 h-4" stroke="${p.c2}" stroke-width="3" fill="none"/>${[[46, 84, "2"], [74, 84, "1"]].map(([x, y, s]) => `<text x="${x}" y="${y}" font-size="13" font-weight="900" text-anchor="middle" fill="${p.c2}" font-family="sans-serif">${s}</text>`).join("")}<path d="M60 30 V18" stroke="${p.c2}" stroke-width="3"/><circle cx="60" cy="16" r="4" fill="#FDE047"/>${face(60, 58, m, .8, st)}${ac(p, st, 12, 60)}`)),
  /* a striped tangent tiger with asymptote stripes */
  tan: (p, st, m) => bob(grow(st, `<ellipse cx="60" cy="72" rx="36" ry="30" fill="${p.c1}" ${so(3)}/><path d="M30 48 L36 34 L46 46 M90 48 L84 34 L74 46" fill="${p.c1}" stroke="#1E1B4B" stroke-opacity=".45" stroke-width="2"/>${[34, 86].map(x => `<path d="M${x - 6} 94 C${x - 2} 72 ${x + 2} 72 ${x + 6} 50" stroke="#1F2430" stroke-width="3" fill="none"/>`).join("")}<ellipse cx="60" cy="80" rx="16" ry="12" fill="${p.c2}"/>${face(60, 70, m, .8, st)}${ac(p, st, 40, 60)}`)),
  /* Pascal's triangle of number bubbles */
  pascal: (p, st, m) => bob(grow(st, `${[[0, [1]], [1, [1, 1]], [2, [1, 2, 1]], [3, [1, 3, 3, 1]]].map(([r, row]) => row.map((v, i) => { const x = 60 + (i - (row.length - 1) / 2) * 20, y = 30 + r * 20; return `<circle cx="${x}" cy="${y}" r="9.5" fill="${r === 2 && i === 1 ? p.c2 : p.c1}" ${so(1.8)}/><text x="${x}" y="${y + 4}" font-size="10" font-weight="900" text-anchor="middle" fill="#fff" font-family="sans-serif">${v}</text>`; }).join("")).join("")}<rect x="22" y="94" width="76" height="12" rx="6" fill="${p.c2}" ${so(2)}/>${face(60, 52, m, .45, st)}${ac(p, st, 16, 60)}`)),
  /* an Archimedean spiral creature */
  spiral: (p, st, m) => { let d = "M60 62"; for (let i = 1; i <= 120; i++) { const t = i / 12, r = 3.4 * t; d += ` L${(60 + r * Math.cos(t)).toFixed(1)} ${(62 + r * Math.sin(t)).toFixed(1)}`; }
    return bob(grow(st, `<circle cx="60" cy="62" r="42" fill="${p.c2}" ${so(3)}/><path d="${d}" fill="none" stroke="${p.c1}" stroke-width="4.5" stroke-linecap="round"/><circle cx="60" cy="62" r="13" fill="#fff" ${so(1.6)}/>${face(60, 60, m, .5, st)}${ac(p, st, 18, 60)}`)); },
  /* a polar rose flower */
  rose: (p, st, m) => { let d = ""; for (let i = 0; i <= 360; i += 3) { const t = i * Math.PI / 180, r = 40 * Math.cos(3 * t); d += `${i ? "L" : "M"}${(60 + r * Math.cos(t)).toFixed(1)} ${(56 - r * Math.sin(t)).toFixed(1)}`; }
    return bob(grow(st, `<path d="M60 70 Q56 90 62 108" stroke="#15803D" stroke-width="5" fill="none"/><path d="${d}" fill="${p.c1}" ${so(2.6)}/><circle cx="60" cy="56" r="14" fill="${p.c2}" ${so(2)}/>${face(60, 55, m, .55, st)}${ac(p, st, 14, 60)}`)); },
  /* an egg shaped like an ellipse with marked foci */
  ellipse: (p, st, m) => bob(grow(st, `<ellipse cx="60" cy="66" rx="44" ry="32" fill="${p.c1}" ${so(3)}/><circle cx="32" cy="66" r="3.6" fill="${p.c2}"/><circle cx="88" cy="66" r="3.6" fill="${p.c2}"/><path d="M32 66 L60 34 L88 66" stroke="${p.c2}" stroke-width="1.8" fill="none" stroke-dasharray="3 3"/>${face(60, 70, m, .8, st)}${ac(p, st, 32, 60)}`)),
  /* an owl wearing the number e */
  euler: (p, st, m) => bob(grow(st, `<ellipse cx="60" cy="68" rx="34" ry="38" fill="${p.c1}" ${so(3)}/><path d="M30 38 L36 24 L46 36 M90 38 L84 24 L74 36" fill="${p.c1}" ${so(2)}/><ellipse cx="60" cy="82" rx="20" ry="18" fill="${p.c2}"/>${sym(60, 92, "e", 22, p.c1)}<circle cx="47" cy="52" r="11" fill="#fff" ${so(1.4)}/><circle cx="73" cy="52" r="11" fill="#fff" ${so(1.4)}/>${m === "sleepy" ? `<path d="M41 52 q6 5 12 0 M67 52 q6 5 12 0" stroke="#1F2430" stroke-width="2.2" fill="none"/>` : `<circle cx="47" cy="52" r="5" fill="#1F2430"/><circle cx="73" cy="52" r="5" fill="#1F2430"/>`}<path d="M56 60 L60 66 L64 60Z" fill="#F59E0B"/>${ac(p, st, 30, 60)}`)),
  /* a protractor crab */
  protractor: (p, st, m) => bob(grow(st, `<path d="M18 90 A42 42 0 0 1 102 90Z" fill="${p.c1}" ${so(3)} opacity=".95"/>${Array.from({ length: 9 }, (_, i) => { const a = Math.PI * i / 8; return `<line x1="${60 - 42 * Math.cos(a)}" y1="${90 - 42 * Math.sin(a)}" x2="${60 - 34 * Math.cos(a)}" y2="${90 - 34 * Math.sin(a)}" stroke="${p.c2}" stroke-width="2"/>`; }).join("")}<path d="M14 76 q-8 -10 2 -18 q4 8 10 6 M106 76 q8 -10 -2 -18 q-4 8 -10 6" fill="${p.c2}" ${so(1.6)}/>${[30, 42, 78, 90].map(x => `<path d="M${x} 92 l${x < 60 ? -4 : 4} 12" stroke="${p.c2}" stroke-width="4" stroke-linecap="round"/>`).join("")}${face(60, 74, m, .75, st)}${ac(p, st, 44, 60)}`)),
  /* a butterfly whose wings are hyperbola branches */
  hyper: (p, st, m) => bob(grow(st, `<path d="M56 62 C30 20 6 30 10 52 C14 76 36 72 56 66Z" fill="${p.c1}" ${so(2.6)}/><path d="M64 62 C90 20 114 30 110 52 C106 76 84 72 64 66Z" fill="${p.c1}" ${so(2.6)}/><path d="M56 70 C36 80 24 104 40 106 C52 106 56 86 58 74Z" fill="${p.c2}" ${so(2.2)}/><path d="M64 70 C84 80 96 104 80 106 C68 106 64 86 62 74Z" fill="${p.c2}" ${so(2.2)}/><path d="M20 20 L100 104 M100 20 L20 104" stroke="#fff" stroke-width="1.4" stroke-dasharray="4 4" opacity=".7"/><ellipse cx="60" cy="68" rx="8" ry="24" fill="#1F2430" opacity=".8"/><circle cx="60" cy="42" r="11" fill="${p.c2}" ${so(1.8)}/>${face(60, 41, m, .4, st)}${ac(p, st, 26, 60)}`)),
  /* a cardioid heart */
  cardioid: (p, st, m) => { let d = ""; for (let i = 0; i <= 360; i += 3) { const t = i * Math.PI / 180, r = 22 * (1 + Math.sin(t)); d += `${i ? "L" : "M"}${(60 + r * Math.cos(t)).toFixed(1)} ${(100 - r * Math.sin(t)).toFixed(1)}`; }
    return bob(grow(st, `<path d="${d}" fill="${p.c1}" ${so(3)}/><path d="M44 30 q-6 10 4 16" stroke="#fff" stroke-width="4" fill="none" opacity=".6" stroke-linecap="round"/>${face(60, 64, m, .8, st)}${ac(p, st, 16, 60)}`)); },
  /* a snake shaped like a slide rule */
  slide: (p, st, m) => bob(grow(st, `<path d="M14 94 Q14 74 34 74 H86 Q106 74 106 54 Q106 34 86 34 H40" stroke="#1E1B4B" stroke-opacity=".45" stroke-width="24" fill="none" stroke-linecap="round"/><path d="M14 94 Q14 74 34 74 H86 Q106 74 106 54 Q106 34 86 34 H40" stroke="${p.c1}" stroke-width="18" fill="none" stroke-linecap="round"/>${[40, 50, 58, 64, 70, 74, 78].map(x => `<path d="M${x} 68 v6" stroke="${p.c2}" stroke-width="1.6"/>`).join("")}<circle cx="34" cy="34" r="16" fill="${p.c1}" ${so(2.6)}/>${face(34, 32, m, .55, st)}<path d="M18 36 h-8 l-4 -3 M10 36 l-4 3" stroke="#DC2626" stroke-width="1.8" fill="none"/>${ac(p, st, 18, 34)}`)),
  /* a graphing calculator golem */
  graphcalc: (p, st, m) => bob(grow(st, `<rect x="28" y="12" width="64" height="96" rx="12" fill="${p.c1}" ${so(3)}/><rect x="36" y="20" width="48" height="34" rx="4" fill="#A7F3D0" stroke="#064E3B" stroke-width="1.6"/><path d="M38 46 Q50 22 60 38 T82 26" stroke="#064E3B" stroke-width="2" fill="none"/>${Array.from({ length: 12 }, (_, i) => `<rect x="${38 + (i % 4) * 12}" y="${78 + Math.floor(i / 4) * 9}" width="8" height="6" rx="1.6" fill="${i === 11 ? "#F59E0B" : p.c2}"/>`).join("")}${face(60, 64, m, .6, st)}${ac(p, st, 10, 60)}`)),
  /* a golden-ratio nautilus */
  nautilus: (p, st, m) => { let d = "M64 60"; for (let i = 1; i <= 140; i++) { const t = i / 16, r = 1.6 * Math.exp(0.306 * t); if (r > 44) break; d += ` L${(64 + r * Math.cos(t)).toFixed(1)} ${(60 - r * Math.sin(t)).toFixed(1)}`; }
    return bob(grow(st, `<circle cx="62" cy="60" r="44" fill="${p.c1}" ${so(3)}/><path d="${d}" fill="none" stroke="${p.c2}" stroke-width="4" stroke-linecap="round"/><path d="M18 74 q-10 6 -6 18 q8 -2 10 -10 M22 82 q-6 10 2 18" stroke="${p.c1}" stroke-width="5" fill="none" stroke-linecap="round"/>${face(36, 70, m, .55, st)}${spark(100, 22, .6)}${ac(p, st, 16, 62)}`)); },
  /* a phoenix whose wings are sine waves */
  phoenix: (p, st, m) => bob(grow(st, `<path d="M56 60 Q40 30 26 46 Q14 60 4 40 Q10 72 34 74 Q48 74 56 70Z" fill="${p.c1}" ${so(2.6)}/><path d="M64 60 Q80 30 94 46 Q106 60 116 40 Q110 72 86 74 Q72 74 64 70Z" fill="${p.c1}" ${so(2.6)}/><path d="M50 96 Q60 120 70 96" fill="${p.c2}" ${so(2)}/><ellipse cx="60" cy="72" rx="16" ry="24" fill="${p.c2}" ${so(2.6)}/><path d="M52 40 q8 -16 16 0" fill="#FDE047"/>${face(60, 62, m, .6, st)}${spark(20, 24, .6)}${spark(100, 22, .6)}${ac(p, st, 36, 60)}`)),
  /* a dragon made of nested fractal triangles */
  fractal: (p, st, m) => { const tri = (x, y, s, n) => n === 0 ? `<path d="M${x} ${y - s} L${x + s * .87} ${y + s / 2} L${x - s * .87} ${y + s / 2}Z" fill="${p.c1}" stroke="#1E1B4B" stroke-opacity=".4" stroke-width="1"/>` : tri(x, y - s / 2, s / 2, n - 1) + tri(x + s * .435, y + s / 4, s / 2, n - 1) + tri(x - s * .435, y + s / 4, s / 2, n - 1);
    return bob(grow(st, `${tri(60, 70, 46, 3)}<circle cx="60" cy="78" r="14" fill="${p.c2}" ${so(2.2)}/>${face(60, 77, m, .55, st)}<path d="M18 86 q-12 -6 -10 -20 M102 86 q12 -6 10 -20" stroke="${p.c2}" stroke-width="5" fill="none" stroke-linecap="round"/>${ac(p, st, 22, 60)}`)); },
  /* a three-headed function hydra: f, g and h */
  hydraf: (p, st, m) => bob(grow(st, `<ellipse cx="60" cy="88" rx="36" ry="20" fill="${p.c1}" ${so(3)}/>${[[28, 40, "f"], [60, 28, "g"], [92, 40, "h"]].map(([x, y, s]) => `<path d="M60 86 Q${(60 + x) / 2} ${y + 30} ${x} ${y + 10}" stroke="${p.c1}" stroke-width="12" fill="none" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="14" fill="${p.c1}" ${so(2.4)}/>${face(x, y, m, .45, st)}${sym(x, y - 18, s, 13, p.c2)}`).join("")}${ac(p, st, 8, 60)}`)),
  /* the function sage: a robed wizard with a glowing graph */
  sage: (p, st, m) => bob(grow(st, `<path d="M60 6 L88 50 L32 50Z" fill="${p.c1}" ${so(2.6)} stroke-linejoin="round"/>${sym(60, 42, "f(x)", 11, p.c2)}<ellipse cx="60" cy="50" rx="34" ry="6" fill="${p.c1}" ${so(2)}/><path d="M34 54 H86 L96 108 H24Z" fill="${p.c1}" ${so(3)} stroke-linejoin="round"/><circle cx="60" cy="66" r="16" fill="#FDE68A" ${so(2)}/>${face(60, 64, m, .6, st)}<path d="M50 80 Q60 100 70 80" fill="#E5E7EB"/><rect x="92" y="40" width="22" height="20" rx="3" fill="#0F172A"/><path d="M94 56 Q100 42 104 50 T112 44" stroke="${p.c2}" stroke-width="1.8" fill="none"/>${spark(100, 30, .6)}`))
};

/* ---- shared styling: sticker outline, glow aura, halo shape, limbs and a per-pet motion, all picked from the pet's id ---- */
(function(){
const H = id => { let h = 7; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0; return h; };
const star = (n, r1, r2) => Array.from({length: n * 2}, (_, i) => { const a = Math.PI * i / n - Math.PI / 2, r = i % 2 ? r2 : r1; return (60 + r * Math.cos(a)).toFixed(1) + "," + (62 + r * Math.sin(a)).toFixed(1); }).join(" ");
const raw = window.CS_PCART;
Object.keys(raw).forEach(k => { const fn = raw[k];
  raw[k] = (p, st, m) => {
    const h = H(p.id || k), rk = RANK[p.r] || 0, id = "t" + (h % 99999) + "s" + st;
    const pose = h % 4, motion = (h >>> 3) % 4, halo = (h >>> 5) % 4;
    const hb = `<g stroke="#1F2430" stroke-opacity=".55" stroke-width="2.2"><circle cx="@X" cy="@Y" r="6.5" fill="${p.c2}"/></g>`;
    const arm = (x1, y1, x2, y2) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="#1F2430" stroke-opacity=".55" stroke-width="10" stroke-linecap="round"/><path d="M${x1} ${y1} L${x2} ${y2}" stroke="${p.c1}" stroke-width="6.4" stroke-linecap="round"/>` + hb.replace("@X", x2).replace("@Y", y2);
    const arms = st < 2 ? "" : [
      arm(60, 70, 8, 52) + arm(60, 70, 112, 86),
      arm(60, 66, 10, 30) + arm(60, 66, 110, 30),
      arm(60, 74, 6, 84) + arm(60, 74, 114, 84),
      arm(60, 70, 10, 90) + arm(60, 66, 108, 26)][pose];
    const leg = x => `<path d="M${x} 92 V110" stroke="#1F2430" stroke-opacity=".55" stroke-width="10" stroke-linecap="round"/><path d="M${x} 92 V110" stroke="${p.c2}" stroke-width="6.4" stroke-linecap="round"/>`;
    const legs = st === 3 ? leg(44) + leg(76) : st === 2 ? leg(48) + leg(72) : "";
    const hc = [p.c2, p.c1, "#FDE047", "#67E8F9"][halo];
    const haloShape = [`<circle cx="60" cy="62" r="54" fill="${hc}" opacity=".3"/>`, `<polygon points="${star(8, 58, 46)}" fill="${hc}" opacity=".32"/>`, `<rect x="10" y="12" width="100" height="100" rx="30" fill="${hc}" opacity=".3" transform="rotate(${(h % 5) * 9 + 8} 60 62)"/>`, `<polygon points="${star(6, 58, 38)}" fill="${hc}" opacity=".32"/>`][halo];
    const aura = rk >= 3 ? `<defs><radialGradient id="${id}g"><stop offset="0" stop-color="${p.c2}" stop-opacity=".85"/><stop offset="1" stop-color="${p.c2}" stop-opacity="0"/></radialGradient></defs><circle cx="60" cy="62" r="60" fill="url(#${id}g)"><animate attributeName="r" values="54;62;54" dur="2.6s" repeatCount="indefinite"/></circle>` : "";
    const ring = rk >= 4 ? `<g><circle cx="60" cy="62" r="58" fill="none" stroke="${rk >= 6 ? "#F472B6" : "#FDE047"}" stroke-width="2.4" stroke-dasharray="6 9" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" from="0 60 62" to="360 60 62" dur="${rk >= 6 ? 6 : 12}s" repeatCount="indefinite"/></circle></g>` : "";
    const orbit = rk >= 5 ? `<g><animateTransform attributeName="transform" type="rotate" from="0 60 62" to="-360 60 62" dur="9s" repeatCount="indefinite"/>${spark(60, 6, .9, "#fff")}${spark(116, 62, .8, "#FDE047")}${spark(8, 70, .8, "#F9A8D4")}</g>` : "";
    const flt = `<filter id="${id}f" x="-15%" y="-15%" width="130%" height="130%"><feMorphology in="SourceAlpha" operator="dilate" radius="2.4" result="d"/><feFlood flood-color="#fff"/><feComposite in2="d" operator="in" result="o"/><feDropShadow dx="0" dy="3" stdDeviation="2.2" flood-color="#0F172A" flood-opacity=".35" result="sh"/><feMerge><feMergeNode in="sh"/><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
    const mot = [`<animateTransform attributeName="transform" type="rotate" values="-3 60 100;3 60 100;-3 60 100" dur="3s" repeatCount="indefinite"/>`,
      `<animateTransform attributeName="transform" type="scale" values="1 1;1.04 .96;1 1" dur="1.8s" additive="sum" repeatCount="indefinite"/>`,
      `<animateTransform attributeName="transform" type="translate" values="0 0;3 0;0 0;-3 0;0 0" dur="3.4s" repeatCount="indefinite"/>`, ""][motion];
    return `<defs>${flt}</defs>${aura}${haloShape}${ring}<g filter="url(#${id}f)"><g>${mot}${arms}${legs}${fn(p, st, m)}</g></g>${orbit}`;
  };
});
})();
})();
