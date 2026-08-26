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
  acquisitionAssurance,
  acquisitionCta,
  acquisitionHero,
  acquisitionMarks,
  acquisitionOptions,
  acquisitionOptionsTitle,
  acquisitionPayments,
  acquisitionProcessTitle,
  acquisitionSteps,
  acquisitionWhy,
} from "@/content/token-acquisition";

export const metadata: Metadata = {
  title: "How Token Acquisition Will Work",
  description: acquisitionHero.paragraphs[0],
  alternates: { canonical: "/token-acquisition" },
  openGraph: {
    title: "How Token Acquisition Will Work | GemReserve.io",
    description: acquisitionHero.paragraphs[0],
    url: "/token-acquisition",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const breadcrumbItems = [
  { label: acquisitionHero.breadcrumb[0], href: "/" },
  { label: acquisitionHero.breadcrumb[1] },
] as const;

const markIcons: Record<string, IconName> = {
  "real-asset-backed": "shield-check",
  "secure-compliant": "lock",
  "transparent-process": "search",
  "global-access": "globe",
  "liquid-transferable": "coins",
};

const stepIcons: Record<string, IconName> = {
  join: "user",
  invitation: "envelope",
  kyc: "user-check",
  connect: "wallet",
  fund: "dollar-circle",
  acquire: "diamond",
};

const optionIcons: Record<string, IconName> = {
  "early-participation-sale": "lock-clock",
  "public-sale": "rocket",
  "secondary-market": "exchange",
};

const reasonIcons: Record<string, IconName> = {
  "real-value": "globe",
  "built-for-trust": "network",
  "every-investor": "users",
  "future-ready": "compass",
};

const railIcons: Record<string, IconName> = {
  "bank-transfer": "bank",
  "fiat-on-ramp": "dollar-circle",
};

export default function TokenAcquisitionPage() {
  return (
    <div className="acquisition-page">
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section
          className="hero acquisition-hero"
          aria-labelledby="acquisition-hero-title"
        >
          <div className="hero__media" aria-hidden="true">
            <ResponsiveHeroImage
              desktopBase="/images/heroes/acquisition-hero"
              mobileBase="/images/heroes/acquisition-hero-mobile"
            />
            <span className="hero__scrim acquisition-hero__scrim" />
          </div>

          <div className="hero__inner container-wide">
            <MotionReveal className="hero__copy">
              <Breadcrumbs items={breadcrumbItems} />
              <h1 className="hero__title" id="acquisition-hero-title">
                <span>{acquisitionHero.titleLines[0]}</span>
                <span className="hero__title-accent">
                  {acquisitionHero.titleLines[1]}
                </span>
                <span>{acquisitionHero.titleLines[2]}</span>
              </h1>
              <p className="acquisition-hero__tagline">
                {acquisitionHero.tagline}
              </p>
              {acquisitionHero.paragraphs.map((paragraph) => (
                <p className="hero__description" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </MotionReveal>
          </div>
        </section>

        <section
          className="acquisition-marks container-wide"
          aria-label="What the acquisition process guarantees"
        >
          <MotionReveal>
            <ul className="trust-pillars acquisition-marks__row">
              {acquisitionMarks.map((mark) => (
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
          className="acquisition-process container-wide"
          aria-labelledby="acquisition-process-title"
        >
          <MotionReveal>
            <SectionHeading
              title={acquisitionProcessTitle}
              id="acquisition-process-title"
            />
          </MotionReveal>

          {/* The board draws six steps of a live purchase flow. The platform is
              pre-launch, so the notice states that plainly above the steps
              rather than letting the diagram imply a working checkout. */}
          <MotionReveal delay={60}>
            <p className="acquisition-notice" role="note">
              <LineIcon name="eye" size={22} />
              <span>{acquisitionHero.notice}</span>
            </p>
          </MotionReveal>

          <MotionReveal delay={110}>
            <ol className="acquisition-steps">
              {acquisitionSteps.map((step) => (
                <li key={step.id}>
                  <span className="acquisition-steps__mark" aria-hidden="true">
                    <LineIcon name={stepIcons[step.id]} size={32} />
                  </span>
                  <span
                    className="acquisition-steps__number"
                    aria-hidden="true"
                  >
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
          className="acquisition-options container-wide"
          aria-labelledby="acquisition-options-title"
        >
          <MotionReveal>
            <SectionHeading
              title={acquisitionOptionsTitle}
              id="acquisition-options-title"
            />
          </MotionReveal>

          <MotionReveal delay={80}>
            <ul className="acquisition-options__grid">
              {acquisitionOptions.map((option) => (
                <li className="acquisition-option" key={option.id}>
                  <span className="acquisition-option__mark" aria-hidden="true">
                    <LineIcon name={optionIcons[option.id]} size={34} />
                  </span>
                  <div>
                    <h3>{option.title}</h3>
                    <p>{option.description}</p>
                  </div>
                  <ul className="acquisition-option__points">
                    {option.points.map((point) => (
                      <li key={point}>
                        <LineIcon name="check" size={16} />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="acquisition-detail container-wide"
          aria-labelledby="acquisition-why-title"
        >
          <MotionReveal className="acquisition-card">
            <h2 className="acquisition-card__title" id="acquisition-why-title">
              {acquisitionWhy.title}
            </h2>
            <ul className="acquisition-reasons">
              {acquisitionWhy.reasons.map((reason) => (
                <li key={reason.id}>
                  <LineIcon name={reasonIcons[reason.id]} size={30} />
                  <div>
                    <h3>{reason.title}</h3>
                    <p>{reason.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </MotionReveal>

          <MotionReveal className="acquisition-card" delay={80}>
            <h2
              className="acquisition-card__title"
              id="acquisition-payments-title"
            >
              {acquisitionPayments.title}
            </h2>
            <p className="acquisition-card__intro">
              {acquisitionPayments.intro}
            </p>
            <ul
              className="acquisition-tokens"
              aria-labelledby="acquisition-payments-title"
            >
              {acquisitionPayments.tokens.map((token) => (
                <li key={token.id}>
                  <span
                    className="acquisition-tokens__disc"
                    style={{ background: token.swatch }}
                    aria-hidden="true"
                  >
                    {token.glyph}
                  </span>
                  <span className="acquisition-tokens__symbol">
                    {token.symbol}
                  </span>
                  {token.networks ? (
                    <span className="acquisition-tokens__networks">
                      {token.networks}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
            <ul className="acquisition-rails">
              {acquisitionPayments.rails.map((rail) => (
                <li key={rail.id}>
                  <LineIcon name={railIcons[rail.id]} size={28} />
                  <div>
                    <h3>{rail.title}</h3>
                    <p>{rail.note}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="acquisition-card__footnote">
              {acquisitionPayments.footnote}
            </p>
          </MotionReveal>

          <MotionReveal className="acquisition-card" delay={140}>
            <h2
              className="acquisition-card__title"
              id="acquisition-assurance-title"
            >
              {acquisitionAssurance.title}
            </h2>
            <ImageWithGlow
              className="acquisition-card__image"
              src="/images/sections/security-vault.webp"
              alt={acquisitionAssurance.imageAlt}
              sizes="(max-width: 980px) 90vw, 30vw"
            />
            <ul
              className="acquisition-checks"
              aria-labelledby="acquisition-assurance-title"
            >
              {acquisitionAssurance.points.map((point) => (
                <li key={point}>
                  <LineIcon name="check" size={17} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="trust-cta acquisition-cta container-wide"
          aria-labelledby="acquisition-cta-title"
        >
          <MotionReveal className="trust-cta__visual">
            <ImageWithGlow
              className="trust-cta__image"
              src="/images/sections/vault-tray.webp"
              alt={acquisitionCta.imageAlt}
              sizes="(max-width: 760px) 100vw, 28vw"
            />
          </MotionReveal>

          <MotionReveal className="trust-cta__copy" delay={70}>
            <h2 id="acquisition-cta-title">
              <span>{acquisitionCta.titleLines[0]}</span>
              <span>{acquisitionCta.titleLines[1]}</span>
            </h2>
            <p className="acquisition-cta__tagline">{acquisitionCta.tagline}</p>
          </MotionReveal>

          <MotionReveal className="trust-cta__action" delay={130}>
            <Link className="button button--gold" href="/early-participation">
              {acquisitionCta.buttonLabel}
            </Link>
            <p>{acquisitionCta.supportingText}</p>
          </MotionReveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
