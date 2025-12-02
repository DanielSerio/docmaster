import type { ColumnDef, ColumnMeta, RowData, Table } from "@tanstack/react-table";
import type { PropsWithChildren } from "react";

export type ColumnAlignment = "left" | "center" | "right";
export type ColumnSize = {
  min: number;
  max: number;
};

export type DTRowType = RowData & object & {
  lineNumber: number;
};

type HeaderType<TData extends DTRowType> = ColumnDef<TData, unknown>['header'];

export type DTColumnDef<TData extends DTRowType, TValue> = ColumnDef<TData, TValue> & {
  id: string;
  header: HeaderType<TData>;
  meta: ColumnMeta<TData, TValue>;
};

interface DTSectionProps<TData extends DTRowType> {
  table: Table<TData>;
  columnDefs: DTColumnDef<TData, unknown>[];
  gridTemplateColumns: string;
}

export type DTHeaderProps<TData extends DTRowType> = DTSectionProps<TData>;
export type DTBodyProps<TData extends DTRowType> = DTSectionProps<TData> & {
  isLoading?: boolean | null;
  error?: Error | null;
  skeletonRowCount: number;
};

interface DTSubComponent extends PropsWithChildren {
  className?: string;
}

export interface DTRowProps extends DTSubComponent {
  gridTemplateColumns: string;
}

export interface DTCellProps extends DTSubComponent {
  align?: ColumnAlignment;
}


export interface DataTableProps<TData extends DTRowType> {
  id: string;
  rows: TData[];
  columnDefs: DTColumnDef<TData, unknown>[];
  getRowId: (row: TData) => string;
  isLoading?: boolean | null;
  error?: Error | null;
  skeletonRowCount?: number;
}