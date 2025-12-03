import { getCoreRowModel, useReactTable, type VisibilityState } from '@tanstack/react-table';
import { Table } from '../ui/table';
import { DTTableHeader } from './subcomponents/DTTableHeader';
import { DTTableBody } from './subcomponents/DTTableBody';
import type { DataTableProps, DTRowType } from './types';
import { useMemo, useState } from 'react';
import { getInitialVisibilityState, getTableGrid } from './utils';

export function DataTable<TData extends DTRowType>({
  id,
  columnDefs,
  rows,
  skeletonRowCount = 5,
  isLoading,
  error,
  getRowId
}: DataTableProps<TData>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    getInitialVisibilityState(columnDefs)
  );
  const table = useReactTable({
    data: rows,
    columns: columnDefs,
    getRowId(originalRow) {
      return `${id}-${getRowId(originalRow)}`;
    },
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility
    },
    onColumnVisibilityChange: setColumnVisibility
  });

  const visibleColumnDefs = useMemo(() => {
    return columnDefs.filter((col) => columnVisibility[col.id]);
  }, [columnVisibility]);

  const { gridTemplateColumns } = getTableGrid(visibleColumnDefs);

  return (
    <div>
      <header>DataTable header area</header>
      <div>
        <Table>
          <DTTableHeader
            columnDefs={visibleColumnDefs}
            table={table}
            gridTemplateColumns={gridTemplateColumns}
          />
          <DTTableBody
            columnDefs={visibleColumnDefs}
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
