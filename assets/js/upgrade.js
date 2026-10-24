/* Credit Sprint plans: Free vs Pass Plan (Pro). Dashboard card, sidebar button, upgrade modal and checkout.
   Checkout uses Stripe Payment Links: paste your links below (README explains). Until then the modal
   explains that Pro is free during beta. */
(function(){
"use strict";
const CS = window.CS, $ = CS.$, $$ = CS.$$, esc = CS.esc, I = CS.icon;
const S = () => CS.S();

/* Paste Stripe Payment Link URLs here. Set each link's "After payment" redirect to:
   https://creditsprintprep.com/app.html#pro-welcome */
CS.CHECKOUT = {
  monthly: "",   // Pass Plan, $9/month
  season: "",    // Pass Plan, $39 for the exam season
  guarantee: ""  // Pass Guarantee, $59 per exam
};
CS.PLANS = [
  {k:"monthly", n:"Pass Plan", price:"$9", per:"/ month", note:"Cancel anytime"},
  {k:"season", n:"Pass Plan · Season", price:"$39", per:"one time", note:"Through your exam date. Best value", best:true},
  {k:"guarantee", n:"Pass Guarantee", price:"$59", per:"per exam", note:"Miss a 3 on AP®? Free access until your CLEP® retake"}
];
CS.PRO_PERKS = [
  ["pen","Unlimited full-length practice exams"],
  ["spark","AI tutor and AI scoring on every FRQ"],
  ["calc","Unlimited calculation drills and Number Crunch"],
  ["sword","All boss battles and every game mode"],
  ["chart","Detailed score reports by unit and skill"],
  ["paw","+10% bonus pet growth on every correct answer"]
];
CS.isPro = () => S().tier === "pro";

/* returning from checkout */
function checkWelcome(){
  if ((location.hash||"") !== "#pro-welcome") return;
  const s = S(); s.tier = "pro"; s.proSince = CS.today(); CS.save();
  try { history.replaceState(null, "", "#home"); } catch(e) {}
  setTimeout(() => { CS.toast("Welcome to Pass Plan! Every Pro feature is unlocked."); if (CS.go) CS.go("home"); }, 300);
}
checkWelcome();
window.addEventListener("hashchange", checkWelcome);

/* compact dashboard card for free users */
CS.upgradeCard = () => {
  const s = S();
  if (CS.isPro()) return "";
  if (s.upHide && s.upHide > Date.now()) return `<button class="up-mini" data-up="open">${I("bolt")} <b>Go Pro</b><span class="muted small">Unlimited exams, AI tutor and FRQ scoring</span><span class="up-cta">See plans →</span></button>`;
  const days = Math.max(0, Math.round((new Date(s.plan.date+"T12:00:00") - new Date())/CS.DAY));
  return `<div class="up-card">
    <div class="stack" style="gap:8px;flex:1;min-width:240px">
      <span class="up-pill">${I("bolt")} You're on Free</span>
      <h3>Upgrade to Pass Plan${days?` for your final ${days} days`:""}</h3>
      <div class="up-perks">${CS.PRO_PERKS.slice(0,4).map(([ic,t])=>`<span>${I("check")}${esc(t)}</span>`).join("")}</div>
    </div>
    <div class="stack" style="gap:8px;align-items:stretch;min-width:200px">
      <div class="up-price"><b>$39</b><span>for the whole season</span></div>
      <button class="btn lg" data-up="season">Upgrade now</button>
      <button class="btn ghost sm" data-up="open">Compare plans</button>
      <button class="linklike" data-up="later">Not now</button>
    </div></div>`;
};
CS.upgradeSide = () => CS.isPro() ? `<div class="sidecard pro-on"><span class="eyebrow" style="color:var(--good)">${I("check")} Pass Plan</span><span class="small muted">Every Pro feature unlocked.</span></div>`
  : `<button class="sidecard up-side" data-up="open"><span class="eyebrow" style="color:var(--accent)">${I("bolt")} Free plan</span><b class="small">Upgrade to Pass Plan</b><span class="tiny muted">AI tutor, FRQ scoring, unlimited exams</span></button>`;

function modal(html){ const w = document.createElement("div"); w.className = "modal-wrap"; w.innerHTML = `<div class="modal" role="dialog" aria-modal="true" style="max-width:720px">${html}</div>`; document.body.appendChild(w); w.addEventListener("click", e => { if (e.target === w) w.remove(); }); return w; }
CS.openUpgrade = (pick) => {
  let sel = pick || "season";
  const w = modal(""), m = $(".modal", w);
  draw();
  function draw(){
    const live = !!CS.CHECKOUT[sel];
    m.innerHTML = `<div class="spread"><div><span class="eyebrow">Plans</span><h2>Study smarter with Pass Plan</h2></div><button class="btn ghost sm" id="up-x">Close</button></div>
      <div class="up-compare"><div><b>Free</b><ul><li>All unit guides and explainers</li><li>Diagnostic and study plan</li><li>Daily challenge, flashcards, pets</li><li>One quiz per unit each day</li></ul></div>
        <div class="pro"><b>Pass Plan</b><ul>${CS.PRO_PERKS.map(([ic,t])=>`<li>${esc(t)}</li>`).join("")}</ul></div></div>
      <div class="up-plans">${CS.PLANS.map(p=>`<button class="up-plan" aria-pressed="${sel===p.k}" data-pl="${p.k}">${p.best?`<span class="tag good">Best value</span>`:""}<b>${esc(p.n)}</b><span class="up-amt">${p.price}<small> ${esc(p.per)}</small></span><span class="tiny muted">${esc(p.note)}</span></button>`).join("")}</div>
      <button class="btn lg" id="up-go">${live ? `Continue to secure checkout →` : `Upgrade`}</button>
      <p class="tiny muted" id="up-msg">${live ? "Payments are handled by Stripe. You'll come right back here when you're done." : ""}</p>`;
    $$("[data-pl]", m).forEach(b => b.onclick = () => { sel = b.dataset.pl; draw(); });
    $("#up-x", m).onclick = () => w.remove();
    $("#up-go", m).onclick = () => {
      const url = CS.CHECKOUT[sel];
      if (url) { const u = url + (url.includes("?") ? "&" : "?") + "client_reference_id=cs_" + (S().uid || (S().uid = Math.random().toString(36).slice(2,10))); CS.save(); location.href = u; return; }
      $("#up-msg", m).innerHTML = `<b>Credit Sprint is in early access, so every Pass Plan feature is already free.</b> Paid plans open soon, and you'll keep your progress, pets and streak.`;
    };
  }
};
document.addEventListener("click", e => {
  const b = e.target.closest("[data-up]"); if (!b) return;
  const k = b.dataset.up;
  if (k === "later") { S().upHide = Date.now() + 7*CS.DAY; CS.save(); CS.go("home", {keepScroll:true}); return; }
  CS.openUpgrade(k === "open" ? null : k);
});
})();
