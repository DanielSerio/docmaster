# Collection List DataTable Implementation - Implementation Notes

## Overview

This feature implements the DataTable component for the Collection list page, following the same four-step pattern established for the Document list page. The implementation provides pagination, filtering, and sorting capabilities for browsing document collections.

## Reference Implementation

The Document list page serves as the reference implementation for this feature. The Collection list page should mirror its structure and patterns exactly, with only entity-specific differences (field names, routes, etc.).

**Reference File**: `client/src/modules/Document/pages/DocumentListPage.tsx`

## Architecture Pattern

### Four-Step DataTable Pattern

1. **Fetch data with query hook** (`useCollectionListQuery`)
2. **Attach line numbers** (`useDataTableRows`)
3. **Define columns** (`useCollectionTableColumns`)
4. **Render DataTable** with controllers

This pattern is documented in `docs/core/frontend-architecture.md` and must be followed exactly.

## Server-Side Implementation

### Collection Schema Fields

Based on `docs/core/schema.dbml`:
- `id`: int (primary key)
- `name`: text (unique, not null)
- `createdAt`: timestamp
- `updatedAt`: timestamp

### tRPC Endpoint

Endpoint: `collection.getAll`

**Input Schema**:
```typescript
z.object({
  offset: z.number().default(0),
  limit: z.number().default(10),
  filters: z.array(z.object({
    id: z.string(),
    value: z.unknown()
  })).optional(),
  sorting: z.array(z.object({
    id: z.string(),
    desc: z.boolean()
  })).optional()
})
```

**Output Schema**:
```typescript
z.object({
  paging: z.object({
    offset: z.number(),
    limit: z.number(),
    total: z.object({
      pages: z.number(),
      records: z.number()
    })
  }),
  results: z.array(collectionSchema)
})
```

### Filter Utility

Create `buildCollectionFiltersWhere` in `server/src/utils/filters.ts`:

**Supported Filters**:
- `name`: text search (case-insensitive contains)
- `createdAt`: date range (gte/lte with partial range support)

**Implementation Pattern**:
```typescript
export const buildCollectionFiltersWhere = (filters?: ColumnFilter[]): Prisma.DocumentCollectionWhereInput => {
  if (!filters || filters.length === 0) return {};

  const where: Prisma.DocumentCollectionWhereInput = {};

  for (const filter of filters) {
    switch (filter.id) {
      case 'name':
        if (typeof filter.value === 'string') {
          where.name = {
            contains: filter.value,
            mode: 'insensitive'
          };
        }
        break;

      case 'createdAt':
        if (filter.value && typeof filter.value === 'object') {
          const range = filter.value as { from?: string; to?: string };
          const createdAt: { gte?: Date; lte?: Date } = {};
          if (range.from) {
            const d = new Date(range.from);
            if (!isNaN(d.getTime())) createdAt.gte = d;
          }
          if (range.to) {
            const d = new Date(range.to);
            if (!isNaN(d.getTime())) createdAt.lte = d;
          }
          if (createdAt.gte || createdAt.lte) {
            where.createdAt = createdAt;
          }
        }
        break;
    }
  }

  return where;
};
```

### Sorting Utility

Create `buildCollectionSortingOrderBy` in `server/src/utils/sorting.ts`:

**Sortable Fields**:
- `name`
- `createdAt`
- `updatedAt`

**Field Mapping**:
```typescript
const fieldMap: Record<string, string> = {
  'name': 'name',
  'createdAt': 'createdAt',
  'updatedAt': 'updatedAt'
};
```

Follow the same validation pattern as document sorting to filter invalid column IDs.

### Service Layer

Update `server/src/services/collection.service.ts`:

```typescript
import { buildCollectionFiltersWhere, type ColumnFilter } from "../utils/filters.js";
import { buildCollectionSortingOrderBy, type ColumnSort } from "../utils/sorting.js";

const getAllCollectionsImpl = async ({
  offset,
  limit,
  filters,
  sorting
}: {
  offset: number;
  limit: number;
  filters?: ColumnFilter[];
  sorting?: ColumnSort[];
}) => {
  const where = buildCollectionFiltersWhere(filters);
  const orderBy = buildCollectionSortingOrderBy(sorting);

  const results = await prisma.documentCollection.findMany({
    where,
    orderBy,
    skip: offset,
    take: limit
  });

  const count = await prisma.documentCollection.count({ where });

  return {
    paging: {
      offset,
      limit,
      total: {
        pages: Math.ceil(count / limit),
        records: count
      }
    },
    results
  };
};
```

## Client-Side Implementation

### Query Hook

**Location**: `client/src/modules/Collection/hooks/collection-list/useCollectionListQuery.tsx`

**Pattern**: Mirror `useDocumentListQuery` exactly

```typescript
import type { PagingType, PagingMethods } from '@/hooks/data-table';
import { trpc } from '@/lib/trpc/react';
import type { ErrorContextValue } from '@/contexts/error';
import type { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { useEffect } from 'react';

export function useCollectionListQuery(
  paging: Omit<PagingType, 'totalPages'>,
  setError: ErrorContextValue['setError'],
  setTotalPages: PagingMethods['setTotalPages'],
  filters: ColumnFiltersState = [],
  sorting: SortingState = []
) {
  const query = trpc.collection.getAll.useQuery({
    ...paging,
    filters,
    sorting
  });

  useEffect(() => {
    if (query.error) {
      setError(query.error);
    }
  }, [query.error, setError]);

  useEffect(() => {
    if (query.data?.paging) {
      setTotalPages(query.data.paging.total.pages);
    }
  }, [query.data, setTotalPages]);

  return query;
}

export type CollectionRecord = NonNullable<
  ReturnType<typeof useCollectionListQuery>['data']
>['results'][number];
```

### Column Definitions Hook

**Location**: `client/src/modules/Collection/hooks/collection-list/useCollectionTableColumns.tsx`

**Column Structure**:

1. **Line Number Column**: Use `getLineNumberColumn` helper
2. **Name Column**:
   - Linked to collection detail page (`/collections/$id`)
   - Search filter with case-insensitive matching
   - Sortable
3. **Created At Column**:
   - Use `getDateColumn` helper
   - Date range filter
   - Sortable
4. **Updated At Column**:
   - Use `getDateColumn` helper
   - Sortable

**Implementation**:
```typescript
import { useMemo } from 'react';
import type { DTColumnDef, DTRowRecord } from '@/components/data-table';
import type { CollectionRecord } from './useCollectionListQuery';
import { getLineNumberColumn } from '@/components/data-table/columns';
import { getDateColumn } from '@/components/data-table/columns/date';
import { Link } from '@tanstack/react-router';

export function useCollectionTableColumns() {
  return useMemo(() => {
    const lineNumber = getLineNumberColumn<DTRowRecord<CollectionRecord>, unknown>();
    const createdAt = getDateColumn<DTRowRecord<CollectionRecord>, unknown>('createdAt');
    const updatedAt = getDateColumn<DTRowRecord<CollectionRecord>, unknown>('updatedAt');

    return [
      lineNumber,
      {
        id: 'name',
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => {
          const { name, id } = row.original;
          return (
            <Link
              className="text-primary hover:underline"
              to={`/collections/$id`}
              params={{ id: `${id}` }}
            >
              {name}
            </Link>
          );
        },
        meta: {
          size: {
            min: 200,
            max: 400
          },
          filter: {
            type: 'search',
            label: 'Name',
            placeholder: 'Search collections...'
          },
          sortable: true
        }
      },
      {
        ...createdAt,
        meta: {
          ...createdAt.meta,
          filter: {
            type: 'date-range',
            label: 'Created'
          },
          sortable: true
        }
      },
      {
        ...updatedAt,
        meta: {
          ...updatedAt.meta,
          sortable: true
        }
      }
    ] satisfies DTColumnDef<DTRowRecord<CollectionRecord>, unknown>[];
  }, []);
}
```

### Page Component

**Location**: `client/src/modules/Collection/pages/CollectionListPage.tsx`

**Pattern**: Mirror `DocumentListPage` exactly with entity-specific changes

```typescript
import { Page } from '@/components/layout';
import { DataTable } from '@/components/data-table';
import { useDataTablePaging, useDataTableRows, useDataTableFiltering, useDataTableSorting } from '@/hooks/data-table';
import {
  useCollectionListQuery,
  useCollectionTableColumns
} from '@/modules/Collection/hooks/collection-list';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useError } from '@/contexts/error';

export function CollectionListPage() {
  const { setError } = useError();
  const pagingController = useDataTablePaging();
  const [pagination, { setTotalPages }] = pagingController;
  const filteringController = useDataTableFiltering();
  const [columnFilters] = filteringController;
  const sortingController = useDataTableSorting();
  const [sorting] = sortingController;
  const listQuery = useCollectionListQuery(pagination, setError, setTotalPages, columnFilters, sorting);
  const rows = useDataTableRows(listQuery.data?.results);
  const columnDefs = useCollectionTableColumns();

  return (
    <Page>
      <DataTable
        id="collection-list"
        rows={rows}
        columnDefs={columnDefs}
        getRowId={(row) => `${row.id}`}
        isLoading={listQuery.isLoading}
        emptyTitle="No Collections"
        emptyDescription="You haven't created any collections yet. Get started by creating your first collection."
        pagingController={pagingController}
        filteringController={filteringController}
        sortingController={sortingController}
      >
        <DataTable.TitleBar>
          <div className="flex items-center justify-between py-2">
            <h1 className="text-xl font-medium">Collections</h1>
            <Button
              asChild
              className="cursor-pointer"
              variant="default"
              size="sm"
            >
              <Link to="/collections/new">
                <span>Create Collection</span>
                <PlusIcon />
              </Link>
            </Button>
          </div>
        </DataTable.TitleBar>
        <DataTable.Filters>
          <DataTable.Filter />
        </DataTable.Filters>
      </DataTable>
    </Page>
  );
}
```

## Key Differences from Document List

The only differences between Document and Collection implementations:

1. **Entity Name**: `document` → `collection`
2. **Schema Table**: `documents` → `document_collection`
3. **Prisma Model**: `Document` → `DocumentCollection`
4. **Columns**:
   - Document: `documentType`, `filename`, `createdAt`, `updatedAt`
   - Collection: `name`, `createdAt`, `updatedAt`
5. **Route Paths**: `/documents` → `/collections`
6. **Empty State Text**: "No Documents" → "No Collections"
7. **Button Text**: "Create Document" → "Create Collection"

## Module Structure

```
client/src/modules/Collection/
├── hooks/
│   └── collection-list/
│       ├── index.ts
│       ├── useCollectionListQuery.tsx
│       └── useCollectionTableColumns.tsx
└── pages/
    └── CollectionListPage.tsx
```

## Testing Strategy

### Manual Testing Checklist

1. **Basic Display**:
   - Collections appear in table
   - Line numbers show correctly
   - Names are clickable links
   - Dates format correctly

2. **Filtering**:
   - Name search filters results
   - Created date range works
   - Partial date ranges work
   - Filters clear correctly

3. **Sorting**:
   - Name column sorts (asc/desc/none)
   - Created date sorts
   - Updated date sorts
   - Multi-column sort with Shift+click
   - Priority badges show correctly

4. **Pagination**:
   - Page controls appear when needed
   - Navigation between pages works
   - Filters persist across pages
   - Sorting persists across pages

5. **Navigation**:
   - Name links go to collection detail
   - Create button goes to new collection form

6. **States**:
   - Loading skeleton displays
   - Empty state shows when no collections
   - Empty state shows when filters match nothing
   - Errors display via error context

## Performance Considerations

### Database Indexes

Collections table should have indexes on:
- `name` (for search filtering and sorting)
- `createdAt` (for date filtering and sorting)
- `updatedAt` (for sorting)

These are likely already in place from schema migrations.

### Query Optimization

- Server-side pagination limits data transfer
- Filters and sorting applied at database level
- TanStack Query caching reduces redundant requests
- Same `where` clause used for both data and count queries

## Common Pitfalls

1. **Don't use `DocumentCollection` type in Prisma queries** - Use the correct Prisma model name
2. **Import from collection-list hooks**, not document hooks
3. **Use `document_collection` table name** in filters/sorting utilities
4. **Don't forget to export hooks** from `collection-list/index.ts`
5. **Match route paths** to TanStack Router configuration

## Migration from Existing Page

If a `CollectionListPage` already exists without DataTable:

1. Back up the existing implementation
2. Replace with new DataTable-based implementation
3. Verify routes still work
4. Test all functionality
5. Remove old code once verified

## Future Enhancements

### Additional Filters

Could add filters for:
- Document count (number range filter)
- Last modified date range

### Additional Columns

Could display:
- Number of documents in collection
- Collection type/category if added to schema

### Bulk Actions

Could add checkboxes and bulk operations:
- Delete multiple collections
- Export multiple collections

These should follow established DataTable patterns when implemented.

## References

- Document List Page: `client/src/modules/Document/pages/DocumentListPage.tsx`
- Frontend Architecture: `docs/core/frontend-architecture.md`
- Schema Definition: `docs/core/schema.dbml`
- Filter Utilities: `server/src/utils/filters.ts`
- Sorting Utilities: `server/src/utils/sorting.ts`
