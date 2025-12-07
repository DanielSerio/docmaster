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

  const handleSave = async () => {
    const isValid = validation.validateAll();
    if (!isValid) {
      return;
    }

    const changes: BatchChanges<TData> = {
      new: localData.filter((row) => row.__isNew && !row.__isDeleted && !isRowEmpty(row)),
      updated: localData.filter((row) => !row.__isNew && !row.__isDeleted && row.id),
      deletedIds: localData.filter((row) => row.__isDeleted && row.id).map((row) => row.id!)
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

  const hasChanges = useMemo(() => {
    return JSON.stringify(localData) !== JSON.stringify(originalData);
  }, [localData, originalData]);

  useEffect(() => {
    if (mode === 'edit') {
      validation.validateAll();
    }
  }, [mode, localData]);

  useEditSheetKeyboard({
    mode,
    isValid: validation.isValid,
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
    hasChanges
  };
}
