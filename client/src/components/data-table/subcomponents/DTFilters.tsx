import type { PropsWithChildren } from 'react';

interface DTFiltersProps extends PropsWithChildren {
  className?: string;
}

export function DTFilters({ children, className }: DTFiltersProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
