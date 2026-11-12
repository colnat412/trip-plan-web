'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { axiosGet } from '@/base/api';
import type { MapCoordinates, MapStop } from '@/base/types/maps';
import type { PlanActivity } from '../types';

const pendingLocations = new Map<string, Promise<MapCoordinates | null>>();

const fetchCoordinates = (address: string, language: string) => {
  const key = JSON.stringify([address, language]);
  const pending = pendingLocations.get(key);
  if (pending) return pending;
  const request = axiosGet<{ location: { coordinates: MapCoordinates } | null }>(
    '/maps/location', { params: { q: address, lang: language } },
  ).then(({ location }) => {
    const point = location?.coordinates;
    return point && Number.isFinite(point.latitude) && Math.abs(point.latitude) <= 85 &&
      Number.isFinite(point.longitude) && Math.abs(point.longitude) <= 180 ? point : null;
  }).finally(() => pendingLocations.delete(key));
  pendingLocations.set(key, request);
  return request;
};

const usePlanMapStops = (activities: PlanActivity[], destination: string) => {
  const locale = useLocale();
  const language = locale === 'en' ? 'en' : 'vi';
  const [attempt, setAttempt] = useState(0);
  const cache = useRef(new Map<string, MapCoordinates | null>());
  const addresses = activities.map(({ location }) => {
    const address = location?.trim() ?? '';
    const context = destination.trim();
    return address && context && !address.includes(',') &&
      !address.toLocaleLowerCase().includes(context.toLocaleLowerCase())
      ? `${address}, ${context}` : address;
  });
  const addressesKey = JSON.stringify(addresses);
  const requestKey = JSON.stringify([addressesKey, language, attempt]);
  const [result, setResult] = useState<{
    key: string; locations: Record<string, MapCoordinates | null>; loading: boolean;
  }>({ key: '', locations: {}, loading: false });

  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      const locations: Record<string, MapCoordinates | null> = {};
      // Sequential requests respect provider budgets. Only identical in-flight calls are shared.
      for (const address of [...new Set<string>(JSON.parse(addressesKey))].filter(Boolean)) {
        if (!active) return;
        const cacheKey = JSON.stringify([address, language]);
        try {
          const coordinates = cache.current.has(cacheKey)
            ? cache.current.get(cacheKey)! : await fetchCoordinates(address, language);
          if (!active) return;
          cache.current.set(cacheKey, coordinates);
          locations[address] = coordinates;
          setResult({ key: requestKey, locations: { ...locations }, loading: true });
        } catch {
          // Stop after a policy/rate/provider failure; retry is an explicit user action.
          break;
        }
      }
      if (active) setResult({ key: requestKey, locations, loading: false });
    }, 0);
    return () => { active = false; clearTimeout(timer); };
  }, [addressesKey, language, requestKey]);

  const current = result.key === requestKey;
  const stops: MapStop[] = activities.flatMap((activity, index) => {
    const coordinates = current ? result.locations[addresses[index]] : null;
    return coordinates ? [{
      id: String(activity.id), label: activity.title, order: index + 1,
      coordinates, completed: activity.status === 'COMPLETED',
    }] : [];
  });
  const locationCount = addresses.filter(Boolean).length;
  return {
    stops,
    loading: locationCount > 0 && (!current || result.loading),
    missingCount: locationCount - stops.length,
    retry: () => { cache.current.clear(); setAttempt((value) => value + 1); },
  };
};

export default usePlanMapStops;
