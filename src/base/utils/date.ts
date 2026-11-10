export type DateFormatPattern =
  | 'DD-MM-YYYY'
  | 'DD/MM/YYYY'
  | 'YYYY-MM-DD'
  | 'DD-MM'
  | 'DD/MM'
  | 'D MMMM, YYYY'
  | 'D MMMM'
  | string;

/**
 * Parses any valid date input into a Date object or null if invalid.
 */
export function parseDate(
  dateInput: string | number | Date | null | undefined,
): Date | null {
  if (!dateInput) return null;
  // A calendar date has no timezone. Parsing it as UTC can display the previous day.
  if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    const [year, month, day] = dateInput.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
      ? date : null;
  }
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Formats a date using a specified pattern (default: DD/MM/YYYY).
 *
 * @example
 * formatDate('2025-08-04') // '04/08/2025'
 * formatDate('2025-08-04', 'DD/MM/YYYY') // '04/08/2025'
 * formatDate('2025-08-04', 'D MMMM, YYYY') // '4 tháng 8, 2025'
 */
export function formatDate(
  dateInput: string | number | Date | null | undefined,
  format: DateFormatPattern = 'DD/MM/YYYY',
): string {
  const date = parseDate(dateInput);
  if (!date) return '';

  const day = date.getDate();
  const dayPadded = String(day).padStart(2, '0');
  const month = date.getMonth() + 1;
  const monthPadded = String(month).padStart(2, '0');
  const year = date.getFullYear();

  if (format === 'DD-MM-YYYY') {
    return `${dayPadded}-${monthPadded}-${year}`;
  }
  if (format === 'DD/MM/YYYY') {
    return `${dayPadded}/${monthPadded}/${year}`;
  }
  if (format === 'YYYY-MM-DD') {
    return `${year}-${monthPadded}-${dayPadded}`;
  }
  if (format === 'DD-MM') {
    return `${dayPadded}-${monthPadded}`;
  }
  if (format === 'DD/MM') {
    return `${dayPadded}/${monthPadded}`;
  }
  if (format === 'D MMMM, YYYY') {
    return `${day} tháng ${month}, ${year}`;
  }
  if (format === 'D MMMM') {
    return `${day} tháng ${month}`;
  }

  return format
    .replace(/YYYY/g, String(year))
    .replace(/YY/g, String(year).slice(-2))
    .replace(/MM/g, monthPadded)
    .replace(/M/g, String(month))
    .replace(/DD/g, dayPadded)
    .replace(/D/g, String(day));
}

/**
 * Formats a start and end date range into a formatted string (default: DD/MM/YYYY – DD/MM/YYYY).
 *
 * @example
 * formatDateRange('2025-08-04', '2025-08-08') // '04/08/2025 – 08/08/2025'
 * formatDateRange('2025-08-04', '2025-08-08', 'DD/MM/YYYY') // '04/08/2025 – 08/08/2025'
 */
export function formatDateRange(
  startDate: string | number | Date | null | undefined,
  endDate: string | number | Date | null | undefined,
  format: DateFormatPattern = 'DD/MM/YYYY',
  separator = ' – ',
): string {
  const startStr = formatDate(startDate, format);
  const endStr = formatDate(endDate, format);

  if (startStr && endStr) {
    return `${startStr}${separator}${endStr}`;
  }
  return startStr || endStr || '';
}

export const formatTimeRange = (
  startTime?: string | null,
  endTime?: string | null,
): string =>
  [startTime, endTime]
    .filter((time): time is string => Boolean(time))
    .map((time) => time.slice(0, 5))
    .join(' - ');

/** Calendar day difference, independent of DST or the execution host's timezone. */
export const getCalendarDayDifference = (from: string, to: string): number | null => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to)) return null;
  const start = parseDate(from);
  const end = parseDate(to);
  if (!start || !end) return null;
  const startDay = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const endDay = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.round((endDay - startDay) / 86_400_000);
};

/** The app currently uses Vietnam time; trips do not yet have their own timezone. */
export const getZonedDateTime = (date: Date, timeZone = 'Asia/Ho_Chi_Minh') => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? '';
  return { date: `${value('year')}-${value('month')}-${value('day')}`, time: `${value('hour')}:${value('minute')}` };
};
