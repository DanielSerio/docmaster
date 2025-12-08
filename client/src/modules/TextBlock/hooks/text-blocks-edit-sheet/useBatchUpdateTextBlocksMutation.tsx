import { trpc } from "@/lib/trpc/react";

export function useBatchUpdateTextBlocksMutation() {
  const utils = trpc.useUtils();

  return trpc.textBlock.batchUpdate.useMutation({
    onSuccess: () => {
      utils.textBlock.getAll.invalidate();
    },
    onError: (error: unknown) => {
      console.error("Failed to save text blocks:", error);
      // Error will be handled by EditSheet component
      // which will remain in edit mode and show the error
    },
  });
}
