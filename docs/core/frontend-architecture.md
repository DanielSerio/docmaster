# Frontend Architecture Patterns

## Data Table Pattern

The data table component follows a strict, standardized pattern that must be followed for all table implementations. This pattern ensures consistency, maintainability, and proper separation of concerns.

### The Four-Step Pattern

Every table page MUST follow these four steps in order:

1. **Fetch data with a query hook**
2. **Attach line numbers using `useDataTableRows`**
3. **Define columns using a column definition hook**
4. **Pass everything to `<DataTable>`**

### Pattern Implementation

```typescript
export function EntityListPage() {
  // Step 1: Fetch data with query hook
  const listQuery = useEntityListQuery();

  // Step 2: Attach line numbers
  const rows = useDataTableRows(listQuery.data);

  // Step 3: Get column definitions
  const columnDefs = useEntityTableColumns();

  // Step 4: Pass to DataTable
  return (
    <Page>
      <DataTable
        id="entity-list"
        rows={rows}
        columnDefs={columnDefs}
        getRowId={(row) => `${row.id}`}
        isLoading={listQuery.isLoading}
        error={listQuery.error as Error | null}
      />
    </Page>
  );
}
```

### Reference Implementation

See `client/src/modules/Document/pages/DocumentListPage.tsx` for the canonical reference implementation of this pattern.

### Hook Organization

All hooks for a table feature should be organized in the entity's hooks directory:

```
src/modules/[Entity]/hooks/[entity]-list/
├── index.ts                          # Barrel export
├── use[Entity]ListQuery.tsx          # Step 1: Query hook
└── use[Entity]TableColumns.tsx       # Step 3: Column definition hook
```

The `useDataTableRows` hook (Step 2) is global and imported from `@/hooks/data-table`.

### Query Hook Pattern

Query hooks should:
- Use tRPC for API calls
- Accept parameters for pagination, sorting, and filtering
- Export the record type for use in column definitions

```typescript
export function useEntityListQuery() {
  return trpc.entity.getAll.useQuery();
}

export type EntityRecord = NonNullable<
  ReturnType<typeof useEntityListQuery>['data']
>[number];
```

### Column Definition Hook Pattern

Column definition hooks should:
- Use `useMemo` to prevent unnecessary re-renders
- Define all columns with proper typing
- Include the `lineNumber` column as the first column
- Use the `DTColumnDef` type from `@/components/data-table`
- Reference the record type from the query hook

```typescript
import { useMemo } from 'react';
import type { DTColumnDef, DTRowRecord } from '@/components/data-table';
import type { EntityRecord } from './useEntityListQuery';

export function useEntityTableColumns() {
  return useMemo(() => {
    return [
      {
        id: 'lineNumber',
        header: '#',
        enableColumnFilter: false,
        enableGlobalFilter: false,
        meta: {
          align: 'center',
          size: { min: 80, max: 80 }
        }
      },
      {
        id: 'fieldName',
        accessorKey: 'fieldName',
        header: 'Field Name',
        meta: {
          size: { min: 200, max: 200 }
        }
      }
      // ... more columns
    ] satisfies DTColumnDef<DTRowRecord<EntityRecord>, unknown>[];
  }, []);
}
```

### State Management for API Queries

Any state that manipulates the API query (pagination, sorting, filtering, etc.) should be:
1. Declared in the page component
2. Passed as parameters to the query hook
3. NOT managed inside the query hook itself

Example with pagination:

```typescript
export function EntityListPage() {
  // Declare state ABOVE the query hook
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);

  // Pass state into query hook
  const listQuery = useEntityListQuery({ page, pageSize });

  const rows = useDataTableRows(listQuery.data);
  const columnDefs = useEntityTableColumns();

  return (
    <Page>
      <DataTable
        id="entity-list"
        rows={rows}
        columnDefs={columnDefs}
        getRowId={(row) => `${row.id}`}
        isLoading={listQuery.isLoading}
        error={listQuery.error as Error | null}
        // Pass state handlers to table
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </Page>
  );
}
```

### Why This Pattern?

1. **Consistency**: Every table follows the same structure
2. **Separation of Concerns**: Data fetching, transformation, and presentation are separate
3. **Type Safety**: TypeScript ensures correct data flow through all steps
4. **Maintainability**: Each step is isolated and can be updated independently
5. **Testability**: Each hook can be tested in isolation
6. **Readability**: The page component clearly shows the data flow

### Common Mistakes to Avoid

❌ **DON'T** fetch data directly in the page component
```typescript
const { data } = trpc.entity.getAll.useQuery(); // Wrong!
```

✅ **DO** use a query hook
```typescript
const listQuery = useEntityListQuery(); // Correct!
```

❌ **DON'T** skip the `useDataTableRows` step
```typescript
<DataTable rows={listQuery.data} ... /> // Wrong! No line numbers
```

✅ **DO** attach line numbers
```typescript
const rows = useDataTableRows(listQuery.data); // Correct!
<DataTable rows={rows} ... />
```

❌ **DON'T** define columns inline
```typescript
<DataTable columnDefs={[{ id: 'name', ... }]} ... /> // Wrong!
```

✅ **DO** use a column definition hook
```typescript
const columnDefs = useEntityTableColumns(); // Correct!
<DataTable columnDefs={columnDefs} ... />
```

❌ **DON'T** manage pagination state inside the query hook
```typescript
export function useEntityListQuery() {
  const [page, setPage] = useState(0); // Wrong!
  return trpc.entity.getAll.useQuery({ page });
}
```

✅ **DO** pass pagination state from the page component
```typescript
export function useEntityListQuery({ page, pageSize }: Params) {
  return trpc.entity.getAll.useQuery({ page, pageSize }); // Correct!
}
```

## Module Organization

Frontend code is organized into three root module directories:

### 1. Feature Modules (`src/modules/`)

Entity-specific features containing UI and business logic:

```
src/modules/[EntityName]/
├── components/       # Entity-specific components
├── hooks/           # Entity-specific hooks (including table hooks)
├── pages/           # Page components
├── types/           # Entity-specific types
├── utils/           # Entity-specific utilities
└── index.ts         # Barrel export
```

### 2. Service Modules (`src/services/`)

Cross-cutting concerns and API integration:

```
src/services/[serviceName]/
├── hooks/           # Service hooks
├── types/           # Service types
├── utils/           # Service utilities
└── index.ts         # Barrel export
```

### 3. Type Modules (`src/types/`)

Shared type definitions used across multiple features:

```
src/types/[typeName]/
├── index.ts         # Type definitions and exports
```

### Global Directories

```
src/
├── components/      # Global UI components (Shadcn UI, DataTable, etc.)
├── hooks/           # Global hooks (useDataTableRows, etc.)
├── lib/             # Libraries and utilities
│   ├── const/      # Global constants
│   ├── schemas/    # Zod schemas
│   └── utils/      # Global utilities
├── routes/         # TanStack Router route definitions
└── stories/        # Storybook stories
```

## Path Alias

The `@` alias resolves to `src/`:

```typescript
import { DataTable } from '@/components/data-table';
import { useEntityListQuery } from '@/modules/Entity/hooks/entity-list';
import { trpc } from '@/lib/trpc/react';
```
