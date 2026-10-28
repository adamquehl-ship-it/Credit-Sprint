/* Credit Sprint AP Statistics drills: calculation generators, so every attempt is new. Each returns {q, ans, unit, work}. */
(function(){
const pick = a => a[Math.floor(Math.random()*a.length)];
const ri = (a,b) => a + Math.floor(Math.random()*(b-a+1));
const r2 = x => Math.round(x*100)/100, r3 = x => Math.round(x*1000)/1000;
const shuffle = a => { a = a.slice(); for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
window.CS_DRILLS = [
 {k:"zscore", n:"Z-scores", u:1, gen(){ const sd = pick([4,5,8,10,12,15]), mean = ri(10,20)*5, k = pick([-3,-2,-1.5,-1,-0.5,0.5,1,1.5,2,2.5,3]), x = mean + sd*k;
   return {q:`A distribution has mean ${mean} and standard deviation ${sd}. What is the z-score of the value ${x}?`, ans:k, unit:"", work:`z = (x − mean) ÷ SD = (${x} − ${mean}) ÷ ${sd} = ${k}.`}; }},
 {k:"empirical", n:"Empirical rule", u:1, gen(){ const m = pick([100,500,50,70,25]), sd = pick([10,15,100,5,4]), k = pick([1,2,3]), pct = [68,95,99.7][k-1];
   return {q:`A normal distribution has mean ${m} and standard deviation ${sd}. By the empirical rule, about what percent of values fall between ${m-k*sd} and ${m+k*sd}?`, ans:pct, unit:"%", work:`That interval is within ${k} standard deviation${k>1?"s":""} of the mean, which holds about ${pct}% of a normal distribution.`}; }},
 {k:"mean", n:"Mean", u:1, gen(){ const n = pick([4,5,6]), avg = ri(20,60); let a = Array.from({length:n-1},()=>ri(avg-10,avg+10)); a.push(avg*n - a.reduce((s,x)=>s+x,0)); a = shuffle(a);
   return {q:`Find the mean of these ${n} values: ${a.join(", ")}.`, ans:avg, unit:"", work:`Sum ${avg*n} ÷ ${n} = ${avg}.`}; }},
 {k:"median", n:"Median", u:1, gen(){ const a = shuffle(Array.from({length:7},()=>ri(5,60))); const s = a.slice().sort((x,y)=>x-y);
   return {q:`Find the median of: ${a.join(", ")}.`, ans:s[3], unit:"", work:`Sorted: ${s.join(", ")}. The middle (fourth) value is ${s[3]}.`}; }},
 {k:"iqr", n:"IQR", u:1, gen(){ const q1 = ri(10,40), q3 = q1 + ri(6,30);
   return {q:`A data set has Q1 = ${q1} and Q3 = ${q3}. What is the IQR?`, ans:q3-q1, unit:"", work:`IQR = Q3 − Q1 = ${q3} − ${q1} = ${q3-q1}.`}; }},
 {k:"fence", n:"Outlier fence", u:1, gen(){ const q1 = ri(10,40), iqr = ri(4,20), q3 = q1+iqr, up = Math.random()<0.5, f = up ? q3+1.5*iqr : q1-1.5*iqr;
   return {q:`A data set has Q1 = ${q1} and Q3 = ${q3}. What is the ${up?"upper":"lower"} fence for outliers (the 1.5 × IQR rule)?`, ans:f, unit:"", work:`IQR = ${iqr}. ${up?`Q3 + 1.5(IQR) = ${q3} + ${1.5*iqr} = ${f}`:`Q1 − 1.5(IQR) = ${q1} − ${1.5*iqr} = ${f}`}.`}; }},
 {k:"ev", n:"Expected value", u:2, gen(){ const p = pick([0.1,0.2,0.25,0.3,0.4,0.5]), win = pick([5,8,10,12,20]), cost = pick([1,2,3]), ev = r2(p*win - (1-p)*0);
   const net = r2(p*(win-cost) + (1-p)*(-cost));
   return {q:`A game costs $${cost} to play. You win $${win} (before subtracting the cost) with probability ${p} and nothing otherwise. What is your expected net gain per play, in dollars?`, ans:net, unit:"", work:`E(net) = ${p}(${win} − ${cost}) + ${r2(1-p)}(−${cost}) = ${net}.`}; }},
 {k:"binmean", n:"Binomial mean and SD", u:2, gen(){ const n = pick([20,25,40,50,100,200]), p = pick([0.1,0.2,0.25,0.3,0.4,0.5]), mean = r2(n*p), sd = r2(Math.sqrt(n*p*(1-p))), askSd = Math.random()<0.5;
   return {q:`X is binomial with n = ${n} and p = ${p}. What is the ${askSd?"standard deviation of X (round to 2 decimals)":"mean of X"}?`, ans:askSd?sd:mean, unit:"", work:askSd?`SD = √(np(1−p)) = √(${n}×${p}×${r2(1-p)}) ≈ ${sd}.`:`Mean = np = ${n} × ${p} = ${mean}.`}; }},
 {k:"binom", n:"Binomial probability", u:2, gen(){ const n = pick([3,4,5]), p = pick([0.5,0.2,0.3]), k = ri(0,n); const C = (a,b)=>{let r=1;for(let i=1;i<=b;i++)r=r*(a-b+i)/i;return Math.round(r);};
   const v = r3(C(n,k)*Math.pow(p,k)*Math.pow(1-p,n-k));
   return {q:`X is binomial with n = ${n} and p = ${p}. Find P(X = ${k}). Round to 3 decimals.`, ans:v, unit:"", work:`P = C(${n},${k})(${p})^${k}(${r2(1-p)})^${n-k} ≈ ${v}.`}; }},
 {k:"sep", n:"Standard error of p̂", u:3, gen(){ const n = pick([50,100,200,400,625]), p = pick([0.2,0.3,0.4,0.5,0.6]), se = r3(Math.sqrt(p*(1-p)/n));
   return {q:`A sample of n = ${n} is taken from a population with p = ${p}. What is the standard deviation of the sampling distribution of p̂? Round to 3 decimals.`, ans:se, unit:"", work:`√(p(1−p)/n) = √(${p}×${r2(1-p)}/${n}) ≈ ${se}.`}; }},
 {k:"sex", n:"Standard error of x̄", u:4, gen(){ const n = pick([9,16,25,36,64,100]), s = pick([6,8,10,12,15,20]), se = r2(s/Math.sqrt(n));
   return {q:`A sample of n = ${n} has standard deviation s = ${s}. What is the standard error of x̄? Round to 2 decimals.`, ans:se, unit:"", work:`SE = s ÷ √n = ${s} ÷ ${Math.sqrt(n)} ≈ ${se}.`}; }},
 {k:"tstat", n:"One-sample t statistic", u:4, gen(){ const n = pick([16,25,36,49]), s = pick([4,6,8,10]), mu = ri(40,80), d = pick([-3,-2,-1,1,2,3,4]), xbar = mu + d, t = r2((xbar-mu)/(s/Math.sqrt(n)));
   return {q:`Test H₀: μ = ${mu}. A sample of n = ${n} gives x̄ = ${xbar} and s = ${s}. What is the t statistic? Round to 2 decimals.`, ans:t, unit:"", work:`t = (x̄ − μ₀) ÷ (s/√n) = (${xbar} − ${mu}) ÷ (${s}/${Math.sqrt(n)}) = ${t}.`}; }},
 {k:"zstat", n:"One-proportion z statistic", u:3, gen(){ const n = pick([100,200,400]), p0 = pick([0.4,0.5,0.6]), x = Math.round(n*(p0+pick([-0.06,-0.04,0.04,0.06,0.08]))), ph = x/n, z = r2((ph-p0)/Math.sqrt(p0*(1-p0)/n));
   return {q:`Test H₀: p = ${p0}. In a sample of n = ${n}, ${x} are successes. What is the z statistic? Round to 2 decimals.`, ans:z, unit:"", work:`p̂ = ${x}/${n} = ${ph}. z = (${ph} − ${p0}) ÷ √(${p0}×${r2(1-p0)}/${n}) ≈ ${z}.`}; }},
 {k:"moe", n:"Margin of error", u:3, gen(){ const n = pick([100,200,400,625,900]), ph = pick([0.3,0.4,0.5,0.6]), z = pick([[1.645,"90%"],[1.96,"95%"],[2.576,"99%"]]), m = r3(z[0]*Math.sqrt(ph*(1-ph)/n));
   return {q:`For a ${z[1]} confidence interval for a proportion, n = ${n} and p̂ = ${ph}. Using z* = ${z[0]}, what is the margin of error? Round to 3 decimals.`, ans:m, unit:"", work:`ME = z*·√(p̂(1−p̂)/n) = ${z[0]} × √(${ph}×${r2(1-ph)}/${n}) ≈ ${m}.`}; }},
 {k:"slope", n:"Slope from summary stats", u:5, gen(){ const r = pick([0.5,0.6,0.7,0.8,0.9,-0.6,-0.8]), sx = pick([2,4,5]), sy = pick([6,8,10,12,15]), b = r2(r*sy/sx);
   return {q:`For a data set, r = ${r}, sₓ = ${sx} and s_y = ${sy}. What is the slope of the least-squares line? Round to 2 decimals.`, ans:b, unit:"", work:`b = r·(s_y/sₓ) = ${r} × (${sy}/${sx}) = ${b}.`}; }},
 {k:"resid", n:"Residual", u:5, gen(){ const a = ri(5,40), b = pick([1.5,2,2.5,3,0.5,4]), x = ri(2,12), obs = Math.round(a+b*x+pick([-6,-4,-3,3,5,7])), pred = r2(a+b*x), res = r2(obs-pred);
   return {q:`The least-squares line is ŷ = ${a} + ${b}x. At x = ${x} the observed y is ${obs}. What is the residual (observed − predicted)?`, ans:res, unit:"", work:`Predicted ŷ = ${a} + ${b}(${x}) = ${pred}. Residual = ${obs} − ${pred} = ${res}.`}; }},
 {k:"rsq", n:"Coefficient of determination", u:5, gen(){ const r = pick([0.3,0.4,0.5,0.6,0.7,0.8,0.9,-0.5,-0.7,-0.9]), v = Math.round(r*r*100);
   return {q:`The correlation between two variables is r = ${r}. What percent of the variation in y is explained by the linear relationship with x?`, ans:v, unit:"%", work:`r² = ${r}² = ${r2(r*r)}, so ${v}%.`}; }},
 {k:"intercept", n:"Intercept", u:5, gen(){ const b = pick([1.5,2,2.5,3,0.8,-1.5,-2]), xb = ri(4,15), yb = ri(30,70), a = r2(yb-b*xb);
   return {q:`A least-squares line has slope b = ${b}, x̄ = ${xb} and ȳ = ${yb}. What is the y-intercept? Round to 2 decimals.`, ans:a, unit:"", work:`a = ȳ − b·x̄ = ${yb} − (${b})(${xb}) = ${a}.`}; }}
];
})();
