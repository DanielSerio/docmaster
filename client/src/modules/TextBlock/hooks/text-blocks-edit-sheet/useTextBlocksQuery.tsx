import { trpc } from "@/lib/trpc/react";

export function useTextBlocksQuery() {
  return trpc.textBlock.getAll.useQuery();
}

export type TextBlockRecord = NonNullable<
  ReturnType<typeof useTextBlocksQuery>["data"]
>[number];
