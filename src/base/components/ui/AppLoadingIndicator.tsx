'use client';

import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded';
import { Box, type BoxProps } from '@mui/material';
import { useTranslations } from 'next-intl';
import { LOADING_INDICATOR_SIZE } from '@/base/constants/loading';

export type AppLoadingIndicatorProps = Omit<BoxProps, 'width' | 'height'>;

const AppLoadingIndicator = ({
  sx,
  ...props
}: AppLoadingIndicatorProps) => {
  const t = useTranslations('loading');

  return (
    <Box
      role="status"
      aria-label={t('label')}
      {...props}
      sx={[
        {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: 'primary.main',
          verticalAlign: 'middle',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
        {
          width: LOADING_INDICATOR_SIZE,
          height: LOADING_INDICATOR_SIZE,
          minWidth: LOADING_INDICATOR_SIZE,
          minHeight: LOADING_INDICATOR_SIZE,
          maxWidth: LOADING_INDICATOR_SIZE,
          maxHeight: LOADING_INDICATOR_SIZE,
        },
      ]}
    >
      <Box
        component="svg"
        viewBox="0 0 64 64"
        aria-hidden="true"
        sx={{
          width: LOADING_INDICATOR_SIZE,
          height: LOADING_INDICATOR_SIZE,
          flexShrink: 0,
          overflow: 'visible',
          animation: 'tripbudget-orbit 1.6s linear infinite',
          '@keyframes tripbudget-orbit': {
            to: { transform: 'rotate(360deg)' },
          },
          '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
        }}
      >
        <circle
          cx="32"
          cy="32"
          r="23"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="0.1 12"
          strokeDashoffset="-22"
          opacity="0.25"
        />
        <circle
          cx="32"
          cy="32"
          r="23"
          fill="none"
          stroke="currentColor"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeDasharray="0.1 12 0.1 12 0.1 120"
          strokeDashoffset="-88"
          opacity="0.7"
        />
        <FlightTakeoffRoundedIcon
          x="21"
          y="-2"
          width="22"
          height="22"
          sx={{ transform: 'rotate(27deg)', transformOrigin: '32px 9px' }}
        />
      </Box>
    </Box>
  );
};

export default AppLoadingIndicator;
