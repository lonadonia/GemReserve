# Phase-one asset manifest

This manifest covers the phase-one media in `assets/masters`, `public/images`,
and `public/brand`, plus the App Router icon at `app/icon.svg`. The inventory is
current as of 2026-08-21.

## Production method and verification scope

The photographic masters were created with OpenAI's built-in image generation
after the supplied page mockups had been inspected at full resolution. Crops
under `reference/analysis/imagegen` were used as composition and style
references; they were not embedded in the delivered images. The generated
scenes were then deterministically processed by `scripts/process-assets.mjs`.
They were kept free of titles, labels, logos, and other baked-in interface text
so that all meaningful copy remains accessible HTML.

`scripts/process-assets.mjs` derives the delivery files with Sharp:

- hero masters become desktop WebP/AVIF pairs cut at the aspect ratio of the hero
  box they fill (1920×822 for the 2.33:1 Home and Assets plates, 1920×960 for the
  2:1 How It Works plate), plus mobile pairs that are **not** cropped: a phone
  hero box is around 0.43:1, so covering a 2.33:1 plate into it would throw away
  most of the composition. The mobile plate keeps its own ratio and the
  stylesheet contains it against the plates' shared edge colour, which puts the
  whole group of stones on screen with no visible seam;
- section masters become purpose-sized WebP/AVIF pairs;
- the 5×2 catalog source becomes ten 480×480 transparent WebP/AVIF pairs, each
  stone cut off its slate backdrop;
- each step plate in `assets/masters/process/` becomes a 400×400 transparent
  WebP/AVIF pair. The plates were generated one subject at a time and cut off
  their backdrop by flood filling inwards from the border, keying on "neutral and
  light" so a white specular highlight inside the object is never reachable and
  stays opaque; the rim is eroded a pixel before feathering so no pale halo is
  smeared into the edge against the dark card. They are gold-dominant on purpose:
  a mostly-dark object sinks into the step card. The pipeline asserts each master
  still carries an alpha channel. How It Works runs nine steps to Home's eight;
  its closing transparency step takes the brand crest, which has no counterpart
  among them;
- the two brand SVGs become transparent PNG exports.

The route code currently points to the `.webp` files. The `.avif` siblings are
on-disk alternatives and are not imported directly by the current JSX.
`next.config.ts` also allows Next Image to negotiate AVIF and WebP output.

Quality inspection performed for this manifest:

- all eight masters were visually inspected at original resolution;
- every WebP delivery image was visually inspected at its delivered crop;
- representative transparent brand PNGs were visually inspected;
- all 54 raster files were fully decoded with Sharp without error;
- all three SVG files parsed as XML without error;
- generated photographic assets contain no visible lettering or watermarks.

These images are illustrative presentation assets. They are not evidence of a
specific gemstone's origin, grade, certification, value, custody location, or
the existence of a real vault or operating network.

## Final image-generation prompt intent

The following records the exact final intent of each generation request as a
faithful summary; it is not a verbatim prompt log. Every request shared the
same baseline: text-free, photorealistic luxury macro/editorial imagery, with
no invented logo, crest, lettering, watermark, or interface copy.

1. **Home hero:** a text-free, cinematic black luxury still life with exactly
   seven gemstones: a red gemstone held in steel tweezers plus loose green,
   blue, pink, purple, yellow, and clear stones; a black-and-gold jeweler's
   loupe on the right; realistic facets, reflections, and tool geometry; broad
   dark negative space across the left for HTML copy.
2. **How-it-works hero:** a blank, unbranded black-and-gold dot-map card with
   an abstract world map but no labels, numbers, or wording; six red, blue,
   green, purple, yellow, and clear gemstones; a gold-rimmed loupe; a black
   luxury surface and open space for copy.
3. **Assets hero:** seven red, green, blue, purple, pink, yellow, and clear
   gemstones on a dark stone surface; metal tweezers presenting the clear
   stone; a large black macro lens at upper right; crisp jewelry photography,
   text-free output, and dark breathing room for HTML overlays.
4. **Secure sapphire vault:** a square security scene with a physically
   plausible open black institutional-style vault, a single illuminated
   pear-cut blue sapphire centered inside, and restrained gold network nodes
   on a black background.
5. **Lithuanian flag and Trakai Island Castle:** a wide, cinematic Lithuanian
   scene with an accurate yellow-green-red flag at left, Trakai Island Castle under
   warm sunset light, dark premium grading, and no people, signs, or text.
6. **Multigem secure tray:** a wide, open black-and-gold secure tray/safe
   containing multicolored gemstones, with a small loose group at lower right
   and clean dark negative space at left.
7. **Ten-gem catalog source:** a strict 5×2 studio sheet with one centered
   gemstone per cell, shared scale, lighting, camera angle, and dark surface;
   row one ruby, blue sapphire, emerald, diamond, and pink sapphire; row two
   yellow sapphire, amethyst, aquamarine, spinel, and tsavorite garnet; no
   labels, dividers, logos, or text.
8. **Sapphire blockchain network:** a blue faceted sapphire hovering above a
   concentric black-and-gold tokenization platform, connected gold network
   lines and nodes across the surface, restrained transparent cubes, and ample
   dark atmospheric background.

## Source masters

Masters are source material only and are not served by the application.

| Master                                         |    Dimensions | Derived asset and intended use                             | Inspection outcome                                                                                                                               |
| ---------------------------------------------- | ------------: | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `assets/masters/home-hero-master.png`          |  1755×896 PNG | Source for both Home hero crops.                           | **Pass.** Seven stones, tweezers, loupe, and left-side negative space are coherent; no text is present.                                          |
| `assets/masters/how-hero-master.png`           |  1646×956 PNG | Source for both How It Works hero crops.                   | **Pass.** Six stones, unlabelled map card, and loupe read clearly; no lettering is present.                                                      |
| `assets/masters/assets-hero-master.png`        |  1602×981 PNG | Source for both Assets hero crops.                         | **Pass.** Seven stones, tweezers, lens, and dark overlay space are clear; no text is present.                                                    |
| `assets/masters/vault-security-master.png`     | 1254×1254 PNG | Source for the square technology/security image.           | **Pass for illustrative use.** Sapphire and open-vault silhouette remain distinct at section size; hardware is stylized rather than documentary. |
| `assets/masters/lithuania-wide-master.png`     | 1536×1024 PNG | Source for the wide jurisdiction CTA image.                | **Pass.** Flag, castle, and sunset remain clear; no signs or text are present.                                                                   |
| `assets/masters/vault-tray-master.png`         |  1750×899 PNG | Source for the Home waitlist and Assets investment visual. | **Pass for illustrative use.** Open safe, tray, multicolored stones, and left negative space are clear.                                          |
| `assets/masters/catalog-gemstones-master.png`  |  1717×916 PNG | Source grid for all ten catalog-card images.               | **Pass.** The 5×2 order is consistent, each stone is isolated, and there are no labels or dividers.                                              |
| `assets/masters/blockchain-network-master.png` |  1658×949 PNG | Source for the optional blockchain/network section visual. | **Pass.** Sapphire, platform, gold connections, and clear nodes are coherent and text-free.                                                      |

## Hero delivery assets

Hero imagery is decorative in the current routes because the adjacent HTML
provides the page meaning. Keep `alt=""` and `aria-hidden="true"` on the media
wrapper unless the image is moved into a context where it carries information.

| Route                | Final files                                                                                    |    Dimensions | Current usage                                                             | Inspection outcome                                                                                                                                          |
| -------------------- | ---------------------------------------------------------------------------------------------- | ------------: | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home desktop         | `public/images/heroes/home-hero.webp`; `public/images/heroes/home-hero.avif`                   | 1920×822 each | `app/page.tsx` uses the WebP as the desktop hero background.              | **Pass.** Exported at the plate's native 2.33:1, so the tweezed ruby, six loose stones and loupe are all on screen with the left third clear for copy.      |
| Home mobile          | `public/images/heroes/home-hero-mobile.webp`; `public/images/heroes/home-hero-mobile.avif`     | 1000×714 each | `app/page.tsx` uses the WebP at the mobile breakpoint.                    | **Pass.** The stone-bearing window of the plate at its own ratio, contained rather than cropped, so every stone stays on screen.                            |
| How It Works desktop | `public/images/heroes/how-hero.webp`; `public/images/heroes/how-hero.avif`                     | 1920×960 each | `app/how-it-works/page.tsx` uses the WebP as the desktop hero background. | **Pass.** All six stones, map card, and loupe remain visible with dark space for the HTML copy column.                                                      |
| How It Works mobile  | `public/images/heroes/how-hero-mobile.webp`; `public/images/heroes/how-hero-mobile.avif`       | 900×1100 each | `app/how-it-works/page.tsx` uses the WebP at the mobile breakpoint.       | **Pass with focal-crop note.** Map card and four central stones remain; peripheral ruby, clear stone, and loupe fall outside the crop.                      |
| Assets desktop       | `public/images/heroes/assets-hero.webp`; `public/images/heroes/assets-hero.avif`               | 1920×822 each | `app/assets/page.tsx` uses the WebP as the desktop hero background.       | **Pass.** Exported at the plate's native 2.33:1; all seven stones, the loupe and the tweezers stay crisp and text-free, with the left third clear for copy. |
| Assets mobile        | `public/images/heroes/assets-hero-mobile.webp`; `public/images/heroes/assets-hero-mobile.avif` | 1000×564 each | `app/assets/page.tsx` uses the WebP at the mobile breakpoint.             | **Pass.** The stone-bearing window of the plate at its own ratio, contained rather than cropped, so every stone stays on screen.                            |

## Section delivery assets

| Subject                     | Final files                                                                                        |     Dimensions | Current usage                                                        | Suggested alt text and inspection outcome                                                                                                                                                            |
| --------------------------- | -------------------------------------------------------------------------------------------------- | -------------: | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Secure sapphire vault       | `public/images/sections/vault-security.webp`; `public/images/sections/vault-security.avif`         | 1000×1000 each | Technology/security panel in `app/how-it-works/page.tsx`.            | `A blue gemstone protected inside an open black vault`. **Pass for illustrative use;** the centered gem and vault remain readable without text. Do not describe it as an actual GemReserve facility. |
| Lithuania jurisdiction      | `public/images/sections/lithuania-wide.webp`; `public/images/sections/lithuania-wide.avif`         |  1800×640 each | Jurisdiction CTA in `app/how-it-works/page.tsx`.                     | `The Lithuanian flag before Trakai Island Castle at sunset`. **Pass;** the flag and castle remain intact after the wide crop.                                                                        |
| Multigem secure tray        | `public/images/sections/vault-tray.webp`; `public/images/sections/vault-tray.avif`                 |  1700×850 each | Home waitlist visual and Assets investment panel.                    | `Open black-and-gold vault displaying a tray of multicolored gemstones`. **Pass for illustrative use;** safe, tray, and loose stones remain distinct.                                                |
| Sapphire blockchain network | `public/images/sections/blockchain-network.webp`; `public/images/sections/blockchain-network.avif` |  1600×900 each | No current JSX reference; retained as a phase-one technology visual. | If informative: `Blue faceted gemstone above a glowing gold network platform`; otherwise use empty alt. **Pass;** focal sapphire, network lines, and platform are coherent and text-free.            |

## Catalog delivery assets

All catalog files are 480×480 images with a transparent background. Each output
is extracted from one cell of `catalog-gemstones-master.png`, then cut off the
slate backdrop: the backdrop is far darker than any stone, so a value threshold
separates the two, the largest connected blob rejects the backdrop's specular
speckle, unreachable interior pixels are filled back in so deep facets do not
punch holes, and the rim is eroded by a pixel before feathering so no dark halo
is smeared into the edge. The result is cropped tight to the stone and contained
on a square canvas, so the card frame supplies the setting rather than the
photograph. Alt text no longer describes a backdrop.

The catalog artwork is illustrative. Alt text should name only visible color,
cut, and presentation; do not use it to assert origin, weight, treatment,
laboratory report, or grade. When a nearby heading already supplies the stone
name and the visual adds no useful information, `alt=""` is also acceptable.

| Gem/source cell                  | Final files                                                                            | Current mapping                                                    | Suggested informative alt                | Inspection outcome                           |
| -------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------- | -------------------------------------------- |
| Ruby, row 1 column 1             | `public/images/gems/ruby.webp`; `public/images/gems/ruby.avif`                         | Home Burmese Ruby preview and Assets Ruby card.                    | `Faceted red ruby`                       | **Pass.** Centered, uncut, and free of text. |
| Blue sapphire, row 1 column 2    | `public/images/gems/blue-sapphire.webp`; `public/images/gems/blue-sapphire.avif`       | Home Sri Lankan Sapphire preview and Assets Blue Sapphire card.    | `Faceted deep-blue sapphire`             | **Pass.** Centered, uncut, and free of text. |
| Emerald, row 1 column 3          | `public/images/gems/emerald.webp`; `public/images/gems/emerald.avif`                   | Home Colombian Emerald preview and Assets Emerald card.            | `Rectangular faceted green gemstone`     | **Pass.** Centered, uncut, and free of text. |
| Diamond, row 1 column 4          | `public/images/gems/diamond.webp`; `public/images/gems/diamond.avif`                   | Home White Diamond preview and Assets Diamond card.                | `Round clear faceted gemstone`           | **Pass.** Centered, uncut, and free of text. |
| Pink sapphire, row 1 column 5    | `public/images/gems/pink-sapphire.webp`; `public/images/gems/pink-sapphire.avif`       | Home Padparadscha Sapphire preview and Assets Pink Sapphire card.  | `Oval pink faceted gemstone`             | **Pass.** Centered, uncut, and free of text. |
| Yellow sapphire, row 2 column 1  | `public/images/gems/yellow-sapphire.webp`; `public/images/gems/yellow-sapphire.avif`   | Home Fancy Yellow Diamond preview and Assets Yellow Sapphire card. | `Cushion-cut yellow faceted gemstone`    | **Pass.** Centered, uncut, and free of text. |
| Amethyst, row 2 column 2         | `public/images/gems/amethyst.webp`; `public/images/gems/amethyst.avif`                 | Assets Amethyst card.                                              | `Oval purple faceted gemstone`           | **Pass.** Centered, uncut, and free of text. |
| Aquamarine, row 2 column 3       | `public/images/gems/aquamarine.webp`; `public/images/gems/aquamarine.avif`             | Assets Aquamarine card.                                            | `Rectangular pale-blue faceted gemstone` | **Pass.** Centered, uncut, and free of text. |
| Spinel, row 2 column 4           | `public/images/gems/spinel.webp`; `public/images/gems/spinel.avif`                     | Assets Spinel card.                                                | `Cushion-cut red faceted gemstone`       | **Pass.** Centered, uncut, and free of text. |
| Tsavorite garnet, row 2 column 5 | `public/images/gems/tsavorite-garnet.webp`; `public/images/gems/tsavorite-garnet.avif` | Assets Tsavorite Garnet card.                                      | `Round vivid-green faceted gemstone`     | **Pass.** Centered, uncut, and free of text. |

## Brand and application icons

The brand marks are cut from one supplied master lockup,
`assets/masters/logo-master.png`, which renders the gold shield, the
red/green/purple/blue gem arrangement, the central `GR` monogram, the
`GemReserve.io` wordmark, and the `OWN • TRADE • REDEEM.` strapline pill.
`scripts/process-assets.mjs` locates the marks by scanning the master's alpha
channel for the transparent gutters between them. The crest is the leftmost
group and the lockup spans the first group's left edge to the last group's right
edge, so a plate that splits its `.io` suffix into a group of its own still
crops correctly. Every export below is written from those two crops, so the
marks cannot drift apart.

| Asset                                         |    Dimensions | Alpha/background | Usage and inspection outcome                                                                                                                                                                                                                              |
| --------------------------------------------- | ------------: | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `public/brand/gemreserve-shield-512.png`      |   512×622 PNG | Transparent      | Live crest, used only by the lifecycle diagram on How It Works. Kept at the artwork's natural 493:599 ratio so its layout box is not letterboxed. Use `alt=""` beside equivalent brand text, or `GemReserve shield` when it is the only informative mark. |
| `public/brand/gemreserve-shield-1024.png`     | 1024×1244 PNG | Transparent      | 2× crest export for future large-format use; no current JSX reference. **Pass:** edges and alpha are clean.                                                                                                                                               |
| `public/brand/gemreserve-horizontal-1200.png` |  1200×346 PNG | Transparent      | Live header/footer logo through `components/layout/Logo.tsx`. Linked-image alt is `GemReserve.io — Own. Trade. Redeem.` Use it on a dark surface: the wordmark and strapline are pale metallics. A matching `.webp` sits beside it.                       |
| `public/brand/gemreserve-horizontal-2400.png` |  2400×692 PNG | Transparent      | 2× counterpart for export contexts, with a matching `.webp`. **Pass:** crest, wordmark, strapline, and alpha are clean.                                                                                                                                   |
| `public/brand/app-icon-192.png`               |   192×192 PNG | Transparent      | Shield-only app/PWA raster option; no current JSX reference. **Pass:** fully decoded.                                                                                                                                                                     |
| `public/brand/app-icon-512.png`               |   512×512 PNG | Transparent      | High-resolution shield-only app/PWA raster option; no current JSX reference. **Pass:** visually inspected; full crest and alpha are intact.                                                                                                               |
| `app/icon.png`                                |   256×256 PNG | Transparent      | App Router icon source discovered automatically by Next.js, square-contained from the crest crop. Icons do not receive HTML alt text.                                                                                                                     |

## The twelve closing pages

The masters for the last twelve pages did not come from a new generation run.
The client supplied a per-page asset kit alongside the mockup archive, holding a
native composition for every board at four device ratios plus supporting
imagery, each generated from the board's subject and palette and deliberately
free of text, logos and readable marks. Those compositions were already in the
site's idiom — dark ground, controlled gold, photographic gemstone and vault
subjects, copy-safe negative space on the left — so nothing was generated for
these pages. No image generation service was used.

The supplied files are 3840x2160 (heroes and bands) and 2048x2048 (square
plates). They were resampled to the scale the rest of `assets/masters` uses —
2048 wide for heroes, 1600 for bands, 1024 for squares, all comfortably above
the 1920-wide delivery crop — and then processed by `scripts/process-assets.mjs`
with the rest of the library.

| Master                         | Delivery                   | Page                           |
| ------------------------------ | -------------------------- | ------------------------------ |
| `verification-hero-master.png` | `heroes/verification-hero` | Independent Verification       |
| `custody-hero-master.png`      | `heroes/custody-hero`      | Custody & Vault Structure      |
| `reserves-hero-master.png`     | `heroes/reserves-hero`     | Proof of Gemstone Reserves     |
| `corporate-hero-master.png`    | `heroes/corporate-hero`    | Corporate Development          |
| `news-hero-master.png`         | `heroes/news-hero`         | News & Announcements           |
| `resources-hero-master.png`    | `heroes/resources-hero`    | Resources                      |
| `documents-hero-master.png`    | `heroes/documents-hero`    | Documents                      |
| `whitepaper-hero-master.png`   | `heroes/whitepaper-hero`   | Whitepaper                     |
| `risk-hero-master.png`         | `heroes/risk-hero`         | Risk Disclosure                |
| `fraud-hero-master.png`        | `heroes/fraud-hero`        | Anti-Fraud Notice              |
| `portal-hero-master.png`       | `heroes/portal-hero`       | Participant Portal             |
| `program-hero-master.png`      | `heroes/program-hero`      | Early Participation Program    |
| `custody-record-master.png`    | `sections/custody-record`  | Custody — proof of custody     |
| `gem-cluster-master.png`       | `sections/gem-cluster`     | Custody — closing band         |
| `passport-device-master.png`   | `sections/passport-device` | Reserves — passport panel      |
| `network-map-master.png`       | `sections/network-map`     | Whitepaper, Custody            |
| `support-desk-master.png`      | `sections/support-desk`    | Documents — closing band       |
| `program-vault-master.png`     | `sections/program-vault`   | Early Participation Program    |
| `channel-shield-master.png`    | `sections/channel-shield`  | Anti-Fraud — official channels |
| `portal-security-master.png`   | `sections/portal-security` | Participant Portal — security  |
| `library-*-master.png` (6)     | `sections/library-*`       | Resources — library tiles      |
| `doc-*-master.png` (6)         | `sections/doc-*`           | Documents — covers             |

Two choices here are editorial rather than technical.

The custody page's "where things are held" panel uses `network-map` rather than
`world-map`, which is the map the rest of the library carries. `world-map` has
three gold location pins on it. That panel says no vault city is claimed yet,
and three pins say the opposite more loudly than the sentence does.

The participant portal's dashboard is built in HTML, not placed as the supplied
`portal-preview-dashboard` raster. Building it means every value in it can be
left blank; a rendered dashboard would have had to carry numbers.

## Alt-text decision checklist

1. Use empty alt for the three hero backgrounds because they duplicate adjacent
   page messaging and are already presentation-layer compositions.
2. Describe section imagery by what is visibly depicted, not by unverified
   custody, security, provenance, or platform claims.
3. Keep catalog alt text generic to the visible gemstone. Product metadata and
   example commercial records belong in nearby HTML, where they can be flagged
   for client verification.
4. Give the linked horizontal logo the destination/brand name. Treat repeated
   decorative shields as empty-alt images when nearby text already names the
   brand.
5. If `blockchain-network` is used only as atmosphere behind explanatory text,
   prefer empty alt; use its suggested description only when it conveys unique
   information in that placement.

## Regeneration

Run `npm run assets` after changing a master or either SVG in `public/brand`.
The script recreates every WebP/AVIF delivery pair and every public PNG brand
export listed above. Review desktop and mobile crops after regeneration; the
mobile hero files deliberately select a narrower focal region and do not retain
every peripheral object from their masters.
