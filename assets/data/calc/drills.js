/* Credit Sprint AP Calculus drills: calculation generators, so every attempt is new. Each returns {q, ans, unit, work}.
   Answers are exact integers or are rounded as the question says. */
(function(){
const pick = a => a[Math.floor(Math.random()*a.length)];
const ri = (a,b) => a + Math.floor(Math.random()*(b-a+1));
const r2 = x => Math.round(x*100)/100, r3 = x => Math.round(x*1000)/1000;
const S = n => String(n).replace(/-/g, "−");
const fac = r => r < 0 ? `(x + ${-r})` : r === 0 ? "x" : `(x − ${r})`;
const sup = n => String(n).split("").map(c => "⁰¹²³⁴⁵⁶⁷⁸⁹"["0123456789".indexOf(c)] || c).join("");
/* polynomial text from [[coef, power], …] */
const P = (terms, v = "x") => terms.filter(t => t[0]).map(([c, p], i) => { const a = Math.abs(c), s = c < 0 ? (i ? " − " : "−") : (i ? " + " : "");
  return s + (p === 0 ? a : (a === 1 ? "" : a) + v + (p > 1 ? sup(p) : "")); }).join("") || "0";
window.CS_DRILLS = [
 {k:"limit-factor", n:"Limits by factoring", u:1, gen(){ const a = pick([1,2,3,4,5]), b = pick([1,2,3,4,6,7]);
   return {q:`Find lim(x→${a}) (${P([[1,2],[b-a,1],[-a*b,0]])}) ÷ (x − ${a}).`, ans:a + b, unit:"", work:`The top factors as (x − ${a})(x + ${b}). Cancel (x − ${a}) and substitute: ${a} + ${b} = ${a + b}.`}; }},
 {k:"limit-infinity", n:"Limits at infinity", u:1, gen(){ const p = ri(2,9), q = pick([1,2,3,4,5]), n = pick([2,3]);
   const v = r2(p/q); return {q:`Find lim(x→∞) (${p}x${sup(n)} + 5x − 1) ÷ (${q}x${sup(n)} − x + 7). Round to 2 decimals.`, ans:v, unit:"", work:`Equal degrees, so the limit is the ratio of leading coefficients: ${p}/${q} ≈ ${v}.`}; }},
 {k:"power-rule", n:"Power rule", u:2, gen(){ const a = ri(1,5), n = ri(2,5), b = ri(-6,6), x = ri(-3,3);
   const v = a*n*Math.pow(x, n-1) + b; return {q:`f(x) = ${P([[a,n],[b,1],[ri(1,9),0]])}. Find f′(${S(x)}).`, ans:v, unit:"", work:`f′(x) = ${P([[a*n,n-1],[b,0]])}, so f′(${S(x)}) = ${S(v)}.`}; }},
 {k:"tangent-slope", n:"Tangent line slope", u:2, gen(){ const a = ri(1,3), b = ri(-5,5), x = ri(-2,4);
   const v = 3*a*x*x + 2*b*x; return {q:`What is the slope of the line tangent to y = ${P([[a,3],[b,2]])} at x = ${S(x)}?`, ans:v, unit:"", work:`y′ = ${P([[3*a,2],[2*b,1]])}. At x = ${S(x)}: ${S(v)}.`}; }},
 {k:"product-rule", n:"Product and quotient rules", u:2, gen(){ const f = ri(-4,6), fp = ri(-4,5), g = ri(1,6), gp = ri(-4,5), quo = Math.random() < 0.4;
   if (quo) { const v = r2((fp*g - f*gp)/(g*g)); return {q:`f(2) = ${S(f)}, f′(2) = ${S(fp)}, g(2) = ${g}, g′(2) = ${S(gp)}. Find (f/g)′(2). Round to 2 decimals.`, ans:v, unit:"", work:`(f′g − fg′)/g² = (${S(fp*g)} − ${S(f*gp)})/${g*g} ≈ ${S(v)}.`}; }
   const v = fp*g + f*gp; return {q:`f(2) = ${S(f)}, f′(2) = ${S(fp)}, g(2) = ${g}, g′(2) = ${S(gp)}. Find (fg)′(2).`, ans:v, unit:"", work:`f′g + fg′ = (${S(fp)})(${g}) + (${S(f)})(${S(gp)}) = ${S(v)}.`}; }},
 {k:"chain-rule", n:"Chain rule", u:3, gen(){ const m = ri(2,5), b = ri(-3,3), n = ri(2,4), x = ri(-1,2);
   const v = n*Math.pow(m*x + b, n-1)*m; return {q:`f(x) = (${m}x ${b < 0 ? "−" : "+"} ${Math.abs(b)})${sup(n)}. Find f′(${S(x)}).`, ans:v, unit:"", work:`f′(x) = ${n}(${m}x ${b < 0 ? "−" : "+"} ${Math.abs(b)})${n > 2 ? sup(n-1) : ""}·${m}. At x = ${S(x)} the inside is ${S(m*x+b)}, so f′ = ${S(v)}.`}; }},
 {k:"implicit", n:"Implicit slope", u:3, gen(){ const x = pick([3,5,6,8,-3,-4]), y = pick([4,12,8,6,4,3]), r = x*x + y*y;
   const v = r2(-x/y); return {q:`For x² + y² = ${r}, find dy/dx at (${S(x)}, ${y}). Round to 2 decimals.`, ans:v, unit:"", work:`dy/dx = −x/y = −(${S(x)})/${y} ≈ ${S(v)}.`}; }},
 {k:"inverse-derivative", n:"Inverse function derivative", u:3, gen(){ const a = ri(1,3), k = ri(1,4), c = ri(-3,3), x = ri(-2,2);
   const b = a*x*x*x + k*x + c, d = 3*a*x*x + k, v = r3(1/d);
   return {q:`f(x) = ${P([[a,3],[k,1],[c,0]])} and g = f⁻¹. Find g′(${S(b)}). Round to 3 decimals.`, ans:v, unit:"", work:`f(${S(x)}) = ${S(b)}, and f′(${S(x)}) = ${d}. g′(${S(b)}) = 1/${d} ≈ ${v}.`}; }},
 {k:"related-rates", n:"Related rates (circle)", u:4, gen(){ const r = ri(2,12), dr = pick([1,2,3,0.5]);
   const v = r2(2*Math.PI*r*dr); return {q:`The radius of a circle grows at ${dr} cm/s. How fast is the area growing when r = ${r} cm? Round to 2 decimals.`, ans:v, unit:" cm²/s", work:`dA/dt = 2πr·dr/dt = 2π(${r})(${dr}) ≈ ${v} cm²/s.`}; }},
 {k:"linear-approx", n:"Linear approximation", u:4, gen(){ const a = pick([4,9,16,25,36,49,64,81,100]), d = pick([1,-1,2,-2,3]), r = Math.sqrt(a);
   const v = r3(r + d/(2*r)); return {q:`Use the tangent line to y = √x at x = ${a} to approximate √${a + d}. Round to 3 decimals.`, ans:v, unit:"", work:`L(x) = ${r} + (1/${2*r})(x − ${a}). L(${a+d}) = ${r} ${d < 0 ? "−" : "+"} ${Math.abs(d)}/${2*r} ≈ ${v}.`}; }},
 {k:"velocity", n:"Velocity and acceleration", u:4, gen(){ const a = ri(1,3), b = ri(-6,6), c = ri(-5,5), t = ri(1,4), acc = Math.random() < 0.5;
   const v = 3*a*t*t + 2*b*t + c, ac = 6*a*t + 2*b;
   return {q:`s(t) = ${P([[a,3],[b,2],[c,1]], "t")}. Find the ${acc ? "acceleration" : "velocity"} at t = ${t}.`, ans:acc ? ac : v, unit:"", work:acc ? `a(t) = s″(t) = ${P([[6*a,1],[2*b,0]], "t")}, so a(${t}) = ${S(ac)}.` : `v(t) = s′(t) = ${P([[3*a,2],[2*b,1],[c,0]], "t")}, so v(${t}) = ${S(v)}.`}; }},
 {k:"lhospital", n:"L'Hospital's Rule", u:4, gen(){ const k = ri(2,7), m = ri(1,5);
   const v = r2(k/m); return {q:`Find lim(x→0) (e^(${k}x) − 1) ÷ (${m === 1 ? "" : m}x). Round to 2 decimals.`, ans:v, unit:"", work:`0/0, so differentiate top and bottom: ${k}e^(${k}x)/${m} → ${k}/${m} ≈ ${v}.`}; }},
 {k:"critical-points", n:"Relative extrema", u:5, gen(){ const p = ri(-3,2), q = p + ri(1,4), max = Math.random() < 0.5;
   return {q:`f′(x) = 3${fac(p)}${fac(q)}. At what x does f have a relative ${max ? "maximum" : "minimum"}?`, ans:max ? p : q, unit:"", work:`f′ is a parabola opening up with zeros ${S(p)} and ${q}: + then − at ${S(p)} (maximum), − then + at ${q} (minimum).`}; }},
 {k:"mvt", n:"Mean Value Theorem", u:5, gen(){ const a = ri(-2,2), b = a + ri(1,4), c2 = ri(1,3);
   const avg = r2((c2*b*b - c2*a*a)/(b - a)); return {q:`For f(x) = ${c2 === 1 ? "" : c2}x² on [${S(a)}, ${b}], find c with f′(c) equal to the average rate of change.`, ans:(a + b)/2, unit:"", work:`Average rate = ${S(avg)}. f′(c) = ${2*c2}c = ${S(avg)} gives c = ${S((a+b)/2)}, the midpoint.`}; }},
 {k:"definite-integral", n:"Definite integrals", u:6, gen(){ const a = ri(1,4), b = ri(-4,4), lo = ri(-1,1), hi = lo + ri(1,3);
   const val = r2((a*(hi**3 - lo**3)) + b*(hi*hi - lo*lo)/2);
   return {q:`Find ∫ from ${S(lo)} to ${hi} of (${P([[3*a,2],[b,1]])}) dx. Round to 2 decimals.`, ans:val, unit:"", work:`Antiderivative: ${P([[a,3],[b/2,2]])}. Evaluate from ${S(lo)} to ${hi}: ${S(val)}.`}; }},
 {k:"riemann", n:"Riemann sums", u:6, gen(){ const ys = Array.from({length:5}, () => ri(1,12)), h = pick([1,2,0.5]), kind = pick(["left","right","trapezoid"]);
   const L = h*(ys[0]+ys[1]+ys[2]+ys[3]), R = h*(ys[1]+ys[2]+ys[3]+ys[4]), T = (L + R)/2, v = r2(kind === "left" ? L : kind === "right" ? R : T);
   return {q:`f(0) = ${ys[0]}, f(${h}) = ${ys[1]}, f(${2*h}) = ${ys[2]}, f(${3*h}) = ${ys[3]}, f(${4*h}) = ${ys[4]}. Approximate ∫ from 0 to ${4*h} of f(x) dx with a ${kind} sum of 4 equal subintervals.`, ans:v, unit:"", work: kind === "trapezoid" ? `Average of the left sum ${r2(L)} and right sum ${r2(R)}: ${v}.` : `${h} × (sum of the ${kind}-endpoint heights) = ${v}.`}; }},
 {k:"ftc-chain", n:"FTC with the chain rule", u:6, gen(){ const k = ri(2,4), x = ri(1,3);
   const v = r3(Math.cos(Math.pow(x, k))*k*Math.pow(x, k-1)); return {q:`F(x) = ∫ from 0 to x${sup(k)} of cos t dt. Find F′(${x}). Round to 3 decimals (radians).`, ans:v, unit:"", work:`F′(x) = cos(x${sup(k)})·${k}x${k > 2 ? sup(k-1) : ""}. At x = ${x}: cos(${Math.pow(x,k)})·${k*Math.pow(x,k-1)} ≈ ${S(v)}.`}; }},
 {k:"exp-growth", n:"Exponential growth", u:7, gen(){ const y0 = pick([50,100,200,500]), T = ri(2,6), m = pick([2,3]), n = ri(2,3);
   return {q:`dP/dt = kP. P(0) = ${y0} and P(${T}) = ${y0*m}. Find P(${T*n}).`, ans:y0*Math.pow(m, n), unit:"", work:`P multiplies by ${m} every ${T} units of time. After ${n} periods: ${y0}·${m}${sup(n)} = ${y0*Math.pow(m,n)}.`}; }},
 {k:"half-life", n:"Half-life", u:7, gen(){ const k = pick([0.05,0.1,0.2,0.02,0.25]);
   const v = r2(Math.log(2)/k); return {q:`A substance decays with dA/dt = −${k}A. Find its half-life. Round to 2 decimals.`, ans:v, unit:"", work:`Half-life = ln 2 / ${k} ≈ ${v}.`}; }},
 {k:"average-value", n:"Average value", u:8, gen(){ const a = ri(1,3), lo = 0, hi = ri(1,4);
   return {q:`Find the average value of f(x) = ${a === 1 ? "" : a}x² on [0, ${hi}]. Round to 2 decimals.`, ans:r2(a*hi*hi/3), unit:"", work:`(1/${hi})∫₀^${hi} ${a === 1 ? "" : a}x² dx = (1/${hi})(${a}·${hi}³/3) = ${r2(a*hi*hi/3)}.`}; }},
 {k:"area-between", n:"Area between curves", u:8, gen(){ const p = ri(1,5), k = ri(1,2);
   const v = r2(k*Math.pow(p,3)/6); return {q:`Find the area between y = ${k === 1 ? "" : k}x(${p} − x) and the x-axis. Round to 2 decimals.`, ans:v, unit:"", work:`The curve meets the axis at 0 and ${p}. ∫₀^${p} ${k === 1 ? "" : k}(${p}x − x²) dx = ${k}·${p}³/6 ≈ ${v}.`}; }},
 {k:"disc-volume", n:"Disc method", u:8, gen(){ const b = ri(1,9);
   const v = r2(Math.PI*b*b/2); return {q:`The region under y = √x from 0 to ${b} is revolved about the x-axis. Find the volume. Round to 2 decimals.`, ans:v, unit:"", work:`V = π∫₀^${b} x dx = π·${b}²/2 ≈ ${v}.`}; }},
 {k:"distance", n:"Total distance", u:8, gen(){ const p = ri(1,4), T = p + ri(1,3);
   const v = r2(p*p/2 + (T - p)*(T - p)/2); return {q:`v(t) = t − ${p} for 0 ≤ t ≤ ${T}. Find the total distance traveled.`, ans:v, unit:"", work:`v changes sign at t = ${p}. Distance = ${p}²/2 + ${T - p}²/2 = ${v}.`}; }}
];
})();
