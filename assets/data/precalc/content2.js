/* Credit Sprint AP® Precalculus: chains, true/false, explainers, CLEP® hub, cram plan and resources. All original. */
window.CS_CHAINS = [
 ["Graphing a rational function",1,["Factor the numerator and denominator","Cancel common factors and mark holes","Set the remaining denominator to 0 for vertical asymptotes","Set the numerator to 0 for the zeros","Compare degrees for the horizontal or slant asymptote","Test signs between key x-values and sketch"]],
 ["Finding a polynomial's zeros",1,["Factor out any common factor","Use the rational root theorem to list possible zeros","Test candidates with synthetic division","Write the depressed (lower-degree) quotient","Solve the quotient by factoring or the quadratic formula","List every zero with its multiplicity"]],
 ["Building a polynomial model from data",1,["Plot the data and note turning points","Check first, second and third differences","Choose the degree that fits the pattern","Run a regression to find the coefficients","Check the residuals for a pattern","Use the model only within a sensible domain"]],
 ["Transforming y = f(x) into y = a·f(b(x − h)) + k",1,["Start with the graph of f","Compress or stretch horizontally by 1/|b|","Shift horizontally by h","Stretch or shrink vertically by |a| (reflect if a < 0)","Shift vertically by k"]],
 ["Solving an exponential equation with logs",2,["Isolate the exponential expression","Take a log of both sides","Bring the exponent down with the power rule","Solve the resulting linear equation","Check the answer in the original equation"]],
 ["Fitting an exponential model to data",2,["Check that output ratios are roughly constant","Plot ln y against x and look for a line","Find the slope and intercept of the line","Undo the logs: b = e^(slope) and a = e^(intercept)","Check the residuals of y = a·bˣ"]],
 ["Finding the inverse of a function",2,["Check that the function is one-to-one","Write y = f(x)","Swap x and y","Solve for y","Rename y as f⁻¹(x) and state its domain"]],
 ["Solving a logarithmic equation",2,["Combine the logs into a single log","Rewrite in exponential form","Solve for x","Check that every log argument is positive","Discard extraneous solutions"]],
 ["Building a sinusoidal model",3,["Find the maximum and minimum values","Midline d = (max + min) ÷ 2","Amplitude a = (max − min) ÷ 2","Period = time from one max to the next; b = 2π ÷ period","Choose sine or cosine and the phase shift from a known max or midline crossing","Check the model against another data point"]],
 ["Solving 2sin x − 1 = 0 on [0, 2π)",3,["Isolate the trig function: sin x = 1/2","Find the reference angle: π/6","Find the quadrants where sine is positive: I and II","Write the solutions: π/6 and 5π/6","Check that both are in [0, 2π)"]],
 ["Converting a polar equation to rectangular form",3,["Multiply both sides by r if needed","Replace r cos θ with x and r sin θ with y","Replace r² with x² + y²","Simplify and complete the square","Identify the curve"]],
 ["Evaluating sin(5π/4) exactly",3,["Locate 5π/4 in quadrant III","Find the reference angle π/4","Recall sin(π/4) = √2/2","Apply the quadrant sign: sine is negative in III","Answer: −√2/2"]],
 ["Finding the inverse of a 2 × 2 matrix",4,["Compute the determinant ad − bc","Check that the determinant is not 0","Swap a and d","Change the signs of b and c","Multiply by 1 ÷ determinant"]],
 ["Writing a circle in standard form",4,["Group the x terms and the y terms","Move the constant to the right side","Complete the square for x","Complete the square for y","Read the center and radius"]]
];
window.CS_TF = [
 [1,"A polynomial of degree 4 can have exactly 3 relative extrema.",true,"A degree-n polynomial has at most n − 1 relative extrema, so 3 is possible."],
 [1,"A polynomial of degree 3 must have at least one real zero.",true,"Odd degree means the ends go in opposite directions, so the graph must cross the x-axis."],
 [1,"Every rational function has a vertical asymptote.",false,"r(x) = 1/(x² + 1) has none: its denominator is never 0."],
 [1,"At a zero of multiplicity 2, the graph crosses the x-axis.",false,"Even multiplicity: the graph touches and turns around."],
 [1,"f(x + 2) shifts the graph of f to the left 2 units.",true,"Adding inside the function moves the graph left."],
 [1,"If f is concave down, its rate of change is decreasing.",true,"Concave down means the slopes are getting smaller."],
 [1,"A graph can cross its horizontal asymptote.",true,"A horizontal asymptote only describes end behavior."],
 [1,"The average rate of change of a linear function is the same on every interval.",true,"A linear function has a constant rate of change, its slope."],
 [1,"An odd function is symmetric about the y-axis.",false,"Odd functions are symmetric about the origin; even functions about the y-axis."],
 [1,"If p(3) = 0, then (x − 3) is a factor of p(x).",true,"That is the factor theorem."],
 [1,"Constant second differences in a table mean the data are exponential.",false,"Constant second differences mean quadratic. Exponential data have constant ratios."],
 [1,"If 4 − 2i is a zero of a polynomial with real coefficients, so is 4 + 2i.",true,"Non-real zeros of real polynomials come in conjugate pairs."],
 [1,"r(x) = (x² + 1)/(x − 1) has a horizontal asymptote.",false,"The numerator's degree is one higher, so it has a slant asymptote instead."],
 [1,"Every function has an inverse function.",false,"Only one-to-one functions do."],
 [1,"The composition f(g(x)) is always equal to g(f(x)).",false,"Composition is usually not commutative."],
 [2,"A geometric sequence has a constant ratio between consecutive terms.",true,"That is the definition: gₙ₊₁ ÷ gₙ = r."],
 [2,"f(x) = 3·(0.7)ˣ models exponential growth.",false,"A base between 0 and 1 means decay."],
 [2,"log₂(8) = 3.",true,"2³ = 8."],
 [2,"log(a + b) = log a + log b.",false,"The rule is for products: log(ab) = log a + log b."],
 [2,"ln(e⁴) = 4.",true,"ln and eˣ are inverse functions."],
 [2,"The graph of y = log x has a horizontal asymptote.",false,"It has a vertical asymptote at x = 0 and increases without bound."],
 [2,"An exponential function eventually exceeds any polynomial if its base is greater than 1.",true,"Exponential growth beats polynomial growth in the long run."],
 [2,"A 4% annual decrease gives a growth factor of 0.96.",true,"1 − 0.04 = 0.96."],
 [2,"If the residual plot for a model shows a clear U shape, the model is a good fit.",false,"A pattern in the residuals means the model misses part of the trend."],
 [2,"log_b 1 = 0 for every allowed base b.",true,"b⁰ = 1."],
 [2,"The domain of y = ln x is all real numbers.",false,"It is x > 0."],
 [2,"2^(x + 3) = 8·2ˣ.",true,"2^(x + 3) = 2³·2ˣ."],
 [2,"log₃ 20 = ln 20 ÷ ln 3.",true,"That is the change of base formula."],
 [2,"If ln y is a linear function of x, then y is an exponential function of x.",true,"ln y = mx + c means y = eᶜ(eᵐ)ˣ."],
 [2,"An arithmetic sequence is the discrete version of an exponential function.",false,"Arithmetic sequences match linear functions; geometric sequences match exponential functions."],
 [3,"The period of y = sin(4x) is 8π.",false,"Period = 2π ÷ 4 = π/2."],
 [3,"π radians equal 180°.",true,"Half a turn is π radians."],
 [3,"cos(π/3) = 1/2.",true,"The point at π/3 on the unit circle is (1/2, √3/2)."],
 [3,"sin θ is negative in quadrant II.",false,"y is positive in quadrant II, so sine is positive."],
 [3,"tan x has period 2π.",false,"Tangent has period π."],
 [3,"arccos(−1) = π.",true,"cos π = −1 and π is in arccos's range [0, π]."],
 [3,"sin²θ + cos²θ = 1 for every angle θ.",true,"It is the Pythagorean identity."],
 [3,"The amplitude of y = −5cos x + 2 is −5.",false,"Amplitude is |a| = 5."],
 [3,"The midline of y = 3sin x + 4 is y = 4.",true,"The vertical shift is 4."],
 [3,"arcsin(2) is undefined.",true,"Sine never exceeds 1."],
 [3,"r = 5 sin(3θ) is a rose with 6 petals.",false,"n = 3 is odd, so it has 3 petals."],
 [3,"The polar point (−2, π/2) is the same as the rectangular point (0, −2).",true,"Negative r points the opposite way: down the y-axis."],
 [3,"sin(2θ) = 2 sin θ cos θ.",true,"That is the double-angle identity for sine."],
 [3,"y = cos x is y = sin x shifted π/2 to the right.",false,"cos x = sin(x + π/2): a shift left."],
 [3,"csc θ = 1 ÷ cos θ.",false,"csc θ = 1 ÷ sin θ. sec θ = 1 ÷ cos θ."],
 [3,"The equation sin x = 0.4 has exactly two solutions on [0, 2π).",true,"One in quadrant I and one in quadrant II."],
 [4,"Matrix multiplication is commutative.",false,"In general AB ≠ BA."],
 [4,"A matrix with determinant 0 has no inverse.",true,"The inverse formula divides by the determinant."],
 [4,"If u · v = 0, then u and v are perpendicular.",true,"cos θ = 0 means θ = 90° (for nonzero vectors)."],
 [4,"The magnitude of ⟨6, 8⟩ is 14.",false,"√(36 + 64) = 10."],
 [4,"x²/9 − y²/4 = 1 is an ellipse.",false,"The minus sign makes it a hyperbola."],
 [4,"Eliminating the parameter keeps the direction of motion.",false,"The x-y equation loses the timing and direction."],
 [4,"The circle (x − 1)² + (y + 2)² = 9 has center (1, −2).",true,"Read h and k with opposite signs from the factors."],
 [4,"Unit 4 topics appear on the AP® Precalculus exam.",false,"Unit 4 is in the course but not on the AP® exam; CLEP® tests some of it."]
];
window.CS_EXPLAINERS = [
 {"id":"p1","u":1,"title":"Reading a polynomial graph","steps":[{"fig":"poly","v":1,"cap":"Zeros: odd multiplicity means the graph crosses the x-axis."},{"fig":"poly","v":2,"cap":"Relative extrema: the graph switches between increasing and decreasing."},{"fig":"poly","v":3,"cap":"The inflection point: concavity switches from down to up."},{"fig":"poly","v":0,"cap":"A cubic has at most 3 zeros and at most 2 turning points."}]},
 {"id":"p2","u":2,"title":"Exponentials and logs are inverses","steps":[{"fig":"explog","v":1,"cap":"y = 2ˣ: horizontal asymptote y = 0, passes through (0, 1)."},{"fig":"explog","v":2,"cap":"y = log₂ x: vertical asymptote x = 0, passes through (1, 0)."},{"fig":"explog","v":0,"cap":"Each graph is the other reflected over y = x."}]},
 {"id":"p3","u":3,"title":"The unit circle","steps":[{"fig":"unitcircle","v":3,"cap":"Every point on the unit circle is (cos θ, sin θ)."},{"fig":"unitcircle","v":1,"cap":"Learn the three special angles in quadrant I."},{"fig":"unitcircle","v":2,"cap":"Reflect them into the other quadrants and fix the signs."},{"fig":"unitcircle","v":0,"cap":"Then any special angle is a reference angle away."}]},
 {"id":"p4","u":3,"title":"Parts of a sinusoid","steps":[{"fig":"sinusoid","v":1,"cap":"The midline is halfway between the max and the min."},{"fig":"sinusoid","v":2,"cap":"The amplitude is the distance from the midline to the max."},{"fig":"sinusoid","v":3,"cap":"The period is the length of one full cycle: 2π/|b|."},{"fig":"sinusoid","v":0,"cap":"Put them together: y = a sin(b(x + c)) + d."}]},
 {"id":"p5","u":3,"title":"Polar roses","steps":[{"fig":"polar","v":1,"cap":"r = cos(3θ): odd n gives n petals."},{"fig":"polar","v":2,"cap":"r = cos(2θ): even n gives 2n petals."}]},
 {"id":"p6","u":4,"title":"Vectors and the dot product","steps":[{"fig":"vectors","v":1,"cap":"Magnitude: ‖⟨4, 3⟩‖ = 5."},{"fig":"vectors","v":2,"cap":"A zero dot product means the vectors are perpendicular."},{"fig":"vectors","v":3,"cap":"Add vectors tip to tail."}]}
];
window.CS_CLEP = {
  fig:"units", figCap:"AP® weights by unit; CLEP® spreads its weight across algebra, functions and trig",
  growth:{
    title:"Algebra and analytic geometry",
    weight:"About 30% of CLEP® Precalculus",
    summary:"CLEP® Precalculus spends more time than the AP® exam on algebra skills (solving equations, inequalities and systems) and on analytic geometry: lines, circles, parabolas, ellipses and hyperbolas. These topics live in Unit 1 and Unit 4 here.",
    points:["Solve linear, quadratic, absolute value, radical and rational equations, and check for extraneous solutions.","Solve inequalities with a sign chart and write the answer in interval notation.","Solve systems of two equations by substitution or elimination, including a line and a circle.","Write the equation of a line from two points or a point and a slope; parallel lines share a slope and perpendicular slopes are negative reciprocals.","Complete the square to find the center and radius of a circle or the vertex of a parabola.","Recognize ellipses (same signs) and hyperbolas (opposite signs) from their standard forms.","Use right-triangle trig (SOH CAH TOA) for missing sides and angles."],
    match:/circle|ellipse|hyperbola|parabola|center|radius|inequalit|system|slope|line |interval|asymptote/i
  },
  guide:[
    {h:"The exam at a glance", p:["About 48 questions in about 90 minutes, in two sections. Most are multiple choice; some ask you to type a number.","Section 1: 25 questions in about 50 minutes with an online graphing calculator (a TI-84 Plus CE built into the exam). Only some questions need it.","Section 2: 23 questions in about 40 minutes with no calculator.","Content: algebraic expressions, equations and inequalities about 20%; functions (concept, properties, operations) about 15%; representations of functions about 30%; analytic geometry about 10%; trigonometry about 15%; functions as models about 10%."]},
    {h:"Scores and credit", p:["Scores run from 20 to 80. The American Council on Education recommends credit for a 50, worth 3 semester hours, but each college sets its own score and credit.","There is no penalty for guessing, so answer every question."]},
    {h:"Before you register", p:["Check your college's CLEP® policy first: the score it requires and the course it gives credit for.","Register on the CLEP® site, then schedule at a test center or with remote proctoring. Bring a valid photo ID.","If you don't pass, you must wait 3 months before retaking the same exam."]},
    {h:"How to use Credit Sprint for CLEP®", p:["Set your exam to CLEP® in the sidebar. Practice exams then use the CLEP® length and weights, including Unit 4.","Learn the unit circle cold: about a third of the questions need trig or right-triangle facts.","Use the calculation drills and Number Crunch for speed on the no-calculator section."]}
  ],
  sources:[["CLEP® Precalculus exam page","https://clep.collegeboard.org/exam/precalculus"],["CLEP® policies","https://clep.collegeboard.org/clep-policies"]]
};
window.CS_CRAM = [];
for (let u = 1; u <= 3; u++) window.CS_CRAM.push({u:"w"+u, t:"Read the guide, then a 10-question unit quiz"}, {u:"w"+u, t:"Formulas and flashcards from memory, then the unit boss"}, {u:"w"+u, t:"Calculation drills for this unit, then a second quiz"});
window.CS_CRAM.push({u:"w3", t:"Unit circle from memory: fill in every special angle"}, {u:"w4", t:"Unit 4 guide and quiz (CLEP® and class tests only)"}, {u:"mix", t:"Mini practice exam, then review every miss"}, {u:"mix", t:"Two FRQs under time (one calculator, one no calculator), then score them"}, {u:"mix", t:"Function Family and Transformation Match"}, {u:"mix", t:"Unit Circle Sprint and Log Rules"}, {u:"mix", t:"Mistakes notebook: clear everything that's due"}, {u:"mix", t:"Full-length practice exam under time"}, {u:"mix", t:"Weakest unit: smart review and the unit boss again"}, {u:"mix", t:"Modeling review: choose linear, quadratic, exponential or sinusoidal"}, {u:"mix", t:"Calculation drills: 20 minutes of Number Crunch"}, {u:"mix", t:"Second full-length practice exam"}, {u:"mix", t:"FRQ 4 practice: symbolic manipulation with logs and trig identities"}, {u:"mix", t:"Weakest three units: one smart review each"}, {u:"mix", t:"Mixed review: smart review questions"}, {u:"mix", t:"Light review of weak cards and rest"}, {u:"mix", t:"Mixed review: smart review and the mistakes notebook"}, {u:"mix", t:"Light review and rest before exam day"});
window.CS_RESOURCES = [
 {name:"AP® Precalculus course and exam description", by:"College Board · AP Central", url:"https://apcentral.collegeboard.org/courses/ap-precalculus", note:"Official units, topics and the exam format."},
 {name:"AP® Precalculus exam information", by:"College Board · AP Central", url:"https://apcentral.collegeboard.org/courses/ap-precalculus/exam", note:"Exam format, calculator rules and released free-response questions with scoring guidelines."},
 {name:"CLEP® Precalculus", by:"College Board · CLEP®", url:"https://clep.collegeboard.org/exam/precalculus", note:"Official CLEP® content outline, format and credit recommendation."},
 {name:"AP® Classroom", by:"College Board", url:"https://myap.collegeboard.org/", note:"Free practice from your teacher's AP® Classroom."},
 {name:"Desmos graphing calculator", by:"Desmos", url:"https://www.desmos.com/calculator", note:"Graph any function to check your sketches. A graphing calculator is required on part of the AP® exam."}
];
window.CS_FRQ_GRAPHS = {};
