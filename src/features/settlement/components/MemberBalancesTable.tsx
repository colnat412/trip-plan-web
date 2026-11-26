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

import { AppCard, AppEmptyState, AppFilterChipGroup, AppSectionHeader, AppStatusChip, AppPagination } from '@/base/components/ui';
import { formatCurrency, getUserInitials } from '@/base/utils';
import { useUserContext } from '@/features/user/context/UserContext';
import type { BalanceStatus, MemberBalance, MemberBalanceFilter, SettlementPagination } from '../types';
import { settlementRowStyles as rowStyles } from './settlement-row.styles';

export interface MemberBalancesTableProps {
  memberBalances: MemberBalance[];
  currency: string;
  balanceFilter: MemberBalanceFilter;
  onFilterChange: (value: MemberBalanceFilter) => void;
  pagination: SettlementPagination;
  onPageChange: (page: number) => void;
}

const MemberBalancesTable = ({
  memberBalances,
  currency, balanceFilter, onFilterChange, pagination, onPageChange,
}: MemberBalancesTableProps) => {
  const t = useTranslations('settlement');
  const { user } = useUserContext();
  const visibleMembers = memberBalances;

  return (
    <AppCard component="section" sx={{ p: { xs: 2.5, sm: 3 }, minWidth: 0 }}>
    <Stack spacing={2} sx={{ width: '100%', minWidth: 0 }}>
      <AppSectionHeader title={t('memberBalancesTitle')} count={pagination.totalElements} />
      <Box role="group" aria-label={t('balanceFilters.label')} sx={{ minWidth: 0 }}>
        <AppFilterChipGroup<BalanceStatus | 'ALL'>
          compact
          showAll={false}
          allValue="ALL"
          value={balanceFilter}
          onChange={onFilterChange}
          options={[
            { value: 'ALL', label: t('balanceFilters.all') },
            { value: 'OWES', label: t('balanceFilters.owes') },
            { value: 'OWED', label: t('balanceFilters.owed') },
          ]}
        />
      </Box>
      <Box sx={{ width: '100%', minWidth: 0, overflow: 'hidden' }}>
        {visibleMembers.length === 0 ? (
          <Box sx={{ p: 2.5 }}>
            <AppEmptyState title={t('balanceFilters.empty')} compact />
          </Box>
        ) : (
          <>
            <Box role="list" sx={{ display: { xs: 'block', sm: 'none' } }}>
              {visibleMembers.map((member) => {
                const name = user?.id != null && String(user.id) === String(member.userId) ? t('you') : member.name || t('defaultMember');
                const status = t(member.status === 'OWED' ? 'statusOwed' : member.status === 'OWES' ? 'statusOwes' : 'statusSettled');
                const paid = `${t('paid')}: ${formatCurrency(member.totalPaid, currency)}`;
                const share = `${t('owed')}: ${formatCurrency(member.totalOwed, currency)}`;
                return <Stack key={member.userId} role="listitem" direction="row" sx={{
                  ...rowStyles.row, borderBottom: 1, borderColor: 'divider',
                  '&:last-child': { borderBottom: 0 },
                }}>
                  <Avatar src={member.avatarUrl || undefined} sx={rowStyles.avatar}>{getUserInitials(member.name)}</Avatar>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flex: 1, minWidth: 0 }}>
                    <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
                      <Typography noWrap title={name} sx={rowStyles.primary}>{name}</Typography>
                      <Typography title={paid} sx={{ ...rowStyles.secondary, overflowWrap: 'anywhere', fontVariantNumeric: 'tabular-nums' }}>{paid}</Typography>
                      <Typography title={share} sx={{ ...rowStyles.secondary, overflowWrap: 'anywhere', fontVariantNumeric: 'tabular-nums' }}>{share}</Typography>
                    </Stack>
                    <Stack spacing={0.5} sx={{ alignItems: 'flex-end', flexShrink: 0, maxWidth: '48%', minWidth: 0 }}>
                      <Typography sx={{
                        ...rowStyles.amount, whiteSpace: 'normal', overflowWrap: 'anywhere', textAlign: 'right',
                        color: member.status === 'OWED' ? 'success.main' : member.status === 'OWES' ? 'error.main' : 'text.secondary',
                      }}>{formatCurrency(Math.abs(member.netBalance), currency)}</Typography>
                      <AppStatusChip tone={member.status === 'OWED' ? 'success' : member.status === 'OWES' ? 'error' : 'neutral'}
                        label={status} sx={{ alignSelf: 'flex-end', width: 'fit-content' }} />
                    </Stack>
                  </Box>
                </Stack>;
              })}
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
                  {visibleMembers.map((m) => {
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
                                {user?.id != null && String(user.id) === String(m.userId) ? t('you') : m.name || t('defaultMember')}
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
          </>
        )}
      </Box>
      {pagination.totalPages > 1 && <AppPagination size="small" page={pagination.page + 1} count={pagination.totalPages} onChange={(_, value) => onPageChange(value - 1)} />}
    </Stack>
    </AppCard>
  );
};

export default MemberBalancesTable;
