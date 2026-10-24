/* Credit Sprint Chemistry pet art: an original set of atom, glassware, molecule and material characters, each with its own
   body design. Every drawing fits a 120×120 box with its base near y = 108. Each pet changes design as it grows
   (st: 1 = baby, 2 = teen, 3 = adult): an atom gains electron shells, a beaker fills and bubbles, a gem sparkles.
   Babies also sit in their eggshell (added by pets.js). Used through CUSTOM.chem → window.CS_CHEMART[p.body](p, stage, mood). */
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

window.CS_CHEMART = {
  /* atom: a nucleus with one electron shell, then two, then three orbiting rings */
  atom: (p, st, m) => { const n = pick(st, 1, 2, 3), rot = [0, 60, 120].slice(0, n);
    return bob(`<g fill="none" stroke="${p.c2}" stroke-width="2.4">${rot.map(a => `<ellipse cx="60" cy="66" rx="50" ry="17" transform="rotate(${a} 60 66)"/>`).join("")}</g>
    ${rot.map(a => [1, -1].map(s => `<circle cx="${(60 + s*50*Math.cos(a*Math.PI/180)).toFixed(1)}" cy="${(66 + s*50*Math.sin(a*Math.PI/180)).toFixed(1)}" r="4.5" fill="#38BDF8" stroke="#0369A1" stroke-width="1.5"/>`).join("")).join("")}
    <circle cx="60" cy="66" r="${pick(st, 22, 24, 26)}" fill="${p.c1}" stroke="#9A3412" stroke-width="2.2"/><circle cx="52" cy="58" r="5" fill="#fff" opacity=".35"/>${face(60, 66, m, .95, st)}${ac(p, st, 36, 60)}`); },
  /* beaker: the liquid level rises and bubbles appear as it grows */
  beaker: (p, st, m) => { const top = pick(st, 82, 66, 50);
    return bob(`<path d="M31 ${top} q7 -4 14 0 t14 0 t14 0 t14 0 V100 Q89 107 82 107 H38 Q31 107 31 100Z" fill="${p.c1}" opacity=".85"/>
    <path d="M30 28 V100 Q30 108 38 108 H82 Q90 108 90 100 V28" fill="${p.c2}" fill-opacity=".25" stroke="#475569" stroke-width="3" stroke-linecap="round"/><path d="M24 28 H96" stroke="#475569" stroke-width="3.5" stroke-linecap="round"/>
    ${[44, 58, 72].map(y => `<path d="M30 ${y} h7" stroke="#475569" stroke-width="2"/>`).join("")}${st >= 2 ? bubbles([[44, top + 14, 3], [76, top + 20, 2.4]]) : ""}${st === 3 ? bubbles([[62, top + 10, 3.4], [50, top - 8, 2.4]]) : ""}
    ${face(60, Math.max(top + 18, 78), m, .85, st)}${ac(p, st, 22, 60)}`); },
  /* Erlenmeyer flask: more solution, then a falling drop, then the indicator turns pink at the endpoint */
  flask: (p, st, m) => { const y0 = pick(st, 84, 74, 64);
    return bob(`<path d="M${50 - (y0 - 52)*.45} ${y0} H${70 + (y0 - 52)*.45} L98 100 Q102 108 92 108 H28 Q18 108 22 100Z" fill="${st === 3 ? "#F9A8D4" : p.c1}" opacity=".9"/>
    <path d="M50 20 V52 L22 100 Q18 108 28 108 H92 Q102 108 98 100 L70 52 V20" fill="${p.c2}" fill-opacity=".25" stroke="#475569" stroke-width="3" stroke-linejoin="round"/><path d="M45 20 H75" stroke="#475569" stroke-width="3.5" stroke-linecap="round"/>
    ${st >= 2 ? `<path d="M60 4 q5 8 0 12 q-5 -4 0 -12Z" fill="${st === 3 ? "#EC4899" : "#38BDF8"}"><animate attributeName="transform" type="translate" values="0 0;0 12;0 0" dur="1.6s" repeatCount="indefinite"/></path>` : ""}
    ${face(60, 88, m, .9, st)}${ac(p, st, 16, 60)}`); },
  /* balloon: a small gas-filled baby grows bigger as pressure and volume change */
  balloon: (p, st, m) => { const r = pick(st, 24, 30, 36), cy = 62 - (r - 24)*.3;
    return bob(`<path d="M60 ${cy + r + 4} q-8 10 2 18 q-8 6 -2 20" stroke="#64748B" stroke-width="2" fill="none"/>
    <path d="M60 ${cy + r - 1} l-6 8 h12Z" fill="${p.c1}"/><ellipse cx="60" cy="${cy}" rx="${r}" ry="${r*1.1}" fill="${p.c1}" stroke="#9F1239" stroke-opacity=".5" stroke-width="2.5"/>
    <ellipse cx="${60 - r*.4}" cy="${cy - r*.5}" rx="${r*.14}" ry="${r*.28}" fill="#fff" opacity=".55" transform="rotate(30 ${60 - r*.4} ${cy - r*.5})"/>
    ${face(60, cy + 2, m, .75 + r/90, st)}${st === 3 ? `<text x="60" y="${cy + r*.75}" font-size="9" text-anchor="middle" fill="${p.c2}" font-weight="700">PV = nRT</text>` : ""}${ac(p, st, cy - r*1.1 + 2, 60)}`, 3.2); },
  /* ice cube: a sharp cube, then melting corners and a puddle, then a puddle with steam */
  ice: (p, st, m) => { const w = pick(st, 60, 54, 46);
    return bob(`${st >= 2 ? `<ellipse cx="60" cy="106" rx="${pick(st, 20, 40, 50)}" ry="6" fill="${p.c1}" opacity=".6"/>` : ""}${st === 3 ? [38, 60, 82].map((x, i) => `<path d="M${x} 56 q-6 -8 0 -16 q6 -8 0 -16" stroke="#94A3B8" stroke-width="2.2" fill="none" opacity=".6" stroke-linecap="round"><animate attributeName="opacity" values=".2;.7;.2" dur="${2 + i*.5}s" repeatCount="indefinite"/></path>`).join("") : ""}
    <rect x="${60 - w/2}" y="${108 - w - 2}" width="${w}" height="${w}" rx="${pick(st, 8, 16, 20)}" fill="${p.c1}" stroke="#0891B2" stroke-width="2.5" opacity=".95"/>
    <path d="M${60 - w/2 + 8} ${108 - w + 6} l8 -4 M${60 - w/2 + 8} ${108 - w + 14} v10" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>
    ${st >= 2 ? `<path d="M${60 + w/2 - 8} ${108 - w + 8} q4 10 0 14" stroke="${p.c1}" stroke-width="5" stroke-linecap="round"/>` : ""}${face(60, 108 - w/2 - 2, m, .85, st)}${ac(p, st, 108 - w - 4, 60)}`); },
  /* candle: a small flame, then a taller one with wax drips, then a hot blue-cored flame */
  candle: (p, st, m) => { const fh = pick(st, 14, 22, 30);
    return bob(`<path d="M60 ${56 - fh} C74 ${56 - fh*.3} 70 54 60 56 C50 54 46 ${56 - fh*.3} 60 ${56 - fh}Z" fill="#FB923C"><animate attributeName="opacity" values=".85;1;.85" dur="0.9s" repeatCount="indefinite"/></path>
    <path d="M60 ${56 - fh*.5} C66 ${56 - fh*.1} 64 54 60 55 C56 54 54 ${56 - fh*.1} 60 ${56 - fh*.5}Z" fill="${st === 3 ? "#60A5FA" : "#FDE68A"}"/><path d="M60 54 v4" stroke="${INK}" stroke-width="2"/>
    <rect x="36" y="58" width="48" height="50" rx="8" fill="${p.c1}" stroke="#B45309" stroke-opacity=".5" stroke-width="2.5"/><path d="M36 66 q6 6 6 14 M84 66 q-6 8 -4 18" stroke="${p.c2}" stroke-width="5" stroke-linecap="round" fill="none"/>
    ${st >= 2 ? `<ellipse cx="60" cy="108" rx="36" ry="4" fill="${p.c1}" opacity=".6"/>` : ""}${face(60, 80, m, .95, st)}${ac(p, st, 30 - fh*.4, 60)}`, 2.2); },
  /* salt crystal: an NaCl cube; the lattice of Na⁺ and Cl⁻ grows with it */
  nacl: (p, st, m) => { const n = pick(st, 2, 3, 3), s = pick(st, 56, 64, 70), x0 = 60 - s/2, y0 = 104 - s;
    const pts = []; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) pts.push([x0 + 8 + i*(s - 16)/(n - 1), y0 + 8 + j*(s - 16)/(n - 1), (i + j) % 2]);
    return bob(`<path d="M${x0} ${y0} l10 -10 h${s} l-10 10Z M${x0 + s} ${y0} l10 -10 v${s} l-10 10Z" fill="${p.c2}" stroke="#64748B" stroke-width="2"/><rect x="${x0}" y="${y0}" width="${s}" height="${s}" rx="4" fill="${p.c1}" stroke="#64748B" stroke-width="2.5"/>
    ${pts.map(([x, y, k]) => `<circle cx="${x}" cy="${y}" r="${k ? 6 : 4}" fill="${k ? "#86EFAC" : "#C4B5FD"}" stroke="#475569" stroke-opacity=".5"/>`).join("")}${face(60, y0 + s/2, m, .9, st)}${st === 3 ? spark(x0 + s + 2, y0 + 6, 1.1) + spark(x0 + 4, y0 + s - 4, .8) : ""}${ac(p, st, y0 - 12, 60)}`); },
  /* antacid tablet: a plain tablet, then a fizzing one, then a big fizz in a glass of water */
  tablet: (p, st, m) => bob(`${st >= 2 ? `<path d="M22 70 V100 Q22 108 30 108 H90 Q98 108 98 100 V70" fill="#BAE6FD" fill-opacity=".5" stroke="#475569" stroke-width="2.5"/><path d="M22 70 q9 -5 19 0 t19 0 t19 0 t19 0" stroke="#38BDF8" stroke-width="2.4" fill="none"/>` : ""}
    ${bubbles(pick(st, [], [[40, 62, 3], [80, 58, 2.6], [60, 48, 2]], [[34, 62, 3.4], [86, 56, 3], [58, 44, 2.6], [72, 34, 2.2], [46, 30, 2]]))}
    <ellipse cx="60" cy="${pick(st, 80, 86, 88)}" rx="${pick(st, 34, 32, 32)}" ry="${pick(st, 22, 14, 14)}" fill="${p.c1}" stroke="#475569" stroke-opacity=".6" stroke-width="2.5"/><path d="M36 ${pick(st, 80, 86, 88)} h48" stroke="${p.c2}" stroke-width="2" stroke-dasharray="3 3"/>
    ${face(60, pick(st, 78, 82, 84), m, .8, st)}${ac(p, st, 56, 60)}`),
  /* prism: a white beam, then a few colors, then a full spectrum with sparkles */
  prism: (p, st, m) => { const cols = ["#EF4444", "#F97316", "#FACC15", "#22C55E", "#3B82F6", "#8B5CF6"].slice(0, pick(st, 0, 3, 6));
    return bob(`<path d="M6 76 L44 66" stroke="#fff" stroke-width="4" stroke-linecap="round"/><path d="M6 76 L44 66" stroke="#94A3B8" stroke-width="1.2"/>
    ${cols.map((c, i, a) => `<path d="M76 62 L116 ${44 + i*(40/(a.length))}" stroke="${c}" stroke-width="4" stroke-linecap="round"/>`).join("")}
    <path d="M60 18 L96 100 H24Z" fill="${p.c1}" fill-opacity=".85" stroke="#6D28D9" stroke-width="3" stroke-linejoin="round"/><path d="M60 28 L36 90" stroke="#fff" stroke-width="3" opacity=".5" stroke-linecap="round"/>
    ${face(60, 76, m, .9, st)}${st === 3 ? spark(100, 30, 1) + spark(16, 50, .8) : ""}${ac(p, st, 16, 60)}`); },
  /* litmus strip: a pale strip, then a red top, then a full pH color scale */
  litmus: (p, st, m) => { const cols = ["#EF4444", "#F97316", "#FACC15", "#4ADE80", "#38BDF8", "#8B5CF6"];
    return bob(`<g transform="rotate(-6 60 64)"><rect x="40" y="10" width="40" height="98" rx="6" fill="${st === 1 ? p.c2 : "#fff"}" stroke="#64748B" stroke-width="2.5"/>
    ${st === 2 ? `<rect x="42" y="12" width="36" height="36" rx="4" fill="#EF4444" opacity=".8"/><rect x="42" y="72" width="36" height="34" rx="4" fill="#3B82F6" opacity=".6"/>` : ""}${st === 3 ? cols.map((c, i) => `<rect x="42" y="${12 + i*15.6}" width="36" height="16" fill="${c}" opacity=".8"/>`).join("") : ""}
    <rect x="46" y="${st === 1 ? 40 : 38}" width="28" height="36" rx="8" fill="#fff" opacity=".78"/>${face(60, 58, m, .7, st)}${st === 3 ? `<text x="60" y="${20}" font-size="7" text-anchor="middle" fill="#fff" font-weight="700">pH</text>` : ""}</g>${ac(p, st, 8, 56)}`); },
  /* energy hill: a tall barrier, then a lower dashed catalyst path, then a tunnel through the hill */
  hill: (p, st, m) => bob(`<path d="M6 108 Q30 108 40 76 Q60 18 80 76 Q90 108 114 108Z" fill="${p.c1}" stroke="#9A3412" stroke-opacity=".6" stroke-width="2.5"/>
    ${st >= 2 ? `<path d="M10 106 Q34 106 44 84 Q60 54 76 84 Q86 106 110 106" stroke="${p.c2}" stroke-width="3" fill="none" stroke-dasharray="5 4"/>` : ""}
    ${st === 3 ? `<path d="M46 108 V98 Q60 84 74 98 V108Z" fill="#7C2D12"/><circle cx="60" cy="102" r="5" fill="#38BDF8"><animate attributeName="cx" values="48;72;48" dur="3s" repeatCount="indefinite"/></circle>` : ""}
    ${face(60, pick(st, 66, 62, 56), m, .9, st)}${st === 3 ? `<text x="60" y="38" font-size="9" text-anchor="middle" fill="#9A3412" font-weight="700">Ea</text>` : ""}${ac(p, st, pick(st, 28, 26, 24), 60)}`),
  /* thermometer: the mercury rises as it grows */
  thermo: (p, st, m) => { const lvl = pick(st, 62, 40, 22);
    return bob(`<rect x="50" y="8" width="20" height="82" rx="10" fill="#fff" stroke="#64748B" stroke-width="3"/><rect x="56" y="${lvl}" width="8" height="${88 - lvl}" fill="${p.c1}"/>
    ${[22, 34, 46, 58, 70].map(y => `<path d="M72 ${y} h${y % 24 === 22 ? 8 : 5}" stroke="#64748B" stroke-width="2"/>`).join("")}
    <circle cx="60" cy="90" r="19" fill="${p.c1}" stroke="#64748B" stroke-width="3"/><circle cx="53" cy="84" r="4" fill="#fff" opacity=".5"/>${face(60, 92, m, .75, st)}${st === 3 ? spark(88, 24, 1, "#FDE047") : ""}${ac(p, st, 8, 60)}`); },
  /* water molecule: a bent H₂O whose hydrogens grow, with partial charges on the adult */
  h2o: (p, st, m) => { const rh = pick(st, 9, 12, 14);
    return bob(`<path d="M44 52 L30 34 M76 52 L90 34" stroke="${p.c2}" stroke-width="6" stroke-linecap="round" opacity=".8"/>
    <circle cx="28" cy="32" r="${rh}" fill="${p.c2}" stroke="#94A3B8" stroke-width="2"/><circle cx="92" cy="32" r="${rh}" fill="${p.c2}" stroke="#94A3B8" stroke-width="2"/>
    <circle cx="60" cy="70" r="${pick(st, 26, 28, 30)}" fill="${p.c1}" stroke="#B91C1C" stroke-opacity=".6" stroke-width="2.5"/>${face(60, 70, m, 1, st)}
    ${st === 3 ? `<text x="60" y="108" font-size="10" text-anchor="middle" fill="#B91C1C" font-weight="700">δ⁻</text><text x="28" y="${32 + rh + 10}" font-size="9" text-anchor="middle" fill="#2563EB" font-weight="700">δ⁺</text><text x="92" y="${32 + rh + 10}" font-size="9" text-anchor="middle" fill="#2563EB" font-weight="700">δ⁺</text>` : ""}${ac(p, st, 38, 60)}`); },
  /* battery: a low charge, then a half charge, then a full charge with sparks */
  battery: (p, st, m) => bob(`<rect x="50" y="8" width="20" height="10" rx="3" fill="#64748B"/><rect x="34" y="16" width="52" height="92" rx="10" fill="${p.c2}" stroke="#475569" stroke-width="3"/>
    <rect x="38" y="${pick(st, 76, 56, 22)}" width="44" height="${104 - pick(st, 76, 56, 22)}" rx="7" fill="${p.c1}" opacity=".85"/><text x="60" y="34" font-size="14" text-anchor="middle" fill="#475569" font-weight="800">+</text>
    ${face(60, 66, m, .85, st)}${st === 3 ? [[20, 40], [100, 62], [22, 90]].map(([x, y], i) => `<path d="M${x} ${y - 8} l-4 8 h5 l-3 8 l9 -11 h-5 l3 -5z" fill="#FACC15" stroke="#CA8A04"><animate attributeName="opacity" values=".3;1;.3" dur="${1.2 + i*.3}s" repeatCount="indefinite"/></path>`).join("") : ""}${ac(p, st, 12, 60)}`),
  /* sodium: a silver lump, then a fizzing one, then a fiery splash */
  sodium: (p, st, m) => bob(`<path d="M6 92 q12 -8 24 0 t24 0 t24 0 t24 0 V108 H6Z" fill="#60A5FA" opacity=".8"/>
    <path d="M30 86 C26 62 44 44 62 46 C84 46 96 62 90 84 C86 94 36 96 30 86Z" fill="${p.c1}" stroke="#64748B" stroke-width="2.5"/><path d="M40 60 q6 -8 14 -8" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7" fill="none"/>
    ${st >= 2 ? bubbles([[24, 84, 3], [96, 80, 3.4], [60, 98, 2.6]]) : ""}${st === 3 ? `<path d="M60 40 C76 30 72 16 60 8 C64 22 50 24 52 36 C54 40 58 42 60 40Z" fill="#F97316"><animate attributeName="opacity" values=".7;1;.7" dur=".8s" repeatCount="indefinite"/></path>${spark(24, 40, 1, "#FB923C")}${spark(98, 44, .9, "#FB923C")}` : ""}
    ${face(60, 72, m, .95, st)}${ac(p, st, 40, 60)}`),
  /* piston: gas in a cylinder; the piston pushes down and the particles crowd closer */
  piston: (p, st, m) => { const y = pick(st, 34, 52, 64), dots = pick(st, [[30, 100], [90, 98], [40, 94]], [[28, 98], [92, 96], [36, 90], [84, 86], [60, 100]], [[26, 100], [94, 100], [34, 92], [88, 90], [46, 100], [72, 99], [60, 93]]);
    return bob(`<rect x="52" y="6" width="16" height="${y - 6}" fill="#94A3B8" stroke="#475569" stroke-width="2"/><rect x="48" y="4" width="24" height="7" rx="3" fill="#64748B"/>
    <rect x="20" y="${y}" width="80" height="${108 - y}" rx="4" fill="${p.c2}" fill-opacity=".5" stroke="#475569" stroke-width="3"/><rect x="22" y="${y}" width="76" height="9" fill="#64748B"/>
    ${dots.map(([x, yy]) => `<circle cx="${x}" cy="${yy}" r="3.4" fill="${p.c1}"><animate attributeName="cx" values="${x};${x + 4};${x}" dur="1.${x % 7}s" repeatCount="indefinite"/></circle>`).join("")}${face(60, Math.min(y + 30, 84), m, .8, st)}${ac(p, st, 2, 60)}`); },
  /* benzene: a hexagon ring, then hydrogens, then a glowing delocalized electron ring */
  benzene: (p, st, m) => { const pts = Array.from({ length: 6 }, (_, i) => { const a = Math.PI/3*i - Math.PI/2; return [60 + 36*Math.cos(a), 64 + 36*Math.sin(a), a]; });
    return bob(`${st >= 2 ? pts.map(([x, y, a]) => `<path d="M${x.toFixed(1)} ${y.toFixed(1)} L${(60 + 50*Math.cos(a)).toFixed(1)} ${(64 + 50*Math.sin(a)).toFixed(1)}" stroke="#94A3B8" stroke-width="3"/><circle cx="${(60 + 55*Math.cos(a)).toFixed(1)}" cy="${(64 + 55*Math.sin(a)).toFixed(1)}" r="5" fill="#fff" stroke="#94A3B8" stroke-width="1.5"/>`).join("") : ""}
    <polygon points="${pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")}" fill="${p.c1}" stroke="#4C1D95" stroke-width="3.5" stroke-linejoin="round"/>
    <circle cx="60" cy="64" r="${pick(st, 22, 24, 26)}" fill="none" stroke="${p.c2}" stroke-width="3" ${st === 3 ? `stroke-dasharray="6 4"><animateTransform attributeName="transform" type="rotate" from="0 60 64" to="360 60 64" dur="10s" repeatCount="indefinite"/></circle>` : "/>"}
    ${face(60, 62, m, .8, st)}${ac(p, st, 20, 60)}`); },
  /* seesaw: a balanced reaction; the adult shows the two-way equilibrium arrows */
  seesaw: (p, st, m) => bob(`<path d="M60 70 L44 108 H76Z" fill="#94A3B8" stroke="#475569" stroke-width="2.5" stroke-linejoin="round"/><g><animateTransform attributeName="transform" type="rotate" values="-3 60 70;3 60 70;-3 60 70" dur="4s" repeatCount="indefinite"/>
    <rect x="10" y="66" width="100" height="8" rx="4" fill="#B45309" stroke="#78350F" stroke-width="2"/><circle cx="26" cy="${pick(st, 56, 54, 52)}" r="${pick(st, 9, 10, 11)}" fill="${p.c2}" stroke="#475569" stroke-width="2"/><circle cx="94" cy="${pick(st, 56, 54, 52)}" r="${pick(st, 9, 10, 11)}" fill="${p.c2}" stroke="#475569" stroke-width="2"/>
    <circle cx="60" cy="38" r="${pick(st, 24, 27, 29)}" fill="${p.c1}" stroke="#065F46" stroke-opacity=".6" stroke-width="2.5"/>${face(60, 38, m, .95, st)}${st === 3 ? `<text x="60" y="6" font-size="14" text-anchor="middle" fill="#065F46" font-weight="800">⇌</text>` : ""}</g>`, 3.4),
  /* buret: the liquid column drains, drops fall, and the endpoint turns pink */
  buret: (p, st, m) => { const lvl = pick(st, 26, 42, 56);
    return bob(`<rect x="44" y="8" width="32" height="80" rx="6" fill="${p.c2}" fill-opacity=".3" stroke="#475569" stroke-width="3"/><rect x="46" y="${lvl}" width="28" height="${86 - lvl}" fill="${p.c1}" opacity=".8"/>
    ${[18, 30, 42, 54, 66, 78].map(y => `<path d="M44 ${y} h6" stroke="#475569" stroke-width="2"/>`).join("")}<rect x="52" y="88" width="16" height="8" rx="2" fill="#64748B"/><rect x="38" y="90" width="14" height="4" rx="2" fill="#B45309"/><path d="M58 96 h4 l-1 8 h-2Z" fill="#94A3B8"/>
    ${st >= 2 ? `<path d="M60 102 q4 6 0 9 q-4 -3 0 -9Z" fill="${st === 3 ? "#EC4899" : p.c1}"><animate attributeName="opacity" values="1;0;1" dur="1.5s" repeatCount="indefinite"/></path>` : ""}${face(60, Math.max(lvl + 20, 40), m, .65, st)}${ac(p, st, 6, 60)}`); },
  /* orbital: a round s orbital, then one dumbbell p orbital, then three p orbitals */
  orbital: (p, st, m) => bob(`${[0, 60, 120].slice(0, pick(st, 0, 1, 3)).map((a, i) => `<g transform="rotate(${a + 30} 60 64)"><ellipse cx="30" cy="64" rx="22" ry="11" fill="${i === 1 ? "#F472B6" : p.c1}" opacity=".6"/><ellipse cx="90" cy="64" rx="22" ry="11" fill="${i === 1 ? "#60A5FA" : p.c2}" opacity=".6"/></g>`).join("")}
    <circle cx="60" cy="64" r="${pick(st, 30, 20, 20)}" fill="${p.c1}" opacity="${pick(st, .85, .95, 1)}" stroke="#7E22CE" stroke-opacity=".6" stroke-width="2.5"/>${face(60, 64, m, pick(st, 1.1, .85, .85), st)}${ac(p, st, 36, 60)}`),
  /* galvanic cell: one half-cell, two half-cells with a salt bridge, then a glowing bulb */
  galv: (p, st, m) => bob(`${st >= 2 ? `<path d="M30 40 V22 Q60 6 90 22 V40" stroke="#94A3B8" stroke-width="7" fill="none"/>` : ""}${st === 3 ? `<circle cx="60" cy="10" r="9" fill="#FDE047" stroke="#CA8A04" stroke-width="2"><animate attributeName="opacity" values=".6;1;.6" dur="1.2s" repeatCount="indefinite"/></circle>` : ""}
    ${[[10, p.c1, "#94A3B8"], [64, p.c2, "#B45309"]].slice(0, pick(st, 1, 2, 2)).map(([x, c, e], i) => `<rect x="${x + 22}" y="30" width="6" height="52" fill="${e}"/><path d="M${x} 50 V100 Q${x} 108 ${x + 8} 108 H${x + 38} Q${x + 46} 108 ${x + 46} 100 V50Z" fill="${c}" fill-opacity=".7" stroke="#475569" stroke-width="2.5"/>${face(x + 23, 84, m, .55, st)}`).join("")}
    ${st === 1 ? `<rect x="56" y="50" width="6" height="4" fill="none"/>` : ""}${ac(p, st, 22, 60)}`),
  /* diamond: a small gem, a faceted gem, then a brilliant gem with sparkles */
  diamond: (p, st, m) => { const k = pick(st, .78, .9, 1);
    return bob(`<g transform="translate(60 62) scale(${k}) translate(-60 -62)"><path d="M26 44 L40 22 H80 L94 44 L60 102Z" fill="${p.c1}" stroke="#0E7490" stroke-width="3" stroke-linejoin="round"/>
    ${st >= 2 ? `<path d="M26 44 H94 M40 22 L50 44 L60 22 L70 44 L80 22 M50 44 L60 102 L70 44" stroke="#fff" stroke-width="1.8" fill="none" opacity=".75"/>` : ""}<path d="M44 28 L36 42" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/>${face(60, 62, m, .85, st)}</g>
    ${st === 3 ? spark(14, 30, 1.2) + spark(106, 40, 1) + spark(100, 90, .8, "#67E8F9") : ""}${ac(p, st, 22 + (1 - k)*20, 60)}`); },
  /* neon tube: a dim tube, a glowing tube, then a blazing tube with a halo */
  neon: (p, st, m) => { const g = pick(st, .35, .7, 1);
    return bob(`<defs><filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${pick(st, 2, 4, 6)}"/></filter></defs>
    <rect x="38" y="10" width="44" height="96" rx="22" fill="${p.c1}" filter="url(#neonGlow)" opacity="${g}"/><rect x="42" y="14" width="36" height="88" rx="18" fill="${p.c2}" fill-opacity=".55" stroke="${p.c1}" stroke-width="3.5"/>
    <rect x="52" y="4" width="16" height="10" rx="3" fill="#64748B"/><rect x="52" y="102" width="16" height="8" rx="3" fill="#64748B"/><text x="60" y="34" font-size="11" text-anchor="middle" fill="${p.c1}" font-weight="800">Ne</text>${face(60, 62, m, .7, st)}${st === 3 ? spark(20, 30, 1, p.c1) + spark(102, 80, 1, p.c1) : ""}${ac(p, st, 8, 60)}`); },
  /* entropy: an orderly grid of particles that scatters as it grows */
  entropy: (p, st, m) => { const sc = pick(st, 0, 8, 18), dots = [];
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { if ((i === 1 || i === 2) && (j === 1 || j === 2)) continue; const h = (i*37 + j*53 + 11) % 100; dots.push([24 + i*24 + ((h % 21) - 10)*sc/10, 30 + j*24 + (((h*7) % 21) - 10)*sc/10, 3 + (h % 3)]); }
    return bob(`${dots.map(([x, y, r], i) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${i % 2 ? p.c1 : p.c2}" stroke="#334155" stroke-opacity=".5"/>`).join("")}
    <circle cx="60" cy="66" r="${pick(st, 17, 19, 21)}" fill="${p.c1}" stroke="#334155" stroke-width="2.5"/>${face(60, 65, m, .75, st)}${st === 3 ? `<text x="60" y="112" font-size="9" text-anchor="middle" fill="#334155" font-weight="800">ΔS &gt; 0</text>` : ""}${ac(p, st, 40, 60)}`); },
  /* gold: a nugget, then an ingot, then a stack of ingots with a shine */
  gold: (p, st, m) => { const ing = (x, y, w, h) => `<path d="M${x} ${y} L${x + 9} ${y - h} H${x + w - 9} L${x + w} ${y}Z" fill="${p.c1}" stroke="#92400E" stroke-width="2.5" stroke-linejoin="round"/><path d="M${x + 14} ${y - h + 6} h${w * .3}" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".6"/>`;
    return bob(st === 1 ? `<path d="M26 98 C18 76 34 50 56 52 C80 48 98 68 92 94 C86 106 34 108 26 98Z" fill="${p.c1}" stroke="#92400E" stroke-width="2.5"/><path d="M40 70 q6 -8 14 -8" stroke="#fff" stroke-width="3" opacity=".7" fill="none" stroke-linecap="round"/>${face(60, 82, m, 1, st)}`
      : st === 2 ? `${ing(24, 108, 72, 54)}<text x="60" y="100" font-size="12" text-anchor="middle" fill="#92400E" font-weight="800" opacity=".8">Au</text>${face(60, 76, m, .9, st)}${spark(98, 66, .9)}${ac(p, st, 52, 60)}`
      : `${ing(14, 108, 92, 36)}${ing(34, 72, 52, 34)}<text x="60" y="100" font-size="13" text-anchor="middle" fill="#92400E" font-weight="800" opacity=".85">Au</text>${face(60, 56, m, .7, st)}${spark(22, 54, 1.2)}${spark(102, 48, 1)}${ac(p, st, 36, 60)}`); },
  /* grand flask: an empty round flask, a swirling potion, then a glowing elixir with stars */
  elixir: (p, st, m) => bob(`${st === 3 ? `<circle cx="60" cy="76" r="44" fill="${p.c2}" opacity=".35"><animate attributeName="r" values="40;46;40" dur="2.6s" repeatCount="indefinite"/></circle>` : ""}
    <rect x="52" y="20" width="16" height="30" fill="${p.c2}" fill-opacity=".3" stroke="#475569" stroke-width="3"/><rect x="48" y="12" width="24" height="10" rx="3" fill="#B45309" stroke="#78350F" stroke-width="2"/>
    <circle cx="60" cy="78" r="32" fill="${p.c2}" fill-opacity=".25" stroke="#475569" stroke-width="3"/><path d="M29 ${pick(st, 90, 76, 68)} q8 -5 16 0 t16 0 t16 0 t13 0 A32 32 0 0 1 60 110 A32 32 0 0 1 29 ${pick(st, 90, 76, 68)}Z" fill="${p.c1}" opacity=".9"/>
    ${st >= 2 ? bubbles([[44, 90, 3.4], [76, 86, 3], [60, 100, 2.4]]) : ""}${face(60, 82, m, .9, st)}${st === 3 ? spark(24, 40, 1.2) + spark(98, 32, 1) + spark(102, 80, .9) : ""}${ac(p, st, 10, 60)}`),
  /* mercury: one silver blob, then it sheds droplets, then a mirror-bright blob with a ring of beads */
  mercury: (p, st, m) => bob(`${[[24, 100, 6], [98, 98, 7], [14, 82, 4], [106, 80, 5], [60, 106, 3.5]].slice(0, pick(st, 0, 2, 5)).map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${p.c1}" stroke="#475569" stroke-width="1.8"/><circle cx="${x - r*.3}" cy="${y - r*.3}" r="${r*.3}" fill="#fff" opacity=".8"/>`).join("")}
    <path d="M26 92 C20 62 38 36 62 38 C88 38 100 62 94 88 C90 104 34 104 26 92Z" fill="${p.c1}" stroke="#475569" stroke-width="3"/><path d="M38 66 C40 54 50 48 60 48" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".85"/>
    <path d="M70 90 q14 -4 18 -16" stroke="${p.c2}" stroke-width="3" fill="none" opacity=".7" stroke-linecap="round"/>${face(60, 72, m, 1, st)}${ac(p, st, 32, 60)}`),
  /* star: a baby fusion core, a bright teen sun, then a blazing adult where two H fuse into He */
  star: (p, st, m) => { const r = pick(st, 24, 30, 34);
    return bob(`<g><animateTransform attributeName="transform" type="rotate" from="0 60 64" to="360 60 64" dur="${pick(st, 40, 30, 22)}s" repeatCount="indefinite"/>${Array.from({ length: 12 }, (_, i) => { const a = i*Math.PI/6; return `<path d="M${(60 + (r + 2)*Math.cos(a)).toFixed(1)} ${(64 + (r + 2)*Math.sin(a)).toFixed(1)} L${(60 + (r + pick(st, 8, 12, 18) + (i % 2)*6)*Math.cos(a + .08)).toFixed(1)} ${(64 + (r + pick(st, 8, 12, 18) + (i % 2)*6)*Math.sin(a + .08)).toFixed(1)} L${(60 + (r + 2)*Math.cos(a + .26)).toFixed(1)} ${(64 + (r + 2)*Math.sin(a + .26)).toFixed(1)}Z" fill="${p.c1}" opacity=".85"/>`; }).join("")}</g>
    <circle cx="60" cy="64" r="${r}" fill="${p.c2}" stroke="${p.c1}" stroke-width="3"/><circle cx="60" cy="64" r="${r}" fill="${p.c1}" opacity=".25"/>${face(60, 64, m, .95, st)}
    ${st === 3 ? `<text x="18" y="110" font-size="9" fill="${p.c1}" font-weight="800">H + H → He</text>` : ""}${ac(p, st, 64 - r - 14, 60)}`); },
  /* buckyball: a plain sphere, then pentagon patches, then a spinning carbon cage */
  bucky: (p, st, m) => { const r = pick(st, 34, 40, 42), pent = Array.from({ length: 5 }, (_, i) => { const a = i*2*Math.PI/5 - Math.PI/2; return [60 + (r - 12)*Math.cos(a), 64 + (r - 12)*Math.sin(a), a]; });
    return bob(`<circle cx="60" cy="64" r="${r}" fill="${p.c1}" stroke="#1E293B" stroke-width="3"/>
    ${st >= 2 ? pent.map(([x, y, a]) => `<polygon points="${Array.from({ length: 5 }, (_, k) => `${(x + 7*Math.cos(a + k*2*Math.PI/5)).toFixed(1)},${(y + 7*Math.sin(a + k*2*Math.PI/5)).toFixed(1)}`).join(" ")}" fill="#1E293B"/><path d="M${x.toFixed(1)} ${y.toFixed(1)} L${(60 + 14*Math.cos(a)).toFixed(1)} ${(64 + 14*Math.sin(a)).toFixed(1)}" stroke="#1E293B" stroke-width="2"/>`).join("") : ""}
    ${st === 3 ? `<ellipse cx="60" cy="64" rx="${r + 10}" ry="12" fill="none" stroke="${p.c2}" stroke-width="2.4" transform="rotate(-20 60 64)"><animate attributeName="stroke-opacity" values=".3;1;.3" dur="2s" repeatCount="indefinite"/></ellipse>${spark(104, 26, 1)}` : ""}
    <circle cx="60" cy="64" r="${r - 18}" fill="${p.c2}" opacity=".85"/>${face(60, 63, m, .8, st)}${ac(p, st, 64 - r - 2, 60)}`); },
  /* prima materia: a glowing orb, then two alchemical symbols, then all four elements and a halo */
  prima: (p, st, m) => { const tri = (x, y, up, bar) => `<path d="M${x} ${y + (up ? -9 : 9)} L${x + 9} ${y + (up ? 7 : -7)} H${x - 9}Z" fill="none" stroke="${p.c1}" stroke-width="2.6" stroke-linejoin="round"/>${bar ? `<path d="M${x - 6} ${y + 1} H${x + 6}" stroke="${p.c1}" stroke-width="2.2"/>` : ""}`;
    return bob(`<circle cx="60" cy="64" r="52" fill="${p.c2}" opacity=".16"><animate attributeName="r" values="46;54;46" dur="3s" repeatCount="indefinite"/></circle>
    <g><animateTransform attributeName="transform" type="rotate" values="0 60 64;360 60 64" dur="20s" repeatCount="indefinite"/>${tri(60, 18, true, false)}${st >= 3 ? tri(106, 64, true, true) : ""}${st >= 2 ? tri(60, 110, false, false) : ""}${st >= 3 ? tri(14, 64, false, true) : ""}</g>
    <circle cx="60" cy="64" r="${pick(st, 26, 29, 31)}" fill="${p.c1}" stroke="#fff" stroke-width="3"/><circle cx="52" cy="54" r="9" fill="#fff" opacity=".35"/>${face(60, 63, m, 1, st)}${st === 3 ? crown(28) : ""}`); }
};
})();
