# DataTable Server-Side Filtering - Implementation Notes

## Overview

This feature adds dynamic server-side filtering to DataTable components by reading filter configurations from column metadata and rendering appropriate filter UI controls. Filter state is managed via TanStack Table's column filtering API and serialized to query parameters for server-side filtering.

## Architecture Decisions

### Server-Side vs Client-Side Filtering

**Decision**: Use server-side filtering with TanStack Table's `manualFiltering` mode.

**Rationale**:

- Large datasets cannot be efficiently filtered client-side
- Consistent with existing pagination pattern (also server-side)
- Reduces client memory footprint
- Leverages database query optimization (indexes, etc.)

### Filter State Management

**Decision**: Use TanStack Table's `ColumnFiltersState` managed by custom `useDataTableFiltering` hook.

**Rationale**:

- Native TanStack Table integration
- Type-safe filter state structure
- Consistent with library patterns
- Simplifies table instance configuration

### Filter Configuration Location

**Decision**: Store filter config in `columnDef.meta.filter` alongside existing meta properties (align, size).

**Rationale**:

- Keeps filter definition co-located with column definition
- Follows existing pattern for column metadata
- Type-safe via ColumnMeta extension
- Easy to discover and maintain

### Dynamic Filter UI Generation

**Decision**: Create individual filter components for each type, orchestrated by `DTFilter` component.

**Rationale**:

- Each filter type has unique UI requirements
- Easier to test and maintain individual components
- Allows future custom filter types
- Follows single responsibility principle

## Key Components

### useDataTableFiltering Hook

Located: `client/src/hooks/data-table/useDataTableFiltering.tsx`

Manages column filter state and provides methods for filter manipulation:

- `columnFilters`: Current filter state array
- `setColumnFilters`: TanStack Table state setter
- `setFilter`: Set individual column filter
- `clearFilter`: Remove individual column filter
- `clearAllFilters`: Reset all filters
- `getFilter`: Retrieve current filter value for column

### Filter UI Components

Located: `client/src/components/data-table/filters/`

Five filter component types implementing `DTFilterProps` interface:

1. **DTFilterSearch**: Text input with search icon for substring matching
2. **DTFilterSelect**: Single-select dropdown using Shadcn Select
3. **DTFilterMultiSelect**: Multi-select dropdown with Shadcn DropdownMenu and checkboxes
4. **DTFilterDateRange**: Date range picker using Shadcn Calendar in Popover
5. **DTFilterNumberRange**: Two number inputs for min/max range

Each component:

- Receives current value and onChange handler
- Handles its own internal UI state
- Calls onChange with undefined/null to clear filter
- Uses consistent Shadcn UI components for styling

### DTFilter Orchestrator

Located: `client/src/components/data-table/subcomponents/DTFilter.tsx`

Responsibilities:

- Extract filterable columns from table instance
- Render appropriate filter component based on `meta.filter.type`
- Display column labels above filter controls
- Show "Clear All" button when any filters are active
- Pass filtering controller methods to child components

## DataTable Integration

### Updated Props

`DataTableProps` accepts optional `filteringController` prop (same pattern as `pagingController`).

### Table Configuration

Enable manual filtering mode:

- Set `manualFiltering: true` in `useReactTable` config
- Pass `columnFilters` to table state
- Connect `onColumnFiltersChange` callback

### Compound Component Export

Add `Filter` to compound component export:

```
DataTable.Filter
```

Used within `DataTable.Filters` slot to render filter controls.

## Query Integration Pattern

### Query Hook Updates

Query hooks (like `useDocumentListQuery`) accept filters parameter:

1. Receive `ColumnFiltersState` from filtering controller
2. Pass filters directly to tRPC query (no serialization needed)
3. tRPC handles type-safe transmission to server

Example:

```typescript
const query = trpc.document.getAll.useQuery({
  ...paging,
  filters: columnFilters // Pass directly
});
```

### Auto-Refetch Behavior

TanStack Query automatically refetches when filter state changes because filters are included in query key. No manual refetch needed.

## Server Implementation Pattern

### tRPC Input Schema

Accept filters as `ColumnFiltersState` directly:

```typescript
input: z.object({
  limit: z.number(),
  offset: z.number(),
  filters: z
    .array(
      z.object({
        id: z.string(),
        value: z.unknown()
      })
    )
    .optional()
});
```

tRPC provides type safety - the server receives the exact same filter structure as the client sends.

### Building Prisma Where Clause

Iterate through filters array and build `where` object based on column ID and value type:

- String values: Use `contains` with `mode: 'insensitive'` for text search
- String values (exact match columns): Use exact match for select filters
- Array values: Use `in` operator for multi-select
- Object with `from`/`to`: Use `gte`/`lte` for date ranges
- Object with `min`/`max`: Use `gte`/`lte` for number ranges

Apply same `where` clause to both data query and count query for accurate pagination.

## Type Safety

### Filter Type Discrimination

`DTMetaFilter` is discriminated union based on `type` property:

- Enables type-safe option arrays for select/multi-select
- Prevents options on search/date-range/number-range
- TypeScript enforces correct filter config structure

## Usage Pattern

### Page Component Flow

1. Call `useDataTableFiltering()` to get filtering controller
2. Destructure `[columnFilters]` from controller
3. Pass `columnFilters` to query hook
4. Pass `filteringController` to DataTable
5. Add `<DataTable.Filter>` in Filters slot

### Column Definition

Add `filter` property to column meta:

```typescript
meta: {
  filter: {
    type: 'select',
    options: [
      { value: 'general', label: 'General' },
      { value: 'rule', label: 'Rule' }
    ]
  }
}
```

## Performance Considerations

### Search Input Debouncing

Search filters should implement debouncing to avoid excessive API calls on each keystroke. Consider 300-500ms delay.

Implementation options:

- Add debouncing inside DTFilterSearch component
- Use library like `use-debounce`
- Apply only to search type, not other filter types

### Query Caching

TanStack Query caches results by query key (includes filter state). Navigating back to previously used filter combination serves cached data.

No special handling needed - works automatically with tRPC.

## Edge Cases & Validation

### Empty Filter Values

Empty strings, null, undefined should remove filter from state rather than send to API. Handled in `setFilter` method.

### Invalid Number Ranges

If user enters min > max, still send to API as-is. Server should handle validation and return empty results or error.

Alternative: Add client-side validation to prevent invalid ranges.

### URL Query Params

Filter state is NOT synced to URL by default. This could be future enhancement for shareable filtered views.

### Filter State on Page Change

When navigating to different page using pagination, filter state persists because it's maintained in React state and included in query params.

## Testing Strategy

### Unit Tests

- Test each filter component with different value types
- Test serializeFilters utility with all filter types
- Test useDataTableFiltering hook state management

### Integration Tests

- Test filter state updates trigger correct API calls
- Test filter params correctly passed to server
- Verify filtered results display in table
- Test Clear All functionality

### E2E Tests

- Full user flow: apply filters, paginate, clear filters
- Test multiple filters simultaneously
- Test filter persistence across page navigation
- Test empty state when no results match

## Future Enhancements

### Saved Filter Presets

Allow users to save favorite filter combinations and quickly apply them. Store in local storage or user preferences API.

### URL Sync

Sync filter state with URL query parameters for shareable filtered views. Use TanStack Router's search params feature.

### Advanced Filter Operators

Extend filter types to support operators:

- Text: contains, starts with, ends with, equals
- Numbers: equals, less than, greater than, between
- Dates: before, after, between, relative (last 7 days, etc.)

Requires updating filter types, UI components, and server-side handling.

### Custom Filter Components

Allow columns to provide custom filter component via meta:

```typescript
meta: {
  filter: {
    type: 'custom',
    component: MyCustomFilter
  }
}
```

### Filter Validation

Add validation to filter inputs:

- Required fields
- Min/max constraints
- Format validation (emails, phone numbers, etc.)

Display validation errors inline with filter controls.

### Filter Indicator Badges

Show active filter count badge on column headers or in table header to indicate which columns are filtered.

## References

- TanStack Table Column Filtering: https://tanstack.com/table/v8/docs/guide/column-filtering
- TanStack Table Manual Filtering: https://tanstack.com/table/v8/docs/guide/column-filtering#manual-server-side-filtering
- Existing filter types: `client/src/components/data-table/filters.types.ts`
- Frontend architecture: `docs/core/frontend-architecture.md`
