import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'fs';
import path from 'path';
import { createHtmlReport } from 'axe-html-reporter';

// urls for pages
const urls = [
  'http://localhost:8081/',
  'http://localhost:8081/home',
  'http://localhost:8081/events',
  'http://localhost:8081/community',
  'http://localhost:8081/alert',
  'http://localhost:8081/relationships',
];

async function globalSetup() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const reportDir = path.join(process.cwd(), 'test-results', 'accessibility-reports');
  fs.mkdirSync(reportDir, { recursive: true });

  // Wait for server to be ready
  console.log('Waiting for server to be ready...');
  let retries = 30;
  while (retries > 0) {
    try {
      const response = await page.goto('http://localhost:8081/', { timeout: 5000, waitUntil: 'networkidle' });
      if (response && response.ok()) {
        break;
      }
    } catch (e) {
      retries--;
      if (retries === 0) throw e;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  for (const url of urls) {
    const label = url.replace('http://localhost:8081/', '').replace('/', '') || 'home';

    console.log(`Running global accessibility scan for: ${label}`);

    await page.goto(url, { timeout: 60000, waitUntil: 'networkidle' });
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag2aaa', 'wcag21aaa'])
      .disableRules([
        'landmark-one-main',      
        'page-has-heading-one',   
        'region'                   
      ])
      .analyze();

//json report
    fs.writeFileSync(
      path.join(reportDir, `${label}-global-accessibility.json`),
      JSON.stringify(results, null, 2)
    );

//html report
    createHtmlReport({
      results,
      options: {
        outputDir: 'test-results/accessibility-reports',
        reportFileName: `${label}-global-accessibility.html`,
      },
    });
  }

  await browser.close();
}

export default globalSetup;
