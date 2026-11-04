/* Credit Sprint AP® Human Geography drills: procedural generators, so every attempt is new. Each returns {q, ans, unit, work}. */
(function(){
const pick = a => a[Math.floor(Math.random()*a.length)];
const ri = (a,b) => a + Math.floor(Math.random()*(b-a+1));
const r1 = x => Math.round(x*10)/10;
const C = ["Country A","Country B","Country C","Country D","Country E"];
window.CS_DRILLS = [
 {k:"arith", n:"Arithmetic density", u:2, gen(){ const area = pick([50,80,120,200,250,400,500]) * 1000, d = pick([20,40,60,90,120,150,240,300]), pop = area*d;
   return {q:`${pick(C)} has ${(pop/1e6).toLocaleString()} million people and ${area.toLocaleString()} square kilometers of land. What is its arithmetic density, in people per square kilometer?`, ans:d, unit:"", work:`Arithmetic density = people ÷ total land = ${pop.toLocaleString()} ÷ ${area.toLocaleString()} = ${d} people per km².`}; }},
 {k:"phys", n:"Physiological density", u:2, gen(){ const arable = pick([10,20,25,40,50,80]) * 1000, d = pick([200,400,500,800,1000,1500,2000]), pop = arable*d;
   return {q:`A country has ${(pop/1e6).toLocaleString()} million people and ${arable.toLocaleString()} square kilometers of arable land. What is its physiological density, in people per square kilometer of arable land?`, ans:d, unit:"", work:`Physiological density = people ÷ arable land = ${pop.toLocaleString()} ÷ ${arable.toLocaleString()} = ${d} people per km² of farmland.`}; }},
 {k:"rni", n:"Rate of natural increase", u:2, gen(){ const cdr = ri(5,14), cbr = cdr + ri(-3,30); const rni = r1((cbr-cdr)/10);
   return {q:`A country has a crude birth rate of ${cbr} and a crude death rate of ${cdr}. What is its rate of natural increase, in percent?`, ans:rni, unit:"%", work:`RNI = (CBR − CDR) ÷ 10 = (${cbr} − ${cdr}) ÷ 10 = ${rni}%.`}; }},
 {k:"double", n:"Doubling time", u:2, gen(){ const g = pick([0.5,0.7,1,1.4,2,2.5,3.5]); const t = Math.round(70/g);
   return {q:`A population is growing at ${g}% per year. Using the rule of 70, about how many years will it take to double?`, ans:t, unit:"", work:`Doubling time ≈ 70 ÷ growth rate = 70 ÷ ${g} ≈ ${t} years.`}; }},
 {k:"cbr", n:"Crude birth rate", u:2, gen(){ const pop = pick([2,4,5,8,10,20]) * 1e6, cbr = ri(8,44), births = pop*cbr/1000;
   return {q:`A country of ${(pop/1e6)} million people had ${births.toLocaleString()} live births last year. What is its crude birth rate, per 1,000 people?`, ans:cbr, unit:"", work:`CBR = births ÷ population × 1,000 = ${births.toLocaleString()} ÷ ${pop.toLocaleString()} × 1,000 = ${cbr}.`}; }},
 {k:"dep", n:"Dependency ratio", u:2, gen(){ const y = ri(10,45), o = ri(3,30), w = 100 - y - o, dr = Math.round((y+o)/w*100);
   return {q:`In a country, ${y}% of people are aged 0–14, ${w}% are 15–64 and ${o}% are 65 or older. What is the dependency ratio (dependents per 100 working-age people), to the nearest whole number?`, ans:dr, unit:"", work:`Dependency ratio = (${y} + ${o}) ÷ ${w} × 100 ≈ ${dr}.`}; }},
 {k:"rank", n:"Rank-size rule", u:6, gen(){ const big = pick([6,8,9,12,15,18,24]), n = ri(2,6), ans = r1(big/n);
   return {q:`A country's largest city has ${big} million people. By the rank-size rule, about how many million people should live in its city of rank ${n}?`, ans:ans, unit:"", work:`The nth city ≈ largest ÷ n = ${big} ÷ ${n} ≈ ${ans} million.`}; }},
 {k:"gravity", n:"Gravity model", u:6, gen(){ const k = pick([2,3,4]), mode = Math.random() < 0.5;
   return mode ? {q:`Using the gravity model, if the distance between two cities is cut to 1/${k} of what it was (populations unchanged), the predicted interaction is multiplied by how much?`, ans:k*k, unit:"", work:`Interaction ∝ 1 ÷ distance². Cutting distance to 1/${k} multiplies interaction by ${k}² = ${k*k}.`}
     : {q:`Using the gravity model, if one city's population is multiplied by ${k} and the distance stays the same, the predicted interaction is multiplied by how much?`, ans:k, unit:"", work:`Interaction ∝ population A × population B, so multiplying one population by ${k} multiplies interaction by ${k}.`}; }},
 {k:"scale", n:"Map scale", u:1, gen(){ const s = pick([24000,50000,63360,100000,250000]), cm = ri(2,12), km = r1(cm*s/100000);
   return {q:`On a map with a scale of 1:${s.toLocaleString()}, two towns are ${cm} cm apart. How far apart are they in real life, in kilometers?`, ans:km, unit:"", work:`${cm} cm × ${s.toLocaleString()} = ${(cm*s).toLocaleString()} cm = ${km} km (100,000 cm in a km).`}; }},
 {k:"sector", n:"Workers by sector", u:7, gen(){ const tot = pick([20,40,50,80]) * 1e6, share = ri(2,70), n = tot*share/100;
   return {q:`A country has ${(tot/1e6)} million workers, and ${(n/1e6).toLocaleString()} million work in the primary sector. What percent of workers are in the primary sector?`, ans:share, unit:"%", work:`${(n/1e6).toLocaleString()} ÷ ${tot/1e6} × 100 = ${share}%.`}; }},
 {k:"gni", n:"GNI per capita", u:7, gen(){ const pop = pick([5,10,20,50,100]), per = pick([800,1500,4000,9000,12000,30000,48000]), gni = pop*per/1000;
   return {q:`A country's gross national income is $${gni.toLocaleString()} billion and its population is ${pop} million. What is its GNI per capita, in dollars?`, ans:per, unit:"$", work:`GNI per capita = $${gni.toLocaleString()} billion ÷ ${pop} million = $${per.toLocaleString()}.`}; }}
];
})();
