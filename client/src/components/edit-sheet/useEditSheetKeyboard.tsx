import { useEffect } from 'react';

interface UseEditSheetKeyboardProps {
  mode: 'view' | 'edit';
  isValid: boolean;
  isSaving: boolean;
  onCancel: () => void;
  onSave: () => void;
}

export function useEditSheetKeyboard({
  mode,
  isValid,
  isSaving,
  onCancel,
  onSave
}: UseEditSheetKeyboardProps) {
  useEffect(() => {
    if (mode !== 'edit') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to cancel
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }

      // Ctrl+S or Cmd+S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (isValid && !isSaving) {
          onSave();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, isValid, isSaving, onCancel, onSave]);
}
