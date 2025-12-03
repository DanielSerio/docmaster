import { cn } from '@/lib/utils';
import type { DTColumnDef, DTRowType } from '../types';

const HeaderCell = () => {
  const classNames = cn(
    'w-full h-full flex items-center justify-center', // layout
    'text-muted-foreground' // color
  );
  return <div className={classNames}>#</div>;
};

export function getLineNumberColumn<TData extends DTRowType, TValue>() {
  return {
    id: 'lineNumber',
    header: HeaderCell,
    cell: ({ row }) => row.index + 1,
    meta: {
      align: 'center',
      size: {
        min: 80,
        max: 80
      }
    }
  } as DTColumnDef<TData, TValue>;
}
