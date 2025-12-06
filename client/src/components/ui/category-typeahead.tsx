import { useState, useEffect, useRef } from 'react';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface CategoryTypeAheadProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  disabled?: boolean;
  suggestions: string[];
}

export function CategoryTypeAhead({
  value,
  onChange,
  onFocus,
  disabled,
  suggestions
}: CategoryTypeAheadProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value ?? '');
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Sync input value with prop value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Filter suggestions based on input
  const filteredSuggestions = suggestions.filter((suggestion) =>
    suggestion.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Check if input exactly matches an existing suggestion
  const exactMatch = suggestions.some((s) => s.toLowerCase() === inputValue.toLowerCase());

  // Show "Create new" option if there's input and no exact match
  const showCreateNew = inputValue.trim() && !exactMatch;

  const handleSelect = (selectedValue: string) => {
    setInputValue(selectedValue);
    onChange(selectedValue);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    onChange(newValue);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen && onFocus) {
      onFocus();
    }
  };

  return (
    <Popover
      open={open}
      onOpenChange={handleOpenChange}
    >
      <PopoverTrigger asChild>
        <Button
          ref={buttonRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
          disabled={disabled}
          data-testid="category-typeahead-trigger"
        >
          <span className={cn(!value && 'text-muted-foreground')}>
            {value || 'Select or type category...'}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Type to search or create..."
            value={inputValue}
            onValueChange={handleInputChange}
            data-testid="category-typeahead-input"
          />
          <CommandList className="w-full">
            {filteredSuggestions.length === 0 && !showCreateNew && (
              <CommandEmpty>No categories found.</CommandEmpty>
            )}
            {filteredSuggestions.length > 0 && (
              <CommandGroup heading="Existing Categories">
                {filteredSuggestions.map((suggestion) => (
                  <CommandItem
                    key={suggestion}
                    value={suggestion}
                    onSelect={() => handleSelect(suggestion)}
                    data-testid={`category-option-${suggestion}`}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === suggestion ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {suggestion}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {showCreateNew && (
              <CommandGroup heading="Create New">
                <CommandItem
                  value={inputValue}
                  onSelect={() => handleSelect(inputValue)}
                  data-testid="category-create-new"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create new: <strong className="ml-1">{inputValue}</strong>
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
