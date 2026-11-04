import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export type CalendarRange = [string, string];

// Dates stay in local calendar time and are never converted through UTC.
export const parseCalendarDate = (value?: string) => {
  const date = dayjs(value, 'YYYY-MM-DD', true);
  return value && date.isValid() ? date : null;
};

export const selectCalendarRange = ([start, end]: CalendarRange, date: string): CalendarRange =>
  !start || end || date < start ? [date, ''] : [start, date];
