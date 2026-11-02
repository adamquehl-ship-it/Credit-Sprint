/* Hides files that live in this folder but aren't part of the public site (source code, notes, previews).
   _routes.json limits Functions to /api/* plus exactly these paths, so normal pages and files never run this code. */
const HIDDEN = /^\/(?:lib|db|scripts|design|functions)(?:\/|$)|^\/(?:README(?:\.md)?|preview(?:\.html)?|landing-[a-z0-9]+(?:\.html)?|\.gitignore|\.gitattributes)$/i;
export async function onRequest({request, next, env}) {
  if (!HIDDEN.test(new URL(request.url).pathname)) return next();
  let body = "Not found";
  try { const r = await env.ASSETS.fetch(new URL("/404.html", request.url)); if (r.ok) body = await r.text(); } catch {}
  return new Response(body, {status: 404, headers: {"content-type": "text/html; charset=utf-8", "cache-control": "no-store"}});
}
