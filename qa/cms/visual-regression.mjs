/**
 * Visual regression across every public route.
 *
 * Captures each of the 58 routes at four widths, before and after a change,
 * and reports where the rendered pixels differ.
 *
 * On the comparison: this reports **the proportion of differing pixels** rather
 * than a pass/fail verdict on a single threshold. A threshold picked in advance
 * either hides a real regression or drowns the report in noise from an
 * animation frame, and neither is useful to someone deciding whether a
 * deployment is safe. The number is reported per route so a human can see that
 * fifty-seven routes are at 0.00% and one is at 4%, which is a far more useful
 * signal than "1 route failed".
 *
 * Motion is disabled for the capture (`reducedMotion: "reduce"`), because this
 * design animates sections in on scroll and comparing two runs of an animation
 * measures timing, not layout.
 *
 * Usage:
 *   node qa/cms/visual-regression.mjs capture <base-url> <routes-file> <out-dir>
 *   node qa/cms/visual-regression.mjs compare <before-dir> <after-dir>
 */

import { chromium } from "@playwright/test";
import { mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
// sharp is already a devDependency of this project (it processes the site's
// image assets). Decoding the screenshots with it avoids adding a PNG library
// to compare two PNGs.
import sharp from "sharp";

const VIEWPORTS = [
  { name: "1440", width: 1440, height: 900 },
  { name: "1024", width: 1024, height: 768 },
  { name: "768", width: 768, height: 1024 },
  { name: "390", width: 390, height: 844 },
];

function routeName(route) {
  const trimmed = route.replace(/^\/|\/$/g, "");
  return trimmed === "" ? "__home" : trimmed.replace(/\//g, "_");
}

async function capture(baseUrl, routesFile, outDir) {
  const routes = readFileSync(routesFile, "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  const failures = [];
  let taken = 0;

  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      reducedMotion: "reduce",
      colorScheme: "dark",
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    for (const route of routes) {
      const file = join(outDir, `${routeName(route)}-${viewport.name}.png`);
      try {
        const response = await page.goto(`${baseUrl}${route}`, {
          waitUntil: "networkidle",
          timeout: 45_000,
        });
        if (!response || response.status() !== 200) {
          failures.push(`${route} @${viewport.name}: HTTP ${response?.status() ?? "none"}`);
          continue;
        }
        // The design reveals sections on scroll. Without this the fold is the
        // only thing that ever renders, and a full-page screenshot is mostly
        // un-revealed content.
        await page.evaluate(async () => {
          await new Promise((resolve) => {
            let y = 0;
            const step = () => {
              window.scrollTo(0, y);
              y += window.innerHeight;
              if (y < document.body.scrollHeight) {
                requestAnimationFrame(step);
              } else {
                window.scrollTo(0, 0);
                setTimeout(resolve, 300);
              }
            };
            step();
          });
        });
        await page.screenshot({ path: file, fullPage: true, animations: "disabled" });
        taken += 1;
      } catch (error) {
        failures.push(`${route} @${viewport.name}: ${error.message.slice(0, 90)}`);
      }
    }

    await context.close();
  }

  await browser.close();

  console.log(`captured ${taken} screenshots into ${outDir}`);
  if (failures.length) {
    console.log(`failures (${failures.length}):`);
    failures.slice(0, 20).forEach((f) => console.log(`  ${f}`));
  }
  return failures.length === 0;
}

async function decode(path) {
  const { data, info } = await sharp(path)
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height, channels: info.channels };
}

/** Proportion of pixels that differ, allowing for tiny per-channel noise. */
function difference(a, b) {
  if (a.width !== b.width || a.height !== b.height) {
    return { differing: 1, note: `size ${a.width}x${a.height} vs ${b.width}x${b.height}` };
  }
  const step = a.channels;
  let differing = 0;
  for (let i = 0; i < a.data.length; i += step) {
    // A tolerance of 8/255 per channel absorbs decoder rounding without hiding
    // anything a person could see.
    if (
      Math.abs(a.data[i] - b.data[i]) > 8 ||
      Math.abs(a.data[i + 1] - b.data[i + 1]) > 8 ||
      Math.abs(a.data[i + 2] - b.data[i + 2]) > 8
    ) {
      differing += 1;
    }
  }
  return { differing: differing / (a.width * a.height), note: "" };
}

async function compare(beforeDir, afterDir) {
  const files = readdirSync(beforeDir).filter((f) => f.endsWith(".png")).sort();
  const rows = [];
  let missing = 0;

  for (const file of files) {
    const afterPath = join(afterDir, file);
    if (!existsSync(afterPath)) {
      missing += 1;
      rows.push({ file, percent: null, note: "missing after" });
      continue;
    }
    const a = await decode(join(beforeDir, file));
    const b = await decode(afterPath);
    const { differing, note } = difference(a, b);
    rows.push({ file, percent: differing * 100, note });
  }

  rows.sort((x, y) => (y.percent ?? 101) - (x.percent ?? 101));

  const identical = rows.filter((r) => r.percent === 0).length;
  console.log(`compared ${rows.length} screenshots`);
  console.log(`pixel-identical: ${identical}`);
  console.log(`differing:       ${rows.length - identical - missing}`);
  console.log(`missing:         ${missing}`);

  const changed = rows.filter((r) => r.percent !== 0);
  if (changed.length) {
    console.log("\nlargest differences:");
    changed.slice(0, 25).forEach((r) => {
      console.log(
        `  ${r.percent === null ? "  n/a" : r.percent.toFixed(3).padStart(7)}%  ${r.file}${r.note ? "  (" + r.note + ")" : ""}`,
      );
    });
  }

  writeFileSync(
    join(afterDir, "comparison.json"),
    JSON.stringify({ identical, total: rows.length, rows }, null, 2),
  );

  return changed.length === 0;
}

const [mode, ...args] = process.argv.slice(2);
if (mode === "capture") {
  const ok = await capture(args[0], args[1], args[2]);
  process.exit(ok ? 0 : 1);
} else if (mode === "compare") {
  const ok = await compare(args[0], args[1]);
  process.exit(ok ? 0 : 1);
} else {
  console.error("usage: visual-regression.mjs capture <base-url> <routes-file> <out-dir>");
  console.error("       visual-regression.mjs compare <before-dir> <after-dir>");
  process.exit(2);
}
