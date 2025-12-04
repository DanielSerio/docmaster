# DataTable Server-Side Filtering - Task List

## Core Infrastructure

- [ ] Create `useDataTableFiltering` hook in `client/src/hooks/data-table/`
- [ ] Add `FilteringController` type export
- [ ] Update `client/src/hooks/data-table/index.ts` to export filtering hook
- [ ] Extend column meta type to include `filter` property
- [ ] Update `DataTableProps` to accept optional `filteringController`
- [ ] Update `DataTable.tsx` to enable `manualFiltering` mode
- [ ] Update `DataTable.tsx` to pass `columnFilters` state to table instance

## Filter UI Components

- [ ] Create `client/src/components/data-table/filters/` directory
- [ ] Create base `DTFilterProps` interface in `filters/types.ts`
- [ ] Implement `DTFilterSearch` component (search input with icon)
- [ ] Implement `DTFilterSelect` component (single select dropdown)
- [ ] Implement `DTFilterMultiSelect` component (multi-select with badges)
- [ ] Implement `DTFilterDateRange` component (date range picker with calendar)
- [ ] Implement `DTFilterNumberRange` component (min/max number inputs)
- [ ] Create `client/src/components/data-table/filters/index.ts` barrel export

## Filter Orchestrator

- [ ] Create `DTFilter` component in `client/src/components/data-table/subcomponents/`
- [ ] Implement logic to extract filterable columns from table
- [ ] Implement filter component selection based on filter type
- [ ] Add column labels above each filter control
- [ ] Add "Clear All" button that appears when filters are active
- [ ] Update `DataTable` export to include `Filter` compound component

## API Integration

- [ ] Update `useDocumentListQuery` to accept `filters` parameter
- [ ] Pass `filters` directly to tRPC query (no serialization needed)

## Server-Side Implementation

- [ ] Update tRPC `document.getAll` input schema to accept `filters` array
- [ ] Create utility to build Prisma `where` clause from filters array
- [ ] Handle string filters (text search with contains)
- [ ] Handle select filters (exact match)
- [ ] Handle multi-select filters (in operator with array)
- [ ] Handle date range filters (gte/lte with from/to)
- [ ] Handle number range filters (gte/lte with min/max)
- [ ] Support partial range filters (only min, only max)
- [ ] Test server-side filtering with various filter combinations

## Integration & Testing

- [ ] Update `DocumentListPage` to use `useDataTableFiltering` hook
- [ ] Pass `filteringController` to DataTable component
- [ ] Add `DataTable.Filter` component to Filters slot
- [ ] Pass `columnFilters` to `useDocumentListQuery`
- [ ] Add filter configurations to document table column definitions
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
