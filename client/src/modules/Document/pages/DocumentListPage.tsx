import { Page } from '@/components/layout';
import { DataTable } from '@/components/data-table';
import { useDataTableRows } from '@/hooks/data-table';
import {
  useDocumentListQuery,
  useDocumentTableColumns
} from '@/modules/Document/hooks/document-list';

export function DocumentListPage() {
  const listQuery = useDocumentListQuery();
  const rows = useDataTableRows(listQuery.data);
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
      >
        <DataTable.TitleBar>
          <h1>Document Title Bar</h1>
        </DataTable.TitleBar>
        <DataTable.Filters>
          <p>Filters will go here</p>
        </DataTable.Filters>
        <DataTable.Header>
          <p>Header controls will go here</p>
        </DataTable.Header>
      </DataTable>
    </Page>
  );
}
