Feature: DataTable Server-Side Filtering

  As a user viewing data tables
  I want to filter table data using various filter types
  So that I can find specific records efficiently

  Background:
    Given a DataTable component is configured with filterable columns
    And the API supports server-side filtering via query parameters

  Scenario: Display filter controls for filterable columns
    Given the user is viewing a DataTable
    And columns have filter configurations in their meta definitions
    When the page loads
    Then filter controls should render in the Filters slot
    And each filter control should match the type defined in column meta
    And only columns with filter configurations should show filter controls

  Scenario: Filter with search input
    Given a column has a "search" type filter
    When the user types text into the search input
    Then the filter state should update with the search value
    And the API should be called with the filter parameter
    And the table should display filtered results from the server

  Scenario: Filter with single select dropdown
    Given a column has a "select" type filter with options
    When the user selects an option from the dropdown
    Then the filter state should update with the selected value
    And the API should be called with the filter parameter
    And the table should display filtered results matching the selection

  Scenario: Filter with multi-select dropdown
    Given a column has a "multi-select" type filter with options
    When the user selects multiple options
    Then the filter state should update with an array of selected values
    And the API should be called with comma-separated filter values
    And the table should display filtered results matching any selected option

  Scenario: Filter with date range - both dates provided
    Given a column has a "date-range" type filter
    When the user selects a start date and end date
    Then the filter state should update with the date range
    And the API should be called with from and to date parameters
    And the table should display filtered results within the date range

  Scenario: Filter with date range - only start date provided
    Given a column has a "date-range" type filter
    When the user selects only a start date
    Then the filter state should update with only the from date
    And the API should be called with only the from date parameter
    And the table should display filtered results on or after the start date

  Scenario: Filter with date range - only end date provided
    Given a column has a "date-range" type filter
    When the user selects only an end date
    Then the filter state should update with only the to date
    And the API should be called with only the to date parameter
    And the table should display filtered results on or before the end date

  Scenario: Filter with number range - both values provided
    Given a column has a "number-range" type filter
    When the user enters minimum and maximum values
    Then the filter state should update with the number range
    And the API should be called with min and max parameters
    And the table should display filtered results within the number range

  Scenario: Filter with number range - only minimum provided
    Given a column has a "number-range" type filter
    When the user enters only a minimum value
    Then the filter state should update with only the min value
    And the API should be called with only the min parameter
    And the table should display filtered results greater than or equal to the minimum

  Scenario: Filter with number range - only maximum provided
    Given a column has a "number-range" type filter
    When the user enters only a maximum value
    Then the filter state should update with only the max value
    And the API should be called with only the max parameter
    And the table should display filtered results less than or equal to the maximum

  Scenario: Clear individual filter
    Given the user has applied a filter to a column
    When the user clears that specific filter
    Then the filter value should be removed from state
    And the API should be called without that filter parameter
    And the table should display unfiltered results for that column

  Scenario: Clear all filters
    Given the user has applied multiple filters
    When the user clicks the "Clear All" button
    Then all filter values should be removed from state
    And the API should be called without any filter parameters
    And the table should display all results without filtering

  Scenario: Multiple filters applied simultaneously
    Given the user has applied filters to multiple columns
    When all filters are active
    Then the API should be called with all filter parameters
    And the table should display results matching all filter criteria
    And pagination should reflect the filtered result count

  Scenario: Filters persist across pagination
    Given the user has applied filters
    And filtered results span multiple pages
    When the user navigates to the next page
    Then the filters should remain applied
    And the API should include filter parameters with new pagination offset
    And the table should display the next page of filtered results

  Scenario: Empty results with filters applied
    Given the user has applied filters
    When no records match the filter criteria
    Then the table should display the empty state
    And the empty message should indicate no matching results
    And the filters should remain visible and editable

  Scenario: Filter state updates trigger loading state
    Given the user is viewing filtered results
    When the user changes a filter value
    Then the table should display loading skeleton
    And the API request should be sent with updated filters
    And the table should update with new filtered results when loaded
