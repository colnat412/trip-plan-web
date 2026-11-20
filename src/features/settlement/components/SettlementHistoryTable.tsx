'use client';

import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import type { Theme } from '@mui/material/styles';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useTranslations } from 'next-intl';

import { AppCard, AppConfirmDialog, AppEmptyState } from '@/base/components/ui';
import { formatCurrency, formatDateTime, getUserInitials } from '@/base/utils';
import { useUserContext } from '@/features/user/context/UserContext';
import type { Settlement } from '../types';
import { settlementRowStyles as rowStyles } from './settlement-row.styles';

export interface SettlementHistoryTableProps {
  settlements: Settlement[];
  canDelete?: (settlement: Settlement) => boolean;
  onDelete?: (settlement: Settlement) => void;
}

const deleteButtonSx = (theme: Theme) => {
  const palette = theme.vars?.palette ?? theme.palette;
  return {
    width: 44,
    height: 44,
    flexShrink: 0,
    color: palette.error.main,
    bgcolor: 'transparent',
    '& .settlement-delete-glyph': {
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 28, height: 28, borderRadius: '50%',
      bgcolor: `color-mix(in srgb, ${palette.error.main} 6%, transparent)`,
    },
    '&:hover': {
      bgcolor: 'transparent',
      '& .settlement-delete-glyph': { bgcolor: `color-mix(in srgb, ${palette.error.main} 12%, transparent)` },
    },
    '&:active': {
      bgcolor: 'transparent',
      '& .settlement-delete-glyph': { bgcolor: `color-mix(in srgb, ${palette.error.main} 18%, transparent)` },
    },
    '&.Mui-focusVisible': { outline: `2px solid ${palette.error.main}`, outlineOffset: 2 },
  };
};

const SettlementHistoryTable = ({
  settlements,
  canDelete,
  onDelete,
}: SettlementHistoryTableProps) => {
  const t = useTranslations('settlement');
  const { user } = useUserContext();
  const personName = (id: string, name: string | null, inSentence = false) =>
    user?.id != null && String(user.id) === String(id) ? t(inSentence ? 'youInSentence' : 'you') : name || '—';
  const [selectedSettlement, setSelectedSettlement] =
    useState<Settlement | null>(null);

  if (settlements.length === 0) {
    return <AppEmptyState title={t('historyEmpty')} />;
  }

  return (
    <>
      <AppCard
        sx={{
          borderRadius: 'var(--app-radius-card)',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          overflow: 'hidden',
          // A flex page must scroll this card, never shrink and clip its rows.
          flexShrink: 0,
          width: '100%',
          minWidth: 0,
          // AppCard's responsive padding must be overridden at the same breakpoints.
          p: { xs: 0, sm: 0 },
        }}
      >
        <Box role="list" sx={{ display: { xs: 'block', sm: 'none' }, px: 2.5 }}>
          {settlements.map((settlement) => {
            const title = `${personName(settlement.payerId, settlement.payerName)} → ${personName(settlement.payeeId, settlement.payeeName)}`;
            const date = formatDateTime(settlement.settledAt);
            const method = t(settlement.paymentMethod === 'BANK_TRANSFER' ? 'methodBank' : settlement.paymentMethod === 'CASH' ? 'methodCash' : 'methodOther');
            return (
              <Box key={settlement.id} role="listitem" sx={{ ...rowStyles.row,
                borderBottom: 1, borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}>
                <Avatar src={settlement.payerAvatarUrl || undefined} sx={rowStyles.avatar}>{getUserInitials(settlement.payerName || '')}</Avatar>
                <Box sx={rowStyles.identity}>
                  <Typography noWrap title={title} sx={rowStyles.primary}>{title}</Typography>
                  <Typography noWrap title={date} sx={rowStyles.secondary}>{date}</Typography>
                  <Typography noWrap title={method} sx={rowStyles.secondary}>{method}</Typography>
                  {settlement.note && <Typography sx={{ ...rowStyles.secondary, overflowWrap: 'anywhere' }}>{settlement.note}</Typography>}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                  <Typography sx={rowStyles.amount}>{formatCurrency(settlement.amount, settlement.currency)}</Typography>
                  {onDelete && (canDelete?.(settlement) ?? true) && (
                    <IconButton aria-label={t('deleteConfirm.title')} onClick={() => setSelectedSettlement(settlement)} sx={deleteButtonSx}>
                      <Box component="span" className="settlement-delete-glyph"><CloseRoundedIcon sx={{ fontSize: 16 }} /></Box>
                    </IconButton>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
        <TableContainer sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                <TableCell
                  sx={{
                    py: 1.5,
                    px: 2.5,
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                  }}
                >
                  {t('date')}
                </TableCell>
                <TableCell
                  sx={{
                    py: 1.5,
                    px: 2,
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                  }}
                >
                  {t('payer')}
                </TableCell>
                <TableCell
                  sx={{
                    py: 1.5,
                    px: 2,
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                  }}
                >
                  {t('payee')}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    py: 1.5,
                    px: 2,
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                  }}
                >
                  {t('amount')}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    py: 1.5,
                    px: 2,
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                  }}
                >
                  {t('method')}
                </TableCell>
                <TableCell
                  sx={{
                    py: 1.5,
                    px: 2,
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                  }}
                >
                  {t('note')}
                </TableCell>
                {onDelete && (
                  <TableCell
                    align="right"
                    sx={{ py: 1.5, px: 2.5, width: 60 }}
                  />
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {settlements.map((s) => (
                <TableRow
                  key={s.id}
                  hover
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    '& > .MuiTableCell-root': { verticalAlign: 'middle' },
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <TableCell sx={{ py: 1.75, px: 2.5 }}>
                    <Typography
                      sx={{
                        fontSize: '13px',
                        color: 'text.secondary',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {formatDateTime(s.settledAt)}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ py: 1.75, px: 2 }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: 'center' }}
                    >
                      <Avatar
                        src={s.payerAvatarUrl || undefined}
                        sx={{
                          width: 28,
                          height: 28,
                          fontSize: '11px',
                          fontWeight: 700,
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                        }}
                      >
                        {getUserInitials(s.payerName || 'Member')}
                      </Avatar>
                      <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>
                        {personName(s.payerId, s.payerName)}
                      </Typography>
                    </Stack>
                  </TableCell>

                  <TableCell sx={{ py: 1.75, px: 2 }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: 'center' }}
                    >
                      <Avatar
                        src={s.payeeAvatarUrl || undefined}
                        sx={{
                          width: 28,
                          height: 28,
                          fontSize: '11px',
                          fontWeight: 700,
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                        }}
                      >
                        {getUserInitials(s.payeeName || 'Member')}
                      </Avatar>
                      <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>
                        {personName(s.payeeId, s.payeeName)}
                      </Typography>
                    </Stack>
                  </TableCell>

                  <TableCell align="right" sx={{ py: 1.75, px: 2 }}>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: 'success.main',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {formatCurrency(s.amount, s.currency)}
                    </Typography>
                  </TableCell>

                  <TableCell align="center" sx={{ py: 1.75, px: 2 }}>
                    <Chip
                      size="small"
                      label={
                        s.paymentMethod === 'BANK_TRANSFER'
                          ? t('methodBank')
                          : s.paymentMethod === 'CASH'
                            ? t('methodCash')
                            : t('methodOther')
                      }
                      sx={{
                        fontSize: '11px',
                        fontWeight: 600,
                        height: 22,
                        bgcolor: 'action.hover',
                        color: 'text.secondary',
                      }}
                    />
                  </TableCell>

                  <TableCell sx={{ py: 1.75, px: 2 }}>
                    <Typography
                      sx={{ fontSize: '13px', color: 'text.secondary' }}
                    >
                      {s.note || '—'}
                    </Typography>
                  </TableCell>

                  {onDelete && (
                    <TableCell align="right" sx={{ py: 1.75, px: 2.5 }}>
                      {(canDelete?.(s) ?? true) && (
                        <Tooltip title={t('deleteConfirm.title')}>
                          <IconButton
                            size="small"
                            aria-label={t('deleteConfirm.title')}
                            onClick={() => setSelectedSettlement(s)}
                            sx={deleteButtonSx}
                          >
                            <Box component="span" className="settlement-delete-glyph"><CloseRoundedIcon sx={{ fontSize: 16 }} /></Box>
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </AppCard>

      {selectedSettlement && (
        <AppConfirmDialog
          open={Boolean(selectedSettlement)}
          title={t('deleteConfirm.title')}
          description={t.rich('deleteConfirm.desc', {
            amount: formatCurrency(selectedSettlement.amount, selectedSettlement.currency),
            payer: personName(selectedSettlement.payerId, selectedSettlement.payerName, true),
            payee: personName(selectedSettlement.payeeId, selectedSettlement.payeeName, true),
            subject: (chunks) => <strong>{chunks}</strong>,
          })}
          confirmText={t('deleteConfirm.confirmBtn')}
          cancelText={t('deleteConfirm.cancelBtn')}
          intent="danger"
          onConfirm={() => {
            if (selectedSettlement && onDelete) {
              onDelete(selectedSettlement);
            }
            setSelectedSettlement(null);
          }}
          onClose={() => setSelectedSettlement(null)}
        />
      )}
    </>
  );
};

export default SettlementHistoryTable;
