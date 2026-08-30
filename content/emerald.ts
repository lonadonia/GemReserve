/**
 * Emerald — transcribed from the client's board.
 *
 * The board's market figure is a rising line over 2020–2025 with 2025 marked
 * projected. Its y-axis label is illegible in the reference and no unit is
 * readable anywhere on the board, so the chart reproduces the shape, the years
 * and the projected marker without asserting a market size the client has not
 * published. The axis is labelled as an index and the caption says so.
 *
 * "IGI, GRS, SSEF (As Applicable)" is the board's own certification line, and
 * GRS and SSEF are already named in the gemstone catalogue.
 */

import type { GemstonePageContent } from "./gemstone-page";

export const emerald: GemstonePageContent = {
  slug: "emerald",
  accent: "emerald",

  breadcrumb: ["Home", "Assets", "All Gemstone Programs", "Emerald"],
  title: "EMERALD",
  tagline: ["The Timeless Green of Value,", "Captured in Real Assets."],
  description:
    "Emeralds have been treasured for centuries for their rarity, beauty, and enduring value. At GemReserve.io, we bring this legacy into the future by tokenizing exceptional emeralds linked to authenticated gems held in secure custody.",
  heroBase: "/images/heroes/emerald-hero",
  heroImageAlt: "An emerald-cut vivid green emerald resting on dark rock",

  highlights: [
    {
      id: "natural",
      title: "REAL & NATURAL",
      description: "100% natural emeralds, expertly selected.",
    },
    {
      id: "custody",
      title: "SECURE CUSTODY",
      description: "Stored in high-security facilities with full insurance.",
    },
    {
      id: "authenticated",
      title: "AUTHENTICATED",
      description: "Gemological certification from trusted labs.",
    },
    {
      id: "tokenized",
      title: "TOKENIZED OWNERSHIP",
      description: "Fractional ownership via blockchain for global access.",
    },
    {
      id: "liquidity",
      title: "GLOBAL LIQUIDITY",
      description: "Trade securely on our platform's marketplace.",
    },
  ],

  assurances: [],

  promise: {
    title: "REAL ASSETS. REAL VALUE. REAL TRUST.",
    description:
      "Every emerald is natural, ethically sourced, authenticated, and securely stored. Transparency at every step.",
  },

  glance: {
    title: "EMERALD AT A GLANCE",
    items: [
      {
        id: "type",
        label: "Gemstone Type",
        value: "Emerald",
        note: "(Green Beryl)",
      },
      { id: "colour", label: "Color", value: "Vivid to Deep Green" },
      {
        id: "origin",
        label: "Origin",
        value: "Colombia, Zambia,",
        note: "Brazil, Zimbabwe",
      },
      { id: "hardness", label: "Hardness (Mohs)", value: "7.5 – 8" },
      {
        id: "clarity",
        label: "Clarity",
        value: "Typically Included",
        note: "(Natural Jardin)",
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
    title: "ABOUT EMERALD",
    paragraphs: [
      "Emerald is one of the most precious gemstones in the world, belonging to the beryl family. Its captivating green hue comes from trace elements of chromium and vanadium.",
      "Renowned for its rarity and historical significance, emeralds have been favored by royalty and collectors for thousands of years. Fine emeralds with vibrant color, clarity, and origin consistently hold and grow in value over time.",
    ],
    imageSrc: "/images/gallery/emerald-crystal.webp",
    imageAlt: "A cluster of natural rough emerald crystals",
  },

  investment: {
    title: "INVESTMENT HIGHLIGHTS",
    items: [
      {
        id: "scarcity",
        title: "Scarcity & Rarity",
        description: "High-quality emeralds are rare and in finite supply.",
      },
      {
        id: "demand",
        title: "Timeless Demand",
        description:
          "Strong global demand from luxury, collectors, and investors.",
      },
      {
        id: "appreciation",
        title: "Value Appreciation",
        description: "Historically strong long-term value retention.",
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
          "The most valuable emeralds are rich, vivid green with strong saturation.",
      },
      {
        id: "clarity",
        title: "Clarity",
        description:
          "Natural inclusions (Jardin) are common and accepted. Fewer eye-visible inclusions increase value.",
      },
      {
        id: "cut",
        title: "Cut",
        description:
          "Precision cutting enhances color, brilliance, and overall beauty.",
      },
      {
        id: "carat",
        title: "Carat Weight",
        description:
          "Larger emeralds with fine color and clarity are exceedingly rare and valuable.",
      },
      {
        id: "origin",
        title: "Origin",
        description:
          "Colombian emeralds are the most sought-after for their unmatched green.",
      },
    ],
  },

  custody: {
    title: "SECURE CUSTODY",
    intro: "All emeralds are stored in state-of-the-art vaults with:",
    items: [
      "24/7 Surveillance & Access Control",
      "Climate-Controlled Environment",
      "Full Insurance Coverage",
      "Regular Audits & Inventory Verification",
    ],
    imageSrc: "/images/sections/emerald-vault.webp",
    imageAlt: "An open steel safe with an emerald resting before it",
  },

  process: {
    title: "OUR TOKENIZATION PROCESS",
    steps: [
      {
        id: "sourcing",
        step: 1,
        title: "Sourcing",
        description:
          "We source premium emeralds from trusted partners worldwide.",
      },
      {
        id: "authentication",
        step: 2,
        title: "Authentication",
        description:
          "Gems are graded and certified by leading gemological laboratories.",
      },
      {
        id: "tokenization",
        step: 3,
        title: "Tokenization",
        description:
          "Emeralds are tokenized on the blockchain, representing fractional ownership.",
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
      "The global emerald market continues to show resilient growth driven by luxury demand, wealth preservation, and limited supply.",
    caption: "Indexed trend, illustrative. 2025 is projected.",
    points: [
      { year: "2020", value: 1.4 },
      { year: "2021", value: 3.0 },
      { year: "2022", value: 4.4 },
      { year: "2023", value: 5.7 },
      { year: "2024", value: 6.9 },
      { year: "2025", value: 8.6 },
    ],
    projectedFrom: "2025",
  },

  cta: {
    title: "OWN A PIECE OF TIMELESS BEAUTY",
    description:
      "Invest in the enduring value of emeralds with GemReserve.io. Secure, transparent, and accessible to everyone.",
    buttonLabel: "Join the Waitlist",
    supportingText:
      "Be part of a global community that values trust, transparency, and real ownership.",
    imageSrc: "/images/sections/vault-tray.webp",
    imageAlt: "A tray of faceted gemstones inside an open vault",
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
      description: "Dedicated support every step of the way.",
    },
  ],
};
