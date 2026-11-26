'use client';

import { useState } from 'react';
import { Box } from '@mui/material';
import { useTranslations } from 'next-intl';
import {
  AppLocationMap, AppLoadingIndicator, AppInteractiveMap,
} from '@/base/components/ui';
import usePlanMapStops from '../hooks/usePlanMapStops';
import type { PlanActivity } from '../types';



// Tâm mặc định (Việt Nam) chỉ dùng khi chưa có điểm nào; bản đồ được fitBounds ngay khi có điểm.
const DEFAULT_CENTER = { latitude: 16.05, longitude: 108.2 };

export interface PlanMapPanelProps {
  // Chỉ hoạt động của ngày đang chọn.
  activities: PlanActivity[];
  destination?: string;
  loadingActivities?: boolean;
  bottomInset?: number;
}

const PlanMapPanel = ({
  activities, destination = '', loadingActivities = false, bottomInset = 0,
}: PlanMapPanelProps) => {
  const t = useTranslations('plan.map');
  const [selectedId, setSelectedId] = useState('');
  const { stops, loading } = usePlanMapStops(
    loadingActivities ? [] : activities, destination,
  );
  const busy = loading || loadingActivities;

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

      </Box>
  );
};

export default PlanMapPanel;
