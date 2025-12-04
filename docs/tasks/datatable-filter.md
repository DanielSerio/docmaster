# DataTable Server-Side Filtering - Task List

## Core Infrastructure

- [x] Create `useDataTableFiltering` hook in `client/src/hooks/data-table/`
- [x] Add `FilteringController` type export
- [x] Update `client/src/hooks/data-table/index.ts` to export filtering hook
- [x] Extend column meta type to include `filter` property
- [x] Update `DataTableProps` to accept optional `filteringController`
- [x] Update `DataTable.tsx` to enable `manualFiltering` mode
- [x] Update `DataTable.tsx` to pass `columnFilters` state to table instance

## Filter UI Components

- [x] Create `client/src/components/data-table/filters/` directory
- [x] Create base `DTFilterProps` interface in `filters/types.ts`
- [x] Implement `DTFilterSearch` component (search input with icon)
- [x] Implement `DTFilterSelect` component (single select dropdown)
- [x] Implement `DTFilterMultiSelect` component (multi-select with badges)
- [x] Implement `DTFilterDateRange` component (date range picker with calendar)
- [x] Implement `DTFilterNumberRange` component (min/max number inputs)
- [x] Create `client/src/components/data-table/filters/index.ts` barrel export

## Filter Orchestrator

- [x] Create `DTFilter` component in `client/src/components/data-table/subcomponents/`
- [x] Implement logic to extract filterable columns from table
- [x] Implement filter component selection based on filter type
- [x] Add column labels above each filter control
- [x] Add "Clear All" button that appears when filters are active
- [x] Update `DataTable` export to include `Filter` compound component

## API Integration

- [x] Update `useDocumentListQuery` to accept `filters` parameter
- [x] Pass `filters` directly to tRPC query (no serialization needed)

## Server-Side Implementation

- [x] Update tRPC `document.getAll` input schema to accept `filters` array
- [x] Create utility to build Prisma `where` clause from filters array
- [x] Handle string filters (text search with contains)
- [x] Handle select filters (exact match)
- [x] Handle multi-select filters (in operator with array)
- [x] Handle date range filters (gte/lte with from/to)
- [x] Handle number range filters (gte/lte with min/max)
- [x] Support partial range filters (only min, only max)
- [ ] Test server-side filtering with various filter combinations

## Integration & Testing

- [x] Update `DocumentListPage` to use `useDataTableFiltering` hook
- [x] Pass `filteringController` to DataTable component
- [x] Add `DataTable.Filter` component to Filters slot
- [x] Pass `columnFilters` to `useDocumentListQuery`
- [x] Add filter configurations to document table column definitions
- [ ] Test search filter on filename column
- [ ] Test select filter on document type column
- [ ] Test date range filter on createdAt column
- [ ] Test multiple filters applied simultaneously
- [ ] Test filter persistence across pagination
- [ ] Test "Clear All" functionality
- [ ] Verify loading states during filter changes
- [ ] Verify empty state when no results match filters

## Documentation & Polish

- [ ] Add TypeScript JSDoc comments to all filtering components
- [ ] Ensure all filter components follow project styling conventions
- [ ] Verify accessibility (ARIA labels, keyboard navigation)
- [ ] Add error handling for invalid filter values
- [ ] Consider debouncing for search input filter
- [ ] Update frontend architecture documentation if needed
