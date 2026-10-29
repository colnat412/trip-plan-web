'use client';

import { useDebouncedValue, useQueryGet } from '@/base/hooks';
import type { ApiResponse } from '@/base/api';
import type { TemplateListing } from '../types';
import { templateQueryKeys } from '../constants/template-keys';

export interface UseTemplateLibraryParams {
  savedOnly?: boolean;
  search?: string;
  duration?: string;
  tag?: string;
  sort?: string;
  page?: number;
  size?: number;
  initialData?: TemplateListing | null;
}

const useTemplateLibrary = ({
  savedOnly = false,
  search = '',
  duration = '',
  tag = '',
  sort = 'recent',
  page = 1,
  size = 12,
  initialData,
}: UseTemplateLibraryParams = {}) => {
  const settled = useDebouncedValue(search);
  const isDebouncing = search !== settled;
  const query = useQueryGet<ApiResponse<TemplateListing>>({
    queryKey: savedOnly ? templateQueryKeys.saved(page, size) : templateQueryKeys.library(
      settled,
      duration,
      tag,
      sort,
      page,
      size,
    ),
    endPoint: savedOnly ? '/me/plan-template-saves' : '/public/plan-templates',
    enabled: !isDebouncing,
    config: {
      params: {
        search: settled,
        duration: duration || undefined,
        tag: tag || undefined,
        sort,
        page: page - 1,
        size,
      },
    },
  });
  const isInitial =
    !savedOnly && !search && !duration && !tag && sort === 'recent' && page === 1;
  // Only the original unfiltered query may use the server-rendered result.
  const listing = isDebouncing
    ? null
    : ((!query.isStale ? query.data?.data : null) ??
      (isInitial && !query.error ? initialData : null));
  return { ...query, listing, isDebouncing };
};
export default useTemplateLibrary;
