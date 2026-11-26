'use client';

import { useDebouncedValue, useQueryGet } from '@/base/hooks';
import type { ApiResponse } from '@/base/api';

interface TripFilterOptions {
  destinations: string[];
  currencies: string[];
  visitedDestinations: string[];
}

interface UseTripFilterOptionsParams {
  destinationSearch?: string;
}

export default function useTripFilterOptions({ destinationSearch = '' }: UseTripFilterOptionsParams = {}) {
  const settled = useDebouncedValue(destinationSearch);
  const isDebouncing = settled !== destinationSearch;
  const query = useQueryGet<ApiResponse<TripFilterOptions>>({
    queryKey: ['trip', 'filter-options', settled], endPoint: '/trip/my-trips/filter-options',
    enabled: !isDebouncing, config: { params: { destinationSearch: settled } },
  });
  return { ...query, error: isDebouncing ? null : query.error, options: query.data?.data ? { ...query.data.data,
    destinations: !query.isStale && !isDebouncing && !query.error ? query.data.data.destinations : [] } : undefined,
    loading: query.isFetching || isDebouncing || query.isStale && !query.error };
}
