Feature: Override table for general document associations
  As an editor I want to override priority and enable/disable text blocks per general document so I can tailor content per document.

  Scenario: View override table in view mode
    Given I am on a document page with associated entities
    Then I see the override table in view mode
    And the Edit action is visible
    And Save and Cancel actions are hidden

  Scenario: Enter edit mode
    When I click Edit
    Then Save and Cancel actions become visible

  Scenario: Validate required fields
    When I enter edit mode
    Then Save is disabled until there are meaningful valid changes

  Scenario: Adjust priority and enablement
    Given I am in edit mode
    When I change priority or toggle enablement for an association
    And I click Save
    Then the overrides are persisted
    And the table returns to view mode

  Scenario: Cancel edits
    Given I have unsaved changes in edit mode
    When I click Cancel
    Then I am prompted to discard changes
    And the table returns to view mode without saving if I confirm

  Scenario: Applies to general documents
    Given a general document with text-block associations
    When I edit overrides
    Then I can adjust priority and enablement for each text block for that document
