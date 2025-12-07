import { test, expect } from '@playwright/test';

test.describe('Application Integration', () => {
  test('should redirect from root to documents page', async ({ page }) => {
    await page.goto('/');

    // Should redirect to /documents
    await expect(page).toHaveURL(/\/documents$/);

    // Should display Documents heading
    await expect(page.getByTestId('page-heading')).toBeVisible();
    await expect(page.getByTestId('page-heading')).toHaveText('Documents');
  });

  test('should load documents page successfully', async ({ page }) => {
    await page.goto('/documents');

    // Should display Documents heading
    await expect(page.getByTestId('page-heading')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('page-heading')).toHaveText('Documents');
  });

  test('should navigate directly to rules page', async ({ page }) => {
    await page.goto('/rules');

    // Should display Rules heading
    await expect(page.getByTestId('page-heading')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('page-heading')).toHaveText('Rules');
  });
});
