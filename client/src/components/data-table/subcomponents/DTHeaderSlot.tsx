import type { PropsWithChildren } from 'react';
import { DTSection } from './DTSection';

interface DTHeaderSlotProps extends PropsWithChildren {
  className?: string;
}

export function DTHeaderSlot({ children, className }: DTHeaderSlotProps) {
  return (
    <DTSection className={className}>
      {children}
    </DTSection>
  );
}
