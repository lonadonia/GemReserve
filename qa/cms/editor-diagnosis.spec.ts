/**
 * Reproduce the blank/broken Gutenberg canvas, with full instrumentation.
 *
 * Logs in through the real WordPress login form as the real marketing account,
 * opens the editor, and records everything a developer would look at by hand:
 * console errors, page errors, failed network requests, whether the canvas
 * iframe exists, how many blocks the editor's own data store holds, and whether
 * any block rendered React's error boundary.
 */
import { test } from "@playwright/test";
import { assertSafeTarget } from "./helpers";

test.beforeAll(() => assertSafeTarget(process.env.CMS_BASE_URL));

const USER = process.env.QA_USER ?? "gr_marketing";
const PASS = process.env.QA_PASS ?? "StagingOnly!2026";

test("DIAG — Contact Us editor as the marketing account", async ({ page }) => {
  test.setTimeout(180_000);

  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const failedRequests: string[] = [];

  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") {
      consoleErrors.push(`[${m.type()}] ${m.text().slice(0, 300)}`);
    }
  });
  page.on("pageerror", (e) => pageErrors.push(String(e).slice(0, 400)));
  page.on("requestfailed", (r) =>
    failedRequests.push(`${r.method()} ${r.url().slice(0, 160)} — ${r.failure()?.errorText}`),
  );
  page.on("response", async (r) => {
    if (r.status() >= 400) {
      failedRequests.push(`HTTP ${r.status()} ${r.request().method()} ${r.url().slice(0, 160)}`);
    }
  });

  // Real login form, real credentials.
  await page.goto("/wp-login.php", { waitUntil: "domcontentloaded" });
  await page.fill("#user_login", USER);
  await page.fill("#user_pass", PASS);
  await Promise.all([page.waitForURL(/wp-admin/, { timeout: 60_000 }), page.click("#wp-submit")]);
  console.log(`DIAG\tlogin\tOK as ${USER}`);

  await page.goto("/wp-admin/post.php?post=42&action=edit", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(15_000); // let Gutenberg boot and settle

  const canvasIframe = await page.locator('iframe[name="editor-canvas"]').count();
  console.log(`DIAG\tcanvas-iframe\t${canvasIframe}`);

  // What does the editor's own data store believe?
  const store = await page.evaluate(() => {
    const w = window as unknown as Record<string, any>;
    if (!w.wp?.data) return { error: "wp.data missing" };
    const ed = w.wp.data.select("core/block-editor");
    const registry = w.wp.data.select("core/blocks");
    const blocks = ed?.getBlocks?.() ?? [];
    const flat = (bs: any[]): any[] => bs.flatMap((b) => [b, ...flat(b.innerBlocks ?? [])]);
    const all = flat(blocks);
    return {
      topLevel: blocks.length,
      total: all.length,
      names: [...new Set(all.map((b) => b.name))],
      invalid: all.filter((b) => b.isValid === false).map((b) => b.name),
      registered: (registry?.getBlockTypes?.() ?? []).map((t: any) => t.name).filter((n: string) => n.startsWith("gemreserve/")),
    };
  });
  console.log(`DIAG\tstore\t${JSON.stringify(store)}`);

  // Does the canvas actually show anything?
  const frame = page.frameLocator('iframe[name="editor-canvas"]');
  const inCanvas = await frame.locator(".gr-section").count().catch(() => -1);
  const anyBlock = await frame.locator("[data-block]").count().catch(() => -1);
  const errorBoundary = await page.locator("text=/block has encountered an error|cannot be previewed|Attempt Block Recovery/i").count();
  console.log(`DIAG\tcanvas\tgr-section=${inCanvas} data-block=${anyBlock} errorBoundary=${errorBoundary}`);

  const bodyText = (await page.locator("body").innerText().catch(() => "")).slice(0, 600);
  console.log(`DIAG\tbody-excerpt\t${bodyText.replace(/\s+/g, " ").slice(0, 400)}`);

  for (const e of pageErrors.slice(0, 10)) console.log(`DIAG\tpageerror\t${e}`);
  for (const e of consoleErrors.slice(0, 15)) console.log(`DIAG\tconsole\t${e}`);
  for (const e of failedRequests.slice(0, 15)) console.log(`DIAG\tnetwork\t${e}`);
  console.log(`DIAG\ttotals\tpageErrors=${pageErrors.length} consoleErrors=${consoleErrors.length} failedRequests=${failedRequests.length}`);

  // Is the canvas genuinely showing the page, or an error placeholder?
  const canvasText = await frame.locator("body").innerText().catch(() => "");
  console.log(`DIAG\tcanvas-text-len\t${canvasText.length}`);
  console.log(`DIAG\tcanvas-excerpt\t${canvasText.replace(/\s+/g, " ").slice(0, 300)}`);

  // Do the words on the public page appear in the editor canvas?
  const pub = await page.request.get("/contact/");
  const pubHtml = await pub.text();
  const marker = /GET IN TOUCH|SEND US A MESSAGE|OUR GLOBAL OFFICES/g;
  const inPublic = [...pubHtml.matchAll(marker)].length;
  const inCanvasText = [...canvasText.toUpperCase().matchAll(marker)].length;
  console.log(`DIAG\tcontent-match\tpublic=${inPublic} canvas=${inCanvasText}`);

  await page.screenshot({ path: "/tmp/diag-contact-editor.png", fullPage: false });
});
