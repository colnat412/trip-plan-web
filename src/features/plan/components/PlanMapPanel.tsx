'use client';

import { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import { useTranslations } from 'next-intl';
import { AppButton, AppCard, AppLocationMap } from '@/base/components/ui';
import type { PlanActivity } from '../types';

export interface PlanMapPanelProps {
  activities: PlanActivity[];
  destination?: string;
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
        <Stack spacing={0.5}>
          <Typography component="h2" sx={{ fontSize: '18px', fontWeight: 700 }}>
            {t('title')}
          </Typography>
          <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
            {t('description')}
          </Typography>
        </Stack>
        <AppLocationMap location={location} />
        <Stack spacing={1}>
          {stops.map((activity) => (
            <AppButton
              key={activity.id}
              intent="secondary"
              onClick={() => setSelectedId(String(activity.id))}
              aria-pressed={activity.id === selected?.id}
              startIcon={<PlaceRoundedIcon />}
              sx={{
                justifyContent: 'flex-start',
                textAlign: 'left',
                minWidth: 0,
                minHeight: 48,
                bgcolor:
                  activity.id === selected?.id
                    ? 'action.selected'
                    : 'transparent',
                borderColor:
                  activity.id === selected?.id ? 'primary.main' : 'divider',
              }}
            >
              <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                <Typography
                  component="span"
                  sx={{
                    fontSize: '13px',
                    fontWeight: 600,
                    overflowWrap: 'anywhere',
                  }}
                >
                  {activity.title}
                </Typography>
                {activity.startTime && (
                  <Typography
                    component="span"
                    sx={{ fontSize: '12px', color: 'text.secondary' }}
                  >
                    {activity.startTime.slice(0, 5)}
                  </Typography>
                )}
              </Stack>
            </AppButton>
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
