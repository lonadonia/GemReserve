/**
 * Documents — transcribed from the client's supplied board.
 *
 * The board draws a document library: six category cards, six featured
 * documents each with a file type, a file size and a DOWNLOAD button, and a row
 * of six onward links. There are no PDFs on this site. There is no whitepaper
 * file, no investor deck, no signed policy — a search of the whole server found
 * none, and none has been supplied.
 *
 * A download button with nothing behind it is worse than no button: it says the
 * document exists. So the six featured documents keep their titles, their
 * descriptions and their covers, and each carries its real status instead of a
 * file size. The board itself already labels one of them "Whitepaper (In
 * Preparation)", which is the honest state of all six, and is the state they
 * are all given. The file sizes on the board — 4.8 MB, 6.2 MB, 3.7 MB, 1.9 MB,
 * 2.1 MB, 1.6 MB — describe files that do not exist and are dropped entirely.
 *
 * What the site does publish is pages, and several of them cover the same
 * ground as the documents in preparation. Those are listed in their own section
 * as what is readable today, so a reader who came here for the KYC position or
 * the risk position leaves with it rather than with a promise.
 */

export interface DocumentsHeroContent {
  readonly breadcrumb: readonly [string, string];
  readonly title: string;
  readonly tagline: string;
  readonly description: string;
  readonly callout: {
    readonly title: string;
    readonly lines: readonly [string, string];
  };
}

export const documentsHero: DocumentsHeroContent = {
  breadcrumb: ["Home", "Documents"],
  title: "DOCUMENTS",
  tagline: "Transparency Through Documentation.",
  description:
    "Official documents, reports, legal frameworks and technical material about GemReserve.io and the platform. What is published is here; what is being written says so.",
  callout: {
    title: "REAL ASSETS. REAL VALUE. REAL TRUST.",
    lines: [
      "Our documentation reflects our commitment to",
      "transparency, compliance and long-term value.",
    ],
  },
};

export interface DocumentCategory {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export const categoriesSectionTitle = "EXPLORE OUR DOCUMENTS";

export const documentCategories: readonly DocumentCategory[] = [
  {
    id: "company",
    title: "COMPANY & PLATFORM",
    description: "GemReserve.io, our mission, the platform and the technology.",
  },
  {
    id: "legal",
    title: "LEGAL & COMPLIANCE",
    description: "Regulatory frameworks, policies and compliance documents.",
  },
  {
    id: "programs",
    title: "ASSET PROGRAMS",
    description: "Detail on our gemstone and real asset programs.",
  },
  {
    id: "research",
    title: "REPORTS & RESEARCH",
    description: "Market insights, research reports and industry analysis.",
  },
  {
    id: "whitepapers",
    title: "WHITEPAPERS",
    description: "In-depth papers covering our vision, technology and roadmap.",
  },
  {
    id: "forms",
    title: "FORMS & TEMPLATES",
    description: "Forms, templates and procedural documents.",
  },
];

export interface LibraryDocument {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly image: string;
  readonly imageAlt: string;
  readonly status: string;
  readonly related?: { readonly label: string; readonly href: string };
}

export const librarySectionTitle = "THE DOCUMENT LIBRARY";

export const libraryIntro =
  "Six documents are in preparation. None is downloadable yet, and none is presented as if it were — no file size, no page count, no button. Where a page on this site already covers the same ground, it is linked.";

export const libraryDocuments: readonly LibraryDocument[] = [
  {
    id: "whitepaper",
    title: "Whitepaper",
    description:
      "Our vision, platform architecture and the future of gemstone asset tokenization.",
    image: "doc-whitepaper",
    imageAlt: "A dark bound cover embossed with a fine gold globe",
    status: "In preparation",
    related: { label: "Read the whitepaper page", href: "/whitepaper" },
  },
  {
    id: "investor",
    title: "Investor Presentation",
    description: "An overview of the opportunity, market and growth strategy.",
    image: "doc-investor",
    imageAlt: "A dark document cover beside a globe and faceted stones",
    status: "In preparation",
    related: { label: "Read the investor presentation", href: "/investors" },
  },
  {
    id: "tokenization",
    title: "Tokenization Framework",
    description:
      "The technical framework for asset tokenization, issuance and lifecycle management.",
    image: "doc-tokenization",
    imageAlt: "A deep green cover marked with a single gold cube outline",
    status: "In preparation",
    related: {
      label: "Read how tokenization works",
      href: "/gemstone-tokenization",
    },
  },
  {
    id: "kyc",
    title: "KYC/AML Policy",
    description:
      "Our approach to Know Your Customer and Anti-Money Laundering obligations.",
    image: "doc-kyc",
    imageAlt: "Brass scales standing in front of a dark bound volume",
    status: "In preparation",
    related: {
      label: "Read the eligibility and KYC page",
      href: "/eligibility-kyc",
    },
  },
  {
    id: "privacy",
    title: "Privacy & Data Protection Policy",
    description:
      "How personal data is collected, used and protected under applicable law.",
    image: "doc-privacy",
    imageAlt: "A brass padlock on a dark cover traced with gold constellations",
    status: "In preparation",
  },
  {
    id: "terms",
    title: "Terms of Use",
    description:
      "The terms and conditions for using the GemReserve.io platform and services.",
    image: "doc-terms",
    imageAlt: "A brilliant-cut diamond beside a dark bound cover",
    status: "In preparation",
  },
];

export const preparationNote =
  "The Terms of Use and the Privacy Policy are published before any account can be opened or any participation can begin. Nothing on this site asks a visitor to agree to a document that has not been published.";

export interface PublishedPage {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly href: string;
}

export const publishedPanel = {
  title: "PUBLISHED AND READABLE NOW",
  intro:
    "These are not summaries of documents to come. They are the platform's current published positions, in force as written.",
  pages: [
    {
      id: "risk",
      title: "Risk Disclosure",
      description:
        "The risks of holding tokenized gemstone assets, set out in full.",
      href: "/risk-disclosure",
    },
    {
      id: "fraud",
      title: "Anti-Fraud Notice",
      description:
        "Our official channels, and how to tell an impersonation from us.",
      href: "/anti-fraud-notice",
    },
    {
      id: "restricted",
      title: "Restricted Jurisdictions",
      description: "Where participation is not available, and why.",
      href: "/restricted-jurisdictions",
    },
    {
      id: "eligibility",
      title: "Eligibility & KYC",
      description: "Who can take part and what verification involves.",
      href: "/eligibility-kyc",
    },
    {
      id: "governance",
      title: "Governance",
      description: "The governance model, principles and decision rights.",
      href: "/governance",
    },
    {
      id: "discount",
      title: "20% Discount Methodology",
      description: "How the early participation discount is calculated.",
      href: "/discount-methodology",
    },
  ] as const satisfies readonly PublishedPage[],
};

export interface AdditionalResource {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly actionLabel: string;
}

export const additionalPanel = {
  title: "ADDITIONAL RESOURCES",
  resources: [
    {
      id: "education",
      title: "EDUCATION CENTER",
      description:
        "Guides and explanations to help you understand the platform.",
      href: "/how-it-works",
      actionLabel: "Visit education centre",
    },
    {
      id: "resources",
      title: "RESOURCE HUB",
      description: "Everything published, grouped by subject.",
      href: "/resources",
      actionLabel: "Open the hub",
    },
    {
      id: "news",
      title: "NEWS & PRESS",
      description: "Announcements and media coverage of GemReserve.io.",
      href: "/news",
      actionLabel: "View news",
    },
    {
      id: "registry",
      title: "ASSET REGISTRY",
      description: "The public record of verified, tokenized gemstones.",
      href: "/asset-registry",
      actionLabel: "Open the registry",
    },
    {
      id: "enterprise",
      title: "ENTERPRISE",
      description:
        "Tokenization services for owners, originators and institutions.",
      href: "/enterprise",
      actionLabel: "View enterprise",
    },
    {
      id: "faq",
      title: "FAQS",
      description:
        "Answers to common questions about the platform and its services.",
      href: "/faq",
      actionLabel: "View FAQs",
    },
  ] as const satisfies readonly AdditionalResource[],
};

export const documentsCta = {
  title: "CAN'T FIND WHAT YOU'RE LOOKING FOR?",
  description: "Our team is here to help you find the information you need.",
  buttonLabel: "Contact us",
  href: "/contact",
  imageAlt: "A headset resting on a dark desk beside a laptop",
};
