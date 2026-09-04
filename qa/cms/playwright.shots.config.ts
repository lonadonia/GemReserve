import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: ".", testMatch: /editor-screenshots\.spec\.ts$/,
  workers: 1, timeout: 20 * 60_000, retries: 0, reporter: [["list"]],
  outputDir: "results/prod",
  use: { baseURL: process.env.PROD_BASE_URL ?? "https://www.gemreserve.io",
         channel: "chromium", viewport: { width: 1440, height: 900 },
         screenshot: "off", trace: "off" },
});
