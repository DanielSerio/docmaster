import { Input } from '@/components/ui/input';
import type { DTFilterProps } from './types';

interface NumberRangeValue {
  min?: number;
  max?: number;
}

export function DTFilterNumberRange({ value, onChange }: DTFilterProps) {
  const range = (value as NumberRangeValue) ?? { min: undefined, max: undefined };

  const handleMinChange = (min: string) => {
    const newValue = {
      ...range,
      min: min ? Number(min) : undefined
    };
    onChange(newValue.min !== undefined || newValue.max !== undefined ? newValue : undefined);
  };

  const handleMaxChange = (max: string) => {
    const newValue = {
      ...range,
      max: max ? Number(max) : undefined
    };
    onChange(newValue.min !== undefined || newValue.max !== undefined ? newValue : undefined);
  };

  return (
    <div className="flex gap-2">
      <Input
        type="number"
        placeholder="Min"
        value={range.min ?? ''}
        onChange={(e) => handleMinChange(e.target.value)}
      />
      <Input
        type="number"
        placeholder="Max"
        value={range.max ?? ''}
        onChange={(e) => handleMaxChange(e.target.value)}
      />
    </div>
  );
}
