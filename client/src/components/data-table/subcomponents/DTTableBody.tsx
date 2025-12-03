import type { DTBodyProps, DTRowType } from '../types';
import { TableBody } from '@/components/ui/table';
import { DTRow } from './DTRow';
import { DTCell } from './DTCell';
import { flexRender } from '@tanstack/react-table';
import { DTTableSkeleton } from './DTTableSkeleton';
import { DTTableError } from './DTTableError';
import { DTTableEmpty } from './DTTableEmpty';

export function DTTableBody<TData extends DTRowType>({
  table,
  gridTemplateColumns,
  skeletonRowCount,
  isLoading,
  error,
  columnDefs,
  emptyIcon,
  emptyTitle,
  emptyDescription
}: DTBodyProps<TData>) {
  // Loading
  if (isLoading) {
    return (
      <DTTableSkeleton
        skeletonRowCount={skeletonRowCount}
        gridTemplateColumns={gridTemplateColumns}
        columnCount={columnDefs.length}
      />
    );
  }

  // Error
  if (error) {
    return <DTTableError error={error} />;
  }

  // No Data
  if (table.getRowModel().rows.length === 0) {
    return (
      <DTTableEmpty
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <TableBody>
      {table.getRowModel().rows.map((row) => (
        <DTRow
          key={row.id}
          gridTemplateColumns={gridTemplateColumns}
        >
          {row.getVisibleCells().map((cell) => (
            <DTCell
              key={cell.id}
              align={cell.column.columnDef.meta?.align}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </DTCell>
          ))}
        </DTRow>
      ))}
    </TableBody>
  );
}
