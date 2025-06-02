import { test, expect, Page } from '@playwright/test';

function uniqueUser() {
    const email = `e2e_test_user_${Date.now()}@example.com`;
    const firstName = `E2E_${Date.now()}`;
    return { email, firstName };
}

async function getUserIdByName(page: Page, firstName: string, lastName: string) {
    const cell = page.locator(`td[data-user-id][data-user-id]:has-text("${firstName} ${lastName}")`);
    return await cell.getAttribute('data-user-id');
}

test.describe('Admin Actions', () => {
  test.beforeEach(async ({ page }) => {
    // Log in as admin before each test
    await page.goto('/');
    const email = process.env.TEST_ADMIN_EMAIL;
    const password = process.env.TEST_ADMIN_PASSWORD;
    if (!email || !password) {
      throw new Error('TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD must be set');
    }
    await page.fill('input[name=email]', email);
    await page.fill('input[name=password]', password);
    await page.click('button[type=submit]');
    await page.waitForURL('/admin/members', { timeout: 10000 });
  });

  test('Admin can create and then delete a user', async ({ page }) => {
    await page.goto('/admin/members');
    await page.click('[id="user-modal-btn"]');
    const { email, firstName } = uniqueUser();
    await page.fill('input[name=email]', email);
    await page.fill('input[name=password]', 'TestPassword123');
    await page.fill('input[name=firstName]', firstName);
    await page.fill('input[name=lastName]', 'TestUser');
    await page.click('[data-testid="custom-select-userType"]');
    await page.click('[data-testid="custom-select-option-Mentor"]');
    await page.fill('input[name=companyName]', 'TestCo');
    await page.click('button[type=submit]');
    await expect(page.locator('[data-message="user-created-success"]')).toBeVisible();

    // Get the user id from the table
    const userId = await getUserIdByName(page, firstName, 'TestUser');
    await expect(page.locator(`[data-user-id="${userId}"]`)).toBeVisible();

    // Delete the user
    await page.click(`[data-btn-id="${userId}"]`);
    await expect(page.locator(`[data-user-id="${userId}"]`)).not.toBeVisible();
  });

  test('Form does not submit with empty required fields (HTML5 validation)', async ({ page }) => {
    await page.goto('/admin/members');
    await page.click('[id="user-modal-btn"]');
    // Try to submit with all fields empty
    await page.click('button[type=submit]');
    // The form should not close, and no success or custom error message should appear
    await expect(page.locator('[data-message="user-created-success"]')).not.toBeVisible();
    await expect(page.locator('[data-message="user-created-error"]')).not.toBeVisible();
    // Optionally, check that at least one input is :invalid
    const invalidInputs = await page.locator('input:invalid').count();
    expect(invalidInputs).toBeGreaterThan(0);
  });

  test('Shows custom error for invalid input (Zod validation)', async ({ page }) => {
    await page.goto('/admin/members');
    await page.click('[id="user-modal-btn"]');
    // Fill required fields, but with invalid data
    const { email, firstName } = uniqueUser();
    await page.fill('input[name=email]', email);
    await page.fill('input[name=password]', 'short');
    await page.fill('input[name=firstName]', firstName);
    await page.fill('input[name=lastName]', 'TestUser');
    await page.click('[data-testid="custom-select-userType"]');
    await page.click('[data-testid="custom-select-option-Mentor"]');
    await page.fill('input[name=companyName]', 'TestCo');
    await page.click('button[type=submit]');
    // Your Zod error message should appear
    await expect(page.locator('[data-message="user-created-error"]')).toBeVisible();
    // Optionally, check the error text
    const errorText = await page.locator('[data-message="user-created-error"]').textContent();
    expect(errorText).toContain('Password must be at least 8 characters');
  });
});