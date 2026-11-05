'use client';

import { useLocale } from 'next-intl';
import useQueryGet from './use-query-get';
import type { MapCoordinates, MapsSource } from '@/base/types/maps';

const useMapLocation = (location: string) => {
  const language = useLocale() === 'en' ? 'en' : 'vi';
  const query = useQueryGet<{
    location: { coordinates: MapCoordinates; source: MapsSource } | null;
  }>({
    queryKey: ['maps', 'location', location, language],
    endPoint: '/maps/location',
    config: { params: { q: location, lang: language } },
    enabled: !!location,
  });
  return {
    location: query.isStale || query.error ? null : query.data?.location,
    loading: !!location && !query.error && (query.isStale || query.isFetching),
  };
};

export default useMapLocation;
