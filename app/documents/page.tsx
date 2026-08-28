import type { Metadata } from "next";
import Image from "next/image";
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
  additionalPanel,
  categoriesSectionTitle,
  documentCategories,
  documentsCta,
  documentsHero,
  libraryDocuments,
  libraryIntro,
  librarySectionTitle,
  preparationNote,
  publishedPanel,
} from "@/content/documents";

export const metadata: Metadata = {
  title: "Documents",
  description: documentsHero.description,
  alternates: { canonical: "/documents" },
  openGraph: {
    title: "Documents | GemReserve.io",
    description: documentsHero.description,
    url: "/documents",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const breadcrumbItems = [
  { label: documentsHero.breadcrumb[0], href: "/" },
  { label: documentsHero.breadcrumb[1] },
] as const;

const categoryIcons: Record<string, IconName> = {
  company: "building",
  legal: "scales",
  programs: "diamond",
  research: "chart",
  whitepapers: "contract",
  forms: "clipboard-check",
};

const publishedIcons: Record<string, IconName> = {
  risk: "alert-triangle",
  fraud: "shield-check",
  restricted: "ban",
  eligibility: "user-check",
  governance: "users",
  discount: "ticket-percent",
};

const additionalIcons: Record<string, IconName> = {
  education: "lightbulb",
  resources: "layers",
  news: "contract",
  registry: "passport",
  enterprise: "building",
  faq: "question",
};

export default function DocumentsPage() {
  return (
    <div className="documents-page">
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section
          className="hero documents-hero"
          aria-labelledby="documents-hero-title"
        >
          <div className="hero__media" aria-hidden="true">
            <ResponsiveHeroImage
              desktopBase="/images/heroes/documents-hero"
              mobileBase="/images/heroes/documents-hero-mobile"
            />
            <span className="hero__scrim documents-hero__scrim" />
          </div>

          <div className="hero__inner container-wide">
            <MotionReveal className="hero__copy">
              <Breadcrumbs items={breadcrumbItems} />
              <h1 className="hero__title" id="documents-hero-title">
                <span className="hero__title-accent">
                  {documentsHero.title}
                </span>
              </h1>
              <p className="documents-hero__tagline">{documentsHero.tagline}</p>
              <p className="hero__description">{documentsHero.description}</p>

              <aside className="hero-callout documents-hero__callout">
                <div>
                  <p className="hero-callout__title">
                    {documentsHero.callout.title}
                  </p>
                  {documentsHero.callout.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </aside>
            </MotionReveal>
          </div>
        </section>

        <section
          className="documents-categories container-wide"
          aria-labelledby="documents-categories-title"
        >
          <MotionReveal>
            <SectionHeading
              title={categoriesSectionTitle}
              id="documents-categories-title"
            />
          </MotionReveal>
          <MotionReveal delay={80}>
            <ul className="documents-category-grid">
              {documentCategories.map((category) => (
                <li key={category.id}>
                  <LineIcon name={categoryIcons[category.id]} size={30} />
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="documents-library container-wide"
          aria-labelledby="documents-library-title"
        >
          <MotionReveal>
            <SectionHeading
              title={librarySectionTitle}
              id="documents-library-title"
            />
            <p className="documents-library__intro">{libraryIntro}</p>
          </MotionReveal>

          {/* No download button appears anywhere in this list. There are no
              files behind these titles yet, and a button that says otherwise is
              the one thing a document library must not do. */}
          <MotionReveal delay={80}>
            <ul className="documents-library__grid">
              {libraryDocuments.map((document) => (
                <li className="document-card" key={document.id}>
                  <Image
                    className="document-card__cover"
                    src={`/images/sections/${document.image}.webp`}
                    alt={document.imageAlt}
                    width={560}
                    height={700}
                    sizes="(max-width: 760px) 60vw, (max-width: 1180px) 30vw, 16vw"
                  />
                  <div className="document-card__body">
                    <h3>{document.title}</h3>
                    <p>{document.description}</p>
                    <p className="document-card__status">{document.status}</p>
                    {document.related ? (
                      <Link
                        className="document-card__link"
                        href={document.related.href}
                      >
                        {document.related.label}
                        <span aria-hidden="true">→</span>
                      </Link>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
            <p className="documents-library__note" role="note">
              <LineIcon name="alert-triangle" size={22} />
              <span>{preparationNote}</span>
            </p>
          </MotionReveal>
        </section>

        <section
          className="documents-published container-wide"
          aria-labelledby="documents-published-title"
        >
          <MotionReveal>
            <SectionHeading
              title={publishedPanel.title}
              id="documents-published-title"
            />
            <p className="documents-published__intro">{publishedPanel.intro}</p>
          </MotionReveal>
          <MotionReveal delay={80}>
            <ul className="documents-published__grid">
              {publishedPanel.pages.map((page) => (
                <li key={page.id}>
                  <Link href={page.href}>
                    <LineIcon name={publishedIcons[page.id]} size={28} />
                    <span>
                      <strong>{page.title}</strong>
                      {page.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="documents-additional container-wide"
          aria-labelledby="documents-additional-title"
        >
          <MotionReveal>
            <SectionHeading
              title={additionalPanel.title}
              id="documents-additional-title"
            />
          </MotionReveal>
          <MotionReveal delay={80}>
            <ul className="documents-additional__grid">
              {additionalPanel.resources.map((resource) => (
                <li key={resource.id}>
                  <LineIcon name={additionalIcons[resource.id]} size={30} />
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                  <Link className="resource-card__action" href={resource.href}>
                    {resource.actionLabel}
                    <span aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </section>

        <section
          className="trust-cta documents-cta container-wide"
          aria-labelledby="documents-cta-title"
        >
          <MotionReveal className="trust-cta__visual">
            <ImageWithGlow
              className="trust-cta__image"
              src="/images/sections/support-desk.webp"
              alt={documentsCta.imageAlt}
              sizes="(max-width: 980px) 100vw, 30vw"
            />
          </MotionReveal>

          <MotionReveal className="trust-cta__copy" delay={70}>
            <h2 id="documents-cta-title">{documentsCta.title}</h2>
            <p>{documentsCta.description}</p>
          </MotionReveal>

          <MotionReveal className="trust-cta__action" delay={130}>
            <Link className="button button--gold" href={documentsCta.href}>
              {documentsCta.buttonLabel}
            </Link>
          </MotionReveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
