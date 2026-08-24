/**
 * Redemption Portal — transcribed from the client's board.
 *
 * The board is an interface mockup: a laptop showing a dashboard, and a
 * full-width drawing of that dashboard beneath it. Everything here is that
 * interface reproduced as a static preview. There is no account system, no
 * token balance and no order to track, so nothing in it is wired to behave —
 * the preview is labelled as a preview, its figures are labelled as sample
 * figures, and the closing action is the waitlist rather than a portal login
 * that would lead nowhere.
 *
 * The guarantee panel's "IGI/GRS certified gemstone" is the board's own line;
 * both labs are already named across the site.
 */

export const portalHero = {
  breadcrumb: ["Home", "Technology", "Redemption Portal"] as const,
  titleLines: ["Redemption Portal", "Your Assets. Your Choice."] as const,
  tagline: "Digital Ownership. Physical Freedom.",
  description:
    "The GemReserve.io Redemption Portal empowers token holders to redeem their physical gemstones securely, transparently and anywhere in the world.",
} as const;

export interface PortalAssurance {
  id: string;
  title: string;
  description: string;
}

export const portalAssurances: readonly PortalAssurance[] = [
  {
    id: "backed",
    title: "100% BACKED",
    description: "By real, physical gemstones",
  },
  {
    id: "transparent",
    title: "SECURE & TRANSPARENT",
    description: "On-chain verified at every step",
  },
  {
    id: "delivery",
    title: "GLOBAL DELIVERY",
    description: "Insured shipping worldwide",
  },
  {
    id: "control",
    title: "FULL CONTROL",
    description: "You request. You own. You redeem.",
  },
];

export interface PortalStep {
  id: string;
  step: number;
  title: string;
  description: string;
}

export const portalProcessTitle = "THE REDEMPTION PROCESS";

export const portalProcess: readonly PortalStep[] = [
  {
    id: "login",
    step: 1,
    title: "LOG IN",
    description: "Access your account on the Redemption Portal.",
  },
  {
    id: "select",
    step: 2,
    title: "SELECT TOKEN",
    description:
      "Choose the token you wish to redeem and review gemstone details.",
  },
  {
    id: "eligibility",
    step: 3,
    title: "ELIGIBILITY CHECK",
    description:
      "We verify your KYC, token ownership and redemption eligibility.",
  },
  {
    id: "request",
    step: 4,
    title: "SUBMIT REQUEST",
    description:
      "Review and confirm your redemption request and shipping information.",
  },
  {
    id: "verification",
    step: 5,
    title: "VERIFICATION",
    description: "Our team verifies your request and prepares your gemstone.",
  },
  {
    id: "shipping",
    step: 6,
    title: "SECURE SHIPPING",
    description:
      "Your gemstone is insured, professionally packaged and shipped.",
  },
  {
    id: "receive",
    step: 7,
    title: "RECEIVE & OWN",
    description: "Receive your gemstone and full documentation. You own it.",
  },
];

export interface PortalFeature {
  id: string;
  title: string;
  description: string;
}

export const portalFeaturesTitle = "PORTAL FEATURES";

export const portalFeatures: readonly PortalFeature[] = [
  {
    id: "eligibility",
    title: "Real-Time Eligibility",
    description:
      "Instantly see which tokens are eligible for physical redemption.",
  },
  {
    id: "on-chain",
    title: "On-Chain Verification",
    description:
      "Every token and asset is verified on-chain for full transparency.",
  },
  {
    id: "documentation",
    title: "Complete Documentation",
    description:
      "Access gemological reports, certificates, and proof of reserves.",
  },
  {
    id: "tracking",
    title: "Order Tracking",
    description: "Track your redemption order and shipment in real-time.",
  },
  {
    id: "communication",
    title: "Secure Communication",
    description: "Encrypted messaging with our support team at every step.",
  },
];

/* --- The dashboard preview ------------------------------------------------ */

export const previewNote = "Interface preview. Sample data.";

export interface PortalNavItem {
  id: string;
  label: string;
}

export const portalNav: readonly PortalNavItem[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "tokens", label: "My Tokens" },
  { id: "redeem", label: "Redeem" },
  { id: "orders", label: "Orders" },
  { id: "shipments", label: "Shipments" },
  { id: "documents", label: "Documents" },
  { id: "settings", label: "Settings" },
  { id: "support", label: "Support" },
];

export const portalNavActiveId = "tokens";

export interface PortalToken {
  id: string;
  assetId: string;
  name: string;
  imageSrc: string;
  imageAlt: string;
  cut: string;
  treatment: string;
  weight: string;
  origin: string;
  eligibility: string;
}

export const tokenTableTitle = "My Redeemable Tokens";

export const tokenTableColumns = [
  "Token ID / Asset",
  "Gemstone Details",
  "Weight",
  "Origin",
  "Eligibility",
  "Action",
] as const;

export const portalTokens: readonly PortalToken[] = [
  {
    id: "ruby",
    assetId: "GR-RUB-000245",
    name: "Ruby",
    imageSrc: "/images/gems/ruby.webp",
    imageAlt: "A cushion-cut deep red ruby",
    cut: "Oval Cut",
    treatment: "Heated",
    weight: "1.00 ct",
    origin: "Mozambique",
    eligibility: "Eligible",
  },
  {
    id: "sapphire",
    assetId: "GR-SAP-000178",
    name: "Sapphire",
    imageSrc: "/images/gems/blue-sapphire.webp",
    imageAlt: "An oval-cut deep blue sapphire",
    cut: "Cushion Cut",
    treatment: "No Heat",
    weight: "2.45 ct",
    origin: "Sri Lanka",
    eligibility: "Eligible",
  },
  {
    id: "emerald",
    assetId: "GR-EMR-000112",
    name: "Emerald",
    imageSrc: "/images/gems/emerald.webp",
    imageAlt: "An emerald-cut vivid green emerald",
    cut: "Emerald Cut",
    treatment: "Minor Oil",
    weight: "1.35 ct",
    origin: "Zambia",
    eligibility: "Eligible",
  },
];

export const tokenActionLabel = "Redeem";

export const portalHelp = {
  title: "Need help?",
  description: "Our support team is available 24/7 to assist you.",
  actionLabel: "Contact Support",
} as const;

export interface OrderStage {
  id: string;
  label: string;
  timestamp: string;
}

export const orderStatusTitle = "Order Status";

export const orderStages: readonly OrderStage[] = [
  {
    id: "submitted",
    label: "Request Submitted",
    timestamp: "May 20 — 10:15 AM",
  },
  { id: "review", label: "Under Review", timestamp: "May 20 — 11:02 AM" },
  { id: "approved", label: "Approved", timestamp: "May 20 — 02:45 PM" },
  {
    id: "preparing",
    label: "Preparing Gemstone",
    timestamp: "May 21 — 09:20 AM",
  },
  { id: "shipped", label: "Shipped", timestamp: "May 22 — 03:30 PM" },
  { id: "delivered", label: "Delivered", timestamp: "May 26 — 11:10 AM" },
];

/* --- Closing sections ----------------------------------------------------- */

export const trustStripTitle = "SECURE. VERIFIED. TRUSTED.";

export interface TrustItem {
  id: string;
  title: string;
  description: string;
}

export const trustItems: readonly TrustItem[] = [
  {
    id: "backed",
    title: "100% BACKED",
    description:
      "Every token is 100% backed by a specific physical gemstone in secure vaults.",
  },
  {
    id: "verified",
    title: "INDEPENDENTLY VERIFIED",
    description:
      "Gemstones are verified by leading gemological laboratories and auditors.",
  },
  {
    id: "vaults",
    title: "SECURE VAULTS",
    description:
      "Stored in world-class vaults with 24/7 monitoring and insurance coverage.",
  },
  {
    id: "delivery",
    title: "GLOBAL DELIVERY",
    description:
      "We ship to 100+ countries with full insurance and discreet packaging.",
  },
  {
    id: "transparency",
    title: "FULL TRANSPARENCY",
    description:
      "On-chain verification, real-time tracking and complete audit trail.",
  },
];

export const guarantee = {
  title: "Our Redemption Guarantee",
  description:
    "We guarantee that the physical gemstone you receive is the exact asset represented by your token. Backed by our Proof of Reserves, independent audits and transparent processes, your trust is our foundation.",
  imageSrc: "/images/sections/gem-inspection.webp",
  imageAlt: "A gloved hand holding a red gemstone in tweezers",
  checks: [
    "Exact match to your token",
    "IGI/GRS certified gemstone",
    "Insured delivery",
    "30-day satisfaction assurance*",
  ],
  footnote: "*Terms and conditions apply.",
} as const;

export const portalCta = {
  titleLines: ["Digital Today. Physical Forever."] as const,
  description: "Redeem your gemstones. Own what matters.",
  buttonLabel: "Join the Waitlist",
  supportingText: "The portal opens with the platform.",
  imageSrc: "/images/sections/redemption-band.webp",
  imageAlt: "Six faceted gemstones in a row on a dark surface",
} as const;
