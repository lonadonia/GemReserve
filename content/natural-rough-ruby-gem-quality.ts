/**
 * Natural Rough Ruby — Gem Quality, transcribed from the client's supplied board.
 *
 * The board itself labels the quality panel “G Quality” while the hero and
 * glance row say “Gem Quality”; both source labels are preserved rather than
 * silently resolving that ambiguity. Its drawn chart is an illustrative index.
 */

import type { GemstonePageContent } from "./gemstone-page";
import {
  roughRubyCustody,
  roughRubyHighlights,
  roughRubyProcess,
  roughRubyPromise,
  roughRubyTrust,
} from "./natural-rough-ruby-shared";

export const naturalRoughRubyGemQuality: GemstonePageContent = {
  slug: "natural-rough-ruby-gem-quality",
  accent: "rough-ruby-gem",

  breadcrumb: [
    "Home",
    "Assets",
    "All Gemstone Programs",
    "Natural Rough Ruby (Gem Quality)",
  ],
  title: "NATURAL ROUGH RUBY (GEM QUALITY)",
  tagline: ["Nature’s Most Precious Gem.", "Raw. Rare. Remarkable."],
  description:
    "Natural rough ruby is one of the most coveted gemstones in the world, admired for its intense red color, exceptional durability, and timeless beauty. Each piece is 100% natural, ethically sourced, and carefully selected for its quality, clarity, color, and investment potential.",
  heroBase: "/images/heroes/ruby-gem-quality-hero",
  heroImageAlt: "A cluster of natural rough vivid-red Gem Quality rubies",

  highlights: roughRubyHighlights,
  assurances: [],
  promise: roughRubyPromise,

  glance: {
    title: "NATURAL ROUGH RUBY AT A GLANCE",
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
        value: "Vivid Red, Pigeon Blood",
        note: "Red, Purplish Red, Pinkish Red",
      },
      {
        id: "origin",
        label: "Origin",
        value: "Myanmar (Burma),",
        note: "Madagascar, Mozambique, Tanzania, Sri Lanka",
      },
      { id: "crystal", label: "Crystal System", value: "Trigonal" },
      { id: "hardness", label: "Hardness (Mohs)", value: "9" },
      {
        id: "clarity",
        label: "Clarity",
        value: "Transparent to",
        note: "Translucent",
      },
      {
        id: "quality",
        label: "Quality Grade",
        value: "Gem Quality",
        note: "(Commercial Grade)",
      },
    ],
  },

  about: {
    title: "ABOUT RUBY (NATURAL ROUGH)",
    paragraphs: [
      "Ruby, the red variety of corundum, has been treasured for thousands of years as a symbol of passion, power, and protection. Its vibrant red color is due to the presence of chromium.",
      "The finest rubies display rich saturation, excellent crystal clarity, and strong fluorescence, with the legendary “Pigeon Blood Red” being the most valuable of all.",
      "Our Natural Rough Ruby (Gem Quality) is ideal for faceting into fine gemstones, high-end jewelry, collectible specimens, and long-term investment.",
    ],
    imageSrc: "/images/gems/ruby-gem-quality-rough.webp",
    imageAlt: "A row of natural rough Gem Quality rubies",
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
        id: "rare-valuable",
        title: "Rare & Valuable",
        description: "Fine gem-quality rubies are increasingly scarce.",
      },
      {
        id: "strong-demand",
        title: "Strong Demand",
        description:
          "High global demand in luxury jewelry and investment markets.",
      },
      {
        id: "affordable",
        title: "Affordable Entry",
        description: "Cost-effective way to own natural ruby assets.",
      },
      {
        id: "versatile",
        title: "Versatile Use",
        description:
          "Perfect for faceting, jewelry making, collecting, and ornamental use.",
      },
      {
        id: "global-appeal",
        title: "Global Appeal",
        description: "Appreciated by collectors and investors worldwide.",
      },
      {
        id: "asset-appreciation",
        title: "Asset Appreciation",
        description:
          "Historically strong performance in the gemstone and luxury markets.",
      },
    ],
  },

  quality: {
    title: "QUALITY FACTORS (G QUALITY)",
    items: [
      {
        id: "colour",
        title: "Color",
        description:
          "Vivid, intense red with good saturation and even distribution.",
      },
      {
        id: "clarity",
        title: "Clarity",
        description:
          "Transparent to translucent; may contain natural inclusions.",
      },
      {
        id: "transparency",
        title: "Transparency",
        description: "Transparent to translucent.",
      },
      {
        id: "texture",
        title: "Texture",
        description:
          "Natural rough surface with crystal faces and growth features.",
      },
      {
        id: "origin",
        title: "Origin",
        description:
          "Sourced from well-known ruby-producing regions worldwide.",
      },
    ],
  },

  custody: roughRubyCustody(
    "All natural rough ruby is stored in state-of-the-art vaults with:",
  ),
  process: roughRubyProcess(
    "We source natural rough ruby directly from trusted mines and suppliers.",
    "Ruby is tokenized on the blockchain, representing fractional ownership.",
  ),

  market: {
    title: "MARKET INSIGHTS",
    description:
      "The global ruby market continues to grow, driven by demand in jewelry, collectibles, and alternative investments.",
    caption: "Indexed trend, illustrative. 2025 is projected.",
    points: [
      { year: "2020", value: 1.0 },
      { year: "2021", value: 1.7 },
      { year: "2022", value: 2.5 },
      { year: "2023", value: 3.3 },
      { year: "2024", value: 4.1 },
      { year: "2025", value: 5.3 },
    ],
    projectedFrom: "2025",
  },

  cta: {
    title: "OWN A PIECE OF NATURE’S LEGEND",
    description:
      "Invest in natural rough ruby and own a timeless symbol of passion, power, and prosperity.",
    buttonLabel: "Join the Waitlist",
    supportingText: "Limited opportunities available.",
    imageSrc: "/images/sections/open-vault.webp",
    imageAlt: "An open institutional vault holding faceted gemstones",
  },
  trust: roughRubyTrust,
};
