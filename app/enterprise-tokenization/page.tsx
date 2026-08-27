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
  enterpriseAssetClasses,
  enterprisePartner,
  enterpriseProcess,
  enterpriseServices,
  enterpriseServicesCta,
  enterpriseServicesHero,
  enterpriseServicesMarks,
} from "@/content/enterprise-tokenization";

export const metadata: Metadata = {
  title: "Enterprise Tokenization Services",
  description: enterpriseServicesHero.paragraphs[0],
  alternates: { canonical: "/enterprise-tokenization" },
  openGraph: {
    title: "Enterprise Tokenization Services | GemReserve.io",
    description: enterpriseServicesHero.paragraphs[0],
    url: "/enterprise-tokenization",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const breadcrumbItems = [
  { label: enterpriseServicesHero.breadcrumb[0], href: "/" },
  { label: enterpriseServicesHero.breadcrumb[1] },
] as const;

const markIcons: Record<string, IconName> = {
  "end-to-end": "cubes",
  "institutional-grade": "shield-check",
  "global-reach": "globe",
  "enhanced-liquidity": "droplet",
  "data-insights": "chart",
  "dedicated-partnership": "handshake",
};

const serviceIcons: Record<string, IconName> = {
  evaluation: "search",
  structuring: "file-check",
  "smart-contracts": "code-shield",
  custody: "lock",
  issuance: "rocket",
  "secondary-market": "exchange",
  admin: "pie",
};

const processIcons: Record<string, IconName> = {
  discover: "search",
  structure: "clipboard-check",
  secure: "shield-check",
  tokenize: "cubes",
  distribute: "globe",
  manage: "chart",
};

const assetIcons: Record<string, IconName> = {
  gemstones: "diamond",
  minerals: "mountain",
  metals: "bars",
  luxury: "watch",
  art: "frame",
  "real-estate": "building",
  infrastructure: "turbine",
};

const ctaIcons: Record<string, IconName> = {
  secure: "lock",
  compliant: "file-check",
  transparent: "globe",
  "global-access": "users",
  "real-value": "diamond",
};

export default function EnterpriseTokenizationPage() {
  return (
    <div className="ets-page">
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section className="hero ets-hero" aria-labelledby="ets-hero-title">
          <div className="hero__media" aria-hidden="true">
            <ResponsiveHeroImage
              desktopBase="/images/heroes/ent-services-hero"
              mobileBase="/images/heroes/ent-services-hero-mobile"
            />
            <span className="hero__scrim ets-hero__scrim" />
          </div>

          <div className="hero__inner container-wide">
            <MotionReveal className="hero__copy">
              <Breadcrumbs items={breadcrumbItems} />
              <h1 className="hero__title" id="ets-hero-title">
                <span>{enterpriseServicesHero.titleLines[0]}</span>
                <span className="hero__title-accent">
                  {enterpriseServicesHero.titleLines[1]}
                </span>
              </h1>
              <p className="ets-hero__tagline">
                {enterpriseServicesHero.tagline}
              </p>
              {enterpriseServicesHero.paragraphs.map((paragraph) => (
                <p className="hero__description" key={paragraph}>
                  {paragraph}
                </p>
              ))}

              <aside className="ets-hero__callout">
                <Image
                  className="hero-callout__crest"
                  src="/brand/gemreserve-shield-512.png"
                  alt=""
                  width={512}
                  height={622}
                  aria-hidden="true"
                />
                <div>
                  <h2>{enterpriseServicesHero.callout.title}</h2>
                  <p>{enterpriseServicesHero.callout.line}</p>
                </div>
              </aside>
            </MotionReveal>
          </div>
        </section>

        <section
          className="ets-marks container-wide"
          aria-label="What enterprise tokenization provides"
        >
          <MotionReveal>
            <ul className="trust-pillars ets-marks__row">
              {enterpriseServicesMarks.map((mark) => (
                <li key={mark.id}>
                  <LineIcon name={markIcons[mark.id]} size={36} />
                  <h2>{mark.title}</h2>
                  <p>{mark.description}</p>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="ets-detail container-wide"
          aria-labelledby="ets-services-title"
        >
          <MotionReveal className="ets-card">
            <h2 className="ets-card__title" id="ets-services-title">
              {enterpriseServices.title}
            </h2>
            <ul className="ets-services">
              {enterpriseServices.items.map((service) => (
                <li key={service.id}>
                  <LineIcon name={serviceIcons[service.id]} size={32} />
                  <div>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </MotionReveal>

          <MotionReveal className="ets-card" delay={90}>
            <h2 className="ets-card__title" id="ets-partner-title">
              {enterprisePartner.title}
            </h2>
            <ul className="ets-partner" aria-labelledby="ets-partner-title">
              {enterprisePartner.points.map((point) => (
                <li key={point}>
                  <LineIcon name="check" size={18} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <aside
              className="ets-statement"
              aria-labelledby="ets-statement-title"
            >
              <div>
                <h3 id="ets-statement-title">
                  {enterprisePartner.statement.titleLines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </h3>
                <p>{enterprisePartner.statement.description}</p>
              </div>
              <ImageWithGlow
                className="ets-statement__image"
                src="/images/sections/blockchain-network.webp"
                alt={enterprisePartner.statement.imageAlt}
                sizes="(max-width: 980px) 60vw, 18vw"
              />
            </aside>
          </MotionReveal>
        </section>

        <section
          className="ets-process container-wide"
          aria-labelledby="ets-process-title"
        >
          <MotionReveal>
            <SectionHeading
              title={enterpriseProcess.title}
              id="ets-process-title"
            />
          </MotionReveal>

          <MotionReveal delay={80}>
            <ol className="ets-steps">
              {enterpriseProcess.steps.map((step) => (
                <li key={step.id}>
                  <span className="ets-steps__mark" aria-hidden="true">
                    <LineIcon name={processIcons[step.id]} size={32} />
                  </span>
                  <span className="ets-steps__number" aria-hidden="true">
                    {step.step}
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
          </MotionReveal>
        </section>

        <section
          className="ets-assets container-wide"
          aria-labelledby="ets-assets-title"
        >
          <MotionReveal className="ets-assets__panel">
            <h2 className="ets-assets__title" id="ets-assets-title">
              {enterpriseAssetClasses.title}
            </h2>
            <ul className="ets-assets__grid">
              {enterpriseAssetClasses.items.map((item) => (
                <li key={item.id}>
                  <span className="ets-assets__mark" aria-hidden="true">
                    <LineIcon name={assetIcons[item.id]} size={40} />
                  </span>
                  <h3>
                    {item.titleLines.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </h3>
                </li>
              ))}
            </ul>
            <p className="ets-assets__tagline">
              {enterpriseAssetClasses.tagline}
            </p>
          </MotionReveal>
        </section>

        <section
          className="ets-cta container-wide"
          aria-labelledby="ets-cta-title"
        >
          <MotionReveal className="ets-cta__panel">
            <div className="ets-cta__copy">
              <h2 id="ets-cta-title">
                {enterpriseServicesCta.titleLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h2>
              <p>{enterpriseServicesCta.description}</p>
              <Link className="button button--gold" href="/early-participation">
                {enterpriseServicesCta.buttonLabel}
              </Link>
              <p className="ets-cta__note">
                {enterpriseServicesCta.supportingText}
              </p>
            </div>

            <ul className="ets-cta__marks">
              {enterpriseServicesCta.marks.map((mark) => (
                <li key={mark.id}>
                  <LineIcon name={ctaIcons[mark.id]} size={32} />
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
