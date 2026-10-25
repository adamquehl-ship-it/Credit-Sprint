/* Credit Sprint AP U.S. Government drills: procedural generators, so every attempt is new. Each returns {q, ans, unit, work}. */
(function(){
const pick = a => a[Math.floor(Math.random()*a.length)];
const ri = (a,b) => a + Math.floor(Math.random()*(b-a+1));
const AM = [["the Fifteenth Amendment",1870],["the Seventeenth Amendment",1913],["the Nineteenth Amendment",1920],["the Twenty-second Amendment",1951],["the Twenty-fourth Amendment",1964],["the Twenty-sixth Amendment",1971]];
window.CS_DRILLS = [
 {k:"override", n:"Veto override votes", u:2, gen(){ const h = Math.random()<0.5, N = h ? pick([435,430,420,400]) : pick([100,98,96,90]); const need = Math.ceil(N*2/3);
   return {q:`A president vetoes a bill. If ${N} members of the ${h?"House":"Senate"} vote, how many votes are needed to override the veto?`, ans:need, unit:2, work:`Two-thirds of ${N} is ${(N*2/3).toFixed(1)}, so ${need} votes are needed.`}; }},
 {k:"majority", n:"Majority needed", u:2, gen(){ const N = pick([435,433,430,100,99,98,51,9]); const need = Math.floor(N/2)+1;
   return {q:`How many votes is a simple majority when ${N} members vote?`, ans:need, unit:2, work:`Half of ${N} is ${N/2}, so a majority is ${need}.`}; }},
 {k:"elec", n:"State electoral votes", u:5, gen(){ const r = ri(1,52);
   return {q:`A state has ${r} seat${r>1?"s":""} in the House of Representatives. How many electoral votes does it have?`, ans:r+2, unit:5, work:`Electoral votes equal House seats plus two senators: ${r} + 2 = ${r+2}.`}; }},
 {k:"ecwin", n:"Electoral College math", u:5, gen(){ const a = ri(180,330), b = 538 - a - pick([0,0,0,0]);
   return {q:`A candidate wins states worth ${a} electoral votes out of 538. How many more votes would the candidate need to reach a majority of 270? Type 0 if the candidate already has a majority.`, ans:Math.max(0,270-a), unit:5, work:`270 − ${a} = ${270-a}${a>=270?", so the candidate already has a majority":""}.`}; }},
 {k:"turnout", n:"Turnout percent", u:5, gen(){ const el = pick([2,4,5,8,10,20,50])*1000000, pc = ri(35,80), v = Math.round(el*pc/100);
   return {q:`In an election, ${v.toLocaleString()} of ${el.toLocaleString()} eligible voters cast ballots. What is the turnout percentage, rounded to the nearest whole number?`, ans:Math.round(v/el*100), unit:5, work:`${v.toLocaleString()} ÷ ${el.toLocaleString()} = ${(v/el*100).toFixed(1)}%.`}; }},
 {k:"moe", n:"Margin of error range", u:4, gen(){ const p = ri(35,65), m = ri(2,5), high = Math.random()<0.5;
   return {q:`A poll shows ${p} percent support with a margin of error of plus or minus ${m} points. What is the ${high?"highest":"lowest"} value of the likely range for the population?`, ans:high?p+m:p-m, unit:4, work:`${p} ${high?"+":"−"} ${m} = ${high?p+m:p-m}.`}; }},
 {k:"perdist", n:"People per district", u:2, gen(){ const s = pick([2,4,5,8,10,20,36]), per = ri(7,8)*100000, pop = s*per;
   return {q:`A state with a population of ${pop.toLocaleString()} has ${s} House districts of equal size. How many people live in each district?`, ans:per, unit:2, work:`${pop.toLocaleString()} ÷ ${s} = ${per.toLocaleString()}.`}; }},
 {k:"change", n:"Percentage point change", u:5, gen(){ const a = ri(40,68), b = ri(40,68); if (a===b) return this.gen();
   return {q:`Voter turnout was ${a} percent in one election and ${b} percent in the next. What is the change in percentage points? Use a negative number for a decrease.`, ans:b-a, unit:5, work:`${b} − ${a} = ${b-a} percentage points.`}; }},
 {k:"amyears", n:"Years between amendments", u:1, gen(){ let a, b; do { a = pick(AM); b = pick(AM); } while (a === b || a[1] >= b[1]);
   return {q:`${a[0][0].toUpperCase()+a[0].slice(1)} was ratified in ${a[1]} and ${b[0]} in ${b[1]}. How many years passed between them?`, ans:b[1]-a[1], unit:1, work:`${b[1]} − ${a[1]} = ${b[1]-a[1]} years.`}; }},
 {k:"amend", n:"Ratifying an amendment", u:1, gen(){ const n = pick([50,48,40,30]), need = Math.ceil(n*3/4);
   return {q:`If ${n} states are counted, how many must ratify a proposed amendment for it to take effect?`, ans:need, unit:1, work:`Three-fourths of ${n} is ${(n*0.75).toFixed(1)}, so ${need} states are needed.`}; }}
];
})();
