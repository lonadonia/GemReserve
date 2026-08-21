export interface EnterpriseHeroContent {
  breadcrumb: readonly [string, string];
  titleLines: readonly [string, string];
  tagline: string;
  description: string;
  callout: { title: string; description: string };
}

export const enterpriseHero: EnterpriseHeroContent = {
  breadcrumb: ["Home", "Enterprise Services"],
  titleLines: ["ENTERPRISE", "SERVICES"],
  tagline: "Tokenize. Transform. Thrive.",
  description:
    "GemReserve.io empowers enterprises, institutions, and asset creators with end-to-end tokenization solutions. We combine industry expertise, regulatory compliance, and blockchain technology to help you unlock new value, increase liquidity, and reach global markets.",
  callout: {
    title: "REAL ASSETS. REAL VALUE. REAL TRUST.",
    description:
      "Enterprise solutions built on integrity, transparency, and security.",
  },
};

export interface EnterpriseSolution {
  id: string;
  title: string;
  description: string;
  items: readonly string[];
}

export const solutionsSectionTitle = "OUR ENTERPRISE SOLUTIONS";

export const enterpriseSolutions: readonly EnterpriseSolution[] = [
  {
    id: "asset-tokenization",
    title: "ASSET TOKENIZATION",
    description:
      "Tokenize real-world assets with full compliance and institutional-grade security.",
    items: [
      "Real estate",
      "Precious metals",
      "Gemstones",
      "Commodities",
      "Art & collectibles",
    ],
  },
  {
    id: "regulatory-compliance",
    title: "REGULATORY & COMPLIANCE",
    description:
      "Navigate global regulations with confidence. We ensure full compliance with international standards.",
    items: [
      "KYC/AML",
      "Data protection",
      "Securities laws",
      "Jurisdictional advisory",
      "Reporting & audits",
    ],
  },
  {
    id: "custody-asset-security",
    title: "CUSTODY & ASSET SECURITY",
    description:
      "Institutional-grade custody solutions to protect your assets and digital tokens.",
    items: [
      "Multi-layer security",
      "Cold storage",
      "Insurance coverage",
      "24/7 monitoring",
      "Disaster recovery",
    ],
  },
  {
    id: "smart-contract-development",
    title: "SMART CONTRACT DEVELOPMENT",
    description:
      "Custom smart contracts audited for security, efficiency, and compliance.",
    items: [
      "Custom token standards",
      "Automated compliance",
      "Escrow & payments",
      "Governance models",
      "Upgradability",
    ],
  },
  {
    id: "liquidity-market-enablement",
    title: "LIQUIDITY & MARKET ENABLEMENT",
    description:
      "Increase liquidity and connect your assets to global capital markets.",
    items: [
      "Secondary markets",
      "Liquidity pools",
      "Market making",
      "Trading integrations",
      "Global distribution",
    ],
  },
  {
    id: "white-label-platform",
    title: "WHITE-LABEL & PLATFORM SOLUTIONS",
    description:
      "Launch your own tokenization platform with our white-label infrastructure and support.",
    items: [
      "Custom branding",
      "Modular architecture",
      "API & integrations",
      "Scalable infrastructure",
      "Dedicated support",
    ],
  },
];

export const solutionActionLabel = "LEARN MORE";

export interface EnterpriseStep {
  id: string;
  step: 1 | 2 | 3 | 4 | 5 | 6;
  title: string;
  description: string;
}

export const processSectionTitle = "OUR ENTERPRISE PROCESS";

export const enterpriseProcess: readonly EnterpriseStep[] = [
  {
    id: "discover",
    step: 1,
    title: "DISCOVER",
    description: "We understand your business, assets, and objectives.",
  },
  {
    id: "design",
    step: 2,
    title: "DESIGN",
    description: "We design a tailored tokenization strategy and solution.",
  },
  {
    id: "comply",
    step: 3,
    title: "COMPLY & PREPARE",
    description:
      "We ensure regulatory compliance and prepare your assets for tokenization.",
  },
  {
    id: "tokenize",
    step: 4,
    title: "TOKENIZE",
    description: "We tokenize your assets with secure smart contracts.",
  },
  {
    id: "launch",
    step: 5,
    title: "LAUNCH & DISTRIBUTE",
    description:
      "We launch your tokens and connect to global markets and investors.",
  },
  {
    id: "manage",
    step: 6,
    title: "MANAGE & GROW",
    description:
      "We provide ongoing support, analytics, and growth strategies.",
  },
];

export interface EnterpriseBenefit {
  id: string;
  title: string;
  description: string;
}

export const benefitsSectionTitle =
  "THE BENEFITS OF PARTNERING WITH GEMRESERVE.IO";

export const enterpriseBenefits: readonly EnterpriseBenefit[] = [
  {
    id: "global-reach",
    title: "GLOBAL REACH",
    description:
      "Access a worldwide network of investors, partners, and markets.",
  },
  {
    id: "increased-liquidity",
    title: "INCREASED LIQUIDITY",
    description:
      "Unlock liquidity for traditionally illiquid assets and create new revenue streams.",
  },
  {
    id: "security-trust",
    title: "SECURITY & TRUST",
    description:
      "Enterprise-grade security, transparency, and verifiable ownership.",
  },
  {
    id: "operational-efficiency",
    title: "OPERATIONAL EFFICIENCY",
    description:
      "Automate processes, reduce costs, and improve efficiency with blockchain technology.",
  },
  {
    id: "fractional-ownership",
    title: "FRACTIONAL OWNERSHIP",
    description: "Enable fractional ownership and broaden your investor base.",
  },
  {
    id: "data-insights",
    title: "DATA & INSIGHTS",
    description:
      "Real-time analytics and reporting for informed decision-making.",
  },
  {
    id: "sustainable-growth",
    title: "SUSTAINABLE GROWTH",
    description: "Build long-term value with scalable, future-proof solutions.",
  },
  {
    id: "dedicated-support",
    title: "DEDICATED SUPPORT",
    description:
      "Our expert team supports you at every step of your enterprise journey.",
  },
];

export interface EnterpriseCta {
  titleLines: readonly [string, string];
  description: string;
  primaryLabel: string;
  dividerLabel: string;
  secondaryLabel: string;
  assurances: readonly string[];
}

export const enterpriseCta: EnterpriseCta = {
  titleLines: ["READY TO TOKENIZE", "YOUR ENTERPRISE?"],
  description:
    "Let's build the future of asset ownership together. Contact our enterprise team to discuss your needs or join the Early Participation Waitlist.",
  primaryLabel: "JOIN THE WAITLIST",
  dividerLabel: "or",
  secondaryLabel: "CONTACT ENTERPRISE TEAM",
  assurances: ["Secure. Compliant. Global.", "Solutions built for tomorrow."],
};

export const trustedBySectionTitle =
  "TRUSTED BY INNOVATORS. BUILT FOR LEADERS.";

export interface TrustedAudience {
  id: string;
  label: string;
}

export const trustedAudiences: readonly TrustedAudience[] = [
  { id: "asset-owners", label: "Asset Owners" },
  { id: "institutional-investors", label: "Institutional Investors" },
  { id: "financial-institutions", label: "Financial Institutions" },
  { id: "family-offices", label: "Family Offices" },
  { id: "tech-partners", label: "Tech Partners" },
  { id: "marketplaces", label: "Marketplaces" },
  { id: "global-enterprises", label: "Global Enterprises" },
];
