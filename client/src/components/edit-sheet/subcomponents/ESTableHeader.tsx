import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEditSheetContext } from "../EditSheetContext";
import type { ESRowType } from "../types";

export function ESTableHeader<TData extends ESRowType>() {
  const { mode, columns } = useEditSheetContext<TData>();

  return (
    <TableHeader>
      <TableRow>
        {columns.map((column) => (
          <TableHead key={column.id}>{column.header}</TableHead>
        ))}
        {mode === "edit" && <TableHead>Actions</TableHead>}
      </TableRow>
    </TableHeader>
  );
}
