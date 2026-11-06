'use client';

import AppErrorState from '@/base/components/ui/AppErrorState';

import { AppLoadingState, AppButton, AppCard, AppSectionHeader } from '@/base/components/ui';

import { useState } from 'react';
import Link from 'next/link';
import { Stack } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useTranslations } from 'next-intl';

import useTripPlan from '@/features/plan/hooks/useTripPlan';
import useDayActivities from '@/features/plan/hooks/useDayActivities';
import ActivityTimelineCard from '@/features/plan/components/ActivityTimelineCard';
import PlanDayTabs from '@/features/plan/components/PlanDayTabs';
import PlanEmptyState from '@/features/plan/components/PlanEmptyState';
import type { Trip } from '../../types';

const TripItineraryPreview = ({ trip }: { trip: Trip }) => {
  const t = useTranslations('overview');
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
              size="medium"
              sx={{ minHeight: 44 }}
              endIcon={<ArrowForwardRoundedIcon />}
            >
              {t('openItinerary')}
            </AppButton>
          }
        />
        {isLoading || (isStale && !error) ? <AppLoadingState /> : error ? (
          <AppErrorState status={error.status} onRetry={() => refetch()} compact />
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
            {loadingActivities ? <AppLoadingState /> : activityError ? (
              <AppErrorState status={activityError.status} onRetry={() => retryActivities()} compact />
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
