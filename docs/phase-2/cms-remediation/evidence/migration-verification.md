# Migration verification — staging

Run: 2026-09-02T02:13:07Z
Instance: isolated staging (MySQL :13306, PHP :8899), restored from a verified production dump.
Production was not touched.

## Route fidelity

All 58 public routes were captured before migration, after migration, after rollback,
and after a second migration, then compared byte for byte.

| Stage | Routes identical to pre-migration baseline |
|---|---|
| After migration | **58 / 58** |
| After rollback | **58 / 58** |
| After second migration (idempotency) | **58 / 58** |

Only two values are normalised before comparison, both time-varying by design:
`gr_nonce` (WordPress CSRF nonce) and `gr_t` (form issue timestamp). Nothing else —
whitespace, attribute order, srcset contents and generated element ids are compared exactly.
Tool: `wordpress/plugins/gemreserve-visual-cms/tools/compare-routes.sh`.

## Idempotency

SHA-256 of `post_content` for all 40 pages after the first and second migration runs:
**identical for all 40**.

## Structure produced

| Measure | Value |
|---|--:|
| Pages migrated | 40 / 40 |
| Pages refused | 0 |
| Blocks | 1,854 |
| Top-level sections | 176 |
| Editable content fields | 4,956 |
| Repeatable card groups | 147 |
| Preserved (admin-only) fallbacks | 0 |
