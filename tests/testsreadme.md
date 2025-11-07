Accessibility Testing with Playwright + axe-core
This project integrates **axe-core with Playwright** to automatically scan pages for accessibility issues and generate reports.

This setup uses:
- **@axe-core/playwright** → runs accessibility scans in the browser  
- **axe-html-reporter** → generates easy-to-read HTML reports  
- **Playwright fixtures** → reusable accessibility test helper  
- **Global setup** → optional, runs one-time scans before tests  


Getting Started:
1. install dependencies
Make sure you have Node.js (>=18) installed. Then run:
npm install

install playwright broswers using:
npx playwright install

2. run the local server using: 
npm run dev
npm run --web
http://localhost:8081

3. to run playwright tests use:
npx playwright test

4. view reports using: 
npx playwright show-report


5. helpful commands and troubleshooting:
npx playwright test tests/example.spec.ts **Run this and replace example.spec.ts**
npx playwright test --ui **debugs in browser**
npx playwright codegen http://localhost:8081 **interactive way to record a new test**
npx playwright test --last-failed **Re-runs failed tests**
rm -rf playwright-report ** 





