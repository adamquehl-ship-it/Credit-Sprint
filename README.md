# Credit Sprint

Study platform for 14 AP® and CLEP® courses, from Macroeconomics to Calculus BC. Clean Slate theme with light/dark mode. Live at https://creditsprintprep.com once the domain is connected.

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

**English courses (AP English Literature `aplit`, AP English Language `aplang`).** These use reading passages: a passage set is created with `S()` in files like `assets/data/aplit/v1.js`, and each question added after it with `q()` is tied to that passage (`CS_PASSAGES`, shown above the question with line or paragraph numbers). Practice, exams, bosses and the diagnostic keep a passage's questions together (`CS.takeQs` / `CS.setOrder` in `core.js`). Essays are free-response entries with `essay:true`, an optional `passage` id or a six-item `sources` packet, and a 6-point rubric. Key-term questions are generated from the flashcards: after editing `cards.js` or `cards2.js`, run `node scripts/gen-terms.js aplit` (or `aplang`) and commit the new `terms.js`.

**Calculus (AP® Calculus AB `calcab` with CLEP® Calculus, AP® Calculus BC `calcbc`).** Both courses share `assets/data/calc/`. AB loads the base files (units 1–8); BC loads the same files plus everything in `assets/data/calc/bc/`, which switches the unit weights to BC, adds the BC-only topics in units 4, 6, 7 and 8, and adds Unit 9 (parametric, polar, vectors) and Unit 10 (series). The two courses keep separate progress but share one pet set (`CALCP` in `pets.js`, art in `assets/js/calcart.js`). Calculus games: Derivative Dash, Tangent Shot, Graph Detective, Integral Sprint, and Series Court (BC). Free-response prompts can carry a `table` (rows of cells) that the app shows under the prompt. The generated numeric questions (`g1.js`–`g8.js`, `bc/g9.js`, `bc/g10.js`) were computed exactly, so every answer key is right; edit them like any other question file.

**Unit bosses** (`assets/js/bosses.js`): every unit boss in every course is a drawn humanoid monster. Its look (outfit, hair, horns, prop and so on) is one line in the `B` table, and `CS.bossArt(course, unit, state)` draws it; the animations live in `assets/styles.css` under "unit bosses".

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

## Plans and payments (Stripe)

Plans: **Free**; one-time **Exam Pass** ($29.99, early bird $19.99), **3-Class Exam Pass** ($40, early bird $25) and **All-Class Exam Pass** ($50, early bird $35), all lasting through exam day; **Final Sprint** ($15 one time, one class for 30 days; switched off for now, see `off: true` in `lib/billing.js` and `assets/js/upgrade.js`); and monthly **1 class** ($7.99), **3 classes** ($14.99) and **All classes** ($19.99). Early-bird prices are charged July–December. Plan names, prices, descriptions and Free limits live in `assets/js/upgrade.js`. Server logic lives in `lib/billing.js`.

Access is stored per class in the D1 database by the Stripe webhook. The browser never decides whether someone paid. Students need a free account to buy. A plan whose price variable isn't set in Cloudflare is hidden from the plans window.

1. Stripe → Product catalog: create the ten prices (one time: Exam Pass $29.99 and $19.99, 3-Class Exam Pass $40 and $25, All-Class Exam Pass $50 and $35, Final Sprint $15 only when you turn it back on; monthly: $7.99, $14.99 and $19.99). Copy each Price ID (`price_…`).
2. Stripe → Developers → Webhooks → Add endpoint `https://creditsprintprep.com/api/stripe-webhook` with the events `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted` and `charge.refunded`. Copy the signing secret.
3. Stripe → Settings → Billing → Customer portal: turn it on. Allow canceling (at end of billing period) and updating payment methods. Keep plan switching OFF.
4. Cloudflare Pages → Settings → Variables and secrets (Production), then redeploy:
   - Secrets: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
   - Variables: `PRICE_EXAM`, `PRICE_EXAM_EARLY`, `PRICE_EXAM3`, `PRICE_EXAM3_EARLY`, `PRICE_EXAM_ALL`, `PRICE_EXAM_ALL_EARLY`, `PRICE_SPRINT`, `PRICE_SUB_ONE`, `PRICE_SUB_THREE`, `PRICE_SUB_ALL`
5. Test with card 4242 4242 4242 4242 in Stripe test mode, then repeat steps 1–4 with live-mode keys and prices.

Until the Stripe keys and at least one price are set, the checkout button says checkout opens soon. To refund someone, refund the payment in Stripe; the webhook removes their access automatically. Set `CS.PAYWALL = false` in `upgrade.js` to unlock everything for everyone.

## Access codes (free Pro for you, testers or teachers)

Signed-in students can enter a code in the account window (click your name, then Your plan, then Redeem). There's also a "Have an access code?" link in the plans window.
Codes are kept only in Cloudflare, never in this repository. Add a **Secret** named `ACCESS_CODES` in Pages → Settings → Variables and secrets:

    CS-PRO-XXXX-XXXX-XXXX:all:0, TEACHER-FALL:all:30, MACRO-DEMO:macro:7

Each entry is `code:course:days`, where course is `all`, `macro` or `micro`, and `0` days means forever. Each account can use a code once. Delete a code from the secret to stop new redemptions. Accounts that already redeemed it keep their access. Guessing is limited to 10 tries per hour.

## Creds, pet merging, the market and friends

- **Creds** (`assets/js/market.js`): students earn them for quizzes (10), lessons (5–8), games (6), the Daily Challenge (15), bosses (30–60), exams (25–60), badges (40), level-ups and streak milestones. The limit is 600 a day, and paid plans earn +10%. Creds are saved with progress and shared across courses.
- **Merge** (Pets → Merge): 3 copies of the same pet become 1 random pet of the next rarity.
- **Market** (Pets → Market, accounts only): list pets for 5–50,000 creds (max 10 at once) and buy other students' pets. The market keeps a 10% fee. Students can also send an offer, or a free gift, to one friend. Earned creds are counted from synced progress (max 700 a day on the server). Spending, sales and pet transfers live in a server ledger (`lib/market.js`, `functions/api/market.js`), so a pet can only be sold once and nobody can spend creds they don't have.
- **Friends** (Account → Friends): every account needs a username. Older accounts without one are asked to choose it the next time they sign in. Students search by username, send and accept requests, and see a weekly friends leaderboard on the dashboard (`lib/friends.js`, `functions/api/friends.js`).
- All the new database tables are created automatically, so there's nothing to run in the D1 console.

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

## Badges and profile showcase

- **Badges** (`assets/js/badges.js`): medal art in bronze, silver, gold and platinum for achievements, and a shield badge for every unit boss in every course (named after the boss in `assets/js/courses.js`). Students see them under **Pets & badges → Badges**, and a pop-up celebrates each new one.
- **Showcase** (Pets & badges → Showcase): students pick 3 pets and 3 badges. It saves with their synced progress. Friends tap a student's picture on the friends leaderboard to see it (`functions/api/showcase.js`). Only friends can view it, and only pets still owned and badges really earned are shown.

## Home page and welcome window

- The home page uses the "Academic" look, applied by `scripts/landing-pro.js` every time `build-site.js` runs. To preview the other looks, see the notes at the top of that file.
- New students get the combined welcome window: setup on one side and a free account on the other (two tabs on phones). Change `CS.OB_STYLE` in `assets/js/app.js` to `"compact"` or `"steps"` for the other layouts. Guests who start the diagnostic from anywhere else are asked to make an account first, or can skip.
