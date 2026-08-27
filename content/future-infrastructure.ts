/**
 * The Future of Gemstone Asset Infrastructure — transcribed from the client's
 * supplied board.
 *
 * This is the page where the live/planned distinction matters most, and the
 * board's own roadmap graphic blurs it: it draws a completed check mark above
 * all five phases, including "GLOBAL MARKETPLACE 2026+" and "FUTURE LEADERSHIP
 * BEYOND". Rendering that faithfully would state that a marketplace and a
 * leadership position already exist, which they do not.
 *
 * The board's phase labels already carry their own status — COMPLETED, IN
 * PROGRESS, and dated or open-ended for the rest — so each phase here declares
 * that status explicitly and is marked accordingly. Only the phase the board
 * calls completed reads as done; the one it calls in progress reads as under
 * way; the remaining three read as planned. No date is added, moved or removed.
 *
 * Everything else on the page is a description of what the infrastructure is
 * intended to enable. It is written in those terms throughout and names no
 * partner, institution, integration or adopter, because the board names none.
 */

export interface FutureHeroContent {
  readonly breadcrumb: readonly [string, string];
  readonly titleLines: readonly [string, string];
  readonly tagline: string;
  readonly description: string;
  readonly callout: {
    readonly title: string;
    readonly lines: readonly [string, string];
  };
}

export const futureHero: FutureHeroContent = {
  breadcrumb: ["Home", "The Future of Gemstone Asset Infrastructure"],
  titleLines: ["THE FUTURE OF GEMSTONE", "ASSET INFRASTRUCTURE"],
  tagline: "Building Tomorrow's Financial Foundation, Today.",
  description:
    "GemReserve.io is pioneering the next generation of real asset infrastructure—where physical gemstones, blockchain technology, and global finance converge to create new opportunities for investors, businesses, and institutions worldwide.",
  callout: {
    title: "REAL ASSETS. REAL VALUE. REAL TRUST.",
    lines: [
      "Powered by blockchain. Secured by compliance.",
      "Built for generations.",
    ],
  },
};

export interface FutureMark {
  readonly id: string;
  readonly titleLines: readonly [string, string];
  readonly description: string;
}

export const futureEra = {
  title: "A NEW ERA FOR REAL ASSET OWNERSHIP",
  lines: [
    "The global financial system is evolving. Investors demand transparency. Markets demand efficiency.",
    "Technology makes it possible. GemReserve.io builds the foundation.",
  ],
  items: [
    {
      id: "ownership",
      titleLines: ["REAL OWNERSHIP", "ON-CHAIN"],
      description:
        "True fractional ownership of physically verified gemstone assets.",
    },
    {
      id: "access",
      titleLines: ["GLOBAL ACCESS,", "BOUNDLESS MARKETS"],
      description:
        "Open new markets and connect investors, traders, and institutions globally.",
    },
    {
      id: "liquidity",
      titleLines: ["LIQUIDITY WITHOUT", "COMPROMISE"],
      description:
        "Unlock liquidity for traditionally illiquid assets with secure tokenization.",
    },
    {
      id: "transparency",
      titleLines: ["TRANSPARENCY", "BY DESIGN"],
      description:
        "Immutable records, provenance verification, and real-time asset data.",
    },
    {
      id: "scale",
      titleLines: ["INFRASTRUCTURE", "BUILT TO SCALE"],
      description:
        "Enterprise-grade technology designed for growth, security, and mass adoption.",
    },
    {
      id: "sustainable",
      titleLines: ["SUSTAINABLE", "FUTURE"],
      description:
        "Responsible sourcing, ethical partnerships, and long-term value creation.",
    },
  ] as const satisfies readonly FutureMark[],
};

export interface InfrastructureLayer {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export const futureVision = {
  title: "THE INFRASTRUCTURE VISION",
  description:
    "GemReserve.io is building a future-ready ecosystem where real-world gemstone assets are digitized, connected, and utilized across a global network.",
  layers: [
    {
      id: "asset",
      title: "ASSET LAYER",
      description:
        "Physically verified gemstones held in secure, insured vaults.",
    },
    {
      id: "tokenization",
      title: "TOKENIZATION LAYER",
      description:
        "Blockchain-based tokenization with immutable digital passports.",
    },
    {
      id: "infrastructure",
      title: "INFRASTRUCTURE LAYER",
      description: "Secure custody, compliance, data management, and APIs.",
    },
    {
      id: "market",
      title: "MARKET LAYER",
      description:
        "Trading, liquidity, DeFi integration, and secondary markets.",
    },
    {
      id: "ecosystem",
      title: "ECOSYSTEM LAYER",
      description: "Investors, enterprises, institutions, and global partners.",
    },
  ] as const satisfies readonly InfrastructureLayer[],
};

export interface FutureEnabler {
  readonly id: string;
  readonly titleLines: readonly [string, string];
  readonly description: string;
}

export const futureEnables = {
  title: "WHAT THE FUTURE ENABLES",
  items: [
    {
      id: "investment",
      titleLines: ["NEW INVESTMENT", "OPPORTUNITIES"],
      description:
        "Diversify with high-value, tangible assets in a digital-first world.",
    },
    {
      id: "inclusion",
      titleLines: ["FINANCIAL", "INCLUSION"],
      description:
        "Lower barriers. Broader access. Global participation for all.",
    },
    {
      id: "institutional",
      titleLines: ["INSTITUTIONAL", "ADOPTION"],
      description:
        "Compliance-ready solutions that meet the needs of modern institutions.",
    },
    {
      id: "provenance",
      titleLines: ["PROVENANCE", "YOU CAN TRUST"],
      description:
        "End-to-end tracking from origin to ownership with verifiable authenticity.",
    },
    {
      id: "markets",
      titleLines: ["SMARTER", "MARKETS"],
      description:
        "Real-time data, analytics, and insights for better decisions.",
    },
    {
      id: "legacy",
      titleLines: ["LEGACY FOR", "GENERATIONS"],
      description:
        "Preserve value today. Empower tomorrow. Build a lasting legacy.",
    },
  ] as const satisfies readonly FutureEnabler[],
};

/**
 * The board's roadmap, with each phase carrying the status the board's own
 * label states rather than the completed check it draws over all five.
 */
export type PhaseStatus = "complete" | "in-progress" | "planned";

export interface RoadPhase {
  readonly id: string;
  readonly titleLines: readonly [string, string];
  readonly status: PhaseStatus;
  readonly description: string;
}

export const futureRoad = {
  title: "OUR ROAD TO THE FUTURE",
  statusLabels: {
    complete: "Completed",
    "in-progress": "In progress",
    planned: "Planned",
  } as Readonly<Record<PhaseStatus, string>>,
  phases: [
    {
      id: "foundation",
      titleLines: ["FOUNDATION", "COMPLETED"],
      status: "complete",
      description:
        "Secure infrastructure, licensed framework, and core platform development.",
    },
    {
      id: "onboarding",
      titleLines: ["ASSET ONBOARDING", "IN PROGRESS"],
      status: "in-progress",
      description:
        "Expanding verified gemstone assets and building digital asset passports.",
    },
    {
      id: "expansion",
      titleLines: ["ECOSYSTEM EXPANSION", "2025–2026"],
      status: "planned",
      description:
        "Growing global partnerships, enterprise integrations, and market access.",
    },
    {
      id: "marketplace",
      titleLines: ["GLOBAL MARKETPLACE", "2026+"],
      status: "planned",
      description:
        "Full-scale trading, liquidity solutions, and DeFi integration.",
    },
    {
      id: "leadership",
      titleLines: ["FUTURE LEADERSHIP", "BEYOND"],
      status: "planned",
      description:
        "Setting the global standard for real asset tokenization and market infrastructure.",
    },
  ] as const satisfies readonly RoadPhase[],
};

export const futureCta = {
  title: "BE PART OF THE FUTURE",
  description:
    "Join visionaries, investors, and innovators building the future of gemstone asset infrastructure—together.",
  buttonLabel: "Join the Early Participation Waitlist",
  alternativeLabel: "or",
  secondaryLabel: "Contact our team",
};

export interface FutureBanner {
  readonly id: string;
  readonly lines: readonly [string, string];
}

export const futureBanner: readonly FutureBanner[] = [
  { id: "secure", lines: ["SECURE. COMPLIANT.", "GLOBAL."] },
  { id: "trust", lines: ["BUILT FOR", "TRUST."] },
  { id: "innovation", lines: ["DRIVEN BY", "INNOVATION."] },
  { id: "value", lines: ["FOCUSED ON", "REAL VALUE."] },
];
