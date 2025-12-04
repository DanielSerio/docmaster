import type { PagingType } from '@/hooks/data-table';
import { trpc } from '@/lib/trpc/react';
import type { ErrorContextValue } from '@/contexts/error';
import { useEffect } from 'react';

export function useDocumentListQuery(
  paging: Omit<PagingType, 'totalPages'>,
  setError: ErrorContextValue['setError']
) {
  const query = trpc.document.getAll.useQuery(paging);

  useEffect(() => {
    if (query.error) {
      setError(query.error);
    }
  }, [query.error, setError]);

  return query;
}

export type DocumentRecord = NonNullable<
  ReturnType<typeof useDocumentListQuery>['data']
>['results'][number];
