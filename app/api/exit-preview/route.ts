/**
 * Leave draft mode.
 *
 * The exit control behind the preview banner. Clearing the route cookie as well
 * as disabling draft mode matters: leaving a stale authorised-route cookie
 * behind would let a later `draftMode` session — enabled by a different, valid
 * preview link — inherit an authorisation it was not granted.
 */

import { draftMode } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import { PREVIEW_ROUTE_COOKIE } from "../preview/route";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const draft = await draftMode();
  draft.disable();

  const target = request.nextUrl.searchParams.get("redirect");
  // Only site-relative redirects. A caller-supplied absolute URL here would be
  // an open redirect wearing a "log out" button.
  const safe = target && target.startsWith("/") && !target.startsWith("//") ? target : "/";

  const response = NextResponse.redirect(new URL(safe, request.nextUrl.origin));
  response.cookies.delete(PREVIEW_ROUTE_COOKIE);
  response.headers.set("Cache-Control", "private, no-store, max-age=0");

  return response;
}
