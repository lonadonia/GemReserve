import type { Metadata } from "next";
import Link from "next/link";

import { ProceedsDonut } from "@/components/diagrams/ProceedsDonut";
import { LineIcon, type IconName } from "@/components/icons/LineIcon";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { ResponsiveHeroImage } from "@/components/ui/ResponsiveHeroImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  assuranceItems,
  executiveHighlights,
  executiveSectionTitle,
  executiveSummary,
  financialHighlights,
  financialSectionTitle,
  investorsHero,
  marketFigure,
  marketIntro,
  marketPoints,
  marketSectionTitle,
  partnerPanel,
  proceedsSectionTitle,
  proceedsSlices,
  roadmapMilestones,
  roadmapSectionTitle,
  solutionIntro,
  solutionPoints,
  solutionSectionTitle,
  whyInvestPoints,
  whyInvestSectionTitle,
} from "@/content/investors";

export const metadata: Metadata = {
  title: "Investor Presentation",
  description: investorsHero.description,
  alternates: { canonical: "/investors" },
  openGraph: {
    title: "Investor Presentation | GemReserve.io",
    description: investorsHero.description,
    url: "/investors",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const breadcrumbItems = [
  { label: investorsHero.breadcrumb[0], href: "/" },
  { label: investorsHero.breadcrumb[1] },
  { label: investorsHero.breadcrumb[2] },
] as const;

const executiveIcons: Record<string, IconName> = {
  market: "diamond",
  demand: "users",
  blockchain: "globe",
  generations: "shield-check",
};

const marketIcons: Record<string, IconName> = {
  "wealth-preservation": "users",
  "limited-supply": "diamond",
  "high-demand": "hand-gem",
  "inefficient-market": "chart",
};

const solutionIcons: Record<string, IconName> = {
  "asset-backing": "vault",
  "digital-passports": "passport",
  "tokenization-engine": "cubes",
  "global-marketplace": "chart",
};

const financialIcons: Record<string, IconName> = {
  revenue: "chart",
  ebitda: "trade",
  margin: "token",
  tokenized: "cubes",
  users: "users",
};

const assuranceIcons: Record<string, IconName> = {
  backed: "diamond",
  secure: "shield-check",
  transparent: "eye",
  global: "globe",
};

export default function InvestorsPage() {
  return (
    <div className="investors-page">
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section
          className="hero investors-hero"
          aria-labelledby="investors-hero-title"
        >
          <div className="hero__media" aria-hidden="true">
            <ResponsiveHeroImage
              desktopBase="/images/heroes/investors-hero"
              mobileBase="/images/heroes/investors-hero-mobile"
            />
            <span className="hero__scrim investors-hero__scrim" />
          </div>

          <div className="hero__inner investors-hero__inner container-wide">
            <MotionReveal className="hero__copy investors-hero__copy">
              <Breadcrumbs items={breadcrumbItems} />
              <h1
                className="hero__title investors-hero__title"
                id="investors-hero-title"
              >
                <span>{investorsHero.titleLines[0]}</span>
                <span className="hero__title-accent">
                  {investorsHero.titleLines[1]}
                </span>
              </h1>
              <p className="investors-hero__tagline">{investorsHero.tagline}</p>
              <p className="hero__description">{investorsHero.description}</p>

              <aside className="investors-hero__callout">
                <LineIcon name="shield-check" size={34} />
                <div>
                  <h2>{investorsHero.callout.title}</h2>
                  <p>{investorsHero.callout.lines[0]}</p>
                  <p>{investorsHero.callout.lines[1]}</p>
                </div>
              </aside>
            </MotionReveal>
          </div>
        </section>

        <section
          className="investors-executive container-wide"
          aria-labelledby="investors-executive-title"
        >
          <MotionReveal>
            <SectionHeading
              title={executiveSectionTitle}
              id="investors-executive-title"
            />
          </MotionReveal>

          <MotionReveal className="investors-executive__panel" delay={80}>
            <p className="investors-executive__summary">{executiveSummary}</p>
            <ul className="investors-executive__grid">
              {executiveHighlights.map((item) => (
                <li key={item.id}>
                  <LineIcon name={executiveIcons[item.id]} size={34} />
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="investors-thesis container-wide"
          aria-labelledby="investors-market-title"
        >
          <MotionReveal className="investors-card">
            <h2 className="investors-card__title" id="investors-market-title">
              {marketSectionTitle}
            </h2>
            <p className="investors-card__intro">{marketIntro}</p>

            <div className="market-figure">
              <p className="market-figure__value">{marketFigure.value}</p>
              <p className="market-figure__label">{marketFigure.label}</p>
            </div>

            <ul className="investors-card__list">
              {marketPoints.map((point) => (
                <li key={point.id}>
                  <LineIcon name={marketIcons[point.id]} size={24} />
                  <div>
                    <h3>{point.title}</h3>
                    <p>{point.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </MotionReveal>

          <MotionReveal className="investors-card" delay={70}>
            <h2 className="investors-card__title">{solutionSectionTitle}</h2>
            <p className="investors-card__intro">{solutionIntro}</p>
            <ul className="investors-card__list">
              {solutionPoints.map((point) => (
                <li key={point.id}>
                  <LineIcon name={solutionIcons[point.id]} size={24} />
                  <div>
                    <h3>{point.title}</h3>
                    <p>{point.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </MotionReveal>

          <MotionReveal className="investors-card" delay={140}>
            <h2 className="investors-card__title">{whyInvestSectionTitle}</h2>
            <ul className="investors-card__list investors-card__list--checks">
              {whyInvestPoints.map((point) => (
                <li key={point.id}>
                  <LineIcon name="check" size={24} />
                  <div>
                    <h3>{point.title}</h3>
                    <p>{point.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="investors-financials container-wide"
          aria-labelledby="investors-financial-title"
        >
          <MotionReveal className="investors-card">
            <h2
              className="investors-card__title"
              id="investors-financial-title"
            >
              {financialSectionTitle}
            </h2>
            <dl className="financial-grid">
              {financialHighlights.map((item) => (
                <div key={item.id}>
                  <LineIcon name={financialIcons[item.id]} size={32} />
                  <dt>{item.value}</dt>
                  <dd>
                    {item.label}
                    {item.detail ? <small>{item.detail}</small> : null}
                  </dd>
                </div>
              ))}
            </dl>
          </MotionReveal>

          <MotionReveal className="investors-card" delay={80}>
            <h2 className="investors-card__title">{proceedsSectionTitle}</h2>
            <ProceedsDonut slices={proceedsSlices} />
          </MotionReveal>
        </section>

        <section
          className="investors-roadmap-row container-wide"
          aria-labelledby="investors-roadmap-title"
        >
          <MotionReveal className="investors-card">
            <h2 className="investors-card__title" id="investors-roadmap-title">
              {roadmapSectionTitle}
            </h2>
            <ol className="roadmap">
              {roadmapMilestones.map((milestone) => (
                <li key={milestone.id}>
                  <span className="roadmap__marker" aria-hidden="true">
                    <LineIcon name="check" size={16} />
                  </span>
                  <p className="roadmap__year">{milestone.year}</p>
                  <h3>{milestone.title}</h3>
                  <p className="roadmap__description">
                    {milestone.description}
                  </p>
                </li>
              ))}
            </ol>
          </MotionReveal>

          <MotionReveal className="investors-card investors-partner" delay={80}>
            <h2 className="investors-card__title">{partnerPanel.title}</h2>
            <p>{partnerPanel.lines[0]}</p>
            <p className="investors-partner__accent">{partnerPanel.lines[1]}</p>
            <Link className="button button--gold" href="/#waitlist">
              <span>{partnerPanel.buttonLines[0]}</span>
              <span>{partnerPanel.buttonLines[1]}</span>
            </Link>
            <p className="investors-partner__note">
              {partnerPanel.supportingText}
            </p>
          </MotionReveal>
        </section>

        <section
          className="investors-assurance container-wide"
          aria-label="Investor assurances"
        >
          <MotionReveal>
            <ul className="investors-assurance__row">
              {assuranceItems.map((item) => (
                <li key={item.id}>
                  <LineIcon name={assuranceIcons[item.id]} size={30} />
                  <div>
                    <h2>{item.title}</h2>
                    <p>{item.description}</p>
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
