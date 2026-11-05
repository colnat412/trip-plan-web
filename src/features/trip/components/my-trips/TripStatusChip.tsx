'use client';

import { Box, Chip } from '@mui/material';
import { useTranslations } from 'next-intl';
import type { TripStatus } from '../../types';

import { TRIP_STATUS_PRESENTATION } from '../../constants/trip-status';

interface TripStatusChipProps {
  status: TripStatus;
}

const TripStatusChip = ({ status }: TripStatusChipProps) => {
  const t = useTranslations('trip');
  const config = TRIP_STATUS_PRESENTATION[status] ?? TRIP_STATUS_PRESENTATION.DRAFT;

  return (
    <Chip
      size="small"
      label={t(config.labelKey)}
      icon={
        <Box
          component="span"
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            ml: '6px !important',
            mr: '-2px !important',
            bgcolor: (theme) => theme.palette[config.variant].main,
          }}
        />
      }
      sx={(theme) => ({
        fontWeight: 700,
        fontSize: '12px',
        borderRadius: '6px',
        border: 'none',
        height: 24,
        bgcolor: (theme) => {
          const palette = theme.vars?.palette ?? theme.palette;
          return `color-mix(in srgb, ${palette[config.variant].main} 8%, ${palette.background.paper})`;
        },
        color: `color-mix(in srgb, ${(theme.vars?.palette ?? theme.palette)[config.variant].dark} 65%, ${(theme.vars?.palette ?? theme.palette).text.primary})`,
        ...theme.applyStyles('dark', { color: (theme.vars?.palette ?? theme.palette)[config.variant].light }),
        '& .MuiChip-label': {
          px: 1,
        },
      })}
    />
  );
};

export default TripStatusChip;
