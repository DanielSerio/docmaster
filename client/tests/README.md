# Playwright Tests

This directory contains integration and end-to-end tests for the DocMaster client application.

## Test Structure

- `integration/` - Integration tests that test feature flows and API interactions
- `e2e/` - End-to-end tests that test complete user workflows

## Running Tests

### Using Docker Test Environment (Recommended)

DocMaster has a dedicated test environment that runs in Docker with isolated containers for the database, server, client, and test runner.

**From the project root:**

```bash
# Run tests in headless mode (for CI/automated testing)
./start-test.sh

# Run tests with Playwright UI (for debugging and development)
./start-test.sh --ui
```

**Headless Mode** (`./start-test.sh`):
1. Builds and starts test containers (db, server, client)
2. Waits for services to be ready
3. Runs the Playwright test suite in headless mode
4. Displays test results (✅ passed or ❌ failed)
5. Saves results to `client/playwright-report/`
6. Keeps infrastructure running for debugging

**UI Mode** (`./start-test.sh --ui`):
1. Builds and starts test containers
2. Launches Playwright UI at http://127.0.0.1:9323
3. Provides interactive test debugging with:
   - Live test execution
   - Step-by-step playback
   - DOM snapshots at each step
   - Network activity viewer
   - Console logs
   - Screenshots and videos
4. Press Ctrl+C to stop when done

**Ports:**
- Test Server: http://localhost:3001
- Test Client: http://localhost:5174
- Test Database: localhost:5433
- Playwright UI (when using --ui): http://127.0.0.1:9323

**After tests complete:**

```bash
# View detailed HTML report (headless mode only)
cd client && npx playwright show-report

# Stop all test containers when done
./stop-all.sh
```

**Run tests again without rebuilding:**

```bash
# Infrastructure must be running
docker-compose -f docker-compose.test.yml run --rm test-runner
```

### Running Tests Locally (Without Docker)

If you prefer to run tests locally without Docker:

**Prerequisites:**
- Development environment must be running (server on port 3000, client on port 5173)
- PostgreSQL must be running

```bash
cd client

# Run all tests
npm test

# Run tests in UI mode (interactive)
npm run test:ui

# Run tests in headed mode (see the browser)
npm run test:headed

# Run specific test file
npx playwright test tests/integration/rules-crud.spec.ts

# Run tests matching a pattern
npx playwright test --grep "should create a new rule"
```

## Writing Tests

### Test Selectors

Always use `data-testid` attributes for selecting elements:

```tsx
// Component
<Button data-testid="save-button">Save</Button>

// Test
await page.getByTestId('save-button').click();
```

### Test Organization

Each test file should:
- Use `test.describe()` to group related tests
- Use `test.beforeEach()` for common setup
- Have clear, descriptive test names
- Test one behavior per test case

### Example Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/feature-path');
  });

  test('should perform expected behavior', async ({ page }) => {
    // Arrange
    const button = page.getByTestId('action-button');

    // Act
    await button.click();

    // Assert
    await expect(page.getByText('Success')).toBeVisible();
  });
});
```

## Test Coverage

### Rules CRUD (`integration/rules-crud.spec.ts`)

Tests for the rules EditSheet component including:
- Viewing rules list
- Entering/exiting edit mode
- Creating new rules with category type-ahead
- Editing existing rules
- Deleting rules
- Validation (required fields, priority range)
- Canceling changes with confirmation
- Using existing categories from suggestions
- Keyboard shortcuts (Escape, Ctrl+S)
- Loading states during save

### Health Check (`integration/health-check.spec.ts`)

Tests for the server health check endpoint including:
- Displaying health status
- Loading states
- Error handling

## Debugging Tests

### Viewing Test Results

After running tests with `./start-test.sh`, view the HTML report:

```bash
cd client
npx playwright show-report
```

The report will be available at `client/playwright-report/index.html` and includes:
- Test results and status
- Screenshots on failure
- Execution traces
- Test artifacts

### Debug in UI Mode (Local Only)

For interactive debugging, run tests locally (not in Docker):

```bash
cd client
npm run test:ui
```

Then click on a test to see:
- Step-by-step execution
- Screenshots at each step
- Network requests
- Console logs

### Debug Single Test (Local Only)

```bash
cd client
npx playwright test --debug tests/integration/rules-crud.spec.ts
```

### Running Tests in Docker Test Environment Manually

Advanced usage for running specific tests or debugging:

```bash
# Start only the infrastructure (no tests)
docker-compose -f docker-compose.test.yml up -d db-test server client

# Run all tests
docker-compose -f docker-compose.test.yml run --rm test-runner

# Run specific test file
docker-compose -f docker-compose.test.yml run --rm test-runner npx playwright test tests/integration/rules-crud.spec.ts

# Run tests matching a pattern
docker-compose -f docker-compose.test.yml run --rm test-runner npx playwright test --grep "should create"

# Run tests in headed mode (requires X11 forwarding on Linux/Mac)
docker-compose -f docker-compose.test.yml run --rm test-runner npx playwright test --headed

# Generate test report
docker-compose -f docker-compose.test.yml run --rm test-runner npx playwright show-report
```

## CI/CD

Tests run automatically in CI with:
- Isolated Docker test environment
- 2 retries for flaky tests
- HTML report artifacts
- Screenshots on failure
- Test results saved to `playwright-report/`

## Best Practices

1. **Use semantic selectors**: Prefer `getByRole()`, `getByLabel()`, `getByTestId()` over CSS selectors
2. **Wait for elements**: Use `expect().toBeVisible()` instead of manual waits
3. **Isolate tests**: Each test should be independent and not rely on other tests
4. **Clean state**: Use `beforeEach` to ensure clean state for each test
5. **Descriptive names**: Test names should clearly describe what is being tested
6. **Handle dialogs**: Set up dialog handlers before triggering actions that open dialogs
7. **Network mocking**: Use `page.route()` to mock slow/failing network requests

## Common Issues

### Test Timeout

Increase timeout for specific assertions:

```typescript
await expect(element).toBeVisible({ timeout: 10000 }); // 10 seconds
```

### Element Not Found

Ensure element is rendered before interacting:

```typescript
await expect(element).toBeVisible();
await element.click();
```

### Dialog Not Handled

Set up dialog handler before triggering:

```typescript
page.on('dialog', dialog => dialog.accept());
await page.getByTestId('delete-button').click();
```

### Network Race Conditions

Wait for network to settle:

```typescript
await page.getByTestId('save-button').click();
await expect(page.getByTestId('edit-button')).toBeVisible({ timeout: 5000 });
```
