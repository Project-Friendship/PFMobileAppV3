# Testing PFMobileAppV3

Use Node.js 22 and install the committed dependency graph:

```sh
npm ci
```

## Unit tests

```sh
npm test
npm run test:ci
```

Jest discovers only unit tests, not Playwright specs. AWS auth and community
check-in responses are mocked. Tests cover dashboard behavior, partner filters,
map selection, and check-in success, failure/retry, and signed-out behavior.
Coverage is generated in `coverage/` and uploaded by CI.

## Browser tests

```sh
npx playwright install
npm run test:e2e
```

Playwright starts Expo web automatically on port 8082. Stop any existing Expo
server on that port first. Do not start a separate server for these tests.
Startup waits for the rendered sign-in screen, including Expo's first JS build,
before running individual tests.
The test server uses dummy AWS identifiers through a test-only Metro resolver;
it does not require or overwrite your `aws-exports.js`. Normal app startup still
uses your real local configuration.

Tests run in Chromium, Firefox, and WebKit. They check the actual signed-out
login, sign-up, password-reset screens, editable form inputs, and community UI.
They do not verify live Cognito sign-in or the live backend endpoint. Those need
a separate integration environment and test account.

```sh
npm run test:e2e -- --project=chromium
npm run test:ui
npx playwright show-report
```

Accessibility scans preserve the existing critical-only failure threshold and
report other violations. JSON and HTML reports use unique per-test directories
under `test-results/` and are retained with the browser report on CI failures.

## GitHub Actions

One workflow runs separate Jest and Playwright jobs on pushes and pull requests
for `main`, `develop`, and `cicd-playwright-integration`. It can also be run
manually. Browser binaries are installed with Playwright's CLI. The workflow
never deploys the app or changes the backend.

The backend tool versions and construct overrides retain the prior lockfile's
versions. `json-schema-to-ts` is explicitly declared because those bundled
constructs need it for a valid clean install. These are dependency graph fixes;
the Amplify backend source and deployment configuration are unchanged.
