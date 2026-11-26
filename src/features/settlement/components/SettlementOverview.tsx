'use client';

import { ApiError } from '@/base/api';
import { hasPendingPayment } from '../utils/pending-payments';

import AppErrorState from '@/base/components/ui/AppErrorState';

import { AppLoadingState, AppLoadingIndicator, AppEmptyState, AppButton, AppFloatingActionButton, AppCard, AppPageContainer, AppPageHeader, AppSectionHeader, AppFilterChipGroup, AppToast, type AppToastSeverity } from '@/base/components/ui';


import { useState } from 'react';
import { Box, Stack } from '@mui/material';
import { useTranslations } from 'next-intl';

import { useTripPermissions } from '@/features/trip/hooks/useTripPermissions';
import { useTripContext } from '@/features/trip/context/TripContext';
import { useCreateSettlement, useDeleteSettlement, useRespondSettlement, useTripSettlementWorkspace } from '../hooks/useTripSettlement';
import MemberBalancesTable from './MemberBalancesTable';
import MyBalanceCard from './MyBalanceCard';
import RecordSettlementDialog from './RecordSettlementDialog';
import SettlementHistoryTable from './SettlementHistoryTable';
import SuggestedSettlementsList from './SuggestedSettlementsList';
import type { CreateSettlementRequest, Settlement, SettlementAction, SuggestedSettlement, HistoryFilter, MemberBalanceFilter, SettlementPagination } from '../types';

const emptyPagination: SettlementPagination = { page: 0, size: 3, totalElements: 0, totalPages: 0, hasNext: false };

const SettlementOverview = () => {
  const t = useTranslations('settlement');
  const tTrip = useTranslations('trip');
  const {
    activeTrip,
    trips,
    isLoading: isTripLoading,
    error: tripError,
    refetchTrips,
    openCreateTrip,
  } = useTripContext();

  const currentTrip = activeTrip || trips[0];
  const tripId = currentTrip?.id;
  const { actorId, canWrite, canManage } =
    useTripPermissions(tripId);

  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>('ALL');
  const [memberFilter, setMemberFilter] = useState<MemberBalanceFilter>('ALL');
  const [memberPage, setMemberPage] = useState(0);
  const [historyPage, setHistoryPage] = useState(0);
  const [suggestionPage, setSuggestionPage] = useState(0);
  const [scopeTrip, setScopeTrip] = useState(tripId);
  if (scopeTrip !== tripId) {
    setScopeTrip(tripId);
    setMemberFilter('ALL'); setHistoryFilter('ALL');
    setMemberPage(0); setHistoryPage(0); setSuggestionPage(0);
  }

  const {
    summary, workspace, isStale, isFetching,
    isLoading: isSummaryLoading,
    error: summaryError,
    refetch,
  } = useTripSettlementWorkspace({
    tripId,
    memberStatus: memberFilter, memberPage, historyStatus: historyFilter, historyPage, suggestionPage,
  });

  // Persist BE-clamped pages only after a response for the current query has arrived.
  if (workspace && !isStale && !isFetching) {
    if (memberPage !== workspace.memberBalances.pagination.page) setMemberPage(workspace.memberBalances.pagination.page);
    if (historyPage !== workspace.settlementHistory.pagination.page) setHistoryPage(workspace.settlementHistory.pagination.page);
    if (suggestionPage !== workspace.suggestedSettlements.pagination.page) setSuggestionPage(workspace.suggestedSettlements.pagination.page);
  }

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInitialData, setDialogInitialData] = useState<
    Partial<CreateSettlementRequest> | undefined
  >(undefined);

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

  const { createSettlementAsync, isPending: isCreating } = useCreateSettlement({
    tripId: tripId ?? '',
  });

  const { mutateAsync: respondAsync, isPending: isResponding } = useRespondSettlement(tripId ?? '');
  const { deleteSettlementAsync, isPending: isDeleting } = useDeleteSettlement({
    tripId: tripId ?? '',
  });

  const settlementHistory = summary?.settlementHistory ?? [];

  const handleOpenRecordPayment = (prefill?: SuggestedSettlement) => {
    if (!canWrite || (prefill && !canManage && prefill.fromUserId !== actorId)) {
      return;
    }
    if (prefill && hasPendingPayment(settlementHistory, prefill.fromUserId, prefill.toUserId, prefill.currency)) {
      showToast(t('pendingPaymentNotice'), 'info');
      return;
    }
    if (prefill) {
      setDialogInitialData({
        payerId: prefill.fromUserId,
        payeeId: prefill.toUserId,
        amount: prefill.amount,
        currency: prefill.currency,
      });
    } else {
      setDialogInitialData(canManage ? undefined : { payerId: actorId });
    }
    setDialogOpen(true);
  };

  const handleCreateSettlement = async (data: CreateSettlementRequest) => {
    if (!canWrite || isCreating) return;
    if (hasPendingPayment(settlementHistory, data.payerId, data.payeeId, data.currency)) {
      showToast(t('pendingPaymentNotice'), 'info');
      return;
    }
    try {
      await createSettlementAsync(data);
      showToast(t('toasts.createSuccess'), 'success');
      setDialogOpen(false);
      void refetch().catch(() => undefined);
    } catch (error) {
      console.error('Error creating settlement:', error);
      showToast(t(error instanceof ApiError && error.status === 409 ? 'pendingPaymentNotice' : 'toasts.createError'), 'error');
      void refetch().catch(() => undefined);
    }
  };

  const handleDeleteSettlement = async (settlement: Settlement) => {
    if (!canWrite || isDeleting || settlement.status !== 'PENDING' || settlement.createdBy !== actorId) return;
    try {
      await deleteSettlementAsync({ settlementId: settlement.id });
      showToast(t('toasts.deleteSuccess'), 'info');
      void refetch().catch(() => undefined);
    } catch (error) {
      console.error('Error deleting settlement:', error);
      showToast(t('toasts.deleteError'), 'error');
      void refetch().catch(() => undefined);
    }
  };

  const handleRespond = async (settlement: Settlement, action: SettlementAction) => {
    try {
      await respondAsync({ settlementId: settlement.id, action });
      showToast(t('toasts.responseSuccess'));
      void refetch().catch(() => undefined);
    } catch {
      showToast(t('toasts.responseError'), 'error');
      void refetch().catch(() => undefined);
    }
  };

  if (isTripLoading || (tripId && (isSummaryLoading || !summary && !summaryError))) {
    return <AppPageContainer embedded><AppLoadingState /></AppPageContainer>;
  }

  const accessLost = [401, 403, 404].includes(summaryError?.status ?? 0);
  if (tripError || (summaryError && (!summary || isStale || accessLost))) {
    return (
      <AppPageContainer embedded>
        <AppErrorState
          status={(tripError ?? summaryError)?.status}
          onRetry={() => tripError ? refetchTrips() : refetch()}
        />
      </AppPageContainer>
    );
  }

  if (!currentTrip) {
    return (
      <AppPageContainer embedded>
        <AppEmptyState title={tTrip('noTrips')} action={
          <AppButton intent="primary" onClick={openCreateTrip}>{tTrip('createTrip')}</AppButton>
        } />
      </AppPageContainer>
    );
  }

  const memberOptions = (summary?.memberBalances || []).map((m) => ({
    userId: m.userId,
    name: m.name,
  }));

  const viewBusy = isStale || isFetching;
  const currency = summary?.currency || currentTrip.baseCurrency || 'VND';

  return (
    <AppPageContainer
      embedded
      floatingAction={canWrite ? (
        <AppFloatingActionButton
          label={t('recordPayment')}
          disabled={viewBusy}
          onClick={() => handleOpenRecordPayment()}
        />
      ) : undefined}
    >
      <AppPageHeader title={t('pageTitle')} actions={viewBusy ? <AppLoadingIndicator /> : undefined} />
      {summaryError && <AppErrorState compact status={summaryError.status} onRetry={() => refetch()} />}

      <MyBalanceCard
        myBalance={summary?.myBalance ?? 0}
        myStatus={summary?.myStatus ?? 'SETTLED'}
        currency={currency}
        totalExpenses={summary?.totalExpenses ?? 0}
      />

      <Box inert={viewBusy} aria-busy={viewBusy} sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2.5, sm: 3 }, opacity: viewBusy ? 0.65 : 1 }}>
      <AppCard component="section" sx={{ p: { xs: 2.5, sm: 2.5 } }}>
      <Stack spacing={1}>
        <AppSectionHeader title={t('suggestedTitle')} count={workspace?.suggestedSettlements.pagination.totalElements ?? 0} />

        <SuggestedSettlementsList
          key={tripId}
          suggestedSettlements={workspace?.suggestedSettlements.items ?? []}
          pagination={workspace?.suggestedSettlements.pagination ?? emptyPagination}
          onPageChange={setSuggestionPage}
          settlements={settlementHistory}
          canSettle={(item) =>
            canWrite && (canManage || item.fromUserId === actorId)
          }
          onSettle={(settlement) => handleOpenRecordPayment(settlement)}
        />
      </Stack>

      </AppCard>

      <MemberBalancesTable
        key={tripId}
        memberBalances={workspace?.memberBalances.items ?? []}
        balanceFilter={memberFilter}
        onFilterChange={value => { setMemberFilter(value); setMemberPage(0); }}
        pagination={workspace?.memberBalances.pagination ?? emptyPagination}
        onPageChange={setMemberPage}
        currency={currency}
      />

      <AppCard component="section" sx={{ p: { xs: 2.5, sm: 3 }, minWidth: 0, flexShrink: 0 }}>
      <Stack spacing={2} sx={{ width: '100%', minWidth: 0 }}>
        <AppSectionHeader
          title={t('historyTitle')}
          count={workspace?.settlementHistory.pagination.totalElements ?? 0}
        />
        <Box role="group" aria-label={t('historyTitle')}>
        <AppFilterChipGroup<HistoryFilter> compact showAll={false} allValue="ALL" value={historyFilter} onChange={value => { setHistoryFilter(value); setHistoryPage(0); }}
          options={[
            { value: 'ALL', label: t('historyFilters.all') },
            { value: 'PENDING', label: t('historyFilters.pending') },
            { value: 'CONFIRMED', label: t('historyFilters.confirmed') },
          ]} />
        </Box>
        <SettlementHistoryTable
          key={`${tripId}:${historyFilter}`}
          settlements={workspace?.settlementHistory.items ?? []}
          pagination={workspace?.settlementHistory.pagination ?? emptyPagination}
          onPageChange={setHistoryPage}
          canDelete={(item) =>
            canWrite && item.status === 'PENDING' && item.createdBy === actorId
          }
          onDelete={handleDeleteSettlement}
          onRespond={handleRespond}
          busy={isResponding || isDeleting}
        />
      </Stack>
      </AppCard>

      </Box>

      {dialogOpen && (
        <RecordSettlementDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          settlements={settlementHistory}
          members={memberOptions}
          fixedPayerId={!canManage ? actorId : undefined}
          initialData={dialogInitialData}
          currency={currency}
          isLoading={isCreating}
          onSubmit={handleCreateSettlement}
        />
      )}

      <AppToast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
    </AppPageContainer>
  );
};

export default SettlementOverview;
