/**
 * Physical Redemption — transcribed from the client's board.
 *
 * One line was not carried across verbatim. The logistics row named DHL, FedEx
 * and UPS and drew their marks; no courier relationship is stated anywhere else
 * on the site, and the marks are their trademarks, so the row keeps the claim it
 * was making — that shipping runs through established secure carriers — without
 * asserting a named partnership on their behalf.
 *
 * The fee table is the board's own, including its heading and its footnote. It
 * is reproduced rather than rounded off, because it is the only fee figure the
 * client has published and softening it would misstate their product.
 */

export interface RedemptionHeroCalloutItem {
  id: string;
  title: string;
  description: string;
}

export const redemptionHero = {
  breadcrumb: ["Home", "Technology", "Physical Redemption"] as const,
  titleLines: ["Physical", "Redemption"] as const,
  tagline: "From Digital to Tangible.",
  description:
    "At GemReserve.io, your ownership is real and redeemable. Every token is 100% backed by real, physical gemstones held in secure vaults. You have the ultimate right to redeem your assets and receive the physical gemstone you own.",
  callout: [
    {
      id: "your-choice",
      title: "YOUR ASSET. YOUR CHOICE.",
      description: "Redeem your gemstones for physical delivery anytime.",
    },
    {
      id: "backed",
      title: "100% BACKED. 100% REAL.",
      description:
        "Every redemption is fulfilled from our actual, insured reserves.",
    },
    {
      id: "delivery",
      title: "GLOBAL & SECURE DELIVERY",
      description:
        "Discreet, insured shipping to your doorstep anywhere in the world.",
    },
    {
      id: "transparency",
      title: "TRANSPARENCY YOU CAN TRUST",
      description:
        "On-chain verification and third-party audits at every step.",
    },
  ] as readonly RedemptionHeroCalloutItem[],
} as const;

export interface RedemptionStep {
  id: string;
  step: number;
  title: string;
  description: string;
}

export const redemptionProcessTitle = "THE PHYSICAL REDEMPTION PROCESS";

export const redemptionProcess: readonly RedemptionStep[] = [
  {
    id: "request",
    step: 1,
    title: "SUBMIT REQUEST",
    description:
      "Log in to your account and submit a physical redemption request for the desired token amount.",
  },
  {
    id: "eligibility",
    step: 2,
    title: "ELIGIBILITY CHECK",
    description:
      "We verify your balance, ownership and KYC status to ensure you meet redemption requirements.",
  },
  {
    id: "lock",
    step: 3,
    title: "LOCK TOKENS",
    description:
      "The requested tokens are securely locked on-chain and cannot be traded while your request is processed.",
  },
  {
    id: "allocation",
    step: 4,
    title: "RESERVE ALLOCATION",
    description:
      "We allocate the corresponding physical gemstone from our verified and insured vault reserves.",
  },
  {
    id: "quality",
    step: 5,
    title: "QUALITY VERIFICATION",
    description:
      "Each gemstone undergoes final quality inspection, grading and documentation preparation.",
  },
  {
    id: "packaging",
    step: 6,
    title: "SECURE PACKAGING",
    description:
      "The gemstone is securely packaged with certificate, Digital Asset Passport and insurance coverage.",
  },
  {
    id: "delivery",
    step: 7,
    title: "INSURED DELIVERY",
    description:
      "Your gemstone is shipped via insured, secure delivery to your specified address worldwide.",
  },
];

export const redemptionProcessFootnote =
  "Average fulfillment time: 3–10 business days (depending on location and asset type).";

export interface RedemptionGuaranteeItem {
  id: string;
  title: string;
  description: string;
}

export const redemptionGuaranteeTitle = "REDEMPTION GUARANTEE";

export const redemptionGuarantee: readonly RedemptionGuaranteeItem[] = [
  {
    id: "legal-right",
    title: "Legal Right of Redemption",
    description:
      "Token holders have a contractual right to redeem the underlying physical asset.",
  },
  {
    id: "backed-reserves",
    title: "100% Backed Reserves",
    description:
      "All redemptions are fulfilled only from real, allocated and audited gemstone reserves.",
  },
  {
    id: "no-hidden-fees",
    title: "No Hidden Fees",
    description:
      "Transparent fees are displayed before you confirm your redemption.",
  },
  {
    id: "documentation",
    title: "Full Documentation",
    description:
      "Receive a Digital Asset Passport, gemological report and proof of authenticity with every redemption.",
  },
];

export const redemptionReceiveTitle = "WHAT YOU WILL RECEIVE";

export const redemptionReceiveItems: readonly string[] = [
  "Physical Gemstone",
  "Gemological Certificate",
  "Digital Asset Passport (NFC & QR)",
  "Secure, Insured Packaging",
];

export const redemptionReceiveImageAlt =
  "An oval-cut ruby in an open presentation box bearing the GemReserve crest";

export interface RedemptionRequirement {
  id: string;
  title: string;
  description: string;
}

export const redemptionRequirementsTitle = "REDEMPTION REQUIREMENTS";

export const redemptionRequirements: readonly RedemptionRequirement[] = [
  {
    id: "kyc",
    title: "KYC Verified Account",
    description: "Your account must be fully verified.",
  },
  {
    id: "minimums",
    title: "Minimum Redemption Amounts",
    description: "Defined minimums apply per asset type.",
  },
  {
    id: "fee",
    title: "Processing Fee",
    description:
      "A transparent redemption fee applies to cover handling, insurance and logistics.",
  },
  {
    id: "address",
    title: "Delivery Address",
    description: "Provide a valid shipping address. PO boxes are not accepted.",
  },
  {
    id: "compliance",
    title: "Compliance Check",
    description:
      "All redemptions are subject to compliance and sanction screening.",
  },
];

export interface LogisticsItem {
  id: string;
  title: string;
  description: string;
}

export const logisticsTitle = "SECURE LOGISTICS & DELIVERY";

export const logisticsItems: readonly LogisticsItem[] = [
  {
    id: "discreet",
    title: "DISCREET PACKAGING",
    description: "Unbranded, tamper-evident packaging for maximum privacy.",
  },
  {
    id: "insured",
    title: "FULLY INSURED",
    description: "Your shipment is 100% insured from our vault to your door.",
  },
  {
    id: "couriers",
    title: "TRUSTED COURIERS",
    description:
      "Shipments move through leading global couriers and specialist secure carriers.",
  },
  {
    id: "signature",
    title: "SIGNATURE REQUIRED",
    description: "Delivery is completed only with recipient signature.",
  },
  {
    id: "global",
    title: "GLOBAL DELIVERY",
    description: "We ship to 100+ countries with full compliance.",
  },
];

export interface FeeRow {
  id: string;
  assetType: string;
  minimum: string;
  fee: string;
}

export const feeTableTitle = "REDEMPTION FEE EXAMPLE";

export const feeTableColumns = [
  "Asset type",
  "Min. amount",
  "Redemption fee",
] as const;

export const feeTableRows: readonly FeeRow[] = [
  {
    id: "emeralds",
    assetType: "Emeralds",
    minimum: "1.00 ct",
    fee: "1.0% of value (min $250)",
  },
  {
    id: "rubies",
    assetType: "Rubies",
    minimum: "1.00 ct",
    fee: "1.0% of value (min $250)",
  },
  {
    id: "sapphires",
    assetType: "Sapphires",
    minimum: "1.00 ct",
    fee: "1.0% of value (min $250)",
  },
  {
    id: "diamonds",
    assetType: "Diamonds",
    minimum: "0.50 ct",
    fee: "1.0% of value (min $250)",
  },
];

export const feeTableFootnote =
  "Fees are subject to change. Please see the full fee schedule.";

export const onChainTransparencyTitle = "ON-CHAIN TRANSPARENCY";

export const onChainTransparencyIntro =
  "Every redemption is recorded on-chain for full transparency and immutable proof.";

export interface OnChainStage {
  id: string;
  label: string;
}

export const onChainStages: readonly OnChainStage[] = [
  { id: "locked", label: "Token Locked" },
  { id: "executed", label: "Redemption Executed" },
  { id: "shipped", label: "Asset Shipped" },
  { id: "completed", label: "Completed On-Chain" },
];

export const readyToRedeem = {
  title: "READY TO REDEEM?",
  description:
    "Turn your digital ownership into a tangible asset. Redeem with confidence, backed by real gemstones.",
  actionLabel: "Start Redemption Request",
  supportingText: "Have questions?",
  supportLinkLabel: "Contact our support team",
} as const;

export const redemptionCta = {
  title: "Real Ownership. Real Choice. Real Assets.",
  tagline: "You own it. You can trade it. You can redeem it.",
  description:
    "GemReserve.io gives you the freedom of blockchain ownership with the security and value of physical gemstones.",
  imageAlt: "Six faceted gemstones on a dark reflective surface",
} as const;
