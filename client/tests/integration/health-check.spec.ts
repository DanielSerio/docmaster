import { test, expect } from '@playwright/test';

test.describe('Health Check Integration', () => {
  test('should display server health status', async ({ page }) => {
    await page.goto('/');

    // Wait for the health check result to appear
    const healthCheckResult = page.getByTestId('health-check-result');
    await expect(healthCheckResult).toBeVisible({ timeout: 10000 });

    // Verify status is "ok"
    await expect(healthCheckResult).toContainText('Status: ok');

    // Verify timestamp is present and in ISO format
    const timestampText = await healthCheckResult.locator('p').filter({ hasText: 'Timestamp:' }).textContent();
    expect(timestampText).toMatch(/Timestamp: \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);

    // Verify uptime is present and is a number
    const uptimeText = await healthCheckResult.locator('p').filter({ hasText: 'Server Uptime:' }).textContent();
    expect(uptimeText).toMatch(/Server Uptime: \d+\.\d{2}s/);
  });

  test('should show loading state initially', async ({ page }) => {
    // Slow down the network to catch the loading state
    await page.route('**/trpc/**', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      await route.continue();
    });

    await page.goto('/');

    // Check for loading state
    const loadingText = page.getByText('Loading...');
    await expect(loadingText).toBeVisible();
  });

  test('should handle server connection errors gracefully', async ({ page }) => {
    // Intercept and fail the health check request
    await page.route('**/trpc/health.check**', (route) => {
      route.abort('failed');
    });

    await page.goto('/');

    // Should show error message
    const errorText = page.getByText(/Error:/);
    await expect(errorText).toBeVisible({ timeout: 10000 });
  });
});
