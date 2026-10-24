/* POST /api/billing → {url} of Stripe's customer portal, where students cancel subscriptions and update cards. */
import {json, start, currentUser} from "../../lib/auth.js";
import {ensureBilling, stripe} from "../../lib/billing.js";
export async function onRequestPost({request, env}) {
  const s = await start(request, env, {needBody: false}); if (s.error) return s.error;
  const u = await currentUser(env, request); if (!u) return json({error: "Not signed in."}, 401);
  if (!env.STRIPE_SECRET_KEY) return json({error: "Billing isn't set up yet."}, 503);
  await ensureBilling(env.DB);
  const c = await env.DB.prepare("SELECT customer_id FROM customers WHERE user_id = ?").bind(u.id).first();
  if (!c) return json({error: "No purchases on this account yet."}, 404);
  try { const p = await stripe(env, "billing_portal/sessions", {customer: c.customer_id, return_url: new URL(request.url).origin + "/app.html#home"}); return json({url: p.url}); }
  catch (e) { return json({error: "The billing page couldn't open. Try again in a minute."}, 502); }
}
