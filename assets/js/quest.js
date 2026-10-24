/* Credit Sprint Quest Map: themed 2-week seasons, the unit path with your pet walking it, reward chests,
   the season pass (free + Pass lanes), a small gem shop, and the weekly league (practice league when signed out;
   account.js swaps in the live league when a student is signed in). */
(function(){
"use strict";
const CS = window.CS, $ = CS.$, $$ = CS.$$, esc = CS.esc, I = CS.icon;
const S = () => CS.S();

/* ---------- seasons: every 2 weeks, starting Monday Jan 5 2026, cycling through 8 themes ---------- */
const EPOCH = "2026-01-05", LEN = 14;
CS.THEMES = [
  {k:"meadow",  n:"Meadow Mile",  d:"Green hills and wildflowers."},
  {k:"night",   n:"Night Trail",  d:"A starlit path under the moon."},
  {k:"isles",   n:"Island Hop",   d:"Sail from island to island."},
  {k:"frost",   n:"Frost Peaks",  d:"Snowy mountains and icy trails."},
  {k:"canyon",  n:"Canyon Run",   d:"Red rock mesas at sunset."},
  {k:"blossom", n:"Blossom Path", d:"Cherry blossoms in spring."},
  {k:"ember",   n:"Ember Ridge",  d:"A volcano trail glowing with lava."},
  {k:"reef",    n:"Coral Reef",   d:"An underwater road through the reef."}
];
const dayN = k => Math.round((new Date(k+"T12:00:00") - new Date(EPOCH+"T12:00:00")) / CS.DAY);
CS.seasonInfo = (key = CS.today()) => {
  const i = Math.floor(dayN(key) / LEN), start = CS.addDays(EPOCH, i*LEN), end = CS.addDays(start, LEN-1);
  return {i, id:"s"+(i+1), num:i+1, start, end, left:dayN(end) - dayN(key) + 1, theme:CS.THEMES[((i % 8) + 8) % 8]};
};
CS.seasonXP = si => { let x = 0; for (let d = 0; d < LEN; d++) x += S().days[CS.addDays(si.start, d)] || 0; return x; };

/* ---------- season pass ---------- */
CS.TIERS = [50, 120, 220, 350, 500, 700, 950, 1250];
const FREE = ["gems:50","egg","gems:75","freeze","gems:100","egg","gems:150","egg:rare"];
const PASS = ["egg:rare","gems:150","egg:rare","gems:200","egg:epic","gems:250","egg:epic","egg:legendary"];
const label = r => { const [k, v] = r.split(":"); return k === "gems" ? `${v} gems` : k === "freeze" ? "Streak freeze" : v ? `${CS.RARITY_NAME(v)}+ egg` : "Mystery egg"; };
const icon = r => r.startsWith("gems") ? "💎" : r === "freeze" ? "❄️" : r.includes("legendary") ? "🌟" : r.includes("epic") ? "🔮" : r.includes("rare") ? "💠" : "🥚";
function grant(r){
  const s = S(), [k, v] = r.split(":");
  if (k === "gems") s.gems = (s.gems || 0) + +v;
  else if (k === "freeze") s.freezes = Math.min(3, (s.freezes || 0) + 1);
  else if (k === "egg") CS.giveEgg(v);
  CS.save();
}
/* Pass lane: open for Pro, and for everyone while checkout isn't set up yet (beta) */
CS.passOpen = () => (CS.isPro && CS.isPro()) || !(CS.CHECKOUT && Object.values(CS.CHECKOUT).some(Boolean));
function claims(si){ const s = S(); s.seasons = s.seasons || {}; return s.seasons[si.id] || (s.seasons[si.id] = {free:[], pass:[]}); }
CS.seasonClaimable = () => { const si = CS.seasonInfo(), xp = CS.seasonXP(si), c = claims(si);
  return CS.TIERS.reduce((n, t, i) => n + (xp >= t && !c.free.includes(i) ? 1 : 0) + (xp >= t && CS.passOpen() && !c.pass.includes(i) ? 1 : 0), 0); };

/* ---------- the map ---------- */
const ROAD = "M300 40 C460 70 470 130 330 165 C170 205 130 255 290 285 C450 315 470 360 300 400";
const POS = [[50,11],[72,27],[42,42],[29,58],[66,72],[48,88]];
const CHESTS = [[80,13],[22,30],[78,50],[14,76],[84,88]];
const seeded = seed => CS.seeded(seed);
function decor(theme, num){
  const r = seeded("decor"+num), out = [];
  const pts = n => Array.from({length:n}, () => [Math.round(r()*600), Math.round(r()*460), r()]);
  switch (theme) {
    case "meadow": pts(16).forEach(([x,y,z]) => out.push(z > .5
      ? `<g transform="translate(${x} ${y})"><circle r="5" fill="#F9A8D4"/><circle r="2.2" fill="#FDE047"/></g>`
      : `<path d="M${x} ${y} l-4 -10 M${x} ${y} l0 -12 M${x} ${y} l4 -10" stroke="#86C99A" stroke-width="2.5" stroke-linecap="round"/>`)); break;
    case "night": out.push(`<circle cx="530" cy="60" r="26" fill="#FEF3C7"/><circle cx="542" cy="52" r="24" fill="#1A2350"/>`);
      pts(34).forEach(([x,y,z],i) => out.push(`<circle cx="${x}" cy="${y}" r="${z>.8?2.2:1.3}" fill="#fff"><animate attributeName="opacity" values=".2;1;.2" dur="${2+i%4}s" repeatCount="indefinite"/></circle>`)); break;
    case "isles": pts(14).forEach(([x,y]) => out.push(`<path d="M${x} ${y} q8 -6 16 0 q8 6 16 0" stroke="#E0F7FF" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".8"/>`)); break;
    case "frost": out.push(`<path d="M0 460 L90 330 L170 460Z M420 460 L520 300 L600 420 L600 460Z" fill="#E2EEFB"/><path d="M90 330 L70 360 L110 360Z M520 300 L496 336 L540 334Z" fill="#fff"/>`);
      pts(26).forEach(([x,y,z],i) => out.push(`<circle cx="${x}" cy="${y}" r="${z>.6?3:2}" fill="#fff" opacity=".9"><animateTransform attributeName="transform" type="translate" values="0 -30;0 40" dur="${5+i%5}s" repeatCount="indefinite"/></circle>`)); break;
    case "canyon": out.push(`<path d="M0 460 L0 380 L60 380 L70 350 L140 350 L150 380 L190 380 L190 460Z M440 460 L450 330 L530 330 L540 360 L600 360 L600 460Z" fill="#C2410C" opacity=".35"/>`);
      pts(6).forEach(([x,y]) => out.push(`<path d="M${x} ${y} v-24 M${x} ${y-12} h-8 v-8 M${x} ${y-16} h8 v-6" stroke="#4D7C0F" stroke-width="5" stroke-linecap="round" fill="none"/>`)); break;
    case "blossom": pts(24).forEach(([x,y,z],i) => out.push(`<ellipse cx="${x}" cy="${y}" rx="5" ry="3" fill="${z>.5?"#F9A8D4":"#FBCFE8"}" transform="rotate(${Math.round(z*180)} ${x} ${y})"><animateTransform attributeName="transform" type="translate" values="0 -20;14 30" dur="${6+i%5}s" repeatCount="indefinite" additive="sum"/></ellipse>`)); break;
    case "ember": out.push(`<path d="M40 420 q60 -30 120 -10 M400 440 q80 -40 170 -20 M60 120 q40 20 90 0" stroke="#F97316" stroke-width="4" fill="none" opacity=".55"/>`);
      pts(20).forEach(([x,y],i) => out.push(`<circle cx="${x}" cy="${y}" r="2.2" fill="#FDBA74"><animateTransform attributeName="transform" type="translate" values="0 30;0 -40" dur="${3+i%4}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;0" dur="${3+i%4}s" repeatCount="indefinite"/></circle>`)); break;
    case "reef": pts(8).forEach(([x]) => out.push(`<path d="M${x} 460 q-10 -30 0 -60 q10 -30 0 -60" stroke="#34D399" stroke-width="5" fill="none" opacity=".55" stroke-linecap="round"/>`));
      pts(18).forEach(([x,y,z],i) => out.push(`<circle cx="${x}" cy="${y}" r="${z>.6?5:3}" fill="none" stroke="#E0F2FE" stroke-width="1.5" opacity=".8"><animateTransform attributeName="transform" type="translate" values="0 40;0 -50" dur="${4+i%5}s" repeatCount="indefinite"/></circle>`)); break;
  }
  return out.join("");
}
const CHEST = open => open
  ? `<svg viewBox="0 0 46 40" aria-hidden="true"><rect x="3" y="18" width="40" height="20" rx="5" fill="#92400E"/><path d="M3 18 L8 4 L38 4 L43 18Z" fill="#B45309"/><rect x="3" y="22" width="40" height="3" fill="#78350F"/></svg>`
  : `<svg viewBox="0 0 46 40" aria-hidden="true"><rect x="3" y="14" width="40" height="24" rx="5" fill="#B45309"/><path d="M3 18 C3 6 43 6 43 18Z" fill="#D97706"/><rect x="19" y="16" width="8" height="10" rx="2" fill="#FDE047"/><rect x="3" y="20" width="40" height="3" fill="#92400E"/></svg>`;
const LINES = ["Let's go!","One more unit!","You've got this.","I'll race you!","Onward!"];
function unitState(){
  const s = S(), done = CS.UNITS.map(u => { const m = CS.mastery(u.id); return (m != null && m >= 0.7) || !!s.bosses[u.id]; });
  let cur = done.indexOf(false); if (cur < 0) cur = CS.UNITS.length - 1;
  return {done, cur};
}
CS.questMap = () => {
  const s = S(), si = CS.seasonInfo(), th = si.theme.k, {done, cur} = unitState(), chests = s.chests || {};
  const P = s.pets || {}, A = P.active && CS.PET[P.active] ? P.active : null, mood = CS.petMood ? CS.petMood() : "happy";
  const nodes = CS.UNITS.map((u, i) => { const st = done[i] ? "done" : i === cur ? "cur" : "next", md = CS.medal(CS.mastery(u.id)), [x, y] = POS[i];
    return `<button class="qnode ${st}" style="left:${x}%;top:${y}%" data-go="practice" data-mode="unit" data-unit="${u.id}" aria-label="Unit ${u.id}: ${esc(u.name)}${done[i]?", complete":""}">
      ${i === cur ? `<span class="qbub">${done[i] ? "REVIEW" : "START"}</span>` : ""}<b>${done[i] ? "✓" : u.id}</b><span class="ql">${esc(u.short)}${md?` <i class="qm ${md}"></i>`:""}</span></button>`; }).join("");
  const chestHTML = CHESTS.map(([x, y], i) => { const ready = done[i] && !chests[i], open = !!chests[i];
    return `<button class="qchest ${ready?"ready":""} ${open?"open":""}" style="left:${x}%;top:${y}%" data-chest="${i}" ${ready?"":"disabled"} aria-label="${open?"Opened chest":ready?"Open reward chest":`Chest unlocks after Unit ${i+1}`}" title="${open?"Opened":ready?"Open for 40 gems":`Finish Unit ${i+1} to unlock`}">${CHEST(open)}</button>`; }).join("");
  const [px, py] = POS[cur], left = px > 50;
  const pet = A ? `<div class="qpet ${left?"l":"r"}" style="left:${px}%;top:${py}%"><span class="qsay">${esc(LINES[(si.num + cur) % LINES.length])}</span>${CS.petSVG(A, {size:76, mood})}</div>`
    : `<div class="qpet ${left?"l":"r"}" style="left:${px}%;top:${py}%"><span class="qsay">Hatch a pet to join you</span>${CS.eggSVG("mystery", ((P.eggs||[])[0]||{}).prog||0, 15, 52)}</div>`;
  return `<div class="qmap" role="group" aria-label="${esc(si.theme.n)} unit map">
    <svg class="qroad" viewBox="0 0 600 460" preserveAspectRatio="none" aria-hidden="true">${decor(th, si.num)}<path d="${ROAD}" class="r1"/><path d="${ROAD}" class="r2"/></svg>
    ${chestHTML}${nodes}${pet}</div>`;
};

/* ---------- season pass card ---------- */
CS.seasonCard = () => {
  const s = S(), si = CS.seasonInfo(), xp = CS.seasonXP(si), c = claims(si), open = CS.passOpen(), beta = !(CS.isPro && CS.isPro()) && open;
  const nextI = CS.TIERS.findIndex(t => xp < t), tierNow = nextI < 0 ? CS.TIERS.length : nextI;
  const lo = tierNow ? CS.TIERS[tierNow-1] : 0, hi = nextI < 0 ? CS.TIERS[CS.TIERS.length-1] : CS.TIERS[nextI];
  const cell = (lane, r, i) => { const got = c[lane].includes(i), reach = xp >= CS.TIERS[i], lock = lane === "pass" && !open;
    const st = got ? "got" : lock ? "lock" : reach ? "ready" : "";
    return `<button class="sp-cell ${lane} ${st}" data-claim="${lane}:${i}" ${got || (!reach && !lock) ? "disabled" : ""} title="${lock?"Unlock with Pass Plan":reach?(got?"Claimed":"Claim"):`Reach ${CS.TIERS[i]} season XP`}">
      <span class="ri">${lock?"🔒":icon(r)}</span><span class="rl">${label(r)}</span>${st==="ready"?`<span class="claim">Claim</span>`:got?`<span class="ok">✓</span>`:""}</button>`; };
  return `<div class="panel qcard season-card">
    <div class="spread"><div class="stack" style="gap:0"><span class="eyebrow">Season ${si.num} · ${esc(si.theme.n)}</span><b>Season pass</b></div><span class="tag">${si.left} day${si.left===1?"":"s"} left</span></div>
    <div class="stack" style="gap:6px"><div class="spread small"><b>Tier ${tierNow} of ${CS.TIERS.length}</b><span class="muted">${xp.toLocaleString()} / ${hi.toLocaleString()} season XP</span></div>
      <div class="meter mint"><i style="width:${Math.min(100, (xp - lo) / Math.max(1, hi - lo) * 100)}%"></i></div></div>
    <div class="sp-grid"><span></span><span class="lane">Free</span><span class="lane pass">Pass${beta?` <em>free in beta</em>`:""}</span>
      ${CS.TIERS.map((t, i) => `<span class="sp-n ${xp >= t ? "on" : ""}">${i+1}</span>${cell("free", FREE[i], i)}${cell("pass", PASS[i], i)}`).join("")}</div>
    <div class="shop"><span class="small"><b>💎 ${(s.gems||0).toLocaleString()}</b> gems</span>
      <button class="btn ghost sm" data-shop="freeze" ${(s.gems||0) < 150 || (s.freezes||0) >= 3 ? "disabled" : ""}>❄️ Streak freeze · 150</button>
      <button class="btn ghost sm" data-shop="egg" ${(s.gems||0) < 250 ? "disabled" : ""}>🥚 Mystery egg · 250</button></div>
    <span class="tiny muted">Every 2 weeks a new season starts with a new map theme and fresh rewards. All XP from both courses counts.</span>
  </div>`;
};

/* ---------- weekly league ---------- */
CS.LEAGUES = [{n:"Bronze", c:"#B45309"}, {n:"Silver", c:"#64748B"}, {n:"Emerald", c:"#059669"}, {n:"Sapphire", c:"#2563EB"}, {n:"Diamond", c:"#7C3AED"}];
const weekStart = (key = CS.today()) => { const d = new Date(key+"T12:00:00"), off = (d.getDay() + 6) % 7; return CS.addDays(key, -off); };
CS.weekStart = weekStart;
CS.weekXPFor = ws => { let x = 0; for (let d = 0; d < 7; d++) x += S().days[CS.addDays(ws, d)] || 0; return x; };
const NAMES = ["Maya K.","Jordan P.","Sam R.","Ava L.","Leo M.","Priya S.","Noah T.","Zoe W.","Eli B.","Mia C.","Omar H.","Lily D.","Ethan G.","Nora F.","Kai J.","Ruby V.","Theo N.","Isla Q.","Diego A.","Hana Y."];
function bots(ws, tier, upto){
  const r = seeded("league"+ws+":"+tier), names = NAMES.slice(), out = [];
  const elapsed = Math.min(7, Math.max(0, (new Date(upto+"T12:00:00") - new Date(ws+"T00:00:00")) / CS.DAY));
  for (let i = 0; i < 9; i++) { const n = names.splice(Math.floor(r()*names.length), 1)[0], pace = (25 + r()*120) * (1 + tier*0.3);
    out.push({name:n, xp:Math.round(pace * elapsed * (0.85 + r()*0.3)), bot:true}); }
  return out;
}
function rankIn(list, me){ return list.slice().sort((a,b) => b.xp - a.xp).findIndex(x => x === me) + 1; }
/* practice league: move up (top 3) or down (bottom 2) each week, based on your own XP vs the practice field */
function practiceLeague(){
  const s = S(), ws = weekStart(); s.league = s.league || {tier:0, week:ws};
  if (s.league.week !== ws) {
    const last = s.league.week, me = {name:"You", xp:CS.weekXPFor(last)}, list = bots(last, s.league.tier, CS.addDays(last, 7)).concat([me]), rk = rankIn(list, me);
    if (me.xp > 0) { if (rk <= 3) s.league.tier = Math.min(4, s.league.tier + 1); else if (rk >= 9) s.league.tier = Math.max(0, s.league.tier - 1); s.league.last = {rank:rk, week:last}; }
    s.league.week = ws; CS.save();
  }
  const me = {name:"You", xp:CS.weekXPFor(ws), me:true}, list = bots(ws, s.league.tier, CS.today()).concat([me]).sort((a,b) => b.xp - a.xp);
  return {practice:true, tier:s.league.tier, members:list, promote:3, demote:2, endsAt:CS.addDays(ws, 7), last:s.league.last};
}
CS.leagueData = () => (CS.liveLeague && CS.liveLeague()) || practiceLeague();
const timeLeft = endKey => { const ms = new Date(endKey+"T00:00:00") - new Date(), d = Math.floor(ms / CS.DAY), h = Math.floor(ms % CS.DAY / 36e5); return d > 0 ? `${d}d ${h}h left` : `${h}h left`; };
CS.leagueCard = () => {
  if (window.CS_STORE && window.CS_STORE.guest && !CS.account) { const lg = CS.LEAGUES[0];
    return `<div class="panel qcard league-card locked" style="--lg:${lg.c}">
    <div class="spread"><div class="stack" style="gap:0"><span class="eyebrow" style="color:var(--lg)">Weekly league</span><b>Leagues are for members</b></div><span class="tag">${timeLeft(CS.addDays(weekStart(), 7))}</span></div>
    <ol class="lg">${["Maya K.","Jordan P.","You","Sam R.","Priya D."].map((n, i) => `<li class="${n==="You"?"me":""}"><span class="rk">${i+1}</span><span class="av">${n[0]}</span><span class="nm">${n}</span><span class="xp">??? XP</span></li>`).join("")}</ol>
    <span class="small">Compete with real students for the top 3 spots each week, move up from ${lg.n} to Diamond, and keep your streak, pets and XP safe on every device.</span>
    <button class="btn sm" data-account="signup">Sign up free to join this week's league</button>
  </div>`; }
  const L = CS.leagueData(), lg = CS.LEAGUES[L.tier] || CS.LEAGUES[0], n = L.members.length;
  const myRank = L.members.findIndex(m => m.me) + 1, ahead = myRank > 1 ? L.members[myRank-2] : null;
  const rows = L.members.slice(0, 15).map((m, i) => { const r = i + 1;
    const z = (r === L.promote && L.tier < 4 && n > L.promote) ? `<li class="zone up">▲ Top ${L.promote} move up to ${CS.LEAGUES[L.tier+1].n}</li>` : (r === n - L.demote && L.tier > 0 && n > 5) ? `<li class="zone dn">▼ Bottom ${L.demote} drop to ${CS.LEAGUES[L.tier-1].n}</li>` : "";
    return `<li class="${m.me?"me":""}"><span class="rk">${r}</span><span class="av" style="${m.me?"":`background:hsl(${(m.name.charCodeAt(0)*37)%360} 70% 88%);color:hsl(${(m.name.charCodeAt(0)*37)%360} 60% 30%)`}">${esc(m.name[0])}</span><span class="nm">${esc(m.name)}</span><span class="xp">${m.xp.toLocaleString()} XP</span></li>${z}`; }).join("");
  return `<div class="panel qcard league-card" style="--lg:${lg.c}">
    <div class="spread"><div class="stack" style="gap:0"><span class="eyebrow" style="color:var(--lg)">${L.practice?"Practice league":"Weekly league"}</span><b>${lg.n} League</b></div><span class="tag">${timeLeft(L.endsAt)}</span></div>
    ${ahead ? `<span class="small" style="color:var(--good);font-weight:700">${(ahead.xp - L.members[myRank-1].xp + 1).toLocaleString()} XP to pass ${esc(ahead.name)}</span>` : myRank === 1 ? `<span class="small" style="color:var(--good);font-weight:700">You're in first place this week.</span>` : ""}
    <ol class="lg ${n > 8 ? "cols" : ""}">${rows}</ol>
    ${L.practice ? `<div class="stack" style="gap:6px"><span class="tiny muted">Practice league: the other players are computer opponents. Sign in to compete with real students.</span><button class="btn sm" data-account="open">Sign in to join a real league</button></div>` : `<span class="tiny muted">Ranked by XP earned Monday to Sunday. Names show first name and last initial only.</span>`}
  </div>`;
};

/* ---------- the whole dashboard block ---------- */
CS.questBlock = () => {
  const s = S(), si = CS.seasonInfo(), st = CS.streak(), lv = CS.level();
  return `<section class="quest qt-${si.theme.k}" aria-label="Quest map">
    <div class="quest-head"><div class="stack" style="gap:2px"><span class="eyebrow qe">Season ${si.num} · ${esc(si.theme.n)}</span><h2>${esc(CS.C.name)} quest</h2></div>
      <div class="qstats"><span title="Day streak">🔥 ${st}</span><span title="Gems">💎 ${(s.gems||0).toLocaleString()}</span><span title="Level">⚡ Lv ${lv.lv}</span>${CS.seasonClaimable()?`<span class="qnew" title="Rewards ready">🎁 ${CS.seasonClaimable()}</span>`:""}</div></div>
    <div class="quest-grid"><div class="stack" style="gap:12px;min-width:0">${CS.questMap()}
      <div class="qlegend tiny muted"><span><i class="lg-done"></i>Mastered (70%+ or boss beaten)</span><span><i class="lg-cur"></i>Your next unit</span><span>Chests open when you master the unit before them</span></div></div>
      <div class="stack" style="gap:12px;min-width:0">${CS.seasonCard()}</div></div>
    ${CS.leagueCard()}
  </section>`;
};

/* ---------- clicks ---------- */
const rerender = () => { if (CS.go) CS.go("home", {keepScroll:true}); };
document.addEventListener("click", e => {
  const ch = e.target.closest("[data-chest]");
  if (ch && !ch.disabled) { const s = S(); s.chests = s.chests || {}; const i = +ch.dataset.chest; if (s.chests[i]) return;
    s.chests[i] = CS.today(); s.gems = (s.gems || 0) + 40; CS.save(); CS.toast(`Chest opened: +40 gems!`); rerender(); return; }
  const cl = e.target.closest("[data-claim]");
  if (cl) { const [lane, i] = cl.dataset.claim.split(":"), si = CS.seasonInfo(), c = claims(si), xp = CS.seasonXP(si);
    if (lane === "pass" && !CS.passOpen()) { if (CS.openUpgrade) CS.openUpgrade("season"); return; }
    if (cl.disabled || xp < CS.TIERS[+i] || c[lane].includes(+i)) return;
    const r = (lane === "free" ? FREE : PASS)[+i]; c[lane].push(+i); grant(r); CS.toast(`Season reward: ${label(r)}!`); rerender(); return; }
  const sh = e.target.closest("[data-shop]");
  if (sh && !sh.disabled) { const s = S();
    if (sh.dataset.shop === "freeze" && (s.gems||0) >= 150 && (s.freezes||0) < 3) { s.gems -= 150; s.freezes = (s.freezes||0) + 1; CS.save(); CS.toast("Bought a streak freeze."); }
    if (sh.dataset.shop === "egg" && (s.gems||0) >= 250) { s.gems -= 250; CS.giveEgg(); CS.toast("Bought a mystery egg. It's in your nest."); }
    rerender(); }
});
})();
