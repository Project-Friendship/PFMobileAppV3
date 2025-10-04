// tests/app.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Homepage Tests', () => {
  test('Should Load homepage to Project Friendship', async ({ page }) => {
    await page.goto('http://localhost:8081/');
    await expect(page).toHaveTitle("my_amplify_app");
    const header = page.locator('h1');
    await expect(header).toBeVisible();
  });
});

// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'; 