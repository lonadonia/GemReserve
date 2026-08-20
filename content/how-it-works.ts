interface VerificationAwareContent {
  requiresClientVerification: boolean;
}

export interface HowItWorksHeroContent extends VerificationAwareContent {
  breadcrumb: readonly [string, string];
  titleLines: readonly [string, string, string];
  description: string;
}

export type ProcessStepId =
  | "asset-sourcing"
  | "gemological-verification"
  | "secure-vaulting"
  | "digital-asset-passport"
  | "on-chain-tokenization"
  | "marketplace-trading"
  | "value-growth"
  | "liquidity-redemption"
  | "transparency-always";

export interface ProcessStep extends VerificationAwareContent {
  id: ProcessStepId;
  step: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  title: string;
  description: string;
}

export type PowerPillarId =
  | "real-assets"
  | "trust-security"
  | "transparency"
  | "global-access"
  | "liquid-efficient"
  | "built-for-generations";

export interface PowerPillar extends VerificationAwareContent {
  id: PowerPillarId;
  title: string;
  description: string;
}

export type TechnologySecurityBulletId =
  | "blockchain-infrastructure"
  | "smart-contracts"
  | "institutional-custody"
  | "data-integrity";

export interface TechnologySecurityBullet extends VerificationAwareContent {
  id: TechnologySecurityBulletId;
  title: string;
  description: string;
}

export type LifecycleStageId =
  "source" | "verify" | "vault" | "tokenize" | "trade" | "redeem";

export interface LifecycleStage extends VerificationAwareContent {
  id: LifecycleStageId;
  order: 1 | 2 | 3 | 4 | 5 | 6;
  title: string;
  description: string;
}

export interface SwissCtaContent extends VerificationAwareContent {
  heading: string;
  description: string;
  actionLabel: string;
  supportingText: string;
}

export const howItWorksHero = {
  breadcrumb: ["HOME", "HOW IT WORKS"],
  titleLines: ["How", "GemReserve.io", "Works"],
  description:
    "GemReserve.io transforms the timeless value of precious gemstones into secure, liquid and transparent digital assets backed by real, verified reserves.",
  requiresClientVerification: true,
} as const satisfies HowItWorksHeroContent;

export const processSectionTitle = "THE GEMRESERVE.IO PROCESS";

export const processSteps = [
  {
    id: "asset-sourcing",
    step: 1,
    title: "ASSET SOURCING",
    description:
      "We source exceptional gemstones through trusted suppliers and direct mining partnerships.",
    requiresClientVerification: true,
  },
  {
    id: "gemological-verification",
    step: 2,
    title: "GEMOLOGICAL VERIFICATION",
    description:
      "Each gemstone is examined and certified by leading independent gemological laboratories.",
    requiresClientVerification: true,
  },
  {
    id: "secure-vaulting",
    step: 3,
    title: "SECURE VAULTING",
    description:
      "Verified gemstones are insured and stored in world-class vaults with maximum security.",
    requiresClientVerification: true,
  },
  {
    id: "digital-asset-passport",
    step: 4,
    title: "DIGITAL ASSET PASSPORT",
    description:
      "A unique Digital Asset Passport is created for each gem, recording its characteristics and provenance.",
    requiresClientVerification: true,
  },
  {
    id: "on-chain-tokenization",
    step: 5,
    title: "ON-CHAIN TOKENIZATION",
    description:
      "The gem is tokenized on the blockchain. Each token represents fractional ownership of the asset.",
    requiresClientVerification: true,
  },
  {
    id: "marketplace-trading",
    step: 6,
    title: "MARKETPLACE TRADING",
    description:
      "Tokens can be traded securely on the GemReserve.io platform with full transparency.",
    requiresClientVerification: true,
  },
  {
    id: "value-growth",
    step: 7,
    title: "VALUE GROWTH",
    description:
      "The value of the gemstone is driven by real-market demand and asset appreciation.",
    requiresClientVerification: true,
  },
  {
    id: "liquidity-redemption",
    step: 8,
    title: "LIQUIDITY & REDEMPTION",
    description:
      "Tokens can be sold for fiat/crypto or redeemed for physical gemstones (subject to terms).",
    requiresClientVerification: true,
  },
  {
    id: "transparency-always",
    step: 9,
    title: "TRANSPARENCY ALWAYS",
    description:
      "All data, ownership records and audit reports are available on-chain and verifiable.",
    requiresClientVerification: true,
  },
] as const satisfies readonly ProcessStep[];

export const powerPillarsSectionTitle = "WHAT MAKES GEMRESERVE.IO POWERFUL";

export const powerPillars = [
  {
    id: "real-assets",
    title: "REAL ASSETS",
    description: "Every token is 100% backed by physically verified gemstones.",
    requiresClientVerification: true,
  },
  {
    id: "trust-security",
    title: "TRUST & SECURITY",
    description:
      "Institutional-grade vaults, insurance and security protocols.",
    requiresClientVerification: true,
  },
  {
    id: "transparency",
    title: "TRANSPARENCY",
    description:
      "On-chain records and independent audits ensure complete visibility.",
    requiresClientVerification: true,
  },
  {
    id: "global-access",
    title: "GLOBAL ACCESS",
    description:
      "Investors worldwide can own, trade and redeem with ease and confidence.",
    requiresClientVerification: true,
  },
  {
    id: "liquid-efficient",
    title: "LIQUID & EFFICIENT",
    description:
      "Fractional ownership creates liquidity in an historically illiquid asset class.",
    requiresClientVerification: true,
  },
  {
    id: "built-for-generations",
    title: "BUILT FOR GENERATIONS",
    description:
      "Designed to preserve and transfer real value across generations using modern technology.",
    requiresClientVerification: true,
  },
] as const satisfies readonly PowerPillar[];

export const technologySecuritySectionTitle =
  "TECHNOLOGY & SECURITY AT THE CORE";

export const technologySecurityBullets = [
  {
    id: "blockchain-infrastructure",
    title: "Blockchain Infrastructure",
    description: "Immutable records on a secure, audited blockchain network.",
    requiresClientVerification: true,
  },
  {
    id: "smart-contracts",
    title: "Smart Contracts",
    description: "Automated, transparent and compliant transaction logic.",
    requiresClientVerification: true,
  },
  {
    id: "institutional-custody",
    title: "Institutional Custody",
    description:
      "Multi-jurisdictional vaulting with insurance and strict access controls.",
    requiresClientVerification: true,
  },
  {
    id: "data-integrity",
    title: "Data Integrity",
    description: "Real-time verification, audits and continuous monitoring.",
    requiresClientVerification: true,
  },
] as const satisfies readonly TechnologySecurityBullet[];

export const assetLifecycleSectionTitle = "THE ASSET LIFECYCLE";

export const assetLifecycleStages = [
  {
    id: "source",
    order: 1,
    title: "SOURCE",
    description: "Ethical sourcing from trusted partners",
    requiresClientVerification: true,
  },
  {
    id: "verify",
    order: 2,
    title: "VERIFY",
    description: "Independent gemological verification",
    requiresClientVerification: true,
  },
  {
    id: "vault",
    order: 3,
    title: "VAULT",
    description: "Secure storage in insured vaults",
    requiresClientVerification: true,
  },
  {
    id: "tokenize",
    order: 4,
    title: "TOKENIZE",
    description: "Create digital asset and issue tokens",
    requiresClientVerification: true,
  },
  {
    id: "trade",
    order: 5,
    title: "TRADE",
    description: "Buy, sell and hold on the platform",
    requiresClientVerification: true,
  },
  {
    id: "redeem",
    order: 6,
    title: "REDEEM",
    description: "Redeem tokens for physical gemstones (subject to terms)",
    requiresClientVerification: true,
  },
] as const satisfies readonly LifecycleStage[];

export const swissCta = {
  heading: "REAL ASSETS. REAL VALUE. REAL TRUST.",
  description:
    "GemReserve.io is redefining ownership of the world’s most exquisite gemstones through blockchain technology, transparency and trust.",
  actionLabel: "Join the Future",
  supportingText: "Be part of the gemstone revolution.",
  requiresClientVerification: true,
} as const satisfies SwissCtaContent;
