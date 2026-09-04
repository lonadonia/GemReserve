/**
 * A hands-on audit of what the WordPress admin actually offers a restricted
 * marketing user. Not assertions about intent — a walk through the real screens,
 * reporting what is present and what is absent.
 *
 * Everything runs as `gr_marketing_publisher`. An audit performed with
 * administrator rights would describe a different product.
 */
import { test, expect, type Page } from "@playwright/test";
import { assertSafeTarget, canvas, login, openEditor } from "./helpers";

test.beforeAll(() => assertSafeTarget(process.env.CMS_BASE_URL));

const PAGE_ID = 41;      // /governance/  — migrated blocks
const GEM_ID = 11;       // /aquamarine/  — migrated gemstone
const CLASSIC_ID = 386;  // /what-are-tokenized-gemstones/ — imported HTML

async function report(page: Page, label: string, found: boolean, detail = "") {
  // eslint-disable-next-line no-console
  console.log(`AUDIT\t${label}\t${found ? "PRESENT" : "ABSENT"}\t${detail}`);
}

test("UI audit — what a Marketing Publisher can actually reach", async ({ page }) => {
  test.setTimeout(240_000);
  await login(page, "publisher");

  /* ---- admin menus visible to the role ---- */
  await page.goto("/wp-admin/", { waitUntil: "domcontentloaded" });
  const menu = await page.locator("#adminmenu").innerText().catch(() => "");
  for (const m of ["Pages", "Media", "Gemstones", "Appearance", "GemReserve"]) {
    await report(page, `menu:${m}`, menu.includes(m));
  }
  for (const m of ["Plugins", "Users"]) {
    await report(page, `menu-forbidden:${m}`, menu.includes(m), "should be ABSENT");
  }
  // Settings and Tools may legitimately appear with a single harmless entry
  // (a plugin adding its own screen), so record exactly which links are
  // offered rather than reporting the top-level label.
  for (const top of ["Settings", "Tools"]) {
    const links = await page
      .locator(`#adminmenu li:has(> a:text-is("${top}")) ul li a`)
      .allInnerTexts()
      .catch(() => [] as string[]);
    await report(page, `menu:${top}-entries`, links.length > 0, links.join(" | ") || "(none)");
  }

  /* ---- 9. duplicate a page: is any row action offered? ---- */
  await page.goto("/wp-admin/edit.php?post_type=page", { waitUntil: "domcontentloaded" });
  const listHtml = (await page.locator("#the-list").innerHTML().catch(() => "")).toLowerCase();
  await report(page, "page-list:duplicate-action",
    /duplicat|clone|copy to a new draft|rewrite/.test(listHtml));
  await report(page, "page-list:edit-action", listHtml.includes("post.php?post="));

  /* ---- editor surfaces on a migrated page ---- */
  await openEditor(page, PAGE_ID);
  const sections = canvas(page).locator(".gr-section");
  await report(page, "editor:sections-render", (await sections.count()) > 0,
    `${await sections.count()} sections`);

  // List View — the section manager.
  const rows = page.getByRole("row");
  if (!(await rows.first().isVisible({ timeout: 2_000 }).catch(() => false))) {
    await page.getByRole("button", { name: /Document Overview/i }).first().click().catch(() => {});
  }
  await report(page, "editor:list-view", await rows.first().isVisible({ timeout: 10_000 }).catch(() => false));

  // Block inserter — can a marketing user add a section at all?
  const inserter = page.getByRole("button", { name: /Block Inserter|Toggle block inserter/i }).first();
  await report(page, "editor:inserter", await inserter.isVisible({ timeout: 5_000 }).catch(() => false));

  // Preview device options.
  // Same approach AT-08 uses: the control is a menuitemradio inside the
  // editor header, and its accessible name carries a description suffix
  // ("DesktopPreview desktop"), so match a prefix.
  const header = page.locator(".editor-header, .edit-post-header").first();
  await header.getByRole("button", { name: /^View$/ }).first().click().catch(() => {});
  await page.waitForTimeout(600);
  const devicesFound: string[] = [];
  for (const d of ["Desktop", "Tablet", "Mobile"]) {
    const item = page.getByRole("menuitemradio", { name: new RegExp(`^${d}`, "i") });
    if (await item.isVisible({ timeout: 6_000 }).catch(() => false)) devicesFound.push(d);
  }
  await page.keyboard.press("Escape");
  const devices = devicesFound.join(",");
  for (const d of ["Desktop", "Tablet", "Mobile"]) {
    await report(page, `editor:preview-${d}`, devices.includes(d));
  }

  // Scheduling.
  // Scheduling is the "Publish: Immediately" control in the document sidebar.
  const sidebarBtn = page.getByRole("button", { name: /Settings|Document Overview/i }).first();
  await sidebarBtn.click().catch(() => {});
  await page.waitForTimeout(800);
  const schedule = page.getByRole("button", { name: /Immediately|Change date|Publish:/i }).first();
  await report(page, "editor:schedule-control",
    await schedule.isVisible({ timeout: 8_000 }).catch(() => false));
  const body = await page.locator("body").innerText().catch(() => "");

  // Revisions.
  await report(page, "editor:revisions", body.includes("Revisions"));

  // Meta boxes present for a page.
  const html = (await page.locator("body").innerHTML()).toLowerCase();
  for (const f of ["_gr_seo_title", "_gr_seo_description", "_gr_canonical_url", "_gr_noindex"]) {
    await report(page, `page-seo:${f}`, html.includes(f));
  }
  // Precise: is there an editable control, not merely the key inside the
  // editor's preloaded REST payload? The meta is registered show_in_rest, so
  // its name appears in the page state whether or not a field is rendered.
  const jsonField = page.locator('textarea[name="_gr_section_json"], input[name="_gr_section_json"]');
  await report(page, "page:section_json-field", (await jsonField.count()) > 0, "raw JSON control must be ABSENT");
  const sectionsBox = page.locator("#gr_page_sections");
  await report(page, "page:sections-metabox", (await sectionsBox.count()) > 0, "should be ABSENT");

  /* ---- gemstone: marketing fields present, record fields absent ---- */
  await openEditor(page, GEM_ID);
  const gemHtml = (await page.locator("body").innerHTML()).toLowerCase();
  for (const f of ["_gr_seo_title", "_gr_hero_tagline", "_gr_cta_label"]) {
    await report(page, `gem-editable:${f}`, gemHtml.includes(f));
  }
  for (const f of ["_gr_evidence_state", "_gr_custody_state", "_gr_species", "_gr_lab_report_number"]) {
    await report(page, `gem-protected:${f}`, gemHtml.includes(f), "should be ABSENT");
  }

  /* ---- imported-HTML page ---- */
  await page.goto(`/wp-admin/post.php?post=${CLASSIC_ID}&action=edit`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(6_000);
  const classicHtml = (await page.locator("body").innerHTML()).toLowerCase();
  await report(page, "classic:block-editor", classicHtml.includes("block-editor"));
  await report(page, "classic:code-textarea-visible", classicHtml.includes('id="content"'), "raw code box should be ABSENT");
});
