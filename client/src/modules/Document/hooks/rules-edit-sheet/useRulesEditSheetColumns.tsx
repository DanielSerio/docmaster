import { useMemo } from "react";
import { trpc } from "@/lib/trpc/react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ESColumnDef } from "@/components/edit-sheet";
import type { DocumentRuleRecord } from "./useDocumentRulesQuery";

export function useRulesEditSheetColumns() {
  const { data: categories } = trpc.ruleCategory.getAll.useQuery();

  return useMemo<ESColumnDef<DocumentRuleRecord>[]>(
    () => [
      {
        id: "rawContent",
        accessorKey: "rawContent" as keyof DocumentRuleRecord,
        header: "Rule Content",
        viewCell: ({ value }) => <span>{String(value)}</span>,
        editCell: ({ value, onChange, disabled }) => (
          <Input
            value={String(value || "")}
            onChange={(e) => onChange(e.target.value)}
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
        accessorKey: "categoryId" as keyof DocumentRuleRecord,
        header: "Category",
        viewCell: ({ row }) => {
          const rule = row as unknown as DocumentRuleRecord;
          return <span>{rule.rule?.category?.name || ""}</span>;
        },
        editCell: ({ value, onChange, disabled }) => (
          <Select
            value={value ? String(value) : ""}
            onValueChange={(val) => onChange(Number(val))}
            disabled={disabled}
          >
            <SelectTrigger data-testid="select-category">
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
      },
      {
        id: "priority",
        accessorKey: "priority" as keyof DocumentRuleRecord,
        header: "Priority",
        viewCell: ({ value }) => <span>{String(value)}</span>,
        editCell: ({ value, onChange, disabled }) => (
          <Input
            type="number"
            value={Number(value ?? 50)}
            onChange={(e) => onChange(Number(e.target.value))}
            disabled={disabled}
            min={1}
            max={100}
            data-testid="input-priority"
          />
        ),
        validation: (value) => {
          const num = Number(value);
          if (num < 1 || num > 100) {
            return "Priority must be between 1 and 100";
          }
        },
      },
      {
        id: "isEnabled",
        accessorKey: "isEnabled" as keyof DocumentRuleRecord,
        header: "Enabled",
        viewCell: ({ value }) => <span>{value ? "✓" : "✗"}</span>,
        editCell: ({ value, onChange, disabled }) => (
          <Checkbox
            checked={Boolean(value ?? true)}
            onCheckedChange={onChange}
            disabled={disabled}
            data-testid="checkbox-isEnabled"
          />
        ),
      },
    ],
    [categories]
  );
}
