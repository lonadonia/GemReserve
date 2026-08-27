import { NextResponse } from "next/server";

import { getFormDeliveryConfig } from "@/lib/config";
import {
  CONSENT_VERSION,
  validateSubmission,
  type FormKind,
  type FormSubmission,
} from "@/lib/forms";

/**
 * Public lead-form endpoint.
 *
 * This is the integration boundary the site will submit through once a delivery
 * provider is configured. Until then it answers 503 and delivers nothing, which
 * is what keeps the preview honest: a visitor is told their message was not
 * sent rather than being shown a success state over a discarded payload.
 *
 * The route is explicitly dynamic. Every page on the site is statically
 * prerendered and must stay that way; only this handler runs per request.
 */
export const dynamic = "force-dynamic";

const KINDS: readonly FormKind[] = ["waitlist", "contact", "early-access"];

/**
 * In-process rate limiting.
 *
 * This is a floor, not a solution: it is per-instance and resets on restart, so
 * it will not survive horizontal scaling. It is here so the endpoint is not
 * wide open on day one, and so the place to attach a shared limiter (Redis, or
 * the reverse proxy's own limiter) is obvious. DEPLOYMENT.md records that
 * Nginx should carry the real limit.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    // Opportunistic sweep so the map cannot grow without bound.
    if (hits.size > 5_000) {
      for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k);
    }
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

function clientKey(request: Request): string {
  // Behind Nginx the client address arrives in X-Forwarded-For. Only the first
  // entry is meaningful and the rest can be spoofed, so only the first is used.
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: Request) {
  if (rateLimited(clientKey(request))) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const submission = body as Partial<FormSubmission>;
  if (
    !submission ||
    typeof submission !== "object" ||
    !KINDS.includes(submission.kind as FormKind) ||
    typeof submission.fields !== "object" ||
    submission.fields === null
  ) {
    return NextResponse.json({ error: "invalid_shape" }, { status: 400 });
  }

  // Only known-safe primitives are carried forward, so no nested object can be
  // smuggled through to the provider.
  const fields: Record<string, string> = {};
  for (const [key, value] of Object.entries(submission.fields)) {
    if (typeof value === "string") fields[key] = value;
  }

  const checked: FormSubmission = {
    kind: submission.kind as FormKind,
    fields,
    // The client-declared consent version is not trusted; the server records
    // the version it is actually serving.
    consentVersion: CONSENT_VERSION,
  };

  // The browser already ran this. It runs again because a POST can come from
  // anywhere, not only from the form.
  const errors = validateSubmission(checked);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const delivery = getFormDeliveryConfig();
  if (!delivery) {
    // No destination configured. Nothing is stored, nothing is queued, and the
    // caller is told plainly — never a success over a dropped message.
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  try {
    const response = await fetch(delivery.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${delivery.apiKey}`,
      },
      body: JSON.stringify({
        kind: checked.kind,
        fields: checked.fields,
        consentVersion: checked.consentVersion,
        receivedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      // Status only. The provider's body may echo the submission back, and the
      // visitor's details must not reach the server log.
      console.error("Form delivery rejected", {
        kind: checked.kind,
        status: response.status,
      });
      return NextResponse.json({ error: "delivery_failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (cause) {
    console.error("Form delivery threw", {
      kind: checked.kind,
      cause: cause instanceof Error ? cause.name : "unknown",
    });
    return NextResponse.json({ error: "delivery_failed" }, { status: 502 });
  }
}

/** Anything other than POST is not part of this contract. */
export function GET() {
  return NextResponse.json({ error: "method_not_allowed" }, { status: 405 });
}
