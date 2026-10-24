/* Credit Sprint plans: Free, Exam Pass, Final Sprint, Monthly (1 subject) and Monthly (all subjects).
   Paid access is per course and comes from the server (/api/me → access), recorded by the Stripe webhook.
   Checkout: /api/checkout (see lib/billing.js and the README for the Stripe setup). */
(function(){
"use strict";
const CS = window.CS, $ = CS.$, $$ = CS.$$, esc = CS.esc, I = CS.icon;
const S = () => CS.S();

/* Free plan limits. Set PAYWALL to false to unlock everything for everyone (for example, during a promotion). */
CS.PAYWALL = true;
CS.FREE_ROUNDS = 3;                        // quiz rounds per day, per course
CS.FREE_FRQS = 2;                          // free-response prompts open on Free
CS.FREE_GAMES = ["daily", "tf", "match"];  // games open on Free

const EARLY = new Date().getUTCMonth() >= 6;   // early-bird Exam Pass price July–December (matches the server)
CS.PLANS = [
  {k:"exam", n:"Exam Pass", price: EARLY ? "$19.99" : "$29.99", was: EARLY ? "$29.99" : "", per:"one time", tag:"Most popular", course:true,
    line:"One class, every feature, all the way to exam day.",
    d:"Pay once and unlock everything for one class until your exam: unlimited quizzes, full timed practice exams, every game and boss battle, the mistakes notebook, every FRQ and the 30-day cram plan. No subscription, nothing to cancel. Lasts through your AP® exam, and at least 6 months for CLEP®."},
  {k:"sprint", n:"Final Sprint", price:"$15", per:"one time", course:true,
    line:"Everything for one class for 30 days.",
    d:"Exam in a few weeks? Unlock every feature for one class for 30 days: full practice exams, the 30-day cram plan, the mistakes notebook and unlimited drills. Built for the final push."},
  {k:"sub1", n:"Monthly · 1 subject", price:"$7.99", per:"/ month", course:true,
    line:"Full access to one class, month to month.",
    d:"Every feature for one class, billed monthly. Great for CLEP® students working at their own pace, or for trying everything before your exam. Cancel anytime from your account."},
  {k:"suball", n:"Monthly · All subjects", price:"$14.99", per:"/ month", tag:"Best for 2+ classes", course:false,
    line:"Every class, every feature, including new subjects.",
    d:"Unlock every course on Credit Sprint, including every new subject we add. The best deal if you're taking more than one AP® class or stacking CLEP® credits. Cancel anytime from your account."}
];
CS.FREE_INCLUDES = ["Every unit study guide and explainer", "Diagnostic test and weekly study plan", `${CS.FREE_ROUNDS} quizzes a day`, "Mini practice exams", "Daily Challenge, True or False and Match-up", "Flashcards, pets, streaks and weekly leagues", `First ${CS.FREE_FRQS} free-response questions`];
CS.PRO_PERKS = [
  ["bolt","Unlimited quizzes, every day"],
  ["pen","Full-length timed practice exams"],
  ["target","Mistakes notebook with spaced review"],
  ["sword","Every game and boss battle"],
  ["calc","Unlimited calculation drills"],
  ["chart","Draw-the-graph practice"],
  ["book","Every free-response question with rubrics"],
  ["cal","30-day cram plan"],
  ["star","Premium season pass rewards"],
  ["paw","+10% bonus pet growth"],
  ["spark","AI tutor and AI FRQ scoring (coming soon)"]
];

/* ---------- access ---------- */
const active = a => a.until > Date.now();
CS.planFor = (k = CS.C.k) => { const acc = (CS.account && CS.account.access) || [];
  return acc.find(a => active(a) && a.course === "all") || acc.find(a => active(a) && a.course === k) || null; };
CS.hasAccess = (k = CS.C.k) => !CS.PAYWALL || !!CS.planFor(k);
CS.isPro = () => CS.hasAccess();
CS.planName = p => p ? (p.plan === "code" ? "Pro (access code)" : (CS.PLANS.find(x => x.k === p.plan) || {}).n || "Paid plan") : "Free";
/* redeem an access code (codes are set in Cloudflare as ACCESS_CODES; see functions/api/redeem.js) */
CS.redeemCode = async code => {
  const r = await api("redeem", {code});
  const me = await fetch("/api/me", {credentials:"same-origin"}); if (me.ok) CS.account = (await me.json()).user;
  if (CS.renderAccountChip) CS.renderAccountChip(); if (CS.go && CS.view) CS.go(CS.view(), {keepScroll:true});
  return r;
};
const fmt = t => new Date(t).toLocaleDateString(undefined, {month:"short", day:"numeric", year:"numeric"});

/* free quiz rounds */
CS.roundsLeft = () => { const s = S(), t = CS.today(); if (!s.rounds || s.rounds.d !== t) s.rounds = {d:t, n:0}; return Math.max(0, CS.FREE_ROUNDS - s.rounds.n); };
/* call before starting a quiz round: returns true if it may start (and counts it on Free) */
CS.takeRound = () => { if (CS.hasAccess()) return true; if (CS.roundsLeft() <= 0) return false; S().rounds.n++; CS.save(); return true; };

CS.proTag = () => CS.hasAccess() ? "" : `<span class="pro-tag">${I("lock")}Pro</span>`;
CS.lockPanel = (title, text, plan = "exam") => { const p = CS.PLANS.find(x => x.k === plan) || CS.PLANS[0];
  return `<div class="panel lock-panel"><span class="lock-ico">${I("lock")}</span><div class="stack" style="gap:6px"><h3>${esc(title)}</h3><p class="muted">${esc(text)}</p></div>
    <div class="row-wrap"><button class="btn" data-up="${p.k}">Unlock with ${esc(p.n)} · ${p.price}</button><button class="btn ghost" data-up="open">See all plans</button></div></div>`; };

/* ---------- dashboard card + sidebar ---------- */
CS.upgradeCard = () => {
  const s = S();
  if (CS.hasAccess()) return "";
  const ex = CS.PLANS[0];
  if (s.upHide && s.upHide > Date.now()) return `<button class="up-mini" data-up="open">${I("bolt")} <b>Unlock everything</b><span class="muted small">Unlimited quizzes, full exams, every game</span><span class="up-cta">See plans →</span></button>`;
  const days = Math.max(0, Math.round((new Date(s.plan.date+"T12:00:00") - new Date())/CS.DAY));
  return `<div class="up-card">
    <div class="stack" style="gap:8px;flex:1;min-width:240px">
      <span class="up-pill">${I("lock")} You're on Free · ${CS.roundsLeft()} of ${CS.FREE_ROUNDS} quizzes left today</span>
      <h3>Unlock all of ${esc(CS.C.name)}${days?` for your final ${days} days`:""}</h3>
      <div class="up-perks">${CS.PRO_PERKS.slice(0,6).map(([ic,t])=>`<span>${I("check")}${esc(t)}</span>`).join("")}</div>
    </div>
    <div class="stack" style="gap:8px;align-items:stretch;min-width:200px">
      <div class="up-price">${ex.was?`<s>${ex.was}</s>`:""}<b>${ex.price}</b><span>one time, through exam day</span></div>
      <button class="btn lg" data-up="exam">Get the Exam Pass</button>
      <button class="btn ghost sm" data-up="open">Compare plans</button>
      <button class="linklike" data-up="later">Not now</button>
    </div></div>`;
};
CS.upgradeSide = () => { const p = CS.planFor();
  return p ? `<div class="sidecard pro-on"><span class="eyebrow" style="color:var(--good)">${I("check")} ${esc(CS.planName(p))}</span><span class="small muted">${p.sub ? "Renews monthly" : "Unlocked until " + fmt(p.until)}</span></div>`
  : `<button class="sidecard up-side" data-up="open"><span class="eyebrow" style="color:var(--accent)">${I("lock")} Free plan</span><b class="small">Unlock every feature</b><span class="tiny muted">Exam Pass from ${CS.PLANS[0].price}, one time</span></button>`; };

/* ---------- plans window + checkout ---------- */
function modal(html){ const w = document.createElement("div"); w.className = "modal-wrap"; w.innerHTML = `<div class="modal up-modal" role="dialog" aria-modal="true" style="max-width:860px">${html}</div>`; document.body.appendChild(w); w.addEventListener("click", e => { if (e.target === w) w.remove(); }); return w; }
async function api(path, body){ const r = await fetch("/api/" + path, {method:"POST", credentials:"same-origin", headers:{"content-type":"application/json"}, body:JSON.stringify(body || {})});
  let j = {}; try { j = await r.json(); } catch(e) {} if (!r.ok) { const e = new Error(j.error || "Something went wrong. Try again."); e.status = r.status; throw e; } return j; }
CS.openBilling = async () => { try { const r = await api("billing"); location.href = r.url; } catch(e) { CS.toast(e.message); } };
CS.openUpgrade = (pick) => {
  let sel = CS.PLANS.some(p => p.k === pick) ? pick : "exam", course = CS.C.k, msg = "", busy = false;
  const w = modal(""), m = $(".modal", w);
  draw();
  function draw(){
    const P = CS.PLANS.find(p => p.k === sel), have = P.course ? CS.planFor(course) : CS.planFor("__all__");
    m.innerHTML = `<div class="spread"><div><span class="eyebrow">Plans</span><h2>Unlock every feature</h2></div><button class="btn ghost sm" id="up-x">Close</button></div>
      <div class="up-grid">
        <div class="up-free"><b>Free</b><span class="up-amt">$0</span><ul>${CS.FREE_INCLUDES.map(t=>`<li>${I("check")}${esc(t)}</li>`).join("")}</ul>
          <span class="eyebrow" style="margin-top:6px">Locked on Free</span><ul class="miss">${CS.PRO_PERKS.map(([ic,t])=>`<li>${I("lock")}${esc(t)}</li>`).join("")}</ul></div>
        <div class="stack" style="gap:10px">
          <div class="up-plans4">${CS.PLANS.map(p=>`<button class="up-plan" aria-pressed="${sel===p.k}" data-pl="${p.k}">${p.tag?`<span class="tag good">${esc(p.tag)}</span>`:""}<b>${esc(p.n)}</b>
            <span class="up-amt">${p.was?`<s>${p.was}</s> `:""}${p.price}<small> ${esc(p.per)}</small></span><span class="tiny muted">${esc(p.line)}</span></button>`).join("")}</div>
          <p class="small up-desc">${esc(P.d)}${P.k==="exam"&&P.was?` <b>Early-bird price through December 31.</b>`:""}</p>
          ${P.course ? `<div class="stack" style="gap:6px"><span class="eyebrow">Which class?</span><div class="seg" style="max-width:380px">${Object.values(window.CS_COURSES).map(c=>`<button data-crs2="${c.k}" aria-pressed="${course===c.k}">${esc(c.name)}</button>`).join("")}</div></div>` : ""}
          ${have ? `<div class="feedback good">You already have ${esc(CS.planName(have))}${have.sub ? "" : " until " + fmt(have.until)}${P.course ? " for this class" : ""}.</div>` : ""}
          <button class="btn lg" id="up-go" ${busy||have?"disabled":""}>${busy ? "Opening secure checkout…" : CS.account ? `Continue to checkout · ${P.price}${P.k.startsWith("sub")?" / month":""}` : "Create a free account to continue"}</button>
          <p class="tiny muted">${msg || "Secure checkout by Stripe. Apple Pay, Google Pay and cards accepted. 7-day refund if you're not happy."}</p>
          <div class="row-wrap" style="gap:12px">${CS.account && CS.account.billing ? `<button class="linklike" id="up-bill">Manage billing and subscriptions</button>` : ""}<button class="linklike" id="up-code">Have an access code?</button></div>
        </div></div>`;
    $$("[data-pl]", m).forEach(b => b.onclick = () => { sel = b.dataset.pl; msg = ""; draw(); });
    $$("[data-crs2]", m).forEach(b => b.onclick = () => { course = b.dataset.crs2; msg = ""; draw(); });
    $("#up-x", m).onclick = () => w.remove();
    const bill = $("#up-bill", m); if (bill) bill.onclick = CS.openBilling;
    $("#up-code", m).onclick = () => { w.remove(); if (!CS.account) { CS.toast("Sign in first, then enter your code."); if (CS.openAccount) CS.openAccount(); return; } if (CS.openAccount) CS.openAccount({code:true}); };
    $("#up-go", m).onclick = async () => {
      if (!CS.account) { w.remove(); CS.toast("Make a free account first. Your purchase is saved to it."); if (CS.openAccount) CS.openAccount({signup:true}); return; }
      busy = true; msg = ""; draw();
      try { const r = await api("checkout", {plan:sel, course}); location.href = r.url; }
      catch(e) { busy = false; msg = e.status === 503 ? "Checkout opens very soon. Check back in a few days." : e.message; draw(); }
    };
  }
};
document.addEventListener("click", e => {
  const b = e.target.closest("[data-up]"); if (!b) return;
  e.preventDefault();
  const k = b.dataset.up;
  if (k === "later") { S().upHide = Date.now() + 3*CS.DAY; CS.save(); CS.go("home", {keepScroll:true}); return; }
  CS.openUpgrade(k === "open" ? null : k);
});

/* after Stripe sends the student back: wait for the webhook to record the purchase */
CS.afterAccount = () => {
  if (CS.view && CS.go) CS.go(CS.view(), {keepScroll:true});
  if (!/[?&]paid=1\b/.test(location.search) || !CS.account) return;
  try { history.replaceState(null, "", location.pathname + location.search.replace(/[?&]paid=1\b/, "").replace(/^&/, "?") + location.hash); } catch(e) {}
  let tries = 0;
  const check = async () => {
    if (CS.hasAccess()) { CS.toast(`You're in! ${CS.planName(CS.planFor())} is unlocked. Every feature is open.`); return; }
    if (++tries > 15) { CS.toast("Payment received. Access can take a minute to appear. Refresh shortly."); return; }
    try { const r = await fetch("/api/me", {credentials:"same-origin"}); if (r.ok) { CS.account = (await r.json()).user; if (CS.renderAccountChip) CS.renderAccountChip(); if (CS.hasAccess()) { CS.go(CS.view(), {keepScroll:true}); return check(); } } } catch(e) {}
    setTimeout(check, 2000);
  };
  CS.toast("Payment complete. Unlocking your plan…"); setTimeout(check, 1500);
};
})();
