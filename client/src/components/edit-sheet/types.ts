import type { ReactNode } from "react";

export type EditMode = "view" | "edit";

export interface ESRowType {
  id?: number;
  __isNew?: boolean;
  __isDeleted?: boolean;
}

export interface ESColumnDef<TData extends ESRowType> {
  id: string;
  accessorKey: keyof TData;
  header: string;
  viewCell: (props: { row: TData; value: unknown; }) => ReactNode;
  editCell: (props: {
    row: TData;
    value: unknown;
    onChange: (value: unknown) => void;
    onFocus?: () => void;
    disabled?: boolean;
  }) => ReactNode;
  validation?: (value: unknown, row: TData) => string | undefined;
}

export interface BatchChanges<TData> {
  new: TData[];
  updated: TData[];
  deletedIds: number[];
}

export interface EditSheetProps<TData extends ESRowType, TSave = BatchChanges<TData>> {
  data: TData[];
  columns: ESColumnDef<TData>[];
  isLoading?: boolean;
  onSave: (changes: TSave) => Promise<void>;
  mapChanges?: (changes: BatchChanges<TData>) => TSave;
  getRowId: (row: TData) => string;
  children?: ReactNode;
}
