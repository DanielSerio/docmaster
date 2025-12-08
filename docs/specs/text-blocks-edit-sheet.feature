Feature: Text blocks edit sheet
  As an editor I want to view, add, edit, and delete text blocks in an edit sheet so that I can manage them in batches.

  Scenario: View text blocks in view mode
    Given I am on the text blocks page
    Then I see the list of text blocks in view mode
    And the Edit action is visible
    And Save and Cancel actions are hidden

  Scenario: Enter edit mode
    When I click Edit
    Then Save and Cancel actions become visible
    And an empty row for a new text block appears

  Scenario: Validate required fields
    When I enter edit mode
    Then Save is disabled until all required fields for a row are filled

  Scenario: Create a new text block
    Given I am in edit mode
    When I fill required fields in the empty row
    And I click Save
    Then the new text block is persisted
    And the sheet returns to view mode

  Scenario: Update an existing text block
    Given I am in edit mode
    When I change a field on an existing text block
    And I click Save
    Then the changes are persisted
    And the sheet returns to view mode

  Scenario: Delete a text block
    Given I am in edit mode
    When I mark a text block for deletion
    And I click Save
    Then the text block is removed
    And the sheet returns to view mode

  Scenario: Cancel with unsaved changes
    Given I have unsaved changes in edit mode
    When I click Cancel
    Then I am prompted to confirm discarding changes
    And if I confirm, the sheet returns to view mode without saving
