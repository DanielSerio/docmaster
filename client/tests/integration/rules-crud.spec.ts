import { test, expect } from '@playwright/test';

test.describe('Rules CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the rules page before each test
    await page.goto('/rules');

    // Wait for the page to load
    await expect(page.getByRole('heading', { name: 'Rules' })).toBeVisible();
  });

  test('should display rules list in view mode', async ({ page }) => {
    // Should show Edit button in view mode
    const editButton = page.getByTestId('edit-button');
    await expect(editButton).toBeVisible();

    // Should not show Save/Cancel buttons in view mode
    await expect(page.getByTestId('save-button')).not.toBeVisible();
    await expect(page.getByTestId('cancel-button')).not.toBeVisible();
  });

  test('should enter edit mode when clicking Edit button', async ({ page }) => {
    // Click Edit button
    await page.getByTestId('edit-button').click();

    // Should show Save and Cancel buttons in edit mode
    await expect(page.getByTestId('save-button')).toBeVisible();
    await expect(page.getByTestId('cancel-button')).toBeVisible();

    // Should hide Edit button in edit mode
    await expect(page.getByTestId('edit-button')).not.toBeVisible();

    // Should show an empty row for adding new rules
    const contentInput = page.getByTestId('input-rawContent').first();
    await expect(contentInput).toBeVisible();
  });

  test('should create a new rule', async ({ page }) => {
    // Enter edit mode
    await page.getByTestId('edit-button').click();

    // Find the first empty row inputs
    const contentInput = page.getByTestId('input-rawContent').first();
    const categoryTrigger = page.getByTestId('category-typeahead-trigger').first();
    const priorityInput = page.getByTestId('input-defaultPriority').first();

    // Fill in rule content
    await contentInput.fill('Test rule content');

    // Select category (or create new one)
    await categoryTrigger.click();

    // Type a new category name
    const categoryInput = page.getByTestId('category-typeahead-input');
    await categoryInput.fill('Test Category');

    // Select the "Create new" option
    const createNewOption = page.getByTestId('category-create-new');
    await createNewOption.click();

    // Set priority
    await priorityInput.fill('75');

    // Save the changes
    await page.getByTestId('save-button').click();

    // Should exit edit mode after save
    await expect(page.getByTestId('edit-button')).toBeVisible({ timeout: 5000 });

    // Should display the new rule in view mode
    await expect(page.getByText('Test rule content')).toBeVisible();
    await expect(page.getByText('Test Category')).toBeVisible();
    await expect(page.getByText('75')).toBeVisible();
  });

  test('should edit an existing rule', async ({ page }) => {
    // First create a rule
    await page.getByTestId('edit-button').click();

    const contentInput = page.getByTestId('input-rawContent').first();
    await contentInput.fill('Original rule content');

    const categoryTrigger = page.getByTestId('category-typeahead-trigger').first();
    await categoryTrigger.click();
    const categoryInput = page.getByTestId('category-typeahead-input');
    await categoryInput.fill('Original Category');
    await page.getByTestId('category-create-new').click();

    await page.getByTestId('save-button').click();
    await expect(page.getByTestId('edit-button')).toBeVisible({ timeout: 5000 });

    // Now edit the rule
    await page.getByTestId('edit-button').click();

    // Find the first rule's inputs
    const firstContentInput = page.getByTestId('input-rawContent').first();

    // Update the content
    await firstContentInput.clear();
    await firstContentInput.fill('Updated rule content');

    // Save
    await page.getByTestId('save-button').click();

    // Verify the update
    await expect(page.getByTestId('edit-button')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Updated rule content')).toBeVisible();
    await expect(page.getByText('Original rule content')).not.toBeVisible();
  });

  test('should delete a rule', async ({ page }) => {
    // First create a rule
    await page.getByTestId('edit-button').click();

    const contentInput = page.getByTestId('input-rawContent').first();
    await contentInput.fill('Rule to delete');

    const categoryTrigger = page.getByTestId('category-typeahead-trigger').first();
    await categoryTrigger.click();
    const categoryInput = page.getByTestId('category-typeahead-input');
    await categoryInput.fill('Delete Category');
    await page.getByTestId('category-create-new').click();

    await page.getByTestId('save-button').click();
    await expect(page.getByTestId('edit-button')).toBeVisible({ timeout: 5000 });

    // Enter edit mode
    await page.getByTestId('edit-button').click();

    // Find and click the delete button for the first rule
    const deleteButton = page.getByTestId('delete-button').first();
    await deleteButton.click();

    // The row should be marked as deleted (opacity reduced)
    // We can verify by checking if the delete button is disabled
    await expect(deleteButton).toBeDisabled();

    // Save the changes
    await page.getByTestId('save-button').click();

    // Verify the rule is deleted
    await expect(page.getByTestId('edit-button')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Rule to delete')).not.toBeVisible();
  });

  test('should prevent saving with invalid data', async ({ page }) => {
    // Enter edit mode
    await page.getByTestId('edit-button').click();

    // Try to save without filling required fields
    const saveButton = page.getByTestId('save-button');

    // Save button should be disabled when validation fails
    await expect(saveButton).toBeDisabled();

    // Fill only the content (missing category)
    const contentInput = page.getByTestId('input-rawContent').first();
    await contentInput.fill('Test content');

    // Save button should still be disabled (missing category)
    await expect(saveButton).toBeDisabled();

    // Add category
    const categoryTrigger = page.getByTestId('category-typeahead-trigger').first();
    await categoryTrigger.click();
    const categoryInput = page.getByTestId('category-typeahead-input');
    await categoryInput.fill('Valid Category');
    await page.getByTestId('category-create-new').click();

    // Now save button should be enabled
    await expect(saveButton).toBeEnabled();
  });

  test('should validate priority range', async ({ page }) => {
    // Enter edit mode
    await page.getByTestId('edit-button').click();

    const contentInput = page.getByTestId('input-rawContent').first();
    const priorityInput = page.getByTestId('input-defaultPriority').first();
    const categoryTrigger = page.getByTestId('category-typeahead-trigger').first();

    // Fill required fields
    await contentInput.fill('Test content');
    await categoryTrigger.click();
    const categoryInput = page.getByTestId('category-typeahead-input');
    await categoryInput.fill('Test Category');
    await page.getByTestId('category-create-new').click();

    // Try invalid priority (too high)
    await priorityInput.fill('150');

    // Save button should be disabled
    const saveButton = page.getByTestId('save-button');
    await expect(saveButton).toBeDisabled();

    // Try invalid priority (too low)
    await priorityInput.clear();
    await priorityInput.fill('0');
    await expect(saveButton).toBeDisabled();

    // Set valid priority
    await priorityInput.clear();
    await priorityInput.fill('50');
    await expect(saveButton).toBeEnabled();
  });

  test('should cancel changes with confirmation', async ({ page }) => {
    // Enter edit mode
    await page.getByTestId('edit-button').click();

    // Make some changes
    const contentInput = page.getByTestId('input-rawContent').first();
    await contentInput.fill('Unsaved changes');

    // Setup dialog handler to accept the confirmation
    page.on('dialog', dialog => dialog.accept());

    // Click cancel
    await page.getByTestId('cancel-button').click();

    // Should return to view mode
    await expect(page.getByTestId('edit-button')).toBeVisible();

    // Changes should not be saved
    await expect(page.getByText('Unsaved changes')).not.toBeVisible();
  });

  test('should use existing category from suggestions', async ({ page }) => {
    // First create a rule with a category
    await page.getByTestId('edit-button').click();

    let contentInput = page.getByTestId('input-rawContent').first();
    await contentInput.fill('First rule');

    let categoryTrigger = page.getByTestId('category-typeahead-trigger').first();
    await categoryTrigger.click();
    let categoryInput = page.getByTestId('category-typeahead-input');
    await categoryInput.fill('Existing Category');
    await page.getByTestId('category-create-new').click();

    await page.getByTestId('save-button').click();
    await expect(page.getByTestId('edit-button')).toBeVisible({ timeout: 5000 });

    // Now create another rule and use the existing category
    await page.getByTestId('edit-button').click();

    contentInput = page.getByTestId('input-rawContent').first();
    await contentInput.fill('Second rule');

    categoryTrigger = page.getByTestId('category-typeahead-trigger').first();
    await categoryTrigger.click();
    categoryInput = page.getByTestId('category-typeahead-input');

    // Type partial match
    await categoryInput.fill('Exist');

    // Should show the existing category in suggestions
    const existingOption = page.getByTestId('category-option-Existing Category');
    await expect(existingOption).toBeVisible();
    await existingOption.click();

    await page.getByTestId('save-button').click();
    await expect(page.getByTestId('edit-button')).toBeVisible({ timeout: 5000 });

    // Both rules should have the same category
    const categoryTexts = await page.getByText('Existing Category').all();
    expect(categoryTexts.length).toBe(2);
  });

  test('should handle keyboard shortcuts', async ({ page }) => {
    // Enter edit mode
    await page.getByTestId('edit-button').click();

    // Make some changes
    const contentInput = page.getByTestId('input-rawContent').first();
    await contentInput.fill('Test with keyboard');

    // Setup dialog handler for Escape confirmation
    page.on('dialog', dialog => dialog.accept());

    // Press Escape to cancel
    await page.keyboard.press('Escape');

    // Should return to view mode
    await expect(page.getByTestId('edit-button')).toBeVisible();
  });

  test('should show loading state during save', async ({ page }) => {
    // Enter edit mode
    await page.getByTestId('edit-button').click();

    const contentInput = page.getByTestId('input-rawContent').first();
    await contentInput.fill('Test loading state');

    const categoryTrigger = page.getByTestId('category-typeahead-trigger').first();
    await categoryTrigger.click();
    const categoryInput = page.getByTestId('category-typeahead-input');
    await categoryInput.fill('Test Category');
    await page.getByTestId('category-create-new').click();

    // Slow down the network to catch loading state
    await page.route('**/trpc/rule.batchUpdate**', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.continue();
    });

    // Click save
    const saveButton = page.getByTestId('save-button');
    await saveButton.click();

    // Check for disabled state (button becomes disabled during save)
    await expect(saveButton).toBeDisabled();
  });
});
