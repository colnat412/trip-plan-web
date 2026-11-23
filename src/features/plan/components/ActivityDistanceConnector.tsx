'use client';

import type { MapsSource } from '@/base/types/maps';
import { Box, Typography } from '@mui/material';
import RouteRoundedIcon from '@mui/icons-material/RouteRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import { useTranslations } from 'next-intl';
import { AppTimelineRail, AppIconText } from '@/base/components/ui';
import type { DistanceInfo, DurationInfo } from '../types';

export interface ActivityDistanceConnectorProps {
  originLocation: string;
  destinationLocation: string;
  distance?: DistanceInfo;
  duration?: DurationInfo;
  isEstimated?: boolean;
  source?: MapsSource;
}

const ActivityDistanceConnector = ({
  originLocation,
  destinationLocation,
  distance,
  duration,
  isEstimated,
}: ActivityDistanceConnectorProps) => {
  const t = useTranslations('plan.distance');
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'stretch',
        gap: 'var(--app-timeline-gap, 8px)',
        minWidth: 0,
      }}
    >
      <AppTimelineRail />
      <Box
        role="group"
        aria-label={t('routeLabel', { origin: originLocation, destination: destinationLocation })}
        title={isEstimated ? t('estimatedTooltip') : undefined}
        sx={{
          display: 'flex',
          flex: 1,
          minWidth: 0,
          minHeight: 44,
          px: 1.5,
          py: 1,
          gap: 1,
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'text.secondary',
          borderRadius: 'var(--app-radius-small)',
        }}
      >
        <AppIconText icon={<RouteRoundedIcon />} sx={{ flex: '1 1 100px' }}>
          {distance?.text || t('unavailable')}
        </AppIconText>
        {duration && (
          <AppIconText icon={<AccessTimeRoundedIcon />}>
            {duration.text}
          </AppIconText>
        )}
        {isEstimated && (
          <Typography
            component="span"
            sx={{
              flexBasis: '100%',
              fontSize: '11px',
              lineHeight: '16px',
              textAlign: 'left',
            }}
          >
            {t('estimatedLabel')}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ActivityDistanceConnector;
