import { TableHeader } from '@/components/ui/table';
import type { DTHeaderProps, DTRowType } from '../types';
import { DTRow } from './DTRow';
import { DTHead } from './DTHead';
import { flexRender } from '@tanstack/react-table';

export function DTTableHeader<TData extends DTRowType>({
  table,
  gridTemplateColumns
}: DTHeaderProps<TData>) {
  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <DTRow
          key={headerGroup.id}
          gridTemplateColumns={gridTemplateColumns}
        >
          {headerGroup.headers.map((header) => {
            return (
              <DTHead
                key={header.id}
                align={header.column.columnDef.meta?.align}
              >
                {header.isPlaceholder ? null : (
                  <>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {/* <SortButton header={header} /> */}
                  </>
                )}
              </DTHead>
            );
          })}
        </DTRow>
      ))}
    </TableHeader>
  );
}
