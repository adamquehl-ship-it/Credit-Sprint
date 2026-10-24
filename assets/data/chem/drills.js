/* Credit Sprint Chemistry calculation drills: procedural generators, so every attempt is new.
   Each returns {q, ans, unit, work}. Answers within 1% (or 0.06) are accepted. */
(function(){
const pick = a => a[Math.floor(Math.random()*a.length)];
const rint = (a,b,step=1) => a + step*Math.floor(Math.random()*((b-a)/step+1));
const r2 = x => Math.round(x*100)/100, r3 = x => Math.round(x*1000)/1000;
const sig = (x,n=3) => Number(Number(x).toPrecision(n));
const CPD = [["NaCl",58.44],["CaCO₃",100.09],["H₂O",18.02],["CO₂",44.01],["NaOH",40.00],["H₂SO₄",98.08],["C₆H₁₂O₆",180.16],["KCl",74.55],["NH₃",17.03],["MgCl₂",95.21]];
window.CS_DRILLS = [
 {k:"moles", n:"Grams to moles", u:4, gen(){ const [f,M] = pick(CPD), g = rint(5,100);
   return {q:`How many moles are in ${g} g of ${f}? (Molar mass ${M} g/mol.)`, ans:sig(g/M), unit:"", work:`n = m ÷ M = ${g} ÷ ${M} = ${sig(g/M)} mol.`}; }},
 {k:"molarity", n:"Molarity", u:4, gen(){ const [f,M] = pick(CPD.slice(0,8)), g = rint(2,40), V = pick([0.25,0.5,1,2]);
   return {q:`${g} g of ${f} (${M} g/mol) is dissolved to make ${V} L of solution. What is the molarity?`, ans:sig(g/M/V), unit:"", work:`n = ${g} ÷ ${M} = ${sig(g/M)} mol; M = n ÷ V = ${sig(g/M)} ÷ ${V} = ${sig(g/M/V)} M.`}; }},
 {k:"dilute", n:"Dilution (M₁V₁ = M₂V₂)", u:4, gen(){ const M1 = pick([2,3,6,12]), M2 = pick([0.1,0.25,0.5,1]), V2 = pick([100,250,500]), V1 = M2*V2/M1;
   return {q:`What volume (mL) of ${M1} M stock solution is needed to prepare ${V2} mL of ${M2} M solution?`, ans:sig(V1), unit:"", work:`V₁ = M₂V₂ ÷ M₁ = (${M2})(${V2}) ÷ ${M1} = ${sig(V1)} mL.`}; }},
 {k:"empirical", n:"Percent composition", u:1, gen(){ const [f,M,mass] = pick([["CO₂",44.01,12.01],["H₂O",18.02,2.016],["NH₃",17.03,14.01],["CH₄",16.04,12.01],["SO₃",80.06,32.07]]);
   return {q:`What is the mass percent of ${f==="CO₂"?"carbon":f==="H₂O"?"hydrogen":f==="NH₃"?"nitrogen":f==="CH₄"?"carbon":"sulfur"} in ${f}? (Molar mass ${M} g/mol; mass of that element in one mole: ${mass} g.)`, ans:r2(mass/M*100), unit:"%", work:`${mass} ÷ ${M} × 100 = ${r2(mass/M*100)}%.`}; }},
 {k:"yield", n:"Percent yield", u:4, gen(){ const th = rint(40,200)/10, pct = rint(55,98), act = r2(th*pct/100);
   return {q:`A reaction has a theoretical yield of ${th} g. The student collects ${act} g. What is the percent yield?`, ans:r2(act/th*100), unit:"%", work:`${act} ÷ ${th} × 100 = ${r2(act/th*100)}%.`}; }},
 {k:"ideal", n:"Ideal gas law (volume)", u:3, gen(){ const n = pick([0.5,1,1.5,2,0.25]), T = pick([273,298,350,400]), P = pick([0.5,1,1.5,2]), V = n*0.08206*T/P;
   return {q:`What volume (L) is occupied by ${n} mol of an ideal gas at ${T} K and ${P} atm? (R = 0.08206 L·atm/mol·K)`, ans:sig(V), unit:"", work:`V = nRT/P = (${n})(0.08206)(${T}) ÷ ${P} = ${sig(V)} L.`}; }},
 {k:"boyle", n:"Combined gas law", u:3, gen(){ const P1 = pick([1,2,3]), V1 = pick([2,4,6,10]), P2 = pick([0.5,1,4,5]), V2 = P1*V1/P2;
   return {q:`A gas at ${P1} atm occupies ${V1} L. The temperature stays constant and the pressure changes to ${P2} atm. What is the new volume (L)?`, ans:sig(V2), unit:"", work:`P₁V₁ = P₂V₂, so V₂ = (${P1})(${V1}) ÷ ${P2} = ${sig(V2)} L.`}; }},
 {k:"graham", n:"Graham's law (relative rates)", u:3, gen(){ const [a,Ma,b,Mb] = pick([["H₂",2.016,"O₂",32.00],["He",4.003,"CH₄",16.04],["H₂",2.016,"CO₂",44.01],["NH₃",17.03,"HCl",36.46]]), r = Math.sqrt(Mb/Ma);
   return {q:`How many times faster does ${a} (${Ma} g/mol) effuse than ${b} (${Mb} g/mol)?`, ans:sig(r), unit:"", work:`rate ratio = √(${Mb} ÷ ${Ma}) = ${sig(r)}.`}; }},
 {k:"heat", n:"Heat: q = mcΔT", u:6, gen(){ const m = rint(20,250), T1 = rint(15,30), T2 = T1 + rint(10,60), q = m*4.184*(T2-T1);
   return {q:`How much heat (in joules) is needed to warm ${m} g of water from ${T1} °C to ${T2} °C? (c = 4.184 J/g·°C)`, ans:sig(q), unit:"", work:`q = mcΔT = (${m})(4.184)(${T2-T1}) = ${sig(q)} J.`}; }},
 {k:"dh", n:"ΔH from enthalpies of formation", u:6, gen(){ const a = -rint(100,400), b = -rint(100,400), c = -rint(50,300), d = pick([1,2]), e = pick([1,2]);
   const dH = e*b - (d*a + c);
   return {q:`For A + ${d>1?d+" ":""}B → ${e>1?e+" ":""}C: ΔH°f(B) = ${a} kJ/mol, ΔH°f(A) = ${c} kJ/mol and ΔH°f(C) = ${b} kJ/mol. Calculate ΔH° (kJ) for the reaction as written.`, ans:dH, unit:"", work:`ΔH° = Σ products − Σ reactants = ${e}(${b}) − [${d}(${a}) + (${c})] = ${dH} kJ.`}; }},
 {k:"ph", n:"pH of a strong acid", u:8, gen(){ const c = pick([0.1,0.01,0.001,0.0001,0.05,0.002,0.005]), pH = -Math.log10(c);
   return {q:`What is the pH of a ${c} M solution of HCl?`, ans:r2(pH), unit:"", work:`[H⁺] = ${c} M; pH = −log(${c}) = ${r2(pH)}.`}; }},
 {k:"poh", n:"pH of a strong base", u:8, gen(){ const c = pick([0.1,0.01,0.001,0.05,0.002,0.005]), pH = 14 + Math.log10(c);
   return {q:`What is the pH of a ${c} M solution of NaOH at 25 °C?`, ans:r2(pH), unit:"", work:`pOH = −log(${c}) = ${r2(-Math.log10(c))}; pH = 14 − pOH = ${r2(pH)}.`}; }},
 {k:"weak", n:"pH of a weak acid", u:8, gen(){ const [Ka,Kt] = pick([[1.8e-5,"1.8 × 10⁻⁵"],[4.0e-6,"4.0 × 10⁻⁶"],[6.3e-8,"6.3 × 10⁻⁸"],[1.0e-5,"1.0 × 10⁻⁵"],[7.2e-4,"7.2 × 10⁻⁴"]]), C = pick([0.1,0.2,0.05,0.5]), h = Math.sqrt(Ka*C);
   return {q:`What is the pH of a ${C} M solution of a weak acid with Ka = ${Kt}? (Use the approximation [H⁺] = √(Ka·C).)`, ans:r2(-Math.log10(h)), unit:"", work:`[H⁺] ≈ √(${Kt} × ${C}) = ${sig(h)} M; pH = ${r2(-Math.log10(h))}.`}; }},
 {k:"kc", n:"Equilibrium constant Kc", u:7, gen(){ const A = pick([0.10,0.20,0.40]), B = pick([0.10,0.30]), C = pick([0.20,0.40,0.60]);
   return {q:`For A(g) + B(g) ⇌ C(g), the equilibrium concentrations are [A] = ${A} M, [B] = ${B} M and [C] = ${C} M. Calculate Kc.`, ans:sig(C/(A*B)), unit:"", work:`Kc = [C] ÷ ([A][B]) = ${C} ÷ (${A} × ${B}) = ${sig(C/(A*B))}.`}; }},
 {k:"halflife", n:"Half-life remaining", u:5, gen(){ const t = pick([10,20,30,40]), n = pick([2,3,4]), m0 = pick([80,100,160,200]);
   return {q:`A first-order reaction has a half-life of ${t} min. How much of a ${m0} g sample remains after ${t*n} min?`, ans:m0/Math.pow(2,n), unit:"", work:`${n} half-lives: ${m0} ÷ 2^${n} = ${m0/Math.pow(2,n)} g.`}; }},
 {k:"dg", n:"ΔG = ΔH − TΔS", u:9, gen(){ const H = -rint(20,200), S = rint(-150,150), T = pick([298,350,400,500]), G = H - T*S/1000;
   return {q:`For a reaction, ΔH = ${H} kJ and ΔS = ${S} J/K. What is ΔG (in kJ) at ${T} K?`, ans:sig(G), unit:"", work:`ΔG = ΔH − TΔS = ${H} − (${T})(${S/1000}) = ${sig(G)} kJ.`}; }},
 {k:"ecell", n:"Standard cell potential", u:9, gen(){ const c = rint(20,150)/100, a = -rint(20,200)/100;
   return {q:`The cathode half-reaction has E° = +${c.toFixed(2)} V and the anode half-reaction has E° = ${a.toFixed(2)} V (both as reductions). What is E°cell?`, ans:r2(c-a), unit:"", work:`E°cell = E°cathode − E°anode = ${c.toFixed(2)} − (${a.toFixed(2)}) = ${r2(c-a)} V.`}; }},
 {k:"beer", n:"Beer's law", u:3, gen(){ const e = pick([10,20,50,100,150]), b = 1, c = pick([0.002,0.004,0.005,0.01]), A = e*b*c;
   return {q:`A solution in a 1.00 cm cuvette has ε = ${e} M⁻¹cm⁻¹ and concentration ${c} M. What is the absorbance?`, ans:sig(A), unit:"", work:`A = εbc = (${e})(1.00)(${c}) = ${sig(A)}.`}; }},
 {k:"elec", n:"Electrolysis mass", u:9, gen(){ const I = pick([1,2,3,5]), t = pick([10,20,30,60]), m = I*t*60/96485/2*63.55;
   return {q:`A current of ${I} A passes through aqueous Cu²⁺ for ${t} minutes. What mass of copper (g) is deposited? (F = 96,485 C/mol; Cu = 63.55 g/mol.)`, ans:sig(m), unit:"", work:`q = ${I} × ${t*60} = ${I*t*60} C; mol e⁻ = ${sig(I*t*60/96485)}; mol Cu = half of that; mass = ${sig(m)} g.`}; }}
];
})();
