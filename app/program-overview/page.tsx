import type { Metadata } from "next";
import Image from "next/image";
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
  overviewCta,
  overviewHero,
  overviewMarks,
  overviewMission,
  overviewModel,
  overviewUniquePoints,
  overviewUniqueTitle,
} from "@/content/program-overview";

export const metadata: Metadata = {
  title: "Program Overview",
  description: overviewHero.description,
  alternates: { canonical: "/program-overview" },
  openGraph: {
    title: "Program Overview | GemReserve.io",
    description: overviewHero.description,
    url: "/program-overview",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const breadcrumbItems = [
  { label: overviewHero.breadcrumb[0], href: "/" },
  { label: overviewHero.breadcrumb[1] },
] as const;

const markIcons: Record<string, IconName> = {
  "tangible-value": "diamond",
  "secure-compliant": "shield-check",
  "global-access": "globe",
  "built-for-growth": "chart",
};

const valueIcons: Record<string, IconName> = {
  integrity: "scales",
  innovation: "lightbulb",
  excellence: "award",
  trust: "handshake",
};

const modelIcons: Record<string, IconName> = {
  source: "diamond",
  custody: "shield-check",
  tokenize: "cubes",
  distribute: "user",
};

const uniqueIcons: Record<string, IconName> = {
  "real-asset-backing": "diamond",
  "verifiable-authenticity": "fingerprint",
  "institutional-security": "lock",
  "liquidity-access": "droplet",
  transparency: "pie",
  "global-community": "globe-user",
};

export default function ProgramOverviewPage() {
  return (
    <div className="overview-page">
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section
          className="hero overview-hero"
          aria-labelledby="overview-hero-title"
        >
          <div className="hero__media" aria-hidden="true">
            <ResponsiveHeroImage
              desktopBase="/images/heroes/overview-hero"
              mobileBase="/images/heroes/overview-hero-mobile"
            />
            <span className="hero__scrim overview-hero__scrim" />
          </div>

          <div className="hero__inner container-wide">
            <MotionReveal className="hero__copy">
              <Breadcrumbs items={breadcrumbItems} />
              <h1 className="hero__title" id="overview-hero-title">
                <span>{overviewHero.titleLines[0]}</span>
                <span className="hero__title-accent">
                  {overviewHero.titleLines[1]}
                </span>
              </h1>
              <p className="overview-hero__tagline">
                <span>{overviewHero.taglineLines[0]}</span>
                <span>{overviewHero.taglineLines[1]}</span>
              </p>
              <p className="hero__description">{overviewHero.description}</p>
            </MotionReveal>

            {/* The board stands a crest card at the right of the plate. It is
                drawn rather than photographed so the wordmark stays crisp at
                every width and the card can reflow on a phone. */}
            <MotionReveal className="overview-hero__crest" delay={120}>
              <aside aria-label="GemReserve.io">
                <Image
                  className="overview-hero__crest-mark"
                  src="/brand/gemreserve-shield-512.png"
                  alt=""
                  width={512}
                  height={622}
                  aria-hidden="true"
                />
                <p className="overview-hero__crest-wordmark">
                  {overviewHero.crest.wordmark}
                </p>
                <p className="overview-hero__crest-lines">
                  {overviewHero.crest.lines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </p>
                <p className="overview-hero__crest-motto">
                  {overviewHero.crest.motto}
                </p>
              </aside>
            </MotionReveal>
          </div>
        </section>

        <section
          className="overview-marks container-wide"
          aria-label="What the program is built on"
        >
          <MotionReveal>
            <ul className="trust-pillars overview-marks__row">
              {overviewMarks.map((mark) => (
                <li key={mark.id}>
                  <LineIcon name={markIcons[mark.id]} size={38} />
                  <h2>{mark.title}</h2>
                  <p>{mark.description}</p>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="overview-detail container-wide"
          aria-labelledby="overview-mission-title"
        >
          <MotionReveal className="overview-card">
            <h2 className="overview-card__title" id="overview-mission-title">
              {overviewMission.title}
            </h2>
            <p className="overview-card__statement">
              {overviewMission.statement}
            </p>
            <ul className="overview-values">
              {overviewMission.values.map((value) => (
                <li key={value.id}>
                  <LineIcon name={valueIcons[value.id]} size={30} />
                  <div>
                    <h3>{value.title}</h3>
                    <p>{value.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </MotionReveal>

          <MotionReveal className="overview-card" delay={90}>
            <h2 className="overview-card__title" id="overview-model-title">
              {overviewModel.title}
            </h2>
            <p className="overview-card__statement">
              {overviewModel.statement}
            </p>
            <ol
              className="overview-model"
              aria-labelledby="overview-model-title"
            >
              {overviewModel.steps.map((step) => (
                <li key={step.id}>
                  <span className="overview-model__mark" aria-hidden="true">
                    <LineIcon name={modelIcons[step.id]} size={28} />
                  </span>
                  <span className="overview-model__number" aria-hidden="true">
                    {step.step}
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
          </MotionReveal>
        </section>

        <section
          className="overview-unique container-wide"
          aria-labelledby="overview-unique-title"
        >
          <MotionReveal>
            <SectionHeading
              title={overviewUniqueTitle}
              id="overview-unique-title"
            />
          </MotionReveal>
          <MotionReveal delay={80}>
            <ul className="trust-pillars overview-unique__grid">
              {overviewUniquePoints.map((point) => (
                <li key={point.id}>
                  <LineIcon name={uniqueIcons[point.id]} size={38} />
                  <h3>{point.title}</h3>
                  <p>{point.description}</p>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="trust-cta overview-cta container-wide"
          aria-labelledby="overview-cta-title"
        >
          <MotionReveal className="trust-cta__visual">
            <ImageWithGlow
              className="trust-cta__image"
              src="/images/sections/vault-tray.webp"
              alt={overviewCta.imageAlt}
              sizes="(max-width: 760px) 100vw, 28vw"
            />
          </MotionReveal>

          <MotionReveal className="trust-cta__copy" delay={70}>
            <h2 id="overview-cta-title">
              <span>{overviewCta.titleLines[0]}</span>
              <span>{overviewCta.titleLines[1]}</span>
            </h2>
            <p>{overviewCta.description}</p>
            <p className="overview-cta__motto">{overviewCta.motto}</p>
          </MotionReveal>

          <MotionReveal className="trust-cta__action" delay={130}>
            <p className="overview-cta__invitation">{overviewCta.invitation}</p>
            <Link className="button button--gold" href="/early-participation">
              {overviewCta.buttonLabel}
            </Link>
            <p>{overviewCta.supportingText}</p>
          </MotionReveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
