'use client';

import { Box, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useMapLocation } from '@/base/hooks';
import AppButton from './AppButton';
import AppInteractiveMap from './AppInteractiveMap';
import AppLoadingState from './AppLoadingState';

export interface AppLocationMapProps {
  location: string;
  expanded?: boolean;
}

const AppLocationMap = ({ location, expanded = false }: AppLocationMapProps) => {
  const t = useTranslations('locationMap');
  const mapText = useTranslations('interactiveMap');
  const query = location.trim();
  const result = useMapLocation(query);
  return <Stack spacing={1.5} sx={{ minWidth: 0 }}>
    <Box sx={{ width: '100%', height: expanded ? { xs: '60dvh', lg: '65dvh' } : { xs: 320, lg: 400 },
      minHeight: expanded ? 360 : undefined, borderRadius: 'var(--app-radius-card)',
      bgcolor: 'action.hover', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {!query ? <Stack sx={{ flex: 1, alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <Typography color="text.secondary">{t('empty')}</Typography>
      </Stack> : result.loading ? <AppLoadingState local />
        : result.location ? <AppInteractiveMap key={query} coordinates={result.location.coordinates} title={t('title', { location: query })} />
          : <Stack spacing={2} role="status" sx={{ flex: 1, alignItems: 'center', justifyContent: 'center', p: 2 }}>
            <Typography color="text.secondary">{t('unavailable')}</Typography>
            <AppButton intent="secondary" onClick={() => { void result.refetch().catch(() => undefined); }}>{mapText('retry')}</AppButton>
          </Stack>}
    </Box>
    {query && <Typography sx={{ fontSize: 13, color: 'text.secondary', overflowWrap: 'anywhere' }}>{query}</Typography>}
  </Stack>;
};

export default AppLocationMap;
