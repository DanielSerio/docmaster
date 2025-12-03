import { useMemo } from 'react';
import type { DTColumnDef, DTRowRecord } from '@/components/data-table';
import type { DocumentRecord } from './useDocumentListQuery';
import { getLineNumberColumn } from '@/components/data-table/columns';
import { getDateColumn } from '@/components/data-table/columns/date';

export function useDocumentTableColumns() {
  const lineNumber = getLineNumberColumn<DTRowRecord<DocumentRecord>, unknown>();
  const createdAt = getDateColumn<DTRowRecord<DocumentRecord>, unknown>('createdAt');
  const updatedAt = getDateColumn<DTRowRecord<DocumentRecord>, unknown>('updatedAt');

  return useMemo(() => {
    return [
      lineNumber,
      {
        id: 'type',
        accessorKey: 'documentType',
        header: 'Type',
        meta: {
          size: {
            min: 200,
            max: 400
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
      createdAt,
      updatedAt
    ] satisfies DTColumnDef<DTRowRecord<DocumentRecord>, unknown>[];
  }, []);
}
