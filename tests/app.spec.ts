// tests/app.spec.ts
import { test, expect } from '@playwright/test';

const pages = [
  { url: 'http://localhost:8081/', name: 'Home' },
  { url: 'http://localhost:8081/home', name: 'Home Page' },
  { url: 'http://localhost:8081/events', name: 'Events' },
  { url: 'http://localhost:8081/community', name: 'Community' },
  { url: 'http://localhost:8081/alert', name: 'Alert' },
  { url: 'http://localhost:8081/relationships', name: 'Relationships' },
];

test.describe('Page Load Tests', () => {
  for (const pageInfo of pages) {
    test(`Should load ${pageInfo.name} page`, async ({ page }) => {
      await page.goto(pageInfo.url, { waitUntil: 'networkidle' });
      await expect(page).toHaveTitle("my_amplify_app");
      // Wait for page to be fully loaded
      await page.waitForLoadState('networkidle');
      // Verify the page loaded with content
      const body = page.locator('body');
      await expect(body).toBeVisible();
      // Check if h1 exists, verify it's visible
      const h1 = page.locator('h1');
      const hasH1 = await h1.count() > 0;
      if (hasH1) {
        await expect(h1.first()).toBeVisible();
      }
    });
  }
}); 