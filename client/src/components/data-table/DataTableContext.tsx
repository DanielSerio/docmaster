import { createContext, useContext } from 'react';
import type { Table } from '@tanstack/react-table';
import type { DTRowType } from './types';

interface DataTableContextValue<TData extends DTRowType> {
  table: Table<TData>;
  gridTemplateColumns: string;
}

const DataTableContext = createContext<DataTableContextValue<DTRowType> | null>(null);

export function DataTableProvider<TData extends DTRowType>({
  value,
  children
}: {
  value: DataTableContextValue<TData>;
  children: React.ReactNode;
}) {
  return (
    <DataTableContext.Provider value={value as unknown as DataTableContextValue<DTRowType>}>
      {children}
    </DataTableContext.Provider>
  );
}

export function useDataTableContext<TData extends DTRowType>(): DataTableContextValue<TData> {
  const context = useContext(DataTableContext);
  if (!context) {
    throw new Error('DataTable compound components must be used within <DataTable>');
  }
  return context as unknown as DataTableContextValue<TData>;
}
