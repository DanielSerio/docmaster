import type { PagingType, PagingMethods } from '@/hooks/data-table';
import { trpc } from '@/lib/trpc/react';
import type { ErrorContextValue } from '@/contexts/error';
import type { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { useEffect } from 'react';

export function useDocumentListQuery(
  paging: Omit<PagingType, 'totalPages'>,
  setError: ErrorContextValue['setError'],
  setTotalPages: PagingMethods['setTotalPages'],
  filters: ColumnFiltersState = [],
  sorting: SortingState = []
) {
  const query = trpc.document.getAll.useQuery({
    ...paging,
    filters,
    sorting
  });

  useEffect(() => {
    if (query.error) {
      setError(query.error);
    }
  }, [query.error, setError]);

  useEffect(() => {
    if (query.data?.paging) {
      setTotalPages(query.data.paging.total.pages);
    }
  }, [query.data, setTotalPages]);

  return query;
}

export type DocumentRecord = NonNullable<
  ReturnType<typeof useDocumentListQuery>['data']
>['results'][number];
