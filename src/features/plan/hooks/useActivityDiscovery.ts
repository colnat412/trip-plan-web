'use client';

import { useLocale } from 'next-intl';
import { useDebouncedValue, useQueryGet } from '@/base/hooks';
import type { MapPlacePrediction } from '@/base/types/maps';
import type { ActivityCategory } from '../types';

const useActivityDiscovery = (
  destination: string,
  category: ActivityCategory,
  input: string,
  disabled: boolean,
) => {
  const context = destination.trim();
  const term = input.trim();
  const debouncedTerm = useDebouncedValue(term);
  const locale = useLocale();
  const language = locale === 'en' ? 'en' : 'vi';
  const canSearch =
    !disabled &&
    context.length >= 2 &&
    term.length !== 1 &&
    (category !== 'OTHER' || term.length >= 2);
  const enabled = canSearch && term === debouncedTerm;
  const query = useQueryGet<{ predictions: MapPlacePrediction[] }>({
    queryKey: ['maps', 'discovery', context, category, debouncedTerm, language],
    endPoint: '/maps/discovery',
    config: {
      params: {
        destination: context,
        category,
        q: debouncedTerm,
        lang: language,
      },
    },
    enabled,
  });
  return {
    refetch: query.refetch,
    options: !enabled || query.isStale ? [] : (query.data?.predictions ?? []),
    error: enabled ? query.error : null,
    loading:
      canSearch &&
      (!enabled || (!query.error && (query.isStale || query.isFetching))),
  };
};

export default useActivityDiscovery;
