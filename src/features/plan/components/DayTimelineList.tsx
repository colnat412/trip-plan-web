'use client';

import React, { useId, useRef, useState } from 'react';
import { Box, Stack } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import { DndContext, DragOverlay, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';

import type { ActivityStatus, PlanActivity, RouteSegment } from '../types';
import ActivityTimelineCard from './ActivityTimelineCard';
import ActivityDistanceConnector from './ActivityDistanceConnector';
import PlanEmptyState from './PlanEmptyState';
import useDayRouteDistances from '../hooks/useDayRouteDistances';
import SortableActivity from './SortableActivity';
import { applyActivityOrder, moveActivity } from '../utils/activity-order';

export interface DayTimelineListProps {
  activities: PlanActivity[];
  currency: string;
  onImageSaved?: () => void;
  destinationContext?: string;
  onAddActivity?: () => void;
  onViewActivity?: (activity: PlanActivity) => void;
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
  onReorder?: (activeId: string, overId: string) => Promise<void>;
}

const DayTimelineList = ({
  activities,
  currency,
  onImageSaved,
  destinationContext,
  onAddActivity,
  onViewActivity,
  onEditActivity,
  onDeleteActivity,
  onToggleStatus,
  onConvertToExpense,
  onChangeActivityTime,
  readOnly = false,
  canDeleteActivity,
  onReorder,
}: DayTimelineListProps) => {
  const locale = useLocale();
  const t = useTranslations('plan.reorder');
  const dndId = useId();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pendingOrder, setPendingOrder] = useState<string[] | null>(null);
  const [saving, setSaving] = useState(false);
  const inFlight = useRef(false);
  const displayed = applyActivityOrder(activities, pendingOrder);
  const enabled = !readOnly && Boolean(onReorder) && !saving && activities.length > 1;
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const dragged = displayed.find(activity => activity.id === activeId);
  const titleFor = (id: string | number) => displayed.find(activity => activity.id === String(id))?.title ?? '';
  const saveMove = async ({ active, over }: DragEndEvent) => {
    setActiveId(null);
    if (!enabled || !onReorder || !over || inFlight.current) return;
    const next = moveActivity(displayed, String(active.id), String(over.id));
    if (!next) return;
    inFlight.current = true;
    setSaving(true);
    setPendingOrder(next.map(activity => activity.id));
    try {
      await onReorder(String(active.id), String(over.id));
    } catch {
      // The parent reports the request error; restore the server's order.
    } finally {
      setPendingOrder(null);
      setSaving(false);
      inFlight.current = false;
    }
  };
  const distanceData = useDayRouteDistances(
    displayed,
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
    <DndContext
      id={dndId}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={({ active }) => setActiveId(String(active.id))}
      onDragCancel={() => setActiveId(null)}
      onDragEnd={event => void saveMove(event)}
      accessibility={{
        screenReaderInstructions: { draggable: t('instructions') },
        announcements: {
          onDragStart: ({ active }) => t('pickedUp', { title: titleFor(active.id) }),
          onDragOver: ({ active, over }) => over ? t('over', { title: titleFor(active.id), position: displayed.findIndex(item => item.id === String(over.id)) + 1 }) : undefined,
          onDragEnd: ({ active, over }) => over ? t('dropped', { title: titleFor(active.id), position: displayed.findIndex(item => item.id === String(over.id)) + 1 }) : t('cancelled'),
          onDragCancel: () => t('cancelled'),
        },
      }}
    >
    <Box
      component="section"
      aria-busy={saving || undefined}
      sx={{
        width: '100%',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <SortableContext items={displayed.map(activity => activity.id)} strategy={verticalListSortingStrategy}>
      <Stack
        spacing={0}
        sx={{
          // Keep the 28px marker; its center moves 6px left on mobile.
          '--app-timeline-rail-width': { xs: '16px', sm: '28px' },
          '--app-timeline-gap': { xs: '10px', sm: '8px' },
        }}
      >
        {displayed.map((activity, idx) => {
          const nextActivity = displayed[idx + 1];
          const hasLocationCurrent = Boolean(
            activity.location && activity.location.trim().length > 0,
          );
          const hasLocationNext = Boolean(
            nextActivity?.location && nextActivity.location.trim().length > 0,
          );

          const showConnector = Boolean(nextActivity && hasLocationCurrent && hasLocationNext);

          const segment =
            nextActivity &&
            segmentMap.get(`${activity.id}->${nextActivity.id}`);

          return (
            <SortableActivity key={activity.id} id={activity.id} label={t('handle', { title: activity.title })} disabled={!enabled} showHandle={!readOnly && Boolean(onReorder) && activities.length > 1}>
              {handle => <>
              <ActivityTimelineCard
                dragHandle={handle}
                activity={activity}
                onImageSaved={onImageSaved}
                hasNext={idx < displayed.length - 1}
                spacingAfter={showConnector ? 0 : 1.5}
                currency={currency}
                onSelect={onViewActivity && !saving ? () => onViewActivity(activity) : undefined}
                onEdit={onEditActivity}
                onDelete={
                  canDeleteActivity?.(activity) === false
                    ? undefined
                    : onDeleteActivity
                }
                onToggleStatus={onToggleStatus}
                onConvertToExpense={onConvertToExpense}
                onChangeTime={onChangeActivityTime}
                readOnly={readOnly || saving}
                order={idx + 1}
              />

              {nextActivity && showConnector && (
                <ActivityDistanceConnector
                  originLocation={activity.location!}
                  destinationLocation={nextActivity.location!}
                  distance={segment?.distance}
                  duration={segment?.duration}
                  isEstimated={segment?.isEstimated}
                  source={segment?.source}
                />
              )}
              </>}
            </SortableActivity>
          );
        })}
      </Stack>
      </SortableContext>
    </Box>
    <DragOverlay dropAnimation={null}>
      {dragged && <div aria-hidden="true"><ActivityTimelineCard activity={dragged} currency={currency} readOnly compact /></div>}
    </DragOverlay>
    </DndContext>
  );
};

export default DayTimelineList;
