import { test } from './accessibilityFixture';

// Signed-out auth screens only. Protected flows require a separate test account.
for (const screen of ['sign-in', 'sign-up', 'password-reset']) {
  test(`${screen} has no critical accessibility violations`, async ({ page, checkAccessibility }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /^sign in$/i }).waitFor();
    if (screen === 'sign-up') {
      await page.getByRole('button', { name: 'Create Account', exact: true }).click();
    } else if (screen === 'password-reset') {
      await page.getByRole('button', { name: /forgot.*password/i }).click();
    }
    await checkAccessibility(screen);
  });
}
