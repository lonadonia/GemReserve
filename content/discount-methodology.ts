/**
 * 20% Discount Methodology — transcribed from the client's supplied board.
 *
 * Every figure on this page comes from the board's own worked example and is
 * presented as that: an example. The board labels the block "EXAMPLE: HOW THE
 * 20% DISCOUNT WORKS" and the numbers in it ($500,000 asset value, 50,000
 * tokens, $10.00 standard price, $8.00 early price) are the board's own
 * illustration of the arithmetic, not a stated token price, a launch price or
 * an allocation. Nothing here adds a reference value, a future price, an
 * implied profit or an expected return, because the board states none of those.
 *
 * The board's footer shows a Zurich, Switzerland location. That is the former
 * corporate jurisdiction and is not carried across; the site's own footer
 * carries the current entity.
 */

export interface DiscountHeroContent {
  readonly breadcrumb: readonly [string, string, string];
  readonly titleLines: readonly [string, string];
  readonly tagline: string;
  readonly paragraphs: readonly string[];
  readonly badge: { readonly figure: string; readonly label: string };
}

export const discountHero: DiscountHeroContent = {
  breadcrumb: ["Home", "Investors", "20% Discount Methodology"],
  titleLines: ["20% Discount", "Methodology"],
  tagline: "Real Value. Transparent Calculation. Built on Integrity.",
  paragraphs: [
    "At GemReserve.io, our 20% Early Participation Discount is designed to reward the first supporters of our platform.",
    "This discount is applied transparently and uniformly during the pre-sale phase, ensuring fair access to tokenized gemstone assets at a preferential price.",
  ],
  badge: { figure: "20%", label: "DISCOUNT" },
};

export interface DiscountMark {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export const discountMarks: readonly DiscountMark[] = [
  {
    id: "rewarding-early-believers",
    title: "REWARDING EARLY BELIEVERS",
    description:
      "The 20% discount recognizes and rewards those who support our vision from the beginning.",
  },
  {
    id: "fair-uniform",
    title: "FAIR & UNIFORM",
    description:
      "The discount is applied equally to all eligible participants during the Early Participation phase.",
  },
  {
    id: "transparent-methodology",
    title: "TRANSPARENT METHODOLOGY",
    description:
      "Our pricing model is clear, verifiable, and based on real asset valuation and market benchmarks.",
  },
  {
    id: "real-asset-backing",
    title: "REAL ASSET BACKING",
    description:
      "Each token is designed to link to a physical gemstone stored in secure, insured vaults.",
  },
  {
    id: "built-on-trust",
    title: "BUILT ON TRUST",
    description:
      "We believe transparency builds confidence. You know what you pay, and what you own.",
  },
];

export const discountCalculation = {
  title: "HOW THE 20% DISCOUNT IS CALCULATED",
  intro:
    "Our discount is applied to the Token Price, not to the underlying asset value. The discount therefore does not change the asset backing ratio, while providing early supporters with a meaningful advantage.",
  steps: [
    {
      id: "asset-valuation",
      step: 1,
      title: "ASSET VALUATION",
      description:
        "We determine the fair market value of each gemstone based on quality, rarity, size, and global market data.",
    },
    {
      id: "tokenization-model",
      step: 2,
      title: "TOKENIZATION MODEL",
      description:
        "The asset value is divided into fixed-supply tokens. The Standard Token Price is established for the public sale.",
    },
    {
      id: "early-participation-discount",
      step: 3,
      title: "EARLY PARTICIPATION DISCOUNT",
      description:
        "A 20% discount is applied to the Standard Token Price for all eligible participants during the Early Participation phase.",
    },
    {
      id: "secure-purchase",
      step: 4,
      title: "SECURE PURCHASE",
      description:
        "Participants purchase tokens at the discounted price through our secure platform using approved payment methods.",
    },
    {
      id: "full-asset-backing",
      step: 5,
      title: "FULL ASSET BACKING",
      description:
        "Each token purchased is designed to remain linked to the underlying physical gemstone asset in our secure vaults.",
    },
    {
      id: "value-realization",
      step: 6,
      title: "VALUE REALIZATION",
      description:
        "As the platform grows and demand increases, the value of your token is supported by real assets and market forces.",
    },
  ],
} as const;

export interface DiscountExampleRow {
  readonly id: string;
  readonly label: string;
  readonly standard: string;
  readonly early: string;
  readonly emphasis?: boolean;
}

/**
 * The board's worked example, kept exactly as it sets it out. The heading below
 * carries the board's own word "EXAMPLE" so the figures are never read as a
 * published token price: the asset, the supply and both prices are the board's
 * illustration of the arithmetic.
 */
export const discountExample = {
  title: "EXAMPLE: HOW THE 20% DISCOUNT WORKS",
  standardHeading: "STANDARD PUBLIC SALE PRICE",
  earlyHeading: "EARLY PARTICIPATION PRICE (20% DISCOUNT)",
  asset: "Asset: Aquamarine (Premium Grade)",
  badge: { figure: "20%", label: "DISCOUNT" },
  // Annotated rather than `as const satisfies`: the literal types would drop
  // the optional emphasis flag from every row that does not set it, and the
  // page has to be able to read it off any row.
  rows: [
    {
      id: "total-asset-value",
      label: "Total Asset Value",
      standard: "$500,000",
      early: "$500,000",
    },
    {
      id: "total-tokens",
      label: "Total Tokens Available",
      standard: "50,000",
      early: "50,000",
    },
    {
      id: "token-price",
      label: "Standard Token Price",
      standard: "$10.00",
      early: "$8.00",
    },
    {
      id: "investment-amount",
      label: "Investment Amount (1,000 Tokens)",
      standard: "$10,000.00",
      early: "$8,000.00",
      emphasis: true,
    },
  ] as readonly DiscountExampleRow[],
  // The board prints a different label above the discounted price column's third
  // row, so the row carries both.
  earlyRowLabels: {
    "token-price": "Discounted Token Price (20% Off)",
  } as Readonly<Record<string, string>>,
  footnote:
    "You pay $8.00 per token instead of $10.00, saving 20% while still receiving tokens linked to the same underlying asset.",
};

export const discountPrinciplesTitle = "OUR PRICING PRINCIPLES";

export const discountPrinciples: readonly DiscountMark[] = [
  {
    id: "fairness",
    title: "FAIRNESS",
    description:
      "The discount is the same for all eligible participants. No exceptions.",
  },
  {
    id: "transparency",
    title: "TRANSPARENCY",
    description: "Our methodology is public and verifiable at any time.",
  },
  {
    id: "integrity",
    title: "INTEGRITY",
    description: "Discounts apply only to token price, never to asset backing.",
  },
  {
    id: "value",
    title: "VALUE",
    description: "Early access. Better price. Stronger future potential.",
  },
  {
    id: "community-first",
    title: "COMMUNITY FIRST",
    description: "Early supporters are the foundation of our ecosystem.",
  },
];

export const discountCta = {
  imageAlt: "An open vault case holding a tray of coloured gemstones",
  title: "Be Early. Be Rewarded.",
  description:
    "Our 20% Early Participation Discount is our way of thanking the pioneers who believe in our mission. Join the waitlist to get early access and secure your tokens at the best price.",
  buttonLabel: "Join the Waitlist",
  supportingText: "Limited Time. Limited Spots.",
};
