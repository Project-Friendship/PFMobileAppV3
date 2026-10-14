import { test, expect } from '@playwright/test';

test('sign-in renders the real PF login screen', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('button', { name: /^sign in$/i })).toBeVisible();
  await expect(page.getByRole('img', { name: 'Project Friendship' })).toBeVisible();
  await expect(page.getByText('Skip to home')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('sign-up and password reset can be opened and return to sign-in', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Create Account', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Create Account', exact: true })).toBeVisible();
  await expect(page.getByRole('img', { name: 'Project Friendship' })).toBeVisible();
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.getByRole('button', { name: /forgot.*password/i }).click();
  await expect(page.getByRole('button', { name: /send code|reset password/i })).toBeVisible();
  await page.getByRole('button', { name: /back to sign in/i }).click();
  await expect(page.getByRole('button', { name: /^sign in$/i })).toBeVisible();
});

for (const route of ['/create-event', '/time_entry']) {
  test(`${route} keeps typed date and location values`, async ({ page }) => {
    await page.goto(route);
    await page.getByPlaceholder('e.g. Today').fill('2026-10-13');
    await page.getByPlaceholder('e.g. Weitz Center room 225').fill('Community Center');
    await expect(page.getByPlaceholder('e.g. Today')).toHaveValue('2026-10-13');
    await expect(page.getByPlaceholder('e.g. Weitz Center room 225')).toHaveValue('Community Center');
  });
}

test('community filters actual partner content', async ({ page }) => {
  await page.goto('/community');
  await expect(page.getByText('Activities and Community Partners', { exact: true })).toBeVisible();
  await expect(page.getByText('Tin Tea', { exact: true })).toBeVisible();
  await page.getByText('Sports', { exact: true }).click();
  await expect(page.getByText('Fairfield Inn and Suites', { exact: true })).toBeVisible();
  await expect(page.getByText('Tin Tea', { exact: true })).toHaveCount(0);
});
