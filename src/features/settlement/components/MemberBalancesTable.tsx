'use client';

import React from 'react';
import {
  Avatar,
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useTranslations } from 'next-intl';

import { AppCard, AppFinanceRow, AppStatusChip } from '@/base/components/ui';
import { formatCurrency, getUserInitials } from '@/base/utils';
import type { MemberBalance } from '../types';

export interface MemberBalancesTableProps {
  memberBalances: MemberBalance[];
  currency: string;
}

const MemberBalancesTable = ({
  memberBalances,
  currency,
}: MemberBalancesTableProps) => {
  const t = useTranslations('settlement');

  return (
    <AppCard
      sx={{
        borderRadius: '20px',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography
          sx={{ fontSize: '16px', fontWeight: 700, color: 'text.primary' }}
        >
          {t('memberBalancesTitle')} ({memberBalances.length})
        </Typography>
      </Box>

      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
        {memberBalances.map((member) => (
          <AppFinanceRow
            key={member.userId}
            icon={
              <Avatar
                src={member.avatarUrl || undefined}
                sx={{ width: 40, height: 40 }}
              >
                {getUserInitials(member.name)}
              </Avatar>
            }
            title={member.name || t('defaultMember')}
            subtitle={
              <Stack spacing={0.5}>
                <span>
                  {t(
                    member.status === 'OWED'
                      ? 'statusOwed'
                      : member.status === 'OWES'
                        ? 'statusOwes'
                        : 'statusSettled',
                  )}
                </span>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    columnGap: 1.5,
                    rowGap: 0.5,
                  }}
                >
                  <Box component="span">
                    {t('paid')}:{' '}
                    <Box component="span" sx={{ whiteSpace: 'nowrap' }}>
                      {formatCurrency(member.totalPaid, currency)}
                    </Box>
                  </Box>
                  <Box component="span">
                    {t('owed')}:{' '}
                    <Box component="span" sx={{ whiteSpace: 'nowrap' }}>
                      {formatCurrency(member.totalOwed, currency)}
                    </Box>
                  </Box>
                </Box>
              </Stack>
            }
            amount={formatCurrency(Math.abs(member.netBalance), currency)}
            amountColor={
              member.status === 'OWED'
                ? 'success.main'
                : member.status === 'OWES'
                  ? 'error.main'
                  : 'text.secondary'
            }
          />
        ))}
      </Box>
      <TableContainer sx={{ display: { xs: 'none', sm: 'block' } }}>
        <Table sx={{ minWidth: 600 }}>
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
                {t('member')}
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
                {t('paid')}
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
                {t('owed')}
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
                {t('netBalance')}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  py: 1.5,
                  px: 2.5,
                  fontSize: '12px',
                  fontWeight: 700,
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                }}
              >
                {t('status')}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {memberBalances.map((m) => {
              const isOwed = m.status === 'OWED';
              const isOwes = m.status === 'OWES';

              const balanceColor = isOwed
                ? 'success.main'
                : isOwes
                  ? 'error.main'
                  : 'text.secondary';

              return (
                <TableRow
                  key={m.userId}
                  hover
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <TableCell sx={{ py: 2, px: 2.5 }}>
                    <Stack
                      direction="row"
                      spacing={1.5}
                      sx={{ alignItems: 'center' }}
                    >
                      <Avatar
                        src={m.avatarUrl || undefined}
                        sx={{
                          width: 36,
                          height: 36,
                          fontSize: '13px',
                          fontWeight: 700,
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                        }}
                      >
                        {getUserInitials(m.name || 'Member')}
                      </Avatar>
                      <Box>
                        <Typography
                          sx={{
                            fontSize: '14px',
                            fontWeight: 700,
                            color: 'text.primary',
                            lineHeight: 1.2,
                          }}
                        >
                          {m.name || t('defaultMember')}
                        </Typography>
                        {m.email && (
                          <Typography
                            sx={{ fontSize: '12px', color: 'text.secondary' }}
                          >
                            {m.email}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                  </TableCell>

                  <TableCell align="right" sx={{ py: 2, px: 2 }}>
                    <Typography
                      sx={{ fontSize: '13px', fontFamily: 'var(--font-mono)' }}
                    >
                      {formatCurrency(m.totalPaid, currency)}
                    </Typography>
                  </TableCell>

                  <TableCell align="right" sx={{ py: 2, px: 2 }}>
                    <Typography
                      sx={{ fontSize: '13px', fontFamily: 'var(--font-mono)' }}
                    >
                      {formatCurrency(m.totalOwed, currency)}
                    </Typography>
                  </TableCell>

                  <TableCell align="right" sx={{ py: 2, px: 2 }}>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                        color: balanceColor,
                      }}
                    >
                      {m.netBalance > 0
                        ? `+${formatCurrency(m.netBalance, currency)}`
                        : formatCurrency(m.netBalance, currency)}
                    </Typography>
                  </TableCell>

                  <TableCell align="center" sx={{ py: 2, px: 2.5 }}>
                    <AppStatusChip
                      tone={isOwed ? 'success' : isOwes ? 'error' : 'neutral'}
                      label={t(
                        isOwed
                          ? 'statusOwed'
                          : isOwes
                            ? 'statusOwes'
                            : 'statusSettled',
                      )}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </AppCard>
  );
};

export default MemberBalancesTable;
