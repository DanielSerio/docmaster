import { getCoreRowModel, useReactTable, type VisibilityState } from '@tanstack/react-table';
import { Table } from '../ui/table';
import { DTTableHeader } from './subcomponents/DTTableHeader';
import { DTTableBody } from './subcomponents/DTTableBody';
import { DTTitleBar } from './subcomponents/DTTitleBar';
import { DTFilters } from './subcomponents/DTFilters';
import { DTHeaderSlot } from './subcomponents/DTHeaderSlot';
import { DTFilter } from './subcomponents/DTFilter';
import type { DataTableProps, DTRowType } from './types';
import { Children, isValidElement, useMemo, useState, useCallback } from 'react';
import { getInitialVisibilityState, getTableGrid } from './utils';
import { DataTableProvider } from './DataTableContext';
import { DTPagination } from './subcomponents/DTPagination';

function DataTableRoot<TData extends DTRowType>({
  id,
  columnDefs,
  rows,
  skeletonRowCount = 5,
  isLoading,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  getRowId,
  children,
  pagingController,
  filteringController,
  sortingController
}: DataTableProps<TData>) {
  // create column visibility state
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() =>
    getInitialVisibilityState(columnDefs)
  );

  // memoize getRowId function to prevent table recreation
  const getRowIdCallback = useCallback((originalRow: TData) => {
    return `${id}-${getRowId(originalRow)}`;
  }, [id, getRowId]);

  // create table instance
  // Note: We don't pass columnFilters to the table since we're doing server-side filtering
  // The table doesn't need to know about filters - we handle them separately
  const table = useReactTable({
    data: rows,
    columns: columnDefs,
    getRowId: getRowIdCallback,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    enableSorting: true,
    enableMultiSort: true,
    state: {
      columnVisibility,
      sorting: sortingController?.[0] || []
    },
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: sortingController?.[1]
  });

  // get column definitions for visible columns
  const visibleColumnDefs = useMemo(() => {
    return columnDefs.filter((col) => columnVisibility[col.id]);
  }, [columnVisibility, columnDefs]);

  // get grid template columns for visible columns
  const gridTemplateColumns = useMemo(() => {
    return getTableGrid(visibleColumnDefs).gridTemplateColumns;
  }, [visibleColumnDefs]);

  // extract slot content from children
  const slots = useMemo(() => {
    return Children.toArray(children).reduce(
      (acc, child) => {
        if (!isValidElement(child)) return acc;

        if (child.type === DTTitleBar) {
          acc.titleBar = child;
        } else if (child.type === DTFilters) {
          acc.filters = child;
        } else if (child.type === DTHeaderSlot) {
          acc.header = child;
        }

        return acc;
      },
      { titleBar: null as React.ReactNode, filters: null as React.ReactNode, header: null as React.ReactNode }
    );
  }, [children]);

  const contextValue = useMemo(() => ({
    table,
    gridTemplateColumns,
    filteringController,
    sortingController
  }), [table, gridTemplateColumns, filteringController, sortingController]);

  return (
    <DataTableProvider value={contextValue}>
      <div className="flex flex-col border rounded-md bg-card max-h-[calc(100vh-88px)] 2xl:max-h-[calc(100vh-120px)]">
        <header className="flex flex-col">
          {slots.titleBar}
          {slots.filters}
          {slots.header}
        </header>
        <div className="flex-1 overflow-y-auto">
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
              skeletonRowCount={skeletonRowCount}
              emptyIcon={emptyIcon}
              emptyTitle={emptyTitle}
              emptyDescription={emptyDescription}
            />
          </Table>
        </div>
        <DTPagination controller={pagingController} />
      </div>
    </DataTableProvider>
  );
}

export const DataTable = Object.assign(DataTableRoot, {
  TitleBar: DTTitleBar,
  Filters: DTFilters,
  Header: DTHeaderSlot,
  Filter: DTFilter
});
