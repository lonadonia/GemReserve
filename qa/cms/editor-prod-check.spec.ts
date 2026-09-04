/**
 * Read-only check of the REAL production editor as the real marketing account.
 *
 * Deliberately outside the acceptance suite and its localhost guard: this one
 * must run against production, so it is built to change nothing. It logs in,
 * opens an editor, reads what is on screen, and screenshots it. No save, no
 * publish, no content written.
 */
import { test } from "@playwright/test";
import fs from "node:fs";

const USER = "gr_marketing";
const PASS = fs.readFileSync("/tmp/.grpw", "utf8").trim();

test("PROD — the editor as gr_marketing", async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const failed: string[] = [];
  page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text().slice(0, 200)); });
  page.on("pageerror", (e) => pageErrors.push(String(e).slice(0, 300)));
  page.on("response", (r) => { if (r.status() >= 400) failed.push(`HTTP ${r.status()} ${r.url().split("?")[0].slice(-70)}`); });

  // Dismiss WordPress's welcome guide once, so screenshots show the editor and
  // not a modal. It is a per-user preference, set through the editor's own store.
  await page.goto("/wp-admin/", { waitUntil: "domcontentloaded" }).catch(() => {});
  await page.goto("/wp-login.php", { waitUntil: "domcontentloaded" });
  await page.fill("#user_login", USER);
  await page.fill("#user_pass", PASS);
  await Promise.all([page.waitForURL(/wp-admin/, { timeout: 60_000 }), page.click("#wp-submit")]);
  console.log("PROD\tlogin\tOK");

  for (const [label, id] of [["contact", 42], ["home", 4], ["governance", 41], ["aquamarine", 11]] as const) {
    await page.goto(`/wp-admin/post.php?post=${id}&action=edit`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(12_000);
    // Close the welcome guide if it is showing.
    await page.evaluate(() => {
      const w = window as unknown as Record<string, any>;
      try { w.wp?.data?.dispatch("core/preferences")?.set("core/edit-post", "welcomeGuide", false); } catch {}
    });
    await page.getByRole("button", { name: /^Close$/ }).first().click({ timeout: 3_000 }).catch(() => {});
    await page.waitForTimeout(2_500);

    const store = await page.evaluate(() => {
      const w = window as unknown as Record<string, any>;
      const ed = w.wp?.data?.select("core/block-editor");
      const bs = ed?.getBlocks?.() ?? [];
      const flat = (x: any[]): any[] => x.flatMap((b) => [b, ...flat(b.innerBlocks ?? [])]);
      const all = flat(bs);
      return { top: bs.length, total: all.length, invalid: all.filter((b) => b.isValid === false).length };
    });
    const frame = page.frameLocator('iframe[name="editor-canvas"]');
    const canvasText = await frame.locator("body").innerText().catch(() => "");
    const sections = await frame.locator(".gr-section").count().catch(() => -1);
    const broken = await page.locator("text=/block has encountered an error|Attempt Block Recovery|cannot be previewed/i").count();

    console.log(`PROD\t${label}\tblocks=${store.total} top=${store.top} invalid=${store.invalid} sections=${sections} canvasChars=${canvasText.length} brokenBlocks=${broken}`);
    await page.screenshot({ path: `/tmp/prod-editor-${label}.png` });
  }

  console.log(`PROD\terrors\tpageErrors=${pageErrors.length} consoleErrors=${consoleErrors.length} failedRequests=${failed.length}`);
  for (const e of pageErrors.slice(0, 5)) console.log(`PROD\tpageerror\t${e}`);
  for (const e of consoleErrors.slice(0, 8)) console.log(`PROD\tconsole\t${e}`);
  for (const e of [...new Set(failed)].slice(0, 8)) console.log(`PROD\tnetwork\t${e}`);
});
