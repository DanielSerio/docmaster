import type { DTRowProps } from '../types';
import { TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

export function DTRow({ gridTemplateColumns, children, className }: DTRowProps) {
  const classNames = cn(`grid`, className);

  return (
    <TableRow
      className={classNames}
      style={{ gridTemplateColumns }}
    >
      {children}
    </TableRow>
  );
}
