import React from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { DateRange } from '@/types/report';

interface DateRangePickerProps {
  value: DateRange;
  onChange: (dateRange: DateRange) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function DateRangePicker({ 
  value, 
  onChange, 
  disabled = false,
  placeholder = "Chọn khoảng thời gian"
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (range?.from && range?.to) {
      onChange({ from: range.from, to: range.to });
      setOpen(false);
    } else if (range?.from && !range?.to) {
      // User is still selecting the end date
      onChange({ from: range.from, to: range.from });
    }
  };

  const formatDateRange = () => {
    if (!value.from || !value.to) return placeholder;
    
    const fromStr = format(value.from, 'dd/MM/yyyy', { locale: vi });
    const toStr = format(value.to, 'dd/MM/yyyy', { locale: vi });
    
    if (fromStr === toStr) {
      return fromStr;
    }
    
    return `${fromStr} - ${toStr}`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value.from && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {formatDateRange()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarComponent
          initialFocus
          mode="range"
          defaultMonth={value.from}
          selected={{ from: value.from, to: value.to }}
          onSelect={handleSelect}
          numberOfMonths={2}
          disabled={(date) => {
            // Disable future dates
            return date > new Date();
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
