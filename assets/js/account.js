/* Credit Sprint accounts in the app: sign in (email code, Google, or username + password), cloud sync of progress
   across devices, and the live weekly league. Works only on the live site with the /api functions set up;
   everywhere else the app keeps working offline with a practice league. */
(function(){
"use strict";
const CS = window.CS, $ = CS.$, $$ = CS.$$, esc = CS.esc, I = CS.icon;
const S = () => CS.S();
const STORE_KEYS = () => ({shared:"creditsprint.shared", courses:Object.fromEntries(Object.values(window.CS_COURSES).map(c => [c.k, c.key]))});
let cfg = null, live = null, syncT = null, syncing = false;
CS.account = null;

async function api(path, opt = {}) {
  const r = await fetch("/api/" + path, {method: opt.method || "GET", credentials: "same-origin",
    headers: opt.body ? {"content-type": "application/json"} : {}, body: opt.body ? JSON.stringify(opt.body) : undefined});
  let j = {}; try { j = await r.json(); } catch(e) {}
  if (!r.ok) { const err = new Error(j.error || ("Error " + r.status)); err.status = r.status; err.data = j; throw err; }
  return j;
}
const online = () => location.protocol.startsWith("http");

/* ---------- local ↔ cloud ---------- */
const read = k => { try { return JSON.parse(window.CS_STORE.get(k) || "null"); } catch(e) { return null; } };
function localBundle(){ const K = STORE_KEYS(); return {shared:read(K.shared), courses:Object.fromEntries(Object.entries(K.courses).map(([c, k]) => [c, read(k)]))}; }
function applyBundle(d){ const K = STORE_KEYS(); try {
  if (d.shared) window.CS_STORE.set(K.shared, JSON.stringify(d.shared));
  Object.entries(d.courses || {}).forEach(([c, v]) => { if (v && K.courses[c]) window.CS_STORE.set(K.courses[c], JSON.stringify(v)); });
} catch(e) {} }
const localAt = () => +(localStorage.getItem("creditsprint.updated") || 0);
const baseSave = CS.save;
CS.save = () => { baseSave(); try { localStorage.setItem("creditsprint.updated", String(Date.now())); } catch(e) {} if (CS.account) { clearTimeout(syncT); syncT = setTimeout(push, 4000); } };
async function push(force){
  if (!CS.account || syncing) return; syncing = true;
  try { await api("progress", {method:"PUT", body:{data:localBundle(), updatedAt:localAt() || Date.now(), force:!!force}}); await loadLeague(); setStatus("Synced"); }
  catch(e) { if (e.status === 409) await pull(true); else setStatus("Offline: will sync later"); }
  finally { syncing = false; }
}
/* first sync after sign-in: keep whichever copy has more XP; otherwise the newer one */
async function pull(preferServer){
  const r = await api("progress");
  if (!r.data) return push(true);
  const sx = (r.data.shared && r.data.shared.xp) || 0, lx = S().xp || 0;
  if (preferServer || sx > lx || (sx === lx && r.updatedAt > localAt())) {
    applyBundle(r.data); try { localStorage.setItem("creditsprint.updated", String(r.updatedAt)); } catch(e) {}
    sessionStorage.setItem("cs.synced", "1"); location.reload(); return;
  }
  return push(true);
}
async function loadLeague(){ try { live = await api("league"); if (CS.go && !$("#v-home").hidden) CS.go("home", {keepScroll:true}); } catch(e) { live = null; } }
CS.liveLeague = () => live && live.members ? {practice:false, tier:live.tier, members:live.members, promote:live.promote, demote:live.demote, endsAt:live.endsAt} : null;

/* ---------- sidebar status ---------- */
let status = "";
function setStatus(t){ status = t; renderChip(); }
function renderChip(){
  const a = CS.account, top = $("#top-acct"), bar = $("#guest-bar");
  if (bar) { bar.hidden = !(window.CS_STORE.guest && !a);
    bar.innerHTML = `<span>${I("shield")}<b>Guest mode:</b> your progress is erased when you close this tab, and you can't join leagues.</span><button class="btn sm" data-account="signup">Sign up free to save it</button>`; }
  if (top) top.innerHTML = a ? `<button class="top-acct on" data-account="open" title="Manage account"><span class="acct-av">${esc((a.name || "?")[0])}</span><span class="hide-sm">Account</span></button>`
    : `<button class="btn sm top-acct" data-account="signup">Sign up</button>`;
  const el = $("#side-acct"); if (!el) return;
  el.innerHTML = a ? `<button class="acct-chip on" data-account="open"><span class="acct-av">${esc((a.name || "?")[0])}</span><span class="stack" style="gap:0;min-width:0"><b class="small">${esc(a.name || "Add your name")}</b><span class="tiny muted">${esc(status || "Signed in")}</span></span></button>`
    : `<button class="acct-chip" data-account="open"><span class="acct-av">${I("shield")}</span><span class="stack" style="gap:0;min-width:0"><b class="small">Sign in</b><span class="tiny muted">Save progress and join leagues</span></span></button>`;
}
CS.renderAccountChip = renderChip;

/* ---------- sign-in modal ---------- */
function modal(){ const w = document.createElement("div"); w.className = "modal-wrap"; w.innerHTML = `<div class="modal acct-modal" role="dialog" aria-modal="true" aria-label="Account"></div>`;
  document.body.appendChild(w); w.addEventListener("click", e => { if (e.target === w) w.remove(); }); return w; }
CS.openAccount = async (opts = {}) => {
  const ask = !!opts.prompt, signup = ask || !!opts.signup;
  if (ask) { if (!cfg) { try { cfg = await api("config"); } catch(e) { cfg = {accounts:false}; } } if (!cfg.accounts || CS.account) return; }
  const w = modal(), m = $(".modal", w);
  if (!online()) { m.innerHTML = closeRow("Accounts") + `<p class="muted">Accounts work on creditsprintprep.com once the database is set up. Your progress is safe in this browser in the meantime.</p>`; wire(); return; }
  if (!cfg) { try { cfg = await api("config"); } catch(e) { cfg = {accounts:false}; } }
  if (!cfg.accounts) { m.innerHTML = closeRow("Accounts") + `<p class="muted">Accounts are coming soon. Your progress is saved in this browser, and the practice league works without signing in.</p>`; wire(); return; }
  if (CS.account) return accountView();
  let tab = cfg.google ? "google" : cfg.email ? "email" : "password", step = "email", email = "", mode = signup ? "new" : "login", err = "";
  draw();
  function closeRow(t){ return `<div class="spread"><h2>${esc(t)}</h2><button class="btn ghost sm" data-x>Close</button></div>`; }
  function wire(){ $$("[data-x]", m).forEach(b => b.onclick = () => w.remove()); }
  function draw(){
    const tabs = [["email","Email code",cfg.email],["google","Google",!!cfg.google],["password","Username",cfg.password]].filter(t => t[2]);
    m.innerHTML = (signup ? closeRow("Create your free account") + `<p class="muted small">Save your streak, pets and progress on every device, and join this week's league. It takes about 20 seconds. New here? Any option below creates your account.</p>` : closeRow("Sign in to Credit Sprint") + `<p class="muted small">Save your progress across devices and compete in weekly leagues. New here? Signing in creates your account.</p>`) + `
      <div class="seg" role="tablist" style="max-width:420px">${tabs.map(([k,n]) => `<button role="tab" data-tab="${k}" aria-pressed="${tab===k}">${n}</button>`).join("")}</div>
      <div class="stack" id="acct-body" style="gap:12px"></div>${err?`<div class="feedback bad">${esc(err)}</div>`:""}
      <p class="tiny muted">You must be 13 or older to create an account. We only show your first name and last initial on leaderboards. By signing in you agree to the <a href="terms.html" target="_blank" rel="noopener">Terms of Service</a> and <a href="privacy.html" target="_blank" rel="noopener">Privacy Policy</a>.</p>${ask ? `<button class="btn ghost sm" data-x style="align-self:flex-start">Maybe later. Keep studying without an account</button>` : ""}`;
    wire(); $$("[data-tab]", m).forEach(b => b.onclick = () => { tab = b.dataset.tab; err = ""; draw(); });
    const body = $("#acct-body", m);
    if (tab === "email" && step === "email") {
      body.innerHTML = `<label class="eyebrow" for="ac-email">Email</label><input id="ac-email" type="email" autocomplete="email" class="acct-in" value="${esc(email)}" placeholder="you@example.com">
        <button class="btn" id="ac-send">Email me a code</button>`;
      $("#ac-send", m).onclick = async () => { email = $("#ac-email", m).value.trim(); try { await api("auth/email/start", {method:"POST", body:{email}}); step = "code"; err = ""; } catch(e) { err = e.message; } draw(); };
    } else if (tab === "email") {
      body.innerHTML = `<p class="small">We sent a 6-digit code to <b>${esc(email)}</b>.</p><label class="eyebrow" for="ac-code">Code</label>
        <input id="ac-code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" class="acct-in" placeholder="123456" style="letter-spacing:.3em;font-size:1.3rem">
        <label class="row-wrap small" style="gap:6px"><input type="checkbox" id="ac-age"> I'm 13 or older</label>
        <div class="row-wrap"><button class="btn" id="ac-verify">Sign in</button><button class="btn ghost sm" id="ac-back">Use a different email</button></div>`;
      $("#ac-back", m).onclick = () => { step = "email"; draw(); };
      $("#ac-verify", m).onclick = () => done(api("auth/email/verify", {method:"POST", body:{email, code:$("#ac-code", m).value, age13:$("#ac-age", m).checked}}));
    } else if (tab === "google") {
      body.innerHTML = `<div id="gbtn" style="min-height:44px"></div><span class="tiny muted">Some school Google accounts block outside apps. If it doesn't work, use an email code instead.</span>`;
      loadGoogle().then(() => { window.google.accounts.id.initialize({client_id:cfg.google, callback: r => done(api("auth/google", {method:"POST", body:{credential:r.credential}}))});
        window.google.accounts.id.renderButton($("#gbtn", m), {theme:"outline", size:"large", text:"continue_with", shape:"pill"}); })
        .catch(() => { $("#gbtn", m).innerHTML = `<span class="small muted">Google sign-in couldn't load. Check your connection or use another method.</span>`; });
    } else {
      body.innerHTML = `<div class="seg" style="max-width:280px"><button data-mode="login" aria-pressed="${mode==="login"}">Sign in</button><button data-mode="new" aria-pressed="${mode==="new"}">Create account</button></div>
        <label class="eyebrow" for="ac-user">Username</label><input id="ac-user" autocomplete="username" class="acct-in" placeholder="e.g. econ_ace">
        <label class="eyebrow" for="ac-pw">Password</label><input id="ac-pw" type="password" autocomplete="${mode==="new"?"new-password":"current-password"}" class="acct-in" placeholder="At least 8 characters">
        ${mode==="new" ? `<label class="eyebrow" for="ac-name">Name on leaderboards</label><input id="ac-name" class="acct-in" placeholder="First name and last initial, e.g. Maya K.">
          <label class="row-wrap small" style="gap:6px"><input type="checkbox" id="ac-age"> I'm 13 or older</label>` : ""}
        <button class="btn" id="ac-go">${mode==="new"?"Create account":"Sign in"}</button>
        ${mode==="login"?`<span class="tiny muted">Forgot your password? Sign in with an email code instead${cfg.email?"":" (once email sign-in is set up)"}.</span>`:""}`;
      $$("[data-mode]", m).forEach(b => b.onclick = () => { mode = b.dataset.mode; err = ""; draw(); });
      $("#ac-go", m).onclick = () => { const user = $("#ac-user", m).value, pw = $("#ac-pw", m).value;
        done(mode === "new" ? api("auth/register", {method:"POST", body:{username:user, password:pw, name:$("#ac-name", m).value, age13:$("#ac-age", m).checked}}) : api("auth/login", {method:"POST", body:{username:user, password:pw}})); };
    }
  }
  async function done(p){
    try { const r = await p; window.CS_STORE.join(); CS.account = r.user; renderChip(); w.remove();
      if (!r.user.name) askName(); else CS.toast(r.created ? "Account created. Your progress is now saved." : `Welcome back, ${r.user.name}.`);
      setStatus("Syncing…"); await pull(false); }
    catch(e) { err = e.data && e.data.needAge ? "Check the box to confirm you're 13 or older." : e.message; draw(); }
  }
};
function askName(){
  const w = modal(), m = $(".modal", w);
  m.innerHTML = `<h2>What should we call you?</h2><p class="muted small">This shows on weekly leaderboards. Use your first name and last initial.</p>
    <input id="ac-nm" class="acct-in" placeholder="e.g. Maya K." maxlength="30"><div class="row-wrap"><button class="btn" id="ac-save">Save</button></div><p class="small" id="ac-msg"></p>`;
  $("#ac-save", m).onclick = async () => { try { const r = await api("me", {method:"POST", body:{name:$("#ac-nm", m).value}}); CS.account = r.user; renderChip(); w.remove(); CS.toast(`You're all set, ${r.user.name}.`); loadLeague(); } catch(e) { $("#ac-msg", m).textContent = e.message; } };
}
function accountView(){
  const w = modal(), m = $(".modal", w), a = CS.account; let confirmDel = false;
  draw();
  function draw(){
    m.innerHTML = `<div class="spread"><h2>Your account</h2><button class="btn ghost sm" data-x>Close</button></div>
      <div class="row-wrap" style="gap:12px"><span class="acct-av lg">${esc((a.name||"?")[0])}</span><div class="stack" style="gap:2px"><b>${esc(a.name || "No name yet")}</b>
        <span class="small muted">${esc(a.email || (a.username ? "@" + a.username : "Google account"))} · ${esc(a.methods.map(x => ({email:"email code", google:"Google", password:"password"})[x]).join(", "))}</span><span class="tiny muted">${esc(status || "Synced")}</span></div></div>
      <div class="row-wrap"><button class="btn ghost sm" id="ac-name">Change leaderboard name</button><button class="btn ghost sm" id="ac-sync">Sync now</button><button class="btn ghost sm" id="ac-out">Sign out</button></div>
      <div class="stack" style="gap:6px;border-top:1px solid var(--rule);padding-top:12px"><span class="eyebrow">Delete account</span><span class="small muted">Deletes your account, cloud progress and league history. Progress in this browser stays.</span>
        <div><button class="btn ghost sm" id="ac-del" style="${confirmDel?"border-color:var(--bad);color:var(--bad)":""}">${confirmDel?"Tap again to delete for good":"Delete my account"}</button></div></div>`;
    $$("[data-x]", m).forEach(b => b.onclick = () => w.remove());
    $("#ac-name", m).onclick = () => { w.remove(); askName(); };
    $("#ac-sync", m).onclick = async () => { setStatus("Syncing…"); await push(); draw(); };
    $("#ac-out", m).onclick = async () => { clearTimeout(syncT); try { await push(); } catch(e) {} try { await api("auth/logout", {method:"POST"}); } catch(e) {} CS.account = null; live = null; window.CS_STORE.leave(); w.remove(); location.reload(); };
    $("#ac-del", m).onclick = async () => { if (!confirmDel) { confirmDel = true; return draw(); } try { await api("me", {method:"DELETE"}); } catch(e) {} CS.account = null; live = null; window.CS_STORE.leave(); w.remove(); location.reload(); };
  }
}
let gLoad = null;
function loadGoogle(){ if (window.google && window.google.accounts) return Promise.resolve();
  return gLoad || (gLoad = new Promise((ok, no) => { const s = document.createElement("script"); s.src = "https://accounts.google.com/gsi/client"; s.async = true; s.onload = ok; s.onerror = no; document.head.appendChild(s); })); }

document.addEventListener("click", e => { const b = e.target.closest("[data-account]"); if (b) { e.preventDefault(); CS.openAccount({signup: b.dataset.account === "signup"}); } });

/* ---------- boot: who's signed in? ---------- */
renderChip();
if (online()) api("me").then(r => { const first = window.CS_STORE.join(); window.CS_STORE.accountsOn(); CS.account = r.user; setStatus(sessionStorage.getItem("cs.synced") ? "Synced" : "Signed in"); sessionStorage.removeItem("cs.synced"); if (first) pull(false).catch(() => {}); else push(); })
  .catch(e => { CS.account = null; if (e.status === 503) window.CS_STORE.accountsOff(); else if (e.status === 401) window.CS_STORE.accountsOn(); renderChip(); if (e.status === 401) promptSignup(/[?&]signup\b/.test(location.search)); });

/* ask signed-out students to make an account once per visit, after onboarding closes */
function promptSignup(force){
  try { if (!force && sessionStorage.getItem("cs.asked")) return; } catch(e) {}
  let tries = 0;
  const go = () => { if (CS.account) return; if (document.querySelector(".modal-wrap")) { if (++tries < 600) setTimeout(go, 1000); return; }
    try { sessionStorage.setItem("cs.asked", "1"); } catch(e) {} CS.openAccount({prompt:true}); };
  setTimeout(go, 1200);
}
})();
