'use client';

import type { ReactNode } from 'react';
import { Box, Popover, Typography, type PopoverProps } from '@mui/material';

export interface AppPopoverProps extends Omit<
  PopoverProps,
  'children' | 'slotProps'
> {
  label: string;
  title?: string;
  header?: ReactNode;
  actions?: ReactNode;
  width?: number;
  children: ReactNode;
}

const AppPopover = ({
  label,
  title,
  header,
  actions,
  width = 400,
  children,
  anchorOrigin = { vertical: 'bottom', horizontal: 'left' },
  transformOrigin = { vertical: 'top', horizontal: 'left' },
  ...props
}: AppPopoverProps) => (
  <Popover
    {...props}
    anchorOrigin={anchorOrigin}
    transformOrigin={transformOrigin}
    slotProps={{
      paper: {
        role: 'dialog',
        'aria-label': label,
        sx: {
          width,
          maxWidth: 'calc(100vw - 32px)',
          maxHeight: 'min(560px, calc(100dvh - 32px))',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: '16px',
          border: 1,
          borderColor: 'divider',
          boxShadow: 4,
        },
      },
    }}
  >
    {(title || header) && (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          p: 1.5,
          flexShrink: 0,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        {title && (
          <Typography
            component="h2"
            sx={{ fontSize: '14px', fontWeight: 700, lineHeight: 1.5 }}
          >
            {title}
          </Typography>
        )}
        {header}
      </Box>
    )}
    <Box
      sx={{
        p: 1.5,
        minHeight: 0,
        overflowY: 'auto',
        overscrollBehaviorY: 'contain',
      }}
    >
      {children}
    </Box>
    {actions && (
      <Box sx={{ p: 1.5, flexShrink: 0, borderTop: 1, borderColor: 'divider' }}>
        {actions}
      </Box>
    )}
  </Popover>
);

export default AppPopover;
