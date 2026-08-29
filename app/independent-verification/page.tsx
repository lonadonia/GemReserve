import type { Metadata } from "next";
import Image from "next/image";
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

            {/* The board stages three separate objects over the photograph: a
                dark report card, a brass on-chain plate below and left of it,
                and a gold seal at the right. They are drawn rather than baked
                into the plate so every value stays selectable text and the
                sample label cannot be separated from the sample. */}
            <MotionReveal className="verification-hero__stage" delay={120}>
              <aside
                className="verification-card-report"
                aria-label="Sample gemological report"
              >
                <p className="verification-card-report__head">
                  <span className="verification-card-report__crest">
                    <Image
                      src="/brand/gemreserve-shield-512.png"
                      alt=""
                      width={512}
                      height={512}
                    />
                  </span>
                  <span>
                    {verificationHero.sample.eyebrow}
                    <small>{verificationHero.sample.title}</small>
                  </span>
                </p>
                <ul className="verification-card-report__checks">
                  {verificationHero.sample.checks.map((check) => (
                    <li key={check}>
                      <span
                        className="verification-check-box"
                        aria-hidden="true"
                      >
                        <LineIcon name="check" size={13} />
                      </span>
                      {check}
                    </li>
                  ))}
                </ul>
                <p className="verification-card-report__note">
                  {verificationHero.sample.note}
                </p>
              </aside>

              <div className="verification-plate">
                {/* Decorative only: a code-block motif standing in for the
                    board's QR. It encodes nothing and is not scannable, because
                    there is no record behind it to scan. */}
                <span className="verification-plate__code" aria-hidden="true" />
                <div className="verification-plate__body">
                  <p className="verification-plate__title">
                    {verificationHero.sample.bar.title}
                  </p>
                  <dl>
                    {verificationHero.sample.bar.rows.map((row) => (
                      <div key={row.label}>
                        <dt>{row.label}</dt>
                        <dd>{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>

              <p className="verification-hero__seal">
                <span>{verificationHero.sample.seal[0]}</span>
                <span>{verificationHero.sample.seal[1]}</span>
                <LineIcon name="diamond" size={16} />
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
            {/* The board lays this out as a table — a mark on the left, a
                two-line description on the right, hairline between rows. The
                marks were company logos; they are the role instead. */}
            <ul className="verification-roles">
              {independentRoles.roles.map((role) => (
                <li key={role.id}>
                  <span className="verification-roles__mark">
                    <LineIcon name={roleIcons[role.id]} size={22} />
                    <span>{role.role}</span>
                  </span>
                  <span className="verification-roles__body">
                    {role.responsibility}
                    <small>{role.scope}</small>
                  </span>
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

            {/* The board rings a gemstone with two gold circles, six dots on
                the outer one, and six icon badges joined to those dots by hair
                lines. The rings and connectors are one SVG behind the badges;
                the badges and their labels stay as text so they remain readable
                and can drop into two plain columns on a phone. */}
            <div className="verification-orbit">
              <div className="verification-orbit__ring">
                <svg
                  className="verification-orbit__lines"
                  viewBox="0 0 400 340"
                  aria-hidden="true"
                  focusable="false"
                >
                  <circle
                    className="verification-orbit__circle"
                    cx="200"
                    cy="170"
                    r="132"
                  />
                  <circle
                    className="verification-orbit__circle verification-orbit__circle--inner"
                    cx="200"
                    cy="170"
                    r="112"
                  />
                  {[
                    [80, 42],
                    [56, 170],
                    [80, 298],
                    [320, 42],
                    [344, 170],
                    [320, 298],
                  ].map(([x, y], index) => {
                    const angle = [-60, 180, 60, -120, 0, 120][index];
                    const rad = (angle * Math.PI) / 180;
                    const dotX = 200 + 132 * Math.cos(rad);
                    const dotY = 170 + 132 * Math.sin(rad);
                    return (
                      <g key={`${x}-${y}`}>
                        <line
                          className="verification-orbit__spoke"
                          x1={x}
                          y1={y}
                          x2={dotX}
                          y2={dotY}
                        />
                        <circle
                          className="verification-orbit__dot"
                          cx={dotX}
                          cy={dotY}
                          r="4.5"
                        />
                      </g>
                    );
                  })}
                </svg>

                <Image
                  className="verification-orbit__gem"
                  src="/images/gems/emerald.webp"
                  alt={onChainPanel.gemImageAlt}
                  width={480}
                  height={480}
                  sizes="(max-width: 980px) 40vw, 150px"
                />

                <ul className="verification-orbit__nodes">
                  {onChainPanel.nodes.map((node, index) => (
                    <li
                      className="verification-orbit__node"
                      key={node.id}
                      style={{ "--orbit-index": index } as CSSProperties}
                    >
                      <span
                        className="verification-orbit__badge"
                        aria-hidden="true"
                      >
                        <LineIcon name={nodeIcons[node.id]} size={20} />
                      </span>
                      <span className="verification-orbit__label">
                        {node.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="verification-orbit__scan">
                <span className="verification-plate__code" aria-hidden="true" />
                <span>{onChainPanel.scanLabel}</span>
              </p>
              <p className="verification-orbit__footnote">
                {onChainPanel.footnote}
              </p>
            </div>
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
