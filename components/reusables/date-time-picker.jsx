"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TimePickerDemo } from "./time-picker-demo";

export function DateTimePicker({ value, onChange }) {
  const handleDateSelect = (newDate) => {
    if (!newDate || isNaN(newDate.getTime())) return; // Ensure newDate is valid
    const updatedDate = new Date(value || new Date());
    updatedDate.setFullYear(newDate.getFullYear());
    updatedDate.setMonth(newDate.getMonth());
    updatedDate.setDate(newDate.getDate());
    onChange(updatedDate);
  };

  const handleTimeChange = (newTime) => {
    if (!newTime || isNaN(newTime.getTime())) return; // Ensure newTime is valid
    const updatedDate = new Date(value || new Date());
    updatedDate.setHours(newTime.getHours());
    updatedDate.setMinutes(newTime.getMinutes());
    updatedDate.setSeconds(newTime.getSeconds());
    onChange(updatedDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP HH:mm:ss") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleDateSelect}
          initialFocus
        />
        <div className="p-3 border-t border-border">
          <TimePickerDemo date={value} setDate={handleTimeChange} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
