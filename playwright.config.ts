import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.[jt]s',
  globalSetup: './tests/warmup.ts',
  timeout: 90_000,
  expect: { timeout: 30_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:8082',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'npm run web:test',
    url: 'http://127.0.0.1:8082',
    timeout: 180_000,
    stdout: 'pipe',
    // Always start our server so tests cannot silently use a developer's AWS config.
    reuseExistingServer: false,
    env: { CI: '1', PF_TEST_CONFIG: '1', EXPO_NO_TELEMETRY: '1' },
  },
});
