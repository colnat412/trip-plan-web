'use client';

import AppErrorState from '@/base/components/ui/AppErrorState';

import {
  AppLoadingState,
  AppEmptyState,
  AppFinanceRow,
  AppCategoryIcon,
} from '@/base/components/ui';

import { useState } from 'react';
import { Stack } from '@mui/material';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import { useLocale, useTranslations } from 'next-intl';

import { formatCurrency, formatDate } from '@/base/utils';
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
    size: 3,
  });

  if (isLoading || (isStale && !error)) {
    return <AppLoadingState />;
  }

  if (error) {
    return (
      <AppErrorState status={error.status} onRetry={() => refetch()} compact />
    );
  }
  if (!expenses.length) {
    return (
      <AppEmptyState
        icon={<ReceiptLongRoundedIcon />}
        title={tExpense('table.emptyTitle')}
        description={tExpense('table.emptyDesc')}
      />
    );
  }

  return (
    <>
      <Stack>
        {expenses.map((expense) => (
          <AppFinanceRow
            key={expense.id}
            icon={<AppCategoryIcon category={expense.category} />}
            title={expense.title}
            subtitle={`${expense.payerName || tOverview('defaultMember')} · ${formatDate(expense.expenseDate)}`}
            amount={formatCurrency(
              expense.amount,
              expense.currency || currency,
              locale,
            )}
            onClick={() => setSelectedExpense(expense)}
          />
        ))}
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
