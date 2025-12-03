import { Page } from '@/components/layout';
import {
  useDocumentListQuery,
  useDocumentTableColumns
} from '@/modules/Document/hooks/document-list';
import { useDataTableRows } from '@/hooks/data-table';
import { DataTable } from '@/components/data-table';

const createTestError = () => {
  const error = new Error(
    `Very long error message text that might be truncated or shown in a tooltip`
  );
  error.name = 'ReallyReallyLongTestErrorName';
  return error;
};

const err = createTestError();

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
        // error={listQuery.error as Error | null}
        error={err}
      />
    </Page>
  );
}
