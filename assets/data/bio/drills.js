/* Credit Sprint Biology calculation drills: procedural generators, so every attempt is new.
   Each returns {q, ans, unit, work}. unit: "%", "" (plain number). Answers within 1% (or 0.06) are accepted. */
(function(){
const pick = a => a[Math.floor(Math.random()*a.length)];
const rint = (a,b,step=1) => a + step*Math.floor(Math.random()*((b-a)/step+1));
const r2 = x => Math.round(x*100)/100, r3 = x => Math.round(x*1000)/1000;
window.CS_DRILLS = [
 {k:"hwq", n:"Hardy–Weinberg: allele frequency", u:7, gen(){ const q = pick([0.1,0.2,0.3,0.4,0.5,0.6,0.7]), N = pick([400,500,800,1000,2000]), rec = Math.round(q*q*N);
   return {q:`In a population of ${N} in Hardy–Weinberg equilibrium, ${rec} individuals show the recessive phenotype. What is the frequency of the recessive allele (q)?`, ans:r2(Math.sqrt(rec/N)), unit:"", work:`q² = ${rec} ÷ ${N} = ${r3(rec/N)}, so q = √${r3(rec/N)} = ${r2(Math.sqrt(rec/N))}.`}; }},
 {k:"hwhet", n:"Hardy–Weinberg: heterozygotes", u:7, gen(){ const q = pick([0.1,0.2,0.3,0.4,0.5]), p = r2(1-q);
   return {q:`If the recessive allele frequency is q = ${q}, what percentage of the population is heterozygous?`, ans:r2(2*p*q*100), unit:"%", work:`p = 1 − ${q} = ${p}; 2pq = 2 × ${p} × ${q} = ${r3(2*p*q)} = ${r2(2*p*q*100)}%.`}; }},
 {k:"chi", n:"Chi-square value", u:5, gen(){ const n = pick([100,200,400]), e1 = n*0.75, e2 = n*0.25, d = rint(2,Math.round(n*0.08)), o1 = e1 - d, o2 = e2 + d, x = (d*d)/e1 + (d*d)/e2;
   return {q:`A monohybrid cross is expected to give a 3:1 ratio. Out of ${n} offspring, ${o1} show the dominant trait and ${o2} the recessive trait. Calculate χ².`, ans:r2(x), unit:"", work:`Expected ${e1} and ${e2}. χ² = (${o1}−${e1})²/${e1} + (${o2}−${e2})²/${e2} = ${r3(d*d/e1)} + ${r3(d*d/e2)} = ${r2(x)}.`}; }},
 {k:"psi", n:"Solute potential (Ψs = −iCRT)", u:2, gen(){ const C = pick([0.1,0.2,0.25,0.3,0.4,0.5]), i = pick([1,1,2]), tc = pick([20,22,25]), T = tc+273, v = -i*C*0.0831*T;
   return {q:`Calculate the solute potential (in bars) of a ${C} M ${i===2?"NaCl (i = 2)":"sucrose (i = 1)"} solution at ${tc}°C. Use R = 0.0831 L·bar/mol·K.`, ans:r2(v), unit:"", work:`Ψs = −iCRT = −(${i})(${C})(0.0831)(${T}) = ${r2(v)} bars.`}; }},
 {k:"sav", n:"Surface area-to-volume ratio", u:2, gen(){ const s = pick([1,2,3,4,5,6,10]);
   return {q:`What is the surface area-to-volume ratio of a cube-shaped cell with sides of ${s} µm?`, ans:r2(6/s), unit:"", work:`SA = 6 × ${s}² = ${6*s*s}; V = ${s}³ = ${s*s*s}; SA:V = ${6*s*s} ÷ ${s*s*s} = ${r2(6/s)}.`}; }},
 {k:"rate", n:"Rate of a reaction", u:3, gen(){ const a = rint(5,40), b = a + rint(10,90), t = pick([2,4,5,10,20]);
   return {q:`The amount of O₂ produced rises from ${a} mL to ${b} mL over ${t} minutes. What is the average rate in mL/min?`, ans:r2((b-a)/t), unit:"", work:`(${b} − ${a}) ÷ ${t} = ${r2((b-a)/t)} mL/min.`}; }},
 {k:"pct", n:"Percent change in mass", u:2, gen(){ const m0 = r2(rint(200,600)/100), ch = pick([-1,1])*rint(3,25), m1 = r2(m0*(1+ch/100));
   return {q:`A potato core weighs ${m0} g before soaking and ${m1} g after. What is the percent change in mass?`, ans:r2((m1-m0)/m0*100), unit:"%", work:`(${m1} − ${m0}) ÷ ${m0} × 100 = ${r2((m1-m0)/m0*100)}%.`}; }},
 {k:"prob", n:"Genetics probability", u:5, gen(){ const k = pick(["dihet","trihet","carrier"]);
   if (k === "dihet") return {q:"Two parents are AaBb × AaBb (independent genes). What fraction of offspring are aabb? Give a decimal.", ans:r3(1/16), unit:"", work:"P(aa) = 1/4 and P(bb) = 1/4, so 1/4 × 1/4 = 1/16 = 0.0625."};
   if (k === "trihet") return {q:"Two parents are AaBbCc × AaBbCc. What fraction of offspring show all three dominant traits? Give a decimal.", ans:r3(27/64), unit:"", work:"P(dominant) = 3/4 for each gene: (3/4)³ = 27/64 ≈ 0.422."};
   return {q:"A carrier woman (XᴬXᵃ) and an unaffected man (XᴬY) have a son. What is the probability (as a decimal) that the son has the X-linked recessive trait?", ans:0.5, unit:"", work:"Sons get their X from the mother: 1/2 chance it's Xᵃ = 0.5."}; }},
 {k:"map", n:"Recombination and map distance", u:5, gen(){ const n = pick([200,400,500,1000]), rec = rint(Math.round(n*0.04), Math.round(n*0.3));
   return {q:`In a test cross, ${rec} of ${n} offspring are recombinants. What is the distance between the genes in map units?`, ans:r2(rec/n*100), unit:"", work:`Recombination frequency = ${rec} ÷ ${n} = ${r3(rec/n)} → ${r2(rec/n*100)} map units.`}; }},
 {k:"energy", n:"Energy transfer (10% rule)", u:8, gen(){ const e = pick([1000,5000,10000,20000,50000]), lv = pick([2,3]);
   return {q:`Producers in an ecosystem capture ${e.toLocaleString()} kcal. About how much energy reaches the ${lv===2?"secondary":"tertiary"} consumers?`, ans:e*Math.pow(0.1,lv), unit:"", work:`Each level keeps about 10%: ${e.toLocaleString()} × 0.1${lv===2?" × 0.1":" × 0.1 × 0.1"} = ${r2(e*Math.pow(0.1,lv))} kcal.`}; }},
 {k:"exp", n:"Exponential growth (dN/dt = rN)", u:8, gen(){ const N = pick([200,500,800,1200]), r = pick([0.05,0.1,0.2,0.3,0.5]);
   return {q:`A population of ${N} has a per capita growth rate r = ${r} per year. What is dN/dt?`, ans:r2(r*N), unit:"", work:`dN/dt = rN = ${r} × ${N} = ${r2(r*N)} individuals per year.`}; }},
 {k:"logi", n:"Logistic growth", u:8, gen(){ const K = pick([500,1000,2000]), N = K*pick([0.25,0.5,0.75,0.9]), r = pick([0.2,0.4,0.5,1]);
   return {q:`A population has r = ${r}, N = ${N} and carrying capacity K = ${K}. Use dN/dt = rN(K − N)/K. What is dN/dt?`, ans:r2(r*N*(K-N)/K), unit:"", work:`${r} × ${N} × (${K} − ${N}) ÷ ${K} = ${r2(r*N*(K-N)/K)} per unit time.`}; }},
 {k:"npp", n:"Net primary productivity", u:8, gen(){ const g = rint(20,80)*100, rr = Math.round(g*pick([0.3,0.4,0.5,0.6]));
   return {q:`An ecosystem's gross primary productivity is ${g.toLocaleString()} kcal/m²/yr and producers use ${rr.toLocaleString()} kcal/m²/yr in respiration. What is the net primary productivity?`, ans:g-rr, unit:"", work:`NPP = GPP − R = ${g} − ${rr} = ${g-rr} kcal/m²/yr.`}; }},
 {k:"simpson", n:"Simpson's diversity index", u:8, gen(){ const a = rint(2,10), b = rint(2,10), c = rint(1,8), N = a+b+c, D = 1 - (a*a+b*b+c*c)/(N*N);
   return {q:`A sample has ${a} oaks, ${b} maples and ${c} pines. Using D = 1 − Σ(n/N)², what is Simpson's diversity index? (Round to 2 decimals.)`, ans:r2(D), unit:"", work:`N = ${N}. Σ(n/N)² = (${a}/${N})² + (${b}/${N})² + (${c}/${N})² = ${r3((a*a+b*b+c*c)/(N*N))}. D = 1 − ${r3((a*a+b*b+c*c)/(N*N))} = ${r2(D)}.`}; }},
 {k:"mitotic", n:"Mitotic index", u:4, gen(){ const tot = pick([100,150,200,250]), m = rint(Math.round(tot*0.05), Math.round(tot*0.4));
   return {q:`In a root tip, ${m} of ${tot} cells are in mitosis. What is the mitotic index, as a percent?`, ans:r2(m/tot*100), unit:"%", work:`${m} ÷ ${tot} × 100 = ${r2(m/tot*100)}%.`}; }}
];
})();
