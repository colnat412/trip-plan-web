'use client';

import {
  Avatar,
  Box,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { useTranslations } from 'next-intl';
import { AppButton, AppInfiniteScrollTrigger } from '@/base/components/ui';
import { formatDateRange } from '@/base/utils';
import useTripSwitcherSearch from '../hooks/useTripSwitcherSearch';
import type { Trip } from '../types';

interface TripSwitcherResultsProps {
  search: string;
  selectedTripId: number | string;
  onSelect: (trip: Trip) => void;
}

const TripSwitcherResults = ({
  search,
  selectedTripId,
  onSelect,
}: TripSwitcherResultsProps) => {
  const t = useTranslations('navigation');
  const {
    trips,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    error,
    refetch,
    fetchNextPage,
  } = useTripSwitcherSearch(search);
  if (isLoading)
    return (
      <Stack role="status" spacing={1} sx={{ alignItems: 'center', py: 3 }}>
        <CircularProgress size={24} />
        <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
          {t('searchingTrips')}
        </Typography>
      </Stack>
    );
  return (
    <Box aria-busy={isFetching || isFetchingNextPage}>
      <Stack spacing={0.75}>
        {trips.map((trip) => {
          const selected = String(trip.id) === String(selectedTripId);
          return (
            <AppButton
              key={trip.id}
              intent="text"
              size="small"
              onClick={() => {
                onSelect(trip);
              }}
              aria-label={t('selectTrip', { name: trip.name })}
              aria-current={selected ? 'true' : undefined}
              sx={{
                width: '100%',
                minWidth: 0,
                minHeight: 76,
                px: 1.5,
                border: 1,
                borderColor: selected ? 'primary.main' : 'transparent',
                bgcolor: selected ? 'action.selected' : 'transparent',
                color: 'text.primary',
                '&.Mui-focusVisible': {
                  outline: '2px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: -2,
                },
              }}
            >
              <Stack
                direction="row"
                spacing={1.5}
                sx={{ alignItems: 'center', width: '100%', minWidth: 0 }}
              >
                <Avatar
                  src={trip.coverUrl ?? undefined}
                  alt={trip.name}
                  variant="rounded"
                  sx={{
                    width: 40,
                    height: 40,
                    flexShrink: 0,
                    bgcolor: 'action.hover',
                    color: 'primary.main',
                  }}
                >
                  <FlightTakeoffRoundedIcon />
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                  <Typography
                    noWrap
                    title={trip.name}
                    sx={{ fontSize: '14px', fontWeight: 700 }}
                  >
                    {trip.name}
                  </Typography>
                  <Typography
                    noWrap
                    title={trip.destination}
                    sx={{ fontSize: '11px', color: 'text.secondary' }}
                  >
                    {trip.destination}
                  </Typography>
                  <Typography
                    noWrap
                    sx={{ fontSize: '11px', color: 'text.secondary' }}
                  >
                    {formatDateRange(
                      trip.startDate,
                      trip.endDate,
                      'DD/MM/YYYY',
                    )}
                  </Typography>
                </Box>
                {selected && (
                  <CheckRoundedIcon
                    sx={{ color: 'primary.main', flexShrink: 0 }}
                  />
                )}
              </Stack>
            </AppButton>
          );
        })}
        {!trips.length && !error && (
          <Typography sx={{ py: 2, fontSize: '13px', color: 'text.secondary' }}>
            {t('noMatchingTrips')}
          </Typography>
        )}
        {error && (
          <Stack spacing={1} sx={{ alignItems: 'center', py: 2 }}>
            <Typography
              role="alert"
              sx={{ fontSize: '13px', color: 'error.main' }}
            >
              {t('tripLoadError')}
            </Typography>
            <AppButton
              intent="text"
              size="small"
              onClick={() => {
                void refetch();
              }}
            >
              {t('retry')}
            </AppButton>
          </Stack>
        )}
        <AppInfiniteScrollTrigger
          hasMore={hasNextPage && !error}
          loading={isFetchingNextPage}
          onLoadMore={() => {
            void fetchNextPage();
          }}
        />
      </Stack>
    </Box>
  );
};
export default TripSwitcherResults;
