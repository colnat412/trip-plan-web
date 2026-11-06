'use client';

import AppErrorState from '@/base/components/ui/AppErrorState';

import { AppLoadingState, AppPageContainer } from '@/base/components/ui';

import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';


import { useTripContext } from '../context/TripContext';
import TemplateLibrary from '@/features/plan-template/components/TemplateLibrary';
import QuickCreate from '@/features/plan-template/components/QuickCreate';
import ActiveTripBanner from './overview/ActiveTripBanner';
import OverviewDetails from './overview/OverviewDetails';
import EmptyTripState from './overview/EmptyTripState';
import TripBudgetCard from './overview/TripBudgetCard';

const Overview = () => {
  const desktop = useMediaQuery(useTheme().breakpoints.up('md'));
  const { trips, activeTrip, isLoading, error, refetchTrips, openCreateTrip } =
    useTripContext();

  if (isLoading)
    { return <AppPageContainer><AppLoadingState sx={{ minHeight: 320 }} /></AppPageContainer>; }
  if (error)
    return (
      <AppPageContainer>
        <AppErrorState status={error.status} onRetry={() => refetchTrips()} />
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
      {!desktop && (
        <TripBudgetCard
          key={`budget-${currentTrip.id}`}
          trip={currentTrip}
          compact
        />
      )}
      <OverviewDetails key={`details-${currentTrip.id}`} trip={currentTrip} />
    </AppPageContainer>
  );
};

export default Overview;
