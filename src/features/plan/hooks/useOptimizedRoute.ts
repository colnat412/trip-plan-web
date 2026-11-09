'use client';

import { useEffect, useRef, useState } from 'react';
import { solveOptimalRoute } from '../services/mapService';
import type { OptimizationResult, PlanActivity } from '../types';

export default function useOptimizedRoute({
  open,
  activities,
  startIndex,
  locale,
  destinationContext,
}: {
  open: boolean;
  activities: PlanActivity[];
  startIndex: number;
  locale: string;
  destinationContext?: string;
}) {
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [response, setResponse] = useState<{
    key: string;
    result: OptimizationResult | null;
    failed: boolean;
  } | null>(null);
  const activitiesRef = useRef(activities);
  useEffect(() => {
    activitiesRef.current = activities;
  }, [activities]);
  const locationCount = activities.filter((activity) => activity.location?.trim()).length;
  const requestKey = JSON.stringify([open, activities, startIndex, locale, destinationContext, retryAttempt]);

  useEffect(() => {
    if (!open || locationCount < 2) return;
    let cancelled = false;
    void solveOptimalRoute(activitiesRef.current, {
      startIndex,
      lang: locale === 'en' ? 'en' : 'vi',
      destinationContext,
    })
      .then((result) => {
        if (!cancelled) setResponse({ key: requestKey, result, failed: false });
      })
      .catch(() => {
        if (!cancelled) setResponse({ key: requestKey, result: null, failed: true });
      });
    return () => {
      cancelled = true;
    };
  }, [open, locationCount, requestKey, startIndex, locale, destinationContext]);

  const current = response?.key === requestKey ? response : null;
  return {
    result: current?.result ?? null,
    hasRouteError: current?.failed ?? false,
    isLoading: open && locationCount >= 2 && !current,
    retry: () => setRetryAttempt((attempt) => attempt + 1),
  };
}
