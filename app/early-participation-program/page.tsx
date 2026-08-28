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
  benefitsPanel,
  detailsPanel,
  faqPanel,
  invitePanel,
  programHero,
  reasons,
  reasonsSectionTitle,
  stepsPanel,
  timelinePanel,
} from "@/content/early-participation-program";

export const metadata: Metadata = {
  title: "Early Participation Program",
  description: programHero.paragraphs[0],
  alternates: { canonical: "/early-participation-program" },
  openGraph: {
    title: "Early Participation Program | GemReserve.io",
    description: programHero.paragraphs[0],
    url: "/early-participation-program",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const breadcrumbItems = [
  { label: programHero.breadcrumb[0], href: "/" },
  { label: programHero.breadcrumb[1], href: "/investors" },
  { label: programHero.breadcrumb[2] },
] as const;

const reasonIcons: Record<string, IconName> = {
  discount: "ticket-percent",
  access: "rocket",
  allocation: "diamond",
  future: "globe",
};

const detailIcons: Record<string, IconName> = {
  discount: "ticket-percent",
  access: "envelope",
  eligibility: "user-check",
  currency: "coins",
  tokens: "token",
  delivery: "wallet",
  "sale-type": "lock",
  availability: "watch",
};

const stepIcons: Record<string, IconName> = {
  waitlist: "contract",
  invitation: "envelope",
  verification: "user-check",
  fund: "wallet",
  purchase: "diamond",
};

export default function EarlyParticipationProgramPage() {
  return (
    <div className="program-page">
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section
          className="hero program-hero"
          aria-labelledby="program-hero-title"
        >
          <div className="hero__media" aria-hidden="true">
            <ResponsiveHeroImage
              desktopBase="/images/heroes/program-hero"
              mobileBase="/images/heroes/program-hero-mobile"
            />
            <span className="hero__scrim program-hero__scrim" />
          </div>

          <div className="hero__inner container-wide">
            <MotionReveal className="hero__copy">
              <Breadcrumbs items={breadcrumbItems} />
              <h1 className="hero__title" id="program-hero-title">
                <span>{programHero.titleLines[0]}</span>
                <span className="hero__title-accent">
                  {programHero.titleLines[1]}
                </span>
              </h1>
              <p className="program-hero__tagline">{programHero.tagline}</p>
              {programHero.paragraphs.map((paragraph) => (
                <p className="hero__description" key={paragraph}>
                  {paragraph}
                </p>
              ))}

              <p className="program-hero__badge">
                <LineIcon name="ticket-percent" size={30} />
                <span>
                  <strong>{programHero.badge.figure}</strong>
                  {programHero.badge.label}
                  <small>{programHero.badge.detail}</small>
                </span>
              </p>
            </MotionReveal>
          </div>
        </section>

        <section
          className="program-notice container-wide"
          aria-labelledby="program-notice-title"
        >
          <MotionReveal className="program-notice__panel">
            <LineIcon name="alert-triangle" size={32} />
            <div>
              <h2 id="program-notice-title" className="sr-only">
                Programme status
              </h2>
              <p>{programHero.notice}</p>
            </div>
          </MotionReveal>
        </section>

        <section
          className="program-reasons container-wide"
          aria-labelledby="program-reasons-title"
        >
          <MotionReveal>
            <SectionHeading
              title={reasonsSectionTitle}
              id="program-reasons-title"
            />
          </MotionReveal>
          <MotionReveal delay={80}>
            <ul className="trust-pillars program-reason__grid">
              {reasons.map((reason) => (
                <li key={reason.id}>
                  <LineIcon name={reasonIcons[reason.id]} size={36} />
                  <h3>{reason.title}</h3>
                  <p>{reason.description}</p>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="program-detail container-wide"
          aria-labelledby="program-details-title"
        >
          <MotionReveal className="program-card">
            <h2 className="program-card__title" id="program-details-title">
              {detailsPanel.title}
            </h2>
            <dl className="program-details">
              {detailsPanel.details.map((detail) => (
                <div key={detail.id}>
                  <dt>
                    <LineIcon name={detailIcons[detail.id]} size={22} />
                    {detail.label}
                  </dt>
                  <dd>{detail.value}</dd>
                </div>
              ))}
            </dl>
            <p className="program-card__note" role="note">
              <LineIcon name="alert-triangle" size={22} />
              <span>{detailsPanel.footnote}</span>
            </p>
          </MotionReveal>

          <MotionReveal className="program-card" delay={80}>
            <h2 className="program-card__title program-card__title--center">
              {stepsPanel.title}
            </h2>
            <ol className="program-steps">
              {stepsPanel.steps.map((step) => (
                <li key={step.id}>
                  <p className="program-step__number" aria-hidden="true">
                    {step.step}
                  </p>
                  <LineIcon name={stepIcons[step.id]} size={30} />
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
            <p className="program-steps__link">
              <Link href={stepsPanel.link.href}>{stepsPanel.link.label}</Link>
            </p>
          </MotionReveal>
        </section>

        <section
          className="program-timeline container-wide"
          aria-labelledby="program-timeline-title"
        >
          <MotionReveal>
            <SectionHeading
              title={timelinePanel.title}
              id="program-timeline-title"
            />
            <p className="program-timeline__intro">{timelinePanel.intro}</p>
          </MotionReveal>
          <MotionReveal delay={80}>
            <ol className="program-phases">
              {timelinePanel.phases.map((phase, index) => (
                <li className={`program-phase--${phase.state}`} key={phase.id}>
                  <span className="program-phase__dot" aria-hidden="true">
                    {index + 1}
                  </span>
                  <h3>{phase.title}</h3>
                  <p>{phase.description}</p>
                  <p className="program-phase__state">
                    {timelinePanel.stateLabels[phase.state]}
                  </p>
                </li>
              ))}
            </ol>
          </MotionReveal>
        </section>

        <section
          className="program-invite container-wide"
          aria-labelledby="program-invite-title"
        >
          <MotionReveal className="program-card program-card--benefits">
            <h2 className="program-card__title">{benefitsPanel.title}</h2>
            <ul className="program-benefits">
              {benefitsPanel.benefits.map((benefit) => (
                <li key={benefit}>
                  <LineIcon name="check" size={18} />
                  {benefit}
                </li>
              ))}
            </ul>
          </MotionReveal>

          <MotionReveal className="program-invite__panel" delay={90}>
            <div className="program-invite__copy">
              <h2 id="program-invite-title">
                <span>{invitePanel.titleLines[0]}</span>
                <span className="program-invite__accent">
                  {invitePanel.titleLines[1]}
                </span>
              </h2>
              <p>{invitePanel.description}</p>
              <Link className="button button--gold" href="/#waitlist">
                {invitePanel.buttonLabel}
              </Link>
              <p className="program-invite__support">
                {invitePanel.supportingText}
              </p>
            </div>

            <ImageWithGlow
              className="program-invite__image"
              src="/images/sections/program-vault.webp"
              alt={invitePanel.imageAlt}
              sizes="(max-width: 980px) 100vw, 26vw"
            />

            <aside className="program-invite__backing">
              <LineIcon name="shield-check" size={30} />
              <h3>
                {invitePanel.panel.title}
                <span>{invitePanel.panel.subtitle}</span>
              </h3>
              <p>{invitePanel.panel.body}</p>
            </aside>
          </MotionReveal>
        </section>

        <section
          className="program-faq container-wide"
          aria-labelledby="program-faq-title"
        >
          <MotionReveal>
            <SectionHeading title={faqPanel.title} id="program-faq-title" />
          </MotionReveal>
          <MotionReveal delay={80}>
            {/* The board draws six collapsed questions in two columns. They
                are <details> elements so the whole answer is present without
                JavaScript and reachable by find-in-page. */}
            <ul className="program-faq__list">
              {faqPanel.questions.map((question) => (
                <li key={question.id}>
                  <details>
                    <summary>
                      <span>{question.question}</span>
                      <LineIcon name="chevron-down" size={18} />
                    </summary>
                    <p>{question.answer}</p>
                  </details>
                </li>
              ))}
            </ul>
            <ul className="program-faq__links">
              {faqPanel.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    {link.label}
                    <span aria-hidden="true">→</span>
                  </Link>
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
