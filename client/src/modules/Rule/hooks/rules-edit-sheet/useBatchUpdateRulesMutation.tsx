import { trpc } from "@/lib/trpc/react";

export function useBatchUpdateRulesMutation() {
  const utils = trpc.useUtils();

  return trpc.rule.batchUpdate.useMutation({
    onSuccess: () => {
      utils.rule.getAll.invalidate();
    },
    onError: (error) => {
      console.error("Failed to save rules:", error);
      // Error will be handled by EditSheet component
      // which will remain in edit mode and show the error
    },
  });
}
