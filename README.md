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

## Deploy
Cloudflare Pages, connected to this repository. Framework preset: None. Build command: none. Output directory: `/`. The `functions/` folder is picked up automatically.

## Updating
1. Ask Claude for the change; it edits the files in this folder.
2. In GitHub Desktop: write a summary, click **Commit to main**, then **Push origin**.

## Trademarks
AP® and CLEP® are trademarks registered by the College Board, which is not affiliated with, and does not endorse, this site. Every page that mentions them carries this notice in the footer. Don't put "AP" or "CLEP" in the domain, company name or ads; before paid launch, consider sending the College Board samples of how the marks are used (their trademark guidelines describe the 4–6 week review).
