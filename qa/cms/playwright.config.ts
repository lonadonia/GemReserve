import { defineConfig } from "@playwright/test";

/**
 * Client acceptance tests for the visual CMS.
 *
 * These drive the real WordPress admin in a real browser as the real marketing
 * roles. That is the point: the client's eleven requirements are all of the form
 * "a non-technical marketing user must be able to…", and the only honest way to
 * evidence that is to have a browser do it through the same interface they will
 * use — not to call PHP functions that the interface happens to sit on top of.
 *
 * The suite is separate from the site's own Playwright config because it points
 * at WordPress rather than at the Next.js build, and because it must never run
 * against production: it creates, edits and deletes content. `CMS_BASE_URL` has
 * no default for that reason, and `qa/cms/acceptance.spec.ts` refuses to start
 * against a non-local host.
 *
 * Chromium rather than Chrome: this host has no Chrome installation, and
 * `playwright install chrome` needs root.
 */

const baseURL = process.env.CMS_BASE_URL;

if (!baseURL) {
  throw new Error(
    "CMS_BASE_URL is not set. Point it at an isolated staging WordPress, never production. " +
      "Example: CMS_BASE_URL=http://127.0.0.1:8899",
  );
}

export default defineConfig({
  testDir: ".",
  testMatch: /acceptance\.spec\.ts$/,
  fullyParallel: false,
  workers: 1,
  // Gutenberg is a large application and the first load compiles a lot of
  // JavaScript. A short timeout here produces flakes that look like failures.
  timeout: 120_000,
  expect: { timeout: 20_000 },
  forbidOnly: true,
  retries: 0,
  reporter: [["list"], ["json", { outputFile: "results/acceptance.json" }]],
  outputDir: "results/artifacts",
  use: {
    baseURL,
    channel: process.env.QA_CHANNEL ?? "chromium",
    viewport: { width: 1440, height: 900 },
    screenshot: "only-on-failure",
    video: "off",
    trace: "retain-on-failure",
    actionTimeout: 20_000,
  },
});
