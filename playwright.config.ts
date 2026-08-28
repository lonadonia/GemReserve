import { defineConfig } from "@playwright/test";

// The suite drives a production build of *this* checkout. On a host that is also
// serving a release on 3000 — which the deployment in docs/DEPLOYMENT.md is —
// `reuseExistingServer` would silently point every assertion at the deployed
// site instead of the working tree. Setting QA_PORT moves the run to its own
// port so the two cannot be confused.
const port = Number(process.env.QA_PORT ?? 3000);
const baseURL = `http://127.0.0.1:${port}`;

// The suite is authored against Google Chrome and stays there by default so the
// screenshots keep one renderer. A host without Chrome installed — a headless
// server, where `playwright install chrome` needs root — sets QA_CHANNEL to
// "chromium" and runs against Playwright's own build instead.
const channel = process.env.QA_CHANNEL ?? "chrome";

export default defineConfig({
  testDir: "./qa/tests",
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  timeout: 60_000,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL,
    channel,
    colorScheme: "dark",
    contextOptions: {
      reducedMotion: "reduce",
    },
    trace: "retain-on-failure",
  },
  webServer: {
    command: `npm run start -- --port ${port}`,
    url: baseURL,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
