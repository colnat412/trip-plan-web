'use client';

import { Avatar, Box, Stack, Typography, IconButton, Tooltip } from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { useLocale, useTranslations } from 'next-intl';
import {
  AppDialog, AppButton, AppFinanceRow,
  AppMetricValue, AppSectionHeader,
} from '@/base/components/ui';
import FinanceStyleProvider from '@/base/providers/FinanceStyleProvider';
import { formatCurrency, formatDate, getUserInitials } from '@/base/utils';
import ExpenseReceiptPreview from './ExpenseReceiptPreview';
import type { Expense } from '../types';
import { useUserContext } from '@/features/user/context/UserContext';

const detailSectionSx = { minWidth: 0 };

export interface ExpenseDetailDialogProps {
  open: boolean;
  expense: Expense | null;
  onClose: () => void;
  onEdit?: (expense: Expense) => void;
  readOnly?: boolean;
  onDelete?: (expense: Expense) => void;
  isDeleting?: boolean;
}

const ExpenseDetailDialog = ({ open, expense, onClose, onEdit, onDelete, isDeleting = false, readOnly = false }: ExpenseDetailDialogProps) => {
  const t = useTranslations('expense');
  const locale = useLocale();
  const { user } = useUserContext();
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
        closeDisabled={isDeleting}
        title={expense.title}
        titleAlign="left"
        maxWidth="sm"
        headerActions={onEdit && !readOnly ? (
          <Tooltip title={t('row.edit')}>
            <IconButton disabled={isDeleting} aria-label={t('row.edit')} onClick={() => { onClose(); onEdit(expense); }}
              sx={{ width: 44, height: 44, flexShrink: 0, color: 'primary.main' }}>
              <EditRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : undefined}
      >
        <Stack spacing={3} sx={{ minWidth: 0 }}>
          <Box component="section" sx={detailSectionSx}>
            <Stack spacing={3}>
              <Stack direction="row" useFlexGap spacing={1.5} sx={{ justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                <Typography variant="body2" color="text.secondary">{formatDate(expense.expenseDate)}</Typography>
              </Stack>
              <Stack spacing={1} sx={{ minWidth: 0 }}>
                <Typography variant="body2" color="text.secondary">{t('table.colAmount')}</Typography>
                <AppMetricValue sx={{ fontSize: { xs: 32, sm: 40 }, lineHeight: 1.2 }}>
                  {money(expense.amount)}
                </AppMetricValue>
                <Typography variant="body2" color="text.secondary">{t(`categories.${expense.category}`)}</Typography>
              </Stack>
            </Stack>
            <Box sx={{
              borderTop: 1, borderColor: 'divider', mt: 3, pt: 2.5,
            }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{t('dialog.paidBy')}</Typography>
              <AppFinanceRow
                icon={<Avatar src={expense.payerAvatarUrl || undefined} sx={{ width: 40, height: 40 }}>{getUserInitials(expense.payerName || '')}</Avatar>}
                title={user?.id != null && String(user.id) === String(expense.payerId) ? t('row.youPaid') : expense.payerName || '—'}
                subtitle={expense.payerEmail}
                amount={money(expense.amount)}
              />
            </Box>
          </Box>

          <Box component="section" sx={detailSectionSx}>
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
          </Box>

          {expense.note && (
            <Box component="section" sx={detailSectionSx}>
              <Stack spacing={1.5}>
                <AppSectionHeader title={t('dialog.note')} />
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', lineHeight: 1.7 }}>{expense.note}</Typography>
              </Stack>
            </Box>
          )}
          {expense.receiptUrl && <ExpenseReceiptPreview key={expense.receiptUrl} src={expense.receiptUrl} />}
          {onDelete && !readOnly && (
            <AppButton type="button" intent="text" loading={isDeleting} onClick={() => onDelete(expense)}
              startIcon={<DeleteOutlineRoundedIcon />} sx={{ alignSelf: 'center', color: 'error.main' }}>
              {t('row.delete')}
            </AppButton>
          )}
        </Stack>
      </AppDialog>
    </FinanceStyleProvider>
  );
};

export default ExpenseDetailDialog;
