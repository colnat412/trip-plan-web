'use client';

import { Box, Stack, Typography } from '@mui/material';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import { useTranslations } from 'next-intl';
import { formatDate } from '@/base/utils';
import type { PlanActivity } from '@/features/plan/types';

/** Three short lines for a read-only glance at the next activity. */
export default function UpcomingActivitySummary({ activity, date }: { activity: PlanActivity; date: string }) {
  const t = useTranslations('overview.nextActivity');
  const time = [activity.startTime, activity.endTime].filter(Boolean).map(value => value!.slice(0, 5)).join(' – ');

  return (
      <Stack spacing={0.5} sx={{ minWidth: 0 }}>
        <Stack direction="row" sx={{ alignItems: 'baseline', justifyContent: 'space-between', gap: 1, minWidth: 0 }}>
          <Typography noWrap sx={{ minWidth: 0, fontSize: '12px', fontWeight: 600, color: 'primary.main', fontVariantNumeric: 'tabular-nums' }}>
            {activity.startTime ? time : t('unscheduled')}
          </Typography>
          <Typography title={formatDate(date)} sx={{ flexShrink: 0, fontSize: '12px', color: 'text.secondary' }}>{formatDate(date, 'DD/MM')}</Typography>
        </Stack>
        <Typography noWrap title={activity.title} sx={{ fontSize: '14px', fontWeight: 600, lineHeight: 1.5 }}>
          {activity.title}
        </Typography>
        {activity.location && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0, color: 'text.secondary' }}>
            <PlaceRoundedIcon sx={{ fontSize: 14, flexShrink: 0 }} />
            <Typography noWrap title={activity.location} sx={{ minWidth: 0, fontSize: '12px', lineHeight: 1.5 }}>
              {activity.location}
            </Typography>
          </Box>
        )}
      </Stack>
  );
}
