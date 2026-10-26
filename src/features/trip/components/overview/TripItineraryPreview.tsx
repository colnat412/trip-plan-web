'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Alert, Skeleton, Stack } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useTranslations } from 'next-intl';
import { AppButton, AppCard, AppSectionHeader } from '@/base/components/ui';
import useTripPlan from '@/features/plan/hooks/useTripPlan';
import useDayActivities from '@/features/plan/hooks/useDayActivities';
import ActivityTimelineCard from '@/features/plan/components/ActivityTimelineCard';
import PlanDayTabs from '@/features/plan/components/PlanDayTabs';
import PlanEmptyState from '@/features/plan/components/PlanEmptyState';
import type { Trip } from '../../types';

const TripItineraryPreview = ({ trip }: { trip: Trip }) => {
  const t = useTranslations('overview');
  const tNav = useTranslations('navigation');
  const [selectedDayId, setSelectedDayId] = useState('');
  const { plan, isLoading, isStale, error, refetch } = useTripPlan({
    tripId: trip.id,
    includeActivities: false,
  });
  const dayId = isStale
    ? undefined
    : (plan?.days.find((day) => String(day.id) === selectedDayId)?.id ??
      plan?.days[0]?.id);
  const {
    activities,
    isLoading: loadingActivities,
    error: activityError,
    refetch: retryActivities,
  } = useDayActivities({ tripId: trip.id, dayId });

  return (
    <AppCard
      component="section"
      sx={{ p: { xs: 2, md: 3 }, borderRadius: '20px', minWidth: 0 }}
    >
      <Stack spacing={3} sx={{ minWidth: 0 }}>
        <AppSectionHeader
          title={t('yourItinerary')}
          subtitle={t('itineraryIntro')}
          actions={
            <AppButton
              component={Link}
              href="/plan"
              intent="text"
              size="small"
              sx={{ px: 0, fontSize: '13px' }}
              endIcon={<ArrowForwardRoundedIcon />}
            >
              {t('openItinerary')}
            </AppButton>
          }
        />
        {isLoading || (isStale && !error) ? (
          <Skeleton variant="rounded" height={280} />
        ) : error ? (
          <Alert
            severity="error"
            action={
              <AppButton
                intent="text"
                onClick={() => void refetch().catch(() => undefined)}
              >
                {tNav('retry')}
              </AppButton>
            }
          >
            {t('itineraryError')}
          </Alert>
        ) : (
          <>
            {plan?.days && plan.days.length > 0 && (
              <PlanDayTabs
                days={plan.days}
                selectedDayId={String(dayId ?? '')}
                currency={trip.baseCurrency}
                onSelectDay={setSelectedDayId}
              />
            )}
            {loadingActivities ? (
              <Skeleton variant="rounded" height={220} />
            ) : activityError ? (
              <Alert
                severity="error"
                action={
                  <AppButton
                    intent="text"
                    onClick={() => void retryActivities()}
                  >
                    {tNav('retry')}
                  </AppButton>
                }
              >
                {t('itineraryError')}
              </Alert>
            ) : activities.length ? (
              <Stack spacing={0}>
                {activities.slice(0, 3).map((activity, index) => (
                  <ActivityTimelineCard
                    key={activity.id}
                    activity={activity}
                    hasNext={index < Math.min(activities.length, 3) - 1}
                    currency={trip.baseCurrency}
                    readOnly
                  />
                ))}
              </Stack>
            ) : (
              <PlanEmptyState readOnly />
            )}
          </>
        )}
      </Stack>
    </AppCard>
  );
};

export default TripItineraryPreview;
