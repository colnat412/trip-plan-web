'use client';

import React, { useState, useEffect } from 'react';
import { Stack } from '@mui/material';
import { useLocale } from 'next-intl';

import { AppCard } from '@/base/components/ui';
import type { ActivityStatus, PlanActivity, RouteSegment } from '../types';
import ActivityTimelineCard from './ActivityTimelineCard';
import ActivityDistanceConnector from './ActivityDistanceConnector';
import PlanEmptyState from './PlanEmptyState';
import { getConsecutiveDistances } from '../services/googleMapsService';

export interface DayTimelineListProps {
  activities: PlanActivity[];
  currency: string;
  destinationContext?: string;
  onAddActivity?: () => void;
  onEditActivity?: (activity: PlanActivity) => void;
  onDeleteActivity?: (activity: PlanActivity) => void;
  onToggleStatus?: (activity: PlanActivity, nextStatus: ActivityStatus) => void;
  onConvertToExpense?: (activity: PlanActivity) => void;
  onOpenOptimizeRoute?: () => void;
  readOnly?: boolean;
  canDeleteActivity?: (activity: PlanActivity) => boolean;
}

const DayTimelineList = ({
  activities,
  currency,
  destinationContext,
  onAddActivity,
  onEditActivity,
  onDeleteActivity,
  onToggleStatus,
  onConvertToExpense,
  readOnly = false,
  canDeleteActivity,
}: DayTimelineListProps) => {
  const locale = useLocale();

  const [distanceData, setDistanceData] = useState<{
    segments: RouteSegment[];
    formattedTotalDistance: string;
    formattedTotalDuration: string;
    totalDistanceMeters: number;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;

    getConsecutiveDistances(
      activities,
      locale === 'en' ? 'en' : 'vi',
      destinationContext,
    )
      .then((data) => {
        if (isMounted) {
          setDistanceData(data);
        }
      })
      .catch((err) => {
        console.error('Failed to get consecutive distances:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [activities, locale, destinationContext]);

  if (activities.length === 0) {
    return <PlanEmptyState onAddActivity={onAddActivity} readOnly={readOnly} />;
  }

  const segmentMap = new Map<string, RouteSegment>();
  distanceData?.segments.forEach((seg) => {
    segmentMap.set(`${seg.fromActivityId}->${seg.toActivityId}`, seg);
  });

  return (
    <AppCard
      component="section"
      sx={{ width: '100%', minWidth: 0, p: { xs: 2, md: 3 }, borderRadius: '20px' }}
      contentSx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
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
                  readOnly={readOnly}
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
