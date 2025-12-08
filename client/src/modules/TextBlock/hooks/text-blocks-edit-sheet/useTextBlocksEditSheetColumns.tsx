import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ESColumnDef } from "@/components/edit-sheet";
import type { TextBlockRecord } from "./useTextBlocksQuery";

export function useTextBlocksEditSheetColumns() {
  return useMemo<ESColumnDef<TextBlockRecord>[]>(
    () => [
      {
        id: "rawContent",
        accessorKey: "rawContent" as keyof TextBlockRecord,
        header: "Content",
        viewCell: ({ value }) => <span>{String(value)}</span>,
        editCell: ({ value, onChange, onFocus, disabled }) => (
          <Textarea
            value={String(value || "")}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onFocus}
            disabled={disabled}
            placeholder="Enter text block content..."
            data-testid="textarea-rawContent"
          />
        ),
        validation: (value) => {
          if (!value || String(value).trim() === "") {
            return "Content is required";
          }
        },
      },
      {
        id: "defaultPriority",
        accessorKey: "defaultPriority" as keyof TextBlockRecord,
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
    []
  );
}
