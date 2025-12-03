import type { DTBodyProps, DTRowType } from '../types';
import { TableBody } from '@/components/ui/table';
import { DTRow } from './DTRow';
import { DTCell } from './DTCell';
import { flexRender } from '@tanstack/react-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { AlertCircle, FolderCode } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function DTTableBody<TData extends DTRowType>({
  table,
  gridTemplateColumns,
  skeletonRowCount,
  isLoading,
  error,
  columnDefs
}: DTBodyProps<TData>) {
  console.log(columnDefs);
  if (isLoading) {
    return (
      <TableBody>
        {Array.from({ length: skeletonRowCount }).map((_, index) => (
          <DTRow
            key={index}
            gridTemplateColumns={gridTemplateColumns}
          >
            {Array.from({ length: columnDefs.length }).map((_, cellIndex) => (
              <DTCell
                key={cellIndex}
                align="left"
              >
                <Skeleton className="h-4 w-full m-2" />
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
        <DTRow
          gridTemplateColumns={'1fr'}
          className="bg-sidebar hover:bg-sidebar"
        >
          <DTCell className="border-b p-8">
            <Alert
              variant="destructive"
              className="w-[fit-content] max-w-[640px] mx-auto bg-destructive/2 border-destructive/25"
            >
              <AlertCircle />
              <AlertTitle>{error.name}</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          </DTCell>
        </DTRow>
      </TableBody>
    );
  }

  if (table.getRowModel().rows.length === 0) {
    return (
      <TableBody>
        <DTRow
          gridTemplateColumns={'1fr'}
          className="bg-sidebar hover:bg-sidebar"
        >
          <DTCell className="border-b">
            <Empty>
              <EmptyMedia variant="icon">
                <FolderCode />
              </EmptyMedia>
              <EmptyTitle>No Documents Yet</EmptyTitle>
              <EmptyDescription>
                You haven&apos;t created any documents yet. Get started by creating your first
                document.
              </EmptyDescription>
            </Empty>
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
