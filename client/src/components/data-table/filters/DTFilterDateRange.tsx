import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import type { DTFilterProps } from './types';
import type { DateRange } from 'react-day-picker';

interface DateRangeValue {
  from?: string;
  to?: string;
}

export function DTFilterDateRange({ value, onChange }: DTFilterProps) {
  const dateRange = (value as DateRangeValue) ?? { from: undefined, to: undefined };

  // Convert string dates to Date objects for the calendar
  const calendarRange: DateRange = {
    from: dateRange.from ? new Date(dateRange.from) : undefined,
    to: dateRange.to ? new Date(dateRange.to) : undefined
  };

  const handleSelect = (range: DateRange | undefined) => {
    if (!range) {
      onChange(undefined);
      return;
    }

    onChange({
      from: range.from ? range.from.toISOString().split('T')[0] : undefined,
      to: range.to ? range.to.toISOString().split('T')[0] : undefined
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-start text-left w-[280px]">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {calendarRange.from ? (
            calendarRange.to ? (
              <>
                {format(calendarRange.from, 'LLL dd, y')} - {format(calendarRange.to, 'LLL dd, y')}
              </>
            ) : (
              format(calendarRange.from, 'LLL dd, y')
            )
          ) : (
            <span>Pick a date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="range" selected={calendarRange} onSelect={handleSelect} numberOfMonths={2} />
      </PopoverContent>
    </Popover>
  );
}
