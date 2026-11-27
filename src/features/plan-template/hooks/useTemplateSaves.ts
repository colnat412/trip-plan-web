'use client';

import { useRef, useState } from 'react';
import { useQueryGet, useMutationPut, useMutationDelete } from '@/base/hooks';
import type { ApiResponse } from '@/base/api';
import {
  templateQueryKeys,
  templateMutationKeys,
} from '../constants/template-keys';

interface TemplateLikeResponse { liked: boolean; likeCount: number }

export default function useTemplateSaves(ids: string[], onChange?: () => void) {
  const idsKey = [...ids].sort().join(',');
  const status = useQueryGet<
    ApiResponse<string[]> & { authenticated?: boolean }
  >({
    queryKey: templateQueryKeys.saveStatus(idsKey),
    endPoint: '/me/plan-template-saves/status',
    enabled: ids.length > 0,
    config: { params: { ids: idsKey } },
  });
  const save = useMutationPut<ApiResponse<TemplateLikeResponse | null>, string>({
    mutationKey: templateMutationKeys.save,
    endPoint: '/plan-templates',
    getEndPoint: (path, id) => `${path}/${encodeURIComponent(id)}/save`,
    getPayload: () => ({}),
  });
  const unsave = useMutationDelete<ApiResponse<TemplateLikeResponse | null>, string>({
    mutationKey: templateMutationKeys.unsave,
    endPoint: '/plan-templates',
    getEndPoint: (path, id) => `${path}/${encodeURIComponent(id)}/save`,
  });
  const lock = useRef(false);
  const [counts, setCounts] = useState<Record<string, { source: number | undefined; value: number }>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const savedIds = status.isStale ? [] : (status.data?.data ?? []);
  const error = save.error ?? unsave.error;

  const toggle = async (id: string, initialCount?: number) => {
    if (lock.current || status.isStale || status.error) return;
    lock.current = true;
    setActiveId(id);
    save.clearError();
    unsave.clearError();
    const wasSaved = savedIds.includes(id);
    try {
      const response = await (wasSaved ? unsave : save).mutateAsync(id);
      const liked = response.data?.liked ?? !wasSaved;
      if (response.data && Number.isFinite(response.data.likeCount) && response.data.likeCount >= 0) {
        setCounts(previous => ({ ...previous, [id]: { source: initialCount, value: response.data!.likeCount } }));
      }
      status.replaceData({
        status: 200,
        message: 'Saved templates',
        data: !liked
          ? savedIds.filter((item) => item !== id)
          : [...savedIds, id],
      });
      onChange?.();
    } catch {
    } finally {
      lock.current = false;
    }
  };

  return {
    isGuest: status.data?.authenticated === false,
    savedIds,
    getLikeCount: (id: string, initialCount?: number) => counts[id]?.source === initialCount
      ? counts[id]?.value ?? initialCount : initialCount,
    toggle,
    activeId,
    error,
    pending: save.isPending || unsave.isPending,
    ready: !status.isStale && !status.error,
    statusError: status.error,
    retry: () => status.refetch(),
  };
}
