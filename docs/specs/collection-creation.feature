Feature: Collection Creation Form

  As a user managing document collections
  I want to create new collections through a form
  So that I can organize my documents into named collections

  Background:
    Given the collection creation form is available at /collections/new
    And the form has a single text input field for name
    And the form has client-side validation
    And the form submits to the collection.create tRPC endpoint

  Scenario: Display collection creation form
    When the user navigates to /collections/new
    Then a form should be displayed with the title "Create Collection"
    And the form should have a description "Fill out the form below to create a new collection."
    And a name input field should be visible
    And the name field should be labeled "Name" with a required indicator
    And a "Create" button should be visible
    And the Create button should be disabled until valid data is entered

  Scenario: Successfully create a collection
    Given the user is on the collection creation form
    When the user enters "My Documents" into the name field
    And the user clicks the Create button
    Then the collection should be created on the server
    And the user should be navigated to the collections list page (/collections)
    And the new collection should appear in the collections list

  Scenario: Validate required name field
    Given the user is on the collection creation form
    When the name field is empty
    Then the Create button should be disabled
    When the user enters text into the name field
    Then the Create button should be enabled

  Scenario: Handle server error during creation
    Given the user is on the collection creation form
    When the user enters valid data
    And the user clicks the Create button
    And the server returns an error
    Then the error should be displayed to the user via the error context
    And the user should remain on the creation form
    And the form data should be preserved

  Scenario: Handle duplicate collection name
    Given a collection named "Existing Collection" already exists
    When the user enters "Existing Collection" into the name field
    And the user clicks the Create button
    Then the server should return a uniqueness constraint error
    And the error should be displayed to the user
    And the user should be able to modify the name and retry

  Scenario: Show loading state during submission
    Given the user is on the collection creation form
    When the user enters valid data
    And the user clicks the Create button
    Then the Create button should show a loading indicator
    And the button should be disabled during submission
    When the creation completes
    Then the loading indicator should disappear

  Scenario: Cancel collection creation
    Given the user is on the collection creation form
    When the user navigates away from the form
    Then no collection should be created
    And any entered form data should be discarded

  Scenario: Form accessibility
    Given the user is on the collection creation form
    Then all form fields should have proper labels
    And the form should be keyboard navigable
    And required fields should be indicated with asterisks
    And validation errors should be announced to screen readers
