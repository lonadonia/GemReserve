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
  channelsPanel,
  closingMarks,
  commitmentSectionTitle,
  commitments,
  fraudHero,
  protectSectionTitle,
  protectSteps,
  reportPanel,
  scams,
  scamsSectionTitle,
} from "@/content/anti-fraud";

export const metadata: Metadata = {
  title: "Anti-Fraud Notice",
  description: fraudHero.description,
  alternates: { canonical: "/anti-fraud-notice" },
  openGraph: {
    title: "Anti-Fraud Notice | GemReserve.io",
    description: fraudHero.description,
    url: "/anti-fraud-notice",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const breadcrumbItems = [
  { label: fraudHero.breadcrumb[0], href: "/" },
  { label: fraudHero.breadcrumb[1] },
] as const;

const commitmentIcons: Record<string, IconName> = {
  platform: "shield-check",
  communications: "user-check",
  operations: "eye",
  empowerment: "lightbulb",
  protection: "globe",
};

const protectIcons: Record<string, IconName> = {
  verify: "check",
  "never-share": "lock",
  "strong-security": "fingerprint",
  cautious: "eye",
  report: "alert-triangle",
};

const channelIcons: Record<string, IconName> = {
  website: "globe",
  general: "envelope",
  investor: "chart",
  media: "contract",
  partnerships: "handshake",
};

const closingIcons: Record<string, IconName> = {
  transparent: "eye",
  secure: "lock",
  trusted: "diamond",
  responsible: "users",
  together: "handshake",
};

export default function AntiFraudNoticePage() {
  return (
    <div className="fraud-page">
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section className="hero fraud-hero" aria-labelledby="fraud-hero-title">
          <div className="hero__media" aria-hidden="true">
            <ResponsiveHeroImage
              desktopBase="/images/heroes/fraud-hero"
              mobileBase="/images/heroes/fraud-hero-mobile"
            />
            <span className="hero__scrim fraud-hero__scrim" />
          </div>

          <div className="hero__inner container-wide">
            <MotionReveal className="hero__copy">
              <Breadcrumbs items={breadcrumbItems} />
              <h1 className="hero__title" id="fraud-hero-title">
                <span>{fraudHero.titleLines[0]}</span>
                <span className="hero__title-accent">
                  {fraudHero.titleLines[1]}
                </span>
              </h1>
              <p className="fraud-hero__tagline">
                {fraudHero.taglineLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>
              <p className="hero__description">{fraudHero.description}</p>

              <aside className="hero-callout fraud-hero__callout">
                <div>
                  <p className="hero-callout__title">
                    {fraudHero.callout.title}
                  </p>
                  {fraudHero.callout.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </aside>
            </MotionReveal>
          </div>
        </section>

        <section
          className="fraud-commitments container-wide"
          aria-labelledby="fraud-commitments-title"
        >
          <MotionReveal>
            <SectionHeading
              title={commitmentSectionTitle}
              id="fraud-commitments-title"
            />
          </MotionReveal>
          <MotionReveal delay={80}>
            <ul className="trust-pillars fraud-commitment__grid">
              {commitments.map((commitment) => (
                <li key={commitment.id}>
                  <LineIcon name={commitmentIcons[commitment.id]} size={36} />
                  <h3>{commitment.title}</h3>
                  <p>{commitment.description}</p>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="fraud-scams container-wide"
          aria-labelledby="fraud-scams-title"
        >
          <MotionReveal>
            <SectionHeading title={scamsSectionTitle} id="fraud-scams-title" />
          </MotionReveal>
          <MotionReveal delay={80}>
            <ul className="fraud-scam-grid">
              {scams.map((scam) => (
                <li key={scam.id}>
                  <LineIcon name="alert-triangle" size={24} />
                  <div>
                    <h3>{scam.title}</h3>
                    <p>{scam.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="fraud-protect container-wide"
          aria-labelledby="fraud-protect-title"
        >
          <MotionReveal>
            <SectionHeading
              title={protectSectionTitle}
              id="fraud-protect-title"
            />
          </MotionReveal>
          <MotionReveal delay={80}>
            <ul className="fraud-protect-grid">
              {protectSteps.map((step) => (
                <li key={step.id}>
                  <LineIcon name={protectIcons[step.id]} size={28} />
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="fraud-channels container-wide"
          aria-labelledby="fraud-channels-title"
        >
          {/* The board listed a support mailbox, a help centre and three social
              networks. None exists. Naming a channel GemReserve does not
              control is exactly the belief an impersonator needs, so the list
              holds only what is real — and says so about the rest. */}
          <MotionReveal className="fraud-channels__panel">
            <div className="fraud-channels__lead">
              <ImageWithGlow
                className="fraud-channels__image"
                src="/images/sections/channel-shield.webp"
                alt={channelsPanel.imageAlt}
                sizes="(max-width: 980px) 60vw, 18vw"
              />
              <div>
                <h2 id="fraud-channels-title">{channelsPanel.title}</h2>
                {channelsPanel.lead.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>

            <ul className="fraud-channel-list">
              {channelsPanel.channels.map((channel) => (
                <li key={channel.id}>
                  <LineIcon name={channelIcons[channel.id]} size={22} />
                  <span className="fraud-channel__label">{channel.label}</span>
                  {channel.href ? (
                    <a
                      className="fraud-channel__value"
                      href={channel.href}
                      rel={
                        channel.href.startsWith("mailto:")
                          ? undefined
                          : "noreferrer"
                      }
                    >
                      {channel.value}
                    </a>
                  ) : (
                    <span className="fraud-channel__value">
                      {channel.value}
                    </span>
                  )}
                </li>
              ))}
            </ul>

            <div className="fraud-channels__warnings">
              <div>
                <h3>{channelsPanel.socialTitle}</h3>
                <p>{channelsPanel.socialBody}</p>
              </div>
              <div>
                <h3>{channelsPanel.saleTitle}</h3>
                <p>{channelsPanel.saleBody}</p>
                <Link href={channelsPanel.saleLink.href}>
                  {channelsPanel.saleLink.label}
                </Link>
              </div>
            </div>
          </MotionReveal>
        </section>

        <section
          className="fraud-report container-wide"
          aria-labelledby="fraud-report-title"
        >
          <MotionReveal className="fraud-report__panel">
            <LineIcon name="alert-triangle" size={38} />
            <div>
              <h2 id="fraud-report-title">{reportPanel.title}</h2>
              <p>{reportPanel.description}</p>
            </div>
            <div className="fraud-report__actions">
              <a
                className="button button--gold"
                href={`mailto:${reportPanel.email}?subject=Suspected%20fraud`}
              >
                {reportPanel.buttonLabel}
              </a>
              <Link
                className="fraud-report__link"
                href={reportPanel.contactHref}
              >
                {reportPanel.contactLabel}
              </Link>
            </div>
          </MotionReveal>
        </section>

        <section
          className="fraud-closing container-wide"
          aria-label="How we work together"
        >
          <MotionReveal>
            <ul className="trust-pillars fraud-closing__grid">
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
