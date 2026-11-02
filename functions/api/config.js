/* GET /api/config — tells the app which sign-in methods are switched on. */
import {json} from "../../lib/auth.js";
import {paymentsOn, plansOn, isEarly} from "../../lib/billing.js";
export async function onRequestGet({env}) {
  return json({accounts: !!env.DB, email: !!(env.DB && env.RESEND_API_KEY), google: env.DB && env.GOOGLE_CLIENT_ID ? env.GOOGLE_CLIENT_ID : null, password: !!env.DB, payments: paymentsOn(env), plans: plansOn(env), early: isEarly()});
}
