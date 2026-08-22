export interface TechnologyHeroContent {
  breadcrumb: readonly [string, string];
  titleLines: readonly [string, string, string];
  description: string;
}

export const technologyHero: TechnologyHeroContent = {
  breadcrumb: ["Home", "Technology"],
  titleLines: ["Technology", "Built on Trust.", "Powered by Innovation."],
  description:
    "GemReserve.io leverages cutting-edge blockchain technology, institutional-grade infrastructure and advanced security frameworks to tokenize, protect and manage the world's most exquisite gemstones.",
};

export interface TechnologyPillar {
  id: string;
  title: string;
  description: string;
}

export const technologyPillarsSectionTitle = "OUR TECHNOLOGY PILLARS";

export const technologyPillars: readonly TechnologyPillar[] = [
  {
    id: "security-first",
    title: "SECURITY FIRST",
    description:
      "Institutional-grade security at every layer to protect assets, data and investors.",
  },
  {
    id: "transparency",
    title: "TRANSPARENCY",
    description:
      "On-chain proof of reserves and immutable records ensure absolute visibility.",
  },
  {
    id: "decentralized-trust",
    title: "DECENTRALIZED TRUST",
    description:
      "Blockchain eliminates single points of failure and brings trust through code.",
  },
  {
    id: "real-world-backing",
    title: "REAL-WORLD BACKING",
    description: "Every token is 100% backed by physically verified gemstones.",
  },
  {
    id: "global-infrastructure",
    title: "GLOBAL INFRASTRUCTURE",
    description:
      "Built for scale with global reach, high availability and low-latency access.",
  },
  {
    id: "future-ready",
    title: "FUTURE READY",
    description: "Modular architecture designed to evolve with innovation.",
  },
];

export interface ArchitectureLayer {
  id: string;
  title: string;
  items: readonly string[];
}

export const architectureSectionTitle = "PLATFORM ARCHITECTURE";

export const architectureLayers: readonly ArchitectureLayer[] = [
  {
    id: "user-interface",
    title: "USER INTERFACE",
    items: ["Web Portal", "Mobile Apps (iOS/Android)", "API Access"],
  },
  {
    id: "application-layer",
    title: "APPLICATION LAYER",
    items: [
      "Account Management",
      "Marketplace & Trading",
      "Redemption Engine",
      "Portfolio Dashboard",
      "Reporting & Analytics",
    ],
  },
  {
    id: "business-logic-layer",
    title: "BUSINESS LOGIC LAYER",
    items: [
      "KYC / AML & Compliance",
      "Verification & Approval",
      "Tokenization Services",
      "Smart Contract Engine",
      "Notification Services",
    ],
  },
  {
    id: "data-storage-layer",
    title: "DATA & STORAGE LAYER",
    items: [
      "Asset Data Repository",
      "Document Vault",
      "Transaction Database",
      "Audit Logs",
      "Backup & Disaster Recovery",
    ],
  },
  {
    id: "blockchain-layer",
    title: "BLOCKCHAIN LAYER",
    items: [
      "Ethereum (ERC-20)",
      "On-Chain Ownership",
      "Smart Contracts",
      "Proof of Reserves",
      "Immutable Ledger",
    ],
  },
];

export const integrationLayerTitle = "INTEGRATION LAYER";

export const integrationLayerItems: readonly string[] = [
  "Banking Systems",
  "Custody & Vault Systems",
  "Insurance Partners",
  "Payment Gateways",
  "Oracle Services",
  "External Data Feeds",
];

export interface TechnologyStackItem {
  id: string;
  title: string;
  description: string;
}

export const technologyStackSectionTitle = "ADVANCED TECHNOLOGY STACK";

export const technologyStack: readonly TechnologyStackItem[] = [
  {
    id: "blockchain",
    title: "Blockchain",
    description:
      "Ethereum blockchain for secure, immutable and transparent record-keeping.",
  },
  {
    id: "smart-contracts",
    title: "Smart Contracts",
    description:
      "Audited, upgradable and compliant smart contracts to manage token lifecycle.",
  },
  {
    id: "cloud-infrastructure",
    title: "Cloud Infrastructure",
    description: "Hosted on AWS with multi-region redundancy and auto-scaling.",
  },
  {
    id: "apis-integrations",
    title: "APIs & Integrations",
    description:
      "Robust APIs for partners, exchanges and enterprise integrations.",
  },
  {
    id: "data-analytics",
    title: "Data Analytics",
    description: "Real-time analytics, market data and portfolio intelligence.",
  },
];

export const securitySectionTitle = "SECURITY & DATA PROTECTION";

export const securityItems: readonly TechnologyStackItem[] = [
  {
    id: "encryption",
    title: "End-to-end Encryption",
    description: "AES-256 encryption for all data in transit and at rest.",
  },
  {
    id: "multi-layer",
    title: "Multi-Layer Security",
    description: "Firewalls, WAF, intrusion detection and DDoS protection.",
  },
  {
    id: "access-controls",
    title: "Access Controls",
    description: "MFA, role-based access and least privilege principle.",
  },
  {
    id: "monitoring",
    title: "Continuous Monitoring",
    description: "24/7 SIEM monitoring, threat detection and alerts.",
  },
  {
    id: "audits",
    title: "Regular Audits",
    description: "Penetration testing, code audits and compliance assessments.",
  },
];

export const onChainSectionTitle = "ON-CHAIN TRANSPARENCY";

export const onChainIntro =
  "Every GemReserve token is backed by a real gemstone and verifiable on-chain.";

export const onChainItems: readonly TechnologyStackItem[] = [
  {
    id: "proof-of-reserves",
    title: "Proof of Gem Reserves",
    description: "On-chain verification of asset ownership and reserves.",
  },
  {
    id: "immutable-records",
    title: "Immutable Records",
    description: "All transactions and events are permanently recorded.",
  },
  {
    id: "token-traceability",
    title: "Token Traceability",
    description: "Complete traceability from mine to market.",
  },
  {
    id: "audit-ready",
    title: "Audit & Compliance Ready",
    description: "Built for regulatory compliance and third-party audits.",
  },
];

export interface SectionImage {
  alt: string;
}

/**
 * The board pairs the security list with a photograph of a safe holding a single
 * lit gemstone, and the on-chain list with a specimen asset passport. Both are
 * artwork rather than interface, so only their alt text lives here.
 */
export const securityVaultImage: SectionImage = {
  alt: "A black security safe standing open, a lit violet gemstone on a pedestal inside it",
};

export const passportImage: SectionImage = {
  alt: "A specimen GemReserve digital asset passport card for an emerald, listing its passport ID, weight, origin and laboratory report alongside a verification QR code",
};

export const technologyCtaImage: SectionImage = {
  alt: "An aisle of server racks lit by amber status lights",
};

export interface TechnologyHighlight {
  id: string;
  value: string;
  label: string;
}

export const highlightsSectionTitle = "TECHNOLOGY HIGHLIGHTS";

export const technologyHighlights: readonly TechnologyHighlight[] = [
  { id: "uptime", value: "99.99%", label: "SYSTEM UPTIME" },
  { id: "encryption", value: "256-BIT", label: "ENCRYPTION" },
  { id: "monitoring", value: "24/7", label: "MONITORING" },
  { id: "infrastructure", value: "MULTI-REGION", label: "AWS INFRASTRUCTURE" },
  { id: "audited", value: "AUDITED", label: "SMART CONTRACTS" },
  { id: "on-chain", value: "ON-CHAIN", label: "PROOF OF RESERVES" },
];

export interface TechnologyCta {
  title: string;
  description: string;
  buttonLabel: string;
  supportingText: string;
}

export const technologyCta: TechnologyCta = {
  title: "TECHNOLOGY YOU CAN TRUST. ASSETS YOU CAN OWN.",
  description:
    "GemReserve.io combines the reliability of institutional infrastructure with the transparency of blockchain to deliver a secure, liquid and transparent marketplace for precious gemstones.",
  buttonLabel: "Join the Future",
  supportingText: "Be part of the gemstone revolution.",
};
