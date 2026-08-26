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
  restrictedCommitment,
  restrictedGroups,
  restrictedHero,
  restrictedListIntro,
  restrictedListTitle,
  restrictedMeaning,
  restrictedNotice,
  restrictedWhy,
} from "@/content/restricted-jurisdictions";

export const metadata: Metadata = {
  title: "Restricted Jurisdictions",
  description: restrictedHero.paragraphs[0],
  alternates: { canonical: "/restricted-jurisdictions" },
  openGraph: {
    title: "Restricted Jurisdictions | GemReserve.io",
    description: restrictedHero.paragraphs[0],
    url: "/restricted-jurisdictions",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const breadcrumbItems = [
  { label: restrictedHero.breadcrumb[0], href: "/" },
  { label: restrictedHero.breadcrumb[1], href: "/about" },
  { label: restrictedHero.breadcrumb[2], href: "/governance" },
  { label: restrictedHero.breadcrumb[3] },
] as const;

const reasonIcons: Record<string, IconName> = {
  "legal-compliance": "scales",
  "risk-mitigation": "shield-check",
  "platform-security": "globe",
  "reputation-trust": "users",
};

const meaningIcons: Record<string, IconName> = {
  "not-eligible": "user",
  concealment: "contract",
  verification: "shield-check",
};

const commitmentIcons: Record<string, IconName> = {
  compliant: "check",
  transparent: "eye",
  secure: "lock",
  trusted: "shield-check",
};

export default function RestrictedJurisdictionsPage() {
  return (
    <div className="restricted-page">
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section
          className="hero restricted-hero"
          aria-labelledby="restricted-hero-title"
        >
          <div className="hero__media" aria-hidden="true">
            <ResponsiveHeroImage
              desktopBase="/images/heroes/restricted-hero"
              mobileBase="/images/heroes/restricted-hero-mobile"
            />
            <span className="hero__scrim restricted-hero__scrim" />
          </div>

          <div className="hero__inner container-wide">
            <MotionReveal className="hero__copy">
              <Breadcrumbs items={breadcrumbItems} />
              <h1 className="hero__title" id="restricted-hero-title">
                <span>{restrictedHero.titleLines[0]}</span>
                <span className="restricted-hero__title-accent">
                  {restrictedHero.titleLines[1]}
                </span>
              </h1>
              <p className="restricted-hero__tagline">
                {restrictedHero.tagline}
              </p>
              {restrictedHero.paragraphs.map((paragraph) => (
                <p className="hero__description" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </MotionReveal>

            {/* The board stands a compliance card at the right of the plate,
                drawn rather than photographed so it stays legible at every
                width and can reflow below the copy on a phone. */}
            <MotionReveal className="restricted-hero__card" delay={120}>
              <aside aria-label={restrictedHero.card.wordmark}>
                <p className="restricted-hero__card-wordmark">
                  {restrictedHero.card.wordmark}
                </p>
                <p className="restricted-hero__card-lines">
                  {restrictedHero.card.lines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </p>
              </aside>
            </MotionReveal>
          </div>
        </section>

        <section
          className="restricted-list container-wide"
          aria-labelledby="restricted-list-title"
        >
          <MotionReveal className="restricted-list__panel">
            <h2 className="restricted-list__title" id="restricted-list-title">
              {restrictedListTitle}
            </h2>
            <p className="restricted-list__intro">{restrictedListIntro}</p>

            <div className="restricted-groups">
              {restrictedGroups.map((group) => (
                <section
                  className="restricted-group"
                  key={group.id}
                  aria-labelledby={`restricted-${group.id}`}
                >
                  <h3 id={`restricted-${group.id}`}>
                    <LineIcon name="ban" size={26} />
                    <span>{group.title}</span>
                  </h3>
                  {group.places ? (
                    <ul>
                      {group.places.map((place) => (
                        <li key={place}>{place}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{group.statement}</p>
                  )}
                </section>
              ))}
            </div>

            <p className="restricted-notice" role="note">
              <LineIcon name="alert-triangle" size={26} />
              <span>
                <strong>{restrictedNotice.label}</strong>{" "}
                {restrictedNotice.lines.join(" ")}
              </span>
            </p>
          </MotionReveal>
        </section>

        <section
          className="restricted-detail container-wide"
          aria-labelledby="restricted-why-title"
        >
          <MotionReveal className="restricted-card">
            <h2 className="restricted-card__title" id="restricted-why-title">
              {restrictedWhy.title}
            </h2>
            <ul className="restricted-reasons">
              {restrictedWhy.reasons.map((reason) => (
                <li key={reason.id}>
                  <LineIcon name={reasonIcons[reason.id]} size={32} />
                  <div>
                    <h3>{reason.title}</h3>
                    <p>{reason.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </MotionReveal>

          <MotionReveal className="restricted-card" delay={90}>
            <h2
              className="restricted-card__title"
              id="restricted-meaning-title"
            >
              {restrictedMeaning.title}
            </h2>
            <ul
              className="restricted-meaning"
              aria-labelledby="restricted-meaning-title"
            >
              {restrictedMeaning.points.map((point) => (
                <li key={point.id}>
                  <span className="restricted-meaning__mark" aria-hidden="true">
                    <LineIcon name={meaningIcons[point.id]} size={26} />
                  </span>
                  <p>{point.description}</p>
                </li>
              ))}
            </ul>

            <aside
              className="restricted-questions"
              aria-labelledby="restricted-questions-title"
            >
              <span className="restricted-questions__mark" aria-hidden="true">
                <LineIcon name="question" size={28} />
              </span>
              <div>
                <h3 id="restricted-questions-title">
                  {restrictedMeaning.questions.title}
                </h3>
                <p>
                  {restrictedMeaning.questions.lead}{" "}
                  <a href={`mailto:${restrictedMeaning.questions.email}`}>
                    {restrictedMeaning.questions.email}
                  </a>{" "}
                  {restrictedMeaning.questions.trail}
                </p>
                <p>
                  <Link href="/contact">Other ways to reach us</Link>
                </p>
              </div>
            </aside>
          </MotionReveal>
        </section>

        <section
          className="restricted-commitment container-wide"
          aria-labelledby="restricted-commitment-title"
        >
          <MotionReveal className="restricted-commitment__visual">
            <ImageWithGlow
              className="restricted-commitment__image"
              src="/images/sections/vault-tray.webp"
              alt={restrictedCommitment.imageAlt}
              sizes="(max-width: 980px) 100vw, 30vw"
            />
          </MotionReveal>

          <MotionReveal className="restricted-commitment__copy" delay={70}>
            <SectionHeading
              title={restrictedCommitment.title}
              id="restricted-commitment-title"
              align="left"
            />
            {restrictedCommitment.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </MotionReveal>

          <MotionReveal className="restricted-commitment__marks" delay={130}>
            <ul>
              {restrictedCommitment.marks.map((mark) => (
                <li key={mark.id}>
                  <LineIcon name={commitmentIcons[mark.id]} size={26} />
                  <span>{mark.label}</span>
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
