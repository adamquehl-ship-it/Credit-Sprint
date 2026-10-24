/* Credit Sprint creds (the in-app currency), pet merging and the pet market.
   Creds: earned for quizzes, lessons, games, bosses, exams and milestones (+10% on a paid plan). Saved with your
   progress (shared across courses). Spending and selling happen on the server ledger (functions/api/market.js). */
(function(){
"use strict";
const CS = window.CS, $ = CS.$, $$ = CS.$$, esc = CS.esc, I = CS.icon;
const S = () => CS.S();
const DAY_CAP = 600;   // creds you can earn per day before the Pro boost (the server allows 700)

/* ---------- wallet ---------- */
const W = () => { const s = S(); const c = s.creds || (s.creds = {earned:0, days:{}, ledger:0, ledgerSeen:0, seen:{}});
  c.days = c.days || {}; c.seen = c.seen || {}; c.ledger = c.ledger || 0; c.ledgerSeen = c.ledgerSeen || 0; return c; };
CS.creds = () => { const c = W(); return Math.max(0, Math.round((c.earned || 0) + (c.ledger || 0))); };
CS.credIcon = (sz = 16) => `<svg class="cred-ico" width="${sz}" height="${sz}" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#F5B301"/><circle cx="12" cy="12" r="7.2" fill="#FFD54A" stroke="#E09B00" stroke-width="1.2"/><path d="M14.6 9.2a3.4 3.4 0 1 0 0 5.6" fill="none" stroke="#B87500" stroke-width="2" stroke-linecap="round"/></svg>`;
const fmt = n => Math.round(n).toLocaleString();
let pending = 0, pendT = null, pendWhy = "";
CS.earnCreds = (n, why) => {
  const c = W(), d = CS.today(), boost = CS.planFor && CS.planFor() ? 1.1 : 1;
  const room = Math.max(0, Math.round(DAY_CAP * boost) - (c.days[d] || 0)), add = Math.min(room, Math.round(n * boost));
  if (add <= 0) return 0;
  c.days[d] = (c.days[d] || 0) + add; c.earned = (c.earned || 0) + add;
  /* keep only the last 120 days of the daily log; older days are already counted in "earned" */
  const keys = Object.keys(c.days).sort(); if (keys.length > 120) keys.slice(0, keys.length - 120).forEach(k => delete c.days[k]);
  CS.save();
  pending += add; pendWhy = why || pendWhy; clearTimeout(pendT);
  pendT = setTimeout(() => { CS.toast(`+${pending} creds${pendWhy ? " · " + pendWhy : ""}${boost > 1 ? " (Pro +10%)" : ""}`); pending = 0; pendWhy = ""; }, 400);
  if (CS.chrome) CS.chrome();
  return add;
};
/* NOTE: the server counts earned creds per day from the daily log (capped), plus the trade ledger. Trimming old days
   locally never lowers the server balance because the server keeps its own copy of what it has seen in the ledger only.
   To keep the two in step the daily log keeps 120 days. */

/* ---------- earning hooks ---------- */
const TASK = {quiz:[10,"quiz complete"], mist:[5,"mistakes reviewed"], diag:[25,"diagnostic done"], cards:[8,"flashcards reviewed"], game:[6,"game played"], daily:[15,"Daily Challenge"]};
CS.onTask = k => { if (TASK[k]) CS.earnCreds(TASK[k][0], TASK[k][1]); scan(); };
function scan(){
  const s = S(), c = W(), seen = c.seen;
  /* bosses beaten (each win, first win pays more) */
  const bossT = Math.max(0, ...Object.values(s.bosses || {}).map(Number).filter(Boolean));
  if (seen.bossT == null) seen.bossT = bossT;
  else if (bossT > seen.bossT) { const first = Object.values(s.bosses).filter(Boolean).length > (seen.bossN || 0); CS.earnCreds(first ? 60 : 30, first ? "new boss defeated" : "boss defeated"); seen.bossT = bossT; }
  seen.bossN = Object.values(s.bosses || {}).filter(Boolean).length;
  /* practice exams */
  const ex = (s.exams || []).length; if (seen.exams == null) seen.exams = ex;
  else if (ex > seen.exams) { const e = s.exams[ex - 1]; CS.earnCreds(e && e.n >= 40 ? 60 : 25, e && e.n >= 40 ? "full practice exam" : "mini exam"); seen.exams = ex; }
  /* badges = milestones */
  const bd = Object.keys(s.badges || {}).length; if (seen.badges == null) seen.badges = bd;
  else if (bd > seen.badges) { CS.earnCreds(40 * (bd - seen.badges), "badge earned"); seen.badges = bd; }
  /* pets hatched */
  const h = (s.pets && s.pets.hatched) || 0; if (seen.hatched == null) seen.hatched = h;
  else if (h > seen.hatched) { CS.earnCreds(10 * (h - seen.hatched), "egg hatched"); seen.hatched = h; }
  CS.save();
}
const baseLevelUp = CS.levelUp;
CS.levelUp = lv => { baseLevelUp(lv); CS.earnCreds(20 + lv * 5, `level ${lv} reached`); };
const STREAKS = [3, 7, 14, 21, 30, 50, 75, 100, 150, 200, 300, 365];
const baseStreak = CS.streakRewards;
CS.streakRewards = () => { baseStreak(); const st = CS.streak(), c = W(); c.seen.streaks = c.seen.streaks || {};
  if (STREAKS.includes(st) && !c.seen.streaks[st]) { c.seen.streaks[st] = CS.today(); CS.earnCreds(Math.min(300, st * 5), `${st}-day streak milestone`); } };
const baseAdd = CS.addXP;
CS.addXP = n => { baseAdd(n); scan(); };
/* lessons: opening a unit guide or watching an explainer, once each per day */
CS.onLearn = o => { const c = W(), d = CS.today(); c.seen.learn = c.seen.learn && c.seen.learn.d === d ? c.seen.learn : {d, k:{}};
  const k = o.mode === "vid" && o.game ? "v:" + o.game : o.unit ? "u:" + CS.COURSE + o.unit : null;
  if (k && !c.seen.learn.k[k]) { c.seen.learn.k[k] = 1; CS.earnCreds(k[0] === "v" ? 8 : 5, k[0] === "v" ? "lesson watched" : "lesson opened"); } };
/* top bar balance */
CS.afterChrome = () => { const el = $("#chips"); if (!el || $("#cred-chip")) return;
  el.insertAdjacentHTML("afterbegin", `<button class="chip-stat cred-chip" id="cred-chip" title="Your creds. Spend them in Pets → Market">${CS.credIcon(16)}${fmt(CS.creds())}</button>`);
  $("#cred-chip").onclick = () => { tab = "market"; CS.go("pets"); }; };

/* ---------- pets: tabs (Collection · Merge · Market) ---------- */
let tab = "collection", mkt = null, mktErr = "", mktFilter = "all", busy = false;
const ORDER = CS.RARITY_ORDER, R = CS.RARITY, PET = CS.PET;
const P = () => S().pets || (S().pets = {eggs:[], owned:{}, active:null, lastEgg:"", hatched:0});
const copies = id => { const o = P().owned[id]; return o ? Math.max(1, o.copies || 1) : 0; };
const setOf = id => Object.values(CS.PET_SETS).find(s => s.pets.some(p => p.id === id));
const PRICE = {common:40, uncommon:90, rare:220, epic:550, legendary:1400, mythical:3500, supreme:12000};
function addPet(id){ const o = P().owned[id]; if (o) { o.copies = Math.max(1, o.copies || 1) + 1; } else P().owned[id] = {growth:0, at:CS.today(), copies:1}; if (!P().active) P().active = id; }
function removePet(id){ const o = P().owned[id]; if (!o) return; const n = Math.max(1, o.copies || 1) - 1; if (n > 0) o.copies = n; else { delete P().owned[id]; if (P().active === id) P().active = Object.keys(P().owned)[0] || null; } }
const tabs = () => `<div class="seg pet-tabs" role="tablist" aria-label="Pets">${[["collection","Collection"],["merge","Merge"],["market","Market"]].map(([k,n])=>`<button role="tab" data-ptab="${k}" aria-pressed="${tab===k}">${n}</button>`).join("")}</div>`;
const baseRender = CS.render.pets;
CS.render.pets = (o = {}) => {
  if (o.tab) tab = o.tab;
  if (tab === "market" && !o.fromMarket && !busy) setTimeout(loadMarket, 0);
  const v = $("#v-pets");
  if (tab === "collection") { baseRender(o); v.insertAdjacentHTML("afterbegin", `<div class="spread pet-tabbar">${tabs()}<span class="cred-pill">${CS.credIcon(18)}<b>${fmt(CS.creds())}</b> creds</span></div>`); }
  else {
    v.innerHTML = `<div class="spread pet-tabbar">${tabs()}<span class="cred-pill">${CS.credIcon(18)}<b>${fmt(CS.creds())}</b> creds</span></div><div id="pet-sub"></div>`;
    tab === "merge" ? renderMerge($("#pet-sub")) : renderMarket($("#pet-sub"));
  }
  $$("#v-pets [data-ptab]").forEach(b => b.onclick = () => { tab = b.dataset.ptab; CS.render.pets({keepScroll:true}); });
};

/* ---------- merge: 3 of the same pet → 1 random pet of the next rarity ---------- */
function renderMerge(el){
  const owned = Object.keys(P().owned).filter(id => PET[id]).sort((a,b) => ORDER.indexOf(PET[a].r) - ORDER.indexOf(PET[b].r) || copies(b) - copies(a));
  el.innerHTML = `<div class="page-head"><div class="stack" style="gap:6px"><span class="eyebrow">Pet fusion</span><h1>Merge pets</h1>
      <p class="muted">Combine <b>3 copies of the same pet</b> into one random pet of the <b>next rarity up</b>. Get duplicates by hatching eggs or buying them in the Market. Supreme Mythical pets are the top and can't be merged.</p></div></div>
    <div class="merge-ladder">${ORDER.map((k,i)=>`<span style="--c:${R[k].col}">${R[k].n}</span>${i<ORDER.length-1?"<i>→</i>":""}`).join("")}</div>
    ${owned.length ? `<div class="pet-grid">${owned.map(id => { const p = PET[id], n = copies(id), ok = n >= 3 && p.r !== "supreme", nx = ORDER[ORDER.indexOf(p.r)+1];
      return `<div class="pet-card own merge-card" style="--col:${R[p.r].col};--glow:${R[p.r].glow}"><span class="rar" style="color:${R[p.r].col}">${R[p.r].n}</span>${CS.petSVG(id, {size:84, stage:CS.petStage(id)})}
        <b class="small">${esc(p.n)}</b><span class="copies"><b>${n}</b>/3 copies</span><div class="meter"><i style="width:${Math.min(100, n/3*100)}%;background:${R[p.r].col}"></i></div>
        ${p.r === "supreme" ? `<span class="tiny muted">Top rarity</span>` : `<button class="btn sm ${ok?"":"ghost"}" data-merge="${id}" ${ok?"":"disabled"}>${ok ? `Merge → ${R[nx].n}` : `Need ${3-n} more`}</button>`}</div>`; }).join("")}</div>`
      : `<div class="panel"><h3>No pets yet</h3><p class="muted">Hatch eggs by answering questions, then come back with 3 of the same pet.</p></div>`}`;
  $$("[data-merge]", el).forEach(b => b.onclick = () => merge(b.dataset.merge));
}
function merge(id){
  const p = PET[id]; if (!p || copies(id) < 3 || p.r === "supreme") return;
  const nx = ORDER[ORDER.indexOf(p.r) + 1], set = (setOf(id) || {pets:[]}).pets, pool = set.filter(x => x.r === nx);
  if (!pool.length) return CS.toast("No pets of the next rarity in this set yet.");
  const tot = pool.reduce((a,x)=>a+x.p,0); let r = Math.random()*tot, got = pool[0]; for (const x of pool) { r -= x.p; if (r <= 0) { got = x; break; } }
  removePet(id); removePet(id); removePet(id); addPet(got.id); CS.save();
  CS.earnCreds(15, "pets merged");
  const w = document.createElement("div"); w.className = "modal-wrap"; w.innerHTML = `<div class="modal merge-reveal" role="dialog" aria-modal="true">
    <span class="eyebrow">Merge complete</span><div class="merge-row">${[0,1,2].map(()=>CS.petSVG(id,{size:56})).join("")}<i>→</i></div>
    <div class="pet-reveal big ${nx}" style="--glow:${R[nx].glow};--col:${R[nx].col}">${CS.petSVG(got.id, {size:160})}</div>
    <h2 style="color:${R[nx].col}">${R[nx].n}! ${esc(got.n)}</h2><p class="muted">${esc(got.bio || "")}</p>
    <div class="row-wrap" style="justify-content:center"><button class="btn" id="mg-ok">Nice!</button><button class="btn ghost" id="mg-act">Make it my active pet</button></div></div>`;
  document.body.appendChild(w);
  $("#mg-ok", w).onclick = () => { w.remove(); CS.render.pets({keepScroll:true}); };
  $("#mg-act", w).onclick = () => { P().active = got.id; CS.save(); w.remove(); CS.render.pets({keepScroll:true}); CS.toast(`${got.n} is now your active pet.`); };
}

/* ---------- market ---------- */
async function api(method, body){
  const since = W().ledgerSeen || 0, q = `?since=${since}${mktFilter !== "all" ? "&rarity=" + mktFilter : ""}`;
  const r = await fetch("/api/market" + q, {method, credentials:"same-origin", headers: body ? {"content-type":"application/json"} : {}, body: body ? JSON.stringify({...body, since, rarity_filter: mktFilter !== "all" ? mktFilter : undefined}) : undefined});
  let j = {}; try { j = await r.json(); } catch(e) {}
  if (!r.ok) { const e = new Error(j.error || "The market isn't available right now."); e.status = r.status; throw e; }
  return j;
}
/* apply new ledger rows: pets in or out, creds from trades */
function applyEvents(evts){
  const c = W(); let changed = false;
  for (const e of evts || []) { if (e.id <= c.ledgerSeen) continue;
    if (e.pet && e.petDelta > 0) for (let i = 0; i < e.petDelta; i++) addPet(e.pet);
    if (e.pet && e.petDelta < 0) for (let i = 0; i < -e.petDelta; i++) removePet(e.pet);
    c.ledger = (c.ledger || 0) + (e.creds || 0); c.ledgerSeen = e.id; changed = true;
    if (e.reason === "sold") CS.toast(`Your ${(PET[e.pet]||{}).n || "pet"} sold for ${fmt(e.creds)} creds!`);
  }
  if (changed) { CS.save(); if (CS.syncNow) CS.syncNow(); if (CS.chrome) CS.chrome(); }
}
async function loadMarket(){
  if (!CS.account) { mkt = null; mktErr = ""; return CS.view() === "pets" && CS.render.pets({keepScroll:true, fromMarket:true}); }
  try { mkt = await api("GET"); mktErr = ""; applyEvents(mkt.events); } catch(e) { mktErr = e.message; }
  if (CS.view() === "pets" && tab === "market") CS.render.pets({keepScroll:true, tab:"market", fromMarket:true});
}
CS.loadMarket = loadMarket;
async function act(body, okMsg){
  if (busy) return; busy = true;
  try { if (CS.syncNow) await CS.syncNow(); mkt = await api("POST", body); mktErr = ""; applyEvents(mkt.events); if (okMsg) CS.toast(okMsg); }
  catch(e) { CS.toast(e.message); if (e.status === 409) await loadMarket(); }
  busy = false; CS.render.pets({keepScroll:true, fromMarket:true});
}
function petLine(id, size = 72){ const p = PET[id]; return p ? CS.petSVG(id, {size}) : ""; }
function renderMarket(el){
  const head = `<div class="page-head"><div class="stack" style="gap:6px"><span class="eyebrow">Trade with other students</span><h1>Pet market</h1>
    <p class="muted">List pets for creds, buy the ones you're missing, or send one straight to a friend (set the price to 0 for a gift). Earn creds by studying: quizzes, lessons, games, bosses, exams and milestones${CS.planFor && CS.planFor() ? " (your plan adds +10%)" : ". Paid plans earn 10% more"}. The market keeps a 10% fee on each sale.</p></div></div>`;
  if (!CS.account) { el.innerHTML = head + `<div class="panel lock-panel"><span class="lock-ico">${I("lock")}</span><div class="stack" style="gap:6px"><h3>Sign up to trade</h3><p class="muted">The market is for students with a free account, so every trade is saved to someone real. You keep earning creds as a guest, and they move into your new account.</p></div><button class="btn" data-account="signup">Create a free account</button></div>`; return; }
  if (!mkt) { el.innerHTML = head + `<div class="panel">${mktErr ? `<p class="feedback bad">${esc(mktErr)}</p><button class="btn sm" id="mk-retry">Try again</button>` : `<p class="muted">Loading the market…</p>`}</div>`; const r = $("#mk-retry", el); if (r) r.onclick = loadMarket; return; }
  const sellable = Object.keys(P().owned).filter(id => PET[id]).sort((a,b) => ORDER.indexOf(PET[b].r) - ORDER.indexOf(PET[a].r));
  const others = mkt.listings.filter(l => !l.mine), mineOpen = (mkt.mine || []).filter(l => l.status === "open"), sold = (mkt.mine || []).filter(l => l.status === "sold").slice(0, 5);
  el.innerHTML = head + `
    <div class="market-top">
      <div class="panel stack" style="gap:10px"><span class="eyebrow">Sell a pet</span>
        ${sellable.length ? `<div class="sell-row"><select id="mk-pet" aria-label="Pet to sell">${sellable.map(id=>`<option value="${id}">${esc(PET[id].n)} · ${R[PET[id].r].n} · ×${copies(id)}</option>`).join("")}</select>
          <label class="price-in">${CS.credIcon(16)}<input id="mk-price" type="number" min="0" max="50000" step="1" aria-label="Price in creds"></label>
          <select id="mk-to" aria-label="Sell to"><option value="">Sell to everyone</option>${(CS.friendNames ? CS.friendNames() : []).map(u=>`<option value="${esc(u)}" ${CS.marketTarget===u?"selected":""}>Offer to @${esc(u)} only</option>`).join("")}</select><button class="btn" id="mk-list">List for sale</button></div>
          <span class="tiny muted" id="mk-hint"></span>`
        : `<p class="muted small">You don't have any pets to sell yet.</p>`}
        ${mineOpen.length ? `<span class="eyebrow" style="margin-top:6px">Your listings · ${mineOpen.length}/10</span><div class="my-list">${mineOpen.map(l=>`<div class="my-row">${petLine(l.pet,40)}<span class="small"><b>${esc((PET[l.pet]||{}).n||l.pet)}</b><br><span class="muted">${l.price ? `${CS.credIcon(13)} ${fmt(l.price)}` : "Free gift"}${l.to ? ` · to @${esc(l.to)}` : ""}</span></span><button class="btn ghost sm" data-cancel="${l.id}">Take down</button></div>`).join("")}</div>` : ""}
        ${sold.length ? `<span class="eyebrow" style="margin-top:6px">Recently sold</span>${sold.map(l=>`<span class="small muted">${esc((PET[l.pet]||{}).n||l.pet)} · ${fmt(Math.floor(l.price*(1-mkt.fee)))} creds after fee</span>`).join("")}` : ""}
      </div>
      <div class="panel stack wallet" style="gap:6px"><span class="eyebrow">Your creds</span><div class="big-creds">${CS.credIcon(30)}<b>${fmt(CS.creds())}</b></div>
        <span class="small muted">Earned studying: ${fmt(mkt.earned)} · From trades: ${mkt.traded >= 0 ? "+" : ""}${fmt(mkt.traded)}</span>
        <span class="tiny muted">Earn up to ${DAY_CAP} creds a day. Quizzes 10 · lessons 5–8 · games 6 · Daily Challenge 15 · bosses 30–60 · exams 25–60 · badges 40 · level-ups and streak milestones more.</span></div>
    </div>
    <div class="spread" style="margin-top:6px"><h2>For sale</h2><div class="chips">${["all","friends"].concat(ORDER).map(k=>`<button class="chip" data-mf="${k}" aria-pressed="${mktFilter===k}">${k==="all"?"All":k==="friends"?"From friends":R[k].n}</button>`).join("")}</div></div>
    ${others.length ? `<div class="pet-grid market-grid">${others.map(l => { const p = PET[l.pet]; if (!p) return ""; const have = copies(l.pet), afford = CS.creds() >= l.price;
      return `<div class="pet-card own mk-card" style="--col:${R[p.r].col};--glow:${R[p.r].glow}"><span class="rar" style="color:${R[p.r].col}">${R[p.r].n}</span>${CS.petSVG(l.pet,{size:84})}
        ${l.forYou ? `<span class="tag good">${l.price ? "Offer for you" : "Gift for you!"}</span>` : l.friend ? `<span class="tag">Friend</span>` : ""}<b class="small">${esc(p.n)}</b><span class="tiny muted">by ${esc(l.seller)}${have ? ` · you have ×${have}` : " · new for you!"}</span>
        <button class="btn sm ${afford?"":"ghost"}" data-buy="${l.id}" ${afford?"":"disabled"}>${l.price ? `${CS.credIcon(14)} ${fmt(l.price)}` : "Claim gift"}</button></div>`; }).join("")}</div>`
      : `<div class="panel"><p class="muted">No pets for sale${mktFilter!=="all"?" at this rarity":""} right now. List one of yours to get the market started!</p></div>`}
    <p class="tiny muted">Prices are set by students. Trades are final. Creds have no cash value and can't be bought or exchanged for money.</p>`;
  const sel = $("#mk-pet", el), price = $("#mk-price", el);
  const hint = () => { const p = PET[sel.value]; price.value = PRICE[p.r]; const pr = mkt.listings.filter(l => l.pet === sel.value).map(l => l.price);
    $("#mk-hint", el).textContent = `Suggested for ${R[p.r].n}: ${fmt(PRICE[p.r])} creds.${pr.length ? ` Others are asking ${fmt(Math.min(...pr))}–${fmt(Math.max(...pr))}.` : ""} You get ${fmt(Math.floor(PRICE[p.r]*(1-mkt.fee)))} after the 10% fee.`; };
  if (sel) { hint(); sel.onchange = hint; price.oninput = () => { const v = Math.floor(+price.value || 0); $("#mk-hint", el).textContent = `You get ${fmt(Math.floor(v*(1-mkt.fee)))} creds after the 10% fee.`; };
    $("#mk-list", el).onclick = () => { const id = sel.value, p = PET[id];
      const to = $("#mk-to", el).value;
      act({action:"list", pet:id, rarity:p.r, price:Math.floor(+price.value || 0), to: to || undefined}, to ? `Offer sent to @${to}. They'll see it in their Market.` : `${p.n} is listed. It's held by the market until it sells or you take it down.`); CS.marketTarget = null; }; }
  $$("[data-cancel]", el).forEach(b => b.onclick = () => act({action:"cancel", id:+b.dataset.cancel}, "Listing taken down. Your pet is back."));
  $$("[data-buy]", el).forEach(b => b.onclick = () => { const l = mkt.listings.find(x => x.id === +b.dataset.buy), p = PET[l.pet];
    if (l.price && !window.confirm(`Buy ${p.n} (${R[p.r].n}) for ${fmt(l.price)} creds?`)) return;
    act({action:"buy", id:l.id}, `You bought ${p.n}! It's in your collection.`); });
  $$("[data-mf]", el).forEach(b => b.onclick = () => { mktFilter = b.dataset.mf; loadMarket(); });
}
/* check for sales when the app opens (signed in) */
const prevAfter = CS.afterAccount;
CS.afterAccount = () => { if (prevAfter) prevAfter(); setTimeout(loadMarket, 800); };
})();
