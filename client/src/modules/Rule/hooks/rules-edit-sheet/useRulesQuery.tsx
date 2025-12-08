import { trpc } from "@/lib/trpc/react";

export function useRulesQuery() {
  return trpc.rule.getAll.useQuery();
}

export type RuleRecord = NonNullable<
  ReturnType<typeof useRulesQuery>["data"]
>[number];
