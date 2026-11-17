'use client';

import AppErrorState from '@/base/components/ui/AppErrorState';

import { AppLoadingState, AppEmptyState, AppButton, AppFloatingActionButton, AppCard, AppPageContainer, AppPageHeader, AppSectionHeader, AppToast, type AppToastSeverity } from '@/base/components/ui';


import { useState } from 'react';
import { Stack } from '@mui/material';
import HandshakeRoundedIcon from '@mui/icons-material/HandshakeRounded';
import { useTranslations } from 'next-intl';

import { useTripPermissions } from '@/features/trip/hooks/useTripPermissions';
import { useTripContext } from '@/features/trip/context/TripContext';
import { useCreateSettlement, useDeleteSettlement, useTripSettlementSummary } from '../hooks/useTripSettlement';
import MemberBalancesTable from './MemberBalancesTable';
import MyBalanceCard from './MyBalanceCard';
import RecordSettlementDialog from './RecordSettlementDialog';
import SettlementHistoryTable from './SettlementHistoryTable';
import SuggestedSettlementsList from './SuggestedSettlementsList';
import type { CreateSettlementRequest, Settlement, SuggestedSettlement } from '../types';

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
  const { actorId, canWrite, canManage, canManageRecord } =
    useTripPermissions(tripId);

  const {
    summary,
    isLoading: isSummaryLoading,
    error: summaryError,
    refetch,
  } = useTripSettlementSummary({
    tripId,
    enabled: Boolean(tripId),
  });

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

  const { deleteSettlementAsync } = useDeleteSettlement({
    tripId: tripId ?? '',
  });

  const handleOpenRecordPayment = (prefill?: SuggestedSettlement) => {
    if (!canWrite || (prefill && !canManage && prefill.fromUserId !== actorId)) {
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
    try {
      await createSettlementAsync(data);
      showToast(t('toasts.createSuccess'), 'success');
      setDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Error creating settlement:', error);
      showToast(t('toasts.createError'), 'error');
    }
  };

  const handleDeleteSettlement = async (settlement: Settlement) => {
    try {
      await deleteSettlementAsync({ settlementId: settlement.id });
      showToast(t('toasts.deleteSuccess'), 'info');
      refetch();
    } catch (error) {
      console.error('Error deleting settlement:', error);
      showToast(t('toasts.deleteError'), 'error');
    }
  };

  if (isTripLoading || (tripId && isSummaryLoading)) {
    return <AppPageContainer embedded><AppLoadingState /></AppPageContainer>;
  }

  if (tripError || summaryError) {
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

  const currency = summary?.currency || currentTrip.baseCurrency || 'VND';

  return (
    <AppPageContainer
      embedded
      floatingAction={canWrite ? (
        <AppFloatingActionButton
          label={t('recordPayment')}
          icon={<HandshakeRoundedIcon />}
          onClick={() => handleOpenRecordPayment()}
        />
      ) : undefined}
    >
      <AppPageHeader title={t('pageTitle')} />

      <MyBalanceCard
        myBalance={summary?.myBalance ?? 0}
        myStatus={summary?.myStatus ?? 'SETTLED'}
        currency={currency}
        totalExpenses={summary?.totalExpenses ?? 0}
        totalSettled={summary?.totalSettled ?? 0}
        onOpenRecordPayment={() => handleOpenRecordPayment()}
      />

      <AppCard component="section" sx={{ p: { xs: 2, sm: 2.5 } }}>
      <Stack spacing={1}>
        <AppSectionHeader title={t('suggestedTitle')} count={summary?.suggestedSettlements.length ?? 0} />

        <SuggestedSettlementsList
          suggestedSettlements={summary?.suggestedSettlements ?? []}
          canSettle={(item) =>
            canWrite && (canManage || item.fromUserId === actorId)
          }
          onSettle={(settlement) => handleOpenRecordPayment(settlement)}
        />
      </Stack>

      </AppCard>

      <MemberBalancesTable
        memberBalances={summary?.memberBalances ?? []}
        currency={currency}
      />

      <Stack spacing={1.5} sx={{ width: '100%', minWidth: 0 }}>
        <AppSectionHeader
          title={t('historyTitle')}
          count={summary?.settlementHistory.length ?? 0}
        />
        <SettlementHistoryTable
          settlements={summary?.settlementHistory ?? []}
          canDelete={(item) =>
            canManageRecord(item.createdBy) && (canManage || item.payerId === actorId)
          }
          onDelete={handleDeleteSettlement}
        />
      </Stack>

      {dialogOpen && (
        <RecordSettlementDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
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
