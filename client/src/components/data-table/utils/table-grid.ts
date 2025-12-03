import type { DTColumnDef, DTRowType } from "../types";

export interface TableGrid {
  gridTemplateColumns: string;
  minWidth: number;
  maxWidth: number;
}

function getTotals<TData extends DTRowType>(columnDefs: DTColumnDef<TData, unknown>[]) {
  let minTotal = 0;
  let maxTotal = 0;

  columnDefs.forEach((col) => {
    minTotal += col.meta.size.min;
    maxTotal += col.meta.size.max;
  });

  return { minWidth: minTotal, maxWidth: maxTotal };
}

function getGridTemplateColumns<TData extends DTRowType>(columnDefs: DTColumnDef<TData, unknown>[], { minWidth, maxWidth }: Omit<TableGrid, 'gridTemplateColumns'>) {
  return columnDefs.map((col) => {
    const colAverageWidth = (col.meta.size.min + col.meta.size.max) / 2;
    const totalAverageWidth = (minWidth + maxWidth) / 2;
    const percent = (colAverageWidth / totalAverageWidth) * 100;
    const colMin = col.meta.size.min;
    const colMax = col.meta.size.max;
    return `minmax(${colMin}px, min(${colMax}px, ${percent}%))`;
  }).join(' ');
}

/**
 * Get the grid template columns (and min and max widths) for the table
 * @param columnDefs The column definitions for the table
 * @returns The grid template columns (and min and max widths) for the table
 */
export function getTableGrid<TData extends DTRowType>(
  columnDefs: DTColumnDef<TData, unknown>[]
): TableGrid {
  const totals = getTotals(columnDefs);

  return {
    gridTemplateColumns: getGridTemplateColumns(columnDefs, totals),
    ...totals
  };
}