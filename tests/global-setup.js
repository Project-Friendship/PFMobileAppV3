import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'fs';
import path from 'path';
import { createHtmlReport } from 'axe-html-reporter';

// urls for pages
const urls = [
  'http://localhost:8081/',
  'http://localhost:8081/Home',
  'http://localhost:8081/events',
  'http://localhost:8081/community',
  'http://localhost:8081/alert',
  'http://localhost:8081/relationships',
];

async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const reportDir = path.join(process.cwd(), 'test-results', 'accessibility-reports');
  fs.mkdirSync(reportDir, { recursive: true });

  for (const url of urls) {
    const label = url.replace('http://localhost:8081/', '').replace('/', '') || 'home';

    console.log(`🔍 Running global accessibility scan for: ${label}`);

    await page.goto(url);
    const results = await new AxeBuilder({ page }).analyze();

//json report
    fs.writeFileSync(
      path.join(reportDir, `${label}-global-accessibility.json`),
      JSON.stringify(results, null, 2)
    );

//html report
    createHtmlReport({
      results,
      options: {
        outputDir: reportDir,
        reportFileName: `${label}-global-accessibility.html`,
      },
    });
  }

  await browser.close();
}

export default globalSetup;
