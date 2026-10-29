'use client';

import { useQueryGet, useUploadFile } from '@/base/hooks';
import type { ApiResponse } from '@/base/api';
import { templateQueryKeys } from '../constants/template-keys';

export function useTemplateCover(tripId: string | number, enabled: boolean) {
  return useQueryGet<ApiResponse<string | null>>({
    queryKey: templateQueryKeys.cover(tripId),
    endPoint: `/trip/${encodeURIComponent(String(tripId))}/plan-template/cover`,
    enabled,
  });
}

export function useTemplateCoverUpload() {
  const mutation = useUploadFile();
  return {
    ...mutation,
    uploadCover: (file: File) => mutation.mutateAsync({ file, purpose: 'TRIP_COVER' }),
  };
}
