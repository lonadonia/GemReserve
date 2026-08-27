/**
 * Gemstone Owners and Originators — transcribed from the client's supplied
 * board.
 *
 * This is the supply side of the platform, and the board keeps it that way: the
 * onboarding journey, the audiences served, what the platform provides, and what
 * tokenizing an owner's stones is meant to achieve. It is not restated as
 * investor messaging.
 *
 * Everything the page offers is stated as a capability. No vault operator,
 * insurer, laboratory, courier or auditor is named, because the board names
 * none; "world-class vaults" and "our experts" are the client's own words for
 * its own service and are carried across as such.
 */

import type {
  AudienceCallout,
  AudienceGroup,
  AudienceHero,
  AudienceMark,
  AudienceStep,
} from "./audience-page";

export const ownersHero: AudienceHero = {
  breadcrumb: ["Home", "Gemstone Owners and Originators"],
  titleLines: ["GEMSTONE OWNERS", "AND ORIGINATORS"],
  tagline: "Tokenize. Unlock Value. Expand Possibilities.",
  description:
    "GemReserve.io empowers gemstone owners, miners, cutters, dealers, and collections with a secure way to tokenize their assets, access global liquidity, and reach a worldwide network of verified investors and buyers.",
  heroBase: "/images/heroes/owners-hero",
};

export const ownersMarks: readonly AudienceMark[] = [
  {
    id: "maximize-value",
    title: "MAXIMIZE VALUE",
    description:
      "Unlock the full market value of your gemstones through tokenization.",
  },
  {
    id: "global-reach",
    title: "GLOBAL REACH",
    description:
      "Access a global investor base and expand your market beyond borders.",
  },
  {
    id: "liquidity-solutions",
    title: "LIQUIDITY SOLUTIONS",
    description:
      "Convert traditionally illiquid assets into tradable digital tokens.",
  },
  {
    id: "secure-compliant",
    title: "SECURE & COMPLIANT",
    description:
      "Institutional-grade custody, KYC/AML compliance, and on-chain transparency.",
  },
];

export const ownersCallout: AudienceCallout = {
  title: "REAL ASSETS. REAL VALUE.",
  description:
    "Your gemstones are more than beautiful. They are real assets—backed by nature, enhanced by expertise, and secured by blockchain technology.",
};

export const ownersServeTitle = "WHO WE SERVE";

export const ownersGroups: readonly AudienceGroup[] = [
  {
    id: "miners",
    title: "MINERS",
    description:
      "Tokenize rough gemstone production and gain access to new capital and markets.",
  },
  {
    id: "cutters",
    title: "CUTTERS & POLISHERS",
    description:
      "Turn your cut and polished gemstones into digital assets with verified value.",
  },
  {
    id: "dealers",
    title: "DEALERS & WHOLESALERS",
    description:
      "Expand your inventory's reach, attract investors, and increase liquidity.",
  },
  {
    id: "collections",
    title: "COLLECTION OWNERS",
    description:
      "Monetize collections or individual high-value gems while maintaining ownership.",
  },
  {
    id: "originators",
    title: "ORIGINATORS & BRANDS",
    description:
      "Create branded, tokenized gemstone programs and engage global markets.",
  },
];

export const ownersPlatform = {
  title: "YOUR GEMSTONES. OUR PLATFORM.",
  subtitle: "Endless Opportunities.",
  description:
    "GemReserve.io provides the infrastructure and support you need to tokenize your gemstones securely and efficiently.",
  points: [
    "Professional asset evaluation and certification",
    "High-resolution imaging and digital asset passport",
    "Secure custody in world-class vaults",
    "Blockchain tokenization with transparent records",
    "Access to global investors and buyers",
    "Secondary market trading and liquidity solutions",
    "Compliant with international regulations and standards",
  ],
  imageSrc: "/images/sections/gem-inspection.webp",
  imageAlt: "A gloved hand holding a red gemstone in tweezers",
};

export const ownersBenefits = {
  title: "BENEFITS OF TOKENIZING YOUR GEMSTONES",
  items: [
    { id: "valuation", label: "Real-time valuation and market visibility" },
    {
      id: "fractional",
      label: "Fractional ownership without giving up control",
    },
    { id: "liquidity", label: "Increased liquidity and capital efficiency" },
    { id: "provenance", label: "Enhanced trust through verified provenance" },
    { id: "exposure", label: "Global exposure and 24/7 market access" },
  ],
};

export const ownersProcessTitle = "HOW IT WORKS FOR YOU";

export const ownersSteps: readonly AudienceStep[] = [
  {
    id: "submit",
    step: 1,
    title: "SUBMIT YOUR ASSETS",
    description: "Provide details about your gemstones or collection.",
  },
  {
    id: "evaluate",
    step: 2,
    title: "EVALUATION & VERIFICATION",
    description: "Our experts evaluate and verify your assets.",
  },
  {
    id: "custody",
    step: 3,
    title: "SECURE CUSTODY",
    description: "Assets are securely stored in insured, world-class vaults.",
  },
  {
    id: "tokenize",
    step: 4,
    title: "TOKENIZATION",
    description: "Your gemstones are tokenized on the blockchain.",
  },
  {
    id: "market",
    step: 5,
    title: "GLOBAL MARKET ACCESS",
    description: "Tokens are offered to our network of investors and buyers.",
  },
];

export const ownersClose = {
  title: "PARTNER WITH GEMRESERVE.IO",
  subtitle: "Turn Your Gemstones Into Global Opportunities.",
  lines: [
    "Join a new era of asset ownership and financial freedom.",
    "Let us help you unlock the true potential of your gemstones.",
  ],
  imageSrc: "/images/sections/emerald-cut.webp",
  imageAlt: "An emerald-cut vivid green emerald",
  marks: [
    { id: "support", label: "EXPERT SUPPORT" },
    { id: "account", label: "DEDICATED ACCOUNT" },
    { id: "network", label: "GLOBAL NETWORK" },
    { id: "platform", label: "SECURE PLATFORM" },
  ],
  cta: {
    title: "READY TO GET STARTED?",
    description:
      "Join the Early Participation Waitlist and our team will contact you.",
    buttonLabel: "Join the Waitlist",
    supportingText: "Limited spots available.",
  },
};
