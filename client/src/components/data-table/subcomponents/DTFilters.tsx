import type { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

interface DTFiltersProps extends PropsWithChildren {
  className?: string;
}

export function DTFilters({ children, className }: DTFiltersProps) {
  const classNames = cn('px-4 py-2 border-b', className);

  return <div className={classNames}>{children}</div>;
}
