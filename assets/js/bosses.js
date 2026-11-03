/* Credit Sprint unit bosses: every unit in every course has its own humanoid monster, themed to the unit.
   CS.bossArt(course, unit, state) draws one as SVG. States: idle, hurt, crit, attack (the boss hits back when you miss),
   defeat (you won) and win (the boss won). The motion lives in styles.css (.bossart …); it switches off for reduced motion.
   All characters are original designs. */
(function(){
"use strict";
const CS = window.CS = window.CS || {};
const INK = "#1F2430", O = `stroke="${INK}" stroke-opacity=".7" stroke-width="2.2" stroke-linejoin="round"`;
const shade = (hex, f) => { const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const m = v => Math.max(0, Math.min(255, Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f)));
  return "#" + ((1 << 24) + (m(r) << 16) + (m(g) << 8) + m(b)).toString(16).slice(1); };

/* ---------- the cast ----------
   g: f/m · sk skin · o outfit (suit coat robe gown armor rags lab hood golem) · oc outfit colour · ac accent
   hair: long bun pony bob spiky slick mohawk none · hc hair colour · hat · f: face/head features · x: extras · p: prop · ey: eye glow */
const B = {
 macro:{
  1:{g:"f",sk:"#C4B5FD",o:"gown",oc:"#DB2777",ac:"#FDE047",hair:"long",hc:"#1F2937",f:["halfmask","ears"],p:"tag",ey:"#F472B6"},
  2:{g:"m",sk:"#86EFAC",o:"suit",oc:"#1E3A8A",ac:"#EF4444",hair:"slick",hc:"#14532D",hat:"bowler",f:["horns"],p:"balloon"},
  3:{g:"m",sk:"#FDBA74",o:"armor",oc:"#B45309",ac:"#FDE047",hair:"mohawk",hc:"#7C2D12",f:["horns","tusks"],x:["cape"],p:"coins"},
  4:{g:"f",sk:"#CBD5E1",o:"hood",oc:"#334155",ac:"#38BDF8",f:["glow"],x:["aura","chains"],p:"key",ey:"#38BDF8"},
  5:{g:"m",sk:"#E9D5FF",o:"hood",oc:"#4C1D95",ac:"#A78BFA",f:["halfmask","glow"],x:["aura"],p:"chart",ey:"#C4B5FD"},
  6:{g:"f",sk:"#2DD4BF",o:"robe",oc:"#0E7490",ac:"#FDE047",hair:"tentacles",hc:"#0F766E",hat:"crown",x:["tail"],p:"trident"}},
 micro:{
  1:{g:"f",sk:"#D1D5DB",o:"rags",oc:"#6B7280",ac:"#FCD34D",f:["glow"],hair:"long",hc:"#F3F4F6",x:["aura"],p:"bag",ey:"#FDE047"},
  2:{g:"m",sk:"#22D3EE",o:"suit",oc:"#164E63",ac:"#FDE047",hair:"none",f:["fins"],x:["tail"],p:"spring"},
  3:{g:"m",sk:"#A8A29E",o:"golem",oc:"#78716C",ac:"#F97316",f:["cracks","glow"],p:"chart",ey:"#F97316"},
  4:{g:"m",sk:"#FCA5A5",o:"suit",oc:"#111827",ac:"#FBBF24",hair:"none",hat:"tophat",f:["monocle","mustache","horns"],x:["cape"],p:"coins"},
  5:{g:"f",sk:"#FDA4AF",o:"coat",oc:"#065F46",ac:"#FCD34D",hair:"bun",hc:"#422006",hat:"kepi",f:["glasses"],p:"clipboard"},
  6:{g:"f",sk:"#A3E635",o:"rags",oc:"#3F6212",ac:"#BEF264",hair:"drip",hc:"#4D7C0F",f:["drip","glow"],x:["aura"],p:"flask",ey:"#ECFCCB"}},
 bio:{
  1:{g:"f",sk:"#38BDF8",o:"robe",oc:"#0369A1",ac:"#E0F2FE",hair:"long",hc:"#0C4A6E",x:["heads"],p:"droplet"},
  2:{g:"m",sk:"#F9A8D4",o:"robe",oc:"#BE185D",ac:"#FBCFE8",hair:"none",f:["ears","glow"],x:["bubble"],p:"mask"},
  3:{g:"f",sk:"#FDE047",o:"rags",oc:"#1F2937",ac:"#FACC15",hair:"pony",hc:"#111827",f:["bandit"],x:["cape"],p:"bolt"},
  4:{g:"m",sk:"#F472B6",o:"armor",oc:"#9D174D",ac:"#FDE68A",hair:"spiky",hc:"#831843",f:["spots","fangs"],p:"sword"},
  5:{g:"f",sk:"#DDD6FE",o:"hood",oc:"#4338CA",ac:"#A5B4FC",f:["glow"],x:["aura"],p:"dna",ey:"#A5B4FC"},
  6:{g:"m",sk:"#C084FC",o:"coat",oc:"#581C87",ac:"#22D3EE",hair:"spiky",hc:"#3B0764",f:["horns","glitch"],p:"dna"},
  7:{g:"m",sk:"#78716C",o:"golem",oc:"#44403C",ac:"#EF4444",f:["cracks","glow"],x:["smoke"],p:"orb",ey:"#EF4444"},
  8:{g:"f",sk:"#A3E635",o:"armor",oc:"#365314",ac:"#FDE047",hair:"bob",hc:"#1A2E05",f:["antennae"],x:["bugwings"],p:"staff"}},
 chem:{
  1:{g:"m",sk:"#60A5FA",o:"coat",oc:"#1E293B",ac:"#FDE047",hair:"slick",hc:"#0F172A",f:["bandit"],p:"atom"},
  2:{g:"f",sk:"#FB923C",o:"armor",oc:"#9A3412",ac:"#FEF3C7",hair:"pony",hc:"#431407",f:["horns"],p:"hammer"},
  3:{g:"m",sk:"#E2E8F0",o:"hood",oc:"#475569",ac:"#7DD3FC",f:["glow"],x:["aura"],p:"orb",ey:"#7DD3FC"},
  4:{g:"f",sk:"#99F6E4",o:"lab",oc:"#F8FAFC",ac:"#14B8A6",hair:"bun",hc:"#134E4A",f:["goggles"],p:"flask"},
  5:{g:"m",sk:"#F97316",o:"robe",oc:"#7C2D12",ac:"#FDE047",hair:"flame",hc:"#FBBF24",f:["glow"],p:"torch",ey:"#FEF08A"},
  6:{g:"f",sk:"#FB7185",o:"gown",oc:"#881337",ac:"#7DD3FC",hair:"long",hc:"#4C0519",f:["fangs","ears"],x:["batwings"],p:"thermo"},
  7:{g:"m",sk:"#A5B4FC",o:"robe",oc:"#312E81",ac:"#FDE047",hair:"none",f:["thirdeye","beard"],p:"scale"},
  8:{g:"f",sk:"#4ADE80",o:"armor",oc:"#14532D",ac:"#BEF264",hair:"long",hc:"#052E16",f:["horns","scales"],x:["batwings","tail"],p:"flask"},
  9:{g:"m",sk:"#94A3B8",o:"golem",oc:"#334155",ac:"#FDE047",f:["gears","glow"],x:["smoke"],p:"gear",ey:"#FDE047"}},
 apush:{
  1:{g:"m",sk:"#A3E635",o:"armor",oc:"#9CA3AF",ac:"#B91C1C",hair:"none",hat:"morion",f:["beard","fangs"],p:"sword"},
  2:{g:"m",sk:"#94A3B8",o:"suit",oc:"#E5E7EB",ac:"#7F1D1D",hair:"none",hat:"planter",f:["mustache","sunken"],x:["cane"],p:"book"},
  3:{g:"m",sk:"#C4B5FD",o:"coat",oc:"#B91C1C",ac:"#FDE047",hair:"pony",hc:"#E5E7EB",hat:"tricorn",f:["fangs"],p:"flag"},
  4:{g:"f",sk:"#C4B5FD",o:"gown",oc:"#F5F5F4",ac:"#7C2D12",hair:"bun",hc:"#3F3F46",f:["fangs","sunken"],p:"coins"},
  5:{g:"f",sk:"#D1D5DB",o:"hood",oc:"#4B5563",ac:"#9CA3AF",f:["glow"],x:["aura","chains"],p:"flag",ey:"#E5E7EB"},
  6:{g:"m",sk:"#FCD34D",o:"suit",oc:"#111827",ac:"#16A34A",hair:"none",hat:"tophat",f:["monocle","mustache"],x:["cape"],p:"coins"},
  7:{g:"m",sk:"#4ADE80",o:"armor",oc:"#4D7C0F",ac:"#FDE047",hair:"none",hat:"brodie",f:["horns","scales"],x:["batwings","tail"],p:"shield"},
  8:{g:"f",sk:"#93C5FD",o:"armor",oc:"#475569",ac:"#DC2626",hair:"bob",hc:"#1E293B",hat:"fur",p:"shield"},
  9:{g:"m",sk:"#A8A29E",o:"golem",oc:"#57534E",ac:"#3B82F6",f:["cracks"],p:"scroll"}},
 apworld:{
  1:{g:"f",sk:"#F87171",o:"robe",oc:"#991B1B",ac:"#FBBF24",hair:"bun",hc:"#111827",f:["horns","scales"],x:["tail"],p:"scroll"},
  2:{g:"m",sk:"#FCD34D",o:"rags",oc:"#92400E",ac:"#0EA5E9",hair:"none",hat:"scarf",f:["bandit"],p:"sword"},
  3:{g:"m",sk:"#A78BFA",o:"robe",oc:"#6D28D9",ac:"#FDE047",hair:"none",hat:"turban",f:["beard"],p:"bomb"},
  4:{g:"f",sk:"#BAE6FD",o:"coat",oc:"#1E3A8A",ac:"#FDE047",hair:"long",hc:"#F1F5F9",hat:"tricorn",f:["glow"],x:["aura"],p:"sword",ey:"#BAE6FD"},
  5:{g:"m",sk:"#A8A29E",o:"golem",oc:"#57534E",ac:"#DC2626",hat:"phrygian",f:["cracks"],p:"sword"},
  6:{g:"m",sk:"#64748B",o:"golem",oc:"#1F2937",ac:"#F97316",hat:"tophat",f:["gears","glow"],x:["smoke"],p:"gear",ey:"#F97316"},
  7:{g:"m",sk:"#86EFAC",o:"coat",oc:"#3F6212",ac:"#A16207",hair:"none",hat:"brodie",f:["gasmask"],p:"sword"},
  8:{g:"f",sk:"#7DD3FC",o:"armor",oc:"#334155",ac:"#EF4444",hair:"pony",hc:"#0F172A",hat:"fur",p:"shield"},
  9:{g:"f",sk:"#E2E8F0",o:"hood",oc:"#0F172A",ac:"#F59E0B",f:["glow"],x:["chains","aura"],p:"box",ey:"#F59E0B"}},
 apgov:{
  1:{g:"m",sk:"#FCA5A5",o:"suit",oc:"#1E3A8A",ac:"#DC2626",hair:"slick",hc:"#450A0A",f:["horns","twoface"],p:"flag"},
  2:{g:"f",sk:"#A8A29E",o:"golem",oc:"#57534E",ac:"#60A5FA",f:["cracks","glow"],p:"gavel",ey:"#60A5FA"},
  3:{g:"f",sk:"#E5E7EB",o:"hood",oc:"#111827",ac:"#EF4444",f:["blindfold"],x:["aura"],p:"redpen"},
  4:{g:"m",sk:"#E9D5FF",o:"hood",oc:"#581C87",ac:"#FDE047",f:["halfmask","glow"],x:["aura"],p:"clipboard",ey:"#FDE047"},
  5:{g:"m",sk:"#14B8A6",o:"suit",oc:"#042F2E",ac:"#FBBF24",hair:"none",f:["tentbeard","fins"],x:["tail"],p:"coins"}},
 appsych:{
  1:{g:"f",sk:"#BFDBFE",o:"hood",oc:"#1D4ED8",ac:"#FDE047",f:["glow"],x:["aura","sparks"],p:"bolt",ey:"#FDE047"},
  2:{g:"m",sk:"#E5E7EB",o:"hood",oc:"#6B7280",ac:"#C4B5FD",f:["glow","fade"],x:["aura"],p:"hourglass",ey:"#DDD6FE"},
  3:{g:"m",sk:"#FDBA74",o:"armor",oc:"#92400E",ac:"#FBBF24",hair:"mohawk",hc:"#451A03",f:["horns","tusks"],p:"bell"},
  4:{g:"f",sk:"#F0ABFC",o:"coat",oc:"#86198F",ac:"#FDE047",hair:"long",hc:"#4A044E",f:["horns","glasses"],p:"mirror"},
  5:{g:"f",sk:"#4ADE80",o:"gown",oc:"#14532D",ac:"#FDE047",hair:"snakes",hc:"#15803D",f:["scales","fangs"],x:["snaketail"],p:"hourglass"}},
 apstat:{
  1:{g:"m",sk:"#84CC16",o:"rags",oc:"#713F12",ac:"#FDE047",hair:"none",f:["tusks","ears"],p:"hammer"},
  2:{g:"f",sk:"#F87171",o:"gown",oc:"#7F1D1D",ac:"#F8FAFC",hair:"long",hc:"#1F2937",f:["horns"],x:["tail"],p:"dice"},
  3:{g:"m",sk:"#93C5FD",o:"suit",oc:"#0C4A6E",ac:"#FDE047",hair:"slick",hc:"#082F49",f:["horns","glasses"],p:"chart"},
  4:{g:"m",sk:"#65A30D",o:"robe",oc:"#7C2D12",ac:"#FBBF24",hair:"none",hat:"crown",f:["spines","fangs"],x:["tail"],p:"scepter"},
  5:{g:"f",sk:"#E0F2FE",o:"hood",oc:"#0369A1",ac:"#38BDF8",f:["glow"],x:["aura"],p:"chart",ey:"#38BDF8"}},
 aplit:{
  1:{g:"f",sk:"#A5B4FC",o:"gown",oc:"#7C3AED",ac:"#34D399",hair:"long",hc:"#1E1B4B",f:["twoface","ears"],x:["aura"],p:"mask"},
  2:{g:"m",sk:"#FDE68A",o:"suit",oc:"#78350F",ac:"#DC2626",hair:"slick",hc:"#422006",f:["glasses","crossed"],p:"book"},
  3:{g:"f",sk:"#F9A8D4",o:"gown",oc:"#1E1B4B",ac:"#FBBF24",hair:"bun",hc:"#111827",f:["venetian"],p:"fan"},
  4:{g:"f",sk:"#F59E0B",o:"robe",oc:"#1E3A8A",ac:"#FBBF24",hat:"nemes",f:["eyeliner"],x:["birdwings","liontail"],p:"scroll"},
  5:{g:"m",sk:"#CBD5E1",o:"robe",oc:"#4C0519",ac:"#FBBF24",hair:"long",hc:"#111827",hat:"crown",f:["beard","sunken"],x:["cape"],p:"skull"},
  6:{g:"f",sk:"#F8FAFC",o:"robe",oc:"#E5E7EB",ac:"#111827",hair:"ink",hc:"#111827",f:["inkeyes"],x:["pages"],p:"quill",ey:"#111827"}},
 aplang:{
  1:{g:"m",sk:"#4ADE80",o:"suit",oc:"#7C3AED",ac:"#F97316",hair:"none",f:["crest","eyestalk"],x:["tail"],p:"mic"},
  2:{g:"m",sk:"#FDE68A",o:"rags",oc:"#A16207",ac:"#DC2626",hair:"straw",hc:"#EAB308",hat:"farmer",f:["stitch"],p:"staff"},
  3:{g:"f",sk:"#C4B5FD",o:"coat",oc:"#BE185D",ac:"#22D3EE",hair:"pony",hc:"#4C1D95",hat:"jester",f:["mismatch"],p:"question"},
  4:{g:"f",sk:"#FDBA74",o:"gown",oc:"#0F766E",ac:"#F472B6",hair:"long",hc:"#7C2D12",f:["twoface","ears"],p:"mic"},
  5:{g:"m",sk:"#FCA5A5",o:"suit",oc:"#111827",ac:"#DC2626",hair:"slick",hc:"#1F2937",f:["glasses","horns"],p:"redpen"},
  6:{g:"m",sk:"#F1F5F9",o:"coat",oc:"#CBD5E1",ac:"#111827",hair:"spiky",hc:"#111827",f:["inkeyes","fangs","drip"],x:["pages","cape"],p:"quill",ey:"#111827"}},
 mkt:{
  1:{g:"f",sk:"#BBF7D0",o:"hood",oc:"#15803D",ac:"#A3E635",f:["glow"],x:["aura"],p:"flask",ey:"#BEF264"},
  2:{g:"m",sk:"#FCD34D",o:"suit",oc:"#9D174D",ac:"#FDE047",hair:"slick",hc:"#1F2937",f:["bowtie","grin"],p:"box"},
  3:{g:"f",sk:"#A5F3FC",o:"lab",oc:"#F8FAFC",ac:"#0891B2",hair:"bob",hc:"#164E63",f:["glasses","sunken"],p:"clipboard"},
  4:{g:"m",sk:"#F87171",o:"coat",oc:"#7C3AED",ac:"#FDE047",hair:"spiky",hc:"#450A0A",f:["horns","ears","grin"],x:["tail"],p:"bag"},
  5:{g:"f",sk:"#FDBA74",o:"gown",oc:"#64748B",ac:"#F472B6",hair:"bob",hc:"#78350F",f:["sunken"],p:"tag"},
  6:{g:"m",sk:"#93C5FD",o:"armor",oc:"#1E3A8A",ac:"#FBBF24",hair:"none",hat:"helmet",p:"key"},
  7:{g:"f",sk:"#D4D4D8",o:"suit",oc:"#52525B",ac:"#22D3EE",hair:"bob",hc:"#18181B",f:["glow"],x:["clone"],p:"box",ey:"#22D3EE"},
  8:{g:"m",sk:"#F59E0B",o:"armor",oc:"#7C2D12",ac:"#FDE047",hair:"none",f:["horns","scales","fangs"],x:["batwings","tail"],p:"tag"},
  9:{g:"f",sk:"#E5E7EB",o:"hood",oc:"#334155",ac:"#FCA5A5",f:["glow"],x:["aura"],p:"box",ey:"#FCA5A5"},
  10:{g:"m",sk:"#BEF264",o:"suit",oc:"#3F6212",ac:"#FDE047",hair:"none",f:["antennae","compound"],x:["bugwings","swarm"],p:"mail"}}
};
CS.BOSS_ART = B;

/* ---------- parts ---------- */
const prop = (k, c, a) => {
  switch (k) {
    case "tag": return `<g transform="rotate(-18)"><path d="M-12 -14 H8 L18 0 L8 14 H-12Z" fill="${a}" ${O}/><circle cx="8" cy="0" r="3" fill="#fff"/><text x="-4" y="5" font-size="12" font-weight="900" fill="${INK}" text-anchor="middle" font-family="sans-serif">$</text></g>`;
    case "balloon": return `<path d="M0 0 Q-4 14 2 26" stroke="${INK}" stroke-width="1.6" fill="none"/><ellipse cx="0" cy="-18" rx="16" ry="20" fill="${a}" ${O}><animate attributeName="rx" values="14;17;14" dur="1.6s" repeatCount="indefinite"/></ellipse><text x="0" y="-13" font-size="14" font-weight="900" fill="#fff" text-anchor="middle" font-family="sans-serif">%</text>`;
    case "coins": return [0,1,2].map(i=>`<ellipse cx="${-6+i*4}" cy="${-i*7}" rx="12" ry="5" fill="#FBBF24" ${O}/>`).join("") + `<circle cx="10" cy="-26" r="7" fill="#FDE047" ${O}/><text x="10" y="-22" font-size="9" font-weight="900" text-anchor="middle" fill="#92400E" font-family="sans-serif">$</text>`;
    case "key": return `<circle cx="0" cy="-20" r="10" fill="none" stroke="${a}" stroke-width="5"/><path d="M0 -10 V18 M0 10 H8 M0 16 H6" stroke="${a}" stroke-width="5" stroke-linecap="round"/>`;
    case "chart": return `<rect x="-16" y="-34" width="34" height="30" rx="3" fill="#fff" ${O}/><path d="M-12 -10 L-4 -18 L4 -14 L14 -28" fill="none" stroke="${a}" stroke-width="3" stroke-linecap="round"/><path d="M-12 -8 H14" stroke="${INK}" stroke-width="1.2" opacity=".5"/>`;
    case "trident": return `<path d="M0 26 V-30" stroke="#FBBF24" stroke-width="4"/><path d="M-12 -30 V-42 M0 -30 V-46 M12 -30 V-42 M-12 -30 H12" stroke="#FBBF24" stroke-width="4" stroke-linecap="round" fill="none"/>`;
    case "bag": return `<path d="M-14 -2 Q-18 22 0 22 Q18 22 14 -2 Q10 -10 0 -10 Q-10 -10 -14 -2Z" fill="#A16207" ${O}/><path d="M-6 -12 L0 -18 L6 -12" stroke="${INK}" stroke-width="2" fill="none"/><text x="0" y="12" font-size="12" font-weight="900" text-anchor="middle" fill="#FEF3C7" font-family="sans-serif">$</text>`;
    case "spring": return `<path d="M0 10 ${[0,1,2,3,4].map(i=>`Q${i%2?-10:10} ${2-i*8} 0 ${-6-i*8}`).join(" ")}" fill="none" stroke="${a}" stroke-width="4"><animateTransform attributeName="transform" type="scale" values="1 1;1 .75;1 1" dur="1s" repeatCount="indefinite"/></path>`;
    case "clipboard": return `<rect x="-14" y="-30" width="28" height="36" rx="3" fill="#A16207" ${O}/><rect x="-10" y="-24" width="20" height="26" fill="#fff"/><rect x="-6" y="-33" width="12" height="6" rx="2" fill="#94A3B8"/><path d="M-6 -16 h12 M-6 -10 h12 M-6 -4 h8" stroke="${INK}" stroke-width="1.6" opacity=".6"/><path d="M-7 -19 l2 2 l4 -4" stroke="#16A34A" stroke-width="2" fill="none"/>`;
    case "flask": return `<path d="M-5 -30 V-16 L-16 6 Q-18 12 -12 12 H12 Q18 12 16 6 L5 -16 V-30Z" fill="#fff" fill-opacity=".85" ${O}/><path d="M-13 2 L-7 -10 H7 L13 2 Q14 8 10 8 H-10 Q-14 8 -13 2Z" fill="${a}"/><circle cx="-2" cy="-6" r="2" fill="#fff"><animate attributeName="cy" values="-2;-26;-2" dur="1.8s" repeatCount="indefinite"/></circle>`;
    case "droplet": return `<path d="M0 -34 Q16 -10 12 2 Q8 12 0 12 Q-8 12 -12 2 Q-16 -10 0 -34Z" fill="${a}" ${O}/><text x="-1" y="-1" font-size="9" font-weight="900" text-anchor="middle" fill="#0369A1" font-family="sans-serif">δ+</text>`;
    case "mask": return `<path d="M-16 -24 Q0 -32 16 -24 Q16 0 0 6 Q-16 0 -16 -24Z" fill="${a}" ${O}/><ellipse cx="-6" cy="-16" rx="4" ry="3" fill="${INK}"/><ellipse cx="6" cy="-16" rx="4" ry="3" fill="${INK}"/><path d="M-6 -6 Q0 -2 6 -6" stroke="${INK}" stroke-width="2" fill="none"/><path d="M0 6 V24" stroke="#78350F" stroke-width="3"/>`;
    case "bolt": return `<path d="M4 -36 L-10 -6 H0 L-6 18 L12 -14 H2Z" fill="${a}" ${O}><animate attributeName="opacity" values="1;.4;1" dur=".8s" repeatCount="indefinite"/></path>`;
    case "sword": return `<path d="M-2 18 V-44 L2 -50 L6 -44 V18Z" fill="#E5E7EB" ${O}/><path d="M-10 10 H14" stroke="${a}" stroke-width="5" stroke-linecap="round"/><path d="M2 12 V26" stroke="#78350F" stroke-width="5" stroke-linecap="round"/>`;
    case "dna": return `<g stroke-width="3" fill="none"><path d="M-8 18 C10 8 -10 -6 8 -16 C-10 -26 8 -36 -6 -46" stroke="${a}"/><path d="M8 18 C-10 8 10 -6 -8 -16 C10 -26 -8 -36 6 -46" stroke="#F472B6"/></g><g stroke="${INK}" stroke-width="1.6" opacity=".5"><path d="M-4 10 H4 M-4 -10 H4 M-3 -30 H3"/></g>`;
    case "orb": return `<path d="M0 26 V-14" stroke="#78350F" stroke-width="4"/><circle cx="0" cy="-24" r="12" fill="${a}" ${O}><animate attributeName="opacity" values=".7;1;.7" dur="1.4s" repeatCount="indefinite"/></circle><circle cx="-4" cy="-28" r="3" fill="#fff" opacity=".8"/>`;
    case "staff": return `<path d="M0 30 V-40" stroke="#78350F" stroke-width="5" stroke-linecap="round"/><path d="M0 -40 Q-14 -50 -6 -60 Q0 -48 0 -40 Q14 -50 6 -60" fill="none" stroke="${a}" stroke-width="3"/>`;
    case "atom": return `<g fill="none" stroke="${a}" stroke-width="2.4"><ellipse cx="0" cy="-16" rx="20" ry="7"/><ellipse cx="0" cy="-16" rx="20" ry="7" transform="rotate(60 0 -16)"/><ellipse cx="0" cy="-16" rx="20" ry="7" transform="rotate(-60 0 -16)"/></g><circle cx="0" cy="-16" r="4" fill="#F472B6"/><circle cx="20" cy="-16" r="2.6" fill="#fff"><animateTransform attributeName="transform" type="rotate" from="0 0 -16" to="360 0 -16" dur="1.6s" repeatCount="indefinite"/></circle>`;
    case "hammer": return `<path d="M0 22 V-26" stroke="#78350F" stroke-width="5" stroke-linecap="round"/><rect x="-16" y="-38" width="32" height="16" rx="3" fill="#9CA3AF" ${O}/>`;
    case "torch": return `<path d="M-5 -6 H5 L2 24 H-2Z" fill="#78350F" ${O}/><path d="M0 -40 Q14 -24 8 -12 Q4 -6 0 -6 Q-4 -6 -8 -12 Q-14 -24 0 -40Z" fill="#F97316"><animateTransform attributeName="transform" type="scale" values="1 1;1.08 .92;1 1" dur=".9s" repeatCount="indefinite"/></path><path d="M0 -28 Q6 -20 3 -14 Q0 -11 -3 -14 Q-6 -20 0 -28Z" fill="#FDE047"/>`;
    case "thermo": return `<rect x="-5" y="-40" width="10" height="44" rx="5" fill="#fff" ${O}/><circle cx="0" cy="8" r="9" fill="#EF4444" ${O}/><rect x="-2" y="-26" width="4" height="30" fill="#EF4444"><animate attributeName="y" values="-14;-32;-14" dur="2s" repeatCount="indefinite"/></rect>`;
    case "scale": return `<path d="M0 20 V-36" stroke="${a}" stroke-width="4"/><g><animateTransform attributeName="transform" type="rotate" values="-8 0 -34;8 0 -34;-8 0 -34" dur="2.4s" repeatCount="indefinite"/><path d="M-22 -34 H22" stroke="${a}" stroke-width="4" stroke-linecap="round"/><path d="M-30 -18 Q-22 -10 -14 -18Z M14 -18 Q22 -10 30 -18Z" fill="${a}" ${O}/><path d="M-22 -34 L-30 -18 M-22 -34 L-14 -18 M22 -34 L14 -18 M22 -34 L30 -18" stroke="${INK}" stroke-width="1" opacity=".6"/></g>`;
    case "gear": return `<g><animateTransform attributeName="transform" type="rotate" from="0 0 -14" to="360 0 -14" dur="5s" repeatCount="indefinite"/>${[0,1,2,3,4,5].map(i=>`<rect x="-4" y="-34" width="8" height="10" fill="${a}" transform="rotate(${i*60} 0 -14)"/>`).join("")}<circle cx="0" cy="-14" r="14" fill="${a}" ${O}/><circle cx="0" cy="-14" r="5" fill="${INK}"/></g>`;
    case "book": return `<path d="M-18 -26 Q-9 -30 0 -26 Q9 -30 18 -26 V4 Q9 0 0 4 Q-9 0 -18 4Z" fill="${a}" ${O}/><path d="M0 -26 V4" stroke="${INK}" stroke-width="1.6"/><path d="M-14 -18 H-4 M-14 -12 H-4 M4 -18 H14 M4 -12 H14" stroke="#fff" stroke-width="1.6" opacity=".8"/>`;
    case "flag": return `<path d="M0 26 V-46" stroke="#78350F" stroke-width="4"/><path d="M0 -46 Q14 -52 28 -44 Q20 -36 28 -26 Q14 -32 0 -26Z" fill="${a}" ${O}><animate attributeName="d" values="M0 -46 Q14 -52 28 -44 Q20 -36 28 -26 Q14 -32 0 -26Z;M0 -46 Q14 -40 28 -46 Q22 -36 28 -28 Q14 -22 0 -26Z;M0 -46 Q14 -52 28 -44 Q20 -36 28 -26 Q14 -32 0 -26Z" dur="1.8s" repeatCount="indefinite"/></path>`;
    case "shield": return `<path d="M-18 -30 H18 V-8 Q18 12 0 20 Q-18 12 -18 -8Z" fill="${a}" ${O}/><path d="M-10 -22 H10 V-8 Q10 4 0 10 Q-10 4 -10 -8Z" fill="#fff" opacity=".35"/>`;
    case "scroll": return `<rect x="-14" y="-34" width="28" height="36" fill="#FEF3C7" ${O}/><rect x="-18" y="-38" width="36" height="7" rx="3.5" fill="${a}" ${O}/><rect x="-18" y="0" width="36" height="7" rx="3.5" fill="${a}" ${O}/><path d="M-8 -24 H8 M-8 -18 H8 M-8 -12 H4" stroke="#92400E" stroke-width="1.6" opacity=".6"/>`;
    case "bomb": return `<circle cx="0" cy="-12" r="14" fill="#1F2937" ${O}/><path d="M6 -24 Q12 -34 18 -32" stroke="#A16207" stroke-width="2.4" fill="none"/><circle cx="19" cy="-33" r="3" fill="#F97316"><animate attributeName="r" values="2;4;2" dur=".5s" repeatCount="indefinite"/></circle><circle cx="-5" cy="-17" r="3" fill="#fff" opacity=".4"/>`;
    case "box": return `<path d="M-16 -22 L0 -30 L16 -22 V0 L0 8 L-16 0Z" fill="#D97706" ${O}/><path d="M-16 -22 L0 -14 L16 -22 M0 -14 V8" stroke="${INK}" stroke-width="1.6" fill="none" opacity=".6"/><path d="M-8 -26 L8 -18" stroke="#FEF3C7" stroke-width="3"/>`;
    case "gavel": return `<path d="M0 20 V-18" stroke="#78350F" stroke-width="5" stroke-linecap="round"/><rect x="-16" y="-32" width="32" height="14" rx="5" fill="#92400E" ${O}/><path d="M-12 -32 V-18 M12 -32 V-18" stroke="${a}" stroke-width="2.4"/>`;
    case "redpen": return `<g transform="rotate(20)"><rect x="-6" y="-44" width="12" height="52" rx="5" fill="#DC2626" ${O}/><path d="M-6 8 L0 22 L6 8Z" fill="#FECACA" ${O}/><rect x="-6" y="-44" width="12" height="10" rx="4" fill="#991B1B"/></g>`;
    case "bell": return `<path d="M0 22 V12" stroke="#78350F" stroke-width="4"/><path d="M-16 -2 Q-16 -30 0 -30 Q16 -30 16 -2 L20 6 H-20Z" fill="${a}" ${O}><animateTransform attributeName="transform" type="rotate" values="-10 0 -30;10 0 -30;-10 0 -30" dur=".8s" repeatCount="indefinite"/></path>`;
    case "mirror": return `<ellipse cx="0" cy="-20" rx="14" ry="18" fill="#BFDBFE" stroke="${a}" stroke-width="4"/><path d="M-6 -30 Q-2 -34 4 -32" stroke="#fff" stroke-width="3" fill="none"/><path d="M0 -2 V22" stroke="${a}" stroke-width="5" stroke-linecap="round"/>`;
    case "hourglass": return `<rect x="-14" y="-40" width="28" height="5" rx="2" fill="${a}" ${O}/><rect x="-14" y="2" width="28" height="5" rx="2" fill="${a}" ${O}/><path d="M-10 -35 H10 Q10 -24 0 -17 Q10 -10 10 2 H-10 Q-10 -10 0 -17 Q-10 -24 -10 -35Z" fill="#E0F2FE" ${O}/><path d="M-7 -31 H7 Q5 -24 0 -20 Q-5 -24 -7 -31Z" fill="#FBBF24"/>`;
    case "dice": return `<rect x="-14" y="-32" width="26" height="26" rx="5" fill="#fff" ${O}><animateTransform attributeName="transform" type="rotate" values="0 -1 -19;90 -1 -19;90 -1 -19;0 -1 -19" dur="2.4s" repeatCount="indefinite"/></rect>${[[-7,-25],[5,-13],[-1,-19]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.6" fill="${INK}"/>`).join("")}`;
    case "scepter": return `<path d="M0 26 V-30" stroke="#FBBF24" stroke-width="5"/><circle cx="0" cy="-36" r="9" fill="${a}" ${O}/><path d="M-8 -44 L0 -54 L8 -44" fill="#FBBF24" ${O}/>`;
    case "fan": return `<path d="M0 6 L-24 -26 Q0 -44 24 -26Z" fill="${a}" ${O}/><g stroke="${INK}" stroke-width="1" opacity=".5"><path d="M0 6 L-14 -34 M0 6 L0 -38 M0 6 L14 -34"/></g><path d="M0 6 V20" stroke="#78350F" stroke-width="3"/>`;
    case "skull": return `<path d="M-14 -16 Q-14 -34 0 -34 Q14 -34 14 -16 Q14 -8 8 -6 V2 H-8 V-6 Q-14 -8 -14 -16Z" fill="#F8FAFC" ${O}/><circle cx="-5" cy="-18" r="4" fill="${INK}"/><circle cx="5" cy="-18" r="4" fill="${INK}"/><path d="M-4 -2 V2 M0 -2 V2 M4 -2 V2" stroke="${INK}" stroke-width="1.4"/>`;
    case "quill": return `<path d="M-4 18 Q-2 -14 18 -46 Q4 -20 2 18Z" fill="#fff" ${O}/><path d="M-1 16 Q2 -14 16 -42" stroke="${INK}" stroke-width="1.4" fill="none"/><circle cx="-4" cy="22" r="3" fill="${INK}"><animate attributeName="cy" values="22;30;22" dur="1.6s" repeatCount="indefinite"/></circle>`;
    case "mic": return `<path d="M0 24 V-6" stroke="#475569" stroke-width="4"/><rect x="-9" y="-32" width="18" height="28" rx="9" fill="${a}" ${O}/><path d="M-9 -22 H9 M-9 -16 H9" stroke="${INK}" stroke-width="1.4" opacity=".5"/>`;
    case "question": return `<path d="M0 26 V-14" stroke="#78350F" stroke-width="4"/><text x="0" y="-16" font-size="40" font-weight="900" text-anchor="middle" fill="${a}" stroke="${INK}" stroke-width="1.6" font-family="sans-serif">?<animateTransform attributeName="transform" type="rotate" values="-12 0 -28;12 0 -28;-12 0 -28" dur="1.6s" repeatCount="indefinite"/></text>`;
    case "mail": return `<rect x="-18" y="-28" width="36" height="24" rx="3" fill="#fff" ${O}/><path d="M-18 -28 L0 -14 L18 -28" fill="none" stroke="${INK}" stroke-width="1.6"/><circle cx="14" cy="-28" r="7" fill="#EF4444"/><text x="14" y="-24.5" font-size="9" font-weight="900" text-anchor="middle" fill="#fff" font-family="sans-serif">99</text>`;
    default: return "";
  }
};
const hatSVG = (k, s) => {
  const a = s.ac, oc = s.oc;
  switch (k) {
    case "tophat": return `<rect x="62" y="12" width="36" height="26" rx="2" fill="#111827" ${O}/><rect x="54" y="36" width="52" height="7" rx="3" fill="#111827" ${O}/><rect x="62" y="30" width="36" height="5" fill="${a}"/>`;
    case "bowler": return `<path d="M62 38 Q62 16 80 16 Q98 16 98 38Z" fill="#1F2937" ${O}/><rect x="54" y="36" width="52" height="6" rx="3" fill="#1F2937" ${O}/>`;
    case "crown": return `<path d="M60 36 L62 16 L71 28 L80 12 L89 28 L98 16 L100 36Z" fill="#FBBF24" ${O}/><circle cx="80" cy="26" r="3" fill="#DC2626"/><circle cx="68" cy="31" r="2" fill="#3B82F6"/><circle cx="92" cy="31" r="2" fill="#3B82F6"/>`;
    case "kepi": return `<path d="M60 38 V22 Q80 16 100 22 V38Z" fill="${oc}" ${O}/><path d="M56 38 H96 L104 44 H60Z" fill="#111827"/><circle cx="80" cy="28" r="3.4" fill="${a}"/>`;
    case "morion": return `<path d="M50 40 Q56 18 80 18 Q104 18 110 40 Q96 34 80 34 Q64 34 50 40Z" fill="#CBD5E1" ${O}/><path d="M66 22 Q80 2 94 22" fill="#CBD5E1" ${O}/>`;
    case "tricorn": return `<path d="M50 36 Q60 20 80 18 Q100 20 110 36 Q96 30 80 34 Q64 30 50 36Z" fill="#111827" ${O}/><path d="M56 34 Q80 42 104 34" stroke="${a}" stroke-width="2.4" fill="none"/>`;
    case "planter": return `<ellipse cx="80" cy="36" rx="38" ry="7" fill="#F5F5F4" ${O}/><path d="M64 36 Q64 18 80 18 Q96 18 96 36Z" fill="#F5F5F4" ${O}/><rect x="64" y="30" width="32" height="5" fill="${a}"/>`;
    case "brodie": return `<path d="M52 38 Q56 16 80 16 Q104 16 108 38Z" fill="#4D7C0F" ${O}/><ellipse cx="80" cy="38" rx="34" ry="5" fill="#3F6212" ${O}/>`;
    case "fur": return `<path d="M56 40 Q54 14 80 14 Q106 14 104 40Z" fill="#78350F" ${O}/><rect x="54" y="32" width="52" height="12" rx="6" fill="#A16207" ${O}/><circle cx="80" cy="26" r="4" fill="${a}"/>`;
    case "turban": return `<path d="M56 40 Q52 12 80 12 Q108 12 104 40Z" fill="#F8FAFC" ${O}/><path d="M58 30 Q80 18 102 30 M58 36 Q80 24 102 36" stroke="#CBD5E1" stroke-width="2" fill="none"/><ellipse cx="80" cy="24" rx="5" ry="6" fill="${a}" ${O}/><path d="M80 18 Q86 6 82 2" stroke="${a}" stroke-width="2.4" fill="none"/>`;
    case "scarf": return `<path d="M56 46 Q54 16 80 14 Q106 16 104 46 L100 58 Q80 48 60 58Z" fill="#D97706" ${O}/><path d="M100 44 Q114 60 106 76" stroke="#D97706" stroke-width="7" fill="none" stroke-linecap="round"/>`;
    case "phrygian": return `<path d="M58 40 Q56 14 82 12 Q106 10 102 26 Q98 22 92 26 L102 40Z" fill="#DC2626" ${O}/><circle cx="72" cy="34" r="4" fill="#fff"/><circle cx="72" cy="34" r="2" fill="#2563EB"/>`;
    case "nemes": return `<path d="M54 64 Q50 24 80 18 Q110 24 106 64 L112 92 H96 L94 60 Q80 66 66 60 L64 92 H48Z" fill="#FBBF24" ${O}/><g stroke="#1E3A8A" stroke-width="3" fill="none"><path d="M56 40 Q80 30 104 40 M56 50 Q80 40 104 50 M52 70 H64 M96 70 H108 M50 80 H64 M96 80 H110"/></g><path d="M74 24 Q80 14 86 24" fill="#1E3A8A"/>`;
    case "jester": return `<path d="M60 40 Q52 18 34 22 Q48 28 50 40Z" fill="${a}" ${O}/><path d="M100 40 Q108 18 126 22 Q112 28 110 40Z" fill="${oc}" ${O}/><path d="M58 40 Q80 14 102 40Z" fill="${oc}" ${O}/><circle cx="34" cy="22" r="4" fill="#FBBF24" ${O}/><circle cx="126" cy="22" r="4" fill="#FBBF24" ${O}/>`;
    case "farmer": return `<ellipse cx="80" cy="36" rx="36" ry="7" fill="#EAB308" ${O}/><path d="M64 36 Q66 18 80 18 Q94 18 96 36Z" fill="#EAB308" ${O}/><rect x="64" y="30" width="32" height="5" fill="${a}"/>`;
    case "helmet": return `<path d="M54 50 Q54 16 80 16 Q106 16 106 50 L100 52 Q100 30 80 30 Q60 30 60 52Z" fill="#94A3B8" ${O}/><path d="M80 16 V8" stroke="${a}" stroke-width="5" stroke-linecap="round"/>`;
    default: return "";
  }
};
const hairBack = (s) => { const c = s.hc || "#1F2937";
  switch (s.hair) {
    case "long": return `<path d="M56 50 Q52 24 80 22 Q108 24 104 50 L110 104 Q96 96 92 82 H68 Q64 96 50 104Z" fill="${c}" ${O}/>`;
    case "ink": return `<path d="M56 50 Q52 24 80 22 Q108 24 104 50 L108 96 Q102 108 96 98 Q92 90 92 82 H68 Q68 92 62 100 Q56 108 52 96Z" fill="${c}" ${O}/>${[60,100].map(x=>`<circle cx="${x}" cy="108" r="3" fill="${c}"><animate attributeName="cy" values="104;118;104" dur="${x===60?2:2.6}s" repeatCount="indefinite"/></circle>`).join("")}`;
    case "tentacles": return [52,62,98,108].map((x,i)=>`<path d="M${x} 54 Q${x+(i<2?-10:10)} 80 ${x+(i<2?-4:4)} 104" stroke="${c}" stroke-width="8" fill="none" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" values="-4 ${x} 54;4 ${x} 54;-4 ${x} 54" dur="${2+i*.3}s" repeatCount="indefinite"/></path>`).join("");
    case "snakes": return [50,58,102,110].map((x,i)=>`<path d="M${x+(i<2?8:-8)} 44 Q${x-(i<2?12:-12)} 60 ${x} 80" stroke="${c}" stroke-width="7" fill="none" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" values="-6 ${x} 44;6 ${x} 44;-6 ${x} 44" dur="${1.6+i*.2}s" repeatCount="indefinite"/></path><circle cx="${x}" cy="80" r="4.4" fill="${c}"/>`).join("");
    case "pony": return `<path d="M98 36 Q118 44 112 80 Q106 66 100 56Z" fill="${c}" ${O}/>`;
    default: return "";
  }
};
const hairFront = (s) => { const c = s.hc || "#1F2937";
  switch (s.hair) {
    case "long": case "ink": case "pony": case "bob": case "tentacles": return `<path d="M58 46 Q58 24 80 24 Q102 24 102 46 Q92 34 80 36 Q68 34 58 46Z" fill="${c}" ${O}/>` + (s.hair === "bob" ? `<path d="M58 44 Q54 62 60 70 L64 50Z M102 44 Q106 62 100 70 L96 50Z" fill="${c}" ${O}/>` : "");
    case "bun": return `<circle cx="80" cy="20" r="10" fill="${c}" ${O}/><path d="M58 46 Q58 26 80 26 Q102 26 102 46 Q92 36 80 36 Q68 36 58 46Z" fill="${c}" ${O}/>`;
    case "spiky": return `<path d="M58 44 L56 24 L66 32 L68 16 L76 30 L82 12 L88 30 L96 18 L96 32 L106 26 L102 44 Q80 34 58 44Z" fill="${c}" ${O}/>`;
    case "slick": return `<path d="M58 44 Q58 24 80 24 Q104 24 102 42 Q92 30 76 34 Q64 36 58 44Z" fill="${c}" ${O}/>`;
    case "mohawk": return `<path d="M72 34 L74 10 L80 18 L84 8 L88 34Z" fill="${c}" ${O}/>`;
    case "flame": return `<path d="M58 44 Q54 20 68 24 Q66 8 80 6 Q78 20 88 14 Q96 22 92 28 Q106 24 102 44 Q80 32 58 44Z" fill="${c}" ${O}><animateTransform attributeName="transform" type="scale" values="1 1;1 1.06;1 1" dur=".8s" repeatCount="indefinite" additive="sum"/></path>`;
    case "straw": return `<g stroke="${c}" stroke-width="2.6" stroke-linecap="round">${[56,62,98,104].map((x,i)=>`<path d="M${x} 44 L${x+(i<2?-8:8)} ${56+i%2*6}"/>`).join("")}</g>`;
    case "drip": return `<path d="M58 46 Q58 24 80 24 Q102 24 102 46 L100 56 Q98 50 96 56 Q94 46 90 42 Q80 36 70 42 Q66 46 64 56 Q62 50 60 56Z" fill="${c}" ${O}/>`;
    default: return "";
  }
};
const feat = (f, s, st) => {
  const has = k => (s.f || []).includes(k), a = s.ac, out = [];
  if (has("horns")) out.push(`<path d="M62 34 Q48 18 54 6 Q58 22 70 28Z M98 34 Q112 18 106 6 Q102 22 90 28Z" fill="${shade(s.sk, -.45)}" ${O}/>`);
  if (has("ears")) out.push(`<path d="M58 54 L44 40 L60 62Z M102 54 L116 40 L100 62Z" fill="${s.sk}" ${O}/>`);
  if (has("fins")) out.push(`<path d="M58 52 L42 46 L50 60 L58 62Z M102 52 L118 46 L110 60 L102 62Z" fill="${shade(s.sk, -.25)}" ${O}/>`);
  if (has("antennae")) out.push(`<path d="M70 32 Q62 14 54 12 M90 32 Q98 14 106 12" stroke="${INK}" stroke-width="2.4" fill="none"/><circle cx="54" cy="12" r="4" fill="${a}"/><circle cx="106" cy="12" r="4" fill="${a}"/>`);
  if (has("crest")) out.push(`<path d="M64 30 L70 14 L76 28 L82 10 L88 28 L96 16 L96 32Z" fill="${shade(s.sk, -.3)}" ${O}/>`);
  if (has("spines")) out.push(`<path d="M62 32 L66 18 L72 30 L80 14 L88 30 L94 18 L98 32Z" fill="${shade(s.sk, -.35)}" ${O}/>`);
  return out.join("");
};
const faceFeat = (s, st) => {
  const has = k => (s.f || []).includes(k), a = s.ac, out = [], sk = s.sk;
  if (has("cracks")) out.push(`<path d="M66 40 L72 48 L68 54 M94 64 L88 70 L92 76" stroke="${shade(sk, -.4)}" stroke-width="1.8" fill="none"/>`);
  if (has("spots")) out.push(`<circle cx="66" cy="42" r="3" fill="${shade(sk, -.25)}"/><circle cx="96" cy="68" r="2.4" fill="${shade(sk, -.25)}"/><circle cx="92" cy="40" r="2" fill="${shade(sk, -.25)}"/>`);
  if (has("scales")) out.push(`<path d="M62 64 q3 -3 6 0 q3 -3 6 0 M86 64 q3 -3 6 0 q3 -3 6 0" stroke="${shade(sk, -.35)}" stroke-width="1.4" fill="none"/>`);
  if (has("gears")) out.push(`<circle cx="96" cy="40" r="6" fill="none" stroke="${a}" stroke-width="2.4" stroke-dasharray="3 2"><animateTransform attributeName="transform" type="rotate" from="0 96 40" to="360 96 40" dur="4s" repeatCount="indefinite"/></circle>`);
  if (has("twoface")) out.push(`<path d="M80 26 Q104 28 104 56 Q102 80 80 82Z" fill="${a}" opacity=".55"/>`);
  if (has("glitch")) out.push(`<rect x="60" y="44" width="16" height="3" fill="${a}" opacity=".8"><animate attributeName="x" values="60;66;58;60" dur=".6s" repeatCount="indefinite"/></rect><rect x="86" y="70" width="12" height="3" fill="#F472B6" opacity=".8"/>`);
  if (has("drip")) out.push(`<path d="M70 80 q-2 8 0 10 q2 -2 0 -10Z M92 80 q-2 6 0 8 q2 -2 0 -8Z" fill="${shade(sk, -.2)}"><animateTransform attributeName="transform" type="translate" values="0 0;0 4;0 0" dur="1.6s" repeatCount="indefinite"/></path>`);
  if (has("stitch")) out.push(`<path d="M68 72 H92" stroke="${INK}" stroke-width="1.6"/><path d="M70 69 V75 M76 69 V75 M82 69 V75 M88 69 V75" stroke="${INK}" stroke-width="1.4"/>`);
  if (has("thirdeye")) out.push(`<ellipse cx="80" cy="40" rx="5" ry="3.4" fill="#fff" ${O}/><circle cx="80" cy="40" r="2" fill="${a}"/>`);
  return out.join("");
};
const eyes = (s, st) => {
  const has = k => (s.f || []).includes(k), glow = has("glow") || has("inkeyes"), ey = s.ey || (glow ? s.ac : "#fff");
  const L = [70, 54], R = [90, 54];
  if (st === "defeat") return `<path d="M65 49 l10 10 M75 49 l-10 10 M85 49 l10 10 M95 49 l-10 10" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
  if (has("compound")) return `<ellipse cx="69" cy="53" rx="9" ry="8" fill="#DC2626" ${O}/><ellipse cx="91" cy="53" rx="9" ry="8" fill="#DC2626" ${O}/><path d="M64 50 h10 M86 50 h10 M64 55 h10 M86 55 h10" stroke="#7F1D1D" stroke-width="1" opacity=".6"/>`;
  if (has("eyestalk")) return `<path d="M68 46 V36 M92 46 V36" stroke="${s.sk}" stroke-width="6"/><circle cx="68" cy="34" r="7" fill="#fff" ${O}/><circle cx="92" cy="34" r="7" fill="#fff" ${O}/><circle cx="70" cy="34" r="3" fill="${INK}"><animateTransform attributeName="transform" type="translate" values="0 0;-3 1;0 0" dur="2.2s" repeatCount="indefinite"/></circle><circle cx="90" cy="34" r="3" fill="${INK}"><animateTransform attributeName="transform" type="translate" values="0 0;3 -1;0 0" dur="1.7s" repeatCount="indefinite"/></circle>`;
  const squint = st === "hurt" || st === "crit";
  const one = ([x, y], i) => {
    if (has("mismatch") && i === 1) return `<circle cx="${x}" cy="${y}" r="7.5" fill="#fff" ${O}/><circle cx="${x+1}" cy="${y}" r="3.6" fill="${INK}"/>`;
    if (squint) return `<path d="M${x-6} ${y-2} L${x+6} ${y+2} M${x-6} ${y+3} L${x+6} ${y+1}" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`;
    if (glow) return `<ellipse cx="${x}" cy="${y}" rx="6" ry="4.4" fill="${ey}"/><ellipse cx="${x}" cy="${y}" rx="9" ry="7" fill="${ey}" opacity=".25"/>`;
    return `<ellipse cx="${x}" cy="${y}" rx="5.6" ry="${s.g === "f" ? 5.2 : 4.4}" fill="#fff" ${O}/><circle cx="${x + (i ? -1 : 1)}" cy="${y + .5}" r="2.8" fill="${s.ey && !glow ? s.ey : INK}"/>` + (s.g === "f" ? `<path d="M${x-6} ${y-4} l-3 -3 M${x+6} ${y-4} l3 -3" stroke="${INK}" stroke-width="1.6"/>` : "");
  };
  const lids = squint || glow ? "" : `<g class="bs-blink"><rect x="62" y="47" width="16" height="11" rx="5" fill="${s.sk}"/><rect x="82" y="47" width="16" height="11" rx="5" fill="${s.sk}"/></g>`;
  const brows = st === "win" ? `<path d="M62 44 Q70 40 76 44 M84 44 Q90 40 98 44" stroke="${INK}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`
    : `<path d="M61 42 L77 47 M99 42 L83 47" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
  let extra = "";
  if (has("eyeliner")) extra += `<path d="M62 54 L56 50 M98 54 L104 50" stroke="${INK}" stroke-width="2.4"/>`;
  return (has("sunken") ? `<ellipse cx="70" cy="54" rx="9" ry="8" fill="${shade(s.sk, -.3)}" opacity=".6"/><ellipse cx="90" cy="54" rx="9" ry="8" fill="${shade(s.sk, -.3)}" opacity=".6"/>` : "") + one(L, 0) + one(R, 1) + lids + brows + extra;
};
const accessories = (s) => {
  const has = k => (s.f || []).includes(k), a = s.ac, out = [];
  if (has("glasses")) out.push(`<circle cx="70" cy="54" r="8" fill="none" stroke="${INK}" stroke-width="2.2"/><circle cx="90" cy="54" r="8" fill="none" stroke="${INK}" stroke-width="2.2"/><path d="M78 54 H82" stroke="${INK}" stroke-width="2.2"/>`);
  if (has("monocle")) out.push(`<circle cx="90" cy="54" r="8.5" fill="#fff" fill-opacity=".2" stroke="#FBBF24" stroke-width="2.4"/><path d="M98 56 Q102 70 96 80" stroke="#FBBF24" stroke-width="1.4" fill="none"/>`);
  if (has("goggles")) out.push(`<rect x="58" y="44" width="44" height="6" fill="${INK}"/><circle cx="70" cy="54" r="9" fill="#BAE6FD" fill-opacity=".5" stroke="${INK}" stroke-width="3"/><circle cx="90" cy="54" r="9" fill="#BAE6FD" fill-opacity=".5" stroke="${INK}" stroke-width="3"/>`);
  if (has("bandit")) out.push(`<path d="M56 48 Q80 42 104 48 L104 60 Q80 56 56 60Z" fill="${INK}" opacity=".9"/><path d="M104 52 L114 48 M104 56 L114 60" stroke="${INK}" stroke-width="3"/>`);
  if (has("halfmask")) out.push(`<path d="M80 40 Q104 40 104 54 Q104 66 80 68Z" fill="#F8FAFC" ${O}/><ellipse cx="90" cy="54" rx="5" ry="4" fill="${INK}"/>`);
  if (has("venetian")) out.push(`<path d="M58 50 Q70 42 80 50 Q90 42 102 50 Q100 62 90 62 Q84 62 80 56 Q76 62 70 62 Q60 62 58 50Z" fill="${a}" ${O}/><path d="M102 48 Q112 30 118 22" stroke="#EC4899" stroke-width="3" fill="none"/>`);
  if (has("blindfold")) out.push(`<rect x="56" y="48" width="48" height="10" fill="${a}" ${O}/><path d="M104 52 L114 60 M104 54 L112 66" stroke="${a}" stroke-width="4"/>`);
  if (has("gasmask")) out.push(`<path d="M62 62 Q80 52 98 62 Q100 80 80 84 Q60 80 62 62Z" fill="#57534E" ${O}/><circle cx="80" cy="76" r="7" fill="#A8A29E" ${O}/>`);
  if (has("crossed")) out.push(`<g class="bs-say"><path d="M104 18 H150 Q154 18 154 22 V36 Q154 40 150 40 H118 L110 48 L112 40 H104 Q100 40 100 36 V22 Q100 18 104 18Z" fill="#fff" ${O}/><text x="127" y="33" text-anchor="middle" font-size="10" font-weight="800" fill="${INK}" font-family="sans-serif">Trust me!</text></g>`);
  return out.join("");
};
const mouth = (s, st) => {
  const has = k => (s.f || []).includes(k), out = [];
  if (has("gasmask")) return "";
  if (has("beard")) out.push(`<path d="M62 66 Q64 92 80 98 Q96 92 98 66 Q80 76 62 66Z" fill="${s.hc || "#E5E7EB"}" ${O}/>`);
  if (has("tentbeard")) out.push([66,74,82,90].map((x,i)=>`<path d="M${x} 70 Q${x-4+i*2} 86 ${x} 98" stroke="${shade(s.sk, -.25)}" stroke-width="5" fill="none" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" values="-6 ${x} 70;6 ${x} 70;-6 ${x} 70" dur="${1.4+i*.2}s" repeatCount="indefinite"/></path>`).join(""));
  const open = st === "attack" || st === "win";
  if (st === "defeat" || st === "hurt" || st === "crit") out.push(`<path d="M70 ${open?74:76} Q80 68 90 76" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`);
  else if (open) out.push(`<path d="M68 68 Q80 64 92 68 Q90 84 80 84 Q70 84 68 68Z" fill="#7F1D1D" ${O}/><path d="M71 69 l2 5 l2 -5 M85 69 l2 5 l2 -5" fill="#fff"/>`);
  else out.push(`<path d="M68 70 Q80 ${has("grin") ? 82 : 76} 92 70" stroke="${INK}" stroke-width="3" fill="${has("grin") ? "#7F1D1D" : "none"}" stroke-linecap="round"/>`);
  if (has("fangs") && st !== "defeat") out.push(`<path d="M72 71 l2 6 l2 -5 M84 71 l2 5 l2 -6" fill="#fff" ${O}/>`);
  if (has("tusks") && st !== "defeat") out.push(`<path d="M68 70 Q64 60 66 56 Q70 64 72 70Z M92 70 Q96 60 94 56 Q90 64 88 70Z" fill="#FEF3C7" ${O}/>`);
  if (has("mustache")) out.push(`<path d="M66 66 Q74 60 80 64 Q86 60 94 66 Q86 70 80 67 Q74 70 66 66Z" fill="${s.hc || "#1F2937"}" ${O}/>`);
  if (has("bowtie")) out.push(`<path d="M70 92 L80 96 L90 92 V102 L80 98 L70 102Z" fill="${s.ac}" ${O}/>`);
  return out.join("");
};
const back = (s) => {
  const x = s.x || [], a = s.ac, out = [];
  if (x.includes("aura")) out.push(`<ellipse class="bs-aura" cx="80" cy="96" rx="68" ry="76" fill="${s.ey || a}" opacity=".18"/>`);
  if (x.includes("cape")) out.push(`<path d="M54 84 Q40 130 34 168 H126 Q120 130 106 84Z" fill="${shade(s.oc, -.35)}" ${O}/>`);
  if (x.includes("batwings")) out.push(`<g class="bs-wings"><path d="M58 92 Q20 60 8 82 Q22 84 18 96 Q30 92 32 106 Q44 96 58 104Z" fill="${shade(s.sk, -.35)}" ${O}/><path d="M102 92 Q140 60 152 82 Q138 84 142 96 Q130 92 128 106 Q116 96 102 104Z" fill="${shade(s.sk, -.35)}" ${O}/></g>`);
  if (x.includes("birdwings")) out.push(`<g class="bs-wings"><path d="M58 94 Q24 70 14 100 Q30 98 26 112 Q42 104 58 108Z" fill="#FBBF24" ${O}/><path d="M102 94 Q136 70 146 100 Q130 98 134 112 Q118 104 102 108Z" fill="#FBBF24" ${O}/></g>`);
  if (x.includes("bugwings")) out.push(`<g class="bs-wings" opacity=".75"><ellipse cx="44" cy="88" rx="28" ry="12" fill="#E0F2FE" transform="rotate(-24 44 88)" ${O}/><ellipse cx="116" cy="88" rx="28" ry="12" fill="#E0F2FE" transform="rotate(24 116 88)" ${O}/></g>`);
  if (x.includes("tail")) out.push(`<path d="M96 150 Q140 160 146 130 Q150 118 140 116" fill="none" stroke="${shade(s.sk, -.15)}" stroke-width="9" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" values="-5 96 150;6 96 150;-5 96 150" dur="2.2s" repeatCount="indefinite"/></path><path d="M136 112 L148 108 L144 120Z" fill="${shade(s.sk, -.35)}"/>`);
  if (x.includes("liontail")) out.push(`<path d="M96 150 Q140 156 140 124" fill="none" stroke="#F59E0B" stroke-width="7" stroke-linecap="round"/><circle cx="140" cy="120" r="7" fill="#B45309"/>`);
  if (x.includes("snaketail")) out.push(`<path d="M90 160 Q130 172 140 150 Q148 132 128 132" fill="none" stroke="${s.sk}" stroke-width="12" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" values="-4 90 160;5 90 160;-4 90 160" dur="2s" repeatCount="indefinite"/></path>`);
  if (x.includes("heads")) out.push([[34,70,-20],[126,70,20]].map(([cx,cy,r])=>`<g transform="rotate(${r} ${cx} ${cy+30})"><path d="M${cx} ${cy+40} Q${cx} ${cy+20} ${cx} ${cy+10}" stroke="${s.sk}" stroke-width="10"/><ellipse cx="${cx}" cy="${cy}" rx="13" ry="11" fill="${s.sk}" ${O}/><circle cx="${cx-4}" cy="${cy-2}" r="2.4" fill="${INK}"/><circle cx="${cx+4}" cy="${cy-2}" r="2.4" fill="${INK}"/><path d="M${cx-5} ${cy+4} Q${cx} ${cy+8} ${cx+5} ${cy+4}" stroke="${INK}" stroke-width="1.6" fill="none"/></g>`).join(""));
  if (x.includes("clone")) out.push([[34,64],[126,64]].map(([cx,cy])=>`<g opacity=".45"><path d="M${cx-14} ${cy+22} Q${cx} ${cy+16} ${cx+14} ${cy+22} L${cx+16} ${cy+60} H${cx-16}Z" fill="${s.oc}" ${O}/><ellipse cx="${cx}" cy="${cy}" rx="15" ry="17" fill="${s.sk}" ${O}/><path d="M${cx-15} ${cy-2} Q${cx-15} ${cy-18} ${cx} ${cy-18} Q${cx+15} ${cy-18} ${cx+15} ${cy-2} Q${cx} ${cy-10} ${cx-15} ${cy-2}Z" fill="${s.hc}"/><ellipse cx="${cx-5}" cy="${cy}" rx="3.4" ry="2.4" fill="${s.ey}"/><ellipse cx="${cx+5}" cy="${cy}" rx="3.4" ry="2.4" fill="${s.ey}"/></g>`).join(""));
  if (x.includes("pages")) out.push([[24,60],[134,70],[30,120],[132,128]].map(([px,py],i)=>`<rect x="${px}" y="${py}" width="14" height="18" fill="#fff" ${O} transform="rotate(${i*17-20} ${px} ${py})"><animateTransform attributeName="transform" type="translate" values="0 0;0 -8;0 0" dur="${2+i*.4}s" repeatCount="indefinite" additive="sum"/></rect>`).join(""));
  if (x.includes("smoke")) out.push(`<g fill="#9CA3AF" opacity=".5"><circle cx="56" cy="20" r="8"><animate attributeName="cy" values="30;6;30" dur="3s" repeatCount="indefinite"/><animate attributeName="opacity" values=".6;0;.6" dur="3s" repeatCount="indefinite"/></circle><circle cx="106" cy="24" r="6"><animate attributeName="cy" values="34;10;34" dur="2.4s" repeatCount="indefinite"/></circle></g>`);
  if (x.includes("bubble")) out.push(`<ellipse cx="80" cy="96" rx="64" ry="78" fill="none" stroke="#F9A8D4" stroke-width="4" stroke-dasharray="10 6" opacity=".7"><animateTransform attributeName="transform" type="rotate" from="0 80 96" to="360 80 96" dur="20s" repeatCount="indefinite"/></ellipse>`);
  return out.join("");
};
const front = (s) => {
  const x = s.x || [], out = [];
  if (x.includes("chains")) out.push(`<path d="M52 100 Q80 118 108 100" fill="none" stroke="#9CA3AF" stroke-width="4" stroke-dasharray="6 3"/><path d="M56 128 Q80 144 104 128" fill="none" stroke="#9CA3AF" stroke-width="4" stroke-dasharray="6 3"/>`);
  if (x.includes("sparks")) out.push(`<path d="M30 40 l6 8 l-4 0 l6 10 M128 34 l-6 8 l4 0 l-6 10" stroke="#FDE047" stroke-width="2.4" fill="none"><animate attributeName="opacity" values="0;1;0" dur="1.2s" repeatCount="indefinite"/></path>`);
  if (x.includes("swarm")) out.push([[24,40],[136,50],[20,130],[140,140],[40,24]].map(([bx,by],i)=>`<g><animateTransform attributeName="transform" type="translate" values="0 0;${i%2?6:-6} ${i%2?-5:5};0 0" dur="${.8+i*.2}s" repeatCount="indefinite"/><ellipse cx="${bx}" cy="${by}" rx="5" ry="3.4" fill="#3F6212"/><ellipse cx="${bx-2}" cy="${by-4}" rx="4" ry="2" fill="#E0F2FE"/></g>`).join(""));
  if (x.includes("cane")) out.push(`<path d="M44 132 V166" stroke="#111827" stroke-width="4"/><path d="M44 132 Q44 124 52 126" stroke="#FBBF24" stroke-width="4" fill="none"/>`);
  return out.join("");
};
/* the body: legs, outfit and arms. Female and male builds differ at the shoulders and waist. */
const body = (s) => {
  const f = s.g === "f", oc = s.oc, a = s.ac, sk = s.sk, dk = shade(oc, -.3);
  const sh = f ? [58, 102] : [52, 108];
  const legs = `<rect x="66" y="132" width="11" height="32" rx="4" fill="${shade(oc, -.45)}" ${O}/><rect x="83" y="132" width="11" height="32" rx="4" fill="${shade(oc, -.45)}" ${O}/><ellipse cx="70" cy="166" rx="10" ry="5" fill="${INK}"/><ellipse cx="90" cy="166" rx="10" ry="5" fill="${INK}"/>`;
  let torso = "";
  switch (s.o) {
    case "gown": torso = `<path d="M${sh[0]} 88 Q80 82 ${sh[1]} 88 L98 118 Q118 150 124 168 H36 Q42 150 62 118Z" fill="${oc}" ${O}/><path d="M62 118 H98" stroke="${a}" stroke-width="4"/><path d="M50 160 Q80 150 110 160" stroke="${dk}" stroke-width="2" fill="none"/>`; break;
    case "robe": case "hood": torso = `<path d="M${sh[0]} 88 Q80 82 ${sh[1]} 88 L112 166 H48Z" fill="${oc}" ${O}/><path d="M80 90 V166" stroke="${dk}" stroke-width="2"/><path d="M62 120 H98" stroke="${a}" stroke-width="4"/>` + (s.o === "hood" ? `<path d="M48 166 L54 158 L60 166 L66 158 L72 166 L78 158 L84 166 L90 158 L96 166 L102 158 L108 166 L112 166" fill="${oc}" stroke="${INK}" stroke-opacity=".5"/>` : ""); break;
    case "armor": torso = legs + `<path d="M${sh[0]} 88 Q80 82 ${sh[1]} 88 L100 134 H60Z" fill="${oc}" ${O}/><path d="M64 104 H96 M62 118 H98" stroke="${dk}" stroke-width="2.4"/><circle cx="80" cy="100" r="6" fill="${a}" ${O}/><ellipse cx="${sh[0]}" cy="90" rx="10" ry="8" fill="${shade(oc, .2)}" ${O}/><ellipse cx="${sh[1]}" cy="90" rx="10" ry="8" fill="${shade(oc, .2)}" ${O}/>`; return torso;
    case "rags": torso = legs + `<path d="M${sh[0]} 88 Q80 84 ${sh[1]} 88 L104 140 L96 132 L90 142 L82 132 L74 142 L68 132 L60 142 L56 134Z" fill="${oc}" ${O}/><path d="M66 100 l6 6 M90 110 l6 -4" stroke="${dk}" stroke-width="2"/>`; return torso;
    case "lab": torso = legs + `<path d="M${sh[0]} 88 Q80 82 ${sh[1]} 88 L104 150 H56Z" fill="${oc}" ${O}/><path d="M80 90 V150 M72 88 L80 104 L88 88" stroke="#CBD5E1" stroke-width="2" fill="none"/><rect x="86" y="110" width="12" height="10" rx="2" fill="none" stroke="#CBD5E1" stroke-width="2"/><path d="M90 108 V114" stroke="${a}" stroke-width="2.4"/>`; return torso;
    case "golem": torso = legs.replace(/fill="[^"]+"/g, `fill="${shade(sk, -.25)}"`) + `<path d="M${sh[0]-4} 86 Q80 78 ${sh[1]+4} 86 L104 136 H56Z" fill="${shade(sk, -.1)}" ${O}/><path d="M66 100 L76 110 L70 122 M96 98 L88 112" stroke="${shade(sk, -.45)}" stroke-width="2" fill="none"/><circle cx="80" cy="108" r="7" fill="${a}" opacity=".9"><animate attributeName="opacity" values=".5;1;.5" dur="1.6s" repeatCount="indefinite"/></circle>`; return torso;
    case "coat": torso = legs + `<path d="M${sh[0]} 88 Q80 82 ${sh[1]} 88 L104 146 L88 140 L80 132 L72 140 L56 146Z" fill="${oc}" ${O}/><path d="M72 88 L80 112 L88 88" fill="${a}" ${O}/>` + [100, 112, 124].map(y => `<circle cx="84" cy="${y}" r="2" fill="#FBBF24"/>`).join(""); return torso;
    default: /* suit */ torso = legs + `<path d="M${sh[0]} 88 Q80 82 ${sh[1]} 88 L100 136 H60Z" fill="${oc}" ${O}/><path d="M72 88 L80 104 L88 88Z" fill="#F8FAFC"/><path d="M78 92 L82 92 L83 98 L80 116 L77 98Z" fill="${a}"/><path d="M72 88 L80 112 L68 100Z M88 88 L80 112 L92 100Z" fill="${dk}"/>`; return torso;
  }
  return torso;
};
const arms = (s, st) => {
  const f = s.g === "f", sk = s.sk, sl = s.o === "golem" ? shade(sk, -.1) : s.oc, sh = f ? [58, 102] : [52, 108];
  const w = s.o === "golem" ? 14 : 11;
  const arm = (x1, y1, x2, y2) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${INK}" stroke-opacity=".7" stroke-width="${w + 4}" stroke-linecap="round"/><path d="M${x1} ${y1} L${x2} ${y2}" stroke="${sl}" stroke-width="${w}" stroke-linecap="round"/><circle cx="${x2}" cy="${y2}" r="${w / 2 + 2}" fill="${sk}" ${O}/>`;
  const hx = 128, hy = 76;
  const left = st === "win" ? arm(sh[0], 92, 34, 66) : st === "defeat" ? arm(sh[0], 92, 44, 136) : arm(sh[0], 92, 40, 124);
  return `<g class="bs-armL">${left}</g><g class="bs-armR">${arm(sh[1], 92, hx, hy)}<g transform="translate(${hx} ${hy})">${prop(s.p, s.oc, s.ac)}</g></g>`;
};

/* ---------- the whole boss ---------- */
CS.bossArt = (course, unit, state = "idle", o = {}) => {
  const s = (B[course] || {})[unit]; const st = state;
  if (!s) return "";
  const gid = `bs${course}${unit}`;
  const hood = s.o === "hood", hdk = shade(s.oc, -.3);
  const head = `<g class="bs-head">${hood ? `<path d="M48 74 Q44 16 80 14 Q116 16 112 74 L106 94 H54Z" fill="${s.oc}" ${O}/>` : ""}${hairBack(s)}<rect x="72" y="74" width="16" height="14" fill="${s.sk}" ${O}/>${feat(null, s, st)}<path d="M58 54 Q58 28 80 28 Q102 28 102 54 Q102 ${s.g === "f" ? 78 : 82} 80 ${s.g === "f" ? 84 : 86} Q58 ${s.g === "f" ? 78 : 82} 58 54Z" fill="${s.sk}" ${O}/>${faceFeat(s, st)}${hairFront(s)}${eyes(s, st)}${mouth(s, st)}${accessories(s)}${hood ? `<path d="M56 64 Q54 26 80 24 Q106 26 104 64" fill="none" stroke="${hdk}" stroke-width="7" stroke-linecap="round"/><path d="M58 40 Q80 26 102 40 L100 50 Q80 40 60 50Z" fill="#000" opacity=".22"/>` : ""}${hatSVG(s.hat, s)}</g>`;
  const fx = st === "crit" ? `<g class="bs-burst"><path d="M80 40 l8 22 l22 -8 l-14 18 l18 14 l-24 0 l2 24 l-12 -20 l-12 20 l2 -24 l-24 0 l18 -14 l-14 -18 l22 8z" fill="#FDE047" stroke="#F97316" stroke-width="2.4"/><text x="80" y="96" text-anchor="middle" font-size="18" font-weight="900" fill="#B91C1C" font-family="sans-serif">CRIT!</text></g>`
    : st === "hurt" ? `<g class="bs-burst"><path d="M118 44 l10 -10 M124 58 l14 -2 M116 30 l2 -14" stroke="#F97316" stroke-width="4" stroke-linecap="round"/></g>`
    : st === "attack" ? `<g class="bs-slash"><path d="M150 30 Q110 80 140 150" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".9"/><path d="M156 46 Q120 90 146 156" stroke="#F87171" stroke-width="3" fill="none" stroke-linecap="round"/></g>`
    : st === "defeat" ? `<g class="bs-stars">${[[56,26],[80,16],[104,26]].map(([x,y])=>`<path d="M${x} ${y-6} l2 4 l4 0 l-3 3 l1 5 l-4 -3 l-4 3 l1 -5 l-3 -3 l4 0z" fill="#FDE047"/>`).join("")}</g>` : "";
  return `<svg class="bossart st-${st}" viewBox="0 0 160 180" role="img" aria-label="${o.label || "Unit boss"}"><defs><radialGradient id="${gid}g"><stop offset="0" stop-color="#000" stop-opacity=".28"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>
    <ellipse cx="80" cy="170" rx="46" ry="8" fill="url(#${gid}g)"/>
    <g class="bs-all"><g class="bs-bob">${back(s)}${body(s)}${arms(s, st)}${head}${front(s)}</g></g>${fx}</svg>`;
};
CS.hasBossArt = (course, unit) => !!((B[course] || {})[unit]);
})();
