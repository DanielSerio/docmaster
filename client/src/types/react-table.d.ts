import '@tanstack/react-table'; // or your specific framework adapter
import type { ColumnSize, ColumnAlignment, DTRowType } from '@/components/data-table/types';
import type { DTMetaFilter } from '@/components/data-table';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends DTRowType, TValue> {
    size: ColumnSize;
    align?: ColumnAlignment;
    defaultHidden?: boolean;
    filter?: DTMetaFilter;
  }
}