import { defineConfig } from "@playwright/test";

/**
 * Read-only production check.
 *
 * Deliberately separate from `playwright.config.ts`, which refuses any host
 * that is not localhost because the acceptance suite creates, edits and deletes
 * content. This config points at production on purpose, and the only spec it
 * matches is one that writes nothing: it logs in, reads the editor, and takes
 * screenshots.
 */
export default defineConfig({
  testDir: ".",
  testMatch: /editor-prod-check\.spec\.ts$/,
  fullyParallel: false,
  workers: 1,
  timeout: 180_000,
  expect: { timeout: 30_000 },
  retries: 0,
  reporter: [["list"]],
  outputDir: "results/prod",
  use: {
    baseURL: process.env.PROD_BASE_URL ?? "https://www.gemreserve.io",
    channel: process.env.QA_CHANNEL ?? "chromium",
    viewport: { width: 1440, height: 900 },
    screenshot: "only-on-failure",
    trace: "off",
  },
});
