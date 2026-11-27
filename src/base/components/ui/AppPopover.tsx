'use client';

import type { ReactNode, Ref } from 'react';
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
  contentMaxHeight?: number | string;
  contentRef?: Ref<HTMLDivElement>;
  surface?: 'glass' | 'solid';
}

const AppPopover = ({
  label,
  title,
  header,
  actions,
  width = 400,
  children,
  contentMaxHeight,
  contentRef,
  surface = 'glass',
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
          borderRadius: 'var(--app-radius-card)',
          border: 1,
          borderColor: 'divider',
          ...(surface === 'solid' && {
            bgcolor: 'background.paper',
            color: 'text.primary',
            backgroundImage: 'none',
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
            '@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))': {
              bgcolor: 'background.paper',
              backdropFilter: 'none',
              WebkitBackdropFilter: 'none',
            },
          }),
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
      ref={contentRef}
      sx={{
        p: 1.5,
        minHeight: 0,
        maxHeight: contentMaxHeight,
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
