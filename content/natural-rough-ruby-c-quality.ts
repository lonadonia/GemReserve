/**
 * Natural Rough Ruby — C Quality, transcribed from the client's supplied board.
 *
 * Unlike the other rough-ruby boards, this one presents a six-field glance row
 * with no crystal-system field. The C Quality / Commercial Grade designation is
 * explicit; the market chart remains an illustrative, currency-free index.
 */

import type { GemstonePageContent } from "./gemstone-page";
import {
  roughRubyCustody,
  roughRubyHighlights,
  roughRubyProcess,
  roughRubyPromise,
  roughRubyTrust,
} from "./natural-rough-ruby-shared";

export const naturalRoughRubyCQuality: GemstonePageContent = {
  slug: "natural-rough-ruby-c-quality",
  accent: "rough-ruby-c",

  breadcrumb: [
    "Home",
    "Assets",
    "All Gemstone Programs",
    "Natural Rough Ruby (C Quality)",
  ],
  title: "NATURAL ROUGH RUBY (C QUALITY)",
  tagline: ["The Timeless Flame", "in Natural Form."],
  description:
    "Our Natural Rough Ruby (C Quality) is 100% natural corundum, ethically sourced from trusted mining regions. In its raw state, each piece carries the iconic red color and energetic beauty of ruby, untouched by enhancement or treatment.",
  heroBase: "/images/heroes/ruby-c-quality-hero",
  heroImageAlt: "A cluster of natural rough deep-red C Quality rubies",

  highlights: roughRubyHighlights.map((highlight) =>
    highlight.id === "natural"
      ? {
          ...highlight,
          description:
            "100% natural rough ruby with no heat or chemical treatments.",
        }
      : highlight,
  ),
  assurances: [],
  promise: roughRubyPromise,

  glance: {
    title: "NATURAL ROUGH RUBY (C QUALITY) AT A GLANCE",
    items: [
      {
        id: "type",
        label: "Gemstone Type",
        value: "Ruby",
        note: "(Corundum)",
      },
      {
        id: "colour",
        label: "Color",
        value: "Red to Purplish Red",
      },
      {
        id: "origin",
        label: "Origin",
        value: "Myanmar (Burma), Tanzania,",
        note: "Mozambique, Madagascar, Thailand, Vietnam",
      },
      { id: "hardness", label: "Hardness (Mohs)", value: "9" },
      {
        id: "clarity",
        label: "Clarity",
        value: "Heavily Included",
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
    title: "ABOUT NATURAL ROUGH RUBY (C QUALITY)",
    paragraphs: [
      "This C Quality rough ruby is a natural corundum in its original, uncut state. It may display internal fractures, inclusions, surface irregularities, and color zoning, which are characteristic of commercial grade rough.",
      "Ideal for cutting, carving, tumbling, or industrial use, C Quality ruby provides an excellent balance of affordability and natural beauty.",
    ],
    imageSrc: "/images/gems/ruby-c-quality-rough.webp",
    imageAlt: "A row of natural rough C Quality rubies",
  },

  investment: {
    title: "INVESTMENT HIGHLIGHTS",
    items: [
      {
        id: "natural-untreated",
        title: "100% Natural",
        description: "No heat treatment or enhancement.",
      },
      {
        id: "affordable",
        title: "Affordable Entry",
        description: "Cost-effective way to invest in genuine rubies.",
      },
      {
        id: "wide-use",
        title: "Wide Use",
        description:
          "Suitable for faceting, carving, jewelry, and lapidary projects.",
      },
      {
        id: "global-demand",
        title: "Global Demand",
        description:
          "Constant demand in jewelry, healing, and industrial markets.",
      },
      {
        id: "long-term-value",
        title: "Long-Term Value",
        description: "Natural rubies have a proven history of value retention.",
      },
    ],
  },

  quality: {
    title: "QUALITY FACTORS",
    items: [
      {
        id: "colour",
        title: "Color",
        description: "Red to purplish red; may show uneven color distribution.",
      },
      {
        id: "clarity",
        title: "Clarity",
        description:
          "Visible inclusions, fractures, and surface irregularities are common.",
      },
      {
        id: "transparency",
        title: "Transparency",
        description: "Transparent to translucent.",
      },
      {
        id: "cut-shape",
        title: "Cut / Shape",
        description: "Irregular rough form; not faceted.",
      },
      {
        id: "origin",
        title: "Origin",
        description:
          "Sourcing from well-known ruby producing regions ensures authenticity.",
      },
    ],
  },

  custody: roughRubyCustody(
    "All rubies are stored in state-of-the-art vaults with:",
  ),
  process: roughRubyProcess(
    "We source natural rough rubies from trusted mines and suppliers.",
  ),

  market: {
    title: "MARKET INSIGHTS",
    description:
      "The global ruby market continues to grow, driven by demand in fine jewelry, emerging markets, and alternative investments.",
    caption: "Indexed trend, illustrative. 2025 is projected.",
    points: [
      { year: "2020", value: 1.0 },
      { year: "2021", value: 1.2 },
      { year: "2022", value: 1.8 },
      { year: "2023", value: 2.4 },
      { year: "2024", value: 3.0 },
      { year: "2025", value: 4.0 },
    ],
    projectedFrom: "2025",
  },

  cta: {
    title: "OWN A PIECE OF NATURE’S LEGACY",
    description:
      "Natural rough rubies are more than gemstones—they are symbols of passion, protection, and prosperity.",
    buttonLabel: "Join the Waitlist",
    supportingText: "Limited opportunities available.",
    imageSrc: "/images/sections/open-vault.webp",
    imageAlt: "An open institutional vault holding faceted gemstones",
  },
  trust: roughRubyTrust,
};
