import type { Metadata } from "next";
import Link from "next/link";

import { GemstoneCatalog } from "@/components/catalog/GemstoneCatalog";
import { LineIcon, type IconName } from "@/components/icons/LineIcon";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { TrustPillars } from "@/components/sections/TrustPillars";
import { ImageWithGlow } from "@/components/ui/ImageWithGlow";
import { MetricStrip } from "@/components/ui/MetricStrip";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { ResponsiveHeroImage } from "@/components/ui/ResponsiveHeroImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  assetMetrics,
  assetRegistryCta,
  assetsHero,
  assetValuePropositions,
  assetWaitlistCta,
  investmentReasons,
  investmentSectionHeading,
} from "@/content/assets";

export const metadata: Metadata = {
  title: "Explore Gemstone Assets",
  description: assetsHero.description,
  alternates: { canonical: "/assets" },
  openGraph: {
    title: "Explore Gemstone Assets | GemReserve.io",
    description: assetsHero.description,
    url: "/assets",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const investmentIcons: Record<
  (typeof investmentReasons)[number]["id"],
  IconName
> = {
  "intrinsic-value": "diamond",
  "limited-supply": "mountain",
  "portable-wealth": "hand-gem",
  intergenerational: "users",
};

export default function AssetsPage() {
  return (
    <div className="assets-page">
      <SiteHeader />

      <main id="main-content">
        <section
          className="hero assets-hero"
          aria-labelledby="assets-hero-title"
        >
          <div className="hero__media assets-hero__media" aria-hidden="true">
            <ResponsiveHeroImage
              desktopBase="/images/heroes/assets-hero"
              mobileBase="/images/heroes/assets-hero-mobile"
              className="assets-hero__image"
            />
            <span className="hero__scrim assets-hero__scrim" />
          </div>

          <div className="hero__inner assets-hero__inner container-wide">
            <MotionReveal className="assets-hero__breadcrumb">
              <Breadcrumbs items={assetsHero.breadcrumbs} />
            </MotionReveal>

            <div className="assets-hero__layout">
              <MotionReveal className="hero__copy assets-hero__copy">
                <h1
                  className="hero__title assets-hero__title"
                  id="assets-hero-title"
                >
                  <span>{assetsHero.title.primary}</span>
                  <span className="hero__title-accent assets-hero__title-accent">
                    {assetsHero.title.accent}
                  </span>
                </h1>
                <p className="hero__lead assets-hero__lead">
                  {assetsHero.lead}
                </p>
                <p className="hero__description assets-hero__description">
                  {assetsHero.description}
                </p>
              </MotionReveal>
            </div>

            <div className="assets-hero__base">
              <MotionReveal
                className="hero-value-row assets-hero__values"
                delay={170}
              >
                <TrustPillars
                  items={assetValuePropositions}
                  className="hero-value-row__grid assets-hero__value-grid"
                />
              </MotionReveal>

              <MotionReveal
                className="hero-callout assets-hero__callout"
                delay={120}
              >
                <aside aria-labelledby="assets-technology-callout-title">
                  <LineIcon
                    name="network"
                    size={36}
                    className="hero-callout__icon"
                  />
                  <h2
                    className="hero-callout__title"
                    id="assets-technology-callout-title"
                  >
                    <span>{assetsHero.technologyCallout.titleLines[0]}</span>
                    <span>{assetsHero.technologyCallout.titleLines[1]}</span>
                  </h2>
                  <p>{assetsHero.technologyCallout.description}</p>
                </aside>
              </MotionReveal>
            </div>
          </div>
        </section>

        <section
          className="assets-metrics container-wide"
          aria-label="GemReserve asset metrics and registry"
        >
          <MotionReveal className="assets-metrics__layout">
            <MetricStrip
              metrics={assetMetrics}
              className="assets-metrics__strip"
            />

            <Link
              className="assets-registry-control"
              href={assetRegistryCta.href}
            >
              <LineIcon
                name="certificate"
                size={30}
                className="assets-registry-control__icon"
              />
              <span className="assets-registry-control__copy">
                <strong>{assetRegistryCta.title}</strong>
                <span>{assetRegistryCta.description}</span>
              </span>
              <span
                className="assets-registry-control__arrow"
                aria-hidden="true"
              >
                →
              </span>
            </Link>
          </MotionReveal>
        </section>

        <MotionReveal className="assets-catalog container-wide">
          <GemstoneCatalog />
        </MotionReveal>

        <section
          className="investment-panel assets-investment container-wide"
          aria-labelledby="assets-investment-title"
        >
          <MotionReveal className="investment-heading assets-investment__heading">
            <SectionHeading
              title={investmentSectionHeading}
              id="assets-investment-title"
              align="left"
            />
          </MotionReveal>

          <div className="investment-layout assets-investment__layout">
            <ul className="investment-reasons assets-investment__reasons">
              {investmentReasons.map((reason, index) => (
                <li className="investment-reason" key={reason.id}>
                  <MotionReveal
                    className="investment-reason__inner"
                    delay={index * 65}
                  >
                    <LineIcon
                      name={investmentIcons[reason.id]}
                      size={34}
                      className="investment-reason__icon"
                    />
                    <div className="investment-reason__copy">
                      <h3>{reason.title}</h3>
                      <p>{reason.description}</p>
                    </div>
                  </MotionReveal>
                </li>
              ))}
            </ul>

            <MotionReveal
              className="investment-visual assets-investment__visual"
              delay={120}
            >
              <ImageWithGlow
                src="/images/sections/vault-tray.webp"
                alt="An open black and gold vault displaying colorful polished gemstones"
                className="investment-visual__image assets-investment__image"
                sizes="(max-width: 760px) 92vw, 38vw"
              />
            </MotionReveal>
          </div>
        </section>

        <section
          className="waitlist assets-waitlist"
          aria-labelledby="assets-waitlist-title"
        >
          <div className="waitlist__inner assets-waitlist__inner container-wide">
            <MotionReveal className="waitlist__mark assets-waitlist__mark">
              <LineIcon name="shield-check" size={58} />
            </MotionReveal>

            <MotionReveal
              className="waitlist__copy assets-waitlist__copy"
              delay={60}
            >
              <h2 id="assets-waitlist-title">
                <span>{assetWaitlistCta.titleLines[0]}</span>
                <span>{assetWaitlistCta.titleLines[1]}</span>
              </h2>
              <p>{assetWaitlistCta.description}</p>
            </MotionReveal>

            <MotionReveal
              className="waitlist__action assets-waitlist__action"
              delay={120}
            >
              <Link className="button button--gold" href="/#waitlist">
                {assetWaitlistCta.buttonLabel}
              </Link>
              <p>{assetWaitlistCta.supportingText}</p>
            </MotionReveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
