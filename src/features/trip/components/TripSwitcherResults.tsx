'use client';

import { useEffect, useState } from 'react';
import AppErrorState from '@/base/components/ui/AppErrorState';

import { AppLoadingState, AppEmptyState, AppButton, AppInfiniteScrollTrigger } from '@/base/components/ui';

import { Avatar, Box, Stack, Typography } from '@mui/material';
import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { useTranslations } from 'next-intl';

import { formatDateRange } from '@/base/utils';
import useTripSwitcherSearch from '../hooks/useTripSwitcherSearch';
import type { Trip } from '../types';
import { getTripCoverUrl } from '../utils/trip-cover';

interface TripSwitcherResultsProps {
  search: string;
  scrollRoot?: HTMLDivElement | null;
  selectedTripId: number | string;
  onSelect: (trip: Trip) => void;
}

const TripSwitcherResults = ({
  search,
  scrollRoot = null,
  selectedTripId,
  onSelect,
}: TripSwitcherResultsProps) => {
  const t = useTranslations('navigation');
  const [scrollVisit, setScrollVisit] = useState({ search, root: scrollRoot, scrolled: false });
  if (scrollVisit.search !== search || scrollVisit.root !== scrollRoot) {
    setScrollVisit({ search, root: scrollRoot, scrolled: false });
  }
  const hasScrolled = scrollVisit.search === search && scrollVisit.root === scrollRoot && scrollVisit.scrolled;
  useEffect(() => {
    if (!scrollRoot) return;
    scrollRoot.scrollTo(0, 0);
    const markScroll = () => { if (scrollRoot.scrollTop > 0) setScrollVisit({ search, root: scrollRoot, scrolled: true }); };
    scrollRoot.addEventListener('scroll', markScroll, { passive: true });
    return () => scrollRoot.removeEventListener('scroll', markScroll);
  }, [search, scrollRoot]);
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
      <AppLoadingState local sx={{ minHeight: 160 }} />
    );
  return (
    <Box aria-busy={isFetching || isFetchingNextPage}>
      <Stack spacing={0.5}>
        {trips.map((trip) => {
          const selected = String(trip.id) === String(selectedTripId);
          return (
            <AppButton
              key={trip.id}
              intent="text"
              selected={selected}
              size="small"
              onClick={() => {
                onSelect(trip);
              }}
              aria-label={t('selectTrip', { name: trip.name })}
              aria-current={selected ? 'true' : undefined}
              sx={{
                width: '100%',
                minWidth: 0,
                minHeight: 64,
                height: 64,
                px: 1,
                py: 0.5,
                border: 1,
                borderColor: 'transparent',
                ...(selected ? {} : { bgcolor: 'transparent', color: 'text.primary' }),
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
                  src={getTripCoverUrl(trip)}
                  alt={trip.name}
                  variant="rounded"
                  sx={{
                    width: 32,
                    height: 32,
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
                    sx={{ fontSize: '13px', fontWeight: 600 }}
                  >
                    {trip.name}
                  </Typography>
                  <Typography
                    noWrap
                    title={trip.destination}
                    sx={{ fontSize: '11px', color: selected ? 'inherit' : 'text.secondary' }}
                  >
                    {trip.destination}
                  </Typography>
                  <Typography
                    noWrap
                    sx={{ fontSize: '11px', color: selected ? 'inherit' : 'text.secondary' }}
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
                    sx={{ color: 'inherit', flexShrink: 0 }}
                  />
                )}
              </Stack>
            </AppButton>
          );
        })}
        {!trips.length && !error && (
          <AppEmptyState compact title={t('noMatchingTrips')} sx={{ py: 2 }} />
        )}
        {error && (
          <AppErrorState
            status={error.status}
            compact
            onRetry={() => refetch()}
            retrying={isFetching}
          />
        )}
        <AppInfiniteScrollTrigger
          hasMore={hasNextPage && !error}
          root={scrollRoot}
          rootMargin="0px"
          enabled={Boolean(scrollRoot) && hasScrolled && !isFetching}
          loading={isFetchingNextPage}
          onLoadMore={() => {
            if (scrollRoot && scrollRoot.scrollTop > 0) void fetchNextPage();
          }}
        />
      </Stack>
    </Box>
  );
};
export default TripSwitcherResults;
