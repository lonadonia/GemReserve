# GemReserve.io Phase One

GemReserve.io Phase One is a responsive Next.js App Router preview for a premium gemstone-asset platform. It uses strict TypeScript, reusable React components, typed content modules, custom responsive CSS, accessible navigation and controls, and locally generated brand and photographic assets.

## Routes

| Route           | Purpose                                                                                                          |
| --------------- | ---------------------------------------------------------------------------------------------------------------- |
| `/`             | Brand story, trust pillars, process overview, gemstone preview, platform metrics, and demo waitlist form         |
| `/how-it-works` | Nine-step operating process, trust pillars, technology/security overview, asset lifecycle, and Swiss trust CTA   |
| `/assets`       | Gemstone value proposition, metrics, working category filter and sort controls, catalog, and investment overview |

## Prerequisites

- Node.js `>=20.9.0`
- npm
- Optional for browser QA: Playwright browser binaries installed with `npx playwright install`

## Local development

```powershell
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For a production-mode local check:

```powershell
npm run lint
npm run typecheck
npm run build
npm run start
```

## Scripts

| Command                | Description                                                                         |
| ---------------------- | ----------------------------------------------------------------------------------- |
| `npm install`          | Install project dependencies using `package.json` and `package-lock.json`           |
| `npm run dev`          | Start the Next.js development server                                                |
| `npm run lint`         | Run ESLint across the project                                                       |
| `npm run typecheck`    | Run TypeScript with `--noEmit`                                                      |
| `npm run build`        | Create the optimized Next.js production build                                       |
| `npm run start`        | Serve an existing production build                                                  |
| `npm run assets`       | Regenerate delivery images and PNG brand exports from the source masters with Sharp |
| `npm run qa`           | Invoke the local Playwright test runner                                             |
| `npm run format`       | Format the repository with Prettier                                                 |
| `npm run format:check` | Check formatting without modifying files                                            |

The `qa` command runs the checked-in Playwright suite against the production server. It verifies the required viewport matrix, captures the release screenshots, checks for horizontal overflow and browser errors, and exercises the mobile menu, waitlist, and catalog controls. The suite uses the installed Chrome channel by default.

### Windows paths containing `&`

Workspace paths containing `&` are supported. Package scripts call Node and the installed tool entry points explicitly, for example `node ./node_modules/next/dist/bin/next`, rather than depending on shell-resolved `.bin` shims. Run tasks through `npm run <script>` from the project directory.

## Generated assets

Source and generated media are organized as follows:

```text
assets/masters/
  home-hero-master.png
  how-hero-master.png
  assets-hero-master.png
  catalog-gemstones-master.png
  vault-security-master.png
  vault-tray-master.png
  swiss-matterhorn-master.png
  blockchain-network-master.png
  logo-master.png

public/
  brand/                 Horizontal lockup, crest, and app-icon exports cut from the logo master
  images/heroes/         Desktop plates cut to each hero box (1920×960, Assets 1920×1100) and mobile 900×1100 WebP/AVIF pairs
  images/sections/       Responsive vault, Swiss, tray, and blockchain WebP/AVIF pairs
  images/gems/           Ten 720×500 gemstone WebP/AVIF pairs
```

Run `npm run assets` after changing a source master or brand SVG. The script recreates the derived files in `public/`; review and commit the regenerated output. The current generated assets are already checked in, so asset generation is not required during a normal Vercel build.

## Deploying to Vercel

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. In Vercel, choose **New Project** and import the repository.
3. Keep the repository root as the Root Directory and select the detected **Next.js** framework preset.
4. Use a Node.js version satisfying `>=20.9.0`.
5. Keep the standard install command (`npm install` or Vercel's lockfile-aware default), build command (`npm run build`), and Next.js output settings.
6. Do not add private environment variables: this phase-one site has no private runtime secrets, database, email provider, or server-side waitlist integration.
7. Deploy, then verify all three routes and their desktop and mobile layouts on the generated preview URL.

The waitlist form validates locally and shows a demonstration success state; it deliberately sends no data. Connect a real service and add the corresponding server-side configuration before using it for sign-ups.

## Content verification before production

The site faithfully reproduces supplied preview copy and example catalog data. Changeable assertions are centralized in `content/home.ts`, `content/how-it-works.ts`, and `content/assets.ts`, where factual or commercial records carry `requiresClientVerification` flags.

Before a public production launch, the client must verify at minimum:

- Swiss company and location statements;
- physical backing, ownership, tokenization, on-chain record, audit, and proof-of-reserve claims;
- laboratory verification, gemstone reports, provenance, grading, and appraisal claims;
- custody providers, vault locations, insurance, security, and compliance claims;
- trading, liquidity, redemption, global availability, eligibility, and KYC statements;
- asset counts, platform metrics, values, prices, weights, origins, and other catalog records.

Catalog detail actions, the asset registry, login, and future navigation destinations remain intentionally unavailable in this preview.

## Accessibility and responsive behavior

- Semantic landmarks and heading structure, a skip-to-content link, labeled controls, visible keyboard focus, and live status/error announcements are included.
- Desktop dropdowns and the mobile navigation support keyboard operation, Escape handling, and managed focus.
- Informative imagery has alternative text; decorative imagery and icons are hidden from assistive technology.
- Motion respects `prefers-reduced-motion`.
- Dedicated desktop/mobile hero crops, fluid typography, mobile navigation, reflowing process timelines and lifecycle stages, responsive grids, scroll-safe filters, and touch-sized controls cover desktop, tablet, and phone layouts down to 320px.

These features support accessibility but do not replace manual keyboard, screen-reader, zoom, contrast, and device testing before launch.
