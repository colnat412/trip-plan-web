'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Box, Stack, Typography } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import {
  AppLoadingState,
  AppButton,
  AppCard,
  AppSectionHeader,
  AppSectionLink,
  AppEmptyState,
  AppErrorState,
  AppToast,
  type AppToastSeverity,
} from '@/base/components/ui';
import { useTranslations } from 'next-intl';
import { formatDate, getZonedDateTime } from '@/base/utils';
import useTripPlan from '@/features/plan/hooks/useTripPlan';
import { useCreateActivity } from '@/features/plan/hooks/usePlanMutation';
import {
  getUpcomingActivity,
  getSuggestedActivityDay,
} from '@/features/plan/utils/upcoming-activity';
import ActivityTimelineCard from '@/features/plan/components/ActivityTimelineCard';
import AddActivityDialog from '@/features/plan/components/AddActivityDialog';
import { useTripPermissions } from '../../hooks/useTripPermissions';
import { getTripTiming } from '../../utils/trip-timing';
import type { Trip } from '../../types';

interface TripItineraryPreviewProps {
  trip: Trip;
  now: Date | null;
}

const TripItineraryPreview = ({ trip, now }: TripItineraryPreviewProps) => {
  const t = useTranslations('overview.nextActivity');
  const tPlan = useTranslations('plan');
  const timing = now ? getTripTiming(trip, now) : null;
  const finished =
    timing?.phase === 'completed' || timing?.phase === 'cancelled';
  const { plan, isLoading, isStale, error, refetch } = useTripPlan({
    tripId: trip.id,
    includeActivities: true,
    enabled: Boolean(now) && !finished,
  });
  const { canWrite, canManage } = useTripPermissions(trip.id);
  const days = isStale ? [] : (plan?.days ?? []);
  const clock = now ? getZonedDateTime(now) : null;
  const next = clock ? getUpcomingActivity(days, clock.date, clock.time) : null;
  const targetDay = clock ? getSuggestedActivityDay(days, clock.date) : null;
  const empty = plan?.totalActivities === 0;
  const [addingDayId, setAddingDayId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    severity: AppToastSeverity;
  } | null>(null);
  const { createActivityAsync, isPending } = useCreateActivity({
    tripId: trip.id,
    dayId: addingDayId ?? targetDay?.id ?? '',
    options: {
      onSuccess: () => {
        setAddingDayId(null);
        setToast({
          message: tPlan('toasts.createActivitySuccess'),
          severity: 'success',
        });
        void refetch().catch(() => undefined);
      },
      onError: () =>
        setToast({ message: tPlan('toasts.error'), severity: 'error' }),
    },
  });
  const planHref = `/plan?tripId=${encodeURIComponent(String(trip.id))}${next ? `&dayId=${encodeURIComponent(next.day.id)}` : ''}`;
  const heading = finished
    ? t('summary')
    : timing?.phase === 'upcoming' && next
      ? t('first')
      : next?.kind === 'inProgress'
        ? t('inProgress')
        : next?.kind === 'scheduledNow'
          ? t('scheduledNow')
          : t('title');

  return (
    <>
      <AppCard
        component="section"
        sx={{
          p: { xs: 2, md: 3 },
          minWidth: 0,
          width: '100%',
          borderRadius: '20px',
        }}
      >
        <Stack spacing={2} sx={{ minWidth: 0 }}>
          <AppSectionHeader
            title={heading}
            actions={
              <AppSectionLink href={planHref}>{t('viewPlan')}</AppSectionLink>
            }
          />
          {finished ? (
            <AppEmptyState
              title={t(
                timing?.phase === 'cancelled' ? 'cancelled' : 'completed',
              )}
              icon={<EventAvailableRoundedIcon />}
              sx={{ py: 1 }}
              action={
                timing?.phase === 'completed' ? (
                  <AppSectionLink href="/settlement">
                    {t('viewSettlement')}
                  </AppSectionLink>
                ) : undefined
              }
            />
          ) : !now || isLoading || (isStale && !error) ? (
            <AppLoadingState />
          ) : error ? (
            <AppErrorState
              status={error.status}
              onRetry={() => refetch()}
              compact
            />
          ) : next ? (
            <Stack spacing={1} sx={{ minWidth: 0 }}>
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  flexWrap: 'wrap',
                  color: 'text.secondary',
                  minWidth: 0,
                }}
              >
                <Typography sx={{ fontSize: '13px' }}>
                  {formatDate(next.day.planDate)}
                </Typography>
                {next.kind === 'unscheduled' && (
                  <Typography sx={{ fontSize: '13px' }}>
                    {t('unscheduled')}
                  </Typography>
                )}
              </Box>
              <ActivityTimelineCard
                activity={next.activity}
                currency={trip.baseCurrency}
                readOnly
                compact
              />
            </Stack>
          ) : (
            <AppEmptyState
              title={t(empty ? 'emptyPlan' : 'nothingNext')}
              icon={<EventAvailableRoundedIcon />}
              sx={{
                p: 2,
                border: '1px dashed',
                borderColor: 'divider',
                borderRadius: '12px',
              }}
              action={
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    '& > .MuiButton-root': {
                      minHeight: 44,
                      minWidth: 0,
                    },
                    gap: 1,
                    minWidth: 0,
                    width: '100%',
                  }}
                >
                  {canWrite && targetDay && (
                    <AppButton
                      intent="primary"
                      wrapLabel
                      startIcon={<AddRoundedIcon />}
                      onClick={() => setAddingDayId(targetDay.id)}
                    >
                      {t('add')}
                    </AppButton>
                  )}
                  {canManage && empty && (
                    <AppButton
                      component={Link}
                      href={`${planHref}&ai=1`}
                      intent="text"
                      wrapLabel
                      startIcon={<AutoAwesomeRoundedIcon />}
                    >
                      {t('ai')}
                    </AppButton>
                  )}
                </Box>
              }
            />
          )}
        </Stack>
      </AppCard>
      {addingDayId &&
        canWrite &&
        days.some((day) => day.id === addingDayId) &&
        !finished && (
          <AddActivityDialog
            open
            onClose={() => setAddingDayId(null)}
            tripCurrency={trip.baseCurrency}
            planDate={days.find((day) => day.id === addingDayId)?.planDate}
            isLoading={isPending}
            onSubmit={(payload) => {
              void createActivityAsync(payload).catch(() => undefined);
            }}
          />
        )}
      <AppToast
        open={Boolean(toast)}
        message={toast?.message ?? ''}
        severity={toast?.severity ?? 'success'}
        onClose={() => setToast(null)}
      />
    </>
  );
};

export default TripItineraryPreview;
