import { TableHead } from "@/components/ui/table";
import type { DTCellProps } from "../types";
import { cn } from "@/lib/utils";

export function DTHead({ align = 'left', children, className }: DTCellProps) {
  const justifyContent = align === "left" ? "start" : align === "right" ? "end" : "center";
  const classNames = cn(`px-2 py-1 justify-${justifyContent}`, className);

  return (
    <TableHead className={classNames}>
      {children}
    </TableHead>
  );
}