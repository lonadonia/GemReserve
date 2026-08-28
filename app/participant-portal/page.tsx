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
  accessPanel,
  accessSteps,
  audiencePanel,
  capabilities,
  capabilitiesSectionTitle,
  closingMarks,
  portalCta,
  portalHero,
  previewPanel,
  securityPanel,
  standingNotice,
  stepsSectionTitle,
} from "@/content/participant-portal";

export const metadata: Metadata = {
  title: "Participant Portal",
  description: portalHero.description,
  alternates: { canonical: "/participant-portal" },
  openGraph: {
    title: "Participant Portal | GemReserve.io",
    description: portalHero.description,
    url: "/participant-portal",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const breadcrumbItems = [
  { label: portalHero.breadcrumb[0], href: "/" },
  { label: portalHero.breadcrumb[1] },
] as const;

const capabilityIcons: Record<string, IconName> = {
  dashboard: "bars",
  assets: "diamond",
  portfolio: "pie",
  transactions: "exchange",
  wallet: "wallet",
  documents: "file-check",
  security: "shield-check",
};

const audienceIcons: Record<string, IconName> = {
  individual: "user",
  institutional: "bank",
  enterprise: "handshake",
};

const stepIcons: Record<string, IconName> = {
  account: "user",
  verification: "user-check",
  approval: "shield-check",
  login: "lock",
  manage: "diamond",
};

const closingIcons: Record<string, IconName> = {
  transparent: "eye",
  secure: "lock",
  trusted: "diamond",
  accessible: "globe",
  support: "users",
};

export default function ParticipantPortalPage() {
  return (
    <div className="participant-page">
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section
          className="hero participant-hero"
          aria-labelledby="participant-hero-title"
        >
          <div className="hero__media" aria-hidden="true">
            <ResponsiveHeroImage
              desktopBase="/images/heroes/portal-hero"
              mobileBase="/images/heroes/portal-hero-mobile"
            />
            <span className="hero__scrim participant-hero__scrim" />
          </div>

          <div className="hero__inner container-wide">
            <MotionReveal className="hero__copy">
              <Breadcrumbs items={breadcrumbItems} />
              <h1 className="hero__title" id="participant-hero-title">
                <span>{portalHero.titleLines[0]}</span>
                <span className="hero__title-accent">
                  {portalHero.titleLines[1]}
                </span>
              </h1>
              <p className="participant-hero__tagline">
                {portalHero.taglineLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>
              <p className="hero__description">{portalHero.description}</p>

              <aside className="hero-callout participant-hero__callout">
                <div>
                  <p className="hero-callout__title">
                    {portalHero.callout.title}
                  </p>
                  {portalHero.callout.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </aside>
            </MotionReveal>
          </div>
        </section>

        <section
          className="participant-notice container-wide"
          aria-labelledby="participant-notice-title"
        >
          <MotionReveal className="participant-notice__panel">
            <LineIcon name="lock-clock" size={34} />
            <div>
              <h2 id="participant-notice-title">{standingNotice.title}</h2>
              <p>{standingNotice.body}</p>
              <Link href={standingNotice.link.href}>
                {standingNotice.link.label}
              </Link>
            </div>
          </MotionReveal>
        </section>

        <section
          className="participant-capabilities container-wide"
          aria-labelledby="participant-capabilities-title"
        >
          <MotionReveal>
            <SectionHeading
              title={capabilitiesSectionTitle}
              id="participant-capabilities-title"
            />
          </MotionReveal>
          <MotionReveal delay={80}>
            <ul className="participant-capability-grid">
              {capabilities.map((capability) => (
                <li key={capability.id}>
                  <LineIcon name={capabilityIcons[capability.id]} size={32} />
                  <h3>{capability.title}</h3>
                  <p>{capability.description}</p>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="participant-detail container-wide"
          aria-labelledby="participant-access-title"
        >
          <MotionReveal className="participant-card">
            <h2
              className="participant-card__title"
              id="participant-access-title"
            >
              {accessPanel.title}
            </h2>
            <ul className="participant-access">
              {accessPanel.features.map((feature) => (
                <li key={feature.id}>
                  <LineIcon name="check" size={18} />
                  {feature.label}
                </li>
              ))}
            </ul>
          </MotionReveal>

          <MotionReveal className="participant-card" delay={80}>
            <h2 className="participant-card__title">{audiencePanel.title}</h2>
            <ul className="participant-audience">
              {audiencePanel.audiences.map((audience) => (
                <li key={audience.id}>
                  <LineIcon name={audienceIcons[audience.id]} size={26} />
                  <div>
                    <h3>{audience.title}</h3>
                    <p>{audience.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </MotionReveal>

          {/* The board's dashboard carries a portfolio value, a token balance,
              an unrealized gain and four holdings. None exists, so the preview
              is drawn with every value blank rather than with invented ones. */}
          <MotionReveal
            className="participant-card participant-card--preview"
            delay={160}
          >
            <h2 className="participant-card__title">{previewPanel.title}</h2>
            <p className="participant-preview__note" role="note">
              <LineIcon name="alert-triangle" size={20} />
              <span>{previewPanel.note}</span>
            </p>

            <div className="portal-preview" aria-hidden="true">
              <ul className="portal-preview__nav">
                {previewPanel.nav.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <div className="portal-preview__body">
                <dl className="portal-preview__summary">
                  {previewPanel.summary.map((panel) => (
                    <div key={panel.id}>
                      <dt>{panel.label}</dt>
                      <dd>—</dd>
                      <p>{panel.detail}</p>
                    </div>
                  ))}
                </dl>

                <div className="portal-preview__chart">
                  <p>{previewPanel.chartLabel}</p>
                  <div className="portal-preview__plot">
                    <span>{previewPanel.chartNote}</span>
                  </div>
                </div>

                <div className="portal-preview__table">
                  <p>{previewPanel.tableTitle}</p>
                  <ul className="portal-preview__columns">
                    {previewPanel.columns.map((column) => (
                      <li key={column.id}>{column.label}</li>
                    ))}
                  </ul>
                  <p className="portal-preview__empty">
                    {previewPanel.emptyRow}
                  </p>
                </div>
              </div>
            </div>
          </MotionReveal>
        </section>

        <section
          className="participant-steps container-wide"
          aria-labelledby="participant-steps-title"
        >
          <MotionReveal>
            <SectionHeading
              title={stepsSectionTitle}
              id="participant-steps-title"
            />
          </MotionReveal>
          <MotionReveal delay={80}>
            <ol className="participant-step-flow">
              {accessSteps.map((step) => (
                <li key={step.id}>
                  <p className="participant-step__number" aria-hidden="true">
                    {step.step}
                  </p>
                  <LineIcon name={stepIcons[step.id]} size={30} />
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
          </MotionReveal>

          <MotionReveal className="participant-security" delay={140}>
            <ImageWithGlow
              className="participant-security__image"
              src="/images/sections/portal-security.webp"
              alt={securityPanel.imageAlt}
              sizes="(max-width: 980px) 60vw, 20vw"
            />
            <div>
              <h2>{securityPanel.title}</h2>
              {securityPanel.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
              <Link
                className="button button--outline button--small"
                href={securityPanel.href}
              >
                {securityPanel.buttonLabel}
              </Link>
            </div>
          </MotionReveal>
        </section>

        <section
          className="participant-cta container-wide"
          aria-labelledby="participant-cta-title"
        >
          <MotionReveal className="participant-cta__panel">
            <div>
              <h2 id="participant-cta-title">{portalCta.title}</h2>
              <p>{portalCta.description}</p>
              <p className="participant-cta__support">
                {portalCta.supportingText}{" "}
                <Link href={portalCta.eligibilityLink.href}>
                  {portalCta.eligibilityLink.label}
                </Link>
              </p>
            </div>
            <Link className="button button--gold" href="/#waitlist">
              {portalCta.buttonLabel}
            </Link>
          </MotionReveal>
        </section>

        <section
          className="participant-closing container-wide"
          aria-label="What the portal is built on"
        >
          <MotionReveal>
            <ul className="trust-pillars participant-closing__grid">
              {closingMarks.map((mark) => (
                <li key={mark.id}>
                  <LineIcon name={closingIcons[mark.id]} size={36} />
                  <h3>{mark.title}</h3>
                  <p>{mark.description}</p>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
