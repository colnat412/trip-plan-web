'use client';

import { Avatar, Box, ButtonBase, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import PaymentRoundedIcon from '@mui/icons-material/PaymentRounded';
import { useLocale, useTranslations } from 'next-intl';
import { formatCurrency, getUserInitials } from '@/base/utils';
import { useUserContext } from '@/features/user/context/UserContext';
import type { SuggestedSettlement } from '../types';
import SettlementStatusChip from './SettlementStatusChip';
import { settlementRowStyles as rowStyles } from './settlement-row.styles';

export interface SuggestedSettlementCardProps {
  settlement: SuggestedSettlement;
  pending?: boolean;
  onSettle?: (settlement: SuggestedSettlement) => void;
}

const SuggestedSettlementCard = ({ settlement, onSettle, pending = false }: SuggestedSettlementCardProps) => {
  const t = useTranslations('settlement');
  const locale = useLocale();
  const { user } = useUserContext();
  const isPayer = user?.id != null && String(user.id) === String(settlement.fromUserId);
  const isRecipient = user?.id != null && String(user.id) === String(settlement.toUserId);
  const payerName = isPayer ? t('you') : settlement.fromUserName;
  const recipientName = isRecipient ? t('you') : settlement.toUserName;
  const transferLabel = isRecipient ? t('transferToYou') : t('transferTo', { name: settlement.toUserName });
  const actionLabel = `${t('settleBtn')}: ${payerName} → ${recipientName}`;

  return (
    <Stack role="listitem" direction="row" spacing={0.5} sx={{ alignItems: 'center', minWidth: 0 }}>
      <Box component={onSettle ? ButtonBase : 'div'}
        onClick={onSettle ? () => onSettle(settlement) : undefined}
        aria-label={onSettle ? actionLabel : undefined}
        sx={{ ...rowStyles.row, flex: 1,
          textAlign: 'left', color: 'text.primary', borderRadius: 'var(--app-radius-small)',
          '&:hover': onSettle ? { bgcolor: 'action.hover' } : undefined,
          '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: -2 } }}>
        <Avatar sx={rowStyles.avatar}>{getUserInitials(settlement.fromUserName)}</Avatar>
        <Stack spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
          <Typography noWrap title={payerName} sx={rowStyles.primary}>{payerName}</Typography>
          <Typography noWrap title={transferLabel} sx={rowStyles.secondary}>
            {transferLabel}
          </Typography>
          {pending && <SettlementStatusChip status="PENDING" compact />}
        </Stack>
        <Typography sx={{ ...rowStyles.amount, textAlign: 'right' }}>
          {formatCurrency(settlement.amount, settlement.currency, locale)}
        </Typography>
      </Box>
      {onSettle && (
        <Tooltip title={t('settleBtn')}>
          <IconButton aria-label={actionLabel} onClick={() => onSettle(settlement)}
            sx={{ width: 44, height: 44, flexShrink: 0, color: 'primary.main', borderRadius: 'var(--app-radius-control)' }}>
            <PaymentRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );
};

export default SuggestedSettlementCard;
