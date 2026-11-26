'use client';

import { useTranslations } from 'next-intl';
import { AppStatusChip } from '@/base/components/ui';
import type { SettlementStatus } from '../types';

interface SettlementStatusChipProps { status: SettlementStatus; compact?: boolean }

export default function SettlementStatusChip({ status, compact = false }: SettlementStatusChipProps) {
  const t = useTranslations('settlement');
  return <AppStatusChip label={t(`statuses.${status}`)}
    tone={status === 'CONFIRMED' ? 'success' : status === 'PENDING' || status === 'DELETE_PENDING' ? 'warning' : 'neutral'}
    sx={{ flexShrink: 0, alignSelf: compact ? 'flex-start' : 'auto', width: 'fit-content',
      ...(compact && { minHeight: 20, fontSize: 10, '& .MuiChip-label': { px: 0.75, py: 0.125 } }) }} />;
}
