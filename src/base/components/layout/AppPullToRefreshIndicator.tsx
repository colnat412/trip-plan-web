'use client';

import { Box, Typography } from '@mui/material';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import { useTranslations } from 'next-intl';
import AppLoadingIndicator from '@/base/components/ui/AppLoadingIndicator';

interface AppPullToRefreshIndicatorProps {
  distance: number;
  ready: boolean;
  refreshing: boolean;
}

export default function AppPullToRefreshIndicator({ distance, ready, refreshing }: AppPullToRefreshIndicatorProps) {
  const t = useTranslations('pullToRefresh');
  return (
    <Box aria-hidden={distance === 0} sx={{
      height: distance, flexShrink: 0, overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
      bgcolor: 'var(--app-page-surface)', color: 'text.secondary',
      transition: distance === 0 || refreshing ? 'height 180ms ease' : 'none',
      '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
    }}>
      {distance > 0 && <>
        {refreshing ? <AppLoadingIndicator /> : <ArrowDownwardRoundedIcon aria-hidden="true" sx={{
          fontSize: 22, color: ready ? 'primary.main' : 'text.secondary',
          transform: ready ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 180ms ease',
          '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
        }} />}
        <Typography role="status" aria-live="polite" sx={{ fontSize: 12, fontWeight: 600 }}>
          {t(refreshing ? 'refreshing' : ready ? 'release' : 'pull')}
        </Typography>
      </>}
    </Box>
  );
}
