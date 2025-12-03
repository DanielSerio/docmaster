import '@tanstack/react-table'; // or your specific framework adapter
import type { ColumnSize, ColumnAlignment, DTRowType } from '@/components/data-table/types';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends DTRowType, TValue> {
    size: ColumnSize;
    align?: ColumnAlignment;
    defaultHidden?: boolean;
  }
}