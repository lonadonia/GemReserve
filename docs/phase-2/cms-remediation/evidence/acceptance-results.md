# Client acceptance test results

Run: 2026-09-03T18:07:47Z
Target: isolated staging (http://127.0.0.1:8899), reset from the verified
production dump, all 58 routes migrated.

Performed as the real marketing roles, in Chromium, through the WordPress
admin. Every assertion is on the public page, not on the editor.

```
  ✓   1 AT-01 — a marketing user can edit the content of an existing page (26.0s)
  ✓   2 AT-02 — a marketing user can replace text and images (28.9s)
  ✓   3 AT-03 — a marketing user can add and remove a page section (20.6s)
  ✓   4 AT-04 — a marketing user can reorder sections (21.4s)
  ✓   5 AT-05 — a marketing user can add and duplicate a card (30.3s)
  ✓   6 AT-06 — a marketing user can modify navigation and footer (15.6s)
  ✓   7 AT-07 — a marketing user can update page SEO (29.2s)
  ✓   8 AT-08 — a marketing user can preview desktop and mobile output (19.5s)
  ✓   9 AT-09 — a marketing user can save a draft and publish it (47.4s)
  ✓  10 AT-10 — a marketing user can create a new page from the approved design (51.3s)
  ✓  11 AT-11 — a marketing user can restore a previous version (28.4s)
  11 passed (5.4m)
```

**All eleven pass.**

This is automated verification. It is not client acceptance: no marketing
user has yet performed the manual scripts in CMS_ACCEPTANCE_TESTS.md and
signed off, which §30 requires before Phase 2 can be marked accepted.
