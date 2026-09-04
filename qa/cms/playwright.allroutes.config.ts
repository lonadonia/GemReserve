import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: ".", testMatch: /editor-all-routes\.spec\.ts$/,
  fullyParallel: false, workers: 1, timeout: 30 * 60_000,
  expect: { timeout: 30_000 }, retries: 0, reporter: [["list"]],
  outputDir: "results/prod",
  use: { baseURL: process.env.PROD_BASE_URL ?? "https://www.gemreserve.io",
         channel: process.env.QA_CHANNEL ?? "chromium",
         viewport: { width: 1440, height: 900 }, screenshot: "only-on-failure", trace: "off" },
});
