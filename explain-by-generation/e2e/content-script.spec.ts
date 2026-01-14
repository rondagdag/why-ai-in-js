import { test, expect, chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('Content Script E2E', () => {
    let context: import('@playwright/test').BrowserContext;


    test.beforeAll(async () => {
        const pathToExtension = path.join(__dirname, '../dist');
        const userDataDir = '/tmp/test-user-data-dir-content-script';
        context = await chromium.launchPersistentContext(userDataDir, {
            headless: false,
            args: [
                `--disable-extensions-except=${pathToExtension}`,
                `--load-extension=${pathToExtension}`,
            ],
        });
    });

    test.afterAll(async () => {
        await context.close();
    });

    test('should communicate with background script', async () => {
        // 1. Find the background worker
        let backgroundPage: import('@playwright/test').Worker | undefined;
        let retries = 10;
        while (retries > 0) {
            backgroundPage = context.serviceWorkers().find(worker => worker.url().startsWith('chrome-extension://'));
            if (backgroundPage) break;
            await new Promise(r => setTimeout(r, 500));
            retries--;
        }
        expect(backgroundPage).toBeDefined();

        // 2. Open a test page
        const page = await context.newPage();
        await page.goto('https://example.com');

        // 3. Select some text on the page
        await page.evaluate(() => {
            // Select the h1 element
            const range = document.createRange();
            const h1 = document.querySelector('h1');
            if (h1) {
                range.selectNodeContents(h1);
                const selection = window.getSelection();
                selection?.removeAllRanges();
                selection?.addRange(range);
            }
        });

        // 4. Send message from background to content script to get selection
        const selection = await backgroundPage!.evaluate(() => {
            return new Promise((resolve, reject) => {
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    const tab = tabs[0];
                    if (!tab?.id) {
                        reject(new Error('No active tab found'));
                        return;
                    }
                    chrome.tabs.sendMessage(tab.id, { type: 'GET_CURRENT_SELECTION' }, (response) => {
                        if (chrome.runtime.lastError) {
                            reject(chrome.runtime.lastError);
                        } else {
                            resolve(response);
                        }
                    });
                });
            });
        });

        // 5. Verify response from content script
        expect(selection).toEqual({
            type: 'CURRENT_SELECTION_RESPONSE',
            text: 'Example Domain'
        });
    });
});
