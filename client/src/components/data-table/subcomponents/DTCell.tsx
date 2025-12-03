import { TableCell } from '@/components/ui/table';
import type { DTCellProps } from '../types';
import { cn } from '@/lib/utils';

export function DTCell({ align = 'left', children, className }: DTCellProps) {
  const justifyContent = align === 'left' ? 'start' : align === 'right' ? 'end' : 'center';
  const classNames = cn(`flex px-2 py-1 justify-${justifyContent}`, className);

  return <TableCell className={classNames}>{children}</TableCell>;
}
