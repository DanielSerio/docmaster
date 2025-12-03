import { cn } from '@/lib/utils';
import type { PropsWithChildren } from 'react';

interface DTHeaderSlotProps extends PropsWithChildren {
  className?: string;
}

export function DTHeaderSlot({ children, className }: DTHeaderSlotProps) {
  const classNames = cn('px-4 py-2 border-b', className);

  return <div className={classNames}>{children}</div>;
}
