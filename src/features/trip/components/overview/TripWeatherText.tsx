'use client';

import { Stack, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import { useTranslations } from 'next-intl';
import useTripWeather from '../../hooks/useTripWeather';
import type { Trip } from '../../types';
import WeatherConditionIcon from './WeatherConditionIcon';

const TripWeatherText = ({ trip }: { trip: Trip }) => {
  const t = useTranslations('weather');
  const { weather, enabled, isLoading, error } = useTripWeather(trip);
  if (!enabled || weather?.state === 'HIDDEN') return null;
  const summary = weather?.summary;
  const ready = weather?.state === 'READY' && summary;
  const temperature = ready ? Math.round(summary.temperatureC) : null;
  const label = isLoading
    ? t('loading')
    : ready
      ? t('summaryLabel', {
          count: summary.dayCount,
          temperature: temperature!,
          condition: t(`conditions.${summary.condition}`),
        })
      : t(error ? 'UNAVAILABLE' : (weather?.state ?? 'UNAVAILABLE'));
  const iconStyle = { fontSize: '16px', flexShrink: 0 };

  return (
    <Stack
      direction="row"
      useFlexGap
      role="img"
      aria-label={label}
      title={label}
      sx={{
        alignItems: 'center',
        gap: '4px',
        flexShrink: 0,
        whiteSpace: 'nowrap',
      }}
    >
      {ready ? (
        <WeatherConditionIcon condition={summary.condition} sx={iconStyle} />
      ) : isLoading ? (
        <HourglassEmptyOutlinedIcon sx={iconStyle} />
      ) : (
        <InfoOutlinedIcon sx={iconStyle} />
      )}
      <Typography
        component="span"
        sx={{ fontSize: '14px', color: 'inherit', lineHeight: 1.5 }}
      >
        {temperature == null ? '—' : `${temperature}°C`}
      </Typography>
    </Stack>
  );
};

export default TripWeatherText;
