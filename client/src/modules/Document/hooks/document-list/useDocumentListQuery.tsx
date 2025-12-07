import type { PagingType, PagingMethods } from '@/hooks/data-table';
import { trpc } from '@/lib/trpc/react';
import type { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { useEffect } from 'react';
import type { TRPCClientErrorLike } from '@trpc/client';
import type { AppRouter } from '../../../../../server/src/routers';

export function useDocumentListQuery(
  paging: Omit<PagingType, 'totalPages'>,
  onError: (error: TRPCClientErrorLike<AppRouter>) => void,
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
      onError(query.error);
    }
  }, [query.error, onError]);

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
