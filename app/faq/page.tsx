import type { Metadata } from "next";
import Link from "next/link";

import { LineIcon, type IconName } from "@/components/icons/LineIcon";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { ResponsiveHeroImage } from "@/components/ui/ResponsiveHeroImage";
import {
  faqAssurances,
  faqCategories,
  faqContactCard,
  faqEntries,
  faqHelpCard,
  faqHero,
  faqHeroCallout,
  faqSearchPlaceholder,
} from "@/content/faq";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: faqHero.description,
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "Frequently Asked Questions | GemReserve.io",
    description: faqHero.description,
    url: "/faq",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const breadcrumbItems = [
  { label: faqHero.breadcrumb[0], href: "/" },
  { label: faqHero.breadcrumb[1] },
] as const;

const assuranceIcons: Record<string, IconName> = {
  transparent: "shield-check",
  secure: "lock",
  trusted: "diamond",
  global: "globe",
  support: "users",
};

export default function FaqPage() {
  return (
    <div className="faq-page">
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section className="hero faq-hero" aria-labelledby="faq-hero-title">
          <div className="hero__media" aria-hidden="true">
            <ResponsiveHeroImage
              desktopBase="/images/heroes/faq-hero"
              mobileBase="/images/heroes/faq-hero-mobile"
            />
            <span className="hero__scrim faq-hero__scrim" />
          </div>

          <div className="hero__inner faq-hero__inner container-wide">
            <MotionReveal className="hero__copy faq-hero__copy">
              <Breadcrumbs items={breadcrumbItems} />
              <h1 className="hero__title faq-hero__title" id="faq-hero-title">
                <span>{faqHero.titleLead}</span>
                <span className="hero__title-accent">
                  {faqHero.titleAccent}
                </span>
              </h1>
              <p className="faq-hero__tagline">{faqHero.tagline}</p>
              <p className="hero__description">{faqHero.description}</p>

              <aside
                className="faq-hero__callout"
                aria-labelledby="faq-hero-callout-title"
              >
                <LineIcon name="diamond" size={30} />
                <div>
                  <h2 id="faq-hero-callout-title">{faqHeroCallout.title}</h2>
                  <p>{faqHeroCallout.body}</p>
                </div>
              </aside>
            </MotionReveal>
          </div>
        </section>

        <section
          className="faq-body container-wide"
          aria-labelledby="faq-body-title"
        >
          <h2 className="sr-only" id="faq-body-title">
            Questions and answers
          </h2>

          <MotionReveal className="faq-help">
            <Link href="/contact">
              <LineIcon name="users" size={28} />
              <span>
                <strong>{faqHelpCard.title}</strong>
                {faqHelpCard.body}
              </span>
            </Link>
          </MotionReveal>

          <MotionReveal delay={70}>
            <FaqAccordion
              categories={faqCategories}
              entries={faqEntries}
              searchPlaceholder={faqSearchPlaceholder}
              railFooter={
                <div className="faq-contact">
                  <h3>{faqContactCard.title}</h3>
                  <p>{faqContactCard.body}</p>
                  <Link className="button button--outline" href="/contact">
                    {faqContactCard.actionLabel}
                  </Link>
                </div>
              }
            />
          </MotionReveal>
        </section>

        <section
          className="faq-assurance container-wide"
          aria-label="What every answer rests on"
        >
          <MotionReveal>
            <ul className="faq-assurance__row">
              {faqAssurances.map((mark) => (
                <li key={mark.id}>
                  <LineIcon name={assuranceIcons[mark.id]} size={32} />
                  <h2>{mark.title}</h2>
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
