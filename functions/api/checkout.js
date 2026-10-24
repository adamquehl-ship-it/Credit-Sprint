/* POST /api/checkout {plan: "exam"|"sprint"|"sub1"|"suball", course: "macro"|"micro"} → {url} of a Stripe Checkout page.
   Signed-in students only, so every payment is tied to an account. */
import {json, start, currentUser} from "../../lib/auth.js";
import {PLANS, COURSES, priceFor, paymentsOn, ensureBilling, accessFor, stripe} from "../../lib/billing.js";
async function handle({request, env}) {
  const s = await start(request, env); if (s.error) return s.error;
  const u = await currentUser(env, request); if (!u) return json({error: "Create a free account first so your purchase is saved to it."}, 401);
  if (!paymentsOn(env)) return json({error: "Checkout isn't open yet. Check back soon."}, 503);
  const plan = String(s.body.plan || ""), P = PLANS[plan];
  if (!P) return json({error: "Pick a plan."}, 400);
  const course = P.perCourse ? String(s.body.course || "") : "all";
  if (P.perCourse && !COURSES.includes(course)) return json({error: "Pick a class."}, 400);
  const {access} = await accessFor(env.DB, u.id);
  if (access.some(a => a.course === "all" && a.sub)) return json({error: "Your All Subjects plan already includes every class."}, 409);
  if (P.mode === "subscription" && access.some(a => a.sub && a.course === course)) return json({error: "You already have a monthly plan for this class. Manage it from your account."}, 409);
  await ensureBilling(env.DB);
  const cust = await env.DB.prepare("SELECT customer_id FROM customers WHERE user_id = ?").bind(u.id).first();
  const origin = new URL(request.url).origin, meta = {user: u.id, plan, course};
  const body = {
    mode: P.mode, client_reference_id: u.id, metadata: meta, allow_promotion_codes: "true",
    line_items: {0: {price: priceFor(env, plan), quantity: 1}},
    success_url: `${origin}/app.html?course=${course === "all" ? "macro" : course}&paid=1#home`,
    cancel_url: `${origin}/app.html?course=${course === "all" ? "macro" : course}#home`
  };
  if (cust) body.customer = cust.customer_id; else if (u.email) body.customer_email = u.email;
  if (P.mode === "subscription") body.subscription_data = {metadata: meta};
  else { body.payment_intent_data = {metadata: meta}; if (!cust) body.customer_creation = "always"; }
  try { const ses = await stripe(env, "checkout/sessions", body); return json({url: ses.url}); }
  catch (e) { console.error("Stripe checkout failed:", e && e.message); return json({error: "Checkout couldn't start. Please try again in a minute, or email support if it keeps happening."}, 400); }
}

/* any unexpected crash (database, config) comes back as a readable message instead of a blank server error */
export async function onRequestPost(ctx) {
  try { return await handle(ctx); }
  catch (e) { console.error("Checkout crashed:", e && e.message); return json({error: "Checkout couldn't start. Please try again in a minute, or email support if it keeps happening."}, 500); }
}
