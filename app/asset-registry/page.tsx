import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { LineIcon, type IconName } from "@/components/icons/LineIcon";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ImageWithGlow } from "@/components/ui/ImageWithGlow";
import { IdLookup } from "@/components/ui/IdLookup";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { ResponsiveHeroImage } from "@/components/ui/ResponsiveHeroImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  accessItems,
  accessTitle,
  blockchainActionLabel,
  blockchainDetails,
  blockchainDetailsTitle,
  passportPanel,
  recordExample,
  recordExampleTitle,
  registryBadges,
  registryCta,
  registryHero,
  registryProcess,
  registryProcessTitle,
  searchExploreLabel,
  searchIntro,
  searchPlaceholder,
  searchSubmitLabel,
  searchTitle,
  searchTypeChips,
  whyItems,
  whyTitle,
} from "@/content/registry";

export const metadata: Metadata = {
  title: "Asset Registry",
  description: registryHero.description,
  alternates: { canonical: "/asset-registry" },
  openGraph: {
    title: "Asset Registry | GemReserve.io",
    description: registryHero.description,
    url: "/asset-registry",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const breadcrumbItems = [
  { label: registryHero.breadcrumb[0], href: "/" },
  { label: registryHero.breadcrumb[1], href: "/assets" },
  { label: registryHero.breadcrumb[2] },
] as const;

const badgeIcons: Record<string, IconName> = {
  immutable: "shield-check",
  verified: "search",
  unique: "cubes",
  global: "globe",
  transparency: "lock",
  trust: "check",
};

// The board draws this row as line icons rather than as the photoreal plates
// the process rows elsewhere carry, so it keeps line icons here too.
const stepIcons: Record<string, IconName> = {
  creation: "diamond",
  lab: "search",
  capture: "certificate",
  registration: "cubes",
  custody: "vault",
  ownership: "contract",
  public: "eye",
};

const whyIcons: Record<string, IconName> = {
  fraud: "shield-check",
  investors: "users",
  liquidity: "chart",
  provenance: "certificate",
  trade: "globe",
  legacy: "hand-gem",
};

export default function AssetRegistryPage() {
  return (
    <div className="registry-page">
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section
          className="hero registry-hero"
          aria-labelledby="registry-hero-title"
        >
          <div className="hero__media" aria-hidden="true">
            <ResponsiveHeroImage
              desktopBase="/images/heroes/registry-hero"
              mobileBase="/images/heroes/registry-hero-mobile"
            />
            <span className="hero__scrim registry-hero__scrim" />
          </div>

          <div className="hero__inner registry-hero__inner container-wide">
            <MotionReveal className="hero__copy">
              <Breadcrumbs items={breadcrumbItems} />
              <h1 className="hero__title" id="registry-hero-title">
                <span>{registryHero.titleLines[0]}</span>
                <span className="hero__title-accent">
                  {registryHero.titleLines[1]}
                </span>
              </h1>
              <p className="registry-hero__tagline">{registryHero.tagline}</p>
              <p className="hero__description">{registryHero.description}</p>
            </MotionReveal>
          </div>
        </section>

        <section
          className="registry-badges container-wide"
          aria-label="What the registry guarantees"
        >
          <MotionReveal>
            <ul className="trust-pillars registry-badges__grid">
              {registryBadges.map((badge) => (
                <li key={badge.id}>
                  <LineIcon name={badgeIcons[badge.id]} size={34} />
                  <h2>{badge.title}</h2>
                  <p>{badge.description}</p>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="registry-process container-wide"
          aria-labelledby="registry-process-title"
        >
          <MotionReveal>
            <SectionHeading
              title={registryProcessTitle}
              id="registry-process-title"
            />
          </MotionReveal>

          <MotionReveal className="registry-process__panel" delay={80}>
            <ol className="registry-steps">
              {registryProcess.map((step) => (
                <li key={step.id}>
                  <span className="registry-steps__number" aria-hidden="true">
                    {step.step}
                  </span>
                  <LineIcon name={stepIcons[step.id]} size={34} />
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
          </MotionReveal>
        </section>

        <section
          className="registry-record container-wide"
          aria-labelledby="registry-record-title"
        >
          <MotionReveal>
            <SectionHeading
              title={recordExampleTitle}
              id="registry-record-title"
            />
          </MotionReveal>

          <MotionReveal className="registry-record__panel" delay={80}>
            <div className="registry-record__visual">
              <Image
                src="/images/sections/emerald-cut.webp"
                alt={recordExample.imageAlt}
                width={560}
                height={560}
                sizes="(max-width: 980px) 44vw, 200px"
              />
              <span
                className="button button--outline button--small"
                aria-hidden="true"
              >
                {recordExample.imageActionLabel}
              </span>
            </div>

            <div className="registry-record__fields">
              <p className="eyebrow">{recordExample.sampleNote}</p>
              <dl>
                {recordExample.fields.map((field) => (
                  <div key={field.id}>
                    <dt>{field.label}</dt>
                    <dd>{field.value}</dd>
                  </div>
                ))}
                <div className="registry-record__status">
                  <dt>{recordExample.statusLabel}</dt>
                  <dd>
                    <span>{recordExample.statusValue}</span>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="registry-record__side">
              <div className="registry-chain">
                <h3>{blockchainDetailsTitle}</h3>
                <dl>
                  {blockchainDetails.map((field) => (
                    <div key={field.id}>
                      <dt>{field.label}</dt>
                      <dd>{field.value}</dd>
                    </div>
                  ))}
                </dl>
                <span
                  className="button button--outline button--small"
                  aria-hidden="true"
                >
                  {blockchainActionLabel}
                </span>
              </div>

              <div className="registry-passport">
                <LineIcon name="passport" size={34} />
                <div>
                  <h3>{passportPanel.title}</h3>
                  <p>{passportPanel.description}</p>
                  {/* The passport is generated from a registry entry, and the
                      registry opens with the platform, so the control is a
                      label rather than a link that would download nothing. */}
                  <span
                    className="button button--gold button--small"
                    aria-hidden="true"
                  >
                    {passportPanel.actionLabel}
                  </span>
                  <p className="registry-passport__note">
                    {passportPanel.note}
                  </p>
                </div>
              </div>
            </div>
          </MotionReveal>
        </section>

        <section
          className="registry-close container-wide"
          aria-label="Registry access, value and lookup"
        >
          <MotionReveal className="registry-card">
            <h2 className="registry-card__title">{accessTitle}</h2>
            <ul className="registry-access">
              {accessItems.map((item) => (
                <li key={item}>
                  <LineIcon name="check" size={16} />
                  {item}
                </li>
              ))}
            </ul>
          </MotionReveal>

          <MotionReveal className="registry-card" delay={70}>
            <h2 className="registry-card__title">{whyTitle}</h2>
            <ul className="registry-why">
              {whyItems.map((item) => (
                <li key={item.id}>
                  <LineIcon name={whyIcons[item.id]} size={26} />
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
          </MotionReveal>

          <MotionReveal className="registry-card registry-search" delay={140}>
            <h2 className="registry-card__title registry-card__title--center">
              {searchTitle}
            </h2>
            <p className="registry-search__intro">{searchIntro}</p>
            <IdLookup
              noun="Asset ID"
              placeholder={searchPlaceholder}
              submitLabel={searchSubmitLabel}
            >
              <p className="registry-search__explore">{searchExploreLabel}</p>
              <ul className="registry-search__chips">
                {searchTypeChips.map((chip) => (
                  <li key={chip.id}>
                    <Link href={chip.href} data-type={chip.id}>
                      {chip.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </IdLookup>
          </MotionReveal>
        </section>

        <section
          className="trust-cta registry-cta container-wide"
          aria-labelledby="registry-cta-title"
        >
          <MotionReveal className="trust-cta__visual">
            <ImageWithGlow
              className="trust-cta__image"
              src="/images/sections/open-vault.webp"
              alt={registryCta.imageAlt}
              sizes="(max-width: 760px) 100vw, 28vw"
            />
          </MotionReveal>

          <MotionReveal className="trust-cta__copy" delay={70}>
            <h2 id="registry-cta-title">
              <span>{registryCta.titleLines[0]}</span>
              <span>{registryCta.titleLines[1]}</span>
            </h2>
            <p>{registryCta.description}</p>
          </MotionReveal>

          <MotionReveal className="trust-cta__action" delay={130}>
            <Link className="button button--outline" href="/#waitlist">
              {registryCta.buttonLabel}
            </Link>
            <p>{registryCta.supportingText}</p>
          </MotionReveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
