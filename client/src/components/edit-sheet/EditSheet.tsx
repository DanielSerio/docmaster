import { useState, useMemo, useCallback, useEffect } from "react";
import { Table } from "@/components/ui/table";
import { ESToolbar } from "./subcomponents/ESToolbar";
import { ESTableHeader } from "./subcomponents/ESTableHeader";
import { ESTableBody } from "./subcomponents/ESTableBody";
import { EditSheetNavigator } from "./subcomponents/EditSheetNavigator";
import { EditSheetProvider } from "./EditSheetContext";
import { useEditSheetValidation } from "./hooks/useEditSheetValidation";
import type { EditSheetProps, ESRowType, BatchChanges } from "./types";

function EditSheetRoot<TData extends ESRowType>({
  data,
  columns,
  isLoading,
  onSave,
  getRowId,
}: EditSheetProps<TData>) {
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [localData, setLocalData] = useState<TData[]>(data);
  const [isSaving, setIsSaving] = useState(false);

  // Snapshot original data when entering edit mode
  const [originalData, setOriginalData] = useState<TData[]>(data);

  // Validation
  const validation = useEditSheetValidation(localData, columns);

  const createEmptyRow = useCallback((): TData => {
    return { __isNew: true } as TData;
  }, []);

  const enterEditMode = () => {
    setMode("edit");
    setOriginalData([...data]);
    // Add an empty row at the bottom when entering edit mode
    setLocalData([...data, createEmptyRow()]);
    validation.clearErrors();
  };

  const exitEditMode = () => {
    setMode("view");
    setLocalData(data);
    validation.clearErrors();
  };

  const handleCancel = () => {
    setLocalData([...originalData]);
    exitEditMode();
  };

  const handleRowChange = useCallback(
    (rowIndex: number, field: keyof TData, value: unknown) => {
      setLocalData((prev) => {
        const updated = [...prev];
        updated[rowIndex] = { ...updated[rowIndex], [field]: value };
        return updated;
      });
    },
    []
  );

  const handleCellFocus = useCallback(
    (rowIndex: number) => {
      setLocalData((prev) => {
        // If focusing the last row and it's marked as new, add another empty row
        const isLastRow = rowIndex === prev.length - 1;
        const lastRowIsNew = prev[rowIndex]?.__isNew;

        if (isLastRow && lastRowIsNew) {
          return [...prev, createEmptyRow()];
        }

        return prev;
      });
    },
    [createEmptyRow]
  );

  const handleRowDelete = useCallback((rowIndex: number) => {
    setLocalData((prev) => {
      const updated = [...prev];
      updated[rowIndex] = { ...updated[rowIndex], __isDeleted: true };
      return updated;
    });
  }, []);

  const isRowEmpty = useCallback((row: TData): boolean => {
    // Check if a row has any meaningful data
    const keys = Object.keys(row).filter(
      (key) => key !== "__isNew" && key !== "__isDeleted" && key !== "id"
    );
    return keys.every((key) => {
      const value = row[key as keyof TData];
      return value === undefined || value === null || value === "";
    });
  }, []);

  const handleSave = async () => {
    // Validate all rows before saving
    const isValid = validation.validateAll();
    if (!isValid) {
      console.error("Validation failed");
      return;
    }

    // Compute changes, filtering out empty rows
    const changes: BatchChanges<TData> = {
      new: localData.filter(
        (row) => row.__isNew && !row.__isDeleted && !isRowEmpty(row)
      ),
      updated: localData.filter(
        (row) => !row.__isNew && !row.__isDeleted && row.id
      ),
      deletedIds: localData
        .filter((row) => row.__isDeleted && row.id)
        .map((row) => row.id!),
    };

    try {
      setIsSaving(true);
      await onSave(changes);
      exitEditMode();
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = useMemo(() => {
    return JSON.stringify(localData) !== JSON.stringify(originalData);
  }, [localData, originalData]);

  // Keyboard shortcuts
  useEffect(() => {
    if (mode !== "edit") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to cancel
      if (e.key === "Escape") {
        e.preventDefault();
        handleCancel();
      }

      // Ctrl+S or Cmd+S to save
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (validation.isValid && !isSaving) {
          handleSave();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode, validation.isValid, isSaving]);

  const contextValue = useMemo(
    () => ({
      mode,
      data: localData,
      columns,
      onRowChange: handleRowChange,
      onRowDelete: handleRowDelete,
      onCellFocus: handleCellFocus,
      getRowId,
      getFieldError: validation.getFieldError,
    }),
    [
      mode,
      localData,
      columns,
      handleRowChange,
      handleRowDelete,
      handleCellFocus,
      getRowId,
      validation.getFieldError,
    ]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <EditSheetProvider value={contextValue}>
      <div className="flex flex-col border rounded-md bg-card">
        <ESToolbar
          mode={mode}
          onEdit={enterEditMode}
          onSave={handleSave}
          onCancel={handleCancel}
          hasChanges={hasChanges}
          isSaving={isSaving}
          isValid={validation.isValid}
        />
        <div className="overflow-auto">
          <EditSheetNavigator>
            <Table>
              <ESTableHeader />
              <ESTableBody />
            </Table>
          </EditSheetNavigator>
        </div>
      </div>
    </EditSheetProvider>
  );
}

export const EditSheet = EditSheetRoot;
