'use client';

import type { ReactNode } from 'react';
import { Box, ButtonBase, Typography } from '@mui/material';
import AppTimelineRail from './AppTimelineRail';

export interface AppTimelineRowProps {
  icon: ReactNode;
  title: string;
  meta?: ReactNode;
  leading?: ReactNode;
  railWidth?: number;
  children?: ReactNode;
  actions?: ReactNode;
  hasNext?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}

const AppTimelineRow = ({
  icon,
  title,
  meta,
  leading,
  railWidth,
  children,
  actions,
  hasNext = false,
  selected = false,
  onSelect,
}: AppTimelineRowProps) => (
  <Box
    sx={{
      display: 'flex',
      width: '100%',
      alignItems: 'stretch',
      minWidth: 0,
      gap: 1,
    }}
  >
    <AppTimelineRail marker={icon} width={railWidth} hasNext={hasNext} />
    <Box sx={{ flex: 1, minWidth: 0, pb: hasNext ? 1 : 0 }}>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          minWidth: 0,
          border: 1,
          borderRadius: '14px',
          borderColor: selected ? 'primary.main' : 'divider',
          bgcolor: selected ? 'action.selected' : 'background.paper',
        }}
      >
        <Box
          component={onSelect ? ButtonBase : 'div'}
          onClick={onSelect}
          aria-pressed={onSelect ? selected : undefined}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            justifyContent: 'flex-start',
            flex: 1,
            minWidth: 0,
            gap: 0.75,
            p: 1.5,
            textAlign: 'left',
            borderRadius: '14px',
            color: 'text.primary',
            '&:hover': onSelect ? { bgcolor: 'action.hover' } : undefined,
            '&.Mui-focusVisible': {
              outline: '2px solid',
              outlineColor: 'primary.main',
              outlineOffset: -2,
            },
          }}
        >
          {leading}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 1,
              minWidth: 0,
              flexWrap: 'wrap',
            }}
          >
            <Typography
              component="span"
              sx={{
                flex: '1 1 120px',
                minWidth: 0,
                fontSize: { xs: '14px', sm: '15px' },
                fontWeight: 700,
                lineHeight: 1.6,
                overflowWrap: 'anywhere',
              }}
            >
              {title}
            </Typography>
            {meta && (
              <Box
                sx={{ minWidth: 0, maxWidth: '100%', overflowWrap: 'anywhere' }}
              >
                {meta}
              </Box>
            )}
          </Box>
          {children}
        </Box>
        {actions && (
          <Box
            sx={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'flex-start',
              pt: 0.5,
            }}
          >
            {actions}
          </Box>
        )}
      </Box>
    </Box>
  </Box>
);

export default AppTimelineRow;
