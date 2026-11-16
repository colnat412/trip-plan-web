'use client';

import { Avatar, Box, Stack } from '@mui/material';
import PaymentRoundedIcon from '@mui/icons-material/PaymentRounded';
import { useLocale, useTranslations } from 'next-intl';
import { AppButton, AppFinanceRow } from '@/base/components/ui';
import { formatCurrency, getUserInitials } from '@/base/utils';
import type { SuggestedSettlement } from '../types';

export interface SuggestedSettlementCardProps {
  settlement: SuggestedSettlement;
  onSettle?: (settlement: SuggestedSettlement) => void;
}

const SuggestedSettlementCard = ({ settlement, onSettle }: SuggestedSettlementCardProps) => {
  const t = useTranslations('settlement');
  const locale = useLocale();

  return (
    <Box sx={{ p: 2, minWidth: 0, bgcolor: 'action.hover', borderRadius: 'var(--app-radius-control)' }}>
      <Stack spacing={1.5}>
        <AppFinanceRow
          icon={<Avatar sx={{ width: 40, height: 40 }}>{getUserInitials(settlement.fromUserName)}</Avatar>}
          title={settlement.fromUserName}
          subtitle={t('transferTo', { name: settlement.toUserName })}
          amount={formatCurrency(settlement.amount, settlement.currency, locale)}
          onClick={onSettle ? () => onSettle(settlement) : undefined}
        />
        {onSettle && (
          <AppButton
            intent="primary"
            startIcon={<PaymentRoundedIcon fontSize="small" />}
            onClick={() => onSettle(settlement)}
            sx={{ alignSelf: { xs: 'stretch', sm: 'flex-end' }, minHeight: 44, borderRadius: 'var(--app-radius-pill)' }}
          >
            {t('settleBtn')}
          </AppButton>
        )}
      </Stack>
    </Box>
  );
};

export default SuggestedSettlementCard;
