import { test as base, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createHtmlReport } from 'axe-html-reporter';
import fs from 'fs';
import path from 'path';

// Accessibility fixture
export const test = base.extend({
  checkAccessibility: async ({ page }, use) => {
    // Reusable function for accessibility scan
    const runAccessibilityScan = async (label) => {
      const results = await new AxeBuilder({ page }).analyze();

      const reportDir = path.join(process.cwd(), 'test-results', 'accessibility-reports');
      fs.mkdirSync(reportDir, { recursive: true });

      // HTML REPORT
      createHtmlReport({
        results,
        options: {
          outputDir: reportDir,
          reportFileName: `${label}-accessibility-report.html`,
        },
      });

      // JSON REPORT
      fs.writeFileSync(
        path.join(reportDir, `${label}-accessibility-report.json`),
        JSON.stringify(results, null, 2)
      );

      // Assert Violations
      expect(results.violations, `${label} page has accessibility issues`).toEqual([]);
      return results;
    };

    await use(runAccessibilityScan);
  },
});
