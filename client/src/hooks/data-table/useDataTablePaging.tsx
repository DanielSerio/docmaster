import { useEffect, useState, useCallback, useMemo } from 'react';

const defaultPaging = {
  limit: 10,
  offset: 0,
  totalPages: 0
};

export type PagingType = typeof defaultPaging;

export function useDataTablePaging(paging?: PagingType) {
  const [pagination, setPagination] = useState<PagingType>(defaultPaging);

  useEffect(() => {
    if (paging) {
      setPagination(paging);
    }
  }, [paging]);

  const setTotalPages = useCallback((totalPages: number) => {
    setPagination((prev) => ({
      ...prev,
      totalPages
    }));
  }, []);

  const prevPage = useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      offset: Math.max(0, prev.offset - prev.limit)
    }));
  }, []);

  const nextPage = useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      offset: prev.offset + prev.limit
    }));
  }, []);

  const methods = useMemo(() => ({
    setTotalPages,
    prevPage,
    nextPage
  }), [setTotalPages, prevPage, nextPage]);

  return useMemo(() => [pagination, methods] as const, [pagination, methods]);
}

export type PagingMethods = ReturnType<typeof useDataTablePaging>[1];
export type PagingController = ReturnType<typeof useDataTablePaging>;
