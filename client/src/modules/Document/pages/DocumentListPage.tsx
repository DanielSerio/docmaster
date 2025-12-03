import { Page } from '@/components/layout';
import {
  useDocumentListQuery,
  useDocumentTableColumns
} from '@/modules/Document/hooks/document-list';
import { useDataTableRows } from '@/hooks/data-table';
import { DataTable } from '@/components/data-table';

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
        isLoading={listQuery.isLoading || true}
        error={listQuery.error as Error | null}
      />
    </Page>
  );
}
