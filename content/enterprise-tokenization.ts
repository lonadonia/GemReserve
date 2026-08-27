/**
 * Enterprise Tokenization Services — transcribed from the client's supplied
 * board.
 *
 * This is a service page, and everything on it describes what GemReserve offers
 * to do rather than what it has already done for a named client. No customer,
 * deployment, integration, SLA, contract term, certification or revenue figure
 * appears here, because the board states none: "proven expertise" and "curated
 * network" are the client's own words for its capability, and they are carried
 * across as capability rather than restated as a deployed relationship.
 *
 * The asset classes at the foot of the board are the range the platform is
 * built to handle. They are stated that way — what we tokenize — and not as a
 * portfolio of assets already under management.
 */

export interface EnterpriseServicesHero {
  readonly breadcrumb: readonly [string, string];
  readonly titleLines: readonly [string, string];
  readonly tagline: string;
  readonly paragraphs: readonly string[];
  readonly callout: { readonly title: string; readonly line: string };
}

export const enterpriseServicesHero: EnterpriseServicesHero = {
  breadcrumb: ["Home", "Enterprise Tokenization Services"],
  titleLines: ["ENTERPRISE", "TOKENIZATION SERVICES"],
  tagline: "Transform Real Assets Into Digital Value.",
  paragraphs: [
    "GemReserve.io provides end-to-end tokenization solutions for enterprises, institutions, and asset owners. We combine deep domain expertise, robust compliance, and cutting-edge blockchain technology to create secure, transparent, and liquid markets for real-world assets.",
  ],
  callout: {
    title: "REAL ASSETS. REAL VALUE. REAL TRUST.",
    line: "Tokenize with confidence. Scale with integrity.",
  },
};

export interface EnterpriseMark {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export const enterpriseServicesMarks: readonly EnterpriseMark[] = [
  {
    id: "end-to-end",
    title: "END-TO-END SOLUTIONS",
    description:
      "From asset onboarding to token issuance and secondary market enablement.",
  },
  {
    id: "institutional-grade",
    title: "INSTITUTIONAL GRADE",
    description:
      "Built with compliance, security, and transparency at every layer.",
  },
  {
    id: "global-reach",
    title: "GLOBAL REACH",
    description:
      "Access a worldwide investor network and expand your asset's market potential.",
  },
  {
    id: "enhanced-liquidity",
    title: "ENHANCED LIQUIDITY",
    description:
      "Unlock liquidity and enable fractional ownership for greater market efficiency.",
  },
  {
    id: "data-insights",
    title: "DATA & INSIGHTS",
    description:
      "Real-time analytics and reporting for informed decision-making.",
  },
  {
    id: "dedicated-partnership",
    title: "DEDICATED PARTNERSHIP",
    description:
      "White-glove support and custom solutions tailored to your needs.",
  },
];

export interface EnterpriseService {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export const enterpriseServices = {
  title: "OUR TOKENIZATION SERVICES",
  items: [
    {
      id: "evaluation",
      title: "ASSET EVALUATION & ONBOARDING",
      description:
        "We assess, verify, and onboard your real assets with industry-leading due diligence and compliance.",
    },
    {
      id: "structuring",
      title: "STRUCTURING & COMPLIANCE",
      description:
        "We structure token models that align with your business objectives and regulatory requirements.",
    },
    {
      id: "smart-contracts",
      title: "TOKEN CREATION & SMART CONTRACTS",
      description:
        "We develop secure, audited smart contracts and mint tokens on leading blockchain networks.",
    },
    {
      id: "custody",
      title: "CUSTODY & ASSET SECURITY",
      description:
        "Your assets are protected in insured, institution-grade vaults with 24/7 monitoring.",
    },
    {
      id: "issuance",
      title: "PRIMARY TOKEN ISSUANCE",
      description:
        "We manage your token launch with seamless issuance and investor onboarding.",
    },
    {
      id: "secondary-market",
      title: "SECONDARY MARKET ENABLEMENT",
      description:
        "We provide liquidity solutions and marketplace integration to support trading, settlement, and transfers.",
    },
    {
      id: "admin",
      title: "ONGOING ADMIN & REPORTING",
      description:
        "We deliver continuous reporting, distributions, and lifecycle management.",
    },
  ] as const satisfies readonly EnterpriseService[],
};

export const enterprisePartner = {
  title: "WHY PARTNER WITH GEMRESERVE.IO?",
  points: [
    "Proven expertise in real asset tokenization and blockchain technology",
    "Regulatory-first approach with global compliance standards (KYC/AML, data protection, and more)",
    "Secure infrastructure with enterprise-grade technology and risk management",
    "Access to a curated network of investors, institutions, and markets",
    "Customizable solutions that scale with your business",
    "Long-term partnership focused on sustainable growth and value creation",
  ],
  statement: {
    titleLines: ["WE TOKENIZE VALUE.", "YOU UNLOCK POTENTIAL."],
    description:
      "From precious gemstones to other high-value assets, we turn what you own into opportunities the world can access.",
    imageAlt: "A layered blockchain lattice rendered in cyan on dark ground",
  },
};

export interface EnterpriseProcessStep {
  readonly id: string;
  readonly step: number;
  readonly title: string;
  readonly description: string;
}

export const enterpriseProcess = {
  title: "OUR TOKENIZATION PROCESS",
  steps: [
    {
      id: "discover",
      step: 1,
      title: "DISCOVER",
      description: "Understand your asset, goals, and requirements.",
    },
    {
      id: "structure",
      step: 2,
      title: "STRUCTURE",
      description: "Design the optimal tokenization model.",
    },
    {
      id: "secure",
      step: 3,
      title: "SECURE & PREPARE",
      description:
        "Store assets in secure custody and prepare smart contracts.",
    },
    {
      id: "tokenize",
      step: 4,
      title: "TOKENIZE",
      description: "Issue tokens and onboard investors.",
    },
    {
      id: "distribute",
      step: 5,
      title: "DISTRIBUTE",
      description: "Enable trading, liquidity, and global market access.",
    },
    {
      id: "manage",
      step: 6,
      title: "MANAGE & GROW",
      description:
        "Provide ongoing support, reporting, and asset performance insights.",
    },
  ] as const satisfies readonly EnterpriseProcessStep[],
};

export interface AssetClass {
  readonly id: string;
  readonly titleLines: readonly [string, string];
}

/**
 * The range the platform is built to tokenize, as the board sets it out.
 *
 * The board illustrates each category with a photograph. The client supplied
 * artwork for gemstones and minerals only — there is none for watches, fine
 * art, buildings or wind farms — so rather than sourcing or generating pictures
 * of assets GemReserve does not hold, the categories are drawn in the site's
 * own icon language. The seven categories and their labels are the board's;
 * only the illustration changes, and it now claims nothing.
 */
export const enterpriseAssetClasses = {
  title: "WE TOKENIZE A WIDE RANGE OF REAL ASSETS",
  tagline: "YOUR ASSETS. OUR TECHNOLOGY. LIMITLESS POSSIBILITIES.",
  items: [
    { id: "gemstones", titleLines: ["PRECIOUS", "GEMSTONES"] },
    { id: "minerals", titleLines: ["MINERALS &", "RAW MATERIALS"] },
    { id: "metals", titleLines: ["PRECIOUS", "METALS"] },
    { id: "luxury", titleLines: ["LUXURY", "GOODS"] },
    { id: "art", titleLines: ["FINE ART &", "COLLECTIBLES"] },
    { id: "real-estate", titleLines: ["REAL ESTATE &", "PROPERTIES"] },
    { id: "infrastructure", titleLines: ["INFRASTRUCTURE &", "ENERGY"] },
  ] as const satisfies readonly AssetClass[],
};

export const enterpriseServicesCta = {
  titleLines: ["READY TO TOKENIZE", "YOUR ASSETS?"],
  description: "Let's build the future of real asset ownership—together.",
  buttonLabel: "Join the Early Participation Waitlist",
  supportingText: "Limited enterprise onboarding slots available.",
  marks: [
    {
      id: "secure",
      title: "SECURE",
      description:
        "Your assets are protected with top-tier security and encryption.",
    },
    {
      id: "compliant",
      title: "COMPLIANT",
      description: "We adhere to global regulations and best practices.",
    },
    {
      id: "transparent",
      title: "TRANSPARENT",
      description: "On-chain transparency and real-time reporting.",
    },
    {
      id: "global-access",
      title: "GLOBAL ACCESS",
      description: "Reach investors anywhere in the world, 24/7.",
    },
    {
      id: "real-value",
      title: "REAL VALUE",
      description: "Built for long-term value creation and sustainable growth.",
    },
  ] as const satisfies readonly EnterpriseMark[],
};
