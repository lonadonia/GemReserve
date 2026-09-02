/**
 * The CMS-driven route.
 *
 * Every page WordPress manages is renderable here, from the versioned API,
 * through the block renderer. It is mounted under `/cms/` rather than at the
 * site root, and that is a deliberate decision rather than a half-finished one.
 *
 * The live public site is WordPress's own theme (see
 * CMS_CURRENT_STATE_AUDIT.md §1). Mounting this at the root would move the
 * public renderer from WordPress to Next.js as a side effect of a CMS
 * remediation — an unrequested production migration, and one the brief
 * forbids doing without separate authorisation. So the renderer is built,
 * routed and tested here, and the cutover is a deployment decision someone
 * makes on purpose: move this directory to the root, and the 58 routes are
 * served from the CMS instead.
 *
 * Until then it earns its place twice over: it is where draft previews land,
 * and it is what the parity tests compare against WordPress's own output.
 *
 * It is never indexed. A second copy of every page under a different path is
 * exactly the duplicate content that costs a site its rankings.
 */

import { draftMode } from "next/headers";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import BlockRenderer from "@/components/cms/BlockRenderer";
import PreviewBanner from "@/components/cms/PreviewBanner";
import { CmsUnavailableError, fetchPage, fetchRoutes, isCmsConfigured } from "@/lib/cms/client";
import type { CmsPage } from "@/lib/cms/schema";

import { PREVIEW_ROUTE_COOKIE } from "../../api/preview/route";

interface RouteParams {
  readonly params: Promise<{ readonly route?: readonly string[] }>;
}

function toRoute(segments: readonly string[] | undefined): string {
  if (!segments || segments.length === 0) {
    return "/";
  }
  return `/${segments.join("/")}/`;
}

/**
 * Pre-render every published route at build time.
 *
 * If the CMS is unreachable during a build, this returns nothing rather than
 * failing the build: the routes then render on demand. A content system being
 * briefly unavailable should not be able to stop a deploy of unrelated code.
 */
export async function generateStaticParams(): Promise<{ route: string[] }[]> {
  if (!isCmsConfigured()) {
    return [];
  }
  try {
    const routes = await fetchRoutes();
    return routes.map((entry) => ({
      route: entry.route.split("/").filter(Boolean),
    }));
  } catch (error) {
    console.error("[cms] Could not enumerate routes for static generation", error);
    return [];
  }
}

async function loadPage(route: string): Promise<CmsPage | null> {
  if (!isCmsConfigured()) {
    return null;
  }
  try {
    return await fetchPage(route);
  } catch (error) {
    if (error instanceof CmsUnavailableError) {
      // An outage is not a 404. Rethrowing surfaces the error boundary and,
      // critically, leaves any already-generated static copy in place rather
      // than replacing the page with a permanent-looking "not found".
      throw error;
    }
    console.error(`[cms] Contract failure while rendering ${route}`, error);
    throw error;
  }
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { route: segments } = await params;
  const route = toRoute(segments);
  const page = await loadPage(route).catch(() => null);

  if (page === null) {
    return { title: "Not found", robots: { index: false, follow: false } };
  }

  return {
    title: page.seo.title,
    description: page.seo.description,
    // Canonical points at the live WordPress URL, never at this /cms/ path.
    // Without that, the mirror would compete with the real page in search.
    alternates: { canonical: page.seo.canonical || undefined },
    // Always noindex while this is a mirror. On cutover, this becomes
    // `page.seo.noindex`.
    robots: { index: false, follow: false },
    openGraph: {
      title: page.seo.openGraph.title,
      description: page.seo.openGraph.description,
      url: page.seo.canonical || undefined,
      images: page.seo.openGraph.image ? [page.seo.openGraph.image] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: page.seo.twitter.title,
      description: page.seo.twitter.description,
    },
  };
}

export default async function CmsPageRoute({ params }: RouteParams): Promise<React.ReactElement> {
  const { route: segments } = await params;
  const route = toRoute(segments);

  const draft = await draftMode();
  const page = await loadPage(route);

  if (page === null) {
    notFound();
  }

  // The preview banner is shown only when draft mode is on *and* the cookie
  // says this is the route the preview link authorised. Checking the route as
  // well as the flag stops a draft-mode session opened for one page from
  // labelling every other page as a preview.
  const authorisedRoute = draft.isEnabled
    ? (await cookies()).get(PREVIEW_ROUTE_COOKIE)?.value
    : undefined;
  const showBanner = draft.isEnabled && authorisedRoute === route;

  return (
    <>
      {showBanner ? (
        <PreviewBanner
          route={route}
          status={page.preview?.status ?? "draft"}
          expiresAt={page.preview?.expiresAt ?? ""}
        />
      ) : null}
      <main id="main-content">
        <BlockRenderer blocks={page.blocks} />
      </main>
    </>
  );
}
