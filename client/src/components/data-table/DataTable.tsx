import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Table } from '../ui/table';
import { DTTableHeader } from './subcomponents/DTTableHeader';
import { DTTableBody } from './subcomponents/DTTableBody';
import type { DataTableProps, DTRowType } from './types';

export function DataTable<TData extends DTRowType>({
  id,
  columnDefs,
  rows,
  skeletonRowCount = 5,
  isLoading,
  error,
  getRowId
}: DataTableProps<TData>) {
  const table = useReactTable({
    data: rows,
    columns: columnDefs,
    getCoreRowModel: getCoreRowModel(),
    getRowId(originalRow) {
      return `${id}-${getRowId(originalRow)}`;
    }
  });

  const gridTemplateColumns = columnDefs.map((col) => col.meta.size.min + 'px').join(' ');

  return (
    <div>
      <header>DataTable header area</header>
      <div>
        <Table>
          <DTTableHeader
            columnDefs={columnDefs}
            table={table}
            gridTemplateColumns={gridTemplateColumns}
          />
          <DTTableBody
            columnDefs={columnDefs}
            table={table}
            gridTemplateColumns={gridTemplateColumns}
            isLoading={isLoading}
            error={error}
            skeletonRowCount={skeletonRowCount}
          />
        </Table>
      </div>
      <footer>DataTable footer area</footer>
    </div>
  );
}
