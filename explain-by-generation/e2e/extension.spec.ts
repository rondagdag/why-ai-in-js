import { test, expect, chromium } from "@playwright/test"
import { fileURLToPath } from "url"
import path from "path"

// Define path to the extension
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const pathToExtension = path.join(__dirname, "../dist")

test.describe("Extension E2E", () => {
  let context: import("@playwright/test").BrowserContext
  let extensionId: string

  test.beforeAll(async () => {
    // Launch Chrome with the extension
    context = await chromium.launchPersistentContext("", {
      headless: false, // Extensions only work in headed mode usually
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`
      ]
    })
  })

  test.afterAll(async () => {
    await context.close()
  })

  test("should update level when clicked", async () => {
    // Find background worker
    let backgroundPage: import("@playwright/test").Worker | undefined
    let retries = 10
    while (retries > 0) {
      backgroundPage = context
        .serviceWorkers()
        .find((worker) => worker.url().startsWith("chrome-extension://"))
      if (backgroundPage) break
      await new Promise((r) => setTimeout(r, 500))
      retries--
    }
    expect(backgroundPage).toBeDefined()

    if (backgroundPage) {
      const url = backgroundPage.url()
      extensionId = url.split("/")[2]
    }

    const page = await context.newPage()
    await page.goto(`chrome-extension://${extensionId}/popup.html`)

    const buttons = page.locator("button.level-option")
    await expect(buttons.first()).toBeVisible()

    // Name of the first level (Gen Alpha) to compare or just check level ID
    // Level 7 is the first button in the list (reversed)

    // Click the first button (Level 7)
    await buttons.first().click()

    // We poll because storage update is async
    await expect
      .poll(async () => {
        return await backgroundPage!.evaluate(() => {
          return new Promise((resolve) => {
            chrome.storage.sync.get(["selectedLevel"], (result) => {
              resolve(result.selectedLevel?.level)
            })
          })
        })
      })
      .toBe(7)
  })
})
