'use client';

import { useState } from 'react';
import { Box } from '@mui/material';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import { useTranslations } from 'next-intl';
import {
  AppButton, AppCard, AppLocationMap, AppLoadingIndicator, AppInteractiveMap,
} from '@/base/components/ui';
import { getGoogleMapsRouteUrl } from '@/base/utils/maps';
import usePlanMapStops from '../hooks/usePlanMapStops';
import type { PlanActivity } from '../types';

export interface PlanMapPanelProps {
  // Chỉ hoạt động của ngày đang chọn.
  activities: PlanActivity[];
  destination?: string;
  loadingActivities?: boolean;
}

// Tâm mặc định (Việt Nam) chỉ dùng khi chưa có điểm nào; bản đồ được fitBounds ngay khi có điểm.
const DEFAULT_CENTER = { latitude: 16.05, longitude: 108.2 };

const PlanMapPanel = ({
  activities, destination = '', loadingActivities = false,
}: PlanMapPanelProps) => {
  const t = useTranslations('plan.map');
  const [selectedId, setSelectedId] = useState('');
  const { stops, loading } = usePlanMapStops(
    loadingActivities ? [] : activities, destination,
  );
  const busy = loading || loadingActivities;
  // Cùng quy tắc thêm ngữ cảnh điểm đến như usePlanMapStops để Google Maps tìm đúng địa điểm.
  const routeUrl = getGoogleMapsRouteUrl(activities.flatMap(({ location }) => {
    const address = location?.trim() ?? '';
    const context = destination.trim();
    if (!address) return [];
    return context && !address.includes(',') &&
      !address.toLocaleLowerCase().includes(context.toLocaleLowerCase())
      ? [`${address}, ${context}`] : [address];
  }));

  return (
    <AppCard component="section" sx={{ p: 0, borderRadius: '20px', minWidth: 0, overflow: 'hidden' }}>
      <Box aria-busy={busy} sx={{
        position: 'relative', width: '100%',
        height: { xs: 'clamp(280px, 40dvh, 420px)', md: 440 },
        bgcolor: 'action.hover', overflow: 'hidden',
      }}>
        {/* Một bản đồ duy nhất luôn mounted: đổi ngày chỉ đổi điểm dừng và tự zoom vừa các điểm. */}
        <AppInteractiveMap coordinates={stops[0]?.coordinates ?? DEFAULT_CENTER} title={t('title')}
          stops={stops} selectedId={selectedId} onSelectStop={setSelectedId} />
        {busy ? (
          <Box sx={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
            justifyContent: 'center', pointerEvents: 'none',
          }}>
            <AppLoadingIndicator />
          </Box>
        ) : stops.length === 0 && (
          <Box sx={{ position: 'absolute', inset: 0, p: 2, overflow: 'auto', bgcolor: 'background.paper' }}>
            <AppLocationMap location={destination} />
          </Box>
        )}
        {routeUrl && stops.length > 0 && (
          <AppButton component="a" intent="secondary" href={routeUrl} target="_blank"
            rel="noopener noreferrer" startIcon={<MapRoundedIcon />}
            sx={{ position: 'absolute', right: 12, bottom: 12, zIndex: 1 }}>
            {t('openRoute')}
          </AppButton>
        )}
      </Box>
    </AppCard>
  );
};

export default PlanMapPanel;
