/* Credit Sprint AP Calculus BC drills, added to the AB set: Euler's method, series, parametric and polar. Each returns {q, ans, unit, work}. */
(function(){
const pick = a => a[Math.floor(Math.random()*a.length)];
const ri = (a,b) => a + Math.floor(Math.random()*(b-a+1));
const r2 = x => Math.round(x*100)/100, r3 = x => Math.round(x*1000)/1000, r4 = x => Math.round(x*10000)/10000;
const S = n => String(n).replace(/-/g, "−");
const fact = n => n <= 1 ? 1 : n * fact(n - 1);
window.CS_DRILLS = window.CS_DRILLS.concat([
 {k:"euler", n:"Euler's method", u:7, gen(){ const h = pick([0.5,0.25,0.1]), y0 = ri(1,4), kind = pick(["x+y","xy","y"]);
   const f = {"x+y":(x,y)=>x+y, "xy":(x,y)=>x*y, "y":(x,y)=>y}[kind]; let x = 0, y = y0; const w = [];
   for (let i = 0; i < 2; i++) { const s = f(x,y); const y2 = y + s*h; w.push(`${r4(y)} + (${r4(s)})(${h}) = ${r4(y2)}`); y = y2; x += h; }
   return {q:`dy/dx = ${kind === "x+y" ? "x + y" : kind}, y(0) = ${y0}. Use two Euler steps of size ${h} to approximate y(${r2(2*h)}). Round to 3 decimals.`, ans:r3(y), unit:"", work:w.join("; ") + "."}; }},
 {k:"geometric-sum", n:"Geometric series", u:10, gen(){ const a = ri(1,9), r = pick([0.5,0.25,-0.5,0.2,0.75,-0.25]);
   const v = r3(a/(1 - r)); return {q:`Find the sum of the geometric series with first term ${a} and ratio ${S(r)}. Round to 3 decimals.`, ans:v, unit:"", work:`a/(1 − r) = ${a}/(1 − (${S(r)})) ≈ ${v}.`}; }},
 {k:"radius", n:"Radius of convergence", u:10, gen(){ const c = pick([2,3,4,5,6,8,10]);
   return {q:`Find the radius of convergence of Σ (x − 1)ⁿ ÷ (n·${c}ⁿ).`, ans:c, unit:"", work:`Ratio test: |x − 1|/${c} < 1, so R = ${c}.`}; }},
 {k:"taylor-coef", n:"Taylor coefficients", u:10, gen(){ const n = ri(2,5), k = pick([1,2,3,-1,-2]);
   const v = r4(Math.pow(k, n)/fact(n)); return {q:`What is the coefficient of x${"⁰¹²³⁴⁵"[n]} in the Maclaurin series for e^(${S(k)}x)? Round to 4 decimals.`, ans:v, unit:"", work:`(${S(k)})ⁿ/n! with n = ${n}: ${S(Math.pow(k,n))}/${fact(n)} ≈ ${S(v)}.`}; }},
 {k:"param-slope", n:"Parametric slope", u:9, gen(){ const a = ri(1,4), b = ri(1,4), t = ri(1,3);
   const v = r3((3*b*t*t)/(2*a*t)); return {q:`x(t) = ${a === 1 ? "" : a}t², y(t) = ${b === 1 ? "" : b}t³. Find dy/dx at t = ${t}. Round to 3 decimals.`, ans:v, unit:"", work:`dy/dt = ${3*b}t² = ${3*b*t*t}, dx/dt = ${2*a}t = ${2*a*t}. dy/dx = ${3*b*t*t}/${2*a*t} ≈ ${v}.`}; }},
 {k:"polar-area", n:"Polar area", u:9, gen(){ const k = ri(1,6);
   const v = r3(Math.PI*k*k/4); return {q:`Find the area enclosed by the circle r = ${k === 1 ? "" : k}cos θ. Round to 3 decimals.`, ans:v, unit:"", work:`½∫ from −π/2 to π/2 of ${k*k}cos²θ dθ = ${k*k}π/4 ≈ ${v}.`}; }},
 {k:"speed", n:"Speed in the plane", u:9, gen(){ const [a,b] = pick([[3,4],[5,12],[8,15],[6,8],[1,1],[2,5],[7,24]]);
   const v = r3(Math.hypot(a,b)); return {q:`x′(t) = ${a} and y′(t) = ${b} at a moment. Find the speed. Round to 3 decimals.`, ans:v, unit:"", work:`√(${a}² + ${b}²) = √${a*a+b*b} ≈ ${v}.`}; }}
]);
})();
