'use client';

import { Divider, Stack } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { useTranslations } from 'next-intl';

import { AppPagination, AppEmptyState } from '@/base/components/ui';
import { hasPendingPayment } from '../utils/pending-payments';
import SuggestedSettlementCard from './SuggestedSettlementCard';
import type { Settlement, SuggestedSettlement, SettlementPagination } from '../types';

export interface SuggestedSettlementsListProps {
  suggestedSettlements: SuggestedSettlement[];
  settlements?: Settlement[];
  canSettle?: (settlement: SuggestedSettlement) => boolean;
  onSettle: (settlement: SuggestedSettlement) => void;
  pagination: SettlementPagination;
  onPageChange: (page: number) => void;
}

const SuggestedSettlementsList = ({ suggestedSettlements, onSettle, canSettle, settlements = [], pagination, onPageChange }: SuggestedSettlementsListProps) => {
  const t = useTranslations('settlement');

  if (suggestedSettlements.length === 0) {
    return <AppEmptyState compact icon={<CheckCircleRoundedIcon color="success" />} title={t('suggestedEmpty')} />;
  }

  const visible = suggestedSettlements;
  return (
    <Stack spacing={1} sx={{ minWidth: 0 }}>
      <Stack role="list" aria-label={t('suggestedTitle')} divider={<Divider aria-hidden="true" />} sx={{ minWidth: 0 }}>
        {visible.map((item, index) => (
          <SuggestedSettlementCard key={`${item.fromUserId}-${item.toUserId}-${index}`} settlement={item}
            pending={hasPendingPayment(settlements, item.fromUserId, item.toUserId, item.currency)}
            onSettle={canSettle?.(item) === false || hasPendingPayment(settlements, item.fromUserId, item.toUserId, item.currency) ? undefined : onSettle} />
        ))}
      </Stack>
      {pagination.totalPages > 1 && <AppPagination size="small" page={pagination.page + 1} count={pagination.totalPages} onChange={(_, value) => onPageChange(value - 1)} />}
    </Stack>
  );
};

export default SuggestedSettlementsList;
