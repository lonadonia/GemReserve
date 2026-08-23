/**
 * The operating company behind GemReserve.io.
 *
 * Every corporate, jurisdiction and registered-address reference on the site
 * reads from here rather than repeating the details inline. That is the whole
 * point of the file: the previous entity's name, code and address had been
 * written out by hand in the footer, the About copy, the Contact offices and two
 * FAQ answers, and changing operating company meant hunting all of them down.
 * Adding a surface now means importing these constants, not retyping them.
 */
export interface CompanyIdentity {
  /** Full registered name, including the legal form. */
  legalName: string;
  /** Registration number issued by the Lithuanian Register of Legal Entities. */
  companyCodeLabel: string;
  companyCode: string;
  /** Registered office, one line per printed line. */
  addressLines: readonly string[];
  /** The registered office as a single line, for prose and metadata. */
  addressInline: string;
  /** Country of incorporation. */
  country: string;
  /** Adjective for prose: "a Lithuanian company". */
  countryAdjective: string;
  /** City of the registered office. */
  city: string;
  /** Short "City, Country" form for the footer location line. */
  locationShort: string;
  /** Regional indicator emoji for the footer flag. */
  flagEmoji: string;
}

export const company: CompanyIdentity = {
  legalName: "UAB GemVault Capital",
  companyCodeLabel: "Company Code",
  companyCode: "LT307501935",
  addressLines: ["Girulių g. 20", "Vilnius, LT-12123", "Lithuania"],
  addressInline: "Girulių g. 20, Vilnius, LT-12123, Lithuania",
  country: "Lithuania",
  countryAdjective: "Lithuanian",
  city: "Vilnius",
  locationShort: "Vilnius, Lithuania",
  flagEmoji: "🇱🇹",
};

/** One-line legal attribution, used in the footer. */
export const companyLegalLine = `GemReserve.io is operated by ${company.legalName}, ${company.companyCodeLabel} ${company.companyCode}, ${company.addressInline}.`;
