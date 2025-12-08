import type { PagingType, PagingMethods } from '@/hooks/data-table';
import { trpc } from '@/lib/trpc/react';
import type { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { useEffect } from 'react';

export function useCollectionListQuery(
  paging: Omit<PagingType, 'totalPages'>,
  onError: (error: unknown) => void,
  setTotalPages: PagingMethods['setTotalPages'],
  filters: ColumnFiltersState = [],
  sorting: SortingState = []
) {
  const query = trpc.documentCollection.getAll.useQuery({
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

export type CollectionRecord = NonNullable<
  ReturnType<typeof useCollectionListQuery>['data']
>['results'][number];
