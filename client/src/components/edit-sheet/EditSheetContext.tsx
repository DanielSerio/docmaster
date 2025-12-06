import { createContext, useContext } from "react";
import type { EditMode, ESRowType, ESColumnDef } from "./types";

interface EditSheetContextValue<TData extends ESRowType> {
  mode: EditMode;
  data: TData[];
  columns: ESColumnDef<TData>[];
  onRowChange: (rowIndex: number, field: keyof TData, value: unknown) => void;
  onRowDelete: (rowIndex: number) => void;
  onCellFocus: (rowIndex: number) => void;
  getRowId: (row: TData) => string;
  getFieldError: (rowIndex: number, columnId: string) => string | undefined;
}

const EditSheetContext = createContext<EditSheetContextValue<ESRowType> | null>(
  null
);

export function EditSheetProvider<TData extends ESRowType>({
  value,
  children,
}: {
  value: EditSheetContextValue<TData>;
  children: React.ReactNode;
}) {
  return (
    <EditSheetContext.Provider
      value={value as unknown as EditSheetContextValue<ESRowType>}
    >
      {children}
    </EditSheetContext.Provider>
  );
}

export function useEditSheetContext<TData extends ESRowType>(): EditSheetContextValue<TData> {
  const context = useContext(EditSheetContext);
  if (!context) {
    throw new Error(
      "EditSheet compound components must be used within <EditSheet>"
    );
  }
  return context as unknown as EditSheetContextValue<TData>;
}
