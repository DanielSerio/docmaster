# DataTable Server-Side Sorting - Task List

## Core Infrastructure

- [x] Create `useDataTableSorting` hook in `client/src/hooks/data-table/`
- [x] Add `SortingController` type export
- [x] Update `client/src/hooks/data-table/index.ts` to export sorting hook
- [x] Extend column meta type to include `sortable` property (boolean or config object)
- [x] Update `DataTableProps` to accept optional `sortingController`
- [x] Update `DataTable.tsx` to enable `manualSorting` mode
- [x] Update `DataTable.tsx` to pass `sorting` state to table instance

## Sort UI Components

- [x] Create sort indicator icon component in `client/src/components/data-table/subcomponents/`
- [x] Implement ascending sort icon (arrow up)
- [x] Implement descending sort icon (arrow down)
- [x] Implement unsorted/sortable icon (arrows up/down)
- [x] Add sort priority badge for multi-column sorting
- [x] Style sort indicators to match table header design

## Column Header Integration

- [x] Update column header rendering to detect sortable columns
- [x] Add click handler to sortable column headers
- [x] Implement Shift+click detection for multi-column sorting
- [x] Display appropriate sort indicator based on column sort state
- [x] Add hover state for sortable column headers
- [ ] Ensure accessibility (ARIA labels, keyboard support)
- [x] Add cursor pointer for sortable columns

## Sorting Logic

- [x] Implement sort state toggle logic (none → asc → desc → none)
- [x] Implement single-column sort (replace existing sort)
- [x] Implement multi-column sort with Shift key (append to existing sorts)
- [x] Handle sort priority order for multi-column sorting
- [x] Implement clearSort method to remove specific column sort
- [x] Implement clearAllSorts method to reset all sorting

## API Integration

- [x] Update query hooks to accept `sorting` parameter
- [x] Pass `sorting` directly to tRPC query (SortingState type)
- [x] Ensure sorting works with existing pagination
- [x] Ensure sorting works with existing filtering

## Server-Side Implementation

- [x] Update tRPC router input schemas to accept `sorting` array
- [x] Create utility to build Prisma `orderBy` clause from sorting array
- [x] Handle single-column sorting
- [x] Handle multi-column sorting with priority order
- [x] Map column IDs to database field names
- [ ] Support nested field sorting (e.g., relations)
- [ ] Handle null/undefined values in sorting
- [ ] Test server-side sorting with various column types

## Integration & Testing

- [x] Update `DocumentListPage` to use `useDataTableSorting` hook
- [x] Pass `sortingController` to DataTable component
- [x] Pass `sorting` state to query hook
- [x] Add `sortable: true` to appropriate column definitions
- [ ] Test single-column sorting on various column types
- [ ] Test multi-column sorting with Shift+click
- [ ] Test sort state persistence across pagination
- [ ] Test sorting with filters applied simultaneously
- [ ] Test sort indicators update correctly
- [ ] Test keyboard navigation for sorting
- [ ] Verify loading states during sort changes
- [ ] Test default sort configuration on page load

## Documentation & Polish

- [ ] Add TypeScript JSDoc comments to sorting hook and components
- [ ] Ensure sort indicators follow project styling conventions
- [ ] Verify accessibility (ARIA labels, keyboard navigation, screen reader support)
- [ ] Add proper hover and focus states
- [ ] Consider adding tooltip to explain Shift+click for multi-sort
- [ ] Update frontend architecture documentation if needed
