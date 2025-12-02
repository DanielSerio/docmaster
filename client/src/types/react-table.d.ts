import '@tanstack/react-table'; // or your specific framework adapter
import type { ColumnSize, ColumnAlignment, DTRowData } from '@/components/data-table/types';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends DTRowData, TValue> {
    size: ColumnSize;
    align?: ColumnAlignment;
  }
}