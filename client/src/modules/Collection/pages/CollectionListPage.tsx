import { Page } from '@/components/layout';
import { DataTable } from '@/components/data-table';
import { useDataTablePaging, useDataTableRows, useDataTableFiltering, useDataTableSorting } from '@/hooks/data-table';
import {
  useCollectionListQuery,
  useCollectionTableColumns
} from '@/modules/Collection/hooks/collection-list';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useError } from '@/contexts/error';

export function CollectionListPage() {
  const { setError } = useError();
  const pagingController = useDataTablePaging();
  const [pagination, { setTotalPages }] = pagingController;
  const filteringController = useDataTableFiltering();
  const [columnFilters] = filteringController;
  const sortingController = useDataTableSorting();
  const [sorting] = sortingController;
  const listQuery = useCollectionListQuery(pagination, setError, setTotalPages, columnFilters, sorting);
  const rows = useDataTableRows(listQuery.data?.results);
  const columnDefs = useCollectionTableColumns();

  return (
    <Page>
      <DataTable
        id="collection-list"
        rows={rows}
        columnDefs={columnDefs}
        getRowId={(row) => `${row.id}`}
        isLoading={listQuery.isLoading}
        emptyTitle="No Collections"
        emptyDescription="You haven't created any collections yet. Get started by creating your first collection."
        pagingController={pagingController}
        filteringController={filteringController}
        sortingController={sortingController}
      >
        <DataTable.TitleBar>
          <div className="flex items-center justify-between py-2">
            <h1 className="text-xl font-medium">Collections</h1>
            <Button
              asChild
              className="cursor-pointer"
              variant="default"
              size="sm"
            >
              <Link to="/collections/new">
                <span>Create Collection</span>
                <PlusIcon />
              </Link>
            </Button>
          </div>
        </DataTable.TitleBar>
        <DataTable.Filters>
          <DataTable.Filter />
        </DataTable.Filters>
      </DataTable>
    </Page>
  );
}
