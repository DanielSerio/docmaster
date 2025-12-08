import { useCallback, useMemo, useState, useEffect } from 'react';
import type { EditSheetProps, ESRowType, BatchChanges } from '@/components/edit-sheet/types';
import { useEditSheetValidation } from './useEditSheetValidation';
import { useEditSheetKeyboard } from './useEditSheetKeyboard';
import { isRowEmpty } from '@/components/edit-sheet/utils';

export function useEditSheetState<TData extends ESRowType, TSave = BatchChanges<TData>>(
  props: EditSheetProps<TData, TSave>
) {
  const { data, columns, onSave, mapChanges } = props;
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [localData, setLocalData] = useState<TData[]>(data);
  const [isSaving, setIsSaving] = useState(false);
  const [originalData, setOriginalData] = useState<TData[]>(data);

  const validation = useEditSheetValidation(localData, columns);

  const createEmptyRow = useCallback((): TData => {
    return { __isNew: true } as TData;
  }, []);

  const enterEditMode = () => {
    setMode('edit');
    setOriginalData([...data]);
    setLocalData([...data, createEmptyRow()]);
    validation.clearErrors();
  };

  const exitEditMode = () => {
    setMode('view');
    setLocalData(data);
    validation.clearErrors();
  };

  const handleCancel = () => {
    setLocalData([...originalData]);
    exitEditMode();
  };

  const handleRowChange = useCallback((rowIndex: number, field: keyof TData, value: unknown) => {
    setLocalData((prev) => {
      const updated = [...prev];
      updated[rowIndex] = { ...updated[rowIndex], [field]: value };
      return updated;
    });
  }, []);

  const handleCellFocus = useCallback(
    (rowIndex: number) => {
      setLocalData((prev) => {
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

  const normalizeRow = useCallback((row: TData) => {
    const entries = Object.entries(row).filter(
      ([key]) => key !== '__isNew' && key !== '__isDeleted' && key !== 'id'
    );
    return Object.fromEntries(entries);
  }, []);

  const originalById = useMemo(() => {
    const map = new Map<TData['id'], Record<string, unknown>>();
    originalData.forEach((row) => {
      if (row.id !== undefined && row.id !== null) {
        map.set(row.id, normalizeRow(row));
      }
    });
    return map;
  }, [originalData, normalizeRow]);

  const newRows = useMemo(
    () => localData.filter((row) => row.__isNew && !row.__isDeleted && !isRowEmpty(row)),
    [localData]
  );

  const deletedIds = useMemo(
    () => localData.filter((row) => row.__isDeleted && row.id).map((row) => row.id!),
    [localData]
  );

  const updatedRows = useMemo(
    () =>
      localData.filter((row) => {
        if (row.__isNew || row.__isDeleted || !row.id) return false;
        const original = originalById.get(row.id);
        if (!original) return false;
        return JSON.stringify(normalizeRow(row)) !== JSON.stringify(original);
      }),
    [localData, originalById, normalizeRow]
  );

  const handleSave = async () => {
    const isValid = validation.validateAll();
    if (!isValid) {
      return;
    }

    const changes: BatchChanges<TData> = {
      new: newRows,
      updated: updatedRows,
      deletedIds
    };

    try {
      setIsSaving(true);
      const payload = mapChanges ? mapChanges(changes) : (changes as unknown as TSave);
      await onSave(payload);
      exitEditMode();
    } finally {
      setIsSaving(false);
    }
  };

  const hasMeaningfulChanges = useMemo(() => {
    return newRows.length > 0 || updatedRows.length > 0 || deletedIds.length > 0;
  }, [newRows, updatedRows, deletedIds]);

  const hasChanges = hasMeaningfulChanges;

  useEffect(() => {
    if (mode === 'edit') {
      validation.validateAll();
    }
  }, [mode, localData]);

  useEditSheetKeyboard({
    mode,
    isValid: validation.isValid,
    hasMeaningfulChanges,
    isSaving,
    onCancel: handleCancel,
    onSave: handleSave
  });

  return {
    mode,
    localData,
    isSaving,
    validation,
    handleRowChange,
    handleCellFocus,
    handleRowDelete,
    handleSave,
    handleCancel,
    enterEditMode,
    hasChanges,
    hasMeaningfulChanges
  };
}
