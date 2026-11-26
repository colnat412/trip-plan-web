'use client';

import type { ReactNode } from 'react';
import { Box } from '@mui/material';

// Reserve the fading edge when fitting stops so markers remain easy to see.
const MAP_FADE_INSET = 72;

/** The map dissolves into the page canvas; the itinerary follows in normal document flow. */
interface PlanMapWorkspaceProps {
  map: (bottomInset: number) => ReactNode;
  navigation: ReactNode;
  children: ReactNode;
}

export default function PlanMapWorkspace({ map, navigation, children }: PlanMapWorkspaceProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 0 auto', minWidth: 0 }}>
      <Box sx={(theme) => ({
        position: 'relative', isolation: 'isolate', zIndex: 0, overflow: 'hidden',
        height: { xs: 'clamp(260px, 38dvh, 380px)', md: 420 }, flexShrink: 0,
        '&::after': {
          content: '""', position: 'absolute', insetInline: 0, bottom: 0, height: 96,
          zIndex: 2, pointerEvents: 'none',
          background: `linear-gradient(to bottom, transparent, var(--app-page-surface, ${(theme.vars?.palette ?? theme.palette).background.default}))`,
        },
        '@media (prefers-reduced-transparency: reduce), (forced-colors: active)': {
          '&::after': { display: 'none' },
        },
      })}>{map(MAP_FADE_INSET)}</Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2.5, md: 3 }, minWidth: 0 }}>
        {navigation}
        {children}
      </Box>
    </Box>
  );
}
