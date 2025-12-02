import { Page } from "@/components/layout";
import { useDocumentListQuery } from "@/modules/Document/hooks/document-list/useDocumentListQuery";

export function DocumentListPage() {
  const listQuery = useDocumentListQuery();

  return (
    <Page>
      <div>
        <h1>Document List</h1>
        {listQuery.isPending && <div>Loading...</div>}
        {listQuery.isError && <div>Error: {listQuery.error.message}</div>}
        {listQuery.isSuccess && listQuery.data.length === 0 && (
          <div>No documents found</div>
        )}
        {listQuery.isSuccess && listQuery.data.length > 0 && (
          <ul>
            {listQuery.data.map((document) => (
              <li key={document.id}>{document.filename}</li>
            ))}
          </ul>
        )}
      </div>
    </Page>
  );
}