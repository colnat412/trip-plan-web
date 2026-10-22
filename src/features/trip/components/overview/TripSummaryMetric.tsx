'use client';

import type { ReactNode } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

interface TripSummaryMetricProps {
  label: string;
  value: string;
  danger?: boolean;
  inverted?: boolean;
  icon?: ReactNode;
  divider?: boolean;
}

const TripSummaryMetric = ({
  label,
  value,
  danger = false,
  inverted = false,
  icon,
  divider = false,
}: TripSummaryMetricProps) => {
  return (
    <Stack
      spacing={0.5}
      sx={(theme) => ({
        flex: '1 1 0',
        minWidth: 0,
        borderLeft: divider ? { xs: 0, sm: 1 } : 0,
        borderColor: alpha(theme.palette.common.white, 0.2),
        pl: divider ? { xs: 0, sm: 3 } : 0,
        justifyContent: 'center',
      })}
    >
      <Typography
        sx={(theme) => ({
          color: inverted
            ? alpha(theme.palette.common.white, 0.72)
            : 'text.secondary',
          fontSize: { xs: '12px', lg: '14px' },
          fontWeight: 500,
          '@media (max-height: 820px)': {
            fontSize: { md: '11px' },
          },
        })}
      >
        {label}
      </Typography>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        {icon ? (
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              flexShrink: 0,
              color: inverted ? 'common.white' : 'primary.main',
              '& svg': { fontSize: { xs: '19px', lg: '22px' } },
              '@media (max-height: 820px)': {
                '& svg': { fontSize: { md: '18px' } },
              },
            }}
          >
            {icon}
          </Box>
        ) : null}
        <Typography
          sx={{
            color: danger
              ? inverted
                ? 'error.light'
                : 'error.main'
              : inverted
                ? 'common.white'
                : 'text.primary',
            fontFamily: 'var(--font-mono)',
            fontSize: { xs: '16px', lg: '20px' },
            fontWeight: 700,
            lineHeight: 1.2,
            '@media (max-height: 820px)': {
              fontSize: { md: '16px' },
            },
          }}
        >
          {value}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default TripSummaryMetric;
