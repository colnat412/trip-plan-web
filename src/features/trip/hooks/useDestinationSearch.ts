'use client';

import { useLocale } from 'next-intl';
import { useDebouncedValue, useQueryGet } from '@/base/hooks';
import type { DestinationItem } from '@/app/api/trip/destinations/route';

interface DestinationResponse {
  destinations: DestinationItem[];
}

const useDestinationSearch = (input: string, enabled = true) => {
  const language = useLocale() === 'en' ? 'en' : 'vi';
  const term = input.trim();
  const debouncedTerm = useDebouncedValue(term);
  const search = term ? debouncedTerm : '';
  const isDebouncing = term !== search;
  const query = useQueryGet<DestinationResponse>({
    queryKey: ['trip', 'destinations', search, language],
    endPoint: '/trip/destinations',
    config: { params: { ...(search ? { q: search } : {}), lang: language } },
    enabled: enabled && !isDebouncing,
  });
  return {
    options:
      isDebouncing || query.isStale ? [] : (query.data?.destinations ?? []),
    error: enabled && !isDebouncing ? query.error : null,
    loading:
      enabled &&
      (isDebouncing || (!query.error && (query.isStale || query.isFetching))),
  };
};
export default useDestinationSearch;
