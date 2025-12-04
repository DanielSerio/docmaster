import { useMemo } from 'react';
import type { DTColumnDef, DTRowRecord } from '@/components/data-table';
import type { DocumentRecord } from './useDocumentListQuery';
import { getLineNumberColumn } from '@/components/data-table/columns';
import { getDateColumn } from '@/components/data-table/columns/date';
import { Link } from '@tanstack/react-router';

export function useDocumentTableColumns() {
  return useMemo(() => {
    const lineNumber = getLineNumberColumn<DTRowRecord<DocumentRecord>, unknown>();
    const createdAt = getDateColumn<DTRowRecord<DocumentRecord>, unknown>('createdAt');
    const updatedAt = getDateColumn<DTRowRecord<DocumentRecord>, unknown>('updatedAt');

    return [
      lineNumber,
      {
        id: 'documentType',
        accessorKey: 'documentType',
        header: 'Type',
        meta: {
          size: {
            min: 200,
            max: 400
          },
          filter: {
            type: 'select',
            label: 'Type',
            options: [
              { label: 'General', value: 'general' },
              { label: 'Rule', value: 'rule' }
            ]
          },
          sortable: true
        }
      },
      {
        id: 'filename',
        accessorKey: 'filename',
        header: 'Filename',
        cell: ({ row }) => {
          const { filename, id } = row.original;
          return (
            <Link
              className="text-primary hover:underline"
              to={`/documents/$id`}
              params={{ id: `${id}` }}
            >
              {filename}
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
            label: 'Filename',
            placeholder: 'Search filenames...'
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
    ] satisfies DTColumnDef<DTRowRecord<DocumentRecord>, unknown>[];
  }, []);
}
