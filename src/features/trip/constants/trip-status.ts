import type { TripStatus } from '../types';

// DELETED remains internal to soft deletion and is never a selectable option.
export const TRIP_STATUS_OPTIONS = [
  { value: 'DRAFT', labelKey: 'draft', filterValue: 'DRAFT', variant: 'info' },
  { value: 'IN_PROGRESS', labelKey: 'inProgress', filterValue: 'IN_PROGRESS', variant: 'warning' },
  { value: 'COMPLETED', labelKey: 'completed', filterValue: 'COMPLETED', variant: 'success' },
  { value: 'CANCELLED', labelKey: 'cancelled', filterValue: 'CANCELLED', variant: 'error' },
] as const;

type TripStatusPresentation = (typeof TRIP_STATUS_OPTIONS)[number];

export const TRIP_STATUS_PRESENTATION: Record<TripStatus, TripStatusPresentation> = {
  DRAFT: TRIP_STATUS_OPTIONS[0],
  IN_PROGRESS: TRIP_STATUS_OPTIONS[1],
  COMPLETED: TRIP_STATUS_OPTIONS[2],
  CANCELLED: TRIP_STATUS_OPTIONS[3],
  // Deleted trips are excluded by the API and never offered as a choice.
  DELETED: TRIP_STATUS_OPTIONS[3],
};
