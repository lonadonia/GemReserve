import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { LineIcon, type IconName } from "@/components/icons/LineIcon";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { ResponsiveHeroImage } from "@/components/ui/ResponsiveHeroImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  futureBanner,
  futureCta,
  futureEnables,
  futureEra,
  futureHero,
  futureRoad,
  futureVision,
} from "@/content/future-infrastructure";

export const metadata: Metadata = {
  title: "The Future of Gemstone Asset Infrastructure",
  description: futureHero.description,
  alternates: { canonical: "/future-infrastructure" },
  openGraph: {
    title: "The Future of Gemstone Asset Infrastructure | GemReserve.io",
    description: futureHero.description,
    url: "/future-infrastructure",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const breadcrumbItems = [
  { label: futureHero.breadcrumb[0], href: "/" },
  { label: futureHero.breadcrumb[1] },
] as const;

const eraIcons: Record<string, IconName> = {
  ownership: "shield-check",
  access: "globe",
  liquidity: "chart",
  transparency: "lock",
  scale: "layers",
  sustainable: "mountain",
};

const layerIcons: Record<string, IconName> = {
  asset: "diamond",
  tokenization: "cubes",
  infrastructure: "layers",
  market: "chart",
  ecosystem: "users",
};

const enableIcons: Record<string, IconName> = {
  investment: "coins",
  inclusion: "globe-user",
  institutional: "bank",
  provenance: "fingerprint",
  markets: "pie",
  legacy: "award",
};

const bannerIcons: Record<string, IconName> = {
  secure: "lock",
  trust: "shield-check",
  innovation: "lightbulb",
  value: "diamond",
};

export default function FutureInfrastructurePage() {
  return (
    <div className="future-page">
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section
          className="hero future-hero"
          aria-labelledby="future-hero-title"
        >
          <div className="hero__media" aria-hidden="true">
            <ResponsiveHeroImage
              desktopBase="/images/heroes/future-hero"
              mobileBase="/images/heroes/future-hero-mobile"
            />
            <span className="hero__scrim future-hero__scrim" />
          </div>

          <div className="hero__inner container-wide">
            <MotionReveal className="hero__copy">
              <Breadcrumbs items={breadcrumbItems} />
              <h1 className="hero__title" id="future-hero-title">
                <span>{futureHero.titleLines[0]}</span>
                <span className="hero__title-accent">
                  {futureHero.titleLines[1]}
                </span>
              </h1>
              <p className="future-hero__tagline">{futureHero.tagline}</p>
              <p className="hero__description">{futureHero.description}</p>

              <aside className="future-hero__callout">
                <Image
                  className="hero-callout__crest"
                  src="/brand/gemreserve-shield-512.png"
                  alt=""
                  width={512}
                  height={622}
                  aria-hidden="true"
                />
                <div>
                  <h2>{futureHero.callout.title}</h2>
                  {futureHero.callout.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </aside>
            </MotionReveal>
          </div>
        </section>

        <section
          className="future-era container-wide"
          aria-labelledby="future-era-title"
        >
          <MotionReveal className="future-panel">
            <h2 className="future-panel__title" id="future-era-title">
              {futureEra.title}
            </h2>
            {futureEra.lines.map((line) => (
              <p className="future-panel__lead" key={line}>
                {line}
              </p>
            ))}
            <ul className="future-grid">
              {futureEra.items.map((item) => (
                <li key={item.id}>
                  <LineIcon name={eraIcons[item.id]} size={38} />
                  <h3>
                    {item.titleLines.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </h3>
                  <p>{item.description}</p>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="future-detail container-wide"
          aria-labelledby="future-vision-title"
        >
          <MotionReveal className="future-panel">
            <h2
              className="future-panel__title future-panel__title--left"
              id="future-vision-title"
            >
              {futureVision.title}
            </h2>
            <p className="future-panel__lead future-panel__lead--left">
              {futureVision.description}
            </p>
            <ol className="future-layers">
              {futureVision.layers.map((layer) => (
                <li key={layer.id}>
                  <span className="future-layers__mark" aria-hidden="true">
                    <LineIcon name={layerIcons[layer.id]} size={28} />
                  </span>
                  <div>
                    <h3>{layer.title}</h3>
                    <p>{layer.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </MotionReveal>

          <MotionReveal className="future-panel" delay={90}>
            <h2
              className="future-panel__title future-panel__title--left"
              id="future-enables-title"
            >
              {futureEnables.title}
            </h2>
            <ul
              className="future-enables"
              aria-labelledby="future-enables-title"
            >
              {futureEnables.items.map((item) => (
                <li key={item.id}>
                  <LineIcon name={enableIcons[item.id]} size={34} />
                  <h3>
                    {item.titleLines.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </h3>
                  <p>{item.description}</p>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="future-road container-wide"
          aria-labelledby="future-road-title"
        >
          <MotionReveal>
            <SectionHeading title={futureRoad.title} id="future-road-title" />
          </MotionReveal>

          <MotionReveal className="future-road__row" delay={80}>
            {/* The board draws a completed check above every phase, including
                the ones it dates to 2026 and beyond. Each phase states the
                status its own label carries instead, so a planned phase is
                never presented as a delivered one. */}
            <ol className="future-phases">
              {futureRoad.phases.map((phase) => (
                <li
                  className={`future-phases__item future-phases__item--${phase.status}`}
                  key={phase.id}
                >
                  <span className="future-phases__mark" aria-hidden="true">
                    <LineIcon
                      name={phase.status === "complete" ? "check" : "refresh"}
                      size={18}
                    />
                  </span>
                  <p className="future-phases__status">
                    {futureRoad.statusLabels[phase.status]}
                  </p>
                  <h3>
                    {phase.titleLines.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </h3>
                  <p>{phase.description}</p>
                </li>
              ))}
            </ol>

            <aside className="future-cta" aria-labelledby="future-cta-title">
              <h2 id="future-cta-title">{futureCta.title}</h2>
              <p>{futureCta.description}</p>
              <Link className="button button--gold" href="/early-participation">
                {futureCta.buttonLabel}
              </Link>
              <p className="future-cta__or">{futureCta.alternativeLabel}</p>
              <Link className="button button--outline" href="/contact">
                {futureCta.secondaryLabel}
              </Link>
            </aside>
          </MotionReveal>
        </section>

        <section
          className="future-banner container-wide"
          aria-label="What GemReserve.io stands for"
        >
          <MotionReveal>
            <ul>
              {futureBanner.map((mark) => (
                <li key={mark.id}>
                  <LineIcon name={bannerIcons[mark.id]} size={34} />
                  <p>
                    {mark.lines.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </p>
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
