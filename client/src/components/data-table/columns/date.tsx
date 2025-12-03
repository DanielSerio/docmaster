import type { DTColumnDef, DTRowType } from '../types';

export function getDateColumn<TData extends DTRowType, TValue>(id: 'createdAt' | 'updatedAt') {
  const headerText = id === 'createdAt' ? 'Created' : 'Updated';
  return {
    id,
    header: headerText,
    cell: ({ row }) => {
      const date = (row.original as Record<string, unknown>)[id] as Date;

      return date.toString();
    },
    meta: {
      size: {
        min: 150,
        max: 250
      }
    }
  } as DTColumnDef<TData, TValue>;
}
