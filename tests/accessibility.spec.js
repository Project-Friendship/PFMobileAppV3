import { test, expect } from './accessibilityFixture';

const urls = [
  'http://localhost:8081/',
  'http://localhost:8081/Home',
  'http://localhost:8081/events',
  'http://localhost:8081/community',
  'http://localhost:8081/alert',
  'http://localhost:8081/relationships',
];

test.describe('Accessibility tests', () => {
  for (const url of urls) {
    const label = url.replace('http://localhost:8081/', '').replace('/', '') || 'home';

    test(`${label} should have no accessibility violations`, async ({ page, checkAccessibility }) => {
      await page.goto(url);
      await checkAccessibility(label);
    });
  }
});
