'use client';

import type { MapsSource } from '@/base/types/maps';

import { Box, Typography } from '@mui/material';
import DirectionsCarFilledRoundedIcon from '@mui/icons-material/DirectionsCarFilledRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import { useTranslations } from 'next-intl';

import { AppButton } from '@/base/components/ui';
import { getGoogleMapsDirectionsUrl } from '../services/mapService';
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
  source,
}: ActivityDistanceConnectorProps) => {
  const t = useTranslations('plan.distance');
  const hint = isEstimated ? t('estimatedTooltip') : t('openInGoogleMaps');

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'stretch',
        gap: 1.5,
        flexWrap: 'wrap',
        minWidth: 0,
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          width: 40,
          flexShrink: 0,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ width: 2, minHeight: 44, bgcolor: 'divider' }} />
      </Box>
      <AppButton
        component="a"
        href={getGoogleMapsDirectionsUrl(originLocation, destinationLocation)}
        target="_blank"
        rel="noopener noreferrer"
        intent="text"
        size="small"
        wrapLabel
        aria-label={`${t('openInGoogleMaps')}: ${originLocation} → ${destinationLocation}`}
        title={hint}
        sx={{
          minWidth: 0,
          minHeight: 44,
          px: 1,
          gap: 1,
          justifyContent: 'flex-start',
          color: 'text.secondary',
          flexShrink: 1,
          fontWeight: 400,
          '&:hover': {
            color: 'primary.main',
            backgroundColor: 'action.hover',
          },
          '&:active': {
            backgroundColor: 'action.selected',
          },
          '&.Mui-focusVisible': {
            outlineOffset: -2,
          },
        }}
      >
        <DirectionsCarFilledRoundedIcon
          sx={{ fontSize: '16px', flexShrink: 0 }}
        />
        <Box
          component="span"
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 0.75,
            minWidth: 0,
          }}
        >
          <Typography
            component="span"
            sx={{ fontSize: '12px', overflowWrap: 'anywhere' }}
          >
            {distance?.text || t('unavailable')}
          </Typography>
          {duration && (
            <Typography
              component="span"
              sx={{ fontSize: '12px', overflowWrap: 'anywhere' }}
            >
              · {duration.text}
            </Typography>
          )}
          {isEstimated && (
            <Typography component="span" sx={{ fontSize: '11px' }}>
              · {t('estimatedLabel')}
            </Typography>
          )}
        </Box>
        <OpenInNewRoundedIcon sx={{ fontSize: '14px', flexShrink: 0 }} />
      </AppButton>
      {source === 'osm' && (
        <Typography
          component="a"
          href="https://www.openstreetmap.org/fixthemap"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            fontSize: '12px',
            color: 'text.secondary',
            alignSelf: 'center',
          }}
        >
          {t('fixMap')}
        </Typography>
      )}
    </Box>
  );
};

export default ActivityDistanceConnector;
