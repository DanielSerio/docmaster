# Collection List DataTable Implementation - Task List

## Server-Side Implementation

- [ ] Verify tRPC `collection.getAll` endpoint exists with pagination support
- [ ] Ensure `collection.getAll` accepts `offset` and `limit` parameters
- [ ] Add `filters` parameter to `collection.getAll` input schema
- [ ] Add `sorting` parameter to `collection.getAll` input schema
- [ ] Create `buildCollectionFiltersWhere` utility in `server/src/utils/filters.ts`
- [ ] Create `buildCollectionSortingOrderBy` utility in `server/src/utils/sorting.ts`
- [ ] Update collection service to use filter and sorting utilities
- [ ] Ensure collection service returns pagination metadata (total pages, total records)
- [ ] Test server-side filtering for name field
- [ ] Test server-side sorting for name, createdAt, updatedAt fields

## Client Hooks - Query

- [ ] Create `client/src/modules/Collection/hooks/collection-list/` directory
- [ ] Create `useCollectionListQuery.tsx` hook
- [ ] Accept paging, setError, setTotalPages, filters, and sorting parameters
- [ ] Call `trpc.collection.getAll.useQuery` with parameters
- [ ] Handle error state with useEffect and setError
- [ ] Handle pagination metadata with useEffect and setTotalPages
- [ ] Export `CollectionRecord` type from query data
- [ ] Add barrel export in `client/src/modules/Collection/hooks/collection-list/index.ts`

## Client Hooks - Column Definitions

- [ ] Create `useCollectionTableColumns.tsx` hook
- [ ] Import line number column helper
- [ ] Import date column helpers for createdAt and updatedAt
- [ ] Define name column with Link to collection detail page
- [ ] Add search filter to name column with label and placeholder
- [ ] Add sortable flag to name column
- [ ] Add date-range filter to createdAt column
- [ ] Add sortable flag to createdAt column
- [ ] Add sortable flag to updatedAt column
- [ ] Configure appropriate column sizes (min/max)
- [ ] Export hook from barrel file

## Page Component

- [ ] Create or update `client/src/modules/Collection/pages/CollectionListPage.tsx`
- [ ] Import DataTable component and hooks
- [ ] Import collection-specific hooks (useCollectionListQuery, useCollectionTableColumns)
- [ ] Import Button, Link, and PlusIcon for UI
- [ ] Import useError context
- [ ] Initialize useDataTablePaging controller
- [ ] Initialize useDataTableFiltering controller
- [ ] Initialize useDataTableSorting controller
- [ ] Call useCollectionListQuery with controllers
- [ ] Call useDataTableRows to attach line numbers
- [ ] Call useCollectionTableColumns to get column definitions
- [ ] Render DataTable with id="collection-list"
- [ ] Pass rows, columnDefs, and getRowId props
- [ ] Set isLoading from query
- [ ] Set emptyTitle to "No Collections"
- [ ] Set emptyDescription with helpful message
- [ ] Pass all three controllers to DataTable
- [ ] Add DataTable.TitleBar with "Collections" heading
- [ ] Add "Create Collection" button linking to /collections/new
- [ ] Add DataTable.Filters slot with DataTable.Filter component

## Route Configuration

- [ ] Verify route exists for `/collections` in TanStack Router
- [ ] Verify route component is set to CollectionListPage
- [ ] Verify route for `/collections/new` exists for create button
- [ ] Test navigation from collection list to collection detail page

## Testing & Verification

- [ ] Test collections display in data table
- [ ] Test name column links to collection detail page
- [ ] Test search filter on name column
- [ ] Test date range filter on createdAt column
- [ ] Test sorting by name (asc/desc/none cycle)
- [ ] Test sorting by createdAt
- [ ] Test sorting by updatedAt
- [ ] Test multi-column sorting with Shift+click
- [ ] Test pagination controls
- [ ] Test filter and sort persistence across pagination
- [ ] Test "Create Collection" button navigation
- [ ] Test empty state with no collections
- [ ] Test empty state with filters applied
- [ ] Test loading skeleton display
- [ ] Verify error handling displays errors

## Documentation & Polish

- [ ] Ensure all hooks follow naming conventions
- [ ] Add TypeScript types for all parameters
- [ ] Verify column definitions match schema fields
- [ ] Ensure filter configurations match data types
- [ ] Test responsive behavior of table
- [ ] Verify accessibility of interactive elements
