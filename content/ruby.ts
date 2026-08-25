/**
 * Ruby — transcribed from the client's supplied page board.
 *
 * The market chart remains an illustrative index because the board does not
 * identify a currency, source or underlying market-size dataset.
 */

import type { GemstonePageContent } from "./gemstone-page";

export const ruby: GemstonePageContent = {
  slug: "ruby",
  accent: "ruby",

  breadcrumb: ["Home", "Assets", "All Gemstone Programs", "Ruby"],
  title: "RUBY",
  tagline: ["The Timeless Flame", "of Passion and Power."],
  description:
    "Rubies have been treasured for thousands of years as symbols of love, courage, and royalty. From the finest Burmese rubies to rare natural stones of exceptional color and clarity, rubies are celebrated for their unmatched beauty, rarity, and enduring value.",
  heroBase: "/images/heroes/ruby-hero",
  heroImageAlt: "An emerald-cut deep red ruby resting on black mineral rock",

  highlights: [
    {
      id: "natural",
      title: "NATURAL & RARE",
      description:
        "Rubies occur naturally in limited quantities, making exceptional stones extremely rare.",
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
      description:
        "Every stone is certified by leading gemological laboratories.",
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
  ],

  assurances: [],

  promise: {
    title: "REAL ASSETS. REAL VALUE. REAL TRUST.",
    description:
      "Every ruby is ethically sourced, expertly selected, authenticated, and securely stored. Transparency at every step.",
  },

  glance: {
    title: "RUBY AT A GLANCE",
    items: [
      {
        id: "type",
        label: "Gemstone Type",
        value: "Ruby",
        note: "(Corundum)",
      },
      {
        id: "colour",
        label: "Color Range",
        value: "Vivid Red, Pigeon Blood Red,",
        note: "Pinkish Red",
      },
      {
        id: "origin",
        label: "Origin",
        value: "Myanmar (Burma), Thailand,",
        note: "Sri Lanka, Madagascar, Mozambique, Vietnam",
      },
      { id: "hardness", label: "Hardness (Mohs)", value: "9" },
      {
        id: "clarity",
        label: "Clarity",
        value: "Typically Included",
        note: "(Eye-Clean Possible)",
      },
      {
        id: "certification",
        label: "Certification",
        value: "IGI, GRS, SSEF",
        note: "(As Applicable)",
      },
    ],
  },

  about: {
    title: "ABOUT RUBY",
    paragraphs: [
      "Rubies are the red variety of corundum, the same mineral species as sapphire. Their intense red color, caused by the presence of chromium, has made rubies one of the most desirable gemstones in the world.",
      "Historically associated with nobility, protection, and vitality, rubies have adorned royal crowns and been passed down as heirlooms for generations.",
      "Today, fine rubies remain one of the most sought-after gemstones by collectors and investors.",
    ],
    imageSrc: "/images/sections/ruby-cushion.webp",
    imageAlt: "A cushion-cut deep red ruby",
  },

  investment: {
    title: "INVESTMENT HIGHLIGHTS",
    items: [
      {
        id: "extreme",
        title: "Extreme Rarity",
        description:
          "Fine-quality rubies with vivid color and origin are increasingly scarce.",
      },
      {
        id: "strong-demand",
        title: "Strong Market Demand",
        description:
          "High demand from luxury jewelry, collectors, and global investors.",
      },
      {
        id: "value-appreciation",
        title: "Value Appreciation",
        description: "Historically strong long-term value retention.",
      },
      {
        id: "tangible",
        title: "Tangible Asset",
        description: "Backed by physical gemstones in secure, insured vaults.",
      },
      {
        id: "fractional",
        title: "Fractional Ownership",
        description: "Lower entry point with blockchain transparency.",
      },
    ],
  },

  quality: {
    title: "QUALITY FACTORS",
    items: [
      {
        id: "colour",
        title: "Color",
        description:
          "The most important factor. Vivid, pure red with strong saturation is most valuable.",
      },
      {
        id: "clarity",
        title: "Clarity",
        description: "Fewer inclusions and higher transparency increase value.",
      },
      {
        id: "cut",
        title: "Cut",
        description:
          "Precision cutting enhances brilliance, color, and overall beauty.",
      },
      {
        id: "carat",
        title: "Carat Weight",
        description:
          "Larger rubies with fine color and clarity are highly prized.",
      },
      {
        id: "origin",
        title: "Origin",
        description:
          "Burmese (Myanmar) “Pigeon Blood” rubies are the most sought-after.",
      },
    ],
  },

  custody: {
    title: "SECURE CUSTODY",
    intro: "All rubies are stored in state-of-the-art vaults with:",
    items: [
      "24/7 Surveillance & Access Control",
      "Climate-Controlled Environment",
      "Full Insurance Coverage",
      "Regular Audits & Inventory Verification",
    ],
    imageSrc: "/images/heroes/redemption-hero.webp",
    imageAlt: "A deep red ruby displayed before an open secure vault",
  },

  process: {
    title: "OUR TOKENIZATION PROCESS",
    steps: [
      {
        id: "sourcing",
        step: 1,
        title: "Sourcing",
        description:
          "We source premium rubies from trusted mines and suppliers worldwide.",
      },
      {
        id: "authentication",
        step: 2,
        title: "Authentication",
        description:
          "Stones are graded and certified by leading gemological laboratories.",
      },
      {
        id: "tokenization",
        step: 3,
        title: "Tokenization",
        description:
          "Rubies are tokenized on the blockchain, representing fractional ownership.",
      },
      {
        id: "custody",
        step: 4,
        title: "Custody & Management",
        description:
          "Assets are securely stored and managed for the benefit of token holders.",
      },
    ],
  },

  market: {
    title: "MARKET INSIGHTS",
    description:
      "The global ruby market continues to show resilient growth, driven by luxury demand, limited supply, and increasing investor interest.",
    caption: "Indexed trend, illustrative. 2025 is projected.",
    points: [
      { year: "2020", value: 1.1 },
      { year: "2021", value: 1.3 },
      { year: "2022", value: 1.7 },
      { year: "2023", value: 2.0 },
      { year: "2024", value: 2.4 },
      { year: "2025", value: 3.2 },
    ],
    projectedFrom: "2025",
  },

  cta: {
    title: "OWN A PIECE OF TIMELESS PASSION",
    description:
      "Invest in the enduring beauty and strength of rubies with GemReserve.io. Secure, transparent, and accessible to everyone.",
    buttonLabel: "Join the Waitlist",
    supportingText: "Limited opportunities available.",
    imageSrc: "/images/heroes/redemption-hero.webp",
    imageAlt: "A deep red ruby displayed before an open secure vault",
  },

  trust: [
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
  ],
};
