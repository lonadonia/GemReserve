/**
 * Open every published page in the real editor, as the real marketing account,
 * and fail if any one of them is blank, crashed, or shows nothing of the page.
 *
 * This is the test that should have existed from the start. Every earlier suite
 * asserted that a change it made arrived; none asserted that the editor was
 * usable in the first place, which is why a completely blank canvas passed
 * sixteen browser tests.
 *
 * Read-only: it opens editors and reads them. Nothing is saved.
 */
import { test, expect } from "@playwright/test";
import fs from "node:fs";

const PASS = fs.readFileSync("/tmp/.grpw", "utf8").trim();
const IDS = fs.readFileSync("/tmp/gr-all-ids.txt", "utf8").trim().split("\n").map((s) => parseInt(s, 10));

test("ALL — every published route opens a working editor as gr_marketing", async ({ page }) => {
  test.setTimeout(30 * 60_000);

  const pageErrors: string[] = [];
  page.on("pageerror", (e) => pageErrors.push(String(e).slice(0, 200)));

  await page.goto("/wp-login.php", { waitUntil: "domcontentloaded" });
  await page.fill("#user_login", "gr_marketing");
  await page.fill("#user_pass", PASS);
  await Promise.all([page.waitForURL(/wp-admin/, { timeout: 60_000 }), page.click("#wp-submit")]);
  await page.evaluate(() => {
    const w = window as unknown as Record<string, any>;
    try { w.wp?.data?.dispatch("core/preferences")?.set("core/edit-post", "welcomeGuide", false); } catch {}
  });

  const bad: string[] = [];
  let checked = 0;

  for (const id of IDS) {
    const before = pageErrors.length;
    await page.goto(`/wp-admin/post.php?post=${id}&action=edit`, { waitUntil: "domcontentloaded" });

    // Wait for the editor to settle rather than a fixed sleep.
    await page
      .waitForFunction(() => {
        const w = window as unknown as Record<string, any>;
        const ed = w.wp?.data?.select("core/block-editor");
        return !!ed && (ed.getBlocks?.() ?? []).length >= 0 && !w.wp?.data?.select("core/editor")?.isEditedPostDirty?.();
      }, { timeout: 60_000 })
      .catch(() => {});
    await page.waitForTimeout(3_500);

    const info = await page.evaluate(() => {
      const w = window as unknown as Record<string, any>;
      const ed = w.wp?.data?.select("core/block-editor");
      const bs = ed?.getBlocks?.() ?? [];
      const flat = (x: any[]): any[] => x.flatMap((b) => [b, ...flat(b.innerBlocks ?? [])]);
      const all = flat(bs);
      return {
        title: w.wp?.data?.select("core/editor")?.getEditedPostAttribute?.("title") ?? "",
        top: bs.length,
        total: all.length,
        invalid: all.filter((b) => b.isValid === false).length,
      };
    });

    const frame = page.frameLocator('iframe[name="editor-canvas"]');
    const canvasChars = (await frame.locator("body").innerText().catch(() => "")).length;
    const broken = await page
      .locator("text=/block has encountered an error|Attempt Block Recovery|This content is blocked/i")
      .count()
      .catch(() => 0);
    const newErrors = pageErrors.length - before;

    // A page with no stored blocks legitimately has an empty canvas — two
    // gemstones are rendered entirely from structured fields. Everything with
    // blocks must show them.
    const expectsContent = info.total > 0;
    const ok =
      broken === 0 &&
      newErrors === 0 &&
      info.invalid === 0 &&
      (!expectsContent || canvasChars > 20);

    if (!ok) {
      bad.push(`id=${id} "${info.title}" blocks=${info.total} invalid=${info.invalid} canvas=${canvasChars} broken=${broken} pageErrors=${newErrors}`);
    }
    checked++;
    console.log(`ROUTE\t${id}\t${info.title.slice(0, 40)}\tblocks=${info.total}\tcanvas=${canvasChars}\tbroken=${broken}\terr=${newErrors}\t${ok ? "OK" : "FAIL"}`);
  }

  console.log(`ALLROUTES\tchecked=${checked}\tfailures=${bad.length}`);
  for (const b of bad) console.log(`ALLROUTES\tBAD\t${b}`);
  expect(bad, `every route must open a working editor:\n${bad.join("\n")}`).toEqual([]);
});
