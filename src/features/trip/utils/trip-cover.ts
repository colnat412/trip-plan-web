import { safeHttpUrl } from '@/base/utils';
import { getDestinationPhoto } from '../data/destination-photos';

/** Display fallback only; never persisted as the trip's uploaded cover. */
export const getTripCoverUrl = (trip: {
  coverUrl?: string | null;
  destination: string;
}) => safeHttpUrl(trip.coverUrl)
  ?? getDestinationPhoto(trip.destination)
  ?? '/destinations/phuquoc-photo.jpg';
