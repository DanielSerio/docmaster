import type { PagingType } from '@/hooks/data-table';
import { trpc } from '@/lib/trpc/react';

export function useDocumentListQuery(paging: Omit<PagingType, 'totalPages'>) {
  return trpc.document.getAll.useQuery(paging);
}

export type DocumentRecord = NonNullable<
  ReturnType<typeof useDocumentListQuery>['data']
>['results'][number];
