/* Credit Sprint Store: spend gems on eggs, themes and streak freezes; sell spare eggs back for gems.
   Prices are tuned to gem income: a full season pass pays ~CS.PASS_GEMS() gems, chests add 40 each. */
(function(){
"use strict";
const CS = window.CS, $ = CS.$, $$ = CS.$$, esc = CS.esc, I = CS.icon;
const S = () => CS.S();

CS.STORE_EGGS = [
  {k:"common",   n:"Mystery egg",    minR:"",         buy:200, sell:80,  d:"Any pet, from Common up to Supreme."},
  {k:"uncommon", n:"Uncommon+ egg",  minR:"uncommon", buy:400, sell:160, d:"Guaranteed Uncommon or better."},
  {k:"rare",     n:"Rare+ egg",      minR:"rare",     buy:800, sell:320, d:"Guaranteed Rare or better. Epic to Supreme still possible."}
];
const FREEZE = 150;

/* gem themes: [key, name, price, accent, accent2, soft, hero1, hero2, dark accent, dark accent2, dark soft] */
CS.GEM_THEMES = [
  ["mint","Mint",800,"#0F766E","#115E59","#CCFBF1","#14B8A6","#0F766E","#2DD4BF","#5EEAD4","#0B2E2A"],
  ["lavender","Lavender",800,"#7E57C2","#5E35B1","#EDE7F6","#9575CD","#5E35B1","#B39DDB","#D1C4E9","#26193D"],
  ["crimson","Crimson",800,"#B91C1C","#991B1B","#FEE2E2","#DC2626","#7F1D1D","#F87171","#FCA5A5","#3A1414"],
  ["slate","Slate",1000,"#475569","#334155","#E2E8F0","#64748B","#1E293B","#94A3B8","#CBD5E1","#1E2733"],
  ["midnight","Midnight",1200,"#1E40AF","#1E3A8A","#DBEAFE","#1D4ED8","#0B1B4D","#60A5FA","#93C5FD","#0B1B3A"],
  ["peach","Peach",1500,"#E5654E","#BF4B36","#FFE4DE","#FB8C6B","#D9482F","#FF9A85","#FFB8A8","#3A1A14"],
  ["aurora","Aurora",2000,"#0E9AA7","#6D28D9","#E0F7F5","#10B981","#7C3AED","#34D8C8","#A78BFA","#0C2A2E"],
  ["lava","Lava",2500,"#DC2626","#B91C1C","#FFEDD5","#F97316","#DC2626","#FB7144","#FDBA74","#3A1810"],
  ["galaxy","Galaxy",3000,"#6D28D9","#4C1D95","#EDE9FE","#7C3AED","#0F172A","#A78BFA","#C4B5FD","#1E1538"],
  ["obsidian","Obsidian",4000,"#1F2937","#111827","#E5E7EB","#1F2937","#B8860B","#FBBF24","#FDE68A","#2A2410"]
].map(([k,n,price,c,c2,soft,h1,h2,dc,dc2,dsoft]) => ({k,n,price,c,c2,soft,h1,h2,dc,dc2,dsoft}));

/* inject the CSS for every gem theme (light, system dark, forced dark) */
(function(){
  const L = t => `--accent:${t.c};--accent-2:${t.c2};--accent-soft:${t.soft};--hero1:${t.h1};--hero2:${t.h2}`;
  const D = t => `--accent:${t.dc};--accent-2:${t.dc2};--accent-soft:${t.dsoft}`;
  const css = CS.GEM_THEMES.map(t => `:root[data-accent="${t.k}"]{${L(t)}}`).join("\n")
    + `\n@media (prefers-color-scheme:dark){${CS.GEM_THEMES.map(t => `:root[data-accent="${t.k}"]:not([data-theme="light"]){${D(t)}}`).join("")}}\n`
    + CS.GEM_THEMES.map(t => `:root[data-accent="${t.k}"][data-theme="dark"]{${D(t)}}`).join("\n");
  const el = document.createElement("style"); el.id = "gem-themes"; el.textContent = css; document.head.appendChild(el);
})();
CS.applyTheme();

const gems = () => S().gems || 0;
const owned = k => (S().themes || []).includes(k);
const tierOf = e => e.minR || "common";
const sellOf = e => (CS.STORE_EGGS.find(x => x.k === tierOf(e)) || CS.STORE_EGGS[0]).sell;
const nameOf = e => (CS.STORE_EGGS.find(x => x.k === tierOf(e)) || CS.STORE_EGGS[0]).n;

CS.render.store = () => {
  const s = S(), P = s.pets, eggs = (P && P.eggs) || [], g = gems(), pg = CS.PASS_GEMS ? CS.PASS_GEMS() : [0, 0];
  const eggCards = CS.STORE_EGGS.map(e => `<div class="panel st-card">
      <div class="st-art">${CS.eggSVG("mystery", 0, 1, 64)}${e.minR ? `<span class="st-badge" style="background:${CS.RARITY[e.minR].col}">${CS.RARITY[e.minR].n}+</span>` : ""}</div>
      <div class="stack" style="gap:2px;flex:1"><b>${e.n}</b><span class="small muted">${e.d}</span></div>
      <button class="btn ${g >= e.buy ? "" : "ghost"}" data-buyegg="${e.k}" ${g >= e.buy ? "" : "disabled"}>💎 ${e.buy.toLocaleString()}</button></div>`).join("");
  const nest = eggs.length ? eggs.map((e, i) => `<div class="st-row"><span class="st-mini">${CS.eggSVG("mystery", e.prog, e.need, 38)}</span>
      <div class="stack" style="gap:0;flex:1;min-width:0"><b class="small">${nameOf(e)}</b><span class="tiny muted">${e.prog}/${e.need} correct answers${i === 0 ? " · hatching now" : ""}</span></div>
      <button class="btn ghost sm" data-sellegg="${esc(e.id)}">Sell · 💎 ${sellOf(e)}</button></div>`).join("")
    : `<p class="small muted" style="margin:0">Your nest is empty. Eggs you earn from questions or the season pass show up here, and you can sell the spares.</p>`;
  const themeCards = CS.GEM_THEMES.map(t => { const has = owned(t.k), on = s.accent === t.k && has;
    return `<div class="panel st-theme ${on ? "on" : ""}">
      <div class="st-sw" style="background:linear-gradient(135deg,${t.h1},${t.h2})"><span style="background:${t.c}"></span><span style="background:${t.c2}"></span><span style="background:${t.soft}"></span></div>
      <div class="spread"><b>${t.n}</b>${has ? `<span class="tag good">Owned</span>` : ""}</div>
      ${has ? `<button class="btn ${on ? "ghost" : ""} sm" data-equip="${t.k}" ${on ? "disabled" : ""}>${on ? "Equipped" : "Equip"}</button>`
        : `<button class="btn ${g >= t.price ? "" : "ghost"} sm" data-buytheme="${t.k}" ${g >= t.price ? "" : "disabled"}>💎 ${t.price.toLocaleString()}</button>`}</div>`; }).join("");
  $("#v-store").innerHTML = `<div class="stack" style="gap:18px">
    <div class="panel st-head"><div class="stack" style="gap:2px"><span class="eyebrow">Store</span><h1 style="margin:0">Spend your gems</h1>
      <span class="small muted">Earn gems from the season pass (up to ${(pg[0] + pg[1]).toLocaleString()} per season) and quest chests (40 each).</span></div>
      <div class="st-bal"><b>💎 ${g.toLocaleString()}</b><span class="tiny muted">your gems</span></div></div>
    <section class="stack" style="gap:10px"><h3 class="st-h">Eggs</h3><div class="st-grid">${eggCards}</div>
      <span class="tiny muted">Store eggs hatch the moment you buy them.</span></section>
    <section class="stack" style="gap:10px"><h3 class="st-h">Sell eggs</h3><div class="panel stack" style="gap:8px">${nest}</div>
      <span class="tiny muted">Sell-back is 40% of the buy price: Mystery 80, Uncommon+ 160, Rare+ 320 gems.</span></section>
    <section class="stack" style="gap:10px"><h3 class="st-h">Boosts</h3><div class="panel st-row"><span class="st-mini" style="font-size:1.6rem">❄️</span>
      <div class="stack" style="gap:0;flex:1"><b>Streak freeze</b><span class="small muted">Protects your streak for a missed day. You have ${s.freezes || 0} of 3.</span></div>
      <button class="btn ${g >= FREEZE && (s.freezes || 0) < 3 ? "" : "ghost"}" data-buyfreeze ${g >= FREEZE && (s.freezes || 0) < 3 ? "" : "disabled"}>💎 ${FREEZE}</button></div></section>
    <section class="stack" style="gap:10px"><h3 class="st-h">Themes</h3><div class="st-themes">${themeCards}</div>
      <span class="tiny muted">The six level-unlocked colors stay free in Settings. Gem themes work in light and dark mode.</span></section></div>`;
};

document.addEventListener("click", e => {
  const v = $("#v-store"); if (!v || v.hidden || !v.contains(e.target)) return;
  const s = S(), again = () => { CS.save(); CS.chrome(); CS.render.store(); };
  let b = e.target.closest("[data-buyegg]");
  if (b && !b.disabled) { const x = CS.STORE_EGGS.find(z => z.k === b.dataset.buyegg); if (x && gems() >= x.buy) { s.gems -= x.buy; CS.giveInstantEgg(x.minR || undefined); CS.toast(`Bought a ${x.n}. Hatching now!`); again(); } return; }
  b = e.target.closest("[data-sellegg]");
  if (b) { const P = s.pets, i = P.eggs.findIndex(z => z.id === b.dataset.sellegg); if (i < 0) return;
    if (b.dataset.sure !== "1") { b.dataset.sure = "1"; b.textContent = "Tap again to sell"; setTimeout(() => { if (b.isConnected) { b.dataset.sure = ""; b.textContent = `Sell · 💎 ${sellOf(P.eggs[i] || {})}`; } }, 2500); return; }
    const egg = P.eggs.splice(i, 1)[0], v2 = sellOf(egg); s.gems = gems() + v2; CS.toast(`Sold for ${v2} gems.`); again(); return; }
  b = e.target.closest("[data-buyfreeze]");
  if (b && !b.disabled && gems() >= FREEZE && (s.freezes || 0) < 3) { s.gems -= FREEZE; s.freezes = (s.freezes || 0) + 1; CS.toast("Bought a streak freeze."); again(); return; }
  b = e.target.closest("[data-buytheme]");
  if (b && !b.disabled) { const t = CS.GEM_THEMES.find(z => z.k === b.dataset.buytheme); if (t && !owned(t.k) && gems() >= t.price) { s.gems -= t.price; (s.themes = s.themes || []).push(t.k); s.accent = t.k; CS.applyTheme(); CS.toast(`${t.n} theme unlocked and equipped!`); again(); } return; }
  b = e.target.closest("[data-equip]");
  if (b && !b.disabled && owned(b.dataset.equip)) { s.accent = b.dataset.equip; CS.applyTheme(); again(); }
});
})();
