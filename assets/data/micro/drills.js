/* Credit Sprint Microeconomics calculation drills: procedural generators, so every attempt is new.
   Each returns {q, ans, unit, work}. unit: "$", "%", "" (plain number). */
(function(){
const pick = a => a[Math.floor(Math.random()*a.length)];
const rint = (a,b,step=1) => a + step*Math.floor(Math.random()*((b-a)/step+1));
const r2 = x => Math.round(x*100)/100;
const $ = n => "$" + Number(n).toLocaleString();
window.CS_DRILLS = [
 {k:"oc", n:"Opportunity cost", u:1, gen(){ const x = pick([10,20,25,40,50]), m = pick([0.5,1.5,2,3,4]), y = x*m;
   return {q:`In one day, a worker can make either ${x} shirts or ${y} hats. What is the opportunity cost of one shirt, in hats?`, ans:r2(y/x), unit:"", work:`Giving up ${y} hats for ${x} shirts: ${y} ÷ ${x} = ${r2(y/x)} hats per shirt.`}; }},
 {k:"mu", n:"Marginal utility per dollar", u:1, gen(){ const p = pick([2,4,5,8,10]), k = rint(2,12), mu = p*k;
   return {q:`The marginal utility of the last slice of pizza is ${mu} utils and a slice costs $${p}. What is the marginal utility per dollar?`, ans:k, unit:"", work:`${mu} ÷ $${p} = ${k} utils per dollar.`}; }},
 {k:"ped", n:"Price elasticity (midpoint)", u:2, gen(){ const p1 = rint(4,20), p2 = p1 + pick([1,2,3,4]), q1 = rint(10,60)*10, q2 = q1 - rint(1,Math.floor(q1/20))*10;
   const pq = (q2-q1)/((q1+q2)/2), pp = (p2-p1)/((p1+p2)/2), e = r2(Math.abs(pq/pp));
   return {q:`When the price of concert tickets rises from $${p1} to $${p2}, quantity demanded falls from ${q1} to ${q2}. Using the midpoint method, what is the price elasticity of demand? (Round to 2 decimals.)`, ans:e, unit:"", work:`%ΔQ = ${q2-q1} ÷ ${(q1+q2)/2} = ${r2(pq*100)}%. %ΔP = ${p2-p1} ÷ ${(p1+p2)/2} = ${r2(pp*100)}%. |${r2(pq*100)} ÷ ${r2(pp*100)}| = ${e}. ${e>1?"Elastic.":e<1?"Inelastic.":"Unit elastic."}`}; }},
 {k:"tr", n:"Total revenue", u:2, gen(){ const p1 = rint(5,30), p2 = p1 + pick([-3,-2,-1,1,2,3,5]), q1 = rint(20,90)*10, q2 = q1 + (p2>p1?-1:1)*rint(2,15)*10;
   const d = p2*q2 - p1*q1;
   return {q:`A store changes its price from $${p1} to $${p2}, and sales go from ${q1} to ${q2} units. By how much does total revenue change? (Use a negative number for a decrease.)`, ans:d, unit:"$", work:`New TR = $${p2} × ${q2} = ${$(p2*q2)}. Old TR = $${p1} × ${q1} = ${$(p1*q1)}. Change = ${$(d)}. ${(p2-p1)*d<0?"Price and TR moved in opposite directions, so demand is elastic here.":d===0?"TR unchanged: unit elastic.":"Price and TR moved together, so demand is inelastic here."}`}; }},
 {k:"eq", n:"Equilibrium from equations", u:2, gen(){ const b = pick([2,3,4,5]), d = pick([1,2,3,4]), P = rint(4,20), Q = rint(20,80), a = Q + b*P, c = Q - d*P;
   return {q:`Demand is Qd = ${a} − ${b}P and supply is Qs = ${c<0?`−${-c}`:c} + ${d}P. What is the equilibrium price?`, ans:P, unit:"$", work:`${a} − ${b}P = ${c} + ${d}P → ${a - c} = ${b+d}P → P = $${P}. Quantity = ${Q}.`}; }},
 {k:"cs", n:"Consumer surplus", u:2, gen(){ const b = pick([0.5,1,2]), a = rint(20,60,2), p = rint(4, a-6, 2), q = (a-p)/b;
   return {q:`Demand is P = ${a} − ${b}Q and the market price is $${p}. What is consumer surplus?`, ans:r2(0.5*q*(a-p)), unit:"$", work:`Quantity at $${p}: ${a} − ${b}Q = ${p} → Q = ${r2(q)}. CS = ½ × ${r2(q)} × (${a} − ${p}) = ${$(r2(0.5*q*(a-p)))}.`}; }},
 {k:"tax", n:"Tax revenue and deadweight loss", u:2, gen(){ const t = pick([1,2,3,4,5]), q0 = rint(10,40)*10, qt = q0 - rint(2,8)*10, dwl = r2(0.5*t*(q0-qt)), dl = Math.random()<.5;
   return {q:`Before a $${t} per-unit tax, ${q0} units are sold. After the tax, ${qt} units are sold. What is the ${dl?"deadweight loss":"government's tax revenue"}?`, ans:dl?dwl:t*qt, unit:"$", work:dl?`DWL = ½ × $${t} × (${q0} − ${qt}) = ${$(dwl)}.`:`Revenue = $${t} × ${qt} = ${$(t*qt)}.`}; }},
 {k:"mp", n:"Marginal product", u:3, gen(){ const L = rint(2,8), tp1 = rint(20,80), mp = rint(2,15);
   return {q:`With ${L} workers a bakery makes ${tp1} loaves. With ${L+1} workers it makes ${tp1+mp}. What is the marginal product of worker ${L+1}?`, ans:mp, unit:"", work:`${tp1+mp} − ${tp1} = ${mp} loaves.`}; }},
 {k:"mc", n:"Marginal cost", u:3, gen(){ const q = rint(3,12), tc = rint(100,400,5), mc = rint(5,60);
   return {q:`Total cost is $${tc} at ${q} units and $${tc+mc} at ${q+1} units. What is the marginal cost of unit ${q+1}?`, ans:mc, unit:"$", work:`MC = ΔTC ÷ ΔQ = ($${tc+mc} − $${tc}) ÷ 1 = $${mc}.`}; }},
 {k:"atc", n:"Average total cost", u:3, gen(){ const q = pick([10,20,25,40,50]), fc = rint(10,60)*10, avc = rint(4,30), tc = fc + avc*q;
   return {q:`A firm's fixed cost is $${fc} and its variable cost of ${q} units is $${avc*q}. What is average total cost at ${q} units?`, ans:r2(tc/q), unit:"$", work:`ATC = ($${fc} + $${avc*q}) ÷ ${q} = $${r2(tc/q)}.`}; }},
 {k:"profit", n:"Profit or loss", u:3, gen(){ const p = rint(10,40), q = rint(10,80,5), atc = p + pick([-6,-4,-3,-2,2,3,5]), pr = (p-atc)*q;
   return {q:`A perfectly competitive firm sells ${q} units at $${p}. Its average total cost at that output is $${atc}. What is its economic profit? (Use a negative number for a loss.)`, ans:pr, unit:"$", work:`(P − ATC) × Q = ($${p} − $${atc}) × ${q} = ${$(pr)}.`}; }},
 {k:"monop", n:"Monopoly price", u:4, gen(){ const b = pick([1,2]), c = rint(4,20,2), a = c + b*2*rint(5,20), q = (a-c)/(2*b), p = a - b*q;
   return {q:`A monopoly faces demand P = ${a} − ${b===1?"":b}Q and has a constant marginal cost of $${c}. What price maximizes its profit?`, ans:p, unit:"$", work:`MR = ${a} − ${2*b}Q. Set MR = MC: ${a} − ${2*b}Q = ${c} → Q = ${q}. Price from demand: ${a} − ${b}(${q}) = $${p}.`}; }},
 {k:"mrp", n:"Marginal revenue product", u:5, gen(){ const mp = rint(3,20), p = pick([2,4,5,8,10,12,15]);
   return {q:`The 5th worker adds ${mp} units of output, which sells for $${p} each in a perfectly competitive market. What is that worker's MRP?`, ans:mp*p, unit:"$", work:`MRP = MP × P = ${mp} × $${p} = $${mp*p}.`}; }},
 {k:"hire", n:"How many workers to hire", u:5, gen(){ const p = pick([2,4,5,10]), mps = []; let m = rint(16,24); for (let i=0;i<6;i++){ mps.push(m); m -= rint(2,4); if (m < 1) m = 1; }
   const w = p * mps[rint(1,4)], n = mps.filter(x=>x*p>=w).length;
   return {q:`Output sells for $${p}. The marginal products of workers 1–6 are ${mps.join(", ")}. The wage is $${w}. How many workers will the firm hire?`, ans:n, unit:"", work:`MRP = MP × $${p}: ${mps.map(x=>"$"+x*p).join(", ")}. Hire while MRP ≥ wage ($${w}): ${n} workers.`}; }},
 {k:"atr", n:"Average tax rate", u:6, gen(){ const inc = rint(30,150,5)*1000, tax = Math.round(inc*pick([0.08,0.1,0.12,0.15,0.2,0.24])), r = r2(tax/inc*100);
   return {q:`A household earning ${$(inc)} pays ${$(tax)} in income tax. What is its average tax rate?`, ans:r, unit:"%", work:`${$(tax)} ÷ ${$(inc)} × 100 = ${r}%.`}; }},
 {k:"ext", n:"Optimal corrective tax", u:6, gen(){ const mec = rint(2,15), mpc = rint(10,40);
   return {q:`At the socially optimal quantity, marginal private cost is $${mpc} and marginal social cost is $${mpc+mec}. What per-unit tax moves the market to the social optimum?`, ans:mec, unit:"$", work:`Tax = marginal external cost = $${mpc+mec} − $${mpc} = $${mec}.`}; }}
];
})();
