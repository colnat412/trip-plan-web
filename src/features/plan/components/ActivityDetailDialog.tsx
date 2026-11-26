'use client';

import { Box, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { AppButton, AppCategoryChip, AppDialog, AppStatusChip } from '@/base/components/ui';
import { formatCurrency } from '@/base/utils';
import type { PlanActivity } from '../types';

export default function ActivityDetailDialog({ activity, currency, onClose, onEdit }: {
  activity: PlanActivity | null;
  currency: string;
  onClose: () => void;
  onEdit?: (activity: PlanActivity) => void;
}) {
  const t = useTranslations('plan');
  if (!activity) return null;
  const time = [activity.startTime, activity.endTime].filter(Boolean).map(value => value!.slice(0, 5)).join(' – ');
  const field = (label: string, value: string) => (
    <Stack spacing={0.5}>
      <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{label}</Typography>
      <Typography sx={{ fontSize: 14, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{value}</Typography>
    </Stack>
  );
  return (
    <AppDialog open onClose={onClose} title={t('activityDetail.title')} maxWidth="sm"
      actions={onEdit ? <AppButton intent="secondary" onClick={() => onEdit(activity)}>{t('dialog.editTitle')}</AppButton> : undefined}>
      <Stack spacing={2.5}>
        <Typography component="h2" sx={{ fontSize: 18, fontWeight: 600, overflowWrap: 'anywhere' }}>{activity.title}</Typography>
        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
          <AppCategoryChip category={activity.category} />
          <AppStatusChip label={t(`statuses.${activity.status}`)} tone={activity.status === 'COMPLETED' ? 'success' : activity.status === 'IN_PROGRESS' ? 'primary' : 'neutral'} />
        </Stack>
        {activity.imageUrl && <Box component="img" src={activity.imageUrl} alt={activity.title}
          sx={{ width: '100%', maxHeight: 320, objectFit: 'contain', borderRadius: 'var(--app-radius-small)' }} />}
        {time && field(t('dialog.timeRangeLabel'), time)}
        {activity.location && field(t('dialog.locationLabel'), activity.location)}
        {field(t('dialog.estimatedCostLabel'), formatCurrency(activity.estimatedCost, currency))}
        {field(t('activityDetail.actualSpent'), formatCurrency(activity.actualSpent ?? 0, currency))}
        {activity.note && field(t('dialog.noteLabel'), activity.note)}
      </Stack>
    </AppDialog>
  );
}
