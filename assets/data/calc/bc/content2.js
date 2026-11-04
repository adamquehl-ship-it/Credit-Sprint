/* Credit Sprint AP® Calculus BC: extra chains, true/false and explainers for BC topics, plus the BC cram plan and resources. All original. */
window.CS_CHAINS = window.CS_CHAINS.concat([
 ["Integration by parts",6,["Pick u with LIATE and let the rest be dv","Find du and v","Write uv − ∫v du","Evaluate the new integral","Add + C (or apply the limits)"]],
 ["Evaluating an improper integral",6,["Spot the infinite limit or discontinuity","Replace it with a variable, such as b","Integrate on the finite interval","Take the limit as b → ∞ (or to the discontinuity)","Finite limit: converges; otherwise diverges"]],
 ["Euler's method, one step",7,["Start at the known point (x₀, y₀)","Find the slope from the differential equation","Multiply the slope by the step size","Add it to y₀ to get y₁","Move to x₁ = x₀ + Δx and repeat"]],
 ["Finding a parametric second derivative",9,["Find dx/dt and dy/dt","Form dy/dx = (dy/dt)/(dx/dt)","Differentiate dy/dx with respect to t","Divide by dx/dt","Evaluate at the given t"]],
 ["Finding a polar area",9,["Sketch the curve","Find the θ-limits (r = 0 or where curves meet)","Square r","Integrate ½r² over the θ-interval","Subtract the inner curve's part if needed"]],
 ["Finding an interval of convergence",10,["Apply the ratio test to |aₙ₊₁/aₙ|","Set the limit less than 1 and solve for x","Write the radius R","Test the left endpoint separately","Test the right endpoint separately"]],
 ["Building a Taylor polynomial",10,["Find f(a), f′(a), f″(a), …","Divide the nth derivative by n!","Multiply by (x − a)ⁿ","Add the terms up to the degree you need","Bound the error with Lagrange or the alternating series bound"]]
]);
window.CS_TF = window.CS_TF.concat([
 [6,"∫ u dv = uv − ∫ v du.",true,"That is the integration by parts formula."],
 [6,"∫ from 1 to ∞ of 1/x² dx diverges.",false,"It is a p-integral with p = 2 > 1, so it converges to 1."],
 [6,"Partial fractions split 1/[(x − 1)(x + 2)] into A/(x − 1) + B/(x + 2).",true,"Distinct linear factors each get a constant numerator."],
 [7,"Euler's method uses the slope at the end of each step.",false,"It uses the slope at the start of each step."],
 [7,"A logistic population grows fastest at half the carrying capacity.",true,"dP/dt = kP(1 − P/L) is largest at P = L/2."],
 [9,"For a parametric curve, d²y/dx² = d/dt (dy/dx).",false,"You must also divide by dx/dt."],
 [9,"Speed in the plane is √[(x′)² + (y′)²].",true,"It is the magnitude of the velocity vector."],
 [9,"The area enclosed by a polar curve is ∫ r dθ.",false,"It is ½∫ r² dθ."],
 [10,"If lim aₙ = 0, then Σaₙ converges.",false,"The harmonic series has terms going to 0 but diverges."],
 [10,"A geometric series converges when |r| < 1.",true,"Then its sum is a/(1 − r)."],
 [10,"Σ1/nᵖ converges when p > 1.",true,"That is the p-series test."],
 [10,"The ratio test is conclusive when the limit equals 1.",false,"L = 1 is inconclusive."],
 [10,"Absolute convergence implies convergence.",true,"If Σ|aₙ| converges, so does Σaₙ."],
 [10,"The Maclaurin series for sin x contains only odd powers of x.",true,"x − x³/3! + x⁵/5! − …"],
 [10,"A Taylor coefficient is f⁽ⁿ⁾(a), without any factorial.",false,"It is f⁽ⁿ⁾(a)/n!."],
 [10,"The interval of convergence must be checked at each endpoint separately.",true,"The ratio test gives no information at the endpoints."]
]);
window.CS_EXPLAINERS = window.CS_EXPLAINERS.concat([
 {id:"c11", u:7, title:"Euler's method", steps:[{fig:"euler", v:0, cap:"Each step follows the tangent line for one step size. On a concave-up solution, the steps fall below the curve."}]},
 {id:"c12", u:9, title:"Polar area", steps:[{fig:"polar", v:1, cap:"Area in polar comes from thin wedges: ½r² dθ each."},{fig:"polar", v:2, cap:"Sweep θ further and the shaded area grows. Add the wedges with ½∫r² dθ."}]},
 {id:"c13", u:10, title:"Taylor polynomials", steps:[{fig:"taylor", v:1, cap:"Degree 1: the tangent line matches sin x only near 0."},{fig:"taylor", v:2, cap:"Degree 3 bends with the curve."},{fig:"taylor", v:3, cap:"Degree 5 fits a wider interval."},{fig:"taylor", v:4, cap:"Degree 7: more terms, better fit. The error bound tells you how good."}]}
]);
window.CS_CRAM = [{"u": "w1", "t": "Read the guide, then a 10-question unit quiz"}, {"u": "w1", "t": "Formulas and flashcards from memory, then the unit boss"}, {"u": "w2", "t": "Read the guide, then a 10-question unit quiz"}, {"u": "w2", "t": "Formulas and flashcards from memory, then the unit boss"}, {"u": "w3", "t": "Read the guide, then a 10-question unit quiz"}, {"u": "w3", "t": "Formulas and flashcards from memory, then the unit boss"}, {"u": "mix", "t": "Mini practice exam (15 questions), then review every miss"}, {"u": "w4", "t": "Read the guide, then a 10-question unit quiz"}, {"u": "w4", "t": "Formulas and flashcards from memory, then the unit boss"}, {"u": "w5", "t": "Read the guide, then a 10-question unit quiz"}, {"u": "w5", "t": "Formulas and flashcards from memory, then the unit boss"}, {"u": "w6", "t": "Read the guide, then a 10-question unit quiz"}, {"u": "w6", "t": "Formulas and flashcards from memory, then the unit boss"}, {"u": "w7", "t": "Read the guide, then a 10-question unit quiz"}, {"u": "w7", "t": "Formulas and flashcards from memory, then the unit boss"}, {"u": "w8", "t": "Read the guide, then a 10-question unit quiz"}, {"u": "w8", "t": "Formulas and flashcards from memory, then the unit boss"}, {"u": "w9", "t": "Read the guide, then a 10-question unit quiz"}, {"u": "w9", "t": "Formulas and flashcards from memory, then the unit boss"}, {"u": "w10", "t": "Read the guide, then a 10-question unit quiz"}, {"u": "w10", "t": "Formulas and flashcards from memory, then the unit boss"}, {"u": "mix", "t": "Full-length practice exam under time"}, {"u": "mix", "t": "Mistakes notebook: clear everything that's due"}, {"u": "mix", "t": "Two FRQs under time (one calculator, one no calculator), then score them"}, {"u": "mix", "t": "Series Court + Integral Sprint (20 minutes)"}, {"u": "mix", "t": "Second full-length practice exam"}, {"u": "mix", "t": "Weakest three units: one smart review each"}, {"u": "mix", "t": "Second pass on your weakest unit: smart review + boss rematch"}, {"u": "mix", "t": "Calculation drills: 20 minutes of Number Crunch"}, {"u": "mix", "t": "Light day: flashcards and the daily challenge. Sleep early."}];
window.CS_RESOURCES = [
 {name:"AP® Calculus BC course and exam description", by:"College Board · AP Central", url:"https://apcentral.collegeboard.org/courses/ap-calculus-bc", note:"Official units, weights and the 2026–27 exam updates."},
 {name:"AP® Calculus BC exam information", by:"College Board · AP Central", url:"https://apcentral.collegeboard.org/courses/ap-calculus-bc/exam", note:"Exam format and past free-response questions with scoring guidelines."},
 {name:"AP® Classroom", by:"College Board", url:"https://myap.collegeboard.org/", note:"Free practice from your teacher's AP® Classroom."},
 {name:"Khan Academy: AP®/College Calculus BC", by:"Khan Academy", url:"https://www.khanacademy.org/math/ap-calculus-bc", note:"Free video lessons and practice, including series, parametric and polar."},
 {name:"OpenStax Calculus Volume 2", by:"OpenStax · Rice University", url:"https://openstax.org/details/books/calculus-volume-2", note:"A free textbook covering integration techniques, series, parametric and polar."},
 {name:"Desmos graphing calculator", by:"Desmos", url:"https://www.desmos.com/calculator", note:"Free graphing for polar curves, parametric curves and Taylor polynomials."}
];
window.CS_CLEP = {fig:"units", figCap:"Calculus BC in ten units", growth:{title:"Not applicable", weight:"AP® only", summary:"AP® Calculus BC has no CLEP® counterpart in Credit Sprint. For CLEP® Calculus, switch to Calculus AB.", points:[], match:/^$/}};
