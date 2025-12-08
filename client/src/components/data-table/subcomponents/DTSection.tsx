import { cn } from '@/lib/utils';
import type { PropsWithChildren } from 'react';

interface DTSectionProps extends PropsWithChildren {
  className?: string;
}

export function DTSection({ children, className }: DTSectionProps) {
  return <div className={cn('px-4 py-2 border-b', className)}>{children}</div>;
}
