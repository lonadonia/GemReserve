/**
 * Gemstone Tokenization — transcribed from the client's board.
 *
 * Two figures on the board could not be carried across verbatim:
 *
 * The worked example gave the stone's vault as "Zurich, Switzerland" and named
 * Lloyd's of London as its insurer. The operating company is now UAB GemVault
 * Capital in Vilnius, and no insurer is named anywhere else on the site, so both
 * rows keep their purpose — where the stone sits, and that it is covered — in the
 * language the rest of the site already uses.
 *
 * The board also printed "1 TOKEN = 0.00001245% OWNERSHIP". 12.45 ct over a
 * million tokens is 0.00001245 ct each, which is 0.0001% of the stone; the board
 * carried the carat figure across but labelled it a percentage. Both numbers are
 * stated here, each against its own unit.
 */

export interface TokenizationHeroContent {
  breadcrumb: readonly [string, string, string];
  titleLines: readonly [string, string];
  description: string;
  badges: readonly { readonly id: string; readonly title: string }[];
  tokenCard: {
    readonly title: string;
    readonly reference: string;
    readonly meaning: string;
    readonly backing: string;
    readonly assurances: readonly string[];
  };
}

export const tokenizationHero: TokenizationHeroContent = {
  breadcrumb: ["Home", "Technology", "Gemstone Tokenization"],
  titleLines: ["Gemstone", "Tokenization"],
  description:
    "Bringing the world's most exquisite gemstones on-chain with transparency, security and trust.",
  badges: [
    { id: "real-assets", title: "Real Assets Backed" },
    { id: "on-chain", title: "On-Chain Transparent" },
    { id: "fractional", title: "Fractional Ownership" },
    { id: "liquidity", title: "Global Liquidity" },
  ],
  tokenCard: {
    title: "Gemstone Token",
    reference: "GR-GEM-001245",
    meaning: "1 token = fractional ownership of a verified gemstone",
    backing: "ASSET-BACKED",
    assurances: ["Verified", "Secured", "Transparent"],
  },
};

export interface TokenizationStep {
  id: string;
  step: number;
  title: string;
  description: string;
}

export const tokenizationProcessTitle = "THE GEMSTONE TOKENIZATION PROCESS";

export const tokenizationProcess: readonly TokenizationStep[] = [
  {
    id: "source",
    step: 1,
    title: "SOURCING",
    description:
      "Ethically sourced gemstones from trusted suppliers and mining partners.",
  },
  {
    id: "gemological",
    step: 2,
    title: "GEMOLOGICAL VERIFICATION",
    description:
      "Independent gemological labs verify identity, authenticity, quality and characteristics.",
  },
  {
    id: "vault-custody",
    step: 3,
    title: "VAULTING & CUSTODY",
    description:
      "Gemstones are securely vaulted in insured, institutional-grade facilities.",
  },
  {
    id: "passport",
    step: 4,
    title: "DIGITAL ASSET PASSPORT",
    description:
      "A unique Digital Asset Passport is created with full gem data, images and reports.",
  },
  {
    id: "tokenize",
    step: 5,
    title: "ON-CHAIN TOKENIZATION",
    description:
      "The gemstone is tokenized on-chain. Each token represents fractional ownership.",
  },
  {
    id: "marketplace-listing",
    step: 6,
    title: "LISTING & DISTRIBUTION",
    description:
      "Tokens are listed on the GemReserve.io marketplace and distributed globally.",
  },
  {
    id: "trade",
    step: 7,
    title: "TRADING & LIQUIDITY",
    description:
      "Investors can trade tokens 24/7 with full transparency and real liquidity.",
  },
  {
    id: "redeem",
    step: 8,
    title: "REDEMPTION OPTION",
    description:
      "Token holders can redeem for physical gemstones following the redemption policy.",
  },
];

export interface TokenizationReason {
  id: string;
  title: string;
  description: string;
}

export const tokenizationWhyTitle = "WHY GEMSTONE TOKENIZATION?";

export const tokenizationReasons: readonly TokenizationReason[] = [
  {
    id: "true-ownership",
    title: "TRUE OWNERSHIP",
    description: "Own a verified gemstone linked 1:1 to its record, subject to verification.",
  },
  {
    id: "affordable-access",
    title: "AFFORDABLE ACCESS",
    description: "Fractional ownership makes rare gemstones accessible to all.",
  },
  {
    id: "transparency",
    title: "TRANSPARENCY",
    description:
      "Each token carries on-chain data and is gated on independent verification.",
  },
  {
    id: "global-market",
    title: "GLOBAL MARKET",
    description: "Trade anytime, anywhere with deep liquidity on our platform.",
  },
  {
    id: "preserve",
    title: "PRESERVE & APPRECIATE",
    description: "Gemstones are historically proven stores of value.",
  },
];

export interface TokenizationStandard {
  id: string;
  title: string;
  description: string;
}

export const tokenizationStandardsTitle = "TOKENIZATION STANDARDS & COMPLIANCE";

export const tokenizationStandards: readonly TokenizationStandard[] = [
  {
    id: "erc20",
    title: "ERC-20 COMPLIANT",
    description:
      "Built on Ethereum standards for security and interoperability.",
  },
  {
    id: "asset-backed",
    title: "ASSET BACKED",
    description: "Asset-backed architecture — evidence and admission pending.",
  },
  {
    id: "audited",
    title: "SMART CONTRACT AUDITED",
    description: "Smart contracts are audited by leading blockchain auditors.",
  },
  {
    id: "kyc-aml",
    title: "KYC / AML",
    description:
      "Compliant with global KYC/AML regulations for investor protection.",
  },
  {
    id: "regulatory",
    title: "REGULATORY READY",
    description: "Framework designed to meet evolving regulatory standards.",
  },
  {
    id: "data-integrity",
    title: "DATA INTEGRITY",
    description: "Immutable on-chain records ensure data integrity and trust.",
  },
];

export interface ExampleAttribute {
  id: string;
  label: string;
  value: string;
}

export interface AllocationSlice {
  id: string;
  label: string;
  percent: number;
}

export const tokenizationExampleTitle = "EXAMPLE: HOW A GEMSTONE IS TOKENIZED";

export const tokenizationExample = {
  /** Named on the card so nobody reads the figures as a live holding. */
  eyebrow: "Illustrative example",
  name: "Emerald",
  reference: "GR-EMR-001245",
  imageAlt: "An emerald-cut green emerald",
  attributes: [
    { id: "origin", label: "Origin", value: "Zambia" },
    { id: "weight", label: "Weight", value: "12.45 ct" },
    { id: "shape", label: "Shape", value: "Emerald Cut" },
    { id: "clarity", label: "Clarity", value: "VVS" },
    { id: "treatment", label: "Treatment", value: "Minor Oil" },
    { id: "certification", label: "Certification", value: "GRS" },
  ] as readonly ExampleAttribute[],
  custody: [
    { id: "vault", label: "Vault", value: "Insured institutional custody" },
    { id: "insurance", label: "Insurance", value: "Covered while in custody" },
  ] as readonly ExampleAttribute[],
  supplyLabel: "Total supply: 1,000,000 tokens",
  unitLabel: "1 token = 0.0001% ownership (0.00001245 ct)",
  allocationTitle: "TOKEN ALLOCATION",
  allocation: [
    { id: "public", label: "Public Offering", percent: 60 },
    { id: "partners", label: "Strategic Partners", percent: 15 },
    { id: "team", label: "Team & Advisors", percent: 10 },
    { id: "reserve", label: "Reserve", percent: 10 },
    { id: "marketing", label: "Marketing & Liquidity", percent: 5 },
  ] as readonly AllocationSlice[],
  passportTitle: "DIGITAL ASSET PASSPORT",
  passportItems: [
    "Gemological Report",
    "High-Resolution Images (360°)",
    "Physical Characteristics",
    "Origin & Provenance",
    "Vault & Insurance Details",
    "On-Chain Verification",
  ],
  passportActionLabel: "View on blockchain",
} as const;

export interface ProofItem {
  id: string;
  title: string;
  description: string;
}

export const proofOfReservesTitle = "PROOF OF GEM RESERVES";

export const proofOfReserves: readonly ProofItem[] = [
  {
    id: "on-chain-verification",
    title: "On-Chain Verification",
    description: "Every token is linked to a real asset recorded on-chain.",
  },
  {
    id: "regular-audits",
    title: "Regular Audits",
    description: "Independent audits of vaults, assets and processes.",
  },
  {
    id: "third-party-reports",
    title: "Third-Party Reports",
    description: "Gemological reports from leading laboratories.",
  },
  {
    id: "real-time-updates",
    title: "Real-Time Updates",
    description: "Inventory and status updates reflected on the blockchain.",
  },
  {
    id: "full-transparency",
    title: "Full Transparency",
    description: "Anyone can verify ownership and backing at any time.",
  },
];

export const tokenizationCta = {
  titleLines: ["The future of gemstones is here.", "Own. Trade. Redeem."],
  description:
    "Be part of the worldwide movement to unlock the true value of precious gemstones through blockchain technology.",
  buttonLabel: "Join the Future",
  supportingText: "Join our waitlist for early access.",
  imageAlt: "An open vault holding six faceted gemstones",
} as const;
