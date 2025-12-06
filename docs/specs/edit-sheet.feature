Feature: Edit Sheet Component for Managing Document Rules

  As a user managing document rules
  I want to quickly add, edit, and delete rules in a table without page navigation
  So that I can efficiently manage multiple rules with a smooth inline editing experience

  Background:
    Given the EditSheet component is similar to DataTable but with edit mode
    And the EditSheet is being implemented for document rules
    And the EditSheet has view mode and edit mode states
    And changes are batched and submitted together on save

  Scenario: Display edit sheet in view mode
    Given the user is viewing a document detail page
    When the edit sheet is in view mode
    Then the table should display all existing child entities
    And each row should show entity fields (content, priority, enabled status)
    And no input fields should be visible
    And an "Edit" button should be visible
    And no "Save" or "Cancel" buttons should be visible
    And the actions column should not be visible

  Scenario: Enter edit mode
    Given the edit sheet is in view mode
    When the user clicks the "Edit" button
    Then the edit sheet should enter edit mode
    And all fields should become editable inputs
    And the actions column should appear with delete buttons
    And an empty row should be added at the bottom
    And the "Edit" button should be hidden
    And "Save" and "Cancel" buttons should appear

  Scenario: Edit existing row in edit mode
    Given the edit sheet is in edit mode
    When the user modifies a field in an existing row
    Then the change should be tracked locally
    And the row should be marked as modified
    And no API call should be made yet

  Scenario: Delete row in edit mode
    Given the edit sheet is in edit mode
    And there are existing rows in the table
    When the user clicks the delete button in the actions column
    Then the row should be marked for deletion
    And the row should be visually indicated as deleted (strikethrough or fade)
    And the row should remain visible but non-editable
    And no API call should be made yet

  Scenario: Add new row by focusing empty bottom row
    Given the edit sheet is in edit mode
    And there is an empty row at the bottom
    When the user focuses any field in the bottom empty row
    Then a new empty row should be automatically added below it
    And the focused field should remain focused
    And the new bottom row becomes the next trigger for auto-adding

  Scenario: Navigate with arrow keys using EditSheetNavigator
    Given the edit sheet is in edit mode
    And the EditSheetNavigator wrapper handles keyboard navigation
    When the user presses the down arrow key
    Then focus should move to the same column in the next row
    When the user presses the up arrow key
    Then focus should move to the same column in the previous row
    When the user presses the right arrow key
    Then focus should move to the next column in the same row
    When the user presses the left arrow key
    Then focus should move to the previous column in the same row

  Scenario: Navigate to next row from last column
    Given the edit sheet is in edit mode
    And the user is focused on the last editable column of a row
    When the user presses the right arrow key
    Then focus should move to the first editable column of the next row

  Scenario: Navigate to previous row from first column
    Given the edit sheet is in edit mode
    And the user is focused on the first editable column of a row
    When the user presses the left arrow key
    Then focus should move to the last editable column of the previous row

  Scenario: Save all changes with batch API call
    Given the edit sheet is in edit mode
    And the user has made multiple changes (new, updated, deleted rows)
    When the user clicks the "Save" button
    Then a batch API request should be sent containing:
      - New entities to create
      - Updated entities with their changes
      - IDs of entities to delete
    And the edit sheet should show a loading state
    When the API call succeeds
    Then the edit sheet should exit edit mode
    And the table should refresh with the updated data
    And a success message should be displayed

  Scenario: Handle save errors
    Given the edit sheet is in edit mode
    And the user clicks the "Save" button
    When the batch API call fails
    Then an error message should be displayed
    And the edit sheet should remain in edit mode
    And all user changes should be preserved
    And the user should be able to retry or cancel

  Scenario: Cancel changes and reset
    Given the edit sheet is in edit mode
    And the user has made changes
    When the user clicks the "Cancel" button
    Then a confirmation dialog should appear if there are unsaved changes
    When the user confirms cancellation
    Then all local changes should be discarded
    And the edit sheet should exit edit mode
    And the table should reset to the original server data

  Scenario: Empty state in view mode
    Given the edit sheet is in view mode
    And there are no child entities
    Then an empty state message should be displayed
    And the "Edit" button should still be visible
    And the user should be able to enter edit mode to add items

  Scenario: Empty state in edit mode
    Given the edit sheet is in edit mode
    And there are no existing entities
    Then one empty row should be displayed
    And the user should be able to start adding content
    And focusing the empty row should add another row below

  Scenario: Validation in edit mode
    Given the edit sheet is in edit mode
    When the user enters invalid data in a field
    Then inline validation errors should appear
    And the "Save" button should be disabled if any row has errors
    And error messages should guide the user to fix issues

  Scenario: Actions column visibility
    Given the edit sheet component
    When in view mode
    Then the actions column should be hidden
    When in edit mode
    Then the actions column should appear
    And each row should have a delete button
    And deleted rows should have the delete button disabled

  Scenario: Preserve focus during auto-add
    Given the edit sheet is in edit mode
    And the user is typing in a field of the bottom empty row
    When the new row is automatically added
    Then the user's cursor should remain in the field
    And the user's typing should not be interrupted
    And the new empty row should appear below without disrupting input

  Scenario: Keyboard shortcuts in edit mode
    Given the edit sheet is in edit mode
    When the user presses Escape
    Then the same behavior as clicking "Cancel" should occur
    When the user presses Ctrl+S (or Cmd+S on Mac)
    Then the same behavior as clicking "Save" should occur if validation passes
