export type AssetCategory =
  "Ruby" | "Sapphire" | "Emerald" | "Diamond" | "Other Precious Stones";

export interface VerificationFlag {
  readonly requiresClientVerification: boolean;
}

export interface BreadcrumbItem {
  readonly label: string;
  readonly href?: string;
}

export interface AssetsHeroContent extends VerificationFlag {
  readonly breadcrumbs: readonly BreadcrumbItem[];
  readonly title: {
    readonly primary: string;
    readonly accent: string;
  };
  readonly lead: string;
  readonly description: string;
  readonly technologyCallout: {
    readonly titleLines: readonly [string, string];
    readonly description: string;
    readonly requiresClientVerification: boolean;
  };
}

export interface AssetValueProposition extends VerificationFlag {
  readonly id: "backed" | "verified" | "borderless" | "redeemable";
  readonly title: string;
  readonly description: string;
}

export interface AssetMetric extends VerificationFlag {
  readonly id: "types" | "verified-assets" | "asset-value" | "countries";
  readonly value: string;
  readonly label: string;
  readonly detail: string;
}

export interface AssetRegistryCta extends VerificationFlag {
  readonly title: string;
  readonly description: string;
}

export interface AssetFilterOption {
  readonly value:
    | "all"
    | "ruby"
    | "sapphire"
    | "emerald"
    | "diamond"
    | "other-precious-stones";
  readonly label: string;
  readonly category: AssetCategory | null;
}

export interface AssetSortOption {
  readonly value: "popularity";
  readonly label: string;
}

export type GemstoneOriginOrGrade =
  | {
      readonly kind: "origin";
      readonly value: string;
    }
  | {
      readonly kind: "grade";
      readonly value: string;
    };

export interface GemstoneWeight {
  readonly value: number;
  readonly label: string;
}

export interface GemstonePrice extends VerificationFlag {
  readonly amount: number;
  readonly currency: "USD";
  readonly formatted: string;
}

interface GemstoneAssetBase extends VerificationFlag {
  readonly id: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly name: string;
  readonly category: AssetCategory;
  readonly originOrGrade: GemstoneOriginOrGrade;
  readonly weight: GemstoneWeight;
  readonly shape: string;
  readonly report: string;
  readonly price: GemstonePrice;
  readonly ctaLabel: "View Details";
}

export type GemstoneAsset = GemstoneAssetBase &
  (
    | {
        readonly treatment: string;
        readonly quality?: never;
      }
    | {
        readonly treatment?: never;
        readonly quality: string;
      }
  );

export interface InvestmentReason extends VerificationFlag {
  readonly id:
    | "intrinsic-value"
    | "limited-supply"
    | "portable-wealth"
    | "intergenerational";
  readonly title: string;
  readonly description: string;
}

export interface AssetWaitlistCta extends VerificationFlag {
  readonly titleLines: readonly [string, string];
  readonly description: string;
  readonly buttonLabel: string;
  readonly supportingText: string;
}

export const assetsHero = {
  breadcrumbs: [
    { label: "HOME", href: "/" },
    { label: "ASSETS", href: "/assets" },
    { label: "EXPLORE GEMSTONE ASSETS" },
  ],
  title: {
    primary: "Explore",
    accent: "Gemstone Assets",
  },
  lead: "Real gemstones. Real value. Real ownership.",
  description:
    "Every gemstone in the GemReserve ecosystem is 100% backed by real, physical assets securely held in insured vaults. Explore our curated collection of investment-grade gemstones, each tokenized, verified and ready for global ownership.",
  technologyCallout: {
    titleLines: ["BACKED BY NATURE.", "POWERED BY TECHNOLOGY."],
    description:
      "GemReserve bridges the timeless value of gemstones with the transparency and efficiency of blockchain technology.",
    requiresClientVerification: true,
  },
  requiresClientVerification: true,
} as const satisfies AssetsHeroContent;

export const assetValuePropositions = [
  {
    id: "backed",
    title: "100% BACKED",
    description:
      "Every token is backed by a physical gemstone in secure vaults.",
    requiresClientVerification: true,
  },
  {
    id: "verified",
    title: "INDEPENDENTLY VERIFIED",
    description: "Gemmological reports from leading laboratories and auditors.",
    requiresClientVerification: true,
  },
  {
    id: "borderless",
    title: "LIQUID & BORDERLESS",
    description:
      "Own, trade and transfer tokenized gemstones anywhere in the world.",
    requiresClientVerification: true,
  },
  {
    id: "redeemable",
    title: "REDEEMABLE",
    description: "Redeem your gemstone and receive the physical asset you own.",
    requiresClientVerification: true,
  },
] as const satisfies readonly AssetValueProposition[];

export const assetMetrics = [
  {
    id: "types",
    value: "25+",
    label: "Gemstone Types",
    detail: "Available",
    requiresClientVerification: true,
  },
  {
    id: "verified-assets",
    value: "1,850+",
    label: "Verified Assets",
    detail: "In Vaults",
    requiresClientVerification: true,
  },
  {
    id: "asset-value",
    value: "$186M+",
    label: "Total Asset Value",
    detail: "Backed by Gems",
    requiresClientVerification: true,
  },
  {
    id: "countries",
    value: "18",
    label: "Countries",
    detail: "Served",
    requiresClientVerification: true,
  },
] as const satisfies readonly AssetMetric[];

export const assetRegistryCta = {
  title: "View Asset Registry",
  description: "See all verified gemstone assets on the blockchain",
  requiresClientVerification: true,
} as const satisfies AssetRegistryCta;

export const assetCatalogHeading = "OUR GEMSTONE ASSETS";

export const assetFilterOptions = [
  { value: "all", label: "All Gemstones", category: null },
  { value: "ruby", label: "Ruby", category: "Ruby" },
  { value: "sapphire", label: "Sapphire", category: "Sapphire" },
  { value: "emerald", label: "Emerald", category: "Emerald" },
  { value: "diamond", label: "Diamond", category: "Diamond" },
  {
    value: "other-precious-stones",
    label: "Other Precious Stones",
    category: "Other Precious Stones",
  },
] as const satisfies readonly AssetFilterOption[];

export const assetSortLabel = "Sort by:";

export const assetSortOptions = [
  { value: "popularity", label: "Popularity" },
] as const satisfies readonly AssetSortOption[];

export const gemstoneAssets = [
  {
    id: "ruby-mozambique",
    imageSrc: "/images/gems/ruby.webp",
    imageAlt: "Cushion-cut red ruby",
    name: "Ruby",
    category: "Ruby",
    originOrGrade: { kind: "origin", value: "Mozambique" },
    weight: { value: 2.01, label: "2.01 ct" },
    shape: "Cushion Cut",
    treatment: "Heated",
    report: "GRS",
    price: {
      amount: 120.45,
      currency: "USD",
      formatted: "$ 120.45",
      requiresClientVerification: true,
    },
    ctaLabel: "View Details",
    requiresClientVerification: true,
  },
  {
    id: "blue-sapphire-sri-lanka",
    imageSrc: "/images/gems/blue-sapphire.webp",
    imageAlt: "Oval-cut deep blue sapphire",
    name: "Blue Sapphire",
    category: "Sapphire",
    originOrGrade: { kind: "origin", value: "Sri Lanka" },
    weight: { value: 2.35, label: "2.35 ct" },
    shape: "Oval Cut",
    treatment: "No Heat",
    report: "SSEF",
    price: {
      amount: 98.75,
      currency: "USD",
      formatted: "$ 98.75",
      requiresClientVerification: true,
    },
    ctaLabel: "View Details",
    requiresClientVerification: true,
  },
  {
    id: "emerald-zambia",
    imageSrc: "/images/gems/emerald.webp",
    imageAlt: "Emerald-cut green emerald",
    name: "Emerald",
    category: "Emerald",
    originOrGrade: { kind: "origin", value: "Zambia" },
    weight: { value: 1.82, label: "1.82 ct" },
    shape: "Emerald Cut",
    treatment: "Minor Oil",
    report: "GRS",
    price: {
      amount: 110.2,
      currency: "USD",
      formatted: "$ 110.20",
      requiresClientVerification: true,
    },
    ctaLabel: "View Details",
    requiresClientVerification: true,
  },
  {
    id: "diamond-d-color-vvs1",
    imageSrc: "/images/gems/diamond.webp",
    imageAlt: "Round brilliant white diamond",
    name: "Diamond",
    category: "Diamond",
    originOrGrade: { kind: "grade", value: "D Color, VVS1" },
    weight: { value: 1.01, label: "1.01 ct" },
    shape: "Round Brilliant",
    quality: "Excellent",
    report: "GIA",
    price: {
      amount: 140.8,
      currency: "USD",
      formatted: "$ 140.80",
      requiresClientVerification: true,
    },
    ctaLabel: "View Details",
    requiresClientVerification: true,
  },
  {
    id: "pink-sapphire-madagascar",
    imageSrc: "/images/gems/pink-sapphire.webp",
    imageAlt: "Oval-cut pink sapphire",
    name: "Pink Sapphire",
    category: "Sapphire",
    originOrGrade: { kind: "origin", value: "Madagascar" },
    weight: { value: 1.65, label: "1.65 ct" },
    shape: "Oval Cut",
    treatment: "No Heat",
    report: "GRS",
    price: {
      amount: 86.3,
      currency: "USD",
      formatted: "$ 86.30",
      requiresClientVerification: true,
    },
    ctaLabel: "View Details",
    requiresClientVerification: true,
  },
  {
    id: "yellow-sapphire-thailand",
    imageSrc: "/images/gems/yellow-sapphire.webp",
    imageAlt: "Cushion-cut yellow sapphire",
    name: "Yellow Sapphire",
    category: "Sapphire",
    originOrGrade: { kind: "origin", value: "Thailand" },
    weight: { value: 1.9, label: "1.90 ct" },
    shape: "Cushion Cut",
    treatment: "No Heat",
    report: "GRS",
    price: {
      amount: 74.5,
      currency: "USD",
      formatted: "$ 74.50",
      requiresClientVerification: true,
    },
    ctaLabel: "View Details",
    requiresClientVerification: true,
  },
  {
    id: "amethyst-uruguay",
    imageSrc: "/images/gems/amethyst.webp",
    imageAlt: "Oval-cut purple amethyst",
    name: "Amethyst",
    category: "Other Precious Stones",
    originOrGrade: { kind: "origin", value: "Uruguay" },
    weight: { value: 3.25, label: "3.25 ct" },
    shape: "Oval Cut",
    treatment: "None",
    report: "N/A",
    price: {
      amount: 28.75,
      currency: "USD",
      formatted: "$ 28.75",
      requiresClientVerification: true,
    },
    ctaLabel: "View Details",
    requiresClientVerification: true,
  },
  {
    id: "aquamarine-brazil",
    imageSrc: "/images/gems/aquamarine.webp",
    imageAlt: "Emerald-cut aquamarine",
    name: "Aquamarine",
    category: "Other Precious Stones",
    originOrGrade: { kind: "origin", value: "Brazil" },
    weight: { value: 2.4, label: "2.40 ct" },
    shape: "Emerald Cut",
    treatment: "None",
    report: "GRS",
    price: {
      amount: 45.6,
      currency: "USD",
      formatted: "$ 45.60",
      requiresClientVerification: true,
    },
    ctaLabel: "View Details",
    requiresClientVerification: true,
  },
  {
    id: "spinel-tanzania",
    imageSrc: "/images/gems/spinel.webp",
    imageAlt: "Cushion-cut red spinel",
    name: "Spinel",
    category: "Other Precious Stones",
    originOrGrade: { kind: "origin", value: "Tanzania" },
    weight: { value: 1.65, label: "1.65 ct" },
    shape: "Cushion Cut",
    treatment: "No Heat",
    report: "GRS",
    price: {
      amount: 62.1,
      currency: "USD",
      formatted: "$ 62.10",
      requiresClientVerification: true,
    },
    ctaLabel: "View Details",
    requiresClientVerification: true,
  },
  {
    id: "tsavorite-garnet-kenya",
    imageSrc: "/images/gems/tsavorite-garnet.webp",
    imageAlt: "Round-cut green tsavorite garnet",
    name: "Tsavorite Garnet",
    category: "Other Precious Stones",
    originOrGrade: { kind: "origin", value: "Kenya" },
    weight: { value: 1.28, label: "1.28 ct" },
    shape: "Round Cut",
    treatment: "None",
    report: "GRS",
    price: {
      amount: 52.3,
      currency: "USD",
      formatted: "$ 52.30",
      requiresClientVerification: true,
    },
    ctaLabel: "View Details",
    requiresClientVerification: true,
  },
] as const satisfies readonly GemstoneAsset[];

export const investmentSectionHeading = "WHY INVEST IN GEMSTONE ASSETS?";

export const investmentReasons = [
  {
    id: "intrinsic-value",
    title: "INTRINSIC VALUE",
    description: "Gemstones have enduring value across centuries and cultures.",
    requiresClientVerification: true,
  },
  {
    id: "limited-supply",
    title: "LIMITED SUPPLY",
    description:
      "High-quality gemstones are rare by nature and increasingly scarce.",
    requiresClientVerification: true,
  },
  {
    id: "portable-wealth",
    title: "PORTABLE WEALTH",
    description: "Compact, durable and universally recognized store of value.",
    requiresClientVerification: true,
  },
  {
    id: "intergenerational",
    title: "INTERGENERATIONAL",
    description: "A tangible asset class that enhances portfolio resilience.",
    requiresClientVerification: true,
  },
] as const satisfies readonly InvestmentReason[];

export const assetWaitlistCta = {
  titleLines: ["Own Timeless Beauty.", "Backed by Trust."],
  description:
    "Join thousands of investors building real wealth with real gemstones on the world’s most transparent tokenized asset platform.",
  buttonLabel: "Join the Waitlist",
  supportingText: "Be among the first to gain early access.",
  requiresClientVerification: true,
} as const satisfies AssetWaitlistCta;
