import { mkdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import sharp from "sharp";

const root = process.cwd();
const masters = path.join(root, "assets", "masters");
const publicDir = path.join(root, "public");
const heroDir = path.join(publicDir, "images", "heroes");
const sectionDir = path.join(publicDir, "images", "sections");
const gemDir = path.join(publicDir, "images", "gems");
const brandDir = path.join(publicDir, "brand");
const processDir = path.join(publicDir, "images", "process");
const architectureDir = path.join(publicDir, "images", "architecture");
const plateDir = path.join(publicDir, "images", "plates");
const galleryDir = path.join(publicDir, "images", "gallery");

await Promise.all(
  [
    heroDir,
    sectionDir,
    gemDir,
    brandDir,
    processDir,
    architectureDir,
    plateDir,
    galleryDir,
  ].map((directory) => mkdir(directory, { recursive: true })),
);

async function exportPair(input, outputBase, resize, options = {}) {
  const base = sharp(input);
  const pipeline = (
    options.extract ? base.extract(options.extract) : base
  ).resize(resize);
  await Promise.all([
    pipeline
      .clone()
      .webp({ quality: options.webpQuality ?? 86, smartSubsample: true })
      .toFile(`${outputBase}.webp`),
    pipeline
      .clone()
      .avif({ quality: options.avifQuality ?? 61, effort: 7 })
      .toFile(`${outputBase}.avif`),
  ]);
}

// The brand exports run before the heroes because two of the Company heroes
// composite the crest into their scene, and the crest is derived here. Leaving
// this block below them would have fed those heroes the previous run's crest.
// Brand lockup exports are derived from the rendered master artwork. The master
// packs the crest and the wordmark side by side separated by a band of fully
// transparent columns, so the two marks are located by scanning the alpha
// channel instead of hard-coding pixel offsets.
const logoMaster = path.join(masters, "logo-master.png");

async function alphaColumnProfile(input) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const columns = new Array(info.width).fill(0);
  let top = info.height;
  let bottom = -1;
  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      if (data[(y * info.width + x) * info.channels + 3] > 8) {
        columns[x] += 1;
        if (y < top) top = y;
        if (y > bottom) bottom = y;
      }
    }
  }
  return { columns, top, bottom, width: info.width, height: info.height };
}

function opaqueRuns(columns) {
  const runs = [];
  let start = -1;
  for (let x = 0; x < columns.length; x += 1) {
    if (columns[x] > 0) {
      if (start < 0) start = x;
    } else if (start >= 0) {
      runs.push({ left: start, right: x - 1 });
      start = -1;
    }
  }
  if (start >= 0) runs.push({ left: start, right: columns.length - 1 });
  return runs;
}

const logoProfile = await alphaColumnProfile(logoMaster);
const logoRuns = opaqueRuns(logoProfile.columns);
if (logoRuns.length < 2) {
  throw new Error(
    `Expected logo-master.png to hold a crest and a wordmark separated by transparent columns; found ${logoRuns.length} group(s).`,
  );
}

const lockupBox = {
  left: logoRuns[0].left,
  top: logoProfile.top,
  width: logoRuns.at(-1).right - logoRuns[0].left + 1,
  height: logoProfile.bottom - logoProfile.top + 1,
};

// The crest is the leftmost group. Its vertical extent is measured on its own so
// the square icon exports are not padded out by the taller wordmark box.
const crestColumnSlice = await sharp(logoMaster)
  .extract({
    left: logoRuns[0].left,
    top: 0,
    width: logoRuns[0].right - logoRuns[0].left + 1,
    height: logoProfile.height,
  })
  .png()
  .toBuffer();
const crestProfile = await alphaColumnProfile(crestColumnSlice);
const crestBox = {
  left: logoRuns[0].left,
  top: crestProfile.top,
  width: logoRuns[0].right - logoRuns[0].left + 1,
  height: crestProfile.bottom - crestProfile.top + 1,
};

const lockup = await sharp(logoMaster).extract(lockupBox).png().toBuffer();
const crest = await sharp(logoMaster).extract(crestBox).png().toBuffer();

for (const width of [1200, 2400]) {
  const resized = sharp(lockup).resize({ width, fit: "inside" });
  await Promise.all([
    resized
      .clone()
      .png({ compressionLevel: 9 })
      .toFile(path.join(brandDir, `gemreserve-horizontal-${width}.png`)),
    resized
      .clone()
      .webp({ quality: 92, smartSubsample: true })
      .toFile(path.join(brandDir, `gemreserve-horizontal-${width}.webp`)),
  ]);
}

// In-page crest exports keep the artwork's natural aspect ratio so the layout
// boxes in the hero overlays and the lifecycle diagram are not letterboxed.
for (const size of [512, 1024]) {
  await sharp(crest)
    .resize({ width: size })
    .png({ compressionLevel: 9 })
    .toFile(path.join(brandDir, `gemreserve-shield-${size}.png`));
}

// App/PWA icons stay square-contained; those surfaces require a square canvas.
for (const size of [192, 512]) {
  await sharp(crest)
    .resize({ width: size, height: size, fit: "contain" })
    .png({ compressionLevel: 9 })
    .toFile(path.join(brandDir, `app-icon-${size}.png`));
}

// Favicon source consumed by Next.js file-based metadata at app/icon.png.
await sharp(crest)
  .resize({ width: 256, height: 256, fit: "contain" })
  .png({ compressionLevel: 9 })
  .toFile(path.join(root, "app", "icon.png"));

// Each hero is exported at the aspect ratio of the box it fills, so object-fit
// has almost nothing left to crop and the whole plate stays on screen. The Home
// and Assets plates are 2.33:1 panoramas with the stones grouped right of centre
// and dark space on the left for the copy, so they ship at their native ratio.
//
// The portrait mobile crop cannot keep a 2.33:1 frame, so each plate names the
// horizontal window holding its stones; that window is cut first and the crop is
// taken from it, which keeps the stones rather than the empty left third.
const heroJobs = [
  {
    source: "home-hero-master.png",
    name: "home-hero",
    position: "center",
    width: 1920,
    height: 822,
    mobileWindow: [0.4, 1],
  },
  {
    source: "how-hero-master.png",
    name: "how-hero",
    position: "center",
    width: 1920,
    height: 960,
  },
  {
    source: "assets-hero-master.png",
    name: "assets-hero",
    position: "center",
    width: 1920,
    height: 822,
    mobileWindow: [0.24, 1],
  },
  {
    source: "technology-hero-master.png",
    name: "technology-hero",
    position: "right",
    width: 1920,
    height: 822,
    padLeft: 0.5,
    mobileWindow: [0.3, 1],
  },
  {
    source: "enterprise-hero-master.png",
    name: "enterprise-hero",
    position: "right",
    width: 1920,
    height: 822,
    padLeft: 0.42,
    mobileWindow: [0.2, 1],
  },
  {
    source: "investors-hero-master.png",
    name: "investors-hero",
    position: "right",
    width: 1920,
    height: 822,
    padLeft: 0.36,
    mobileWindow: [0.16, 1],
  },
  {
    source: "about-hero-plate.png",
    name: "about-hero",
    position: "right",
    width: 1920,
    height: 822,
    padLeft: 0.34,
    mobileWindow: [0.32, 1],
    // The board shows the crest through the loupe glass, so it is laid into the
    // lens at partial opacity rather than stood on the slate.
    crestPlacement: {
      heightFraction: 0.17,
      centreX: 0.518,
      centreY: 0.3,
      opacity: 0.72,
    },
  },
  {
    source: "governance-hero-plate.png",
    name: "governance-hero",
    position: "right",
    width: 1920,
    height: 822,
    padLeft: 0.3,
    mobileWindow: [0.26, 1],
    crestPlacement: { heightFraction: 0.47, centreX: 0.42, centreY: 0.47 },
  },
  {
    source: "contact-hero-master.png",
    name: "contact-hero",
    position: "right",
    width: 1920,
    height: 822,
    padLeft: 0.3,
    mobileWindow: [0.24, 1],
  },
  {
    source: "waitlist-hero-plate.png",
    name: "waitlist-hero",
    position: "right",
    width: 1920,
    height: 822,
    padLeft: 0.3,
    mobileWindow: [0.26, 1],
    // The board stands a card behind the stones carrying the brand promise; the
    // plate is generated with that card blank so the real crest can sit on it.
    crestPlacement: { heightFraction: 0.3, centreX: 0.68, centreY: 0.36 },
  },
  {
    source: "kyc-hero-master.png",
    name: "kyc-hero",
    position: "right",
    width: 1920,
    height: 822,
    padLeft: 0.34,
    mobileWindow: [0.28, 1],
  },
  {
    source: "faq-hero-master.png",
    name: "faq-hero",
    position: "right",
    width: 1920,
    height: 822,
    padLeft: 0.3,
    mobileWindow: [0.22, 1],
  },
  // The three Technology detail plates are the client's own hero artwork rather
  // than generated scenes, so they are padded to clear the copy column the same
  // way the rest of the library is, and nothing else is done to them.
  {
    source: "tokenization-hero-master.png",
    name: "tokenization-hero",
    position: "right",
    width: 1920,
    height: 822,
    padLeft: 0.26,
    mobileWindow: [0.34, 1],
  },
  {
    source: "redemption-hero-master.png",
    name: "redemption-hero",
    position: "right",
    width: 1920,
    height: 822,
    padLeft: 0.32,
    mobileWindow: [0.3, 1],
  },
  // Three more of the client's detail pages. The infrastructure plate is the
  // client's own artwork with the shield dead centre, so it is padded hard left
  // to slide the shield clear of the copy column; the other two were generated
  // with their left third already dark and need only a little.
  {
    source: "infrastructure-hero-master.png",
    name: "infrastructure-hero",
    position: "right",
    width: 1920,
    height: 822,
    padLeft: 0.44,
    mobileWindow: [0.22, 1],
  },
  {
    source: "programs-hero-master.png",
    name: "programs-hero",
    position: "right",
    width: 1920,
    height: 822,
    padLeft: 0.18,
    mobileWindow: [0.3, 1],
  },
  {
    source: "registry-hero-master.png",
    name: "registry-hero",
    position: "right",
    width: 1920,
    height: 822,
    padLeft: 0.16,
    mobileWindow: [0.28, 1],
  },
  // The two single-stone pages. Both plates are the client's own, and both put
  // their stone right of centre already, so they need only a modest pad to clear
  // the copy column.
  {
    source: "aquamarine-hero-master.png",
    name: "aquamarine-hero",
    position: "right",
    width: 1920,
    height: 822,
    padLeft: 0.12,
    mobileWindow: [0.34, 1],
  },
  {
    source: "emerald-hero-master.png",
    name: "emerald-hero",
    position: "right",
    width: 1920,
    height: 822,
    padLeft: 0.2,
    mobileWindow: [0.3, 1],
  },
  // The six follow-on gemstone heroes use regenerated wide plates with the
  // stone already restrained to the right third. Unlike the original source
  // crops, they need no synthetic left padding; adding it again would make the
  // subject too small and move it into the edge of the frame.
  {
    source: "peridot-hero-v2-master.png",
    name: "peridot-hero",
    position: "center",
    width: 1920,
    height: 822,
    mobileWindow: [0.4, 1],
  },
  {
    source: "ruby-hero-v2-master.png",
    name: "ruby-hero",
    position: "center",
    width: 1920,
    height: 822,
    mobileWindow: [0.4, 1],
  },
  {
    source: "tourmaline-hero-v2-master.png",
    name: "tourmaline-hero",
    position: "center",
    width: 1920,
    height: 822,
    mobileWindow: [0.4, 1],
  },
  {
    source: "charoite-hero-v2-master.png",
    name: "charoite-hero",
    position: "center",
    width: 1920,
    height: 822,
    mobileWindow: [0.4, 1],
  },
  {
    source: "alexandrite-hero-v2-master.png",
    name: "alexandrite-hero",
    position: "center",
    width: 1920,
    height: 822,
    mobileWindow: [0.38, 1],
  },
  {
    source: "rough-aquamarine-hero-v2-master.png",
    name: "rough-aquamarine-hero",
    position: "center",
    width: 1920,
    height: 822,
    mobileWindow: [0.4, 1],
  },
  // The next rough-stone pages are built directly from the client's supplied
  // transparent clusters. A deterministic slate plate keeps the source stone
  // accurate while matching the restrained right-third scale of the v2 heroes.
  {
    roughCutout: {
      source: "chrysoprase-rough-master.png",
      accent: "#7ed957",
    },
    name: "chrysoprase-hero",
    position: "center",
    width: 1920,
    height: 822,
    mobileWindow: [0.4, 1],
  },
  {
    roughCutout: {
      source: "italian-jade-rough-master.png",
      accent: "#71c94b",
    },
    name: "italian-jade-hero",
    position: "center",
    width: 1920,
    height: 822,
    mobileWindow: [0.4, 1],
  },
  {
    roughCutout: {
      source: "jasper-rough-master.png",
      accent: "#f1ad08",
    },
    name: "jasper-hero",
    position: "center",
    width: 1920,
    height: 822,
    mobileWindow: [0.4, 1],
  },
  {
    roughCutout: {
      source: "ruby-c-quality-rough-master.png",
      accent: "#ff2947",
    },
    name: "ruby-c-quality-hero",
    position: "center",
    width: 1920,
    height: 822,
    mobileWindow: [0.4, 1],
  },
  {
    roughCutout: {
      source: "ruby-trapiche-rough-master.png",
      accent: "#ef4778",
    },
    name: "ruby-trapiche-hero",
    position: "center",
    width: 1920,
    height: 822,
    mobileWindow: [0.4, 1],
  },
  {
    roughCutout: {
      source: "ruby-gem-quality-rough-master.png",
      accent: "#ff3854",
    },
    name: "ruby-gem-quality-hero",
    position: "center",
    width: 1920,
    height: 822,
    mobileWindow: [0.4, 1],
  },
  {
    roughCutout: {
      source: "rutilated-quartz-rough-master.png",
      accent: "#e7a916",
    },
    name: "rutilated-quartz-hero",
    position: "center",
    width: 1920,
    height: 822,
    mobileWindow: [0.4, 1],
  },
  {
    roughCutout: {
      source: "rough-tourmaline-master.png",
      accent: "#df5c99",
    },
    name: "rough-tourmaline-hero",
    position: "center",
    width: 1920,
    height: 822,
    mobileWindow: [0.4, 1],
  },
  {
    roughCutout: {
      source: "rough-peridot-master.png",
      accent: "#8bd52d",
    },
    name: "rough-peridot-hero",
    position: "center",
    width: 1920,
    height: 822,
    mobileWindow: [0.4, 1],
  },
  {
    roughCutout: {
      source: "rough-emerald-master.png",
      accent: "#49d274",
    },
    name: "rough-emerald-hero",
    position: "center",
    width: 1920,
    height: 822,
    mobileWindow: [0.4, 1],
  },
  {
    source: "passports-hero-master.png",
    name: "passports-hero",
    position: "right",
    width: 1920,
    height: 822,
    // No left pad on this one: the stone already sits at about 62% of the frame
    // with the left half dark and empty, and padding it any further would slide
    // the stone underneath the passport card the hero stands on the right.
    mobileWindow: [0.3, 1],
  },
];

// Drop the crest into a generated scene. A generated shield would be a
// different mark every time and none of them would be GemReserve's, so the
// boards' crest is composited from the brand artwork instead. It is grounded
// with a shadow built from its own alpha: squashed, blurred and laid underneath,
// which is what stops it reading as a sticker on top of a photograph.
async function standCrest(
  plate,
  { heightFraction, centreX, centreY, opacity = 1 },
) {
  const scene = await sharp(plate).metadata();
  const crestHeight = Math.round(scene.height * heightFraction);
  const mark = await sharp(crest)
    .resize({ height: crestHeight, fit: "inside" })
    .ensureAlpha()
    .composite(
      opacity < 1
        ? [
            {
              input: Buffer.from([255, 255, 255, Math.round(opacity * 255)]),
              raw: { width: 1, height: 1, channels: 4 },
              tile: true,
              blend: "dest-in",
            },
          ]
        : [],
    )
    .png()
    .toBuffer();
  const crestMeta = await sharp(mark).metadata();
  const left = Math.round(scene.width * centreX - crestMeta.width / 2);
  const top = Math.round(scene.height * centreY - crestMeta.height / 2);

  const layers = [];
  if (opacity === 1) {
    const shadowHeight = Math.max(1, Math.round(crestMeta.height * 0.24));
    const shadow = await sharp(mark)
      .extractChannel("alpha")
      .resize({ width: crestMeta.width, height: shadowHeight, fit: "fill" })
      .blur(Math.max(1, crestMeta.width * 0.035))
      .toColourspace("b-w")
      .toBuffer();
    layers.push({
      input: await sharp({
        create: {
          width: crestMeta.width,
          height: shadowHeight,
          channels: 3,
          background: { r: 0, g: 0, b: 0 },
        },
      })
        .joinChannel(shadow)
        .png()
        .toBuffer(),
      left,
      top: top + crestMeta.height - Math.round(shadowHeight * 0.55),
    });
  }
  layers.push({ input: mark, left, top });

  return sharp(plate).composite(layers).png().toBuffer();
}

// Extend a plate leftwards using the mean colour of its own left edge, so the
// subject clears the copy column without cropping any of it away.
async function padPlateLeft(input, fraction) {
  const meta = await sharp(input).metadata();
  const pad = Math.round(meta.width * fraction);
  // The plate's own leftmost strip is stretched across the pad rather than the
  // pad being filled with that strip's average colour. Every one of these plates
  // carries a vignette into its left edge, and a flat panel butted against a
  // gradient shows a hard vertical seam exactly where the copy column sits.
  // Stretching a 10px strip keeps the vertical falloff and joins invisibly.
  const strip = await sharp(input)
    .extract({ left: 0, top: 0, width: 10, height: meta.height })
    .resize({ width: pad, height: meta.height, fit: "fill" })
    .png()
    .toBuffer();
  return sharp(input)
    .extend({ left: pad, background: { r: 0, g: 0, b: 0, alpha: 1 } })
    .composite([{ input: strip, left: 0, top: 0 }])
    .png()
    .toBuffer();
}

// Cut the horizontal slice of a plate that holds its subject.
async function plateWindow(input, [start, end]) {
  const meta = await sharp(input).metadata();
  const left = Math.round(meta.width * start);
  const right = Math.round(meta.width * end);
  return sharp(input)
    .extract({ left, top: 0, width: right - left, height: meta.height })
    .png()
    .toBuffer();
}

async function composeRoughHero(input, accent) {
  const width = 1920;
  const height = 822;
  const stoneSize = 680;
  const stoneLeft = 1170;
  const stoneTop = 64;
  const trimmed = await sharp(input)
    .extract(await alphaBox(input))
    .resize({
      width: stoneSize,
      height: stoneSize,
      fit: "contain",
      position: "center",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: "lanczos3",
    })
    .sharpen({ sigma: 0.45 })
    .png()
    .toBuffer();

  const stoneMeta = await sharp(trimmed).metadata();
  const glowMask = await sharp(trimmed)
    .extractChannel("alpha")
    .blur(46)
    .linear(0.22)
    .toBuffer();
  const glow = await sharp({
    create: {
      width: stoneMeta.width,
      height: stoneMeta.height,
      channels: 3,
      background: accent,
    },
  })
    .joinChannel(glowMask)
    .png()
    .toBuffer();

  const backdrop = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="base" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#010507"/>
          <stop offset="0.52" stop-color="#07110f"/>
          <stop offset="1" stop-color="#020709"/>
        </linearGradient>
        <radialGradient id="halo" cx="77%" cy="48%" r="46%">
          <stop offset="0" stop-color="${accent}" stop-opacity="0.18"/>
          <stop offset="0.54" stop-color="${accent}" stop-opacity="0.045"/>
          <stop offset="1" stop-color="#000000" stop-opacity="0"/>
        </radialGradient>
        <filter id="grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" seed="19"/>
          <feColorMatrix values="0 0 0 0 0.17 0 0 0 0 0.19 0 0 0 0 0.18 0 0 0 0.12 0"/>
        </filter>
        <radialGradient id="shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stop-color="#000000" stop-opacity="0.78"/>
          <stop offset="1" stop-color="#000000" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#base)"/>
      <rect width="100%" height="100%" fill="url(#halo)"/>
      <rect width="100%" height="100%" filter="url(#grain)" opacity="0.22"/>
      <ellipse cx="1510" cy="718" rx="390" ry="72" fill="url(#shadow)"/>
    </svg>
  `);

  return sharp(backdrop)
    .composite([
      { input: glow, left: stoneLeft, top: stoneTop },
      { input: trimmed, left: stoneLeft, top: stoneTop },
    ])
    .png()
    .toBuffer();
}

for (const {
  source,
  roughCutout,
  name,
  position,
  width,
  height,
  mobileWindow,
  padLeft,
  crestPlacement,
} of heroJobs) {
  const input = roughCutout
    ? await composeRoughHero(
        path.join(masters, roughCutout.source),
        roughCutout.accent,
      )
    : crestPlacement
      ? await standCrest(path.join(masters, source), crestPlacement)
      : path.join(masters, source);
  const plate = padLeft ? await padPlateLeft(input, padLeft) : input;
  await exportPair(plate, path.join(heroDir, name), {
    width,
    height,
    fit: "cover",
    position,
    withoutEnlargement: false,
  });
  // A phone hero box is around 0.43:1. Cropping a 2.33:1 plate into that throws
  // away most of the composition, so the mobile plate is not cropped at all: it
  // keeps its own ratio and the stylesheet contains it against the plate's edge
  // colour, which puts the whole group of stones on screen as a band.
  const phonePlate = mobileWindow
    ? await plateWindow(input, mobileWindow)
    : input;
  await exportPair(phonePlate, path.join(heroDir, `${name}-mobile`), {
    width: 1000,
    fit: "inside",
    withoutEnlargement: false,
  });
}

await exportPair(
  path.join(masters, "vault-security-master.png"),
  path.join(sectionDir, "vault-security"),
  { width: 1000, height: 1000, fit: "cover", position: "center" },
);

await exportPair(
  path.join(masters, "lithuania-wide-master.png"),
  path.join(sectionDir, "lithuania-wide"),
  { width: 1800, height: 640, fit: "cover", position: "center" },
);

// The About story card wants a square, and cropping one out of the wide plate
// would cut either the flag or the castle, so the square is generated as its own
// composition rather than carved from the panorama.
await exportPair(
  path.join(masters, "lithuania-square-master.png"),
  path.join(sectionDir, "lithuania-square"),
  { width: 760, height: 760, fit: "cover", position: "center" },
);

await exportPair(
  path.join(masters, "vault-tray-master.png"),
  path.join(sectionDir, "vault-tray"),
  { width: 1700, height: 850, fit: "cover", position: "center" },
);

await exportPair(
  path.join(masters, "blockchain-network-master.png"),
  path.join(sectionDir, "blockchain-network"),
  { width: 1600, height: 900, fit: "cover", position: "center" },
);

// Closing bands for the three Technology detail pages, cut at the same 1200x760
// the Technology band already uses so they all crop identically in the strip.
// The deployment map draws inside a card rather than as a band, so it keeps its
// own 2:1 crop; the band loop below would cut its southern hemisphere off.
await exportPair(
  path.join(masters, "world-map-master.png"),
  path.join(sectionDir, "world-map"),
  { width: 1200, height: 620, fit: "cover", position: "center" },
);

await exportPair(
  path.join(masters, "aqua-map-master.png"),
  path.join(sectionDir, "aqua-map"),
  { width: 1200, height: 620, fit: "cover", position: "center" },
);

for (const band of [
  "tokenization-band",
  "redemption-band",
  "open-vault",
  "gem-report",
  "gem-inspection",
  "emerald-vault",
  "aqua-report",
]) {
  await exportPair(
    path.join(masters, `${band}-master.png`),
    path.join(sectionDir, band),
    { width: 1200, height: 760, fit: "cover", position: "center" },
  );
}

// The About board pairs its capability row with five photographs. Four already
// exist in this library; only the gemological one had to be generated.
await exportPair(
  path.join(masters, "gemological-verification-master.png"),
  path.join(sectionDir, "gemological-verification"),
  { width: 1200, height: 900, fit: "cover", position: "center" },
);

// Plates that ship with their own alpha are only ever sized, never cropped to a
// box, so the transparent margin the generator leaves around them is trimmed
// first — otherwise "contain" fits the empty canvas and the subject shrinks.
async function alphaBox(input) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let left = info.width;
  let right = -1;
  let top = info.height;
  let bottom = -1;
  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      if (data[(y * info.width + x) * info.channels + 3] <= 10) continue;
      if (x < left) left = x;
      if (x > right) right = x;
      if (y < top) top = y;
      if (y > bottom) bottom = y;
    }
  }
  if (right < 0) throw new Error(`${input} is fully transparent.`);
  return { left, top, width: right - left + 1, height: bottom - top + 1 };
}

async function exportCutout(input, outputBase, width, { square = false } = {}) {
  const trimmed = await sharp(input)
    .extract(await alphaBox(input))
    .png()
    .toBuffer();
  // A set of plates that sit side by side is squared off so every one of them
  // reports the same intrinsic ratio; otherwise each card in the row would
  // reserve a different height and the artwork would step up and down.
  const base = sharp(trimmed)
    .resize({
      width,
      height: square ? width : undefined,
      fit: square ? "contain" : "inside",
      position: "center",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: "lanczos3",
    })
    .sharpen({ sigma: 0.6 });
  await Promise.all([
    base
      .clone()
      .webp({ quality: 92, alphaQuality: 100, smartSubsample: true })
      .toFile(`${outputBase}.webp`),
    base.clone().avif({ quality: 70, effort: 7 }).toFile(`${outputBase}.avif`),
  ]);
}

// The safe stands beside the security list at up to about 250 CSS px.
await exportCutout(
  path.join(masters, "security-vault-master.png"),
  path.join(sectionDir, "security-vault"),
  760,
);

// The passport card is the client's own artwork from the asset pack; it draws at
// up to about 210 CSS px beside the on-chain list.
await exportCutout(
  path.join(masters, "asset-passport-master.png"),
  path.join(sectionDir, "asset-passport"),
  660,
);

// Three more of the client's own cut-outs, carried by the Technology detail
// pages: the presentation box the redemption board draws, and the two loose
// stones the tokenization and passport records are written against.
await exportCutout(
  path.join(masters, "ruby-box-master.png"),
  path.join(sectionDir, "ruby-box"),
  620,
);
await exportCutout(
  path.join(masters, "emerald-cut-master.png"),
  path.join(sectionDir, "emerald-cut"),
  560,
);
await exportCutout(
  path.join(masters, "ruby-cushion-master.png"),
  path.join(sectionDir, "ruby-cushion"),
  460,
);

// Supplied rough-stone cut-outs used by the gemstone story cards. They retain
// their alpha and are squared to one intrinsic box so every page can size them
// through the same responsive rule.
for (const name of [
  "peridot-rough",
  "tourmaline-rough",
  "charoite-rough",
  "alexandrite-rough",
  "rough-aquamarine",
  "chrysoprase-rough",
  "italian-jade-rough",
  "jasper-rough",
  "ruby-c-quality-rough",
  "ruby-trapiche-rough",
  "ruby-gem-quality-rough",
  "rutilated-quartz-rough",
  "rough-tourmaline",
  "rough-peridot",
  "rough-emerald",
]) {
  await exportCutout(
    path.join(masters, `${name}-master.png`),
    path.join(gemDir, name),
    620,
    { square: true },
  );
}

// Alexandrite's board pairs the supplied cluster with a daylight and an
// incandescent study. Both are honest color-directed views of the same source
// artwork, not separate stones or asset records.
async function colorStudy(input, channels) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const maximum = Math.max(...channels);
  for (let index = 0; index < data.length; index += info.channels) {
    const luminance =
      data[index] * 0.2126 +
      data[index + 1] * 0.7152 +
      data[index + 2] * 0.0722;
    data[index] = (luminance * channels[0]) / maximum;
    data[index + 1] = (luminance * channels[1]) / maximum;
    data[index + 2] = (luminance * channels[2]) / maximum;
  }
  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: info.channels },
  })
    .png()
    .toBuffer();
}

for (const [name, color] of [
  ["alexandrite-daylight", [121, 164, 91]],
  ["alexandrite-incandescent", [184, 95, 121]],
]) {
  const study = await colorStudy(
    path.join(masters, "alexandrite-rough-master.png"),
    color,
  );
  await exportCutout(study, path.join(gemDir, name), 620, { square: true });
}

// Catalogue stones are cut off their slate backdrop so the cards can show the
// stone itself rather than a small gem floating on a dark plate. The backdrop is
// far darker than any stone (its brightest speckles sit around 34/255, the
// stones run well past 60), so a value threshold separates them; the work after
// that is rejecting the speckles and closing the interior.
const CUTOUT_THRESHOLD = 46;
const CUTOUT_MARGIN = 0.04;
const GEM_EXPORT_SIZE = 480;

// Largest 8-connected blob over the threshold. Anything smaller is backdrop
// glitter, a specular fleck on the slate, or the stone's own reflection.
function largestBlob(values, width, height) {
  const seen = new Uint8Array(width * height);
  const best = new Uint8Array(width * height);
  let bestSize = 0;
  const stack = new Int32Array(width * height);
  for (let start = 0; start < values.length; start += 1) {
    if (seen[start] || !values[start]) continue;
    let top = 0;
    let size = 0;
    const blob = [];
    stack[top++] = start;
    seen[start] = 1;
    while (top > 0) {
      const p = stack[--top];
      blob.push(p);
      size += 1;
      const x = p % width;
      const y = (p / width) | 0;
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const q = ny * width + nx;
          if (seen[q] || !values[q]) continue;
          seen[q] = 1;
          stack[top++] = q;
        }
      }
    }
    if (size > bestSize) {
      bestSize = size;
      best.fill(0);
      for (const p of blob) best[p] = 1;
    }
  }
  return best;
}

// A stone's deepest facets fall under the threshold and punch holes through the
// middle of the blob. Anything not reachable from the border is interior.
function fillHoles(mask, width, height) {
  const outside = new Uint8Array(width * height);
  const stack = [];
  for (let x = 0; x < width; x += 1) {
    stack.push(x, (height - 1) * width + x);
  }
  for (let y = 0; y < height; y += 1) {
    stack.push(y * width, y * width + width - 1);
  }
  while (stack.length > 0) {
    const p = stack.pop();
    if (outside[p] || mask[p]) continue;
    outside[p] = 1;
    const x = p % width;
    const y = (p / width) | 0;
    if (x > 0) stack.push(p - 1);
    if (x < width - 1) stack.push(p + 1);
    if (y > 0) stack.push(p - width);
    if (y < height - 1) stack.push(p + width);
  }
  const filled = new Uint8Array(width * height);
  for (let p = 0; p < filled.length; p += 1)
    filled[p] = mask[p] || !outside[p] ? 1 : 0;
  return filled;
}

async function cutOutGem(source, crop) {
  const { data, info } = await sharp(source)
    .extract(crop)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const above = new Uint8Array(width * height);
  for (let p = 0; p < above.length; p += 1) {
    const i = p * channels;
    const value = Math.max(data[i], data[i + 1], data[i + 2]);
    above[p] = value > CUTOUT_THRESHOLD ? 1 : 0;
  }
  const mask = fillHoles(largestBlob(above, width, height), width, height);

  let left = width;
  let right = -1;
  let top = height;
  let bottom = -1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (!mask[y * width + x]) continue;
      if (x < left) left = x;
      if (x > right) right = x;
      if (y < top) top = y;
      if (y > bottom) bottom = y;
    }
  }
  if (right < 0) throw new Error("No stone found in catalogue cell.");

  // Pull the edge in by a pixel before feathering so the slate behind the stone
  // is not smeared into the semi-transparent rim as a dark halo.
  const alpha = Buffer.alloc(width * height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const p = y * width + x;
      if (!mask[p]) continue;
      const eroded =
        x > 0 &&
        x < width - 1 &&
        y > 0 &&
        y < height - 1 &&
        mask[p - 1] &&
        mask[p + 1] &&
        mask[p - width] &&
        mask[p + width];
      alpha[p] = eroded ? 255 : 150;
    }
  }
  // sharp widens a one-channel raw input back out to RGB on the way out, which
  // would leave joinChannel reading the first third of the buffer as the whole
  // mask. Pinning the colourspace keeps it single-channel.
  const feathered = await sharp(alpha, { raw: { width, height, channels: 1 } })
    .blur(1.1)
    .toColourspace("b-w")
    .raw()
    .toBuffer();
  if (feathered.length !== width * height) {
    throw new Error(
      `Stone mask came back with ${feathered.length} bytes, expected ${width * height}.`,
    );
  }

  // joinChannel appends the mask as the alpha channel; the source is already
  // three-channel here, so it must not be given an alpha channel first.
  const cut = await sharp(data, { raw: { width, height, channels } })
    .joinChannel(feathered, { raw: { width, height, channels: 1 } })
    .png()
    .toBuffer();

  const marginX = Math.round((right - left + 1) * CUTOUT_MARGIN);
  const marginY = Math.round((bottom - top + 1) * CUTOUT_MARGIN);
  return sharp(cut)
    .extract({
      left: Math.max(0, left - marginX),
      top: Math.max(0, top - marginY),
      width: Math.min(
        width - Math.max(0, left - marginX),
        right - left + 1 + marginX * 2,
      ),
      height: Math.min(
        height - Math.max(0, top - marginY),
        bottom - top + 1 + marginY * 2,
      ),
    })
    .png()
    .toBuffer();
}

const catalogSource = path.join(masters, "catalog-gemstones-master.png");
const catalogMetadata = await sharp(catalogSource).metadata();
if (!catalogMetadata.width || !catalogMetadata.height) {
  throw new Error("Catalog master dimensions are unavailable.");
}

const gemNames = [
  "ruby",
  "blue-sapphire",
  "emerald",
  "diamond",
  "pink-sapphire",
  "yellow-sapphire",
  "amethyst",
  "aquamarine",
  "spinel",
  "tsavorite-garnet",
];
const cellWidth = Math.floor(catalogMetadata.width / 5);
const cellHeight = Math.floor(catalogMetadata.height / 2);

for (const [index, name] of gemNames.entries()) {
  const column = index % 5;
  const row = Math.floor(index / 5);
  const left = column * cellWidth;
  const top = row * cellHeight;
  const width = column === 4 ? catalogMetadata.width - left : cellWidth;
  const height = row === 1 ? catalogMetadata.height - top : cellHeight;
  const stone = await cutOutGem(catalogSource, { left, top, width, height });
  const base = sharp(stone)
    .resize({
      width: GEM_EXPORT_SIZE,
      height: GEM_EXPORT_SIZE,
      fit: "contain",
      position: "center",
      kernel: "lanczos3",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .sharpen({ sigma: 0.7 });
  await Promise.all([
    base
      .clone()
      .webp({ quality: 92, alphaQuality: 100, smartSubsample: true })
      .toFile(path.join(gemDir, `${name}.webp`)),
    base
      .clone()
      .avif({ quality: 70, effort: 7 })
      .toFile(path.join(gemDir, `${name}.avif`)),
  ]);
}

// Process-step artwork. Each step has its own generated plate in
// assets/masters/process/, already cut off its backdrop and shipped with an
// alpha channel, so the pipeline only has to size it. The previous artwork was
// sliced out of one 980px-wide sheet, which left each step about 100px of real
// detail and forced a faded rectangle instead of a true cut-out.
const processStepNames = [
  "source",
  "verify",
  "appraise",
  "custody",
  "tokenize",
  "own",
  "trade",
  "redeem",
];
// The plates draw at up to about 116 CSS px, so 400 covers a 3x display.
const PROCESS_EXPORT_SIZE = 400;

async function exportProcessPlate(input, name) {
  const base = sharp(input)
    .resize({
      width: PROCESS_EXPORT_SIZE,
      height: PROCESS_EXPORT_SIZE,
      fit: "contain",
      position: "center",
      kernel: "lanczos3",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .sharpen({ sigma: 0.6 });
  await Promise.all([
    base
      .clone()
      .webp({ quality: 92, alphaQuality: 100, smartSubsample: true })
      .toFile(path.join(processDir, `${name}.webp`)),
    base
      .clone()
      .avif({ quality: 70, effort: 7 })
      .toFile(path.join(processDir, `${name}.avif`)),
  ]);
}

for (const name of processStepNames) {
  const plate = path.join(masters, "process", `${name}.png`);
  const meta = await sharp(plate).metadata();
  if (!meta.hasAlpha) {
    throw new Error(
      `${name}.png has no alpha channel; the step plates must ship cut out.`,
    );
  }
  await exportProcessPlate(plate, name);
}

// How It Works runs nine steps to Home's eight. Its closing "transparency
// always" step has no counterpart among them, so it takes the brand crest,
// which is the mark that stands behind the audit trail anyway.
{
  const crestPlate = sharp(
    path.join(brandDir, "gemreserve-shield-1024.png"),
  ).resize({
    width: PROCESS_EXPORT_SIZE,
    height: PROCESS_EXPORT_SIZE,
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
    kernel: "lanczos3",
  });
  await Promise.all([
    crestPlate
      .clone()
      .webp({ quality: 92, alphaQuality: 100, smartSubsample: true })
      .toFile(path.join(processDir, "transparency.webp")),
    crestPlate
      .clone()
      .avif({ quality: 70, effort: 7 })
      .toFile(path.join(processDir, "transparency.avif")),
  ]);
}

// The Technology closing band carries a server-room photograph behind its copy,
// the way the How It Works band carries the jurisdiction scene. The reference board
// stands the crest in front of the racks, so it is composited in here rather
// than layered in CSS: the band is masked to a soft right edge, and a DOM
// overlay would be cut by that mask at a different point on every screen width.
{
  const bandWidth = 1200;
  const bandHeight = 760;
  const plate = await sharp(
    path.join(masters, "technology-datacenter-master.png"),
  )
    .resize({
      width: bandWidth,
      height: bandHeight,
      fit: "cover",
      position: "center",
    })
    .png()
    .toBuffer();
  // The band draws at roughly 2.35:1 while the plate is 1.58:1, so object-fit
  // crops about a third of the plate's height away. The crest is sized against
  // what survives that crop, not against the whole plate.
  const visibleHeight = bandHeight * (1.58 / 2.35);
  const crestHeight = Math.round(visibleHeight * 0.66);
  const emblem = await sharp(path.join(brandDir, "gemreserve-shield-1024.png"))
    .resize({ height: crestHeight, fit: "inside" })
    .png()
    .toBuffer();
  const emblemMeta = await sharp(emblem).metadata();
  const composed = await sharp(plate)
    .composite([
      {
        input: emblem,
        // Centred at 55% of the band, which keeps the whole crest inside the
        // solid part of the stylesheet's 72% fade at every width.
        left: Math.round(bandWidth * 0.55 - emblemMeta.width / 2),
        top: Math.round((bandHeight - emblemMeta.height) / 2),
      },
    ])
    .png()
    .toBuffer();
  await exportPair(composed, path.join(sectionDir, "technology-datacenter"), {
    width: bandWidth,
    height: bandHeight,
    fit: "cover",
    position: "center",
  });
}

// Platform-architecture plates. Each layer of the pipeline gets the same
// polished-gold cut-out treatment as the process steps, in place of the line
// icons that stood in for them; they draw at up to about 82 CSS px, so 320
// covers a 3x display with room to spare.
const architectureLayerNames = [
  "user-interface",
  "application-layer",
  "business-logic-layer",
  "data-storage-layer",
  "blockchain-layer",
];

for (const name of architectureLayerNames) {
  const plate = path.join(masters, "architecture", `${name}.png`);
  const meta = await sharp(plate).metadata();
  if (!meta.hasAlpha) {
    throw new Error(
      `${name}.png has no alpha channel; the architecture plates must ship cut out.`,
    );
  }
  await exportCutout(plate, path.join(architectureDir, name), 320, {
    square: true,
  });
}

// Step and principle plates for the KYC process, the enterprise process, the
// investor executive overview and the governance principles. These replace the
// line icons those four sections used to carry, in the same polished-gold
// language as the process and architecture plates. They draw at up to about 76
// CSS px, so 300 covers a 3x display, and they are squared off so a row of them
// reserves one height rather than stepping up and down.
const plateNames = [
  "kyc-register",
  "kyc-submit",
  "kyc-verification",
  "kyc-approval",
  "ent-discover",
  "ent-design",
  "ent-comply",
  "ent-tokenize",
  "ent-launch",
  "ent-manage",
  "inv-market",
  "inv-demand",
  "inv-blockchain",
  "inv-generations",
  "gov-integrity",
  "gov-transparency",
  "gov-accountability",
  "gov-fairness",
  "gov-security",
  "gov-longterm",
  "red-request",
  "red-eligibility",
  "red-lock",
  "red-allocate",
  "red-quality",
  "red-package",
  "red-ship",
  // Asset Registry: HOW THE ASSET REGISTRY WORKS.
  "reg-creation",
  "reg-lab",
  "reg-capture",
  "reg-registration",
  "reg-custody",
  "reg-ownership",
  "reg-public",
  // Digital Asset Passports: WHAT IS A DIGITAL ASSET PASSPORT?
  "pass-unique-id",
  "pass-complete-record",
  "pass-blockchain-secured",
  "pass-lifecycle",
  "pass-global-standard",
  // The two stone pages render their plates in their own accent metal rather
  // than gold, so each section keeps the colour it already had.
  "glance-type",
  "glance-colour",
  "glance-origin",
  "glance-hardness",
  "glance-clarity",
  "glance-certification",
  "aq-backed",
  "aq-verified",
  "aq-borderless",
  "aq-vaulted",
  "aq-transparent",
];

for (const name of plateNames) {
  const plate = path.join(masters, "plates", `${name}.png`);
  const meta = await sharp(plate).metadata();
  if (!meta.hasAlpha) {
    throw new Error(
      `${name}.png has no alpha channel; the section plates must ship cut out.`,
    );
  }
  await exportCutout(plate, path.join(plateDir, name), 300, { square: true });
}

// The gallery tiles. Two of the six are the client's own cut-outs and carry
// their own alpha; the four generated cuts are photographs on slate and are
// cropped square instead, so the row reads as one set either way.
const galleryPhotos = ["aqua-oval", "aqua-cushion", "aqua-pear", "aqua-round"];
for (const name of galleryPhotos) {
  await exportPair(
    path.join(masters, "gallery", `${name}.png`),
    path.join(galleryDir, name),
    { width: 620, height: 620, fit: "cover", position: "center" },
  );
}

const galleryCutouts = ["aqua-crystal", "emerald-crystal"];
for (const name of galleryCutouts) {
  const plate = path.join(masters, "gallery", `${name}.png`);
  const meta = await sharp(plate).metadata();
  if (!meta.hasAlpha) {
    throw new Error(
      `${name}.png has no alpha channel; the gallery cut-outs must ship cut out.`,
    );
  }
  await exportCutout(plate, path.join(galleryDir, name), 620, { square: true });
}

console.log(
  "Generated responsive WebP/AVIF images, transparent brand exports, process plates, architecture plates and section plates.",
);
