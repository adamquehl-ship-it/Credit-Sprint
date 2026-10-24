/* POST /api/stripe-webhook — Stripe tells us about payments here. Add this URL in Stripe → Developers → Webhooks with
   events: checkout.session.completed, customer.subscription.created, customer.subscription.updated,
   customer.subscription.deleted, charge.refunded. Every message is checked against STRIPE_WEBHOOK_SECRET. */
import {json} from "../../lib/auth.js";
import {ensureBilling, verifyStripe, passUntil, PLANS, COURSES} from "../../lib/billing.js";
const DAY = 864e5, GRACE = 3 * DAY;
const okCourse = (plan, course) => PLANS[plan] && (PLANS[plan].perCourse ? COURSES.includes(course) : course === "all");
export async function onRequestPost({request, env}) {
  if (!env.DB) return json({error: "No database."}, 503);
  const raw = await request.text();
  if (!(await verifyStripe(raw, request.headers.get("stripe-signature"), env.STRIPE_WEBHOOK_SECRET))) return json({error: "Bad signature."}, 400);
  let ev; try { ev = JSON.parse(raw); } catch { return json({error: "Bad body."}, 400); }
  await ensureBilling(env.DB);
  if (await env.DB.prepare("SELECT 1 FROM stripe_events WHERE id = ?").bind(ev.id).first()) return json({ok: true, duplicate: true});
  const o = (ev.data && ev.data.object) || {}, m = o.metadata || {}, now = Date.now(), DB = env.DB, q = [];
  const put = (ref, user, plan, course, until) => q.push(DB.prepare("INSERT INTO entitlements (ref, user_id, plan, course, until, created_at) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(ref) DO UPDATE SET until = excluded.until").bind(ref, user, plan, course, until, now));
  if (ev.type === "checkout.session.completed") {
    const user = o.client_reference_id || m.user;
    if (user && o.customer) q.push(DB.prepare("INSERT INTO customers (user_id, customer_id) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET customer_id = excluded.customer_id").bind(user, o.customer));
    if (user && okCourse(m.plan, m.course)) {
      if (o.mode === "payment" && o.payment_status === "paid") put(o.payment_intent || o.id, user, m.plan, m.course, passUntil(m.plan, (o.created || now / 1000) * 1000));
      if (o.mode === "subscription" && o.subscription) put(o.subscription, user, m.plan, m.course, now + 33 * DAY);   // refined by subscription events
    }
  } else if (ev.type.startsWith("customer.subscription.")) {
    const end = o.current_period_end || (o.items && o.items.data && o.items.data[0] && o.items.data[0].current_period_end);
    const live = ["active", "trialing", "past_due"].includes(o.status) && ev.type !== "customer.subscription.deleted";
    const until = live && end ? end * 1000 + GRACE : now;
    if (m.user && okCourse(m.plan, m.course)) put(o.id, m.user, m.plan, m.course, until);
    else q.push(DB.prepare("UPDATE entitlements SET until = ? WHERE ref = ?").bind(until, o.id));
  } else if (ev.type === "charge.refunded" && o.refunded && o.payment_intent) {
    q.push(DB.prepare("UPDATE entitlements SET until = ? WHERE ref = ?").bind(now, o.payment_intent));
  }
  q.push(DB.prepare("INSERT OR IGNORE INTO stripe_events (id, at) VALUES (?, ?)").bind(ev.id, now));
  await DB.batch(q);
  return json({ok: true});
}
