import type { ESRowType } from "./types";

export function isRowEmpty<TData extends ESRowType>(row: TData): boolean {
  // Check if a row has any meaningful data
  const keys = Object.keys(row).filter(
    (key) => key !== "__isNew" && key !== "__isDeleted" && key !== "id"
  );
  return keys.every((key) => {
    const value = row[key as keyof TData];
    return value === undefined || value === null || value === "";
  });
}
