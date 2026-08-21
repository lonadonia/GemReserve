import type { Metadata } from "next";
import Link from "next/link";

import { LineIcon, type IconName } from "@/components/icons/LineIcon";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { ResponsiveHeroImage } from "@/components/ui/ResponsiveHeroImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  benefitsSectionTitle,
  enterpriseBenefits,
  enterpriseCta,
  enterpriseHero,
  enterpriseProcess,
  enterpriseSolutions,
  processSectionTitle,
  solutionActionLabel,
  solutionsSectionTitle,
  trustedAudiences,
  trustedBySectionTitle,
} from "@/content/enterprise";

export const metadata: Metadata = {
  title: "Enterprise Services",
  description: enterpriseHero.description,
  alternates: { canonical: "/enterprise" },
  openGraph: {
    title: "Enterprise Services | GemReserve.io",
    description: enterpriseHero.description,
    url: "/enterprise",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const breadcrumbItems = [
  { label: enterpriseHero.breadcrumb[0], href: "/" },
  { label: enterpriseHero.breadcrumb[1] },
] as const;

const solutionIcons: Record<string, IconName> = {
  "asset-tokenization": "cubes",
  "regulatory-compliance": "shield-check",
  "custody-asset-security": "lock",
  "smart-contract-development": "contract",
  "liquidity-market-enablement": "chart",
  "white-label-platform": "users",
};

const stepIcons: Record<string, IconName> = {
  discover: "search",
  design: "passport",
  comply: "shield-check",
  tokenize: "cubes",
  launch: "globe",
  manage: "trade",
};

// The reference gives each audience its own mark rather than repeating one.
const audienceIcons: Record<string, IconName> = {
  "asset-owners": "globe",
  "institutional-investors": "box",
  "financial-institutions": "contract",
  "family-offices": "users",
  "tech-partners": "network",
  marketplaces: "trade",
  "global-enterprises": "cubes",
};

const benefitIcons: Record<string, IconName> = {
  "global-reach": "globe",
  "increased-liquidity": "refresh",
  "security-trust": "shield-check",
  "operational-efficiency": "contract",
  "fractional-ownership": "users",
  "data-insights": "chart",
  "sustainable-growth": "mountain",
  "dedicated-support": "phone",
};

export default function EnterprisePage() {
  return (
    <div className="enterprise-page">
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section
          className="hero enterprise-hero"
          aria-labelledby="enterprise-hero-title"
        >
          <div className="hero__media" aria-hidden="true">
            <ResponsiveHeroImage
              desktopBase="/images/heroes/enterprise-hero"
              mobileBase="/images/heroes/enterprise-hero-mobile"
            />
            <span className="hero__scrim enterprise-hero__scrim" />
          </div>

          <div className="hero__inner enterprise-hero__inner container-wide">
            <MotionReveal className="hero__copy enterprise-hero__copy">
              <Breadcrumbs items={breadcrumbItems} />
              <h1
                className="hero__title enterprise-hero__title"
                id="enterprise-hero-title"
              >
                <span>{enterpriseHero.titleLines[0]}</span>
                <span className="hero__title-accent">
                  {enterpriseHero.titleLines[1]}
                </span>
              </h1>
              <p className="enterprise-hero__tagline">
                {enterpriseHero.tagline}
              </p>
              <p className="hero__description">{enterpriseHero.description}</p>

              <aside className="enterprise-hero__callout">
                <LineIcon name="shield-check" size={34} />
                <div>
                  <h2>{enterpriseHero.callout.title}</h2>
                  <p>{enterpriseHero.callout.description}</p>
                </div>
              </aside>
            </MotionReveal>
          </div>
        </section>

        <section
          className="enterprise-solutions container-wide"
          aria-labelledby="enterprise-solutions-title"
        >
          <MotionReveal>
            <SectionHeading
              title={solutionsSectionTitle}
              id="enterprise-solutions-title"
            />
          </MotionReveal>

          <ul className="enterprise-solutions__grid">
            {enterpriseSolutions.map((solution, index) => (
              <li key={solution.id}>
                <MotionReveal className="solution-card" delay={index * 55}>
                  <LineIcon name={solutionIcons[solution.id]} size={38} />
                  <h3>{solution.title}</h3>
                  <p>{solution.description}</p>
                  <ul>
                    {solution.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <span
                    className="button button--outline button--small solution-card__action"
                    aria-hidden="true"
                  >
                    {solutionActionLabel}
                  </span>
                </MotionReveal>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="enterprise-process container-wide"
          aria-labelledby="enterprise-process-title"
        >
          <MotionReveal>
            <SectionHeading
              title={processSectionTitle}
              id="enterprise-process-title"
            />
          </MotionReveal>

          <MotionReveal className="enterprise-process__panel" delay={80}>
            <ol className="enterprise-steps">
              {enterpriseProcess.map((step) => (
                <li key={step.id}>
                  <span className="enterprise-steps__icon">
                    <LineIcon name={stepIcons[step.id]} size={30} />
                  </span>
                  <span className="enterprise-steps__number">{step.step}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
          </MotionReveal>
        </section>

        <section
          className="enterprise-close container-wide"
          aria-labelledby="enterprise-benefits-title"
        >
          <MotionReveal className="enterprise-benefits">
            <h2
              className="enterprise-benefits__title"
              id="enterprise-benefits-title"
            >
              {benefitsSectionTitle}
            </h2>
            <ul>
              {enterpriseBenefits.map((benefit) => (
                <li key={benefit.id}>
                  <LineIcon name={benefitIcons[benefit.id]} size={28} />
                  <div>
                    <h3>{benefit.title}</h3>
                    <p>{benefit.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </MotionReveal>

          <MotionReveal className="enterprise-invite" delay={90}>
            <h2>
              <span>{enterpriseCta.titleLines[0]}</span>
              <span>{enterpriseCta.titleLines[1]}</span>
            </h2>
            <p>{enterpriseCta.description}</p>
            <Link className="button button--gold" href="/#waitlist">
              {enterpriseCta.primaryLabel}
            </Link>
            <p className="enterprise-invite__divider">
              {enterpriseCta.dividerLabel}
            </p>
            <span
              className="button button--outline enterprise-invite__secondary"
              aria-hidden="true"
            >
              {enterpriseCta.secondaryLabel}
            </span>
            <ul className="enterprise-invite__assurances">
              {enterpriseCta.assurances.map((line) => (
                <li key={line}>
                  <LineIcon name="check" size={16} />
                  {line}
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="enterprise-trusted container-wide"
          aria-labelledby="enterprise-trusted-title"
        >
          <MotionReveal>
            <h2
              className="enterprise-trusted__title"
              id="enterprise-trusted-title"
            >
              {trustedBySectionTitle}
            </h2>
          </MotionReveal>
          <MotionReveal delay={70}>
            <ul className="enterprise-trusted__row">
              {trustedAudiences.map((audience) => (
                <li key={audience.id}>
                  <LineIcon name={audienceIcons[audience.id]} size={30} />
                  <span>{audience.label}</span>
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
