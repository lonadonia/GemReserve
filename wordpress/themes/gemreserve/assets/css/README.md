# gemreserve.css is generated, not authored

The theme's stylesheet is a byte-for-byte copy of `app/globals.css` — the
approved design, 21,337 hand-authored lines. It is **not** committed here.

Two copies of the same 434 KB file in one repository is not redundancy, it is a
divergence waiting to happen: someone edits one, the other silently goes stale,
and the WordPress site drifts from the approved design without anyone noticing.

`deploy/deploy.sh` copies it in, alongside the 508 image derivatives under
`public/`, which are duplicated for exactly the same reason.

## When Next.js is retired

Move `app/globals.css` to `wordpress/themes/gemreserve/assets/css/gemreserve.css`
and drop the copy step from the deploy script. Until then the Next.js tree is
the source of truth, because it is what production serves.
