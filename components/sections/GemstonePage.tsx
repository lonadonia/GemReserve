import Image from "next/image";
import Link from "next/link";

import { MarketTrend } from "@/components/diagrams/MarketTrend";
import { LineIcon, type IconName } from "@/components/icons/LineIcon";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ImageWithGlow } from "@/components/ui/ImageWithGlow";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { ResponsiveHeroImage } from "@/components/ui/ResponsiveHeroImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionPlate } from "@/components/ui/SectionPlate";
import type { GemstonePageContent } from "@/content/gemstone-page";

/**
 * One layout for every single-gemstone page.
 *
 * The two boards order their sections differently and neither carries all of
 * them, so each section renders only when its content is present. That is what
 * lets Aquamarine lead with a spec table and an origin map while Emerald leads
 * with an at-a-glance strip and prose, without either page being written twice.
 */

const highlightIcons: Record<string, IconName> = {
  // Aquamarine's hero card
  natural: "diamond",
  hardness: "hand-gem",
  brilliance: "source",
  rarity: "mountain",
  demand: "chart",
  // Emerald's hero card
  custody: "shield-check",
  authenticated: "certificate",
  tokenized: "cubes",
  liquidity: "globe",
};

// The assurance strip and the at-a-glance row carry cut-out plates rendered in
// the stone's own accent metal rather than gold, so each section keeps the
// colour it already had. Only Aquamarine has an assurance strip, so these plate
// names are its own.
const assurancePlates: Record<string, string> = {
  backed: "An open aquamarine-blue hand holding a faceted gemstone",
  verified: "An aquamarine-blue shield bearing a check mark",
  borderless: "An aquamarine-blue globe encircled by an orbiting ring",
  vaulted: "A closed aquamarine-blue padlock",
  transparent: "A lattice of aquamarine-blue cubes joined by rods",
};

const investmentIcons: Record<string, IconName> = {
  // Aquamarine
  timeless: "diamond",
  supply: "mountain",
  demand: "chart",
  diversifier: "cubes",
  tangible: "hand-gem",
  // Emerald
  scarcity: "mountain",
  appreciation: "chart",
  fractional: "users",
  // Peridot
  abundance: "diamond",
  attractive: "eye",
  affordable: "hand-gem",
  durable: "shield-check",
  "global-demand": "chart",
  // Ruby
  extreme: "mountain",
  "strong-demand": "chart",
  "value-appreciation": "chart",
  // Tourmaline
  diverse: "diamond",
  "rarity-uniqueness": "eye",
  // Natural raw Charoite
  "limited-supply": "mountain",
  "unique-beauty": "eye",
  versatile: "hand-gem",
  "asset-appreciation": "chart",
  // Natural rough Alexandrite
  "natural-untreated": "diamond",
  extraordinary: "mountain",
  "color-change": "eye",
  "global-appeal": "globe",
  "growing-demand": "chart",
  "unique-timeless": "eye",
  "strong-durable": "shield-check",
  "unique-diverse": "eye",
  "wide-use": "hand-gem",
  "long-term-value": "chart",
  "extremely-rare": "mountain",
  "high-demand": "chart",
  "rare-valuable": "diamond",
  uniqueness: "eye",
  "vibrant-unique": "eye",
  "strong-market-demand": "chart",
  "appreciating-asset": "chart",
};

const qualityIcons: Record<string, IconName> = {
  colour: "diamond",
  clarity: "eye",
  cut: "hand-gem",
  carat: "chart",
  origin: "mountain",
  transparency: "eye",
  texture: "source",
  "crystal-form": "diamond",
  "cut-shape": "hand-gem",
};

const featureIcons: Record<string, IconName> = {
  custody: "vault",
  passport: "passport",
  access: "globe",
  redemption: "box",
};

const trustIcons: Record<string, IconName> = {
  transparent: "eye",
  secure: "lock",
  trusted: "diamond",
  accessible: "globe",
  support: "users",
};

// The sculpted at-a-glance vocabulary is shared; each page recolors the plates
// through its gemstone accent tokens.
const glancePlates: Record<string, { name: string; alt: string }> = {
  type: { name: "glance-type", alt: "A sculpted faceted gemstone" },
  colour: { name: "glance-colour", alt: "A sculpted artist's palette" },
  origin: { name: "glance-origin", alt: "A sculpted mountain range" },
  crystal: {
    name: "glance-hardness",
    alt: "A sculpted gemstone crystal",
  },
  hardness: {
    name: "glance-hardness",
    alt: "A sculpted crystal under a chisel tip",
  },
  clarity: {
    name: "glance-clarity",
    alt: "A sculpted magnifying glass over a gemstone",
  },
  certification: {
    name: "glance-certification",
    alt: "A sculpted award rosette bearing a check mark",
  },
  quality: {
    name: "glance-certification",
    alt: "A sculpted quality award rosette",
  },
};

export function GemstonePage({ gem }: { readonly gem: GemstonePageContent }) {
  const breadcrumbItems = [
    { label: gem.breadcrumb[0], href: "/" },
    { label: gem.breadcrumb[1], href: "/assets" },
    { label: gem.breadcrumb[2], href: "/gemstone-programs" },
    { label: gem.breadcrumb[3] },
  ];

  return (
    <div className={`gem-page gem-page--${gem.accent}`}>
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section className="hero gem-hero" aria-labelledby="gem-hero-title">
          <div className="hero__media" aria-hidden="true">
            <ResponsiveHeroImage
              desktopBase={gem.heroBase}
              mobileBase={`${gem.heroBase}-mobile`}
            />
            <span className="hero__scrim gem-hero__scrim" />
          </div>

          <div className="hero__inner gem-hero__inner container-wide">
            <MotionReveal className="hero__copy gem-hero__copy">
              <Breadcrumbs items={breadcrumbItems} />
              <h1 className="hero__title gem-hero__title" id="gem-hero-title">
                {gem.title}
              </h1>
              <p className="gem-hero__tagline">
                {gem.tagline.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>
              <p className="hero__description">{gem.description}</p>

              {gem.promise ? (
                <aside className="gem-promise">
                  <Image
                    className="hero-callout__crest"
                    src="/brand/gemreserve-shield-512.png"
                    alt=""
                    width={512}
                    height={622}
                    aria-hidden="true"
                  />
                  <div>
                    <h2>{gem.promise.title}</h2>
                    <p>{gem.promise.description}</p>
                  </div>
                </aside>
              ) : null}
            </MotionReveal>

            {gem.heroComparisons ? (
              <MotionReveal className="gem-hero__comparisons" delay={80}>
                {gem.heroComparisons.map((item) => (
                  <figure key={item.label}>
                    <figcaption>{item.label}</figcaption>
                    <Image
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      width={620}
                      height={620}
                      sizes="(max-width: 760px) 42vw, 220px"
                    />
                  </figure>
                ))}
              </MotionReveal>
            ) : null}

            <MotionReveal className="gem-highlights" delay={120}>
              <aside
                aria-labelledby={
                  gem.highlightsTitle ? "gem-highlights-title" : undefined
                }
                aria-label={
                  gem.highlightsTitle
                    ? undefined
                    : `${gem.breadcrumb[3]} at a glance`
                }
              >
                {gem.highlightsTitle ? (
                  <h2 id="gem-highlights-title">{gem.highlightsTitle}</h2>
                ) : null}
                <ul>
                  {gem.highlights.map((item) => (
                    <li key={item.id}>
                      <LineIcon name={highlightIcons[item.id]} size={24} />
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </aside>
            </MotionReveal>
          </div>
        </section>

        {gem.assurances.length ? (
          <section
            className="gem-assurances container-wide"
            aria-label={`What every ${gem.breadcrumb[3]} asset guarantees`}
          >
            <MotionReveal>
              <ul className="trust-pillars gem-assurances__grid">
                {gem.assurances.map((item) => (
                  <li key={item.id}>
                    <SectionPlate
                      name={`aq-${item.id}`}
                      alt={assurancePlates[item.id]}
                      sizes="(max-width: 760px) 84px, (max-width: 1330px) 62px, 72px"
                    />
                    <h2>{item.title}</h2>
                    <p>{item.description}</p>
                  </li>
                ))}
              </ul>
            </MotionReveal>
          </section>
        ) : null}

        {gem.glance ? (
          <section
            className="gem-glance container-wide"
            aria-labelledby="gem-glance-title"
          >
            <MotionReveal>
              <SectionHeading title={gem.glance.title} id="gem-glance-title" />
            </MotionReveal>
            <MotionReveal delay={80}>
              <dl
                className={`gem-glance__row gem-glance__row--${gem.glance.items.length}`}
              >
                {gem.glance.items.map((item) => {
                  const plate = glancePlates[item.id];
                  return (
                    <div key={item.id}>
                      <SectionPlate
                        name={plate.name}
                        alt={plate.alt}
                        sizes="(max-width: 760px) 84px, (max-width: 1330px) 62px, 72px"
                      />
                      <dt>{item.label}</dt>
                      <dd>
                        {item.value}
                        {item.note ? <span>{item.note}</span> : null}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </MotionReveal>
          </section>
        ) : null}

        {gem.details || gem.origin ? (
          <section
            className="gem-detail container-wide"
            aria-label={`${gem.breadcrumb[3]} details and provenance`}
          >
            {gem.details ? (
              <MotionReveal className="gem-card">
                <h2 className="gem-card__title">{gem.details.title}</h2>
                <div className="gem-details">
                  <dl>
                    {gem.details.facts.map((fact) => (
                      <div key={fact.id}>
                        <dt>{fact.label}</dt>
                        <dd>{fact.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="gem-details__visual">
                    <Image
                      src={gem.details.imageSrc}
                      alt={gem.details.imageAlt}
                      width={560}
                      height={560}
                      sizes="(max-width: 980px) 46vw, 250px"
                    />
                    <span
                      className="button button--outline button--small"
                      aria-hidden="true"
                    >
                      {gem.details.imageActionLabel}
                    </span>
                  </div>
                </div>
              </MotionReveal>
            ) : null}

            {gem.origin ? (
              <MotionReveal className="gem-card" delay={70}>
                <h2 className="gem-card__title">{gem.origin.title}</h2>
                <p className="gem-card__intro">{gem.origin.description}</p>
                <Image
                  className="gem-origin__map"
                  src={gem.origin.mapSrc}
                  alt={gem.origin.mapAlt}
                  width={1200}
                  height={620}
                  sizes="(max-width: 1330px) 90vw, 44vw"
                />
                <ul className="gem-origin__pins">
                  {gem.origin.pins.map((pin) => (
                    <li key={pin.id}>
                      <LineIcon name="mountain" size={18} />
                      <div>
                        <strong>{pin.country}</strong>
                        <span>{pin.region}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="gem-origin__note">
                  <LineIcon name="diamond" size={17} />
                  {gem.origin.note}
                </p>
              </MotionReveal>
            ) : null}
          </section>
        ) : null}

        <section
          className="gem-story container-wide"
          aria-label={`About ${gem.breadcrumb[3]}`}
        >
          {gem.about ? (
            <MotionReveal className="gem-card gem-about">
              <h2 className="gem-card__title">{gem.about.title}</h2>
              {gem.about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <Image
                className="gem-about__crystal"
                src={gem.about.imageSrc}
                alt={gem.about.imageAlt}
                width={620}
                height={620}
                sizes="(max-width: 980px) 50vw, 210px"
              />
            </MotionReveal>
          ) : null}

          <MotionReveal className="gem-card" delay={70}>
            <h2 className="gem-card__title">{gem.investment.title}</h2>
            <ul className="gem-list">
              {gem.investment.items.map((item) => (
                <li key={item.id}>
                  <LineIcon name={investmentIcons[item.id]} size={24} />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </MotionReveal>

          {gem.quality ? (
            <MotionReveal className="gem-card" delay={140}>
              <h2 className="gem-card__title">{gem.quality.title}</h2>
              <ul className="gem-list">
                {gem.quality.items.map((item) => (
                  <li key={item.id}>
                    <LineIcon name={qualityIcons[item.id]} size={24} />
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </MotionReveal>
          ) : null}

          {gem.sample ? (
            <MotionReveal className="gem-card" delay={140}>
              <h2 className="gem-card__title">{gem.sample.title}</h2>
              <p className="eyebrow gem-card__sample">{gem.sample.note}</p>
              <dl className="gem-sample">
                {gem.sample.facts.map((fact) => (
                  <div key={fact.id}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </MotionReveal>
          ) : null}

          {gem.certificate ? (
            <MotionReveal className="gem-card gem-certificate" delay={210}>
              <h2 className="gem-card__title">{gem.certificate.title}</h2>
              <p className="gem-card__intro">{gem.certificate.description}</p>
              <Image
                src={gem.certificate.imageSrc}
                alt={gem.certificate.imageAlt}
                width={660}
                height={1133}
                sizes="(max-width: 980px) 34vw, 150px"
              />
              <span
                className="button button--outline button--small"
                aria-hidden="true"
              >
                {gem.certificate.actionLabel}
              </span>
            </MotionReveal>
          ) : null}
        </section>

        {gem.gallery ? (
          <section
            className="gem-gallery container-wide"
            aria-labelledby="gem-gallery-title"
          >
            <MotionReveal>
              <SectionHeading
                title={gem.gallery.title}
                id="gem-gallery-title"
              />
            </MotionReveal>
            <MotionReveal delay={80}>
              <ul className="gem-gallery__grid">
                {gem.gallery.items.map((item) => (
                  <li key={item.id}>
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={620}
                      height={620}
                      sizes="(max-width: 760px) 44vw, (max-width: 1330px) 30vw, 15vw"
                    />
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            </MotionReveal>
          </section>
        ) : null}

        {gem.custody || gem.process || gem.market ? (
          <section
            className="gem-close container-wide"
            aria-label="Custody, tokenization and market"
          >
            {gem.custody ? (
              <MotionReveal className="gem-card gem-custody">
                <h2 className="gem-card__title">{gem.custody.title}</h2>
                <p className="gem-card__intro">{gem.custody.intro}</p>
                <ul className="gem-checks">
                  {gem.custody.items.map((item) => (
                    <li key={item}>
                      <LineIcon name="check" size={16} />
                      {item}
                    </li>
                  ))}
                </ul>
                <ImageWithGlow
                  className="gem-custody__image"
                  src={gem.custody.imageSrc}
                  alt={gem.custody.imageAlt}
                  sizes="(max-width: 1330px) 90vw, 30vw"
                />
              </MotionReveal>
            ) : null}

            {gem.process ? (
              <MotionReveal className="gem-card" delay={70}>
                <h2 className="gem-card__title">{gem.process.title}</h2>
                <ol className="gem-ladder">
                  {gem.process.steps.map((step) => (
                    <li key={step.id}>
                      <span aria-hidden="true">{step.step}</span>
                      <div>
                        <h3>{step.title}</h3>
                        <p>{step.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </MotionReveal>
            ) : null}

            {gem.market ? (
              <MotionReveal className="gem-card" delay={140}>
                <h2 className="gem-card__title">{gem.market.title}</h2>
                <p className="gem-card__intro">{gem.market.description}</p>
                <MarketTrend
                  points={gem.market.points}
                  projectedFrom={gem.market.projectedFrom}
                  caption={gem.market.caption}
                  label={`${gem.breadcrumb[3]} market trend, ${gem.market.points[0].year} to ${gem.market.points.at(-1)?.year}`}
                />
              </MotionReveal>
            ) : null}
          </section>
        ) : null}

        {gem.features ? (
          <section
            className="gem-features container-wide"
            aria-label="How the programme works"
          >
            <MotionReveal>
              <ul className="trust-pillars gem-features__grid">
                {gem.features.map((item) => (
                  <li key={item.id}>
                    <LineIcon name={featureIcons[item.id]} size={32} />
                    <h2>{item.title}</h2>
                    <p>{item.description}</p>
                  </li>
                ))}
              </ul>
            </MotionReveal>
          </section>
        ) : null}

        <section
          className="trust-cta gem-cta container-wide"
          aria-labelledby="gem-cta-title"
        >
          <MotionReveal className="trust-cta__visual">
            <ImageWithGlow
              className="trust-cta__image"
              src={gem.cta.imageSrc}
              alt={gem.cta.imageAlt}
              sizes="(max-width: 760px) 100vw, 28vw"
            />
          </MotionReveal>

          <MotionReveal className="trust-cta__copy" delay={70}>
            <h2 id="gem-cta-title">{gem.cta.title}</h2>
            <p>{gem.cta.description}</p>
          </MotionReveal>

          <MotionReveal className="trust-cta__action" delay={130}>
            <Link className="button button--gold" href="/#waitlist">
              {gem.cta.buttonLabel}
            </Link>
            <p>{gem.cta.supportingText}</p>
          </MotionReveal>
        </section>

        {gem.trust ? (
          <section
            className="gem-trust container-wide"
            aria-label="Why GemReserve"
          >
            <MotionReveal>
              <ul className="trust-pillars gem-trust__grid">
                {gem.trust.map((item) => (
                  <li key={item.id}>
                    <LineIcon name={trustIcons[item.id]} size={32} />
                    <h2>{item.title}</h2>
                    <p>{item.description}</p>
                  </li>
                ))}
              </ul>
            </MotionReveal>
          </section>
        ) : null}
      </main>

      <SiteFooter />
    </div>
  );
}
