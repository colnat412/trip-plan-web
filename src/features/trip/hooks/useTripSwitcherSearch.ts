'use client';

import { useDebouncedValue, useInfiniteQueryGet } from '@/base/hooks';
import { useTripContext } from '../context/TripContext';
import type { Trip } from '../types';

const PAGE_SIZE = 3;

const useTripSwitcherSearch = (search: string) => {
  const normalizedSearch = search.trim();
  const debouncedSearch = useDebouncedValue(normalizedSearch, 300);
  const isDebouncing = normalizedSearch !== debouncedSearch;
  const { tripsVersion } = useTripContext();
  const query = useInfiniteQueryGet<Trip>({
    queryKey: ['trip', 'switcher-search', debouncedSearch, PAGE_SIZE, tripsVersion],
    endPoint: '/trip/my-trips',
    pageSize: PAGE_SIZE,
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
