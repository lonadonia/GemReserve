import { expect, test, type Page } from "@playwright/test";
import path from "node:path";

const routes = [
  { name: "home", path: "/" },
  { name: "how-it-works", path: "/how-it-works" },
  { name: "assets", path: "/assets" },
  { name: "technology", path: "/technology" },
  { name: "gemstone-tokenization", path: "/gemstone-tokenization" },
  { name: "physical-redemption", path: "/physical-redemption" },
  { name: "digital-asset-passports", path: "/digital-asset-passports" },
  { name: "platform-infrastructure", path: "/platform-infrastructure" },
  { name: "gemstone-programs", path: "/gemstone-programs" },
  { name: "asset-registry", path: "/asset-registry" },
  { name: "aquamarine", path: "/aquamarine" },
  { name: "emerald", path: "/emerald" },
  { name: "peridot", path: "/peridot" },
  { name: "ruby", path: "/ruby" },
  { name: "tourmaline", path: "/tourmaline" },
  { name: "natural-raw-charoite", path: "/natural-raw-charoite" },
  {
    name: "natural-rough-alexandrite",
    path: "/natural-rough-alexandrite",
  },
  {
    name: "natural-rough-aquamarine",
    path: "/natural-rough-aquamarine",
  },
  {
    name: "natural-rough-chrysoprase",
    path: "/natural-rough-chrysoprase",
  },
  {
    name: "natural-rough-italian-jade",
    path: "/natural-rough-italian-jade",
  },
  {
    name: "natural-rough-jasper",
    path: "/natural-rough-jasper",
  },
  {
    name: "natural-rough-ruby-c-quality",
    path: "/natural-rough-ruby-c-quality",
  },
  {
    name: "natural-rough-ruby-trapiche",
    path: "/natural-rough-ruby-trapiche",
  },
  {
    name: "natural-rough-ruby-gem-quality",
    path: "/natural-rough-ruby-gem-quality",
  },
  {
    name: "natural-rough-rutilated-quartz",
    path: "/natural-rough-rutilated-quartz",
  },
  {
    name: "natural-rough-tourmaline",
    path: "/natural-rough-tourmaline",
  },
  {
    name: "natural-rough-peridot",
    path: "/natural-rough-peridot",
  },
  {
    name: "natural-rough-emerald",
    path: "/natural-rough-emerald",
  },
  { name: "redemption-portal", path: "/redemption-portal" },
  { name: "enterprise", path: "/enterprise" },
  { name: "investors", path: "/investors" },
  { name: "about", path: "/about" },
  { name: "governance", path: "/governance" },
  { name: "contact", path: "/contact" },
  { name: "early-participation", path: "/early-participation" },
  { name: "eligibility-kyc", path: "/eligibility-kyc" },
  { name: "faq", path: "/faq" },
  { name: "program-overview", path: "/program-overview" },
  { name: "discount-methodology", path: "/discount-methodology" },
  { name: "token-acquisition", path: "/token-acquisition" },
  { name: "restricted-jurisdictions", path: "/restricted-jurisdictions" },
  { name: "enterprise-tokenization", path: "/enterprise-tokenization" },
  { name: "gemstone-owners", path: "/gemstone-owners" },
  { name: "gemstone-buyers", path: "/gemstone-buyers" },
  { name: "licensing-white-label", path: "/licensing-white-label" },
  { name: "future-infrastructure", path: "/future-infrastructure" },
  { name: "independent-verification", path: "/independent-verification" },
  { name: "custody-vault-structure", path: "/custody-vault-structure" },
  { name: "proof-of-reserves", path: "/proof-of-reserves" },
  { name: "corporate-development", path: "/corporate-development" },
  { name: "news", path: "/news" },
  { name: "resources", path: "/resources" },
  { name: "documents", path: "/documents" },
  { name: "whitepaper", path: "/whitepaper" },
  { name: "risk-disclosure", path: "/risk-disclosure" },
  { name: "anti-fraud-notice", path: "/anti-fraud-notice" },
  { name: "participant-portal", path: "/participant-portal" },
  {
    name: "early-participation-program",
    path: "/early-participation-program",
  },
] as const;

const requiredViewports = [
  { name: "phone-360", width: 360, height: 800 },
  { name: "phone-390", width: 390, height: 844 },
  { name: "phone-430", width: 430, height: 932 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "tablet-900", width: 900, height: 1200 },
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
      // A hand-built context does not inherit `use.baseURL`, and the origin is
      // configurable now (see playwright.config.ts), so it is passed through.
      baseURL: `http://127.0.0.1:${process.env.QA_PORT ?? 3000}`,
    });
    const page = await context.newPage();
    await page.goto("/", { waitUntil: "networkidle" });
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
    // The footer repeats the same "Overview" link, so the locator has to name
    // the navigation landmark or it resolves to two elements and never settles.
    await expect(
      page
        .getByRole("navigation", { name: "Primary navigation" })
        .getByRole("link", { name: "Overview", exact: true }),
    ).toBeFocused();
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

  test("contact form validates and never claims to have sent anything", async ({
    page,
  }) => {
    await page.goto("/contact", { waitUntil: "networkidle" });
    const form = page.locator(".contact-form");
    await form.getByRole("button", { name: "Send Message" }).click();
    await expect(page.getByText("Enter your full name.")).toBeVisible();
    await expect(page.getByText("Enter a valid email address.")).toBeVisible();
    await expect(
      page.getByText("Confirm you agree to the privacy policy."),
    ).toBeVisible();

    await form.getByLabel(/Full Name/).fill("Preview Person");
    await form.getByLabel(/Email Address/).fill("preview@example.com");
    await form.getByLabel(/Subject/).selectOption("General enquiry");
    await form.getByLabel(/Your Message/).fill("Testing the preview form.");
    await form.getByLabel(/I confirm/).check();
    await form.getByRole("button", { name: "Send Message" }).click();

    const success = page.getByRole("status");
    await expect(success).toContainText("demonstration success state");
    await expect(success).toBeFocused();
    await success.getByRole("button", { name: "Write another message" }).click();
    await expect(page.locator(".contact-form")).toBeVisible();
  });

  test("faq search, filtering and accordion work", async ({ page }) => {
    await page.goto("/faq", { waitUntil: "networkidle" });

    // The rail counts have to come from the entries, not from prose.
    const total = await page.locator(".faq-group li").count();
    await expect(
      page.getByRole("button", { name: /All Questions/ }),
    ).toContainText(String(total));

    const question = page
      .getByRole("button", { name: "What is GemReserve.io?" })
      .first();
    await expect(question).toHaveAttribute("aria-expanded", "false");
    await question.click();
    await expect(question).toHaveAttribute("aria-expanded", "true");
    await expect(
      page.getByText(/UAB GemVault Capital, a Lithuanian company/),
    ).toBeVisible();

    await page.getByLabel("Search questions").fill("blockchain");
    await expect(page.locator(".faq-group li")).not.toHaveCount(total);
    await page.getByLabel("Search questions").fill("zzzznotathing");
    await expect(page.getByText(/No questions match that search/)).toBeVisible();

    await page.getByLabel("Search questions").fill("");
    await page.getByRole("button", { name: /Security & Compliance/ }).click();
    await expect(page.locator(".faq-group")).toHaveCount(1);
  });

  test("waitlist form validates and never claims to hold a place", async ({
    page,
  }) => {
    await page.goto("/early-participation", { waitUntil: "networkidle" });
    const form = page.locator(".contact-form");
    await form.getByRole("button", { name: "Join the Waitlist" }).click();
    await expect(page.getByText("Enter your first name.")).toBeVisible();
    await expect(page.getByText("Confirm you agree to receive updates.")).toBeVisible();

    await form.getByLabel(/First Name/).fill("Preview");
    await form.getByLabel(/Last Name/).fill("Person");
    await form.getByLabel(/Email Address/).fill("preview@example.com");
    await form.getByLabel(/Country of Residence/).fill("Lithuania");
    await form.getByLabel(/I am joining as/).selectOption("Individual investor");
    await form.getByLabel(/I agree to receive/).check();
    await form.getByRole("button", { name: "Join the Waitlist" }).click();

    const success = page.getByRole("status");
    await expect(success).toContainText("no place has been reserved");
    await expect(success).toBeFocused();
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

test.describe("technology detail pages", () => {
  test("the passport explorer switches sections by click and by arrow key", async ({
    page,
  }) => {
    await page.goto("/digital-asset-passports", { waitUntil: "networkidle" });
    const rail = page.getByRole("tablist", {
      name: "Sections of a Digital Asset Passport",
    });
    const overview = rail.getByRole("tab", { name: "Overview" });
    await expect(overview).toHaveAttribute("aria-selected", "true");
    await expect(page.getByText("GRS-2024-EM0125")).toBeVisible();

    const custody = rail.getByRole("tab", { name: "Custody & Vault" });
    await custody.click();
    await expect(custody).toHaveAttribute("aria-selected", "true");
    await expect(overview).toHaveAttribute("aria-selected", "false");
    await expect(page.getByText("Institutional-grade")).toBeVisible();

    // The rail is a single tab stop; the arrow keys move between sections.
    await custody.press("ArrowDown");
    const ownership = rail.getByRole("tab", { name: "Ownership Record" });
    await expect(ownership).toBeFocused();
    await expect(ownership).toHaveAttribute("aria-selected", "true");
  });

  test("the passport lookup checks the ID format and claims nothing more", async ({
    page,
  }) => {
    await page.goto("/digital-asset-passports", { waitUntil: "networkidle" });
    const field = page.getByLabel("Passport ID");
    const submit = page.getByRole("button", { name: "Verify" });

    await field.fill("not-an-id");
    await submit.click();
    await expect(
      page.getByText("Passport IDs look like GR-RUB-000245."),
    ).toBeVisible();

    await field.fill("gr-emr-000125");
    await submit.click();
    const status = page.locator(".id-lookup__status");
    await expect(status).toContainText("valid Passport ID format");
    await expect(status).toContainText("Lookup opens with the platform");
    // It must never report a stone as found, because there is nothing to look in.
    await expect(status).not.toContainText(/verified|authentic|found/i);
  });

  test("the three detail pages are reachable from the Technology menu", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
    const nav = page.getByRole("navigation", { name: "Primary navigation" });
    await nav.getByRole("button", { name: /Technology/ }).click();
    for (const [label, href] of [
      ["Gemstone Tokenization", "/gemstone-tokenization"],
      ["Digital Asset Passports", "/digital-asset-passports"],
      ["Physical Redemption", "/physical-redemption"],
    ] as const) {
      await expect(
        nav.getByRole("link", { name: label, exact: true }),
      ).toHaveAttribute("href", href);
    }
  });

  test("the redemption fee table scrolls rather than widening the page", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/physical-redemption", { waitUntil: "networkidle" });
    const box = page.locator(".redemption-fees__scroll");
    await expect(box).toHaveCSS("overflow-x", "auto");
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
});

test.describe("assets and infrastructure pages", () => {
  test("the registry lookup checks the Asset ID format and claims nothing more", async ({
    page,
  }) => {
    await page.goto("/asset-registry", { waitUntil: "networkidle" });
    const field = page.getByLabel("Asset ID");
    const submit = page.getByRole("button", { name: "Search" });

    await field.fill("nonsense");
    await submit.click();
    await expect(
      page.getByText("Asset IDs look like GR-RUB-000245."),
    ).toBeVisible();

    await field.fill("gr-emr-000125");
    await submit.click();
    const status = page.locator(".id-lookup__status");
    await expect(status).toContainText("valid Asset ID format");
    await expect(status).toContainText("Lookup opens with the platform");
    // It must never report a stone as found, because there is nothing to look in.
    await expect(status).not.toContainText(/verified|authentic|found/i);
  });

  test("the programs page lists ten stones, and the fourth is the diamond", async ({
    page,
  }) => {
    await page.goto("/gemstone-programs", { waitUntil: "networkidle" });
    const cards = page.locator(".program-card");
    await expect(cards).toHaveCount(10);
    // The board mislabels this card "Emerald"; the site corrects it, and there
    // must be exactly one emerald among the ten.
    await expect(cards.nth(3).getByRole("heading")).toHaveText("Diamond");
    await expect(
      page.locator(".program-card h3", { hasText: /^Emerald$/ }),
    ).toHaveCount(1);

    const roughCards = page.locator(".rough-program-card");
    await expect(roughCards).toHaveCount(13);
    for (const href of [
      "/natural-rough-chrysoprase",
      "/natural-rough-italian-jade",
      "/natural-rough-jasper",
      "/natural-rough-ruby-c-quality",
      "/natural-rough-ruby-trapiche",
      "/natural-rough-ruby-gem-quality",
      "/natural-rough-rutilated-quartz",
      "/natural-rough-tourmaline",
      "/natural-rough-peridot",
      "/natural-rough-emerald",
    ] as const) {
      await expect(roughCards.locator(`a[href="${href}"]`)).toHaveCount(1);
    }
  });

  test("the registry record and spec rows stay inside the page on a phone", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    for (const route of ["/asset-registry", "/gemstone-programs"]) {
      await page.goto(route, { waitUntil: "networkidle" });
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow, `${route} overflows`).toBeLessThanOrEqual(1);
    }
  });

  test("the three pages are reachable from the Platform and Assets menus", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
    const nav = page.getByRole("navigation", { name: "Primary navigation" });

    await nav.getByRole("button", { name: /Platform/ }).click();
    await expect(
      nav.getByRole("link", { name: "Platform Infrastructure", exact: true }),
    ).toHaveAttribute("href", "/platform-infrastructure");

    await nav.getByRole("button", { name: /Assets/ }).click();
    for (const [label, href] of [
      ["Gemstone Programs", "/gemstone-programs"],
      [
        "Natural Rough Programs",
        "/gemstone-programs#natural-rough-programs",
      ],
      ["Asset Registry", "/asset-registry"],
    ] as const) {
      await expect(
        nav.getByRole("link", { name: label, exact: true }),
      ).toHaveAttribute("href", href);
    }
  });
});

test.describe("gemstone pages and the portal", () => {
  test("stone pages render from one shell with their own accent", async ({
    page,
  }) => {
    // Eighteen routes, each loaded to networkidle, plus two more for the accent
    // comparison below. That is well past what one default budget covers now
    // that every stone is checked here, so this case gets the longer one.
    test.slow();

    for (const [route, accent, title] of [
      ["/aquamarine", "aqua", "AQUAMARINE"],
      ["/emerald", "emerald", "EMERALD"],
      ["/peridot", "peridot", "PERIDOT"],
      ["/ruby", "ruby", "RUBY"],
      ["/tourmaline", "tourmaline", "TOURMALINE"],
      [
        "/natural-raw-charoite",
        "charoite",
        "NATURAL RAW CHAROITE",
      ],
      [
        "/natural-rough-alexandrite",
        "alexandrite",
        "NATURAL ROUGH ALEXANDRITE",
      ],
      [
        "/natural-rough-aquamarine",
        "rough-aquamarine",
        "NATURAL ROUGH AQUAMARINE",
      ],
      [
        "/natural-rough-chrysoprase",
        "chrysoprase",
        "NATURAL ROUGH CHRYSOPRASE",
      ],
      [
        "/natural-rough-italian-jade",
        "italian-jade",
        "NATURAL ROUGH ITALIAN JADE",
      ],
      ["/natural-rough-jasper", "jasper", "NATURAL ROUGH JASPER"],
      [
        "/natural-rough-ruby-c-quality",
        "rough-ruby-c",
        "NATURAL ROUGH RUBY (C QUALITY)",
      ],
      [
        "/natural-rough-ruby-trapiche",
        "rough-ruby-trapiche",
        "NATURAL ROUGH RUBY, TRAPICHE",
      ],
      [
        "/natural-rough-ruby-gem-quality",
        "rough-ruby-gem",
        "NATURAL ROUGH RUBY (GEM QUALITY)",
      ],
      [
        "/natural-rough-rutilated-quartz",
        "rutilated-quartz",
        "NATURAL ROUGH RUTILATED QUARTZ",
      ],
      [
        "/natural-rough-tourmaline",
        "rough-tourmaline",
        "NATURAL ROUGH TOURMALINE",
      ],
      [
        "/natural-rough-peridot",
        "rough-peridot",
        "NATURAL ROUGH PERIDOT",
      ],
      [
        "/natural-rough-emerald",
        "rough-emerald",
        "NATURAL, ROUGH EMERALD",
      ],
    ] as const) {
      await page.goto(route, { waitUntil: "networkidle" });
      await expect(page.locator("h1")).toHaveText(title);
      await expect(page.locator(`.gem-page--${accent}`)).toHaveCount(1);
    }

    // The accent is a token, not a hard-coded colour, so the two pages must
    // resolve it differently.
    await page.goto("/aquamarine", { waitUntil: "networkidle" });
    const aqua = await page.evaluate(() =>
      getComputedStyle(document.querySelector(".gem-page")!).getPropertyValue(
        "--gem",
      ),
    );
    await page.goto("/emerald", { waitUntil: "networkidle" });
    const green = await page.evaluate(() =>
      getComputedStyle(document.querySelector(".gem-page")!).getPropertyValue(
        "--gem",
      ),
    );
    expect(aqua.trim()).not.toBe(green.trim());
  });

  test("the aquamarine gallery shows six cuts and the sample is labelled", async ({
    page,
  }) => {
    await page.goto("/aquamarine", { waitUntil: "networkidle" });
    await expect(page.locator(".gem-gallery__grid li")).toHaveCount(6);
    await expect(page.getByText("GR-AQUA-000245")).toBeVisible();
    await expect(page.locator(".gem-card__sample")).toHaveText("Sample record");
  });

  test("the emerald market figure is drawn and marked projected", async ({
    page,
  }) => {
    await page.goto("/emerald", { waitUntil: "networkidle" });
    const figure = page.locator(".market-trend");
    await expect(figure).toBeVisible();
    await expect(figure.locator("polyline")).toHaveCount(1);
    await expect(figure.locator("circle")).toHaveCount(6);
    await expect(figure.getByText("2025*")).toBeVisible();
    // The board's axis unit is illegible, so the page must not assert one.
    await expect(figure).not.toContainText(/\$|USD|billion/i);
  });

  test("the portal preview claims nothing and offers no fake controls", async ({
    page,
  }) => {
    await page.goto("/redemption-portal", { waitUntil: "networkidle" });
    const preview = page.locator(".portal-window");
    await expect(preview).toBeVisible();
    await expect(preview).toContainText("Interface preview. Sample data.");
    // Nothing inside the preview may be focusable or clickable: it is a picture
    // of an interface, not an interface.
    await expect(
      preview.locator("a, button, input, select, textarea"),
    ).toHaveCount(0);
  });

  test("the gemstone pages are reachable from the Assets menu", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
    const nav = page.getByRole("navigation", { name: "Primary navigation" });

    await nav.getByRole("button", { name: /Assets/ }).click();
    for (const [label, href] of [
      ["Aquamarine", "/aquamarine"],
      ["Emerald", "/emerald"],
      ["Peridot", "/peridot"],
      ["Ruby", "/ruby"],
      ["Tourmaline", "/tourmaline"],
      ["Natural Raw Charoite", "/natural-raw-charoite"],
      ["Natural Rough Alexandrite", "/natural-rough-alexandrite"],
      ["Natural Rough Aquamarine", "/natural-rough-aquamarine"],
    ] as const) {
      await expect(
        nav.getByRole("link", { name: label, exact: true }),
      ).toHaveAttribute("href", href);
    }

    await nav.getByRole("button", { name: /How It Works/ }).click();
    await expect(
      nav.getByRole("link", { name: "Redemption Portal", exact: true }),
    ).toHaveAttribute("href", "/redemption-portal");
  });

  test("rough programmes keep seven facts and Alexandrite shows both lighting states", async ({
    page,
  }) => {
    for (const route of [
      "/natural-raw-charoite",
      "/natural-rough-alexandrite",
      "/natural-rough-aquamarine",
    ]) {
      await page.goto(route, { waitUntil: "networkidle" });
      await expect(page.locator(".gem-glance__row > div")).toHaveCount(7);
    }

    await page.goto("/natural-rough-alexandrite", {
      waitUntil: "networkidle",
    });
    await expect(page.locator(".gem-hero__comparisons figure")).toHaveCount(2);
  });

  test("catalogue and programme cards link to published gemstone pages", async ({
    page,
  }) => {
    for (const route of ["/assets", "/gemstone-programs"]) {
      await page.goto(route, { waitUntil: "networkidle" });
      const cardSelector =
        route === "/assets" ? ".gemstone-card" : ".program-card";
      for (const [label, href] of [
        ["Ruby", "/ruby"],
        ["Emerald", "/emerald"],
        ["Aquamarine", "/aquamarine"],
      ] as const) {
        const card = page.locator(cardSelector, {
          has: page.getByRole("heading", { name: label, exact: true }),
        });
        await expect(card.getByRole("link")).toHaveAttribute("href", href);
      }
    }
  });
});

test.describe("phase two pages state capability, not deployment", () => {
  test("token acquisition is a description, never a live checkout", async ({
    page,
  }) => {
    await page.goto("/token-acquisition", { waitUntil: "networkidle" });

    // The board draws a six-step purchase flow. Nothing on the page may be an
    // actual control: no wallet button, no amount field, no order form.
    await expect(page.locator("form")).toHaveCount(0);
    await expect(page.locator("input, select, textarea")).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: /connect|buy|purchase|pay/i }),
    ).toHaveCount(0);

    await expect(page.getByRole("note")).toContainText("not yet open");
  });

  test("the discount example is labelled as an example", async ({ page }) => {
    await page.goto("/discount-methodology", { waitUntil: "networkidle" });

    // Every figure on this page belongs to the board's worked example, so the
    // heading above them has to say so.
    const heading = page.getByRole("heading", { name: /EXAMPLE:/ });
    await expect(heading).toBeVisible();

    const example = page.locator(".discount-example");
    await expect(example).toContainText("$10.00");
    await expect(example).toContainText("$8.00");
  });

  test("the roadmap distinguishes delivered phases from planned ones", async ({
    page,
  }) => {
    await page.goto("/future-infrastructure", { waitUntil: "networkidle" });

    // The board draws a completed check over all five phases. Only the phase it
    // names completed may read as done.
    await expect(page.locator(".future-phases__item--complete")).toHaveCount(1);
    await expect(page.locator(".future-phases__item--in-progress")).toHaveCount(
      1,
    );
    await expect(page.locator(".future-phases__item--planned")).toHaveCount(3);
  });

  test("the white-label preview carries no invented platform figures", async ({
    page,
  }) => {
    await page.goto("/licensing-white-label", { waitUntil: "networkidle" });

    const preview = page.locator(".licensing-preview");
    await expect(preview).toBeVisible();
    await expect(preview).toContainText("ILLUSTRATION");

    // The board's mockup carries totals; this one must carry none.
    await expect(preview).not.toContainText("$");
    await expect(await preview.innerText()).not.toMatch(/\d{3,}/);
  });

  test("the buyers passport record is a sample, not a listing", async ({
    page,
  }) => {
    await page.goto("/gemstone-buyers", { waitUntil: "networkidle" });

    const passport = page.locator(".audience-passport");
    await expect(passport).toContainText("EXAMPLE RECORD");
    await expect(passport).toContainText("GR-SAPP-0001245");
    await expect(passport).not.toContainText("$");
  });

  test("the new pages carry the Lithuanian operating entity", async ({
    page,
  }) => {
    for (const route of [
      "/program-overview",
      "/restricted-jurisdictions",
      "/enterprise-tokenization",
      "/future-infrastructure",
      "/custody-vault-structure",
      "/corporate-development",
      "/documents",
      "/participant-portal",
    ]) {
      await page.goto(route, { waitUntil: "networkidle" });
      await expect(page.locator(".footer-legal")).toContainText("LT307501935");
      await expect(page.locator("body")).not.toContainText(/Zurich|Switzerland/);
    }
  });
});

test.describe("the closing pages keep the boards' claims off the site", () => {
  test("proof of reserves shows no reserve figure and says why", async ({
    page,
  }) => {
    await page.goto("/proof-of-reserves", { waitUntil: "networkidle" });

    // The board fills this dashboard with a reserve value, an asset count and a
    // composition chart. None of it has been attested, so the panel has to be
    // empty and has to say so rather than showing a projection.
    const board = page.locator(".reserves-board");
    await expect(board).toBeVisible();
    await expect(board).toContainText("No attestation published");
    await expect(board).not.toContainText("$");
    expect(await board.innerText()).not.toMatch(/\d{3,}/);
    await expect(board.locator(".reserves-board__meta")).toContainText(
      "Pending first attestation",
    );
  });

  test("the portal preview carries no holding, balance or value", async ({
    page,
  }) => {
    await page.goto("/participant-portal", { waitUntil: "networkidle" });

    // The board's dashboard reads $2,458,750.00 across four holdings. There is
    // no account system, so every value in the preview must be blank.
    const preview = page.locator(".portal-preview");
    await expect(preview).toBeVisible();
    await expect(preview).not.toContainText("$");
    expect(await preview.innerText()).not.toMatch(/\d{3,}/);
    await expect(preview).toContainText("No holdings");

    // And nothing on the page may look like a way in.
    await expect(page.locator("form")).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: /sign in|log in|login/i }),
    ).toHaveCount(0);
    await expect(page.locator(".participant-notice__panel")).toContainText(
      "not open",
      { ignoreCase: true },
    );
  });

  test("the newsroom publishes no article it never issued", async ({
    page,
  }) => {
    await page.goto("/news", { waitUntil: "networkidle" });

    // The board carries five articles dated July 2026 for announcements that
    // were never made. The newsroom has to be empty and say so.
    await expect(page.locator("article")).toHaveCount(0);
    await expect(page.locator(".news-state")).toContainText(
      "Nothing published yet",
      { ignoreCase: true },
    );
    await expect(page.getByRole("link", { name: /read more/i })).toHaveCount(0);
  });

  test("the document library offers no file it does not have", async ({
    page,
  }) => {
    await page.goto("/documents", { waitUntil: "networkidle" });

    const library = page.locator(".documents-library__grid");
    await expect(library).toBeVisible();
    // No download control, and no file size or page count implying one exists.
    await expect(library.getByRole("link", { name: /download/i })).toHaveCount(
      0,
    );
    expect(await library.innerText()).not.toMatch(/\bMB\b|\bPDF\b/);
    await expect(library.locator(".document-card__status").first()).toHaveText(
      "In preparation",
    );

    await page.goto("/whitepaper", { waitUntil: "networkidle" });
    await expect(
      page.locator(".whitepaper-download__panel").getByRole("link", {
        name: /download/i,
      }),
    ).toHaveCount(0);
    await expect(page.locator(".whitepaper-download__status")).toContainText(
      "In preparation",
    );
  });

  test("no third party is named as a partner", async ({ page }) => {
    // The boards name a gemological laboratory, an insurance market, an audit
    // firm, a law firm, a smart-contract auditor and four vaulting companies as
    // GemReserve partners. None of those relationships exists.
    const forbidden =
      /Lloyd|\bBDO\b|Froriep|Certik|Loomis|Brinks|Malca|Via Mat|Chubb|Chainlink/i;
    for (const route of [
      "/independent-verification",
      "/custody-vault-structure",
      "/proof-of-reserves",
      "/corporate-development",
    ]) {
      await page.goto(route, { waitUntil: "networkidle" });
      expect(await page.locator("body").innerText()).not.toMatch(forbidden);
    }
  });

  test("the anti-fraud page lists only channels the project controls", async ({
    page,
  }) => {
    await page.goto("/anti-fraud-notice", { waitUntil: "networkidle" });

    // The board lists a help centre and three social networks. None exists, and
    // listing one would tell a reader an impersonator might be genuine.
    const channels = page.locator(".fraud-channel-list");
    await expect(channels.locator("li")).toHaveCount(5);
    expect(await channels.innerText()).not.toMatch(
      /telegram|twitter|linkedin|discord|whatsapp|help[- ]centre|help[- ]center/i,
    );
    await expect(page.locator(".fraud-channels__warnings")).toContainText(
      "does not operate an account on any social network",
    );
  });

  test("the early participation programme forecasts no return", async ({
    page,
  }) => {
    await page.goto("/early-participation-program", {
      waitUntil: "networkidle",
    });

    // The board's fourth reason to join is "STRONGER RETURNS". Nothing on this
    // site states or implies an expected return, and this is the page closest
    // to an offer.
    const body = await page.locator("main").innerText();
    expect(body).not.toMatch(/stronger returns|expected return|profit/i);
    await expect(page.locator(".program-notice__panel")).toContainText(
      "not open",
    );

    // No live control, and no allocation or date invented for the sequence.
    await expect(page.locator("form")).toHaveCount(0);
    expect(body).not.toMatch(/limited allocation|spots are limited/i);
  });
});
