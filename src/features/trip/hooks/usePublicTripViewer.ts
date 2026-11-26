'use client';

import { useEffect, useRef } from 'react';
import { useQueryGet, useMutationPost } from '@/base/hooks';
import type { ApiResponse } from '@/base/api';
import type { TripMemberStatus } from '../types/member.types';

interface ViewerStatus {
  currentUserStatus: TripMemberStatus | null;
}

interface UsePublicTripViewerParams {
  token: string;
  enabled: boolean;
}

export default function usePublicTripViewer({ token, enabled }: UsePublicTripViewerParams) {
  const activeToken = useRef(token);
  useEffect(() => { activeToken.current = token; }, [token]);
  const viewer = useQueryGet<ApiResponse<ViewerStatus>>({
    queryKey: ['public-trip', token, 'viewer'], endPoint: `/public/trips/${token}/me`, enabled,
  });
  const join = useMutationPost<ApiResponse<unknown>, Record<string, never>>({
    mutationKey: ['public-trip', token, 'join'], endPoint: `/public/trips/${token}/join`,
  });
  const joinTrip = async () => {
    const response = await join.mutateAsync({});
    if (activeToken.current === token) viewer.replaceData({ ...response, data: { currentUserStatus: 'INVITED' } });
  };
  return { viewerStatus: !viewer.isStale ? viewer.data?.data?.currentUserStatus ?? null : null,
    isJoining: join.isPending, joinTrip };
}
