import type { Metadata } from "next";
import Link from "next/link";

import { LineIcon, type IconName } from "@/components/icons/LineIcon";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ImageWithGlow } from "@/components/ui/ImageWithGlow";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { ResponsiveHeroImage } from "@/components/ui/ResponsiveHeroImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  discountCalculation,
  discountCta,
  discountExample,
  discountHero,
  discountMarks,
  discountPrinciples,
  discountPrinciplesTitle,
} from "@/content/discount-methodology";

export const metadata: Metadata = {
  title: "20% Discount Methodology",
  description: discountHero.paragraphs[0],
  alternates: { canonical: "/discount-methodology" },
  openGraph: {
    title: "20% Discount Methodology | GemReserve.io",
    description: discountHero.paragraphs[0],
    url: "/discount-methodology",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const breadcrumbItems = [
  { label: discountHero.breadcrumb[0], href: "/" },
  { label: discountHero.breadcrumb[1], href: "/investors" },
  { label: discountHero.breadcrumb[2] },
] as const;

const markIcons: Record<string, IconName> = {
  "rewarding-early-believers": "tag",
  "fair-uniform": "shield-check",
  "transparent-methodology": "calculator",
  "real-asset-backing": "diamond",
  "built-on-trust": "lock",
};

const stepIcons: Record<string, IconName> = {
  "asset-valuation": "contract",
  "tokenization-model": "pie",
  "early-participation-discount": "ticket-percent",
  "secure-purchase": "lock",
  "full-asset-backing": "shield-check",
  "value-realization": "chart",
};

const principleIcons: Record<string, IconName> = {
  fairness: "scales",
  transparency: "search",
  integrity: "shield-check",
  value: "diamond",
  "community-first": "users",
};

export default function DiscountMethodologyPage() {
  return (
    <div className="discount-page">
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section
          className="hero discount-hero"
          aria-labelledby="discount-hero-title"
        >
          <div className="hero__media" aria-hidden="true">
            <ResponsiveHeroImage
              desktopBase="/images/heroes/discount-hero"
              mobileBase="/images/heroes/discount-hero-mobile"
            />
            <span className="hero__scrim discount-hero__scrim" />
          </div>

          <div className="hero__inner container-wide">
            <MotionReveal className="hero__copy">
              <Breadcrumbs items={breadcrumbItems} />
              <h1 className="hero__title" id="discount-hero-title">
                <span>{discountHero.titleLines[0]}</span>
                <span className="hero__title-accent">
                  {discountHero.titleLines[1]}
                </span>
              </h1>
              <p className="discount-hero__tagline">{discountHero.tagline}</p>
              {discountHero.paragraphs.map((paragraph) => (
                <p className="hero__description" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </MotionReveal>

            {/* The board stamps a gold disc over the stone. It is drawn rather
                than burned into the plate so the figure stays sharp and the
                plate can be recropped without carrying a fixed badge. */}
            <MotionReveal className="discount-hero__badge" delay={130}>
              <p aria-hidden="true">
                <span>{discountHero.badge.figure}</span>
                <span>{discountHero.badge.label}</span>
              </p>
            </MotionReveal>
          </div>
        </section>

        <section
          className="discount-marks container-wide"
          aria-label="Why the discount exists"
        >
          <MotionReveal>
            <ul className="trust-pillars discount-marks__row">
              {discountMarks.map((mark) => (
                <li key={mark.id}>
                  <LineIcon name={markIcons[mark.id]} size={36} />
                  <h2>{mark.title}</h2>
                  <p>{mark.description}</p>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="discount-calc container-wide"
          aria-labelledby="discount-calc-title"
        >
          <MotionReveal>
            <SectionHeading
              title={discountCalculation.title}
              id="discount-calc-title"
            />
            <p className="discount-calc__intro">{discountCalculation.intro}</p>
          </MotionReveal>

          <MotionReveal delay={80}>
            <ol className="discount-steps">
              {discountCalculation.steps.map((step) => (
                <li key={step.id}>
                  <span className="discount-steps__number" aria-hidden="true">
                    {step.step}
                  </span>
                  <span className="discount-steps__mark" aria-hidden="true">
                    <LineIcon name={stepIcons[step.id]} size={30} />
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
          </MotionReveal>
        </section>

        <section
          className="discount-example container-wide"
          aria-labelledby="discount-example-title"
        >
          <MotionReveal>
            <SectionHeading
              title={discountExample.title}
              id="discount-example-title"
            />
          </MotionReveal>

          <MotionReveal className="discount-example__panel" delay={80}>
            <div className="discount-example__grid">
              <div className="discount-example__column">
                <h3 className="discount-example__heading discount-example__heading--standard">
                  {discountExample.standardHeading}
                </h3>
                <p className="discount-example__asset">
                  {discountExample.asset}
                </p>
                <dl>
                  {discountExample.rows.map((row) => (
                    <div
                      key={row.id}
                      className={
                        row.emphasis
                          ? "discount-example__row--total"
                          : undefined
                      }
                    >
                      <dt>{row.label}</dt>
                      <dd>{row.standard}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <p className="discount-example__badge" aria-hidden="true">
                <span>{discountExample.badge.figure}</span>
                <span>{discountExample.badge.label}</span>
              </p>

              <div className="discount-example__column discount-example__column--early">
                <h3 className="discount-example__heading discount-example__heading--early">
                  {discountExample.earlyHeading}
                </h3>
                <p className="discount-example__asset">
                  {discountExample.asset}
                </p>
                <dl>
                  {discountExample.rows.map((row) => (
                    <div
                      key={row.id}
                      className={
                        row.emphasis
                          ? "discount-example__row--total"
                          : undefined
                      }
                    >
                      <dt>
                        {discountExample.earlyRowLabels[row.id] ?? row.label}
                      </dt>
                      <dd>{row.early}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <p className="discount-example__footnote">
              <LineIcon name="check" size={20} />
              <span>{discountExample.footnote}</span>
            </p>
          </MotionReveal>
        </section>

        <section
          className="discount-principles container-wide"
          aria-labelledby="discount-principles-title"
        >
          <MotionReveal>
            <SectionHeading
              title={discountPrinciplesTitle}
              id="discount-principles-title"
            />
          </MotionReveal>
          <MotionReveal delay={80}>
            <ul className="trust-pillars discount-principles__row">
              {discountPrinciples.map((principle) => (
                <li key={principle.id}>
                  <LineIcon name={principleIcons[principle.id]} size={36} />
                  <h3>{principle.title}</h3>
                  <p>{principle.description}</p>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="trust-cta discount-cta container-wide"
          aria-labelledby="discount-cta-title"
        >
          <MotionReveal className="trust-cta__visual">
            <ImageWithGlow
              className="trust-cta__image"
              src="/images/sections/vault-tray.webp"
              alt={discountCta.imageAlt}
              sizes="(max-width: 760px) 100vw, 28vw"
            />
          </MotionReveal>

          <MotionReveal className="trust-cta__copy" delay={70}>
            <h2 id="discount-cta-title">{discountCta.title}</h2>
            <p>{discountCta.description}</p>
          </MotionReveal>

          <MotionReveal className="trust-cta__action" delay={130}>
            <Link className="button button--gold" href="/early-participation">
              {discountCta.buttonLabel}
            </Link>
            <p>{discountCta.supportingText}</p>
          </MotionReveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
