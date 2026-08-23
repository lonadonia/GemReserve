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
  architectureOverviewTitle,
  cloudItems,
  cloudMapAlt,
  cloudTitle,
  componentItems,
  componentsTitle,
  infrastructureBadges,
  infrastructureCta,
  infrastructureHero,
  reliabilityItems,
  reliabilityTitle,
  securityLayerItems,
  securityLayerNote,
  securityLayerTitle,
} from "@/content/infrastructure";
import { architectureLayers } from "@/content/technology";

export const metadata: Metadata = {
  title: "Platform Infrastructure",
  description: infrastructureHero.description,
  alternates: { canonical: "/platform-infrastructure" },
  openGraph: {
    title: "Platform Infrastructure | GemReserve.io",
    description: infrastructureHero.description,
    url: "/platform-infrastructure",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const breadcrumbItems = [
  { label: infrastructureHero.breadcrumb[0], href: "/" },
  { label: infrastructureHero.breadcrumb[1], href: "/technology" },
  { label: infrastructureHero.breadcrumb[2] },
] as const;

const badgeIcons: Record<string, IconName> = {
  "enterprise-grade": "lock",
  "global-scalable": "globe",
  "secure-resilient": "shield-check",
  "real-time": "refresh",
  "future-ready": "cubes",
};

// The five layers are the ones /technology already draws, so their plates come
// from the same library rather than being generated a second time.
const layerPlates: Record<string, string> = {
  "user-interface": "A gold desktop monitor beside a gold smartphone",
  "application-layer": "A stack of gold cubes",
  "business-logic-layer": "Two meshing gold gears",
  "data-storage-layer": "A stack of gold database discs",
  "blockchain-layer": "A lattice of gold network nodes",
};

const reliabilityIcons: Record<string, IconName> = {
  "multi-layer": "shield-check",
  encryption: "lock",
  access: "users",
  monitoring: "eye",
  continuity: "refresh",
  compliance: "certificate",
};

const cloudIcons: Record<string, IconName> = {
  provider: "cubes",
  regions: "globe",
  residency: "contract",
  redundancy: "network",
};

const componentIcons: Record<string, IconName> = {
  blockchain: "network",
  contracts: "contract",
  custody: "vault",
  oracle: "refresh",
  api: "cubes",
  analytics: "chart",
};

const metricIcons: Record<string, IconName> = {
  uptime: "refresh",
  encryption: "lock",
  monitoring: "eye",
  global: "globe",
};

export default function PlatformInfrastructurePage() {
  return (
    <div className="infrastructure-page">
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section
          className="hero infrastructure-hero"
          aria-labelledby="infrastructure-hero-title"
        >
          <div className="hero__media" aria-hidden="true">
            <ResponsiveHeroImage
              desktopBase="/images/heroes/infrastructure-hero"
              mobileBase="/images/heroes/infrastructure-hero-mobile"
            />
            <span className="hero__scrim infrastructure-hero__scrim" />
          </div>

          <div className="hero__inner infrastructure-hero__inner container-wide">
            <MotionReveal className="hero__copy">
              <Breadcrumbs items={breadcrumbItems} />
              <h1 className="hero__title" id="infrastructure-hero-title">
                <span>{infrastructureHero.titleLines[0]}</span>
                <span className="hero__title-accent">
                  {infrastructureHero.titleLines[1]}
                </span>
              </h1>
              <div className="infrastructure-hero__rule" aria-hidden="true">
                <span />
                <em>◆</em>
                <span />
              </div>
              <p className="hero__description">
                {infrastructureHero.description}
              </p>
            </MotionReveal>
          </div>
        </section>

        <section
          className="infrastructure-badges container-wide"
          aria-label="Infrastructure principles"
        >
          <MotionReveal>
            <ul className="trust-pillars infrastructure-badges__grid">
              {infrastructureBadges.map((badge) => (
                <li key={badge.id}>
                  <LineIcon name={badgeIcons[badge.id]} size={36} />
                  <h2>{badge.title}</h2>
                  <p>{badge.description}</p>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="tech-architecture infrastructure-architecture container-wide"
          aria-labelledby="infrastructure-architecture-title"
        >
          <MotionReveal>
            <SectionHeading
              title={architectureOverviewTitle}
              id="infrastructure-architecture-title"
            />
          </MotionReveal>

          <MotionReveal className="tech-architecture__panel" delay={80}>
            <ol className="tech-architecture__flow">
              {architectureLayers.map((layer) => (
                <li className="tech-layer" key={layer.id}>
                  <h3>{layer.title}</h3>
                  <Image
                    className="tech-layer__plate"
                    src={`/images/architecture/${layer.id}.webp`}
                    alt={layerPlates[layer.id]}
                    width={320}
                    height={320}
                    sizes="(max-width: 760px) 68px, (max-width: 1240px) 72px, 84px"
                  />
                  <ul>
                    {layer.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>

            {/* The board runs this band beneath all five layers rather than
                beside them, because it applies across every one of them. */}
            <div className="tech-integration infrastructure-security-layer">
              <h3>
                {securityLayerTitle} <em>{securityLayerNote}</em>
              </h3>
              <ul>
                {securityLayerItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </MotionReveal>
        </section>

        <section
          className="tech-detail infrastructure-detail container-wide"
          aria-label="Security, cloud and core components"
        >
          <MotionReveal className="tech-detail__card">
            <h2 className="tech-detail__title" id="infrastructure-security">
              {reliabilityTitle}
            </h2>
            <ul className="tech-detail__list">
              {reliabilityItems.map((item) => (
                <li key={item.id}>
                  <LineIcon name={reliabilityIcons[item.id]} size={26} />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </MotionReveal>

          <MotionReveal className="tech-detail__card" delay={70}>
            <h2 className="tech-detail__title tech-detail__title--center">
              {cloudTitle}
            </h2>
            <Image
              className="infrastructure-map"
              src="/images/sections/world-map.webp"
              alt={cloudMapAlt}
              width={1200}
              height={620}
              sizes="(max-width: 1330px) 90vw, 34vw"
            />
            <ul className="tech-detail__list">
              {cloudItems.map((item) => (
                <li key={item.id}>
                  <LineIcon name={cloudIcons[item.id]} size={26} />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </MotionReveal>

          <MotionReveal className="tech-detail__card" delay={140}>
            <h2 className="tech-detail__title">{componentsTitle}</h2>
            <ul className="tech-detail__list">
              {componentItems.map((item) => (
                <li key={item.id}>
                  <LineIcon name={componentIcons[item.id]} size={26} />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="trust-cta infrastructure-cta container-wide"
          aria-labelledby="infrastructure-cta-title"
        >
          <MotionReveal className="trust-cta__visual">
            <ImageWithGlow
              className="trust-cta__image"
              src="/images/sections/open-vault.webp"
              alt={infrastructureCta.imageAlt}
              sizes="(max-width: 760px) 100vw, 26vw"
            />
          </MotionReveal>

          <MotionReveal className="trust-cta__copy" delay={70}>
            <h2 id="infrastructure-cta-title">
              <span>{infrastructureCta.titleLines[0]}</span>
              <span>{infrastructureCta.titleLines[1]}</span>
            </h2>
            <p>{infrastructureCta.description}</p>
          </MotionReveal>

          <MotionReveal className="infrastructure-cta__metrics" delay={130}>
            <dl>
              {infrastructureCta.metrics.map((metric) => (
                <div key={metric.id}>
                  <LineIcon name={metricIcons[metric.id]} size={28} />
                  <dt>{metric.value}</dt>
                  <dd>{metric.label}</dd>
                </div>
              ))}
            </dl>
          </MotionReveal>
        </section>

        <section className="infrastructure-next container-wide">
          <MotionReveal>
            <p>
              Read more about the platform on the{" "}
              <Link href="/technology">Technology overview</Link>, or see how a
              stone reaches it in{" "}
              <Link href="/gemstone-tokenization">Gemstone Tokenization</Link>.
            </p>
          </MotionReveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
