'use client';

import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import PaymentRoundedIcon from '@mui/icons-material/PaymentRounded';
import { useTranslations } from 'next-intl';

import { AppButton, AppCard, AppFinanceRow } from '@/base/components/ui';
import { formatCurrency, getUserInitials } from '@/base/utils';
import type { SuggestedSettlement } from '../types';

export interface SuggestedSettlementCardProps {
  settlement: SuggestedSettlement;
  onSettle?: (settlement: SuggestedSettlement) => void;
}

const SuggestedSettlementCard = ({
  settlement,
  onSettle,
}: SuggestedSettlementCardProps) => {
  const t = useTranslations('settlement');

  return (
    <>
    <Box sx={{ display: { xs: 'block', sm: 'none' }, minWidth: 0, border: 1, borderColor: 'divider', borderRadius: '12px', bgcolor: 'background.paper' }}>
      <AppFinanceRow icon={<Avatar sx={{ width: 40, height: 40 }}>{getUserInitials(settlement.fromUserName)}</Avatar>}
        title={settlement.fromUserName}
        subtitle={t('transferTo', { name: settlement.toUserName })}
        amount={formatCurrency(settlement.amount, settlement.currency)}
        onClick={onSettle ? () => onSettle(settlement) : undefined}
        action={onSettle ? <AppButton intent="text" aria-label={t('settleBtn')} onClick={() => onSettle(settlement)} sx={{ minWidth: 44, minHeight: 44 }}><PaymentRoundedIcon fontSize="small" /></AppButton> : undefined}
      />
    </Box>
    <AppCard
      sx={{
        display: { xs: 'none', sm: 'flex' },
        p: 2,
        borderRadius: '16px',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: (theme) => {
            return `0 4px 12px ${alpha(theme.palette.text.primary, 0.06)}`;
          },
          borderColor: 'primary.main',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          flexWrap: 'wrap',
          minWidth: 0,
          overflowWrap: 'anywhere',
        }}
      >
        <Box
          sx={{
            px: 1.5,
            py: 0.75,
            borderRadius: '10px',
            bgcolor: 'action.hover',
            fontWeight: 700,
            fontSize: '13px',
            color: 'text.primary',
          }}
        >
          {settlement.fromUserName}
        </Box>

        <Box
          sx={{ display: 'flex', alignItems: 'center', color: 'primary.main' }}
        >
          <ArrowForwardRoundedIcon sx={{ fontSize: '18px' }} />
        </Box>

        <Box
          sx={{
            px: 1.5,
            py: 0.75,
            borderRadius: '10px',
            bgcolor: 'action.hover',
            fontWeight: 700,
            fontSize: '13px',
            color: 'text.primary',
          }}
        >
          {settlement.toUserName}
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'space-between', sm: 'flex-end' },
          width: { xs: '100%', sm: 'auto' },
          gap: 2,
          flexWrap: 'wrap',
          minWidth: 0,
        }}
      >
        <Typography
          sx={{
            fontSize: '16px',
            minWidth: 0,
            overflowWrap: 'anywhere',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)',
            color: 'primary.main',
          }}
        >
          {formatCurrency(settlement.amount, settlement.currency)}
        </Typography>

        {onSettle && (
          <AppButton
            size="medium"
            intent="primary"
            startIcon={<PaymentRoundedIcon sx={{ fontSize: '16px' }} />}
            onClick={() => onSettle(settlement)}
          >
            {t('settleBtn')}
          </AppButton>
        )}
      </Box>
    </AppCard>
    </>
  );
};

export default SuggestedSettlementCard;
