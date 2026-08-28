/**
 * Resources — transcribed from the client's supplied board.
 *
 * The board is a hub: seven topics, a six-card featured library, three
 * calculators and a subscribe panel. The structure is kept in full. What
 * changed is that every card now leads somewhere real, and the ones that cannot
 * say so.
 *
 * The featured library's six cards were a whitepaper, an industry report titled
 * "Global Gemstone Market Outlook 2024–2030", a tokenization guide, a recorded
 * webinar, a compliance policy and a fact sheet — each with a download or watch
 * action. Four of the six correspond to material this site actually publishes
 * as pages, and those are wired to them. The industry report and the webinar do
 * not exist in any form, so they are marked as planned rather than given a
 * button that goes nowhere. There are no PDFs on this site yet; see
 * content/documents.ts, which carries the same reasoning for the document
 * library.
 *
 * The board's tools row offers a "Tokenization Value Calculator", an "ROI
 * Potential Calculator" and a "Discount Methodology Calculator". The discount
 * arithmetic is genuinely published and is linked. The other two are marked
 * planned — and the ROI one carries a note, because a tool that projects a
 * return from a pre-launch token would be the single most misleading thing this
 * site could offer, and it is worth saying why it is not here rather than
 * letting it look like an oversight.
 */

export interface ResourcesHeroContent {
  readonly breadcrumb: readonly [string, string];
  readonly title: string;
  readonly tagline: string;
  readonly description: string;
  readonly callout: {
    readonly title: string;
    readonly lines: readonly [string, string];
  };
}

export const resourcesHero: ResourcesHeroContent = {
  breadcrumb: ["Home", "Resources"],
  title: "RESOURCES",
  tagline: "Knowledge. Transparency. Empowerment.",
  description:
    "Explore the insights, research and tools behind the GemReserve.io ecosystem. Our resource hub is here to inform asset owners, investors, partners and institutions working with tokenized gemstone assets.",
  callout: {
    title: "REAL ASSETS. REAL VALUE. REAL TRUST.",
    lines: ["Trusted resources for a transparent", "and tokenized future."],
  },
};

export interface Topic {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly href: string | null;
}

export const topicsSectionTitle = "EXPLORE BY TOPIC";

export const topics: readonly Topic[] = [
  {
    id: "education",
    title: "EDUCATION",
    description:
      "Learn about real asset tokenization, gemstones and our platform.",
    href: "/how-it-works",
  },
  {
    id: "research",
    title: "RESEARCH & INSIGHTS",
    description:
      "Market context, trends and the case for tokenized gemstone assets.",
    href: "/investors",
  },
  {
    id: "whitepapers",
    title: "WHITEPAPERS & GUIDES",
    description: "In-depth guides on our technology and vision.",
    href: "/whitepaper",
  },
  {
    id: "videos",
    title: "VIDEOS & WEBINARS",
    description: "Recorded discussions, walkthroughs and industry webinars.",
    href: null,
  },
  {
    id: "compliance",
    title: "COMPLIANCE & LEGAL",
    description: "Regulatory information, policies and legal documentation.",
    href: "/risk-disclosure",
  },
  {
    id: "downloads",
    title: "DOWNLOADS",
    description: "Documents, fact sheets and informational material.",
    href: "/documents",
  },
  {
    id: "support",
    title: "SUPPORT",
    description: "Frequently asked questions and how to reach us.",
    href: "/faq",
  },
];

export type LibraryStatus = "available" | "planned";

export interface LibraryItem {
  readonly id: string;
  readonly kind: string;
  readonly title: string;
  readonly description: string;
  readonly status: LibraryStatus;
  readonly image: string;
  readonly imageAlt: string;
  readonly href?: string;
  readonly actionLabel?: string;
}

export const librarySectionTitle = "RESOURCE LIBRARY";

export const libraryIntro =
  "Four of these are published and open now. Two are not written yet, and say so rather than offering a button that leads nowhere.";

export const libraryItems: readonly LibraryItem[] = [
  {
    id: "whitepaper",
    kind: "Whitepaper",
    title: "The Future of Gemstone Asset Infrastructure",
    description:
      "How GemReserve.io is building the standard for tokenized gemstone ownership.",
    status: "available",
    image: "library-whitepaper",
    imageAlt: "A black bound book with a fine teal rule on dark stone",
    href: "/whitepaper",
    actionLabel: "Read the whitepaper",
  },
  {
    id: "industry",
    kind: "Industry report",
    title: "Gemstone Market Outlook",
    description:
      "Market size, trends and the data behind the case for tokenization.",
    status: "planned",
    image: "library-industry",
    imageAlt: "Five faceted gemstones on a dark reflective surface",
  },
  {
    id: "guide",
    kind: "Guide",
    title: "Understanding Real Asset Tokenization",
    description:
      "What tokenizing a physical gemstone means, step by step, from sourcing to redemption.",
    status: "available",
    image: "library-tokenization",
    imageAlt: "A lattice of glowing teal cubes linked on a dark grid",
    href: "/gemstone-tokenization",
    actionLabel: "Read the guide",
  },
  {
    id: "webinar",
    kind: "Webinar",
    title: "Tokenizing Gemstones: The Next Frontier",
    description: "A recorded discussion with the team behind the platform.",
    status: "planned",
    image: "library-webinar",
    imageAlt: "An open laptop on a dark desk lit in teal",
  },
  {
    id: "compliance",
    kind: "Policy",
    title: "Eligibility, KYC & AML",
    description:
      "Who can take part, what verification involves and where participation is restricted.",
    status: "available",
    image: "library-compliance",
    imageAlt: "A pair of brass scales against a dark teal ground",
    href: "/eligibility-kyc",
    actionLabel: "Read the policy",
  },
  {
    id: "factsheet",
    kind: "Fact sheet",
    title: "GemReserve.io At a Glance",
    description: "Who operates the platform, what it does and how it works.",
    status: "available",
    image: "library-factsheet",
    imageAlt: "A brilliant-cut diamond mounted inside a gold gimbal ring",
    href: "/about",
    actionLabel: "Read the overview",
  },
];

export interface Tool {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly status: LibraryStatus;
  readonly href?: string;
  readonly actionLabel?: string;
  readonly note?: string;
}

/**
 * Annotated rather than `as const satisfies`, because two of the three tools
 * carry a note and no destination and the third the reverse; the literal types
 * would narrow each member to only the keys it happens to have and the renderer
 * could not read the optional ones at all.
 */
export const toolsPanel: {
  readonly title: string;
  readonly tools: readonly Tool[];
} = {
  title: "TOOLS & CALCULATORS",
  tools: [
    {
      id: "discount",
      title: "20% Discount Methodology",
      description:
        "How the early participation discount is calculated, worked through on a full example.",
      status: "available",
      href: "/discount-methodology",
      actionLabel: "Open the methodology",
    },
    {
      id: "tokenization",
      title: "Tokenization Value Calculator",
      description:
        "Estimate the tokenized value of a gemstone asset from its appraisal.",
      status: "planned",
      note: "Opens when the valuation model is published and independently reviewed.",
    },
    {
      id: "roi",
      title: "Return Calculator",
      description: "Project the return on a holding over time.",
      status: "planned",
      note: "Deliberately not offered. GemReserve.io has no trading history, no price and no market. A tool that produced a number from those would be inventing one, and nothing on this site states or implies an expected return.",
    },
  ],
};

export const subscribePanel = {
  title: "STAY INFORMED",
  description:
    "Subscribe for platform updates, new material and announcements as they are published.",
  benefits: [
    "Industry insights",
    "Platform updates",
    "New resources",
    "Announcements",
  ] as readonly string[],
  privacyNote: "We respect your privacy. Unsubscribe at any time.",
};

export const helpPanel = {
  title: "NEED HELP FINDING SOMETHING?",
  description: "Our team is here to help you find the information you need.",
  buttonLabel: "Contact our team",
  href: "/contact",
};
