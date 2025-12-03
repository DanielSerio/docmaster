import type { PropsWithChildren } from 'react';

interface DTHeaderSlotProps extends PropsWithChildren {
  className?: string;
}

export function DTHeaderSlot({ children, className }: DTHeaderSlotProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
