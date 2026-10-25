/* Credit Sprint AP Psychology drills: statistics and measurement generators, so every attempt is new. Each returns {q, ans, unit, work}. */
(function(){
const pick = a => a[Math.floor(Math.random()*a.length)];
const ri = (a,b) => a + Math.floor(Math.random()*(b-a+1));
const shuffle = a => { a = a.slice(); for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
window.CS_DRILLS = [
 {k:"zscore", n:"Z-scores", u:1, gen(){ const sd = pick([4,5,8,10,12,15]), mean = ri(10,20)*5, k = pick([-3,-2,-1.5,-1,-0.5,0.5,1,1.5,2,2.5,3]), x = mean + sd*k;
   return {q:`On a test the mean is ${mean} and the standard deviation is ${sd}. What is the z-score for a score of ${x}?`, ans:k, unit:"", work:`z = (score − mean) ÷ SD = (${x} − ${mean}) ÷ ${sd} = ${k}.`}; }},
 {k:"iq", n:"IQ and standard deviations", u:2, gen(){ const k = pick([-2,-1,1,2,3,-3,0.5,1.5]), iq = 100 + 15*k;
   return {q:`A modern IQ test has a mean of 100 and a standard deviation of 15. What IQ score is ${Math.abs(k)} standard deviation${Math.abs(k)===1?"":"s"} ${k<0?"below":"above"} the mean?`, ans:iq, unit:"", work:`100 ${k<0?"−":"+"} (${Math.abs(k)} × 15) = ${iq}.`}; }},
 {k:"ratio", n:"Ratio IQ", u:2, gen(){ const ca = ri(6,14), ma = Math.max(3, ca + pick([-3,-2,-1,0,1,2,3,4])), iq = Math.round(ma/ca*100);
   return {q:`Using the original ratio formula, a child has a mental age of ${ma} and a chronological age of ${ca}. What is the IQ, rounded to the nearest whole number?`, ans:iq, unit:"", work:`IQ = (mental age ÷ chronological age) × 100 = (${ma} ÷ ${ca}) × 100 = ${iq}.`}; }},
 {k:"mean", n:"Mean", u:1, gen(){ const n = pick([4,5,6]), avg = ri(60,90); let a = Array.from({length:n-1},()=>ri(avg-12,avg+12)); const last = avg*n - a.reduce((s,x)=>s+x,0); a.push(last); a = shuffle(a);
   return {q:`Five or so scores are recorded in a memory test: ${a.join(", ")}. What is the mean?`.replace("Five or so",n===5?"Five":n===4?"Four":"Six"), ans:avg, unit:"", work:`Sum ${a.reduce((s,x)=>s+x,0)} ÷ ${n} = ${avg}.`}; }},
 {k:"median", n:"Median", u:1, gen(){ const a = shuffle(Array.from({length:7},()=>ri(5,60))); const s = a.slice().sort((x,y)=>x-y);
   return {q:`Seven participants recalled these numbers of words: ${a.join(", ")}. What is the median?`, ans:s[3], unit:"", work:`Sorted: ${s.join(", ")}. The middle (fourth) value is ${s[3]}.`}; }},
 {k:"range", n:"Range", u:1, gen(){ const a = shuffle(Array.from({length:6},()=>ri(10,95))); const mx = Math.max(...a), mn = Math.min(...a);
   return {q:`Reaction times (in milliseconds) were ${a.join(", ")}. What is the range?`, ans:mx-mn, unit:"", work:`Highest ${mx} − lowest ${mn} = ${mx-mn}.`}; }},
 {k:"pct", n:"Percent in a group", u:1, gen(){ const n = pick([20,25,40,50,80,100,200]), p = ri(2,Math.floor(n*0.9)), pct = Math.round(p/n*100);
   return {q:`In a study, ${p} of ${n} participants improved after treatment. What percent improved, rounded to the nearest whole number?`, ans:pct, unit:"%", work:`${p} ÷ ${n} × 100 = ${(p/n*100).toFixed(1)}%.`}; }},
 {k:"empirical", n:"Normal curve percent", u:1, gen(){ const m = pick([100,500,50,70]), sd = pick([10,15,100,5]), k = pick([1,2]), pct = k===1?68:95;
   return {q:`Scores are normally distributed with a mean of ${m} and a standard deviation of ${sd}. About what percent of scores fall between ${m-k*sd} and ${m+k*sd}?`, ans:pct, unit:"%", work:`These scores are within ${k} standard deviation${k>1?"s":""} of the mean, which includes about ${pct}% of a normal distribution.`}; }},
 {k:"rsq", n:"Variance explained", u:1, gen(){ const r = pick([0.3,0.4,0.5,0.6,0.7,0.8,0.9]), v = Math.round(r*r*100);
   return {q:`Two variables are correlated at r = ${r}. What percent of the variance in one variable is explained by the other (r squared × 100)?`, ans:v, unit:"%", work:`${r} × ${r} = ${(r*r).toFixed(2)}, which is ${v}%.`}; }},
 {k:"chunks", n:"Chunking", u:2, gen(){ const c = pick([2,3,4,5]), ch = ri(4,9), N = c*ch;
   return {q:`A person memorizes ${/^(8|11|18)/.test(String(N))?"an":"a"} ${N}-digit number by grouping the digits into chunks of ${c}. How many chunks must be held in working memory?`, ans:ch, unit:"", work:`${N} ÷ ${c} = ${ch} chunks. Working memory typically holds about seven chunks.`}; }},
 {k:"diff", n:"Difference between means", u:1, gen(){ const a = ri(30,90), d = ri(3,25), exp = Math.random()<0.5;
   return {q:`In an experiment, the treatment group's mean score was ${exp?a+d:a} and the control group's mean score was ${exp?a:a+d}. By how many points did the treatment group's mean ${exp?"exceed":"fall below"} the control group's mean?`, ans:d, unit:"", work:`The difference between the means is ${d} points.`}; }},
 {k:"stages", n:"Sleep cycles", u:1, gen(){ const h = pick([6,7.5,9]), c = Math.round(h*60/90);
   return {q:`A sleep cycle lasts about 90 minutes. About how many full cycles occur in ${h} hours of sleep?`, ans:c, unit:"", work:`${h} hours = ${h*60} minutes, and ${h*60} ÷ 90 = ${c} cycles.`}; }}
];
})();
