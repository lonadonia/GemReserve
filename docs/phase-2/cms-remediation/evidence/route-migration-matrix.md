# Route migration matrix — all 58 public routes

Every public route, what rendered it before, what renders it now, what it
decomposed into, and whether the migration reproduced it byte for byte.

Generated live from the isolated staging instance. The `Verified` column is the
byte-identity precondition inside the migration's write path — a page that does
not pass is refused and left untouched, so a `yes` here is a check that ran, not
a claim.

| # | Route | Type | Before | After | Sections* | Blocks | Fields | Cards | Preserved | Verified |
|--:|---|---|---|---|--:|--:|--:|--:|--:|---|
| 1 | `/` | page | `_gr_body_html` | blocks | — | 44 | 131 | 1 | 0 | yes |
| 2 | `/about/` | page | `_gr_body_html` | blocks | — | 34 | 76 | 1 | 0 | yes |
| 3 | `/anti-fraud-notice/` | page | `_gr_body_html` | blocks | — | 48 | 116 | 4 | 0 | yes |
| 4 | `/aquamarine/` | gemstone | `_gr_body_html` | blocks | — | 56 | 149 | 3 | 0 | yes |
| 5 | `/asset-registry/` | page | `_gr_body_html` | blocks | — | 63 | 163 | 3 | 0 | yes |
| 6 | `/assets/` | page | `_gr_body_html` | blocks | — | 25 | 216 | 0 | 0 | yes |
| 7 | `/contact/` | page | `_gr_body_html` | blocks | — | 27 | 95 | 2 | 0 | yes |
| 8 | `/corporate-development/` | page | `_gr_body_html` | blocks | — | 43 | 144 | 4 | 0 | yes |
| 9 | `/custody-vault-structure/` | page | `_gr_body_html` | blocks | — | 52 | 110 | 5 | 0 | yes |
| 10 | `/digital-asset-passports/` | page | `_gr_body_html` | blocks | — | 67 | 121 | 1 | 0 | yes |
| 11 | `/discount-methodology/` | page | `_gr_body_html` | blocks | — | 38 | 89 | 3 | 0 | yes |
| 12 | `/documents/` | page | `_gr_body_html` | blocks | — | 39 | 134 | 3 | 0 | yes |
| 13 | `/early-participation-program/` | page | `_gr_body_html` | blocks | — | 55 | 144 | 5 | 0 | yes |
| 14 | `/early-participation/` | page | `_gr_body_html` | blocks | — | 24 | 88 | 4 | 0 | yes |
| 15 | `/eligibility-kyc/` | page | `_gr_body_html` | blocks | — | 54 | 101 | 4 | 0 | yes |
| 16 | `/emerald/` | gemstone | `_gr_body_html` | blocks | — | 43 | 116 | 5 | 0 | yes |
| 17 | `/enterprise-tokenization/` | page | `_gr_body_html` | blocks | — | 34 | 127 | 6 | 0 | yes |
| 18 | `/enterprise/` | page | `_gr_body_html` | blocks | — | 34 | 137 | 3 | 0 | yes |
| 19 | `/faq/` | page | `_gr_body_html` | blocks | — | 22 | 89 | 1 | 0 | yes |
| 20 | `/future-infrastructure/` | page | `_gr_body_html` | blocks | — | 32 | 114 | 4 | 0 | yes |
| 21 | `/gemstone-buyers/` | page | `_gr_body_html` | blocks | — | 33 | 130 | 6 | 0 | yes |
| 22 | `/gemstone-owners/` | page | `_gr_body_html` | blocks | — | 44 | 100 | 6 | 0 | yes |
| 23 | `/gemstone-programs/` | page | `_gr_body_html` | blocks | — | 60 | 325 | 4 | 0 | yes |
| 24 | `/gemstone-tokenization/` | page | `_gr_body_html` | blocks | — | 53 | 158 | 4 | 0 | yes |
| 25 | `/governance/` | page | `_gr_body_html` | blocks | — | 30 | 87 | 4 | 0 | yes |
| 26 | `/how-it-works/` | page | `_gr_body_html` | blocks | — | 52 | 108 | 2 | 0 | yes |
| 27 | `/independent-verification/` | page | `_gr_body_html` | blocks | — | 47 | 119 | 2 | 0 | yes |
| 28 | `/investors/` | page | `_gr_body_html` | blocks | — | 47 | 140 | 5 | 0 | yes |
| 29 | `/licensing-white-label/` | page | `_gr_body_html` | blocks | — | 45 | 117 | 7 | 0 | yes |
| 30 | `/natural-raw-charoite/` | gemstone | `_gr_body_html` | blocks | — | 44 | 128 | 5 | 0 | yes |
| 31 | `/natural-rough-alexandrite/` | gemstone | `_gr_body_html` | blocks | — | 44 | 128 | 5 | 0 | yes |
| 32 | `/natural-rough-aquamarine/` | gemstone | `_gr_body_html` | blocks | — | 44 | 125 | 5 | 0 | yes |
| 33 | `/natural-rough-chrysoprase/` | gemstone | `_gr_body_html` | blocks | — | 44 | 128 | 5 | 0 | yes |
| 34 | `/natural-rough-emerald/` | gemstone | `_gr_body_html` | blocks | — | 44 | 127 | 5 | 0 | yes |
| 35 | `/natural-rough-italian-jade/` | gemstone | `_gr_body_html` | blocks | — | 45 | 130 | 5 | 0 | yes |
| 36 | `/natural-rough-jasper/` | gemstone | `_gr_body_html` | blocks | — | 44 | 128 | 5 | 0 | yes |
| 37 | `/natural-rough-peridot/` | gemstone | `_gr_body_html` | blocks | — | 44 | 128 | 5 | 0 | yes |
| 38 | `/natural-rough-ruby-c-quality/` | gemstone | `_gr_body_html` | blocks | — | 43 | 116 | 5 | 0 | yes |
| 39 | `/natural-rough-ruby-gem-quality/` | gemstone | `_gr_body_html` | blocks | — | 44 | 128 | 5 | 0 | yes |
| 40 | `/natural-rough-ruby-trapiche/` | gemstone | `_gr_body_html` | blocks | — | 44 | 125 | 5 | 0 | yes |
| 41 | `/natural-rough-rutilated-quartz/` | gemstone | `_gr_body_html` | blocks | — | 45 | 129 | 5 | 0 | yes |
| 42 | `/natural-rough-tourmaline/` | gemstone | `_gr_body_html` | blocks | — | 44 | 128 | 5 | 0 | yes |
| 43 | `/news/` | page | `_gr_body_html` | blocks | — | 40 | 84 | 1 | 0 | yes |
| 44 | `/participant-portal/` | page | `_gr_body_html` | blocks | — | 64 | 161 | 5 | 0 | yes |
| 45 | `/peridot/` | gemstone | `_gr_body_html` | blocks | — | 43 | 120 | 5 | 0 | yes |
| 46 | `/physical-redemption/` | page | `_gr_body_html` | blocks | — | 50 | 137 | 5 | 0 | yes |
| 47 | `/platform-infrastructure/` | page | `_gr_body_html` | blocks | — | 34 | 137 | 5 | 0 | yes |
| 48 | `/program-overview/` | page | `_gr_body_html` | blocks | — | 26 | 73 | 4 | 0 | yes |
| 49 | `/proof-of-reserves/` | page | `_gr_body_html` | blocks | — | 49 | 132 | 4 | 0 | yes |
| 50 | `/redemption-portal/` | page | `_gr_body_html` | blocks | — | 35 | 94 | 5 | 0 | yes |
| 51 | `/resources/` | page | `_gr_body_html` | blocks | — | 46 | 111 | 1 | 0 | yes |
| 52 | `/restricted-jurisdictions/` | page | `_gr_body_html` | blocks | — | 35 | 80 | 3 | 0 | yes |
| 53 | `/risk-disclosure/` | page | `_gr_body_html` | blocks | — | 33 | 81 | 3 | 0 | yes |
| 54 | `/ruby/` | gemstone | `_gr_body_html` | blocks | — | 44 | 118 | 5 | 0 | yes |
| 55 | `/technology/` | page | `_gr_body_html` | blocks | — | 43 | 141 | 5 | 0 | yes |
| 56 | `/token-acquisition/` | page | `_gr_body_html` | blocks | — | 40 | 132 | 6 | 0 | yes |
| 57 | `/tourmaline/` | gemstone | `_gr_body_html` | blocks | — | 43 | 120 | 5 | 0 | yes |
| 58 | `/whitepaper/` | page | `_gr_body_html` | blocks | — | 37 | 114 | 6 | 0 | yes |

\* Section counts per route are in `page-block-inventory.json`; the live report
does not break blocks down by type.

**58 routes, 58 verified byte-identical, 0 refused.**

Blocks 2480 · editable fields 7227 · card groups 235 · preserved fallbacks 0.

## Routes not migrated

None. Every public route carried a migrated body and every one reproduced exactly.

