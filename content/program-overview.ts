/**
 * Program Overview — transcribed from the client's supplied board.
 *
 * The board is the programme's own summary page: a hero with the crest card,
 * a four-mark strip, mission and model side by side, a six-card "what makes our
 * program unique" grid and a closing waitlist band. Nothing here states a
 * participation figure, a token price, an allocation or a return, because the
 * board states none; the only number on it is the four-step model, which is a
 * sequence rather than a quantity.
 */

export interface OverviewHeroContent {
  readonly breadcrumb: readonly [string, string];
  readonly titleLines: readonly [string, string];
  readonly taglineLines: readonly [string, string];
  readonly description: string;
  readonly crest: {
    readonly wordmark: string;
    readonly lines: readonly [string, string, string];
    readonly motto: string;
  };
}

export const overviewHero: OverviewHeroContent = {
  breadcrumb: ["Home", "Program Overview"],
  titleLines: ["PROGRAM", "OVERVIEW"],
  taglineLines: [
    "Real Assets. Tokenized. Transparent.",
    "Built for the Future of Value.",
  ],
  description:
    "GemReserve.io tokenizes the world's most valuable gemstones on a physical asset framework, secured by verifiable ownership, custody, and technology.",
  crest: {
    wordmark: "GemReserve.io",
    lines: ["REAL ASSETS.", "REAL VALUE.", "REAL TRUST."],
    motto: "OWN. TRADE. REDEEM.",
  },
};

export interface OverviewMark {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export const overviewMarks: readonly OverviewMark[] = [
  {
    id: "tangible-value",
    title: "TANGIBLE VALUE",
    description:
      "Each token is designed to link to a physical, investment-grade gemstone.",
  },
  {
    id: "secure-compliant",
    title: "SECURE & COMPLIANT",
    description:
      "Institutional-grade custody, KYC/AML compliance, and regulatory alignment.",
  },
  {
    id: "global-access",
    title: "GLOBAL ACCESS",
    description:
      "Seamless access to real asset ownership from anywhere in the world.",
  },
  {
    id: "built-for-growth",
    title: "BUILT FOR GROWTH",
    description:
      "A scalable platform designed for long-term value creation and global adoption.",
  },
];

export interface OverviewValue {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export const overviewMission = {
  title: "OUR MISSION",
  statement:
    "To unlock the true potential of real assets by tokenizing the world's finest gemstones—creating a transparent, liquid, and secure ecosystem that empowers ownership, builds trust, and drives financial freedom for generations to come.",
  values: [
    {
      id: "integrity",
      title: "INTEGRITY",
      description:
        "We operate with honesty, transparency, and accountability in everything we do.",
    },
    {
      id: "innovation",
      title: "INNOVATION",
      description:
        "We leverage cutting-edge technology to redefine asset ownership.",
    },
    {
      id: "excellence",
      title: "EXCELLENCE",
      description:
        "We are committed to quality in our assets, our platform, and our partnerships.",
    },
    {
      id: "trust",
      title: "TRUST",
      description:
        "We build confidence through security, compliance, and verifiable proof.",
    },
  ] as const satisfies readonly OverviewValue[],
};

export interface OverviewModelStep {
  readonly id: string;
  readonly step: number;
  readonly title: string;
  readonly description: string;
}

export const overviewModel = {
  title: "OUR MODEL",
  statement:
    "GemReserve.io combines real-world assets with blockchain technology to create a secure and transparent ownership model.",
  steps: [
    {
      id: "source",
      step: 1,
      title: "SOURCE",
      description:
        "We source only the finest gemstones that meet our strict quality standards.",
    },
    {
      id: "custody",
      step: 2,
      title: "CUSTODY",
      description:
        "Assets are securely vaulted and insured by trusted partners.",
    },
    {
      id: "tokenize",
      step: 3,
      title: "TOKENIZE",
      description:
        "Each asset is tokenized on the blockchain with verifiable proof.",
    },
    {
      id: "distribute",
      step: 4,
      title: "DISTRIBUTE",
      description:
        "Tokens are made available globally for ownership, trading, and holding.",
    },
  ] as const satisfies readonly OverviewModelStep[],
};

export const overviewUniqueTitle = "WHAT MAKES OUR PROGRAM UNIQUE";

export interface OverviewUniquePoint {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export const overviewUniquePoints: readonly OverviewUniquePoint[] = [
  {
    id: "real-asset-backing",
    title: "REAL ASSET BACKING",
    description:
      "Every token represents direct ownership of physical gemstones.",
  },
  {
    id: "verifiable-authenticity",
    title: "VERIFIABLE AUTHENTICITY",
    description: "Each gemstone is independently verified and certified.",
  },
  {
    id: "institutional-security",
    title: "INSTITUTIONAL SECURITY",
    description:
      "Bank-grade custody, insurance, and multi-layer security protocols.",
  },
  {
    id: "liquidity-access",
    title: "LIQUIDITY & ACCESS",
    description: "Trade, hold, or redeem with ease on a global, 24/7 platform.",
  },
  {
    id: "transparency",
    title: "TRANSPARENCY",
    description: "On-chain visibility and real-time reporting at every step.",
  },
  {
    id: "global-community",
    title: "GLOBAL COMMUNITY",
    description:
      "Join a growing network of investors, partners, and asset holders.",
  },
];

export const overviewCta = {
  imageAlt: "An open vault case holding a tray of coloured gemstones",
  titleLines: ["THE FUTURE OF VALUE", "STARTS WITH REAL ASSETS"],
  description:
    "Our program is more than just tokenization. It's a movement toward a more transparent, inclusive, and value-driven financial future.",
  motto: "OWN. TRADE. REDEEM.",
  invitation: "Be part of the first generation to own tokenized gemstones.",
  buttonLabel: "Join the Early Participation Waitlist",
  // The board sets "Limited spots available." under the button. Kept as the
  // board's own words for a pre-launch waitlist, with no count attached.
  supportingText: "Limited spots available.",
};
