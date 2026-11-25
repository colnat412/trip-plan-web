'use client';

import type { MapsSource } from '@/base/types/maps';
import { Box, Typography } from '@mui/material';
import RouteRoundedIcon from '@mui/icons-material/RouteRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
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
  const origin = originLocation.trim();
  const destination = destinationLocation.trim();
  const directionsUrl = origin && destination
    ? 'https://www.google.com/maps/dir/?' + new URLSearchParams({ api: '1', origin, destination })
    : undefined;
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
        component={directionsUrl ? 'a' : 'div'}
        href={directionsUrl}
        target={directionsUrl ? '_blank' : undefined}
        rel={directionsUrl ? 'noopener noreferrer' : undefined}
        role={directionsUrl ? undefined : 'group'}
        aria-label={t(directionsUrl ? 'openGoogleMapsRoute' : 'routeLabel', { origin: originLocation, destination: destinationLocation })}
        title={[directionsUrl && t('openGoogleMaps'), isEstimated && t('estimatedTooltip')].filter(Boolean).join(' · ') || undefined}
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
          textDecoration: 'none',
          borderRadius: 'var(--app-radius-small)',
          ...(directionsUrl && {
            '&:hover': { color: 'primary.main', bgcolor: 'action.hover' },
            '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
          }),
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
        {directionsUrl && <OpenInNewRoundedIcon aria-hidden="true" sx={{ fontSize: 15, flexShrink: 0 }} />}
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
