import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { LineIcon } from "@/components/icons/LineIcon";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { TrustPillars } from "@/components/sections/TrustPillars";
import { ImageWithGlow } from "@/components/ui/ImageWithGlow";
import { MetricStrip } from "@/components/ui/MetricStrip";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { ResponsiveHeroImage } from "@/components/ui/ResponsiveHeroImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WaitlistForm } from "@/components/ui/WaitlistForm";
import {
  homeCatalogPreviewActionLabel,
  homeCatalogPreviewItems,
  homeCatalogPreviewSectionTitle,
  homeHero,
  homeMetrics,
  homeProcessSectionTitle,
  homeProcessSteps,
  homeTrustPillars,
  homeWaitlistCta,
} from "@/content/home";

export const metadata: Metadata = {
  title: "Real Gems. Real Value. Real Trust. | GemReserve.io",
  description: homeHero.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: "GemReserve.io | Real Gems. Real Value. Real Trust.",
    description: homeHero.description,
    url: "/",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function HomePage() {
  return (
    <div className="home">
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section className="hero home-hero" aria-labelledby="home-hero-title">
          <div className="hero__media" aria-hidden="true">
            <ResponsiveHeroImage
              desktopBase="/images/heroes/home-hero"
              mobileBase="/images/heroes/home-hero-mobile"
            />
            <span className="hero__scrim" />
          </div>

          <div className="hero__inner container-wide">
            <MotionReveal className="hero__copy">
              <p className="hero__eyebrow eyebrow">{homeHero.eyebrow}</p>
              <h1 className="hero__title" id="home-hero-title">
                <span>{homeHero.titleLines[0]}</span>
                <span>{homeHero.titleLines[1]}</span>
                <span className="hero__title-accent">
                  {homeHero.titleLines[2]}
                </span>
              </h1>
              <p className="hero__description">{homeHero.description}</p>
              <div className="hero__actions">
                <Link className="button button--gold" href="/assets">
                  {homeHero.primaryActionLabel}
                </Link>
                <Link className="button button--outline" href="/how-it-works">
                  {homeHero.secondaryActionLabel}
                  <span className="hero__action-icon" aria-hidden="true">
                    →
                  </span>
                </Link>
              </div>
            </MotionReveal>

            <MotionReveal className="hero__brand" delay={120}>
              <Image
                className="hero__shield"
                src="/brand/gemreserve-shield.svg"
                alt=""
                width={300}
                height={352}
                priority
                sizes="(max-width: 720px) 46vw, 300px"
              />
              <p className="hero__brand-name">{homeHero.brandName}</p>
              <p className="hero__brand-tagline">{homeHero.brandTagline}</p>
            </MotionReveal>
          </div>
        </section>

        <section
          className="home-trust container-wide"
          aria-label="GemReserve trust pillars"
        >
          <h2 className="sr-only">GemReserve trust pillars</h2>
          <MotionReveal>
            <TrustPillars
              items={homeTrustPillars}
              className="home-trust__grid"
            />
          </MotionReveal>
        </section>

        <section
          className="home-process container-wide"
          aria-labelledby="home-process-title"
        >
          <MotionReveal>
            <SectionHeading
              title={homeProcessSectionTitle}
              id="home-process-title"
            />
          </MotionReveal>
          <MotionReveal className="home-process__timeline" delay={90}>
            <ProcessTimeline steps={homeProcessSteps} dense />
          </MotionReveal>
        </section>

        <section
          className="catalog-preview container-wide"
          aria-labelledby="catalog-preview-title"
        >
          <MotionReveal>
            <SectionHeading
              title={homeCatalogPreviewSectionTitle}
              id="catalog-preview-title"
            />
          </MotionReveal>

          <div className="catalog-preview__grid">
            {homeCatalogPreviewItems.map((item, index) => (
              <MotionReveal
                className="catalog-preview__reveal"
                delay={index * 55}
                key={item.id}
              >
                <article className="catalog-preview__card">
                  <ImageWithGlow
                    className="catalog-preview__image"
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    sizes="(max-width: 560px) 86vw, (max-width: 900px) 44vw, 16vw"
                  />
                  <div className="catalog-preview__content">
                    <h3>{item.name}</h3>
                    <p>{item.descriptor}</p>
                    <button
                      className="button button--outline catalog-preview__details"
                      type="button"
                      disabled
                      aria-disabled="true"
                      title="Gemstone detail pages are coming in a future phase"
                    >
                      {item.actionLabel}
                    </button>
                  </div>
                </article>
              </MotionReveal>
            ))}
          </div>

          <MotionReveal className="catalog-preview__all" delay={120}>
            <Link className="button button--outline" href="/assets">
              <LineIcon name="diamond" size={17} />
              {homeCatalogPreviewActionLabel}
            </Link>
          </MotionReveal>
        </section>

        <section
          className="home-metrics container-wide"
          aria-label="GemReserve platform metrics"
        >
          <MotionReveal>
            <MetricStrip
              metrics={homeMetrics}
              className="home-metrics__strip"
            />
          </MotionReveal>
        </section>

        <section
          className="waitlist home-waitlist"
          id="waitlist"
          aria-labelledby="waitlist-title"
        >
          <div className="waitlist__inner container-wide">
            <MotionReveal className="waitlist__visual">
              <ImageWithGlow
                src="/images/sections/vault-tray.webp"
                alt="An open black and gold vault tray displaying colorful polished gemstones"
                className="waitlist__image"
                sizes="(max-width: 760px) 88vw, 28vw"
              />
            </MotionReveal>

            <MotionReveal className="waitlist__copy" delay={80}>
              <p className="waitlist__eyebrow eyebrow">
                {homeWaitlistCta.eyebrow}
              </p>
              <h2 id="waitlist-title">
                <span>{homeWaitlistCta.titleLines[0]}</span>
                <span>{homeWaitlistCta.titleLines[1]}</span>
              </h2>
              <p>{homeWaitlistCta.description}</p>
            </MotionReveal>

            <MotionReveal className="waitlist__form" delay={150}>
              <WaitlistForm
                placeholder={homeWaitlistCta.emailPlaceholder}
                buttonLabel={homeWaitlistCta.actionLabel}
                compact
              />
            </MotionReveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
