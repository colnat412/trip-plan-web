import { safeHttpUrl } from '@/base/utils';
import { DEFAULT_TRAVEL_IMAGE } from '@/base/constants/media';

/** Display fallback only; never persisted as the trip's uploaded cover. */
export const getTripCoverUrl = (trip: {
  coverUrl?: string | null;
  destination: string;
}) => safeHttpUrl(trip.coverUrl)
  ?? DEFAULT_TRAVEL_IMAGE;
