import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";

import { LineIcon, type IconName } from "@/components/icons/LineIcon";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ImageWithGlow } from "@/components/ui/ImageWithGlow";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { ResponsiveHeroImage } from "@/components/ui/ResponsiveHeroImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  dashboardPanel,
  guaranteePanel,
  passportPanel,
  processSectionTitle,
  reserveSteps,
  reservesCta,
  reservesHero,
  rolesPanel,
} from "@/content/reserves";
import { features } from "@/lib/config";

export const metadata: Metadata = {
  title: "Proof of Gemstone Reserves",
  description: reservesHero.description,
  alternates: { canonical: "/proof-of-reserves" },
  openGraph: {
    title: "Proof of Gemstone Reserves | GemReserve.io",
    description: reservesHero.description,
    url: "/proof-of-reserves",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const breadcrumbItems = [
  { label: reservesHero.breadcrumb[0], href: "/" },
  { label: reservesHero.breadcrumb[1], href: "/technology" },
  { label: reservesHero.breadcrumb[2] },
] as const;

const heroCardIcons: Record<string, IconName> = {
  backed: "diamond",
  verified: "eye",
  "on-chain": "network",
  secure: "lock",
};

const stepIcons: Record<string, IconName> = {
  sourcing: "source",
  gemological: "search",
  custody: "vault",
  recording: "frame",
  tokenization: "cubes",
  audit: "clipboard-check",
  disclosure: "chart",
};

const roleIcons: Record<string, IconName> = {
  laboratory: "certificate",
  custodian: "vault",
  auditor: "scales",
  contract: "code-shield",
};

const guaranteeIcons: Record<string, IconName> = {
  backed: "shield-check",
  transparency: "eye",
  "third-party": "bank",
  custody: "lock",
  updates: "watch",
  trust: "diamond",
};

export default function ProofOfReservesPage() {
  return (
    <div className="reserves-page">
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section
          className="hero reserves-hero"
          aria-labelledby="reserves-hero-title"
        >
          <div className="hero__media" aria-hidden="true">
            <ResponsiveHeroImage
              desktopBase="/images/heroes/reserves-hero"
              mobileBase="/images/heroes/reserves-hero-mobile"
            />
            <span className="hero__scrim reserves-hero__scrim" />
          </div>

          <div className="hero__inner reserves-hero__inner container-wide">
            <MotionReveal className="hero__copy">
              <Breadcrumbs items={breadcrumbItems} />
              <h1 className="hero__title" id="reserves-hero-title">
                <span>{reservesHero.titleLines[0]}</span>
                <span className="hero__title-accent">
                  {reservesHero.titleLines[1]}
                </span>
              </h1>
              <p className="reserves-hero__tagline">{reservesHero.tagline}</p>
              <p className="hero__description">{reservesHero.description}</p>
            </MotionReveal>

            <MotionReveal className="reserves-hero__cards" delay={120}>
              <ul aria-label="Proof of reserves at a glance">
                {reservesHero.cards.map((card) => (
                  <li key={card.id}>
                    <LineIcon name={heroCardIcons[card.id]} size={26} />
                    <div>
                      <h2>{card.title}</h2>
                      <p>{card.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </MotionReveal>
          </div>
        </section>

        <section
          className="reserves-process container-wide"
          aria-labelledby="reserves-process-title"
        >
          <MotionReveal>
            <SectionHeading
              title={processSectionTitle}
              id="reserves-process-title"
            />
          </MotionReveal>
          <MotionReveal delay={80}>
            <ol className="reserves-steps">
              {reserveSteps.map((step) => (
                <li key={step.id}>
                  <p className="reserves-step__number" aria-hidden="true">
                    {step.step}
                  </p>
                  <LineIcon name={stepIcons[step.id]} size={32} />
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                  <p className="reserves-step__marker">{step.marker}</p>
                </li>
              ))}
            </ol>
          </MotionReveal>
        </section>

        <section
          className="reserves-detail container-wide"
          aria-labelledby="reserves-passport-title"
        >
          <MotionReveal className="reserves-card">
            <h2 className="reserves-card__title" id="reserves-passport-title">
              {passportPanel.title}
            </h2>
            <p className="reserves-card__intro">{passportPanel.intro}</p>
            <div className="reserves-passport">
              <ImageWithGlow
                className="reserves-passport__image"
                src="/images/sections/asset-passport.webp"
                alt={passportPanel.imageAlt}
                sizes="(max-width: 980px) 100vw, 20vw"
              />
              <div>
                <ul className="reserves-passport__checks">
                  {passportPanel.checks.map((check) => (
                    <li key={check.id}>
                      <LineIcon name="check" size={18} />
                      {check.label}
                    </li>
                  ))}
                </ul>
                <Link
                  className="button button--outline button--small"
                  href={passportPanel.link.href}
                >
                  {passportPanel.link.label}
                </Link>
              </div>
            </div>
          </MotionReveal>

          <MotionReveal className="reserves-card" delay={80}>
            <h2 className="reserves-card__title">{rolesPanel.title}</h2>
            <p className="reserves-card__intro">{rolesPanel.intro}</p>
            <ul className="reserves-roles">
              {rolesPanel.roles.map((role) => (
                <li key={role.id}>
                  <LineIcon name={roleIcons[role.id]} size={26} />
                  <div>
                    <h3>{role.role}</h3>
                    <p>{role.responsibility}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="reserves-card__note" role="note">
              <LineIcon name="alert-triangle" size={22} />
              <span>{rolesPanel.disclosure}</span>
            </p>
          </MotionReveal>

          {/* The board's third panel in this band. It draws a live reserve
              balance and a composition donut; nothing has been attested, so the
              panel keeps its shape and its five catalogue segments and carries
              no figure at all — see content/reserves.ts. */}
          <MotionReveal className="reserves-card" delay={160}>
            <h2 className="reserves-card__title">{dashboardPanel.title}</h2>
            <p className="reserves-card__intro">{dashboardPanel.intro}</p>

            <div className="reserves-board">
              <p className="reserves-board__status" role="status">
                <LineIcon name="alert-triangle" size={20} />
                <span>
                  <strong>{dashboardPanel.statusLabel}</strong>
                  {dashboardPanel.statusDetail}
                </span>
              </p>

              <div className="reserves-board__grid">
                <dl className="reserves-board__figures">
                  {dashboardPanel.fields.map((field) => (
                    <div key={field.id}>
                      <dt>{field.label}</dt>
                      <dd aria-label={dashboardPanel.pending}>
                        <span aria-hidden="true">—</span>
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="reserves-board__composition">
                  <div
                    className="reserves-board__ring"
                    role="img"
                    aria-label={`${dashboardPanel.compositionLabel}: ${dashboardPanel.pending}`}
                  >
                    <span />
                  </div>
                  <ul className="reserves-board__legend">
                    {dashboardPanel.composition.map((slice) => (
                      <li key={slice.id}>
                        <span
                          className="reserves-board__swatch"
                          style={
                            {
                              "--swatch": slice.colour,
                            } as CSSProperties
                          }
                          aria-hidden="true"
                        />
                        {slice.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <dl className="reserves-board__meta">
                {dashboardPanel.metaFields.map((field) => (
                  <div key={field.id}>
                    <dt>{field.label}</dt>
                    <dd>{dashboardPanel.pending}</dd>
                  </div>
                ))}
              </dl>

              <p className="reserves-board__action">
                <span aria-disabled="true">{dashboardPanel.buttonLabel}</span>
                <small>
                  {features.proofOfReserves
                    ? dashboardPanel.buttonNote
                    : dashboardPanel.buttonNote}
                </small>
              </p>
            </div>
          </MotionReveal>
        </section>

        <section
          className="reserves-guarantee container-wide"
          aria-labelledby="reserves-guarantee-title"
        >
          <MotionReveal>
            <SectionHeading
              title={guaranteePanel.title}
              id="reserves-guarantee-title"
            />
          </MotionReveal>
          <MotionReveal delay={80}>
            <ul className="trust-pillars reserves-guarantee__grid">
              {guaranteePanel.guarantees.map((guarantee) => (
                <li key={guarantee.id}>
                  <LineIcon name={guaranteeIcons[guarantee.id]} size={36} />
                  <h3>{guarantee.title}</h3>
                  <p>{guarantee.description}</p>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="trust-cta reserves-cta container-wide"
          aria-labelledby="reserves-cta-title"
        >
          <MotionReveal className="trust-cta__visual">
            <ImageWithGlow
              className="trust-cta__image"
              src="/images/sections/open-vault.webp"
              alt={reservesCta.imageAlt}
              sizes="(max-width: 980px) 100vw, 30vw"
            />
          </MotionReveal>

          <MotionReveal className="trust-cta__copy" delay={70}>
            <h2 id="reserves-cta-title">
              <span>{reservesCta.titleLines[0]}</span>
              <span className="reserves-cta__accent">
                {reservesCta.titleLines[1]}
              </span>
            </h2>
            <p>{reservesCta.description}</p>
          </MotionReveal>

          <MotionReveal className="trust-cta__action" delay={130}>
            <Link className="button button--gold" href="/#waitlist">
              {reservesCta.buttonLabel}
            </Link>
            <p>{reservesCta.supportingText}</p>
          </MotionReveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
