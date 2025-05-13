import { test, expect } from '@playwright/test';

test('login sets secure cookies and redirects to dashboard', async ({ page, context }) => {
  // Go to login page
  await page.goto('http://localhost:3000/');

  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  if (!email || !password) {
    throw new Error('TEST_USER_EMAIL and TEST_USER_PASSWORD must be set');
  }

  // Fill in credentials (replace with valid test user)
  await page.fill('input[name=email]', email);
  await page.fill('input[name=password]', password);

  // Submit the form
  await page.click('button[type=submit]');

  // Wait for redirect to dashboard
  await page.waitForURL('/dashboard', { timeout: 10000 });

  // Check cookies
  const cookies = await context.cookies();
  const userTypeCookie = cookies.find(c => c.name === 'user_type');
  expect(userTypeCookie).toBeDefined();
  expect(userTypeCookie?.httpOnly).toBe(true);
  expect(userTypeCookie?.secure).toBe(true);
  expect(userTypeCookie?.sameSite?.toLowerCase()).toBe('lax');

  // Optionally, check dashboard UI
  await expect(page.locator('text=Sign Out')).toBeVisible();
}); 