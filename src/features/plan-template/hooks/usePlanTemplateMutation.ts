'use client';

import { useMutationPost, type MutationCallbacks } from '@/base/hooks';
import type { ApiResponse } from '@/base/api';
import type {
  PublishPayload,
  TemplatePreview,
  TemplateDetailData,
} from '../types';
import { templateMutationKeys } from '../constants/template-keys';

export const usePreviewPlanTemplate = (tripId: string | number) =>
  useMutationPost<ApiResponse<TemplatePreview>, PublishPayload>({
    mutationKey: templateMutationKeys.preview(tripId),
    endPoint: `/trip/${encodeURIComponent(String(tripId))}/plan-template/preview`,
  });

export const usePublishPlanTemplate = (tripId: string | number) =>
  useMutationPost<ApiResponse<TemplateDetailData>, PublishPayload>({
    mutationKey: templateMutationKeys.publish(tripId),
    endPoint: `/trip/${encodeURIComponent(String(tripId))}/plan-template`,
  });

export const useUnpublishPlanTemplate = (
  options?: MutationCallbacks<ApiResponse<null>, string>,
) =>
  useMutationPost<ApiResponse<null>, string>({
    mutationKey: templateMutationKeys.unpublish,
    endPoint: '/plan-templates',
    getEndPoint: (path, templateId) =>
      `${path}/${encodeURIComponent(templateId)}/unpublish`,
    getPayload: () => ({}),
    options,
  });
