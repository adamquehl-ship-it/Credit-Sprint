/* Calculation drills: procedural generators, so every attempt is new.
   Each returns {u, q, ans, unit, work}. unit: "$B" (billions), "%", "" (plain number). */
(function(){
const pick = a => a[Math.floor(Math.random()*a.length)];
const rint = (a,b,step=1) => a + step*Math.floor(Math.random()*((b-a)/step+1));
const r2 = x => Math.round(x*100)/100;
window.CS_DRILLS = [
 {k:"mult", n:"Spending multiplier", u:3, gen(){ const mpc = pick([0.5,0.6,0.75,0.8,0.9]), g = rint(10,60,5), m = r2(1/(1-mpc));
   return {q:`The MPC is ${mpc}. Government spending rises by $${g} billion. What is the maximum change in real GDP?`, ans:r2(g*m), unit:"$B", work:`Multiplier = 1 ÷ (1 − ${mpc}) = ${m}. ${m} × $${g}B = $${r2(g*m)}B.`}; }},
 {k:"tax", n:"Tax multiplier", u:3, gen(){ const mpc = pick([0.5,0.75,0.8,0.9]), t = rint(10,50,5), m = r2(mpc/(1-mpc));
   return {q:`The MPC is ${mpc}. Taxes are cut by $${t} billion. What is the maximum increase in real GDP?`, ans:r2(t*m), unit:"$B", work:`Tax multiplier = ${mpc} ÷ ${r2(1-mpc)} = ${m}. ${m} × $${t}B = $${r2(t*m)}B.`}; }},
 {k:"gap", n:"Closing a gap", u:3, gen(){ const mpc = pick([0.5,0.75,0.8,0.9]), m = 1/(1-mpc), gap = r2(rint(2,12)*m*5);
   return {q:`There is a recessionary gap of $${gap} billion and the MPC is ${mpc}. What is the minimum increase in government spending needed to close it?`, ans:r2(gap/m), unit:"$B", work:`Multiplier = ${r2(m)}. $${gap}B ÷ ${r2(m)} = $${r2(gap/m)}B.`}; }},
 {k:"money", n:"Money creation", u:4, gen(){ const rr = pick([0.05,0.1,0.2,0.25]), d = rint(1,20)*500, ex = r2(d*(1-rr)), mm = r2(1/rr);
   return {q:`A customer deposits $${d.toLocaleString()} in cash. The reserve requirement is ${rr*100}%. What is the maximum increase in the money supply from new loans across the banking system?`, ans:r2(ex*mm), unit:"$", work:`Excess reserves = $${d.toLocaleString()} × ${r2(1-rr)} = $${ex.toLocaleString()}. Multiplier = ${mm}. $${ex.toLocaleString()} × ${mm} = $${r2(ex*mm).toLocaleString()}.`}; }},
 {k:"omo", n:"Open market operations", u:4, gen(){ const rr = pick([0.1,0.2,0.25]), b = rint(10,90,10), buy = Math.random()<.5, mm = r2(1/rr);
   return {q:`The Fed ${buy?"buys":"sells"} $${b} million of bonds ${buy?"from":"to"} banks. The reserve requirement is ${rr*100}%. What is the maximum change in the money supply? (Use a negative number for a decrease.)`, ans:r2((buy?1:-1)*b*mm), unit:"$M", work:`Reserves change by ${buy?"+":"−"}$${b}M, all excess. × ${mm} = ${buy?"+":"−"}$${r2(b*mm)}M.`}; }},
 {k:"ur", n:"Unemployment rate", u:2, gen(){ const e = rint(80,190,5), un = rint(4,20);
   return {q:`${e} million people are employed and ${un} million are unemployed. What is the unemployment rate?`, ans:r2(un/(e+un)*100), unit:"%", work:`Labor force = ${e} + ${un} = ${e+un}M. ${un} ÷ ${e+un} = ${r2(un/(e+un)*100)}%.`}; }},
 {k:"real", n:"Real GDP", u:2, gen(){ const real = rint(8,20)*100, def = pick([105,110,120,125,150,80]), nom = real*def/100;
   return {q:`Nominal GDP is $${nom.toLocaleString()} billion and the GDP deflator is ${def}. What is real GDP?`, ans:real, unit:"$B", work:`$${nom.toLocaleString()}B ÷ ${def} × 100 = $${real.toLocaleString()}B.`}; }},
 {k:"infl", n:"Inflation rate", u:2, gen(){ const a = rint(100,240,5), pct = pick([2,3,4,5,6,8,10]), b = r2(a*(1+pct/100));
   return {q:`The CPI rises from ${a} to ${b}. What is the inflation rate?`, ans:pct, unit:"%", work:`(${b} − ${a}) ÷ ${a} × 100 = ${pct}%.`}; }},
 {k:"rir", n:"Real interest rate", u:4, gen(){ const n = rint(2,12), i = rint(1,8);
   return {q:`A loan's nominal interest rate is ${n}% and expected inflation is ${i}%. What is the real interest rate?`, ans:n-i, unit:"%", work:`${n}% − ${i}% = ${n-i}%.`}; }},
 {k:"growth", n:"Growth rate", u:5, gen(){ const a = rint(5,30)*100, pct = pick([1,2,2.5,3,4,5,6]), b = r2(a*(1+pct/100));
   return {q:`Real GDP grows from $${a.toLocaleString()} billion to $${b.toLocaleString()} billion. What is the growth rate?`, ans:pct, unit:"%", work:`(${b} − ${a}) ÷ ${a} × 100 = ${pct}%.`}; }},
 {k:"r70", n:"Rule of 70", u:5, gen(){ const g = pick([1,2,3.5,5,7,10]);
   return {q:`Real GDP per capita grows ${g}% a year. Using the rule of 70, about how many years will it take to double?`, ans:r2(70/g), unit:"", work:`70 ÷ ${g} = ${r2(70/g)} years.`}; }},
 {k:"gdp", n:"GDP from components", u:2, gen(){ const c = rint(400,900,10), i = rint(100,250,10), g = rint(150,350,10), x = rint(50,150,10), m = rint(50,180,10);
   return {q:`C = $${c}B, I = $${i}B, G = $${g}B, exports = $${x}B and imports = $${m}B. What is GDP?`, ans:c+i+g+x-m, unit:"$B", work:`${c} + ${i} + ${g} + (${x} − ${m}) = $${c+i+g+x-m}B.`}; }},
 {k:"mv", n:"Quantity theory", u:5, gen(){ const M = rint(2,10)*100, V = pick([2,3,4,5,6]);
   return {q:`The money supply is $${M} billion and velocity is ${V}. What is nominal GDP?`, ans:M*V, unit:"$B", work:`M × V = ${M} × ${V} = $${M*V}B.`}; }},
 {k:"fx", n:"Exchange rates", u:6, gen(){ const rate = pick([80,100,120,125,150]), p = rint(4,60);
   return {q:`$1 trades for ${rate} yen. A U.S. product costs $${p}. How many yen does it cost a buyer in Japan?`, ans:p*rate, unit:"¥", work:`$${p} × ${rate} = ¥${(p*rate).toLocaleString()}.`}; }},
 {k:"oc", n:"Opportunity cost", u:1, gen(){ const a = pick([2,3,4,5,6,8,10]), b = pick([2,4,5,6,8,10,12,15,20]);
   return {q:`A worker can make ${a} desks or ${b} chairs in a day. What is the opportunity cost of one desk, in chairs?`, ans:r2(b/a), unit:"", work:`${b} chairs ÷ ${a} desks = ${r2(b/a)} chairs per desk.`}; }}
];
})();
