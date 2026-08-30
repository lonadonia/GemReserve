/**
 * Early Participation Program — transcribed from the client's supplied board.
 *
 * This is the programme's own prospectus page, and it is separate from the
 * waitlist page the archive also carries: /early-participation is the "JOIN THE
 * EARLY PARTICIPATION WAITLIST" board, with the form on it. This one is the
 * board titled "EARLY PARTICIPATION PROGRAM" — what the programme is, how it
 * works, and what a participant would be agreeing to.
 *
 * Because it is the page closest to an offer, four things on the board are
 * handled deliberately.
 *
 * "STRONGER RETURNS — Position early for long-term growth as the platform
 * expands and token demand increases." That is a forecast of investment return
 * on a token with no price, no market and no history. It is not carried across
 * in any form. The site states no expected return anywhere, and the discount
 * page already records that decision in full; see content/discount-methodology.ts.
 *
 * The timeline opened with "MAY 15, 2024 — Waitlist Opens". That date is long
 * past and the pre-sale it introduced has not happened, so a dated timeline
 * would read as a schedule the project has already missed. The sequence is
 * kept and the dates are not, consistent with the roadmap on /investors and
 * /future-infrastructure.
 *
 * "Availability: limited time and limited allocation", repeated as "Limited
 * Time. Limited Allocation." under the call to action, is a scarcity claim. No
 * allocation has been defined, no cap published and no window opened, so
 * nothing here says a place is scarce. What is true — that the discount applies
 * during a defined pre-sale window, and that a waitlist place reserves nothing —
 * is what is said.
 *
 * "The world's first platform for real-world gemstone tokenization" is a
 * superlative the project cannot evidence and is not repeated.
 *
 * Everything else — the programme details, the five-step process, the benefits
 * and the FAQ subjects — is the board's own, written in the same future tense
 * the /token-acquisition page already uses, under the same standing notice.
 */

export interface ProgramHeroContent {
  readonly breadcrumb: readonly [string, string, string];
  readonly titleLines: readonly [string, string];
  readonly tagline: string;
  readonly paragraphs: readonly string[];
  readonly badge: {
    readonly figure: string;
    readonly label: string;
    readonly detail: string;
  };
  readonly notice: string;
}

export const programHero: ProgramHeroContent = {
  breadcrumb: ["Home", "Investors", "Early Participation Program"],
  titleLines: ["EARLY PARTICIPATION", "PROGRAM"],
  tagline: "Be Among the First. Own the Future.",
  paragraphs: [
    "The Early Participation Program will give participants access to GemReserve.io during the pre-sale phase, with a 20% discount on gemstone asset tokens.",
    "It is a way of joining early on published terms — on a physical asset framework, built on blockchain, and designed for long-term ownership rather than a quick trade.",
  ],
  badge: {
    figure: "20%",
    label: "DISCOUNT",
    detail: "on token purchases during the pre-sale",
  },
  notice:
    "The Early Participation Program is not open. No pre-sale is running, no invitation has been issued and no payment can be made to GemReserve.io today. Joining the waitlist is the only action available, and it reserves nothing.",
};

export interface ParticipateReason {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export const reasonsSectionTitle = "WHY PARTICIPATE EARLY?";

export const reasons: readonly ParticipateReason[] = [
  {
    id: "discount",
    title: "EXCLUSIVE 20% DISCOUNT",
    description:
      "20% off eligible gemstone asset tokens during the pre-sale launch period.",
  },
  {
    id: "access",
    title: "EARLY ACCESS",
    description:
      "Be among the first to reach the platform, its features and upcoming asset programs.",
  },
  {
    id: "allocation",
    title: "PRIORITY CONSIDERATION",
    description:
      "Early participants are considered first for asset programs with limited supply.",
  },
  {
    id: "future",
    title: "BUILT FOR THE FUTURE",
    description:
      "Support a transparent, secure and asset-backed ecosystem built to last.",
  },
];

export interface ProgramDetail {
  readonly id: string;
  readonly label: string;
  readonly value: string;
}

export const detailsPanel = {
  title: "PROGRAM DETAILS",
  details: [
    {
      id: "discount",
      label: "Discount",
      value: "20% off token purchases during the pre-sale",
    },
    {
      id: "access",
      label: "Access",
      value: "By invitation, issued to waitlist members in phases",
    },
    {
      id: "eligibility",
      label: "Eligibility",
      value: "KYC/AML verification required before participation",
    },
    {
      id: "currency",
      label: "Currency",
      value: "USDT, USDC, ETH, BTC and other supported options",
    },
    {
      id: "tokens",
      label: "Tokens",
      value: "Applies to all eligible gemstone asset tokens",
    },
    {
      id: "delivery",
      label: "Delivery",
      value: "Tokens are delivered to your wallet once a purchase settles",
    },
    {
      id: "sale-type",
      label: "Sale type",
      value: "Private pre-sale, ahead of general availability",
    },
    {
      id: "availability",
      label: "Availability",
      value: "The discount applies for the duration of the pre-sale window",
    },
  ] as const satisfies readonly ProgramDetail[],
  footnote:
    "No allocation size, cap or opening date has been set. Any of those will be published here before the programme opens — never announced privately, and never by anyone who contacts you first.",
};

export interface ProgramStep {
  readonly id: string;
  readonly step: string;
  readonly title: string;
  readonly description: string;
}

export const stepsPanel = {
  title: "HOW IT WILL WORK",
  steps: [
    {
      id: "waitlist",
      step: "1",
      title: "JOIN THE WAITLIST",
      description:
        "Submit your details to register interest in the Early Participation Program.",
    },
    {
      id: "invitation",
      step: "2",
      title: "RECEIVE AN INVITATION",
      description:
        "Qualified participants receive an invitation with access details, sent from a published GemReserve.io address.",
    },
    {
      id: "verification",
      step: "3",
      title: "COMPLETE VERIFICATION",
      description:
        "Complete KYC/AML verification to activate your account and participation.",
    },
    {
      id: "fund",
      step: "4",
      title: "FUND YOUR ACCOUNT",
      description: "Add funds using a supported cryptocurrency or stablecoin.",
    },
    {
      id: "purchase",
      step: "5",
      title: "PURCHASE AT THE DISCOUNT",
      description:
        "Buy eligible gemstone asset tokens at 20% off during the pre-sale period.",
    },
  ] as const satisfies readonly ProgramStep[],
  link: {
    label: "How token acquisition will work",
    href: "/token-acquisition",
  },
};

export interface TimelinePhase {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly state: "open" | "planned";
}

export const timelinePanel = {
  title: "THE SEQUENCE",
  intro:
    "In order, without dates. No pre-sale window has been set, and a published date that later moves is worse than no date at all.",
  phases: [
    {
      id: "waitlist",
      title: "Waitlist open",
      description: "Register interest and receive programme updates.",
      state: "open",
    },
    {
      id: "invitations",
      title: "Invitations issued",
      description: "Sent in phases to waitlist members who qualify.",
      state: "planned",
    },
    {
      id: "presale",
      title: "Pre-sale period",
      description: "The 20% discount applies for the duration of the window.",
      state: "planned",
    },
    {
      id: "launch",
      title: "Public launch",
      description: "The platform opens generally once the pre-sale concludes.",
      state: "planned",
    },
    {
      id: "ownership",
      title: "Ownership and redemption",
      description:
        "Holdings, passports and physical redemption operate as published.",
      state: "planned",
    },
  ] as const satisfies readonly TimelinePhase[],
  stateLabels: { open: "Open now", planned: "Planned" } as Readonly<
    Record<"open" | "planned", string>
  >,
};

export const benefitsPanel = {
  title: "PROGRAM BENEFITS",
  benefits: [
    "20% discount on all eligible gemstone asset tokens",
    "Priority consideration for new asset programs",
    "Early access to platform features and tools",
    "Built on blockchain with real physical backing",
    "Transparency, security and a full audit trail",
    "Part of a global community of long-term owners",
  ] as readonly string[],
};

export const invitePanel = {
  titleLines: [
    "Be early. Be considered.",
    "Be part of GemReserve.io.",
  ] as const,
  description:
    "This is ownership in real, tangible assets that are tokenized, secured and built to be held. Join the waitlist to be invited when the programme opens.",
  buttonLabel: "Join the Waitlist",
  supportingText:
    "A waitlist place reserves no allocation and commits you to nothing.",
  panel: {
    title: "ASSET-BACKED ARCHITECTURE",
    subtitle: "SECURED FOR GENERATIONS",
    body: "Each token is designed to link 1:1 to a gemstone held in custody and recorded on-chain — subject to independent attestation.",
  },
  imageAlt:
    "An open vault door with faceted gemstones on the polished floor before it",
};

export interface ProgramQuestion {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
}

export const faqPanel = {
  title: "FREQUENTLY ASKED QUESTIONS",
  questions: [
    {
      id: "what",
      question: "What is the Early Participation Program?",
      answer:
        "A pre-sale phase in which invited waitlist members can acquire eligible gemstone asset tokens at a 20% discount, ahead of general availability. It is not open yet.",
    },
    {
      id: "when",
      question: "When does the pre-sale start and end?",
      answer:
        "No dates have been set. Both are published on this page before the programme opens, and you are told by email if you are on the waitlist. Nobody will approach you privately with a date.",
    },
    {
      id: "discount",
      question: "How does the 20% discount work?",
      answer:
        "It is applied to the standard token price for the asset, for the duration of the pre-sale window. The arithmetic is worked through in full on the 20% Discount Methodology page.",
    },
    {
      id: "payment",
      question: "What payment methods will be accepted?",
      answer:
        "USDT, USDC, ETH, BTC and other supported options. The full list of rails and networks the platform is being built to accept is on the token acquisition page.",
    },
    {
      id: "minimum",
      question: "Is there a minimum purchase amount?",
      answer:
        "No minimum has been set. Any minimum, cap or allocation size is published before the programme opens.",
    },
    {
      id: "receive",
      question: "When would I receive my tokens?",
      answer:
        "Tokens are delivered to your wallet once a purchase settles and verification is complete. Nothing can be purchased or delivered today.",
    },
  ] as const satisfies readonly ProgramQuestion[],
  links: [
    { label: "20% Discount Methodology", href: "/discount-methodology" },
    { label: "Eligibility & KYC", href: "/eligibility-kyc" },
    { label: "Restricted Jurisdictions", href: "/restricted-jurisdictions" },
    { label: "All frequently asked questions", href: "/faq" },
  ] as const,
};
