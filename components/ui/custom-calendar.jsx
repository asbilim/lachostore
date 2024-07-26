// components/CustomTimeInput.jsx
import React, { forwardRef } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const CustomTimeInput = forwardRef(({ value, onChange }, ref) => {
  const [hours, minutes] = value.split(":");

  const handleHourChange = (increment) => {
    let newHours = parseInt(hours) + increment;
    if (newHours > 23) newHours = 0;
    if (newHours < 0) newHours = 23;
    onChange(`${newHours.toString().padStart(2, "0")}:${minutes}`);
  };

  const handleMinuteChange = (increment) => {
    let newMinutes = parseInt(minutes) + increment;
    if (newMinutes > 59) newMinutes = 0;
    if (newMinutes < 0) newMinutes = 59;
    onChange(`${hours}:${newMinutes.toString().padStart(2, "0")}`);
  };

  return (
    <div className="flex items-center space-x-2" ref={ref}>
      <div className="flex flex-col items-center">
        <Button variant="ghost" size="sm" onClick={() => handleHourChange(1)}>
          <ChevronUp className="h-4 w-4" />
        </Button>
        <span className="text-lg font-semibold">{hours}</span>
        <Button variant="ghost" size="sm" onClick={() => handleHourChange(-1)}>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
      <span className="text-lg font-semibold">:</span>
      <div className="flex flex-col items-center">
        <Button variant="ghost" size="sm" onClick={() => handleMinuteChange(5)}>
          <ChevronUp className="h-4 w-4" />
        </Button>
        <span className="text-lg font-semibold">{minutes}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleMinuteChange(-5)}>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
});

CustomTimeInput.displayName = "CustomTimeInput";

export default CustomTimeInput;
