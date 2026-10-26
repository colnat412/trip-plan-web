'use client';

import type { ReactNode } from 'react';
import { Box, ButtonBase, Stack, Typography } from '@mui/material';

export interface AppTimelineRowProps {
  icon: ReactNode;
  title: string;
  meta?: ReactNode;
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
      gap: 0.5,
    }}
  >
    <Box
      component={onSelect ? ButtonBase : 'div'}
      onClick={onSelect}
      aria-pressed={onSelect ? selected : undefined}
      sx={{
        display: 'flex',
        alignItems: 'stretch',
        gap: 1.5,
        flex: 1,
        minWidth: 0,
        textAlign: 'left',
        borderRadius: '12px',
        px: onSelect ? 1 : 0,
        bgcolor: selected ? 'action.selected' : 'transparent',
        outline: selected ? '1px solid' : undefined,
        outlineColor: selected ? 'primary.main' : undefined,
        outlineOffset: -1,
        color: 'text.primary',
        '&:hover': onSelect ? { bgcolor: 'action.hover' } : undefined,
        '&.Mui-focusVisible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: -2,
        },
      }}
    >
      <Stack
        spacing={1}
        useFlexGap
        sx={{ width: 40, flexShrink: 0, alignItems: 'center', pt: 1.5 }}
      >
        {icon}
        {hasNext && (
          <Box
            aria-hidden="true"
            sx={{ width: 2, flex: 1, minHeight: 12, bgcolor: 'divider' }}
          />
        )}
      </Stack>
      <Stack
        spacing={0.75}
        sx={{
          flex: 1,
          minWidth: 0,
          py: 1.5,
          borderBottom: hasNext ? 1 : 0,
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 1.5,
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
          {meta && <Box sx={{ flexShrink: 0 }}>{meta}</Box>}
        </Box>
        {children}
      </Stack>
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
);

export default AppTimelineRow;
