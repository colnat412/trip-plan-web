'use client';

import { Avatar, Box, ButtonBase, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import PaymentRoundedIcon from '@mui/icons-material/PaymentRounded';
import { useLocale, useTranslations } from 'next-intl';
import { formatCurrency, getUserInitials } from '@/base/utils';
import type { SuggestedSettlement } from '../types';

export interface SuggestedSettlementCardProps {
  settlement: SuggestedSettlement;
  onSettle?: (settlement: SuggestedSettlement) => void;
}

const SuggestedSettlementCard = ({ settlement, onSettle }: SuggestedSettlementCardProps) => {
  const t = useTranslations('settlement');
  const locale = useLocale();
  const actionLabel = `${t('settleBtn')}: ${settlement.fromUserName} → ${settlement.toUserName}`;

  return (
    <Stack role="listitem" direction="row" spacing={0.5} sx={{ alignItems: 'center', minWidth: 0 }}>
      <Box component={onSettle ? ButtonBase : 'div'}
        onClick={onSettle ? () => onSettle(settlement) : undefined}
        aria-label={onSettle ? actionLabel : undefined}
        sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0, py: 1.25, px: 0.5,
          textAlign: 'left', color: 'text.primary', borderRadius: 'var(--app-radius-small)',
          '&:hover': onSettle ? { bgcolor: 'action.hover' } : undefined,
          '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: -2 } }}>
        <Avatar sx={{ width: 32, height: 32, fontSize: '12px', flexShrink: 0 }}>{getUserInitials(settlement.fromUserName)}</Avatar>
        <Stack spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
          <Typography noWrap title={settlement.fromUserName} sx={{ fontSize: '14px', fontWeight: 600 }}>{settlement.fromUserName}</Typography>
          <Typography noWrap title={t('transferTo', { name: settlement.toUserName })} sx={{ fontSize: '12px', color: 'text.secondary' }}>
            {t('transferTo', { name: settlement.toUserName })}
          </Typography>
        </Stack>
        <Typography sx={{ maxWidth: '45%', fontSize: '14px', fontWeight: 600, fontVariantNumeric: 'tabular-nums', textAlign: 'right', overflowWrap: 'anywhere' }}>
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
