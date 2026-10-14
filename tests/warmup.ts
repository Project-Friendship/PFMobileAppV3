import { chromium, FullConfig } from '@playwright/test';

// Expo serves HTML before its first JS bundle is ready. Wait once for the real
// sign-in screen, so individual tests do not race the cold bundle build.
export default async function warmup(config: FullConfig) {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const baseURL = config.projects[0].use.baseURL;
    if (!baseURL) throw new Error('Browser tests require a baseURL');
    await page.goto(baseURL, { timeout: 240_000 });
    await page.getByRole('button', { name: /^sign in$/i }).waitFor({ timeout: 60_000 });
  } finally {
    await browser.close();
  }
}
