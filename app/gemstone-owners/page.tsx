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
  ownersBenefits,
  ownersCallout,
  ownersClose,
  ownersGroups,
  ownersHero,
  ownersMarks,
  ownersPlatform,
  ownersProcessTitle,
  ownersServeTitle,
  ownersSteps,
} from "@/content/gemstone-owners";

export const metadata: Metadata = {
  title: "Gemstone Owners and Originators",
  description: ownersHero.description,
  alternates: { canonical: "/gemstone-owners" },
  openGraph: {
    title: "Gemstone Owners and Originators | GemReserve.io",
    description: ownersHero.description,
    url: "/gemstone-owners",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const breadcrumbItems = [
  { label: ownersHero.breadcrumb[0], href: "/" },
  { label: ownersHero.breadcrumb[1] },
] as const;

const markIcons: Record<string, IconName> = {
  "maximize-value": "diamond",
  "global-reach": "globe",
  "liquidity-solutions": "chart",
  "secure-compliant": "shield-check",
};

const groupIcons: Record<string, IconName> = {
  miners: "mountain",
  cutters: "diamond",
  dealers: "box",
  collections: "vault",
  originators: "handshake",
};

const benefitIcons: Record<string, IconName> = {
  valuation: "search",
  fractional: "users",
  liquidity: "chart",
  provenance: "shield-check",
  exposure: "globe",
};

const stepIcons: Record<string, IconName> = {
  submit: "search",
  evaluate: "clipboard-check",
  custody: "shield-check",
  tokenize: "cubes",
  market: "globe",
};

const closeIcons: Record<string, IconName> = {
  support: "phone",
  account: "user",
  network: "globe",
  platform: "shield-check",
};

export default function GemstoneOwnersPage() {
  return (
    <div className="audience-page audience-page--owners">
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section
          className="hero audience-hero"
          aria-labelledby="owners-hero-title"
        >
          <div className="hero__media" aria-hidden="true">
            <ResponsiveHeroImage
              desktopBase={ownersHero.heroBase}
              mobileBase={`${ownersHero.heroBase}-mobile`}
            />
            <span className="hero__scrim audience-hero__scrim" />
          </div>

          <div className="hero__inner container-wide">
            <MotionReveal className="hero__copy">
              <Breadcrumbs items={breadcrumbItems} />
              <h1 className="hero__title" id="owners-hero-title">
                <span>{ownersHero.titleLines[0]}</span>
                <span className="hero__title-accent">
                  {ownersHero.titleLines[1]}
                </span>
              </h1>
              <p className="audience-hero__tagline">{ownersHero.tagline}</p>
              <p className="hero__description">{ownersHero.description}</p>
            </MotionReveal>
          </div>
        </section>

        {/* The owners board runs its marks and its trust callout as one band,
            marks on the left and the callout beside them. */}
        <section
          className="audience-marks container-wide"
          aria-label="What tokenizing your gemstones provides"
        >
          <MotionReveal>
            <ul className="trust-pillars audience-marks__row audience-marks__row--four">
              {ownersMarks.map((mark) => (
                <li key={mark.id}>
                  <LineIcon name={markIcons[mark.id]} size={36} />
                  <h2>{mark.title}</h2>
                  <p>{mark.description}</p>
                </li>
              ))}
            </ul>
          </MotionReveal>

          <MotionReveal className="audience-callout" delay={80}>
            <aside aria-labelledby="owners-callout-title">
              <h2 id="owners-callout-title">{ownersCallout.title}</h2>
              <p>{ownersCallout.description}</p>
            </aside>
          </MotionReveal>
        </section>

        <section
          className="audience-serve container-wide"
          aria-labelledby="owners-serve-title"
        >
          <MotionReveal className="audience-serve__panel">
            <SectionHeading
              title={ownersServeTitle}
              id="owners-serve-title"
              align="left"
            />
            <ul className="audience-groups">
              {ownersGroups.map((group) => (
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
          className="audience-platform container-wide"
          aria-labelledby="owners-platform-title"
        >
          <MotionReveal className="audience-platform__copy">
            <h2 className="audience-platform__title" id="owners-platform-title">
              {ownersPlatform.title}
            </h2>
            <p className="audience-platform__subtitle">
              {ownersPlatform.subtitle}
            </p>
            <p className="audience-platform__lead">
              {ownersPlatform.description}
            </p>
            <ul className="audience-checks">
              {ownersPlatform.points.map((point) => (
                <li key={point}>
                  <LineIcon name="check" size={18} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </MotionReveal>

          <MotionReveal className="audience-platform__aside" delay={80}>
            <ImageWithGlow
              className="audience-platform__image"
              src={ownersPlatform.imageSrc}
              alt={ownersPlatform.imageAlt}
              sizes="(max-width: 980px) 100vw, 46vw"
            />
            <aside
              className="audience-benefits"
              aria-labelledby="owners-benefits-title"
            >
              <h2 id="owners-benefits-title">{ownersBenefits.title}</h2>
              <ul>
                {ownersBenefits.items.map((item) => (
                  <li key={item.id}>
                    <LineIcon name={benefitIcons[item.id]} size={24} />
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </MotionReveal>
        </section>

        <section
          className="audience-process container-wide"
          aria-labelledby="owners-process-title"
        >
          <MotionReveal>
            <SectionHeading
              title={ownersProcessTitle}
              id="owners-process-title"
            />
          </MotionReveal>
          <MotionReveal delay={80}>
            <ol className="audience-steps audience-steps--five">
              {ownersSteps.map((step) => (
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
          className="audience-close container-wide"
          aria-labelledby="owners-close-title"
        >
          <MotionReveal className="audience-close__panel">
            <ImageWithGlow
              className="audience-close__image"
              src={ownersClose.imageSrc}
              alt={ownersClose.imageAlt}
              sizes="(max-width: 980px) 100vw, 22vw"
            />

            <div className="audience-close__copy">
              <h2 id="owners-close-title">{ownersClose.title}</h2>
              <p className="audience-close__subtitle">{ownersClose.subtitle}</p>
              {ownersClose.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
              <ul className="audience-close__marks">
                {ownersClose.marks.map((mark) => (
                  <li key={mark.id}>
                    <LineIcon name={closeIcons[mark.id]} size={28} />
                    <span>{mark.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <aside
              className="audience-close__cta"
              aria-labelledby="owners-cta-title"
            >
              <h3 id="owners-cta-title">{ownersClose.cta.title}</h3>
              <p>{ownersClose.cta.description}</p>
              <Link className="button button--gold" href="/early-participation">
                {ownersClose.cta.buttonLabel}
              </Link>
              <p className="audience-close__note">
                {ownersClose.cta.supportingText}
              </p>
            </aside>
          </MotionReveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
