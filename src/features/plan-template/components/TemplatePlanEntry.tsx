'use client';
import { useEffect } from 'react';
import { Alert, Skeleton } from '@mui/material';
import { useTranslations } from 'next-intl';
import { AppPageContainer } from '@/base/components/ui';
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
  const { activeTrip, selectTrip, error } = useTripContext();
  const t = useTranslations('planTemplate');
  useEffect(() => {
    if (tripId) selectTrip(tripId);
  }, [tripId, selectTrip]);
  if (tripId && String(activeTrip?.id) !== tripId)
    return (
      <AppPageContainer>
        {error ? (
          <Alert severity="error">{t('loadError')}</Alert>
        ) : (
          <Skeleton height={300} />
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
