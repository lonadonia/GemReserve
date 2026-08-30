/**
 * Risk Disclosure — transcribed from the client's supplied board.
 *
 * This is legal content and it is transcribed as written. Not one of the twelve
 * risk factors is shortened, softened, reordered by severity or moved below the
 * fold, and none of the six important notes is dropped. A risk disclosure that
 * has been edited for tone is not a risk disclosure.
 *
 * One addition was necessary rather than optional. The board's closing note
 * reads "By using our platform, you agree to our Terms of Use, Privacy Policy,
 * and all applicable disclosures." Neither document is published yet — see
 * content/documents.ts — so a reader cannot have agreed to them. The note keeps
 * its wording and is followed by a statement of that fact, because telling
 * someone they have agreed to terms they have never been shown is itself the
 * kind of thing this page exists to warn about.
 */

export interface RiskHeroContent {
  readonly breadcrumb: readonly [string, string];
  readonly titleLines: readonly [string, string];
  readonly taglineLines: readonly [string, string];
  readonly description: string;
  readonly callout: {
    readonly title: string;
    readonly lines: readonly [string, string];
  };
}

export const riskHero: RiskHeroContent = {
  breadcrumb: ["Home", "Risk Disclosure"],
  titleLines: ["RISK", "DISCLOSURE"],
  taglineLines: [
    "Important Information for Platform Users",
    "and Potential Investors",
  ],
  description:
    "GemReserve.io provides access to tokenized gemstone assets and related services. Before using our platform or participating in any offering, please carefully read this Risk Disclosure. Investing and transacting in tokenized assets involves significant risks.",
  callout: {
    title: "REAL ASSETS. REAL VALUE. REAL TRUST.",
    lines: [
      "Transparency, security and informed decisions",
      "are at the core of everything we do.",
    ],
  },
};

export const readCarefully = {
  title: "PLEASE READ CAREFULLY",
  body: "This Risk Disclosure forms an integral part of our Terms of Use and all related agreements. By accessing or using GemReserve.io, you acknowledge that you have read, understood, and accept the risks described herein.",
};

export interface RiskFactor {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export const factorsSectionTitle = "KEY RISK FACTORS";

export const riskFactors: readonly RiskFactor[] = [
  {
    id: "market",
    title: "MARKET RISK",
    description:
      "The value of tokenized gemstone assets may fluctuate due to market conditions, supply and demand, economic events, and investor sentiment. You may lose some or all of your investment.",
  },
  {
    id: "technology",
    title: "TECHNOLOGY RISK",
    description:
      "Blockchain technology, smart contracts, and platform infrastructure may experience failures, bugs, downtime, or security vulnerabilities that could impact availability or asset value.",
  },
  {
    id: "security",
    title: "SECURITY RISK",
    description:
      "Despite our best efforts, cyberattacks, hacking, phishing, malware, or other unauthorized activities may occur, resulting in loss, theft, or compromise of digital assets or data.",
  },
  {
    id: "regulatory",
    title: "REGULATORY RISK",
    description:
      "Laws and regulations governing digital assets and tokenized securities are evolving and may change. Future regulatory actions could affect the legality, transferability, or value of your assets.",
  },
  {
    id: "liquidity",
    title: "LIQUIDITY RISK",
    description:
      "Secondary markets for tokenized gemstone assets may be limited or illiquid. You may not be able to buy or sell your tokens at the time or price you desire.",
  },
  {
    id: "valuation",
    title: "VALUATION RISK",
    description:
      "Gemstone valuation involves professional appraisals and market estimates that may not always be accurate and can change over time.",
  },
  {
    id: "custody",
    title: "CUSTODY & STORAGE RISK",
    description:
      "Physical gemstones are stored in secure facilities; however, risks such as theft, damage, natural disasters, or operational errors could impact the underlying assets.",
  },
  {
    id: "smart-contract",
    title: "SMART CONTRACT RISK",
    description:
      "Smart contracts are self-executing and immutable. Errors in code or design could lead to unexpected behavior or loss of funds and cannot be reversed.",
  },
  {
    id: "currency",
    title: "CURRENCY RISK",
    description:
      "Token prices and on-chain values may be affected by currency exchange rate fluctuations, inflation, and macro-economic conditions.",
  },
  {
    id: "counterparty",
    title: "COUNTERPARTY RISK",
    description:
      "Third-party service providers, custodians, exchanges, and partners may fail to perform their obligations, which could adversely affect your assets or transactions.",
  },
  {
    id: "concentration",
    title: "CONCENTRATION RISK",
    description:
      "Investments concentrated in a single type of gemstone, geographic region, or market may be more vulnerable to adverse events affecting that area or asset class.",
  },
  {
    id: "no-guarantee",
    title: "NO GUARANTEE",
    description:
      "Past performance is not indicative of future results. We do not guarantee any level of return, liquidity, or the success of the platform or asset value.",
  },
];

export interface ImportantNote {
  readonly id: string;
  readonly text: string;
}

export const notesSectionTitle = "IMPORTANT NOTES";

export const importantNotes: readonly ImportantNote[] = [
  {
    id: "no-advice",
    text: "GemReserve.io does not provide investment, legal, tax, or financial advice. You should consult with your own professional advisors before making any investment decision.",
  },
  {
    id: "not-deposits",
    text: "Tokenized gemstone assets are not bank deposits and are not insured by any government agency.",
  },
  {
    id: "restricted",
    text: "Access to the platform and participation in token offerings may be restricted in certain jurisdictions.",
  },
  {
    id: "compliance",
    text: "You are solely responsible for complying with all applicable laws and regulations in your jurisdiction.",
  },
  {
    id: "afford",
    text: "Invest only what you can afford to lose.",
  },
  {
    id: "agreements",
    text: "By using our platform, you agree to our Terms of Use, Privacy Policy, and all applicable disclosures.",
  },
];

export const agreementsNote = {
  title: "ON THE DOCUMENTS NAMED ABOVE",
  body: "The Terms of Use and the Privacy Policy are in preparation and are not yet published. Nothing on this site currently asks you to agree to either, and no account, participation or transaction is available. Both documents are published before any of that opens, and are listed in the document library meanwhile.",
  link: { label: "Document library", href: "/documents" },
};

export const restrictionsNote = {
  body: "Participation is not available in every country. The current list is published in full.",
  link: {
    label: "Restricted Jurisdictions",
    href: "/restricted-jurisdictions",
  },
};

export const questionsPanel = {
  title: "QUESTIONS ABOUT RISK?",
  description:
    "If you have any questions about the risks associated with our platform or tokenized gemstone assets, please contact our team.",
  buttonLabel: "Contact our team",
  href: "/contact",
};

export interface ClosingMark {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export const closingMarks: readonly ClosingMark[] = [
  {
    id: "transparent",
    title: "TRANSPARENT",
    description: "Clear information and open communication at every step.",
  },
  {
    id: "secure",
    title: "SECURE",
    description: "Enterprise-grade security to protect your assets and data.",
  },
  {
    id: "backed",
    title: "ASSET-BACKED ARCHITECTURE",
    description: "Each token is designed to link to an independently verified gemstone.",
  },
  {
    id: "global",
    title: "GLOBAL",
    description: "Accessible worldwide, with local compliance and support.",
  },
  {
    id: "support",
    title: "DEDICATED SUPPORT",
    description: "Our team is here to help you at every stage of your journey.",
  },
];
