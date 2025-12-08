import { Table } from '@/components/ui/table';
import { ESToolbar } from './subcomponents/ESToolbar';
import { ESTableHeader } from './subcomponents/ESTableHeader';
import { ESTableBody } from './subcomponents/ESTableBody';
import { EditSheetNavigator } from './subcomponents/EditSheetNavigator';
import { EditSheetProvider } from './EditSheetContext';
import type { EditSheetProps, ESRowType, BatchChanges } from './types';
import { useEditSheetState } from '@/hooks/edit-sheet/useEditSheetState';
import { useMemo } from 'react';

function EditSheetRoot<TData extends ESRowType, TSave = BatchChanges<TData>>({
  data,
  columns,
  isLoading,
  onSave,
  mapChanges,
  getRowId
}: EditSheetProps<TData, TSave>) {
  const {
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
  } = useEditSheetState<TData, TSave>({ data, columns, isLoading, onSave, mapChanges, getRowId });

  const contextValue = useMemo(
    () => ({
      mode,
      data: localData,
      columns,
      onRowChange: handleRowChange,
      onRowDelete: handleRowDelete,
      onCellFocus: handleCellFocus,
      getRowId,
      getFieldError: validation.getFieldError
    }),
    [
      mode,
      localData,
      columns,
      handleRowChange,
      handleRowDelete,
      handleCellFocus,
      getRowId,
      validation.getFieldError
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
          hasMeaningfulChanges={hasMeaningfulChanges}
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
