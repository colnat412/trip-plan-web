'use client';

import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded';
import { Box, type BoxProps } from '@mui/material';
import { useTranslations } from 'next-intl';

export interface AppLoadingIndicatorProps extends BoxProps {
  size?: number | string;
}

const AppLoadingIndicator = ({
  size = 56,
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
          width: size,
          height: size,
          verticalAlign: 'middle',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box
        component="svg"
        viewBox="0 0 64 64"
        aria-hidden="true"
        sx={{
          width: size,
          height: size,
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
