# DataTable Server-Side Sorting - Implementation Notes

## Overview

This feature adds server-side sorting capabilities to DataTable components by reading sortable configurations from column metadata and enabling click-to-sort on column headers. Sort state is managed via TanStack Table's sorting API and passed to the server for database-level sorting.

## Architecture Decisions

### Server-Side vs Client-Side Sorting

**Decision**: Use server-side sorting with TanStack Table's `manualSorting` mode.

**Rationale**:

- Consistent with existing pagination and filtering patterns
- Handles large datasets efficiently
- Reduces client memory usage
- Leverages database indexing for performance
- Maintains consistency with server-side filtering

### Sort State Management

**Decision**: Use TanStack Table's `SortingState` managed by custom `useDataTableSorting` hook.

**Rationale**:

- Native TanStack Table integration
- Type-safe sort state structure
- Built-in multi-column sorting support
- Consistent with library patterns
- Matches filtering implementation pattern

### Sort Configuration Location

**Decision**: Store sortable flag in `columnDef.meta.sortable` (boolean or config object).

**Rationale**:

- Co-located with column definition
- Follows existing pattern for column metadata
- Type-safe via ColumnMeta extension
- Simple boolean for basic sorting, object for advanced config
- Consistent with filter configuration approach

### Sort UI Integration

**Decision**: Integrate sort indicators directly into column headers, not as separate components.

**Rationale**:

- Headers are the natural location for sort controls
- Users expect to click headers to sort
- No additional UI real estate required
- Standard table sorting pattern
- Simpler implementation than separate sort controls

## Key Components

### useDataTableSorting Hook

Located: `client/src/hooks/data-table/useDataTableSorting.tsx`

Manages sorting state and provides methods for sort manipulation:

- `sorting`: Current sort state array (SortingState)
- `setSorting`: TanStack Table state setter
- `toggleSort`: Toggle sort for column (none → asc → desc → none)
- `clearSort`: Remove sort for specific column
- `clearAllSorts`: Reset all sorting
- `getSortForColumn`: Retrieve current sort direction for column

Supports both single-column and multi-column sorting based on whether Shift key is pressed.

### Sort Indicator Component

Located: `client/src/components/data-table/subcomponents/DTSortIndicator.tsx`

Visual indicator for sort state:

- Unsorted: Up/down arrows (neutral color)
- Ascending: Up arrow (highlighted)
- Descending: Down arrow (highlighted)
- Multi-sort priority: Small badge with sort order number

Props:

- `direction`: 'asc' | 'desc' | false
- `priority`: number (for multi-column sorting) or undefined

### Column Header Updates

Located: `client/src/components/data-table/DataTable.tsx`

Column header rendering enhancements:

- Check `column.columnDef.meta?.sortable` to determine if sortable
- Add click handler that calls `toggleSort(column.id, event.shiftKey)`
- Render `DTSortIndicator` component for sortable columns
- Add hover styles and cursor pointer for sortable headers
- Include ARIA labels for accessibility

## DataTable Integration

### Updated Props

`DataTableProps` accepts optional `sortingController` prop (same pattern as `pagingController` and `filteringController`).

### Table Configuration

Enable manual sorting mode:

- Set `manualSorting: true` in `useReactTable` config
- Pass `sorting` to table state
- Connect `onSortingChange` callback
- Enable `enableSorting: true` (default)
- Enable `enableMultiSort: true` for Shift+click support

### Sort State Structure

TanStack Table's `SortingState` is an array of sort descriptors:

```typescript
[
  { id: 'columnId', desc: false }, // ascending
  { id: 'otherColumn', desc: true } // descending
]
```

Order in array determines sort priority (first sorts take precedence).

## Query Integration Pattern

### Query Hook Updates

Query hooks accept sorting parameter:

1. Receive `SortingState` from sorting controller
2. Pass sorting directly to tRPC query
3. tRPC handles type-safe transmission to server

Example:

```typescript
const query = trpc.document.getAll.useQuery({
  ...paging,
  filters: columnFilters,
  sorting: sorting // Pass directly
});
```

### Auto-Refetch Behavior

TanStack Query automatically refetches when sort state changes because sorting is included in query key. No manual refetch needed.

## Server Implementation Pattern

### tRPC Input Schema

Accept sorting as `SortingState` directly:

```typescript
input: z.object({
  limit: z.number(),
  offset: z.number(),
  filters: z.array(...).optional(),
  sorting: z
    .array(
      z.object({
        id: z.string(),
        desc: z.boolean()
      })
    )
    .optional()
});
```

### Building Prisma OrderBy Clause

Convert sorting array to Prisma `orderBy`:

- Single sort: `orderBy: { [columnId]: desc ? 'desc' : 'asc' }`
- Multi-sort: `orderBy: [{ col1: 'asc' }, { col2: 'desc' }]`

Map column IDs to actual database field names:

```typescript
const fieldMap: Record<string, string> = {
  'filename': 'filename',
  'type': 'type',
  'createdAt': 'createdAt',
  'updatedAt': 'updatedAt'
};
```

Handle nested relations if needed:

```typescript
orderBy: { collection: { name: 'asc' } }
```

### Null Handling

Prisma's default behavior:

- Ascending: nulls last
- Descending: nulls first

To change: use `nulls: 'first' | 'last'` in Prisma orderBy (Prisma 4.1+).

## Type Safety

### Column Meta Extension

Extend `ColumnMeta` type to include sortable property:

```typescript
type ColumnMeta = {
  align?: 'left' | 'center' | 'right';
  size?: number;
  filter?: DTMetaFilter;
  sortable?: boolean | {
    defaultDirection?: 'asc' | 'desc';
    fieldName?: string; // Override column ID for server
  };
};
```

Boolean for simple sortable flag, object for advanced configuration.

## Usage Pattern

### Page Component Flow

1. Call `useDataTableSorting()` to get sorting controller
2. Destructure `[sorting]` from controller
3. Pass `sorting` to query hook
4. Pass `sortingController` to DataTable
5. Column headers automatically become sortable based on meta

### Column Definition

Add `sortable` property to column meta:

```typescript
meta: {
  sortable: true
}
```

Or with advanced config:

```typescript
meta: {
  sortable: {
    defaultDirection: 'desc',
    fieldName: 'customDatabaseField'
  }
}
```

### Default Sort State

Pass initial sort state to hook:

```typescript
const sortingController = useDataTableSorting({
  defaultSorting: [{ id: 'createdAt', desc: true }]
});
```

## Multi-Column Sorting

### User Interaction

- Normal click: Replace existing sort with new sort
- Shift+click: Add sort to existing sorts
- Clicking through sorted column: asc → desc → none
- Visual priority indicators show sort order

### Sort Priority

Array order determines priority:

```typescript
[
  { id: 'status', desc: false },  // Primary sort
  { id: 'createdAt', desc: true } // Secondary sort
]
```

Results sorted by status first, then by createdAt within each status group.

### Limits

Consider limiting multi-sort to 3-5 columns to avoid confusion and performance issues. Can enforce in hook or UI.

## Performance Considerations

### Database Indexes

Ensure sortable columns have appropriate database indexes:

- Single column indexes for commonly sorted fields
- Composite indexes for frequent multi-column sorts
- Consider index direction (ASC/DESC) for large datasets

### Sort Caching

TanStack Query caches results by query key (includes sort state). Returning to previous sort serves cached data automatically.

### Column ID Mapping

Map column IDs to database fields on server to decouple client column naming from schema:

```typescript
const getFieldName = (columnId: string): string => {
  return fieldMap[columnId] || columnId;
};
```

## Edge Cases & Validation

### Invalid Column IDs

If client sends unknown column ID, server should either:

- Ignore invalid sort and log warning
- Return error response
- Fall back to default sort

Prefer ignoring with warning to avoid breaking UI.

### Conflicting Sorts

Shouldn't happen with proper UI, but if same column appears twice in sort array, take first occurrence and ignore duplicates.

### Sort with Empty Results

Empty result set should still respect sort state for when filters change and results return.

### Sort Direction Persistence

Sort state persists in React state but not URL by default. Consider URL sync for shareable sorted views.

## Accessibility

### Keyboard Support

- Tab navigation to column headers
- Enter/Space to toggle sort
- Shift+Enter/Space for multi-sort
- ARIA labels indicating sortable state and current direction

### ARIA Attributes

```typescript
aria-sort="ascending" | "descending" | "none"
aria-label="Sort by [column name]"
```

### Screen Reader Announcements

Announce sort state changes:

- "Sorted by [column] ascending"
- "Sorted by [column] descending"
- "Sort removed from [column]"

## Testing Strategy

### Unit Tests

- Test sort state toggle logic (none → asc → desc → none)
- Test single vs multi-column sort behavior
- Test sort priority ordering
- Test hook methods (toggleSort, clearSort, clearAllSorts)

### Integration Tests

- Test sort state updates trigger correct API calls
- Test sort parameters correctly passed to server
- Verify sorted results display in table
- Test Shift+click multi-sort interaction

### E2E Tests

- Full user flow: click headers, view sorted results
- Test multi-column sorting with Shift key
- Test sort persistence across pagination
- Test sorting with filters applied
- Test keyboard navigation and accessibility

## Future Enhancements

### Saved Sort Preferences

Remember user's preferred sort order per table in local storage or user preferences API.

### Custom Sort Functions

Allow columns to provide custom sort logic for complex data types:

```typescript
meta: {
  sortable: {
    customSortFn: (a, b) => { /* custom logic */ }
  }
}
```

### Natural Sorting

Implement natural/alphanumeric sorting for strings with numbers:

- "item1", "item2", "item10" (natural)
- vs "item1", "item10", "item2" (alphabetic)

### Sort by Multiple Fields per Column

Allow single column to sort by multiple fields:

```typescript
orderBy: [
  { lastName: 'asc' },
  { firstName: 'asc' }
]
```

Triggered by single column click, but sorts by multiple related fields.

### Visual Sort History

Show breadcrumb-style sort history: "Sorted by: Status (asc) → Created (desc)"

### Sort Performance Metrics

Track and display sort performance for admin/debug purposes.

## References

- TanStack Table Sorting: https://tanstack.com/table/v8/docs/guide/sorting
- TanStack Table Manual Sorting: https://tanstack.com/table/v8/docs/guide/sorting#manual-server-side-sorting
- Prisma OrderBy: https://www.prisma.io/docs/concepts/components/prisma-client/sorting
- Frontend architecture: `docs/core/frontend-architecture.md`
