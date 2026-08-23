import type { Metadata } from "next";

import { LineIcon, type IconName } from "@/components/icons/LineIcon";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ContactForm } from "@/components/ui/ContactForm";
import { ImageWithGlow } from "@/components/ui/ImageWithGlow";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { ResponsiveHeroImage } from "@/components/ui/ResponsiveHeroImage";
import {
  contactChannels,
  contactHero,
  getInTouchTitle,
  messageFormIntro,
  messageFormTitle,
  messageSubjects,
  offices,
  officesTitle,
  privacyNote,
  jurisdictionBand,
} from "@/content/contact";

export const metadata: Metadata = {
  title: "Contact Us",
  description: contactHero.description,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Us | GemReserve.io",
    description: contactHero.description,
    url: "/contact",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const breadcrumbItems = [
  { label: contactHero.breadcrumb[0], href: "/" },
  { label: contactHero.breadcrumb[1] },
  { label: contactHero.breadcrumb[2] },
] as const;

const channelIcons: Record<string, IconName> = {
  email: "contract",
  secure: "lock",
  media: "globe",
  partnerships: "hand-gem",
};

const officeIcons: Record<string, IconName> = {
  lithuania: "mountain",
  asia: "box",
  americas: "globe",
};

const jurisdictionMarkIcons: Record<string, IconName> = {
  registered: "shield-check",
  institutional: "certificate",
  global: "globe",
  compliant: "lock",
};

export default function ContactPage() {
  return (
    <div className="contact-page">
      <SiteHeader showAnnouncement />

      <main id="main-content">
        <section
          className="hero contact-hero"
          aria-labelledby="contact-hero-title"
        >
          <div className="hero__media" aria-hidden="true">
            <ResponsiveHeroImage
              desktopBase="/images/heroes/contact-hero"
              mobileBase="/images/heroes/contact-hero-mobile"
            />
            <span className="hero__scrim contact-hero__scrim" />
          </div>

          <div className="hero__inner contact-hero__inner container-wide">
            <MotionReveal className="hero__copy contact-hero__copy">
              <Breadcrumbs items={breadcrumbItems} />
              <h1 className="hero__title" id="contact-hero-title">
                <span>{contactHero.titleLines[0]}</span>
                <span className="hero__title-accent">
                  {contactHero.titleLines[1]}
                </span>
              </h1>
              <span className="contact-hero__rule" aria-hidden="true" />
              <p className="contact-hero__eyebrow">{contactHero.eyebrow}</p>
              <p className="hero__description">{contactHero.description}</p>
            </MotionReveal>
          </div>
        </section>

        <section
          className="contact-body container-wide"
          aria-labelledby="contact-touch-title"
        >
          <MotionReveal className="contact-panel contact-touch">
            <h2 className="contact-panel__title" id="contact-touch-title">
              {getInTouchTitle}
            </h2>
            <ul className="contact-channels">
              {contactChannels.map((channel) => (
                <li key={channel.id}>
                  <span className="contact-channels__icon" aria-hidden="true">
                    <LineIcon name={channelIcons[channel.id]} size={24} />
                  </span>
                  <div>
                    <h3>{channel.label}</h3>
                    <a href={channel.href}>{channel.value}</a>
                    <p>{channel.caption}</p>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="contact-privacy">
              <LineIcon name="shield-check" size={30} />
              <div>
                <h3>{privacyNote.title}</h3>
                <p>{privacyNote.body}</p>
              </div>
            </aside>
          </MotionReveal>

          <div className="contact-column">
            <MotionReveal className="contact-panel" delay={70}>
              <h2 className="contact-panel__title">{messageFormTitle}</h2>
              <p className="contact-panel__intro">{messageFormIntro}</p>
              <ContactForm subjects={messageSubjects} />
            </MotionReveal>

            <MotionReveal className="contact-panel" delay={130}>
              <h2 className="contact-panel__title">{officesTitle}</h2>
              <ul className="contact-offices">
                {offices.map((office) => (
                  <li key={office.id}>
                    <LineIcon name={officeIcons[office.id]} size={34} />
                    <h3>{office.name}</h3>
                    <address>
                      {office.addressLines.map((line) => (
                        <span key={line}>{line}</span>
                      ))}
                    </address>
                    {office.registration ? (
                      <p className="contact-offices__registration">
                        {office.registration}
                      </p>
                    ) : null}
                    {office.phone && office.phoneHref ? (
                      <a href={office.phoneHref}>{office.phone}</a>
                    ) : null}
                    <a href={`mailto:${office.email}`}>{office.email}</a>
                  </li>
                ))}
              </ul>
            </MotionReveal>
          </div>
        </section>

        <section
          className="trust-cta contact-jurisdiction container-wide"
          aria-labelledby="contact-jurisdiction-title"
        >
          <MotionReveal className="trust-cta__visual">
            <ImageWithGlow
              className="trust-cta__image"
              src="/images/sections/lithuania-wide.webp"
              narrowSrc="/images/sections/lithuania-square.webp"
              alt="The Lithuanian flag before Trakai Island Castle at sunset"
              sizes="(max-width: 760px) 100vw, 30vw"
            />
          </MotionReveal>

          <MotionReveal className="trust-cta__copy" delay={70}>
            <h2 id="contact-jurisdiction-title">
              <span>{jurisdictionBand.titleLines[0]}</span>{" "}
              <span>{jurisdictionBand.titleLines[1]}</span>
            </h2>
            <p>{jurisdictionBand.description}</p>
          </MotionReveal>

          <MotionReveal className="contact-jurisdiction__marks" delay={130}>
            <ul>
              {jurisdictionBand.marks.map((mark) => (
                <li key={mark.id}>
                  <LineIcon name={jurisdictionMarkIcons[mark.id]} size={26} />
                  <div>
                    <h3>{mark.title}</h3>
                    <p>{mark.caption}</p>
                  </div>
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
