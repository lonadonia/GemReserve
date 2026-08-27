/**
 * Technology, Licensing & White Label — transcribed from the client's supplied
 * board.
 *
 * The distinction this page has to hold is between what the platform *can* do
 * and what it has *already done for someone*. The board describes capability
 * throughout — what the infrastructure provides, what a licensee would receive,
 * what a white-label deployment would include — and names no licensee, no API
 * customer, no integration, no certification body and no contractual term. None
 * are added here.
 *
 * The board's white-label section illustrates the offer with a mocked-up
 * dashboard carrying figures: $125,430,000 in total assets, 86 tokenized
 * assets, 1,248 investors, $98,760,000 total value locked, and two priced
 * gemstone listings. Those are placeholder numbers in a device mockup, not
 * platform metrics — GemReserve is pre-launch and holds none of them. The
 * preview here therefore shows the shape of a branded deployment (the panels a
 * licensee's dashboard would carry) with no figures in it at all, and is
 * labelled as an illustration.
 *
 * "Access our licensed entity framework" is the board's own wording and is kept
 * as written; it is not restated as a claim to hold any particular licence.
 */

export interface LicensingHeroContent {
  readonly breadcrumb: readonly [string, string];
  readonly titleLines: readonly [string, string, string];
  readonly taglineLines: readonly [string, string];
  readonly description: string;
  readonly callout: {
    readonly title: string;
    readonly lines: readonly [string, string];
  };
}

export const licensingHero: LicensingHeroContent = {
  breadcrumb: ["Home", "Technology, Licensing & White Label"],
  titleLines: ["TECHNOLOGY,", "LICENSING &", "WHITE LABEL"],
  taglineLines: [
    "Enterprise-Grade Infrastructure.",
    "Limitless Possibilities.",
  ],
  description:
    "GemReserve.io combines cutting-edge blockchain technology, robust licensing frameworks, and flexible white-label solutions to empower businesses to tokenize real assets, launch new markets, and build next-generation financial products.",
  callout: {
    title: "REAL ASSETS. REAL VALUE. REAL TRUST.",
    lines: [
      "Powered by technology. Secured by compliance.",
      "Delivered for your success.",
    ],
  },
};

export interface LicensingPillar {
  readonly id: string;
  readonly titleLines: readonly [string, string];
  readonly description: string;
}

export const licensingFoundation = {
  title: "OUR TECHNOLOGY FOUNDATION",
  items: [
    {
      id: "blockchain",
      titleLines: ["BLOCKCHAIN", "INFRASTRUCTURE"],
      description:
        "Built on leading blockchain networks for security, transparency, and immutability.",
    },
    {
      id: "smart-contracts",
      titleLines: ["SMART", "CONTRACTS"],
      description:
        "Audited, secure, and upgradeable smart contracts automate tokenization, compliance, and asset management.",
    },
    {
      id: "security",
      titleLines: ["SECURITY", "BY DESIGN"],
      description:
        "Multi-layer security architecture with encryption, cold storage, and 24/7 monitoring to protect assets and data.",
    },
    {
      id: "scalable",
      titleLines: ["SCALABLE", "& FLEXIBLE"],
      description:
        "Modular architecture that scales with your business, from private deployments to global enterprise networks.",
    },
    {
      id: "cloud-api",
      titleLines: ["CLOUD & API", "INTEGRATION"],
      description:
        "Seamless API connectivity and cloud infrastructure for easy integration with your existing systems.",
    },
    {
      id: "analytics",
      titleLines: ["DATA &", "ANALYTICS"],
      description:
        "Real-time data, on-chain analytics, and reporting tools for informed decision-making.",
    },
  ] as const satisfies readonly LicensingPillar[],
};

export const licensingCompliance = {
  title: "LICENSING & COMPLIANCE",
  paragraphs: [
    "Our platform is built on a foundation of regulatory excellence and global compliance.",
    "We provide the licensing, legal structure, and compliance frameworks you need to operate with confidence in any jurisdiction.",
  ],
  imageAlt: "A gold shield bearing a check mark over a lit world map",
  items: [
    {
      id: "regulatory",
      titleLines: ["REGULATORY", "FRAMEWORK"],
      description:
        "Operate within robust legal frameworks and regulatory guidelines.",
    },
    {
      id: "kyc-aml",
      titleLines: ["KYC / AML", "COMPLIANCE"],
      description:
        "Built-in KYC/AML workflows, sanctions screening, and risk management.",
    },
    {
      id: "licensed-structure",
      titleLines: ["LICENSED", "STRUCTURE"],
      description:
        "Access our licensed entity framework to support your tokenization needs.",
    },
    {
      id: "global-coverage",
      titleLines: ["GLOBAL", "COVERAGE"],
      description:
        "Compliant solutions designed to meet international standards and local regulations.",
    },
  ] as const satisfies readonly LicensingPillar[],
};

export const licensingWhiteLabel = {
  eyebrow: "WHITE LABEL SOLUTIONS",
  titleLines: ["Launch Your Brand.", "Powered by Our Technology."],
  description:
    "Our white-label solutions enable you to launch your own tokenization platform or asset marketplace under your brand, powered by GemReserve.io's secure and proven infrastructure.",
  points: [
    "Fully customizable platform and user experience",
    "Your brand, your domain, your identity",
    "End-to-end asset tokenization and management",
    "Integrated compliance, KYC/AML, and reporting",
    "Ongoing technical support and platform updates",
    "Faster time-to-market with lower development costs",
  ],
  note: "Whether you are a bank, fintech, asset manager, exchange, or enterprise, our white-label solutions help you deliver real value to your clients—faster.",
  /**
   * The shape of a licensee's deployment, drawn as an unpopulated interface.
   * The board's mockup carries invented totals; this shows the same panels with
   * no figures, because GemReserve holds none to report.
   */
  preview: {
    label: "ILLUSTRATION — A BRANDED DEPLOYMENT",
    brand: "YOUR BRAND",
    nav: [
      "Dashboard",
      "Assets",
      "Tokenization",
      "Investors",
      "Transactions",
      "Compliance",
      "Reports",
      "Settings",
    ],
    panels: [
      "Total assets",
      "Tokenized assets",
      "Total investors",
      "Total value locked",
    ],
    charts: ["Portfolio value", "Asset allocation"],
    footnote:
      "Panels shown without data. Figures appear once a deployment is live.",
  },
};

export interface LicensingFutureMark {
  readonly id: string;
  readonly titleLines: readonly [string, string];
  readonly description: string;
}

export const licensingFuture = {
  title: "BUILT FOR THE FUTURES",
  items: [
    {
      id: "future-proof",
      titleLines: ["FUTURE-PROOF", "TECHNOLOGY"],
      description:
        "Continuously evolving to support new assets, markets, and innovations.",
    },
    {
      id: "sustainable",
      titleLines: ["SUSTAINABLE", "& RESPONSIBLE"],
      description:
        "Promoting transparency, ethical sourcing, and sustainable growth.",
    },
    {
      id: "partnerships",
      titleLines: ["STRATEGIC", "PARTNERSHIPS"],
      description:
        "Collaborate with industry leaders and technology innovators worldwide.",
    },
    {
      id: "innovation",
      titleLines: ["INNOVATION", "AT THE CORE"],
      description:
        "Driving the future of real asset tokenization and digital finance.",
    },
    {
      id: "support",
      titleLines: ["DEDICATED", "SUPPORT"],
      description:
        "Expert team supporting your success at every step of the journey.",
    },
    {
      id: "opportunities",
      titleLines: ["GLOBAL", "OPPORTUNITIES"],
      description: "Unlock new markets, investors, and growth opportunities.",
    },
  ] as const satisfies readonly LicensingFutureMark[],
};

export const licensingCta = {
  titleLines: ["READY TO BUILD", "THE FUTURE?"],
  description: "Partner with GemReserve.io and bring your vision to life.",
  buttonLabel: "Join the Waitlist",
  alternativeLabel: "or",
  secondaryLabel: "Contact our team",
  email: "enterprise@gemreserve.io",
};
