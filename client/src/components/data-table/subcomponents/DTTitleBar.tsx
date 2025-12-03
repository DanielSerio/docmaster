import type { PropsWithChildren } from 'react';

interface DTTitleBarProps extends PropsWithChildren {
  className?: string;
}

export function DTTitleBar({ children, className }: DTTitleBarProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
