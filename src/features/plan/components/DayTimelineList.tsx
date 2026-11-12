'use client';

import React from 'react';
import { Stack } from '@mui/material';
import { useLocale } from 'next-intl';

import { AppCard } from '@/base/components/ui';
import type { ActivityStatus, PlanActivity, RouteSegment } from '../types';
import ActivityTimelineCard from './ActivityTimelineCard';
import ActivityDistanceConnector from './ActivityDistanceConnector';
import PlanEmptyState from './PlanEmptyState';
import useDayRouteDistances from '../hooks/useDayRouteDistances';

export interface DayTimelineListProps {
  activities: PlanActivity[];
  currency: string;
  onImageSaved?: () => void;
  destinationContext?: string;
  onAddActivity?: () => void;
  onEditActivity?: (activity: PlanActivity) => void;
  onDeleteActivity?: (activity: PlanActivity) => void;
  onToggleStatus?: (activity: PlanActivity, nextStatus: ActivityStatus) => void;
  onConvertToExpense?: (activity: PlanActivity) => void;
  onChangeActivityTime?: (
    activity: PlanActivity,
    time: { startTime: string; endTime: string },
  ) => void;
  readOnly?: boolean;
  canDeleteActivity?: (activity: PlanActivity) => boolean;
}

const DayTimelineList = ({
  activities,
  currency,
  onImageSaved,
  destinationContext,
  onAddActivity,
  onEditActivity,
  onDeleteActivity,
  onToggleStatus,
  onConvertToExpense,
  onChangeActivityTime,
  readOnly = false,
  canDeleteActivity,
}: DayTimelineListProps) => {
  const locale = useLocale();
  const distanceData = useDayRouteDistances(
    activities,
    locale,
    destinationContext,
  );

  if (activities.length === 0) {
    return <PlanEmptyState onAddActivity={onAddActivity} readOnly={readOnly} />;
  }

  const segmentMap = new Map<string, RouteSegment>();
  (distanceData?.segments ?? []).forEach((seg) => {
    segmentMap.set(`${seg.fromActivityId}->${seg.toActivityId}`, seg);
  });

  return (
    <AppCard
      component="section"
      variant="transparent"
      sx={{
        width: '100%',
        minWidth: 0,
        p: 0,
        borderRadius: '20px',
      }}
      contentSx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        minWidth: 0,
      }}
    >
      <Stack spacing={0}>
        {activities.map((activity, idx) => {
          const nextActivity = activities[idx + 1];
          const hasLocationCurrent = Boolean(
            activity.location && activity.location.trim().length > 0,
          );
          const hasLocationNext = Boolean(
            nextActivity?.location && nextActivity.location.trim().length > 0,
          );

          const segment =
            nextActivity &&
            segmentMap.get(`${activity.id}->${nextActivity.id}`);

          return (
            <React.Fragment key={activity.id}>
              <ActivityTimelineCard
                activity={activity}
                onImageSaved={onImageSaved}
                hasNext={idx < activities.length - 1}
                currency={currency}
                onEdit={onEditActivity}
                onDelete={
                  canDeleteActivity?.(activity) === false
                    ? undefined
                    : onDeleteActivity
                }
                onToggleStatus={onToggleStatus}
                onConvertToExpense={onConvertToExpense}
                onChangeTime={onChangeActivityTime}
                readOnly={readOnly}
                order={idx + 1}
              />

              {nextActivity && hasLocationCurrent && hasLocationNext && (
                <ActivityDistanceConnector
                  originLocation={activity.location!}
                  destinationLocation={nextActivity.location!}
                  distance={segment?.distance}
                  duration={segment?.duration}
                  isEstimated={segment?.isEstimated}
                  source={segment?.source}
                />
              )}
            </React.Fragment>
          );
        })}
      </Stack>
    </AppCard>
  );
};

export default DayTimelineList;
