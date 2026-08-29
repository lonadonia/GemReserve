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
  achievements,
  achievementsIntro,
  achievementsSectionTitle,
  corporateCta,
  corporateHero,
  milestonePanel,
  missionPanel,
  statusTable,
  verifyPanel,
} from "@/content/corporate-development";

export const metadata: Metadata = {
  title: "Corporate Development",
  description: corporateHero.description,
  alternates: { canonical: "/corporate-development" },
  openGraph: {
    title: "Corporate Development | GemReserve.io",
    description: corporateHero.description,
    url: "/corporate-development",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const breadcrumbItems = [
  { label: corporateHero.breadcrumb[0], href: "/about" },
  { label: corporateHero.breadcrumb[1] },
] as const;

const markIcons: Record<string, IconName> = {
  assets: "diamond",
  trust: "shield-check",
  access: "globe",
  value: "refresh",
};

const achievementIcons: Record<string, IconName> = {
  company: "building",
  legal: "scales",
  infrastructure: "bank",
  supply: "diamond",
  platform: "cubes",
  security: "shield-check",
  governance: "users",
};

const initiativeIcons: Record<string, IconName> = {
  legal: "scales",
  supply: "diamond",
  custody: "vault",
  platform: "cubes",
  tokenization: "token",
  marketplace: "exchange",
  mobile: "phone",
  expansion: "globe",
  redemption: "box",
};

const milestoneIcons: Record<string, IconName> = {
  beta: "bars",
  tokenization: "cubes",
  marketplace: "exchange",
  mobile: "phone",
  expansion: "globe",
  redemption: "box",
};

const checkIcons: Record<string, IconName> = {
  governance: "users",
  registry: "passport",
  programs: "diamond",
  documents: "file-check",
};

export default function CorporateDevelopmentPage() {
  return (
    <div className="corporate-page">
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section
          className="hero corporate-hero"
          aria-labelledby="corporate-hero-title"
        >
          <div className="hero__media" aria-hidden="true">
            <ResponsiveHeroImage
              desktopBase="/images/heroes/corporate-hero"
              mobileBase="/images/heroes/corporate-hero-mobile"
            />
            <span className="hero__scrim corporate-hero__scrim" />
          </div>

          <div className="hero__inner container-wide">
            <MotionReveal className="hero__copy">
              <Breadcrumbs items={breadcrumbItems} />
              <h1 className="hero__title" id="corporate-hero-title">
                <span>{corporateHero.titleLines[0]}</span>
                <span>{corporateHero.titleLines[1]}</span>
                <span className="hero__title-accent">
                  {corporateHero.titleLines[2]}
                </span>
              </h1>
              <p className="hero__description">{corporateHero.description}</p>
            </MotionReveal>
          </div>
        </section>

        <section
          className="corporate-mission container-wide"
          aria-labelledby="corporate-mission-title"
        >
          <MotionReveal className="corporate-mission__panel">
            <div className="corporate-mission__copy">
              <h2 id="corporate-mission-title">{missionPanel.title}</h2>
              <p>{missionPanel.statement}</p>
            </div>
            <ul className="corporate-mission__marks">
              {missionPanel.marks.map((mark) => (
                <li key={mark.id}>
                  <LineIcon name={markIcons[mark.id]} size={30} />
                  <span>{mark.label}</span>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="corporate-achievements container-wide"
          aria-labelledby="corporate-achievements-title"
        >
          <MotionReveal>
            <SectionHeading
              title={achievementsSectionTitle}
              id="corporate-achievements-title"
            />
            <p className="corporate-achievements__intro">{achievementsIntro}</p>
          </MotionReveal>
          <MotionReveal delay={80}>
            <ul className="corporate-achievement-grid">
              {achievements.map((achievement) => (
                <li key={achievement.id}>
                  <LineIcon name={achievementIcons[achievement.id]} size={32} />
                  <h3>{achievement.title}</h3>
                  <p>{achievement.description}</p>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="corporate-status container-wide"
          aria-labelledby="corporate-status-title"
        >
          <MotionReveal>
            <SectionHeading
              title={statusTable.title}
              id="corporate-status-title"
            />
          </MotionReveal>

          {/* The table is wider than a phone. It scrolls inside its own frame
              rather than widening the page, and the frame is focusable so the
              scroll is reachable from the keyboard. */}
          <MotionReveal delay={80}>
            <div
              className="corporate-table__frame"
              tabIndex={0}
              role="region"
              aria-label={statusTable.title}
            >
              <table className="corporate-table">
                <thead>
                  <tr>
                    {statusTable.columns.map((column) => (
                      <th scope="col" key={column}>
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {statusTable.initiatives.map((initiative) => (
                    <tr key={initiative.id}>
                      <th scope="row">
                        <LineIcon
                          name={initiativeIcons[initiative.id]}
                          size={18}
                        />
                        <span>{initiative.initiative}</span>
                      </th>
                      <td>{initiative.description}</td>
                      <td>
                        <span
                          className={`corporate-status__badge corporate-status__badge--${initiative.status}`}
                        >
                          {statusTable.statusLabels[initiative.status]}
                        </span>
                      </td>
                      <td>{initiative.target}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="corporate-table__note" role="note">
              <LineIcon name="alert-triangle" size={22} />
              <span>{statusTable.note}</span>
            </p>
          </MotionReveal>
        </section>

        <section
          className="corporate-milestones container-wide"
          aria-labelledby="corporate-milestones-title"
        >
          <MotionReveal>
            <SectionHeading
              title={milestonePanel.title}
              id="corporate-milestones-title"
            />
            <p className="corporate-milestones__intro">
              {milestonePanel.intro}
            </p>
          </MotionReveal>
          {/* The board draws this as a connected rail: circles on a single
              horizontal line with a marker between each pair. The line is one
              pseudo-element behind the row so it cannot drift out of step with
              the circles, and it is dropped when the row wraps. */}
          <MotionReveal delay={80}>
            <ol className="corporate-timeline">
              {milestonePanel.milestones.map((milestone, index) => (
                <li key={milestone.id}>
                  <span className="corporate-timeline__dot">
                    <LineIcon name={milestoneIcons[milestone.id]} size={20} />
                  </span>
                  <h3>{milestone.title}</h3>
                  <p>{milestone.description}</p>
                  <span className="sr-only">{`Step ${index + 1}`}</span>
                </li>
              ))}
            </ol>
            <p className="corporate-milestones__footnote">
              {milestonePanel.footnote.lead}{" "}
              {milestonePanel.footnote.links.map((link, index) => (
                <span key={link.href}>
                  {index > 0 ? " and " : ""}
                  <Link href={link.href}>{link.label}</Link>
                </span>
              ))}{" "}
              {milestonePanel.footnote.trail}
            </p>
          </MotionReveal>
        </section>

        <section
          className="corporate-verify container-wide"
          aria-labelledby="corporate-verify-title"
        >
          <MotionReveal className="corporate-verify__panel">
            <h2 id="corporate-verify-title">{verifyPanel.title}</h2>
            <p className="corporate-verify__intro">{verifyPanel.intro}</p>
            <ul className="corporate-verify__grid">
              {verifyPanel.points.map((point) => (
                <li key={point.id}>
                  <Link href={point.href}>
                    <LineIcon name={checkIcons[point.id]} size={28} />
                    <span>
                      <strong>{point.title}</strong>
                      {point.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="trust-cta corporate-cta container-wide"
          aria-labelledby="corporate-cta-title"
        >
          <MotionReveal className="trust-cta__visual">
            <ImageWithGlow
              className="trust-cta__image"
              src="/images/sections/vault-tray.webp"
              alt={corporateCta.imageAlt}
              sizes="(max-width: 980px) 100vw, 30vw"
            />
          </MotionReveal>

          <MotionReveal className="trust-cta__copy" delay={70}>
            <h2 id="corporate-cta-title">{corporateCta.title}</h2>
            <p>{corporateCta.description}</p>
          </MotionReveal>

          <MotionReveal className="trust-cta__action" delay={130}>
            <Link className="button button--gold" href="/#waitlist">
              {corporateCta.buttonLabel}
            </Link>
            <p>{corporateCta.supportingText}</p>
          </MotionReveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
