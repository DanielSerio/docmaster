import { useEffect, useRef } from "react";
import { useEditSheetContext } from "../EditSheetContext";
import type { ESRowType } from "../types";

interface EditSheetNavigatorProps {
  children: React.ReactNode;
}

export function EditSheetNavigator<TData extends ESRowType>({
  children,
}: EditSheetNavigatorProps) {
  const { mode, data, columns } = useEditSheetContext<TData>();
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mode !== "edit") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      // Only handle arrow keys when focused on an input/select/button in the table
      if (!target.matches("input, select, button, textarea")) return;

      const cell = target.closest("td");
      if (!cell) return;

      const row = cell.closest("tr");
      if (!row) return;

      const rowIndex = parseInt(cell.getAttribute("data-row") || "-1");
      const colIndex = parseInt(cell.getAttribute("data-col") || "-1");

      if (rowIndex === -1 || colIndex === -1) return;

      let newRowIndex = rowIndex;
      let newColIndex = colIndex;
      let shouldMove = false;

      switch (e.key) {
        case "ArrowUp":
          if (newRowIndex > 0) {
            newRowIndex--;
            shouldMove = true;
          }
          break;

        case "ArrowDown":
          if (newRowIndex < data.length - 1) {
            newRowIndex++;
            shouldMove = true;
          }
          break;

        case "ArrowRight":
          // Move to next column, or wrap to next row
          if (newColIndex < columns.length - 1) {
            newColIndex++;
            shouldMove = true;
          } else if (newRowIndex < data.length - 1) {
            // Wrap to first column of next row
            newColIndex = 0;
            newRowIndex++;
            shouldMove = true;
          }
          break;

        case "ArrowLeft":
          // Move to previous column, or wrap to previous row
          if (newColIndex > 0) {
            newColIndex--;
            shouldMove = true;
          } else if (newRowIndex > 0) {
            // Wrap to last column of previous row
            newColIndex = columns.length - 1;
            newRowIndex--;
            shouldMove = true;
          }
          break;
      }

      if (shouldMove) {
        e.preventDefault();

        // Find the target cell and focus its input
        const targetCell = tableRef.current?.querySelector(
          `td[data-row="${newRowIndex}"][data-col="${newColIndex}"]`
        );

        if (targetCell) {
          const input = targetCell.querySelector<HTMLElement>(
            "input, select, button, textarea"
          );
          if (input) {
            input.focus();
            // If it's an input or textarea, select all text
            if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
              input.select();
            }
          }
        }
      }
    };

    const tableElement = tableRef.current;
    if (tableElement) {
      tableElement.addEventListener("keydown", handleKeyDown);
      return () => tableElement.removeEventListener("keydown", handleKeyDown);
    }
  }, [mode, data.length, columns.length]);

  return <div ref={tableRef}>{children}</div>;
}
