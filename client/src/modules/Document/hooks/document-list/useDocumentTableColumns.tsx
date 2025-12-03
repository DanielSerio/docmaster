import { useMemo } from 'react';
import type { DTColumnDef, DTRowRecord } from '@/components/data-table';
import type { DocumentRecord } from './useDocumentListQuery';

export function useDocumentTableColumns() {
  return useMemo(() => {
    return [
      {
        id: 'lineNumber',
        header: '#',
        enableColumnFilter: false,
        enableGlobalFilter: false,
        meta: {
          align: 'center',
          size: {
            min: 80,
            max: 80
          }
        }
      },
      {
        id: 'filename',
        accessorKey: 'filename',
        header: 'Filename',
        meta: {
          size: {
            min: 200,
            max: 400
          }
        }
      },
      {
        id: 'createdAt',
        accessorKey: 'createdAt',
        header: 'Created At',
        meta: {
          size: {
            min: 150,
            max: 250
          }
        }
      },
      {
        id: 'updatedAt',
        accessorKey: 'updatedAt',
        header: 'Updated At',
        meta: {
          size: {
            min: 150,
            max: 250
          }
        }
      }
    ] satisfies DTColumnDef<DTRowRecord<DocumentRecord>, unknown>[];
  }, []);
}
