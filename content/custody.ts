/**
 * Custody & Vault Structure — transcribed from the client's supplied board.
 *
 * This board asserts more than any other in the archive, and three of its
 * panels could not be carried across as drawn.
 *
 * "AUTHORIZED VAULT PARTNERS" names four real vaulting and logistics companies.
 * "INSURANCE COVERAGE" names two insurers and states a policy limit of "USD 1
 * BILLION+". GemReserve has no published custody agreement and no published
 * policy, so all six names and the limit are omitted. What survives is what the
 * board is actually describing underneath them: the standard a custody provider
 * has to meet before it holds anything, and the perils the cover has to answer
 * for. Both are written as requirements of the model, which is what they are,
 * rather than as arrangements in force.
 *
 * The "VAULT NETWORK" map pins a primary vault and headquarters in Zurich,
 * with further vaults in Singapore, Dubai and New York. The operating company
 * is UAB GemVault Capital in Vilnius — see content/company.ts — and no vault
 * location is published. The panel therefore states the one location that is a
 * matter of record, the registered office, and says that vault jurisdictions
 * are published when custody agreements are in place. Nothing here says or
 * implies that GemReserve is Swiss or that a stone sits in Zurich.
 *
 * The hero's opening sentence read "GemReserve.io partners with world-class
 * vaulting institutions and insurers". It describes the framework instead.
 * Everything else — the six-step framework, the security controls, the proof of
 * custody checks — is the board's own copy.
 */

import { company } from "./company";

export interface CustodyHeroContent {
  readonly breadcrumb: readonly [string, string, string];
  readonly titleLines: readonly [string, string];
  readonly taglineLines: readonly [string, string];
  readonly description: string;
  readonly cards: readonly {
    readonly id: string;
    readonly title: string;
    readonly description: string;
  }[];
}

export const custodyHero: CustodyHeroContent = {
  breadcrumb: ["Home", "Technology", "Custody & Vault Structure"],
  titleLines: ["Custody &", "Vault Structure"],
  taglineLines: [
    "Institutional-Grade Protection.",
    "Physical Assets. Absolute Security.",
  ],
  description:
    "GemReserve.io is built around a multi-layered custody framework: every gemstone is held in an institutional-grade vault, insured, independently inspected and accounted for at all times.",
  cards: [
    {
      id: "vaults",
      title: "SECURE VAULTS",
      description: "Institutional-grade facilities with 24/7 monitoring.",
    },
    {
      id: "insured",
      title: "INSURED HOLDINGS",
      description: "All-risk cover is a condition of custody, not an extra.",
    },
    {
      id: "oversight",
      title: "INDEPENDENT OVERSIGHT",
      description: "Third-party audits and regular physical inspections.",
    },
    {
      id: "on-chain",
      title: "ON-CHAIN LINKED",
      description: "Every asset uniquely identified and tracked.",
    },
  ],
};

export const frameworkSectionTitle = "MULTI-LAYER CUSTODY FRAMEWORK";

export interface CustodyStep {
  readonly id: string;
  readonly step: string;
  readonly title: string;
  readonly description: string;
}

export const custodySteps: readonly CustodyStep[] = [
  {
    id: "sourcing",
    step: "1",
    title: "SOURCING & ACCEPTANCE",
    description:
      "Gemstones are sourced from vetted suppliers and verified by independent gemological laboratories before acceptance.",
  },
  {
    id: "transport",
    step: "2",
    title: "SECURE TRANSPORT",
    description:
      "Armed and insured logistics with real-time tracking from origin to vault.",
  },
  {
    id: "deposit",
    step: "3",
    title: "VAULT DEPOSIT",
    description:
      "Upon arrival, gemstones are inspected, recorded and deposited in high-security vaults.",
  },
  {
    id: "inventory",
    step: "4",
    title: "INVENTORY & VERIFICATION",
    description:
      "Each gemstone is catalogued, weighed, photographed and assigned a unique Digital Asset Passport.",
  },
  {
    id: "registration",
    step: "5",
    title: "ON-CHAIN REGISTRATION",
    description:
      "Gemstone data is hashed and anchored on-chain, creating an immutable proof of existence.",
  },
  {
    id: "monitoring",
    step: "6",
    title: "CONTINUOUS MONITORING",
    description:
      "Surveillance, environmental controls, audits and insurance run continuously for as long as the stone is held.",
  },
];

export interface CustodyCriterion {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export const custodianPanel = {
  title: "WHAT A CUSTODIAN HAS TO MEET",
  intro:
    "Custody is the part of this platform where a promise becomes a physical fact, so the bar a provider has to clear is set before any provider is chosen.",
  criteria: [
    {
      id: "specialist",
      title: "SPECIALIST IN HIGH-VALUE GOODS",
      description:
        "A demonstrated record in precious stones, precious metals or fine art — not general warehousing.",
    },
    {
      id: "segregated",
      title: "SEGREGATED HOLDINGS",
      description:
        "Client assets held separately from the custodian's own balance sheet and identifiable stone by stone.",
    },
    {
      id: "audited",
      title: "OPEN TO INDEPENDENT AUDIT",
      description:
        "Contractual right of access for a reserve auditor acting for token holders, not for GemReserve.io.",
    },
    {
      id: "insured",
      title: "INSURANCE IN ITS OWN NAME",
      description:
        "All-risk cover carried by the custodian, with the scope set out below and evidenced on request.",
    },
  ] as const satisfies readonly CustodyCriterion[],
  disclosure:
    "GemReserve.io names no vaulting company, logistics provider or insurer as a partner. Each provider is published here, with the scope of its engagement, once that engagement is in place.",
};

export const networkPanel = {
  title: "WHERE THINGS ARE HELD",
  intro:
    "One location is a matter of public record today. The rest follows the custody agreements, and is published when they are signed rather than before.",
  registered: {
    label: "Registered office",
    lines: [company.legalName, ...company.addressLines] as readonly string[],
    note: `${company.companyCodeLabel} ${company.companyCode}`,
  },
  planned: {
    label: "Vault jurisdictions",
    description:
      "Selected for legal certainty over title, insurable storage and the ability to move a stone across a border for redemption. Named here when custody is contracted — no vault city is claimed in advance.",
  },
  // Deliberately not the pinned world map the rest of the library carries: this
  // panel says no vault city is claimed yet, and three gold pins on a map say
  // the opposite louder than the sentence does.
  imageAlt: "A night map of the world, city lights joined by arcs of gold",
};

export interface SecurityFeature {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export const securityPanel = {
  title: "VAULT SECURITY FEATURES",
  features: [
    {
      id: "armed",
      title: "24/7 ARMED SECURITY",
      description: "On-site guards, patrols and rapid response.",
    },
    {
      id: "biometric",
      title: "BIOMETRIC ACCESS CONTROL",
      description: "Multi-factor authentication and restricted access.",
    },
    {
      id: "environmental",
      title: "ENVIRONMENTAL CONTROLS",
      description:
        "Temperature, humidity and air quality monitoring to preserve gemstone integrity.",
    },
    {
      id: "surveillance",
      title: "ADVANCED SURVEILLANCE",
      description: "HD cameras, motion detection and analytics.",
    },
    {
      id: "disaster",
      title: "DISASTER PROTECTION",
      description:
        "Fire suppression, flood protection and seismic-resistant construction.",
    },
    {
      id: "dual-control",
      title: "DUAL CONTROL PROTOCOL",
      description: "Two-person integrity rule for all vault operations.",
    },
  ] as const satisfies readonly SecurityFeature[],
};

export const insurancePanel = {
  title: "WHAT THE COVER HAS TO ANSWER FOR",
  intro:
    "Insurance is a condition of custody in this model. These are the perils a policy has to carry before a stone is accepted, taken from the board's own schedule.",
  perils: [
    "Theft, robbery and mysterious disappearance",
    "Fire, flood, earthquake and natural disasters",
    "Damage during transit",
    "War, civil commotion and terrorism",
    "Loss of market and non-physical damage",
  ] as readonly string[],
  note: "No insurer is named and no policy limit is stated, because no policy is in force. Cover, insurer and limit are published here when custody begins.",
};

export interface ProofCheck {
  readonly id: string;
  readonly label: string;
}

export const proofPanel = {
  title: "PROOF OF CUSTODY",
  checks: [
    { id: "passport", label: "A Digital Asset Passport for every gemstone" },
    { id: "on-chain", label: "On-chain verification of ownership" },
    { id: "audits", label: "Regular third-party audits and reporting" },
    {
      id: "reconciliation",
      label: "Inventory reconciliation against tokens issued",
    },
    {
      id: "anytime",
      label: "Reserves that a holder can check without asking us",
    },
  ] as const satisfies readonly ProofCheck[],
  link: {
    label: "See a sample Digital Asset Passport",
    href: "/digital-asset-passports",
  },
  imageAlt:
    "A cushion-cut emerald on a plinth beside a blank gold-edged record card",
};

export const custodyCta = {
  titleLines: ["Secure Today.", "Transparent Always."] as const,
  description:
    "Our custody and vault structure is designed to meet the highest institutional standards, so that your assets are protected, verified and accountable through blockchain transparency.",
  buttonLabel: "Join the Waitlist",
  supportingText: "Join our waitlist for early access.",
  imageAlt: "Six faceted gemstones arranged on dark slate plates",
};
