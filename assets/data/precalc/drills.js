/* Credit Sprint AP® Precalculus drills: calculation generators, so every attempt is new. Each returns {q, ans, unit, work}.
   Answers are exact integers or are rounded as the question says. */
(function(){
const pick = a => a[Math.floor(Math.random()*a.length)];
const ri = (a,b) => a + Math.floor(Math.random()*(b-a+1));
const r2 = x => Math.round(x*100)/100, r3 = x => Math.round(x*1000)/1000;
const S = n => String(n).replace(/-/g, "−");
const sup = n => String(n).split("").map(c => "⁰¹²³⁴⁵⁶⁷⁸⁹"["0123456789".indexOf(c)] || c).join("");
const P = (terms, v = "x") => terms.filter(t => t[0]).map(([c, p], i) => { const a = Math.abs(c), s = c < 0 ? (i ? " − " : "−") : (i ? " + " : "");
  return s + (p === 0 ? a : (a === 1 ? "" : a) + v + (p > 1 ? sup(p) : "")); }).join("") || "0";
const fac = r => r < 0 ? `(x + ${-r})` : r === 0 ? "x" : `(x − ${r})`;
window.CS_DRILLS = [
 {k:"arc", n:"Average rate of change", u:1, gen(){ const a = pick([1,2,-1,3]), b = ri(-5,5), c = ri(-6,6), p = ri(-3,2), q = p + pick([1,2,3,4]); const f = x => a*x*x + b*x + c, v = (f(q)-f(p))/(q-p);
   return {q:`f(x) = ${P([[a,2],[b,1],[c,0]])}. Find the average rate of change of f on [${S(p)}, ${S(q)}].`, ans:v, unit:"", work:`[f(${S(q)}) − f(${S(p)})] ÷ (${S(q)} − ${S(p)}) = (${S(f(q))} − ${S(f(p))}) ÷ ${q-p} = ${S(v)}.`}; }},
 {k:"remainder", n:"Remainder theorem", u:1, gen(){ const co = [ri(-6,6), ri(-5,5), ri(-3,3), pick([1,2,-1])], c = pick([-3,-2,-1,1,2,3]), f = x => co[0] + co[1]*x + co[2]*x*x + co[3]*x**3;
   return {q:`Find the remainder when ${P([[co[3],3],[co[2],2],[co[1],1],[co[0],0]])} is divided by ${fac(c)}.`, ans:f(c), unit:"", work:`Remainder theorem: the remainder is p(${S(c)}) = ${S(f(c))}.`}; }},
 {k:"hole", n:"Holes and asymptotes", u:1, gen(){ const a = pick([-4,-3,-2,-1,1,2,3,5]), c = pick([-5,4,6,-6]);
   return {q:`r(x) = ${fac(a)}(x + 7) ÷ [${fac(a)}${fac(c)}]. At what x-value is the vertical asymptote?`, ans:c, unit:"", work:`${fac(a)} cancels and gives a hole at x = ${S(a)}. ${fac(c)} remains in the denominator, so the vertical asymptote is x = ${S(c)}.`}; }},
 {k:"binom", n:"Binomial coefficients", u:1, gen(){ const n = ri(3,7), k = ri(1,n-1), a = pick([1,2,3,-2]); const C = (n,k) => { let v = 1; for (let i = 1; i <= k; i++) v = v*(n-k+i)/i; return v; }; const v = C(n,k)*a**(n-k);
   return {q:`Find the coefficient of x${k>1?sup(k):""} in (x ${a<0?"−":"+"} ${Math.abs(a)})${sup(n)}.`, ans:v, unit:"", work:`C(${n}, ${k})·(${S(a)})${sup(n-k)} = ${C(n,k)}·${S(a**(n-k))} = ${S(v)}.`}; }},
 {k:"geo", n:"Sequences", u:2, gen(){ if (Math.random() < .5) { const a = ri(-5,20), d = pick([2,3,4,5,-3]), n = ri(5,25); return {q:`An arithmetic sequence has a₀ = ${a} and common difference ${S(d)}. Find aₙ for n = ${n}.`, ans:a+d*n, unit:"", work:`aₙ = a₀ + dn = ${a} + ${S(d)}(${n}) = ${S(a+d*n)}.`}; }
   const g = pick([2,3,5]), r = pick([2,3,-2]), n = ri(3,6); return {q:`A geometric sequence has g₀ = ${g} and ratio ${S(r)}. Find gₙ for n = ${n}.`, ans:g*r**n, unit:"", work:`gₙ = g₀rⁿ = ${g}·(${S(r)})${sup(n)} = ${S(g*r**n)}.`}; }},
 {k:"logs", n:"Evaluate logarithms", u:2, gen(){ const b = pick([2,3,4,5,10]), k = ri(-3,5), v = b**k;
   return {q:`Find log base ${b} of ${k < 0 ? "1/" + b**(-k) : v}.`, ans:k, unit:"", work:`${b}^${S(k)} = ${k < 0 ? "1/" + b**(-k) : v}, so the logarithm is ${S(k)}.`}; }},
 {k:"expeq", n:"Exponential equations", u:2, gen(){ const b = pick([2,3,5]), k = ri(2,5), m = ri(-3,3);
   return {q:`Solve ${b}^(x ${m < 0 ? "+" : "−"} ${Math.abs(m)}) = ${b**k}.`, ans:k+m, unit:"", work:`${b**k} = ${b}${sup(k)}, so x ${m < 0 ? "+" : "−"} ${Math.abs(m)} = ${k} and x = ${S(k+m)}.`}; }},
 {k:"compound", n:"Compound interest", u:2, gen(){ const P0 = pick([1000,2500,5000,800]), r = pick([3,4,5,6,7]), n = pick([1,4,12]), t = pick([3,5,10]); const A = Math.round(P0*(1+r/100/n)**(n*t));
   return {q:`$${P0} is invested at ${r}% annual interest compounded ${{1:"yearly",4:"quarterly",12:"monthly"}[n]}. To the nearest dollar, how much is it worth after ${t} years?`, ans:A, unit:"$", work:`A = ${P0}(1 + ${r/100}/${n})^(${n*t}) ≈ ${A}.`}; }},
 {k:"halflife", n:"Half-life and doubling", u:2, gen(){ const A0 = pick([64,128,256,96,320]), h = pick([2,3,4,5]), m = ri(1,4);
   return {q:`A sample of ${A0} mg has a half-life of ${h} hours. How many mg remain after ${h*m} hours?`, ans:A0/2**m, unit:"mg", work:`${h*m} hours is ${m} half-lives: ${A0}·(1/2)${sup(m)} = ${A0/2**m} mg.`}; }},
 {k:"degrad", n:"Degrees to radians", u:3, gen(){ const d = pick([30,45,60,120,135,150,210,225,240,300,315,330]); const v = r3(d*Math.PI/180);
   return {q:`Convert ${d}° to radians. Round to three decimal places.`, ans:v, unit:"", work:`${d}·π/180 ≈ ${v}.`}; }},
 {k:"period", n:"Period, amplitude, midline", u:3, gen(){ const A = ri(2,9), B = pick([2,3,4,6]), k = ri(-5,5), w = ri(0,2);
   const eq = `y = ${A}sin(${B}x)${k ? (k > 0 ? " + " + k : " − " + -k) : ""}`;
   if (w === 0) return {q:`Find the amplitude of ${eq}.`, ans:A, unit:"", work:`Amplitude = |A| = ${A}.`};
   if (w === 1) return {q:`Find the maximum value of ${eq}.`, ans:A+k, unit:"", work:`Maximum = midline + amplitude = ${S(k)} + ${A} = ${S(A+k)}.`};
   return {q:`Find the period of ${eq}. Round to three decimal places.`, ans:r3(2*Math.PI/B), unit:"", work:`Period = 2π ÷ ${B} ≈ ${r3(2*Math.PI/B)}.`}; }},
 {k:"triangle", n:"Right-triangle trig", u:3, gen(){ const [a,b,c] = pick([[3,4,5],[5,12,13],[8,15,17],[7,24,25]]), m = pick([1,2,3]);
   return {q:`A right triangle has legs ${a*m} and ${b*m}. Find the hypotenuse.`, ans:c*m, unit:"", work:`√(${(a*m)**2} + ${(b*m)**2}) = ${c*m}.`}; }},
 {k:"polar", n:"Polar to rectangular", u:3, gen(){ const r = pick([2,4,6,8,10]), th = pick([[0,"0"],[90,"π/2"],[180,"π"],[60,"π/3"],[120,"2π/3"],[300,"5π/3"]]); const x = r2(r*Math.cos(th[0]*Math.PI/180));
   return {q:`Find the x-coordinate of the polar point (${r}, ${th[1]}). Round to two decimal places.`, ans:x === 0 ? 0 : x, unit:"", work:`x = r cos θ = ${r}cos(${th[1]}) = ${S(x)}.`}; }},
 {k:"det", n:"Determinants and dot products", u:4, gen(){ const [a,b,c,d] = [ri(-6,7),ri(-6,7),ri(-6,7),ri(-6,7)];
   if (Math.random() < .5) return {q:`Find the determinant of [[${S(a)}, ${S(b)}], [${S(c)}, ${S(d)}]].`, ans:a*d-b*c, unit:"", work:`ad − bc = (${S(a)})(${S(d)}) − (${S(b)})(${S(c)}) = ${S(a*d-b*c)}.`};
   return {q:`Find ⟨${S(a)}, ${S(b)}⟩ · ⟨${S(c)}, ${S(d)}⟩.`, ans:a*c+b*d, unit:"", work:`(${S(a)})(${S(c)}) + (${S(b)})(${S(d)}) = ${S(a*c+b*d)}.`}; }}
];
})();
