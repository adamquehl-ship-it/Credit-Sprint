/* Credit Sprint Marketing calculation drills: procedural generators, so every attempt is new.
   Each returns {q, ans, unit, work}. Answers within 1% (or 0.06) are accepted. */
(function(){
const pick = a => a[Math.floor(Math.random()*a.length)];
const rint = (a,b,step=1) => a + step*Math.floor(Math.random()*((b-a)/step+1));
const r2 = x => Math.round(x*100)/100;
const money = x => "$" + Number(x).toLocaleString("en-US", {maximumFractionDigits:2});
const PROD = ["a jacket","a backpack","a blender","a pair of headphones","a desk lamp","a water bottle","a bicycle helmet","a coffee maker"];
window.CS_DRILLS = [
 {k:"markupcost", n:"Selling price from a markup", u:8, gen(){ const c = rint(20,200,5), m = pick([20,25,30,40,50,60,75,100]), p = c*(1+m/100);
   return {q:`A retailer pays ${money(c)} for ${pick(PROD)} and adds a markup of ${m}% on cost. What is the selling price in dollars?`, ans:r2(p), unit:"", work:`Markup = ${m}% × ${c} = ${r2(c*m/100)}. Selling price = ${c} + ${r2(c*m/100)} = ${r2(p)}.`}; }},
 {k:"markupsp", n:"Markup percent on selling price", u:8, gen(){ const c = rint(20,160,10), p = c + rint(10,120,10), m = p - c, it = pick(PROD);
   return {q:`${it[0].toUpperCase()+it.slice(1)} costs a retailer ${money(c)} and sells for ${money(p)}. What is the markup percentage based on the SELLING price?`, ans:r2(m/p*100), unit:"%", work:`Markup = ${p} − ${c} = ${m}. Markup % on selling price = ${m} ÷ ${p} × 100 = ${r2(m/p*100)}%.`}; }},
 {k:"markupon", n:"Markup percent on cost", u:8, gen(){ const c = rint(20,160,10), m = rint(10,100,10), p = c + m;
   return {q:`An item costs ${money(c)} and sells for ${money(p)}. What is the markup percentage based on COST?`, ans:r2(m/c*100), unit:"%", work:`Markup = ${p} − ${c} = ${m}. Markup % on cost = ${m} ÷ ${c} × 100 = ${r2(m/c*100)}%.`}; }},
 {k:"breakevenu", n:"Break-even quantity (units)", u:8, gen(){ const p = rint(10,60,5), v = p - pick([4,5,8,10,12,15]), F = rint(2000,40000,1000), cm = p - v;
   const q = Math.ceil(F/cm);
   return {q:`A firm has fixed costs of ${money(F)} per year. Its product sells for ${money(p)} and the variable cost is ${money(v)} per unit. How many units must it sell to break even? (Round up to a whole unit.)`, ans:q, unit:"", work:`Contribution per unit = ${p} − ${v} = ${cm}. Break-even = ${F} ÷ ${cm} = ${r2(F/cm)}, so ${q} units.`}; }},
 {k:"breakevend", n:"Break-even sales dollars", u:8, gen(){ const F = rint(10000,90000,10000), cmr = pick([20,25,40,50]), d = F/(cmr/100);
   return {q:`Fixed costs are ${money(F)} and every sales dollar contributes ${cmr}% after variable costs. What sales revenue (in dollars) is needed to break even?`, ans:d, unit:"", work:`Break-even sales = fixed costs ÷ contribution margin ratio = ${F} ÷ ${cmr/100} = ${d}.`}; }},
 {k:"profit", n:"Profit at a given volume", u:8, gen(){ const p = rint(20,80,5), v = p - pick([8,10,12,15,20]), F = rint(5000,30000,5000), q = rint(1000,5000,500), pr = q*(p-v)-F;
   return {q:`Price is ${money(p)}, variable cost is ${money(v)} per unit and fixed costs are ${money(F)}. What is the profit (in dollars) if ${q.toLocaleString()} units are sold?`, ans:pr, unit:"", work:`Contribution = ${p} − ${v} = ${p-v} per unit. Total contribution = ${q} × ${p-v} = ${q*(p-v)}. Profit = ${q*(p-v)} − ${F} = ${pr}.`}; }},
 {k:"elastic", n:"Price elasticity of demand", u:8, gen(){ const dp = pick([5,10,20]), k = pick([0.5,1.5,2,3]), dq = dp*k;
   return {q:`A ${dp}% increase in price causes quantity demanded to fall by ${dq}%. What is the price elasticity of demand? (Give the absolute value.)`, ans:k, unit:"", work:`Elasticity = %ΔQ ÷ %ΔP = ${dq} ÷ ${dp} = ${k}. ${k>1?"Greater than 1, so demand is elastic.":k<1?"Less than 1, so demand is inelastic.":"Equal to 1, unit elastic."}`}; }},
 {k:"revchange", n:"Total revenue after a price change", u:8, gen(){ const p = rint(10,50,5), q = rint(100,500,50), pct = pick([10,20,25]), q2 = Math.round(q*(1+pick([5,10,30])/100));
   const p2 = Math.round(p*(1-pct/100)*100)/100, r1 = p*q, r2n = r2(p2*q2);
   return {q:`A firm sells ${q} units at ${money(p)}. After a ${pct}% price cut the price is ${money(p2)} and it sells ${q2} units. What is the new total revenue in dollars?`, ans:r2n, unit:"", work:`New revenue = price × quantity = ${p2} × ${q2} = ${r2n}. (Old revenue was ${r1}.)`}; }},
 {k:"share", n:"Market share", u:5, gen(){ const tot = rint(20,200,10)*1000000, sh = pick([5,8,10,12,15,20,25,30]), s = tot*sh/100;
   return {q:`Industry sales are ${money(tot)}. A firm's sales are ${money(s)}. What is the firm's market share?`, ans:sh, unit:"%", work:`Market share = ${s} ÷ ${tot} × 100 = ${sh}%.`}; }},
 {k:"relshare", n:"Relative market share", u:2, gen(){ const lead = pick([20,25,30,40]), me = pick([5,10,12,15]), rs = me/lead;
   return {q:`Your product has a ${me}% market share and the market leader has ${lead}%. What is your relative market share? (Give a decimal.)`, ans:r2(rs), unit:"", work:`Relative share = ${me} ÷ ${lead} = ${r2(rs)}.`}; }},
 {k:"adopt", n:"Adopter categories", u:4, gen(){ const [name,pc] = pick([["innovators",2.5],["early adopters",13.5],["early majority",34],["late majority",34],["laggards",16]]), N = pick([2000,4000,10000,20000]);
   return {q:`A new product will eventually be bought by ${N.toLocaleString()} people. About how many are ${name}? (Use the standard diffusion percentages.)`, ans:N*pc/100, unit:"", work:`${name[0].toUpperCase()+name.slice(1)} are ${pc}% of adopters: ${N} × ${pc/100} = ${N*pc/100}.`}; }},
 {k:"grp", n:"Gross rating points", u:10, gen(){ const r = pick([20,30,40,50,60,70]), f = pick([2,3,4,5,6]);
   return {q:`An advertising campaign reaches ${r}% of the target audience an average of ${f} times. How many gross rating points (GRPs) is that?`, ans:r*f, unit:"", work:`GRPs = reach × frequency = ${r} × ${f} = ${r*f}.`}; }},
 {k:"cpm", n:"Cost per thousand (CPM)", u:10, gen(){ const aud = pick([200,400,500,800,1000,2000])*1000, cost = pick([4000,6000,8000,10000,20000,30000]), cpm = cost/(aud/1000);
   return {q:`A magazine ad costs ${money(cost)} and reaches ${aud.toLocaleString()} readers. What is the cost per thousand (CPM) in dollars?`, ans:r2(cpm), unit:"", work:`CPM = cost ÷ (audience ÷ 1,000) = ${cost} ÷ ${aud/1000} = ${r2(cpm)}.`}; }},
 {k:"ctr", n:"Click-through rate", u:10, gen(){ const imp = pick([10000,20000,50000,100000]), pct = pick([0.5,1,2,2.5,4]), cl = imp*pct/100;
   return {q:`An online ad is shown ${imp.toLocaleString()} times and clicked ${cl.toLocaleString()} times. What is the click-through rate?`, ans:pct, unit:"%", work:`CTR = clicks ÷ impressions = ${cl} ÷ ${imp} × 100 = ${pct}%.`}; }},
 {k:"conv", n:"Conversion rate", u:10, gen(){ const vis = pick([2000,4000,5000,8000,10000]), pct = pick([1,2,3,4,5]), buy = vis*pct/100;
   return {q:`A website had ${vis.toLocaleString()} visitors and ${buy.toLocaleString()} of them bought something. What is the conversion rate?`, ans:pct, unit:"%", work:`Conversion rate = purchases ÷ visitors × 100 = ${buy} ÷ ${vis} × 100 = ${pct}%.`}; }},
 {k:"cash", n:"Cash discount", u:8, gen(){ const inv = rint(500,5000,500), d = pick([1,2,3]), pay = inv*(1-d/100);
   return {q:`An invoice for ${money(inv)} has terms of ${d}/10, net 30. How much (in dollars) does the buyer pay if it pays within 10 days?`, ans:r2(pay), unit:"", work:`Discount = ${d}% × ${inv} = ${r2(inv*d/100)}. Payment = ${inv} − ${r2(inv*d/100)} = ${r2(pay)}.`}; }},
 {k:"chain", n:"Chain discount", u:8, gen(){ const L = rint(100,1000,100), a = pick([10,20,30]), b = pick([5,10]), net = L*(1-a/100)*(1-b/100);
   return {q:`A manufacturer offers a list price of ${money(L)} less trade discounts of ${a}% and ${b}%. What is the net price in dollars?`, ans:r2(net), unit:"", work:`After ${a}%: ${L} × ${1-a/100} = ${r2(L*(1-a/100))}. After ${b}%: ${r2(L*(1-a/100))} × ${1-b/100} = ${r2(net)}.`}; }},
 {k:"turn", n:"Inventory turnover", u:9, gen(){ const inv = pick([20000,40000,50000,80000]), t = pick([3,4,5,6,8]), cogs = inv*t;
   return {q:`A store's cost of goods sold for the year is ${money(cogs)} and its average inventory at cost is ${money(inv)}. What is its inventory turnover?`, ans:t, unit:"", work:`Turnover = COGS ÷ average inventory = ${cogs} ÷ ${inv} = ${t}.`}; }},
 {k:"clv", n:"Customer lifetime value", u:2, gen(){ const prof = pick([50,80,100,120,150]), yrs = pick([3,4,5,8,10]), acq = pick([40,60,100,120]), v = prof*yrs-acq;
   return {q:`A customer brings ${money(prof)} in profit per year and stays for ${yrs} years. It cost ${money(acq)} to win the customer. What is the customer's net lifetime value in dollars?`, ans:v, unit:"", work:`Lifetime profit = ${prof} × ${yrs} = ${prof*yrs}. Net value = ${prof*yrs} − ${acq} = ${v}.`}; }},
 {k:"margin", n:"Gross margin percent", u:8, gen(){ const p = pick([40,50,80,100,120,200]), c = Math.round(p*pick([0.4,0.5,0.6,0.75])), m = (p-c)/p*100;
   return {q:`A product sells for ${money(p)} and costs ${money(c)}. What is the gross margin percentage?`, ans:r2(m), unit:"%", work:`Gross margin % = (${p} − ${c}) ÷ ${p} × 100 = ${r2(m)}%.`}; }}
];
})();
