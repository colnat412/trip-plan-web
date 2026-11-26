import { safeHttpUrl } from '@/base/utils';
import { DEFAULT_TRAVEL_IMAGE } from '@/base/constants/media';

/** Display fallback only; never persisted as the trip's uploaded cover. */
interface GetTripCoverUrlTripParams {
  coverUrl?: string | null;
  destination: string;
}

export const getTripCoverUrl = (trip: GetTripCoverUrlTripParams) => safeHttpUrl(trip.coverUrl)
  ?? DEFAULT_TRAVEL_IMAGE;
