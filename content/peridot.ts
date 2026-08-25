/**
 * Peridot — transcribed from the client's supplied page board.
 *
 * The market graphic is reproduced as an indexed, illustrative trend. The
 * board does not provide a sourced market-size series, so this module does not
 * turn its drawn curve into a currency claim.
 */

import type { GemstonePageContent } from "./gemstone-page";

export const peridot: GemstonePageContent = {
  slug: "peridot",
  accent: "peridot",

  breadcrumb: ["Home", "Assets", "All Gemstone Programs", "Peridot"],
  title: "PERIDOT",
  tagline: ["Nature’s Radiant Green Gem.", "Clarity. Vitality. Value."],
  description:
    "Peridot is one of the few gemstones that occurs in only one color—an extraordinary olive to lime green. Revered for thousands of years, it symbolizes strength, renewal, and prosperity. At GemReserve.io, we bring the timeless beauty and enduring value of peridot to the future through secure custody and tokenized ownership.",
  heroBase: "/images/heroes/peridot-hero",
  heroImageAlt:
    "A faceted vivid green peridot surrounded by natural rough peridot crystals",

  highlights: [
    {
      id: "natural",
      title: "NATURAL & UNIQUE",
      description:
        "Peridots form deep within the Earth and are celebrated for their vibrant green brilliance.",
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
      "Every peridot is ethically sourced, expertly selected, authenticated, and securely stored. Transparency at every step.",
  },

  glance: {
    title: "PERIDOT AT A GLANCE",
    items: [
      {
        id: "type",
        label: "Gemstone Type",
        value: "Peridot",
        note: "(Olivine)",
      },
      {
        id: "colour",
        label: "Color Range",
        value: "Lime Green, Olive Green,",
        note: "Yellowish Green",
      },
      {
        id: "origin",
        label: "Origin",
        value: "Pakistan, Myanmar, China,",
        note: "Arizona (USA), Norway, Tanzania",
      },
      { id: "hardness", label: "Hardness (Mohs)", value: "6.5 – 7" },
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
    title: "ABOUT PERIDOT",
    paragraphs: [
      "Peridot is a gem-quality variety of the mineral olivine. Its fresh green color is caused by iron within its crystal structure. Often called the “evening emerald” by ancient Egyptians, peridot has adorned royal treasures and spiritual talismans for centuries.",
      "Valued for its luminous color, natural clarity, and relatively high abundance, peridot is a popular choice in fine jewelry and an attractive asset for collectors and investors.",
    ],
    imageSrc: "/images/gems/peridot-rough.webp",
    imageAlt: "A group of natural rough green peridot stones",
  },

  investment: {
    title: "INVESTMENT HIGHLIGHTS",
    items: [
      {
        id: "abundance",
        title: "Abundant Yet Valuable",
        description:
          "More abundant than many gemstones, with consistent global demand.",
      },
      {
        id: "attractive",
        title: "Attractive Color",
        description: "Unique, uplifting green with excellent brilliance.",
      },
      {
        id: "affordable",
        title: "Affordable Luxury",
        description: "High perceived value at accessible price points.",
      },
      {
        id: "durable",
        title: "Durable for Jewelry",
        description: "Suitable for everyday wear with proper care.",
      },
      {
        id: "global-demand",
        title: "Global Demand",
        description: "Popular in jewelry markets worldwide.",
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
        description: "Vivid green with strong saturation is most desirable.",
      },
      {
        id: "clarity",
        title: "Clarity",
        description:
          "Fewer visible inclusions and higher transparency increase value.",
      },
      {
        id: "cut",
        title: "Cut",
        description: "Well-proportioned cuts maximize brilliance and color.",
      },
      {
        id: "carat",
        title: "Carat Weight",
        description:
          "Larger stones with excellent color and clarity are more valuable.",
      },
      {
        id: "origin",
        title: "Origin",
        description:
          "Certain origins (e.g., Pakistan) are known for superior quality.",
      },
    ],
  },

  custody: {
    title: "SECURE CUSTODY",
    intro: "All peridots are stored in state-of-the-art vaults with:",
    items: [
      "24/7 Surveillance & Access Control",
      "Climate-Controlled Environment",
      "Full Insurance Coverage",
      "Regular Audits & Inventory Verification",
    ],
    imageSrc: "/images/sections/emerald-vault.webp",
    imageAlt: "An open secure vault with a faceted green gemstone",
  },

  process: {
    title: "OUR TOKENIZATION PROCESS",
    steps: [
      {
        id: "sourcing",
        step: 1,
        title: "Sourcing",
        description:
          "We source premium peridots from trusted mines and suppliers worldwide.",
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
          "Peridots are tokenized on the blockchain, representing fractional ownership.",
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
      "Peridot maintains steady demand in the global gemstone market, driven by its beauty, affordability, and use in fine jewelry.",
    caption: "Indexed trend, illustrative. 2025 is projected.",
    points: [
      { year: "2020", value: 1.0 },
      { year: "2021", value: 1.2 },
      { year: "2022", value: 1.5 },
      { year: "2023", value: 1.8 },
      { year: "2024", value: 2.2 },
      { year: "2025", value: 2.9 },
    ],
    projectedFrom: "2025",
  },

  cta: {
    title: "OWN A PIECE OF NATURE’S ENERGY",
    description:
      "Peridot is believed to bring positivity, strength, and renewal. Own a piece of nature’s vibrant energy.",
    buttonLabel: "Join the Waitlist",
    supportingText: "Limited opportunities available.",
    imageSrc: "/images/sections/open-vault.webp",
    imageAlt: "An open vault holding a collection of faceted gemstones",
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
