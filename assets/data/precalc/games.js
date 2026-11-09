/* Credit Sprint AP® Precalculus game data. All original.
   CS_PC_FAMILY (Function Family Sort): [clue, bucket 0 linear · 1 quadratic · 2 exponential · 3 logarithmic · 4 sinusoidal, why, unit].
   CS_PC_TRANSFORM (Transformation Match): [g in terms of f, what it does to the graph, why, unit, family]. Wrong options come from the same family.
   CS_PC_CIRCLE (Unit Circle Sprint): [expression, exact value, why, unit, values that are also correct].
   CS_PC_LOGS (Log Rules): [expression, equivalent, why, unit, family]. */
window.CS_PC_FAMILY = [
 ["Output changes by the same amount over equal input steps.",0,"Constant differences mean linear.",1],
 ["Second differences are constant over equal input steps.",1,"Constant second differences mean quadratic.",1],
 ["Output is multiplied by the same factor over equal input steps.",2,"Constant ratios mean exponential.",2],
 ["Output increases by the same amount each time the input is multiplied by 10.",3,"Equal output steps for equal input ratios is the logarithmic pattern.",2],
 ["The outputs repeat every 12 units.",4,"Repeating outputs are periodic: sinusoidal.",3],
 ["y = 4 − 3x",0,"Degree 1: a line with slope −3.",1],
 ["y = 2(x − 1)² + 5",1,"Vertex form of a parabola.",1],
 ["y = 5(1.08)ˣ",2,"A positive base other than 1 raised to the x.",2],
 ["y = ln(x + 2)",3,"A natural log.",2],
 ["y = 3cos(2x) − 1",4,"A transformed cosine.",3],
 ["The graph has a vertical asymptote and keeps increasing more and more slowly.",3,"Logs have a vertical asymptote and grow slowly without bound.",2],
 ["The graph has a horizontal asymptote on the left and grows faster and faster on the right.",2,"Exponential growth with base > 1.",2],
 ["The graph has one turning point and is symmetric about a vertical line.",1,"A parabola is symmetric about its axis.",1],
 ["The rate of change is the same everywhere.",0,"Only lines have a constant rate of change.",1],
 ["Hours of daylight in a city over a year.",4,"Daylight rises and falls on a yearly cycle.",3],
 ["A $500 deposit earning 4% interest each year.",2,"Interest compounds: multiply by 1.04 each year.",2],
 ["A taxi charges $3 plus $2 per mile.",0,"A fixed amount plus a constant rate per mile.",1],
 ["The height of a ball thrown into the air over time.",1,"Gravity makes height a quadratic function of time.",1],
 ["The pH scale: each step is a tenfold change in acidity.",3,"pH is a logarithm of concentration.",2],
 ["A medication's amount in the bloodstream drops 20% every hour.",2,"Decay by a constant percent is exponential with b = 0.8.",2],
 ["The height of a rider on a Ferris wheel.",4,"The height repeats every revolution.",3],
 ["The decibel level of a sound as its intensity grows.",3,"Decibels are a logarithmic scale.",2],
 ["The area of a square as its side length grows.",1,"A = s² is quadratic.",1],
 ["The depth of water in a harbor over a day of tides.",4,"Tides rise and fall periodically.",3],
 ["A car traveling at a steady 60 miles per hour: distance over time.",0,"Constant speed means constant rate of change.",1],
 ["A rumor that doubles the number of people who know it every day.",2,"Doubling each day is exponential.",2],
 ["The Richter scale for earthquake strength.",3,"Each whole number is ten times the shaking.",2],
 ["y = −x² + 6x",1,"The x² term makes it quadratic.",1],
 ["y = 200(0.5)^(t/3)",2,"Half-life decay is exponential.",2],
 ["y = log₂ x − 4",3,"A shifted base-2 logarithm.",2],
 ["y = 7sin(πx/6) + 10",4,"A transformed sine.",3]
];
window.CS_PC_TRANSFORM = [
 ["g(x) = f(x − 3)","Shift right 3","Inside changes act opposite: x − 3 moves the graph right.",1,"shift"],
 ["g(x) = f(x + 3)","Shift left 3","x + 3 moves the graph left.",1,"shift"],
 ["g(x) = f(x) + 3","Shift up 3","Adding outside moves the graph up.",1,"shift"],
 ["g(x) = f(x) − 3","Shift down 3","Subtracting outside moves the graph down.",1,"shift"],
 ["g(x) = f(x − 2) + 5","Shift right 2 and up 5","Inside: right 2. Outside: up 5.",1,"shift"],
 ["g(x) = f(x + 4) − 1","Shift left 4 and down 1","Inside: left 4. Outside: down 1.",1,"shift"],
 ["g(x) = 3f(x)","Vertical stretch by a factor of 3","Multiplying the output by 3 stretches vertically.",1,"dilate"],
 ["g(x) = (1/2)f(x)","Vertical shrink by a factor of 1/2","Multiplying the output by 1/2 shrinks vertically.",1,"dilate"],
 ["g(x) = f(2x)","Horizontal compression by a factor of 1/2","Multiplying the input by 2 compresses horizontally.",1,"dilate"],
 ["g(x) = f(x/3)","Horizontal stretch by a factor of 3","Dividing the input by 3 stretches horizontally.",1,"dilate"],
 ["g(x) = −f(x)","Reflection over the x-axis","Negating the output flips the graph up and down.",1,"reflect"],
 ["g(x) = f(−x)","Reflection over the y-axis","Negating the input flips the graph left and right.",1,"reflect"],
 ["g(x) = −f(−x)","Rotation of 180° about the origin","Both reflections together.",1,"reflect"],
 ["g(x) = f⁻¹(x)","Reflection over the line y = x","Inverse functions swap inputs and outputs.",1,"reflect"],
 ["y = sin(x − π/2)","Shift right π/2","Inside: x − π/2 moves the graph right.",3,"trig"],
 ["y = sin(2x)","Period becomes π","Period 2π ÷ 2 = π.",3,"trig"],
 ["y = 4sin x","Amplitude becomes 4","Multiplying the output changes the amplitude.",3,"trig"],
 ["y = sin x + 4","Midline becomes y = 4","Adding outside moves the midline.",3,"trig"],
 ["y = sin(x/2)","Period becomes 4π","Period 2π ÷ (1/2) = 4π.",3,"trig"],
 ["y = 2ˣ⁺³","Vertical stretch by a factor of 8","2ˣ⁺³ = 8·2ˣ: a horizontal shift of an exponential is a vertical dilation.",2,"exp"],
 ["y = 2ˣ − 3","Horizontal asymptote moves to y = −3","Shifting down 3 moves the asymptote too.",2,"exp"],
 ["y = log₂(x − 3)","Vertical asymptote moves to x = 3","Shifting right 3 moves the asymptote.",2,"exp"],
 ["y = log₂(8x)","Shift up 3","log₂(8x) = log₂ 8 + log₂ x = 3 + log₂ x.",2,"exp"],
 ["y = (1/2)ˣ","Reflection of y = 2ˣ over the y-axis","(1/2)ˣ = 2⁻ˣ.",2,"exp"]
];
window.CS_PC_CIRCLE = [
 ["sin(π/6)","1/2","y-coordinate at 30°.",3],["cos(π/6)","√3/2","x-coordinate at 30°.",3],["tan(π/6)","√3/3","(1/2) ÷ (√3/2) = √3/3.",3],
 ["sin(π/4)","√2/2","45° gives equal coordinates.",3,["cos(π/4)"]],["tan(π/4)","1","x = y at 45°.",3],["sin(π/3)","√3/2","y-coordinate at 60°.",3],
 ["cos(π/3)","1/2","x-coordinate at 60°.",3],["tan(π/3)","√3","(√3/2) ÷ (1/2).",3],["sin(π/2)","1","Top of the circle.",3],
 ["cos(π/2)","0","Top of the circle: x = 0.",3],["cos(π)","−1","Left end of the circle.",3],["sin(π)","0","Left end: y = 0.",3],
 ["sin(3π/2)","−1","Bottom of the circle.",3],["cos(2π/3)","−1/2","Quadrant II: cosine negative, reference π/3.",3],["sin(2π/3)","√3/2","Quadrant II: sine positive, reference π/3.",3],
 ["sin(5π/6)","1/2","Quadrant II: reference π/6.",3],["cos(5π/6)","−√3/2","Quadrant II: cosine negative.",3],["tan(3π/4)","−1","Quadrant II: tangent negative.",3],
 ["sin(7π/6)","−1/2","Quadrant III: sine negative.",3],["cos(5π/4)","−√2/2","Quadrant III: both negative.",3],["tan(4π/3)","√3","Quadrant III: tangent positive.",3],
 ["cos(5π/3)","1/2","Quadrant IV: cosine positive.",3],["sin(7π/4)","−√2/2","Quadrant IV: sine negative.",3],["tan(11π/6)","−√3/3","Quadrant IV: tangent negative.",3],
 ["arcsin(1/2)","π/6","Range [−π/2, π/2].",3],["arccos(1/2)","π/3","Range [0, π].",3],["arctan(1)","π/4","Range (−π/2, π/2).",3],
 ["arccos(−1)","π","cos π = −1.",3],["arcsin(−√2/2)","−π/4","Negative input gives a negative angle.",3],["arccos(0)","π/2","cos(π/2) = 0.",3]
];
window.CS_PC_LOGS = [
 ["log₂ 32","5","2⁵ = 32.",2],["log₃ 81","4","3⁴ = 81.",2],["log 1000","3","10³ = 1000.",2],["log₅ (1/25)","−2","5⁻² = 1/25.",2],["ln e⁷","7","ln undoes e.",2],
 ["log₄ 2","1/2","4^(1/2) = 2.",2],["log₂ 1","0","Any base to the 0 is 1.",2],["e^(ln 9)","9","e and ln undo each other.",2],["log₂ 8 + log₂ 4","5","log₂ 32 = 5.",2],
 ["log₃ 54 − log₃ 2","3","log₃ 27 = 3.",2],["2log₅ 5","2","2·1 = 2.",2],["log₂ 16 ÷ log₂ 4","2","4 ÷ 2 = 2. (This is log₄ 16.)",2],["log₉ 3","1/2","9^(1/2) = 3.",2],
 ["log 0.01","−2","10⁻² = 0.01.",2],["ln 1","0","e⁰ = 1.",2],["log₆ 36","2","6² = 36.",2],["log₇ 7","1","7¹ = 7.",2],["10^(log 4)","4","10 and log undo each other.",2],
 ["log₂ 64","6","2⁶ = 64.",2],["log₈ 2","1/3","8^(1/3) = 2.",2],["log₄ 64","3","4³ = 64.",2],["log₂ (1/8)","−3","2⁻³ = 1/8.",2],["3log₂ 2 + log₂ 4","5","3 + 2 = 5.",2],["log₁₀ 100 + log₁₀ 10","3","2 + 1 = 3.",2]
];
