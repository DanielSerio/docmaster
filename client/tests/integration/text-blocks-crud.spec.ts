import { test, expect } from '@playwright/test';

test.describe('Text Blocks CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the text blocks page before each test
    await page.goto('/textblocks');

    // Wait for the page to load
    await expect(page.getByTestId('page-heading')).toBeVisible();
  });

  test('should display text blocks list in view mode', async ({ page }) => {
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

    // Should show an empty row for adding new text blocks
    const contentTextarea = page.getByTestId('textarea-rawContent').first();
    await expect(contentTextarea).toBeVisible();
  });

  test('should create a new text block', async ({ page }) => {
    // Enter edit mode
    await page.getByTestId('edit-button').click();

    // Find the first empty row inputs
    const contentTextarea = page.getByTestId('textarea-rawContent').first();
    const priorityInput = page.getByTestId('input-defaultPriority').first();

    // Fill in text block content
    await contentTextarea.fill('Test text block content');

    // Set priority
    await priorityInput.fill('75');

    // Save the changes
    await page.getByTestId('save-button').click();

    // Should exit edit mode after save
    await expect(page.getByTestId('edit-button')).toBeVisible({ timeout: 5000 });
  });

  test('should edit an existing text block', async ({ page }) => {
    // First create a text block
    await page.getByTestId('edit-button').click();

    const contentTextarea = page.getByTestId('textarea-rawContent').first();
    await contentTextarea.fill('Original text block content');

    await page.getByTestId('save-button').click();
    await expect(page.getByTestId('edit-button')).toBeVisible({ timeout: 5000 });

    // Now edit the text block
    await page.getByTestId('edit-button').click();

    // Find the first text block's textarea
    const firstContentTextarea = page.getByTestId('textarea-rawContent').first();

    // Update the content
    await firstContentTextarea.clear();
    await firstContentTextarea.fill('Updated text block content');

    // Save
    await page.getByTestId('save-button').click();

    // Verify the update
    await expect(page.getByTestId('edit-button')).toBeVisible({ timeout: 5000 });
  });

  test('should delete a text block', async ({ page }) => {
    // First create a text block
    await page.getByTestId('edit-button').click();

    const contentTextarea = page.getByTestId('textarea-rawContent').first();
    await contentTextarea.fill('Text block to delete');

    await page.getByTestId('save-button').click();
    await expect(page.getByTestId('edit-button')).toBeVisible({ timeout: 5000 });

    // Enter edit mode
    await page.getByTestId('edit-button').click();

    // Find and click the delete button for the first text block
    const deleteButton = page.getByTestId('delete-button').first();
    await deleteButton.click();

    // The row should be marked as deleted (opacity reduced)
    // We can verify by checking if the delete button is disabled
    await expect(deleteButton).toBeDisabled();

    // Save the changes
    await page.getByTestId('save-button').click();

    // Verify the text block is deleted - we're back in view mode
    await expect(page.getByTestId('edit-button')).toBeVisible({ timeout: 5000 });
  });

  test('should disable save immediately on entering edit mode when no changes exist', async ({ page }) => {
    await page.getByTestId('edit-button').click();
    const saveButton = page.getByTestId('save-button');
    await expect(saveButton).toBeDisabled();
  });

  test('should keep save disabled when only content is filled (empty content)', async ({ page }) => {
    await page.getByTestId('edit-button').click();
    const saveButton = page.getByTestId('save-button');

    // Empty string should not enable save
    const contentTextarea = page.getByTestId('textarea-rawContent').last();
    await contentTextarea.fill('');

    await expect(saveButton).toBeDisabled();
  });

  test('should enable save after required content is provided', async ({ page }) => {
    await page.getByTestId('edit-button').click();
    const saveButton = page.getByTestId('save-button');

    const contentTextareas = page.getByTestId('textarea-rawContent');
    const targetIndex = (await contentTextareas.count()) - 1;

    const contentTextarea = contentTextareas.nth(targetIndex);
    await contentTextarea.fill('Valid text block content');

    await expect(saveButton).toBeEnabled();
  });

  test('should validate priority range', async ({ page }) => {
    // Enter edit mode
    await page.getByTestId('edit-button').click();

    const contentTextarea = page.getByTestId('textarea-rawContent').first();
    const priorityInput = page.getByTestId('input-defaultPriority').first();

    // Fill required content
    await contentTextarea.fill('Test content');

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
    const contentTextarea = page.getByTestId('textarea-rawContent').first();
    await contentTextarea.fill('Unsaved changes');

    // Setup dialog handler to accept the confirmation
    page.on('dialog', dialog => dialog.accept());

    // Click cancel
    await page.getByTestId('cancel-button').click();

    // Should return to view mode
    await expect(page.getByTestId('edit-button')).toBeVisible();
  });

  test('should handle keyboard shortcuts', async ({ page }) => {
    // Enter edit mode
    await page.getByTestId('edit-button').click();

    // Make some changes
    const contentTextarea = page.getByTestId('textarea-rawContent').first();
    await contentTextarea.fill('Test with keyboard');

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

    const contentTextarea = page.getByTestId('textarea-rawContent').first();
    await contentTextarea.fill('Test loading state');

    // Slow down the network to catch loading state
    await page.route('**/trpc/textBlock.batchUpdate**', async (route) => {
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
    // First, create some initial text blocks to work with
    await page.getByTestId('edit-button').click();

    // Create first text block
    let contentTextarea = page.getByTestId('textarea-rawContent').first();
    await contentTextarea.fill('Text block to keep');

    // Create second text block (this one will be edited)
    contentTextarea = page.getByTestId('textarea-rawContent').nth(1);
    await contentTextarea.fill('Text block to edit');

    // Create third text block (this one will be deleted)
    contentTextarea = page.getByTestId('textarea-rawContent').nth(2);
    await contentTextarea.fill('Text block to delete');

    // Save initial text blocks
    await page.getByTestId('save-button').click();
    await expect(page.getByTestId('edit-button')).toBeVisible({ timeout: 5000 });

    // Now perform batch operations: create new, edit existing, delete existing
    await page.getByTestId('edit-button').click();

    // Delete the third text block
    const deleteButton = page.getByTestId('delete-button').nth(2);
    await deleteButton.click();
    await expect(deleteButton).toBeDisabled();

    // Edit the second text block
    const editContentTextarea = page.getByTestId('textarea-rawContent').nth(1);
    await editContentTextarea.clear();
    await editContentTextarea.fill('Text block has been edited');

    // Create a new fourth text block
    const newContentTextarea = page.getByTestId('textarea-rawContent').nth(3);
    await newContentTextarea.fill('Newly created text block');

    // Save all changes in one batch operation
    await page.getByTestId('save-button').click();

    // Verify we're back in view mode (batch save succeeded)
    await expect(page.getByTestId('edit-button')).toBeVisible({ timeout: 5000 });
  });

  test('should allow normal arrow key navigation in textarea for text editing', async ({ page }) => {
    // Enter edit mode
    await page.getByTestId('edit-button').click();

    const contentTextarea = page.getByTestId('textarea-rawContent').first();
    await contentTextarea.fill('Line 1\nLine 2\nLine 3');

    // Focus the textarea
    await contentTextarea.click();

    // Move cursor to beginning
    await page.keyboard.press('Control+Home');

    // Use arrow keys to move within the textarea (without Shift)
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');

    // The focus should still be on the same textarea (not navigated to another cell)
    const focusedElement = await page.locator(':focus');
    await expect(focusedElement).toHaveAttribute('data-testid', 'textarea-rawContent');
  });

  test('should navigate to next cell with Shift+Arrow in textarea', async ({ page }) => {
    // First create two text blocks so we have multiple rows
    await page.getByTestId('edit-button').click();

    let contentTextarea = page.getByTestId('textarea-rawContent').first();
    await contentTextarea.fill('First block');

    contentTextarea = page.getByTestId('textarea-rawContent').nth(1);
    await contentTextarea.fill('Second block');

    await page.getByTestId('save-button').click();
    await expect(page.getByTestId('edit-button')).toBeVisible({ timeout: 5000 });

    // Now test Shift+Arrow navigation
    await page.getByTestId('edit-button').click();

    // Focus the first textarea
    const firstTextarea = page.getByTestId('textarea-rawContent').first();
    await firstTextarea.click();

    // Use Shift+ArrowRight to navigate to the next cell (priority input)
    await page.keyboard.press('Shift+ArrowRight');

    // The focus should now be on the priority input
    const focusedElement = await page.locator(':focus');
    await expect(focusedElement).toHaveAttribute('data-testid', 'input-defaultPriority');
  });

  test('should handle multi-line content in textarea', async ({ page }) => {
    // Enter edit mode
    await page.getByTestId('edit-button').click();

    const contentTextarea = page.getByTestId('textarea-rawContent').first();
    const multiLineContent = 'Line 1\nLine 2\nLine 3\nLine 4';
    await contentTextarea.fill(multiLineContent);

    // Save
    await page.getByTestId('save-button').click();
    await expect(page.getByTestId('edit-button')).toBeVisible({ timeout: 5000 });

    // Verify multi-line content is preserved
    // Re-enter edit mode and check the content
    await page.getByTestId('edit-button').click();
    const savedTextarea = page.getByTestId('textarea-rawContent').first();
    await expect(savedTextarea).toHaveValue(multiLineContent);
  });

  test('should validate that content is required (not empty or whitespace-only)', async ({ page }) => {
    await page.getByTestId('edit-button').click();
    const saveButton = page.getByTestId('save-button');

    const contentTextarea = page.getByTestId('textarea-rawContent').first();

    // Try whitespace-only content
    await contentTextarea.fill('   \n   \n   ');

    // Save should be disabled for whitespace-only content
    await expect(saveButton).toBeDisabled();

    // Add actual content
    await contentTextarea.fill('Valid content');

    // Save should now be enabled
    await expect(saveButton).toBeEnabled();
  });
});
