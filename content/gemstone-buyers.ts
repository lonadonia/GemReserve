/**
 * Gemstone Buyers and Collectors — transcribed from the client's supplied
 * board.
 *
 * The demand side. The board leads on what a buyer is actually acquiring —
 * provenance, authentication, custody, the digital passport, redemption — and
 * that emphasis is kept rather than being turned into a sales pitch.
 *
 * The board illustrates its passport panel with a phone showing a specimen
 * record: a 5.23 ct oval Sri Lankan blue sapphire, quality AAA, token ID
 * GR-SAPP-0001245. That is the board's own worked specimen and is presented
 * here as an example record, in the same terms the site's existing passport
 * pages use for their sample stone, so it cannot be read as a listing.
 *
 * The board's section order differs from the owners board — the trust callout
 * opens the page and the audience row closes it — and that order is preserved.
 */

import type {
  AudienceCallout,
  AudienceGroup,
  AudienceHero,
  AudienceMark,
  AudiencePoint,
  AudienceStep,
} from "./audience-page";

export const buyersHero: AudienceHero = {
  breadcrumb: ["Home", "Gemstone Buyers and Collectors"],
  titleLines: ["GEMSTONE BUYERS", "AND COLLECTORS"],
  tagline: "Authentic Gems. Verified Value. Global Access.",
  description:
    "GemReserve.io gives buyers and collectors a secure, transparent, and intelligent way to acquire the world's finest gemstones, on a physical asset framework, with independent verification and blockchain technology.",
  heroBase: "/images/heroes/buyers-hero",
};

export const buyersCallout: AudienceCallout = {
  title: "REAL ASSETS. REAL VALUE. REAL TRUST.",
  description:
    "Every gemstone on our platform is backed by a physical asset, verified by experts, and secured by blockchain.",
};

export const buyersMarks: readonly AudienceMark[] = [
  {
    id: "authentic-verified",
    title: "AUTHENTIC & VERIFIED",
    description:
      "Every gemstone is 100% natural, independently verified, and certified.",
  },
  {
    id: "secure-ownership",
    title: "SECURE OWNERSHIP",
    description:
      "A physical asset framework in world-class vaults, with full blockchain transparency.",
  },
  {
    id: "global-access",
    title: "GLOBAL ACCESS",
    description:
      "Buy from anywhere in the world with easy access to a curated selection of premium gems.",
  },
  {
    id: "liquid-flexible",
    title: "LIQUID & FLEXIBLE",
    description:
      "Trade, hold, or redeem your tokenized gemstones whenever you choose.",
  },
  {
    id: "long-term-value",
    title: "LONG-TERM VALUE",
    description:
      "Invest in timeless beauty that preserves and grows its value over time.",
  },
];

export const buyersWhy = {
  title: "WHY BUY GEMSTONES ON GEMRESERVE.IO?",
  points: [
    {
      id: "verified-excellence",
      title: "VERIFIED EXCELLENCE",
      description: "Only the finest quality gemstones make it to our platform.",
    },
    {
      id: "blockchain-transparency",
      title: "BLOCKCHAIN TRANSPARENCY",
      description:
        "Each gemstone is tokenized with full provenance and immutable records.",
    },
    {
      id: "secure-custody",
      title: "SECURE CUSTODY",
      description: "Your assets are stored in insured, world-class vaults.",
    },
    {
      id: "global-marketplace",
      title: "GLOBAL MARKETPLACE",
      description:
        "Access a trusted network of sellers, buyers, and collectors worldwide.",
    },
    {
      id: "diverse-selection",
      title: "DIVERSE SELECTION",
      description: "From rare colored gems to investment-grade classics.",
    },
    {
      id: "easy-ownership",
      title: "EASY OWNERSHIP",
      description:
        "Buy fractional or whole gemstones with ease and confidence.",
    },
  ] as const satisfies readonly AudiencePoint[],
};

/**
 * The specimen record the board draws on its phone. It is labelled as an
 * example so it reads as a sample passport rather than a stone for sale, which
 * is how the site's existing passport pages present their own sample.
 */
export const buyersPassport = {
  label: "EXAMPLE RECORD",
  brand: "GemReserve.io",
  heading: "Asset Details",
  name: "Natural Blue Sapphire",
  imageAlt: "A faceted oval natural blue sapphire",
  fields: [
    { id: "weight", label: "Weight", value: "5.23 ct" },
    { id: "shape", label: "Shape", value: "Oval" },
    { id: "origin", label: "Origin", value: "Sri Lanka" },
    { id: "quality", label: "Quality", value: "AAA" },
    { id: "token", label: "Token ID", value: "GR-SAPP-0001245" },
  ],
  footnote: "Physical asset linkage — verification-gated",
  verified: "Verified",
  action: "VIEW ASSET PASSPORT",
};

export const buyersAdvantage = {
  title: "THE GEMRESERVE ADVANTAGE",
  points: [
    {
      id: "expert-curation",
      title: "EXPERT CURATION",
      description:
        "Our team of gemologists and industry experts curate every gem.",
    },
    {
      id: "digital-passport",
      title: "DIGITAL ASSET PASSPORT",
      description:
        "Access a comprehensive digital passport with certifications, imaging, and history.",
    },
    {
      id: "market-data",
      title: "REAL-TIME MARKET DATA",
      description:
        "Stay informed with live pricing, market trends, and insights.",
    },
    {
      id: "private",
      title: "PRIVATE & CONFIDENTIAL",
      description:
        "We value your privacy. All transactions are secure and discreet.",
    },
    {
      id: "support",
      title: "DEDICATED SUPPORT",
      description:
        "Our team is here to help you at every step of your journey.",
    },
  ] as const satisfies readonly AudiencePoint[],
};

export const buyersProcessTitle = "HOW IT WORKS FOR BUYERS";

export const buyersSteps: readonly AudienceStep[] = [
  {
    id: "explore",
    step: 1,
    title: "EXPLORE",
    description: "Browse our curated collection of verified gemstones.",
  },
  {
    id: "select",
    step: 2,
    title: "SELECT",
    description: "Choose the gemstone that matches your preferences.",
  },
  {
    id: "verify",
    step: 3,
    title: "VERIFY",
    description: "Review the digital asset passport and expert certifications.",
  },
  {
    id: "purchase",
    step: 4,
    title: "PURCHASE",
    description: "Buy using your preferred payment method or crypto.",
  },
  {
    id: "custody",
    step: 5,
    title: "SECURE CUSTODY",
    description: "Your gemstone is securely stored in our insured vaults.",
  },
  {
    id: "own",
    step: 6,
    title: "OWN & BENEFIT",
    description: "Hold, trade, or redeem your asset with full confidence.",
  },
];

export const buyersServeTitle = "WHO WE SERVE";

export const buyersGroups: readonly AudienceGroup[] = [
  {
    id: "investors",
    title: "INVESTORS",
    description:
      "Diversify your portfolio with rare and valuable gemstone assets.",
  },
  {
    id: "collectors",
    title: "COLLECTORS",
    description:
      "Acquire unique, high-quality gemstones with verified provenance.",
  },
  {
    id: "jewelers",
    title: "JEWELERS",
    description:
      "Source exceptional stones for your creations with complete trust.",
  },
  {
    id: "traders",
    title: "TRADERS",
    description: "Access a global marketplace with liquidity and transparency.",
  },
  {
    id: "gift-buyers",
    title: "GIFT BUYERS",
    description: "Give the gift of lasting value, beauty, and meaning.",
  },
];

export const buyersClose = {
  titleLines: ["BE PART OF THE FUTURE", "OF GEMSTONE OWNERSHIP"],
  description:
    "Own gemstones that combine beauty, rarity, and real investment opportunities.",
  imageSrc: "/images/sections/vault-tray.webp",
  imageAlt: "An open vault case holding a tray of coloured gemstones",
  marks: [
    { id: "early-access", label: "Early Access" },
    { id: "member-benefits", label: "Member Benefits" },
    { id: "exclusive-gems", label: "Exclusive Gems" },
    { id: "market-insights", label: "Market Insights" },
  ],
  cta: {
    title: "JOIN THE EARLY PARTICIPATION WAITLIST",
    description:
      "Be the first to access our curated gemstone collection, exclusive offerings, and updates.",
    buttonLabel: "Join the Waitlist",
    supportingText: "Limited spots available.",
  },
};
