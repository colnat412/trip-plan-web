'use client';

import { Alert, Skeleton } from '@mui/material';
import { useTranslations } from 'next-intl';
import { AppButton, AppPageContainer } from '@/base/components/ui';
import { useTripContext } from '../context/TripContext';
import TemplateLibrary from '@/features/plan-template/components/TemplateLibrary';
import QuickCreate from '@/features/plan-template/components/QuickCreate';
import ActiveTripBanner from './overview/ActiveTripBanner';
import OverviewDetails from './overview/OverviewDetails';
import EmptyTripState from './overview/EmptyTripState';

const Overview = () => {
  const tNav = useTranslations('navigation');
  const { trips, activeTrip, isLoading, error, refetchTrips, openCreateTrip } =
    useTripContext();

  if (isLoading)
    return (
      <AppPageContainer>
        <Skeleton
          variant="rounded"
          height={190}
          sx={{ borderRadius: '24px' }}
        />
        <Skeleton
          variant="rounded"
          height={120}
          sx={{ borderRadius: '20px' }}
        />
      </AppPageContainer>
    );
  if (error)
    return (
      <AppPageContainer>
        <Alert
          severity="error"
          action={
            <AppButton
              intent="text"
              onClick={() => void refetchTrips().catch(() => undefined)}
            >
              {tNav('retry')}
            </AppButton>
          }
        >
          {tNav('tripLoadError')}
        </Alert>
      </AppPageContainer>
    );
  if (!trips?.length)
    return (
      <AppPageContainer>
        <TemplateLibrary compact />
        <QuickCreate />
        <EmptyTripState onCreateTrip={openCreateTrip} />
      </AppPageContainer>
    );
  const currentTrip = activeTrip || trips[0];

  return (
    <AppPageContainer>
      <ActiveTripBanner key={currentTrip.id} trip={currentTrip} compact />
      <QuickCreate />
      <OverviewDetails key={`details-${currentTrip.id}`} trip={currentTrip} />
    </AppPageContainer>
  );
};

export default Overview;
