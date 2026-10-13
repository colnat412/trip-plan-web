'use client';

import { useDebouncedValue, useQueryGet } from '@/base/hooks';
import type { DestinationItem } from '@/app/api/trip/destinations/route';

interface DestinationResponse {
  destinations: DestinationItem[];
}

const useDestinationSearch = (input: string, enabled = true) => {
  const term = input.trim();
  const debouncedTerm = useDebouncedValue(term);
  const search = term ? debouncedTerm : '';
  const isDebouncing = term !== search;
  const query = useQueryGet<DestinationResponse>({
    queryKey: ['trip', 'destinations', search],
    endPoint: '/trip/destinations',
    config: { params: search ? { q: search } : {} },
    enabled: enabled && !isDebouncing,
  });
  return {
    options:
      isDebouncing || query.isStale ? [] : (query.data?.destinations ?? []),
    loading:
      enabled &&
      (isDebouncing || (!query.error && (query.isStale || query.isFetching))),
  };
};
export default useDestinationSearch;
