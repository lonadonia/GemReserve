import type { Metadata } from "next";
import Image from "next/image";

import { LineIcon, type IconName } from "@/components/icons/LineIcon";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { TrustPillars } from "@/components/sections/TrustPillars";
import { ImageWithGlow } from "@/components/ui/ImageWithGlow";
import { MetricStrip } from "@/components/ui/MetricStrip";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { ResponsiveHeroImage } from "@/components/ui/ResponsiveHeroImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WaitlistForm } from "@/components/ui/WaitlistForm";
import {
  aboutCapabilities,
  aboutCta,
  aboutHero,
  aboutHeroPillars,
  aboutStats,
  aboutValues,
  capabilitiesSectionTitle,
  missionStatement,
  missionTitle,
  storyImage,
  storyImageAlt,
  storyParagraphs,
  storyTitle,
  valuesTitle,
  visionStatement,
  visionTitle,
} from "@/content/about";

export const metadata: Metadata = {
  title: "About Us",
  description: aboutHero.description,
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Us | GemReserve.io",
    description: aboutHero.description,
    url: "/about",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const breadcrumbItems = [
  { label: aboutHero.breadcrumb[0], href: "/" },
  { label: aboutHero.breadcrumb[1] },
] as const;

const valueIcons: Record<string, IconName> = {
  integrity: "certificate",
  transparency: "eye",
  innovation: "cubes",
  security: "lock",
  excellence: "diamond",
};

export default function AboutPage() {
  return (
    <div className="about-page">
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section className="hero about-hero" aria-labelledby="about-hero-title">
          <div className="hero__media" aria-hidden="true">
            <ResponsiveHeroImage
              desktopBase="/images/heroes/about-hero"
              mobileBase="/images/heroes/about-hero-mobile"
            />
            <span className="hero__scrim about-hero__scrim" />
          </div>

          <div className="hero__inner about-hero__inner container-wide">
            <MotionReveal className="hero__copy about-hero__copy">
              <Breadcrumbs items={breadcrumbItems} />
              <p className="eyebrow">{aboutHero.eyebrow}</p>
              <h1
                className="hero__title about-hero__title"
                id="about-hero-title"
              >
                <span>{aboutHero.titleLead}</span>{" "}
                <span className="hero__title-accent">
                  {aboutHero.titleAccentOne}
                </span>{" "}
                <span>{aboutHero.titleJoin}</span>{" "}
                <span className="hero__title-accent">
                  {aboutHero.titleAccentTwo}
                </span>
              </h1>
              <p className="hero__description">{aboutHero.description}</p>
            </MotionReveal>

            <MotionReveal
              className="hero-value-row about-hero__values"
              delay={160}
            >
              <TrustPillars
                items={aboutHeroPillars}
                className="hero-value-row__grid about-hero__value-grid"
              />
            </MotionReveal>

            <MotionReveal
              className="hero-callout about-hero__callout"
              delay={110}
            >
              <aside aria-labelledby="about-mission-title">
                <h2 id="about-mission-title">{missionTitle}</h2>
                <p>{missionStatement}</p>
              </aside>
            </MotionReveal>
          </div>
        </section>

        <section
          className="about-story container-wide"
          aria-labelledby="about-story-title"
        >
          <MotionReveal className="about-story__card">
            <h2 className="about-card__title" id="about-story-title">
              {storyTitle}
            </h2>
            <div className="about-story__body">
              <ImageWithGlow
                className="about-story__image"
                src={storyImage}
                alt={storyImageAlt}
                sizes="(max-width: 760px) 88vw, 22vw"
              />
              <div>
                {storyParagraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
              </div>
            </div>
          </MotionReveal>

          <MotionReveal className="about-story__card" delay={70}>
            <h2 className="about-card__title">{visionTitle}</h2>
            <p className="about-vision">{visionStatement}</p>

            <h2 className="about-card__title about-card__title--spaced">
              {valuesTitle}
            </h2>
            <ul className="about-values">
              {aboutValues.map((value) => (
                <li key={value.id}>
                  <LineIcon name={valueIcons[value.id]} size={32} />
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="about-capabilities container-wide"
          aria-labelledby="about-capabilities-title"
        >
          <MotionReveal>
            <SectionHeading
              title={capabilitiesSectionTitle}
              id="about-capabilities-title"
            />
          </MotionReveal>

          <MotionReveal delay={80}>
            <ul className="about-capabilities__grid">
              {aboutCapabilities.map((capability) => (
                <li key={capability.id}>
                  <h3>{capability.title}</h3>
                  <p>{capability.description}</p>
                  <Image
                    className={
                      capability.anchorTop
                        ? "about-capabilities__image--top"
                        : undefined
                    }
                    src={capability.image}
                    alt={capability.alt}
                    width={480}
                    height={360}
                    sizes="(max-width: 760px) 88vw, (max-width: 1080px) 44vw, 17vw"
                  />
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="about-metrics container-wide"
          aria-label="GemReserve.io by the numbers"
        >
          <MotionReveal>
            <MetricStrip
              metrics={aboutStats.map((stat) => ({
                id: stat.id,
                value: stat.value,
                label: stat.label,
                detail: stat.caption,
              }))}
              className="about-metrics__strip"
            />
          </MotionReveal>
        </section>

        <section
          className="waitlist about-waitlist"
          id="waitlist"
          aria-labelledby="about-waitlist-title"
        >
          <div className="waitlist__inner container-wide">
            <MotionReveal className="waitlist__visual">
              <ImageWithGlow
                src="/images/sections/vault-tray.webp"
                alt="An open black and gold vault tray displaying colorful polished gemstones"
                className="waitlist__image"
                sizes="(max-width: 760px) 88vw, 28vw"
              />
            </MotionReveal>

            <MotionReveal className="waitlist__copy" delay={80}>
              <p className="waitlist__eyebrow eyebrow">{aboutCta.eyebrow}</p>
              <h2 id="about-waitlist-title">{aboutCta.title}</h2>
              <p>{aboutCta.description}</p>
            </MotionReveal>

            <MotionReveal className="waitlist__form" delay={150}>
              <WaitlistForm compact />
            </MotionReveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
