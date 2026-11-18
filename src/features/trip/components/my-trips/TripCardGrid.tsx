'use client';

import { AppLoadingState, AppButton, AppEmptyState } from '@/base/components/ui';

import React from 'react';
import { Box } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useTranslations } from 'next-intl';

import TripCardItem from './TripCardItem';
import type { Trip } from '../../types';

export interface TripCardGridProps {
  trips: Trip[];
  isLoading?: boolean;
  loadingScope?: 'page' | 'local';
  activeTripId?: string | number | null;
  onSelectTrip: (trip: Trip) => void;
  onCreateTrip?: () => void;
  onEditTrip?: (trip: Trip) => void;
  onDeleteTrip?: (trip: Trip) => void;
}

const TripCardGrid = ({
  trips,
  isLoading = false,
  loadingScope = 'page',
  activeTripId,
  onSelectTrip,
  onCreateTrip,
  onEditTrip,
  onDeleteTrip,
}: TripCardGridProps) => {
  const t = useTranslations('myTrips');

  if (isLoading) {
    return <AppLoadingState local={loadingScope === 'local'} />;
  }

  if (trips.length === 0) {
    return (
      <AppEmptyState title={t('emptyTitle')} action={onCreateTrip ?
        <AppButton size="small" intent="primary" startIcon={<AddRoundedIcon />} onClick={onCreateTrip}>{t('createNew')}</AppButton> : undefined
      } />
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(auto-fill, minmax(250px, 1fr))',
        },
        gap: { xs: 1.5, sm: 2, md: 2.5 },
      }}
    >
      {trips.map((trip) => {
        const isActive =
          activeTripId !== null &&
          activeTripId !== undefined &&
          String(trip.id) === String(activeTripId);

        return (
          <TripCardItem
            key={trip.id}
            trip={trip}
            isActive={isActive}
            onSelect={onSelectTrip}
            onEdit={onEditTrip}
            onDelete={onDeleteTrip}
          />
        );
      })}
    </Box>
  );
};

export default TripCardGrid;
