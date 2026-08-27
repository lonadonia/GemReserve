/**
 * Shared shapes for the two audience boards — Gemstone Owners and Originators,
 * and Gemstone Buyers and Collectors.
 *
 * The two boards address opposite sides of the same platform and repeat several
 * section types exactly: an icon strip of marks, a numbered journey, a "WHO WE
 * SERVE" card row and a closing band. Those shapes live here so both pages
 * describe them the same way.
 *
 * What is deliberately *not* here is a page schema. The boards order their
 * sections differently — buyers opens on the trust callout and closes on the
 * audience row, owners does the reverse — and they treat "WHO WE SERVE"
 * differently too. A single template with a fixed section order would flatten
 * both boards into one, so each page composes its own sections from these
 * pieces and from the shared `audience-*` styles.
 */

export interface AudienceHero {
  readonly breadcrumb: readonly [string, string];
  readonly titleLines: readonly [string, string];
  readonly tagline: string;
  readonly description: string;
  readonly heroBase: string;
}

export interface AudienceMark {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export interface AudienceCallout {
  readonly title: string;
  readonly description: string;
}

export interface AudienceStep {
  readonly id: string;
  readonly step: number;
  readonly title: string;
  readonly description: string;
}

export interface AudienceGroup {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

/** A point that carries its own heading, as the buyers board sets them. */
export interface AudiencePoint {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}
