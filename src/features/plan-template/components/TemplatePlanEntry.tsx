'use client';

import AppErrorState from '@/base/components/ui/AppErrorState';

import { AppLoadingState, AppPageContainer } from '@/base/components/ui';
import { useEffect } from 'react';

import { useTripContext } from '@/features/trip/context/TripContext';
import PlanOverview from '@/features/plan/components/PlanOverview';
const TemplatePlanEntry = ({
  tripId,
  dayId,
  ai,
  publish,
}: {
  tripId?: string;
  dayId?: string;
  ai: boolean;
  publish: boolean;
}) => {
  const { activeTrip, selectTrip, error, refetchTrips } = useTripContext();
  useEffect(() => {
    if (tripId) selectTrip(tripId);
  }, [tripId, selectTrip]);
  if (tripId && String(activeTrip?.id) !== tripId)
    return (
      <AppPageContainer embedded>
        {error ? (
          <AppErrorState status={error.status} onRetry={() => refetchTrips()} />
        ) : (
          <AppLoadingState />
        )}
      </AppPageContainer>
    );
  return (
    <PlanOverview
      key={`${tripId ?? activeTrip?.id ?? ''}:${dayId ?? ''}:${ai}:${publish}`}
      initialDayId={dayId}
      initialAiOpen={ai}
      initialPublishOpen={publish}
    />
  );
};
export default TemplatePlanEntry;
