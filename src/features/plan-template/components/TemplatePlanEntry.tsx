'use client';

import AppErrorState from '@/base/components/ui/AppErrorState';

import { AppLoadingState, AppPageContainer } from '@/base/components/ui';
import { useEffect } from 'react';


import { useTripContext } from '@/features/trip/context/TripContext';
import PlanOverview from '@/features/plan/components/PlanOverview';
const TemplatePlanEntry = ({
  tripId,
  ai,
  publish,
}: {
  tripId?: string;
  ai: boolean;
  publish: boolean;
}) => {
  const { activeTrip, selectTrip, error, refetchTrips } = useTripContext();
  useEffect(() => {
    if (tripId) selectTrip(tripId);
  }, [tripId, selectTrip]);
  if (tripId && String(activeTrip?.id) !== tripId)
    return (
      <AppPageContainer>
        {error ? (
          <AppErrorState status={error.status} onRetry={() => refetchTrips()} />
        ) : (
          <AppLoadingState sx={{ minHeight: 300 }} />
        )}
      </AppPageContainer>
    );
  return (
    <PlanOverview
      key={tripId}
      initialAiOpen={ai}
      initialPublishOpen={publish}
    />
  );
};
export default TemplatePlanEntry;
