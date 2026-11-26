'use client';

import { useInfiniteQueryGet } from '@/base/hooks';
import type { TripNoteRevision } from '../types';

interface UseTripNoteHistoryParams {
  tripId: string;
  noteId: string;
}

export default function useTripNoteHistory({ tripId, noteId }: UseTripNoteHistoryParams) {
  return useInfiniteQueryGet<TripNoteRevision>({
    queryKey: ['trip-note-history', tripId, noteId], endPoint: `/trip/${tripId}/notes/${noteId}/history`,
    pageSize: 20, getItemKey: revision => revision.id,
  });
}
