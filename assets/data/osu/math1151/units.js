/* Ohio State MATH 1151 (Calculus I): unit layout for Fisher students, with business applications. All wording is original. */
(function(){
const META = {
 1:{name:"Functions, Limits and Continuity", short:"Limits",
  summary:"A limit describes what a function approaches near a point. Limits define continuity and lead directly to the derivative. In business models they describe what happens to average cost, price or profit as output grows very large.",
  more:["Evaluate a limit by direct substitution, then by factoring, rationalizing or using the dominant terms at infinity.","A function is continuous at a point if the limit exists, the function is defined there and the two are equal. The Intermediate Value Theorem needs continuity on a closed interval.","As output q grows large, average cost A(q) = C(q) ÷ q often approaches the variable cost per unit, a horizontal asymptote."],
  traps:["A limit can exist even if the function is undefined at that point.","Limits at infinity compare the highest powers, not every term."]},
 2:{name:"The Derivative: Definition and Rules", short:"Derivative rules",
  summary:"The derivative is the instantaneous rate of change, the slope of the tangent line. Power, product and quotient rules compute it quickly. In business, the derivative of cost, revenue or profit is a marginal quantity.",
  more:["f′(x) = lim h→0 [f(x+h) − f(x)] ÷ h. Power rule: d/dx xⁿ = n·xⁿ⁻¹.","Marginal cost is C′(q): the approximate cost of producing one more unit. Marginal revenue is R′(q) and marginal profit is P′(q).","The tangent line at x = a is y = f(a) + f′(a)(x − a)."],
  traps:["The product rule is not (f′)(g′).","A marginal value is an approximation of the next unit, not the exact cost of it."]},
 3:{name:"Chain Rule, Implicit and Exponential Functions", short:"Chain & implicit",
  summary:"The chain rule differentiates a function inside another function. Implicit differentiation finds slopes when y is not isolated. Exponential and logarithmic functions model growth, interest and decay.",
  more:["Chain rule: d/dx f(g(x)) = f′(g(x))·g′(x). Also d/dx eᵍ = g′eᵍ and d/dx ln g = g′ ÷ g.","Implicit differentiation: differentiate both sides with respect to x, treating y as a function of x, then solve for dy/dx.","If f has an inverse, (f⁻¹)′(b) = 1 ÷ f′(a) where f(a) = b."],
  traps:["Forgetting the inner derivative is the most common chain-rule error.","d/dx of 2ˣ is 2ˣ·ln 2, not x·2ˣ⁻¹."]},
 4:{name:"Rates, Linear Approximation and L'Hôpital", short:"Rates in context",
  summary:"Derivatives describe rates in context: velocity, growth, and how a quantity changes in relation to another. Related rates link changing quantities, linear approximation estimates small changes, and L'Hôpital's rule resolves indeterminate limits.",
  more:["Related rates: write an equation linking the variables, differentiate with respect to time, then substitute the known values.","Linear approximation: f(x) ≈ f(a) + f′(a)(x − a) when x is close to a.","L'Hôpital's rule applies to 0/0 or ∞/∞ forms: lim f/g = lim f′/g′ if the second limit exists."],
  traps:["Substitute the numbers only after differentiating in related-rates problems.","L'Hôpital requires an indeterminate form, not any quotient."]},
 5:{name:"Curve Analysis and Optimization", short:"Optimization",
  summary:"The first derivative shows where a function increases or decreases and locates extrema. The second derivative shows concavity and inflection points. Optimization finds the best value of a business quantity such as profit or area.",
  more:["Critical points occur where f′ = 0 or f′ is undefined. Check endpoints on a closed interval.","First-derivative test: f′ changes from positive to negative at a local maximum. Second-derivative test: f″ < 0 at a critical point means a local maximum.","Profit is maximized where marginal revenue equals marginal cost, provided the second derivative of profit is negative."],
  traps:["A critical point is not automatically a maximum or minimum.","An inflection point needs a change in concavity, not just f″ = 0."]},
 6:{name:"Integration and Accumulation", short:"Integration & FTC",
  summary:"The definite integral accumulates change: area under a rate curve. The Fundamental Theorem of Calculus links integrals and derivatives. Substitution reverses the chain rule. Integrating marginal cost gives total cost change.",
  more:["Riemann sums approximate the definite integral with rectangles. ∫ₐᵇ f(x) dx = F(b) − F(a) where F′ = f.","Part 1 of the FTC: d/dx ∫ₐˣ f(t) dt = f(x). Part 2: ∫ₐᵇ f′(x) dx = f(b) − f(a).","The integral of marginal cost from q = a to q = b is the change in total cost between those outputs."],
  traps:["Do not forget + C on an indefinite integral.","In u-substitution, change the limits with the variable on a definite integral."]},
 7:{name:"Differential Equations and Growth Models", short:"Growth models",
  summary:"A differential equation relates a function to its derivative. Exponential growth and decay, continuous compounding and logistic growth are the main models, and separation of variables solves many of them.",
  more:["dy/dt = ky has the solution y = y₀eᵏᵗ. Doubling time = ln 2 ÷ k.","Continuous compounding at rate r grows an amount A to A·eʳᵗ.","Logistic growth dP/dt = kP(1 − P/L) is fastest at P = L/2 and levels off at the carrying capacity L."],
  traps:["Separate variables before integrating.","Half-life and doubling time do not depend on the starting amount."]},
 8:{name:"Applications of Integration", short:"Integral applications",
  summary:"Integrals compute area between curves, average value and volumes of solids. In economics, the area between a demand curve and the price line is consumer surplus.",
  more:["Area between curves = ∫ (top − bottom) dx.","Average value of f on [a, b] = (1 ÷ (b − a)) ∫ₐᵇ f(x) dx.","Disk method: V = π ∫ [R(x)]² dx. Consumer surplus = area between the demand curve and the market price."],
  traps:["Subtract the lower curve from the upper curve.","Average value divides by the interval length."]}
};
window.CS_UNITS = window.CS_UNITS.map(u => { const m = META[u.id]; if (!m) return u;
  return Object.assign({}, u, {name:m.name, short:m.short, summary:m.summary, ap:"", clep:"", points:m.more.concat(u.points), traps:m.traps.concat(u.traps)}); });
})();
