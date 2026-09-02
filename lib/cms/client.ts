/**
 * The CMS client.
 *
 * Server-only. Everything here runs during rendering or revalidation, never in
 * the browser: the preview path carries a bearer token, and shipping that to a
 * client bundle would publish it. The `server-only` guard is the compile-time
 * enforcement of that, so an accidental import from a client component is a
 * build error rather than a leak.
 */

import "server-only";

import {
  validatePage,
  validateRouteIndex,
  type CmsPage,
  type CmsRouteEntry,
} from "./schema";

/**
 * Where WordPress lives.
 *
 * Unprefixed, so it stays on the server. There is no fallback to a public
 * hostname: a missing value should stop a build with a clear error, not send
 * the build's content requests somewhere unintended.
 */
const CMS_BASE = process.env.GEMRESERVE_CMS_URL?.replace(/\/+$/, "") ?? "";

/** How long a fetched page may be served from cache before revalidation. */
const DEFAULT_TTL_SECONDS = 300;

export class CmsUnavailableError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "CmsUnavailableError";
  }
}

export class CmsContractError extends Error {
  constructor(
    message: string,
    readonly problems: readonly string[],
  ) {
    super(message);
    this.name = "CmsContractError";
  }
}

export function isCmsConfigured(): boolean {
  return CMS_BASE !== "";
}

function endpoint(path: string): string {
  if (CMS_BASE === "") {
    throw new CmsUnavailableError(
      "GEMRESERVE_CMS_URL is not set. The CMS renderer cannot fetch content.",
    );
  }
  return `${CMS_BASE}/wp-json/gemreserve/v1${path}`;
}

interface FetchOptions {
  readonly revalidate?: number | false;
  readonly tags?: readonly string[];
  readonly headers?: Record<string, string>;
}

async function getJson(url: string, options: FetchOptions = {}): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Accept: "application/json", ...options.headers },
      next:
        options.revalidate === false
          ? undefined
          : { revalidate: options.revalidate ?? DEFAULT_TTL_SECONDS, tags: options.tags as string[] },
      cache: options.revalidate === false ? "no-store" : undefined,
    });
  } catch (cause) {
    // A network failure is not a 404. Distinguishing them matters: a missing
    // page should render a 404, and an unreachable CMS should not silently
    // turn the whole site into 404s during an outage.
    throw new CmsUnavailableError(
      `Could not reach the CMS at ${url}: ${cause instanceof Error ? cause.message : "unknown error"}`,
    );
  }

  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new CmsUnavailableError(`CMS returned HTTP ${response.status} for ${url}`, response.status);
  }

  return response.json();
}

/**
 * Fetch one published page by route.
 *
 * Returns null when the route does not exist, and throws when the CMS is
 * unreachable or speaking a schema this build does not understand. The caller
 * decides what a 404 means; it must not decide that an outage is a 404.
 */
export async function fetchPage(route: string): Promise<CmsPage | null> {
  const url = `${endpoint("/page")}?route=${encodeURIComponent(route)}`;
  const raw = await getJson(url, { tags: [`cms:page:${route}`, "cms:pages"] });
  if (raw === null) {
    return null;
  }

  const { value, problems } = validatePage(raw);
  if (value === null) {
    throw new CmsContractError(`CMS response for ${route} did not match the contract`, problems);
  }
  if (problems.length > 0) {
    reportProblems(route, problems);
  }

  return value;
}

/** The full route index, for static generation. */
export async function fetchRoutes(): Promise<readonly CmsRouteEntry[]> {
  const raw = await getJson(endpoint("/pages"), { tags: ["cms:pages"] });
  const { value, problems } = validateRouteIndex(raw);
  if (value === null) {
    throw new CmsContractError("CMS route index did not match the contract", problems);
  }
  if (problems.length > 0) {
    reportProblems("route index", problems);
  }

  return value;
}

/**
 * Fetch draft content against a signed preview token.
 *
 * Never cached, at any layer. A cached preview is a draft served to whoever
 * asks next.
 */
export async function fetchPreview(token: string): Promise<CmsPage | null> {
  const url = `${endpoint("/preview")}?token=${encodeURIComponent(token)}`;
  const raw = await getJson(url, { revalidate: false });
  if (raw === null) {
    return null;
  }

  const { value, problems } = validatePage(raw);
  if (value === null) {
    throw new CmsContractError("Preview response did not match the contract", problems);
  }
  if (problems.length > 0) {
    reportProblems("preview", problems);
  }

  return value;
}

/**
 * Report contract problems that were survivable.
 *
 * Survivable means: some nodes were dropped, the rest of the page is intact.
 * §11 requires that unknown blocks fail safely *and observably*, so this is
 * loud in the server log and invisible to the visitor. It is never rendered
 * into the page — a validation message on a public marketing site tells a
 * stranger about the CMS's internals and tells the visitor nothing useful.
 */
function reportProblems(context: string, problems: readonly string[]): void {
  console.error(
    `[cms] ${problems.length} content node(s) dropped while rendering ${context}:\n  ${problems.join("\n  ")}`,
  );
}
