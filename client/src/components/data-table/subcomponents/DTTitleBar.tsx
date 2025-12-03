import { cn } from '@/lib/utils';
import type { PropsWithChildren } from 'react';

interface DTTitleBarProps extends PropsWithChildren {
  className?: string;
}

export function DTTitleBar({ children, className }: DTTitleBarProps) {
  const classNames = cn('px-4 py-2 border-b', className);

  return <div className={classNames}>{children}</div>;
}
