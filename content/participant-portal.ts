/**
 * Participant Portal — transcribed from the client's supplied board.
 *
 * The board is an interface mockup with figures in it: a dashboard reading
 * $2,458,750.00 total portfolio value, 12,850.45 GMR tokens, $245,680.75
 * unrealized gain at +11.24%, an allocation of 68.4% / 18.7% / 12.9%, a
 * "Welcome back, John Participant" greeting, and an asset table listing
 * GMR-COPPER, GMR-NICKEL, GMR-EMERALD and GMR-SAPPHIRE with supplies, balances
 * and values. There is no portal, no account system, no token and no holding.
 *
 * A dashboard is believed in a way that prose is not — a reader who scrolls
 * past a paragraph will still take a number off a chart. So the preview here
 * carries no figures at all. It shows the panels a participant's dashboard
 * would carry, in the arrangement the board draws, with every value blank and
 * the whole thing labelled an illustration. That is the same decision, for the
 * same reason, as the white-label dashboard on /licensing-white-label.
 *
 * The board's asset table also lists two industrial metals, copper and nickel,
 * which are not gemstones and are not part of anything this platform has
 * described. They are not carried across.
 *
 * The page is gated on `features.participantPortal`, which is off. Nothing here
 * offers a login, because a login that cannot succeed is worse than none —
 * and an anti-fraud page one click away tells readers that no one from
 * GemReserve will ever send them a sign-in link.
 */

export interface PortalHeroContent {
  readonly breadcrumb: readonly [string, string];
  readonly titleLines: readonly [string, string];
  readonly taglineLines: readonly [string, string];
  readonly description: string;
  readonly callout: {
    readonly title: string;
    readonly lines: readonly [string, string];
  };
}

export const portalHero: PortalHeroContent = {
  breadcrumb: ["Home", "Participant Portal"],
  titleLines: ["PARTICIPANT", "PORTAL"],
  taglineLines: [
    "Your Gateway to Real Assets.",
    "Secure. Transparent. Empowering.",
  ],
  description:
    "The GemReserve.io Participant Portal will give verified users and partners secure access to manage their holdings, track portfolio performance, view asset details and take part in tokenized gemstone assets.",
  callout: {
    title: "REAL ASSETS. REAL VALUE. REAL TRUST.",
    lines: [
      "A secure portal built for trust, transparency",
      "and long-term value.",
    ],
  },
};

export const standingNotice = {
  title: "THE PORTAL IS NOT OPEN",
  body: "There is no account system, no login and no holding to display. This page describes what the portal will do and shows the shape of it. GemReserve.io will never send you a sign-in link, and no one can open an account for you.",
  link: { label: "Read the Anti-Fraud Notice", href: "/anti-fraud-notice" },
};

export interface PortalCapability {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export const capabilitiesSectionTitle = "EVERYTHING IN ONE PORTAL";

export const capabilities: readonly PortalCapability[] = [
  {
    id: "dashboard",
    title: "DASHBOARD OVERVIEW",
    description:
      "A real-time snapshot of portfolio value, asset allocation, performance and recent activity.",
  },
  {
    id: "assets",
    title: "ASSET MANAGEMENT",
    description:
      "Detailed information on your tokenized gemstone assets, including specifications, origin and certification.",
  },
  {
    id: "portfolio",
    title: "PORTFOLIO TRACKING",
    description:
      "Holdings, performance analytics and historical trends across all your assets.",
  },
  {
    id: "transactions",
    title: "TRANSACTIONS & ORDERS",
    description:
      "Transactions, orders, settlements and redemptions with full transparency.",
  },
  {
    id: "wallet",
    title: "SECURE WALLET",
    description:
      "Token balances and connected wallets managed with institutional-grade security.",
  },
  {
    id: "documents",
    title: "DOCUMENTS & REPORTS",
    description:
      "Asset passports, certificates, account statements and compliance documents.",
  },
  {
    id: "security",
    title: "SECURITY & CONTROL",
    description:
      "Two-factor authentication, activity alerts and granular access controls.",
  },
];

export interface AccessFeature {
  readonly id: string;
  readonly label: string;
}

export const accessPanel = {
  title: "PORTAL ACCESS FEATURES",
  features: [
    { id: "mfa", label: "Secure login with multi-factor authentication (2FA)" },
    {
      id: "roles",
      label:
        "Role-based access for individuals, institutional investors and enterprise partners",
    },
    { id: "market", label: "Market data and asset insights" },
    { id: "kyc", label: "KYC and verification status management" },
    { id: "reports", label: "Downloadable reports and tax documents" },
    { id: "api", label: "API access for enterprise and institutional users" },
    { id: "support", label: "Dedicated support and help centre access" },
  ] as const satisfies readonly AccessFeature[],
};

export interface Audience {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export const audiencePanel = {
  title: "WHO WILL HAVE ACCESS",
  audiences: [
    {
      id: "individual",
      title: "INDIVIDUAL INVESTORS",
      description: "Manage personal asset holdings and participation.",
    },
    {
      id: "institutional",
      title: "INSTITUTIONAL PARTNERS",
      description:
        "Advanced tools, bulk operations and reporting capabilities.",
    },
    {
      id: "enterprise",
      title: "ENTERPRISE CLIENTS",
      description:
        "Integrated solutions for asset originators, funds and enterprise platforms.",
    },
  ] as const satisfies readonly Audience[],
};

export interface PreviewPanel {
  readonly id: string;
  readonly label: string;
  readonly detail: string;
}

export interface PreviewColumn {
  readonly id: string;
  readonly label: string;
}

export const previewPanel = {
  title: "PORTAL PREVIEW",
  note: "Illustration. The programmes listed are published gemstone programmes; every supply, balance and value is blank because no token has been issued and no holding is held. Figures appear here only when they are a participant's own.",
  brand: "GemReserve.io",
  nav: [
    "Dashboard",
    "Portfolio",
    "Assets",
    "Transactions",
    "Orders",
    "Wallet",
    "Documents",
    "Settings",
    "Support",
  ] as readonly string[],
  activeNav: "Assets",
  tableTitle: "Assets",
  columns: [
    { id: "asset", label: "Asset" },
    { id: "type", label: "Type" },
    { id: "supply", label: "Total supply" },
    { id: "balance", label: "Your balance" },
    { id: "value", label: "Value (USD)" },
  ] as const satisfies readonly PreviewColumn[],
  // The board's rows are GMR-COPPER, GMR-NICKEL, GMR-EMERALD and GMR-SAPPHIRE.
  // The first two are industrial metals and are not part of anything this
  // platform describes, so they are not carried. The four here are published
  // gemstone programmes with pages on this site — which is a fact — and every
  // numeric cell is blank, which is also a fact.
  rows: [
    {
      id: "emerald",
      ticker: "GMR-EMERALD",
      name: "Emerald",
      colour: "#1f9c62",
    },
    { id: "ruby", ticker: "GMR-RUBY", name: "Ruby", colour: "#b32338" },
    {
      id: "aquamarine",
      ticker: "GMR-AQUAMARINE",
      name: "Aquamarine",
      colour: "#2f9fc4",
    },
    {
      id: "tourmaline",
      ticker: "GMR-TOURMALINE",
      name: "Tourmaline",
      colour: "#8d5bb5",
    },
  ] as const satisfies readonly {
    readonly id: string;
    readonly ticker: string;
    readonly name: string;
    readonly colour: string;
  }[],
  rowType: "Precious gem",
  blank: "—",
  blankLabel: "No value — nothing has been issued",
  buttonLabel: "View all assets",
};

export interface AccessStep {
  readonly id: string;
  readonly step: string;
  readonly title: string;
  readonly description: string;
}

export const stepsSectionTitle = "HOW ACCESS WILL WORK";

export const accessSteps: readonly AccessStep[] = [
  {
    id: "account",
    step: "1",
    title: "CREATE ACCOUNT",
    description: "Sign up and create your secure account.",
  },
  {
    id: "verification",
    step: "2",
    title: "COMPLETE VERIFICATION",
    description: "Complete KYC and verification to unlock full access.",
  },
  {
    id: "approval",
    step: "3",
    title: "ACCOUNT APPROVAL",
    description: "Our team reviews and approves your account.",
  },
  {
    id: "login",
    step: "4",
    title: "LOG IN TO THE PORTAL",
    description: "Access the Participant Portal with your credentials.",
  },
  {
    id: "manage",
    step: "5",
    title: "MANAGE & GROW",
    description: "Explore and manage your real asset portfolio.",
  },
];

export const securityPanel = {
  title: "Your security is our priority.",
  lines: [
    "Bank-grade encryption.",
    "Real-time monitoring.",
    "Complete peace of mind.",
  ] as readonly string[],
  buttonLabel: "Learn more about our security",
  href: "/technology",
  imageAlt: "A brass padlock inside a glowing lattice sphere",
};

export const portalCta = {
  title: "BE TOLD WHEN THE PORTAL OPENS",
  description:
    "Joining the waitlist is the only way GemReserve.io will contact you about portal access. It reserves nothing and costs nothing.",
  buttonLabel: "Join the Waitlist",
  supportingText:
    "Eligibility and verification apply when participation opens.",
  eligibilityLink: { label: "Eligibility & KYC", href: "/eligibility-kyc" },
};

export interface ClosingMark {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export const closingMarks: readonly ClosingMark[] = [
  {
    id: "transparent",
    title: "TRANSPARENT",
    description: "Full visibility into assets, processes and performance.",
  },
  {
    id: "secure",
    title: "SECURE",
    description: "Enterprise-grade security to protect your assets and data.",
  },
  {
    id: "trusted",
    title: "TRUSTED",
    description:
      "A physical asset framework, subject to independent audit and attestation.",
  },
  {
    id: "accessible",
    title: "ACCESSIBLE",
    description: "Access your assets anytime, anywhere in the world.",
  },
  {
    id: "support",
    title: "SUPPORT",
    description: "A dedicated support team to assist you at every step.",
  },
];
