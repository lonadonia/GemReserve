import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { LineIcon, type IconName } from "@/components/icons/LineIcon";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ImageWithGlow } from "@/components/ui/ImageWithGlow";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { PassportExplorer } from "@/components/ui/PassportExplorer";
import { PassportVerifier } from "@/components/ui/PassportVerifier";
import { ResponsiveHeroImage } from "@/components/ui/ResponsiveHeroImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  benefitsTitle,
  insidePassportActionLabel,
  insidePassportSampleAlt,
  insidePassportSampleName,
  insidePassportSampleNote,
  insidePassportSampleSpecies,
  insidePassportTitle,
  passportBenefits,
  passportPillars,
  passportSections,
  passportsCta,
  passportsHero,
  validationSample,
  validationTitle,
  verifyCameraLabel,
  verifyDividerLabel,
  verifyIntro,
  verifyPlaceholder,
  verifySubmitLabel,
  verifyTitle,
  whatIsIntro,
  whatIsTitle,
} from "@/content/passports";

export const metadata: Metadata = {
  title: "Digital Asset Passports",
  description: passportsHero.description,
  alternates: { canonical: "/digital-asset-passports" },
  openGraph: {
    title: "Digital Asset Passports | GemReserve.io",
    description: passportsHero.description,
    url: "/digital-asset-passports",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const breadcrumbItems = [
  { label: passportsHero.breadcrumb[0], href: "/" },
  { label: passportsHero.breadcrumb[1], href: "/technology" },
  { label: passportsHero.breadcrumb[2] },
] as const;

const badgeIcons: Record<string, IconName> = {
  unique: "shield-check",
  transparency: "search",
  "tamper-proof": "cubes",
  instant: "globe",
  accessible: "refresh",
};

const pillarIcons: Record<string, IconName> = {
  "unique-id": "diamond",
  "complete-record": "contract",
  "blockchain-secured": "cubes",
  lifecycle: "shield-check",
  "global-standard": "globe",
};

const benefitIcons: Record<string, IconName> = {
  trust: "shield-check",
  value: "chart",
  risk: "lock",
  trade: "trade",
  insurance: "certificate",
  liquidity: "globe",
};

const cardFieldIcons: Record<string, IconName> = {
  weight: "diamond",
  shape: "hand-gem",
  origin: "mountain",
  treatment: "refresh",
  clarity: "eye",
  color: "source",
  issued: "certificate",
};

export default function DigitalAssetPassportsPage() {
  return (
    <div className="passports-page">
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section
          className="hero passports-hero"
          aria-labelledby="passports-hero-title"
        >
          <div className="hero__media" aria-hidden="true">
            <ResponsiveHeroImage
              desktopBase="/images/heroes/passports-hero"
              mobileBase="/images/heroes/passports-hero-mobile"
            />
            <span className="hero__scrim passports-hero__scrim" />
          </div>

          <div className="hero__inner passports-hero__inner container-wide">
            <MotionReveal className="passports-hero__breadcrumb">
              <Breadcrumbs items={breadcrumbItems} />
            </MotionReveal>

            <div className="passports-hero__layout">
              <MotionReveal className="hero__copy passports-hero__copy">
                <h1 className="hero__title" id="passports-hero-title">
                  <span>{passportsHero.titleLines[0]}</span>
                  <span className="hero__title-accent">
                    {passportsHero.titleLines[1]}
                  </span>
                </h1>
                <p className="passports-hero__tagline">
                  {passportsHero.tagline}
                </p>
                <p className="hero__description">{passportsHero.description}</p>
              </MotionReveal>

              <MotionReveal className="passport-card" delay={120}>
                <aside aria-labelledby="passports-hero-card-title">
                  <header>
                    <p className="passport-card__eyebrow">
                      <LineIcon name="passport" size={17} />
                      {passportsHero.card.eyebrow}
                    </p>
                    <p className="passport-card__id">
                      <span>{passportsHero.card.idLabel}</span>
                      <strong>{passportsHero.card.id}</strong>
                    </p>
                  </header>

                  <Image
                    className="passport-card__stone"
                    src="/images/sections/ruby-cushion.webp"
                    alt={passportsHero.card.imageAlt}
                    width={460}
                    height={460}
                    sizes="(max-width: 980px) 40vw, 168px"
                  />

                  <h2 id="passports-hero-card-title">
                    {passportsHero.card.name}
                  </h2>
                  <p className="passport-card__species">
                    {passportsHero.card.species}
                  </p>

                  <dl className="passport-card__fields">
                    {passportsHero.card.fields.map((field) => (
                      <div key={field.id}>
                        <dt>
                          <LineIcon name={cardFieldIcons[field.id]} size={15} />
                          {field.label}
                        </dt>
                        <dd>{field.value}</dd>
                      </div>
                    ))}
                  </dl>

                  <footer>
                    <span className="passport-card__qr" aria-hidden="true">
                      <LineIcon name="cubes" size={26} />
                    </span>
                    <span className="passport-card__scan">
                      {passportsHero.card.scanNote}
                    </span>
                    <span className="passport-card__sample">
                      {passportsHero.card.sampleNote}
                    </span>
                  </footer>
                </aside>
              </MotionReveal>
            </div>

            <MotionReveal className="passports-hero__badges" delay={170}>
              <ul>
                {passportsHero.badges.map((badge) => (
                  <li key={badge.id}>
                    <LineIcon name={badgeIcons[badge.id]} size={28} />
                    <h2>{badge.title}</h2>
                    <p>{badge.description}</p>
                  </li>
                ))}
              </ul>
            </MotionReveal>
          </div>
        </section>

        <section
          className="passports-what container-wide"
          aria-labelledby="passports-what-title"
        >
          <MotionReveal>
            <SectionHeading title={whatIsTitle} id="passports-what-title" />
          </MotionReveal>

          <MotionReveal className="passports-what__panel" delay={80}>
            <div className="passports-what__intro">
              <p>{whatIsIntro}</p>
            </div>
            <ul className="passports-what__grid">
              {passportPillars.map((pillar) => (
                <li key={pillar.id}>
                  <LineIcon name={pillarIcons[pillar.id]} size={36} />
                  <h3>{pillar.title}</h3>
                  <p>{pillar.description}</p>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="passports-inside container-wide"
          aria-label="Inside a passport, and how one is verified"
        >
          <MotionReveal className="passports-inside__main">
            <SectionHeading
              title={insidePassportTitle}
              id="passports-inside-title"
            />
            <PassportExplorer
              sections={passportSections}
              name={insidePassportSampleName}
              species={insidePassportSampleSpecies}
              imageSrc="/images/sections/emerald-cut.webp"
              imageAlt={insidePassportSampleAlt}
              sampleNote={insidePassportSampleNote}
              actionLabel={insidePassportActionLabel}
            />
          </MotionReveal>

          <div className="passports-inside__aside">
            <MotionReveal className="passports-card" delay={70}>
              <h2 className="passports-card__title">{verifyTitle}</h2>
              <p className="passports-card__intro">{verifyIntro}</p>
              <PassportVerifier
                placeholder={verifyPlaceholder}
                submitLabel={verifySubmitLabel}
                dividerLabel={verifyDividerLabel}
                cameraLabel={verifyCameraLabel}
              />
            </MotionReveal>

            <MotionReveal className="passports-card" delay={140}>
              <h2 className="passports-card__title">{validationTitle}</h2>
              <div className="passport-validation">
                <span className="passport-validation__mark" aria-hidden="true">
                  <LineIcon name="check" size={22} />
                </span>
                <div>
                  <p className="passport-validation__status">
                    {validationSample.status}
                  </p>
                  <p>{validationSample.description}</p>
                </div>
              </div>
              <dl className="passport-validation__fields">
                {validationSample.fields.map((field) => (
                  <div key={field.id}>
                    <dt>{field.label}</dt>
                    <dd>{field.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="passport-validation__foot">
                <span aria-hidden="true">{validationSample.actionLabel}</span>
                <em>{validationSample.sampleNote}</em>
              </p>
            </MotionReveal>
          </div>
        </section>

        <section
          className="passports-benefits container-wide"
          aria-labelledby="passports-benefits-title"
        >
          <MotionReveal>
            <SectionHeading
              title={benefitsTitle}
              id="passports-benefits-title"
            />
          </MotionReveal>
          <MotionReveal delay={80}>
            <ul className="trust-pillars passports-benefits__grid">
              {passportBenefits.map((benefit) => (
                <li key={benefit.id}>
                  <LineIcon name={benefitIcons[benefit.id]} size={36} />
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="trust-cta passports-cta container-wide"
          aria-labelledby="passports-cta-title"
        >
          <MotionReveal className="trust-cta__visual">
            <ImageWithGlow
              className="trust-cta__image"
              src="/images/sections/open-vault.webp"
              alt={passportsCta.imageAlt}
              sizes="(max-width: 760px) 100vw, 30vw"
            />
          </MotionReveal>

          <MotionReveal className="trust-cta__copy" delay={70}>
            <h2 id="passports-cta-title">
              <span>{passportsCta.titleLines[0]}</span>
              <span>{passportsCta.titleLines[1]}</span>
            </h2>
            <p>{passportsCta.description}</p>
          </MotionReveal>

          <MotionReveal className="trust-cta__action" delay={130}>
            <Link className="button button--gold" href="/#waitlist">
              {passportsCta.buttonLabel}
            </Link>
            <p>{passportsCta.supportingText}</p>
          </MotionReveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
