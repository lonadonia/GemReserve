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

await Promise.all(
  [heroDir, sectionDir, gemDir, brandDir].map((directory) =>
    mkdir(directory, { recursive: true }),
  ),
);

async function exportPair(input, outputBase, resize, options = {}) {
  const pipeline = sharp(input).resize(resize);
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

const heroJobs = [
  ["home-hero-master.png", "home-hero", "right"],
  ["how-hero-master.png", "how-hero", "center"],
  ["assets-hero-master.png", "assets-hero", "center"],
];

for (const [source, name, position] of heroJobs) {
  const input = path.join(masters, source);
  await exportPair(input, path.join(heroDir, name), {
    width: 1920,
    height: 1080,
    fit: "cover",
    position,
    withoutEnlargement: false,
  });
  await exportPair(input, path.join(heroDir, `${name}-mobile`), {
    width: 900,
    height: 1100,
    fit: "cover",
    position,
    withoutEnlargement: false,
  });
}

await exportPair(
  path.join(masters, "vault-security-master.png"),
  path.join(sectionDir, "vault-security"),
  { width: 1000, height: 1000, fit: "cover", position: "center" },
);

await exportPair(
  path.join(masters, "swiss-matterhorn-master.png"),
  path.join(sectionDir, "swiss-matterhorn"),
  { width: 1800, height: 640, fit: "cover", position: "center" },
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
  const crop = { left, top, width, height };
  const base = sharp(catalogSource)
    .extract(crop)
    .resize({
      width: 720,
      height: 500,
      fit: "contain",
      position: "center",
      background: { r: 3, g: 8, b: 11 },
    });
  await Promise.all([
    base
      .clone()
      .webp({ quality: 88, smartSubsample: true })
      .toFile(path.join(gemDir, `${name}.webp`)),
    base
      .clone()
      .avif({ quality: 64, effort: 7 })
      .toFile(path.join(gemDir, `${name}.avif`)),
  ]);
}

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

console.log(
  "Generated responsive WebP/AVIF images and transparent brand exports.",
);
