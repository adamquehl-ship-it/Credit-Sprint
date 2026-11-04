/* Credit Sprint AP® Calculus AB: process chains, true/false, explainers, CLEP® Calculus hub, cram plan, resources. All original. */
window.CS_CHAINS = [
 ["Evaluating a limit",1,["Try direct substitution","If you get a number, that is the limit","If you get 0/0, simplify: factor, rationalize or use a known limit","Substitute again into the simplified form","If you get a nonzero number over 0, check the sign from each side for ±∞"]],
 ["Proving continuity at x = c",1,["Check that f(c) is defined","Find the left-hand limit","Find the right-hand limit","Confirm both one-sided limits equal f(c)","State that f is continuous at c"]],
 ["Using the Intermediate Value Theorem",1,["State that f is continuous on [a, b]","Find f(a) and f(b)","Show the target value N is between f(a) and f(b)","Conclude f(c) = N for some c in (a, b)"]],
 ["Writing a tangent line",2,["Find the point (a, f(a))","Differentiate to get f′(x)","Evaluate the slope f′(a)","Write y − f(a) = f′(a)(x − a)"]],
 ["Implicit differentiation",3,["Differentiate both sides with respect to x","Multiply each y-term's derivative by dy/dx","Collect the dy/dx terms on one side","Factor out dy/dx","Divide to solve for dy/dx"]],
 ["Solving a related rates problem",4,["Draw a diagram and label the quantities","Write an equation that relates them","Differentiate both sides with respect to t","Substitute the values at that moment","Solve for the unknown rate and give units"]],
 ["Finding absolute extrema on [a, b]",5,["Find f′(x)","Find the critical points in (a, b)","Evaluate f at each critical point","Evaluate f at both endpoints","Compare: largest is the max, smallest is the min"]],
 ["Solving an optimization problem",5,["Name the quantity to maximize or minimize","Use a constraint to write it in one variable","Find the domain","Set the derivative to 0 and solve","Justify with a derivative test or the candidates test"]],
 ["Evaluating a definite integral by substitution",6,["Choose u as an inside function","Find du and match it in the integrand","Change the limits to u-values","Integrate in terms of u","Evaluate at the new limits"]],
 ["Solving a separable differential equation",7,["Separate: all y on one side, all x on the other","Integrate both sides","Add the constant C","Use the initial condition to find C","Solve for y"]],
 ["Finding a volume by washers",8,["Sketch the region and the axis","Find where the curves meet for the limits","Write the outer radius R and inner radius r from the axis","Set up π∫(R² − r²) dx","Evaluate"]],
 ["Finding total distance from velocity",8,["Find where v(t) = 0 in the interval","Check the sign of v on each piece","Integrate |v(t)| on each piece","Add the distances"]]
];
window.CS_TF = [
 [1,"If f(2) is undefined, then lim(x→2) f(x) cannot exist.",false,"A limit only depends on nearby values. A hole at x = 2 can still have a limit."],
 [1,"If both one-sided limits at x = c exist and are equal, the two-sided limit exists.",true,"That is exactly the condition for a two-sided limit."],
 [1,"A rational function always has a vertical asymptote where its denominator is 0.",false,"If the factor cancels with the numerator, there is a hole instead."],
 [1,"0/0 means the limit is 0.",false,"0/0 is indeterminate. Simplify before deciding."],
 [1,"The Intermediate Value Theorem requires f to be continuous on the closed interval.",true,"Without continuity the function could jump over the target value."],
 [1,"lim(x→∞) of a rational function with equal degrees is the ratio of the leading coefficients.",true,"The highest powers dominate, so the limit is their coefficients' ratio."],
 [1,"Exponential functions grow faster than any polynomial as x → ∞.",true,"For example, x¹⁰⁰ ÷ eˣ → 0."],
 [2,"If f is continuous at x = c, then f is differentiable at x = c.",false,"|x| is continuous at 0 but has a corner there."],
 [2,"If f is differentiable at x = c, then f is continuous at x = c.",true,"Differentiability implies continuity."],
 [2,"The derivative of a product is the product of the derivatives.",false,"Use the product rule: (fg)′ = f′g + fg′."],
 [2,"d/dx[eˣ] = eˣ.",true,"eˣ is its own derivative."],
 [2,"d/dx[cos x] = sin x.",false,"d/dx[cos x] = −sin x."],
 [2,"f′(a) is the slope of the line tangent to f at x = a.",true,"That is the geometric meaning of the derivative."],
 [2,"The average rate of change of f on [a, b] is f′ evaluated at the midpoint.",false,"The average rate of change is [f(b) − f(a)] ÷ (b − a). The MVT says f′ equals it somewhere, not necessarily at the midpoint."],
 [3,"d/dx[sin(3x)] = cos(3x).",false,"The chain rule adds a factor of 3: 3cos(3x)."],
 [3,"In implicit differentiation, d/dx[y²] = 2y·dy/dx.",true,"y is a function of x, so the chain rule applies."],
 [3,"If g is the inverse of f and f(1) = 4, then g′(4) = 1 ÷ f′(1).",true,"The inverse's slope at (4, 1) is the reciprocal of f's slope at (1, 4)."],
 [3,"d/dx[ln(2x)] = 2/x.",false,"By the chain rule, 2/(2x) = 1/x."],
 [3,"d/dx[arctan x] = 1 ÷ (1 + x²).",true,"This is a standard inverse trig derivative."],
 [4,"A particle with negative velocity is moving to the left.",true,"Velocity's sign gives direction on a horizontal line."],
 [4,"A particle with negative acceleration is always slowing down.",false,"If the velocity is also negative, it speeds up."],
 [4,"Speed is the absolute value of velocity.",true,"Speed has no direction."],
 [4,"In related rates, substitute the values of changing quantities before differentiating.",false,"Substitute after differentiating, or the rates disappear."],
 [4,"L'Hospital's Rule can be used on any quotient.",false,"It only applies to the indeterminate forms 0/0 and ∞/∞."],
 [4,"For a concave-up function, a tangent line approximation is an underestimate.",true,"The curve lies above its tangent lines."],
 [5,"If f′(c) = 0, then f has a relative extremum at c.",false,"f(x) = x³ has f′(0) = 0 and no extremum."],
 [5,"If f″(c) = 0, then f has a point of inflection at c.",false,"f(x) = x⁴ has f″(0) = 0 but no inflection point."],
 [5,"A continuous function on a closed interval has an absolute maximum.",true,"That is the Extreme Value Theorem."],
 [5,"If f′ changes from positive to negative at c, then f has a relative maximum at c.",true,"That is the first derivative test."],
 [5,"Where the graph of f′ is decreasing, the graph of f is concave down.",true,"Concave down means f′ is decreasing."],
 [5,"The Mean Value Theorem needs f to be differentiable on the closed interval [a, b].",false,"It needs continuity on [a, b] and differentiability on the open interval (a, b)."],
 [5,"An absolute maximum on [a, b] can occur at an endpoint.",true,"That is why the candidates test includes the endpoints."],
 [6,"∫ from a to b of f(x) dx is always the area between f and the x-axis.",false,"It is net signed area: parts below the axis count negatively."],
 [6,"A right Riemann sum overestimates the integral of an increasing function.",true,"Each rectangle uses the highest point of its subinterval."],
 [6,"d/dx ∫ from 0 to x of f(t) dt = f(x).",true,"That is the Fundamental Theorem, part 1."],
 [6,"d/dx ∫ from 0 to x² of f(t) dt = f(x²).",false,"The chain rule adds a factor of 2x: f(x²)·2x."],
 [6,"∫ 1/x dx = ln|x| + C.",true,"The power rule fails for x⁻¹, and the logarithm takes its place."],
 [6,"∫ from a to b of f(x) dx = −∫ from b to a of f(x) dx.",true,"Reversing the limits changes the sign."],
 [6,"The trapezoidal rule always gives the exact area.",false,"It is exact only for linear functions."],
 [7,"y = Ce^(kx) solves dy/dx = ky for any constant C.",true,"dy/dx = kCe^(kx) = ky."],
 [7,"In a slope field for dy/dx = f(x), slopes in each column are the same.",true,"The slope depends only on x."],
 [7,"You should add the constant C after solving for y.",false,"Add C right after integrating, then use the initial condition."],
 [7,"If dy/dt = ky with k < 0, y decays exponentially toward 0.",true,"A negative k gives decay."],
 [8,"∫ v(t) dt over an interval gives total distance traveled.",false,"It gives displacement. Distance is ∫|v(t)| dt."],
 [8,"In the washer method, the integrand is π(R − r)².",false,"It is π(R² − r²)."],
 [8,"The average value of f on [a, b] is the integral divided by b − a.",true,"f_avg = [1/(b − a)]∫ₐᵇ f(x) dx."],
 [8,"Area between curves uses top minus bottom.",true,"For vertical slices, integrate the upper curve minus the lower curve."],
 [8,"Revolving around the line y = −2 adds 2 to each radius measured from a curve above the x-axis.",true,"The distance from y = −2 to y = f(x) is f(x) + 2."]
];
window.CS_EXPLAINERS = [
 {id:"c1", u:1, title:"A limit is about nearby values", steps:[{fig:"limit", v:1, cap:"Follow the curve from both sides: it heads to the height of the hole."},{fig:"limit", v:2, cap:"The dot at f(2) sits somewhere else, and it doesn't change the limit."},{fig:"limit", v:0, cap:"lim f(x) as x → 2 is the hole's height. f(2) only matters for continuity."}]},
 {id:"c2", u:2, title:"From secant lines to the tangent line", steps:[{fig:"tangent", v:1, cap:"A secant line through two points has slope [f(a + h) − f(a)] / h."},{fig:"tangent", v:2, cap:"Move the second point closer: h gets smaller."},{fig:"tangent", v:3, cap:"Closer still: the secant line almost matches the curve's direction at a."},{fig:"tangent", v:4, cap:"In the limit you get the tangent line, with slope f′(a)."}]},
 {id:"c3", u:3, title:"The chain rule multiplies rates", steps:[{fig:"chain", v:1, cap:"Start with x."},{fig:"chain", v:2, cap:"The inside function changes at du/dx = g′(x)."},{fig:"chain", v:3, cap:"The outside function changes at dy/du = f′(u)."},{fig:"chain", v:0, cap:"Multiply along the chain: dy/dx = f′(g(x))·g′(x)."}]},
 {id:"c4", u:4, title:"Reading motion from velocity", steps:[{fig:"motion", v:1, cap:"Above the axis the particle moves right; below it moves left."},{fig:"motion", v:2, cap:"Where v crosses zero, the particle stops and turns around."}]},
 {id:"c5", u:5, title:"What f′ and f″ tell you about f", steps:[{fig:"signchart", v:1, cap:"f′ changes sign at the relative maximum and minimum."},{fig:"signchart", v:2, cap:"Concavity changes at the point of inflection, where f″ changes sign."},{fig:"signchart", v:3, cap:"Put it on a sign chart: f′ for rising and falling, f″ for bending."}]},
 {id:"c6", u:6, title:"Riemann sums approach the integral", steps:[{fig:"riemann", v:1, cap:"A left sum uses left endpoints. For an increasing function it is too small."},{fig:"riemann", v:2, cap:"A right sum uses right endpoints and is too big."},{fig:"riemann", v:3, cap:"A midpoint sum is usually closer."},{fig:"riemann", v:4, cap:"Trapezoids average the left and right sums."}]},
 {id:"c7", u:6, title:"Accumulation functions", steps:[{fig:"ftc", v:1, cap:"g(x) = ∫₀ˣ f(t) dt collects area as x moves right."},{fig:"ftc", v:2, cap:"Where f dips below the axis, g starts to decrease."},{fig:"ftc", v:3, cap:"The rate g grows at is f(x): that is the Fundamental Theorem."}]},
 {id:"c8", u:7, title:"Reading slope fields", steps:[{fig:"slopefield", v:2, cap:"dy/dx = x: every column has the same slope."},{fig:"slopefield", v:3, cap:"dy/dx = y: every row has the same slope."},{fig:"slopefield", v:1, cap:"dy/dx = xy: slopes change with both x and y. Solutions follow the segments."}]},
 {id:"c9", u:8, title:"Area between curves", steps:[{fig:"area", v:0, cap:"Slice vertically. Each slice is top − bottom tall and dx wide. Add them up with an integral."}]},
 {id:"c10", u:8, title:"Discs and washers", steps:[{fig:"volume", v:1, cap:"Revolve a slice that touches the axis: a disc of area πR²."},{fig:"volume", v:2, cap:"A slice with a gap at the axis makes a washer: π(R² − r²)."}]}
];
window.CS_FRQ_GRAPHS = {};
window.CS_CLEP = {
  fig:"units", figCap:"CLEP® Calculus covers limits, derivatives and integrals: about 10%, 50% and 40%",
  growth:{
    title:"Antiderivatives and growth",
    weight:"Part of the 40% integral calculus section",
    summary:"CLEP® Calculus puts extra weight on antiderivatives with initial conditions: finding velocity and position from acceleration, and solving y′ = ky growth and decay. It does not ask about volumes of solids, slope fields or free-response justifications.",
    points:["Antiderivative with an initial condition: find F with F′ = f and one known value, such as v(0) = 3. Integrate, then solve for C.","From acceleration to position: v(t) = v(0) + ∫a(t) dt and s(t) = s(0) + ∫v(t) dt.","Growth and decay: y′ = ky has solution y = y₀e^(kt). Doubling time is ln 2/k; half-life is ln 2/|k|.","Average value: [1/(b − a)]∫ₐᵇ f(x) dx.","Accumulated change: amount at b = amount at a + ∫ₐᵇ (rate) dt.","Riemann sums and the trapezoidal rule appear on CLEP® too, often from a table or a formula."],
    match:/antiderivative|initial condition|grows|growth|decay|half-life|doubl|dP\/dt|dy\/dt = k|average value|accelerat|y\(0\)|kP|kA/i
  },
  guide:[
    {h:"The exam at a glance", p:["About 44 multiple-choice questions in about 90 minutes, in two sections.","Section 1: about 27 questions in 50 minutes, no calculator.","Section 2: about 17 questions in 40 minutes with an online graphing calculator (a TI-84 Plus CE built into the exam); only some questions need it.","Content: limits about 10%, differential calculus about 50%, integral calculus about 40%. Half the questions are routine skills; half test concepts and applications."]},
    {h:"Scores and credit", p:["Scores run from 20 to 80. The American Council on Education recommends credit for a 50, worth 4 semester hours, but each college sets its own score and credit.","There is no free-response section and no penalty for guessing, so answer every question."]},
    {h:"Before you register", p:["Check your college's CLEP® policy first: the score it requires and the course it gives credit for.","Register on the CLEP® site, then schedule at a test center or with remote proctoring. Bring a valid photo ID.","If you don't pass, you must wait 3 months before retaking the same exam."]},
    {h:"How to use Credit Sprint for CLEP®", p:["Set your exam to CLEP® in the sidebar. Practice exams then use the CLEP® length and weights.","Spend most of your time on Units 2 to 6. Unit 8 volumes are not on CLEP®, so skip the washer method.","Use the Number Crunch game and calculation drills for speed on the no-calculator section."]}
  ],
  sources:[["CLEP® Calculus exam page","https://clep.collegeboard.org/exam/calculus"],["CLEP® policies","https://clep.collegeboard.org/clep-policies"]]
};
window.CS_CRAM = [{"u": "w1", "t": "Read the guide, then a 10-question unit quiz"}, {"u": "w1", "t": "Formulas and flashcards from memory, then the unit boss"}, {"u": "w2", "t": "Read the guide, then a 10-question unit quiz"}, {"u": "w2", "t": "Formulas and flashcards from memory, then the unit boss"}, {"u": "w3", "t": "Read the guide, then a 10-question unit quiz"}, {"u": "w3", "t": "Formulas and flashcards from memory, then the unit boss"}, {"u": "mix", "t": "Mini practice exam (15 questions), then review every miss"}, {"u": "w4", "t": "Read the guide, then a 10-question unit quiz"}, {"u": "w4", "t": "Formulas and flashcards from memory, then the unit boss"}, {"u": "w5", "t": "Read the guide, then a 10-question unit quiz"}, {"u": "w5", "t": "Formulas and flashcards from memory, then the unit boss"}, {"u": "w6", "t": "Read the guide, then a 10-question unit quiz"}, {"u": "w6", "t": "Formulas and flashcards from memory, then the unit boss"}, {"u": "w7", "t": "Read the guide, then a 10-question unit quiz"}, {"u": "w7", "t": "Formulas and flashcards from memory, then the unit boss"}, {"u": "w8", "t": "Read the guide, then a 10-question unit quiz"}, {"u": "w8", "t": "Formulas and flashcards from memory, then the unit boss"}, {"u": "mix", "t": "Full-length practice exam under time"}, {"u": "mix", "t": "Mistakes notebook: clear everything that's due"}, {"u": "mix", "t": "Two FRQs under time (one calculator, one no calculator), then score them"}, {"u": "mix", "t": "Derivative Dash + Integral Sprint (20 minutes)"}, {"u": "mix", "t": "Graph Detective + Tangent Shot (20 minutes)"}, {"u": "mix", "t": "Second full-length practice exam"}, {"u": "mix", "t": "Weakest three units: one smart review each"}, {"u": "mix", "t": "Calculation drills: 20 minutes of Number Crunch"}, {"u": "mix", "t": "One more FRQ, then rescore your weakest one"}, {"u": "mix", "t": "Mini practice exam (15 questions), then review every miss"}, {"u": "mix", "t": "Second pass on your weakest unit: smart review + boss rematch"}, {"u": "mix", "t": "Chain Reaction + True or False (20 minutes)"}, {"u": "mix", "t": "Light day: flashcards and the daily challenge. Sleep early."}];
window.CS_RESOURCES = [
 {name:"AP® Calculus AB course and exam description", by:"College Board · AP Central", url:"https://apcentral.collegeboard.org/courses/ap-calculus-ab", note:"Official units, weights and the 2026–27 exam updates."},
 {name:"AP® Calculus AB exam information", by:"College Board · AP Central", url:"https://apcentral.collegeboard.org/courses/ap-calculus-ab/exam", note:"Exam format and past free-response questions with scoring guidelines."},
 {name:"CLEP® Calculus", by:"College Board · CLEP®", url:"https://clep.collegeboard.org/exam/calculus", note:"Official CLEP® content outline, format and credit recommendation."},
 {name:"AP® Classroom", by:"College Board", url:"https://myap.collegeboard.org/", note:"Free practice from your teacher's AP® Classroom."},
 {name:"Khan Academy: AP®/College Calculus AB", by:"Khan Academy", url:"https://www.khanacademy.org/math/ap-calculus-ab", note:"Free video lessons and practice for every unit."},
 {name:"OpenStax Calculus Volume 1", by:"OpenStax · Rice University", url:"https://openstax.org/details/books/calculus-volume-1", note:"A free college calculus textbook with worked examples."},
 {name:"Desmos graphing calculator", by:"Desmos", url:"https://www.desmos.com/calculator", note:"Free graphing to check derivatives, areas and slope fields."}
];
