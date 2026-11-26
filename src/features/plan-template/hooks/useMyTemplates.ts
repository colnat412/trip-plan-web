'use client';

import { useQueryGet } from '@/base/hooks';
import type { ApiResponse } from '@/base/api';
import type { TemplateListing } from '../types';
import { templateQueryKeys } from '../constants/template-keys';

interface UseMyTemplatesParams { page?: number; size?: number }

const useMyTemplates = ({
  page = 1,
  size = 12,
}: UseMyTemplatesParams = {}) => {
  const query = useQueryGet<ApiResponse<TemplateListing>>({
    queryKey: templateQueryKeys.mine(page, size),
    endPoint: '/me/plan-templates',
    config: { params: { page: page - 1, size } },
  });
  return { ...query, listing: query.isStale ? null : query.data?.data };
};
export default useMyTemplates;
