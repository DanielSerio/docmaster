import { createContext, useContext } from 'react';
import type { Table } from '@tanstack/react-table';
import type { DTRowType } from './types';
import type { FilteringController, SortingController } from '@/hooks/data-table';

export interface DataTableContextValue<TData extends DTRowType> {
  table: Table<TData>;
  gridTemplateColumns: string;
  filteringController?: FilteringController;
  sortingController?: SortingController;
}

type DataTableContextStore = DataTableContextValue<DTRowType>;

const DataTableContext = createContext<DataTableContextStore | null>(null);

export function DataTableProvider<TData extends DTRowType>({
  value,
  children
}: {
  value: DataTableContextValue<TData>;
  children: React.ReactNode;
}) {
  return (
    <DataTableContext.Provider value={value as DataTableContextStore}>
      {children}
    </DataTableContext.Provider>
  );
}

export function useDataTableContext<TData extends DTRowType>(): DataTableContextValue<TData> {
  const context = useContext(DataTableContext);
  if (!context) {
    throw new Error('DataTable compound components must be used within <DataTable>');
  }
  return context as DataTableContextValue<TData>;
}
