import type { BatchChanges } from "@/components/edit-sheet";
import type { RuleRecord } from "./useRulesQuery";

export function transformRule(rule: RuleRecord) {
  return {
    ...rule,
    categoryName: rule.category?.name || "",
  };
}

export function transformRulePayload(changes: BatchChanges<RuleRecord>) {
  return {
    newRules: changes.new.map(transformRule),
    updatedRules: changes.updated.map(transformRule),
    deletedIds: changes.deletedIds,
  };
}
