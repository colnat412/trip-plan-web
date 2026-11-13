'use client';

import React from 'react';
import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded';
import { useTranslations } from 'next-intl';

import { AppPageHeader } from '@/base/components/ui';

interface MyTripsHeaderProps {
  totalTrips: number;
}

const MyTripsHeader = ({ totalTrips }: MyTripsHeaderProps) => {
  const t = useTranslations('myTrips');

  return (
    <AppPageHeader
      icon={<FlightTakeoffRoundedIcon />}
      title={t('title')}
      badge={totalTrips > 0 ? totalTrips : undefined}
    />
  );
};

export default MyTripsHeader;
