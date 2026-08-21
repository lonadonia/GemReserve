export interface InvestorsHeroContent {
  breadcrumb: readonly [string, string, string];
  titleLines: readonly [string, string];
  tagline: string;
  description: string;
  callout: { title: string; lines: readonly [string, string] };
}

export const investorsHero: InvestorsHeroContent = {
  breadcrumb: ["Home", "Documents", "Investor Presentation"],
  titleLines: ["INVESTOR", "PRESENTATION"],
  tagline: "Real Assets. Real Value. Real Opportunity.",
  description:
    "GemReserve.io is building the global infrastructure for tokenized gemstone assets—uniting the timeless value of real gemstones with the efficiency, transparency, and accessibility of blockchain technology. This presentation provides an overview of our vision, market opportunity, business model, and roadmap.",
  callout: {
    title: "REAL ASSETS. REAL VALUE. REAL TRUST.",
    lines: [
      "Backed by physical gemstones. Secured by blockchain.",
      "Built for generations.",
    ],
  },
};

export const executiveSectionTitle = "EXECUTIVE OVERVIEW";

export const executiveSummary =
  "GemReserve.io is the next-generation platform for tokenized gemstone assets. We enable asset owners to unlock liquidity, investors to access real-world value, and institutions to operate with confidence in a transparent, secure, and compliant ecosystem.";

export interface ExecutiveHighlight {
  id: string;
  title: string;
  description: string;
}

export const executiveHighlights: readonly ExecutiveHighlight[] = [
  {
    id: "market",
    title: "TRILLION-DOLLAR MARKET",
    description:
      "The global gemstone market is valued at over $84B and continues to grow.",
  },
  {
    id: "demand",
    title: "GROWING INVESTOR DEMAND",
    description:
      "Rising interest in real assets, alternative investments, and portfolio diversification.",
  },
  {
    id: "blockchain",
    title: "BLOCKCHAIN ADVANTAGE",
    description:
      "Tokenization brings liquidity, transparency, and global accessibility.",
  },
  {
    id: "generations",
    title: "BUILT FOR GENERATIONS",
    description:
      "Combining timeless value with next-generation infrastructure.",
  },
];

export const marketSectionTitle = "THE MARKET OPPORTUNITY";

export const marketIntro =
  "Tokenizing gemstones opens a massive, underserved market.";

export interface MarketPoint {
  id: string;
  title: string;
  description: string;
}

export const marketFigure = {
  value: "$84B+",
  label: "Global Gemstone Market",
  /** Share of the ring drawn in the accent colour, matching the reference. */
  accentPercent: 62,
};

export const marketPoints: readonly MarketPoint[] = [
  {
    id: "wealth-preservation",
    title: "Wealth Preservation",
    description: "Tangible assets with intrinsic value.",
  },
  {
    id: "limited-supply",
    title: "Limited Supply",
    description: "Natural scarcity drives long-term value.",
  },
  {
    id: "high-demand",
    title: "High Global Demand",
    description: "Jewelry, industrial, and investment demand.",
  },
  {
    id: "inefficient-market",
    title: "Inefficient Market",
    description: "Lack of liquidity, transparency, and accessibility.",
  },
];

export const solutionSectionTitle = "OUR SOLUTION";

export const solutionIntro =
  "GemReserve.io provides a full-stack ecosystem for gemstone asset tokenization.";

export const solutionPoints: readonly MarketPoint[] = [
  {
    id: "asset-backing",
    title: "Asset Backing",
    description:
      "Every token is backed by verified, insured gemstones in secure vaults.",
  },
  {
    id: "digital-passports",
    title: "Digital Asset Passports",
    description:
      "Immutable records with grading, provenance, and ownership history.",
  },
  {
    id: "tokenization-engine",
    title: "Tokenization Engine",
    description:
      "Convert gemstones into blockchain tokens with fractional ownership.",
  },
  {
    id: "global-marketplace",
    title: "Global Marketplace",
    description: "Trade securely with transparency and real-time settlement.",
  },
];

export const whyInvestSectionTitle = "WHY INVEST IN GEMRESERVE.IO";

export const whyInvestPoints: readonly MarketPoint[] = [
  {
    id: "market-fundamentals",
    title: "Strong Market Fundamentals",
    description: "Large addressable market with real-world demand.",
  },
  {
    id: "business-model",
    title: "Proven Business Model",
    description: "Revenue from tokenization, trading fees, and services.",
  },
  {
    id: "scalable",
    title: "Scalable Infrastructure",
    description: "Built to support multiple asset types and global growth.",
  },
  {
    id: "regulatory-first",
    title: "Regulatory-First Approach",
    description: "Compliance, transparency, and investor protection.",
  },
  {
    id: "leadership",
    title: "Experienced Leadership",
    description: "Team with deep expertise in fintech, assets, and blockchain.",
  },
];

export const financialSectionTitle = "FINANCIAL HIGHLIGHTS (PROJECTED)";

export interface FinancialHighlight {
  id: string;
  value: string;
  label: string;
  detail?: string;
}

export const financialHighlights: readonly FinancialHighlight[] = [
  {
    id: "revenue",
    value: "$120M+",
    label: "Projected Platform Revenue by 2027",
  },
  { id: "ebitda", value: "$30M+", label: "EBITDA by 2027" },
  { id: "margin", value: "35%+", label: "Gross Margin", detail: "(Target)" },
  {
    id: "tokenized",
    value: "$1B+",
    label: "Tokenized Assets on Platform by 2027",
  },
  {
    id: "users",
    value: "5M+",
    label: "Users & Investors",
    detail: "(Target by 2027)",
  },
];

export const proceedsSectionTitle = "USE OF PROCEEDS";

export interface ProceedsSlice {
  id: string;
  label: string;
  percent: number;
}

export const proceedsSlices: readonly ProceedsSlice[] = [
  { id: "platform", label: "Platform Development", percent: 35 },
  { id: "acquisition", label: "Asset Acquisition & Vaulting", percent: 25 },
  { id: "marketing", label: "Marketing & Global Expansion", percent: 20 },
  { id: "operations", label: "Operations & Compliance", percent: 10 },
  { id: "team", label: "Team & Advisory", percent: 10 },
];

export const roadmapSectionTitle = "OUR ROADMAP";

export interface RoadmapMilestone {
  id: string;
  year: string;
  title: string;
  description: string;
}

export const roadmapMilestones: readonly RoadmapMilestone[] = [
  {
    id: "foundation",
    year: "2024",
    title: "FOUNDATION",
    description:
      "Platform development, team building, and strategic partnerships.",
  },
  {
    id: "launch",
    year: "2025",
    title: "LAUNCH & TOKENIZATION",
    description: "Platform launch and initial gemstone assets tokenized.",
  },
  {
    id: "expansion",
    year: "2026",
    title: "MARKET EXPANSION",
    description: "Global marketing, new assets, and institutional adoption.",
  },
  {
    id: "scale",
    year: "2027",
    title: "SCALE & INNOVATION",
    description: "Expand asset classes, enhance technology, and grow globally.",
  },
  {
    id: "leadership",
    year: "2028+",
    title: "GLOBAL LEADERSHIP",
    description:
      "Become the world's leading infrastructure for real asset tokenization.",
  },
];

export interface PartnerPanel {
  title: string;
  lines: readonly [string, string];
  buttonLines: readonly [string, string];
  supportingText: string;
}

export const partnerPanel: PartnerPanel = {
  title: "PARTNER WITH US",
  lines: [
    "Join us in building the future of real asset ownership.",
    "Transparent. Secure. Trusted.",
  ],
  buttonLines: ["JOIN THE EARLY", "PARTICIPATION WAITLIST"],
  supportingText: "Limited opportunities available.",
};

export interface AssuranceItem {
  id: string;
  title: string;
  description: string;
}

export const assuranceItems: readonly AssuranceItem[] = [
  {
    id: "backed",
    title: "BACKED BY REAL ASSETS",
    description: "Physical gemstones in secure vaults.",
  },
  {
    id: "secure",
    title: "SECURE & COMPLIANT",
    description: "Built with enterprise-grade security and compliance.",
  },
  {
    id: "transparent",
    title: "TRANSPARENT & AUDITABLE",
    description: "Immutable data and real-time verifiable records.",
  },
  {
    id: "global",
    title: "GLOBAL & ACCESSIBLE",
    description: "Bringing real assets to investors worldwide.",
  },
];
