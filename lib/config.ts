/**
 * Central runtime configuration and feature flags.
 *
 * Everything that varies between a developer machine, a staging host and the
 * client's production server is resolved here, so no component reads
 * `process.env` directly and no capability is switched on by accident.
 *
 * Two rules hold for this file:
 *
 * 1. Every capability defaults to OFF. A flag that is unset, misspelled or
 *    empty is disabled — never enabled — so a missing variable on the server
 *    can only ever result in less functionality, not in an unintended live
 *    transaction surface.
 *
 * 2. Anything prefixed `NEXT_PUBLIC_` is compiled into the browser bundle and
 *    is therefore public. No secret may ever use that prefix. Secrets are read
 *    on the server only, from the un-prefixed names, and are never re-exported
 *    from here.
 */

/** `true` only for the exact string "true". Anything else is off. */
function flag(value: string | undefined): boolean {
  return value === "true";
}

/**
 * Capabilities that are deliberately dormant in the pre-launch site.
 *
 * These exist so the future ecosystem has a declared place to switch on, and so
 * that any code path guarding one of them is visible in a single grep. None of
 * them may be enabled without the corresponding legal and infrastructure sign
 * off recorded in PRODUCTION_READINESS_AUDIT.md.
 */
export const features = {
  /**
   * Public lead forms POST to the API route instead of reporting the local
   * preview state. Requires a delivery provider to be configured server-side.
   */
  formSubmission: flag(process.env.NEXT_PUBLIC_ENABLE_FORM_SUBMISSION),

  // --- Future ecosystem. All gated, none implemented. -------------------
  // Each of these is read by nothing today. They are declared so that the
  // work to add them has an obvious switch to hang off, and so that a reviewer
  // can confirm at a glance that they are off.
  /** Wallet connection UI. No wallet library is in the dependency tree. */
  walletConnect: flag(process.env.NEXT_PUBLIC_ENABLE_WALLET_CONNECT),
  /** Token acquisition flow: purchase, payment, settlement. */
  tokenSale: flag(process.env.NEXT_PUBLIC_ENABLE_TOKEN_SALE),
  /** Live Proof of Reserves attestation feed. */
  proofOfReserves: flag(process.env.NEXT_PUBLIC_ENABLE_PROOF_OF_RESERVES),
  /** Physical redemption request submission. */
  redemption: flag(process.env.NEXT_PUBLIC_ENABLE_REDEMPTION),
  /** Participant authentication and KYC. */
  participantPortal: flag(process.env.NEXT_PUBLIC_ENABLE_PARTICIPANT_PORTAL),
} as const;

export type FeatureName = keyof typeof features;

/** Canonical public origin, used for absolute URLs in metadata. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://gemreserve.io";

/**
 * Whether search engines may index this deployment.
 *
 * A staging host must set NEXT_PUBLIC_ALLOW_INDEXING=false so that a preview
 * domain cannot compete with the production site or leak unreleased pages into
 * search results. Production leaves it unset, which allows indexing.
 */
export const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING !== "false";

/**
 * Server-only form delivery configuration.
 *
 * Called from route handlers, never from a component. Returns null when the
 * deployment has not been given a destination, which is what makes the API
 * route answer "not configured" rather than accepting and discarding a
 * visitor's message.
 */
export function getFormDeliveryConfig(): {
  readonly endpoint: string;
  readonly apiKey: string;
} | null {
  const endpoint = process.env.FORM_DELIVERY_ENDPOINT;
  const apiKey = process.env.FORM_DELIVERY_API_KEY;
  if (!endpoint || !apiKey) return null;
  return { endpoint, apiKey };
}
