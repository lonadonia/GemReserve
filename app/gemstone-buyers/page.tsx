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
  buyersAdvantage,
  buyersCallout,
  buyersClose,
  buyersGroups,
  buyersHero,
  buyersMarks,
  buyersPassport,
  buyersProcessTitle,
  buyersServeTitle,
  buyersSteps,
  buyersWhy,
} from "@/content/gemstone-buyers";

export const metadata: Metadata = {
  title: "Gemstone Buyers and Collectors",
  description: buyersHero.description,
  alternates: { canonical: "/gemstone-buyers" },
  openGraph: {
    title: "Gemstone Buyers and Collectors | GemReserve.io",
    description: buyersHero.description,
    url: "/gemstone-buyers",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const breadcrumbItems = [
  { label: buyersHero.breadcrumb[0], href: "/" },
  { label: buyersHero.breadcrumb[1] },
] as const;

const markIcons: Record<string, IconName> = {
  "authentic-verified": "diamond",
  "secure-ownership": "shield-check",
  "global-access": "globe",
  "liquid-flexible": "token",
  "long-term-value": "coins",
};

const advantageIcons: Record<string, IconName> = {
  "expert-curation": "search",
  "digital-passport": "passport",
  "market-data": "chart",
  private: "lock",
  support: "phone",
};

const stepIcons: Record<string, IconName> = {
  explore: "search",
  select: "box",
  verify: "file-check",
  purchase: "wallet",
  custody: "shield-check",
  own: "diamond",
};

const groupIcons: Record<string, IconName> = {
  investors: "chart",
  collectors: "diamond",
  jewelers: "hand-gem",
  traders: "exchange",
  "gift-buyers": "box",
};

const closeIcons: Record<string, IconName> = {
  "early-access": "lock-clock",
  "member-benefits": "user-check",
  "exclusive-gems": "diamond",
  "market-insights": "chart",
};

export default function GemstoneBuyersPage() {
  return (
    <div className="audience-page audience-page--buyers">
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section
          className="hero audience-hero"
          aria-labelledby="buyers-hero-title"
        >
          <div className="hero__media" aria-hidden="true">
            <ResponsiveHeroImage
              desktopBase={buyersHero.heroBase}
              mobileBase={`${buyersHero.heroBase}-mobile`}
            />
            <span className="hero__scrim audience-hero__scrim" />
          </div>

          <div className="hero__inner container-wide">
            <MotionReveal className="hero__copy">
              <Breadcrumbs items={breadcrumbItems} />
              <h1 className="hero__title" id="buyers-hero-title">
                <span>{buyersHero.titleLines[0]}</span>
                <span className="hero__title-accent">
                  {buyersHero.titleLines[1]}
                </span>
              </h1>
              <p className="audience-hero__tagline">{buyersHero.tagline}</p>
              <p className="hero__description">{buyersHero.description}</p>

              {/* The buyers board opens on the trust callout rather than
                  closing on it, so it stays inside the hero copy here. */}
              <aside
                className="audience-hero__callout"
                aria-labelledby="buyers-callout-title"
              >
                <h2 id="buyers-callout-title">{buyersCallout.title}</h2>
                <p>{buyersCallout.description}</p>
              </aside>
            </MotionReveal>
          </div>
        </section>

        <section
          className="audience-marks container-wide audience-marks--full"
          aria-label="What buyers and collectors receive"
        >
          <MotionReveal>
            <ul className="trust-pillars audience-marks__row">
              {buyersMarks.map((mark) => (
                <li key={mark.id}>
                  <LineIcon name={markIcons[mark.id]} size={36} />
                  <h2>{mark.title}</h2>
                  <p>{mark.description}</p>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        {/* Three columns as the board sets them: reasons, the passport record,
            and the advantage list. */}
        <section
          className="audience-why container-wide"
          aria-labelledby="buyers-why-title"
        >
          <MotionReveal className="audience-card">
            <h2 className="audience-card__title" id="buyers-why-title">
              {buyersWhy.title}
            </h2>
            <ul className="audience-points">
              {buyersWhy.points.map((point) => (
                <li key={point.id}>
                  <LineIcon name="check" size={18} />
                  <div>
                    <h3>{point.title}</h3>
                    <p>{point.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </MotionReveal>

          <MotionReveal className="audience-passport" delay={80}>
            <figure>
              <figcaption className="audience-passport__label">
                {buyersPassport.label}
              </figcaption>
              <div className="audience-passport__card">
                <p className="audience-passport__brand">
                  <LineIcon name="diamond" size={18} />
                  <span>{buyersPassport.brand}</span>
                </p>
                <p className="audience-passport__heading">
                  {buyersPassport.heading}
                </p>
                <p className="audience-passport__name">{buyersPassport.name}</p>
                <ImageWithGlow
                  className="audience-passport__image"
                  src="/images/gems/blue-sapphire.webp"
                  alt={buyersPassport.imageAlt}
                  sizes="(max-width: 980px) 40vw, 14vw"
                />
                <dl>
                  {buyersPassport.fields.map((field) => (
                    <div key={field.id}>
                      <dt>{field.label}</dt>
                      <dd>{field.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="audience-passport__footnote">
                  <span>{buyersPassport.footnote}</span>
                  <span className="audience-passport__verified">
                    <LineIcon name="check" size={14} />
                    {buyersPassport.verified}
                  </span>
                </p>
                <p className="audience-passport__action" aria-hidden="true">
                  {buyersPassport.action}
                </p>
              </div>
            </figure>
          </MotionReveal>

          <MotionReveal className="audience-card" delay={140}>
            <h2 className="audience-card__title" id="buyers-advantage-title">
              {buyersAdvantage.title}
            </h2>
            <ul
              className="audience-points audience-points--icons"
              aria-labelledby="buyers-advantage-title"
            >
              {buyersAdvantage.points.map((point) => (
                <li key={point.id}>
                  <LineIcon name={advantageIcons[point.id]} size={28} />
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
          className="audience-process container-wide"
          aria-labelledby="buyers-process-title"
        >
          <MotionReveal>
            <SectionHeading
              title={buyersProcessTitle}
              id="buyers-process-title"
            />
          </MotionReveal>
          <MotionReveal delay={80}>
            <ol className="audience-steps">
              {buyersSteps.map((step) => (
                <li key={step.id}>
                  <span className="audience-steps__mark" aria-hidden="true">
                    <LineIcon name={stepIcons[step.id]} size={32} />
                  </span>
                  <span className="audience-steps__number" aria-hidden="true">
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
          className="audience-serve container-wide"
          aria-labelledby="buyers-serve-title"
        >
          <MotionReveal>
            <SectionHeading title={buyersServeTitle} id="buyers-serve-title" />
          </MotionReveal>
          <MotionReveal delay={80}>
            <ul className="audience-groups audience-groups--boxed">
              {buyersGroups.map((group) => (
                <li key={group.id}>
                  <LineIcon name={groupIcons[group.id]} size={42} />
                  <h3>{group.title}</h3>
                  <p>{group.description}</p>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="audience-close container-wide"
          aria-labelledby="buyers-close-title"
        >
          <MotionReveal className="audience-close__panel">
            <ImageWithGlow
              className="audience-close__image"
              src={buyersClose.imageSrc}
              alt={buyersClose.imageAlt}
              sizes="(max-width: 980px) 100vw, 22vw"
            />

            <div className="audience-close__copy">
              <h2 id="buyers-close-title">
                {buyersClose.titleLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h2>
              <p>{buyersClose.description}</p>
              <ul className="audience-close__marks">
                {buyersClose.marks.map((mark) => (
                  <li key={mark.id}>
                    <LineIcon name={closeIcons[mark.id]} size={28} />
                    <span>{mark.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <aside
              className="audience-close__cta"
              aria-labelledby="buyers-cta-title"
            >
              <h3 id="buyers-cta-title">{buyersClose.cta.title}</h3>
              <p>{buyersClose.cta.description}</p>
              <Link className="button button--gold" href="/early-participation">
                {buyersClose.cta.buttonLabel}
              </Link>
              <p className="audience-close__note">
                {buyersClose.cta.supportingText}
              </p>
            </aside>
          </MotionReveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
