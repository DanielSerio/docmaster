import { Edit2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EditMode } from "../types";

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
  isValid,
}: ESToolbarProps) {
  const handleCancel = () => {
    if (hasChanges) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to cancel?"
      );
      if (!confirmed) return;
    }
    onCancel();
  };

  return (
    <div className="flex justify-end gap-2 p-4 border-b">
      {mode === "view" && (
        <Button onClick={onEdit} data-testid="edit-button">
          <Edit2 className="h-4 w-4 mr-2" />
          Edit
        </Button>
      )}

      {mode === "edit" && (
        <>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
            data-testid="cancel-button"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={!isValid || isSaving}
            data-testid="save-button"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </>
      )}
    </div>
  );
}
