/* Founder card for the home page "Meet the founder" section (#team) and the footer links on every page.
   Fill in the empty fields, then run `node scripts/build-site.js`.
   While a field is empty, the card shows a yellow "[add ...]" placeholder so it's obvious what's missing. Don't deploy with placeholders showing. */
const FOUNDER = {
  name: "Adam Quehl",
  role: "Founder · Finance and PPE student at Ohio State",
  photo: "assets/img/founder.jpg", // e.g. "assets/img/founder.jpg": a real photo of your face, square, at least 400×400
  exams: [["Human Geography", 5], ["World History", 5], ["U.S. Government", 5], ["Microeconomics", 5], ["U.S. History", 4], ["Chemistry", 4], ["Calculus AB", 4], ["Psychology", 4], ["English Literature", 4], ["English Language", 4], ["Physics 1", 4]], // AP® exams you took: [exam, score]
  story: "I took 11 AP® exams in high school and scored a 4 or higher on every one, including 5s in Human Geography, World History, U.S. Government and Microeconomics. Now I study Finance and Philosophy, Politics and Economics (PPE) at Ohio State. I built Credit Sprint to be the prep I wanted back then: a clear plan, practice that explains every answer, and games that make the hard units stick.", // 3–4 sentences, first person: which exams you took, what the credit saved you, why you built this
  profile: "https://www.linkedin.com/in/adam-quehl-5765a3389/", // your LinkedIn or X profile URL
  profileLabel: "LinkedIn", // or "X"
  year: "Class of 2030",           // optional, e.g. "Class of 2029"; shown after the role
};

/* Teammates. Leave empty and the section reads "Meet the founder"; add people and it becomes "Meet the team",
   with a row of cards under the founder card. Then run `node scripts/build-site.js`. Example entry:
   {name:"Jordan Lee", role:"Writes Biology and Chemistry questions", photo:"assets/img/team-jordan.jpg",
    exams:[["Biology", 5], ["Chemistry", 5]], blurb:"One sentence in their own words.", profile:"https://www.linkedin.com/in/…"} */
const TEAM = [];

const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const todo = t => `<span class="lp-todo">[${t}]</span>`;
const first = () => FOUNDER.name.split(" ")[0];
const initials = () => FOUNDER.name.split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase();

const css = `.lp-founder{display:grid;grid-template-columns:180px minmax(0,1fr);gap:28px;align-items:start;border:1px solid var(--rule);border-radius:16px;padding:28px;background:var(--surface);max-width:860px}
@media(max-width:640px){.lp-founder{grid-template-columns:minmax(0,1fr);padding:22px;gap:18px}}
.lp-founder-photo{width:180px;height:180px;border-radius:14px;object-fit:cover;display:block}
.lp-founder-photo.ini{display:grid;place-items:center;background:var(--accent-soft);color:var(--accent);font-size:3rem;font-weight:800}
@media(max-width:640px){.lp-founder-photo{width:120px;height:120px}.lp-founder-photo.ini{font-size:2.2rem}}
.lp-founder-name{font-size:1.3rem;font-weight:800;margin:0;color:var(--ink)}
.lp-founder-role{color:var(--muted);margin:2px 0 14px;font-size:.95rem}
.lp-founder-story{margin:0 0 14px;line-height:1.65}
.lp-founder-scores{margin:0 0 14px}
.lp-founder-scores b{display:block;font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin-bottom:6px}
.lp-founder-exams{display:flex;flex-wrap:wrap;gap:5px;margin:0;padding:0;list-style:none}
.lp-founder-exams li{border:1px solid var(--rule);border-radius:6px;padding:1px 7px;font-size:.75rem;font-weight:600;color:var(--muted);line-height:1.6}
.lp-founder-exams li strong{color:var(--ink);margin-left:3px}
.lp-founder-links{display:flex;flex-wrap:wrap;gap:16px;font-weight:700}
.lp-founder-links a{color:var(--accent)}
.lp-strip-wrap{padding:0 0 28px}
.lp-strip{display:flex;align-items:center;gap:14px}
.lp-strip>span{flex:1;min-width:0}
.lp-strip img,.lp-strip .ini{width:44px;height:44px;border-radius:50%;object-fit:cover;flex:none}
.lp-strip .ini{display:grid;place-items:center;background:var(--accent-soft);color:var(--accent);font-weight:800}
.lp-strip a{color:var(--accent);font-weight:700}
.lp-team-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-top:16px;max-width:1100px}
@media(max-width:900px){.lp-team-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:560px){.lp-team-grid{grid-template-columns:minmax(0,1fr)}}
.lp-mate{border:1px solid var(--rule);border-radius:14px;padding:18px;background:var(--surface);display:flex;gap:14px;align-items:flex-start}
.lp-mate img,.lp-mate .ini{width:64px;height:64px;border-radius:50%;object-fit:cover;flex:none}
.lp-mate .ini{display:grid;place-items:center;background:var(--accent-soft);color:var(--accent);font-weight:800}
.lp-mate b{display:block}.lp-mate p{margin:4px 0 0;font-size:.9rem;line-height:1.5}
.lp-mate .lp-founder-exams{margin-top:8px}.lp-mate a{color:var(--accent);font-weight:700;font-size:.88rem}
.lp-todo{background:#FFF1B8;color:#6B5300;border:1px dashed #C9A400;border-radius:6px;padding:1px 6px;font-weight:600}`;

function teamSection() {
  const f = FOUNDER;
  const photo = f.photo
    ? `<img class="lp-founder-photo" src="${esc(f.photo)}" alt="${esc(f.name)}, founder of Credit Sprint" width="180" height="180" loading="lazy">`
    : `<div class="lp-founder-photo ini" role="img" aria-label="${esc(f.name)}">${initials()}</div>`;
  const story = f.story ? esc(f.story) : todo("add 3–4 sentences in your own words: which of these exams you took, what the credit saved you, and why you built Credit Sprint");
  const exams = f.exams.length ? f.exams.map(([n, sc]) => `<li>${esc(n)}<strong>${esc(sc)}</strong></li>`).join("") : `<li>${todo("exams you took and your scores")}</li>`;
  const link = f.profile ? `<a href="${esc(f.profile)}" rel="me noopener" target="_blank">${esc(f.name)} on ${esc(f.profileLabel)}</a>` : todo("add your LinkedIn or X link");
  return `<section class="sec alt" id="team"><div class="wrap">
  <div class="sec-head"><span class="eyebrow">Who's behind Credit Sprint</span><h2>${TEAM.length ? "Meet the team" : "Meet the founder"}</h2></div>
  <div class="lp-founder">
    ${photo}
    <div>
      <p class="lp-founder-name">${esc(f.name)}</p>
      <p class="lp-founder-role">${esc(f.role)}${f.year ? ", " + esc(f.year) : ""}</p>
      <p class="lp-founder-story">${story}</p>
      <div class="lp-founder-scores"><b>${esc(first())}'s AP® scores</b><ul class="lp-founder-exams">${exams}</ul></div>
      <div class="lp-founder-links">${link}</div>
    </div>
  </div>${TEAM.length ? `\n  <div class="lp-team-grid">${TEAM.map(mate).join("")}</div>` : ""}
</div></section>`;
}
function mate(t) {
  const ini = (t.name || "?").split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const photo = t.photo ? `<img src="${esc(t.photo)}" alt="${esc(t.name)}" width="64" height="64" loading="lazy">` : `<span class="ini" aria-hidden="true">${ini}</span>`;
  const ex = (t.exams || []).length ? `<ul class="lp-founder-exams">${t.exams.map(([n, sc]) => `<li>${esc(n)}<strong>${esc(sc)}</strong></li>`).join("")}</ul>` : "";
  return `<div class="lp-mate">${photo}<div><b>${esc(t.name)}</b><span class="small muted">${esc(t.role || "")}</span>${t.blurb ? `<p>${esc(t.blurb)}</p>` : ""}${ex}${t.profile ? `<a href="${esc(t.profile)}" rel="noopener" target="_blank">LinkedIn</a>` : ""}</div></div>`;
}

/* one-line founder strip near the top of the home page, linking down to the full card */
function strip() {
  const f = FOUNDER, n = f.exams.length, fives = f.exams.filter(e => +e[1] === 5).length;
  const words = ["no","one","two","three","four","five","six","seven","eight","nine","ten"];
  const photo = f.photo ? `<img src="${esc(f.photo)}" alt="" width="44" height="44" loading="lazy">` : `<span class="ini" aria-hidden="true">${initials()}</span>`;
  const facts = n ? `, an Ohio State student who took ${n} AP® exams${fives ? ` (${words[fives] || fives} 5s)` : ""}` : "";
  return `<section class="wrap lp-strip-wrap" id="founder-strip"><div class="lp-strip">${photo}<span><b>Built by ${esc(f.name)}</b>${facts}. <a href="#team">Meet the founder →</a></span></div></section>`;
}

/* footer links for every page; `up` is the "../" prefix for pages in subfolders */
function footerLinks(up) {
  return `<a href="${up}index.html#team">Meet the founder</a>` + (FOUNDER.profile ? `<a href="${esc(FOUNDER.profile)}" rel="me noopener" target="_blank">${esc(FOUNDER.profileLabel)}</a>` : "");
}

function missing() {
  const f = FOUNDER, m = [];
  if (!f.photo) m.push("photo"); if (!f.exams.length) m.push("exams"); if (!f.story) m.push("story"); if (!f.profile) m.push("profile link");
  return m;
}

module.exports = { FOUNDER, TEAM, css, teamSection, strip, footerLinks, missing };
