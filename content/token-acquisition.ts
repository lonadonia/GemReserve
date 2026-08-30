/**
 * How Token Acquisition Will Work — transcribed from the client's supplied
 * board.
 *
 * GemReserve is pre-launch, and this page describes a process rather than
 * operating one. Nothing here is a live control: there is no wallet connection,
 * no balance, no transfer, no confirmation and no order. The board itself is
 * written in the future and conditional tense ("will work", "supported
 * methods", "more payment options will be added gradually"), and that tense is
 * kept, with a standing pre-launch notice above the process so a reader cannot
 * mistake the description for a working checkout.
 *
 * The payment methods are the board's own list of what the platform is being
 * built to accept. They are stated as supported networks and rails, not as
 * signed agreements with named processors, and the two routed through third
 * parties keep the board's own "via approved partners" qualifier without naming
 * a partner, because the board names none.
 */

export interface AcquisitionHeroContent {
  readonly breadcrumb: readonly [string, string];
  readonly titleLines: readonly [string, string, string];
  readonly tagline: string;
  readonly paragraphs: readonly string[];
  readonly notice: string;
}

export const acquisitionHero: AcquisitionHeroContent = {
  breadcrumb: ["Home", "How Token Acquisition Will Work"],
  titleLines: ["How Token", "Acquisition", "Will Work"],
  tagline: "Simple. Secure. Transparent.",
  paragraphs: [
    "GemReserve.io is building a seamless and compliant process for acquiring tokenized gemstone assets.",
    "Our acquisition model is designed to ensure security, transparency, and full regulatory alignment at every step.",
  ],
  // Not on the board, and stated in the site's own words: the board describes a
  // process that does not exist yet, and the page has to say so plainly rather
  // than presenting a preview as a live service.
  notice:
    "The acquisition process described on this page is not yet open. Nothing here is a live transaction: joining the waitlist is the only action available today.",
};

export interface AcquisitionMark {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export const acquisitionMarks: readonly AcquisitionMark[] = [
  {
    id: "real-asset-backed",
    title: "REAL ASSET-BACKED",
    description: "Each token is designed to link to a verified gemstone reserve.",
  },
  {
    id: "secure-compliant",
    title: "SECURE & COMPLIANT",
    description:
      "Built on blockchain with institutional-grade security and full compliance.",
  },
  {
    id: "transparent-process",
    title: "TRANSPARENT PROCESS",
    description: "Every step is verifiable on-chain and fully auditable.",
  },
  {
    id: "global-access",
    title: "GLOBAL ACCESS",
    description:
      "Open to eligible participants worldwide (subject to KYC/AML).",
  },
  {
    id: "liquid-transferable",
    title: "LIQUID & TRANSFERABLE",
    description:
      "Trade, hold, or redeem your tokens anytime on supported platforms.",
  },
];

export interface AcquisitionStep {
  readonly id: string;
  readonly step: number;
  readonly title: string;
  readonly description: string;
}

export const acquisitionProcessTitle = "THE ACQUISITION PROCESS";

export const acquisitionSteps: readonly AcquisitionStep[] = [
  {
    id: "join",
    step: 1,
    title: "JOIN THE WAITLIST",
    description:
      "Submit your interest on our Early Participation Program to receive exclusive updates and invitation access.",
  },
  {
    id: "invitation",
    step: 2,
    title: "RECEIVE INVITATION",
    description:
      "Qualified participants receive a private invitation with access details and important information.",
  },
  {
    id: "kyc",
    step: 3,
    title: "COMPLETE KYC",
    description:
      "Complete our secure KYC/AML verification to ensure compliance and protect the ecosystem.",
  },
  {
    id: "connect",
    step: 4,
    title: "CONNECT WALLET",
    description:
      "Connect your compatible crypto wallet to our acquisition portal. We support leading wallets.",
  },
  {
    id: "fund",
    step: 5,
    title: "FUND YOUR WALLET",
    description:
      "Add funds using supported methods (USDT, USDC, ETH, BTC, or eligible fiat on-ramps via partners).",
  },
  {
    id: "acquire",
    step: 6,
    title: "ACQUIRE TOKENS",
    description:
      "Choose your desired gemstone token(s) and confirm your purchase. Tokens are delivered instantly.",
  },
];

export interface AcquisitionOption {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly points: readonly string[];
}

export const acquisitionOptionsTitle = "ACQUISITION OPTIONS";

export const acquisitionOptions: readonly AcquisitionOption[] = [
  {
    id: "early-participation-sale",
    title: "EARLY PARTICIPATION SALE",
    description:
      "Exclusive access before public launch with special pricing and limited allocation.",
    points: [
      "Up to 20% discount on gemstone asset tokens",
      "Priority allocation of high-demand assets",
      "Limited-time access windows",
      "Invitation-only rounds",
    ],
  },
  {
    id: "public-sale",
    title: "PUBLIC SALE",
    description:
      "Open to the public during scheduled sales after platform launch.",
    points: [
      "Transparent pricing",
      "Open to all eligible participants",
      "Allocation based on tier and demand",
      "Announced sale periods",
    ],
  },
  {
    id: "secondary-market",
    title: "SECONDARY MARKET",
    description:
      "Buy and sell tokens anytime on supported decentralized and centralized exchanges.",
    points: [
      "24/7 global liquidity",
      "Real-time pricing",
      "Secure peer-to-peer trading",
      "Full on-chain transparency",
    ],
  },
];

export interface AcquisitionReason {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export const acquisitionWhy = {
  title: "WHY OUR PROCESS MATTERS",
  reasons: [
    {
      id: "real-value",
      title: "REAL VALUE, REAL ASSETS",
      description:
        "Every token represents full ownership of allocated gemstone reserves in secure custody.",
    },
    {
      id: "built-for-trust",
      title: "BUILT FOR TRUST",
      description:
        "Transparency, audits, and on-chain verification ensure complete confidence.",
    },
    {
      id: "every-investor",
      title: "DESIGNED FOR EVERY INVESTOR",
      description:
        "From individuals to institutions, our platform is built for scalability and accessibility.",
    },
    {
      id: "future-ready",
      title: "FUTURE-READY",
      description:
        "A foundation for global gem asset trading, defi integration, and enterprise solutions.",
    },
  ] as const satisfies readonly AcquisitionReason[],
};

export interface PaymentMethod {
  readonly id: string;
  readonly symbol: string;
  /**
   * The currency's own sign, drawn on the disc. These are Unicode currency
   * characters rather than the networks' logo files: the site does not licence
   * those marks, and the sign identifies the rail without reproducing one.
   */
  readonly glyph: string;
  readonly networks?: string;
  readonly swatch: string;
}

export const acquisitionPayments = {
  title: "ACCEPTED PAYMENT METHODS",
  intro: "We support a variety of secure payment options:",
  // Annotated rather than `as const satisfies`: BTC carries no network suffix,
  // and the literal types would drop the optional field from the union so the
  // page could not read it off any entry.
  tokens: [
    {
      id: "usdt",
      symbol: "USDT",
      glyph: "₮",
      networks: "(TRC20, ERC20)",
      swatch: "#26a17b",
    },
    {
      id: "usdc",
      symbol: "USDC",
      glyph: "$",
      networks: "(ERC20)",
      swatch: "#2775ca",
    },
    {
      id: "eth",
      symbol: "ETH",
      glyph: "Ξ",
      networks: "(ERC20)",
      swatch: "#627eea",
    },
    { id: "btc", symbol: "BTC", glyph: "₿", swatch: "#f7931a" },
  ] as readonly PaymentMethod[],
  // The board routes both fiat rails through third parties and names none, so
  // the qualifier is carried across and no processor is invented.
  rails: [
    {
      id: "bank-transfer",
      title: "BANK TRANSFER",
      note: "(Via Approved Partners)",
    },
    {
      id: "fiat-on-ramp",
      title: "FIAT ON-RAMP",
      note: "(Via Approved Partners)",
    },
  ],
  footnote: "More payment options will be added gradually.",
};

export const acquisitionAssurance = {
  title: "SECURE. COMPLIANT. BUILT TO LAST.",
  imageAlt: "A gold and black padlock shield on a dark blockchain network",
  points: [
    "KYC/AML Compliant",
    "Blockchain Security",
    "Smart Contract Audited",
    "Regular Third-Party Audits",
    "Regulated Custody Partners",
    "Investor Fund Protection",
  ],
};

export const acquisitionCta = {
  imageAlt: "An open vault case holding a tray of coloured gemstones",
  titleLines: ["Own a piece of the world's", "most precious gemstone assets."],
  tagline: "The future of value is transparent, backed, and yours.",
  buttonLabel: "Join the Waitlist",
  supportingText: "Be among the first to acquire tokenized gemstone assets.",
};
