import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import type { DTFilterProps } from './types';
import type { DTMetaFilterSelect } from '../filters.types';

export function DTFilterSelect({ filterConfig, value, onChange }: DTFilterProps) {
  const config = filterConfig as DTMetaFilterSelect;

  const handleValueChange = (newValue: string) => {
    if (newValue === '__clear__') {
      onChange(undefined);
    } else {
      onChange(newValue);
    }
  };

  return (
    <Select value={(value as string) ?? '__clear__'} onValueChange={handleValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="__clear__">
          <span className="text-muted-foreground">All</span>
        </SelectItem>
        {config.options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
