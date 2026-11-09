'use client';

import { useEffect } from 'react';
import type { ApiResponse } from '@/base/api';
import { useQueryGet } from '@/base/hooks';
import type { Trip } from '../types';
import type { TripWeather } from '../types/weather';

const useTripWeather = (trip: Trip) => {
  const enabled =
    trip.status === 'DRAFT' ||
    trip.status === 'IN_PROGRESS' ||
    trip.status === 'COMPLETED';
  const query = useQueryGet<ApiResponse<TripWeather>>({
    queryKey: [
      'trip',
      trip.id,
      'weather',
      trip.destination,
      trip.startDate,
      trip.endDate,
      trip.status,
    ],
    endPoint: `/trip/${trip.id}/weather`,
    enabled,
  });
  const { refetch } = query;
  useEffect(() => {
    if (!enabled) return;
    const timer = window.setInterval(
      () => {
        if (document.visibilityState === 'visible')
          void refetch().catch(() => undefined);
      },
      15 * 60 * 1000,
    );
    return () => window.clearInterval(timer);
  }, [
    enabled,
    trip.id,
    trip.startDate,
    trip.endDate,
    trip.destination,
    refetch,
  ]);

  return {
    ...query,
    enabled,
    isLoading: enabled && (query.isLoading || (query.isStale && !query.error)),
    weather:
      enabled && !query.isStale && !query.error
        ? (query.data?.data ?? null)
        : null,
  };
};

export default useTripWeather;
