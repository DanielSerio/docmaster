import { Page } from "@/components/layout";
import { EditSheet } from "@/components/edit-sheet";
import { useRulesQuery, useRulesEditSheetColumns, useBatchUpdateRulesMutation } from "../hooks/rules-edit-sheet";
import { transformRulePayload } from "../utils/transformRulePayload";
import type { BatchChanges } from "@/components/edit-sheet";
import type { RuleRecord } from "../hooks/rules-edit-sheet/useRulesQuery";

export function RuleListPage() {
  const rulesQuery = useRulesQuery();
  const columns = useRulesEditSheetColumns();
  const mutation = useBatchUpdateRulesMutation();

  const handleSave = async (changes: BatchChanges<RuleRecord>) => {
    await mutation.mutateAsync(transformRulePayload(changes));
  };

  return (
    <Page>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6" data-testid="page-heading">Rules</h1>
        <EditSheet
          data={rulesQuery.data || []}
          columns={columns}
          isLoading={rulesQuery.isLoading}
          onSave={handleSave}
          getRowId={(row) => String(row.id || "new")}
        />
      </div>
    </Page>
  );
}
