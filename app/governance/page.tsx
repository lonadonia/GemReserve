import type { Metadata } from "next";

import { GovernancePyramid } from "@/components/diagrams/GovernancePyramid";
import { LineIcon, type IconName } from "@/components/icons/LineIcon";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ImageWithGlow } from "@/components/ui/ImageWithGlow";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { ResponsiveHeroImage } from "@/components/ui/ResponsiveHeroImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { missionStatement, missionTitle } from "@/content/about";
import {
  accountabilityItems,
  accountabilitySectionTitle,
  decisionSectionTitle,
  decisionSteps,
  governanceCommitment,
  governanceHero,
  governancePrinciples,
  governanceTiers,
  principlesSectionTitle,
  structureSectionTitle,
} from "@/content/governance";

export const metadata: Metadata = {
  title: "Governance",
  description: governanceHero.description,
  alternates: { canonical: "/governance" },
  openGraph: {
    title: "Governance | GemReserve.io",
    description: governanceHero.description,
    url: "/governance",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const breadcrumbItems = [
  { label: governanceHero.breadcrumb[0], href: "/" },
  { label: governanceHero.breadcrumb[1] },
  { label: governanceHero.breadcrumb[2] },
] as const;

const principleIcons: Record<string, IconName> = {
  integrity: "certificate",
  transparency: "eye",
  accountability: "shield-check",
  fairness: "users",
  security: "lock",
  "long-term-value": "chart",
};

const tierIcons: Record<string, IconName> = {
  board: "certificate",
  executive: "contract",
  advisory: "shield-check",
  community: "users",
};

const decisionIcons: Record<string, IconName> = {
  proposal: "contract",
  review: "search",
  approval: "check",
  implementation: "refresh",
  monitoring: "chart",
};

const accountabilityIcons: Record<string, IconName> = {
  "on-chain-transparency": "globe",
  "regular-reporting": "contract",
  "independent-audits": "shield-check",
  "compliance-ethics": "certificate",
  "stakeholder-engagement": "users",
};

const commitmentIcons: Record<string, IconName> = {
  trust: "diamond",
  experts: "shield-check",
  transparency: "globe",
  future: "refresh",
};

export default function GovernancePage() {
  return (
    <div className="governance-page">
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section
          className="hero governance-hero"
          aria-labelledby="governance-hero-title"
        >
          <div className="hero__media" aria-hidden="true">
            <ResponsiveHeroImage
              desktopBase="/images/heroes/governance-hero"
              mobileBase="/images/heroes/governance-hero-mobile"
            />
            <span className="hero__scrim governance-hero__scrim" />
          </div>

          <div className="hero__inner governance-hero__inner container-wide">
            <MotionReveal className="hero__copy governance-hero__copy">
              <Breadcrumbs items={breadcrumbItems} />
              <h1 className="hero__title" id="governance-hero-title">
                <span>{governanceHero.titleLines[0]}</span>
                <span className="hero__title-accent">
                  {governanceHero.titleLines[1]}
                </span>
                <span className="hero__title-accent">
                  {governanceHero.titleLines[2]}
                </span>
              </h1>
              <p className="hero__description">{governanceHero.description}</p>
            </MotionReveal>

            <MotionReveal
              className="hero-callout governance-hero__callout"
              delay={120}
            >
              <aside aria-labelledby="governance-mission-title">
                <LineIcon name="search" size={34} />
                <div>
                  <h2 id="governance-mission-title">{missionTitle}</h2>
                  <p>{missionStatement}</p>
                </div>
              </aside>
            </MotionReveal>
          </div>
        </section>

        <section
          className="governance-principles container-wide"
          aria-labelledby="governance-principles-title"
        >
          <MotionReveal>
            <SectionHeading
              title={principlesSectionTitle}
              id="governance-principles-title"
            />
          </MotionReveal>
          <MotionReveal delay={80}>
            <ul className="trust-pillars governance-principles__grid">
              {governancePrinciples.map((principle) => (
                <li key={principle.id}>
                  <LineIcon name={principleIcons[principle.id]} size={38} />
                  <h3>{principle.title}</h3>
                  <p>{principle.description}</p>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="governance-detail container-wide"
          aria-labelledby="governance-structure-title"
        >
          <MotionReveal className="governance-card">
            <h2
              className="governance-card__title"
              id="governance-structure-title"
            >
              {structureSectionTitle}
            </h2>
            <div className="governance-structure">
              <GovernancePyramid
                tiers={governanceTiers}
                title={structureSectionTitle}
              />
              <ul className="governance-structure__list">
                {governanceTiers.map((tier) => (
                  <li key={tier.id}>
                    <LineIcon name={tierIcons[tier.id]} size={26} />
                    <div>
                      <h3>{tier.title}</h3>
                      <p>{tier.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </MotionReveal>

          <MotionReveal className="governance-card" delay={70}>
            <h2 className="governance-card__title">{decisionSectionTitle}</h2>
            <ol className="governance-steps">
              {decisionSteps.map((step) => (
                <li key={step.id}>
                  <span className="governance-steps__number" aria-hidden="true">
                    {step.step}
                  </span>
                  <LineIcon name={decisionIcons[step.id]} size={26} />
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </MotionReveal>
        </section>

        <section
          className="governance-accountability container-wide"
          aria-labelledby="governance-accountability-title"
        >
          <MotionReveal>
            <SectionHeading
              title={accountabilitySectionTitle}
              id="governance-accountability-title"
            />
          </MotionReveal>
          <MotionReveal delay={80}>
            <ul className="trust-pillars governance-accountability__grid">
              {accountabilityItems.map((item) => (
                <li key={item.id}>
                  <LineIcon name={accountabilityIcons[item.id]} size={38} />
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="swiss-cta governance-commitment container-wide"
          aria-labelledby="governance-commitment-title"
        >
          <MotionReveal className="swiss-cta__visual">
            <ImageWithGlow
              className="swiss-cta__image"
              src="/images/sections/swiss-matterhorn.webp"
              alt="The Swiss flag before a snow-covered Matterhorn"
              sizes="(max-width: 760px) 100vw, 30vw"
            />
          </MotionReveal>

          <MotionReveal className="swiss-cta__copy" delay={70}>
            <h2 id="governance-commitment-title">
              {governanceCommitment.title}
            </h2>
            <p>{governanceCommitment.description}</p>
          </MotionReveal>

          <MotionReveal className="governance-commitment__marks" delay={130}>
            <ul>
              {governanceCommitment.marks.map((mark) => (
                <li key={mark.id}>
                  <LineIcon name={commitmentIcons[mark.id]} size={30} />
                  <span>{mark.label}</span>
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
