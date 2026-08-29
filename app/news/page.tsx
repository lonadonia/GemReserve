import type { Metadata } from "next";
import Link from "next/link";

import { LineIcon, type IconName } from "@/components/icons/LineIcon";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { ResponsiveHeroImage } from "@/components/ui/ResponsiveHeroImage";
import { WaitlistForm } from "@/components/ui/WaitlistForm";
import {
  allUpdatesLabel,
  articleColumn,
  categoriesSectionTitle,
  followPanel,
  highlightsPanel,
  mediaPanel,
  newsCategories,
  newsHero,
  newsroomState,
  subscribePanel,
} from "@/content/news";

export const metadata: Metadata = {
  title: "News & Announcements",
  description: newsHero.description,
  alternates: { canonical: "/news" },
  openGraph: {
    title: "News & Announcements | GemReserve.io",
    description: newsHero.description,
    url: "/news",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const breadcrumbItems = [
  { label: newsHero.breadcrumb[0], href: "/" },
  { label: newsHero.breadcrumb[1], href: "/about" },
  { label: newsHero.breadcrumb[2] },
] as const;

const categoryIcons: Record<string, IconName> = {
  corporate: "building",
  partnerships: "handshake",
  platform: "cubes",
  milestones: "award",
  press: "contract",
  reserves: "shield-check",
};

const highlightIcons: Record<string, IconName> = {
  corporate: "chart",
  registry: "passport",
  reserves: "shield-check",
  roadmap: "rocket",
};

export default function NewsPage() {
  return (
    <div className="news-page">
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section className="hero news-hero" aria-labelledby="news-hero-title">
          <div className="hero__media" aria-hidden="true">
            <ResponsiveHeroImage
              desktopBase="/images/heroes/news-hero"
              mobileBase="/images/heroes/news-hero-mobile"
            />
            <span className="hero__scrim news-hero__scrim" />
          </div>

          <div className="hero__inner container-wide">
            <MotionReveal className="hero__copy">
              <Breadcrumbs items={breadcrumbItems} />
              <h1 className="hero__title" id="news-hero-title">
                <span>{newsHero.titleLines[0]}</span>
                <span className="hero__title-accent">
                  {newsHero.titleLines[1]}
                </span>
              </h1>
              <p className="hero__description">{newsHero.description}</p>
            </MotionReveal>
          </div>
        </section>

        <section
          className="news-categories container-wide"
          aria-labelledby="news-categories-title"
        >
          {/* The board runs a filter rail of category pills directly beneath
              the hero. None of them filters anything, because there is nothing
              to filter, so each is a marker of what the rail will carry rather
              than a control that would do nothing when pressed. */}
          <h2 className="sr-only" id="news-categories-title">
            {categoriesSectionTitle}
          </h2>
          <MotionReveal>
            <ul className="news-rail-filters">
              <li className="news-rail-filters__all">
                <LineIcon name="bars" size={18} />
                {allUpdatesLabel}
              </li>
              {newsCategories.map((category) => (
                <li key={category.id} title={category.description}>
                  <LineIcon name={categoryIcons[category.id]} size={18} />
                  {category.title}
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="news-body container-wide"
          aria-labelledby="news-state-title"
        >
          {/* The board's editorial column, kept as a composition with nothing
              in it: a featured entry over two standard ones, each carrying the
              shape of an article and no content. Inventing a date, a headline
              or an image here is the one thing a newsroom must not do. */}
          <MotionReveal className="news-articles">
            <ol>
              {articleColumn.slots.map((slot, index) => (
                <li
                  className={
                    slot.featured
                      ? "news-entry news-entry--featured"
                      : "news-entry"
                  }
                  key={slot.id}
                >
                  <div className="news-entry__media" aria-hidden="true">
                    {slot.featured ? (
                      <span className="news-entry__flag">
                        {articleColumn.featuredBadge}
                      </span>
                    ) : null}
                  </div>
                  <div className="news-entry__body">
                    <p className="news-entry__meta">
                      <span className="news-entry__category">
                        {slot.category}
                      </span>
                      <span className="news-entry__date" aria-hidden="true">
                        {articleColumn.datePlaceholder}
                      </span>
                    </p>
                    <p className="news-entry__headline" aria-hidden="true">
                      {articleColumn.headlinePlaceholder}
                    </p>
                    <p className="news-entry__standfirst" aria-hidden="true">
                      {articleColumn.standfirstPlaceholder}
                    </p>
                    <p className="news-entry__empty">
                      <LineIcon name="lock-clock" size={15} />
                      {articleColumn.emptyBadge}
                    </p>
                  </div>
                  <span className="sr-only">
                    {`Entry ${index + 1}: ${articleColumn.emptyBadge}`}
                  </span>
                </li>
              ))}
            </ol>
          </MotionReveal>

          <MotionReveal className="news-state" delay={70}>
            <h2 id="news-state-title">{newsroomState.title}</h2>
            {newsroomState.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p className="news-state__note" role="note">
              <LineIcon name="alert-triangle" size={22} />
              <span>
                {newsroomState.note}{" "}
                <Link href={newsroomState.noteLink.href}>
                  {newsroomState.noteLink.label}
                </Link>
              </span>
            </p>
          </MotionReveal>

          <MotionReveal
            className="news-panel news-panel--highlights"
            delay={80}
          >
            <h2>{highlightsPanel.title}</h2>
            <ul className="news-highlights">
              {highlightsPanel.links.map((link) => (
                <li key={link.id}>
                  <Link href={link.href}>
                    <LineIcon name={highlightIcons[link.id]} size={24} />
                    <span>
                      <strong>{link.title}</strong>
                      {link.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </MotionReveal>

          <div className="news-rail">
            <MotionReveal className="news-panel" delay={140}>
              <h2>{subscribePanel.title}</h2>
              <p>{subscribePanel.description}</p>
              <WaitlistForm
                placeholder={subscribePanel.placeholder}
                buttonLabel={subscribePanel.buttonLabel}
                compact
              />
              <p className="news-panel__note">{subscribePanel.privacyNote}</p>
            </MotionReveal>

            <MotionReveal className="news-panel" delay={200}>
              <h2>{followPanel.title}</h2>
              <p>{followPanel.description}</p>
              <Link
                className="button button--outline button--small"
                href={followPanel.link.href}
              >
                {followPanel.link.label}
              </Link>
            </MotionReveal>

            <MotionReveal className="news-panel" delay={260}>
              <h2>{mediaPanel.title}</h2>
              <p>{mediaPanel.description}</p>
              <p className="news-panel__email">
                <LineIcon name="envelope" size={20} />
                <a href={`mailto:${mediaPanel.email}`}>{mediaPanel.email}</a>
              </p>
              <Link className="news-panel__link" href={mediaPanel.href}>
                {mediaPanel.linkLabel}
              </Link>
            </MotionReveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
