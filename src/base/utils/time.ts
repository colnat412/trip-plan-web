import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export type TimeRange = [string, string];

export const parsePickerTime = (value: string) => {
  if (!/^\d{2}:\d{2}$/.test(value)) return null;
  const time = dayjs(`2000-01-01 ${value}`, 'YYYY-MM-DD HH:mm', true);
  return time.isValid() ? time : null;
};

export const isTimeRangeValid = ([start, end]: TimeRange, required = false): boolean => {
  if (required && (!start || !end)) return false;
  if ((start && !parsePickerTime(start)) || (end && !parsePickerTime(end))) return false;
  return !start || !end || end >= start;
};

export const formatPickerTimeRange = ([start, end]: TimeRange): string =>
  start || end ? `${start || '--:--'} – ${end || '--:--'}` : '';
