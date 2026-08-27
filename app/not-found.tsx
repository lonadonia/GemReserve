import type { Metadata } from "next";
import Link from "next/link";

import { LineIcon } from "@/components/icons/LineIcon";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MotionReveal } from "@/components/ui/MotionReveal";

/**
 * Next's built-in 404 renders without the site chrome, so a visitor who follows
 * a stale link lands on an unbranded page. This one is assembled entirely from
 * the components and CSS the rest of the site already uses — header, footer,
 * `container-wide`, the hero type ramp and the existing button styles — so it
 * introduces no new design language, only fills a gap.
 */
export const metadata: Metadata = {
  title: "Page not found",
  description:
    "The page you were looking for is not available on GemReserve.io.",
  // A 404 must never enter an index, and must not pass authority onward.
  robots: { index: false, follow: false },
};

const suggestions = [
  { label: "Home", href: "/" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Explore Gemstone Assets", href: "/assets" },
  { label: "All Gemstone Programs", href: "/gemstone-programs" },
  { label: "Contact Us", href: "/contact" },
] as const;

export default function NotFound() {
  return (
    <div className="notfound-page">
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section className="notfound container-wide" aria-labelledby="nf-title">
          <MotionReveal className="notfound__inner">
            <p className="eyebrow">Error 404</p>
            <h1 className="notfound__title" id="nf-title">
              <span>This page</span>
              <span className="hero__title-accent">could not be found</span>
            </h1>
            <p className="notfound__lead">
              The address may have changed, or the page may not be part of the
              current preview. Everything published so far is reachable from the
              links below.
            </p>

            <nav className="notfound__links" aria-label="Suggested pages">
              <ul>
                {suggestions.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>
                      <LineIcon name="chevron-down" size={16} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="notfound__actions">
              <Link className="button button--gold" href="/">
                Return home
              </Link>
              <Link className="button button--outline" href="/contact">
                Contact us
              </Link>
            </div>
          </MotionReveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
