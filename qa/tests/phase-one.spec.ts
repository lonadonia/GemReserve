import { expect, test, type Page } from "@playwright/test";
import path from "node:path";

const routes = [
  { name: "home", path: "/" },
  { name: "how-it-works", path: "/how-it-works" },
  { name: "assets", path: "/assets" },
  { name: "technology", path: "/technology" },
  { name: "enterprise", path: "/enterprise" },
  { name: "investors", path: "/investors" },
] as const;

const requiredViewports = [
  { name: "phone-360", width: 360, height: 800 },
  { name: "phone-390", width: 390, height: 844 },
  { name: "phone-430", width: 430, height: 932 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "tablet-1024", width: 1024, height: 1366 },
  { name: "desktop-1280", width: 1280, height: 800 },
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "desktop-1920", width: 1920, height: 1080 },
] as const;

async function preparePage(page: Page, route: string, loadAllImages = true) {
  const consoleErrors: string[] = [];
  const failedRequests: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("requestfailed", (request) => {
    failedRequests.push(`${request.method()} ${request.url()}`);
  });

  await page.goto(route, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  if (loadAllImages) {
    const visibleImages = page.locator("img:visible");
    const visibleImageCount = await visibleImages.count();
    for (let index = 0; index < visibleImageCount; index += 1) {
      await visibleImages.nth(index).scrollIntoViewIfNeeded();
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForLoadState("networkidle");
    await page.waitForFunction(() =>
      [...document.images]
        .filter((image) => {
          const bounds = image.getBoundingClientRect();
          return bounds.width > 0 && bounds.height > 0;
        })
        .every((image) => image.complete && image.naturalWidth > 0),
    );
  }

  await expect(page.locator("h1")).toHaveCount(1);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
  expect(consoleErrors).toEqual([]);
  expect(failedRequests).toEqual([]);
}

test.describe("phase-one visual captures", () => {
  for (const route of routes) {
    test(`${route.name} desktop 1440`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await preparePage(page, route.path);
      await page.screenshot({
        path: path.join("qa", "screenshots", `${route.name}-desktop-1440.png`),
        fullPage: true,
        animations: "disabled",
      });
    });

    test(`${route.name} mobile 390`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await preparePage(page, route.path);
      await page.screenshot({
        path: path.join("qa", "screenshots", `${route.name}-mobile-390.png`),
        fullPage: true,
        animations: "disabled",
      });
    });
  }

  test("home tablet 768", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await preparePage(page, "/");
    await page.screenshot({
      path: path.join("qa", "screenshots", "home-tablet-768.png"),
      fullPage: true,
      animations: "disabled",
    });
  });
});

test.describe("required responsive matrix", () => {
  for (const viewport of requiredViewports) {
    for (const route of routes) {
      test(`${route.name} at ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await preparePage(page, route.path, false);
      });
    }
  }
});

test.describe("phase-one interactions", () => {
  test("primary content remains visible without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
    await expect(page.locator(".motion-reveal").first()).toHaveCSS("opacity", "1");
    await expect(page.locator("h1")).toBeVisible();
    await context.close();
  });

  test("mobile navigation traps focus and closes", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "networkidle" });
    const trigger = page.getByRole("button", { name: "Open navigation" });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Mobile navigation" });
    await expect(dialog).toBeVisible();
    await expect(page.getByRole("button", { name: "Close navigation" }).last()).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });

  test("desktop dropdown supports keyboard entry and escape", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
    const trigger = page.getByRole("button", { name: /Platform/ });
    await trigger.focus();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("link", { name: "Overview", exact: true })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("waitlist validates and reports preview success", async ({ page }) => {
    await page.goto("/#waitlist", { waitUntil: "networkidle" });
    const form = page.locator("#waitlist form");
    await form.getByRole("button", { name: "Join Waitlist" }).click();
    await expect(page.getByText("Enter a valid email address.")).toBeVisible();
    await form.getByLabel("Email address").fill("preview@example.com");
    await form.getByRole("button", { name: "Join Waitlist" }).click();
    const success = page.getByRole("status");
    await expect(success).toContainText("You’re on the preview list.");
    await expect(success).toBeFocused();
    await success.getByRole("button", { name: "Add another email" }).click();
    await expect(form.getByLabel("Email address")).toBeFocused();
  });

  test("asset filters and sorting work", async ({ page }) => {
    await page.goto("/assets", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /Ruby/ }).click();
    await expect(page.locator(".gemstone-card")).toHaveCount(1);
    await expect(page.locator(".gemstone-card-title")).toHaveText("Ruby");
    await page.getByLabel("Sort by:").selectOption("price-desc");
    await page.getByRole("button", { name: /All Gemstones/ }).click();
    await expect(page.locator(".gemstone-card")).toHaveCount(10);
    await expect(page.locator(".gemstone-card-title").first()).toHaveText("Diamond");
  });
});
