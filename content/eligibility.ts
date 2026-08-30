export interface KycHeroContent {
  breadcrumb: readonly [string, string, string];
  titleLead: string;
  titleAccent: string;
  tagline: string;
  description: string;
}

export const kycHero: KycHeroContent = {
  breadcrumb: ["Home", "How It Works", "Eligibility & KYC"],
  titleLead: "Eligibility",
  titleAccent: "& KYC",
  tagline: "Secure Access. Trusted Participants. Global Standards.",
  description:
    "At GemReserve.io, the security of our platform and the integrity of our asset-backed tokens are our top priorities. That's why we verify every participant through a robust KYC process designed to meet global regulatory standards and protect our ecosystem.",
};

export interface KycPillar {
  id: string;
  title: string;
  description: string;
}

export const kycHeroPillars: readonly KycPillar[] = [
  {
    id: "secure-compliant",
    title: "SECURE & COMPLIANT",
    description: "Built on global KYC/AML standards and best practices.",
  },
  {
    id: "trusted-community",
    title: "TRUSTED COMMUNITY",
    description: "Only verified participants can access our offerings.",
  },
  {
    id: "data-protection",
    title: "DATA PROTECTION",
    description: "Your data is encrypted, private, and secure.",
  },
  {
    id: "global-access",
    title: "GLOBAL ACCESS",
    description: "Designed for legitimate participants worldwide.",
  },
];

export const participateTitle = "WHO CAN PARTICIPATE?";

export const participateIntro =
  "GemReserve.io is open to individuals and legal entities who meet our eligibility criteria and complete our KYC verification process.";

export interface EligibilityGroup {
  id: string;
  title: string;
  requirements: readonly string[];
}

export const eligibilityGroups: readonly EligibilityGroup[] = [
  {
    id: "individuals",
    title: "INDIVIDUALS",
    requirements: [
      "18 years of age or older",
      "Valid government-issued ID",
      "Proof of residential address",
      "Source of funds declaration",
      "Must not be a restricted person per sanctions screening",
    ],
  },
  {
    id: "legal-entities",
    title: "LEGAL ENTITIES",
    requirements: [
      "Legally registered business",
      "Certificate of Incorporation or equivalent",
      "Beneficial Ownership Information",
      "Signatory Authorization",
      "Source of funds / wealth information",
    ],
  },
];

export const kycProcessTitle = "OUR KYC PROCESS";

export const kycProcessIntro =
  "Our streamlined KYC process ensures a secure onboarding experience while maintaining the highest compliance standards.";

export interface KycStep {
  id: string;
  step: number;
  title: string;
  description: string;
}

export const kycSteps: readonly KycStep[] = [
  {
    id: "register",
    step: 1,
    title: "REGISTER",
    description: "Create your account and provide basic information.",
  },
  {
    id: "submit",
    step: 2,
    title: "SUBMIT KYC",
    description:
      "Upload required documents and complete the KYC questionnaire.",
  },
  {
    id: "verification",
    step: 3,
    title: "VERIFICATION",
    description:
      "Our compliance team verifies your information and performs risk assessments.",
  },
  {
    id: "approval",
    step: 4,
    title: "APPROVAL",
    description:
      "Once approved, you will gain full access to platform features and offerings.",
  },
];

export const documentsTitle = "REQUIRED DOCUMENTS";

export const documentsIntro =
  "The following documents are typically required to complete your KYC verification.";

export interface RequiredDocument {
  id: string;
  title: string;
  qualifier?: string;
  description: string;
}

export const requiredDocuments: readonly RequiredDocument[] = [
  {
    id: "identification",
    title: "IDENTIFICATION",
    description:
      "Government-issued ID such as Passport, National ID, or Driver's License.",
  },
  {
    id: "address",
    title: "PROOF OF ADDRESS",
    description:
      "Utility bill, bank statement, or official document (issued within the last 3 months).",
  },
  {
    id: "funds",
    title: "SOURCE OF FUNDS",
    description:
      "Bank statement, payslip, or other document verifying source of funds/wealth.",
  },
  {
    id: "entity",
    title: "ENTITY DOCUMENTS",
    qualifier: "(For Companies)",
    description:
      "Certificate of Incorporation, Bylaws, MEM & AOA, and other relevant business documents.",
  },
  {
    id: "beneficial",
    title: "BENEFICIAL OWNERSHIP",
    qualifier: "(For Companies)",
    description:
      "Identification of all beneficial owners holding 25% or more ownership/control.",
  },
  {
    id: "additional",
    title: "ADDITIONAL INFORMATION",
    qualifier: "(If Requested)",
    description:
      "Additional documents or information may be required based on risk assessment.",
  },
];

export const restrictionsTitle = "ELIGIBILITY RESTRICTIONS";

export const restrictionsIntro =
  "To comply with international regulations, we are unable to onboard:";

export const restrictions: readonly string[] = [
  "Individuals or entities on international sanctions lists",
  "Politically Exposed Persons (PEPs) or close associates",
  "Entities or individuals engaged in illegal activities",
  "Residents of jurisdictions where participation is restricted or prohibited by law",
];

export const restrictionsFootnote =
  "*GemReserve.io reserves the right to refuse or terminate access at any time.";

export const privacyTitle = "YOUR PRIVACY, OUR PRIORITY";

export const privacyIntro =
  "We are committed to protecting your personal data.";

export const privacyPoints: readonly string[] = [
  "All data is encrypted and securely stored",
  "Access is restricted to authorized personnel only",
  "We do not share your information with third parties",
  "We comply with global data protection regulations including GDPR principles",
];

export const privacyFootnote = "Read our full Privacy Policy for more details.";

export interface KycCta {
  titleLead: string;
  titleAccent: string;
  description: string;
  buttonLabel: string;
  supportingText: string;
}

export const kycCta: KycCta = {
  titleLead: "Secure. Compliant. Transparent.",
  titleAccent: "Join a platform built on trust and a physical asset framework.",
  description:
    "Complete your KYC today and be ready for early access to exclusive opportunities at GemReserve.io.",
  buttonLabel: "Join the Waitlist",
  supportingText: "Early access. Limited spots.",
};

export const kycHeroImageAlt =
  "Six faceted gemstones arranged on a dark slate slab";
