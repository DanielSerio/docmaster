import { useState, useCallback, useMemo, useRef } from 'react';
import type { ColumnFiltersState } from '@tanstack/react-table';

export function useDataTableFiltering() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const filtersRef = useRef(columnFilters);
  filtersRef.current = columnFilters;

  const setFilter = useCallback((columnId: string, value: unknown) => {
    setColumnFilters((prev) => {
      const existing = prev.find((f) => f.id === columnId);
      const filtered = prev.filter((f) => f.id !== columnId);

      // If clearing and already cleared, no change needed
      if ((value === undefined || value === null || value === '') && !existing) {
        return prev;
      }

      // If setting to same value, no change needed
      if (existing && existing.value === value) {
        return prev;
      }

      // If clearing, return filtered list
      if (value === undefined || value === null || value === '') {
        return filtered;
      }

      // Otherwise add/update the filter
      return [...filtered, { id: columnId, value }];
    });
  }, []);

  const clearFilter = useCallback((columnId: string) => {
    setColumnFilters((prev) => prev.filter((f) => f.id !== columnId));
  }, []);

  const clearAllFilters = useCallback(() => {
    setColumnFilters([]);
  }, []);

  const getFilter = useCallback((columnId: string) => {
    return filtersRef.current.find((f) => f.id === columnId)?.value;
  }, []);

  const methods = useMemo(() => ({
    setFilter,
    clearFilter,
    clearAllFilters,
    getFilter
  }), [setFilter, clearFilter, clearAllFilters, getFilter]);

  return useMemo(() => [columnFilters, setColumnFilters, methods] as const, [columnFilters, methods]);
}

export type FilteringMethods = ReturnType<typeof useDataTableFiltering>[2];
export type FilteringController = ReturnType<typeof useDataTableFiltering>;
