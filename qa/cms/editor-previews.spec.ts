/**
 * Device-preview evidence. Read-only.
 *
 * The device selector is a dropdown whose items are `menuitemradio`; opening it
 * fresh for each device is more reliable than clicking through one open menu.
 */
import { test } from "@playwright/test";
import fs from "node:fs";

const PASS = fs.readFileSync("/tmp/.grpw", "utf8").trim();
const OUT = "/tmp/gr-shots";

test("PREVIEWS — desktop, tablet, mobile", async ({ page }) => {
  test.setTimeout(10 * 60_000);
  fs.mkdirSync(OUT, { recursive: true });

  await page.goto("/wp-login.php", { waitUntil: "domcontentloaded" });
  await page.fill("#user_login", "gr_marketing");
  await page.fill("#user_pass", PASS);
  await Promise.all([page.waitForURL(/wp-admin/, { timeout: 60_000 }), page.click("#wp-submit")]);

  for (const [n, device] of [["07", "Desktop"], ["08", "Tablet"], ["09", "Mobile"]] as const) {
    await page.goto("/wp-admin/post.php?post=42&action=edit", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(12_000);
    await page.evaluate(() => {
      const w = window as unknown as Record<string, any>;
      try { w.wp?.data?.dispatch("core/preferences")?.set("core/edit-post", "welcomeGuide", false); } catch {}
    });
    await page.getByRole("button", { name: /^Close$/ }).first().click({ timeout: 2_000 }).catch(() => {});
    await page.waitForTimeout(1_200);

    const header = page.locator(".editor-header, .edit-post-header").first();
    await header.getByRole("button", { name: /^View$/ }).first().click({ timeout: 10_000 }).catch(() => {});
    await page.waitForTimeout(1_200);
    const item = page.getByRole("menuitemradio", { name: new RegExp(`^${device}`, "i") }).first();
    const found = await item.isVisible({ timeout: 8_000 }).catch(() => false);
    if (found) await item.click({ timeout: 8_000 }).catch(() => {});
    await page.waitForTimeout(3_000);
    await page.keyboard.press("Escape").catch(() => {});
    await page.waitForTimeout(1_200);
    await page.screenshot({ path: `${OUT}/${n}-preview-${device.toLowerCase()}.png` });
    console.log(`PREVIEW\t${device}\tofferedInMenu=${found}\tcaptured`);
  }
});
