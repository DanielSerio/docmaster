import { useError } from '@/contexts/error';
import { Button } from '@/components/ui/button';
import { AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ErrorSnackbar() {
  const { error, clearError } = useError();

  if (!error) return null;

  return (
    <div
      className={cn(
        'fixed top-14 left-0 right-0 z-40',
        'bg-destructive text-destructive-foreground',
        'flex items-center justify-between gap-3',
        'px-4 py-1',
        'animate-in slide-in-from-top duration-300',
        'shadow-md'
      )}
    >
      <div className="flex items-center gap-3 flex-1">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span className="text-sm">{error.message}</span>
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={clearError}
        className="h-6 w-6 shrink-0 hover:bg-white/20 text-white"
        aria-label="Dismiss error"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
