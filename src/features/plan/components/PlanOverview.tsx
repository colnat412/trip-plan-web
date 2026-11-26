'use client';

import AppErrorState from '@/base/components/ui/AppErrorState';

import {
  AppLoadingState,
  AppFloatingActionButton,
  AppPageContainer,
  AppEmptyState,
  AppToast,
  AppConfirmDialog,
  AppInfiniteScrollTrigger,
  type AppToastSeverity,
} from '@/base/components/ui';

import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { useTranslations } from 'next-intl';

import { useCreateExpense } from '@/features/expense/hooks/useExpenseMutation';

import { useTripContext } from '@/features/trip/context/TripContext';
import { useTripPermissions } from '@/features/trip/hooks/useTripPermissions';
import AddExpenseDialog from '@/features/expense/components/AddExpenseDialog';
import { normalizeTripCategory } from '@/base/constants';
import type { CreateExpensePayload } from '@/features/expense/types';
import UseTemplateButton from '@/features/plan-template/components/UseTemplateButton';
import PublishTemplateDialog from '@/features/plan-template/components/PublishTemplateDialog';
import ShareTripDialog from '@/features/trip/components/ShareTripDialog';
import { TRIP_SHARING_ENABLED } from '@/features/trip/constants/trip-features';
import useTripPlan from '../hooks/useTripPlan';
import useDayActivities from '../hooks/useDayActivities';
import {
  useUpdateActivityStatus,
  useUpdateActivityTime,
  useToggleChecklist,
  useDeleteChecklist,
  useReorderDayActivities,
  useCreateActivity,
  useCreateChecklist,
  useDeleteActivity,
  useUpdateActivity,
  useResetDayActivities,
} from '../hooks/usePlanMutation';
import type {
  ActivityStatus,
  CreateActivityPayload,
  CreateChecklistPayload,
  PlanActivity,
  PlanChecklist,
  UpdateActivityPayload,
} from '../types';
import AddActivityDialog from './AddActivityDialog';
import ChecklistDialog from './ChecklistDialog';
import DayTimelineList from './DayTimelineList';
import DeleteActivityDialog from './DeleteActivityDialog';
import EditActivityDialog from './EditActivityDialog';
import ActivityDetailDialog from './ActivityDetailDialog';
import OptimizeRouteDialog from './OptimizeRouteDialog';
import PlanDayTabs from './PlanDayTabs';
import PlanDayToolbar from './PlanDayToolbar';
import PlanHeader from './PlanHeader';
import ActivityLogDialog from './ActivityLogDialog';
import AiPlannerDialog from './AiPlannerDialog';
import PlanMapPanel from './PlanMapPanel';
import PlanMapWorkspace from './PlanMapWorkspace';
import { useRouter } from 'next/navigation';
import { saveActivityMove } from '../utils/activity-order';



interface PlanOverviewTimeParams { startTime: string; endTime: string }

interface PlanOverviewProps {
  initialDayId?: string;
  initialAiOpen?: boolean;
  initialPublishOpen?: boolean;
}

const PlanOverview = ({
  initialDayId = '',
  initialAiOpen = false,
  initialPublishOpen = false,
}: PlanOverviewProps) => {
  const t = useTranslations('plan');
  const {
    activeTrip,
    error: tripError,
    refetchTrips,
    isLoading: tripLoading,
  } = useTripContext();
  const tripId = activeTrip?.id;
  const router = useRouter();
  // only get selected day
  const {
    plan: overview,
    isLoading,
    isStale,
    error: planError,
    refetch,
  } = useTripPlan({ tripId, includeActivities: false });
  const { members, role, canWrite, canManage, canManageRecord } =
    useTripPermissions(tripId);

  const [selectedDayId, setSelectedDayId] = useState<string>(initialDayId);
  const [addActivityOpen, setAddActivityOpen] = useState(false);
  const [aiPlannerOpen, setAiPlannerOpen] = useState(initialAiOpen);
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [resetDayConfirmOpen, setResetDayConfirmOpen] = useState(false);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const savingOrder = useRef(false);
  const orderContext = useRef('');
  const openingRoute = useRef(false);
  const [optimizeDialogOpen, setOptimizeDialogOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(initialPublishOpen);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [activityLogOpen, setActivityLogOpen] = useState(false);
  const [viewingActivity, setViewingActivity] = useState<PlanActivity | null>(null);
  const [editingActivity, setEditingActivity] = useState<PlanActivity | null>(
    null,
  );
  const [deletingActivity, setDeletingActivity] = useState<PlanActivity | null>(
    null,
  );
  const [convertExpenseActivity, setConvertExpenseActivity] =
    useState<PlanActivity | null>(null);

  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: AppToastSeverity;
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showToast = (
    message: string,
    severity: AppToastSeverity = 'success',
  ) => {
    setToast({ open: true, message, severity });
  };

  const days = isStale ? [] : (overview?.days ?? []);
  const activeDayId =
    selectedDayId && days.some((d) => String(d.id) === String(selectedDayId))
      ? selectedDayId
      : days[0]?.id
        ? String(days[0].id)
        : '';

  const selectedDay =
    days.find((d) => String(d.id) === String(activeDayId)) ?? days[0] ?? null;

  useEffect(() => {
    orderContext.current = canWrite ? `${tripId}:${selectedDay?.id}` : '';
    return () => { orderContext.current = ''; };
  }, [tripId, selectedDay?.id, canWrite]);

  const {
    activities: dayActivities,
    isLoading: isLoadingActivities,
    error: activitiesError,
    hasNextPage: hasMoreActivities,
    isFetchingNextPage: isFetchingMoreActivities,
    fetchNextPage: fetchMoreActivities,
    fetchAllPages: fetchAllDayActivities,
    refetch: refetchDayActivities,
  } = useDayActivities({ tripId, dayId: selectedDay?.id });

  if (viewingActivity && (viewingActivity.tripId !== String(tripId) || viewingActivity.dayId !== String(selectedDay?.id))) {
    setViewingActivity(null);
  }
  const detailActivity = viewingActivity?.tripId === String(tripId) && viewingActivity?.dayId === String(selectedDay?.id)
    ? dayActivities.find(activity => activity.id === viewingActivity.id) ?? null : null;

  const refreshPlan = () =>
    Promise.allSettled([
      refetch(),
      ...(selectedDay ? [refetchDayActivities()] : []),
    ]);

  const handleOpenOptimizeRoute = async () => {
    if (openingRoute.current || savingOrder.current) return;
    openingRoute.current = true;
    setIsLoadingRoute(true);
    try {
      await fetchAllDayActivities();
      setOptimizeDialogOpen(true);
    } catch {
      showToast(t('toasts.error'), 'error');
    } finally {
      openingRoute.current = false;
      setIsLoadingRoute(false);
    }
  };

  const { createActivityAsync, isPending: isCreatingActivity } =
    useCreateActivity({
      tripId: tripId ?? '',
      dayId: selectedDay?.id ?? '',
      options: {
        onSuccess: () => {
          showToast(t('toasts.createActivitySuccess'));
          setAddActivityOpen(false);
          refreshPlan();
        },
        onError: () => {
          showToast(t('toasts.error'), 'error');
        },
      },
    });

  const { updateActivityAsync, isPending: isUpdatingActivity } =
    useUpdateActivity({
      tripId: tripId ?? '',
      activityId: editingActivity?.id ?? '',
      options: {
        onSuccess: () => {
          showToast(t('toasts.updateActivitySuccess'));
          setEditingActivity(null);
          refreshPlan();
        },
      },
    });

  const { deleteActivityAsync, isPending: isDeletingActivity } =
    useDeleteActivity({
      tripId: tripId ?? '',
      activityId: deletingActivity?.id ?? '',
      options: {
        onSuccess: () => {
          showToast(t('toasts.deleteActivitySuccess'));
          setDeletingActivity(null);
          refreshPlan();
        },
        onError: () => {
          showToast(t('toasts.error'), 'error');
        },
      },
    });

  const { resetDayActivitiesAsync, isPending: isResettingDay } =
    useResetDayActivities({
      tripId: tripId ?? '',
      dayId: selectedDay?.id ?? '',
      options: {
        onSuccess: () => {
          showToast(t('toasts.resetDaySuccess'));
          setResetDayConfirmOpen(false);
          refreshPlan();
        },
        onError: () => {
          showToast(t('toasts.error'), 'error');
        },
      },
    });

  const { createChecklistAsync, isPending: isCreatingChecklist } =
    useCreateChecklist({
      tripId: tripId ?? '',
      options: {
        onSuccess: () => {
          showToast(t('toasts.createChecklistSuccess'));
          refreshPlan();
        },
        onError: () => {
          showToast(t('toasts.error'), 'error');
        },
      },
    });

  const mutationError = () => showToast(t('toasts.error'), 'error');
  const { updateStatus, isPending: isUpdatingStatus } = useUpdateActivityStatus({
    tripId: tripId ?? '',
    options: {
      onSuccess: () => {
        showToast(t('toasts.statusUpdateSuccess'));
        void refreshPlan();
      },
      onError: mutationError,
    },
  });
  const { updateTime } = useUpdateActivityTime({
    tripId: tripId ?? '',
    options: {
      onSuccess: () => {
        showToast(t('toasts.updateActivitySuccess'));
        void refreshPlan();
      },
      onError: mutationError,
    },
  });
  // Máy chủ ghi đè tiêu đề, giờ, địa chỉ, ghi chú nên gửi lại đủ các trường hiện có.
  const handleChangeActivityTime = (
    activity: PlanActivity,
    time: PlanOverviewTimeParams,
  ) =>
    updateTime({
      activityId: activity.id,
      payload: {
        title: activity.title,
        category: activity.category,
        status: activity.status,
        location: activity.location ?? undefined,
        estimatedCost: activity.estimatedCost,
        note: activity.note ?? undefined,
        startTime: time.startTime || undefined,
        endTime: time.endTime || undefined,
      },
    });
  const { toggleChecklist, isPending: isTogglingChecklist } = useToggleChecklist({
    tripId: tripId ?? '',
    options: {
      onSuccess: () => { void refreshPlan(); },
      onError: mutationError,
    },
  });
  const { deleteChecklist, isPending: isDeletingChecklist } = useDeleteChecklist({
    tripId: tripId ?? '',
    options: {
      onSuccess: () => {
        showToast(t('toasts.deleteChecklistSuccess'));
        void refreshPlan();
      },
      onError: mutationError,
    },
  });
  const { createExpense, isPending: isCreatingConvertedExpense } = useCreateExpense({
    tripId: tripId ?? '',
    options: {
      onSuccess: () => {
        showToast(t('toasts.updateActivitySuccess'));
        setConvertExpenseActivity(null);
        void refreshPlan();
      },
      onError: mutationError,
    },
  });
  const { reorderActivitiesAsync } = useReorderDayActivities({
    tripId: tripId ?? '',
    dayId: selectedDay?.id ?? '',
    options: {
      onSuccess: () => {
        showToast(t('toasts.optimizeSuccess'));
        void refreshPlan();
      },
      onError: mutationError,
    },
  });
  const handleApplyOptimizedRoute = async (activities: PlanActivity[]) => {
    await reorderActivitiesAsync({
      activityIds: activities.map((activity) => activity.id),
    });
  };

  const { reorderActivitiesAsync: saveManualOrder } = useReorderDayActivities({
    tripId: tripId ?? '',
    dayId: selectedDay?.id ?? '',
  });
  const handleReorderActivities = async (activeId: string, overId: string) => {
    if (!canWrite || !selectedDay || savingOrder.current || openingRoute.current || optimizeDialogOpen) return;
    const context = `${tripId}:${selectedDay.id}`;
    savingOrder.current = true;
    setIsSavingOrder(true);
    try {
      // The server requires the complete day, including activities not yet scrolled into view.
      const changed = await saveActivityMove({
        loadCompleteDay: fetchAllDayActivities,
        saveOrder: activityIds => saveManualOrder({ activityIds }),
        isCurrent: () => orderContext.current === context,
        activeId,
        overId,
      });
      if (!changed || orderContext.current !== context) return;
      await refreshPlan();
      if (orderContext.current === context) showToast(t('toasts.reorderSuccess'));
    } catch (error) {
      if (orderContext.current === context) {
        mutationError();
        await refreshPlan();
      }
      throw error;
    } finally {
      savingOrder.current = false;
      setIsSavingOrder(false);
    }
  };

  if (tripError || planError) {
    return (
      <AppPageContainer embedded>
        <AppErrorState
          status={(tripError ?? planError)?.status}
          onRetry={() => (tripError ? refetchTrips() : refetch())}
        />
      </AppPageContainer>
    );
  }
  if (tripLoading)
    return (
      <AppPageContainer embedded>
        <AppLoadingState />
      </AppPageContainer>
    );

  if (!tripId) {
    return (
      <AppPageContainer
        embedded
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AppEmptyState title={t('noActiveTrip')} action={<UseTemplateButton />} />
      </AppPageContainer>
    );
  }

  return (
    <AppPageContainer embedded sx={{ gap: 0 }} floatingAction={canWrite && selectedDay && !isLoading && !isStale && !planError && !activitiesError ? (
      <AppFloatingActionButton label={t('addActivity')} onClick={() => setAddActivityOpen(true)} />
    ) : undefined}>
      <PlanMapWorkspace
        map={(bottomInset) => !isLoading && !isStale && !planError && !activitiesError && selectedDay ? (
          <PlanMapPanel key={`plan-map:${tripId}`} activities={dayActivities}
            loadingActivities={isLoadingActivities} destination={activeTrip.destination} bottomInset={bottomInset} />
        ) : null}
        navigation={!isLoading && !isStale && !planError && days.length > 0 ? (
          <PlanDayTabs days={days} selectedDayId={activeDayId}
            currency={overview?.baseCurrency ?? activeTrip?.baseCurrency ?? 'VND'}
            onSelectDay={(dayId) => setSelectedDayId(dayId)} />
        ) : null}
      >
      {isLoading || (isStale && !planError) ? null : !planError ? (
        <PlanHeader
          totalDays={overview?.totalDays ?? overview?.days.length ?? 0}
          totalActivities={overview?.totalActivities ?? 0}
          completedActivities={overview?.completedActivities ?? 0}
          totalEstimatedCost={overview?.totalEstimatedCost ?? 0}
          currency={overview?.baseCurrency ?? activeTrip?.baseCurrency ?? 'VND'}
          onOpenChecklist={() => setChecklistOpen(true)}
          onOpenAiPlanner={canManage ? () => setAiPlannerOpen(true) : undefined}
          onPublishTemplate={
            role === 'OWNER' ? () => setPublishOpen(true) : undefined
          }
          onOpenShare={
            TRIP_SHARING_ENABLED && canManage
              ? () => setShareDialogOpen(true)
              : undefined
          }
          onOpenActivityLogs={() => setActivityLogOpen(true)}
          readOnly={!canWrite || Boolean(planError)}
          onOpenExport={() =>
            router.push(`/export/plan/${encodeURIComponent(String(tripId))}`)
          }
        />
      ) : null}

      {!isLoading && !isStale && !planError && selectedDay && (
        <PlanDayToolbar
          day={selectedDay}
          currency={overview?.baseCurrency ?? activeTrip.baseCurrency}
          onOptimizeRoute={canWrite ? () => void handleOpenOptimizeRoute() : undefined}
          isLoadingRoute={isLoadingRoute || isSavingOrder}
          onResetDay={
            canManage ? () => setResetDayConfirmOpen(true) : undefined
          }
        />
      )}
      {activitiesError ? (
        <AppErrorState
          status={activitiesError.status}
          onRetry={() => refetchDayActivities()}
        />
      ) : (
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            flex: 1,
            gap: { xs: 2, md: 3 },
          }}
        >
          <Box
            sx={{
              width: '100%',
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
            }}
          >
            {isLoading || (isStale && !planError) || isLoadingActivities ? (
              <AppLoadingState sx={{ flex: 1 }} />
            ) : (
              <DayTimelineList
                key={`${tripId}:${selectedDay?.id}`}
                activities={dayActivities}
                onReorder={canWrite && !isLoadingRoute && !optimizeDialogOpen && !planError ? handleReorderActivities : undefined}
                currency={
                  overview?.baseCurrency ?? activeTrip?.baseCurrency ?? 'VND'
                }
                destinationContext={activeTrip?.destination}
                onViewActivity={setViewingActivity}
                onEditActivity={(activity) => setEditingActivity(activity)}
                canDeleteActivity={(activity) =>
                  canManageRecord(activity.createdBy)
                }
                onDeleteActivity={(activity) => setDeletingActivity(activity)}
                onToggleStatus={
                  isUpdatingStatus ? undefined : (activity: PlanActivity, status: ActivityStatus) =>
                    updateStatus({ activityId: activity.id, status })
                }
                onConvertToExpense={setConvertExpenseActivity}
                onChangeActivityTime={handleChangeActivityTime}
                onImageSaved={() => void refreshPlan()}
                readOnly={!canWrite || Boolean(planError)}
              />
            )}

            {!isLoading && !isStale && !planError && !isLoadingActivities && (
              <AppInfiniteScrollTrigger
                hasMore={hasMoreActivities && !activitiesError}
                loading={isFetchingMoreActivities}
                onLoadMore={() => void fetchMoreActivities()}
              />
            )}
          </Box>
        </Box>
      )}

      </PlanMapWorkspace>

      <AddActivityDialog
        destination={overview?.destination ?? activeTrip?.destination ?? ''}
        planDate={selectedDay?.planDate}
        open={addActivityOpen}
        onClose={() => setAddActivityOpen(false)}
        onSubmit={(payload: CreateActivityPayload) =>
          createActivityAsync(payload)
        }
        isLoading={isCreatingActivity}
        tripCurrency={
          overview?.baseCurrency ?? activeTrip?.baseCurrency ?? 'VND'
        }
      />

      <ActivityDetailDialog
        activity={detailActivity}
        currency={overview?.baseCurrency ?? activeTrip.baseCurrency ?? 'VND'}
        onClose={() => setViewingActivity(null)}
        onEdit={canWrite ? (activity) => {
          setViewingActivity(null);
          setEditingActivity(activity);
        } : undefined}
      />

      <EditActivityDialog
        destination={activeTrip?.destination}
        open={!!editingActivity}
        onClose={() => setEditingActivity(null)}
        activity={editingActivity}
        onSubmit={(payload: UpdateActivityPayload) =>
          updateActivityAsync(payload)
        }
        isLoading={isUpdatingActivity}
        tripCurrency={
          overview?.baseCurrency ?? activeTrip?.baseCurrency ?? 'VND'
        }
      />

      <DeleteActivityDialog
        open={!!deletingActivity}
        onClose={() => setDeletingActivity(null)}
        onConfirm={() => deleteActivityAsync({})}
        activityTitle={deletingActivity?.title}
        loading={isDeletingActivity}
      />

      <ChecklistDialog
        open={checklistOpen}
        onClose={() => setChecklistOpen(false)}
        checklists={overview?.checklists ?? []}
        onAdd={(payload: CreateChecklistPayload) =>
          createChecklistAsync(payload)
        }
        onToggle={(item: PlanChecklist) => toggleChecklist({ checklistId: item.id })}
        onDelete={(item: PlanChecklist) => deleteChecklist({ checklistId: item.id })}
        isLoading={isCreatingChecklist || isTogglingChecklist || isDeletingChecklist}
        readOnly={!canWrite || Boolean(planError)}
      />

      <OptimizeRouteDialog
        key={`${tripId}:${activeDayId}`}
        open={optimizeDialogOpen}
        onClose={() => setOptimizeDialogOpen(false)}
        dayNumber={selectedDay?.dayNumber ?? 1}
        activities={dayActivities}
        destinationContext={activeTrip?.destination}
        onApplyRoute={handleApplyOptimizedRoute}
      />

      {convertExpenseActivity && (
        <AddExpenseDialog
          open={!!convertExpenseActivity}
          onClose={() => setConvertExpenseActivity(null)}
          isLoading={isCreatingConvertedExpense}
          onSubmit={(payload: CreateExpensePayload) => createExpense({
            ...payload, activityId: convertExpenseActivity.id,
          })}
          tripCurrency={
            overview?.baseCurrency ?? activeTrip?.baseCurrency ?? 'VND'
          }
          tripId={tripId}
          initialData={{
            title: convertExpenseActivity.title,
            amount: (() => {
              const estimated =
                Number(convertExpenseActivity.estimatedCost) || 0;
              const spent = Number(convertExpenseActivity.actualSpent) || 0;
              const remaining = estimated - spent;
              if (remaining > 0) return remaining;
              if (estimated > 0 && spent === 0) return estimated;
              return undefined;
            })(),
            category: normalizeTripCategory(convertExpenseActivity.category),
            expenseTime: (() => {
              const date = overview?.days.find((d) => d.id === convertExpenseActivity.dayId)?.planDate;
              return date ? `${date}T${convertExpenseActivity.startTime?.slice(0, 5) || '00:00'}:00` : undefined;
            })(),
          }}
        />
      )}

      {activeTrip && role === 'OWNER' && publishOpen && (
        <PublishTemplateDialog
          key={String(activeTrip.id)}
          trip={activeTrip}
          checklists={overview?.checklists ?? []}
          open={publishOpen}
          onClose={() => setPublishOpen(false)}
        />
      )}

      {TRIP_SHARING_ENABLED && tripId && (
        <ShareTripDialog
          open={shareDialogOpen}
          onClose={() => setShareDialogOpen(false)}
          tripId={tripId}
          tripName={overview?.tripName ?? activeTrip?.name ?? ''}
        />
      )}

      <ActivityLogDialog
        open={activityLogOpen}
        onClose={() => setActivityLogOpen(false)}
        tripId={tripId ?? null}
      />

      {tripId && (
        <AiPlannerDialog
          open={aiPlannerOpen}
          onClose={() => setAiPlannerOpen(false)}
          tripId={tripId}
          initialDestination={
            overview?.destination ?? activeTrip?.destination ?? ''
          }
          initialDays={
            activeTrip?.startDate && activeTrip?.endDate
              ? Math.max(
                  1,
                  Math.ceil(
                    (new Date(activeTrip.endDate).getTime() -
                      new Date(activeTrip.startDate).getTime()) /
                      (1000 * 3600 * 24),
                  ) + 1,
                )
              : overview?.totalDays || overview?.days?.length || 3
          }
          initialPeople={members?.length || 2}
          currency={overview?.baseCurrency ?? activeTrip?.baseCurrency ?? 'VND'}
          onSuccess={() => {
            showToast(t('toasts.aiGenerateSuccess'));
            refreshPlan();
          }}
          onError={(msg) => showToast(msg, 'error')}
        />
      )}

      <AppConfirmDialog
        open={resetDayConfirmOpen}
        onClose={() => setResetDayConfirmOpen(false)}
        onConfirm={async () => {
          await resetDayActivitiesAsync({});
        }}
        title={t('dialog.resetDayTitle', { day: selectedDay?.dayNumber ?? '' })}
        description={t.rich('dialog.resetDayDesc', {
          day: selectedDay?.dayNumber ?? '',
          subject: (chunks) => <strong>{chunks}</strong>,
        })}
        confirmText={t('dialog.confirmResetDay')}
        cancelText={t('dialog.cancelBtn')}
        intent="danger"
        loading={isResettingDay}
      />

      <AppToast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
    </AppPageContainer>
  );
};

export default PlanOverview;
