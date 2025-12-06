import { useMemo } from "react";
import { trpc } from "@/lib/trpc/react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
        id: "categoryId",
        accessorKey: "categoryId" as keyof RuleRecord,
        header: "Category",
        viewCell: ({ row }) => {
          const rule = row as unknown as RuleRecord;
          return <span>{rule.category?.name || ""}</span>;
        },
        editCell: ({ value, onChange, onFocus, disabled }) => (
          <Select
            value={value ? String(value) : ""}
            onValueChange={(val) => onChange(Number(val))}
            disabled={disabled}
          >
            <SelectTrigger data-testid="select-category" onFocus={onFocus}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ),
        validation: (value) => {
          if (!value) {
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
