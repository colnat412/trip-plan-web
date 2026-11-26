'use client';

import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import UndoRoundedIcon from '@mui/icons-material/UndoRounded';
import { useTranslations } from 'next-intl';

import { AppConfirmDialog, AppEmptyState, AppButton } from '@/base/components/ui';
import { formatCurrency, formatDateTime, getUserInitials } from '@/base/utils';
import { useUserContext } from '@/features/user/context/UserContext';
import type { Settlement, SettlementAction } from '../types';
import { settlementRowStyles as rowStyles } from './settlement-row.styles';

export interface SettlementHistoryTableProps {
  settlements: Settlement[];
  onRespond?: (settlement: Settlement, action: SettlementAction) => void;
  busy?: boolean;
  canDelete?: (settlement: Settlement) => boolean;
  onDelete?: (settlement: Settlement) => void;
}

const SettlementHistoryTable = ({
  settlements,
  canDelete,
  onDelete,
  onRespond, busy = false,
}: SettlementHistoryTableProps) => {
  const t = useTranslations('settlement');
  const { user } = useUserContext();
  const personName = (id: string, name: string | null, inSentence = false) =>
    user?.id != null && String(user.id) === String(id) ? t(inSentence ? 'youInSentence' : 'you') : name || '—';
  const [selectedSettlement, setSelectedSettlement] =
    useState<Settlement | null>(null);

  const statusChip = (item: Settlement) => <Chip size="small" label={t(`statuses.${item.status}`)}
    color={item.status === 'CONFIRMED' ? 'success' : item.status === 'PENDING' || item.status === 'DELETE_PENDING' ? 'warning' : 'default'}
    sx={{ height: 20, fontSize: '11px', fontWeight: 600, borderRadius: 'var(--app-radius-badge)', flexShrink: 0, maxWidth: '100%' }} />;
  const deleteAction = (item: Settlement) => item.status === 'PENDING' && onDelete && canDelete?.(item) ? (
    <AppButton intent="text" size="small" wrapLabel startIcon={<UndoRoundedIcon fontSize="small" />}
      disabled={busy} onClick={() => setSelectedSettlement(item)} sx={{ minHeight: 44, color: 'text.secondary' }}>
      {t('actions.cancelPayment')}
    </AppButton>
  ) : null;
  const actions = (item: Settlement) => {
    const pending = item.status === 'PENDING';
    const legacyDeletion = item.status === 'DELETE_PENDING';
    const canRespond = (pending || legacyDeletion) && onRespond && (String(user?.id) === item.confirmationUserId || String(user?.id) === item.createdBy);
    const deletion = deleteAction(item);
    if (!canRespond && !deletion) return null;
    return <Stack direction="row" useFlexGap spacing={1} sx={{
      flexWrap: 'wrap', justifyContent: 'flex-end', minWidth: 0,
      '& > .MuiButton-root': { flex: { xs: '1 1 auto', sm: '0 0 auto' }, minHeight: 44 },
    }}>
      {pending && String(user?.id) === item.confirmationUserId && onRespond && <>
        <AppButton intent="primary" size="small" wrapLabel disabled={busy} onClick={() => onRespond(item, 'APPROVE')}>{t('actions.approve')}</AppButton>
        <AppButton intent="danger" size="small" wrapLabel disabled={busy} onClick={() => onRespond(item, 'REJECT')}>{t('actions.reject')}</AppButton>
      </>}
      {legacyDeletion && String(user?.id) === item.createdBy && onRespond && <AppButton intent="secondary" size="small" wrapLabel disabled={busy}
        onClick={() => onRespond(item, 'CANCEL')}>{t('actions.cancelDeletion')}</AppButton>}
      {deletion}
    </Stack>;
  };

  if (settlements.length === 0) {
    return <AppEmptyState title={t('historyEmpty')} />;
  }

  return (
    <>
      <Box sx={{ width: '100%', minWidth: 0, overflow: 'hidden' }}>
        <Box role="list" sx={{ display: { xs: 'block', sm: 'none' } }}>
          {settlements.map((settlement) => {
            const title = `${personName(settlement.payerId, settlement.payerName)} → ${personName(settlement.payeeId, settlement.payeeName)}`;
            const date = formatDateTime(settlement.settledAt);
            const method = t(settlement.paymentMethod === 'BANK_TRANSFER' ? 'methodBank' : settlement.paymentMethod === 'CASH' ? 'methodCash' : 'methodOther');
            return (
              <Stack key={settlement.id} role="listitem" spacing={1} sx={{ py: 1.25, minWidth: 0,
                borderBottom: 1, borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}>
                <Box sx={{ ...rowStyles.row, alignItems: 'flex-start', minHeight: 0, py: 0 }}>
                <Avatar src={settlement.payerAvatarUrl || undefined} sx={rowStyles.avatar}>{getUserInitials(settlement.payerName || '')}</Avatar>
                <Box sx={rowStyles.identity}>
                  <Box sx={{ ...rowStyles.heading, alignItems: 'flex-start' }}>
                    <Box sx={{ ...rowStyles.identity }}>
                      <Typography sx={{ ...rowStyles.primary, overflowWrap: 'anywhere' }}>{title}</Typography>
                      <Typography sx={rowStyles.secondary}>{date}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, flexShrink: 0, width: '46%', minWidth: 0 }}>
                      <Stack spacing={0.25} sx={{ alignItems: 'flex-end', flex: 1, minWidth: 0 }}>
                        <Typography sx={{ ...rowStyles.amount, whiteSpace: 'normal', overflowWrap: 'anywhere', textAlign: 'right' }}>{formatCurrency(settlement.amount, settlement.currency)}</Typography>
                        <Typography sx={{ ...rowStyles.secondary, textAlign: 'right' }}>{method}</Typography>
                        {statusChip(settlement)}
                      </Stack>
                    </Box>
                  </Box>
                  {settlement.note && <Typography sx={{ ...rowStyles.secondary, overflowWrap: 'anywhere' }}>{settlement.note}</Typography>}
                </Box>
                </Box>
                {actions(settlement)}
              </Stack>
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
                {(onDelete || onRespond) && (
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
                      useFlexGap
                      spacing={1}
                      sx={{ alignItems: 'center', flexWrap: 'wrap', minWidth: 0 }}
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
                      {statusChip(s)}
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

                  {(onDelete || onRespond) && (
                    <TableCell align="right" sx={{ py: 1.75, px: 2.5 }}>
                      {actions(s)}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {selectedSettlement && (
        <AppConfirmDialog
          open={Boolean(selectedSettlement)}
          loading={busy}
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
            if (!busy && selectedSettlement?.status === 'PENDING' && canDelete?.(selectedSettlement) && onDelete) {
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
