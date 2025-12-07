import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEditSheetContext } from '../EditSheetContext';

interface ESActionsProps {
  rowIndex: number;
  disabled?: boolean;
}

export function ESActions({ rowIndex, disabled }: ESActionsProps) {
  const { onRowDelete } = useEditSheetContext();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => onRowDelete(rowIndex)}
      disabled={disabled}
      data-testid="delete-button"
      aria-label="Delete row"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
