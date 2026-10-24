/* Credit Sprint Biology pet art: an original set of microbe, cell and living-things characters, each with its own
   body design (not the shared animal template used by Macro and Micro). Every drawing fits a 120×120 box, feet near y = 108.
   Used by pets.js through CUSTOM.bio → window.CS_BIOART[p.body](p, stage, mood). */
(function(){
"use strict";
const INK = "#1F2430";
const eye = (x, y, r = 4.2, mood) => mood === "sleepy" ? `<path d="M${x-r} ${y} q${r} ${r*.9} ${r*2} 0" stroke="${INK}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`
  : `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/><circle cx="${x+r*.35}" cy="${y-r*.35}" r="${r*.38}" fill="#fff"/>`;
const mouth = (x, y, mood, w = 5) => mood === "sad" ? `<path d="M${x-w} ${y+2} q${w} -4 ${w*2} 0" stroke="${INK}" stroke-width="2" fill="none" stroke-linecap="round"/>`
  : mood === "sleepy" ? `<ellipse cx="${x}" cy="${y+1}" rx="2" ry="1.6" fill="${INK}"/>` : `<path d="M${x-w} ${y} q${w} ${w*.9} ${w*2} 0" stroke="${INK}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
const blush = (x1, x2, y) => `<ellipse cx="${x1}" cy="${y}" rx="3.6" ry="2.2" fill="#FB7185" opacity=".45"/><ellipse cx="${x2}" cy="${y}" rx="3.6" ry="2.2" fill="#FB7185" opacity=".45"/>`;
const face = (cx, cy, mood, s = 1) => eye(cx - 8*s, cy, 4.2*s, mood) + eye(cx + 8*s, cy, 4.2*s, mood) + blush(cx - 14*s, cx + 14*s, cy + 6*s) + mouth(cx, cy + 7*s, mood, 4*s);
const crown = (y, x = 60) => `<path d="M${x-12} ${y} L${x-9} ${y-9} L${x-4} ${y-3} L${x} ${y-12} L${x+4} ${y-3} L${x+9} ${y-9} L${x+12} ${y}Z" fill="#FBBF24" stroke="#B45309" stroke-width="1.2"/><circle cx="${x}" cy="${y-5}" r="1.8" fill="#F43F5E"/>`;
const sprig = (x, y) => `<path d="M${x} ${y} q-2 -8 2 -12" stroke="#16A34A" stroke-width="2" fill="none"/><ellipse cx="${x+5}" cy="${y-13}" rx="5" ry="3" fill="#4ADE80" transform="rotate(-30 ${x+5} ${y-13})"/>`;
const extra = (stage, y, x) => stage === 3 ? crown(y, x) : stage === 2 ? sprig(x || 60, y + 4) : "";
const bob = (s, d = 2.6) => `<g><animateTransform attributeName="transform" type="translate" values="0 0;0 -2;0 0" dur="${d}s" repeatCount="indefinite"/>${s}</g>`;

window.CS_BIOART = {
  /* water bear: plump segmented body, six stubby clawed legs, round snout */
  tardigrade: (p, st, m) => bob(`${[30,48,66,84].map((x,i)=>`<path d="M${x} 92 q-2 10 2 14 M${x+4} 106 l3 2 M${x} 106 l-2 3" stroke="${p.c1}" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M${x} 106 l-3 3 M${x+3} 107 l2 3" stroke="#78350F" stroke-width="1.5"/>`).join("")}
    <path d="M20 78 C20 52 48 44 70 46 C94 48 104 62 102 80 C100 96 84 100 60 100 C36 100 20 96 20 78Z" fill="${p.c1}" stroke="#7C2D12" stroke-opacity=".35" stroke-width="2"/>
    ${[40,56,72,88].map(x=>`<path d="M${x} 50 q-4 24 0 48" stroke="${p.c2}" stroke-width="2" fill="none" opacity=".7"/>`).join("")}
    <ellipse cx="96" cy="70" rx="12" ry="12" fill="${p.c1}" stroke="#7C2D12" stroke-opacity=".35" stroke-width="2"/><ellipse cx="104" cy="72" rx="5" ry="6" fill="${p.c2}"/><circle cx="104" cy="72" r="2.2" fill="${INK}"/>
    ${eye(88,64,4,m)}${eye(96,60,3.4,m)}${blush(80,98,74)}${extra(st,48,64)}`),
  /* a water droplet with hydrogen-bond "hands" reaching for its neighbors */
  droplet: (p, st, m) => bob(`<path d="M60 18 C72 40 92 56 92 78 C92 98 78 108 60 108 C42 108 28 98 28 78 C28 56 48 40 60 18Z" fill="${p.c1}" stroke="#0369A1" stroke-width="2"/>
    <path d="M44 62 C40 70 40 80 44 88" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7" fill="none"/>
    <circle cx="16" cy="76" r="6" fill="${p.c2}"/><circle cx="104" cy="76" r="6" fill="${p.c2}"/><path d="M22 78 L30 78 M90 78 L98 78" stroke="#0EA5E9" stroke-width="2" stroke-dasharray="2 2"/>
    ${face(60,78,m)}${extra(st,22)}`, 3),
  /* mitochondrion: bean with folded cristae inside */
  mito: (p, st, m) => bob(`<ellipse cx="60" cy="74" rx="44" ry="30" fill="${p.c1}" stroke="#9A3412" stroke-width="2.5"/><ellipse cx="60" cy="74" rx="36" ry="22" fill="${p.c2}"/>
    <path d="M28 74 q4 -14 8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0" stroke="${p.c1}" stroke-width="3" fill="none" opacity=".75"/>
    <rect x="44" y="60" width="32" height="24" rx="12" fill="${p.c2}" opacity=".9"/>${face(60,70,m,.9)}
    <path d="M16 70 l-6 -4 M16 78 l-7 2" stroke="#9A3412" stroke-width="2.5" stroke-linecap="round"/>${extra(st,46)}`),
  /* amoeba: wobbly blob with pseudopods and a nucleus */
  amoeba: (p, st, m) => `<path d="M60 40 C76 34 84 46 96 46 C110 48 108 64 100 70 C108 80 106 96 90 98 C80 106 66 100 58 104 C44 110 30 102 30 92 C16 90 12 74 24 68 C18 56 30 44 42 46 C46 40 52 42 60 40Z" fill="${p.c1}" stroke="#7E22CE" stroke-opacity=".5" stroke-width="2.5" opacity=".95">
      <animate attributeName="d" dur="5s" repeatCount="indefinite" values="M60 40 C76 34 84 46 96 46 C110 48 108 64 100 70 C108 80 106 96 90 98 C80 106 66 100 58 104 C44 110 30 102 30 92 C16 90 12 74 24 68 C18 56 30 44 42 46 C46 40 52 42 60 40Z;M60 42 C78 38 88 44 100 50 C112 56 104 68 98 72 C110 84 102 98 88 98 C78 104 66 102 58 104 C42 108 26 104 28 92 C14 86 16 72 26 68 C20 54 32 46 44 48 C48 42 52 44 60 42Z;M60 40 C76 34 84 46 96 46 C110 48 108 64 100 70 C108 80 106 96 90 98 C80 106 66 100 58 104 C44 110 30 102 30 92 C16 90 12 74 24 68 C18 56 30 44 42 46 C46 40 52 42 60 40Z"/></path>
    <circle cx="82" cy="88" r="7" fill="${p.c2}" stroke="#7E22CE" stroke-opacity=".4"/><circle cx="36" cy="84" r="3" fill="${p.c2}"/><circle cx="44" cy="94" r="2" fill="${p.c2}"/>
    ${face(60,70,m)}${extra(st,40)}`,
  /* rod-shaped bacterium with a whipping flagellum */
  bacillus: (p, st, m) => `<path d="M14 72 q8 -10 16 0 t16 0" stroke="${p.c1}" stroke-width="3" fill="none" stroke-linecap="round"><animate attributeName="d" dur="1.2s" repeatCount="indefinite" values="M14 72 q8 -10 16 0 t16 0;M14 72 q8 10 16 0 t16 0;M14 72 q8 -10 16 0 t16 0"/></path>
    <rect x="36" y="50" width="70" height="44" rx="22" fill="${p.c1}" stroke="#065F46" stroke-opacity=".5" stroke-width="2.5"/>
    ${[46,60,74,88].map((x,i)=>`<path d="M${x} 50 l-2 -7 M${x+2} 94 l2 7" stroke="${p.c1}" stroke-width="2" stroke-linecap="round"/>`).join("")}
    <rect x="44" y="58" width="54" height="28" rx="14" fill="${p.c2}" opacity=".55"/>${face(72,68,m,.95)}${extra(st,48,72)}`,
  /* chloroplast: green capsule showing grana stacks */
  chloro: (p, st, m) => bob(`<ellipse cx="60" cy="74" rx="46" ry="30" fill="${p.c1}" stroke="#14532D" stroke-width="2.5"/><ellipse cx="60" cy="74" rx="40" ry="24" fill="${p.c2}"/>
    ${[[30,70],[86,70],[38,88],[80,88]].map(([x,y])=>[0,1,2].map(k=>`<rect x="${x-8}" y="${y-6+k*4.5}" width="16" height="3.6" rx="1.8" fill="${p.c1}"/>`).join("")).join("")}
    <path d="M38 79 L82 79" stroke="${p.c1}" stroke-width="1.6" opacity=".6"/>${face(60,66,m,.9)}
    <path d="M86 36 l4 -8 M96 42 l7 -5 M76 32 l1 -9" stroke="#FACC15" stroke-width="2.5" stroke-linecap="round"/>${extra(st,44)}`),
  /* mushroom decomposer: spotted cap, stem body */
  mushroom: (p, st, m) => `<path d="M42 70 C40 90 40 102 44 106 L76 106 C80 102 80 90 78 70Z" fill="${p.c2}" stroke="#A16207" stroke-opacity=".4" stroke-width="2"/>
    <path d="M14 70 C14 38 40 22 60 22 C80 22 106 38 106 70 C92 76 28 76 14 70Z" fill="${p.c1}" stroke="#7F1D1D" stroke-opacity=".5" stroke-width="2.5"/>
    ${[[36,46,6],[60,34,5],[82,46,6],[50,58,4],[72,58,4],[24,62,3],[96,62,3]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#FFF7ED"/>`).join("")}
    <path d="M30 72 L36 76 M42 74 L46 78 M74 74 L78 78 M86 72 L90 76" stroke="#7F1D1D" stroke-opacity=".3" stroke-width="1.5"/>${face(60,88,m,.85)}
    ${st===3?crown(22):st===2?`<circle cx="98" cy="96" r="5" fill="${p.c1}"/><rect x="96" y="100" width="4" height="7" fill="${p.c2}"/>`:""}`,
  /* seedling: round seed body with two leaves */
  sprout: (p, st, m) => bob(`<path d="M60 48 C58 36 60 28 60 22" stroke="#15803D" stroke-width="4" fill="none"/>
    <path d="M60 30 C44 14 26 20 26 32 C40 38 52 36 60 30Z" fill="#4ADE80" stroke="#15803D" stroke-width="2"/><path d="M60 30 C76 14 94 20 94 32 C80 38 68 36 60 30Z" fill="#86EFAC" stroke="#15803D" stroke-width="2"/>
    <ellipse cx="60" cy="78" rx="32" ry="30" fill="${p.c1}" stroke="#78350F" stroke-opacity=".4" stroke-width="2.5"/><path d="M60 50 C54 64 54 92 60 106" stroke="${p.c2}" stroke-width="2" fill="none" opacity=".6"/>
    ${face(60,78,m)}${st===3?crown(18):""}`, 3.2),
  /* paramecium: slipper-shaped protist ringed with beating cilia */
  paramecium: (p, st, m) => `${Array.from({length:22},(_,i)=>{const a=i/22*Math.PI*2,x=60+46*Math.cos(a),y=74+28*Math.sin(a),x2=60+54*Math.cos(a),y2=74+33*Math.sin(a);return `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${p.c1}" stroke-width="2" stroke-linecap="round"><animate attributeName="x2" dur="0.8s" begin="${(i*.04).toFixed(2)}s" repeatCount="indefinite" values="${x2.toFixed(1)};${(x2+3).toFixed(1)};${x2.toFixed(1)}"/></line>`;}).join("")}
    <path d="M14 74 C14 52 40 44 64 46 C92 48 106 60 106 74 C106 90 90 102 62 102 C40 102 30 92 40 84 C20 90 14 84 14 74Z" fill="${p.c2}" stroke="${p.c1}" stroke-width="2.5"/>
    <circle cx="36" cy="66" r="7" fill="none" stroke="${p.c1}" stroke-width="2" opacity=".6"/><circle cx="90" cy="82" r="5" fill="${p.c1}" opacity=".35"/>${face(66,70,m,.9)}${extra(st,46,64)}`,
  /* streptococcus chain: three linked spheres */
  chain: (p, st, m) => bob(`${[[30,84,17],[90,84,17]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${p.c1}" stroke="#9D174D" stroke-opacity=".4" stroke-width="2"/><circle cx="${x}" cy="${y}" r="${r*.55}" fill="${p.c2}" opacity=".6"/>`).join("")}
    ${eye(24,82,2.8,m)}${eye(36,82,2.8,m)}${eye(84,82,2.8,m)}${eye(96,82,2.8,m)}
    <circle cx="60" cy="76" r="24" fill="${p.c1}" stroke="#9D174D" stroke-opacity=".4" stroke-width="2.5"/><circle cx="60" cy="76" r="16" fill="${p.c2}" opacity=".55"/>${face(60,74,m,.9)}${extra(st,50)}`),
  /* neuron: star-shaped soma with branching dendrites and an axon tail */
  neuron: (p, st, m) => `${[[-150,30],[-110,34],[-60,32],[-20,30],[200,30]].map(([d,l])=>{const a=d*Math.PI/180,x=60+l*Math.cos(a),y=66+l*Math.sin(a);return `<path d="M60 66 L${x.toFixed(1)} ${y.toFixed(1)} M${x.toFixed(1)} ${y.toFixed(1)} l${(Math.cos(a-0.6)*10).toFixed(1)} ${(Math.sin(a-0.6)*10).toFixed(1)} M${x.toFixed(1)} ${y.toFixed(1)} l${(Math.cos(a+0.6)*10).toFixed(1)} ${(Math.sin(a+0.6)*10).toFixed(1)}" stroke="${p.c1}" stroke-width="4" stroke-linecap="round" fill="none"/>`;}).join("")}
    <path d="M68 80 C80 96 96 98 108 104" stroke="${p.c1}" stroke-width="5" fill="none" stroke-linecap="round"/>${[80,92].map(x=>`<ellipse cx="${x}" cy="${x===80?92:100}" rx="5" ry="3.2" fill="${p.c2}" transform="rotate(30 ${x} ${x===80?92:100})"/>`).join("")}
    <circle cx="108" cy="104" r="4" fill="#FDE047"><animate attributeName="r" values="3;6;3" dur="1s" repeatCount="indefinite"/></circle>
    <circle cx="60" cy="66" r="22" fill="${p.c1}" stroke="#5B21B6" stroke-opacity=".4" stroke-width="2"/><circle cx="60" cy="66" r="14" fill="${p.c2}" opacity=".6"/>${face(60,64,m,.85)}${extra(st,42)}`,
  /* pollinator bee: fuzzy striped body, glassy wings, pollen baskets */
  bee: (p, st, m) => bob(`<ellipse cx="44" cy="54" rx="16" ry="11" fill="#E0F2FE" opacity=".85" stroke="#7DD3FC" transform="rotate(-25 44 54)"><animateTransform attributeName="transform" type="rotate" values="-25 44 54;-40 44 54;-25 44 54" dur=".25s" repeatCount="indefinite"/></ellipse>
    <ellipse cx="76" cy="54" rx="16" ry="11" fill="#E0F2FE" opacity=".85" stroke="#7DD3FC" transform="rotate(25 76 54)"><animateTransform attributeName="transform" type="rotate" values="25 76 54;40 76 54;25 76 54" dur=".25s" repeatCount="indefinite"/></ellipse>
    <ellipse cx="60" cy="80" rx="34" ry="26" fill="${p.c1}" stroke="#78350F" stroke-opacity=".5" stroke-width="2"/>
    ${[64,80,96].map(y=>`<path d="M${y===96?40:30} ${y-6} Q60 ${y+2} ${y===96?80:90} ${y-6}" stroke="#292524" stroke-width="6" fill="none" opacity=".85"/>`).join("")}
    <path d="M48 56 q-6 -12 -2 -16 M72 56 q6 -12 2 -16" stroke="#292524" stroke-width="2" fill="none"/><circle cx="46" cy="40" r="3" fill="#292524"/><circle cx="74" cy="40" r="3" fill="#292524"/>
    <circle cx="28" cy="96" r="6" fill="#FDE047" stroke="#CA8A04"/><circle cx="92" cy="96" r="6" fill="#FDE047" stroke="#CA8A04"/>${face(60,72,m,.9)}${st===3?crown(36):""}`, 1.6),
  /* diatom: glassy geometric shell with radial etching */
  diatom: (p, st, m) => bob(`<circle cx="60" cy="72" r="40" fill="${p.c2}" stroke="${p.c1}" stroke-width="3"/>
    ${Array.from({length:24},(_,i)=>{const a=i/24*Math.PI*2;return `<line x1="${(60+18*Math.cos(a)).toFixed(1)}" y1="${(72+18*Math.sin(a)).toFixed(1)}" x2="${(60+38*Math.cos(a)).toFixed(1)}" y2="${(72+38*Math.sin(a)).toFixed(1)}" stroke="${p.c1}" stroke-width="1.2" opacity=".55"/>`;}).join("")}
    ${Array.from({length:12},(_,i)=>{const a=i/12*Math.PI*2;return `<circle cx="${(60+30*Math.cos(a)).toFixed(1)}" cy="${(72+30*Math.sin(a)).toFixed(1)}" r="2" fill="${p.c1}" opacity=".6"/>`;}).join("")}
    <circle cx="60" cy="72" r="18" fill="#fff" opacity=".8"/>${face(60,70,m,.85)}<path d="M30 46 Q40 38 52 36" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8" fill="none"/>${extra(st,32)}`, 3.4),
  /* coral polyp colony: branching arms tipped with tiny polyps */
  coral: (p, st, m) => `${[[30,40],[46,30],[74,30],[90,40],[60,24]].map(([x,y])=>`<path d="M60 92 Q${(60+x)/2} ${(y+92)/2+6} ${x} ${y}" stroke="${p.c1}" stroke-width="9" fill="none" stroke-linecap="round"/><g>${[0,1,2,3,4,5].map(k=>{const a=k/6*Math.PI*2;return `<line x1="${x}" y1="${y}" x2="${(x+6*Math.cos(a)).toFixed(1)}" y2="${(y+6*Math.sin(a)).toFixed(1)}" stroke="${p.c2}" stroke-width="2" stroke-linecap="round"/>`;}).join("")}<animateTransform attributeName="transform" type="rotate" values="0 ${x} ${y};15 ${x} ${y};0 ${x} ${y}" dur="2.4s" repeatCount="indefinite"/></g>`).join("")}
    <path d="M30 108 C30 84 44 72 60 72 C76 72 90 84 90 108Z" fill="${p.c1}" stroke="#9F1239" stroke-opacity=".4" stroke-width="2"/>${face(60,90,m,.9)}${st===3?crown(18):""}`,
  /* axolotl: pink salamander with feathery gills and a paddle tail */
  axolotl: (p, st, m) => bob(`<path d="M86 88 C104 86 112 76 112 66 C104 74 96 76 88 76Z" fill="${p.c1}" stroke="#BE185D" stroke-opacity=".3" stroke-width="2"/>
    <ellipse cx="62" cy="88" rx="30" ry="17" fill="${p.c1}" stroke="#BE185D" stroke-opacity=".3" stroke-width="2"/>
    <path d="M42 100 l-6 8 M54 104 l-2 6 M74 104 l2 6 M84 100 l5 7" stroke="${p.c1}" stroke-width="5" stroke-linecap="round"/>
    ${[[-1,0],[-1,1],[-1,2],[1,0],[1,1],[1,2]].map(([s,k])=>`<path d="M${60+s*24} ${52+k*8} q${s*10} ${-6+k*3} ${s*18} ${-2+k*6}" stroke="${p.c2}" stroke-width="4" fill="none" stroke-linecap="round"/>`).join("")}
    <ellipse cx="60" cy="62" rx="27" ry="21" fill="${p.c1}" stroke="#BE185D" stroke-opacity=".3" stroke-width="2"/>${face(60,62,m)}${extra(st,40)}`),
  /* DNA serpent: a double helix body with base-pair rungs */
  helix: (p, st, m) => { const a = [], b = [], r = []; for (let i = 0; i <= 16; i++) { const y = 104 - i*4.4, x1 = 60 + 22*Math.sin(i*.55), x2 = 60 - 22*Math.sin(i*.55); a.push(`${x1.toFixed(1)},${y.toFixed(1)}`); b.push(`${x2.toFixed(1)},${y.toFixed(1)}`); if (i%2===0) r.push(`<line x1="${x1.toFixed(1)}" y1="${y}" x2="${x2.toFixed(1)}" y2="${y}" stroke="${["#F43F5E","#22C55E","#3B82F6","#F59E0B"][i/2%4]}" stroke-width="3"/>`); }
    return `${r.join("")}<polyline points="${a.join(" ")}" fill="none" stroke="${p.c1}" stroke-width="6" stroke-linecap="round"/><polyline points="${b.join(" ")}" fill="none" stroke="${p.c2}" stroke-width="6" stroke-linecap="round"/>
      <ellipse cx="60" cy="26" rx="22" ry="16" fill="${p.c1}" stroke="#3730A3" stroke-opacity=".4" stroke-width="2"/>${face(60,26,m,.85)}<path d="M60 42 l-3 6 l3 -2 l3 2z" fill="#F43F5E"/>${st===3?crown(10):""}`; },
  /* comb jelly: transparent dome with shimmering rainbow comb rows */
  combjelly: (p, st, m) => bob(`<path d="M24 74 C24 38 96 38 96 74 C96 96 80 106 60 106 C40 106 24 96 24 74Z" fill="${p.c2}" opacity=".85" stroke="${p.c1}" stroke-width="2"/>
    ${[32,46,60,74,88].map((x,i)=>`<path d="M${x} ${i===2?44:i%4===0?62:50} Q${x+(x-60)*.12} 78 ${x} 102" stroke="url(#rb${i})" stroke-width="3" fill="none" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" values="0;12" dur="1s" repeatCount="indefinite"/></path><defs><linearGradient id="rb${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F472B6"/><stop offset=".5" stop-color="#60A5FA"/><stop offset="1" stop-color="#34D399"/></linearGradient></defs>`).join("")}
    ${face(60,78,m,.9)}<path d="M50 104 q-6 6 -2 10 M70 104 q6 6 2 10" stroke="${p.c1}" stroke-width="1.5" fill="none"/>${extra(st,40)}`, 3),
  /* sea star: five arms with tube-foot dots */
  starfish: (p, st, m) => { const pts = []; for (let i = 0; i < 10; i++) { const a = -Math.PI/2 + i*Math.PI/5, r = i%2 ? 20 : 46; pts.push(`${(60+r*Math.cos(a)).toFixed(1)},${(66+r*Math.sin(a)).toFixed(1)}`); }
    return `<polygon points="${pts.join(" ")}" fill="${p.c1}" stroke="#9A3412" stroke-opacity=".45" stroke-width="3" stroke-linejoin="round"/>
      ${[0,1,2,3,4].map(i=>{const a=-Math.PI/2+i*Math.PI*2/5;return [16,26,36].map(d=>`<circle cx="${(60+d*Math.cos(a)).toFixed(1)}" cy="${(66+d*Math.sin(a)).toFixed(1)}" r="2.2" fill="${p.c2}"/>`).join("");}).join("")}
      <circle cx="60" cy="66" r="15" fill="${p.c1}"/>${face(60,64,m,.8)}${st===3?crown(22):""}`; },
  /* monarch: butterfly with veined orange wings */
  butterfly: (p, st, m) => bob(`${[-1,1].map(s=>`<g><path d="M60 66 C${60+s*20} 30 ${60+s*52} 26 ${60+s*50} 54 C${60+s*48} 66 ${60+s*30} 70 60 70Z" fill="${p.c1}" stroke="#1C1917" stroke-width="2.5"/>
      <path d="M60 72 C${60+s*36} 74 ${60+s*44} 96 ${60+s*28} 102 C${60+s*16} 104 60 90 60 76Z" fill="${p.c1}" stroke="#1C1917" stroke-width="2.5"/>
      <path d="M60 68 L${60+s*40} 44 M60 70 L${60+s*30} 62 M60 76 L${60+s*30} 92" stroke="#1C1917" stroke-width="1.5"/>${[[46,36],[52,44],[36,96]].map(([dx,y])=>`<circle cx="${60+s*dx}" cy="${y}" r="2" fill="#fff"/>`).join("")}
      <animateTransform attributeName="transform" type="scale" values="1 1;0.82 1;1 1" dur="1.4s" repeatCount="indefinite" additive="sum"/></g>`).join("").replace(/additive="sum"/g,"")}
    <ellipse cx="60" cy="76" rx="7" ry="22" fill="#1C1917"/><circle cx="60" cy="54" r="10" fill="#1C1917"/>
    <path d="M56 46 q-6 -12 -10 -14 M64 46 q6 -12 10 -14" stroke="#1C1917" stroke-width="2" fill="none"/>${eye(56,54,2.6,m)}${eye(64,54,2.6,m)}${st===3?crown(36):""}`, 2.2),
  /* Golgi courier: a stack of flattened cisternae carrying a vesicle */
  golgi: (p, st, m) => bob(`${[0,1,2,3].map(k=>`<path d="M${22+k*3} ${56+k*12} Q60 ${46+k*12} ${98-k*3} ${56+k*12} Q100 ${64+k*12} ${96-k*3} ${66+k*12} Q60 ${58+k*12} ${24+k*3} ${66+k*12} Q20 ${64+k*12} ${22+k*3} ${56+k*12}Z" fill="${k%2?p.c2:p.c1}" stroke="#92400E" stroke-opacity=".35" stroke-width="1.5"/>`).join("")}
    <circle cx="104" cy="48" r="9" fill="${p.c2}" stroke="${p.c1}" stroke-width="2"><animate attributeName="cy" values="50;44;50" dur="1.6s" repeatCount="indefinite"/></circle><circle cx="16" cy="96" r="6" fill="${p.c2}" stroke="${p.c1}" stroke-width="2"/>
    ${face(60,74,m,.9)}${extra(st,44)}`),
  /* radiolarian: crystal sphere with long glassy spines */
  radiolarian: (p, st, m) => `${Array.from({length:12},(_,i)=>{const a=i/12*Math.PI*2;return `<line x1="${(60+30*Math.cos(a)).toFixed(1)}" y1="${(68+30*Math.sin(a)).toFixed(1)}" x2="${(60+52*Math.cos(a)).toFixed(1)}" y2="${(68+52*Math.sin(a)).toFixed(1)}" stroke="${p.c1}" stroke-width="2.5" stroke-linecap="round"/><circle cx="${(60+52*Math.cos(a)).toFixed(1)}" cy="${(68+52*Math.sin(a)).toFixed(1)}" r="2.4" fill="#fff" stroke="${p.c1}"/>`;}).join("")}
    <circle cx="60" cy="68" r="32" fill="${p.c2}" stroke="${p.c1}" stroke-width="3"/>
    ${Array.from({length:8},(_,i)=>{const a=i/8*Math.PI*2;return `<polygon points="${[0,1,2,3,4,5].map(k=>{const b=k/6*Math.PI*2;return `${(60+22*Math.cos(a)+5*Math.cos(b)).toFixed(1)},${(68+22*Math.sin(a)+5*Math.sin(b)).toFixed(1)}`;}).join(" ")}" fill="none" stroke="${p.c1}" stroke-width="1.2" opacity=".6"/>`;}).join("")}
    <circle cx="60" cy="68" r="16" fill="#fff" opacity=".85"/>${face(60,66,m,.8)}${st===3?crown(14):""}`,
  /* dividing cell: two daughter cells pinching apart in cytokinesis, two faces */
  mitosis: (p, st, m) => `<g><path d="M18 74 C18 50 46 44 60 60 C74 44 102 50 102 74 C102 98 74 104 60 88 C46 104 18 98 18 74Z" fill="${p.c1}" stroke="#155E75" stroke-opacity=".45" stroke-width="2.5"/>
      <animateTransform attributeName="transform" type="scale" values="1 1;1.04 .97;1 1" dur="2s" repeatCount="indefinite" additive="sum"/></g>
    <ellipse cx="38" cy="74" rx="9" ry="7" fill="${p.c2}"/><ellipse cx="82" cy="74" rx="9" ry="7" fill="${p.c2}"/>
    ${eye(32,68,3,m)}${eye(44,68,3,m)}${mouth(38,76,m,3)}${eye(76,68,3,m)}${eye(88,68,3,m)}${mouth(82,76,m,3)}
    <path d="M60 58 L60 90" stroke="#155E75" stroke-width="1.5" stroke-dasharray="3 3"/>${st===3?crown(48,38)+crown(48,82):""}`,
  /* Venus flytrap: snapping leaf-jaws with trigger hairs */
  flytrap: (p, st, m) => `<path d="M60 108 C58 96 60 88 60 80" stroke="#15803D" stroke-width="6"/><path d="M60 100 C48 96 40 100 34 106 M60 100 C72 96 80 100 86 106" stroke="#22C55E" stroke-width="6" fill="none" stroke-linecap="round"/>
    <g><path d="M24 62 C24 40 96 40 96 62 C80 56 40 56 24 62Z" fill="${p.c1}" stroke="#14532D" stroke-width="2"/>${[30,40,50,60,70,80,90].map(x=>`<path d="M${x} ${x===30||x===90?52:44} l-1 -8" stroke="#14532D" stroke-width="2" stroke-linecap="round"/>`).join("")}
      <animateTransform attributeName="transform" type="rotate" values="0 60 64;-6 60 64;0 60 64" dur="2.6s" repeatCount="indefinite"/></g>
    <path d="M24 66 C40 90 80 90 96 66 C80 72 40 72 24 66Z" fill="${p.c2}" stroke="#14532D" stroke-width="2"/><path d="M28 64 C44 72 76 72 92 64" stroke="#DC2626" stroke-width="5" opacity=".7" fill="none"/>
    ${face(60,78,m,.75)}${st===3?crown(38):""}`,
  /* tree of life: an ancient trunk whose branches form a phylogenetic tree */
  tree: (p, st, m) => `<path d="M48 108 C50 90 50 78 46 64 L74 64 C70 78 70 90 72 108Z" fill="${p.c1}" stroke="#451A03" stroke-opacity=".5" stroke-width="2"/>
    <path d="M60 66 L60 46 M60 46 L36 30 M60 46 L84 30 M36 30 L24 18 M36 30 L46 16 M84 30 L74 16 M84 30 L96 18 M60 46 L60 22" stroke="${p.c1}" stroke-width="5" stroke-linecap="round" fill="none"/>
    ${[[24,18],[46,16],[60,20],[74,16],[96,18]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="9" fill="${p.c2}" opacity=".95"/><circle cx="${x}" cy="${y}" r="3.5" fill="${["#F43F5E","#3B82F6","#FACC15","#A855F7","#22C55E"][i]}"><animate attributeName="opacity" values=".4;1;.4" dur="${2+i*.3}s" repeatCount="indefinite"/></circle>`).join("")}
    <path d="M44 108 l-10 4 M76 108 l10 4" stroke="${p.c1}" stroke-width="4" stroke-linecap="round"/>${face(60,84,m,.9)}${st===3?crown(8):""}`,
  /* anglerfish: deep-sea fish with a glowing lure (bioluminescence) */
  angler: (p, st, m) => `<path d="M64 40 C64 24 84 18 92 26" stroke="${p.c2}" stroke-width="2.5" fill="none"/><circle cx="93" cy="27" r="6" fill="#FDE047"><animate attributeName="opacity" values=".5;1;.5" dur="1.4s" repeatCount="indefinite"/></circle><circle cx="93" cy="27" r="13" fill="#FDE047" opacity=".25"/>
    <path d="M100 74 L116 60 L114 90Z" fill="${p.c1}" stroke="#0F172A" stroke-width="2"/>
    <path d="M14 72 C14 46 40 38 64 40 C88 42 102 56 102 74 C102 94 84 104 58 104 C34 104 14 94 14 72Z" fill="${p.c1}" stroke="#0F172A" stroke-width="2.5"/>
    <path d="M20 80 L30 92 L40 80 L50 94 L60 80 L70 94 L80 82" fill="#fff" stroke="#0F172A" stroke-width="1.5" stroke-linejoin="round"/>
    ${eye(44,62,5,m)}${eye(64,58,4,m)}<path d="M74 66 q6 4 12 0" stroke="${p.c2}" stroke-width="2" fill="none"/>${st===3?crown(38,48):""}`,
  /* bacteriophage: geometric head, sheath tail and spider-like tail fibers */
  phage: (p, st, m) => `<polygon points="60,10 84,24 84,52 60,66 36,52 36,24" fill="${p.c1}" stroke="#3730A3" stroke-width="2.5"/><polygon points="60,18 76,28 76,48 60,58 44,48 44,28" fill="${p.c2}" opacity=".6"/>
    ${face(60,38,m,.8)}<rect x="54" y="66" width="12" height="24" rx="3" fill="${p.c1}" stroke="#3730A3" stroke-width="2"/>${[70,76,82].map(y=>`<line x1="54" y1="${y}" x2="66" y2="${y}" stroke="#3730A3" stroke-width="1.5"/>`).join("")}
    <rect x="46" y="88" width="28" height="5" rx="2" fill="#3730A3"/>${[[-1,1],[1,1],[-1,.5],[1,.5]].map(([s,k])=>`<path d="M60 92 L${60+s*20*k+s*10} 100 L${60+s*28*k+s*10} 108" stroke="${p.c1}" stroke-width="3" fill="none" stroke-linecap="round"/>`).join("")}
    ${st===3?crown(10):""}`,
  /* coelacanth: lobe-finned "living fossil" */
  coelacanth: (p, st, m) => bob(`<path d="M96 72 L114 58 L110 72 L114 88Z" fill="${p.c1}" stroke="#1E3A8A" stroke-width="2"/>
    <path d="M10 72 C14 52 40 46 64 48 C86 50 98 60 98 72 C98 86 84 96 62 96 C40 96 14 90 10 72Z" fill="${p.c1}" stroke="#1E3A8A" stroke-width="2.5"/>
    ${[[30,62],[46,58],[62,60],[78,64],[38,78],[56,80],[74,80]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3" fill="${p.c2}"/>`).join("")}
    ${[[40,96,10],[64,96,-10],[44,48,-12],[70,50,10]].map(([x,y,r])=>`<ellipse cx="${x}" cy="${y+(y>70?6:-6)}" rx="7" ry="11" fill="${p.c1}" stroke="#1E3A8A" stroke-width="2" transform="rotate(${r} ${x} ${y})"/>`).join("")}
    ${eye(24,68,4.5,m)}<path d="M12 78 q6 3 12 0" stroke="${INK}" stroke-width="2" fill="none"/>${st===3?crown(44,40):""}`, 3.6),
  /* hydrothermal tube worm: red plume rising from a white tube, near a vent */
  tubeworm: (p, st, m) => `<path d="M88 108 C86 90 92 80 96 72" stroke="#57534E" stroke-width="12" stroke-linecap="round"/><g opacity=".7">${[0,1,2].map(k=>`<circle cx="${96+k*4}" cy="${62-k*12}" r="${4+k*2}" fill="#A8A29E"><animate attributeName="cy" values="${66-k*12};${50-k*12}" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values=".7;0" dur="2s" repeatCount="indefinite"/></circle>`).join("")}</g>
    <path d="M44 108 L46 56 L68 56 L70 108Z" fill="#F5F5F4" stroke="#A8A29E" stroke-width="2"/>${[66,78,90,100].map(y=>`<line x1="45" y1="${y}" x2="69" y2="${y}" stroke="#D6D3D1" stroke-width="2"/>`).join("")}
    ${Array.from({length:9},(_,i)=>{const a=-Math.PI*(0.15+i*0.0875);return `<path d="M57 52 Q${(57+18*Math.cos(a)).toFixed(1)} ${(52+18*Math.sin(a)).toFixed(1)} ${(57+30*Math.cos(a)).toFixed(1)} ${(52+30*Math.sin(a)).toFixed(1)}" stroke="${p.c1}" stroke-width="6" fill="none" stroke-linecap="round"/>`;}).join("")}
    <ellipse cx="57" cy="54" rx="16" ry="12" fill="${p.c1}" stroke="#7F1D1D" stroke-width="2"/>${face(57,54,m,.75)}${st===3?crown(18,57):""}`,
  /* LUCA: the glowing primordial cell, ringed by orbiting nucleotides */
  luca: (p, st, m) => `<circle cx="60" cy="64" r="48" fill="${p.c2}" opacity=".18"><animate attributeName="r" values="44;50;44" dur="3s" repeatCount="indefinite"/></circle>
    <g><animateTransform attributeName="transform" type="rotate" values="0 60 64;360 60 64" dur="14s" repeatCount="indefinite"/>${["A","U","G","C","T","A"].map((b,i)=>{const a=i/6*Math.PI*2;return `<circle cx="${(60+44*Math.cos(a)).toFixed(1)}" cy="${(64+44*Math.sin(a)).toFixed(1)}" r="7" fill="${["#F43F5E","#FACC15","#22C55E","#3B82F6","#A855F7","#F43F5E"][i]}"/><text x="${(60+44*Math.cos(a)).toFixed(1)}" y="${(67.5+44*Math.sin(a)).toFixed(1)}" font-size="9" font-weight="800" text-anchor="middle" fill="#fff" font-family="Manrope, sans-serif">${b}</text>`;}).join("")}</g>
    <circle cx="60" cy="64" r="32" fill="${p.c1}" stroke="#fff" stroke-width="3"/><circle cx="60" cy="64" r="32" fill="url(#lucaG)"/><defs><radialGradient id="lucaG" cx=".35" cy=".3"><stop offset="0" stop-color="#fff" stop-opacity=".8"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
    <path d="M44 74 C50 60 66 82 74 66" stroke="${p.c2}" stroke-width="3" fill="none" opacity=".7"/>${face(60,60,m)}${crown(26)}`
};
})();
