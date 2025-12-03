import { getCoreRowModel, useReactTable, type VisibilityState } from '@tanstack/react-table';
import { Table } from '../ui/table';
import { DTTableHeader } from './subcomponents/DTTableHeader';
import { DTTableBody } from './subcomponents/DTTableBody';
import { DTTitleBar } from './subcomponents/DTTitleBar';
import { DTFilters } from './subcomponents/DTFilters';
import { DTHeaderSlot } from './subcomponents/DTHeaderSlot';
import type { DataTableProps, DTRowType } from './types';
import { Children, isValidElement, useMemo, useState } from 'react';
import { getInitialVisibilityState, getTableGrid } from './utils';
import { DataTableProvider } from './DataTableContext';

function DataTableRoot<TData extends DTRowType>({
  id,
  columnDefs,
  rows,
  skeletonRowCount = 5,
  isLoading,
  error,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  getRowId,
  children
}: DataTableProps<TData>) {
  // create column visibility state
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    getInitialVisibilityState(columnDefs)
  );

  // create table instance
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

  // get column definitions for visible columns
  const visibleColumnDefs = useMemo(() => {
    return columnDefs.filter((col) => columnVisibility[col.id]);
  }, [columnVisibility, columnDefs]);

  // get grid template columns for visible columns
  const { gridTemplateColumns } = getTableGrid(visibleColumnDefs);

  // extract slot content from children
  const slots = useMemo(() => {
    let titleBar: React.ReactNode = null;
    let filters: React.ReactNode = null;
    let header: React.ReactNode = null;

    Children.forEach(children, (child) => {
      if (!isValidElement(child)) return;

      if (child.type === DTTitleBar) {
        titleBar = child;
      } else if (child.type === DTFilters) {
        filters = child;
      } else if (child.type === DTHeaderSlot) {
        header = child;
      }
    });

    return { titleBar, filters, header };
  }, [children]);

  return (
    <DataTableProvider value={{ table, gridTemplateColumns }}>
      <div className="flex flex-col">
        <header className="flex flex-col">
          {slots.titleBar}
          {slots.filters}
          {slots.header}
        </header>
        <div>
          <Table>
            <DTTableHeader
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
              emptyIcon={emptyIcon}
              emptyTitle={emptyTitle}
              emptyDescription={emptyDescription}
            />
          </Table>
        </div>
        <footer>
          <button>Pagination area</button>
        </footer>
      </div>
    </DataTableProvider>
  );
}

export const DataTable = Object.assign(DataTableRoot, {
  TitleBar: DTTitleBar,
  Filters: DTFilters,
  Header: DTHeaderSlot
});
