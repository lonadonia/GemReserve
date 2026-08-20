import { mkdir, readFile } from "node:fs/promises";
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

const shieldSvg = await readFile(path.join(brandDir, "gemreserve-shield.svg"));
const horizontalSvg = await readFile(
  path.join(brandDir, "gemreserve-horizontal.svg"),
);

for (const size of [512, 1024]) {
  await sharp(shieldSvg, { density: 600 })
    .resize({ width: size, height: size, fit: "contain" })
    .png({ compressionLevel: 9 })
    .toFile(path.join(brandDir, `gemreserve-shield-${size}.png`));
}

for (const width of [1200, 2400]) {
  await sharp(horizontalSvg, { density: 600 })
    .resize({ width, fit: "inside" })
    .png({ compressionLevel: 9 })
    .toFile(path.join(brandDir, `gemreserve-horizontal-${width}.png`));
}

for (const size of [192, 512]) {
  await sharp(shieldSvg, { density: 600 })
    .resize({ width: size, height: size, fit: "contain" })
    .png({ compressionLevel: 9 })
    .toFile(path.join(brandDir, `app-icon-${size}.png`));
}

console.log(
  "Generated responsive WebP/AVIF images and transparent brand PNGs.",
);
