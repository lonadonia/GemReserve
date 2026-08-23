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
import { SectionPlate } from "@/components/ui/SectionPlate";
import {
  feeTableColumns,
  feeTableFootnote,
  feeTableRows,
  feeTableTitle,
  logisticsItems,
  logisticsTitle,
  onChainStages,
  onChainTransparencyIntro,
  onChainTransparencyTitle,
  readyToRedeem,
  redemptionCta,
  redemptionGuarantee,
  redemptionGuaranteeTitle,
  redemptionHero,
  redemptionProcess,
  redemptionProcessFootnote,
  redemptionProcessTitle,
  redemptionReceiveImageAlt,
  redemptionReceiveItems,
  redemptionReceiveTitle,
  redemptionRequirements,
  redemptionRequirementsTitle,
} from "@/content/redemption";

export const metadata: Metadata = {
  title: "Physical Redemption",
  description: redemptionHero.description,
  alternates: { canonical: "/physical-redemption" },
  openGraph: {
    title: "Physical Redemption | GemReserve.io",
    description: redemptionHero.description,
    url: "/physical-redemption",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const breadcrumbItems = [
  { label: redemptionHero.breadcrumb[0], href: "/" },
  { label: redemptionHero.breadcrumb[1], href: "/technology" },
  { label: redemptionHero.breadcrumb[2] },
] as const;

const calloutIcons: Record<string, IconName> = {
  "your-choice": "diamond",
  backed: "shield-check",
  delivery: "globe",
  transparency: "search",
};

// Each step carries a cut-out plate rather than a line icon, the same way the
// KYC and enterprise process rows do. The plate names describe the object; the
// step ids describe the stage, so the two are mapped rather than concatenated.
const stepPlates: Record<string, { name: string; alt: string }> = {
  request: { name: "red-request", alt: "An open gold laptop" },
  eligibility: {
    name: "red-eligibility",
    alt: "A gold clipboard holding a ticked checklist",
  },
  lock: { name: "red-lock", alt: "A gold wallet under a closed padlock" },
  allocation: {
    name: "red-allocate",
    alt: "A gold vault drawer open on a single gemstone",
  },
  quality: {
    name: "red-quality",
    alt: "A gold jeweller's loupe beside a faceted gemstone",
  },
  packaging: {
    name: "red-package",
    alt: "A ribboned gold box open on a gemstone",
  },
  delivery: { name: "red-ship", alt: "A gold delivery van" },
};

const guaranteeIcons: Record<string, IconName> = {
  "legal-right": "contract",
  "backed-reserves": "vault",
  "no-hidden-fees": "certificate",
  documentation: "passport",
};

const requirementIcons: Record<string, IconName> = {
  kyc: "users",
  minimums: "box",
  fee: "token",
  address: "globe",
  compliance: "check",
};

const logisticsIcons: Record<string, IconName> = {
  discreet: "box",
  insured: "shield-check",
  couriers: "trade",
  signature: "contract",
  global: "globe",
};

const stageIcons: Record<string, IconName> = {
  locked: "lock",
  executed: "shield-check",
  shipped: "box",
  completed: "check",
};

export default function PhysicalRedemptionPage() {
  return (
    <div className="redemption-page">
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section
          className="hero redemption-hero"
          aria-labelledby="redemption-hero-title"
        >
          <div className="hero__media" aria-hidden="true">
            <ResponsiveHeroImage
              desktopBase="/images/heroes/redemption-hero"
              mobileBase="/images/heroes/redemption-hero-mobile"
            />
            <span className="hero__scrim redemption-hero__scrim" />
          </div>

          <div className="hero__inner redemption-hero__inner container-wide">
            <MotionReveal className="hero__copy redemption-hero__copy">
              <Breadcrumbs items={breadcrumbItems} />
              <h1 className="hero__title" id="redemption-hero-title">
                <span>{redemptionHero.titleLines[0]}</span>
                <span className="hero__title-accent">
                  {redemptionHero.titleLines[1]}
                </span>
              </h1>
              <p className="redemption-hero__tagline">
                {redemptionHero.tagline}
              </p>
              <p className="hero__description">{redemptionHero.description}</p>
            </MotionReveal>

            <MotionReveal className="redemption-hero__callout" delay={120}>
              <aside aria-label="Why redemption is real at GemReserve">
                <ul>
                  {redemptionHero.callout.map((item) => (
                    <li key={item.id}>
                      <LineIcon name={calloutIcons[item.id]} size={28} />
                      <div>
                        <h2>{item.title}</h2>
                        <p>{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </aside>
            </MotionReveal>
          </div>
        </section>

        <section
          className="redemption-process container-wide"
          aria-labelledby="redemption-process-title"
        >
          <MotionReveal>
            <SectionHeading
              title={redemptionProcessTitle}
              id="redemption-process-title"
            />
          </MotionReveal>

          <MotionReveal className="redemption-process__panel" delay={80}>
            <ol className="redemption-steps">
              {redemptionProcess.map((step) => (
                <li key={step.id}>
                  <span className="redemption-steps__number" aria-hidden="true">
                    {step.step}
                  </span>
                  <SectionPlate
                    name={stepPlates[step.id].name}
                    alt={stepPlates[step.id].alt}
                    className="redemption-steps__plate"
                    sizes="(max-width: 760px) 88px, (max-width: 1240px) 66px, 84px"
                  />
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
            <p className="redemption-process__footnote">
              <LineIcon name="lock" size={16} />
              {redemptionProcessFootnote}
            </p>
          </MotionReveal>
        </section>

        <section
          className="redemption-assurance container-wide"
          aria-label="Redemption guarantee, contents and requirements"
        >
          <MotionReveal className="redemption-card">
            <h2
              className="redemption-card__title"
              id="redemption-guarantee-title"
            >
              {redemptionGuaranteeTitle}
            </h2>
            <ul className="redemption-card__list">
              {redemptionGuarantee.map((item) => (
                <li key={item.id}>
                  <LineIcon name={guaranteeIcons[item.id]} size={26} />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </MotionReveal>

          <MotionReveal
            className="redemption-card redemption-receive"
            delay={70}
          >
            <h2 className="redemption-card__title redemption-card__title--center">
              {redemptionReceiveTitle}
            </h2>
            <Image
              className="redemption-receive__image"
              src="/images/sections/ruby-box.webp"
              alt={redemptionReceiveImageAlt}
              width={620}
              height={930}
              sizes="(max-width: 980px) 44vw, 210px"
            />
            <ul className="redemption-receive__checks">
              {redemptionReceiveItems.map((item) => (
                <li key={item}>
                  <LineIcon name="check" size={16} />
                  {item}
                </li>
              ))}
            </ul>
          </MotionReveal>

          <MotionReveal className="redemption-card" delay={140}>
            <h2 className="redemption-card__title">
              {redemptionRequirementsTitle}
            </h2>
            <ul className="redemption-card__list">
              {redemptionRequirements.map((item) => (
                <li key={item.id}>
                  <LineIcon name={requirementIcons[item.id]} size={26} />
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
          className="redemption-logistics container-wide"
          aria-labelledby="redemption-logistics-title"
        >
          <MotionReveal>
            <SectionHeading
              title={logisticsTitle}
              id="redemption-logistics-title"
            />
          </MotionReveal>
          <MotionReveal delay={80}>
            <ul className="trust-pillars redemption-logistics__grid">
              {logisticsItems.map((item) => (
                <li key={item.id}>
                  <LineIcon name={logisticsIcons[item.id]} size={36} />
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="redemption-close container-wide"
          aria-label="Redemption fees, on-chain record and next step"
        >
          <MotionReveal className="redemption-card redemption-fees">
            <h2
              className="redemption-card__title redemption-card__title--center"
              id="redemption-fees-title"
            >
              {feeTableTitle}
            </h2>
            {/* Three columns of figures cannot reflow below about 300px, so the
                table scrolls inside its own box rather than pushing the page
                sideways on a narrow phone. */}
            <div
              className="redemption-fees__scroll"
              tabIndex={0}
              role="group"
              aria-labelledby="redemption-fees-title"
            >
              <table>
                <thead>
                  <tr>
                    {feeTableColumns.map((column) => (
                      <th key={column} scope="col">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {feeTableRows.map((row) => (
                    <tr key={row.id}>
                      <th scope="row">{row.assetType}</th>
                      <td>{row.minimum}</td>
                      <td>{row.fee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="redemption-fees__footnote">*{feeTableFootnote}</p>
          </MotionReveal>

          <MotionReveal className="redemption-card redemption-chain" delay={70}>
            <h2 className="redemption-card__title redemption-card__title--center">
              {onChainTransparencyTitle}
            </h2>
            <p className="redemption-chain__intro">
              {onChainTransparencyIntro}
            </p>
            <ol className="redemption-chain__flow">
              {onChainStages.map((stage) => (
                <li key={stage.id}>
                  <LineIcon name={stageIcons[stage.id]} size={30} />
                  <span>{stage.label}</span>
                </li>
              ))}
            </ol>
          </MotionReveal>

          <MotionReveal
            className="redemption-card redemption-ready"
            delay={140}
          >
            <h2 className="redemption-card__title redemption-card__title--center">
              {readyToRedeem.title}
            </h2>
            <p>{readyToRedeem.description}</p>
            {/* The redemption portal opens with the platform, so the action is
                shown the way every other pre-launch action on the site is: as a
                label rather than a control that leads nowhere. */}
            <span className="button button--gold" aria-hidden="true">
              {readyToRedeem.actionLabel}
            </span>
            <p className="redemption-ready__support">
              {readyToRedeem.supportingText}{" "}
              <Link href="/contact">{readyToRedeem.supportLinkLabel}</Link>.
            </p>
          </MotionReveal>
        </section>

        <section
          className="trust-cta redemption-cta container-wide"
          aria-labelledby="redemption-cta-title"
        >
          <MotionReveal className="trust-cta__visual">
            <ImageWithGlow
              className="trust-cta__image"
              src="/images/sections/redemption-band.webp"
              alt={redemptionCta.imageAlt}
              sizes="(max-width: 760px) 100vw, 30vw"
            />
          </MotionReveal>

          <MotionReveal className="trust-cta__copy" delay={70}>
            <h2 id="redemption-cta-title">{redemptionCta.title}</h2>
            <p className="redemption-cta__tagline">{redemptionCta.tagline}</p>
            <p>{redemptionCta.description}</p>
          </MotionReveal>

          <MotionReveal className="trust-cta__action" delay={130}>
            <Link className="button button--outline" href="/#waitlist">
              Join the waitlist
            </Link>
            <p>Early access opens with the platform.</p>
          </MotionReveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
