import type { GemstonePageContent } from "./gemstone-page";

export const roughRubyHighlights: GemstonePageContent["highlights"] = [
  {
    id: "natural",
    title: "NATURAL & UNTREATED",
    description: "100% natural rough ruby. No heat or chemical treatments.",
  },
  {
    id: "custody",
    title: "SECURE CUSTODY",
    description:
      "Stored in high-security facilities with full insurance and 24/7 monitoring.",
  },
  {
    id: "authenticated",
    title: "AUTHENTICATED",
    description: "Every batch is verified by leading gemological laboratories.",
  },
  {
    id: "tokenized",
    title: "TOKENIZED OWNERSHIP",
    description:
      "Fractional ownership via blockchain for global access and liquidity.",
  },
  {
    id: "liquidity",
    title: "GLOBAL LIQUIDITY",
    description: "Trade securely on our platform’s marketplace.",
  },
];

export const roughRubyPromise: NonNullable<GemstonePageContent["promise"]> = {
  title: "REAL ASSETS. REAL VALUE. REAL TRUST.",
  description:
    "Every stone is ethically sourced, expertly selected, authenticated, and securely stored. Transparency at every step.",
};

export function roughRubyCustody(
  intro: string,
): NonNullable<GemstonePageContent["custody"]> {
  return {
    title: "SECURE CUSTODY",
    intro,
    items: [
      "24/7 Surveillance & Access Control",
      "Climate-Controlled Environment",
      "Full Insurance Coverage",
      "Regular Audits & Inventory Verification",
    ],
    imageSrc: "/images/sections/open-vault.webp",
    imageAlt: "An open institutional vault holding faceted gemstones",
  };
}

export function roughRubyProcess(
  sourceDescription: string,
  tokenizationDescription = "Rubies are tokenized on the blockchain, representing fractional ownership.",
): NonNullable<GemstonePageContent["process"]> {
  return {
    title: "OUR TOKENIZATION PROCESS",
    steps: [
      {
        id: "sourcing",
        step: 1,
        title: "Sourcing",
        description: sourceDescription,
      },
      {
        id: "authentication",
        step: 2,
        title: "Authentication",
        description:
          "Each batch is tested and certified by leading gemological laboratories.",
      },
      {
        id: "tokenization",
        step: 3,
        title: "Tokenization",
        description: tokenizationDescription,
      },
      {
        id: "custody",
        step: 4,
        title: "Custody & Management",
        description:
          "Assets are securely stored and managed for the benefit of token holders.",
      },
    ],
  };
}

export const roughRubyTrust: NonNullable<GemstonePageContent["trust"]> = [
  {
    id: "transparent",
    title: "TRANSPARENT",
    description: "Clear information and complete transparency.",
  },
  {
    id: "secure",
    title: "SECURE",
    description: "Enterprise-grade security to protect your assets.",
  },
  {
    id: "trusted",
    title: "TRUSTED",
    description: "Backed by real assets, audited and insured.",
  },
  {
    id: "accessible",
    title: "ACCESSIBLE",
    description: "Invest from anywhere in the world.",
  },
  {
    id: "support",
    title: "SUPPORT",
    description: "Dedicated support team at every step.",
  },
];
