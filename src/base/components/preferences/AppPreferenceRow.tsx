'use client';

import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';

/** One geometry for settings controls and actionable settings rows. */
export default function AppPreferenceRow({ icon, label, children, color = 'text.primary', compact = false }: {
  icon: ReactNode;
  label: ReactNode;
  children?: ReactNode;
  color?: string;
  compact?: boolean;
}) {
  return <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', minWidth: 0, minHeight: compact ? 52 : 64, gap: compact ? 1.25 : 1.5, py: 0, color }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, flexShrink: 0, '& .MuiSvgIcon-root': { fontSize: 18 } }}>{icon}</Box>
    <Typography component="span" sx={{ flex: 1, minWidth: 0, fontSize: compact ? 15 : 14, fontWeight: 500, lineHeight: 1.5, textAlign: 'left', overflowWrap: 'anywhere', color: 'inherit' }}>{label}</Typography>
    {children && <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{children}</Box>}
  </Box>;
}
