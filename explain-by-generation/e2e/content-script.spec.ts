import { test, expect, chromium } from "@playwright/test"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test.describe("Content Script E2E", () => {
  let context: import("@playwright/test").BrowserContext

  test.beforeAll(async () => {
    const pathToExtension = path.join(__dirname, "../dist")
    const userDataDir = "/tmp/test-user-data-dir-content-script"
    context = await chromium.launchPersistentContext(userDataDir, {
      headless: false,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`
      ]
    })
  })

  test.afterAll(async () => {
    await context.close()
  })

  // Note: This test requires content script injection which doesn't work with file:// URLs
  // and external URLs may be unreliable in CI. Skip for now - manually test this flow.
  test.skip("should communicate with background script", async () => {
    // 1. Find the background worker
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

    // 2. Open a local test page using file:// protocol
    const testPagePath = path.join(__dirname, "fixtures", "test-page.html")
    const page = await context.newPage()
    await page.goto(`file://${testPagePath}`)

    // Wait for content script to be injected
    await page.waitForTimeout(1000)

    // 3. Select some text on the page and verify selection was made
    const selectionMade = await page.evaluate(() => {
      const range = document.createRange()
      const h1 = document.querySelector("#test-heading")
      if (h1) {
        range.selectNodeContents(h1)
        const selection = window.getSelection()
        selection?.removeAllRanges()
        selection?.addRange(range)
        return selection?.toString() || ""
      }
      return ""
    })

    // Verify the selection was made successfully
    expect(selectionMade).toBe("Test Selection Content")

    // 4. Send message from background to content script to get selection
    const selection = await backgroundPage!.evaluate(async () => {
      return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const tab = tabs[0]
          if (!tab?.id) {
            reject(new Error("No active tab found"))
            return
          }
          chrome.tabs.sendMessage(
            tab.id,
            { type: "GET_CURRENT_SELECTION" },
            (response) => {
              if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError)
              } else {
                resolve(response)
              }
            }
          )
        })
      })
    })

    // 5. Verify response from content script
    expect(selection).toEqual({
      type: "CURRENT_SELECTION_RESPONSE",
      text: "Test Selection Content"
    })
  })
})
