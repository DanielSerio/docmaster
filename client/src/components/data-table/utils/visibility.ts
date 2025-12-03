import type { VisibilityState } from "@tanstack/react-table";
import type { DTColumnDef, DTRowType } from "../types";

export function getInitialVisibilityState<TData extends DTRowType>(
  columnDefs: DTColumnDef<TData, unknown>[]
) {
  return columnDefs.reduce((acc, col) => {
    if (col.meta.defaultHidden === true) {
      acc[col.id] = false;
    } else {
      acc[col.id] = true;
    }
    return acc;
  }, {} as VisibilityState);
}
