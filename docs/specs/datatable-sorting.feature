Feature: DataTable Server-Side Sorting

  As a user viewing data tables
  I want to sort table data by clicking column headers
  So that I can view records in my preferred order

  Background:
    Given a DataTable component is configured with sortable columns
    And the API supports server-side sorting via query parameters

  Scenario: Display sort indicators for sortable columns
    Given the user is viewing a DataTable
    And columns have sortable configurations in their meta definitions
    When the page loads
    Then sortable column headers should display sort icons
    And non-sortable columns should not display sort icons
    And the default sort state should be reflected in the UI

  Scenario: Sort column in ascending order
    Given a column is sortable and currently unsorted
    When the user clicks the column header
    Then the sort state should update to ascending for that column
    And the API should be called with the sort parameter
    And the table should display sorted results in ascending order
    And the column header should show an ascending sort indicator

  Scenario: Sort column in descending order
    Given a column is currently sorted in ascending order
    When the user clicks the column header again
    Then the sort state should update to descending for that column
    And the API should be called with the updated sort parameter
    And the table should display sorted results in descending order
    And the column header should show a descending sort indicator

  Scenario: Remove sorting from column
    Given a column is currently sorted in descending order
    When the user clicks the column header again
    Then the sort state should be cleared for that column
    And the API should be called without that sort parameter
    And the table should display results in default order
    And the column header should show no sort indicator

  Scenario: Sort by different column (single column sort)
    Given a column is currently sorted
    When the user clicks a different sortable column header
    Then the previous sort should be removed
    And the new column should be sorted in ascending order
    And the API should be called with only the new sort parameter
    And the table should display results sorted by the new column

  Scenario: Multi-column sorting with Shift key
    Given a column is currently sorted
    When the user holds Shift and clicks another sortable column header
    Then both columns should maintain sort state
    And the API should be called with multiple sort parameters
    And the table should display results sorted by both columns in order
    And both column headers should show sort indicators

  Scenario: Multi-column sorting priority order
    Given multiple columns are sorted
    When the table displays results
    Then sorting should apply in the order columns were clicked
    And earlier sorts should take priority over later sorts
    And sort indicators should reflect the sort priority

  Scenario: Clear individual column sort in multi-sort
    Given multiple columns are sorted
    When the user clicks through a sorted column to remove its sort
    Then only that column's sort should be removed
    And other column sorts should remain active
    And the API should be called with remaining sort parameters
    And the table should display results sorted by remaining columns

  Scenario: Sort state persists across pagination
    Given the user has applied sorting
    And sorted results span multiple pages
    When the user navigates to the next page
    Then the sort should remain applied
    And the API should include sort parameters with new pagination offset
    And the table should display the next page of sorted results

  Scenario: Sort state persists with filters applied
    Given the user has applied both filters and sorting
    When the filters or sort change
    Then both filters and sort should be included in the API call
    And the table should display filtered and sorted results
    And pagination should reflect the filtered and sorted count

  Scenario: Sort state updates trigger loading state
    Given the user is viewing sorted results
    When the user changes the sort order
    Then the table should display loading skeleton
    And the API request should be sent with updated sort parameters
    And the table should update with new sorted results when loaded

  Scenario: Default sort on page load
    Given a DataTable is configured with default sort state
    When the page loads
    Then the default sort should be applied automatically
    And the API should be called with the default sort parameters
    And the appropriate column headers should show sort indicators
    And the table should display results in the default sorted order

  Scenario: Sort numeric columns correctly
    Given a column contains numeric values
    When the user sorts that column
    Then values should be sorted numerically, not alphabetically
    And negative numbers should sort correctly
    And null/undefined values should appear last

  Scenario: Sort date columns correctly
    Given a column contains date values
    When the user sorts that column
    Then dates should be sorted chronologically
    And the most recent or oldest dates should appear first based on direction
    And null/undefined values should appear last

  Scenario: Sort string columns with case-insensitivity
    Given a column contains text values
    When the user sorts that column
    Then values should be sorted alphabetically
    And sorting should be case-insensitive
    And special characters should be handled consistently
