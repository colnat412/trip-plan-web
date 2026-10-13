'use client';

import type { ApiResponse } from '@/base/api';
import { useQueryGet } from '@/base/hooks';
import { tripQueryKeys } from '../constants/trip-keys';
import type { Trip } from '../types';

interface UseTripDetailParams {
  tripId: number | string | null;
  enabled?: boolean;
  refreshKey?: number;
}

const useTripDetail = ({
  tripId,
  enabled = true,
  refreshKey = 0,
}: UseTripDetailParams) => {
  const query = useQueryGet<ApiResponse<Trip>>({
    queryKey: [...tripQueryKeys.detail(tripId ?? 'none'), refreshKey],
    endPoint: `/trip/${tripId}`,
    enabled: enabled && Boolean(tripId),
  });

  return {
    ...query,
    trip: query.data?.data ?? null,
  };
};

export default useTripDetail;
