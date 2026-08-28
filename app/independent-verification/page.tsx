import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";

import { LineIcon, type IconName } from "@/components/icons/LineIcon";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ImageWithGlow } from "@/components/ui/ImageWithGlow";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { ResponsiveHeroImage } from "@/components/ui/ResponsiveHeroImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  frameworkIntro,
  frameworkSectionTitle,
  independentRoles,
  meaningPanel,
  onChainPanel,
  verificationCta,
  verificationHero,
  verificationLayers,
} from "@/content/verification";

export const metadata: Metadata = {
  title: "Independent Verification",
  description: verificationHero.description,
  alternates: { canonical: "/independent-verification" },
  openGraph: {
    title: "Independent Verification | GemReserve.io",
    description: verificationHero.description,
    url: "/independent-verification",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const breadcrumbItems = [
  { label: verificationHero.breadcrumb[0], href: "/" },
  { label: verificationHero.breadcrumb[1], href: "/technology" },
  { label: verificationHero.breadcrumb[2] },
] as const;

const layerIcons: Record<string, IconName> = {
  gemological: "diamond",
  custody: "vault",
  reserve: "shield-check",
  legal: "file-check",
  "on-chain": "cubes",
  monitoring: "search",
};

const roleIcons: Record<string, IconName> = {
  laboratory: "certificate",
  custodian: "vault",
  auditor: "clipboard-check",
  counsel: "scales",
  security: "code-shield",
};

const nodeIcons: Record<string, IconName> = {
  report: "certificate",
  reserves: "shield-check",
  ownership: "user-check",
  certificates: "file-check",
  history: "exchange",
  custody: "vault",
};

const meaningIcons: Record<string, IconName> = {
  confidence: "shield-check",
  risk: "lock",
  regulatory: "scales",
  transparency: "eye",
  institutional: "bank",
};

export default function IndependentVerificationPage() {
  return (
    <div className="verification-page">
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section
          className="hero verification-hero"
          aria-labelledby="verification-hero-title"
        >
          <div className="hero__media" aria-hidden="true">
            <ResponsiveHeroImage
              desktopBase="/images/heroes/verification-hero"
              mobileBase="/images/heroes/verification-hero-mobile"
            />
            <span className="hero__scrim verification-hero__scrim" />
          </div>

          <div className="hero__inner verification-hero__inner container-wide">
            <MotionReveal className="hero__copy">
              <Breadcrumbs items={breadcrumbItems} />
              <h1 className="hero__title" id="verification-hero-title">
                <span>{verificationHero.titleLines[0]}</span>
                <span className="hero__title-accent">
                  {verificationHero.titleLines[1]}
                </span>
              </h1>
              <p className="verification-hero__tagline">
                {verificationHero.tagline}
              </p>
              <p className="hero__description">
                {verificationHero.description}
              </p>
            </MotionReveal>

            {/* The board photographs a laboratory report card and an on-chain
                bar. Both are drawn rather than baked into the plate so the
                values stay selectable text, and so the sample label cannot be
                separated from the sample. */}
            <MotionReveal className="verification-hero__sample" delay={120}>
              <aside aria-label="Sample gemological report">
                <p className="verification-sample__eyebrow">
                  <LineIcon name="certificate" size={20} />
                  <span>
                    {verificationHero.sample.eyebrow}
                    <small>{verificationHero.sample.title}</small>
                  </span>
                </p>
                <ul className="verification-sample__checks">
                  {verificationHero.sample.checks.map((check) => (
                    <li key={check}>
                      <LineIcon name="check" size={17} />
                      {check}
                    </li>
                  ))}
                </ul>
                <dl className="verification-sample__record">
                  {verificationHero.sample.record.map((row) => (
                    <div key={row.label}>
                      <dt>{row.label}</dt>
                      <dd>{row.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="verification-sample__note">
                  {verificationHero.sample.note}
                </p>
              </aside>
              <p className="verification-hero__seal" aria-hidden="true">
                <span>{verificationHero.sample.seal[0]}</span>
                <span>{verificationHero.sample.seal[1]}</span>
              </p>
            </MotionReveal>
          </div>
        </section>

        <section
          className="verification-framework container-wide"
          aria-labelledby="verification-framework-title"
        >
          <MotionReveal>
            <SectionHeading
              title={frameworkSectionTitle}
              id="verification-framework-title"
            />
            <p className="verification-framework__intro">{frameworkIntro}</p>
          </MotionReveal>

          <MotionReveal delay={80}>
            <ol className="verification-layers">
              {verificationLayers.map((layer) => (
                <li key={layer.id}>
                  <p className="verification-layer__step" aria-hidden="true">
                    {layer.step}
                  </p>
                  <LineIcon name={layerIcons[layer.id]} size={34} />
                  <h3>{layer.title}</h3>
                  <p className="verification-layer__body">
                    {layer.description}
                  </p>
                  <ul>
                    {layer.checks.map((check) => (
                      <li key={check}>{check}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </MotionReveal>
        </section>

        <section
          className="verification-detail container-wide"
          aria-labelledby="verification-roles-title"
        >
          <MotionReveal className="verification-card">
            <h2
              className="verification-card__title"
              id="verification-roles-title"
            >
              {independentRoles.title}
            </h2>
            <p className="verification-card__intro">{independentRoles.intro}</p>
            <ul className="verification-roles">
              {independentRoles.roles.map((role) => (
                <li key={role.id}>
                  <LineIcon name={roleIcons[role.id]} size={26} />
                  <div>
                    <h3>{role.role}</h3>
                    <p>{role.responsibility}</p>
                    <p className="verification-roles__scope">{role.scope}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="verification-card__note" role="note">
              <LineIcon name="alert-triangle" size={22} />
              <span>{independentRoles.disclosure}</span>
            </p>
          </MotionReveal>

          <MotionReveal className="verification-card" delay={80}>
            <h2 className="verification-card__title verification-card__title--center">
              {onChainPanel.title}
            </h2>
            <p className="verification-card__intro verification-card__intro--center">
              {onChainPanel.intro}
            </p>

            {/* The board draws a gemstone ringed by six data nodes. It is built
                as a list on a radial grid rather than an image, so every label
                stays text and the ring can collapse to a column on a phone. */}
            <ul className="verification-orbit">
              <li className="verification-orbit__core" aria-hidden="true">
                <LineIcon name="diamond" size={44} />
              </li>
              {onChainPanel.nodes.map((node, index) => (
                <li
                  className="verification-orbit__node"
                  key={node.id}
                  style={{ "--orbit-index": index } as CSSProperties}
                >
                  <LineIcon name={nodeIcons[node.id]} size={22} />
                  <span>{node.label}</span>
                </li>
              ))}
            </ul>
            <p className="verification-orbit__footnote">
              {onChainPanel.footnote}
            </p>
          </MotionReveal>

          <MotionReveal className="verification-card" delay={160}>
            <h2 className="verification-card__title">{meaningPanel.title}</h2>
            <ul className="verification-meaning">
              {meaningPanel.points.map((point) => (
                <li key={point.id}>
                  <LineIcon name={meaningIcons[point.id]} size={26} />
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
          className="trust-cta verification-cta container-wide"
          aria-labelledby="verification-cta-title"
        >
          <MotionReveal className="trust-cta__visual">
            <ImageWithGlow
              className="trust-cta__image"
              src="/images/sections/open-vault.webp"
              alt={verificationCta.imageAlt}
              sizes="(max-width: 980px) 100vw, 30vw"
            />
          </MotionReveal>

          <MotionReveal className="trust-cta__copy" delay={70}>
            <h2 id="verification-cta-title">
              <span>{verificationCta.titleLines[0]}</span>
              <span className="verification-cta__accent">
                {verificationCta.titleLines[1]}
              </span>
            </h2>
            <p>{verificationCta.description}</p>
          </MotionReveal>

          <MotionReveal className="trust-cta__action" delay={130}>
            <div className="verification-cta__panel">
              <LineIcon name="shield-check" size={30} />
              <div>
                <h3>{verificationCta.panel.title}</h3>
                <p>{verificationCta.panel.lines.join(" ")}</p>
              </div>
            </div>
            <Link
              className="button button--gold"
              href={verificationCta.buttonHref}
            >
              {verificationCta.buttonLabel}
            </Link>
          </MotionReveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
