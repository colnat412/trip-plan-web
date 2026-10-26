'use client';

import { Alert, Box, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { AppButton, AppCard, AppPageContainer } from '@/base/components/ui';
import { useTripContext } from '../context/TripContext';
import ActiveTripBanner from './overview/ActiveTripBanner';
import EmptyTripState from './overview/EmptyTripState';
import RecentExpenseList from './overview/RecentExpenseList';
import TripBudgetCard from './overview/TripBudgetCard';
import TripItineraryPreview from './overview/TripItineraryPreview';

const Overview = () => {
  const t = useTranslations('overview');
  const tNav = useTranslations('navigation');
  const { trips, activeTrip, isLoading, error, refetchTrips, openCreateTrip } =
    useTripContext();

  if (isLoading)
    return (
      <AppPageContainer>
        <Skeleton
          variant="rounded"
          height={380}
          sx={{ borderRadius: '24px' }}
        />
        <Skeleton
          variant="rounded"
          height={300}
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
        <EmptyTripState onCreateTrip={openCreateTrip} />
      </AppPageContainer>
    );
  const currentTrip = activeTrip || trips[0];

  return (
    <AppPageContainer>
      <ActiveTripBanner key={currentTrip.id} trip={currentTrip} />
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          alignItems: 'flex-start',
          gap: 3,
        }}
      >
        <Box
          sx={{ flex: '7 1 0', width: { xs: '100%', lg: 'auto' }, minWidth: 0 }}
        >
          <TripItineraryPreview key={currentTrip.id} trip={currentTrip} />
        </Box>
        <Stack
          spacing={3}
          sx={{ flex: '4 1 0', width: { xs: '100%', lg: 'auto' }, minWidth: 0 }}
        >
          <TripBudgetCard key={currentTrip.id} trip={currentTrip} />
          <AppCard
            component="section"
            sx={{ p: { xs: 2.5, md: 3 }, borderRadius: '20px' }}
          >
            <Stack spacing={2}>
              <Typography
                component="h2"
                sx={{ fontSize: '18px', fontWeight: 700 }}
              >
                {t('recentTitle')}
              </Typography>
              <RecentExpenseList
                key={currentTrip.id}
                tripId={currentTrip.id}
                currency={currentTrip.baseCurrency}
              />
            </Stack>
          </AppCard>
        </Stack>
      </Box>
    </AppPageContainer>
  );
};

export default Overview;
