'use client';

import React, { useState } from 'react';
import { Alert, Box, Stack, Typography, Skeleton, ButtonBase } from '@mui/material';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import { useLocale, useTranslations } from 'next-intl';
import { AppButton, AppEmptyState, AppMetricValue } from '@/base/components/ui';
import { formatCurrency, formatDate } from '@/base/utils';
import { CATEGORY_CONFIG } from '@/base/components/ui/AppCategoryChip';
import useTripExpenses from '@/features/expense/hooks/useTripExpenses';
import ExpenseDetailDialog from '@/features/expense/components/ExpenseDetailDialog';
import type { Expense } from '@/features/expense/types';

export interface RecentExpenseListProps {
  tripId?: number | string;
  currency?: string;
}

const RecentExpenseList = ({
  tripId,
  currency = 'VND',
}: RecentExpenseListProps) => {
  const locale = useLocale();
  const tExpense = useTranslations('expense');
  const tOverview = useTranslations('overview');
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const { expenses, isLoading, isStale, error, refetch } = useTripExpenses({
    tripId,
    page: 0,
    size: 5,
  });

  if (isLoading || (isStale && !error)) {
    return (
      <Stack spacing={1.5}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Stack
            key={i}
            direction="row"
            spacing={1.5}
            sx={{ alignItems: 'center', py: 1.5 }}
          >
            <Skeleton
              variant="rounded"
              width={40}
              height={40}
              sx={{
                borderRadius: '12px',
              }}
            />
            <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="40%" height={16} />
            </Stack>
            <Skeleton variant="text" width={70} height={22} />
          </Stack>
        ))}
      </Stack>
    );
  }

  if (error) {
    return <Alert severity="error" action={
      <AppButton intent="text" size="small" onClick={() => void refetch().catch(() => undefined)}>
        {tOverview('retry')}
      </AppButton>
    }>{tOverview('recentError')}</Alert>;
  }
  if (!expenses.length) {
    return <AppEmptyState icon={<ReceiptLongRoundedIcon />}
      title={tExpense('table.emptyTitle')} description={tExpense('table.emptyDesc')} />;
  }

  return (
    <>
      <Stack>
        {expenses.map((expense, index) => {
          const config =
            CATEGORY_CONFIG[expense.category] || CATEGORY_CONFIG.OTHER;
          const payerText = expense.payerName || tOverview('defaultMember');
          const dateText = formatDate(expense.expenseDate, 'DD/MM');

          return (
            <ButtonBase
              key={expense.id}
              onClick={() => setSelectedExpense(expense)}
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-start',
                textAlign: 'left',
                borderRadius: 0,
                px: 0.5,
                py: 0.75,
                borderBottom: index < expenses.length - 1 ? 1 : 0,
                borderColor: 'divider',
                transition: 'background-color 0.15s',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <Stack
                direction="row"
                spacing={1.5}
                sx={{
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    borderRadius: '12px',
                    color: config.color,
                    bgcolor: config.bg,
                    '& svg': { fontSize: '22px' },
                  }}
                >
                  {config.icon}
                </Box>
                <Stack spacing={0.25} sx={{ minWidth: 0, flexGrow: 1 }}>
                  <Typography
                    noWrap
                    sx={{
                      color: 'text.primary',
                      fontSize: '14px',
                      fontWeight: 700,
                    }}
                  >
                    {expense.title}
                  </Typography>
                  <Typography
                    noWrap
                    sx={{ color: 'text.secondary', fontSize: '11px' }}
                  >
                    {payerText} · {dateText}
                  </Typography>
                </Stack>
                <AppMetricValue sx={{ flexShrink: 0, fontSize: '14px' }}>
                  {formatCurrency(expense.amount, expense.currency || currency, locale)}
                </AppMetricValue>
              </Stack>
            </ButtonBase>
          );
        })}
      </Stack>

      <ExpenseDetailDialog
        open={Boolean(selectedExpense)}
        expense={selectedExpense}
        onClose={() => setSelectedExpense(null)}
      />
    </>
  );
};

export default RecentExpenseList;
