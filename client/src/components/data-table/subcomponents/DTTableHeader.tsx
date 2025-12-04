import { TableHeader } from '@/components/ui/table';
import type { DTHeaderProps, DTRowType } from '../types';
import { DTRow } from './DTRow';
import { DTHead } from './DTHead';
import { flexRender } from '@tanstack/react-table';
import { DTSortIndicator } from './DTSortIndicator';
import { useDataTableContext } from '../DataTableContext';
import { cn } from '@/lib/utils';

export function DTTableHeader<TData extends DTRowType>({
  table,
  gridTemplateColumns
}: DTHeaderProps<TData>) {
  const { sortingController } = useDataTableContext<TData>();
  const [sorting] = sortingController || [[]];

  const handleSort = (columnId: string, event: React.MouseEvent) => {
    if (!sortingController) return;
    const [, , methods] = sortingController;
    methods.toggleSort(columnId, event.shiftKey);
  };

  const getSortDirection = (columnId: string): 'asc' | 'desc' | false => {
    const sort = sorting.find((s) => s.id === columnId);
    if (!sort) return false;
    return sort.desc ? 'desc' : 'asc';
  };

  const getSortPriority = (columnId: string): number | undefined => {
    const index = sorting.findIndex((s) => s.id === columnId);
    return index === -1 ? undefined : index;
  };

  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <DTRow
          key={headerGroup.id}
          gridTemplateColumns={gridTemplateColumns}
        >
          {headerGroup.headers.map((header) => {
            const isSortable = header.column.columnDef.meta?.sortable;
            const sortDirection = getSortDirection(header.column.id);
            const sortPriority = getSortPriority(header.column.id);
            const showPriority = sorting.length > 1 && sortPriority !== undefined;

            return (
              <DTHead
                key={header.id}
                align={header.column.columnDef.meta?.align}
                className={cn(
                  isSortable && 'group cursor-pointer select-none hover:bg-muted/50 transition-colors',
                  'relative'
                )}
                onClick={isSortable ? (e) => handleSort(header.column.id, e) : undefined}
              >
                {header.isPlaceholder ? null : (
                  <div className="flex items-center gap-2 w-full">
                    <span className="flex-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </span>
                    {isSortable && (
                      <DTSortIndicator
                        direction={sortDirection}
                        priority={showPriority ? sortPriority : undefined}
                      />
                    )}
                  </div>
                )}
              </DTHead>
            );
          })}
        </DTRow>
      ))}
    </TableHeader>
  );
}
