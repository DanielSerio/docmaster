import { Page } from "@/components/layout";
import { EditSheet } from "@/components/edit-sheet";
import { useTextBlocksQuery, useTextBlocksEditSheetColumns, useBatchUpdateTextBlocksMutation } from "../hooks/text-blocks-edit-sheet";
import { transformTextBlockPayload } from "../utils/transformTextBlockPayload";
import type { BatchChanges } from "@/components/edit-sheet";
import type { TextBlockRecord } from "../hooks/text-blocks-edit-sheet/useTextBlocksQuery";

export function TextBlockListPage() {
  const textBlocksQuery = useTextBlocksQuery();
  const columns = useTextBlocksEditSheetColumns();
  const mutation = useBatchUpdateTextBlocksMutation();

  const handleSave = async (changes: BatchChanges<TextBlockRecord>) => {
    await mutation.mutateAsync(transformTextBlockPayload(changes));
  };

  return (
    <Page>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6" data-testid="page-heading">Text Blocks</h1>
        <EditSheet
          data={textBlocksQuery.data || []}
          columns={columns}
          isLoading={textBlocksQuery.isLoading}
          onSave={handleSave}
          getRowId={(row) => String(row.id || "new")}
        />
      </div>
    </Page>
  );
}
