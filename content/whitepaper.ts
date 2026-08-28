/**
 * Whitepaper — transcribed from the client's supplied board.
 *
 * The board's centrepiece is a download panel: "GemReserve.io Whitepaper — PDF
 * • 28 MB • 42 Pages", with a DOWNLOAD PDF button. There is no whitepaper. A
 * search of the whole server found no PDF of any kind, and none has been
 * supplied. The panel therefore describes the document that is being written
 * and says where it is, rather than offering a file that would 404 — and no
 * page count or file size is invented for it.
 *
 * This matters more than the usual missing asset, because the one whitepaper
 * text that does exist on this server is a corrupted derivative: a copy in
 * which "Swiss" had been mechanically replaced with "Lithuanian", leaving it
 * citing "Lithuanian Federal DLT law (Art. 973c Code of Obligations)" — which
 * is Swiss law, Art. 973c of the Swiss Code of Obligations, relabelled — and
 * naming two laboratories and an oracle provider as counterparties. None of it
 * is carried across. Publishing that as GemReserve's whitepaper would put a
 * false legal citation and three unsupported relationships into the document a
 * reader trusts most.
 *
 * Two lines of the board's own copy are adjusted for the same reason the rest
 * of the site adjusts them: "the world's first end-to-end infrastructure" is a
 * superlative the project cannot evidence, and "transparent pricing and live
 * market data" describes a market that does not exist yet. Both are written as
 * what the platform is built to do.
 */

export interface WhitepaperHeroContent {
  readonly breadcrumb: readonly [string, string, string];
  readonly title: string;
  readonly tagline: string;
  readonly description: string;
  readonly callout: {
    readonly title: string;
    readonly lines: readonly [string, string];
  };
  readonly marks: readonly string[];
}

export const whitepaperHero: WhitepaperHeroContent = {
  breadcrumb: ["Home", "Documents", "Whitepaper"],
  title: "WHITEPAPER",
  tagline: "The Future of Gemstone Assets",
  description:
    "How GemReserve.io is building the infrastructure for real gemstone asset ownership, tokenization and trading — backed by transparency, technology and trust.",
  callout: {
    title: "REAL ASSETS. REAL VALUE. REAL TRUST.",
    lines: [
      "A new standard for gemstone asset ownership",
      "in the digital era.",
    ],
  },
  marks: ["Transparent", "Secure", "Auditable", "Global"],
};

export interface Chapter {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export const chaptersSectionTitle = "INSIDE THE WHITEPAPER";

export const chapters: readonly Chapter[] = [
  {
    id: "vision",
    title: "VISION & MISSION",
    description:
      "Our purpose, values and long-term vision for the gemstone asset economy.",
  },
  {
    id: "market",
    title: "MARKET OPPORTUNITY",
    description:
      "The gemstone industry today and the case for modernizing how it is owned and traded.",
  },
  {
    id: "framework",
    title: "TOKENIZATION FRAMEWORK",
    description:
      "How a real gemstone becomes a token, with full transparency and custody.",
  },
  {
    id: "technology",
    title: "TECHNOLOGY & SECURITY",
    description:
      "Blockchain architecture, smart contracts and security built for institutional grade.",
  },
  {
    id: "tokenomics",
    title: "TOKENOMICS",
    description: "Token utility, allocation, economic model and stewardship.",
  },
  {
    id: "governance",
    title: "GOVERNANCE",
    description: "The governance model and how ecosystem participation works.",
  },
  {
    id: "roadmap",
    title: "ROADMAP",
    description:
      "The phased roadmap to build the global standard for gemstone assets.",
  },
];

export const executivePanel = {
  title: "EXECUTIVE SUMMARY",
  paragraphs: [
    "GemReserve.io is building end-to-end infrastructure for tokenized gemstone assets. It connects high-quality, independently verified gemstones with blockchain technology to enable fractional ownership, global liquidity and transparent trading.",
    "The platform bridges the gap between the traditional gemstone industry and the digital asset economy — unlocking new value for asset owners, investors and institutions.",
  ] as readonly string[],
  imageAlt: "A world map traced in gold light across a dark ground",
};

export const highlightsPanel = {
  title: "KEY HIGHLIGHTS",
  highlights: [
    "Real gemstones, physically held in secure vaults",
    "Independently verified and digitally certified",
    "Tokenized on blockchain with immutable records",
    "Fractional ownership and global accessibility",
    "Built to carry transparent pricing and market data",
    "Built for investors, collectors and institutions",
    "Designed against a regulatory-compliant framework",
    "Sustainable growth with long-term value",
  ] as readonly string[],
};

export interface Audience {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export const audiencePanel = {
  title: "WHO SHOULD READ",
  audiences: [
    {
      id: "investors",
      title: "Investors",
      description:
        "Understand the opportunity and value proposition of gemstone assets.",
    },
    {
      id: "institutional",
      title: "Institutional Partners",
      description:
        "Explore enterprise solutions, licensing and integration opportunities.",
    },
    {
      id: "owners",
      title: "Asset Owners",
      description:
        "Learn how to tokenize and unlock liquidity from your gemstone assets.",
    },
    {
      id: "traders",
      title: "Traders & Collectors",
      description:
        "Discover a transparent, secure and global marketplace for gemstones.",
    },
  ] as const satisfies readonly Audience[],
};

export const downloadPanel = {
  title: "THE DOCUMENT ITSELF",
  description:
    "The full whitepaper is being written. It is not published yet, and nothing is offered here in its place.",
  status: "In preparation",
  statusNote:
    "No file size, page count or download is shown, because there is no file. When the whitepaper is published it appears here and in the document library, dated and versioned.",
  covers: [
    "Market analysis and the case for tokenization",
    "Technical architecture and security model",
    "Tokenomics and the utility model",
    "Ecosystem and roadmap detail",
    "Governance and compliance framework",
  ] as readonly string[],
  buttonLabel: "Tell me when it is published",
  buttonHref: "/early-participation",
  secondary: { label: "See the full document library", href: "/documents" },
};

export const readNowPanel = {
  title: "WHAT YOU CAN READ TODAY",
  intro:
    "Each chapter above has a published page behind it. The whitepaper will gather them into one document; it will not say anything these do not.",
  links: [
    { id: "how", label: "How GemReserve.io Works", href: "/how-it-works" },
    {
      id: "tokenization",
      label: "Gemstone Tokenization",
      href: "/gemstone-tokenization",
    },
    { id: "technology", label: "Technology", href: "/technology" },
    {
      id: "custody",
      label: "Custody & Vault Structure",
      href: "/custody-vault-structure",
    },
    {
      id: "verification",
      label: "Independent Verification",
      href: "/independent-verification",
    },
    {
      id: "reserves",
      label: "Proof of Gemstone Reserves",
      href: "/proof-of-reserves",
    },
    { id: "governance", label: "Governance", href: "/governance" },
    { id: "future", label: "Roadmap", href: "/future-infrastructure" },
  ] as const satisfies readonly {
    readonly id: string;
    readonly label: string;
    readonly href: string;
  }[],
};

export interface ClosingMark {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export const closingMarks: readonly ClosingMark[] = [
  {
    id: "backed",
    title: "BACKED BY REAL ASSETS",
    description:
      "Every token is backed by a real, independently verified gemstone.",
  },
  {
    id: "trust",
    title: "BUILT ON TRUST",
    description: "Transparency, compliance and security at the core.",
  },
  {
    id: "future",
    title: "DESIGNED FOR THE FUTURE",
    description:
      "Building the global standard for gemstone asset infrastructure.",
  },
  {
    id: "own",
    title: "OWN. TRADE. REDEEM.",
    description: "Empowering a new era of real asset ownership.",
  },
];
