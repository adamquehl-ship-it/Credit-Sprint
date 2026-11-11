/* Credit Sprint course registry. Loaded first: picks the active course and lists the data files app.html loads for it.
   Each course keeps its own saved progress; streak, XP, pets, badges and plan are shared (see core.js). */
(function(){
"use strict";
const MACRO = ["questions.js","questions2.js","questions3.js","questions4.js","questions5.js","fifth.js","content.js","content2.js","frqs2.js","drills.js","content3.js","extra.js"].map(f => "assets/data/"+f);
const MICRO = ["questions.js","questions2.js","questions3.js","questions4.js","questions5.js","content.js","content2.js","frqs2.js","drills.js","extra.js"].map(f => "assets/data/micro/"+f);
const BIO = ["questions.js","questions2.js","questions3.js","questions4.js","questions5.js","questions6.js","questions7.js","content.js","content2.js","frqs2.js","drills.js","extra.js"].map(f => "assets/data/bio/"+f);
const CHEM = ["questions.js","questions2.js","questions3.js","questions4.js","questions5.js","questions6.js","questions7.js","questions8.js","content.js","content2.js","frqs2.js","drills.js","extra.js"].map(f => "assets/data/chem/"+f);
/* n1–n10 (set 2 questions) and vocab2.js load after the originals so existing question and card ids never change */
const MKT = ["m1.js","m2.js","m3.js","m4.js","m5.js","m6.js","m7.js","m8.js","m9.js","m10.js","n1.js","n2.js","n3.js","n4.js","n5.js","n6.js","n7.js","n8.js","n9.js","n10.js","content.js","vocab2.js","content2.js","frqs2.js","frqs3.js","drills.js"].map(f => "assets/data/mkt/"+f);
const APPSYCH = ["cards.js","cards2.js","p1.js","p2.js","p3.js","p4.js","p5.js","p6.js","p7.js","p8.js","p9.js","p10.js","p11.js","p12.js","p13.js","p14.js","p15.js","content.js","content2.js","frqs2.js","frqs4.js","drills.js","games.js"].map(f=>"assets/data/appsych/"+f);
const APSTAT = ["cards.js","cards2.js","p1.js","p2.js","p3.js","p4.js","p5.js","p6.js","g1.js","g2.js","g3.js","g4.js","g5.js","s1.js","s3.js","s4.js","s5.js","content.js","content2.js","frqs2.js","drills.js","games.js"].map(f=>"assets/data/apstat/"+f);
const APGOV = ["cards.js","cards2.js","p1.js","p2.js","p3.js","p4.js","p5.js","p6.js","p7.js","p8.js","p9.js","p10.js","p11.js","p12.js","p13.js","p14.js","p15.js","p16.js","p17.js","p18.js","p19.js","p20.js","p21.js","content.js","content2.js","frqs2.js","frqs4.js","drills.js","games.js"].map(f=>"assets/data/apgov/"+f);
const APWORLD = ["cards.js","cards2.js","p1.js","p2.js","p3.js","p4.js","p5.js","p6.js","p7.js","p8.js","p9.js","p10.js","p11.js","p12.js","p13.js","content.js","content2.js","frqs2.js","frqs4.js","drills.js","src.js"].map(f => "assets/data/apworld/"+f);
const APUSH = ["cards.js","cards2.js","p1.js","p2.js","p3.js","p4.js","p5.js","p6.js","p7.js","p8.js","p9.js","content.js","content2.js","frqs2.js","frqs3.js","frqs4.js","drills.js"].map(f => "assets/data/apush/"+f);
const APLIT = ["cards.js","cards2.js","terms.js","x1.js","f1.js","f2.js","f3.js","f4.js","v1.js","v2.js","v3.js","v4.js","d1.js","a1.js","content.js","content2.js","essays1.js","essays2.js","essays3.js","games.js"].map(f=>"assets/data/aplit/"+f);
const APLANG = ["cards.js","cards2.js","terms.js","x1.js","x2.js","r1.js","r2.js","r3.js","r4.js","w1.js","w2.js","w3.js","content.js","content2.js","essays1.js","essays2.js","essays3.js","games.js"].map(f=>"assets/data/aplang/"+f);
const APHUG = ["cards.js","p1.js","p2.js","p3.js","p4.js","p5.js","p6.js","p7.js","p8.js","content.js","content2.js","frqs.js","drills.js","games.js"].map(f=>"assets/data/aphug/"+f);
const CALC_AB_FILES = ["cards.js","c1.js","c2.js","g1.js","g2.js","g3.js","g4.js","g5.js","g6.js","g7.js","g8.js","content.js","content2.js","frqs.js","drills.js","games.js"];
const CALCAB = CALC_AB_FILES.map(f=>"assets/data/calc/"+f);
const CALCBC = CALCAB.concat(["cards.js","c1.js","g9.js","g10.js","content.js","content2.js","frqs.js","drills.js","games.js"].map(f=>"assets/data/calc/bc/"+f));
const PRECALC = ["cards.js","c1.js","g1.js","g2.js","g3.js","g4.js","content.js","content2.js","frqs.js","drills.js","games.js"].map(f=>"assets/data/precalc/"+f);
const C = window.CS_COURSES = {
  macro:{k:"macro", name:"Macroeconomics", short:"Macro", ap:"AP® Macroeconomics", clep:"CLEP® Principles of Macroeconomics", clepShort:"CLEP® Principles of Macro",
    bosses:{1:"The Opportunity Costumer",2:"The Index Inflator",3:"The Multiplier Monster",4:"The Reserve Wraith",5:"The Phillips Phantom",6:"The Currency Kraken"}, key:"creditsprint.v3", col:"#4F46E5", soft:"#EEF2FF", apFmt:"60 multiple choice + 3 free response in 2 hours 10 minutes", clepFmt:"About 80 multiple choice in 90 minutes", blurb:"GDP, inflation, money and banks, fiscal and monetary policy, trade.", icon:"bank", data:MACRO, nUnits:6, cat:"Economics"},
  micro:{k:"micro", name:"Microeconomics", short:"Micro", ap:"AP® Microeconomics", clep:"CLEP® Principles of Microeconomics", clepShort:"CLEP® Principles of Micro",
    bosses:{1:"The Scarcity Specter",2:"The Elasticity Eel",3:"The Marginal Cost Golem",4:"The Monopoly Overlord",5:"The Wage Warden",6:"The Externality Ooze"}, key:"creditsprint.micro.v1", col:"#059669", soft:"#ECFDF5", apFmt:"60 multiple choice + 3 free response in 2 hours 10 minutes", clepFmt:"About 80 multiple choice in 90 minutes", blurb:"Supply and demand, costs, perfect competition, monopoly, labor markets, market failure.", icon:"chart", data:MICRO, nUnits:6, cat:"Economics"},
  bio:{k:"bio", name:"Biology", short:"Bio", ap:"AP® Biology", clep:"CLEP® Biology", clepShort:"CLEP® Biology",
    key:"creditsprint.bio.v1", col:"#0891B2", soft:"#ECFEFF", apFmt:"60 multiple choice + 6 free response in 3 hours", clepFmt:"About 115 multiple choice in 90 minutes", blurb:"Cells, energy, genetics, gene expression, evolution and ecology.", icon:"dna", data:BIO, nUnits:8, cat:"Science",
    graphs:false, unitWord:"Unit",
    exams:{ap:{full:{n:60, min:90, name:"Full AP® Section I"}, mini:{n:20, min:30, name:"Mini exam"}}, clep:{full:{n:115, min:90, name:"Full-length CLEP®"}, mini:{n:25, min:20, name:"Mini exam"}}},
    bosses:{1:"The Polar Hydra",2:"The Membrane Mimic",3:"The ATP Thief",4:"The Rogue Cell",5:"The Recessive Wraith",6:"The Frameshift Fiend",7:"The Extinction Engine",8:"The Invasive Swarm"},
    chainDesc:"Put the biology steps in order: from a hormone signal to a cell's response, from DNA to protein, from a population to a new species.",
    crunchDesc:"Two minutes of calculations: Hardy–Weinberg, chi-square, water potential, SA:V, energy transfer and population growth. Type the number.",
    drillDesc:"Hardy–Weinberg, chi-square, water potential, population growth: fresh numbers every time.",
    planGames:["Cross It","Sprint","Match-up","Chain Reaction","Number Crunch","True or False"]},
  chem:{k:"chem", name:"Chemistry", short:"Chem", ap:"AP® Chemistry", clep:"CLEP® Chemistry", clepShort:"CLEP® Chemistry",
    key:"creditsprint.chem.v1", col:"#EA580C", soft:"#FFF7ED", apFmt:"60 multiple choice + 7 free response in 3 hours 15 minutes", clepFmt:"About 75 multiple choice in 90 minutes", blurb:"Atoms, bonding, reactions, kinetics, thermodynamics, equilibrium, acids and bases, electrochemistry.", icon:"flask", data:CHEM, nUnits:9, cat:"Science",
    graphs:false, unitWord:"Unit",
    exams:{ap:{full:{n:60, min:90, name:"Full AP® Section I"}, mini:{n:20, min:30, name:"Mini exam"}}, clep:{full:{n:75, min:90, name:"Full-length CLEP®"}, mini:{n:25, min:30, name:"Mini exam"}}},
    bosses:{1:"The Electron Thief",2:"The Bond Breaker",3:"The Pressure Phantom",4:"The Limiting Reagent",5:"The Slow Burn",6:"The Heat Leech",7:"The Equilibrium Shifter",8:"The Acid Rain Dragon",9:"The Entropy Engine"},
    chainDesc:"Put the chemistry steps in order: from a limiting reactant problem to a net ionic equation, from a rate law to a galvanic cell.",
    crunchDesc:"Two minutes of calculations: moles, molarity, gas laws, heat, pH, equilibrium constants and free energy. Type the number.",
    drillDesc:"Moles, molarity, gas laws, calorimetry, pH and electrochemistry: fresh numbers every time.",
    planGames:["Balance It","Sprint","Match-up","Chain Reaction","Number Crunch","True or False"]},
  apush:{k:"apush", name:"U.S. History", short:"US History", ap:"AP® U.S. History", clep:"CLEP® History of the U.S. I and II", clepShort:"CLEP® U.S. History",
    key:"creditsprint.apush.v1", col:"#B91C1C", soft:"#FEF2F2", apFmt:"55 multiple choice + SAQs, a DBQ and an LEQ in 3 hours 15 minutes", clepFmt:"About 120 multiple choice in 90 minutes (each of the two exams)", blurb:"Contact and colonies, the Revolution, the Constitution, expansion, the Civil War, industrialization, two world wars, the Cold War and modern America.", icon:"flag", data:APUSH, nUnits:9, cat:"History",
    graphs:false, unitWord:"Period", clepQ:"about 120",
    apExamText:"The real exam has 55 multiple-choice questions in 55 minutes (40% of your score), then 3 short-answer questions, a document-based question and a long essay in 100 minutes. Practice the written parts in the Free response tab.",
    exams:{ap:{full:{n:55, min:55, name:"Full-length AP® multiple choice"}, mini:{n:20, min:20, name:"Mini exam"}}, clep:{full:{n:120, min:90, name:"Full-length CLEP®"}, mini:{n:30, min:23, name:"Mini exam"}}},
    bosses:{1:"The Conquistador",2:"The Plantation Lord",3:"The Redcoat Regiment",4:"The Cotton Baron",5:"The Secession Specter",6:"The Robber Baron",7:"The Doughboy Dragon",8:"The Iron Curtain Guardian",9:"The Gridlock Golem"},
    chainDesc:"Put the events in order: from colonies to independence, from compromise to civil war, from boom to bust to recovery.",
    crunchDesc:"Two minutes of timeline recall: which period does each event, person or law belong to? Type the period number, 1 to 9.",
    drillDesc:"Date the event: name the AP® period (1 to 9) for key events, people and laws. Fresh questions every time.",
    planGames:["Timeline Sort","Source Match","Sprint","Match-up","Chain Reaction","True or False"]},
  apworld:{k:"apworld", name:"World History", short:"World History", ap:"AP\u00AE World History: Modern", clep:"", clepShort:"", apOnly:true,
    key:"creditsprint.apworld.v1", col:"#0F766E", soft:"#F0FDFA", apFmt:"55 multiple choice, 3 SAQs, a DBQ and an LEQ in 3 hours 15 minutes", clepFmt:"", blurb:"Global tapestry and trade networks, land-based empires, the Atlantic world, revolutions, industrialization, world wars, the Cold War and globalization.", icon:"globe", data:APWORLD, nUnits:9, cat:"History",
    graphs:false, unitWord:"Unit",
    apExamText:"The real exam has 55 multiple-choice questions in 55 minutes (40% of your score), then 3 short-answer questions, a document-based question and a long essay in 100 minutes. Practice the written parts in the Free response tab.",
    exams:{ap:{full:{n:55, min:55, name:"Full-length AP\u00AE multiple choice"}, mini:{n:20, min:20, name:"Mini exam"}}, clep:{full:{n:55, min:55, name:"Full-length AP\u00AE multiple choice"}, mini:{n:20, min:20, name:"Mini exam"}}},
    bosses:{1:"The Dynasty Dragon",2:"The Caravan Bandit",3:"The Sultan's Cannon",4:"The Galleon Ghost",5:"The Guillotine Golem",6:"The Smokestack Titan",7:"The Trench Warlord",8:"The Wall Warden",9:"The Supply Chain Specter"},
    chainDesc:"Put the events in order: from trade routes to empires, from revolution to industry, from world war to global village.",
    crunchDesc:"Two minutes of timeline recall: which AP\u00AE era does each event, person or empire belong to? Type 1 to 4.",
    drillDesc:"Place the event: name the AP\u00AE era for key events, empires and people. Fresh questions every time.",
    planGames:["Timeline Sort","Source Match","Sprint","Match-up","Chain Reaction","True or False"]},
  aphug:{k:"aphug", name:"Human Geography", short:"Human Geo", ap:"AP\u00AE Human Geography", clep:"", clepShort:"", apOnly:true,
    key:"creditsprint.aphug.v1", col:"#15803D", soft:"#F0FDF4", apFmt:"60 multiple choice and 3 free-response questions in 2 hours 15 minutes", clepFmt:"", blurb:"Maps and scale, population and migration, culture, language and religion, political geography, agriculture, cities and economic development.", icon:"map", data:APHUG, nUnits:7, cat:"Social science",
    graphs:false, unitWord:"Unit", frqHead:"AP\u00AE Section II \u00B7 3 questions \u00B7 75 minutes",
    apExamText:"The real exam is digital: 60 multiple-choice questions in 60 minutes (50% of your score), many built around maps, charts and data, then 3 free-response questions in 75 minutes (50%): one with no stimulus, one with one stimulus and one with two. Practice the written parts in the Free response tab.",
    exams:{ap:{full:{n:60, min:60, name:"Full-length AP\u00AE multiple choice"}, mini:{n:20, min:20, name:"Mini exam"}}, clep:{full:{n:60, min:60, name:"Full-length AP\u00AE multiple choice"}, mini:{n:20, min:20, name:"Mini exam"}}},
    bosses:{1:"The Map Distorter",2:"The Malthusian Menace",3:"The Diffusion Djinn",4:"The Gerrymander",5:"The Monocrop Monarch",6:"The Sprawl Specter",7:"The Smokestack Baron"},
    chainDesc:"Put the steps in order: the demographic transition, a migration decision, the spread of a trend, devolution, the Green Revolution, gentrification and Rostow's stages.",
    crunchDesc:"Two minutes of geography math: densities, natural increase, doubling time, dependency ratios, the rank-size rule and the gravity model. Type the number.",
    drillDesc:"Do the geography math: arithmetic and physiological density, birth rates, natural increase, doubling time, dependency ratios, map scale, rank-size and GNI per capita. Fresh numbers every time.",
    planGames:["Model Match","Diffusion Sort","Pyramid Reader","Sector Sort","Sprint","True or False"]},
  apgov:{k:"apgov", name:"U.S. Government", short:"US Gov", ap:"AP\u00AE U.S. Government and Politics", clep:"CLEP\u00AE American Government", clepShort:"CLEP\u00AE American Government",
    key:"creditsprint.apgov.v1", col:"#1E3A8A", soft:"#EFF6FF", apFmt:"55 multiple choice and 4 free-response questions in 3 hours", clepFmt:"About 100 multiple choice in 90 minutes", blurb:"Foundations of democracy, Congress, the presidency and the courts, civil liberties and civil rights, political beliefs and elections: with landmark cases and foundational documents.", icon:"landmark", data:APGOV, nUnits:5, cat:"Government",
    graphs:false, unitWord:"Unit", clepQ:"about 100",
    apExamText:"The real exam has 55 multiple-choice questions in 80 minutes (50% of your score), then 4 free-response questions in 100 minutes: Concept Application, Quantitative Analysis, SCOTUS Comparison and Argument Essay. Practice the written parts in the Free response tab.",
    exams:{ap:{full:{n:55, min:80, name:"Full-length AP\u00AE multiple choice"}, mini:{n:20, min:29, name:"Mini exam"}}, clep:{full:{n:100, min:90, name:"Full-length CLEP\u00AE"}, mini:{n:25, min:23, name:"Mini exam"}}},
    bosses:{1:"The Faction Fiend",2:"The Gridlock Golem",3:"The Censor Specter",4:"The Pollster Phantom",5:"The Lobby Leviathan"},
    chainDesc:"Put the steps in order: how a bill becomes a law, how a case reaches the Supreme Court, how an amendment is ratified and how a president is elected.",
    crunchDesc:"Two minutes of civics math: veto overrides, electoral votes, turnout and margins of error. Fresh numbers every time.",
    drillDesc:"Do the civics math: override votes, majorities, electoral votes, turnout and poll ranges. Fresh numbers every time.",
    planGames:["Court Case Match","Branch Check","Amendment Sprint","Source Match","Sprint","True or False"]},
  appsych:{k:"appsych", name:"Psychology", short:"Psych", ap:"AP\u00AE Psychology", clep:"CLEP\u00AE Introductory Psychology", clepShort:"CLEP\u00AE Intro Psychology",
    key:"creditsprint.appsych.v1", col:"#7C3AED", soft:"#F5F3FF", apFmt:"75 multiple choice and 2 free-response questions in 2 hours 40 minutes", clepFmt:"About 95 multiple choice in 90 minutes", blurb:"The brain and behavior, memory and thinking, development and learning, social psychology and personality, mental health and treatment: with famous studies and research methods.", icon:"brain", data:APPSYCH, nUnits:5, cat:"Social science",
    graphs:false, unitWord:"Unit", clepQ:"about 95",
    apExamText:"The real exam has 75 multiple-choice questions in 90 minutes (66.7% of your score), then 2 free-response questions in 70 minutes (33.3%): an Article Analysis Question and an Evidence-Based Question. Practice the written parts in the Free response tab.",
    exams:{ap:{full:{n:75, min:90, name:"Full-length AP\u00AE multiple choice"}, mini:{n:20, min:24, name:"Mini exam"}}, clep:{full:{n:95, min:90, name:"Full-length CLEP\u00AE"}, mini:{n:25, min:24, name:"Mini exam"}}},
    bosses:{1:"The Synapse Specter",2:"The Forgetting Phantom",3:"The Conditioning Colossus",4:"The Bias Beast",5:"The Stress Serpent"},
    chainDesc:"Put the steps in order: the neuron's signal, a controlled experiment, how memory forms, conditioning and the stages of sleep.",
    crunchDesc:"Two minutes of psychology math: z-scores, IQ, means, medians and percents. Fresh numbers every time.",
    drillDesc:"Do the statistics: z-scores, IQ, means, medians, ranges, percents and the normal curve. Fresh numbers every time.",
    planGames:["Famous Studies Match","Brain Check","Disorder Sort","Bias Spotter","Sprint","True or False"]},
  apstat:{k:"apstat", name:"Statistics", short:"Statistics", ap:"AP\u00AE Statistics", clep:"", clepShort:"", apOnly:true,
    key:"creditsprint.apstat.v1", col:"#0369A1", soft:"#F0F9FF", apFmt:"42 multiple choice and 4 free-response questions in 3 hours", clepFmt:"", blurb:"Exploring data and collecting data, probability and distributions, inference for proportions and means, and regression: built for the redesigned course and its first exam in May 2027.", icon:"chart", data:APSTAT, nUnits:5, cat:"Math & statistics",
    graphs:false, unitWord:"Unit",
    apExamText:"The real exam is digital and has 42 multiple-choice questions in 90 minutes (50% of your score), then 4 free-response questions in 90 minutes (50%), with a calculator allowed. Practice the written parts in the Free response tab.",
    exams:{ap:{full:{n:42, min:90, name:"Full-length AP\u00AE multiple choice"}, mini:{n:15, min:32, name:"Mini exam"}}, clep:{full:{n:42, min:90, name:"Full-length AP\u00AE multiple choice"}, mini:{n:15, min:32, name:"Mini exam"}}},
    bosses:{1:"The Outlier Ogre",2:"The Dice Demon",3:"The Margin Monster",4:"The T-Rex Tyrant",5:"The Residual Wraith"},
    chainDesc:"Put the steps in order: a hypothesis test, a confidence interval, a well-designed experiment and a regression analysis.",
    crunchDesc:"Two minutes of statistics math: z-scores, expected values, standard errors, test statistics and regression. Fresh numbers every time.",
    drillDesc:"Do the calculations: z-scores, the empirical rule, binomial mean and SD, standard errors, t and z statistics, slopes and residuals. Fresh numbers every time.",
    planGames:["Which Test?","Shape Match","Bias Spotter","Probability Plinko","Sprint","True or False"]},
  aplit:{k:"aplit", name:"English Literature", short:"Lit", ap:"AP\u00AE English Literature", clep:"CLEP\u00AE Analyzing and Interpreting Literature", clepShort:"CLEP\u00AE Analyzing Literature",
    key:"creditsprint.aplit.v1", col:"#BE123C", soft:"#FFF1F2", apFmt:"55 multiple choice and 3 essays in 3 hours", clepFmt:"About 80 multiple choice in 90 minutes", blurb:"Short fiction, poetry, novels and drama: character, narrator, structure, imagery, form and the literary argument essay, with reading passages and essay practice.", icon:"quill", data:APLIT, nUnits:6, cat:"English",
    graphs:false, unitWord:"Unit", reading:true, frqHead:"AP\u00AE Section II \u00B7 3 essays \u00B7 2 hours",
    apExamText:"The real exam is digital: 55 multiple-choice questions on 5 passages (prose fiction, drama and poetry) in 60 minutes (45% of your score), then 3 essays in 2 hours (55%): a poetry analysis, a prose fiction analysis and a literary argument. Practice the essays in the Free response tab.",
    exams:{ap:{full:{n:55, min:60, name:"Full-length AP\u00AE multiple choice"}, mini:{n:20, min:22, name:"Mini exam"}}, clep:{full:{n:80, min:90, name:"Full-length CLEP\u00AE"}, mini:{n:25, min:28, name:"Mini exam"}}},
    bosses:{1:"The Shapeshifter",2:"The Unreliable Narrator",3:"The Masked Speaker",4:"The Sonnet Sphinx",5:"The Tragic Flaw",6:"The Blank Page"},
    chainDesc:"Put the steps in order: plot structure, a sonnet's turn, a tragedy's arc and how to build a literary argument essay.",
    planGames:["Device Spotter","Name That Form","Point of View Sort","Tone Check","Sprint","True or False"]},
  aplang:{k:"aplang", name:"English Language", short:"Lang", ap:"AP\u00AE English Language", clep:"CLEP\u00AE College Composition", clepShort:"CLEP\u00AE College Composition",
    key:"creditsprint.aplang.v1", col:"#B45309", soft:"#FFFBEB", apFmt:"45 multiple choice and 3 essays in 3 hours 15 minutes", clepFmt:"About 50 multiple choice and 2 essays in 2 hours", blurb:"Rhetoric and argument: the rhetorical situation, claims and evidence, reasoning, style, revising drafts and the synthesis, rhetorical analysis and argument essays.", icon:"speech", data:APLANG, nUnits:6, cat:"English",
    graphs:false, unitWord:"Unit", reading:true, frqHead:"AP\u00AE Section II \u00B7 3 essays \u00B7 2 hours 15 minutes",
    apExamText:"The real exam is digital: 45 multiple-choice questions in 60 minutes (45% of your score), about half on reading nonfiction and half on revising drafts, then 3 essays in 2 hours 15 minutes (55%): synthesis, rhetorical analysis and argument. Practice the essays in the Free response tab.",
    exams:{ap:{full:{n:45, min:60, name:"Full-length AP\u00AE multiple choice"}, mini:{n:18, min:24, name:"Mini exam"}}, clep:{full:{n:50, min:50, name:"Full-length CLEP\u00AE multiple choice"}, mini:{n:20, min:20, name:"Mini exam"}}},
    bosses:{1:"The Context Chameleon",2:"The Straw Man",3:"The Non Sequitur",4:"The Tone Shifter",5:"The Red Pen",6:"The Blank Page"},
    chainDesc:"Put the steps in order: planning a synthesis essay, building a paragraph, a rhetorical analysis and revising a draft.",
    planGames:["Appeal Sort","Fallacy Finder","Claim or Evidence?","Rhetoric Spotter","Sprint","True or False"]},
  mkt:{k:"mkt", name:"Marketing", short:"Marketing", ap:"CLEP® Principles of Marketing", clep:"CLEP® Principles of Marketing", clepShort:"CLEP® Principles of Marketing", clepOnly:true,
    key:"creditsprint.mkt.v1", col:"#DB2777", soft:"#FDF2F8", apFmt:"", clepFmt:"About 100 multiple choice in 90 minutes", blurb:"Marketing concept, strategy, research, consumer behavior, segmentation, the 4 Ps, e-commerce and ethics.", icon:"mega", data:MKT, nUnits:10, cat:"Business",
    graphs:false, unitWord:"Unit",
    exams:{ap:{full:{n:100, min:90, name:"Full-length CLEP®"}, mini:{n:25, min:22, name:"Mini exam"}}, clep:{full:{n:100, min:90, name:"Full-length CLEP®"}, mini:{n:25, min:22, name:"Mini exam"}}},
    bosses:{1:"The Greenwash Ghost",2:"The Product Pusher",3:"The Biased Survey",4:"The Impulse Imp",5:"The One-Size-Fits-All",6:"The Gatekeeper Buyer",7:"The Commodity Clone",8:"The Price War Wyrm",9:"The Stockout Specter",10:"The Spam Swarm"},
    chainDesc:"Put the marketing steps in order: from a research problem to a decision, from awareness to purchase, from a product idea to the market.",
    crunchDesc:"Two minutes of marketing math: markup, margin, break-even, market share, elasticity of demand and reach. Type the number.",
    drillDesc:"Markups, margins, break-even, market share, elasticity and channel math: fresh numbers every time.",
    mocks:3, clepAreas:[{n:"Marketing in society", w:"8–13%", units:[1]}, {n:"Marketing in the organization", w:"17–24%", units:[2,3]}, {n:"Target marketing", w:"22–27%", units:[4,5,6]}, {n:"The marketing mix", w:"40–50%", units:[7,8,9,10]}],
    planGames:["Mix Master","Segment Sniper","Lifecycle Ladder","Pricing Pick","Promo Mix Match","Sprint","Match-up","Chain Reaction","Number Crunch","True or False"]},
  calcab:{k:"calcab", name:"Calculus AB", short:"Calc AB", ap:"AP\u00AE Calculus AB", clep:"CLEP\u00AE Calculus", clepShort:"CLEP\u00AE Calculus",
    key:"creditsprint.calcab.v1", col:"#65A30D", soft:"#F7FEE7", apFmt:"42 multiple choice and 6 free-response questions in 3 hours 10 minutes", clepFmt:"About 44 multiple choice in 90 minutes", blurb:"Limits, derivatives and their applications, integrals and the Fundamental Theorem, differential equations, and area and volume. AP\u00AE Calculus AB and CLEP\u00AE Calculus.", icon:"integral", data:CALCAB, nUnits:8, cat:"Math & statistics",
    graphs:false, unitWord:"Unit", frqHead:"AP\u00AE Section II \u00B7 6 questions \u00B7 90 minutes",
    apExamText:"The real exam is hybrid digital: 42 multiple-choice questions in 1 hour 40 minutes (29 without a calculator, then 13 with a graphing calculator), worth 50% of your score, then 6 free-response questions in 90 minutes (2 with a calculator, 4 without), worth 50%, handwritten on paper. Practice the written parts in the Free response tab.",
    exams:{ap:{full:{n:42, min:100, name:"Full-length AP\u00AE multiple choice"}, mini:{n:15, min:36, name:"Mini exam"}}, clep:{full:{n:44, min:90, name:"Full-length CLEP\u00AE"}, mini:{n:20, min:41, name:"Mini exam"}}},
    bosses:{1:"The Limit Lurker",2:"The Secant Sorceress",3:"The Chain Wraith",4:"The Rate Racer",5:"The Extremum Empress",6:"The Riemann Reaper",7:"The Slope Field Siren",8:"The Volume Vandal"},
    chainDesc:"Put the steps in order: evaluating a limit, related rates, optimization, u-substitution, separable differential equations and volumes.",
    crunchDesc:"Two minutes of calculus calculations: derivatives at a point, limits, Riemann sums, integrals, average value and volumes. Type the number.",
    drillDesc:"Do the calculations: limits, derivatives, tangent lines, related rates, Riemann sums, definite integrals, growth and decay, area and volume. Fresh numbers every time.",
    planGames:["Derivative Dash","Tangent Shot","Graph Detective","Integral Sprint","Sprint","True or False"]},
  calcbc:{k:"calcbc", name:"Calculus BC", short:"Calc BC", ap:"AP\u00AE Calculus BC", clep:"", clepShort:"", apOnly:true,
    key:"creditsprint.calcbc.v1", col:"#A21CAF", soft:"#FDF4FF", apFmt:"42 multiple choice and 6 free-response questions in 3 hours 10 minutes", clepFmt:"", blurb:"Everything in Calculus AB plus integration by parts, improper integrals, Euler's method, logistic growth, parametric, polar and vector functions, and infinite series. AP\u00AE Calculus BC only.", icon:"integral", data:CALCBC, nUnits:10, cat:"Math & statistics",
    graphs:false, unitWord:"Unit", frqHead:"AP\u00AE Section II \u00B7 6 questions \u00B7 90 minutes",
    apExamText:"The real exam is hybrid digital: 42 multiple-choice questions in 1 hour 40 minutes (29 without a calculator, then 13 with a graphing calculator), worth 50% of your score, then 6 free-response questions in 90 minutes (2 with a calculator, 4 without), worth 50%, handwritten on paper. You also get an AB subscore. Practice the written parts in the Free response tab.",
    exams:{ap:{full:{n:42, min:100, name:"Full-length AP\u00AE multiple choice"}, mini:{n:15, min:36, name:"Mini exam"}}, clep:{full:{n:42, min:100, name:"Full-length AP\u00AE multiple choice"}, mini:{n:15, min:36, name:"Mini exam"}}},
    bosses:{1:"The Limit Lurker",2:"The Secant Sorceress",3:"The Chain Wraith",4:"The Rate Racer",5:"The Extremum Empress",6:"The Riemann Reaper",7:"The Slope Field Siren",8:"The Volume Vandal",9:"The Polar Phantom",10:"The Series Serpent"},
    chainDesc:"Put the steps in order: limits, related rates, integration by parts, Euler's method, polar area and interval of convergence.",
    crunchDesc:"Two minutes of calculus calculations: derivatives, integrals, Euler's method, series sums, Taylor coefficients, parametric slopes and polar areas. Type the number.",
    drillDesc:"Do the calculations: derivatives, integrals, Euler's method, geometric series, radius of convergence, Taylor coefficients, parametric and polar. Fresh numbers every time.",
    planGames:["Derivative Dash","Tangent Shot","Integral Sprint","Series Court","Sprint","True or False"]},
  precalc:{k:"precalc", name:"Precalculus", short:"Precalc", ap:"AP\u00AE Precalculus", clep:"CLEP\u00AE Precalculus", clepShort:"CLEP\u00AE Precalculus",
    key:"creditsprint.precalc.v1", col:"#0E7490", soft:"#ECFEFF", apFmt:"42 multiple choice and 4 free-response questions in 2 hours 55 minutes", clepFmt:"About 48 questions in 90 minutes", blurb:"Polynomial and rational functions, exponential and logarithmic functions, trigonometric and polar functions, plus parametric equations, vectors and matrices. AP\u00AE Precalculus and CLEP\u00AE Precalculus.", icon:"chart", data:PRECALC, nUnits:4, cat:"Math & statistics",
    graphs:false, unitWord:"Unit", clepQ:"about 48", frqHead:"AP\u00AE Section II \u00B7 4 questions \u00B7 70 minutes",
    apExamText:"The real exam is hybrid digital: 42 multiple-choice questions in 1 hour 45 minutes (29 without a calculator, then 13 with a graphing calculator), worth 62.5% of your score, then 4 free-response questions in 70 minutes (2 with a calculator, 2 without), worth 37.5%, handwritten on paper. Units 1 to 3 are tested; Unit 4 is not. Practice the written parts in the Free response tab.",
    exams:{ap:{full:{n:42, min:105, name:"Full-length AP\u00AE multiple choice"}, mini:{n:15, min:38, name:"Mini exam"}}, clep:{full:{n:48, min:90, name:"Full-length CLEP\u00AE"}, mini:{n:20, min:38, name:"Mini exam"}}},
    bosses:{1:"The Asymptote Phantom",2:"The Logarithm Lich",3:"The Sinusoid Siren",4:"The Matrix Minotaur"},
    chainDesc:"Put the steps in order: graphing a rational function, solving with logs, building a sinusoidal model and finding a matrix inverse.",
    crunchDesc:"Two minutes of precalculus calculations: rates of change, remainders, logs, sequences, interest, periods and determinants. Type the number.",
    drillDesc:"Do the calculations: average rates of change, the remainder theorem, binomial coefficients, logs, compound interest, half-life, sinusoids and polar points. Fresh numbers every time.",
    planGames:["Function Family Sort","Transformation Match","Unit Circle Sprint","Log Rules","Sprint","True or False"]}
};
let k = null;
try {
  const m = /[?&]course=(macro|micro|bio|chem|mkt|apush|apworld|apgov|appsych|apstat|aplit|aplang|calcab|calcbc|aphug|precalc)\b/.exec(location.search);
  if (m) { k = m[1]; localStorage.setItem("creditsprint.course", k); }
  else k = localStorage.getItem("creditsprint.course");
} catch(e) {}
/* "500 practice questions · 20 FRQs" for any course (counts come from course-stats.js) */
window.CS_STATLINE = (k, long) => { const s = (window.CS_COURSE_STATS || {})[k]; if (!s) return ""; return long ? `${s.q} practice questions · ${s.f} free-response · ${s.c} flashcards` : `${s.q} questions · ${s.f} FRQs`; };
window.CS_COURSE_PICKED = !!(k && C[k]);
window.CS_COURSE = C[k] || C.macro;
/* where progress is saved. Signed-in students: this browser's localStorage (and the cloud).
   Guests: sessionStorage only, so progress lasts until the tab closes and carries into a new account.
   Falls back to localStorage when accounts aren't available (opened as a file, or no database yet). */
window.CS_STORE = (function(){
  const L = (() => { try { return window.localStorage; } catch(e) { return null; } })(), SS = (() => { try { return window.sessionStorage; } catch(e) { return null; } })();
  const lget = k => { try { return L && L.getItem(k); } catch(e) { return null; } };
  const keys = () => ["creditsprint.shared"].concat(Object.values(C).map(c => c.key));
  const hasLocal = () => keys().concat("creditsprint.v2").some(k => lget(k));
  const member = lget("creditsprint.member") === "1";
  const off = !location.protocol.startsWith("http") || lget("creditsprint.accounts") === "0";
  /* students who saved progress before accounts were required keep it here until they sign in */
  let guest = !member && !off && !hasLocal();
  const area = () => (guest ? SS : L) || L || SS;
  const copy = (from, to) => { if (!from || !to || from === to) return; keys().forEach(k => { try { const v = from.getItem(k); if (v != null) to.setItem(k, v); } catch(e) {} }); };
  return {
    get guest(){ return guest; },
    get: k => { try { return area().getItem(k); } catch(e) { return null; } },
    set: (k, v) => { try { area().setItem(k, v); } catch(e) {} },
    remove: k => { try { area().removeItem(k); } catch(e) {} },
    /* signed in: move this tab's guest progress into the browser so it is saved */
    join(){ const was = lget("creditsprint.member") === "1"; try { L.setItem("creditsprint.member", "1"); } catch(e) {} if (guest) { copy(SS, L); guest = false; } return !was; },
    /* signed out or deleted: the cloud has the progress; this browser goes back to guest mode */
    leave(){ try { L.removeItem("creditsprint.member"); keys().concat("creditsprint.v2", "creditsprint.updated").forEach(k => L.removeItem(k)); keys().forEach(k => SS && SS.removeItem(k)); } catch(e) {} guest = true; },
    /* accounts aren't set up on this site: save locally like before */
    accountsOff(){ try { L.setItem("creditsprint.accounts", "0"); } catch(e) {} if (guest) { copy(SS, L); guest = false; } },
    accountsOn(){ try { L.removeItem("creditsprint.accounts"); } catch(e) {} }
  };
})();
/* append the build version so updated data files aren't served from an old browser cache */
if (window.CS_V) Object.values(C).forEach(c => { c.data = c.data.map(f => f + "?v=" + window.CS_V); });
})();
