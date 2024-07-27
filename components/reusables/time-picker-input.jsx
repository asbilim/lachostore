import React, { useState, useEffect, forwardRef } from "react";

const TimePickerInput = forwardRef(
  (
    {
      className,
      type = "text",
      date = new Date(new Date().setHours(0, 0, 0, 0)),
      setDate,
      onKeyDown,
      picker, // Assumed to be either 'hours' or 'minutes'
      onLeftFocus,
      onRightFocus,
      ...props
    },
    ref
  ) => {
    const getStringValue = (date, picker) => {
      const value = picker === "hours" ? date.getHours() : date.getMinutes();
      return value.toString().padStart(2, "0");
    };

    const [inputValue, setInputValue] = useState(getStringValue(date, picker));

    useEffect(() => {
      setInputValue(getStringValue(date, picker));
    }, [date, picker]);

    const handleKeyDown = (e) => {
      if (e.key === "Tab") return;
      e.preventDefault();

      let newValue;

      switch (e.key) {
        case "ArrowRight":
          onRightFocus?.();
          break;
        case "ArrowLeft":
          onLeftFocus?.();
          break;
        case "ArrowUp":
          newValue =
            picker === "hours" ? date.getHours() + 1 : date.getMinutes() + 1;
          break;
        case "ArrowDown":
          newValue =
            picker === "hours" ? date.getHours() - 1 : date.getMinutes() - 1;
          break;
        default:
          if (e.key >= "0" && e.key <= "9") {
            newValue = parseInt(inputValue + e.key, 10);
            if (newValue.toString().length === 2) {
              onRightFocus?.();
            }
          }
          break;
      }

      if (newValue !== undefined) {
        if (picker === "hours") {
          setDate(new Date(date.setHours(newValue)));
        } else if (picker === "minutes") {
          setDate(new Date(date.setMinutes(newValue)));
        }
      }
    };

    const handleChange = (e) => {
      const newValue = e.target.value;
      if (
        newValue === "" ||
        (parseInt(newValue) >= 0 && parseInt(newValue) <= 59)
      ) {
        setInputValue(newValue);
        if (newValue.length === 2) {
          const numValue = parseInt(newValue, 10);
          if (picker === "hours") {
            setDate(new Date(date.setHours(numValue)));
          } else if (picker === "minutes") {
            setDate(new Date(date.setMinutes(numValue)));
          }
        }
      }
    };

    return (
      <input
        ref={ref}
        className={`w-[48px] text-center font-mono text-base tabular-nums caret-transparent focus:bg-accent focus:text-accent-foreground ${className}`}
        type={type}
        inputMode="numeric"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          handleKeyDown(e);
        }}
        {...props}
      />
    );
  }
);

TimePickerInput.displayName = "TimePickerInput";

export { TimePickerInput };
