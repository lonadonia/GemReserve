/**
 * Natural Rough Ruby, Trapiche — transcribed from the client's supplied board.
 *
 * Its six-rayed graphite/carbon pattern, origins, and C Quality designation are
 * specific to this board. The unsourced drawn market curve is presented only as
 * an illustrative index.
 */

import type { GemstonePageContent } from "./gemstone-page";
import {
  roughRubyCustody,
  roughRubyHighlights,
  roughRubyProcess,
  roughRubyPromise,
  roughRubyTrust,
} from "./natural-rough-ruby-shared";

export const naturalRoughRubyTrapiche: GemstonePageContent = {
  slug: "natural-rough-ruby-trapiche",
  accent: "rough-ruby-trapiche",

  breadcrumb: [
    "Home",
    "Assets",
    "All Gemstone Programs",
    "Natural Rough Ruby, Trapiche",
  ],
  title: "NATURAL ROUGH RUBY, TRAPICHE",
  tagline: ["Nature’s Six-Ray Star.", "Raw. Rare. Extraordinary."],
  description:
    "Natural Rough Ruby, Trapiche is one of the rarest forms of corundum on Earth, recognized by its unique six-rayed star pattern formed naturally within the crystal. Each piece is 100% natural, ethically sourced, and highly prized for its rarity, spiritual significance, and investment potential.",
  heroBase: "/images/heroes/ruby-trapiche-hero",
  heroImageAlt:
    "A cluster of natural rough trapiche rubies with black six-ray stars",

  highlights: roughRubyHighlights.map((highlight) =>
    highlight.id === "natural"
      ? {
          ...highlight,
          description:
            "100% natural rough trapiche ruby. No heat or chemical treatments.",
        }
      : highlight,
  ),
  assurances: [],
  promise: roughRubyPromise,

  glance: {
    title: "NATURAL ROUGH RUBY, TRAPICHE AT A GLANCE",
    items: [
      {
        id: "type",
        label: "Gemstone Type",
        value: "Corundum",
        note: "(Ruby Variety)",
      },
      {
        id: "colour",
        label: "Color Range",
        value: "Pinkish Red to",
        note: "Deep Red with Black Six-Ray Star",
      },
      {
        id: "origin",
        label: "Origin",
        value: "Vietnam (Luc Yen),",
        note: "Tanzania, Madagascar, Sri Lanka",
      },
      { id: "crystal", label: "Crystal System", value: "Trigonal" },
      { id: "hardness", label: "Hardness (Mohs)", value: "9" },
      {
        id: "clarity",
        label: "Clarity",
        value: "Opaque to Translucent",
        note: "(Naturally Included)",
      },
      {
        id: "quality",
        label: "Quality Grade",
        value: "C Quality",
        note: "(Commercial Grade)",
      },
    ],
  },

  about: {
    title: "ABOUT RUBY, TRAPICHE (ROUGH)",
    paragraphs: [
      "Trapiche Ruby is a natural phenomenon where carbon or graphite inclusions form a six-rayed star pattern within the corundum crystal during formation.",
      "This rare variety is valued for its uniqueness, metaphysical properties, and collectors’ appeal.",
      "Our Natural Rough Ruby, Trapiche (C Quality) is ideal for collectors, lapidary creations, and alternative investments.",
    ],
    imageSrc: "/images/gems/ruby-trapiche-rough.webp",
    imageAlt: "A row of natural rough trapiche rubies",
  },

  investment: {
    title: "INVESTMENT HIGHLIGHTS",
    items: [
      {
        id: "natural-untreated",
        title: "100% Natural",
        description: "No heat or chemical enhancement.",
      },
      {
        id: "extremely-rare",
        title: "Extremely Rare",
        description:
          "Six-ray star pattern occurs naturally in a small percentage of rubies.",
      },
      {
        id: "high-demand",
        title: "High Demand",
        description:
          "Strong interest from collectors, metaphysical practitioners, and investors.",
      },
      {
        id: "affordable",
        title: "Affordable Entry",
        description: "Cost-effective way to own rare and unique rubies.",
      },
      {
        id: "versatile",
        title: "Versatile Use",
        description:
          "Suitable for carvings, cabs, specimens, and spiritual applications.",
      },
      {
        id: "asset-appreciation",
        title: "Asset Appreciation",
        description: "Rarity and demand support long-term value growth.",
      },
    ],
  },

  quality: {
    title: "QUALITY FACTORS (C QUALITY)",
    items: [
      {
        id: "colour",
        title: "Color",
        description: "Pinkish red to deep red with natural black star pattern.",
      },
      {
        id: "clarity",
        title: "Clarity",
        description:
          "Opaque to translucent with visible inclusions and matrix.",
      },
      {
        id: "transparency",
        title: "Transparency",
        description: "Mostly opaque; some pieces may show translucency.",
      },
      {
        id: "texture",
        title: "Texture",
        description: "Natural surface, uneven, with mineral inclusions.",
      },
      {
        id: "origin",
        title: "Origin",
        description: "Sourced from renowned ruby-producing regions worldwide.",
      },
    ],
  },

  custody: roughRubyCustody(
    "All rubies are stored in state-of-the-art vaults with:",
  ),
  process: roughRubyProcess(
    "We source natural rough rubies, trapiche, from trusted mines and suppliers.",
  ),

  market: {
    title: "MARKET INSIGHTS",
    description:
      "The global ruby market continues to grow, driven by rarity, demand in jewelry, metaphysical markets, and alternative investments.",
    caption: "Indexed trend, illustrative. 2025 is projected.",
    points: [
      { year: "2020", value: 1.0 },
      { year: "2021", value: 1.3 },
      { year: "2022", value: 1.8 },
      { year: "2023", value: 2.5 },
      { year: "2024", value: 3.2 },
      { year: "2025", value: 4.2 },
    ],
    projectedFrom: "2025",
  },

  cta: {
    title: "OWN A PIECE OF NATURE’S RARITY",
    description:
      "Natural rough ruby, trapiche is more than a gemstone—it’s a symbol of uniqueness, energy, and lasting value.",
    buttonLabel: "Join the Waitlist",
    supportingText: "Limited opportunities available.",
    imageSrc: "/images/sections/open-vault.webp",
    imageAlt: "An open institutional vault holding faceted gemstones",
  },
  trust: roughRubyTrust,
};
