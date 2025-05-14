import { test, expect } from '@playwright/test';

test('login sets user_type and Supabase auth cookies securely', async ({ page, context }) => {
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

  // Get all cookies for the current domain
  const cookies = await context.cookies();

  // Check user_type cookie
  const userTypeCookie = cookies.find(c => c.name === 'user_type');
  expect(userTypeCookie).toBeDefined();
  expect(userTypeCookie?.sameSite?.toLowerCase()).toBe('lax');
  // user_type is intentionally not httpOnly so it can be read by JS

  // Find Supabase auth cookies by partial name match
  const accessToken = cookies.find(c => c.name.includes('-auth-token.0'));
  const refreshToken = cookies.find(c => c.name.includes('-auth-token.1'));

  expect(accessToken).toBeDefined();
  expect(refreshToken).toBeDefined();


  // Secure will only be true in production/HTTPS
  if (process.env.NODE_ENV === 'production') {
    expect(accessToken?.secure).toBe(true);
  }
  expect(accessToken?.sameSite?.toLowerCase()).toBe('lax');

  // Optionally, check dashboard UI
  await expect(page.locator('text=Sign Out')).toBeVisible();
});

test('failed login shows error and does not set auth cookies', async ({ page, context }) => {
  await page.goto('http://localhost:3000/');
  await page.fill('input[name=email]', 'invalid@example.com');
  await page.fill('input[name=password]', 'wrongpassword');
  await page.click('button[type=submit]');
  // Wait for error message
  await expect(page.locator('text=Invalid email or password')).toBeVisible();
  // Ensure not redirected to dashboard
  expect(page.url()).not.toContain('/dashboard');
  // Ensure no auth cookies are set
  const cookies = await context.cookies();
  const accessToken = cookies.find(c => c.name.includes('-auth-token'));
  expect(accessToken).toBeUndefined();
});

test('protected route redirects unauthenticated users', async ({ page, context }) => {
  // Clear cookies to simulate logged-out state
  await context.clearCookies();
  await page.goto('http://localhost:3000/dashboard/meeting-tracker');
  // Should be redirected to login or home
  await expect(page).not.toHaveURL(/\/dashboard\/meeting-tracker/);
  // Optionally, check for login form or home page content
  await expect(page.locator('text=Welcome back')).toBeVisible();
  // Ensure no auth cookies are set
  const cookies = await context.cookies();
  const accessToken = cookies.find(c => c.name.includes('-auth-token'));
  expect(accessToken).toBeUndefined();
});

test('signout clears all auth cookies', async ({ page, context }) => {
  // Log in first
  await page.goto('http://localhost:3000/');
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;
  if (!email || !password) {
    throw new Error('TEST_USER_EMAIL and TEST_USER_PASSWORD must be set');
  }
  await page.fill('input[name=email]', email);
  await page.fill('input[name=password]', password);
  await page.click('button[type=submit]');
  await page.waitForURL('http://localhost:3000/dashboard', { timeout: 10000 });

  // Click the sign out button
  await page.click('text=Sign Out');

  // Wait for redirect to login or home
  await expect(page.locator('text=Welcome back')).toBeVisible();

  // Get all cookies for the current domain
  const cookies = await context.cookies();

  // Assert that auth and user_type cookies are deleted (robust check)
  const accessToken = cookies.find(c => c.name.includes('-auth-token.0'));
  const refreshToken = cookies.find(c => c.name.includes('-auth-token.1'));
  const userTypeCookie = cookies.find(c => c.name === 'user_type');

  const isAccessTokenDeleted = !accessToken ||
    !accessToken.value ||
    (typeof accessToken.expires === 'number' && accessToken.expires < Date.now() / 1000);

  const isRefreshTokenDeleted = !refreshToken ||
    !refreshToken.value ||
    (typeof refreshToken.expires === 'number' && refreshToken.expires < Date.now() / 1000);

  const isUserTypeDeleted = !userTypeCookie ||
    !userTypeCookie.value ||
    (typeof userTypeCookie.expires === 'number' && userTypeCookie.expires < Date.now() / 1000);

  expect(isAccessTokenDeleted).toBe(true);
  expect(isRefreshTokenDeleted).toBe(true);
  expect(isUserTypeDeleted).toBe(true);
});

test('session expiration logs out user and clears cookies', async ({ page, context }) => {
  // Log in first
  await page.goto('http://localhost:3000/');
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;
  if (!email || !password) {
    throw new Error('TEST_USER_EMAIL and TEST_USER_PASSWORD must be set');
  }
  await page.fill('input[name=email]', email);
  await page.fill('input[name=password]', password);
  await page.click('button[type=submit]');
  await page.waitForURL('http://localhost:3000/dashboard', { timeout: 10000 });

  // Simulate session expiration by clearing auth cookies
  await context.clearCookies();

  // Try to visit a protected route
  await page.goto('http://localhost:3000/dashboard/meeting-tracker');

  // Should be redirected to login or home
  await expect(page).not.toHaveURL(/\/dashboard\/meeting-tracker/);
  await expect(page.locator('text=Welcome back')).toBeVisible();

  // Ensure no auth cookies are set
  const cookies = await context.cookies();
  const accessToken = cookies.find(c => c.name.includes('-auth-token'));
  expect(accessToken).toBeUndefined();
}); 