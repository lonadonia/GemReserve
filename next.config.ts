import type { NextConfig } from "next";

/**
 * Content Security Policy.
 *
 * Every asset this site loads is same-origin: `next/font` self-hosts both
 * typefaces at build time, all imagery is local, and there is no analytics,
 * tag manager, embed or third-party script anywhere in the bundle. That lets
 * every fetch directive stay on `'self'`.
 *
 * `script-src` carries `'unsafe-inline'` deliberately. Next's hydration
 * bootstrap is an inline script, and the strict alternative — per-request
 * nonces — requires middleware that opts every route into dynamic rendering.
 * All 46 routes here are statically prerendered, which is what allows the site
 * to be served as plain files behind Nginx; taking nonces would trade that away
 * for a directive that still permits inline execution via the nonce. The
 * exposure is bounded by there being no user-supplied content rendered on any
 * page, no query parameters read into the DOM, and no third-party origin
 * allowed to contribute script. Revisit if a route ever renders visitor input.
 *
 * The directives that actually stop the common attacks are strict:
 * `object-src 'none'` (no plugin execution), `base-uri 'self'` (no base-tag
 * hijack), `frame-ancestors 'none'` (no clickjacking) and `form-action 'self'`
 * (no off-site form posts).
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "media-src 'self'",
  "manifest-src 'self'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  // Belt-and-braces alongside frame-ancestors, for agents that predate CSP 2.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Nothing on the site uses these, so they are switched off rather than left
  // to the browser default.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  // Two years, subdomains included. Only meaningful once HTTPS is live on the
  // apex domain; see DEPLOYMENT.md before submitting to the preload list.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2_592_000,
  },
  poweredByHeader: false,
  reactStrictMode: true,

  // Client source maps are withheld in production. They would publish the full
  // commented source of every component to anyone who opened devtools, and
  // nothing here needs browser-side debugging of minified output.
  productionBrowserSourceMaps: false,

  /**
   * Applies when the site is served by `next start`. A static deployment behind
   * Nginx does not run this code path — the equivalent `add_header` block is in
   * DEPLOYMENT.md and has to be kept in step with this list.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Fingerprinted build output is safe to cache permanently.
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Image derivatives are content-addressed by name and only change when
        // the asset pipeline regenerates them, which also changes the filename.
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
