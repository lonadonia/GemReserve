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
  custodianPanel,
  custodyCta,
  custodyHero,
  custodySteps,
  frameworkSectionTitle,
  insurancePanel,
  networkPanel,
  proofPanel,
  securityPanel,
} from "@/content/custody";

export const metadata: Metadata = {
  title: "Custody & Vault Structure",
  description: custodyHero.description,
  alternates: { canonical: "/custody-vault-structure" },
  openGraph: {
    title: "Custody & Vault Structure | GemReserve.io",
    description: custodyHero.description,
    url: "/custody-vault-structure",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const breadcrumbItems = [
  { label: custodyHero.breadcrumb[0], href: "/" },
  { label: custodyHero.breadcrumb[1], href: "/technology" },
  { label: custodyHero.breadcrumb[2] },
] as const;

const heroCardIcons: Record<string, IconName> = {
  vaults: "vault",
  insured: "shield-check",
  oversight: "eye",
  "on-chain": "cubes",
};

const stepIcons: Record<string, IconName> = {
  sourcing: "source",
  transport: "box",
  deposit: "vault",
  inventory: "clipboard-check",
  registration: "network",
  monitoring: "refresh",
};

const criterionIcons: Record<string, IconName> = {
  specialist: "diamond",
  segregated: "layers",
  audited: "clipboard-check",
  insured: "shield-check",
};

const securityIcons: Record<string, IconName> = {
  armed: "shield-check",
  biometric: "fingerprint",
  environmental: "droplet",
  surveillance: "eye",
  disaster: "alert-triangle",
  "dual-control": "users",
};

export default function CustodyVaultStructurePage() {
  return (
    <div className="custody-page">
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section
          className="hero custody-hero"
          aria-labelledby="custody-hero-title"
        >
          <div className="hero__media" aria-hidden="true">
            <ResponsiveHeroImage
              desktopBase="/images/heroes/custody-hero"
              mobileBase="/images/heroes/custody-hero-mobile"
            />
            <span className="hero__scrim custody-hero__scrim" />
          </div>

          <div className="hero__inner custody-hero__inner container-wide">
            <MotionReveal className="hero__copy">
              <Breadcrumbs items={breadcrumbItems} />
              <h1 className="hero__title" id="custody-hero-title">
                <span>{custodyHero.titleLines[0]}</span>
                <span className="hero__title-accent">
                  {custodyHero.titleLines[1]}
                </span>
              </h1>
              <p className="custody-hero__tagline">
                {custodyHero.taglineLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>
              <p className="hero__description">{custodyHero.description}</p>
            </MotionReveal>

            <MotionReveal className="custody-hero__cards" delay={120}>
              <ul aria-label="Custody at a glance">
                {custodyHero.cards.map((card) => (
                  <li key={card.id}>
                    <LineIcon name={heroCardIcons[card.id]} size={26} />
                    <div>
                      <h2>{card.title}</h2>
                      <p>{card.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </MotionReveal>
          </div>
        </section>

        <section
          className="custody-framework container-wide"
          aria-labelledby="custody-framework-title"
        >
          <MotionReveal>
            <SectionHeading
              title={frameworkSectionTitle}
              id="custody-framework-title"
            />
          </MotionReveal>
          <MotionReveal delay={80}>
            <ol className="custody-steps">
              {custodySteps.map((step) => (
                <li key={step.id}>
                  <p className="custody-step__number" aria-hidden="true">
                    {step.step}
                  </p>
                  <LineIcon name={stepIcons[step.id]} size={34} />
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
          </MotionReveal>
        </section>

        <section
          className="custody-detail container-wide"
          aria-labelledby="custody-criteria-title"
        >
          <MotionReveal className="custody-card">
            <h2 className="custody-card__title" id="custody-criteria-title">
              {custodianPanel.title}
            </h2>
            <p className="custody-card__intro">{custodianPanel.intro}</p>
            <ul className="custody-criteria">
              {custodianPanel.criteria.map((criterion) => (
                <li key={criterion.id}>
                  <LineIcon name={criterionIcons[criterion.id]} size={26} />
                  <div>
                    <h3>{criterion.title}</h3>
                    <p>{criterion.description}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="custody-card__note" role="note">
              <LineIcon name="alert-triangle" size={22} />
              <span>{custodianPanel.disclosure}</span>
            </p>
          </MotionReveal>

          <MotionReveal className="custody-card" delay={80}>
            <h2 className="custody-card__title">{networkPanel.title}</h2>
            <p className="custody-card__intro">{networkPanel.intro}</p>
            <div className="custody-network">
              <div className="custody-network__copy">
                <div className="custody-network__block">
                  <h3>{networkPanel.registered.label}</h3>
                  <address>
                    {networkPanel.registered.lines.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </address>
                  <p className="custody-network__code">
                    {networkPanel.registered.note}
                  </p>
                </div>
                <div className="custody-network__block">
                  <h3>{networkPanel.planned.label}</h3>
                  <p>{networkPanel.planned.description}</p>
                </div>
              </div>
              <ImageWithGlow
                className="custody-network__map"
                src="/images/sections/network-map.webp"
                alt={networkPanel.imageAlt}
                sizes="(max-width: 980px) 100vw, 34vw"
              />
            </div>
          </MotionReveal>

          <MotionReveal className="custody-card" delay={160}>
            <h2 className="custody-card__title">{securityPanel.title}</h2>
            <ul className="custody-security">
              {securityPanel.features.map((feature) => (
                <li key={feature.id}>
                  <LineIcon name={securityIcons[feature.id]} size={26} />
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
          className="custody-assurance container-wide"
          aria-labelledby="custody-insurance-title"
        >
          <MotionReveal className="custody-card custody-card--insurance">
            <h2 className="custody-card__title" id="custody-insurance-title">
              {insurancePanel.title}
            </h2>
            <p className="custody-card__intro">{insurancePanel.intro}</p>
            <ul className="custody-perils">
              {insurancePanel.perils.map((peril) => (
                <li key={peril}>
                  <LineIcon name="check" size={18} />
                  {peril}
                </li>
              ))}
            </ul>
            <p className="custody-card__note" role="note">
              <LineIcon name="alert-triangle" size={22} />
              <span>{insurancePanel.note}</span>
            </p>
          </MotionReveal>

          <MotionReveal className="custody-card custody-card--proof" delay={90}>
            <h2 className="custody-card__title">{proofPanel.title}</h2>
            <div className="custody-proof">
              <ImageWithGlow
                className="custody-proof__image"
                src="/images/sections/custody-record.webp"
                alt={proofPanel.imageAlt}
                sizes="(max-width: 980px) 100vw, 22vw"
              />
              <div>
                <ul className="custody-proof__checks">
                  {proofPanel.checks.map((check) => (
                    <li key={check.id}>
                      <LineIcon name="check" size={18} />
                      {check.label}
                    </li>
                  ))}
                </ul>
                <Link
                  className="button button--outline button--small"
                  href={proofPanel.link.href}
                >
                  {proofPanel.link.label}
                </Link>
              </div>
            </div>
          </MotionReveal>
        </section>

        <section
          className="trust-cta custody-cta container-wide"
          aria-labelledby="custody-cta-title"
        >
          <MotionReveal className="trust-cta__visual">
            <ImageWithGlow
              className="trust-cta__image"
              src="/images/sections/gem-cluster.webp"
              alt={custodyCta.imageAlt}
              sizes="(max-width: 980px) 100vw, 30vw"
            />
          </MotionReveal>

          <MotionReveal className="trust-cta__copy" delay={70}>
            <h2 id="custody-cta-title">
              <span>{custodyCta.titleLines[0]}</span>
              <span className="custody-cta__accent">
                {custodyCta.titleLines[1]}
              </span>
            </h2>
            <p>{custodyCta.description}</p>
          </MotionReveal>

          <MotionReveal className="trust-cta__action" delay={130}>
            <Link className="button button--gold" href="/#waitlist">
              {custodyCta.buttonLabel}
            </Link>
            <p>{custodyCta.supportingText}</p>
          </MotionReveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
