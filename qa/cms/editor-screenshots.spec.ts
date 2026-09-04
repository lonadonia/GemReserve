/**
 * Evidence screenshots of the real production editor, as the real marketing
 * account. Read-only: opens editors, opens panels, captures. Saves nothing.
 */
import { test } from "@playwright/test";
import fs from "node:fs";

const PASS = fs.readFileSync("/tmp/.grpw", "utf8").trim();
const OUT = "/tmp/gr-shots";

test("SHOTS — production editor evidence", async ({ page }) => {
  test.setTimeout(20 * 60_000);
  fs.mkdirSync(OUT, { recursive: true });

  await page.goto("/wp-login.php", { waitUntil: "domcontentloaded" });
  await page.fill("#user_login", "gr_marketing");
  await page.fill("#user_pass", PASS);
  await Promise.all([page.waitForURL(/wp-admin/, { timeout: 60_000 }), page.click("#wp-submit")]);
  await page.evaluate(() => {
    const w = window as unknown as Record<string, any>;
    try { w.wp?.data?.dispatch("core/preferences")?.set("core/edit-post", "welcomeGuide", false); } catch {}
  });

  const open = async (id: number) => {
    await page.goto(`/wp-admin/post.php?post=${id}&action=edit`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(13_000);
    await page.getByRole("button", { name: /^Close$/ }).first().click({ timeout: 2_500 }).catch(() => {});
    await page.waitForTimeout(1_500);
  };

  // 1–5: the required page families.
  for (const [name, id] of [
    ["01-contact", 42], ["02-home", 4], ["03-cards-governance", 41],
    ["04-newer-learn", 386], ["05-gemstone-aquamarine", 11],
  ] as const) {
    await open(id);
    await page.screenshot({ path: `${OUT}/${name}.png` });
    console.log(`SHOT\t${name}\tcaptured`);
  }

  // 6: block inserter with the GemReserve patterns.
  await open(42);
  await page.getByRole("button", { name: /Block Inserter|Toggle block inserter/i }).first().click().catch(() => {});
  await page.waitForTimeout(2_000);
  await page.getByRole("tab", { name: /Patterns/i }).first().click().catch(() => {});
  await page.waitForTimeout(2_500);
  await page.screenshot({ path: `${OUT}/06-inserter-patterns.png` });
  console.log("SHOT\t06-inserter-patterns\tcaptured");
  await page.keyboard.press("Escape");

  // 7–9: device previews.
  for (const device of ["Desktop", "Tablet", "Mobile"] as const) {
    const header = page.locator(".editor-header, .edit-post-header").first();
    await header.getByRole("button", { name: /^View$/ }).first().click().catch(() => {});
    await page.waitForTimeout(900);
    await page.getByRole("menuitemradio", { name: new RegExp(`^${device}`, "i") }).click().catch(() => {});
    await page.waitForTimeout(2_500);
    await page.screenshot({ path: `${OUT}/0${device === "Desktop" ? 7 : device === "Tablet" ? 8 : 9}-preview-${device.toLowerCase()}.png` });
    console.log(`SHOT\tpreview-${device}\tcaptured`);
  }

  // 10: the List View — sections as a manageable list.
  await open(41);
  await page.getByRole("button", { name: /Document Overview/i }).first().click().catch(() => {});
  await page.waitForTimeout(2_000);
  await page.screenshot({ path: `${OUT}/10-list-view-sections.png` });
  console.log("SHOT\t10-list-view\tcaptured");
});
