/**
 * Aquamarine — transcribed from the client's board.
 *
 * The sample asset is the board's own, GR-AQUA-000245, carried across with its
 * figures intact and labelled a sample wherever it appears, so nobody reads it
 * as a live holding.
 *
 * The board's gallery captions six cuts. Four had to be photographed to match
 * the pack's own aquamarine staging; the emerald cut and the natural crystal are
 * the client's own cut-outs.
 */

import type { GemstonePageContent } from "./gemstone-page";

export const aquamarine: GemstonePageContent = {
  slug: "aquamarine",
  accent: "aqua",

  breadcrumb: ["Home", "Assets", "All Gemstone Programs", "Aquamarine"],
  title: "AQUAMARINE",
  tagline: ["The Gem of Clarity and Tranquility"],
  description:
    "Aquamarine is a precious beryl known for its mesmerizing blue to blue-green hues that capture the tranquility of ocean waters. Prized for its exceptional clarity, brilliance and rarity, Aquamarine is a timeless gemstone with enduring value.",
  heroBase: "/images/heroes/aquamarine-hero",
  heroImageAlt:
    "An emerald-cut pale blue aquamarine held in tweezers on wet slate",

  highlightsTitle: "ASSET HIGHLIGHTS",
  highlights: [
    {
      id: "natural",
      title: "Natural Aquamarine",
      description: "100% Natural Beryl",
    },
    { id: "hardness", title: "Hardness", description: "7.5 – 8 on Mohs Scale" },
    { id: "brilliance", title: "Brilliance", description: "Excellent" },
    { id: "rarity", title: "Rarity", description: "Rare" },
    {
      id: "demand",
      title: "Market Demand",
      description: "High and Growing",
    },
  ],

  assurances: [
    {
      id: "backed",
      title: "ASSET-BACKED MODEL",
      description: "By real, physical Aquamarine",
    },
    {
      id: "verified",
      title: "INDEPENDENTLY VERIFIED",
      description: "Gemological reports from leading labs",
    },
    {
      id: "borderless",
      title: "LIQUID & BORDERLESS",
      description: "Own, trade and transfer tokenized gemstones globally",
    },
    {
      id: "vaulted",
      title: "SECURE VAULTED",
      description: "Stored in high-security vaults with full insurance",
    },
    {
      id: "transparent",
      title: "TRANSPARENT",
      description: "On-chain data, digital passports and full audit trail",
    },
  ],

  details: {
    title: "GEMSTONE DETAILS",
    facts: [
      {
        id: "type",
        label: "Gemstone Type",
        value: "Aquamarine (Natural Beryl)",
      },
      { id: "variety", label: "Variety", value: "Aquamarine" },
      { id: "colour", label: "Color Range", value: "Blue to Blue-Green" },
      { id: "transparency", label: "Transparency", value: "Transparent" },
      { id: "luster", label: "Luster", value: "Vitreous" },
      { id: "crystal", label: "Crystal System", value: "Hexagonal" },
      { id: "hardness", label: "Hardness", value: "7.5 – 8 on Mohs Scale" },
      { id: "refractive", label: "Refractive Index", value: "1.57 – 1.58" },
      { id: "gravity", label: "Specific Gravity", value: "2.67 – 2.78" },
      {
        id: "treatment",
        label: "Treatment",
        value: "Typically None (Minor Oil)",
      },
      {
        id: "shape",
        label: "Typical Shape",
        value: "Emerald Cut, Oval, Cushion, Pear, Round",
      },
      {
        id: "sizes",
        label: "Sizes Available",
        value: "From 1.00 ct and above",
      },
    ],
    imageSrc: "/images/gems/aquamarine.webp",
    imageAlt: "An emerald-cut pale blue aquamarine",
    imageActionLabel: "View high-resolution image",
  },

  origin: {
    title: "ORIGIN & PROVENANCE",
    description:
      "Our Aquamarine is ethically sourced from the world's most respected mining regions.",
    mapSrc: "/images/sections/aqua-map.webp",
    mapAlt:
      "A world map with markers over Brazil, Madagascar, Mozambique and Pakistan",
    pins: [
      { id: "brazil", country: "Brazil", region: "Minas Gerais" },
      { id: "madagascar", country: "Madagascar", region: "Antsirabe" },
      { id: "mozambique", country: "Mozambique", region: "Nampula" },
      { id: "pakistan", country: "Pakistan", region: "Shigar Valley" },
    ],
    note: "Every gemstone is traceable from mine to vault with complete documentation.",
  },

  investment: {
    title: "INVESTMENT HIGHLIGHTS",
    items: [
      {
        id: "timeless",
        title: "Timeless Beauty",
        description: "Classic gemstone with enduring appeal",
      },
      {
        id: "supply",
        title: "Limited Supply",
        description: "High-quality Aquamarine is increasingly rare",
      },
      {
        id: "demand",
        title: "Growing Demand",
        description: "Strong demand in luxury, jewelry and investment markets",
      },
      {
        id: "diversifier",
        title: "Portfolio Diversifier",
        description: "Ideal for diversifying alternative asset holdings",
      },
      {
        id: "tangible",
        title: "Tangible Wealth",
        description: "Physical asset with intrinsic and emotional value",
      },
    ],
  },

  sample: {
    title: "SAMPLE ASSET SPECIFICATIONS",
    note: "Sample record",
    facts: [
      { id: "asset-id", label: "Asset ID", value: "GR-AQUA-000245" },
      { id: "weight", label: "Weight", value: "3.25 ct" },
      {
        id: "dimensions",
        label: "Dimensions",
        value: "10.12 × 7.68 × 5.12 mm",
      },
      { id: "shape", label: "Shape & Cut", value: "Emerald Cut" },
      { id: "colour", label: "Color", value: "Vivid Blue" },
      { id: "clarity", label: "Clarity", value: "Eye Clean" },
      { id: "origin", label: "Origin", value: "Brazil" },
      { id: "treatment", label: "Treatment", value: "None" },
      { id: "report", label: "Lab Report", value: "GRS-2024-AQ0245" },
      { id: "registered", label: "Date Registered", value: "May 12, 2024" },
      { id: "chain", label: "Blockchain ID", value: "0x7a3b…9c4f2d" },
    ],
  },

  certificate: {
    title: "GEMOLOGICAL CERTIFICATE",
    description: "Independently verified by leading gemological laboratories.",
    // Not the shared passport card: that artwork is an emerald, and it read
    // "EMERALD / Natural Beryl" on an aquamarine page.
    imageSrc: "/images/sections/aqua-report.webp",
    imageAlt:
      "An open gemological report book with an aquamarine and a gold seal",
    actionLabel: "View sample report",
  },

  gallery: {
    title: "AQUAMARINE GALLERY",
    items: [
      {
        id: "emerald-cut",
        label: "Emerald Cut",
        src: "/images/gems/aquamarine.webp",
        alt: "An emerald-cut pale blue aquamarine",
      },
      {
        id: "oval",
        label: "Oval Cut",
        src: "/images/gallery/aqua-oval.webp",
        alt: "An oval-cut pale blue aquamarine",
      },
      {
        id: "cushion",
        label: "Cushion Cut",
        src: "/images/gallery/aqua-cushion.webp",
        alt: "A cushion-cut pale blue aquamarine",
      },
      {
        id: "pear",
        label: "Pear Cut",
        src: "/images/gallery/aqua-pear.webp",
        alt: "A pear-cut pale blue aquamarine",
      },
      {
        id: "round",
        label: "Round Cut",
        src: "/images/gallery/aqua-round.webp",
        alt: "A round brilliant pale blue aquamarine",
      },
      {
        id: "crystal",
        label: "Natural Crystal",
        src: "/images/gallery/aqua-crystal.webp",
        alt: "A cluster of natural rough aquamarine crystals",
      },
    ],
  },

  features: [
    {
      id: "custody",
      title: "SECURE CUSTODY",
      description:
        "Stored in world-class vaults with 24/7 monitoring, insurance and multi-layer security.",
    },
    {
      id: "passport",
      title: "DIGITAL ASSET PASSPORT",
      description:
        "Each gemstone has a unique digital passport with photos, metrics, origin and verification data on-chain.",
    },
    {
      id: "access",
      title: "GLOBAL ACCESS",
      description:
        "Buy, sell, transfer or redeem anywhere in the world through our secure blockchain infrastructure.",
    },
    {
      id: "redemption",
      title: "PHYSICAL REDEMPTION",
      description:
        "Redeem your gemstone physically at any time, subject to program terms and conditions.",
    },
  ],

  cta: {
    title: "OWN A PIECE OF NATURE'S MASTERPIECE",
    description:
      "Tokenized Aquamarine from GemReserve.io combines the beauty of nature with the security of blockchain technology. A physical asset framework, subject to verification. Built for a transparent and borderless future.",
    buttonLabel: "Join the Waitlist",
    supportingText: "Be among the first to access tokenized gemstone assets.",
    imageSrc: "/images/sections/open-vault.webp",
    imageAlt: "An open vault holding faceted gemstones",
  },
};
