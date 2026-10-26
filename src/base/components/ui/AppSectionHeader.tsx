'use client';

import type { ReactNode } from 'react';
import { Box, Typography, type SxProps, type Theme } from '@mui/material';

export interface AppSectionHeaderProps {
  title: ReactNode;
  count?: number;
  subtitle?: ReactNode;
  actions?: ReactNode;
  stackActionsOnMobile?: boolean;
  sx?: SxProps<Theme>;
}

const AppSectionHeader = ({
  title,
  count,
  subtitle,
  actions,
  stackActionsOnMobile = false,
  sx,
}: AppSectionHeaderProps) => (
  <Box
    sx={[
      {
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        minWidth: 0,
        width: '100%',
      },
      ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
    ]}
  >
    <Box
      sx={{
        display: 'flex',
        flexDirection: {
          xs: stackActionsOnMobile ? 'column' : 'row',
          sm: 'row',
        },
        alignItems: {
          xs: stackActionsOnMobile ? 'stretch' : 'center',
          sm: 'center',
        },
        justifyContent: 'space-between',
        gap: 1.5,
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flex: '1 1 auto',
          minWidth: 0,
        }}
      >
        <Typography
          component="h2"
          sx={{
            fontFamily: 'var(--font-display)',
            fontSize: { xs: '16px', sm: '18px' },
            fontWeight: 700,
            minWidth: 0,
            overflowWrap: 'anywhere',
          }}
        >
          {title}
        </Typography>
        {count !== undefined && (
          <Typography
            component="span"
            sx={{
              flexShrink: 0,
              px: 1,
              py: 0.25,
              borderRadius: '999px',
              bgcolor: 'action.selected',
              color: 'text.secondary',
              fontSize: '12px',
              fontWeight: 600,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {count}
          </Typography>
        )}
      </Box>
      {actions && (
        <Box
          sx={{
            display: 'flex',
            flexShrink: 0,
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 1,
            minWidth: 0,
            '& > .MuiButton-root': {
              width: { xs: stackActionsOnMobile ? '100%' : 'auto', sm: 'auto' },
            },
          }}
        >
          {actions}
        </Box>
      )}
    </Box>
    {subtitle && (
      <Typography
        component="div"
        sx={{
          color: 'text.secondary',
          fontSize: '14px',
          lineHeight: 1.6,
          overflowWrap: 'anywhere',
        }}
      >
        {subtitle}
      </Typography>
    )}
  </Box>
);

export default AppSectionHeader;
