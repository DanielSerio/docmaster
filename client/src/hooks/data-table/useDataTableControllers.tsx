import { useDataTablePaging } from './useDataTablePaging';
import { useDataTableFiltering } from './useDataTableFiltering';
import { useDataTableSorting } from './useDataTableSorting';

export function useDataTableControllers() {
  const pagingController = useDataTablePaging();
  const [pagination, { setTotalPages }] = pagingController;

  const filteringController = useDataTableFiltering();
  const [columnFilters] = filteringController;

  const sortingController = useDataTableSorting();
  const [sorting] = sortingController;

  return {
    pagingController,
    pagination,
    setTotalPages,
    filteringController,
    columnFilters,
    sortingController,
    sorting
  };
}
