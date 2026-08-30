export interface VerificationAwareContent {
  readonly requiresClientVerification: boolean;
}

export interface HomeAnnouncement extends VerificationAwareContent {
  readonly message: string;
}

export interface HomeHeroContent extends VerificationAwareContent {
  readonly eyebrow: string;
  readonly titleLines: readonly [string, string, string];
  readonly description: string;
  readonly primaryActionLabel: string;
  readonly secondaryActionLabel: string;
}

export type HomeTrustPillarId =
  | "physically-backed"
  | "independent"
  | "institutional"
  | "global"
  | "transparent"
  | "redeemable";

export interface HomeTrustPillar extends VerificationAwareContent {
  readonly id: HomeTrustPillarId;
  readonly title: string;
  readonly description: string;
}

export type HomeProcessStepId =
  | "source"
  | "verify"
  | "appraise"
  | "custody"
  | "tokenize"
  | "own"
  | "trade"
  | "redeem";

export interface HomeProcessStep extends VerificationAwareContent {
  readonly id: HomeProcessStepId;
  readonly step: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  readonly title: string;
  readonly description: string;
}

export type HomeCatalogPreviewItemId =
  | "burmese-ruby"
  | "colombian-emerald"
  | "sri-lankan-sapphire"
  | "padparadscha-sapphire"
  | "white-diamond"
  | "fancy-yellow-diamond";

export type HomeCatalogPreviewImagePath =
  | "/images/gems/ruby.webp"
  | "/images/gems/emerald.webp"
  | "/images/gems/blue-sapphire.webp"
  | "/images/gems/pink-sapphire.webp"
  | "/images/gems/diamond.webp"
  | "/images/gems/yellow-sapphire.webp";

export interface HomeCatalogPreviewItem extends VerificationAwareContent {
  readonly id: HomeCatalogPreviewItemId;
  readonly name: string;
  readonly descriptor: string;
  readonly imageSrc: HomeCatalogPreviewImagePath;
  readonly imageAlt: string;
  readonly actionLabel: "View Details";
}

export type HomeMetricId =
  | "real-gemstones"
  | "verified-gems"
  | "gemstone-types"
  | "secure-vaults"
  | "countries-served"
  | "transparent-reporting";

export interface HomeMetric extends VerificationAwareContent {
  readonly id: HomeMetricId;
  readonly value: string;
  readonly label: string;
}

export interface HomeWaitlistCta extends VerificationAwareContent {
  readonly eyebrow: string;
  readonly titleLines: readonly [string, string];
  readonly description: string;
  readonly emailPlaceholder: string;
  readonly actionLabel: string;
}

export const homeAnnouncement = {
  message:
    "GEMRESERVE.IO IS A LITHUANIAN COMPANY BUILDING THE BRIDGE BETWEEN THE WORLD OF PRECIOUS GEMSTONES AND THE FUTURE OF DIGITAL ASSETS.",
  requiresClientVerification: true,
} as const satisfies HomeAnnouncement;

export const homeHero = {
  eyebrow: "THE FUTURE OF GEMSTONE OWNERSHIP",
  titleLines: ["Real Gems.", "Real Value.", "Real Trust."],
  description:
    "GemReserve.io tokenizes the world's most exquisite gemstones, backed by independent verification, secure custody, and transparency you can prove.",
  primaryActionLabel: "Explore Gemstones",
  secondaryActionLabel: "How It Works",
  requiresClientVerification: true,
} as const satisfies HomeHeroContent;

export const homeTrustPillars = [
  {
    id: "physically-backed",
    title: "100%",
    description: "Physically Backed by Real Gemstones",
    requiresClientVerification: true,
  },
  {
    id: "independent",
    title: "Independent",
    description: "Gemological Verification",
    requiresClientVerification: true,
  },
  {
    id: "institutional",
    title: "Institutional",
    description: "Grade Custody & Security",
    requiresClientVerification: true,
  },
  {
    id: "global",
    title: "Global",
    description: "Accessible Worldwide",
    requiresClientVerification: true,
  },
  {
    id: "transparent",
    title: "Transparent",
    description: "On-Chain Proof & Reporting",
    requiresClientVerification: true,
  },
  {
    id: "redeemable",
    title: "Redeemable",
    description: "Physical Redemption Available",
    requiresClientVerification: true,
  },
] as const satisfies readonly HomeTrustPillar[];

export const homeProcessSectionTitle = "HOW GEMRESERVE WORKS";

// The eight steps split cleanly in half: the first four secure the physical
// stone, the last four represent it digitally. Naming that split is what turns
// the row into the bridge the brand describes.
export const homeProcessPhases = [
  {
    id: "physical",
    label: "Physical custody",
    caption: "The stone is sourced, proven and vaulted",
    span: 4,
  },
  {
    id: "digital",
    label: "Digital ownership",
    caption: "The stone is tokenized, held, traded and redeemed",
    span: 4,
  },
] as const;

export const homeProcessSteps = [
  {
    id: "source",
    step: 1,
    title: "SOURCE",
    description: "We source exceptional gemstones from trusted origins.",
    requiresClientVerification: true,
  },
  {
    id: "verify",
    step: 2,
    title: "VERIFY",
    description:
      "Independent gemological labs verify identity, quality & authenticity.",
    requiresClientVerification: true,
  },
  {
    id: "appraise",
    step: 3,
    title: "APPRAISE",
    description: "Experts appraise each gemstone to determine market value.",
    requiresClientVerification: true,
  },
  {
    id: "custody",
    step: 4,
    title: "CUSTODY",
    description: "Gems are securely stored in insured, institutional vaults.",
    requiresClientVerification: true,
  },
  {
    id: "tokenize",
    step: 5,
    title: "TOKENIZE",
    description: "Each gemstone is tokenized on the blockchain.",
    requiresClientVerification: true,
  },
  {
    id: "own",
    step: 6,
    title: "OWN",
    description: "You own a digital token representing real gem ownership.",
    requiresClientVerification: true,
  },
  {
    id: "trade",
    step: 7,
    title: "TRADE",
    description: "Trade your tokens securely on our compliant platform.",
    requiresClientVerification: true,
  },
  {
    id: "redeem",
    step: 8,
    title: "REDEEM",
    description: "Redeem your gemstone in physical form anytime.",
    requiresClientVerification: true,
  },
] as const satisfies readonly HomeProcessStep[];

export const homeCatalogPreviewSectionTitle =
  "EXQUISITE GEMSTONES. ENDURING VALUE.";

export const homeCatalogPreviewItems = [
  {
    id: "burmese-ruby",
    name: "Burmese Ruby",
    descriptor: "The King of Gems",
    imageSrc: "/images/gems/ruby.webp",
    imageAlt: "Faceted Burmese ruby",
    actionLabel: "View Details",
    requiresClientVerification: true,
  },
  {
    id: "colombian-emerald",
    name: "Colombian Emerald",
    descriptor: "Vivid. Rare. Legendary.",
    imageSrc: "/images/gems/emerald.webp",
    imageAlt: "Faceted Colombian emerald",
    actionLabel: "View Details",
    requiresClientVerification: true,
  },
  {
    id: "sri-lankan-sapphire",
    name: "Sri Lankan Sapphire",
    descriptor: "Timeless. Elegant. Rare.",
    imageSrc: "/images/gems/blue-sapphire.webp",
    imageAlt: "Faceted Sri Lankan blue sapphire",
    actionLabel: "View Details",
    requiresClientVerification: true,
  },
  {
    id: "padparadscha-sapphire",
    name: "Padparadscha Sapphire",
    descriptor: "The Sunrise Gem",
    imageSrc: "/images/gems/pink-sapphire.webp",
    imageAlt: "Faceted pink Padparadscha sapphire",
    actionLabel: "View Details",
    requiresClientVerification: true,
  },
  {
    id: "white-diamond",
    name: "White Diamond",
    descriptor: "Pure. Brilliant. Eternal.",
    imageSrc: "/images/gems/diamond.webp",
    imageAlt: "Faceted white diamond",
    actionLabel: "View Details",
    requiresClientVerification: true,
  },
  {
    id: "fancy-yellow-diamond",
    name: "Fancy Yellow Diamond",
    descriptor: "Rare. Natural. Precious.",
    imageSrc: "/images/gems/yellow-sapphire.webp",
    imageAlt: "Faceted fancy yellow diamond",
    actionLabel: "View Details",
    requiresClientVerification: true,
  },
] as const satisfies readonly HomeCatalogPreviewItem[];

export const homeCatalogPreviewActionLabel = "View All Gemstones";

// Four figures were published here: "500+ Verified Gems", "20+ Gemstone
// Types", "5 Secure Vaults" and "50+ Countries Served". None is supported, and
// all four contradicted the numbers the same claims carried on /assets and
// /gemstone-programs — 500+ against 1,850+, 20+ against 25+, 50 countries
// against 18 — which is its own evidence that none was sourced.
//
// The ids stay: MetricStrip picks each card's icon by position, so the strip
// keeps six cards, the same icons and the same layout. Only the claim changed,
// and no figure replaced it.
export const homeMetrics = [
  {
    id: "real-gemstones",
    value: "100%",
    label: "Real Gemstones",
    requiresClientVerification: true,
  },
  {
    id: "verified-gems",
    value: "Evidence-controlled",
    label: "Gemstone Records",
    requiresClientVerification: true,
  },
  {
    id: "gemstone-types",
    value: "Published catalogue",
    label: "Gemstone Types",
    requiresClientVerification: true,
  },
  {
    id: "secure-vaults",
    value: "Arrangements pending",
    label: "Custody",
    requiresClientVerification: true,
  },
  {
    id: "countries-served",
    value: "Eligibility pending",
    label: "Jurisdictions",
    requiresClientVerification: true,
  },
  {
    id: "transparent-reporting",
    value: "24/7",
    label: "Transparent Reporting",
    requiresClientVerification: true,
  },
] as const satisfies readonly HomeMetric[];

export const homeWaitlistCta = {
  eyebrow: "JOIN THE FUTURE",
  titleLines: ["Be Part of the Next", "Gemstone Revolution"],
  description:
    "Early access to exclusive gemstone offerings, insights and platform updates.",
  emailPlaceholder: "Enter your email address",
  actionLabel: "Join Waitlist",
  requiresClientVerification: true,
} as const satisfies HomeWaitlistCta;
