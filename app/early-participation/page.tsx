import type { Metadata } from "next";

import { LineIcon, type IconName } from "@/components/icons/LineIcon";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { EarlyAccessForm } from "@/components/ui/EarlyAccessForm";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { ResponsiveHeroImage } from "@/components/ui/ResponsiveHeroImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  dontMissOut,
  joiningRoles,
  nextSteps,
  nextStepsTitle,
  waitlistAssurances,
  waitlistBenefits,
  waitlistFormPanel,
  waitlistHero,
  whyJoinPoints,
  whyJoinTitle,
} from "@/content/early-participation";

export const metadata: Metadata = {
  title: "Early Participation Waitlist",
  description: waitlistHero.description,
  alternates: { canonical: "/early-participation" },
  openGraph: {
    title: "Early Participation Waitlist | GemReserve.io",
    description: waitlistHero.description,
    url: "/early-participation",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const breadcrumbItems = [
  { label: waitlistHero.breadcrumb[0], href: "/" },
  { label: waitlistHero.breadcrumb[1] },
] as const;

const benefitIcons: Record<string, IconName> = {
  "early-access": "lock",
  "launch-discount": "token",
  "exclusive-updates": "globe",
  "priority-consideration": "users",
};

const whyIcons: Record<string, IconName> = {
  "shape-the-future": "diamond",
  "trusted-compliant": "shield-check",
  "global-opportunity": "globe",
  "long-term-value": "chart",
};

const stepIcons: Record<string, IconName> = {
  join: "contract",
  informed: "eye",
  discount: "token",
  grow: "users",
};

const assuranceIcons: Record<string, IconName> = {
  "real-assets": "diamond",
  "secure-platform": "lock",
  "regulatory-commitment": "certificate",
  "community-driven": "users",
};

export default function EarlyParticipationPage() {
  return (
    <div className="waitlist-page">
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section
          className="hero waitlist-hero"
          aria-labelledby="waitlist-hero-title"
        >
          <div className="hero__media" aria-hidden="true">
            <ResponsiveHeroImage
              desktopBase="/images/heroes/waitlist-hero"
              mobileBase="/images/heroes/waitlist-hero-mobile"
            />
            <span className="hero__scrim waitlist-hero__scrim" />
          </div>

          <div className="hero__inner waitlist-hero__inner container-wide">
            <MotionReveal className="hero__copy waitlist-hero__copy">
              <Breadcrumbs items={breadcrumbItems} />
              <h1 className="hero__title" id="waitlist-hero-title">
                <span>{waitlistHero.titleLines[0]}</span>
                <span className="hero__title-accent">
                  {waitlistHero.titleLines[1]}
                </span>
                <span className="hero__title-accent">
                  {waitlistHero.titleLines[2]}
                </span>
              </h1>
              <p className="waitlist-hero__tagline">{waitlistHero.tagline}</p>
              <p className="hero__description">{waitlistHero.description}</p>
            </MotionReveal>
          </div>
        </section>

        <section
          className="waitlist-body container-wide"
          aria-labelledby="waitlist-why-title"
        >
          <div className="waitlist-column">
            <MotionReveal>
              <ul className="trust-pillars waitlist-benefits">
                {waitlistBenefits.map((benefit) => (
                  <li key={benefit.id}>
                    <LineIcon name={benefitIcons[benefit.id]} size={34} />
                    <h2>{benefit.title}</h2>
                    <p>{benefit.description}</p>
                  </li>
                ))}
              </ul>
            </MotionReveal>

            <MotionReveal className="waitlist-panel" delay={70}>
              <h2 className="waitlist-panel__title" id="waitlist-why-title">
                {whyJoinTitle}
              </h2>
              <ul className="waitlist-why">
                {whyJoinPoints.map((point) => (
                  <li key={point.id}>
                    <LineIcon name={whyIcons[point.id]} size={30} />
                    <div>
                      <h3>{point.title}</h3>
                      <p>{point.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </MotionReveal>
          </div>

          <MotionReveal
            className="waitlist-panel waitlist-form-panel"
            delay={130}
          >
            <h2 className="waitlist-panel__title waitlist-panel__title--center">
              {waitlistFormPanel.title}
            </h2>
            <p className="waitlist-form-panel__intro">
              {waitlistFormPanel.intro}
            </p>
            <EarlyAccessForm
              roles={joiningRoles}
              countryLabel={waitlistFormPanel.countryLabel}
              roleLabel={waitlistFormPanel.roleLabel}
              consentLabel={waitlistFormPanel.consentLabel}
              buttonLabel={waitlistFormPanel.buttonLabel}
              privacyNote={waitlistFormPanel.privacyNote}
            />
          </MotionReveal>
        </section>

        <section
          className="waitlist-next container-wide"
          aria-labelledby="waitlist-next-title"
        >
          <MotionReveal>
            <SectionHeading title={nextStepsTitle} id="waitlist-next-title" />
          </MotionReveal>

          <MotionReveal className="waitlist-next__panel" delay={80}>
            <ol className="waitlist-steps">
              {nextSteps.map((step) => (
                <li key={step.id}>
                  <span className="waitlist-steps__number" aria-hidden="true">
                    {step.step}
                  </span>
                  <LineIcon name={stepIcons[step.id]} size={26} />
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>

            <aside
              className="waitlist-miss"
              aria-labelledby="waitlist-miss-title"
            >
              <LineIcon name="certificate" size={38} />
              <div>
                <h3 id="waitlist-miss-title">{dontMissOut.title}</h3>
                {dontMissOut.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </aside>
          </MotionReveal>
        </section>

        <section
          className="waitlist-assurance container-wide"
          aria-label="Why the waitlist is worth joining"
        >
          <MotionReveal>
            <ul className="waitlist-assurance__row">
              {waitlistAssurances.map((mark) => (
                <li key={mark.id}>
                  <LineIcon name={assuranceIcons[mark.id]} size={32} />
                  <div>
                    <h2>{mark.title}</h2>
                    <p>{mark.description}</p>
                  </div>
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
