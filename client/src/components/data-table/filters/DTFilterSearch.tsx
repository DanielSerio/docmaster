import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import type { DTFilterProps } from './types';
import { useState, useEffect } from 'react';

export function DTFilterSearch({ value, onChange }: DTFilterProps) {
  const [localValue, setLocalValue] = useState((value as string) ?? '');

  // Sync local value when external value changes
  useEffect(() => {
    setLocalValue((value as string) ?? '');
  }, [value]);

  // Debounce the onChange callback
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(localValue || undefined);
    }, 300);

    return () => clearTimeout(timeout);
  }, [localValue, onChange]);

  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search..."
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className="pl-8"
      />
    </div>
  );
}
