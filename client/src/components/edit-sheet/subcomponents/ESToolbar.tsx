import { Edit2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AsyncButton } from '@/components/ui/async-button';
import type { EditMode } from '../types';

interface ESToolbarProps {
  mode: EditMode;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  hasChanges: boolean;
  isSaving: boolean;
  isValid: boolean;
}

export function ESToolbar({
  mode,
  onEdit,
  onSave,
  onCancel,
  hasChanges,
  isSaving,
  isValid
}: ESToolbarProps) {
  const handleCancel = () => {
    if (hasChanges) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to cancel?'
      );
      if (!confirmed) return;
    }
    onCancel();
  };

  return (
    <div className="flex justify-end gap-2 p-4 border-b">
      {mode === 'view' && (
        <Button
          onClick={onEdit}
          data-testid="edit-button"
        >
          Edit
          <Edit2 className="h-4 w-4" />
        </Button>
      )}

      {mode === 'edit' && (
        <>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
            data-testid="cancel-button"
          >
            Cancel
            <X className="h-4 w-4" />
          </Button>
          <AsyncButton
            onClick={onSave}
            disabled={!isValid}
            isBusy={isSaving}
            icon={<Save className="h-4 w-4" />}
            data-testid="save-button"
          >
            Save
          </AsyncButton>
        </>
      )}
    </div>
  );
}
