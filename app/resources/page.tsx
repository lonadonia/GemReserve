import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { LineIcon, type IconName } from "@/components/icons/LineIcon";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { ResponsiveHeroImage } from "@/components/ui/ResponsiveHeroImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WaitlistForm } from "@/components/ui/WaitlistForm";
import {
  helpPanel,
  libraryIntro,
  libraryItems,
  librarySectionTitle,
  resourcesHero,
  subscribePanel,
  toolsPanel,
  topics,
  topicsSectionTitle,
} from "@/content/resources";

export const metadata: Metadata = {
  title: "Resources",
  description: resourcesHero.description,
  alternates: { canonical: "/resources" },
  openGraph: {
    title: "Resources | GemReserve.io",
    description: resourcesHero.description,
    url: "/resources",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const breadcrumbItems = [
  { label: resourcesHero.breadcrumb[0], href: "/" },
  { label: resourcesHero.breadcrumb[1] },
] as const;

const topicIcons: Record<string, IconName> = {
  education: "lightbulb",
  research: "chart",
  whitepapers: "contract",
  videos: "frame",
  compliance: "scales",
  downloads: "file-check",
  support: "question",
};

const toolIcons: Record<string, IconName> = {
  discount: "ticket-percent",
  tokenization: "calculator",
  roi: "pie",
};

const benefitIcons: readonly IconName[] = ["chart", "cubes", "layers", "award"];

export default function ResourcesPage() {
  return (
    <div className="resources-page">
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section
          className="hero resources-hero"
          aria-labelledby="resources-hero-title"
        >
          <div className="hero__media" aria-hidden="true">
            <ResponsiveHeroImage
              desktopBase="/images/heroes/resources-hero"
              mobileBase="/images/heroes/resources-hero-mobile"
            />
            <span className="hero__scrim resources-hero__scrim" />
          </div>

          <div className="hero__inner container-wide">
            <MotionReveal className="hero__copy">
              <Breadcrumbs items={breadcrumbItems} />
              <h1 className="hero__title" id="resources-hero-title">
                <span className="hero__title-accent">
                  {resourcesHero.title}
                </span>
              </h1>
              <p className="resources-hero__tagline">{resourcesHero.tagline}</p>
              <p className="hero__description">{resourcesHero.description}</p>

              <aside className="hero-callout resources-hero__callout">
                <div>
                  <p className="hero-callout__title">
                    {resourcesHero.callout.title}
                  </p>
                  {resourcesHero.callout.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </aside>
            </MotionReveal>
          </div>
        </section>

        <section
          className="resources-topics container-wide"
          aria-labelledby="resources-topics-title"
        >
          <MotionReveal>
            <SectionHeading
              title={topicsSectionTitle}
              id="resources-topics-title"
            />
          </MotionReveal>
          <MotionReveal delay={80}>
            <ul className="resources-topic-grid">
              {topics.map((topic) => (
                <li key={topic.id}>
                  {topic.href ? (
                    <Link href={topic.href}>
                      <LineIcon name={topicIcons[topic.id]} size={30} />
                      <h3>{topic.title}</h3>
                      <p>{topic.description}</p>
                    </Link>
                  ) : (
                    <div className="resources-topic--planned">
                      <LineIcon name={topicIcons[topic.id]} size={30} />
                      <h3>{topic.title}</h3>
                      <p>{topic.description}</p>
                      <p className="resources-status">Planned</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="resources-library container-wide"
          aria-labelledby="resources-library-title"
        >
          <MotionReveal>
            <SectionHeading
              title={librarySectionTitle}
              id="resources-library-title"
            />
            <p className="resources-library__intro">{libraryIntro}</p>
          </MotionReveal>
          <MotionReveal delay={80}>
            <ul className="resources-library__grid">
              {libraryItems.map((item) => (
                <li className="resource-card" key={item.id}>
                  <Image
                    className="resource-card__image"
                    src={`/images/sections/${item.image}.webp`}
                    alt={item.imageAlt}
                    width={640}
                    height={460}
                    sizes="(max-width: 760px) 92vw, (max-width: 1180px) 44vw, 22vw"
                  />
                  <p className="resource-card__kind">{item.kind}</p>
                  <h3>{item.title}</h3>
                  <p className="resource-card__body">{item.description}</p>
                  {item.href && item.actionLabel ? (
                    <Link className="resource-card__action" href={item.href}>
                      {item.actionLabel}
                      <span aria-hidden="true">→</span>
                    </Link>
                  ) : (
                    <p className="resources-status">Planned</p>
                  )}
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="resources-lower container-wide"
          aria-labelledby="resources-tools-title"
        >
          <MotionReveal className="resources-panel">
            <h2 id="resources-tools-title">{toolsPanel.title}</h2>
            <ul className="resources-tools">
              {toolsPanel.tools.map((tool) => (
                <li key={tool.id}>
                  <LineIcon name={toolIcons[tool.id]} size={28} />
                  <div>
                    <h3>{tool.title}</h3>
                    <p>{tool.description}</p>
                    {tool.note ? (
                      <p className="resources-tools__note">{tool.note}</p>
                    ) : null}
                  </div>
                  {tool.href && tool.actionLabel ? (
                    <Link className="resource-card__action" href={tool.href}>
                      {tool.actionLabel}
                      <span aria-hidden="true">→</span>
                    </Link>
                  ) : (
                    <p className="resources-status">Planned</p>
                  )}
                </li>
              ))}
            </ul>
          </MotionReveal>

          <MotionReveal className="resources-panel" delay={90}>
            <h2>{subscribePanel.title}</h2>
            <p className="resources-panel__intro">
              {subscribePanel.description}
            </p>
            <WaitlistForm buttonLabel="Subscribe" compact />
            <ul className="resources-benefits">
              {subscribePanel.benefits.map((benefit, index) => (
                <li key={benefit}>
                  <LineIcon
                    name={benefitIcons[index % benefitIcons.length]}
                    size={24}
                  />
                  {benefit}
                </li>
              ))}
            </ul>
            <p className="resources-panel__note">
              {subscribePanel.privacyNote}
            </p>
          </MotionReveal>
        </section>

        <section
          className="resources-help container-wide"
          aria-labelledby="resources-help-title"
        >
          <MotionReveal className="resources-help__panel">
            <LineIcon name="question" size={34} />
            <div>
              <h2 id="resources-help-title">{helpPanel.title}</h2>
              <p>{helpPanel.description}</p>
            </div>
            <Link className="button button--gold" href={helpPanel.href}>
              {helpPanel.buttonLabel}
            </Link>
          </MotionReveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
