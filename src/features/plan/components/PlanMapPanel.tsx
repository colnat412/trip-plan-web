'use client';

import { useState } from 'react';
import { MenuItem, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import {
  AppButton,
  AppCard,
  AppLocationMap,
  AppSectionHeader,
  AppTextField,
} from '@/base/components/ui';
import type { PlanActivity } from '../types';

export interface PlanMapPanelProps {
  activities: PlanActivity[];
  destination?: string;
  currency?: string;
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
}

const PlanMapPanel = ({
  activities,
  destination = '',
  hasMore,
  loadingMore,
  onLoadMore,
}: PlanMapPanelProps) => {
  const t = useTranslations('plan.map');
  const [selectedId, setSelectedId] = useState('');
  const stops = activities.filter((activity) => activity.location?.trim());
  const selected =
    stops.find((activity) => String(activity.id) === selectedId) ?? stops[0];
  const location = selected?.location?.trim() || destination;

  return (
    <AppCard
      component="section"
      sx={{ p: { xs: 2, md: 3 }, borderRadius: '20px', minWidth: 0 }}
    >
      <Stack spacing={2.5}>
        <AppSectionHeader title={t('title')} />
        {stops.length > 0 && (
          <AppTextField
            select
            label={t('chooseStop')}
            value={String(selected?.id ?? '')}
            onChange={(event) => setSelectedId(event.target.value)}
          >
            {stops.map((activity) => (
              <MenuItem key={activity.id} value={String(activity.id)}>
                {activity.title}
              </MenuItem>
            ))}
          </AppTextField>
        )}
        <AppLocationMap location={location} expanded />
        {!stops.length && (
          <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
            {t('noStops')}
          </Typography>
        )}
        {hasMore && onLoadMore && (
          <AppButton
            intent="secondary"
            loading={loadingMore}
            onClick={onLoadMore}
          >
            {t('loadMore')}
          </AppButton>
        )}
      </Stack>
    </AppCard>
  );
};

export default PlanMapPanel;
