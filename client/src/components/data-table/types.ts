import type { PagingController, FilteringController } from "@/hooks/data-table";
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
  gridTemplateColumns: string;
}

export type DTHeaderProps<TData extends DTRowType> = DTSectionProps<TData>;
export type DTBodyProps<TData extends DTRowType> = DTSectionProps<TData> & {
  isLoading?: boolean | null;
  skeletonRowCount: number;
  emptyIcon?: React.ReactNode;
  emptyTitle: string;
  emptyDescription: string;
  columnDefs: DTColumnDef<TData, unknown>[];
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
  skeletonRowCount?: number;
  emptyIcon?: React.ReactNode;
  emptyTitle: string;
  emptyDescription: string;
  children?: React.ReactNode;
  pagingController: PagingController;
  filteringController?: FilteringController;
}

export type DTRowRecord<TData extends object & RowData> = TData & {
  lineNumber: number;
};