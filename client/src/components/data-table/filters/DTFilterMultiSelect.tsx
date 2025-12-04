import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import type { DTFilterProps } from './types';
import type { DTMetaFilterMultiSelect } from '../filters.types';

export function DTFilterMultiSelect({ filterConfig, value, onChange }: DTFilterProps) {
  const config = filterConfig as DTMetaFilterMultiSelect;
  const selected = (value as string[]) ?? [];

  const handleToggle = (optionValue: string) => {
    const newValue = selected.includes(optionValue)
      ? selected.filter((v) => v !== optionValue)
      : [...selected, optionValue];
    onChange(newValue.length > 0 ? newValue : undefined);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="justify-between">
          {selected.length > 0 ? (
            <span>{selected.length} selected</span>
          ) : (
            <span>Select...</span>
          )}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {config.options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={selected.includes(option.value)}
            onCheckedChange={() => handleToggle(option.value)}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
