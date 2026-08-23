export interface FaqHeroContent {
  breadcrumb: readonly [string, string];
  titleLead: string;
  titleAccent: string;
  tagline: string;
  description: string;
}

export const faqHero: FaqHeroContent = {
  breadcrumb: ["Home", "FAQ"],
  titleLead: "Frequently",
  titleAccent: "Asked Questions",
  tagline: "Clear Answers. Real Transparency. Total Confidence.",
  description:
    "Find answers to the most common questions about GemReserve.io, our platform, tokenized gemstone assets, and how we are building the future of real asset ownership.",
};

export const faqHeroCallout = {
  title: "REAL ASSETS. REAL VALUE. REAL TRUST.",
  body: "Transparency is at the heart of everything we do.",
};

export const faqSearchPlaceholder = "Search questions...";

export const faqHelpCard = {
  title: "CAN'T FIND WHAT YOU'RE LOOKING FOR?",
  body: "Contact our team, we're here to help.",
};

export const faqContactCard = {
  title: "STILL HAVE QUESTIONS?",
  body: "Our team is ready to provide personalized assistance and detailed information.",
  actionLabel: "Contact Our Team",
};

export interface FaqCategory {
  id: string;
  label: string;
}

/**
 * The board lists eleven categories. Only five carry readable question text —
 * the rest sit below its "load more" control — so only those five are shipped.
 * The counts beside each are derived from `faqEntries` rather than written down,
 * which is also why the board's own total is not reproduced: it reads 34 while
 * its category counts sum to 44.
 */
export const faqCategories: readonly FaqCategory[] = [
  { id: "general", label: "General Questions" },
  { id: "assets", label: "Tokenized Gemstone Assets" },
  { id: "buying", label: "Buying & Owning" },
  { id: "trading", label: "Trading & Liquidity" },
  { id: "security", label: "Security & Compliance" },
];

export interface FaqEntry {
  id: string;
  category: string;
  question: string;
  answer: string;
}

/**
 * Every question is transcribed from the board. Every answer is drawn from copy
 * already published elsewhere on this site — the About, How It Works,
 * Technology, Governance, Eligibility and Contact pages — so nothing here states
 * anything the client has not already approved in another place.
 *
 * Eight of the board's readable questions are deliberately absent, because no
 * published page answers them and an invented answer would be a fabricated
 * regulatory, financial or operational claim. They are listed in
 * `unansweredBoardQuestions` below so they are easy to fill in later.
 */
export const faqEntries: readonly FaqEntry[] = [
  {
    id: "what-is",
    category: "general",
    question: "What is GemReserve.io?",
    answer:
      "GemReserve.io is a Swiss company at the forefront of real-world asset tokenization, transforming the gemstone industry through blockchain technology, institutional-grade custody and unparalleled transparency. Our mission is to become the global standard for gemstone ownership and investment by combining the timeless value of natural gems with the efficiency, liquidity and accessibility of digital assets.",
  },
  {
    id: "what-is-token",
    category: "general",
    question: "What is a tokenized gemstone asset?",
    answer:
      "It is a digital token that represents direct ownership of a specific, physically verified gemstone held in custody. Every token is 100% backed by a real stone, and the link between the two is recorded on-chain so ownership and reserves can be verified by anyone.",
  },
  {
    id: "different",
    category: "general",
    question: "How is GemReserve.io different from other platforms?",
    answer:
      "Three things set the platform apart: every token is physically backed by a verified natural gemstone, every stone is graded by independent gemological laboratories rather than in-house, and reserves are provable on-chain rather than asserted. Holdings remain redeemable for the physical stone.",
  },
  {
    id: "based",
    category: "general",
    question: "Where is GemReserve.io based?",
    answer:
      "GemReserve.io is incorporated in Zug, Switzerland, with offices serving Asia from Singapore and the Americas from New York. Full contact details for each are on the Contact page.",
  },
  {
    id: "types",
    category: "general",
    question: "What types of gemstones are available on the platform?",
    answer:
      "The catalogue spans investment-grade coloured stones and diamonds — including ruby, blue and pink and yellow sapphire, emerald, diamond, amethyst, aquamarine, spinel and tsavorite garnet — drawn from a collection covering more than twenty gemstone types.",
  },
  {
    id: "sourced",
    category: "assets",
    question: "How are gemstones sourced and verified?",
    answer:
      "Stones are sourced from vetted suppliers, then examined and graded by leading independent gemological laboratories before they enter custody. Verification happens before tokenization, never after, so a token is only ever issued against a stone that has already been assessed.",
  },
  {
    id: "stored",
    category: "assets",
    question: "Are the gemstones physically stored?",
    answer:
      "Yes. Every stone backing a token is held in world-class vaults under institutional-grade custody with full insurance, and remains there until it is redeemed.",
  },
  {
    id: "passport",
    category: "assets",
    question: "What is a Digital Asset Passport™?",
    answer:
      "Each gemstone carries a unique digital identity recording its reference, gemstone type, weight, origin, laboratory report and verification status. The passport travels with the asset and its record is written on-chain, giving complete traceability from mine to market.",
  },
  {
    id: "authenticity",
    category: "assets",
    question: "How is authenticity and quality ensured?",
    answer:
      "Authenticity rests on independent verification rather than self-certification: each gemstone is verified and graded by leading independent gemological laboratories, and the resulting report is recorded in the stone's Digital Asset Passport.",
  },
  {
    id: "purchase",
    category: "buying",
    question: "How can I purchase a tokenized gemstone?",
    answer:
      "The platform is in its pre-launch phase and purchases are not yet open. Joining the Early Participation Waitlist puts you first in line for platform updates and token launches, and eligible waitlist members receive 20% off during the official launch period.",
  },
  {
    id: "own-what",
    category: "buying",
    question: "Do I own the physical gemstone or the token?",
    answer:
      "Both, in the sense that the token is the instrument of ownership over the physical stone rather than a separate asset. Each token represents direct ownership of a specific gemstone held in custody, and holdings can be redeemed for that stone in physical form.",
  },
  {
    id: "trade",
    category: "trading",
    question: "Can I trade my tokenized gemstone?",
    answer:
      "Yes. Tokenized holdings are designed to be traded, held or redeemed on a global platform, which is what makes an historically illiquid asset class liquid.",
  },
  {
    id: "valuation",
    category: "trading",
    question: "How is the value of gemstones determined?",
    answer:
      "Each stone is independently appraised as part of the verification process before tokenization, and the platform provides real-time analytics, market data and portfolio intelligence to holders thereafter.",
  },
  {
    id: "protected",
    category: "security",
    question: "How is my investment protected?",
    answer:
      "Protection runs at several layers: every token is 100% backed by a physically verified gemstone, stones sit in insured institutional-grade custody, reserves are provable on-chain, and holdings remain redeemable for the physical asset.",
  },
  {
    id: "security-measures",
    category: "security",
    question: "What security measures does the platform use?",
    answer:
      "AES-256 encryption for all data in transit and at rest, firewalls, WAF, intrusion detection and DDoS protection, multi-factor authentication with role-based least-privilege access, 24/7 SIEM monitoring and threat detection, plus regular penetration testing, code audits and compliance assessments.",
  },
  {
    id: "kyc",
    category: "security",
    question: "What is KYC and why is it required?",
    answer:
      "KYC — Know Your Customer — is the verification every participant completes before gaining access. It protects the integrity of the platform and its asset-backed tokens, and meets global KYC/AML regulatory standards. The Eligibility & KYC page sets out who can participate, the four-step process and the documents required.",
  },
  {
    id: "data",
    category: "security",
    question: "How is my personal data handled?",
    answer:
      "All data is encrypted and securely stored, access is restricted to authorized personnel only, information is not shared with third parties, and handling complies with global data protection regulations including GDPR principles.",
  },
  {
    id: "on-chain",
    category: "security",
    question: "Are transactions recorded on the blockchain?",
    answer:
      "Yes. All tokenization, transfers and redemptions are recorded on-chain and verifiable by anyone, and those records are immutable — a permanent audit trail rather than an internal ledger.",
  },
];

/**
 * Readable board questions that no published page answers. Left off the page on
 * purpose: answering them would mean inventing a regulatory status, a fee
 * schedule, a payment method or a claims process.
 */
export const unansweredBoardQuestions: readonly string[] = [
  "Is GemReserve.io regulated?",
  "Can I view the physical gemstone I own?",
  "What happens if a gemstone is damaged or lost?",
  "What currencies and payment methods are accepted?",
  "Is there a minimum investment amount?",
  "Can I gift a tokenized gemstone to someone else?",
  "Where can I trade GemReserve.io tokens?",
  "Is there a secondary market?",
];

export interface FaqAssurance {
  id: string;
  title: string;
  description: string;
}

export const faqAssurances: readonly FaqAssurance[] = [
  {
    id: "transparent",
    title: "TRANSPARENT",
    description: "Clear information and complete transparency at every step.",
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
      "Backed by real assets, independent audits, and proven processes.",
  },
  {
    id: "global",
    title: "GLOBAL",
    description: "Accessible worldwide with local compliance and support.",
  },
  {
    id: "support",
    title: "SUPPORT",
    description: "Dedicated team ready to help you at every stage.",
  },
];

export const faqHeroImageAlt =
  "A lit globe of gold network lines behind a group of faceted gemstones";
