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
  everyGemstone,
  gemstonePrograms,
  programActionLabel,
  programBadges,
  programHighlights,
  programSpecLabels,
  programsCta,
  programsHero,
  programsSectionTitle,
} from "@/content/programs";

export const metadata: Metadata = {
  title: "All Gemstone Programs",
  description: programsHero.description,
  alternates: { canonical: "/gemstone-programs" },
  openGraph: {
    title: "All Gemstone Programs | GemReserve.io",
    description: programsHero.description,
    url: "/gemstone-programs",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const breadcrumbItems = [
  { label: programsHero.breadcrumb[0], href: "/" },
  { label: programsHero.breadcrumb[1], href: "/assets" },
  { label: programsHero.breadcrumb[2] },
] as const;

const badgeIcons: Record<string, IconName> = {
  backed: "diamond",
  verified: "shield-check",
  borderless: "globe",
  redeemable: "refresh",
  vaults: "lock",
  transparent: "contract",
};

const highlightIcons: Record<string, IconName> = {
  programs: "diamond",
  types: "hand-gem",
  assets: "contract",
  countries: "globe",
  backed: "shield-check",
};

export default function GemstoneProgramsPage() {
  return (
    <div className="programs-page">
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section
          className="hero programs-hero"
          aria-labelledby="programs-hero-title"
        >
          <div className="hero__media" aria-hidden="true">
            <ResponsiveHeroImage
              desktopBase="/images/heroes/programs-hero"
              mobileBase="/images/heroes/programs-hero-mobile"
            />
            <span className="hero__scrim programs-hero__scrim" />
          </div>

          <div className="hero__inner programs-hero__inner container-wide">
            <MotionReveal className="hero__copy">
              <Breadcrumbs items={breadcrumbItems} />
              <h1
                className="hero__title programs-hero__title"
                id="programs-hero-title"
              >
                {programsHero.title.before}{" "}
                <span className="hero__title-accent">
                  {programsHero.title.accent}
                </span>{" "}
                {programsHero.title.after}
              </h1>
              <p className="programs-hero__tagline">{programsHero.tagline}</p>
              <p className="hero__description">{programsHero.description}</p>
            </MotionReveal>
          </div>
        </section>

        <section
          className="programs-badges container-wide"
          aria-label="What every gemstone program guarantees"
        >
          <MotionReveal>
            <ul className="trust-pillars programs-badges__grid">
              {programBadges.map((badge) => (
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
          className="programs-grid-section container-wide"
          aria-labelledby="programs-grid-title"
        >
          <MotionReveal>
            <SectionHeading
              title={programsSectionTitle}
              id="programs-grid-title"
            />
          </MotionReveal>

          <ul className="programs-grid">
            {gemstonePrograms.map((program, index) => (
              <li key={program.id}>
                <MotionReveal className="program-card" delay={(index % 5) * 55}>
                  <div className="program-card__head">
                    <Image
                      className="program-card__stone"
                      src={program.imageSrc}
                      alt={program.imageAlt}
                      width={480}
                      height={480}
                      sizes="(max-width: 760px) 34vw, (max-width: 1330px) 16vw, 116px"
                    />
                    <div>
                      <h3>
                        <span
                          className="program-card__swatch"
                          style={{ background: program.swatch }}
                          aria-hidden="true"
                        />
                        {program.name}
                      </h3>
                      <p className="program-card__epithet">{program.epithet}</p>
                      <p className="program-card__description">
                        {program.description}
                      </p>
                    </div>
                  </div>

                  <dl className="program-card__specs">
                    <div>
                      <dt>{programSpecLabels.origin}</dt>
                      <dd>{program.origin}</dd>
                    </div>
                    <div>
                      <dt>{programSpecLabels.hardness}</dt>
                      <dd>{program.hardness}</dd>
                    </div>
                    <div>
                      <dt>{programSpecLabels.typicalSize}</dt>
                      <dd>{program.typicalSize}</dd>
                    </div>
                    <div>
                      <dt>{programSpecLabels.tokenStandard}</dt>
                      <dd>{program.tokenStandard}</dd>
                    </div>
                  </dl>

                  {/* Each stone's own page opens with the marketplace, so the
                      card points at the catalogue entry that already exists
                      rather than at a route that does not. */}
                  <Link
                    className="button button--outline button--small program-card__action"
                    href="/assets"
                  >
                    {programActionLabel}
                  </Link>
                </MotionReveal>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="programs-detail container-wide"
          aria-labelledby="programs-detail-title"
        >
          <MotionReveal className="programs-detail__panel">
            <div className="programs-detail__visual">
              <ImageWithGlow
                className="programs-detail__image"
                src="/images/sections/gem-report.webp"
                alt={everyGemstone.imageAlt}
                sizes="(max-width: 980px) 90vw, 30vw"
              />
            </div>

            <div className="programs-detail__copy">
              <h2 id="programs-detail-title">{everyGemstone.title}</h2>
              <p>{everyGemstone.description}</p>
              <ul className="programs-detail__checks">
                {everyGemstone.checks.map((check) => (
                  <li key={check}>
                    <LineIcon name="check" size={16} />
                    {check}
                  </li>
                ))}
              </ul>
            </div>

            <div className="programs-highlights">
              <h3>{everyGemstone.highlightsTitle}</h3>
              <dl>
                {programHighlights.map((highlight) => (
                  <div key={highlight.id}>
                    <LineIcon name={highlightIcons[highlight.id]} size={26} />
                    <dt>{highlight.value}</dt>
                    <dd>{highlight.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </MotionReveal>
        </section>

        <section
          className="trust-cta programs-cta container-wide"
          aria-labelledby="programs-cta-title"
        >
          <MotionReveal className="trust-cta__visual">
            <ImageWithGlow
              className="trust-cta__image"
              src="/images/sections/vault-tray.webp"
              alt="A tray of faceted gemstones inside an open vault"
              sizes="(max-width: 760px) 100vw, 28vw"
            />
          </MotionReveal>

          <MotionReveal className="trust-cta__copy" delay={70}>
            <h2 id="programs-cta-title">
              <span>{programsCta.titleLines[0]}</span>
              <span>{programsCta.titleLines[1]}</span>
            </h2>
            <p>{programsCta.description}</p>
          </MotionReveal>

          <MotionReveal className="trust-cta__action" delay={130}>
            <Link className="button button--gold" href="/#waitlist">
              {programsCta.buttonLabel}
            </Link>
            <p>{programsCta.supportingText}</p>
          </MotionReveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
