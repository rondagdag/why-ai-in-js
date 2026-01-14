import { test, expect } from '@playwright/test';

test.describe('Toxicity Detection Demo', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the demo page
        // Note: Adjust path if serving via a local server
        await page.goto('file://' + process.cwd() + '/index.html');

        // Wait for model to load
        await expect(page.locator('#model-status')).toHaveText('Model Ready', { timeout: 10000 });
        await expect(page.locator('#analyze-btn')).toBeEnabled();
    });

    test('should analyze text when preset chip is clicked', async ({ page }) => {
        // Click the "Safe" preset
        await page.locator('.chip', { hasText: 'Safe' }).click();

        // Check results
        await expect(page.locator('.overall-result')).toHaveClass(/safe/);
        await expect(page.locator('.overall-label .label')).toContainText('CONTENT APPEARS SAFE');

        // Click the "Toxic" preset
        await page.locator('.chip', { hasText: 'Toxic' }).click();

        // Check results
        await expect(page.locator('.overall-result')).toHaveClass(/toxic/);
        await expect(page.locator('.overall-label .label')).toContainText('TOXIC CONTENT DETECTED');
    });

    test('should run real-time analysis when enabled', async ({ page }) => {
        // Enable Real-time toggle
        await page.locator('label.switch').click();

        // Type in the text area
        await page.locator('#text-input').fill('I hate you');

        // Wait for analysis to complete and show results
        // In real-time mode, we don't show the large overlay, but the result should appear
        await expect(page.locator('.overall-result')).toHaveClass(/safe|toxic/, { timeout: 10000 });
    });
});
