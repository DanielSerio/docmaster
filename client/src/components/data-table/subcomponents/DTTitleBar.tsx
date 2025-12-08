import type { PropsWithChildren } from 'react';
import { DTSection } from './DTSection';

interface DTTitleBarProps extends PropsWithChildren {
  className?: string;
}

export function DTTitleBar({ children, className }: DTTitleBarProps) {
  return (
    <DTSection className={className}>
      {children}
    </DTSection>
  );
}
