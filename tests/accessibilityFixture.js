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
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag2aaa', 'wcag21aaa'])
        .disableRules([
          'landmark-one-main',      
          'page-has-heading-one',   
          'region'                   
        ])
        .analyze();

      const reportDir = path.join(process.cwd(), 'test-results', 'accessibility-reports');
      fs.mkdirSync(reportDir, { recursive: true });

      // HTML REPORT - use relative path from cwd to avoid path doubling
      const relativeReportDir = 'test-results/accessibility-reports';
      createHtmlReport({
        results,
        options: {
          outputDir: relativeReportDir,
          reportFileName: `${label}-accessibility-report.html`,
        },
      });

      // JSON REPORT
      fs.writeFileSync(
        path.join(reportDir, `${label}-accessibility-report.json`),
        JSON.stringify(results, null, 2)
      );

      // Assert Violations - only fail on critical violations
      // Log all violations for debugging
      if (results.violations.length > 0) {
        console.log(`\n ${label} page has ${results.violations.length} accessibility violation(s):`);
        results.violations.forEach(v => {
          console.log(`   - ${v.id} (${v.impact || 'unknown'}): ${v.description}`);
        });
      }
      
      // Only fail on critical violations
      const criticalViolations = results.violations.filter(v => 
        v.impact === 'critical'
      );
      
      if (criticalViolations.length > 0) {
        console.log(`\n${label} page has ${criticalViolations.length} critical violation(s):`);
        criticalViolations.forEach(v => {
          console.log(`   - ${v.id}: ${v.description}`);
        });
      }
      
      expect(criticalViolations, `${label} page has critical accessibility issues`).toEqual([]);
      return results;
    };

    await use(runAccessibilityScan);
  },
});
