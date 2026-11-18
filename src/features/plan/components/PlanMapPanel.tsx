'use client';

import { useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import { useTranslations } from 'next-intl';
import {
  AppLocationMap, AppLoadingIndicator, AppInteractiveMap,
} from '@/base/components/ui';
import { getGoogleMapsRouteUrl } from '@/base/utils/maps';
import usePlanMapStops from '../hooks/usePlanMapStops';
import type { PlanActivity } from '../types';

export interface PlanMapPanelProps {
  // Chỉ hoạt động của ngày đang chọn.
  activities: PlanActivity[];
  destination?: string;
  loadingActivities?: boolean;
  bottomInset?: number;
}

// Tâm mặc định (Việt Nam) chỉ dùng khi chưa có điểm nào; bản đồ được fitBounds ngay khi có điểm.
const DEFAULT_CENTER = { latitude: 16.05, longitude: 108.2 };

const PlanMapPanel = ({
  activities, destination = '', loadingActivities = false, bottomInset = 0,
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
      <Box component="section" aria-busy={busy} sx={{
        position: 'relative', width: '100%',
        height: '100%', minWidth: 0,
        bgcolor: 'action.hover', overflow: 'hidden',
      }}>
        {/* Một bản đồ duy nhất luôn mounted: đổi ngày chỉ đổi điểm dừng và tự zoom vừa các điểm. */}
        <AppInteractiveMap coordinates={stops[0]?.coordinates ?? DEFAULT_CENTER} title={t('title')}
          stops={stops} selectedId={selectedId} onSelectStop={setSelectedId} bottomInset={bottomInset} />
        {busy ? (
          <Box sx={{
            position: 'absolute', inset: 0, bottom: bottomInset, display: 'flex', alignItems: 'center',
            justifyContent: 'center', pointerEvents: 'none',
          }}>
            <AppLoadingIndicator />
          </Box>
        ) : stops.length === 0 && (
          <Box sx={{ position: 'absolute', inset: 0, bottom: bottomInset, overflow: 'auto', bgcolor: 'background.paper' }}>
            <AppLocationMap location={destination} />
          </Box>
        )}
        {routeUrl && stops.length > 0 && (
          <Tooltip title={t('openRoute')}>
            <IconButton component="a" href={routeUrl} target="_blank" rel="noopener noreferrer"
              aria-label={t('openRoute')}
              sx={{ position: 'absolute', left: 4, top: 4, zIndex: 1,
                width: 44, height: 44, p: 0, color: 'text.primary', bgcolor: 'transparent',
                borderRadius: 'var(--app-radius-control)',
                '&:hover': { bgcolor: 'transparent', color: 'primary.main',
                  '& .plan-map-route-icon': { borderColor: 'primary.main' } },
                '&:active': { bgcolor: 'transparent', color: 'primary.main' },
                '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: -2 },
              }}>
              <Box component="span" className="plan-map-route-icon" sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32,
                flexShrink: 0, bgcolor: 'background.paper', border: 1, borderColor: 'divider',
                borderRadius: 'var(--app-radius-small)', boxShadow: 1,
              }}>
                <MapRoundedIcon sx={{ fontSize: 20 }} />
              </Box>
            </IconButton>
          </Tooltip>
        )}
      </Box>
  );
};

export default PlanMapPanel;
