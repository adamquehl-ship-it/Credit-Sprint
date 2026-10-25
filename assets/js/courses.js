/* Credit Sprint course registry. Loaded first: picks the active course and lists the data files app.html loads for it.
   Each course keeps its own saved progress; streak, XP, pets, badges and plan are shared (see core.js). */
(function(){
"use strict";
const MACRO = ["questions.js","questions2.js","questions3.js","questions4.js","questions5.js","fifth.js","content.js","content2.js","frqs2.js","drills.js","content3.js","extra.js"].map(f => "assets/data/"+f);
const MICRO = ["questions.js","questions2.js","questions3.js","questions4.js","questions5.js","content.js","content2.js","frqs2.js","drills.js","extra.js"].map(f => "assets/data/micro/"+f);
const BIO = ["questions.js","questions2.js","questions3.js","questions4.js","questions5.js","questions6.js","questions7.js","content.js","content2.js","frqs2.js","drills.js","extra.js"].map(f => "assets/data/bio/"+f);
const CHEM = ["questions.js","questions2.js","questions3.js","questions4.js","questions5.js","questions6.js","questions7.js","questions8.js","content.js","content2.js","frqs2.js","drills.js","extra.js"].map(f => "assets/data/chem/"+f);
const MKT = ["m1.js","m2.js","m3.js","m4.js","m5.js","m6.js","m7.js","m8.js","m9.js","m10.js","content.js","content2.js","frqs2.js","frqs3.js","drills.js"].map(f => "assets/data/mkt/"+f);
const APGOV = ["cards.js","cards2.js","p1.js","p2.js","p3.js","p4.js","p5.js","p6.js","p7.js","p8.js","p9.js","p10.js","p11.js","p12.js","p13.js","p14.js","p15.js","p16.js","p17.js","p18.js","p19.js","p20.js","p21.js","content.js","content2.js","frqs2.js","frqs4.js","drills.js","games.js"].map(f=>"assets/data/apgov/"+f);
const APWORLD = ["cards.js","cards2.js","p1.js","p2.js","p3.js","p4.js","p5.js","p6.js","p7.js","p8.js","p9.js","p10.js","p11.js","p12.js","p13.js","content.js","content2.js","frqs2.js","frqs4.js","drills.js","src.js"].map(f => "assets/data/apworld/"+f);
const APUSH = ["cards.js","cards2.js","p1.js","p2.js","p3.js","p4.js","p5.js","p6.js","p7.js","p8.js","p9.js","content.js","content2.js","frqs2.js","frqs3.js","frqs4.js","drills.js"].map(f => "assets/data/apush/"+f);
const C = window.CS_COURSES = {
  macro:{k:"macro", name:"Macroeconomics", short:"Macro", ap:"AP® Macroeconomics", clep:"CLEP® Principles of Macroeconomics", clepShort:"CLEP® Principles of Macro",
    key:"creditsprint.v3", col:"#4F46E5", soft:"#EEF2FF", apFmt:"60 multiple choice + 3 free response in 2 hours 10 minutes", clepFmt:"About 80 multiple choice in 90 minutes", blurb:"GDP, inflation, money and banks, fiscal and monetary policy, trade.", icon:"bank", data:MACRO, nUnits:6, cat:"Economics"},
  micro:{k:"micro", name:"Microeconomics", short:"Micro", ap:"AP® Microeconomics", clep:"CLEP® Principles of Microeconomics", clepShort:"CLEP® Principles of Micro",
    key:"creditsprint.micro.v1", col:"#059669", soft:"#ECFDF5", apFmt:"60 multiple choice + 3 free response in 2 hours 10 minutes", clepFmt:"About 80 multiple choice in 90 minutes", blurb:"Supply and demand, costs, perfect competition, monopoly, labor markets, market failure.", icon:"chart", data:MICRO, nUnits:6, cat:"Economics"},
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
  mkt:{k:"mkt", name:"Marketing", short:"Marketing", ap:"CLEP® Principles of Marketing", clep:"CLEP® Principles of Marketing", clepShort:"CLEP® Principles of Marketing", clepOnly:true,
    key:"creditsprint.mkt.v1", col:"#DB2777", soft:"#FDF2F8", apFmt:"", clepFmt:"About 100 multiple choice in 90 minutes", blurb:"Marketing concept, strategy, research, consumer behavior, segmentation, the 4 Ps, e-commerce and ethics.", icon:"mega", data:MKT, nUnits:10, cat:"Business",
    graphs:false, unitWord:"Unit",
    exams:{ap:{full:{n:100, min:90, name:"Full-length CLEP®"}, mini:{n:25, min:22, name:"Mini exam"}}, clep:{full:{n:100, min:90, name:"Full-length CLEP®"}, mini:{n:25, min:22, name:"Mini exam"}}},
    bosses:{1:"The Greenwash Ghost",2:"The Product Pusher",3:"The Biased Survey",4:"The Impulse Imp",5:"The One-Size-Fits-All",6:"The Gatekeeper Buyer",7:"The Commodity Clone",8:"The Price War Wyrm",9:"The Stockout Specter",10:"The Spam Swarm"},
    chainDesc:"Put the marketing steps in order: from a research problem to a decision, from awareness to purchase, from a product idea to the market.",
    crunchDesc:"Two minutes of marketing math: markup, margin, break-even, market share, elasticity of demand and reach. Type the number.",
    drillDesc:"Markups, margins, break-even, market share, elasticity and channel math: fresh numbers every time.",
    planGames:["Mix Master","Sprint","Match-up","Chain Reaction","Number Crunch","True or False"]}
};
let k = null;
try {
  const m = /[?&]course=(macro|micro|bio|chem|mkt|apush|apworld|apgov)\b/.exec(location.search);
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
