import type { BatchChanges } from "@/components/edit-sheet";
import type { TextBlockRecord } from "../hooks/text-blocks-edit-sheet/useTextBlocksQuery";

export function transformTextBlockPayload(changes: BatchChanges<TextBlockRecord>) {
  return {
    newTextBlocks: changes.new,
    updatedTextBlocks: changes.updated,
    deletedIds: changes.deletedIds,
  };
}
