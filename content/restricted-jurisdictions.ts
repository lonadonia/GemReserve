/**
 * Restricted Jurisdictions — transcribed from the client's supplied board.
 *
 * This page is compliance copy and is transcribed rather than composed. Every
 * jurisdiction, every grouping and every heading below is the client's own; no
 * country has been added, removed, reordered between groups or reclassified,
 * and no legal interpretation, sanctions rule, investor-eligibility test or
 * accreditation requirement has been introduced that the board does not state.
 *
 * Two points of care:
 *
 * The board's group headings ("COMPREHENSIVE SANCTIONS PROGRAMS", "REGIONAL
 * SANCTIONS & RESTRICTIONS", "HIGH-RISK & MONITORED JURISDICTIONS",
 * "CRYPTOCURRENCY RESTRICTIONS") are labels the client applies to its own
 * policy. They are carried across verbatim and are not restated as claims about
 * any particular sanctions regime, because the board names no issuing authority.
 *
 * The board gives support@gemreserve.io as the contact for eligibility
 * questions. Every other page on this site routes general enquiries through
 * info@gemreserve.io, which is the address the client has confirmed. The
 * board's address is kept here because it is the one the client published for
 * this specific purpose, and the contact page is offered alongside it.
 */

export interface RestrictedHeroContent {
  readonly breadcrumb: readonly [string, string, string, string];
  readonly titleLines: readonly [string, string];
  readonly tagline: string;
  readonly paragraphs: readonly string[];
  readonly card: {
    readonly wordmark: string;
    readonly lines: readonly [string, string, string];
  };
}

export const restrictedHero: RestrictedHeroContent = {
  breadcrumb: [
    "Home",
    "Company",
    "Legal & Compliance",
    "Restricted Jurisdictions",
  ],
  titleLines: ["RESTRICTED", "JURISDICTIONS"],
  tagline: "Protecting Integrity. Complying Globally.",
  paragraphs: [
    "At GemReserve.io, compliance is at the core of our mission. To maintain the integrity of our platform and adhere to international laws and regulations, we do not offer our services to residents of certain jurisdictions.",
    "These restrictions help us prevent financial crime, uphold transparency, and ensure a secure environment for all eligible participants.",
  ],
  card: {
    wordmark: "GEMRESERVE.IO",
    lines: ["COMPLIANT.", "SECURE.", "TRUSTED."],
  },
};

export const restrictedListTitle =
  "JURISDICTIONS WHERE OUR SERVICES ARE RESTRICTED";

export const restrictedListIntro =
  "We are unable to offer or provide our platform services, products, or offerings to individuals or entities who are residents, located in, organized in, or physically present in the following jurisdictions:";

export interface RestrictedGroup {
  readonly id: string;
  readonly title: string;
  /** A listed set of jurisdictions, or a single prose clause where the board
   *  writes one instead of a list. */
  readonly places?: readonly string[];
  readonly statement?: string;
}

export const restrictedGroups: readonly RestrictedGroup[] = [
  {
    id: "comprehensive",
    title: "COMPREHENSIVE SANCTIONS PROGRAMS",
    places: [
      "Afghanistan",
      "Belarus",
      "Cuba",
      "Iran",
      "North Korea (Democratic People's Republic of Korea)",
      "Russia",
      "Syria",
    ],
  },
  {
    id: "regional",
    title: "REGIONAL SANCTIONS & RESTRICTIONS",
    places: ["Crimea, Donetsk, and Luhansk Regions of Ukraine", "Venezuela"],
  },
  {
    id: "high-risk",
    title: "HIGH-RISK & MONITORED JURISDICTIONS",
    places: [
      "Central African Republic",
      "Democratic Republic of Congo",
      "Haiti",
      "Iran",
      "Lebanon",
      "Myanmar (Burma)",
      "Nicaragua",
    ],
  },
  {
    id: "cryptocurrency",
    title: "CRYPTOCURRENCY RESTRICTIONS",
    places: [
      "Bangladesh",
      "Bolivia",
      "China (Mainland)",
      "Colombia",
      "Egypt",
      "Morocco",
      "Nepal",
    ],
  },
  {
    id: "other",
    title: "OTHER RESTRICTED JURISDICTIONS",
    statement:
      "Any other jurisdiction subject to comprehensive sanctions, embargoes, or regulatory prohibitions under applicable international laws and regulations.",
  },
];

export const restrictedNotice = {
  label: "IMPORTANT NOTICE:",
  lines: [
    "This list is not exhaustive and is subject to change without prior notice.",
    "GemReserve.io reserves the right to add, remove, or update restricted jurisdictions at any time in our sole discretion.",
  ],
};

export interface RestrictedReason {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export const restrictedWhy = {
  title: "WHY THESE RESTRICTIONS EXIST",
  reasons: [
    {
      id: "legal-compliance",
      title: "LEGAL COMPLIANCE",
      description:
        "We comply with international sanctions, anti-money laundering (AML), and counter-terrorist financing (CTF) laws.",
    },
    {
      id: "risk-mitigation",
      title: "RISK MITIGATION",
      description:
        "These measures help us identify and avoid high-risk activities that could jeopardize our platform and participants.",
    },
    {
      id: "platform-security",
      title: "PLATFORM SECURITY",
      description:
        "By restricting access in certain jurisdictions, we maintain a safe and trusted environment for our global community.",
    },
    {
      id: "reputation-trust",
      title: "REPUTATION & TRUST",
      description:
        "Our commitment to compliance strengthens trust with partners, investors, and regulators worldwide.",
    },
  ] as const satisfies readonly RestrictedReason[],
};

export interface RestrictedConsequence {
  readonly id: string;
  readonly description: string;
}

export const restrictedMeaning = {
  title: "WHAT THIS MEANS FOR YOU",
  points: [
    {
      id: "not-eligible",
      description:
        "If you are a resident or citizen of a restricted jurisdiction, you are not eligible to access or use GemReserve.io services, products, or offerings.",
    },
    {
      id: "concealment",
      description:
        "If you attempt to access our platform using VPNs or other methods to conceal your location or residency, your account may be immediately suspended or terminated.",
    },
    {
      id: "verification",
      description:
        "We reserve the right to verify your location and residency at any time during the onboarding process and while using our platform.",
    },
  ] as const satisfies readonly RestrictedConsequence[],
  questions: {
    title: "QUESTIONS?",
    lead: "If you are unsure whether your jurisdiction is restricted, please contact our support team at",
    email: "support@gemreserve.io",
    trail: "before proceeding.",
  },
};

export interface RestrictedCommitmentMark {
  readonly id: string;
  readonly label: string;
}

export const restrictedCommitment = {
  title: "OUR COMMITMENT TO A COMPLIANT FUTURE",
  imageAlt:
    "Emerald, ruby, sapphire, pink sapphire, citrine and aquamarine on dark stone",
  paragraphs: [
    "We continuously monitor global regulatory developments and work with leading legal and compliance experts to ensure our platform meets the highest standards.",
    "Thank you for your understanding and for being part of a secure, transparent, and trusted ecosystem.",
  ],
  marks: [
    { id: "compliant", label: "COMPLIANT" },
    { id: "transparent", label: "TRANSPARENT" },
    { id: "secure", label: "SECURE" },
    { id: "trusted", label: "TRUSTED" },
  ] as const satisfies readonly RestrictedCommitmentMark[],
};
