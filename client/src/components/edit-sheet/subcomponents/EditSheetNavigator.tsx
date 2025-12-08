import { useEditSheetContext } from '../EditSheetContext';
import type { ESRowType } from '../types';
import { useEditSheetKeyboardNavigation } from '@/hooks/edit-sheet/useEditSheetKeyboardNavigation';

interface EditSheetNavigatorProps {
  children: React.ReactNode;
}

export function EditSheetNavigator<TData extends ESRowType>({ children }: EditSheetNavigatorProps) {
  const { mode, data, columns } = useEditSheetContext<TData>();
  const { tableRef } = useEditSheetKeyboardNavigation({
    mode,
    rowCount: data.length,
    columnCount: columns.length
  });

  return <div ref={tableRef}>{children}</div>;
}
