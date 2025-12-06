import { useMemo } from "react";
import { trpc } from "@/lib/trpc/react";
import { Input } from "@/components/ui/input";
import { CategoryTypeAhead } from "@/components/ui/category-typeahead";
import type { ESColumnDef } from "@/components/edit-sheet";
import type { RuleRecord } from "./useRulesQuery";

export function useRulesEditSheetColumns() {
  const { data: categories } = trpc.ruleCategory.getAll.useQuery();

  return useMemo<ESColumnDef<RuleRecord>[]>(
    () => [
      {
        id: "rawContent",
        accessorKey: "rawContent" as keyof RuleRecord,
        header: "Rule Content",
        viewCell: ({ value }) => <span>{String(value)}</span>,
        editCell: ({ value, onChange, onFocus, disabled }) => (
          <Input
            value={String(value || "")}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onFocus}
            disabled={disabled}
            placeholder="Enter rule content..."
            data-testid="input-rawContent"
          />
        ),
        validation: (value) => {
          if (!value || String(value).trim() === "") {
            return "Content is required";
          }
        },
      },
      {
        id: "categoryName",
        accessorKey: "category" as keyof RuleRecord,
        header: "Category",
        viewCell: ({ row }) => {
          const rule = row as unknown as RuleRecord;
          return <span>{rule.category?.name || ""}</span>;
        },
        editCell: ({ row, onChange, onFocus, disabled }) => {
          const rule = row as unknown as RuleRecord;
          return (
            <CategoryTypeAhead
              value={rule.category?.name || ""}
              onChange={(newCategoryName) => {
                // Update the entire category object
                onChange({ name: newCategoryName });
              }}
              onFocus={onFocus}
              disabled={disabled}
              suggestions={categories?.map((cat) => cat.name) || []}
            />
          );
        },
        validation: (value, row) => {
          const rule = row as unknown as RuleRecord;
          if (!rule.category?.name || rule.category.name.trim() === "") {
            return "Category is required";
          }
        },
      },
      {
        id: "defaultPriority",
        accessorKey: "defaultPriority" as keyof RuleRecord,
        header: "Default Priority",
        viewCell: ({ value }) => <span>{String(value)}</span>,
        editCell: ({ value, onChange, onFocus, disabled }) => (
          <Input
            type="number"
            value={Number(value ?? 50)}
            onChange={(e) => onChange(Number(e.target.value))}
            onFocus={onFocus}
            disabled={disabled}
            min={1}
            max={100}
            data-testid="input-defaultPriority"
          />
        ),
        validation: (value) => {
          const num = Number(value);
          if (num < 1 || num > 100) {
            return "Priority must be between 1 and 100";
          }
        },
      },
    ],
    [categories]
  );
}
