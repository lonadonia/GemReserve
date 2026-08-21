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

await Promise.all(
  [heroDir, sectionDir, gemDir, brandDir, processDir].map((directory) =>
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
];

// Extend a plate leftwards using the mean colour of its own left edge, so the
// subject clears the copy column without cropping any of it away.
async function padPlateLeft(input, fraction) {
  const meta = await sharp(input).metadata();
  const pad = Math.round(meta.width * fraction);
  const strip = await sharp(input)
    .extract({ left: 0, top: 0, width: 60, height: meta.height })
    .stats();
  const [r, g, b] = strip.channels.slice(0, 3).map((c) => Math.round(c.mean));
  return sharp(input)
    .extend({ left: pad, background: { r, g, b, alpha: 1 } })
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

for (const {
  source,
  name,
  position,
  width,
  height,
  mobileWindow,
  padLeft,
} of heroJobs) {
  const input = path.join(masters, source);
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

console.log(
  "Generated responsive WebP/AVIF images, transparent brand exports and process plates.",
);
