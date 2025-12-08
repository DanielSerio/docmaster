import { useEffect, useRef } from "react";

interface KeyboardNavigationOptions {
  mode: "view" | "edit";
  rowCount: number;
  columnCount: number;
}

export function useEditSheetKeyboardNavigation({
  mode,
  rowCount,
  columnCount,
}: KeyboardNavigationOptions) {
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mode !== "edit") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      if (!target.matches("input, select, button, textarea")) return;

      // For textarea elements, only navigate with Shift+Arrow
      // This allows arrow keys to work normally for text editing
      const isTextarea = target instanceof HTMLTextAreaElement;
      if (isTextarea && !e.shiftKey) return;

      const cell = target.closest("td");
      if (!cell) return;

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
          if (newRowIndex < rowCount - 1) {
            newRowIndex++;
            shouldMove = true;
          }
          break;
        case "ArrowRight":
          if (newColIndex < columnCount - 1) {
            newColIndex++;
            shouldMove = true;
          } else if (newRowIndex < rowCount - 1) {
            newColIndex = 0;
            newRowIndex++;
            shouldMove = true;
          }
          break;
        case "ArrowLeft":
          if (newColIndex > 0) {
            newColIndex--;
            shouldMove = true;
          } else if (newRowIndex > 0) {
            newColIndex = columnCount - 1;
            newRowIndex--;
            shouldMove = true;
          }
          break;
      }

      if (shouldMove) {
        e.preventDefault();

        const targetCell = tableRef.current?.querySelector(
          `td[data-row="${newRowIndex}"][data-col="${newColIndex}"]`
        );

        if (targetCell) {
          const input = targetCell.querySelector<HTMLElement>(
            "input, select, button, textarea"
          );
          if (input) {
            input.focus();
            if (
              input instanceof HTMLInputElement ||
              input instanceof HTMLTextAreaElement
            ) {
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
  }, [mode, rowCount, columnCount]);

  return { tableRef };
}
