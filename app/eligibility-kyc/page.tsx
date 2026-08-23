import type { Metadata } from "next";
import Link from "next/link";

import { LineIcon, type IconName } from "@/components/icons/LineIcon";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ImageWithGlow } from "@/components/ui/ImageWithGlow";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { SectionPlate } from "@/components/ui/SectionPlate";
import { ResponsiveHeroImage } from "@/components/ui/ResponsiveHeroImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  documentsIntro,
  documentsTitle,
  eligibilityGroups,
  kycCta,
  kycHero,
  kycHeroPillars,
  kycProcessIntro,
  kycProcessTitle,
  kycSteps,
  participateIntro,
  participateTitle,
  privacyFootnote,
  privacyIntro,
  privacyPoints,
  privacyTitle,
  requiredDocuments,
  restrictions,
  restrictionsFootnote,
  restrictionsIntro,
  restrictionsTitle,
} from "@/content/eligibility";

export const metadata: Metadata = {
  title: "Eligibility & KYC",
  description: kycHero.description,
  alternates: { canonical: "/eligibility-kyc" },
  openGraph: {
    title: "Eligibility & KYC | GemReserve.io",
    description: kycHero.description,
    url: "/eligibility-kyc",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const breadcrumbItems = [
  { label: kycHero.breadcrumb[0], href: "/" },
  { label: kycHero.breadcrumb[1], href: "/how-it-works" },
  { label: kycHero.breadcrumb[2] },
] as const;

const pillarIcons: Record<string, IconName> = {
  "secure-compliant": "shield-check",
  "trusted-community": "users",
  "data-protection": "lock",
  "global-access": "globe",
};

const groupIcons: Record<string, IconName> = {
  individuals: "users",
  "legal-entities": "box",
};

// Each step of the process carries a cut-out plate rather than a line icon, so
// the row reads as the four things it describes. The alt text names the object,
// because nothing else in the card does.
const stepPlates: Record<string, string> = {
  register: "A gold account card bearing a portrait silhouette",
  submit: "A gold document folder with an upload arrow above it",
  verification: "A gold magnifying glass over an identity card",
  approval: "A gold award rosette bearing a check mark",
};

const documentIcons: Record<string, IconName> = {
  identification: "passport",
  address: "box",
  funds: "chart",
  entity: "contract",
  beneficial: "users",
  additional: "search",
};

export default function EligibilityKycPage() {
  return (
    <div className="kyc-page">
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section className="hero kyc-hero" aria-labelledby="kyc-hero-title">
          <div className="hero__media" aria-hidden="true">
            <ResponsiveHeroImage
              desktopBase="/images/heroes/kyc-hero"
              mobileBase="/images/heroes/kyc-hero-mobile"
            />
            <span className="hero__scrim kyc-hero__scrim" />
          </div>

          <div className="hero__inner kyc-hero__inner container-wide">
            <MotionReveal className="hero__copy kyc-hero__copy">
              <Breadcrumbs items={breadcrumbItems} />
              <h1 className="hero__title kyc-hero__title" id="kyc-hero-title">
                <span>{kycHero.titleLead}</span>{" "}
                <span className="hero__title-accent">
                  {kycHero.titleAccent}
                </span>
              </h1>
              <p className="kyc-hero__tagline">{kycHero.tagline}</p>
              <p className="hero__description">{kycHero.description}</p>
            </MotionReveal>

            <MotionReveal
              className="hero-value-row kyc-hero__values"
              delay={150}
            >
              <ul className="trust-pillars kyc-hero__value-grid">
                {kycHeroPillars.map((pillar) => (
                  <li key={pillar.id}>
                    <LineIcon name={pillarIcons[pillar.id]} size={34} />
                    <h2>{pillar.title}</h2>
                    <p>{pillar.description}</p>
                  </li>
                ))}
              </ul>
            </MotionReveal>
          </div>
        </section>

        <section
          className="kyc-detail container-wide"
          aria-labelledby="kyc-participate-title"
        >
          <MotionReveal className="kyc-card">
            <h2 className="kyc-card__title" id="kyc-participate-title">
              {participateTitle}
            </h2>
            <p className="kyc-card__intro">{participateIntro}</p>
            <div className="kyc-groups">
              {eligibilityGroups.map((group) => (
                <div key={group.id}>
                  <h3>
                    <LineIcon name={groupIcons[group.id]} size={26} />
                    {group.title}
                  </h3>
                  <ul>
                    {group.requirements.map((requirement) => (
                      <li key={requirement}>
                        <LineIcon name="check" size={15} />
                        <span>{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </MotionReveal>

          <MotionReveal className="kyc-card" delay={70}>
            <h2 className="kyc-card__title">{kycProcessTitle}</h2>
            <p className="kyc-card__intro">{kycProcessIntro}</p>
            <ol className="kyc-steps">
              {kycSteps.map((step) => (
                <li key={step.id}>
                  <SectionPlate
                    name={`kyc-${step.id}`}
                    alt={stepPlates[step.id]}
                  />
                  <span className="kyc-steps__number" aria-hidden="true">
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
          className="kyc-documents container-wide"
          aria-labelledby="kyc-documents-title"
        >
          <MotionReveal>
            <SectionHeading title={documentsTitle} id="kyc-documents-title" />
            <p className="kyc-documents__intro">{documentsIntro}</p>
          </MotionReveal>

          <MotionReveal delay={80}>
            <ul className="kyc-documents__grid">
              {requiredDocuments.map((document) => (
                <li key={document.id}>
                  <LineIcon name={documentIcons[document.id]} size={34} />
                  <h3>
                    {document.title}
                    {document.qualifier ? (
                      <small>{document.qualifier}</small>
                    ) : null}
                  </h3>
                  <p>{document.description}</p>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="kyc-policy container-wide"
          aria-labelledby="kyc-restrictions-title"
        >
          <MotionReveal className="kyc-card kyc-card--restrict">
            <h2
              className="kyc-card__title kyc-card__title--warn"
              id="kyc-restrictions-title"
            >
              {restrictionsTitle}
            </h2>
            <p className="kyc-card__intro">{restrictionsIntro}</p>
            <ul className="kyc-restrictions">
              {restrictions.map((restriction) => (
                <li key={restriction}>
                  <span aria-hidden="true">✕</span>
                  <span>{restriction}</span>
                </li>
              ))}
            </ul>
            <p className="kyc-footnote">{restrictionsFootnote}</p>
          </MotionReveal>

          <MotionReveal className="kyc-card" delay={70}>
            <h2 className="kyc-card__title kyc-card__title--teal">
              {privacyTitle}
            </h2>
            <p className="kyc-card__intro">{privacyIntro}</p>
            <ul className="kyc-privacy">
              {privacyPoints.map((point) => (
                <li key={point}>
                  <LineIcon name="check" size={15} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <p className="kyc-footnote">{privacyFootnote}</p>
          </MotionReveal>
        </section>

        <section
          className="trust-cta kyc-cta container-wide"
          aria-labelledby="kyc-cta-title"
        >
          <MotionReveal className="trust-cta__visual">
            <ImageWithGlow
              className="trust-cta__image"
              src="/images/sections/vault-tray.webp"
              alt="An open vault case holding a tray of coloured gemstones"
              sizes="(max-width: 760px) 100vw, 30vw"
            />
          </MotionReveal>

          <MotionReveal className="trust-cta__copy" delay={70}>
            <h2 id="kyc-cta-title">{kycCta.titleLead}</h2>
            <p className="kyc-cta__lead">{kycCta.titleAccent}</p>
            <p>{kycCta.description}</p>
          </MotionReveal>

          <MotionReveal className="trust-cta__action" delay={130}>
            <Link className="button button--gold" href="/early-participation">
              {kycCta.buttonLabel}
            </Link>
            <p>{kycCta.supportingText}</p>
          </MotionReveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
