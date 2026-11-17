/* Credit Sprint: Ohio State track.
   1. The "AP & CLEP | Ohio State" tab in the header (on every course).
   2. For Ohio State courses only: a professional skin (career ladder instead of pets, a sprint milestone tracker instead of
      the cartoon season pass, a unit roadmap instead of the quest map) and free access while the track is in launch. */
(function(){
"use strict";
const CS = window.CS, $ = CS.$, $$ = CS.$$, esc = CS.esc, I = CS.icon;
const S = () => CS.S();
const COURSES = window.CS_COURSES, trackOf = window.CS_TRACK_OF;
const OSU = !!(CS.C && CS.C.osu);

/* courses shown in pickers: only the active track */
CS.trackCourses = () => Object.values(COURSES).filter(c => trackOf(c) === trackOf(CS.C));

/* ---------- the header tab ---------- */
(function tabs(){
  const host = document.getElementById("track-tabs"); if (!host) return;
  const cur = trackOf(CS.C);
  host.innerHTML = window.CS_TRACKS.map(t => `<button type="button" data-track="${t.k}" aria-pressed="${t.k === cur}">${esc(t.n)}</button>`).join("");
  host.addEventListener("click", e => {
    const b = e.target.closest("[data-track]"); if (!b || b.dataset.track === cur) return;
    let k = null; try { k = localStorage.getItem("creditsprint.track." + b.dataset.track); } catch(err) {}
    if (!k || !COURSES[k] || trackOf(COURSES[k]) !== b.dataset.track) k = b.dataset.track === "osu" ? "osu2002" : "macro";
    try { localStorage.setItem("creditsprint.course", k); } catch(err) {}
    location.href = "app.html?course=" + k + "#home";
  });
})();

if (!OSU) return;

document.documentElement.classList.add("osu");
document.title = "Credit Sprint for Ohio State · ECON 2002.01 Study Hub";

/* ---------- free while the Ohio State track is in launch ---------- */
const hasAccess = CS.hasAccess;
CS.hasAccess = (k) => (k === undefined || (COURSES[k] && COURSES[k].osu)) ? true : hasAccess(k);
CS.isPro = () => true;
CS.upgradeSide = () => "";

/* ---------- no pets: switch off egg drops, hatching and pet XP boosts ---------- */
CS.giveEgg = CS.giveInstantEgg = () => {};
CS.petFlush = () => {};
CS.petReact = () => {};
CS.petBoost = () => 0;

/* ---------- career ladder ---------- */
const RANKS = [
  {n:"Intern",             lv:1,  d:"Welcome to the desk. Answer your first questions."},
  {n:"Analyst",            lv:3,  d:"You are building a base of macro fundamentals."},
  {n:"Senior Analyst",     lv:6,  d:"You can read the business cycle and the data behind it."},
  {n:"Associate",          lv:10, d:"You can explain how policy moves output and prices."},
  {n:"Senior Associate",   lv:15, d:"You handle the models and the math without notes."},
  {n:"Vice President",     lv:21, d:"You connect monetary, fiscal and global effects."},
  {n:"Director",           lv:28, d:"Exam-ready across every unit."},
  {n:"Managing Director",  lv:36, d:"You could teach this section."},
  {n:"Partner",            lv:45, d:"Top of the firm."}
];
CS.osuRank = () => { const lv = CS.level().lv; let i = 0; RANKS.forEach((r, j) => { if (lv >= r.lv) i = j; }); return {i, cur:RANKS[i], next:RANKS[i + 1] || null}; };

const unitRows = () => CS.UNITS.map(u => { const m = CS.mastery(u.id), pct = m == null ? 0 : Math.round(m * 100);
  const st = S().bosses && S().bosses[u.id] ? "Checkpoint passed" : m == null ? "Not started" : m >= 0.7 ? "Mastered" : m >= 0.4 ? "In progress" : "Needs work";
  return {u, pct, st, started:m != null}; });

CS.render.pets = () => {
  const v = $("#v-pets"), lv = CS.level(), rk = CS.osuRank(), rows = unitRows(), earned = (CS.BADGES || []).filter(b => { try { return b.t(); } catch(e) { return false; } });
  const toNext = rk.next ? Math.max(0, rk.next.lv - lv.lv) : 0;
  v.innerHTML = `<div class="page-head"><div class="stack" style="gap:6px"><span class="eyebrow">Career</span><h1>Your career path</h1><p class="muted">Study to earn promotions. Your rank rises with your level, and your level comes from the XP you earn in every course.</p></div></div>
    <div class="panel osu-rank"><div class="spread"><div class="stack" style="gap:2px"><span class="eyebrow">Current rank</span><h2 style="margin:0">${esc(rk.cur.n)}</h2><span class="muted small">${esc(rk.cur.d)}</span></div><span class="osu-lv">Level ${lv.lv}</span></div>
      ${rk.next ? `<div class="stack" style="gap:6px"><div class="spread small"><b>Next: ${esc(rk.next.n)}</b><span class="muted">${toNext} level${toNext === 1 ? "" : "s"} to go</span></div><div class="meter mint"><i style="width:${Math.round(100 * (lv.lv - rk.cur.lv) / Math.max(1, rk.next.lv - rk.cur.lv))}%"></i></div></div>` : `<span class="small" style="color:var(--good);font-weight:700">You have reached the top rank.</span>`}
    </div>
    <div class="panel"><h3>Promotion ladder</h3><ol class="osu-ladder">${RANKS.map((r, i) => `<li class="${i < rk.i ? "done" : i === rk.i ? "cur" : ""}"><span class="dot">${i < rk.i ? I("check") : i + 1}</span><span class="stack" style="gap:0"><b>${esc(r.n)}</b><span class="tiny muted">Level ${r.lv}${i === rk.i ? " · you are here" : ""}</span></span></li>`).join("")}</ol></div>
    <div class="panel"><h3>Portfolio: your units</h3><div class="osu-table" role="table" aria-label="Unit mastery">${rows.map(r => `<div class="osu-row" role="row"><span class="un">Unit ${r.u.id}</span><span class="nm">${esc(r.u.name)}</span><span class="bar"><i style="width:${r.pct}%"></i></span><span class="pc">${r.started ? r.pct + "%" : "–"}</span><span class="tag ${r.st === "Mastered" || r.st === "Checkpoint passed" ? "good" : ""}">${r.st}</span></div>`).join("")}</div></div>
    <div class="panel"><h3>Achievements</h3>${earned.length ? `<div class="osu-ach">${earned.map(b => `<div><span class="ai">${I(b.ic || "star")}</span><span class="stack" style="gap:0"><b>${esc(b.n)}</b><span class="tiny muted">${esc(b.d)}</span></span></div>`).join("")}</div>` : `<p class="muted small" style="margin:0">Earn achievements by answering questions, keeping a streak and mastering units.</p>`}</div>`;
};
CS.render.store = () => { CS.go("home"); };

/* ---------- unit roadmap (replaces the quest map) ---------- */
function unitState(){
  const s = S(), done = CS.UNITS.map(u => { const m = CS.mastery(u.id); return (m != null && m >= 0.7) || !!(s.bosses && s.bosses[u.id]); });
  let cur = done.indexOf(false); if (cur < 0) cur = CS.UNITS.length - 1; return {done, cur};
}
CS.questMap = () => { const {done, cur} = unitState();
  return `<div class="osu-road" role="group" aria-label="Unit roadmap"><ol>${CS.UNITS.map((u, i) => { const m = CS.mastery(u.id), pct = m == null ? 0 : Math.round(m * 100), st = done[i] ? "done" : i === cur ? "cur" : "next";
    return `<li class="${st}"><button data-go="practice" data-mode="unit" data-unit="${u.id}" aria-label="Unit ${u.id}: ${esc(u.name)}${done[i] ? ", mastered" : ""}"><span class="n">${done[i] ? I("check") : u.id}</span><span class="stack" style="gap:2px;flex:1;min-width:0"><b>${esc(u.name)}</b><span class="tiny muted">${m == null ? "Not started" : pct + "% mastery"}</span><span class="rb"><i style="width:${pct}%"></i></span></span>${i === cur ? `<span class="go">${done[i] ? "Review" : "Start"}</span>` : ""}</button></li>`; }).join("")}</ol></div>`; };

/* ---------- sprint milestones (replaces the cartoon season pass) ---------- */
const NT = 20, SPRINT_XP = i => 60 + 35 * i;           // XP needed for milestone i (cumulative below)
const CUM = (() => { let t = 0; return Array.from({length:NT}, (_, i) => (t += SPRINT_XP(i))); })();
const REWARD = i => { const n = i + 1;
  if (n === NT) return {k:"cert", t:"Sprint distinction", d:"You finished every milestone this sprint."};
  if (n % 5 === 0) return {k:"xp", v:100, t:"+100 bonus XP", d:"Milestone bonus."};
  if (n % 7 === 0) return {k:"freeze", t:"Streak freeze", d:"Protects your streak for one missed day."};
  return {k:"xp", v:25, t:"+25 bonus XP", d:"Milestone bonus."}; };
const claimed = si => { const s = S(); s.osuSprint = s.osuSprint || {}; return s.osuSprint[si.id] || (s.osuSprint[si.id] = []); };
CS.osuClaimable = () => { const si = CS.seasonInfo(), xp = CS.seasonXP(si), c = claimed(si); return CUM.reduce((n, t, i) => n + (xp >= t && !c.includes(i) ? 1 : 0), 0); };
CS.seasonClaimable = CS.osuClaimable;
CS.seasonCard = () => {
  const si = CS.seasonInfo(), xp = CS.seasonXP(si), c = claimed(si), nextI = CUM.findIndex(t => xp < t), done = nextI < 0 ? NT : nextI;
  const lo = done ? CUM[done - 1] : 0, hi = nextI < 0 ? CUM[NT - 1] : CUM[nextI], n = CS.osuClaimable(), pct = Math.min(100, (xp - lo) / Math.max(1, hi - lo) * 100);
  const elapsed = Math.max(1, 15 - si.left), perDay = xp / elapsed, proj = Math.min(NT, CUM.filter(t => perDay * 14 >= t).length);
  return `<div class="panel qcard osu-sprint">
    <div class="spread"><div class="stack" style="gap:0"><span class="eyebrow">Study sprint ${si.num} · two weeks</span><b>Sprint milestones</b></div><span class="tag">${si.left} day${si.left === 1 ? "" : "s"} left</span></div>
    <div class="stack" style="gap:6px"><div class="spread small"><b>${done} of ${NT} milestones</b><span class="muted">${xp.toLocaleString()} / ${hi.toLocaleString()} sprint XP</span></div><div class="meter mint"><i style="width:${pct}%"></i></div></div>
    ${xp > 0 && elapsed >= 2 ? `<span class="tiny muted">At your pace (about ${Math.round(perDay)} XP a day) you will reach milestone ${proj} by the end of the sprint.</span>` : ""}
    ${n ? `<div class="spread"><span class="small">${n} reward${n === 1 ? "" : "s"} ready</span><button class="btn sm" data-osu-claimall>Claim all</button></div>` : ""}
    <ol class="osu-ms">${CUM.map((t, i) => { const r = REWARD(i), got = c.includes(i), reach = xp >= t;
      return `<li class="${got ? "got" : reach ? "ready" : ""}"><span class="mn">${i + 1}</span><span class="stack" style="gap:0;flex:1;min-width:0"><b>${esc(r.t)}</b><span class="tiny muted">${t.toLocaleString()} XP · ${esc(r.d)}</span></span>${got ? `<span class="tag good">Claimed</span>` : reach ? `<button class="btn sm" data-osu-claim="${i}">Claim</button>` : `<span class="tiny faint">${(t - xp).toLocaleString()} XP to go</span>`}</li>`; }).join("")}</ol>
    <span class="tiny muted">A new sprint starts every two weeks. XP from every course counts.</span>
  </div>`; };
function grant(i){ const r = REWARD(i), s = S();
  if (r.k === "xp") CS.addXP(r.v); else if (r.k === "freeze") s.freezes = Math.min(3, (s.freezes || 0) + 1);
  CS.save(); }
document.addEventListener("click", e => {
  const one = e.target.closest("[data-osu-claim]"), all = e.target.closest("[data-osu-claimall]"); if (!one && !all) return;
  const si = CS.seasonInfo(), xp = CS.seasonXP(si), c = claimed(si); let n = 0;
  CUM.forEach((t, i) => { if (xp < t || c.includes(i) || (one && +one.dataset.osuClaim !== i)) return; c.push(i); grant(i); n++; });
  if (n) CS.toast(n === 1 ? "Milestone reward claimed." : `${n} milestone rewards claimed.`);
  CS.save(); if (CS.go) CS.go("home", {keepScroll:true}); });

/* ---------- dashboard block ---------- */
CS.questBlock = () => { const si = CS.seasonInfo(), st = CS.streak(), rk = CS.osuRank(), n = CS.osuClaimable();
  return `<section class="quest osu-quest" aria-label="Study roadmap">
    <div class="quest-head"><div class="stack" style="gap:2px"><span class="eyebrow qe">Sprint ${si.num} · Fisher College of Business</span><h2>${esc(CS.C.name)} roadmap</h2></div>
      <div class="qstats"><span title="Day streak">${I("flame")} ${st}</span><span title="Rank">${I("star")} ${esc(rk.cur.n)}</span>${n ? `<span class="qnew" title="Rewards ready">${n} reward${n === 1 ? "" : "s"} ready</span>` : ""}</div></div>
    <div class="quest-grid"><div class="stack" style="gap:12px;min-width:0">${CS.questMap()}<div class="qlegend tiny muted"><span>A unit counts as mastered at 70% or after you pass its checkpoint.</span></div></div>
      <div class="stack" style="gap:12px;min-width:0">${CS.seasonCard()}</div></div>
    ${CS.leagueCard()}
  </section>`; };

/* ---------- Ohio State course exam grade (letter grade estimate) ---------- */
const predict = CS.predict;
CS.predict = () => { const r = predict(); if (!r || !r.ready) return r;
  const p = r.p, g = p >= 0.93 ? "A" : p >= 0.9 ? "A-" : p >= 0.87 ? "B+" : p >= 0.83 ? "B" : p >= 0.8 ? "B-" : p >= 0.77 ? "C+" : p >= 0.73 ? "C" : p >= 0.7 ? "C-" : p >= 0.6 ? "D" : "E";
  return {ready:true, p, label:g, sub:"Estimated exam grade", pass:p >= 0.7}; };
})();
