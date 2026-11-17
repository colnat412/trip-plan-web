'use client';

import React, { useMemo } from 'react';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import { useTranslations, useLocale } from 'next-intl';

import {
  AppCategoryIcon,
  AppFinanceRow,
  AppButton,
  AppTable,
  AppSectionHeader,
  type AppTableColumn,
  type ColumnFilterValue,
  type TableSortState,
} from '@/base/components/ui';
import { TRIP_CATEGORIES } from '@/base/constants';
import { formatCurrency, formatDate, formatDateTime } from '@/base/utils';
import { useUserContext } from '@/features/user/context/UserContext';
import type { Expense, Pagination, DailySpending } from '../types';

export interface ExpenseTableProps {
  expenses: Expense[];
  dailyTotals?: DailySpending[];
  isLoading?: boolean;
  isFetching?: boolean;
  pagination?: Pagination | null;
  onPageChange?: (newPage: number) => void;
  onAddNew?: () => void;
  onViewDetail?: (expense: Expense) => void;
  sort?: TableSortState | null;
  onSortChange?: (sort: TableSortState | null) => void;
  filters?: Record<string, ColumnFilterValue>;
  onFilterChange?: (filters: Record<string, ColumnFilterValue>) => void;
  tableMaxHeight?: number | string;
  readOnly?: boolean;
}

const ExpenseTable = ({
  expenses,
  dailyTotals,
  isLoading,
  isFetching = false,
  pagination,
  onPageChange,
  onAddNew,
  onViewDetail,
  sort,
  onSortChange,
  filters,
  onFilterChange,
  tableMaxHeight,
  readOnly = false,
}: ExpenseTableProps) => {
  const t = useTranslations('expense');
  const locale = useLocale();
  const { user } = useUserContext();
  const tTable = useTranslations('expense.table');

  const page = pagination?.page ?? 0;
  const size = pagination?.size ?? 10;
  const totalElements = pagination?.totalElements ?? expenses.length;

  const columns: AppTableColumn<Expense>[] = useMemo(
    () => [
      {
        id: 'expenseTime',
        label: tTable('colDate'),
        sortable: true,
        getValue: (e) => e.expenseTime,
        renderCell: (expense) => (
          <Typography
            sx={{
              fontSize: '13px',
              lineHeight: 1.5,
              color: 'text.secondary',
              fontFamily: 'var(--font-mono)',
              whiteSpace: 'nowrap',
            }}
          >
            {formatDateTime(expense.expenseTime)}
            {dailyTotals?.filter(day => day.date === expense.expenseTime.slice(0, 10)).map(day => (
              <Box component="span" key={day.currency} sx={{ display: 'block', fontSize: '12px', fontWeight: 600 }}>{formatCurrency(day.amount, day.currency, locale)}</Box>
            ))}
          </Typography>
        ),
      },
      {
        id: 'title',
        label: tTable('colExpense'),
        // sortable: true,
        filterable: true,
        filterType: 'text',
        filterPlaceholder: tTable('filterExpensePlaceholder'),
        getValue: (e) => e.title,
        renderCell: (expense) => (
          <Stack spacing={0.25}>
            <Typography
              sx={{
                fontSize: '15px',
                lineHeight: 1.5,
                fontWeight: 700,
                color: 'text.primary',
                '&:hover': onViewDetail
                  ? { color: 'primary.main', textDecoration: 'underline' }
                  : undefined,
              }}
            >
              {expense.title}
            </Typography>
            {expense.note && (
              <Typography
                sx={{
                  fontSize: '13px',
                  color: 'text.secondary',
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {expense.note}
              </Typography>
            )}
          </Stack>
        ),
      },
      {
        id: 'category',
        label: tTable('colCategory'),
        // sortable: true,
        filterable: true,
        filterType: 'select',
        filterOptions: TRIP_CATEGORIES.map((category) => ({
          label: t(`categories.${category}`),
          value: category,
        })),
        getValue: (e) => e.category,
        renderCell: (expense) => (
          <Typography variant="body2" color="text.secondary">{t(`categories.${expense.category}`)}</Typography>
        ),
      },
      {
        id: 'payer',
        label: tTable('colPayer'),
        // sortable: true,
        filterable: true,
        filterType: 'text',
        filterPlaceholder: tTable('filterPayerPlaceholder'),
        getValue: (e) => e.payerName || '',
        renderCell: (expense) => (
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Avatar
              src={expense.payerAvatarUrl || undefined}
              alt={expense.payerName || 'Payer'}
              sx={{
                width: 28,
                height: 28,
                fontSize: '12px',
                fontWeight: 700,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
              }}
            >
              {expense.payerName
                ? expense.payerName.charAt(0).toUpperCase()
                : 'U'}
            </Avatar>
            <Stack spacing={0}>
              <Typography
                sx={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'text.primary',
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                }}
              >
                {user?.id != null && String(user.id) === String(expense.payerId) ? t('row.youPaid') : expense.payerName || '—'}
              </Typography>
              {expense.payerEmail && (
                <Typography
                  sx={{
                    fontSize: '11px',
                    color: 'text.secondary',
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {expense.payerEmail}
                </Typography>
              )}
            </Stack>
          </Stack>
        ),
      },
      {
        id: 'splitType',
        label: tTable('colSplit'),
        filterable: true,
        filterType: 'select',
        filterOptions: [
          { label: t('splits.EQUAL'), value: 'EQUAL' },
          { label: t('splits.EXACT_AMOUNT'), value: 'EXACT_AMOUNT' },
          { label: t('splits.PERCENTAGE'), value: 'PERCENTAGE' },
          { label: t('splits.SHARE'), value: 'SHARE' },
        ],
        getValue: (e) => e.splitType,
        renderCell: (expense) => {
          const splitSummary =
            expense.splitType in
            { EQUAL: 1, EXACT_AMOUNT: 1, PERCENTAGE: 1, SHARE: 1 }
              ? t(
                  `splits.${expense.splitType as 'EQUAL' | 'EXACT_AMOUNT' | 'PERCENTAGE' | 'SHARE'}`,
                )
              : t('splits.EQUAL');
          const participantCount = expense.splits?.length || 1;

          return (
            <Stack spacing={0.25}>
              <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
                {splitSummary}
              </Typography>
              <Typography sx={{ fontSize: '12px', color: 'text.disabled' }}>
                {t('row.membersCount', { count: participantCount })}
              </Typography>
            </Stack>
          );
        },
      },
      {
        id: 'amount',
        label: tTable('colAmount'),
        align: 'right',
        sortable: true,
        getValue: (e) => e.amount,
        renderCell: (expense) => (
          <Typography
            sx={{
              fontSize: '16px',
              lineHeight: 1.5,
              fontWeight: 700,
              color: 'text.primary',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {formatCurrency(expense.amount, expense.currency)}
          </Typography>
        ),
      },
    ],
    [t, tTable, onViewDetail, user, dailyTotals, locale],
  );

  return (
    <AppTable<Expense>
      surface="plain"
      sx={{ border: 0 }}
      columns={onFilterChange ? columns : columns.map(column => ({ ...column, filterable: false, sortable: false }))}
      renderMobileRow={(expense, index, rows) => (
        <Box sx={{ px: 0, borderBottom: 1, borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}>
          {(index === 0 ||
            rows[index - 1].expenseTime.slice(0, 10) !== expense.expenseTime.slice(0, 10)) && (
            <Stack direction="row" useFlexGap sx={{ justifyContent: 'space-between', alignItems: 'baseline', gap: 1, pt: 1.5, flexWrap: 'wrap' }}>
              <Typography sx={{ fontSize: '13px', color: 'text.secondary', fontWeight: 600 }}>{formatDate(expense.expenseTime.slice(0, 10))}</Typography>
              {dailyTotals?.filter(day => day.date === expense.expenseTime.slice(0, 10)).map(day => (
                <Typography key={day.currency} aria-label={`${tTable('dayTotal')}: ${formatCurrency(day.amount, day.currency, locale)}`}
                  sx={{ fontSize: '13px', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(day.amount, day.currency, locale)}</Typography>
              ))}
            </Stack>
          )}
          <AppFinanceRow
            dense
            icon={<AppCategoryIcon category={expense.category} size={32} />}
            title={expense.title}
            subtitle={[
              user?.id != null && String(user.id) === String(expense.payerId) ? t('row.youPaid') : expense.payerName || '—',
              expense.expenseTime.slice(11, 16),
            ].filter(Boolean).join(' · ')}
            amount={formatCurrency(expense.amount, expense.currency)}
            onClick={onViewDetail ? () => onViewDetail(expense) : undefined}
          />
        </Box>
      )}
      data={expenses}
      isLoading={isLoading}
      isFetching={isFetching}
      onRowClick={onViewDetail}
      sort={sort}
      onSortChange={onSortChange}
      filters={filters}
      onFilterChange={onFilterChange}
      tableMaxHeight={tableMaxHeight}
      header={
        <AppSectionHeader
          title={tTable('titleLabel')}
          count={totalElements}
          stackActionsOnMobile
          sx={{
            px: 0, py: 2,
          }}
          actions={
            !readOnly && onAddNew ? (
              <AppButton
                intent="primary"
                size="small"
                startIcon={<AddRoundedIcon fontSize="small" />}
                onClick={onAddNew}
              >
                {tTable('addExpense')}
              </AppButton>
            ) : undefined
          }
        />
      }
      pagination={
        totalElements > 0 && onPageChange
          ? {
              page,
              pageSize: size,
              totalCount: totalElements,
              onPageChange,
              pageSizeOptions: [size],
            }
          : null
      }
      emptyState={{
        icon: <ReceiptLongRoundedIcon sx={{ fontSize: 44 }} />,
        title: tTable('emptyTitle'),
        actionLabel: !readOnly && onAddNew ? tTable('addFirst') : undefined,
        onAction: !readOnly ? onAddNew : undefined,
      }}
    />
  );
};

export default ExpenseTable;
