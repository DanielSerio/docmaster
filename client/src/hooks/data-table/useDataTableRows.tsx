import type { RowData } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

const STABLE = [] as unknown[];

function attachLineNumbers<TData extends RowData & object>(rows: TData[]) {
  return rows.map((row, index) => ({
    ...row,
    lineNumber: index + 1
  }));
}

export function useDataTableRows<TData extends RowData & object>(data?: TData[] | null) {
  type Attached = TData & { lineNumber: number };
  const [rows, setRows] = useState<Attached[]>(() =>
    data ? attachLineNumbers(data) : (STABLE as Attached[])
  );

  useEffect(() => {
    if (data) {
      setRows(attachLineNumbers(data));
    }
  }, [data]);

  return rows;
}
