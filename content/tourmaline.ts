/**
 * Tourmaline — transcribed from the client's supplied page board.
 *
 * The market graphic is intentionally an illustrative index: the board does
 * not publish a currency series or source that could support a market-size
 * claim.
 */

import type { GemstonePageContent } from "./gemstone-page";

export const tourmaline: GemstonePageContent = {
  slug: "tourmaline",
  accent: "tourmaline",

  breadcrumb: ["Home", "Assets", "All Gemstone Programs", "Tourmaline"],
  title: "TOURMALINE",
  tagline: ["Nature’s Spectrum.", "Value in Every Color."],
  description:
    "Tourmaline is one of the most captivating and diverse gemstones, known for its extraordinary range of colors and natural beauty. From deep greens to vivid pinks, blues, and bi-colors, tourmaline is treasured for its rarity, durability, and timeless appeal.",
  heroBase: "/images/heroes/tourmaline-hero",
  heroImageAlt: "An emerald-cut vivid green tourmaline on dark wet slate",

  highlights: [
    {
      id: "natural",
      title: "NATURAL & DIVERSE",
      description:
        "Tourmalines occur in an extraordinary range of colors, each with its own unique beauty.",
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
      "Every tourmaline is ethically sourced, expertly selected, authenticated, and securely stored. Transparency at every step.",
  },

  glance: {
    title: "TOURMALINE AT A GLANCE",
    items: [
      {
        id: "type",
        label: "Gemstone Type",
        value: "Tourmaline",
        note: "(Complex Borosilicate)",
      },
      {
        id: "colour",
        label: "Color Range",
        value: "Green, Pink, Blue, Yellow,",
        note: "Red, Purple, Bi-Color, Watermelon & more",
      },
      {
        id: "origin",
        label: "Origin",
        value: "Brazil, Afghanistan, Nigeria,",
        note: "Madagascar, Mozambique, Tanzania, USA",
      },
      { id: "hardness", label: "Hardness (Mohs)", value: "7 – 7.5" },
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
    title: "ABOUT TOURMALINE",
    paragraphs: [
      "Tourmaline is celebrated for its incredible variety and natural beauty. Its name comes from the Sinhalese word “toramalli,” meaning “stone with mixed colors.”",
      "It has been admired for centuries and used in fine jewelry, royal adornments, and spiritual practices. Tourmaline’s wide color spectrum and durability make it a favorite among collectors, designers, and investors.",
    ],
    imageSrc: "/images/gems/tourmaline-rough.webp",
    imageAlt: "A row of natural rough multicolor tourmaline crystals",
  },

  investment: {
    title: "INVESTMENT HIGHLIGHTS",
    items: [
      {
        id: "diverse",
        title: "Diverse Color Spectrum",
        description:
          "One of the few gemstones found in virtually every color of the rainbow.",
      },
      {
        id: "strong-demand",
        title: "Strong Market Demand",
        description:
          "Highly sought after in jewelry and by collectors worldwide.",
      },
      {
        id: "rarity-uniqueness",
        title: "Rarity & Uniqueness",
        description:
          "Unique color zoning and bi-color varieties are rare and valuable.",
      },
      {
        id: "value-appreciation",
        title: "Value Appreciation",
        description: "Historically steady growth in value for premium stones.",
      },
      {
        id: "tangible",
        title: "Tangible Asset",
        description: "Physical gemstone linkage — proposed and verification-gated.",
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
          "The most important factor. Vivid, rich, and well-saturated colors are most valuable.",
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
          "Larger stones with exceptional color and clarity are highly prized.",
      },
      {
        id: "origin",
        title: "Origin",
        description:
          "Certain origins (e.g., Brazil, Afghanistan) are known for superior quality.",
      },
    ],
  },

  custody: {
    title: "SECURE CUSTODY",
    intro: "All tourmalines are stored in state-of-the-art vaults with:",
    items: [
      "24/7 Surveillance & Access Control",
      "Climate-Controlled Environment",
      "Full Insurance Coverage",
      "Regular Audits & Inventory Verification",
    ],
    imageSrc: "/images/sections/emerald-vault.webp",
    imageAlt: "An open secure vault with a vivid green gemstone",
  },

  process: {
    title: "OUR TOKENIZATION PROCESS",
    steps: [
      {
        id: "sourcing",
        step: 1,
        title: "Sourcing",
        description:
          "We source premium tourmalines from trusted mines and suppliers worldwide.",
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
          "Tourmalines are tokenized on the blockchain, representing fractional ownership.",
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
      "The global tourmaline market continues to grow, driven by rising demand in fine jewelry, holistic practices, and investment markets.",
    caption: "Indexed trend, illustrative. 2025 is projected.",
    points: [
      { year: "2020", value: 0.8 },
      { year: "2021", value: 1.0 },
      { year: "2022", value: 1.5 },
      { year: "2023", value: 1.9 },
      { year: "2024", value: 2.4 },
      { year: "2025", value: 3.4 },
    ],
    projectedFrom: "2025",
  },

  cta: {
    title: "OWN A PIECE OF NATURE’S SPECTRUM",
    description:
      "Invest in the timeless beauty and enduring value of tourmaline with GemReserve.io. Secure, transparent, and accessible to everyone.",
    buttonLabel: "Join the Waitlist",
    supportingText: "Limited opportunities available.",
    imageSrc: "/images/sections/emerald-vault.webp",
    imageAlt: "An open secure vault with a vivid green gemstone",
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
      description: "Physical asset framework — verification, audit and insurance pending.",
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
