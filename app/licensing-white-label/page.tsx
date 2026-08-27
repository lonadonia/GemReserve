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
  licensingCompliance,
  licensingCta,
  licensingFoundation,
  licensingFuture,
  licensingHero,
  licensingWhiteLabel,
} from "@/content/licensing-white-label";

export const metadata: Metadata = {
  title: "Technology, Licensing & White Label",
  description: licensingHero.description,
  alternates: { canonical: "/licensing-white-label" },
  openGraph: {
    title: "Technology, Licensing & White Label | GemReserve.io",
    description: licensingHero.description,
    url: "/licensing-white-label",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const breadcrumbItems = [
  { label: licensingHero.breadcrumb[0], href: "/" },
  { label: licensingHero.breadcrumb[1] },
] as const;

const foundationIcons: Record<string, IconName> = {
  blockchain: "cubes",
  "smart-contracts": "code-shield",
  security: "lock",
  scalable: "globe",
  "cloud-api": "layers",
  analytics: "chart",
};

const complianceIcons: Record<string, IconName> = {
  regulatory: "bank",
  "kyc-aml": "user-check",
  "licensed-structure": "file-check",
  "global-coverage": "globe",
};

const futureIcons: Record<string, IconName> = {
  "future-proof": "refresh",
  sustainable: "mountain",
  partnerships: "handshake",
  innovation: "rocket",
  support: "users",
  opportunities: "globe",
};

export default function LicensingWhiteLabelPage() {
  return (
    <div className="licensing-page">
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section
          className="hero licensing-hero"
          aria-labelledby="licensing-hero-title"
        >
          <div className="hero__media" aria-hidden="true">
            <ResponsiveHeroImage
              desktopBase="/images/heroes/licensing-hero"
              mobileBase="/images/heroes/licensing-hero-mobile"
            />
            <span className="hero__scrim licensing-hero__scrim" />
          </div>

          <div className="hero__inner container-wide">
            <MotionReveal className="hero__copy">
              <Breadcrumbs items={breadcrumbItems} />
              <h1 className="hero__title" id="licensing-hero-title">
                <span>{licensingHero.titleLines[0]}</span>
                <span className="hero__title-accent">
                  {licensingHero.titleLines[1]}
                </span>
                <span>{licensingHero.titleLines[2]}</span>
              </h1>
              <p className="licensing-hero__tagline">
                {licensingHero.taglineLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>
              <p className="hero__description">{licensingHero.description}</p>

              <aside className="licensing-hero__callout">
                <Image
                  className="hero-callout__crest"
                  src="/brand/gemreserve-shield-512.png"
                  alt=""
                  width={512}
                  height={622}
                  aria-hidden="true"
                />
                <div>
                  <h2>{licensingHero.callout.title}</h2>
                  {licensingHero.callout.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </aside>
            </MotionReveal>
          </div>
        </section>

        <section
          className="licensing-foundation container-wide"
          aria-labelledby="licensing-foundation-title"
        >
          <MotionReveal className="licensing-panel">
            <h2
              className="licensing-panel__title"
              id="licensing-foundation-title"
            >
              {licensingFoundation.title}
            </h2>
            <ul className="licensing-grid">
              {licensingFoundation.items.map((item) => (
                <li key={item.id}>
                  <LineIcon name={foundationIcons[item.id]} size={38} />
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
          className="licensing-compliance container-wide"
          aria-labelledby="licensing-compliance-title"
        >
          <MotionReveal className="licensing-panel licensing-compliance__panel">
            <ImageWithGlow
              className="licensing-compliance__image"
              src="/images/sections/world-map.webp"
              alt={licensingCompliance.imageAlt}
              sizes="(max-width: 980px) 100vw, 34vw"
            />

            <div className="licensing-compliance__copy">
              <h2
                className="licensing-panel__title licensing-panel__title--left"
                id="licensing-compliance-title"
              >
                {licensingCompliance.title}
              </h2>
              {licensingCompliance.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}

              <ul className="licensing-grid licensing-grid--four">
                {licensingCompliance.items.map((item) => (
                  <li key={item.id}>
                    <LineIcon name={complianceIcons[item.id]} size={34} />
                    <h3>
                      {item.titleLines.map((line) => (
                        <span key={line}>{line}</span>
                      ))}
                    </h3>
                    <p>{item.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </MotionReveal>
        </section>

        <section
          className="licensing-white container-wide"
          aria-labelledby="licensing-white-title"
        >
          <MotionReveal className="licensing-panel licensing-white__panel">
            <div className="licensing-white__copy">
              <p className="eyebrow">{licensingWhiteLabel.eyebrow}</p>
              <h2 id="licensing-white-title">
                {licensingWhiteLabel.titleLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h2>
              <p className="licensing-white__lead">
                {licensingWhiteLabel.description}
              </p>
              <ul className="licensing-checks">
                {licensingWhiteLabel.points.map((point) => (
                  <li key={point}>
                    <LineIcon name="check" size={18} />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <aside className="licensing-white__note">
                <LineIcon name="users" size={32} />
                <p>{licensingWhiteLabel.note}</p>
              </aside>
            </div>

            {/* The board mocks this up with invented totals. The platform is
                pre-launch and holds none, so the preview shows the panels a
                licensee's dashboard would carry and leaves them empty. */}
            <figure className="licensing-preview">
              <figcaption className="licensing-preview__label">
                {licensingWhiteLabel.preview.label}
              </figcaption>
              <div className="licensing-preview__window">
                <p className="licensing-preview__brand">
                  <LineIcon name="diamond" size={16} />
                  <span>{licensingWhiteLabel.preview.brand}</span>
                </p>
                <div className="licensing-preview__body">
                  <ul className="licensing-preview__nav">
                    {licensingWhiteLabel.preview.nav.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <div className="licensing-preview__main">
                    <ul className="licensing-preview__panels">
                      {licensingWhiteLabel.preview.panels.map((panel) => (
                        <li key={panel}>
                          <span>{panel}</span>
                          <span
                            className="licensing-preview__blank"
                            aria-hidden="true"
                          />
                        </li>
                      ))}
                    </ul>
                    <ul className="licensing-preview__charts">
                      {licensingWhiteLabel.preview.charts.map((chart) => (
                        <li key={chart}>
                          <span>{chart}</span>
                          <span
                            className="licensing-preview__plot"
                            aria-hidden="true"
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <p className="licensing-preview__footnote">
                {licensingWhiteLabel.preview.footnote}
              </p>
            </figure>
          </MotionReveal>
        </section>

        <section
          className="licensing-future container-wide"
          aria-labelledby="licensing-future-title"
        >
          <MotionReveal>
            <SectionHeading
              title={licensingFuture.title}
              id="licensing-future-title"
            />
          </MotionReveal>

          <MotionReveal className="licensing-future__row" delay={80}>
            <ul className="licensing-grid">
              {licensingFuture.items.map((item) => (
                <li key={item.id}>
                  <LineIcon name={futureIcons[item.id]} size={36} />
                  <h3>
                    {item.titleLines.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </h3>
                  <p>{item.description}</p>
                </li>
              ))}
            </ul>

            <aside
              className="licensing-cta"
              aria-labelledby="licensing-cta-title"
            >
              <h2 id="licensing-cta-title">
                {licensingCta.titleLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h2>
              <p>{licensingCta.description}</p>
              <Link className="button button--gold" href="/early-participation">
                {licensingCta.buttonLabel}
              </Link>
              <p className="licensing-cta__or">
                {licensingCta.alternativeLabel}
              </p>
              <Link className="button button--outline" href="/contact">
                {licensingCta.secondaryLabel}
              </Link>
              <p className="licensing-cta__email">
                <a href={`mailto:${licensingCta.email}`}>
                  {licensingCta.email}
                </a>
              </p>
            </aside>
          </MotionReveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
