/**
 * Publish-time cache revalidation.
 *
 * WordPress signs a small payload naming the routes that changed; this route
 * verifies the signature and invalidates exactly those routes.
 *
 * The verification is the whole point, so each control is here for a stated
 * reason rather than as ceremony:
 *
 *   HMAC over timestamp + body   Signing the body alone would let a captured
 *                                request be replayed forever with its original
 *                                headers.
 *   timing-safe comparison       A byte-at-a-time compare on a signature is a
 *                                forgery oracle given enough attempts.
 *   300-second window            Bounds replay to the interval in which a
 *                                captured request is still useful.
 *   event id, remembered         Bounds it further: the same event delivered
 *                                twice inside the window is applied once.
 *
 * Revalidation is idempotent by nature — invalidating a cache entry twice is
 * harmless — so the event id is about noise and cost, not correctness.
 */

import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const SECRET = process.env.GEMRESERVE_REVALIDATE_SECRET ?? "";
const MAX_SKEW_SECONDS = 300;

/**
 * Expire the tag now rather than on a cacheLife profile.
 *
 * Next 16 requires a second argument to `revalidateTag`. The alternative,
 * `updateTag`, gives read-your-own-writes but is only callable from a Server
 * Action, and this is a webhook from another system. `{ expire: 0 }` is the
 * correct equivalent here: the editor pressed Publish, so the cached copy is
 * already wrong and there is nothing to gain from letting it live out a
 * profile.
 */
const IMMEDIATE = { expire: 0 } as const;

/**
 * Recently applied event ids.
 *
 * In-memory and per-instance, which is the honest scope: it deduplicates a
 * retry hitting the same instance. Across instances the worst case is that a
 * route is revalidated twice, which costs one extra render. A shared store for
 * that would be infrastructure bought to prevent a non-problem.
 */
const seenEvents = new Map<string, number>();

function rememberEvent(id: string): boolean {
  const now = Date.now();
  for (const [key, at] of seenEvents) {
    if (now - at > MAX_SKEW_SECONDS * 1000) {
      seenEvents.delete(key);
    }
  }
  if (seenEvents.has(id)) {
    return false;
  }
  seenEvents.set(id, now);
  return true;
}

/** Constant-time comparison of two hex signatures. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function hmac(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function reject(status: number, reason: string): NextResponse {
  console.warn(`[revalidate] rejected: ${reason}`);
  return NextResponse.json({ revalidated: false, reason }, { status });
}

/** Only site-relative paths are ever revalidated. */
function isSafeRoute(route: unknown): route is string {
  return typeof route === "string" && route.startsWith("/") && !route.startsWith("//");
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (SECRET === "") {
    // Fail closed. An unconfigured secret must not mean "accept everything".
    return reject(503, "no shared secret configured on the renderer");
  }

  const body = await request.text();
  const timestamp = request.headers.get("x-gemreserve-timestamp") ?? "";
  const provided = (request.headers.get("x-gemreserve-signature") ?? "").replace(/^sha256=/, "");

  if (timestamp === "" || provided === "") {
    return reject(401, "missing signature or timestamp header");
  }

  const age = Math.abs(Date.now() / 1000 - Number.parseInt(timestamp, 10));
  if (!Number.isFinite(age) || age > MAX_SKEW_SECONDS) {
    return reject(401, "timestamp outside the accepted window");
  }

  const expected = await hmac(`${timestamp}.${body}`, SECRET);
  if (!timingSafeEqual(expected, provided)) {
    return reject(401, "signature mismatch");
  }

  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return reject(400, "body was not valid JSON");
  }

  if (typeof payload !== "object" || payload === null) {
    return reject(400, "body was not an object");
  }

  const { routes, eventId } = payload as { routes?: unknown; eventId?: unknown };

  if (typeof eventId === "string" && eventId !== "" && !rememberEvent(eventId)) {
    // Already applied. Success, not an error: a retry that finds its work
    // already done should not look like a failure to the sender.
    return NextResponse.json({ revalidated: true, deduplicated: true, routes: [] });
  }

  if (!Array.isArray(routes)) {
    return reject(400, "no routes named");
  }

  const applied: string[] = [];

  for (const route of routes) {
    if (route === "*") {
      // Global content changed — navigation, footer, corporate identity. Every
      // page embeds those, so every page is stale.
      revalidateTag("cms:pages", IMMEDIATE);
      applied.push("*");
      continue;
    }
    if (!isSafeRoute(route)) {
      console.warn(`[revalidate] ignored a route that was not site-relative: ${String(route)}`);
      continue;
    }
    revalidatePath(route);
    revalidateTag(`cms:page:${route}`, IMMEDIATE);
    applied.push(route);
  }

  return NextResponse.json({ revalidated: true, routes: applied });
}
