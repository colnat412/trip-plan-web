'use client';

import { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { AppButton, AppCard, AppLocationMap, AppSectionHeader } from '@/base/components/ui';
import type { PlanActivity } from '../types';
import ActivityTimelineCard from './ActivityTimelineCard';

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
  currency = 'VND',
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
        <AppSectionHeader title={t('title')} subtitle={t('description')} />
        <AppLocationMap location={location} />
        <Stack spacing={0}>
          {stops.map((activity, index) => (
            <ActivityTimelineCard
              key={activity.id}
              activity={activity}
              currency={currency}
              readOnly
              compact
              hasNext={index < stops.length - 1}
              selected={String(activity.id) === String(selected?.id)}
              onSelect={() => setSelectedId(String(activity.id))}
            />
          ))}
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
      </Stack>
    </AppCard>
  );
};

export default PlanMapPanel;
