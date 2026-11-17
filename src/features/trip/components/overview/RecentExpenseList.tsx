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

import { formatCurrency, formatDateTime } from '@/base/utils';
import useTripExpenses from '@/features/expense/hooks/useTripExpenses';
import ExpenseDetailDialog from '@/features/expense/components/ExpenseDetailDialog';
import { useUserContext } from '@/features/user/context/UserContext';
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
  const { user } = useUserContext();
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
      />
    );
  }

  return (
    <>
      <Stack>
        {expenses.map((expense) => (
          <AppFinanceRow
            key={expense.id}
            dense
            icon={<AppCategoryIcon category={expense.category} size={32} />}
            title={expense.title}
            subtitle={`${user?.id != null && String(user.id) === String(expense.payerId) ? tExpense('row.youPaid') : expense.payerName || tOverview('defaultMember')} · ${formatDateTime(expense.expenseTime)}`}
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
