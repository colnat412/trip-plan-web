'use client';

import { useState, useEffect, useRef } from 'react';
import { getConsecutiveDistances } from '../services/mapService';
import type { PlanActivity, RouteSegment } from '../types';

export default function useDayRouteDistances(activities: PlanActivity[], locale: string, destinationContext?: string) {
  const language = locale === 'en' ? 'en' : 'vi';
  const activitiesRef = useRef(activities);
  const distanceRequestKey = JSON.stringify([
    activities.map((activity) => [
      activity.tripId,
      activity.dayId,
      activity.id,
      activity.location?.trim() || '',
    ]),
    language,
    destinationContext,
  ]);
  const [distanceData, setDistanceData] = useState<{
    requestKey: string;
    segments: RouteSegment[];
    formattedTotalDistance: string;
    formattedTotalDuration: string;
    totalDistanceMeters: number;
  } | null>(null);

  useEffect(() => {
    activitiesRef.current = activities;
  }, [activities]);

  useEffect(() => {
    let isMounted = true;

    const timeoutId = window.setTimeout(() => {
      void getConsecutiveDistances(
        activitiesRef.current,
        language,
        destinationContext,
      )
        .then((data) => {
          if (isMounted) {
            setDistanceData({ ...data, requestKey: distanceRequestKey });
          }
        })
        .catch((err) => {
          console.error('Failed to get consecutive distances:', err);
          if (isMounted) setDistanceData(null);
        });
    }, 0);

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, [language, destinationContext, distanceRequestKey]);

  return distanceData?.requestKey === distanceRequestKey ? distanceData : null;
}
