import type { PlanActivity, PlanDay } from '../types';

export type UpcomingActivityKind =
  | 'inProgress'
  | 'scheduledNow'
  | 'upcoming'
  | 'unscheduled';

export interface UpcomingActivity {
  activity: PlanActivity;
  day: PlanDay;
  kind: UpcomingActivityKind;
}

/** Select by calendar/time across the entire trip; do not change plan order or status. */
export const getUpcomingActivity = (
  days: PlanDay[],
  today: string,
  time: string,
): UpcomingActivity | null => {
  const candidates: (UpcomingActivity & { priority: number })[] = [];
  for (const day of days) {
    if (!day.planDate || day.planDate < today) continue;
    for (const activity of day.activities) {
      if (activity.status === 'COMPLETED' || activity.status === 'SKIPPED')
        continue;
      const start = activity.startTime?.slice(0, 5);
      const end = activity.endTime?.slice(0, 5);
      const currentDay = day.planDate === today;
      if (currentDay && activity.status === 'IN_PROGRESS') {
        candidates.push({ activity, day, kind: 'inProgress', priority: 0 });
      } else if (currentDay && start && end && start <= time && end > time) {
        candidates.push({ activity, day, kind: 'scheduledNow', priority: 1 });
      } else if (!start || !currentDay || start >= time) {
        candidates.push({
          activity,
          day,
          kind: start ? 'upcoming' : 'unscheduled',
          priority: 2,
        });
      }
    }
  }
  candidates.sort(
    (a, b) =>
      a.priority - b.priority ||
      a.day.planDate!.localeCompare(b.day.planDate!) ||
      (a.activity.startTime || '24:00').localeCompare(
        b.activity.startTime || '24:00',
      ) ||
      a.activity.orderIndex - b.activity.orderIndex,
  );
  return candidates[0] ?? null;
};

export const getSuggestedActivityDay = (
  days: PlanDay[],
  today: string,
): PlanDay | null => {
  const ordered = [...days].sort((a, b) => a.dayNumber - b.dayNumber);
  return (
    ordered.find((day) => day.planDate && day.planDate >= today) ??
    ordered[0] ??
    null
  );
};
