/**
 * Shared helpers for the acceptance suite.
 *
 * Everything a test needs to behave like a marketing user: log in, open a page
 * in the block editor, wait for Gutenberg to settle, save, and read the public
 * result back.
 *
 * The waits deserve a note. Gutenberg saves asynchronously and its "Saved"
 * indicator appears before the REST request has necessarily finished; asserting
 * on the public page immediately after a save is the classic way to write a test
 * that passes locally and fails on a slower host. So the helpers wait on the
 * network response that actually persists the change, not on the button label.
 */

import { expect, type Page } from "@playwright/test";

export const CREDENTIALS = {
  admin: { user: "qa_admin", pass: "StagingOnly!2026" },
  editor: { user: "qa_editor", pass: "StagingOnly!2026" },
  publisher: { user: "qa_publisher", pass: "StagingOnly!2026" },
} as const;

export type Persona = keyof typeof CREDENTIALS;

/**
 * Refuse to run anywhere that is not an isolated instance.
 *
 * This is the guard that matters most in the whole suite: these tests publish,
 * delete and reorder real content.
 */
export function assertSafeTarget(baseURL: string | undefined): void {
  if (!baseURL || !/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?/i.test(baseURL)) {
    throw new Error(
      `Refusing to run acceptance tests against ${baseURL ?? "(unset)"}. ` +
        "This suite creates, edits and deletes content and must only target an isolated staging instance.",
    );
  }
}

export async function login(page: Page, persona: Persona): Promise<void> {
  const { user, pass } = CREDENTIALS[persona];
  await page.goto("/wp-login.php", { waitUntil: "domcontentloaded" });
  await page.fill("#user_login", user);
  await page.fill("#user_pass", pass);
  await Promise.all([
    page.waitForURL(/wp-admin/, { timeout: 60_000 }),
    page.click("#wp-submit"),
  ]);
}

/** Open a page in the block editor and wait until it is usable. */
export async function openEditor(page: Page, postId: number): Promise<void> {
  await page.goto(`/wp-admin/post.php?post=${postId}&action=edit`, {
    waitUntil: "domcontentloaded",
  });
  await dismissBlockingDialogs(page);

  // The canvas is iframed in current Gutenberg. Waiting for a GemReserve block
  // to exist proves both that the editor booted and that our blocks registered.
  await expect(canvas(page).locator(".gr-section").first()).toBeVisible({ timeout: 60_000 });

  // Dismissed a second time, after the canvas is up.
  //
  // The welcome guide is rendered by the editor once it has booted, which can be
  // several seconds after the document is ready — so a single pass before the
  // canvas exists races it and loses. When it loses, the symptom is a click
  // timing out on an element Playwright reports as "visible, enabled and
  // stable", because a full-screen overlay is quietly eating the event.
  await dismissBlockingDialogs(page);
  await dismissSnackbars(page);
}

/**
 * Clear Gutenberg's save notices.
 *
 * The "Page updated" snackbar sits in the bottom-left corner for several
 * seconds and swallows clicks aimed at anything beneath it. Tests that pass
 * alone and fail in sequence are the signature: the snackbar is only ever
 * present because a *previous* test saved something, so it never appears when a
 * test is run on its own. Both the reorder and the card tests failed this way.
 */
export async function dismissSnackbars(page: Page): Promise<void> {
  // Waited out, not clicked.
  //
  // A snackbar is a button, so clicking it looks like the obvious way to
  // dismiss one — but WordPress's save snackbar carries a "View Page" action,
  // and clicking it navigates the browser to the public page. That turned a fix
  // for two flaky tests into a cause of two different ones. They auto-dismiss
  // in a few seconds; waiting is both simpler and correct.
  await page
    .locator(".components-snackbar")
    .first()
    .waitFor({ state: "detached", timeout: 10_000 })
    .catch(() => undefined);
}

/**
 * The editor canvas.
 *
 * Gutenberg renders the canvas inside an iframe so that editor styles are
 * scoped. Everything a user "sees on the page" lives in there; the sidebar and
 * toolbars do not.
 */
export function canvas(page: Page) {
  return page.frameLocator('iframe[name="editor-canvas"]');
}

/**
 * Clear anything modal that would intercept clicks in the canvas.
 *
 * Two dialogs turn up, and both present identically from the outside: a
 * twenty-second timeout on an element Playwright reports as "visible, enabled
 * and stable", because a full-screen overlay is swallowing the click.
 *
 *   Welcome guide   Gutenberg's first-run tour. Setting the user preference
 *                   server-side does not reliably suppress it; the editor
 *                   writes its own preference store on first boot.
 *
 *   Post lock       "This post is already being edited by …". WordPress locks a
 *                   post when someone opens it and holds the lock for a while
 *                   after. A suite that switches personas — as these tests must,
 *                   to prove the editor/publisher split — trips it constantly,
 *                   and so does any earlier run that was interrupted.
 *
 * The post lock is taken over rather than waited out, which is what a second
 * person would do, and the helper waits for the overlay to detach rather than
 * assuming a click worked.
 */
async function dismissBlockingDialogs(page: Page): Promise<void> {
  const overlay = page.locator(".components-modal__screen-overlay");

  for (let attempt = 0; attempt < 4; attempt += 1) {
    if (!(await overlay.first().isVisible({ timeout: 4_000 }).catch(() => false))) {
      return;
    }

    // WordPress's own take-over control. It is a link, not a button, and its
    // href carries the nonce that `get-post-lock=1` requires — navigating to
    // that URL by hand without the nonce gets "The link you followed has
    // expired" and no editor at all.
    const takeOver = page
      .locator('.components-modal__screen-overlay a, .components-modal__screen-overlay button')
      .filter({ hasText: /take over/i })
      .first();
    if (await takeOver.isVisible().catch(() => false)) {
      await takeOver.click({ timeout: 5_000 }).catch(() => undefined);
      await page.waitForLoadState("domcontentloaded").catch(() => undefined);
      await overlay.first().waitFor({ state: "detached", timeout: 8_000 }).catch(() => undefined);
      continue;
    }

    // The welcome guide is turned off through Gutenberg's own preference store
    // — the same call its close button makes — rather than by hunting for that
    // button. Its label and markup have moved between releases, and a selector
    // that misses presents as a twenty-second timeout on an unrelated element,
    // which is a miserable thing to debug. Setting the preference server-side
    // beforehand is not sufficient on its own: the editor writes its own
    // preference store on boot and can race the value.
    await page
      .evaluate(() => {
        const preferences = (window as unknown as { wp?: { data?: { dispatch: (s: string) => unknown } } })
          .wp?.data?.dispatch("core/preferences") as
          | { set?: (scope: string, name: string, value: unknown) => void }
          | undefined;
        for (const scope of ["core", "core/edit-post", "core/editor", "core/edit-site"]) {
          preferences?.set?.(scope, "welcomeGuide", false);
          preferences?.set?.(scope, "welcomeGuideTemplate", false);
        }
      })
      .catch(() => undefined);

    await page.keyboard.press("Escape");
    await overlay.first().waitFor({ state: "detached", timeout: 8_000 }).catch(() => undefined);
  }

  await expect(
    overlay.first(),
    "a modal dialog is still blocking the editor canvas",
  ).toBeHidden({ timeout: 10_000 });
}

/**
 * Save the post and wait for the write to land.
 *
 * Waits on the REST response rather than the UI label, for the reason in the
 * file header.
 */
export async function save(page: Page): Promise<void> {
  const button = page
    .getByRole("button", { name: /^(Save draft|Save|Update|Publish)$/ })
    .first();

  const response = page.waitForResponse(
    (r) =>
      /\/wp-json\/wp\/v2\/(pages|posts)\/\d+/.test(r.url()) &&
      ["POST", "PUT", "PATCH"].includes(r.request().method()) &&
      r.status() < 400,
    { timeout: 60_000 },
  );

  // Classic meta boxes are not part of the REST save. Gutenberg posts them
  // separately to `post.php?meta-box-loader=1`, and that request can land after
  // the REST one. A test that waits only for REST will read the public page
  // before the SEO fields have been written — which looks exactly like the
  // fields not saving at all.
  const metaBoxes = page
    .waitForResponse(
      (r) => r.url().includes("meta-box-loader") && r.request().method() === "POST",
      { timeout: 20_000 },
    )
    .catch(() => null);

  await button.click();

  // Publishing asks for confirmation in a side panel the first time.
  const confirm = page.locator(".editor-post-publish-panel").getByRole("button", { name: /^Publish$/ });
  if (await confirm.isVisible({ timeout: 3_000 }).catch(() => false)) {
    await confirm.click();
  }

  await response;
  await metaBoxes;
}

/** Fetch the public HTML of a route, bypassing any browser cache. */
export async function publicHtml(page: Page, route: string): Promise<string> {
  const response = await page.request.get(route, {
    headers: { "Cache-Control": "no-cache" },
  });
  expect(response.status(), `GET ${route}`).toBe(200);

  return response.text();
}

/**
 * Look up a page id by slug.
 *
 * The public REST collection only lists published pages, and one of these tests
 * deliberately leaves a page in Pending for a moment — a Marketing Editor
 * saving a published page is *supposed* to send it to review. So this falls
 * back to the admin's All Pages screen, which lists every status and is how a
 * marketing user would find the page anyway.
 */
export async function pageIdBySlug(page: Page, slug: string): Promise<number> {
  const response = await page.request.get(`/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}`);
  if (response.status() === 200) {
    const rows = (await response.json()) as { id: number }[];
    if (rows.length > 0) {
      return rows[0].id;
    }
  }

  await page.goto(`/wp-admin/edit.php?post_type=page&s=${encodeURIComponent(slug)}`, {
    waitUntil: "domcontentloaded",
  });
  const href = await page
    .locator('a[href*="post.php"][href*="action=edit"]')
    .first()
    .getAttribute("href")
    .catch(() => null);
  const id = Number.parseInt(href?.match(/post=(\d+)/)?.[1] ?? "", 10);

  expect(Number.isFinite(id) && id > 0, `no page with slug ${slug}`).toBe(true);

  return id;
}

/** A short unique marker, so a test's edit is unmistakably its own. */
export function marker(label: string): string {
  return `QA-${label}-${Date.now().toString(36).toUpperCase()}`;
}
