import { test, expect } from '@playwright/test';

test.describe('Application Integration', () => {
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
