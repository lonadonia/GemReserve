export interface WaitlistHeroContent {
  breadcrumb: readonly [string, string];
  titleLines: readonly [string, string, string];
  tagline: string;
  description: string;
}

export const waitlistHero: WaitlistHeroContent = {
  breadcrumb: ["Home", "Join the Early Participation Waitlist"],
  titleLines: ["Join the Early", "Participation", "Waitlist"],
  tagline: "Be among the first to access real asset-backed tokens.",
  description:
    "GemReserve.io is building the future of asset ownership and tokenization. By joining our Early Participation Waitlist, you position yourself for exclusive benefits, early access, and participation in a new era of real asset-backed value.",
};

export interface WaitlistBenefit {
  id: string;
  title: string;
  description: string;
}

export const waitlistBenefits: readonly WaitlistBenefit[] = [
  {
    id: "early-access",
    title: "EARLY ACCESS",
    description:
      "Be first in line for platform updates, token launches, and opportunities.",
  },
  {
    id: "launch-discount",
    title: "20% LAUNCH DISCOUNT",
    description:
      "Eligible waitlist members receive 20% off during the official launch.",
  },
  {
    id: "exclusive-updates",
    title: "EXCLUSIVE UPDATES",
    description:
      "Receive important announcements, insights, and milestone updates before the public.",
  },
  {
    id: "priority-consideration",
    title: "PRIORITY CONSIDERATION",
    description:
      "Get priority access to allocations, partnerships, and beta programs.",
  },
];

export const whyJoinTitle = "WHY JOIN THE WAITLIST?";

export const whyJoinPoints: readonly WaitlistBenefit[] = [
  {
    id: "shape-the-future",
    title: "SHAPE THE FUTURE",
    description:
      "Your early support helps build a transparent, secure, and compliant ecosystem for real asset tokenization.",
  },
  {
    id: "trusted-compliant",
    title: "TRUSTED & COMPLIANT",
    description:
      "Built with institutional-grade compliance, security, and asset-backed integrity.",
  },
  {
    id: "global-opportunity",
    title: "GLOBAL OPPORTUNITY",
    description:
      "Access real-world assets through blockchain technology, from anywhere in the world.",
  },
  {
    id: "long-term-value",
    title: "BUILT FOR LONG-TERM VALUE",
    description:
      "We focus on real assets, real utility, and real value—not speculation.",
  },
];

export interface FormPanel {
  title: string;
  intro: string;
  countryLabel: string;
  roleLabel: string;
  consentLabel: string;
  buttonLabel: string;
  privacyNote: string;
}

export const waitlistFormPanel: FormPanel = {
  title: "SECURE YOUR PLACE TODAY",
  intro: "Fill out the form below to join the Early Participation Waitlist.",
  countryLabel: "Country of Residence",
  roleLabel: "I am joining as",
  consentLabel:
    "I agree to receive updates, announcements, and offers from GemReserve.io.",
  buttonLabel: "Join the Waitlist",
  privacyNote:
    "We respect your privacy. Your information is secure and will never be shared.",
};

/**
 * The board draws both selects closed, so neither option list is readable on it.
 * These are the smallest sets that keep the control honest rather than an
 * invented roster of countries: the role list mirrors the audiences the site
 * already addresses, and residence is a free-text field on the page instead of a
 * fabricated country list.
 */
export const joiningRoles: readonly string[] = [
  "Individual investor",
  "Institutional investor",
  "Gemstone owner or originator",
  "Buyer or collector",
  "Enterprise partner",
  "Other",
];

export interface NextStep {
  id: string;
  step: number;
  title: string;
  description: string;
}

export const nextStepsTitle = "WHAT HAPPENS NEXT?";

export const nextSteps: readonly NextStep[] = [
  {
    id: "join",
    step: 1,
    title: "JOIN THE WAITLIST",
    description: "Submit your information to secure your early access.",
  },
  {
    id: "informed",
    step: 2,
    title: "STAY INFORMED",
    description:
      "Receive updates on platform milestones, assets, and token launch.",
  },
  {
    id: "discount",
    step: 3,
    title: "EARLY ACCESS & DISCOUNT",
    description:
      "When the platform launches, eligible waitlist members receive 20% off during the launch period.",
  },
  {
    id: "grow",
    step: 4,
    title: "PARTICIPATE & GROW",
    description:
      "Be part of a global community unlocking real asset-backed value and opportunities.",
  },
];

export const dontMissOut = {
  title: "DON'T MISS OUT",
  lines: ["Spots are limited.", "Join now and be part of something real."],
};

export interface AssuranceMark {
  id: string;
  title: string;
  description: string;
}

export const waitlistAssurances: readonly AssuranceMark[] = [
  {
    id: "real-assets",
    title: "REAL ASSETS",
    description: "Backed by tangible, high-quality assets.",
  },
  {
    id: "secure-platform",
    title: "SECURE PLATFORM",
    description: "Advanced security, compliance, and transparency.",
  },
  {
    id: "regulatory-commitment",
    title: "REGULATORY COMMITMENT",
    description: "Built to meet international standards and best practices.",
  },
  {
    id: "community-driven",
    title: "COMMUNITY DRIVEN",
    description: "A global community working together for long-term value.",
  },
];

export const waitlistHeroImageAlt =
  "Faceted gemstones on dark slate beside a card carrying the GemReserve crest";
