import { trpc } from "@/lib/trpc/react";

export function useDocumentListQuery() {
  return trpc.document.getAll.useQuery();
}