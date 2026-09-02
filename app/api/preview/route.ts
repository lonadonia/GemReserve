/**
 * Draft preview entry point.
 *
 * WordPress sends an editor here with a signed, single-use, short-lived token
 * bound to one page and one revision. This route exchanges that token for
 * content **server-side**, sets Next.js draft mode, and redirects to the page.
 *
 * The token is deliberately not kept. It is single-use — WordPress consumes its
 * nonce on first exchange — so storing it would store something already spent.
 * What the cookie carries instead is the route that was authorised, so draft
 * mode cannot be used to view a different draft than the one the link was for.
 */

import { draftMode } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import { fetchPreview } from "@/lib/cms/client";

/** Never prerender or cache: every request must re-authorise. */
export const dynamic = "force-dynamic";
export const revalidate = 0;

/** The cookie recording which route this preview session may show. */
export const PREVIEW_ROUTE_COOKIE = "gr_preview_route";

function deny(reason: string): NextResponse {
  // One status and one message for every failure. Distinguishing "expired"
  // from "forged" from "already used" would help someone probing the endpoint
  // and helps a legitimate editor not at all — they need "ask for a new link",
  // which is what they get.
  const response = new NextResponse(
    "This preview link is not valid. It may have expired or already been used. Ask for a new link.",
    { status: 403, headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  console.warn(`[preview] denied: ${reason}`);
  return response;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return deny("no token supplied");
  }

  let page;
  try {
    page = await fetchPreview(token);
  } catch (error) {
    console.error("[preview] CMS rejected or could not serve the preview", error);
    return deny("the CMS did not accept the token");
  }

  if (page === null) {
    return deny("the CMS returned no content for this token");
  }

  // The route comes from the CMS response, not from the query string. A
  // caller-supplied `route` parameter would be an open redirect: someone could
  // send a valid-looking preview link that lands the editor anywhere.
  const route = page.route.startsWith("/") ? page.route : `/${page.route}`;

  // Previews render through the CMS block renderer, which is mounted under
  // /cms/ while WordPress remains the live public renderer. Previewing through
  // the hardcoded content/*.ts routes would show the editor the old build and
  // none of their changes — the brief is explicit that a preview must be the
  // real presentation, not an approximation.
  const target = `/cms${route}`;

  const draft = await draftMode();
  draft.enable();

  const response = NextResponse.redirect(new URL(target, request.nextUrl.origin));
  response.cookies.set(PREVIEW_ROUTE_COOKIE, route, {
    httpOnly: true,
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
    path: "/",
    maxAge: 900,
  });
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");

  return response;
}
