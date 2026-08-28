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
  audiencePanel,
  chapters,
  chaptersSectionTitle,
  closingMarks,
  downloadPanel,
  executivePanel,
  highlightsPanel,
  readNowPanel,
  whitepaperHero,
} from "@/content/whitepaper";

export const metadata: Metadata = {
  title: "Whitepaper",
  description: whitepaperHero.description,
  alternates: { canonical: "/whitepaper" },
  openGraph: {
    title: "Whitepaper | GemReserve.io",
    description: whitepaperHero.description,
    url: "/whitepaper",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const breadcrumbItems = [
  { label: whitepaperHero.breadcrumb[0], href: "/" },
  { label: whitepaperHero.breadcrumb[1], href: "/documents" },
  { label: whitepaperHero.breadcrumb[2] },
] as const;

const chapterIcons: Record<string, IconName> = {
  vision: "contract",
  market: "chart",
  framework: "cubes",
  technology: "shield-check",
  tokenomics: "pie",
  governance: "users",
  roadmap: "rocket",
};

const markIcons: readonly IconName[] = ["eye", "lock", "diamond", "globe"];

const audienceIcons: Record<string, IconName> = {
  investors: "user",
  institutional: "bank",
  owners: "hand-gem",
  traders: "exchange",
};

const closingIcons: Record<string, IconName> = {
  backed: "lock",
  trust: "shield-check",
  future: "globe",
  own: "diamond",
};

export default function WhitepaperPage() {
  return (
    <div className="whitepaper-page">
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section
          className="hero whitepaper-hero"
          aria-labelledby="whitepaper-hero-title"
        >
          <div className="hero__media" aria-hidden="true">
            <ResponsiveHeroImage
              desktopBase="/images/heroes/whitepaper-hero"
              mobileBase="/images/heroes/whitepaper-hero-mobile"
            />
            <span className="hero__scrim whitepaper-hero__scrim" />
          </div>

          <div className="hero__inner container-wide">
            <MotionReveal className="hero__copy">
              <Breadcrumbs items={breadcrumbItems} />
              <h1 className="hero__title" id="whitepaper-hero-title">
                <span className="hero__title-accent">
                  {whitepaperHero.title}
                </span>
              </h1>
              <p className="whitepaper-hero__tagline">
                {whitepaperHero.tagline}
              </p>
              <p className="hero__description">{whitepaperHero.description}</p>

              <aside className="hero-callout whitepaper-hero__callout">
                <div>
                  <p className="hero-callout__title">
                    {whitepaperHero.callout.title}
                  </p>
                  {whitepaperHero.callout.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </aside>

              <ul className="whitepaper-hero__marks">
                {whitepaperHero.marks.map((mark, index) => (
                  <li key={mark}>
                    <LineIcon
                      name={markIcons[index % markIcons.length]}
                      size={20}
                    />
                    {mark}
                  </li>
                ))}
              </ul>
            </MotionReveal>
          </div>
        </section>

        <section
          className="whitepaper-chapters container-wide"
          aria-labelledby="whitepaper-chapters-title"
        >
          <MotionReveal>
            <SectionHeading
              title={chaptersSectionTitle}
              id="whitepaper-chapters-title"
            />
          </MotionReveal>
          <MotionReveal delay={80}>
            <ol className="whitepaper-chapter-grid">
              {chapters.map((chapter) => (
                <li key={chapter.id}>
                  <LineIcon name={chapterIcons[chapter.id]} size={30} />
                  <h3>{chapter.title}</h3>
                  <p>{chapter.description}</p>
                </li>
              ))}
            </ol>
          </MotionReveal>
        </section>

        <section
          className="whitepaper-detail container-wide"
          aria-labelledby="whitepaper-executive-title"
        >
          <MotionReveal className="whitepaper-card">
            <h2
              className="whitepaper-card__title"
              id="whitepaper-executive-title"
            >
              {executivePanel.title}
            </h2>
            {executivePanel.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <ImageWithGlow
              className="whitepaper-card__map"
              src="/images/sections/network-map.webp"
              alt={executivePanel.imageAlt}
              sizes="(max-width: 980px) 100vw, 28vw"
            />
          </MotionReveal>

          <MotionReveal className="whitepaper-card" delay={80}>
            <h2 className="whitepaper-card__title">{highlightsPanel.title}</h2>
            <ul className="whitepaper-highlights">
              {highlightsPanel.highlights.map((highlight) => (
                <li key={highlight}>
                  <LineIcon name="check" size={18} />
                  {highlight}
                </li>
              ))}
            </ul>
          </MotionReveal>

          <MotionReveal className="whitepaper-card" delay={160}>
            <h2 className="whitepaper-card__title">{audiencePanel.title}</h2>
            <ul className="whitepaper-audience">
              {audiencePanel.audiences.map((audience) => (
                <li key={audience.id}>
                  <LineIcon name={audienceIcons[audience.id]} size={26} />
                  <div>
                    <h3>{audience.title}</h3>
                    <p>{audience.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="whitepaper-download container-wide"
          aria-labelledby="whitepaper-download-title"
        >
          {/* The board offers "PDF • 28 MB • 42 Pages" behind a download
              button. There is no file. The panel says so and offers the only
              real action there is. */}
          <MotionReveal className="whitepaper-download__panel">
            <div className="whitepaper-download__copy">
              <h2 id="whitepaper-download-title">{downloadPanel.title}</h2>
              <p>{downloadPanel.description}</p>
              <p className="whitepaper-download__status">
                <LineIcon name="lock-clock" size={22} />
                <span>{downloadPanel.status}</span>
              </p>
              <p className="whitepaper-download__note">
                {downloadPanel.statusNote}
              </p>
              <div className="whitepaper-download__actions">
                <Link
                  className="button button--gold"
                  href={downloadPanel.buttonHref}
                >
                  {downloadPanel.buttonLabel}
                </Link>
                <Link
                  className="button button--outline"
                  href={downloadPanel.secondary.href}
                >
                  {downloadPanel.secondary.label}
                </Link>
              </div>
            </div>
            <ul className="whitepaper-download__covers">
              {downloadPanel.covers.map((cover) => (
                <li key={cover}>
                  <LineIcon name="check" size={18} />
                  {cover}
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="whitepaper-readnow container-wide"
          aria-labelledby="whitepaper-readnow-title"
        >
          <MotionReveal className="whitepaper-readnow__panel">
            <h2 id="whitepaper-readnow-title">{readNowPanel.title}</h2>
            <p>{readNowPanel.intro}</p>
            <ul>
              {readNowPanel.links.map((link) => (
                <li key={link.id}>
                  <Link href={link.href}>
                    {link.label}
                    <span aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="whitepaper-closing container-wide"
          aria-label="What the whitepaper stands for"
        >
          <MotionReveal>
            <ul className="trust-pillars whitepaper-closing__grid">
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
