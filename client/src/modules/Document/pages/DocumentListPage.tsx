import { Page } from '@/components/layout';
import { DataTable } from '@/components/data-table';
import { useDataTablePaging, useDataTableRows } from '@/hooks/data-table';
import {
  useDocumentListQuery,
  useDocumentTableColumns
} from '@/modules/Document/hooks/document-list';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export function DocumentListPage() {
  const pagingController = useDataTablePaging();
  const [pagination] = pagingController;
  const listQuery = useDocumentListQuery(pagination);
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
        error={listQuery.error as Error | null}
        pagingController={pagingController}
      >
        <DataTable.TitleBar>
          <div className="flex items-center justify-between py-2">
            <h1 className="text-xl font-medium">Documents</h1>
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
          <p>Filters will go here</p>
        </DataTable.Filters>
      </DataTable>
    </Page>
  );
}
