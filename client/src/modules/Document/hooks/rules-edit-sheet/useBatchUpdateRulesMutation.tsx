import { trpc } from "@/lib/trpc/react";
import type { BatchChanges } from "@/components/edit-sheet";

export function useBatchUpdateRulesMutation() {
  const utils = trpc.useUtils();

  return trpc.documentRule.batchUpdate.useMutation({
    onSuccess: () => {
      utils.documentRule.getDocumentRules.invalidate();
    },
  });
}

export interface RuleBatchPayload {
  documentId: number;
  changes: BatchChanges<{
    ruleId: number;
    priority: number;
    isEnabled: boolean;
  }>;
}
