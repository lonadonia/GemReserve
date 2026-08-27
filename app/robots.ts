import type { MetadataRoute } from "next";

import { allowIndexing, siteUrl } from "@/lib/config";

/**
 * A staging or preview host must not be indexed: it would compete with the
 * production domain for the same content and can expose pages before they are
 * announced. Setting NEXT_PUBLIC_ALLOW_INDEXING=false on any non-production
 * deployment disallows everything and withholds the sitemap.
 *
 * Production leaves the variable unset, which allows crawling.
 */
export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The form endpoint has nothing to index and should not be crawled.
      disallow: "/api/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
