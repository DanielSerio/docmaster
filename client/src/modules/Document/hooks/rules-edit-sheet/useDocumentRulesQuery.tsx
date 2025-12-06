import { trpc } from "@/lib/trpc/react";

export function useDocumentRulesQuery(documentId: number) {
  return trpc.documentRule.getDocumentRules.useQuery({
    documentId,
  });
}

export type DocumentRuleRecord = NonNullable<
  ReturnType<typeof useDocumentRulesQuery>["data"]
>[number];
