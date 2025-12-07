import { useDataTableContext } from '../DataTableContext';
import {
  DTFilterSearch,
  DTFilterSelect,
  DTFilterMultiSelect,
  DTFilterDateRange,
  DTFilterNumberRange
} from '../filters';
import type { DTRowType } from '../types';
import type { DTMetaFilter } from '../filters.types';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useMemo, useCallback, memo } from 'react';

interface FilterColumnProps {
  columnId: string;
  filterConfig: DTMetaFilter;
  value: unknown;
  setFilter: (columnId: string, value: unknown) => void;
  clearFilter: (columnId: string) => void;
}

const FilterColumn = memo(function FilterColumn({
  columnId,
  filterConfig,
  value,
  setFilter,
  clearFilter
}: FilterColumnProps) {
  const onChange = useCallback(
    (newValue: unknown) => {
      setFilter(columnId, newValue);
    },
    [columnId, setFilter]
  );

  const onClear = useCallback(() => {
    clearFilter(columnId);
  }, [columnId, clearFilter]);

  const props = useMemo(
    () => ({
      columnId,
      filterConfig,
      value,
      onChange,
      onClear
    }),
    [columnId, filterConfig, value, onChange, onClear]
  );

  switch (filterConfig.type) {
    case 'search':
      return <DTFilterSearch {...props} />;
    case 'select':
      return <DTFilterSelect {...props} />;
    case 'multi-select':
      return <DTFilterMultiSelect {...props} />;
    case 'date-range':
      return <DTFilterDateRange {...props} />;
    case 'number-range':
      return <DTFilterNumberRange {...props} />;
    default:
      return null;
  }
});

export function DTFilter<TData extends DTRowType>() {
  const { table, filteringController } = useDataTableContext<TData>();

  if (!filteringController) {
    return null;
  }

  const [columnFilters, , { setFilter, clearFilter, getFilter, clearAllFilters }] =
    filteringController;

  const filterableColumns = useMemo(() => {
    return table.getAllColumns().filter((column) => {
      return column.columnDef.meta?.filter !== undefined;
    });
  }, [table]);

  const hasActiveFilters = columnFilters.length > 0;

  if (filterableColumns.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-4 items-center">
      {filterableColumns.map((column) => {
        const filterConfig = column.columnDef.meta?.filter;
        if (!filterConfig) return null;

        const value = getFilter(column.id);

        return (
          <div
            key={column.id}
            className="flex flex-col gap-1"
          >
            <label className="text-xs font-medium text-muted-foreground">
              {typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}
            </label>
            <FilterColumn
              columnId={column.id}
              filterConfig={filterConfig}
              value={value}
              setFilter={setFilter}
              clearFilter={clearFilter}
            />
          </div>
        );
      })}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          className="h-8"
        >
          <X className="h-4 w-4 mr-1" />
          Clear All
        </Button>
      )}
    </div>
  );
}
