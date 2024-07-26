// time-picker-utils.js

export function isValidHour(value) {
  return /^(0[0-9]|1[0-9]|2[0-3])$/.test(value);
}

export function isValidMinuteOrSecond(value) {
  return /^[0-5][0-9]$/.test(value);
}

export function getValidNumber(value, { max, min = 0, loop = false }) {
  let numericValue = parseInt(value, 10);

  if (!isNaN(numericValue)) {
    if (!loop) {
      if (numericValue > max) numericValue = max;
      if (numericValue < min) numericValue = min;
    } else {
      if (numericValue > max) numericValue = min;
      if (numericValue < min) numericValue = max;
    }
    return numericValue.toString().padStart(2, "0");
  }

  return "00";
}

export function getValidHour(value) {
  if (isValidHour(value)) return value;
  return getValidNumber(value, { max: 23 });
}

export function getValidMinuteOrSecond(value) {
  if (isValidMinuteOrSecond(value)) return value;
  return getValidNumber(value, { max: 59 });
}

export function getValidArrowNumber(value, { min, max, step }) {
  let numericValue = parseInt(value, 10);
  if (!isNaN(numericValue)) {
    numericValue += step;
    return getValidNumber(String(numericValue), { min, max, loop: true });
  }
  return "00";
}

export function getValidArrowHour(value, step) {
  return getValidArrowNumber(value, { min: 0, max: 23, step });
}

export function getValidArrowMinuteOrSecond(value, step) {
  return getValidArrowNumber(value, { min: 0, max: 59, step });
}

export function getDateByType(date, type) {
  switch (type) {
    case "minutes":
      return getValidMinuteOrSecond(String(date.getMinutes()));
    case "seconds":
      return getValidMinuteOrSecond(String(date.getSeconds()));
    case "hours":
      return getValidHour(String(date.getHours()));
    default:
      return "00";
  }
}

export function getArrowByType(value, step, type) {
  switch (type) {
    case "minutes":
    case "seconds":
      return getValidArrowMinuteOrSecond(value, step);
    case "hours":
      return getValidArrowHour(value, step);
    default:
      return "00";
  }
}

export function setDateByType(date, value, type) {
  const numValue = parseInt(value, 10);
  switch (type) {
    case "minutes":
      date.setMinutes(numValue);
      break;
    case "seconds":
      date.setSeconds(numValue);
      break;
    case "hours":
      date.setHours(numValue);
      break;
  }
  return date;
}

export function calculateNewValue(currentValue, newKey, picker) {
  if (picker === "hours") {
    const hour = parseInt(currentValue + newKey, 10);
    if (hour >= 0 && hour <= 23) {
      return hour.toString().padStart(2, "0");
    }
  } else {
    const value = parseInt(currentValue + newKey, 10);
    if (value >= 0 && value <= 59) {
      return value.toString().padStart(2, "0");
    }
  }
  return currentValue;
}
