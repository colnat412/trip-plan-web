import { getCalendarDayDifference, getZonedDateTime } from '@/base/utils/date';
import type { Trip } from '../types';

export type TripPhase =
  | 'upcoming'
  | 'today'
  | 'active'
  | 'completed'
  | 'cancelled'
  | 'unknown';

export const getTripTiming = (
  trip: Pick<Trip, 'startDate' | 'endDate' | 'status'>,
  now: Date,
) => {
  if (trip.status === 'CANCELLED')
    return { phase: 'cancelled' as TripPhase, count: 0 };
  if (trip.status === 'COMPLETED' || trip.status === 'DELETED')
    return { phase: 'completed' as TripPhase, count: 0 };
  const today = getZonedDateTime(now).date;
  const untilStart = getCalendarDayDifference(today, trip.startDate);
  const untilEnd = getCalendarDayDifference(today, trip.endDate);
  if (untilStart == null || untilEnd == null || trip.endDate < trip.startDate)
    return { phase: 'unknown' as TripPhase, count: 0 };
  if (untilStart > 0)
    return { phase: 'upcoming' as TripPhase, count: untilStart };
  if (untilEnd < 0) return { phase: 'completed' as TripPhase, count: 0 };
  if (untilStart === 0) return { phase: 'today' as TripPhase, count: 0 };
  return { phase: 'active' as TripPhase, count: untilEnd + 1 };
};
