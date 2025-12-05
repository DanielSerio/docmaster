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
              to={`/collections/$collectionId`}
              params={{ collectionId: `${id}` }}
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
