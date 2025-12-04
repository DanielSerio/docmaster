import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import type { DTFilterProps } from './types';

export function DTFilterSearch({ value, onChange }: DTFilterProps) {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search..."
        value={(value as string) ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8"
      />
    </div>
  );
}
