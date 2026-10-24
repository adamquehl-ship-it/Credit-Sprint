/* Credit Sprint content, part 3: FRQ graph tasks, animated explainers, CLEP® hub, cram plan template. */

/* Graph tasks attached to FRQs: students drag the curve, and the tool checks it */
window.CS_FRQ_GRAPHS = {
  f1:{mk:"adas", task:"On the AD–AS graph, show the effect of the fiscal policy you chose in (b).", expect:[["AD",1]], why:"Expansionary fiscal policy shifts AD right, toward full employment."},
  f3:{mk:"phillips", task:"Show what happens to the short-run Phillips curve in the long run, part (c).", expect:[["SRPC",1]], why:"Higher expected inflation shifts the SRPC right."},
  f4:{mk:"lf", task:"Show the effect of the government borrowing on the loanable funds market, part (a).", expect:[["D_LF",1]], why:"Government borrowing adds to the demand for loanable funds."},
  f5:{mk:"fx", task:"Show the effect on the market for Zenland's currency, part (a).", expect:[["D$",1]], why:"Higher interest rates raise foreign demand for Zenland's currency.", x:"Quantity of Zenland currency", y:"Dollars per unit", labels:{"D$":"D","S$":"S"}},
  f7:{mk:"money", task:"Show the effect of the open market operation on the money market, part (d).", expect:[["MS",-1]], why:"Selling bonds drains reserves and shifts MS left."},
  f8:{mk:"adas", task:"Show the short-run effect of the oil price increase, part (a).", expect:[["SRAS",-1]], why:"Higher input costs shift SRAS left."},
  f9:{mk:"money", task:"Show the effect of the bond sale on the money market, part (a).", expect:[["MS",-1]], why:"Selling bonds shifts MS left and raises the nominal interest rate."},
  f13:{mk:"lf", task:"Show the effect of the budget surplus on the loanable funds market, part (a).", expect:[["S_LF",1],["D_LF",-1]], why:"Public saving adds to supply (or the government borrows less)."}
};

/* Animated explainers: each step sets the curve positions (and market); the player animates between steps */
window.CS_EXPLAINERS = [
 {id:"x1", u:3, title:"Closing a recessionary gap with fiscal policy", steps:[
   {mk:"adas", s:{}, cap:"Start at long-run equilibrium: AD and SRAS cross on LRAS, at full-employment output."},
   {mk:"adas", s:{AD:-16}, cap:"Consumers cut spending. AD shifts left. Output falls below full employment: a recessionary gap."},
   {mk:"adas", s:{AD:-16}, cap:"Unemployment is now above the natural rate and the price level is lower."},
   {mk:"adas", s:{AD:0}, cap:"Congress raises government spending. With the multiplier, AD shifts back right."},
   {mk:"adas", s:{AD:0}, cap:"Output returns to full employment. Exam tip: label PL₁, Y₁ and Yf on your graph."}]},
 {id:"x2", u:3, title:"How a recessionary gap fixes itself", steps:[
   {mk:"adas", s:{AD:-16}, cap:"The economy sits in a recessionary gap, left of LRAS."},
   {mk:"adas", s:{AD:-16}, cap:"High unemployment puts downward pressure on nominal wages."},
   {mk:"adas", s:{AD:-16, SRAS:16}, cap:"Lower wages cut costs, so SRAS shifts right."},
   {mk:"adas", s:{AD:-16, SRAS:16}, cap:"Output returns to full employment at a lower price level. This takes time, which is why governments often act."}]},
 {id:"x3", u:3, title:"Stagflation from an oil shock", steps:[
   {mk:"adas", s:{}, cap:"Start at long-run equilibrium."},
   {mk:"adas", s:{SRAS:-16}, cap:"Oil prices spike. Production costs rise, and SRAS shifts left."},
   {mk:"adas", s:{SRAS:-16}, cap:"The price level rises while real output falls: stagflation."},
   {mk:"phillips", s:{SRPC:16}, cap:"On the Phillips curve, inflation and unemployment rise together: the SRPC shifts right."}]},
 {id:"x4", u:4, title:"The Fed buys bonds: from money market to GDP", steps:[
   {mk:"money", s:{}, cap:"Money market: the Fed sets the money supply (vertical MS)."},
   {mk:"money", s:{MS:16}, cap:"The Fed buys bonds. Banks get new reserves and lend more, so MS shifts right."},
   {mk:"money", s:{MS:16}, cap:"The nominal interest rate falls."},
   {mk:"adas", s:{AD:16}, cap:"Cheaper borrowing raises investment, so AD shifts right: real GDP and the price level rise."}]},
 {id:"x5", u:5, title:"Crowding out", steps:[
   {mk:"lf", s:{}, cap:"Loanable funds market: savers supply funds, borrowers demand them."},
   {mk:"lf", s:{D_LF:16}, cap:"The government borrows to cover a deficit. Demand for loanable funds shifts right."},
   {mk:"lf", s:{D_LF:16}, cap:"The real interest rate rises."},
   {mk:"lf", s:{D_LF:16}, cap:"Some private investment no longer pays off at the higher rate. It's crowded out, and the capital stock grows more slowly."}]},
 {id:"x6", u:6, title:"Interest rates and the dollar", steps:[
   {mk:"fx", s:{}, cap:"The market for U.S. dollars: foreigners demand dollars, Americans supply them."},
   {mk:"fx", s:{"D$":16}, cap:"U.S. interest rates rise. Foreign investors want U.S. assets, so demand for dollars shifts right."},
   {mk:"fx", s:{"D$":16}, cap:"The dollar appreciates: it buys more foreign currency."},
   {mk:"adas", s:{AD:-12}, cap:"U.S. goods now cost more abroad. Net exports fall and AD shifts left."}]},
 {id:"x7", u:5, title:"Expected inflation and the Phillips curve", steps:[
   {mk:"phillips", s:{}, cap:"The SRPC crosses the LRPC at the natural rate of unemployment and the expected inflation rate."},
   {mk:"phillips", s:{SRPC:16}, cap:"People come to expect higher inflation. Workers demand higher wages, and the SRPC shifts right."},
   {mk:"phillips", s:{SRPC:16}, cap:"At every unemployment rate, inflation is now higher. The LRPC hasn't moved."}]},
 {id:"x8", u:1, title:"When supply and demand both shift", steps:[
   {mk:"sd", s:{}, cap:"Start at equilibrium."},
   {mk:"sd", s:{D:14}, cap:"Demand increases: price and quantity both rise."},
   {mk:"sd", s:{D:14, S:14}, cap:"Supply also increases: quantity rises again, but price falls back."},
   {mk:"sd", s:{D:14, S:14}, cap:"With both shifting right, quantity definitely rises. The price change depends on which shift is bigger: indeterminate."}]}
];

/* CLEP® hub */
window.CS_CLEP = {
  growth:{
    title:"Economic Growth and Productivity",
    weight:"5–10% of the CLEP® exam",
    summary:"CLEP® tests growth as its own content area. Growth means a sustained rise in real GDP per person, and it comes from more and better inputs: physical capital, human capital and technology.",
    points:["Measure growth with the percentage change in real GDP per capita, not nominal GDP.","Productivity (output per worker) is the main driver of long-run living standards.","Physical capital (machines, buildings) and human capital (skills, education) both raise productivity.","Research and development creates new technology, shifting the production function up.","Saving funds investment through the loanable funds market; crowding out can slow growth.","Policies that promote growth: education and training, R&D support, stable institutions and property rights, incentives to save and invest.","Growth shows on graphs as an outward PPC shift and a rightward LRAS shift.","Rule of 70: years to double ≈ 70 ÷ growth rate."],
    match:/growth|productiv|capital|rule of 70|standard of living|per capita|LRAS shifts right|human capital|technolog/i
  },
  guide:[
    {h:"The exam at a glance", p:["About 80 multiple-choice questions in 90 minutes. Some are unscored pretest questions, so don't panic over a strange one.","Scores run from 20 to 80. The American Council on Education recommends credit for a 50, worth 3 semester hours, but each college sets its own policy.","There's no free-response section and no penalty for guessing, so answer every question."]},
    {h:"Before you register", p:["Check your college's CLEP® policy first: the score it requires and the course it gives credit for. Search your registrar's site for \"CLEP\".","Finish the free Modern States course for Principles of Macroeconomics to get a voucher that covers the exam fee.","The CLEP® exam fee is $97 (2025–26). Test centers or remote proctoring add their own fee."]},
    {h:"Test center or at home", p:["Test centers are often on college campuses. Bring an approved photo ID.","At-home exams use remote proctoring. You install the ETS Online Test Application, run its equipment check, and use a smartphone with the Proctortrack app as a second camera.","You'll do a face scan, ID scan and room scan. One reschedule is free; more cost $10 each."]},
    {h:"On exam day", p:["Pace yourself: 90 minutes for about 80 questions is just over a minute each. Flag hard questions and come back.","Draw quick sketches of graphs on scratch paper; most macro questions are graph questions in disguise.","Your score appears on screen right after the exam for most subjects."]},
    {h:"After the exam", p:["Scores sent to colleges can take 10–14 business days to arrive, and the college may need more time to post credit.","If you don't pass, you must wait three months before retaking the same exam. A retake inside that window is canceled and the fee is forfeited.","Use the wait: your mistakes notebook and a fresh study plan will be ready."]}
  ],
  sources:[
    ["CLEP® Principles of Macroeconomics","https://clep.collegeboard.org/clep-exams/principles-macroeconomics"],
    ["At-home CLEP® exams","https://clep.collegeboard.org/at-home-clep-exams"],
    ["Modern States","https://modernstates.org/"]
  ]
};

/* 30-day cram plan template. u:"w1" = weakest unit, "w2" = second weakest, etc. */
window.CS_CRAM = [
 {u:"w1", t:"Read the guide, then a 10-question unit quiz"},{u:"w1", t:"Watch the explainers, redraw the key graph, and beat the unit boss"},{u:"w1", t:"Flashcards for this unit, then 10 calculation drills"},
 {u:"w2", t:"Read the guide, then a 10-question unit quiz"},{u:"w2", t:"Explainers, key graph, unit boss"},{u:"w2", t:"Flashcards and drills"},
 {u:"w3", t:"Read the guide, then a 10-question unit quiz"},{u:"w3", t:"Explainers, key graph, unit boss"},{u:"w3", t:"Flashcards and drills"},
 {u:"mix", t:"Mini practice exam (20 questions), then review every miss"},
 {u:"w4", t:"Read the guide, then a 10-question unit quiz"},{u:"w4", t:"Explainers, key graph, unit boss"},{u:"w4", t:"Flashcards and drills"},
 {u:"w5", t:"Read the guide, then a 10-question unit quiz"},{u:"w5", t:"Explainers, key graph, unit boss"},{u:"w5", t:"Flashcards and drills"},
 {u:"w6", t:"Read the guide, then a 10-question unit quiz"},{u:"w6", t:"Explainers, key graph, unit boss"},
 {u:"mix", t:"Full-length practice exam under time"},
 {u:"mix", t:"Mistakes notebook: clear everything that's due"},
 {u:"w1", t:"Second pass on your weakest unit: smart review + boss rematch"},
 {u:"w2", t:"Second pass on your second-weakest unit"},
 {u:"mix", t:"Graph questions + Draw the graph (20 minutes)"},
 {u:"mix", t:"Two FRQs under time, then score them (AP®) or a mini exam (CLEP®)"},
 {u:"mix", t:"Smart review (15 questions) + Chain Reaction"},
 {u:"mix", t:"Full-length practice exam under time"},
 {u:"mix", t:"Review every miss from the practice exam"},
 {u:"w3", t:"Third-weakest unit: quiz + flashcards"},
 {u:"mix", t:"Light review: daily challenge, due flashcards, formulas from every unit"},
 {u:"mix", t:"Exam eve: rest, skim the exam traps, sleep early"}
];
