import type { Metadata } from "next";
import Link from "next/link";

import { LifecycleDiagram } from "@/components/diagrams/LifecycleDiagram";
import { LineIcon } from "@/components/icons/LineIcon";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { TrustPillars } from "@/components/sections/TrustPillars";
import { ImageWithGlow } from "@/components/ui/ImageWithGlow";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { ResponsiveHeroImage } from "@/components/ui/ResponsiveHeroImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  assetLifecycleSectionTitle,
  assetLifecycleStages,
  howItWorksHero,
  powerPillars,
  powerPillarsSectionTitle,
  processSectionTitle,
  processSteps,
  swissCta,
  technologySecurityBullets,
  technologySecuritySectionTitle,
} from "@/content/how-it-works";

export const metadata: Metadata = {
  title: "How GemReserve.io Works",
  description: howItWorksHero.description,
  alternates: { canonical: "/how-it-works" },
  openGraph: {
    title: "How GemReserve.io Works | GemReserve.io",
    description: howItWorksHero.description,
    url: "/how-it-works",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const breadcrumbItems = [
  { label: howItWorksHero.breadcrumb[0], href: "/" },
  { label: howItWorksHero.breadcrumb[1] },
] as const;

const technologyIcons = {
  "blockchain-infrastructure": "network",
  "smart-contracts": "contract",
  "institutional-custody": "vault",
  "data-integrity": "check",
} as const;

export default function HowItWorksPage() {
  return (
    <div className="how-page">
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section className="hero how-hero" aria-labelledby="how-hero-title">
          <div className="hero__media how-hero__media" aria-hidden="true">
            <ResponsiveHeroImage
              desktopBase="/images/heroes/how-hero"
              mobileBase="/images/heroes/how-hero-mobile"
              height={960}
              className="how-hero__image"
            />
            <span className="hero__scrim how-hero__scrim" />
          </div>

          <div className="hero__inner how-hero__inner container-wide">
            <MotionReveal className="hero__copy how-hero__copy">
              <Breadcrumbs items={breadcrumbItems} />
              <h1 className="hero__title how-hero__title" id="how-hero-title">
                <span>{howItWorksHero.titleLines[0]}</span>
                <span className="hero__title-accent">
                  {howItWorksHero.titleLines[1]}
                </span>
                <span>{howItWorksHero.titleLines[2]}</span>
              </h1>
              <div className="how-hero__rule" aria-hidden="true">
                <span />
              </div>
              <p className="hero__description how-hero__description">
                {howItWorksHero.description}
              </p>
            </MotionReveal>
          </div>
        </section>

        <section
          className="how-process container-wide"
          aria-labelledby="how-process-title"
        >
          <MotionReveal>
            <SectionHeading
              title={processSectionTitle}
              id="how-process-title"
            />
          </MotionReveal>
          <MotionReveal className="how-process__timeline" delay={80}>
            <ProcessTimeline steps={processSteps} dense />
          </MotionReveal>
        </section>

        <section
          className="how-power container-wide"
          aria-labelledby="how-power-title"
        >
          <MotionReveal>
            <SectionHeading
              title={powerPillarsSectionTitle}
              id="how-power-title"
            />
          </MotionReveal>
          <MotionReveal className="how-power__pillars" delay={80}>
            <TrustPillars items={powerPillars} className="how-power__grid" />
          </MotionReveal>
        </section>

        <section
          className="how-core container-wide"
          aria-label="Technology, security and asset lifecycle"
        >
          <MotionReveal className="technology-security">
            <SectionHeading
              title={technologySecuritySectionTitle}
              id="technology-security-title"
            />
            <div className="technology-security__body">
              <ul className="technology-security__list">
                {technologySecurityBullets.map((item) => (
                  <li key={item.id}>
                    <LineIcon name={technologyIcons[item.id]} size={38} />
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <ImageWithGlow
                className="technology-security__image"
                src="/images/sections/vault-security.webp"
                alt="A blue gemstone protected inside an institutional vault"
                sizes="(max-width: 820px) 88vw, 31vw"
              />
            </div>
          </MotionReveal>

          <MotionReveal className="technology-lifecycle" delay={90}>
            <SectionHeading
              title={assetLifecycleSectionTitle}
              id="asset-lifecycle-title"
            />
            <LifecycleDiagram stages={assetLifecycleStages} />
          </MotionReveal>
        </section>

        <section
          className="swiss-cta container-wide"
          aria-labelledby="swiss-cta-title"
        >
          <MotionReveal className="swiss-cta__visual">
            <ImageWithGlow
              className="swiss-cta__image"
              src="/images/sections/swiss-matterhorn.webp"
              alt="The Swiss flag before a snow-covered Matterhorn"
              sizes="(max-width: 760px) 92vw, 34vw"
            />
          </MotionReveal>

          <MotionReveal className="swiss-cta__copy" delay={70}>
            <h2 id="swiss-cta-title">{swissCta.heading}</h2>
            <p>{swissCta.description}</p>
          </MotionReveal>

          <MotionReveal className="swiss-cta__action" delay={130}>
            <Link className="button button--outline" href="/#waitlist">
              {swissCta.actionLabel}
            </Link>
            <p>{swissCta.supportingText}</p>
          </MotionReveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
