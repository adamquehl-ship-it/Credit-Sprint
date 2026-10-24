# Credit Sprint

Study platform for AP® Macroeconomics and CLEP® Principles of Macroeconomics. Clean Slate theme with light/dark mode. Live at https://creditsprintprep.com once the domain is connected.

## Site map
| Path | What it is |
| --- | --- |
| `index.html` | Public landing page (features, games, pricing, FAQ) |
| `app.html` | The study app |
| `guides/` | Free SEO study guides: one per unit, CLEP® growth, CLEP® exam guide |
| `practice/` | Free SEO pages with worked calculation problems |
| `sitemap.xml`, `robots.txt` | For Google. Submit the sitemap in Google Search Console |
| `functions/api/tutor.js`, `functions/api/score.js` | AI tutor and AI FRQ scoring (Cloudflare Pages Functions) |
| `lib/ai.js` | Shared code for the AI functions |
| `scripts/build-site.js` | Rebuilds the landing, guide and practice pages from the question data |

## Courses
The app has two courses, Macroeconomics and Microeconomics. `assets/js/courses.js` lists each course and its data files (Macro in `assets/data/`, Micro in `assets/data/micro/`). Students pick a course on the landing page (`app.html?course=macro` or `?course=micro`) or from the course switcher at the top of the dashboard. Each course saves its own progress; streak, XP, badges, pets and plan are shared.
To add another course later, add an entry to `courses.js`, create its data folder with the same file format, and add a pet set in `assets/js/pets.js`.

## Content
- 269 original multiple-choice questions, 5 choices each, every choice explained (`assets/data/questions.js`, `questions2.js`, `fifth.js`)
- 15 FRQs with rubrics; 8 include a drag-the-curve graph task (`content.js`, `content2.js`, `content3.js`)
- 73 flashcards, 60 true/false items, 12 cause-and-effect chains, 46 graph scenarios, 15 calculation generators
- Pets (`assets/js/pets.js`): a mystery egg for every 25 questions answered; each egg hatches after 15 correct answers and its rarity is rolled at hatch. 29 Macroeconomics pets: Common 49%, Uncommon 27.5%, Rare 14%, Epic 6%, Legendary 2%, Mythical 1.45% (3 pets, each under 1%), Supreme Mythical 0.05% (1 pet). XP boosts, growth stages and reactions. New subjects add their own set to `CS.PET_SETS`.
- 8 animated explainers, CLEP® hub (growth unit + exam-day guide), 30-day cram plan template (`content3.js`)

After editing any data file, run `node scripts/build-site.js` so the public guide pages match.

## Turning on the AI tutor and AI FRQ scoring
The app works without this; the AI buttons show a friendly message until it's set up.
1. Create an API key at https://platform.claude.com (add a small prepaid credit and a monthly spend limit).
2. In Cloudflare: Workers & Pages → your project → Settings → Variables and secrets → Add → type **Secret**, name `ANTHROPIC_API_KEY`, paste the key. Add it for Production.
3. Optional variables: `ALLOWED_ORIGIN` = `https://creditsprintprep.com` (blocks other sites from using your key), `TUTOR_MODEL` (default `claude-haiku-5-5`), `SCORE_MODEL` (default `claude-sonnet-5-5`).
4. Redeploy (push any commit, or Deployments → Retry deployment).

Rough cost: a tutor reply on Haiku is a fraction of a cent; an FRQ score on Sonnet is about 1–2 cents. Set a spend limit in the Claude Console.

## Turning on paid checkout (Pass Plan)
Free users see an upgrade card on the dashboard, a "Free plan" button in the sidebar, and a Plan row in Settings. All three open the plans modal.
1. In Stripe, create three Payment Links: Pass Plan $9/month (recurring), Pass Plan Season $39 (one time), Pass Guarantee $59 (one time).
2. On each link, set "After payment" to redirect to `https://creditsprintprep.com/app.html#pro-welcome`.
3. Paste the three URLs into `CS.CHECKOUT` at the top of `assets/js/upgrade.js`, then commit and push.
Until the links are filled in, the Upgrade button tells students every Pro feature is free during early access.
Note: the `#pro-welcome` unlock is saved in the browser only. Before charging at scale, add accounts and a Stripe webhook so Pro status is verified on the server.

## Turning on accounts and weekly leagues
Accounts are optional for students. Without them, progress stays in the browser and the dashboard shows a practice league against computer opponents. With them, students can sign in with an **email code**, **Google** or a **username and password**, their progress syncs across devices, and they compete in real weekly leagues.

The code is already in the repo: `functions/api/auth/*`, `functions/api/me.js`, `functions/api/progress.js`, `functions/api/league.js`, `lib/auth.js`, `lib/league.js`, the database layout in `db/schema.sql`, and the app side in `assets/js/account.js`.

1. **Create the database.** Cloudflare dashboard → Storage & Databases → D1 SQL Database → Create → name it `creditsprint`. Open it → Console → paste all of `db/schema.sql` → Run.
2. **Connect it to the site.** Workers & Pages → your Pages project → Settings → Bindings → Add → D1 database. Variable name `DB`, database `creditsprint`. Username + password sign-in works as soon as this is done.
3. **Email codes (Resend).** Make a free account at resend.com → API Keys → Create. In Pages → Settings → Variables and Secrets add `RESEND_API_KEY` (type Secret). In Resend → Domains, add `creditsprintprep.com` and copy the DNS records it shows into Cloudflare DNS. Then add `EMAIL_FROM` = `Credit Sprint <login@creditsprintprep.com>`.
4. **Google sign-in.** console.cloud.google.com → create a project → APIs & Services → OAuth consent screen (External, app name Credit Sprint, your email) → Credentials → Create credentials → OAuth client ID → Web application. Under Authorized JavaScript origins add `https://creditsprintprep.com` and `https://www.creditsprintprep.com`. Copy the Client ID into a variable `GOOGLE_CLIENT_ID`.
5. **Redeploy.** Deployments → latest → ⋯ → Retry deployment, so the new settings take effect. Then open the site and click **Sign in** in the sidebar.

How it works: sessions are a random token in an HttpOnly cookie (60 days). Passwords are salted PBKDF2 hashes. Email codes expire after 10 minutes and allow 5 tries. Students must confirm they're 13 or older to create an account, and leaderboards show only first name and last initial. Students can delete their account from the account window.
Leagues: groups of up to 30 in the same tier (Bronze → Silver → Emerald → Sapphire → Diamond), ranked by XP earned Monday to Sunday (UTC). At the start of each week the top 3 move up and the bottom 2 move down.
Before a big launch, add a privacy policy page that explains what you store (email or username, display name, study progress).

## Seasons
Seasons last 2 weeks, starting Monday, January 5, 2026, and cycle through 8 map themes (`CS.THEMES` in `assets/js/quest.js`). Each season has an 8-tier pass: a free lane for everyone and a Pass lane for Pro (open to everyone until checkout links are set). Rewards are gems, mystery eggs (some with a minimum rarity) and streak freezes; gems buy freezes and eggs in the shop on the season card.

## Deploy
Cloudflare Pages, connected to this repository. Framework preset: None. Build command: none. Output directory: `/`. The `functions/` folder is picked up automatically.

## Updating
1. Ask Claude for the change; it edits the files in this folder.
2. In GitHub Desktop: write a summary, click **Commit to main**, then **Push origin**.

## Trademarks
AP® and CLEP® are trademarks registered by the College Board, which is not affiliated with, and does not endorse, this site. Every page that mentions them carries this notice in the footer. Don't put "AP" or "CLEP" in the domain, company name or ads; before paid launch, consider sending the College Board samples of how the marks are used (their trademark guidelines describe the 4–6 week review).

## Profile pictures

Signed-in students can upload a profile picture for leaderboards (account window → Upload a picture).
- The browser crops and shrinks it to a 128×128 JPEG. The server removes hidden photo data such as EXIF location.
- **Automatic screening:** every upload is checked by Claude (vision) before it's saved. Anything not school-appropriate, or showing personal information, is refused. This uses the same `ANTHROPIC_API_KEY` secret as the AI tutor. Without that key, uploads are refused, so the check is never skipped. Optional: set `MODERATION_MODEL` to change the model.
- Students can tap someone else's picture to report it. It disappears for them right away, and 3 reports hide it for everyone until the owner uploads a new one.
- Pictures are stored in the D1 database. The `avatars` and `avatar_reports` tables are created automatically, so there's no setup step.
