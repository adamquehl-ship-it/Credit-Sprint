/* Credit Sprint course registry. Loaded first: picks the active course and lists the data files app.html loads for it.
   Each course keeps its own saved progress; streak, XP, pets, badges and plan are shared (see core.js). */
(function(){
"use strict";
const MACRO = ["questions.js","questions2.js","fifth.js","content.js","content2.js","drills.js","content3.js"].map(f => "assets/data/"+f);
const MICRO = ["questions.js","questions2.js","content.js","content2.js","drills.js"].map(f => "assets/data/micro/"+f);
const C = window.CS_COURSES = {
  macro:{k:"macro", name:"Macroeconomics", short:"Macro", ap:"AP® Macroeconomics", clep:"CLEP® Principles of Macroeconomics", clepShort:"CLEP® Principles of Macro",
    key:"creditsprint.v3", col:"#4F46E5", soft:"#EEF2FF", blurb:"GDP, inflation, money and banks, fiscal and monetary policy, trade.", icon:"bank", data:MACRO},
  micro:{k:"micro", name:"Microeconomics", short:"Micro", ap:"AP® Microeconomics", clep:"CLEP® Principles of Microeconomics", clepShort:"CLEP® Principles of Micro",
    key:"creditsprint.micro.v1", col:"#059669", soft:"#ECFDF5", blurb:"Supply and demand, costs, perfect competition, monopoly, labor markets, market failure.", icon:"chart", data:MICRO}
};
let k = null;
try {
  const m = /[?&]course=(macro|micro)\b/.exec(location.search);
  if (m) { k = m[1]; localStorage.setItem("creditsprint.course", k); }
  else k = localStorage.getItem("creditsprint.course");
} catch(e) {}
window.CS_COURSE_PICKED = !!(k && C[k]);
window.CS_COURSE = C[k] || C.macro;
/* append the build version so updated data files aren't served from an old browser cache */
if (window.CS_V) Object.values(C).forEach(c => { c.data = c.data.map(f => f + "?v=" + window.CS_V); });
})();
