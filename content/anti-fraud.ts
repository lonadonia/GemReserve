/**
 * Anti-Fraud Notice — transcribed from the client's supplied board.
 *
 * The board's "OFFICIAL CHANNELS ONLY" panel is the one part of this page that
 * has to be exactly right, because it is the list a reader will check an
 * impersonator against. It named support@gemreserve.io, a help centre at
 * /help-center, and "LinkedIn, X (Twitter), Telegram (verified accounts only)".
 * None of those exists. There is no help centre on this site, and GemReserve
 * operates no social or messaging account — the site footer already marks every
 * social channel as coming soon.
 *
 * Listing a channel the project does not control is not a cosmetic error on
 * this page: it tells a reader that a Telegram group claiming to be GemReserve
 * might be genuine, which is the precise belief a scammer needs. The panel
 * therefore lists only what is real — the website, and the mailboxes published
 * on the Contact board — and states positively that no social, messaging or
 * community channel exists yet, so any account presenting itself as ours is
 * not ours. That is both accurate and stronger than the board.
 *
 * Everything else — the five commitments, the ten scam patterns, the five
 * protective steps and the closing marks — is the board's own copy.
 */

import { siteUrl } from "@/lib/config";

export interface FraudHeroContent {
  readonly breadcrumb: readonly [string, string];
  readonly titleLines: readonly [string, string];
  readonly taglineLines: readonly [string, string];
  readonly description: string;
  readonly callout: {
    readonly title: string;
    readonly lines: readonly [string, string];
  };
}

export const fraudHero: FraudHeroContent = {
  breadcrumb: ["Home", "Anti-Fraud Notice"],
  titleLines: ["ANTI-FRAUD", "NOTICE"],
  taglineLines: ["Together, We Protect Our Platform", "and Our Community."],
  description:
    "At GemReserve.io, the security of our users, our assets and our platform is our highest priority. Fraud and scams harm individuals and communities. This notice sets out how we protect you — and how you can protect yourself.",
  callout: {
    title: "REAL ASSETS. REAL VALUE. REAL TRUST.",
    lines: [
      "Security and transparency are the foundation",
      "of everything we do.",
    ],
  },
};

export interface Commitment {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export const commitmentSectionTitle = "OUR COMMITMENT TO YOU";

export const commitments: readonly Commitment[] = [
  {
    id: "platform",
    title: "SECURE PLATFORM",
    description:
      "We use industry-leading security measures to protect your data, accounts and assets.",
  },
  {
    id: "communications",
    title: "VERIFIED COMMUNICATIONS",
    description:
      "We communicate only through our official channels. We will never ask for your password, private keys or personal banking details.",
  },
  {
    id: "operations",
    title: "TRANSPARENT OPERATIONS",
    description:
      "Our processes, policies and smart contracts are designed for transparency, accountability and trust.",
  },
  {
    id: "empowerment",
    title: "USER EMPOWERMENT",
    description:
      "We provide education and tools to help you make informed and secure decisions.",
  },
  {
    id: "protection",
    title: "GLOBAL PROTECTION",
    description:
      "We continuously monitor, detect and prevent threats to keep our global community safe.",
  },
];

export interface Scam {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export const scamsSectionTitle = "COMMON FRAUD SCAMS TO WATCH FOR";

export const scams: readonly Scam[] = [
  {
    id: "phishing",
    title: "PHISHING EMAILS",
    description:
      "Fake emails pretending to be from GemReserve.io asking you to click links or provide sensitive information.",
  },
  {
    id: "fake-websites",
    title: "FAKE WEBSITES",
    description:
      "Impersonator websites that look similar to our official site to steal your login credentials or funds.",
  },
  {
    id: "social",
    title: "SOCIAL MEDIA SCAMS",
    description:
      "Fraudulent profiles or groups promising guaranteed returns, airdrops or exclusive investment opportunities.",
  },
  {
    id: "impersonation",
    title: "IMPERSONATION",
    description:
      "Scammers pretending to be GemReserve.io employees, support agents or community managers.",
  },
  {
    id: "ponzi",
    title: "INVESTMENT PONZI SCHEMES",
    description:
      "High-return guarantees with no real assets or technology behind them.",
  },
  {
    id: "unauthorized",
    title: "UNAUTHORIZED OFFERS",
    description:
      "Unsolicited offers for token sales, private deals or early access that are not from our official channels.",
  },
  {
    id: "wallet",
    title: "WALLET COMPROMISE",
    description:
      "Malicious software or fake apps designed to steal your wallet credentials or private keys.",
  },
  {
    id: "remote-access",
    title: "REMOTE ACCESS SCAMS",
    description:
      "Scammers asking you to install software or give access to your device under the guise of help.",
  },
  {
    id: "support",
    title: "SUPPORT SCAMS",
    description:
      "Fake support channels claiming to resolve issues in exchange for fees or sensitive information.",
  },
  {
    id: "documents",
    title: "FAKE DOCUMENTS",
    description:
      "Forged documents or certificates used to deceive investors or validate fake offers.",
  },
];

export interface ProtectStep {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export const protectSectionTitle = "HOW TO PROTECT YOURSELF";

export const protectSteps: readonly ProtectStep[] = [
  {
    id: "verify",
    title: "VERIFY EVERYTHING",
    description:
      "Always verify links, emails and announcements against this website before acting on them.",
  },
  {
    id: "never-share",
    title: "NEVER SHARE SENSITIVE INFORMATION",
    description:
      "We will never ask for your password, private keys, seed phrases or banking information.",
  },
  {
    id: "strong-security",
    title: "USE STRONG SECURITY",
    description:
      "Enable two-factor authentication, use strong passwords and keep your devices and software updated.",
  },
  {
    id: "cautious",
    title: "BE CAUTIOUS ONLINE",
    description:
      "Think before you click. Be sceptical of unsolicited messages, offers or promises that seem too good to be true.",
  },
  {
    id: "report",
    title: "REPORT SUSPICIOUS ACTIVITY",
    description:
      "If you encounter any suspicious activity, report it to us immediately using the address below.",
  },
];

export interface OfficialChannel {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly href?: string;
}

export const channelsPanel = {
  title: "OFFICIAL CHANNELS ONLY",
  lead: [
    "We will never contact you first by private message, cold call or unofficial channel.",
    "This is the complete list. It is short on purpose — a short list is one you can actually check.",
  ] as readonly string[],
  channels: [
    {
      id: "website",
      label: "Official website",
      value: siteUrl.replace(/^https?:\/\//, ""),
      href: siteUrl,
    },
    {
      id: "general",
      label: "General enquiries",
      value: "info@gemreserve.io",
      href: "mailto:info@gemreserve.io",
    },
    {
      id: "investor",
      label: "Investor relations",
      value: "investor-relations@gemreserve.io",
      href: "mailto:investor-relations@gemreserve.io",
    },
    {
      id: "media",
      label: "Media",
      value: "media@gemreserve.io",
      href: "mailto:media@gemreserve.io",
    },
    {
      id: "partnerships",
      label: "Partnerships",
      value: "partnerships@gemreserve.io",
      href: "mailto:partnerships@gemreserve.io",
    },
  ] as const satisfies readonly OfficialChannel[],
  socialTitle: "NO SOCIAL OR MESSAGING CHANNELS",
  socialBody:
    "GemReserve.io does not operate an account on any social network, and runs no Telegram, WhatsApp, Discord or community group. Every such account claiming to be GemReserve.io is an impersonation, without exception. When official accounts open, they are listed on this page first.",
  saleTitle: "NO TOKEN SALE IS OPEN",
  saleBody:
    "There is no live token sale, presale, allocation or investment round. Nobody is authorised to take payment, a wallet transfer or a deposit from you on behalf of GemReserve.io, and no one from GemReserve.io will ask you for one.",
  saleLink: {
    label: "How token acquisition will work",
    href: "/token-acquisition",
  },
  imageAlt: "A gold padlock inside a teal shield on a dark ground",
};

export const reportPanel = {
  title: "IF YOU SUSPECT FRAUD, ACT FAST.",
  description:
    "Do not engage with the scammer. Do not send any funds. Report it immediately.",
  buttonLabel: "Report fraud",
  email: "info@gemreserve.io",
  contactLabel: "Other ways to reach us",
  contactHref: "/contact",
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
    description: "Clear, honest and open communication.",
  },
  {
    id: "secure",
    title: "SECURE",
    description: "Advanced security to protect our community.",
  },
  {
    id: "trusted",
    title: "TRUSTED",
    description: "Physical asset framework, subject to verification. Built for generations.",
  },
  {
    id: "responsible",
    title: "RESPONSIBLE",
    description: "We all play a role in staying safe.",
  },
  {
    id: "together",
    title: "TOGETHER",
    description: "A safer platform for a stronger future.",
  },
];
