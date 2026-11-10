'use client';

import { Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { getTripTiming } from '../../utils/trip-timing';
import type { Trip } from '../../types';

interface TripCountdownProps {
  trip: Trip;
  now: Date | null;
}

const TripCountdown = ({ trip, now }: TripCountdownProps) => {
  const t = useTranslations('overview.countdown');
  if (!now) return null;
  const timing = getTripTiming(trip, now);
  if (timing.phase === 'unknown') return null;
  const label =
    timing.phase === 'upcoming'
      ? t('upcoming', { count: timing.count })
      : timing.phase === 'active'
        ? t(timing.count === 1 ? 'lastDay' : 'remaining', {
            count: timing.count,
          })
        : t(timing.phase);
  return (
    <Typography
      sx={{
        fontSize: '14px',
        fontWeight: 700,
        color: 'inherit',
        overflowWrap: 'anywhere',
      }}
    >
      {label}
    </Typography>
  );
};

export default TripCountdown;
