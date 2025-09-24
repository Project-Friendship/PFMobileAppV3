// tests/app.spec.ts
import { test, expect } from '@playwright/test';

test.describe('App smoke tests', () => {
  test('should load homepage and show something meaningful', async ({ page }) => {
    await page.goto('http://localhost:8081/');

    // Example: check title
    await expect(page).toHaveTitle(/Your App/i);

    // Example: check an element (adjust selector to your app)
    const header = page.locator('h1');
    await expect(header).toBeVisible();
  });
});


