import { Page } from '@/components/layout';
import { DataTable } from '@/components/data-table';
import { useDataTableRows, useDataTableControllers } from '@/hooks/data-table';
import {
  useDocumentListQuery,
  useDocumentTableColumns
} from '@/modules/Document/hooks/document-list';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useErrorReporter } from '@/contexts/error';

export function DocumentListPage() {
  const { reportError } = useErrorReporter();
  const {
    pagingController,
    pagination,
    setTotalPages,
    filteringController,
    columnFilters,
    sortingController,
    sorting
  } = useDataTableControllers();
  const listQuery = useDocumentListQuery(pagination, reportError, setTotalPages, columnFilters, sorting);
  const rows = useDataTableRows(listQuery.data?.results);
  const columnDefs = useDocumentTableColumns();

  return (
    <Page>
      <DataTable
        id="document-list"
        rows={rows}
        columnDefs={columnDefs}
        getRowId={(row) => `${row.id}`}
        isLoading={listQuery.isLoading}
        emptyTitle="No Documents"
        emptyDescription="You haven't created any documents yet. Get started by creating your first document."
        pagingController={pagingController}
        filteringController={filteringController}
        sortingController={sortingController}
      >
        <DataTable.TitleBar>
          <div className="flex items-center justify-between py-2">
            <h1 className="text-xl font-medium" data-testid="page-heading">Documents</h1>
            <Button
              asChild
              className="cursor-pointer"
              variant="default"
              size="sm"
            >
              <Link to="/documents/new">
                <span>Create Document</span>
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
