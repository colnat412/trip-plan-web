'use client';

import { useLocale } from 'next-intl';
import { useDebouncedValue, useQueryGet } from '@/base/hooks';
import type { PlacePrediction } from '../components/LocationAutocompleteInput';

const usePlacesSearch = (input: string, destination = '') => {
  const term = input.trim();
  const context = destination.trim();
  const debouncedTerm = useDebouncedValue(term);
  const enabled = term.length >= 2 && term === debouncedTerm;
  const locale = useLocale();
  const language = locale === 'en' ? 'en' : 'vi';
  const query = useQueryGet<{ predictions: PlacePrediction[] }>({
    queryKey: ['maps', 'places', debouncedTerm, language, context],
    endPoint: '/maps/places',
    config: { params: { q: debouncedTerm, lang: language, destination: context } },
    enabled,
  });
  return {
    options: !enabled || query.isStale ? [] : (query.data?.predictions ?? []),
    error: enabled ? query.error : null,
    loading:
      term.length >= 2 &&
      (!enabled || (!query.error && (query.isStale || query.isFetching))),
  };
};
export default usePlacesSearch;
