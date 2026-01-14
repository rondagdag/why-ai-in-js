/**
 * Playwright E2E Tests for Translation and Language Detection API Playground
 *
 * NOTE: These APIs are experimental Chrome features that require:
 * 1. Chrome Canary/Dev channel with flags enabled, OR
 * 2. Enrollment in the Early Preview Program
 *
 * The tests are designed to handle both scenarios:
 * - When APIs are available: Tests full functionality
 * - When APIs are unavailable: Tests graceful degradation
 */

import { test, expect, Page } from "@playwright/test";

// Helper to check if the Language Detector API is available
async function isLanguageDetectorAvailable(page: Page): Promise<boolean> {
  return await page.evaluate(() => "LanguageDetector" in window);
}

// Helper to check if the Translator API is available
async function isTranslatorAvailable(page: Page): Promise<boolean> {
  return await page.evaluate(() => "Translator" in window);
}

test.describe("Translation and Language Detection Playground", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the demo page using local file
    await page.goto("file://" + process.cwd() + "/index.html");
  });

  test.describe("Page Structure", () => {
    test("should have correct page title", async ({ page }) => {
      await expect(page).toHaveTitle(
        "Translator and Language Detector API Playground"
      );
    });

    test("should have main heading", async ({ page }) => {
      await expect(page.locator("h1")).toContainText(
        "Translator and Language Detector API Playground"
      );
    });

    test("should have textarea with default text", async ({ page }) => {
      const textarea = page.locator("textarea#input");
      await expect(textarea).toBeVisible();
      await expect(textarea).toHaveValue("Hello, world!");
    });

    test("should have language detection output span", async ({ page }) => {
      await expect(page.locator("p span")).toBeVisible();
    });
  });

  test.describe("API Unavailable Scenario", () => {
    test("should show not-supported message when APIs unavailable", async ({
      page,
    }) => {
      const apiAvailable = await isLanguageDetectorAvailable(page);

      if (!apiAvailable) {
        // When API is not available, the not-supported message should be visible
        const notSupportedMessage = page.locator(".not-supported-message");
        await expect(notSupportedMessage).toBeVisible({ timeout: 5000 });
        await expect(notSupportedMessage).toContainText(
          "Your browser doesn't support"
        );
        await expect(notSupportedMessage).toContainText(
          "Early Preview Program"
        );
      } else {
        // Skip this test if API is available
        test.skip();
      }
    });

    test("should keep form hidden when APIs unavailable", async ({ page }) => {
      const apiAvailable = await isLanguageDetectorAvailable(page);

      if (!apiAvailable) {
        const form = page.locator("form");
        // Form should not have visible styling
        await expect(form).toHaveCSS("visibility", "hidden");
      } else {
        test.skip();
      }
    });
  });

  test.describe("API Available Scenario", () => {
    test("should show form when Language Detector API is available", async ({
      page,
    }) => {
      const apiAvailable = await isLanguageDetectorAvailable(page);

      if (apiAvailable) {
        // Wait for initialization
        await page.waitForFunction(
          () =>
            document.querySelector("form")?.style.visibility === "visible",
          { timeout: 30000 }
        );

        const form = page.locator("form");
        await expect(form).toHaveCSS("visibility", "visible");
      } else {
        test.skip();
      }
    });

    test("should detect language of default text", async ({ page }) => {
      const apiAvailable = await isLanguageDetectorAvailable(page);

      if (apiAvailable) {
        // Wait for language detection to complete
        await expect(page.locator("p span")).not.toHaveText(
          "not sure what language this is",
          { timeout: 30000 }
        );

        // Should detect English with confidence
        const detectionText = await page.locator("p span").textContent();
        expect(detectionText).toMatch(/\d+(\.\d+)?% sure that this is/);
        expect(detectionText?.toLowerCase()).toContain("english");
      } else {
        test.skip();
      }
    });

    test("should update detection when input changes", async ({ page }) => {
      const apiAvailable = await isLanguageDetectorAvailable(page);

      if (apiAvailable) {
        // Wait for initial detection
        await expect(page.locator("p span")).not.toHaveText(
          "not sure what language this is",
          { timeout: 30000 }
        );

        // Type Spanish text
        await page.locator("textarea#input").fill("Hola, mundo!");

        // Wait for new detection
        await page.waitForTimeout(500); // Brief wait for detection

        const detectionText = await page.locator("p span").textContent();
        expect(detectionText).toMatch(/\d+(\.\d+)?% sure that this is/);
        // Should detect Spanish
        expect(detectionText?.toLowerCase()).toContain("spanish");
      } else {
        test.skip();
      }
    });

    test("should handle empty input gracefully", async ({ page }) => {
      const apiAvailable = await isLanguageDetectorAvailable(page);

      if (apiAvailable) {
        // Wait for form to be visible
        await page.waitForFunction(
          () =>
            document.querySelector("form")?.style.visibility === "visible",
          { timeout: 30000 }
        );

        // Clear the textarea
        await page.locator("textarea#input").fill("");

        // Should show uncertainty message
        await expect(page.locator("p span")).toHaveText(
          "not sure what language this is",
          { timeout: 5000 }
        );
      } else {
        test.skip();
      }
    });

    test("should handle whitespace-only input", async ({ page }) => {
      const apiAvailable = await isLanguageDetectorAvailable(page);

      if (apiAvailable) {
        await page.waitForFunction(
          () =>
            document.querySelector("form")?.style.visibility === "visible",
          { timeout: 30000 }
        );

        // Fill with whitespace only
        await page.locator("textarea#input").fill("   ");

        await expect(page.locator("p span")).toHaveText(
          "not sure what language this is",
          { timeout: 5000 }
        );
      } else {
        test.skip();
      }
    });
  });

  test.describe("Translator API Features", () => {
    test("should show translator controls when Translator API is available", async ({
      page,
    }) => {
      const langDetectorAvailable = await isLanguageDetectorAvailable(page);
      const translatorAvailable = await isTranslatorAvailable(page);

      if (langDetectorAvailable && translatorAvailable) {
        // Wait for initialization
        await page.waitForFunction(
          () =>
            document.querySelector("form")?.style.visibility === "visible",
          { timeout: 30000 }
        );

        // Translation controls should be visible
        await expect(page.locator("select#translate")).toBeVisible();
        await expect(page.locator('button[type="submit"]')).toBeVisible();
        await expect(page.locator("label[for='output']")).toBeVisible();
      } else {
        test.skip();
      }
    });

    test("should have correct language options in dropdown", async ({
      page,
    }) => {
      const translatorAvailable = await isTranslatorAvailable(page);

      if (translatorAvailable) {
        const select = page.locator("select#translate");
        await expect(select.locator('option[value="en"]')).toHaveText(
          "English"
        );
        await expect(select.locator('option[value="ja"]')).toHaveText(
          "Japanese"
        );
        await expect(select.locator('option[value="es"]')).toHaveText(
          "Spanish"
        );

        // Spanish should be selected by default
        await expect(select).toHaveValue("es");
      } else {
        test.skip();
      }
    });

    test("should translate English to Spanish", async ({ page }) => {
      const langDetectorAvailable = await isLanguageDetectorAvailable(page);
      const translatorAvailable = await isTranslatorAvailable(page);

      if (langDetectorAvailable && translatorAvailable) {
        await page.waitForFunction(
          () =>
            document.querySelector("form")?.style.visibility === "visible",
          { timeout: 30000 }
        );

        // Ensure English text
        await page.locator("textarea#input").fill("Hello, how are you?");

        // Select Spanish as target
        await page.locator("select#translate").selectOption("es");

        // Submit form
        await page.locator('button[type="submit"]').click();

        // Wait for translation (may need to download model)
        const output = page.locator("output#output");
        await expect(output).not.toBeEmpty({ timeout: 60000 });

        // Check that output is not an error message
        const outputText = await output.textContent();
        expect(outputText).not.toContain("error");
        expect(outputText).not.toBe("");
      } else {
        test.skip();
      }
    });

    test("should show error for unsupported language pair", async ({
      page,
    }) => {
      const langDetectorAvailable = await isLanguageDetectorAvailable(page);
      const translatorAvailable = await isTranslatorAvailable(page);

      if (langDetectorAvailable && translatorAvailable) {
        await page.waitForFunction(
          () =>
            document.querySelector("form")?.style.visibility === "visible",
          { timeout: 30000 }
        );

        // Try French text (not in the supported list)
        await page.locator("textarea#input").fill("Bonjour le monde");

        // Wait for French detection
        await page.waitForTimeout(1000);

        // Submit form
        await page.locator('button[type="submit"]').click();

        // Should show unsupported message
        const output = page.locator("output#output");
        await expect(output).toContainText(
          "only English ↔ Spanish and English ↔ Japanese are supported",
          { timeout: 10000 }
        );
      } else {
        test.skip();
      }
    });
  });

  test.describe("UI Interactions", () => {
    test("should allow typing in textarea", async ({ page }) => {
      const textarea = page.locator("textarea#input");
      await textarea.fill("Test input text");
      await expect(textarea).toHaveValue("Test input text");
    });

    test("should allow changing language selection", async ({ page }) => {
      const select = page.locator("select#translate");

      // Change to Japanese
      await select.selectOption("ja");
      await expect(select).toHaveValue("ja");

      // Change to English
      await select.selectOption("en");
      await expect(select).toHaveValue("en");

      // Change back to Spanish
      await select.selectOption("es");
      await expect(select).toHaveValue("es");
    });
  });

  test.describe("Language Detection Accuracy", () => {
    const languageTestCases = [
      { text: "Hello world", expectedLang: "english" },
      { text: "Hola mundo", expectedLang: "spanish" },
      { text: "Bonjour le monde", expectedLang: "french" },
      { text: "Guten Tag", expectedLang: "german" },
    ];

    for (const { text, expectedLang } of languageTestCases) {
      test(`should detect ${expectedLang} text`, async ({ page }) => {
        const apiAvailable = await isLanguageDetectorAvailable(page);

        if (apiAvailable) {
          await page.waitForFunction(
            () =>
              document.querySelector("form")?.style.visibility === "visible",
            { timeout: 30000 }
          );

          await page.locator("textarea#input").fill(text);
          await page.waitForTimeout(500);

          const detectionText = await page.locator("p span").textContent();
          expect(detectionText?.toLowerCase()).toContain(expectedLang);
        } else {
          test.skip();
        }
      });
    }
  });
});
