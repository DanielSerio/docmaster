import { useState, useCallback, useMemo } from 'react';
import type { SortingState } from '@tanstack/react-table';

interface UseDataTableSortingOptions {
  defaultSorting?: SortingState;
}

export function useDataTableSorting(options?: UseDataTableSortingOptions) {
  const [sorting, setSorting] = useState<SortingState>(options?.defaultSorting || []);

  const toggleSort = useCallback((columnId: string, isMultiSort: boolean = false) => {
    setSorting((prev) => {
      const existing = prev.find((s) => s.id === columnId);
      const filtered = prev.filter((s) => s.id !== columnId);

      // If not multi-sort, clear other sorts
      const base = isMultiSort ? filtered : [];

      // Cycle: none -> asc -> desc -> none
      if (!existing) {
        // Add ascending
        return [...base, { id: columnId, desc: false }];
      } else if (!existing.desc) {
        // Change to descending
        return [...base, { id: columnId, desc: true }];
      } else {
        // Remove sort (back to none)
        return base;
      }
    });
  }, []);

  const clearSort = useCallback((columnId: string) => {
    setSorting((prev) => prev.filter((s) => s.id !== columnId));
  }, []);

  const clearAllSorts = useCallback(() => {
    setSorting([]);
  }, []);

  const methods = useMemo(() => ({
    toggleSort,
    clearSort,
    clearAllSorts
  }), [toggleSort, clearSort, clearAllSorts]);

  return useMemo(() => [sorting, setSorting, methods] as const, [sorting, methods]);
}

export type SortingMethods = ReturnType<typeof useDataTableSorting>[2];
export type SortingController = ReturnType<typeof useDataTableSorting>;
