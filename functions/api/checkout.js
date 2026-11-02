/* POST /api/checkout {plan, course} → {url} of a Stripe Checkout page.
   plan: exam | exam3 | examall | sprint | sub1 | sub3 | suball. course: one class ("macro"), three classes ("macro,bio,chem") or "all".
   Signed-in students only, so every payment is tied to an account. */
import {json, start, currentUser} from "../../lib/auth.js";
import {PLANS, priceFor, paymentsOn, parseCourses, ensureBilling, accessFor, stripe} from "../../lib/billing.js";
async function handle({request, env}) {
  const s = await start(request, env); if (s.error) return s.error;
  const u = await currentUser(env, request); if (!u) return json({error: "Create a free account first so your purchase is saved to it."}, 401);
  if (!paymentsOn(env)) return json({error: "Checkout isn't open yet. Check back soon."}, 503);
  const plan = String(s.body.plan || ""), P = PLANS[plan];
  if (!P) return json({error: "Pick a plan."}, 400);
  if (!priceFor(env, plan)) return json({error: "That plan isn't available yet. Pick another one."}, 503);
  const list = parseCourses(plan, P.n === 0 ? "all" : s.body.course);
  if (!list) return json({error: P.n === 3 ? "Pick 3 different classes." : "Pick a class."}, 400);
  const course = list.join(",");
  const {access} = await accessFor(env.DB, u.id);
  const covered = c => access.some(a => a.course === "all" || a.course === c);
  if (access.some(a => a.course === "all")) return json({error: "Your plan already includes every class."}, 409);
  if (P.n > 0 && list.every(covered)) return json({error: list.length > 1 ? "You already have all 3 of these classes unlocked." : "You already have this class unlocked."}, 409);
  if (P.mode === "subscription" && access.some(a => a.sub && (P.n === 0 || list.includes(a.course)))) return json({error: "You already have a monthly plan for one of these classes. Manage it from your account."}, 409);
  await ensureBilling(env.DB);
  const cust = await env.DB.prepare("SELECT customer_id FROM customers WHERE user_id = ?").bind(u.id).first();
  const origin = new URL(request.url).origin, meta = {user: u.id, plan, course};
  const body = {
    mode: P.mode, client_reference_id: u.id, metadata: meta, allow_promotion_codes: "true",
    line_items: {0: {price: priceFor(env, plan), quantity: 1}},
    success_url: `${origin}/app.html${list[0] === "all" ? "" : "?course=" + list[0]}${list[0] === "all" ? "?" : "&"}paid=1#home`,
    cancel_url: `${origin}/app.html${list[0] === "all" ? "" : "?course=" + list[0]}#home`
  };
  if (cust) body.customer = cust.customer_id; else if (u.email) body.customer_email = u.email;
  const what = "Credit Sprint " + P.name + (course === "all" ? "" : " · " + list.join(", "));
  body.custom_text = {submit: {message: "Access turns on the moment you pay. A receipt is emailed to you."}};
  if (P.mode === "subscription") body.subscription_data = {metadata: meta, description: what};
  else {
    /* receipt_email makes Stripe email a receipt in live mode; the suffix shows on the card statement after your account's descriptor prefix */
    body.payment_intent_data = {metadata: meta, description: what, statement_descriptor_suffix: "CREDITSPRINT", receipt_email: u.email || undefined};
    body.invoice_creation = {enabled: "true", invoice_data: {description: what, metadata: meta, footer: "Questions? Reply to your receipt email. creditsprintprep.com"}};
    if (!cust) body.customer_creation = "always";
  }
  try { const ses = await stripe(env, "checkout/sessions", body); return json({url: ses.url}); }
  catch (e) { console.error("Stripe checkout failed:", e && e.message); return json({error: "Checkout couldn't start. Please try again in a minute, or email support if it keeps happening."}, 400); }
}

/* any unexpected crash (database, config) comes back as a readable message instead of a blank server error */
export async function onRequestPost(ctx) {
  try { return await handle(ctx); }
  catch (e) { console.error("Checkout crashed:", e && e.message); return json({error: "Checkout couldn't start. Please try again in a minute, or email support if it keeps happening."}, 500); }
}
