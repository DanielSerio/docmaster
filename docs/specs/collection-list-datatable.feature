Feature: Collection List DataTable Implementation

  As a user managing document collections
  I want to view collections in a data table with filtering, sorting, and pagination
  So that I can efficiently browse and manage my collections

  Background:
    Given the collection list page uses the DataTable component
    And the DataTable supports pagination, filtering, and sorting
    And collections have name, createdAt, and updatedAt fields

  Scenario: Display collections in data table
    Given collections exist in the system
    When the user navigates to the collections page
    Then the collections should be displayed in a data table
    And each row should show the collection name, created date, and updated date
    And a line number should be displayed for each row
    And the table should have a title bar with "Collections" heading
    And a "Create Collection" button should be visible in the title bar

  Scenario: Navigate to collection details
    Given collections are displayed in the data table
    When the user clicks on a collection name
    Then they should be navigated to that collection's detail page
    And the collection name should be styled as a link

  Scenario: Filter collections by name
    Given the collections table has a name filter
    When the user types text into the name filter
    Then the table should display only collections matching the search text
    And the filter should be case-insensitive
    And the pagination should update to reflect filtered results

  Scenario: Filter collections by creation date range
    Given the collections table has a created date filter
    When the user selects a date range for creation date
    Then the table should display only collections created within that range
    And the filter should support partial ranges (only from or only to)
    And the pagination should update to reflect filtered results

  Scenario: Sort collections by name
    Given the collections table has sortable columns
    When the user clicks the name column header
    Then collections should be sorted by name in ascending order
    And the column should show an ascending sort indicator
    When the user clicks the name column header again
    Then collections should be sorted by name in descending order
    And the column should show a descending sort indicator

  Scenario: Sort collections by creation date
    Given the collections table has sortable columns
    When the user clicks the created date column header
    Then collections should be sorted by creation date in ascending order
    When the user clicks the created date column header again
    Then collections should be sorted by creation date in descending order

  Scenario: Multi-column sorting
    Given the collections table supports multi-column sorting
    When the user sorts by name
    And the user holds Shift and clicks the created date column
    Then collections should be sorted by name first, then by creation date
    And both columns should show sort indicators with priority badges

  Scenario: Paginate through collections
    Given there are more collections than fit on one page
    When the user is on the first page
    Then a pagination control should be visible
    When the user clicks to go to the next page
    Then the next set of collections should be displayed
    And the page indicator should update

  Scenario: Filters and sorting persist across pagination
    Given the user has applied filters and sorting
    When the user navigates to a different page
    Then the filters and sorting should remain applied
    And the displayed collections should reflect the active filters and sort

  Scenario: Create new collection
    Given the user is on the collections page
    When the user clicks the "Create Collection" button
    Then they should be navigated to the new collection form page

  Scenario: Empty state when no collections exist
    Given no collections exist in the system
    When the user navigates to the collections page
    Then an empty state should be displayed
    And the empty state should show "No Collections" title
    And the empty state should show a description encouraging collection creation
    And the "Create Collection" button should still be visible

  Scenario: Empty state when filters match no collections
    Given collections exist but none match the applied filters
    When the user has active filters
    Then an empty state should be displayed
    And the filters should remain visible and editable
    And the user should be able to clear filters to see results

  Scenario: Loading state while fetching collections
    Given the collections are being fetched from the server
    When the page is loading
    Then a loading skeleton should be displayed
    And the skeleton should show the table structure
    When the data loads
    Then the skeleton should be replaced with actual collection data

  Scenario: Error handling for failed collection fetch
    Given there is an error fetching collections
    When the error occurs
    Then the error should be displayed to the user
    And the error context should handle the error appropriately
