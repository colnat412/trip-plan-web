'use client';

import { useEffect, useRef } from 'react';
import {
  useInfiniteQueryGet,
  useMutationDelete,
  useMutationPost,
  useMutationPut,
} from '@/base/hooks';
import type { ApiResponse } from '@/base/api';
import type { TripNote, TripNoteDraft } from '../types';

export default function useTripNotes(tripId: string) {
  const query = useInfiniteQueryGet<TripNote>({
    queryKey: ['trip', 'notes', tripId],
    endPoint: `/trip/${tripId}/notes`,
    pageSize: 20,
    enabled: Boolean(tripId),
    getItemKey: (note) => note.id,
  });
  const refetchRef = useRef(query.refetch);
  const refreshing = useRef(false);
  const create = useMutationPost<ApiResponse<TripNote>, TripNoteDraft>({
    mutationKey: ['trip-note', 'create', tripId],
    endPoint: `/trip/${tripId}/notes`,
  });
  const update = useMutationPut<
    ApiResponse<TripNote>,
    TripNoteDraft & { noteId: string; version: number }
  >({
    mutationKey: ['trip-note', 'update', tripId],
    endPoint: `/trip/${tripId}/notes`,
    getEndPoint: (endpoint, payload) => `${endpoint}/${payload.noteId}`,
    getPayload: (_, payload) => ({
      content: payload.content,
      version: payload.version,
      imageUploadId: payload.imageUploadId,
      removeImage: payload.removeImage,
    }),
  });
  const remove = useMutationDelete<ApiResponse<null>, { noteId: string }>({
    mutationKey: ['trip-note', 'delete', tripId],
    endPoint: `/trip/${tripId}/notes`,
    getEndPoint: (endpoint, payload) => `${endpoint}/${payload.noteId}`,
  });
  const busy = create.isPending || update.isPending || remove.isPending;
  useEffect(() => {
    refetchRef.current = query.refetch;
  }, [query.refetch]);
  useEffect(() => {
    // Refresh only notes while visible. No page reload, background polling or overlapping polls.
    if (
      !tripId ||
      busy ||
      query.isFetching ||
      query.isFetchingNextPage ||
      [401, 403, 404].includes(query.error?.status ?? 0)
    )
      return;
    const refresh = async () => {
      if (document.visibilityState !== 'visible' || refreshing.current) return;
      refreshing.current = true;
      try {
        await refetchRef.current();
      } catch {
        /* The query exposes its own error. */
      } finally {
        refreshing.current = false;
      }
    };
    const timer = window.setInterval(() => void refresh(), 20000);
    return () => window.clearInterval(timer);
  }, [
    tripId,
    busy,
    query.isFetching,
    query.isFetchingNextPage,
    query.error?.status,
  ]);
  return { ...query, create, update, remove, busy };
}
