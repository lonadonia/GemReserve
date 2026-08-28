import type { Metadata } from "next";
import Link from "next/link";

import { LineIcon, type IconName } from "@/components/icons/LineIcon";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { ResponsiveHeroImage } from "@/components/ui/ResponsiveHeroImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  agreementsNote,
  closingMarks,
  factorsSectionTitle,
  importantNotes,
  notesSectionTitle,
  questionsPanel,
  readCarefully,
  restrictionsNote,
  riskFactors,
  riskHero,
} from "@/content/risk-disclosure";

export const metadata: Metadata = {
  title: "Risk Disclosure",
  description: riskHero.description,
  alternates: { canonical: "/risk-disclosure" },
  openGraph: {
    title: "Risk Disclosure | GemReserve.io",
    description: riskHero.description,
    url: "/risk-disclosure",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const breadcrumbItems = [
  { label: riskHero.breadcrumb[0], href: "/" },
  { label: riskHero.breadcrumb[1] },
] as const;

const factorIcons: Record<string, IconName> = {
  market: "chart",
  technology: "network",
  security: "lock",
  regulatory: "scales",
  liquidity: "globe",
  valuation: "contract",
  custody: "box",
  "smart-contract": "code-shield",
  currency: "dollar-circle",
  counterparty: "user-check",
  concentration: "pie",
  "no-guarantee": "alert-triangle",
};

const closingIcons: Record<string, IconName> = {
  transparent: "eye",
  secure: "lock",
  backed: "diamond",
  global: "globe",
  support: "users",
};

export default function RiskDisclosurePage() {
  return (
    <div className="risk-page">
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section className="hero risk-hero" aria-labelledby="risk-hero-title">
          <div className="hero__media" aria-hidden="true">
            <ResponsiveHeroImage
              desktopBase="/images/heroes/risk-hero"
              mobileBase="/images/heroes/risk-hero-mobile"
            />
            <span className="hero__scrim risk-hero__scrim" />
          </div>

          <div className="hero__inner container-wide">
            <MotionReveal className="hero__copy">
              <Breadcrumbs items={breadcrumbItems} />
              <h1 className="hero__title" id="risk-hero-title">
                <span>{riskHero.titleLines[0]}</span>
                <span className="hero__title-accent">
                  {riskHero.titleLines[1]}
                </span>
              </h1>
              <p className="risk-hero__tagline">
                {riskHero.taglineLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>
              <p className="hero__description">{riskHero.description}</p>

              <aside className="hero-callout risk-hero__callout">
                <div>
                  <p className="hero-callout__title">
                    {riskHero.callout.title}
                  </p>
                  {riskHero.callout.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </aside>
            </MotionReveal>
          </div>
        </section>

        <section
          className="risk-read container-wide"
          aria-labelledby="risk-read-title"
        >
          <MotionReveal className="risk-read__panel">
            <LineIcon name="alert-triangle" size={34} />
            <div>
              <h2 id="risk-read-title">{readCarefully.title}</h2>
              <p>{readCarefully.body}</p>
            </div>
          </MotionReveal>
        </section>

        <section
          className="risk-factors container-wide"
          aria-labelledby="risk-factors-title"
        >
          <MotionReveal>
            <SectionHeading
              title={factorsSectionTitle}
              id="risk-factors-title"
            />
          </MotionReveal>
          <MotionReveal delay={80}>
            <ul className="risk-factor-grid">
              {riskFactors.map((factor) => (
                <li key={factor.id}>
                  <LineIcon name={factorIcons[factor.id]} size={32} />
                  <h3>{factor.title}</h3>
                  <p>{factor.description}</p>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="risk-notes container-wide"
          aria-labelledby="risk-notes-title"
        >
          <MotionReveal>
            <SectionHeading title={notesSectionTitle} id="risk-notes-title" />
          </MotionReveal>
          <MotionReveal delay={80}>
            <ul className="risk-note-grid">
              {importantNotes.map((note) => (
                <li key={note.id}>
                  <LineIcon name="check" size={20} />
                  <p>{note.text}</p>
                </li>
              ))}
            </ul>
          </MotionReveal>

          <MotionReveal className="risk-addendum" delay={140}>
            <div className="risk-addendum__block">
              <h3>{agreementsNote.title}</h3>
              <p>{agreementsNote.body}</p>
              <Link href={agreementsNote.link.href}>
                {agreementsNote.link.label}
              </Link>
            </div>
            <div className="risk-addendum__block">
              <h3>WHERE PARTICIPATION IS RESTRICTED</h3>
              <p>{restrictionsNote.body}</p>
              <Link href={restrictionsNote.link.href}>
                {restrictionsNote.link.label}
              </Link>
            </div>
          </MotionReveal>
        </section>

        <section
          className="risk-questions container-wide"
          aria-labelledby="risk-questions-title"
        >
          <MotionReveal className="risk-questions__panel">
            <LineIcon name="question" size={34} />
            <div>
              <h2 id="risk-questions-title">{questionsPanel.title}</h2>
              <p>{questionsPanel.description}</p>
            </div>
            <Link className="button button--gold" href={questionsPanel.href}>
              {questionsPanel.buttonLabel}
            </Link>
          </MotionReveal>
        </section>

        <section
          className="risk-closing container-wide"
          aria-label="How we work"
        >
          <MotionReveal>
            <ul className="trust-pillars risk-closing__grid">
              {closingMarks.map((mark) => (
                <li key={mark.id}>
                  <LineIcon name={closingIcons[mark.id]} size={36} />
                  <h3>{mark.title}</h3>
                  <p>{mark.description}</p>
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
