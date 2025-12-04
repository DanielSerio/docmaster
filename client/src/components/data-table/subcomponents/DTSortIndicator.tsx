import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DTSortIndicatorProps {
  direction: 'asc' | 'desc' | false;
  priority?: number;
  className?: string;
}

export function DTSortIndicator({ direction, priority, className }: DTSortIndicatorProps) {
  const showPriority = priority !== undefined && priority > 0;

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {direction === 'asc' && (
        <ArrowUp className="h-3.5 w-3.5 text-foreground" />
      )}
      {direction === 'desc' && (
        <ArrowDown className="h-3.5 w-3.5 text-foreground" />
      )}
      {direction === false && (
        <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
      {showPriority && (
        <span className="text-xs font-medium text-muted-foreground bg-muted px-1 rounded">
          {priority + 1}
        </span>
      )}
    </div>
  );
}
