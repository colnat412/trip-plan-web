import { getCalendarDayDifference, getZonedDateTime, parseDate } from '@/base/utils/date';
import type { NotificationItem } from '../types';

export interface NotificationDateGroup {
  dateKey: string;
  daysAgo: number | null;
  items: NotificationItem[];
}

/** Group by calendar date in Vietnam time, not by elapsed 24-hour periods. */
export const groupNotificationsByDate = (items: NotificationItem[], now: Date | null): NotificationDateGroup[] => {
  const today = now ? getZonedDateTime(now).date : null;
  const groups = new Map<string, NotificationDateGroup>();
  const sortedItems = [...items].sort((left, right) =>
    (parseDate(right.createdAt)?.getTime() ?? -Infinity) - (parseDate(left.createdAt)?.getTime() ?? -Infinity));

  for (const item of sortedItems) {
    const createdAt = parseDate(item.createdAt);
    const dateKey = createdAt ? getZonedDateTime(createdAt).date : 'unknown';
    let group = groups.get(dateKey);
    if (!group) {
      group = {
        dateKey,
        daysAgo: today && createdAt ? getCalendarDayDifference(dateKey, today) : null,
        items: [],
      };
      groups.set(dateKey, group);
    }
    group.items.push(item);
  }
  return [...groups.values()];
};

export const getNotificationTime = (createdAt: string): string => {
  const date = parseDate(createdAt);
  return date ? getZonedDateTime(date).time : '';
};

/** Elapsed time for a row; calendar date grouping above remains independent. */
export const getNotificationRelativeTime = (createdAt: string, now: Date | null, locale: string, justNow: string): string => {
  const date = parseDate(createdAt);
  if (!date) return '';
  if (!now) return getNotificationTime(createdAt);
  const minutes = Math.floor(Math.max(0, now.getTime() - date.getTime()) / 60_000);
  if (minutes === 0) return justNow;
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'always' });
  if (minutes < 60) return formatter.format(-minutes, 'minute');
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return formatter.format(-hours, 'hour');
  return formatter.format(-Math.floor(hours / 24), 'day');
};
