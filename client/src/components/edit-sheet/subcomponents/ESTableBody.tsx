import { TableBody, TableRow, TableCell } from '@/components/ui/table';
import { useEditSheetContext } from '../EditSheetContext';
import type { ESRowType } from '../types';
import { ESActions } from './ESActions';

export function ESTableBody<TData extends ESRowType>() {
  const { mode, data, columns, onRowChange, onCellFocus, getRowId, getFieldError } =
    useEditSheetContext<TData>();

  if (data.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell
            colSpan={mode === 'edit' ? columns.length + 1 : columns.length}
            className="h-24 text-center"
          >
            No data available.
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody className="divide-y divide-gray-200">
      {data.map((row, rowIndex) => {
        const isDeleted = row.__isDeleted;

        return (
          <TableRow
            key={getRowId(row)}
            className={isDeleted ? 'opacity-50 line-through' : ''}
            data-testid={`edit-sheet-row-${rowIndex}`}
          >
            {columns.map((column, colIndex) => {
              const value = row[column.accessorKey];
              const error = getFieldError(rowIndex, column.id);

              return (
                <TableCell
                  key={column.id}
                  data-row={rowIndex}
                  data-col={colIndex}
                  data-testid={`cell-${rowIndex}-${column.id}`}
                  className="align-top"
                >
                  <div className="flex flex-col gap-1">
                    {mode === 'view'
                      ? column.viewCell({ row, value })
                      : column.editCell({
                          row,
                          value,
                          onChange: (newValue) =>
                            onRowChange(rowIndex, column.accessorKey, newValue),
                          onFocus: () => onCellFocus(rowIndex),
                          disabled: isDeleted
                        })}
                    {error && mode === 'edit' && (
                      <span className="text-xs text-destructive">{error}</span>
                    )}
                  </div>
                </TableCell>
              );
            })}

            {mode === 'edit' && (
              <TableCell>
                <ESActions
                  rowIndex={rowIndex}
                  disabled={isDeleted || rowIndex === data.length - 1}
                />
              </TableCell>
            )}
          </TableRow>
        );
      })}
    </TableBody>
  );
}
