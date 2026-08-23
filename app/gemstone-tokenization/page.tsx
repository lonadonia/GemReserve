import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { ProceedsDonut } from "@/components/diagrams/ProceedsDonut";
import { LineIcon, type IconName } from "@/components/icons/LineIcon";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { ImageWithGlow } from "@/components/ui/ImageWithGlow";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { ResponsiveHeroImage } from "@/components/ui/ResponsiveHeroImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  proofOfReserves,
  proofOfReservesTitle,
  tokenizationCta,
  tokenizationExample,
  tokenizationExampleTitle,
  tokenizationHero,
  tokenizationProcess,
  tokenizationProcessTitle,
  tokenizationReasons,
  tokenizationStandards,
  tokenizationStandardsTitle,
  tokenizationWhyTitle,
} from "@/content/tokenization";

export const metadata: Metadata = {
  title: "Gemstone Tokenization",
  description: tokenizationHero.description,
  alternates: { canonical: "/gemstone-tokenization" },
  openGraph: {
    title: "Gemstone Tokenization | GemReserve.io",
    description: tokenizationHero.description,
    url: "/gemstone-tokenization",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const breadcrumbItems = [
  { label: tokenizationHero.breadcrumb[0], href: "/" },
  { label: tokenizationHero.breadcrumb[1], href: "/technology" },
  { label: tokenizationHero.breadcrumb[2] },
] as const;

const badgeIcons: Record<string, IconName> = {
  "real-assets": "diamond",
  "on-chain": "network",
  fractional: "users",
  liquidity: "globe",
};

const reasonIcons: Record<string, IconName> = {
  "true-ownership": "diamond",
  "affordable-access": "cubes",
  transparency: "eye",
  "global-market": "globe",
  preserve: "shield-check",
};

const standardIcons: Record<string, IconName> = {
  erc20: "network",
  "asset-backed": "shield-check",
  audited: "contract",
  "kyc-aml": "passport",
  regulatory: "certificate",
  "data-integrity": "cubes",
};

const proofIcons: Record<string, IconName> = {
  "on-chain-verification": "cubes",
  "regular-audits": "contract",
  "third-party-reports": "certificate",
  "real-time-updates": "refresh",
  "full-transparency": "eye",
};

export default function GemstoneTokenizationPage() {
  return (
    <div className="tokenization-page">
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section
          className="hero tokenization-hero"
          aria-labelledby="tokenization-hero-title"
        >
          <div className="hero__media" aria-hidden="true">
            <ResponsiveHeroImage
              desktopBase="/images/heroes/tokenization-hero"
              mobileBase="/images/heroes/tokenization-hero-mobile"
            />
            <span className="hero__scrim tokenization-hero__scrim" />
          </div>

          <div className="hero__inner tokenization-hero__inner container-wide">
            <MotionReveal className="hero__copy tokenization-hero__copy">
              <Breadcrumbs items={breadcrumbItems} />
              <h1 className="hero__title" id="tokenization-hero-title">
                <span>{tokenizationHero.titleLines[0]}</span>
                <span className="hero__title-accent">
                  {tokenizationHero.titleLines[1]}
                </span>
              </h1>
              <div className="tokenization-hero__rule" aria-hidden="true">
                <span />
                <em>◆</em>
                <span />
              </div>
              <p className="hero__description">
                {tokenizationHero.description}
              </p>

              <ul className="tokenization-hero__badges">
                {tokenizationHero.badges.map((badge) => (
                  <li key={badge.id}>
                    <LineIcon name={badgeIcons[badge.id]} size={26} />
                    <span>{badge.title}</span>
                  </li>
                ))}
              </ul>
            </MotionReveal>

            <MotionReveal
              className="hero-callout tokenization-hero__callout"
              delay={120}
            >
              <aside aria-labelledby="tokenization-token-card-title">
                <Image
                  className="hero-callout__crest"
                  src="/brand/gemreserve-shield-512.png"
                  alt=""
                  width={512}
                  height={622}
                  aria-hidden="true"
                />
                <h2
                  className="hero-callout__title"
                  id="tokenization-token-card-title"
                >
                  {tokenizationHero.tokenCard.title}
                </h2>
                <p className="token-card__reference">
                  {tokenizationHero.tokenCard.reference}
                </p>
                <p>{tokenizationHero.tokenCard.meaning}</p>
                <p className="token-card__backing">
                  {tokenizationHero.tokenCard.backing}
                </p>
                <ul className="token-card__assurances">
                  {tokenizationHero.tokenCard.assurances.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </aside>
            </MotionReveal>
          </div>
        </section>

        <section
          className="tokenization-process container-wide"
          aria-labelledby="tokenization-process-title"
        >
          <MotionReveal>
            <SectionHeading
              title={tokenizationProcessTitle}
              id="tokenization-process-title"
            />
          </MotionReveal>
          <MotionReveal delay={80}>
            <ProcessTimeline steps={tokenizationProcess} dense />
          </MotionReveal>
        </section>

        <section
          className="tokenization-detail container-wide"
          aria-labelledby="tokenization-why-title"
        >
          <MotionReveal className="tech-detail__card tokenization-why">
            <h2 className="tech-detail__title" id="tokenization-why-title">
              {tokenizationWhyTitle}
            </h2>
            <ul className="tech-detail__list">
              {tokenizationReasons.map((reason) => (
                <li key={reason.id}>
                  <LineIcon name={reasonIcons[reason.id]} size={26} />
                  <div>
                    <h3>{reason.title}</h3>
                    <p>{reason.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </MotionReveal>

          <MotionReveal className="tech-detail__card" delay={70}>
            <h2 className="tech-detail__title tech-detail__title--center">
              {tokenizationStandardsTitle}
            </h2>
            <ul className="tokenization-standards">
              {tokenizationStandards.map((standard) => (
                <li key={standard.id}>
                  <LineIcon name={standardIcons[standard.id]} size={30} />
                  <div>
                    <h3>{standard.title}</h3>
                    <p>{standard.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="tokenization-example container-wide"
          aria-labelledby="tokenization-example-title"
        >
          <MotionReveal>
            <SectionHeading
              title={tokenizationExampleTitle}
              id="tokenization-example-title"
            />
          </MotionReveal>

          <MotionReveal className="tokenization-example__panel" delay={80}>
            <div className="tokenization-example__stone">
              <Image
                src="/images/sections/emerald-cut.webp"
                alt={tokenizationExample.imageAlt}
                width={560}
                height={560}
                sizes="(max-width: 980px) 40vw, 210px"
              />
            </div>

            <div className="tokenization-example__facts">
              <p className="eyebrow">{tokenizationExample.eyebrow}</p>
              <h3>
                {tokenizationExample.name} — {tokenizationExample.reference}
              </h3>
              <dl className="tokenization-example__attributes">
                {tokenizationExample.attributes.map((attribute) => (
                  <div key={attribute.id}>
                    <dt>{attribute.label}</dt>
                    <dd>{attribute.value}</dd>
                  </div>
                ))}
              </dl>
              <dl className="tokenization-example__custody">
                {tokenizationExample.custody.map((row) => (
                  <div key={row.id}>
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="tokenization-example__supply">
                {tokenizationExample.supplyLabel}
              </p>
              <p className="tokenization-example__unit">
                {tokenizationExample.unitLabel}
              </p>
            </div>

            <div className="tokenization-example__allocation">
              <h4>{tokenizationExample.allocationTitle}</h4>
              <ProceedsDonut slices={tokenizationExample.allocation} />
            </div>

            <div className="tokenization-example__passport">
              <h4>{tokenizationExample.passportTitle}</h4>
              <div className="tokenization-example__passport-body">
                <Image
                  src="/images/sections/asset-passport.webp"
                  alt="A Digital Asset Passport card for an emerald"
                  width={660}
                  height={1133}
                  sizes="(max-width: 980px) 26vw, 108px"
                />
                <ul>
                  {tokenizationExample.passportItems.map((item) => (
                    <li key={item}>
                      <LineIcon name="check" size={15} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <span
                className="button button--outline button--small"
                aria-hidden="true"
              >
                {tokenizationExample.passportActionLabel}
              </span>
            </div>
          </MotionReveal>
        </section>

        <section
          className="tokenization-proof container-wide"
          aria-labelledby="tokenization-proof-title"
        >
          <MotionReveal>
            <SectionHeading
              title={proofOfReservesTitle}
              id="tokenization-proof-title"
            />
          </MotionReveal>
          <MotionReveal delay={80}>
            <ul className="trust-pillars tokenization-proof__grid">
              {proofOfReserves.map((item) => (
                <li key={item.id}>
                  <LineIcon name={proofIcons[item.id]} size={36} />
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="trust-cta tokenization-cta container-wide"
          aria-labelledby="tokenization-cta-title"
        >
          <MotionReveal className="trust-cta__visual">
            <ImageWithGlow
              className="trust-cta__image"
              src="/images/sections/tokenization-band.webp"
              alt={tokenizationCta.imageAlt}
              sizes="(max-width: 760px) 100vw, 30vw"
            />
          </MotionReveal>

          <MotionReveal className="trust-cta__copy" delay={70}>
            <h2 id="tokenization-cta-title">
              <span>{tokenizationCta.titleLines[0]}</span>
              <span>{tokenizationCta.titleLines[1]}</span>
            </h2>
            <p>{tokenizationCta.description}</p>
          </MotionReveal>

          <MotionReveal className="trust-cta__action" delay={130}>
            <Link className="button button--gold" href="/#waitlist">
              {tokenizationCta.buttonLabel}
            </Link>
            <p>{tokenizationCta.supportingText}</p>
          </MotionReveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
