import { test as base, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createHtmlReport } from 'axe-html-reporter';
import fs from 'fs';
import path from 'path';

export const test = base.extend({
  checkAccessibility: async ({ page }, use, testInfo) => {
    await use(async label => {
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag2aaa', 'wcag21aaa'])
        .disableRules(['landmark-one-main', 'page-has-heading-one', 'region'])
        .analyze();

      // Unique paths avoid overwriting reports across browsers and retries.
      const reportDir = testInfo.outputPath('accessibility');
      fs.mkdirSync(reportDir, { recursive: true });
      const jsonPath = path.join(reportDir, `${label}.json`);
      fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
      createHtmlReport({
        results,
        options: { outputDir: path.relative(process.cwd(), reportDir), reportFileName: `${label}.html` },
      });
      await testInfo.attach(`${label}-accessibility`, {
        path: jsonPath,
        contentType: 'application/json',
      });
      await testInfo.attach(`${label}-accessibility-html`, {
        path: path.join(reportDir, `${label}.html`),
        contentType: 'text/html',
      });

      // Preserve the existing critical-only gate; report all other violations.
      const critical = results.violations.filter(v => v.impact === 'critical');
      expect(critical, `${label} has critical accessibility issues`).toEqual([]);
      return results;
    });
  },
});
