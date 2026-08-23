import { company } from "./company";

export interface ContactHeroContent {
  breadcrumb: readonly [string, string, string];
  titleLines: readonly [string, string];
  eyebrow: string;
  description: string;
}

export const contactHero: ContactHeroContent = {
  breadcrumb: ["Home", "Company", "Contact Gem Reserve"],
  titleLines: ["Contact", "GemReserve.io"],
  eyebrow: "WE ARE HERE TO CONNECT",
  description:
    "Whether you are an investor, partner, media representative or interested in our platform, our team is ready to assist you with professionalism, discretion and speed.",
};

export interface ContactChannel {
  id: string;
  label: string;
  value: string;
  href: string;
  caption: string;
}

export const getInTouchTitle = "GET IN TOUCH";

/**
 * Every address, number and mailbox below is transcribed from the client's own
 * contact board. None of it is invented, and none of it has been verified as
 * live — it is the client's to confirm before launch.
 */
export const contactChannels: readonly ContactChannel[] = [
  {
    id: "email",
    label: "EMAIL",
    value: "info@gemreserve.io",
    href: "mailto:info@gemreserve.io",
    caption: "We aim to respond within 24 hours.",
  },
  {
    id: "secure",
    label: "SECURE INQUIRIES",
    value: "investor-relations@gemreserve.io",
    href: "mailto:investor-relations@gemreserve.io",
    caption: "For institutional and investor relations.",
  },
  {
    id: "media",
    label: "MEDIA INQUIRIES",
    value: "media@gemreserve.io",
    href: "mailto:media@gemreserve.io",
    caption: "For press and media related requests.",
  },
  {
    id: "partnerships",
    label: "PARTNERSHIP INQUIRIES",
    value: "partnerships@gemreserve.io",
    href: "mailto:partnerships@gemreserve.io",
    caption: "For strategic and business partnerships.",
  },
];

export const privacyNote = {
  title: "YOUR PRIVACY MATTERS",
  body: "All communications with GemReserve.io are treated with the highest level of confidentiality. We respect your privacy and do not share your information with third parties.",
};

export const messageFormTitle = "SEND US A MESSAGE";

export const messageFormIntro =
  "Fill out the form below and a member of our team will contact you.";

/** The board draws Subject as a select with a "Please select a subject" prompt. */
export const messageSubjects: readonly string[] = [
  "General enquiry",
  "Investor relations",
  "Media enquiry",
  "Partnership enquiry",
  "Platform support",
];

export interface Office {
  id: string;
  name: string;
  addressLines: readonly string[];
  /** Registered entity and company code, shown for the registered office only. */
  registration?: string;
  /** Regional offices publish a number; the registered office does not yet. */
  phone?: string;
  phoneHref?: string;
  email: string;
}

export const officesTitle = "OUR GLOBAL OFFICES";

export const offices: readonly Office[] = [
  {
    id: "lithuania",
    name: "LITHUANIA HEADQUARTERS",
    addressLines: [...company.addressLines],
    registration: `${company.legalName} · ${company.companyCodeLabel} ${company.companyCode}`,
    email: "info@gemreserve.io",
  },
  {
    id: "asia",
    name: "ASIA OFFICE",
    addressLines: [
      "8 Marina Boulevard",
      "#05-02 Marina Bay Financial Centre",
      "Singapore 018981",
    ],
    phone: "+65 6733 4105",
    phoneHref: "tel:+6567334105",
    email: "asia@gemreserve.io",
  },
  {
    id: "americas",
    name: "AMERICAS OFFICE",
    addressLines: [
      "1221 Avenue of the Americas",
      "New York, NY 10020",
      "United States",
    ],
    phone: "+1 212 884 7180",
    phoneHref: "tel:+12128847180",
    email: "americas@gemreserve.io",
  },
];

export interface JurisdictionBand {
  titleLines: readonly [string, string];
  description: string;
  marks: readonly { id: string; title: string; caption: string }[];
}

export const jurisdictionBand: JurisdictionBand = {
  titleLines: ["BUILT IN LITHUANIA.", "SERVING THE WORLD."],
  description:
    "GemReserve.io is operated by a Lithuanian company dedicated to building a transparent, secure and efficient ecosystem for the ownership, trading and redemption of the world's most exquisite gemstones through blockchain technology and institutional grade infrastructure.",
  marks: [
    {
      id: "registered",
      title: "REGISTERED IN LITHUANIA",
      caption: `${company.legalName}, ${company.city}`,
    },
    {
      id: "institutional",
      title: "INSTITUTIONAL GRADE",
      caption: "Built for investors, by experts",
    },
    {
      id: "global",
      title: "GLOBAL REACH",
      caption: "Serving clients and partners worldwide",
    },
    {
      id: "compliant",
      title: "SECURE & COMPLIANT",
      caption: "Regulated, audited and transparent",
    },
  ],
};

export const jurisdictionImageAlt =
  "The Lithuanian flag before Trakai Island Castle at sunset";

export const contactHeroImageAlt =
  "The GemReserve crest beside loose gemstones, a notebook and a pen on dark slate";
