import type { DTBodyProps, DTRowType } from '../types';
import { TableBody } from '@/components/ui/table';
import { DTRow } from './DTRow';
import { DTCell } from './DTCell';
import { flexRender } from '@tanstack/react-table';
import { Skeleton } from '@/components/ui/skeleton';

export function DTTableBody<TData extends DTRowType>({
  table,
  gridTemplateColumns,
  skeletonRowCount,
  isLoading,
  error
}: DTBodyProps<TData>) {
  const visibleColumns = Object.values(table.getState().columnVisibility).filter((v) => v);

  if (isLoading) {
    return (
      <TableBody>
        {Array.from({ length: skeletonRowCount }).map((_, index) => (
          <DTRow
            key={index}
            gridTemplateColumns={gridTemplateColumns}
          >
            {Array.from({ length: visibleColumns.length }).map((_, cellIndex) => (
              <DTCell
                key={cellIndex}
                align="left"
              >
                <Skeleton className="h-4 w-24" />
              </DTCell>
            ))}
          </DTRow>
        ))}
      </TableBody>
    );
  }

  if (error) {
    return (
      <TableBody>
        <DTRow gridTemplateColumns={'1fr'}>
          <DTCell>
            <p className="text-red-500">Error: {error.message}</p>
          </DTCell>
        </DTRow>
      </TableBody>
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
