/* Credit Sprint friends: find students by username, send and accept requests, compete on a weekly friends
   leaderboard, and send pets (or gifts) straight to a friend through the market. Server: functions/api/friends.js */
(function(){
"use strict";
const CS = window.CS, $ = CS.$, $$ = CS.$$, esc = CS.esc, I = CS.icon;
CS.friends = null;   // {me, friends:[{username,name,xp,me}], incoming, outgoing}
async function api(path, body){
  const r = await fetch("/api/" + path, {method: body ? "POST" : "GET", credentials:"same-origin", headers: body ? {"content-type":"application/json"} : {}, body: body ? JSON.stringify(body) : undefined});
  let j = {}; try { j = await r.json(); } catch(e) {}
  if (!r.ok) { const e = new Error(j.error || "Something went wrong. Try again."); e.status = r.status; throw e; } return j;
}
CS.loadFriends = async () => { if (!CS.account || !CS.account.username) return null;
  try { CS.friends = await api("friends"); } catch(e) { return null; }
  if (CS.renderAccountChip) CS.renderAccountChip();
  return CS.friends; };
CS.friendNames = () => ((CS.friends && CS.friends.friends) || []).filter(f => !f.me).map(f => f.username);
const reqCount = () => (CS.friends && CS.friends.incoming.length) || 0;
CS.friendReqCount = reqCount;

/* ---------- friends window: Friends · Requests · Find ---------- */
CS.openFriends = async (tab = "friends") => {
  if (!CS.account) { if (CS.openAccount) CS.openAccount({signup:true}); return; }
  if (!CS.account.username) return CS.askUsername();
  const w = document.createElement("div"); w.className = "modal-wrap"; w.innerHTML = `<div class="modal fr-modal" role="dialog" aria-modal="true" aria-label="Friends"></div>`;
  document.body.appendChild(w); w.addEventListener("click", e => { if (e.target === w) w.remove(); });
  const m = $(".modal", w); let q = "", results = null, msg = "", t = null;
  m.innerHTML = `<p class="muted">Loading friends…</p>`;
  await CS.loadFriends(); draw();
  function row(f, actions){ return `<div class="fr-row"><span class="fr-av" style="background:hsl(${(f.name.charCodeAt(0)*37)%360} 70% 88%);color:hsl(${(f.name.charCodeAt(0)*37)%360} 60% 30%)">${esc(f.name[0]||"?")}</span>
    <span class="stack" style="gap:0;flex:1;min-width:0"><b class="small">${esc(f.name)}</b><span class="tiny muted">@${esc(f.username)}</span></span>${actions}</div>`; }
  function draw(){
    const F = CS.friends || {friends:[], incoming:[], outgoing:[]}, list = F.friends || [], others = list.filter(f => !f.me);
    m.innerHTML = `<div class="spread"><div><span class="eyebrow">@${esc(CS.account.username)}</span><h2>Friends</h2></div><button class="btn ghost sm" data-x>Close</button></div>
      <div class="seg" role="tablist" style="max-width:420px">${[["friends",`Friends · ${others.length}`],["requests",`Requests${reqCount()?` · ${reqCount()}`:""}`],["find","Find friends"]].map(([k,n])=>`<button data-ft="${k}" aria-pressed="${tab===k}">${n}${k==="requests"&&reqCount()?`<span class="dot"></span>`:""}</button>`).join("")}</div>
      <div id="fr-body" class="stack" style="gap:10px"></div><p class="small" id="fr-msg">${esc(msg)}</p>`;
    $$("[data-x]", m).forEach(b => b.onclick = () => w.remove());
    $$("[data-ft]", m).forEach(b => b.onclick = () => { tab = b.dataset.ft; msg = ""; draw(); });
    const body = $("#fr-body", m);
    if (tab === "friends") {
      body.innerHTML = others.length ? `<span class="eyebrow">This week vs. your friends</span><ol class="fr-board">${list.map((f,i)=>`<li class="${f.me?"me":""}"><span class="rk">${i+1}</span>${row(f, `<b class="small">${f.xp.toLocaleString()} XP</b>${f.me ? "" : `<button class="btn ghost sm" data-send="${esc(f.username)}" title="Send a pet">${I("paw")}</button><button class="btn ghost sm" data-rm="${esc(f.username)}" title="Remove friend">✕</button>`}`)}</li>`).join("")}</ol>
        <span class="tiny muted">XP earned Monday–Sunday, same as leagues. Tap ${I("paw")} to send a friend a pet: name a price or make it a free gift.</span>`
        : `<div class="panel stack" style="gap:8px"><b>No friends yet</b><span class="muted small">Find classmates by username and compete on a weekly friends leaderboard. Your username is <b>@${esc(CS.account.username)}</b>. Share it so friends can add you.</span><div><button class="btn sm" data-ft2="find">Find friends</button></div></div>`;
    } else if (tab === "requests") {
      body.innerHTML = `<span class="eyebrow">Friend requests</span>${F.incoming.length ? F.incoming.map(f => row(f, `<button class="btn sm" data-acc="${esc(f.username)}">Accept</button><button class="btn ghost sm" data-dec="${esc(f.username)}">Decline</button>`)).join("") : `<p class="muted small">No new requests.</p>`}
        ${F.outgoing.length ? `<span class="eyebrow" style="margin-top:8px">Sent</span>${F.outgoing.map(f => row(f, `<span class="tiny muted">Pending</span><button class="btn ghost sm" data-can="${esc(f.username)}">Cancel</button>`)).join("")}` : ""}`;
    } else {
      body.innerHTML = `<label class="eyebrow" for="fr-q">Search by username</label><input id="fr-q" class="acct-in" placeholder="@username" value="${esc(q)}" autocomplete="off">
        <div id="fr-res" class="stack" style="gap:6px">${results == null ? `<span class="tiny muted">Type at least 2 letters.</span>` : results.length ? results.map(f => row(f,
          f.status === "friends" ? `<span class="tag good">Friends</span>` : f.status === "sent" ? `<span class="tiny muted">Request sent</span>` : f.status === "incoming" ? `<button class="btn sm" data-acc="${esc(f.username)}">Accept</button>` : `<button class="btn sm" data-add="${esc(f.username)}">Add friend</button>`)).join("") : `<span class="small muted">No students found.</span>`}</div>`;
      const inp = $("#fr-q", m); inp.focus(); inp.setSelectionRange(q.length, q.length);
      inp.oninput = () => { q = inp.value; clearTimeout(t); t = setTimeout(search, 250); };
    }
    $$("[data-ft2]", m).forEach(b => b.onclick = () => { tab = b.dataset.ft2; draw(); });
    const doAct = (action, username, ok) => async () => { try { CS.friends = await api("friends", {action, username}); msg = ok; if (results) await search(true); } catch(e) { msg = e.message; } if (CS.renderAccountChip) CS.renderAccountChip(); if (CS.view && CS.view() === "home") CS.go("home", {keepScroll:true}); draw(); };
    $$("[data-add]", m).forEach(b => b.onclick = doAct("request", b.dataset.add, `Friend request sent to @${b.dataset.add}.`));
    $$("[data-acc]", m).forEach(b => b.onclick = doAct("accept", b.dataset.acc, `You and @${b.dataset.acc} are now friends!`));
    $$("[data-dec]", m).forEach(b => b.onclick = doAct("decline", b.dataset.dec, "Request declined."));
    $$("[data-can]", m).forEach(b => b.onclick = doAct("cancel", b.dataset.can, "Request canceled."));
    $$("[data-rm]", m).forEach(b => b.onclick = () => { if (window.confirm(`Remove @${b.dataset.rm} from your friends?`)) doAct("remove", b.dataset.rm, "Friend removed.")(); });
    $$("[data-send]", m).forEach(b => b.onclick = () => { w.remove(); CS.marketTarget = b.dataset.send; CS.go("pets"); CS.render.pets({tab:"market"}); if (CS.loadMarket) CS.loadMarket(); });
  }
  async function search(keep){ const s = q.trim().replace(/^@/, "").toLowerCase(); if (s.length < 2) { results = null; return keep || draw(); }
    try { results = (await api("friends?q=" + encodeURIComponent(s))).results; } catch(e) { results = []; msg = e.message; } if (!keep) draw(); }
};

/* ---------- username: required for every account (friends find you by it) ---------- */
CS.askUsername = () => {
  if ($(".un-modal")) return;
  const w = document.createElement("div"); w.className = "modal-wrap"; w.innerHTML = `<div class="modal un-modal" role="dialog" aria-modal="true" aria-label="Choose a username">
    <span class="eyebrow">One more step</span><h2>Choose your username</h2>
    <p class="muted small">Friends find and add you by your username. It's public, so don't use your full name, email or school. You can't change it later.</p>
    <label class="eyebrow" for="un-in">Username</label><input id="un-in" class="acct-in" placeholder="e.g. econ_ace" maxlength="20" autocomplete="off">
    <span class="tiny muted">3–20 letters, numbers or underscores.</span><div class="row-wrap"><button class="btn" id="un-go">Save username</button></div><p class="small" id="un-msg"></p></div>`;
  document.body.appendChild(w);
  const inp = $("#un-in", w); inp.focus();
  inp.oninput = () => { inp.value = inp.value.toLowerCase().replace(/[^a-z0-9_]/g, ""); };
  const go = async () => { const msg = $("#un-msg", w); msg.textContent = "Saving…";
    try { const r = await fetch("/api/me", {method:"POST", credentials:"same-origin", headers:{"content-type":"application/json"}, body:JSON.stringify({username: inp.value})});
      const j = await r.json(); if (!r.ok) throw new Error(j.error || "Couldn't save that username.");
      CS.account = j.user; if (CS.renderAccountChip) CS.renderAccountChip(); w.remove(); CS.toast(`You're @${j.user.username}. Friends can find you now.`); CS.loadFriends(); }
    catch(e) { msg.textContent = e.message; } };
  $("#un-go", w).onclick = go; inp.onkeydown = e => { if (e.key === "Enter") go(); };
};

/* ---------- dashboard: friends leaderboard next to the league ---------- */
const baseLeague = CS.leagueCard;
CS.leagueCard = () => {
  const out = baseLeague(), F = CS.friends;
  if (!CS.account || !F) return out;
  const list = F.friends || [], others = list.filter(f => !f.me);
  if (!others.length) return out + `<div class="panel qcard fr-card"><span class="eyebrow">Friends</span><b>Race your friends</b><span class="small muted">Add classmates by username and see who studies most each week.</span><button class="btn sm" data-friends="find">Find friends</button></div>`;
  const myRank = list.findIndex(f => f.me) + 1, ahead = myRank > 1 ? list[myRank - 2] : null;
  return out + `<div class="panel qcard fr-card"><div class="spread"><span class="eyebrow">Friends this week</span><button class="linklike" data-friends="friends">See all</button></div>
    ${ahead ? `<span class="small" style="color:var(--good);font-weight:700">${(ahead.xp - list[myRank-1].xp + 1).toLocaleString()} XP to pass ${esc(ahead.name)}</span>` : `<span class="small" style="color:var(--good);font-weight:700">You're leading your friends!</span>`}
    <ol class="lg">${list.slice(0, 6).map((f,i)=>`<li class="${f.me?"me":""}"><span class="rk">${i+1}</span><span class="av">${esc(f.name[0]||"?")}</span><span class="nm">${esc(f.me?"You":f.name)}</span><span class="xp">${f.xp.toLocaleString()} XP</span></li>`).join("")}</ol></div>`;
};
document.addEventListener("click", e => { const b = e.target.closest("[data-friends]"); if (b) { e.preventDefault(); CS.openFriends(b.dataset.friends || "friends"); } });

/* after sign-in: require a username, then load friends (and mention new requests once per visit) */
const prevAfter = CS.afterAccount;
CS.afterAccount = () => { if (prevAfter) prevAfter();
  if (!CS.account) return;
  if (!CS.account.username) { setTimeout(CS.askUsername, 600); return; }
  CS.loadFriends().then(F => { if (!F) return; if (CS.view && CS.view() === "home") CS.go("home", {keepScroll:true});
    let told = false; try { told = sessionStorage.getItem("cs.frTold") === "1"; } catch(e) {}
    if (F.incoming.length && !told) { try { sessionStorage.setItem("cs.frTold", "1"); } catch(e) {} CS.toast(`You have ${F.incoming.length} friend request${F.incoming.length>1?"s":""}. Open Account → Friends.`); } });
};
})();
