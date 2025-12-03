import { formatRelative } from 'date-fns';
import type { DTColumnDef, DTRowType } from '../types';

export function getDateColumn<
  TData extends DTRowType & Record<'createdAt' | 'updatedAt', string>,
  TValue
>(id: 'createdAt' | 'updatedAt') {
  const headerText = id === 'createdAt' ? 'Created' : 'Updated';
  return {
    id,
    header: headerText,
    cell: ({ row }) => {
      const date = row.original[id];

      return formatRelative(date, new Date());
    },
    meta: {
      size: {
        min: 150,
        max: 250
      }
    }
  } as DTColumnDef<TData, TValue>;
}
