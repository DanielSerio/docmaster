import { TableBody } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { DTRow } from './DTRow';
import { DTCell } from './DTCell';

export function DTTableSkeleton({
  skeletonRowCount,
  gridTemplateColumns,
  columnCount
}: {
  skeletonRowCount: number;
  gridTemplateColumns: string;
  columnCount: number;
}) {
  return (
    <TableBody>
      {Array.from({ length: skeletonRowCount }).map((_, index) => (
        <DTRow
          key={index}
          gridTemplateColumns={gridTemplateColumns}
        >
          {Array.from({ length: columnCount }).map((_, cellIndex) => (
            <DTCell
              key={cellIndex}
              align="left"
            >
              <Skeleton className="h-4 w-full m-2" />
            </DTCell>
          ))}
        </DTRow>
      ))}
    </TableBody>
  );
}
