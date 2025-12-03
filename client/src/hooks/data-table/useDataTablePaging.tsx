import { useEffect, useState } from 'react';

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

  const setTotalPages = (totalPages: number) =>
    setPagination((prev) => ({
      ...prev,
      totalPages
    }));

  const prevPage = () =>
    setPagination((prev) => ({
      ...prev,
      offset: prev.offset > prev.limit ? prev.offset - prev.limit : 0
    }));

  const nextPage = () =>
    setPagination((prev) => ({
      ...prev,
      offset: prev.offset + prev.limit
    }));

  const methods = {
    setTotalPages,
    prevPage,
    nextPage
  };

  return [pagination, methods] as const;
}

export type PagingMethods = ReturnType<typeof useDataTablePaging>[1];
export type PagingController = ReturnType<typeof useDataTablePaging>;
