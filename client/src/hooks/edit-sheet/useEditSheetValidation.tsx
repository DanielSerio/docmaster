import { useState, useCallback } from "react";
import type { ESColumnDef, ESRowType } from "@/components/edit-sheet/types";

interface ValidationErrors {
  [rowIndex: string]: {
    [columnId: string]: string;
  };
}

export function useEditSheetValidation<TData extends ESRowType>(
  data: TData[],
  columns: ESColumnDef<TData>[]
) {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const getRowErrors = useCallback(
    (row: TData) => {
      const rowErrors: { [columnId: string]: string } = {};

      columns.forEach((column) => {
        if (column.validation) {
          const value = row[column.accessorKey];
          const error = column.validation(value, row);
          if (error) {
            rowErrors[column.id] = error;
          }
        }
      });

      return rowErrors;
    },
    [columns]
  );

  const validateRow = useCallback(
    (rowIndex: number, row: TData): boolean => {
      const rowErrors = getRowErrors(row);

      setErrors((prev) => {
        const next = { ...prev };
        if (Object.keys(rowErrors).length > 0) {
          next[String(rowIndex)] = rowErrors;
        } else {
          delete next[String(rowIndex)];
        }
        return next;
      });

      return Object.keys(rowErrors).length === 0;
    },
    [getRowErrors]
  );

  const validateAll = useCallback((): boolean => {
    let allValid = true;
    const newErrors: ValidationErrors = {};

    data.forEach((row, rowIndex) => {
      // Skip empty new rows and deleted rows
      if (row.__isDeleted) return;

      // Check if row is empty (all fields are empty)
      const keys = Object.keys(row).filter(
        (key) => key !== "__isNew" && key !== "__isDeleted" && key !== "id"
      );
      const isEmpty = keys.every((key) => {
        const value = row[key as keyof TData];
        return value === undefined || value === null || value === "";
      });

      if (isEmpty && row.__isNew) return; // Skip empty new rows

      const rowErrors = getRowErrors(row);
      if (Object.keys(rowErrors).length > 0) {
        allValid = false;
      }

      if (Object.keys(rowErrors).length > 0) {
        newErrors[String(rowIndex)] = rowErrors;
      }
    });

    setErrors(newErrors);
    return allValid;
  }, [data, getRowErrors]);

  const getFieldError = useCallback(
    (rowIndex: number, columnId: string): string | undefined => {
      return errors[String(rowIndex)]?.[columnId];
    },
    [errors]
  );

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const isValid = Object.keys(errors).length === 0;

  return {
    errors,
    isValid,
    validateRow,
    validateAll,
    getFieldError,
    clearErrors,
  };
}
