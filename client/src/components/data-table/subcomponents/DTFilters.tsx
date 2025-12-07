import type { PropsWithChildren } from 'react';
import { DTSection } from './DTSection';

interface DTFiltersProps extends PropsWithChildren {
  className?: string;
}

export function DTFilters({ children, className }: DTFiltersProps) {
  return (
    <DTSection className={className}>
      {children}
    </DTSection>
  );
}
