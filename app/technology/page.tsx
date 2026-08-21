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
  architectureLayers,
  architectureSectionTitle,
  highlightsSectionTitle,
  integrationLayerItems,
  integrationLayerTitle,
  onChainIntro,
  onChainItems,
  onChainSectionTitle,
  passportPreview,
  securityItems,
  securitySectionTitle,
  technologyCta,
  technologyHero,
  technologyHighlights,
  technologyPillars,
  technologyPillarsSectionTitle,
  technologyStack,
  technologyStackSectionTitle,
} from "@/content/technology";

export const metadata: Metadata = {
  title: "Technology",
  description: technologyHero.description,
  alternates: { canonical: "/technology" },
  openGraph: {
    title: "Technology | GemReserve.io",
    description: technologyHero.description,
    url: "/technology",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const breadcrumbItems = [
  { label: technologyHero.breadcrumb[0], href: "/" },
  { label: technologyHero.breadcrumb[1] },
] as const;

const pillarIcons: Record<string, IconName> = {
  "security-first": "shield-check",
  transparency: "eye",
  "decentralized-trust": "cubes",
  "real-world-backing": "diamond",
  "global-infrastructure": "globe",
  "future-ready": "chart",
};

const layerIcons: Record<string, IconName> = {
  "user-interface": "phone",
  "application-layer": "cubes",
  "business-logic-layer": "contract",
  "data-storage-layer": "box",
  "blockchain-layer": "network",
};

const stackIcons: Record<string, IconName> = {
  blockchain: "network",
  "smart-contracts": "contract",
  "cloud-infrastructure": "globe",
  "apis-integrations": "cubes",
  "data-analytics": "chart",
};

const securityIcons: Record<string, IconName> = {
  encryption: "lock",
  "multi-layer": "shield-check",
  "access-controls": "users",
  monitoring: "eye",
  audits: "certificate",
};

const onChainIcons: Record<string, IconName> = {
  "proof-of-reserves": "diamond",
  "immutable-records": "hand-gem",
  "token-traceability": "shield-check",
  "audit-ready": "check",
};

const highlightIcons: Record<string, IconName> = {
  uptime: "refresh",
  encryption: "lock",
  monitoring: "eye",
  infrastructure: "globe",
  audited: "contract",
  "on-chain": "network",
};

export default function TechnologyPage() {
  return (
    <div className="technology-page">
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section
          className="hero technology-hero"
          aria-labelledby="technology-hero-title"
        >
          <div className="hero__media" aria-hidden="true">
            <ResponsiveHeroImage
              desktopBase="/images/heroes/technology-hero"
              mobileBase="/images/heroes/technology-hero-mobile"
            />
            <span className="hero__scrim technology-hero__scrim" />
          </div>

          <div className="hero__inner technology-hero__inner container-wide">
            <MotionReveal className="hero__copy technology-hero__copy">
              <Breadcrumbs items={breadcrumbItems} />
              <h1 className="hero__title" id="technology-hero-title">
                <span>{technologyHero.titleLines[0]}</span>
                <span className="hero__title-accent">
                  {technologyHero.titleLines[1]}
                </span>
                <span className="hero__title-accent">
                  {technologyHero.titleLines[2]}
                </span>
              </h1>
              <p className="hero__description">{technologyHero.description}</p>
            </MotionReveal>
          </div>
        </section>

        <section
          className="tech-pillars container-wide"
          aria-labelledby="tech-pillars-title"
        >
          <MotionReveal>
            <SectionHeading
              title={technologyPillarsSectionTitle}
              id="tech-pillars-title"
            />
          </MotionReveal>
          <MotionReveal delay={80}>
            <ul className="trust-pillars tech-pillars__grid">
              {technologyPillars.map((pillar) => (
                <li key={pillar.id}>
                  <LineIcon name={pillarIcons[pillar.id]} size={38} />
                  <h3>{pillar.title}</h3>
                  <p>{pillar.description}</p>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="tech-architecture container-wide"
          aria-labelledby="tech-architecture-title"
        >
          <MotionReveal>
            <SectionHeading
              title={architectureSectionTitle}
              id="tech-architecture-title"
            />
          </MotionReveal>

          <MotionReveal className="tech-architecture__panel" delay={80}>
            <ol className="tech-architecture__flow">
              {architectureLayers.map((layer) => (
                <li className="tech-layer" key={layer.id}>
                  <h3>{layer.title}</h3>
                  <LineIcon name={layerIcons[layer.id]} size={34} />
                  <ul>
                    {layer.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>

            <div className="tech-integration">
              <h3>{integrationLayerTitle}</h3>
              <ul>
                {integrationLayerItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </MotionReveal>
        </section>

        <section
          className="tech-detail container-wide"
          aria-labelledby="tech-stack-title"
        >
          <MotionReveal className="tech-detail__card">
            <h2 className="tech-detail__title" id="tech-stack-title">
              {technologyStackSectionTitle}
            </h2>
            <ul className="tech-detail__list">
              {technologyStack.map((item) => (
                <li key={item.id}>
                  <LineIcon name={stackIcons[item.id]} size={26} />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </MotionReveal>

          <MotionReveal className="tech-detail__card" delay={70}>
            <h2 className="tech-detail__title">{securitySectionTitle}</h2>
            <ul className="tech-detail__list">
              {securityItems.map((item) => (
                <li key={item.id}>
                  <LineIcon name={securityIcons[item.id]} size={26} />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </MotionReveal>

          <MotionReveal className="tech-detail__card" delay={140}>
            <h2 className="tech-detail__title">{onChainSectionTitle}</h2>
            <p className="tech-detail__intro">{onChainIntro}</p>
            <div className="tech-onchain">
              <ul className="tech-detail__list">
                {onChainItems.map((item) => (
                  <li key={item.id}>
                    <LineIcon name={onChainIcons[item.id]} size={26} />
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <figure className="passport-card">
                <figcaption className="passport-card__head">
                  <span className="passport-card__brand">
                    {passportPreview.brand}
                  </span>
                </figcaption>
                <p className="passport-card__label">{passportPreview.label}</p>
                <p className="passport-card__reference">
                  {passportPreview.reference}
                </p>
                <dl className="passport-card__rows">
                  {passportPreview.rows.map(([term, value]) => (
                    <div key={term}>
                      <dt>{term}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="passport-card__status">
                  <LineIcon name="check" size={15} />
                  {passportPreview.status}
                </p>
                <p className="passport-card__action">
                  {passportPreview.action}
                </p>
              </figure>
            </div>
          </MotionReveal>
        </section>

        <section
          className="tech-highlights container-wide"
          aria-labelledby="tech-highlights-title"
        >
          <MotionReveal>
            <SectionHeading
              title={highlightsSectionTitle}
              id="tech-highlights-title"
            />
          </MotionReveal>
          <MotionReveal delay={80}>
            <dl className="metric-strip tech-highlights__strip">
              {technologyHighlights.map((highlight) => (
                <div className="metric-item" key={highlight.id}>
                  <LineIcon name={highlightIcons[highlight.id]} size={34} />
                  <div>
                    <dt>{highlight.value}</dt>
                    <dd>{highlight.label}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </MotionReveal>
        </section>

        <section
          className="swiss-cta tech-cta container-wide"
          aria-labelledby="tech-cta-title"
        >
          <MotionReveal className="swiss-cta__visual tech-cta__visual">
            <span aria-hidden="true" />
          </MotionReveal>

          <MotionReveal className="swiss-cta__copy" delay={70}>
            <h2 id="tech-cta-title">{technologyCta.title}</h2>
            <p>{technologyCta.description}</p>
          </MotionReveal>

          <MotionReveal className="swiss-cta__action" delay={130}>
            <Link className="button button--gold" href="/#waitlist">
              {technologyCta.buttonLabel}
            </Link>
            <p>{technologyCta.supportingText}</p>
          </MotionReveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
