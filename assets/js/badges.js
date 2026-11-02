/* Badges: medal art for achievements (bronze → platinum), a shield badge for every unit boss in every course,
   the "Pets & badges" tabs (Badges, Showcase), the badge-unlocked pop-up, and friends' profile showcases.
   Earned badges live in S().badges (shared across courses). Boss badges use keys like "boss:bio:3". */
(function(){
"use strict";
const CS = window.CS, $ = CS.$, $$ = CS.$$, esc = CS.esc, I = CS.icon;
const S = () => CS.S();
const COURSES = () => Object.values(window.CS_COURSES);

/* ---------- extra achievements ---------- */
const startedCourses = () => COURSES().filter(c => {
  if (c.k === CS.C.k) return CS.answeredCount() > 0;
  try { const r = JSON.parse(window.CS_STORE.get(c.key) || "null"); return !!(r && r.answers && Object.values(r.answers).some(a => a && a.length)); } catch(e) { return false; }
}).length;
const bossCount = () => Object.keys(S().badges || {}).filter(k => k.startsWith("boss:")).length;
const fix = CS.BADGES.find(b => b.k === "bossall"); if (fix) fix.d = "Beat every unit boss in one course";
CS.BADGES.push(
  {k:"q1000", n:"Thousand club", d:"Answer 1,000 questions", ic:"check", t:() => (S().totalAnswered || 0) >= 1000},
  {k:"s100", n:"Iron will", d:"100-day streak", ic:"flame", t:() => CS.streak() >= 100},
  {k:"lv10", n:"Rising star", d:"Reach level 10", ic:"bolt", t:() => CS.level().lv >= 10},
  {k:"lv25", n:"Scholar", d:"Reach level 25", ic:"cap", t:() => CS.level().lv >= 25},
  {k:"courses3", n:"Triple threat", d:"Study 3 different courses", ic:"book", t:() => startedCourses() >= 3},
  {k:"courses10", n:"Completionist", d:"Study all 10 courses", ic:"grid", t:() => startedCourses() >= COURSES().length},
  {k:"boss10", n:"Boss hunter", d:"Beat 10 unit bosses", ic:"sword", t:() => bossCount() >= 10}
);
const TIER = {diag:"bronze", s3:"bronze", q100:"bronze", cards:"bronze", daily:"bronze", boss:"bronze", hatch1:"bronze",
  s7:"silver", sprint:"silver", shift:"silver", fed:"silver", chain:"silver", crunch:"silver", pets10:"silver", lv10:"silver", courses3:"silver",
  s30:"gold", bossall:"gold", mock:"gold", gold:"gold", all:"gold", petleg:"gold", q1000:"gold", lv25:"gold", boss10:"gold",
  petmyth:"plat", petsup:"plat", petall:"plat", courses10:"plat", s100:"plat"};
const TIER_N = {bronze:"Bronze", silver:"Silver", gold:"Gold", plat:"Platinum"};
const PAL = {bronze:["#FCD9B6","#D08A4E","#8A4B1F","#B91C1C"], silver:["#F8FAFC","#B4C0CF","#4B5B70","#2563EB"],
  gold:["#FEF3C7","#F5B820","#8A5A0B","#7C3AED"], plat:["#ECFEFF","#A5B4FC","#5B21B6","#DB2777"]};

/* ---------- badge lookup: achievements and boss badges ---------- */
CS.badgeDef = key => {
  if (key.startsWith("boss:")) {
    const [, ck, u] = key.split(":"), c = window.CS_COURSES[ck]; if (!c) return null;
    const name = (c.bosses && c.bosses[u]) || `${c.unitWord || "Unit"} ${u} boss`;
    return {k:key, kind:"boss", n:name, d:`Beat the ${c.name} ${c.unitWord || "Unit"} ${u} boss`, course:c, unit:+u};
  }
  const b = CS.BADGES.find(x => x.k === key); if (!b) return null;
  return {...b, kind:"ach", tier: TIER[b.k] || "silver"};
};

/* ---------- art ---------- */
let gid = 0;
const iconPaths = ic => (I(ic).match(/<svg[^>]*>([\s\S]*)<\/svg>/) || [])[1] || "";
function medal(def, size){
  const id = "bd" + (++gid), [hi, mid, dk, rib] = PAL[def.tier];
  /* scalloped rosette edge */
  let edge = ""; const N = 18;
  for (let i = 0; i <= N * 2; i++) { const a = (i / (N * 2)) * Math.PI * 2 - Math.PI / 2, r = i % 2 ? 40 : 44; edge += `${i ? "L" : "M"}${(50 + r * Math.cos(a)).toFixed(1)} ${(48 + r * Math.sin(a)).toFixed(1)}`; }
  const sparkle = def.tier === "plat" ? `<path d="M80 14l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#fff" opacity=".9"/><path d="M18 70l1.4 3.4 3.4 1.4-3.4 1.4-1.4 3.4-1.4-3.4-3.4-1.4 3.4-1.4z" fill="#fff" opacity=".8"/>` : "";
  return `<svg class="bdg" viewBox="0 0 100 120" width="${size}" height="${size * 1.2}" role="img" aria-label="${esc(def.n)}">
    <defs><linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${hi}"/><stop offset=".55" stop-color="${mid}"/><stop offset="1" stop-color="${dk}"/></linearGradient>
      <radialGradient id="${id}s" cx=".35" cy=".3" r=".7"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
    <path d="M30 78 L20 116 L34 108 L42 118 L48 84Z" fill="${rib}"/><path d="M70 78 L80 116 L66 108 L58 118 L52 84Z" fill="${rib}" opacity=".85"/>
    <path d="${edge}Z" fill="url(#${id}g)" stroke="${dk}" stroke-width="1.5"/>
    <circle cx="50" cy="48" r="31" fill="${dk}" opacity=".9"/><circle cx="50" cy="48" r="28" fill="url(#${id}g)"/><circle cx="50" cy="48" r="28" fill="url(#${id}s)"/>
    <g transform="translate(35 33) scale(1.25)" fill="none" stroke="${dk}" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">${iconPaths(def.ic)}</g>${sparkle}</svg>`;
}
function shield(def, size){
  const id = "bd" + (++gid), col = def.course.col;
  return `<svg class="bdg" viewBox="0 0 100 120" width="${size}" height="${size * 1.2}" role="img" aria-label="${esc(def.n)}">
    <defs><linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${col}" stop-opacity=".75"/><stop offset="1" stop-color="${col}"/></linearGradient>
      <linearGradient id="${id}r" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FDE68A"/><stop offset="1" stop-color="#D97706"/></linearGradient></defs>
    <g stroke="#94A3B8" stroke-width="5" stroke-linecap="round"><path d="M18 26 L82 98"/><path d="M82 26 L18 98"/></g>
    <g stroke="#E2E8F0" stroke-width="2" stroke-linecap="round"><path d="M18 26 L82 98"/><path d="M82 26 L18 98"/></g>
    <path d="M50 16 L84 28 V60 C84 84 68 100 50 110 C32 100 16 84 16 60 V28 Z" fill="url(#${id}g)" stroke="url(#${id}r)" stroke-width="4"/>
    <path d="M50 24 L77 33.5 V60 C77 79 64.5 92 50 100 C35.5 92 23 79 23 60 V33.5 Z" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.5"/>
    <path d="M34 18 L38 6 L45 13 L50 3 L55 13 L62 6 L66 18 Z" fill="url(#${id}r)" stroke="#92400E" stroke-width="1.2"/>
    <g transform="translate(41 34) scale(.75)" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${iconPaths(def.course.icon || "book")}</g>
    <text x="50" y="78" text-anchor="middle" font-family="Manrope,Arial,sans-serif" font-weight="800" font-size="24" fill="#fff">${def.unit}</text>
    <path d="M28 86 H72 L68 94 H32 Z" fill="url(#${id}r)"/><text x="50" y="92.6" text-anchor="middle" font-family="Manrope,Arial,sans-serif" font-weight="800" font-size="6.4" fill="#78350F" letter-spacing=".8">${esc((def.course.unitWord || "Unit").toUpperCase())} ${def.unit}</text></svg>`;
}
CS.badgeSVG = (key, {size = 64, locked = false} = {}) => {
  const def = CS.badgeDef(key); if (!def) return "";
  const art = def.kind === "boss" ? shield(def, size) : medal(def, size);
  return `<span class="bdg-wrap ${locked ? "locked" : ""}" title="${esc(def.n)}: ${esc(def.d)}">${art}${locked ? `<i class="bdg-lock">${I("lock")}</i>` : ""}</span>`;
};

/* ---------- earning: boss badges from every course's saved bosses, plus the pop-up ---------- */
function syncBoss(){
  const b = S().badges || (S().badges = {}), fresh = [];
  for (const c of COURSES()) {
    let bosses = null;
    if (c.k === CS.C.k) bosses = S().bosses; else { try { bosses = (JSON.parse(window.CS_STORE.get(c.key) || "null") || {}).bosses; } catch(e) {} }
    for (const [u, at] of Object.entries(bosses || {})) { const key = `boss:${c.k}:${u}`;
      if (at && !b[key]) { b[key] = typeof at === "number" ? at : Date.now(); if (c.k === CS.C.k && typeof at === "number" && Date.now() - at < 120000) fresh.push(key); } }
  }
  fresh.forEach(k => CS.badgePop(k));
}
CS.checkBadges = () => {
  syncBoss();
  CS.BADGES.forEach(b => { if (!S().badges[b.k] && b.t()) { S().badges[b.k] = Date.now(); CS.badgePop(b.k); } });
};
let popQ = [], popOn = false;
CS.badgePop = key => { popQ.push(key); if (!popOn) nextPop(); };
function nextPop(){
  const key = popQ.shift(); if (!key) { popOn = false; return; } popOn = true;
  const def = CS.badgeDef(key); if (!def) return nextPop();
  const el = document.createElement("div"); el.className = "badge-pop"; el.setAttribute("role", "status");
  el.innerHTML = `<span class="bp-art">${CS.badgeSVG(key, {size:72})}</span><span class="stack" style="gap:2px"><span class="eyebrow">${def.kind === "boss" ? "Boss defeated" : `${TIER_N[def.tier]} badge unlocked`}</span><b>${esc(def.n)}</b><span class="tiny muted">${esc(def.d)}</span></span>`;
  document.body.appendChild(el); requestAnimationFrame(() => el.classList.add("on"));
  setTimeout(() => { el.classList.remove("on"); setTimeout(() => { el.remove(); nextPop(); }, 350); }, 3200);
}

/* ---------- Pets & badges: Badges tab ---------- */
CS.renderBadges = el => {
  const b = S().badges || {}, ach = CS.BADGES.map(x => x.k), bossKeys = COURSES().flatMap(c => Array.from({length: c.nUnits || Object.keys(c.bosses || {}).length}, (_, i) => `boss:${c.k}:${i + 1}`));
  const nA = ach.filter(k => b[k]).length, nB = bossKeys.filter(k => b[k]).length;
  const order = ["bronze", "silver", "gold", "plat"];
  el.innerHTML = `<div class="page-head"><div class="stack" style="gap:6px"><span class="eyebrow">Badges</span><h1>Your badge collection</h1>
      <p class="muted">${nA + nB} of ${ach.length + bossKeys.length} earned. Pick your favorites to show friends in the Showcase tab.</p></div>
      <button class="btn ghost sm" data-ptab2="showcase">${I("star")} Edit showcase</button></div>
    <section class="stack" style="gap:12px"><div class="spread"><h2 class="h3">Achievements</h2><span class="tag">${nA}/${ach.length}</span></div>
      <div class="bd-grid">${ach.slice().sort((x, y) => order.indexOf(TIER[x] || "silver") - order.indexOf(TIER[y] || "silver")).map(k => { const d = CS.badgeDef(k), on = !!b[k];
        return `<div class="bd-card ${on ? "on" : ""} t-${d.tier}">${CS.badgeSVG(k, {size:58, locked:!on})}<b>${esc(d.n)}</b><span class="tiny muted">${esc(d.d)}</span><span class="bd-tier">${on ? `Earned ${new Date(b[k]).toLocaleDateString(undefined, {month:"short", day:"numeric"})}` : TIER_N[d.tier]}</span></div>`; }).join("")}</div></section>
    <section class="stack" style="gap:12px"><div class="spread"><h2 class="h3">Boss badges</h2><span class="tag">${nB}/${bossKeys.length}</span></div>
      <p class="small muted" style="margin:0">Beat a unit's boss battle in Games to earn its shield.</p>
      ${COURSES().map(c => { const keys = bossKeys.filter(k => k.startsWith(`boss:${c.k}:`)), got = keys.filter(k => b[k]).length;
        return `<div class="bd-course"><div class="spread"><span class="bd-cname"><i style="background:${c.col}"></i>${esc(c.name)}</span><span class="tiny muted">${got}/${keys.length}</span></div>
          <div class="bd-row">${keys.map(k => { const d = CS.badgeDef(k); return `<div class="bd-boss ${b[k] ? "on" : ""}">${CS.badgeSVG(k, {size:50, locked:!b[k]})}<span class="tiny">${esc(d.n.replace(/^The /, ""))}</span></div>`; }).join("")}</div></div>`; }).join("")}
    </section>`;
};

/* ---------- Pets & badges: Showcase tab (pick 3 pets + 3 badges) ---------- */
const sc = () => S().showcase || (S().showcase = {pets:[], badges:[]});
CS.renderShowcase = el => {
  const s = sc(), P = S().pets || {owned:{}}, owned = Object.keys(P.owned || {}).filter(id => CS.PET[id]), earned = Object.keys(S().badges || {}).filter(k => CS.badgeDef(k));
  s.pets = s.pets.filter(id => P.owned[id]); s.badges = s.badges.filter(k => (S().badges || {})[k]);
  const R = CS.RARITY, ord = CS.RARITY_ORDER || Object.keys(R);
  owned.sort((a, b) => ord.indexOf(CS.PET[b].r) - ord.indexOf(CS.PET[a].r));
  earned.sort((a, b) => (S().badges[b] || 0) - (S().badges[a] || 0));
  el.innerHTML = `<div class="page-head"><div class="stack" style="gap:6px"><span class="eyebrow">Showcase</span><h1>Your profile showcase</h1>
      <p class="muted">Pick 3 pets and 3 badges. Friends see them when they tap your picture on the friends leaderboard.</p></div></div>
    <div class="sc-preview">${profileCard({name: (CS.account && CS.account.name) || S().name || "You", username: CS.account && CS.account.username, level: CS.level().lv, me:true}, s.pets.map(id => ({id})), s.badges)}</div>
    ${CS.account ? "" : `<div class="feedback">${I("lock")} <span>Sign in so friends can see your showcase. Your picks are saved either way.</span> <button class="btn sm" data-account="signup">Sign up free</button></div>`}
    <section class="stack" style="gap:10px"><div class="spread"><h2 class="h3">Pets</h2><span class="tag">${s.pets.length}/3 picked</span></div>
      ${owned.length ? `<div class="sc-pick">${owned.map(id => { const p = CS.PET[id], on = s.pets.includes(id);
        return `<button class="sc-item ${on ? "on" : ""}" data-scpet="${id}" aria-pressed="${on}" ${!on && s.pets.length >= 3 ? "disabled" : ""} style="--rc:${R[p.r].col}">${CS.petSVG(id, {size:58})}<b class="tiny">${esc(p.n)}</b><span class="tiny" style="color:${R[p.r].col}">${R[p.r].n}</span>${on ? `<i class="sc-n">${s.pets.indexOf(id) + 1}</i>` : ""}</button>`; }).join("")}</div>`
        : `<p class="muted small">Hatch your first pet to show it off. You earn a mystery egg every 25 questions.</p>`}</section>
    <section class="stack" style="gap:10px"><div class="spread"><h2 class="h3">Badges</h2><span class="tag">${s.badges.length}/3 picked</span></div>
      ${earned.length ? `<div class="sc-pick">${earned.map(k => { const d = CS.badgeDef(k), on = s.badges.includes(k);
        return `<button class="sc-item ${on ? "on" : ""}" data-scbdg="${k}" aria-pressed="${on}" ${!on && s.badges.length >= 3 ? "disabled" : ""}>${CS.badgeSVG(k, {size:48})}<b class="tiny">${esc(d.n)}</b>${on ? `<i class="sc-n">${s.badges.indexOf(k) + 1}</i>` : ""}</button>`; }).join("")}</div>`
        : `<p class="muted small">Earn your first badge by finishing the diagnostic or beating a unit boss.</p>`}</section>`;
  const toggle = (arr, v) => { const i = arr.indexOf(v); if (i >= 0) arr.splice(i, 1); else if (arr.length < 3) arr.push(v); CS.save(); if (CS.syncNow) CS.syncNow(); CS.renderShowcase(el); };
  $$("[data-scpet]", el).forEach(b => b.onclick = () => toggle(s.pets, b.dataset.scpet));
  $$("[data-scbdg]", el).forEach(b => b.onclick = () => toggle(s.badges, b.dataset.scbdg));
};

/* ---------- the profile card (yours in Showcase, a friend's in the pop-up) ---------- */
function profileCard(u, pets, badges){
  const R = CS.RARITY, hue = ((u.name || "?").charCodeAt(0) * 37) % 360;
  const slot = (html, empty) => html || `<span class="pc-empty">${empty}</span>`;
  return `<div class="pc"><div class="pc-head"><span class="pc-av" style="background:hsl(${hue} 70% 88%);color:hsl(${hue} 60% 30%)">${esc((u.name || "?")[0])}</span>
      <div class="stack" style="gap:0"><b>${esc(u.me ? (u.name || "You") : u.name)}</b><span class="tiny muted">${u.username ? "@" + esc(u.username) + " · " : ""}Level ${u.level || 1}${u.pets != null ? ` · ${u.pets} pets · ${u.badges} badges` : ""}</span></div></div>
    <span class="eyebrow">Pets</span><div class="pc-row">${[0, 1, 2].map(i => { const p = pets[i] && CS.PET[pets[i].id];
      return `<div class="pc-slot">${slot(p ? `${CS.petSVG(pets[i].id, {size:72})}<b class="tiny">${esc(p.n)}</b><span class="tiny" style="color:${R[p.r].col}">${R[p.r].n}</span>` : "", "Empty")}</div>`; }).join("")}</div>
    <span class="eyebrow">Badges</span><div class="pc-row">${[0, 1, 2].map(i => { const d = badges[i] && CS.badgeDef(badges[i]);
      return `<div class="pc-slot">${slot(d ? `${CS.badgeSVG(badges[i], {size:56})}<b class="tiny">${esc(d.n)}</b>` : "", "Empty")}</div>`; }).join("")}</div></div>`;
}

/* ---------- a friend's profile: tap their picture ---------- */
CS.openProfile = async username => {
  const w = document.createElement("div"); w.className = "modal-wrap"; w.innerHTML = `<div class="modal pc-modal" role="dialog" aria-modal="true" aria-label="Profile"><p class="muted">Loading…</p></div>`;
  document.body.appendChild(w); w.addEventListener("click", e => { if (e.target === w) w.remove(); });
  const m = $(".modal", w);
  try {
    const r = await fetch("/api/showcase?username=" + encodeURIComponent(username), {credentials: "same-origin"}); const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || "Couldn't load this profile.");
    m.innerHTML = `<div class="spread"><span class="eyebrow">${j.user.me ? "Your profile" : "Friend's profile"}</span><button class="btn ghost sm" data-x>Close</button></div>${profileCard(j.user, j.pets, j.badges)}
      ${j.user.me ? `<button class="btn sm" data-scedit>Edit your showcase</button>` : !j.pets.length && !j.badges.length ? `<p class="tiny muted">${esc(j.user.name)} hasn't picked a showcase yet.</p>` : ""}`;
  } catch(e) { m.innerHTML = `<div class="spread"><b>Profile</b><button class="btn ghost sm" data-x>Close</button></div><p class="muted">${esc(e.message)}</p>`; }
  $$("[data-x]", m).forEach(b => b.onclick = () => w.remove());
  const ed = $("[data-scedit]", m); if (ed) ed.onclick = () => { w.remove(); CS.go("pets"); CS.render.pets({tab:"showcase"}); };
};
document.addEventListener("click", e => {
  const p = e.target.closest("[data-prof]"); if (p) { e.preventDefault(); e.stopPropagation(); CS.openProfile(p.dataset.prof); return; }
  const t = e.target.closest("[data-ptab2]"); if (t) { e.preventDefault(); CS.render.pets({tab: t.dataset.ptab2, keepScroll: true}); }
}, true);
document.addEventListener("keydown", e => { const p = e.target.closest && e.target.closest("[data-prof]"); if (p && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); CS.openProfile(p.dataset.prof); } });
})();
