'use client';

import { useRef, useState } from 'react';
import { axiosPost, normalizeApiError, type ApiResponse } from '@/base/api';
import { useMutationRequest } from '@/base/hooks';
import type { CopyPayload, CopyResult } from '../types';
import { templateMutationKeys } from '../constants/template-keys';

interface CopyAttempt {
  key: string;
  payload: CopyPayload;
}

const useCopyPlanTemplate = (templateId: string) => {
  const attempt = useRef<CopyAttempt | null>(null);
  const [isOutcomeUncertain, setIsOutcomeUncertain] = useState(false);
  const [createdTripId, setCreatedTripId] = useState<string | null>(null);
  const mutation = useMutationRequest<ApiResponse<CopyResult>, CopyAttempt>({
    mutationKey: templateMutationKeys.copy(templateId),
    mutationFn: (current) =>
      axiosPost(
        `/plan-templates/${encodeURIComponent(templateId)}/copy`,
        current.payload,
        { headers: { 'Idempotency-Key': current.key } },
      ),
  });

  const copyTemplateAsync = async (payload: CopyPayload) => {
    if (!attempt.current)
      attempt.current = {
        key: crypto.randomUUID(),
        payload: { ...payload, name: payload.name.trim() },
      };
    setIsOutcomeUncertain(true);
    try {
      const response = await mutation.mutateAsync(attempt.current);
      // Keep success before navigation so a navigation error never triggers a new copy.
      setCreatedTripId(response.data.tripId);
      setIsOutcomeUncertain(false);
      return response;
    } catch (error) {
      const status = normalizeApiError(error).status;
      if (status && status >= 400 && status < 500) {
        attempt.current = null;
        setIsOutcomeUncertain(false);
      }
      throw error;
    }
  };
  return { ...mutation, copyTemplateAsync, isOutcomeUncertain, createdTripId };
};
export default useCopyPlanTemplate;
