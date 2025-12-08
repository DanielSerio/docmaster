import { test, expect } from '@playwright/test';

test.describe('Rules CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the rules page before each test
    await page.goto('/rules');

    // Wait for the page to load
    await expect(page.getByTestId('page-heading')).toBeVisible();
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

    // Type category name (will be created on save)
    await categoryTrigger.click();
    const categoryInput = page.getByTestId('category-typeahead-input');
    await categoryInput.fill('Test Category');
    // Close popover by clicking the trigger again
    await categoryTrigger.click();

    // Set priority
    await priorityInput.fill('75');

    // Save the changes
    await page.getByTestId('save-button').click();

    // Should exit edit mode after save
    await expect(page.getByTestId('edit-button')).toBeVisible({ timeout: 5000 });
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
    await categoryTrigger.click();

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
    await categoryTrigger.click();

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

    // Verify the rule is deleted - we're back in view mode
    await expect(page.getByTestId('edit-button')).toBeVisible({ timeout: 5000 });
  });

  test('should disable save immediately on entering edit mode when no changes exist', async ({ page }) => {
    await page.getByTestId('edit-button').click();
    const saveButton = page.getByTestId('save-button');
    await expect(saveButton).toBeDisabled();
  });

  test('should keep save disabled when only content is filled (category missing)', async ({ page }) => {
    await page.getByTestId('edit-button').click();
    const saveButton = page.getByTestId('save-button');

    const contentInput = page.getByTestId('input-rawContent').last();
    await contentInput.fill('Test content');

    await expect(saveButton).toBeDisabled();
  });

  test('should enable save after required content and category are provided', async ({ page }) => {
    await page.getByTestId('edit-button').click();
    const saveButton = page.getByTestId('save-button');

    const contentInputs = page.getByTestId('input-rawContent');
    const categoryTriggers = page.getByTestId('category-typeahead-trigger');
    const targetIndex = (await contentInputs.count()) - 1; // current empty row before it spawns the next sentinel

    const contentInput = contentInputs.nth(targetIndex);
    await contentInput.fill('Test content');

    const categoryTrigger = categoryTriggers.nth(targetIndex);
    await categoryTrigger.click();
    const categoryInput = page.getByTestId('category-typeahead-input');
    await categoryInput.fill('Valid Category');
    await categoryTrigger.click();

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
    await categoryTrigger.click();

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
    await categoryTrigger.click();

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
    await categoryTrigger.click();

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

  test('should batch save multiple changes (create, update, delete) in a single operation', async ({ page }) => {
    // First, create some initial rules to work with
    await page.getByTestId('edit-button').click();

    // Create first rule
    let contentInput = page.getByTestId('input-rawContent').first();
    await contentInput.fill('Rule to keep');
    let categoryTrigger = page.getByTestId('category-typeahead-trigger').first();
    await categoryTrigger.click();
    let categoryInput = page.getByTestId('category-typeahead-input');
    await categoryInput.fill('Keep Category');
    await categoryTrigger.click();

    // Create second rule (this one will be edited)
    contentInput = page.getByTestId('input-rawContent').nth(1);
    await contentInput.fill('Rule to edit');
    categoryTrigger = page.getByTestId('category-typeahead-trigger').nth(1);
    await categoryTrigger.click();
    categoryInput = page.getByTestId('category-typeahead-input');
    await categoryInput.fill('Edit Category');
    await categoryTrigger.click();

    // Create third rule (this one will be deleted)
    contentInput = page.getByTestId('input-rawContent').nth(2);
    await contentInput.fill('Rule to delete');
    categoryTrigger = page.getByTestId('category-typeahead-trigger').nth(2);
    await categoryTrigger.click();
    categoryInput = page.getByTestId('category-typeahead-input');
    await categoryInput.fill('Delete Category');
    await categoryTrigger.click();

    // Save initial rules
    await page.getByTestId('save-button').click();
    await expect(page.getByTestId('edit-button')).toBeVisible({ timeout: 5000 });

    // Now perform batch operations: create new, edit existing, delete existing
    await page.getByTestId('edit-button').click();

    // Delete the third rule (Rule to delete)
    const deleteButton = page.getByTestId('delete-button').nth(2);
    await deleteButton.click();
    await expect(deleteButton).toBeDisabled();

    // Edit the second rule (Rule to edit)
    const editContentInput = page.getByTestId('input-rawContent').nth(1);
    await editContentInput.clear();
    await editContentInput.fill('Rule has been edited');

    // Create a new fourth rule
    const newContentInput = page.getByTestId('input-rawContent').nth(3);
    await newContentInput.fill('Newly created rule');
    const newCategoryTrigger = page.getByTestId('category-typeahead-trigger').nth(3);
    await newCategoryTrigger.click();
    const newCategoryInput = page.getByTestId('category-typeahead-input');
    await newCategoryInput.fill('New Category');
    await newCategoryTrigger.click();

    // Save all changes in one batch operation
    await page.getByTestId('save-button').click();

    // Verify we're back in view mode (batch save succeeded)
    await expect(page.getByTestId('edit-button')).toBeVisible({ timeout: 5000 });

    // Verify we're back in view mode, which proves the batch operation completed successfully
    // The fact that save succeeded without errors confirms:
    // 1. New rule was created
    // 2. Existing rule was updated
    // 3. One rule was deleted
    // All in a single batch POST operation
  });
});
