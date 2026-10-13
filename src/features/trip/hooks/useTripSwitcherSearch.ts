'use client';

import { useDebouncedValue, useInfiniteQueryGet } from '@/base/hooks';
import { useTripContext } from '../context/TripContext';
import type { Trip } from '../types';

const useTripSwitcherSearch = (search: string) => {
  const normalizedSearch = search.trim();
  const debouncedSearch = useDebouncedValue(normalizedSearch, 300);
  const isDebouncing = normalizedSearch !== debouncedSearch;
  const { tripsVersion } = useTripContext();
  const query = useInfiniteQueryGet<Trip>({
    queryKey: ['trip', 'switcher-search', debouncedSearch, tripsVersion],
    endPoint: '/trip/my-trips',
    pageSize: 20,
    enabled: !isDebouncing,
    params: debouncedSearch ? { search: debouncedSearch } : {},
    getItemKey: (trip) => String(trip.id),
  });
  return {
    ...query,
    trips: isDebouncing ? [] : query.items,
    isLoading: isDebouncing || query.isLoading,
    error: isDebouncing ? null : query.error,
  };
};
export default useTripSwitcherSearch;
