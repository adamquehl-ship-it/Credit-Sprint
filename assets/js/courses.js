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
