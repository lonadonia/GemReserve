import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { LineIcon, type IconName } from "@/components/icons/LineIcon";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ImageWithGlow } from "@/components/ui/ImageWithGlow";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  guarantee,
  orderStages,
  orderStatusTitle,
  portalAssurances,
  portalCta,
  portalFeatures,
  portalFeaturesTitle,
  portalHelp,
  portalHero,
  portalNav,
  portalNavActiveId,
  portalProcess,
  portalProcessTitle,
  portalTokens,
  previewNote,
  tokenActionLabel,
  tokenTableColumns,
  tokenTableTitle,
  trustItems,
  trustStripTitle,
} from "@/content/portal";

export const metadata: Metadata = {
  title: "Redemption Portal",
  description: portalHero.description,
  alternates: { canonical: "/redemption-portal" },
  openGraph: {
    title: "Redemption Portal | GemReserve.io",
    description: portalHero.description,
    url: "/redemption-portal",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const breadcrumbItems = [
  { label: portalHero.breadcrumb[0], href: "/" },
  { label: portalHero.breadcrumb[1], href: "/technology" },
  { label: portalHero.breadcrumb[2] },
] as const;

const assuranceIcons: Record<string, IconName> = {
  backed: "shield-check",
  transparent: "diamond",
  delivery: "globe",
  control: "lock",
};

const stepIcons: Record<string, IconName> = {
  login: "users",
  select: "diamond",
  eligibility: "check",
  request: "contract",
  verification: "shield-check",
  shipping: "box",
  receive: "hand-gem",
};

const featureIcons: Record<string, IconName> = {
  eligibility: "shield-check",
  "on-chain": "cubes",
  documentation: "contract",
  tracking: "search",
  communication: "lock",
};

const navIcons: Record<string, IconName> = {
  dashboard: "chart",
  tokens: "diamond",
  redeem: "refresh",
  orders: "contract",
  shipments: "box",
  documents: "certificate",
  settings: "cubes",
  support: "phone",
};

const trustIcons: Record<string, IconName> = {
  backed: "shield-check",
  verified: "eye",
  vaults: "vault",
  delivery: "globe",
  transparency: "contract",
};

export default function RedemptionPortalPage() {
  return (
    <div className="portal-page">
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section
          className="hero portal-hero"
          aria-labelledby="portal-hero-title"
        >
          <div className="hero__media" aria-hidden="true">
            <span className="hero__scrim portal-hero__scrim" />
          </div>

          <div className="hero__inner portal-hero__inner container-wide">
            <MotionReveal className="hero__copy">
              <Breadcrumbs items={breadcrumbItems} />
              <h1
                className="hero__title portal-hero__title"
                id="portal-hero-title"
              >
                <span>{portalHero.titleLines[0]}</span>
                <span className="hero__title-accent">
                  {portalHero.titleLines[1]}
                </span>
              </h1>
              <p className="portal-hero__tagline">{portalHero.tagline}</p>
              <p className="hero__description">{portalHero.description}</p>
            </MotionReveal>

            {/* The board draws the portal on a laptop screen. It is drawn here as
                real markup rather than a picture of an interface, so it reads at
                any width and on a screen reader — but nothing in it is wired,
                and it says so. */}
            <MotionReveal className="portal-preview" delay={120}>
              <div
                className="portal-window"
                role="img"
                aria-label="A preview of the Redemption Portal dashboard showing three redeemable tokens and an order timeline"
              >
                <div className="portal-window__bar">
                  {/* The mark is drawn flat here rather than through <Logo/>, which
                      is a link home — a link inside a static preview would be a
                      second route to the same page and a focus stop that leads
                      somewhere the reader did not ask to go. */}
                  <Image
                    className="portal-window__mark"
                    src="/brand/gemreserve-horizontal-1200.webp"
                    alt=""
                    width={2078}
                    height={599}
                    sizes="150px"
                  />
                  <span>Redemption Portal</span>
                  <em>{previewNote}</em>
                </div>

                <div className="portal-window__body" aria-hidden="true">
                  <nav className="portal-rail">
                    <ul>
                      {portalNav.map((item) => (
                        <li
                          key={item.id}
                          className={
                            item.id === portalNavActiveId
                              ? "portal-rail__item--active"
                              : undefined
                          }
                        >
                          <LineIcon name={navIcons[item.id]} size={15} />
                          {item.label}
                        </li>
                      ))}
                    </ul>
                  </nav>

                  <div className="portal-panel">
                    <h2>{tokenTableTitle}</h2>

                    <div className="portal-table" role="table">
                      <div className="portal-table__head" role="row">
                        {tokenTableColumns.map((column) => (
                          <span key={column} role="columnheader">
                            {column}
                          </span>
                        ))}
                      </div>
                      {portalTokens.map((token) => (
                        <div
                          className="portal-table__row"
                          key={token.id}
                          role="row"
                        >
                          <span className="portal-table__asset" role="cell">
                            <Image
                              src={token.imageSrc}
                              alt=""
                              width={80}
                              height={80}
                              sizes="34px"
                            />
                            <span>
                              <strong>{token.assetId}</strong>
                              <em>{token.name}</em>
                            </span>
                          </span>
                          <span role="cell" data-label={tokenTableColumns[1]}>
                            {token.cut}
                            <em>{token.treatment}</em>
                          </span>
                          <span role="cell" data-label={tokenTableColumns[2]}>
                            {token.weight}
                          </span>
                          <span role="cell" data-label={tokenTableColumns[3]}>
                            {token.origin}
                          </span>
                          <span role="cell" data-label={tokenTableColumns[4]}>
                            <b className="portal-pill">{token.eligibility}</b>
                          </span>
                          <span role="cell" className="portal-table__action">
                            <b>{tokenActionLabel}</b>
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="portal-help">
                      <span>
                        <strong>{portalHelp.title}</strong>
                        {portalHelp.description}
                      </span>
                      <b>
                        <LineIcon name="phone" size={15} />
                        {portalHelp.actionLabel}
                      </b>
                    </div>
                  </div>

                  <div className="portal-status">
                    <h2>{orderStatusTitle}</h2>
                    <ol>
                      {orderStages.map((stage) => (
                        <li key={stage.id}>
                          <LineIcon name="check" size={13} />
                          <span>
                            <strong>{stage.label}</strong>
                            <em>{stage.timestamp}</em>
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </MotionReveal>
          </div>
        </section>

        <section
          className="portal-assurances container-wide"
          aria-label="What the portal guarantees"
        >
          <MotionReveal>
            <ul className="trust-pillars portal-assurances__grid">
              {portalAssurances.map((item) => (
                <li key={item.id}>
                  <LineIcon name={assuranceIcons[item.id]} size={34} />
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="portal-process container-wide"
          aria-labelledby="portal-process-title"
        >
          <MotionReveal>
            <SectionHeading
              title={portalProcessTitle}
              id="portal-process-title"
            />
          </MotionReveal>

          <MotionReveal className="portal-process__panel" delay={80}>
            <ol className="portal-steps">
              {portalProcess.map((step) => (
                <li key={step.id}>
                  <span className="portal-steps__number" aria-hidden="true">
                    {step.step}
                  </span>
                  <LineIcon name={stepIcons[step.id]} size={34} />
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
          </MotionReveal>
        </section>

        <section
          className="portal-features container-wide"
          aria-labelledby="portal-features-title"
        >
          <MotionReveal className="portal-features__card">
            <h2 className="portal-features__title" id="portal-features-title">
              {portalFeaturesTitle}
            </h2>
            <ul>
              {portalFeatures.map((feature) => (
                <li key={feature.id}>
                  <LineIcon name={featureIcons[feature.id]} size={26} />
                  <div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="portal-trust container-wide"
          aria-labelledby="portal-trust-title"
        >
          <MotionReveal>
            <SectionHeading title={trustStripTitle} id="portal-trust-title" />
          </MotionReveal>
          <MotionReveal delay={80}>
            <ul className="trust-pillars portal-trust__grid">
              {trustItems.map((item) => (
                <li key={item.id}>
                  <LineIcon name={trustIcons[item.id]} size={34} />
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="portal-guarantee container-wide"
          aria-labelledby="portal-guarantee-title"
        >
          <MotionReveal className="portal-guarantee__panel">
            <div className="portal-guarantee__copy">
              <h2 id="portal-guarantee-title">{guarantee.title}</h2>
              <p>{guarantee.description}</p>
            </div>

            <div className="portal-guarantee__checks">
              <LineIcon name="shield-check" size={40} />
              <ul>
                {guarantee.checks.map((check) => (
                  <li key={check}>
                    <LineIcon name="check" size={15} />
                    {check}
                  </li>
                ))}
              </ul>
              <p>{guarantee.footnote}</p>
            </div>

            <ImageWithGlow
              className="portal-guarantee__image"
              src={guarantee.imageSrc}
              alt={guarantee.imageAlt}
              sizes="(max-width: 980px) 90vw, 26vw"
            />
          </MotionReveal>
        </section>

        <section
          className="trust-cta portal-cta container-wide"
          aria-labelledby="portal-cta-title"
        >
          <MotionReveal className="trust-cta__visual">
            <ImageWithGlow
              className="trust-cta__image"
              src={portalCta.imageSrc}
              alt={portalCta.imageAlt}
              sizes="(max-width: 760px) 100vw, 28vw"
            />
          </MotionReveal>

          <MotionReveal className="trust-cta__copy" delay={70}>
            <h2 id="portal-cta-title">{portalCta.titleLines[0]}</h2>
            <p>{portalCta.description}</p>
          </MotionReveal>

          <MotionReveal className="trust-cta__action" delay={130}>
            <Link className="button button--gold" href="/#waitlist">
              {portalCta.buttonLabel}
            </Link>
            <p>{portalCta.supportingText}</p>
          </MotionReveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
