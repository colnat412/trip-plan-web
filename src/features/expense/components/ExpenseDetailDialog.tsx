'use client';

import { Avatar, Box, Stack, Typography } from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useLocale, useTranslations } from 'next-intl';
import {
  AppDialog, AppButton, AppCard, AppCategoryChip, AppFinanceRow,
  AppMetricValue, AppSectionHeader,
} from '@/base/components/ui';
import FinanceStyleProvider from '@/base/providers/FinanceStyleProvider';
import { formatCurrency, formatDate, getUserInitials } from '@/base/utils';
import ExpenseReceiptPreview from './ExpenseReceiptPreview';
import type { Expense } from '../types';

const detailCardSx = { p: { xs: 2.5, sm: 3 }, minWidth: 0 };

export interface ExpenseDetailDialogProps {
  open: boolean;
  expense: Expense | null;
  onClose: () => void;
  onEdit?: (expense: Expense) => void;
  readOnly?: boolean;
}

const ExpenseDetailDialog = ({ open, expense, onClose, onEdit, readOnly = false }: ExpenseDetailDialogProps) => {
  const t = useTranslations('expense');
  const locale = useLocale();
  if (!expense) return null;
  const splitType = ['EQUAL', 'EXACT_AMOUNT', 'PERCENTAGE', 'SHARE'].includes(expense.splitType)
    ? expense.splitType : 'EQUAL';
  const money = (amount: number) => formatCurrency(amount, expense.currency, locale);

  return (
    <FinanceStyleProvider surface={false}>
      <AppDialog
        mobilePresentation="screen"
        open={open}
        onClose={onClose}
        title={t('dialog.detailTitle')}
        maxWidth="sm"
        actions={onEdit && !readOnly ? (
          <AppButton
            intent="primary"
            data-dialog-action="primary"
            wrapLabel
            startIcon={<EditRoundedIcon fontSize="small" />}
            onClick={() => { onClose(); onEdit(expense); }}
          >
            {t('row.edit')}
          </AppButton>
        ) : undefined}
      >
        <Stack spacing={3} sx={{ minWidth: 0 }}>
          <AppCard component="section" sx={detailCardSx}>
            <Stack spacing={3}>
              <Stack direction="row" useFlexGap spacing={1.5} sx={{ justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                <Typography component="h3" sx={{ fontSize: { xs: 20, sm: 24 }, fontWeight: 700, overflowWrap: 'anywhere', minWidth: 0 }}>
                  {expense.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">{formatDate(expense.expenseDate)}</Typography>
              </Stack>
              <Stack spacing={1} sx={{ minWidth: 0 }}>
                <Typography variant="body2" color="text.secondary">{t('table.colAmount')}</Typography>
                <AppMetricValue sx={{ fontSize: { xs: 32, sm: 40 }, lineHeight: 1.2 }}>
                  {money(expense.amount)}
                </AppMetricValue>
                <AppCategoryChip category={expense.category} />
              </Stack>
            </Stack>
            <Box sx={{
              position: 'relative', borderTop: '1px dashed', borderColor: 'divider', mt: 3, pt: 2.5,
              '&::before, &::after': {
                content: '""', position: 'absolute', top: -10, width: 20, height: 20,
                borderRadius: '50%', bgcolor: 'var(--app-finance-background)',
              },
              '&::before': { left: { xs: -30, sm: -34 } },
              '&::after': { right: { xs: -30, sm: -34 } },
            }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{t('dialog.paidBy')}</Typography>
              <AppFinanceRow
                icon={<Avatar src={expense.payerAvatarUrl || undefined} sx={{ width: 40, height: 40 }}>{getUserInitials(expense.payerName || '')}</Avatar>}
                title={expense.payerName || '—'}
                subtitle={expense.payerEmail}
                amount={money(expense.amount)}
              />
            </Box>
          </AppCard>

          <AppCard component="section" sx={detailCardSx}>
            <Stack spacing={1.5}>
              <AppSectionHeader
                title={t('dialog.splitBreakdown', { count: expense.splits?.length || 0 })}
                subtitle={t(`splits.${splitType}`)}
              />
              <Stack>
                {expense.splits?.length ? expense.splits.map((split) => (
                  <AppFinanceRow
                    key={split.id}
                    icon={<Avatar src={split.userAvatarUrl || undefined} sx={{ width: 40, height: 40 }}>{getUserInitials(split.userName || '')}</Avatar>}
                    title={split.userName || t('dialog.memberFallback', { id: split.userId })}
                    subtitle={
                      <Stack spacing={0.25}>
                        <Typography component="span" variant="body2" sx={(theme) => ({
                          color: split.settled ? 'success.dark' : 'warning.dark',
                          ...theme.applyStyles('dark', { color: split.settled ? 'success.light' : 'warning.light' }),
                        })}>
                          {t(split.settled ? 'dialog.settled' : 'dialog.pending')}
                        </Typography>
                        {split.userEmail && <Box component="span" sx={{ overflowWrap: 'anywhere' }}>{split.userEmail}</Box>}
                      </Stack>
                    }
                    amount={money(split.allocatedAmount)}
                    amountCaption={<Typography variant="caption" color="text.secondary">{expense.amount > 0 ? Math.round(split.allocatedAmount / expense.amount * 100) : 0}%</Typography>}
                  />
                )) : <Typography sx={{ py: 2, textAlign: 'center', color: 'text.secondary' }}>—</Typography>}
              </Stack>
            </Stack>
          </AppCard>

          {expense.note && (
            <AppCard component="section" sx={detailCardSx}>
              <Stack spacing={1.5}>
                <AppSectionHeader title={t('dialog.note')} />
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', lineHeight: 1.7 }}>{expense.note}</Typography>
              </Stack>
            </AppCard>
          )}
          {expense.receiptUrl && <ExpenseReceiptPreview key={expense.receiptUrl} src={expense.receiptUrl} />}
        </Stack>
      </AppDialog>
    </FinanceStyleProvider>
  );
};

export default ExpenseDetailDialog;
