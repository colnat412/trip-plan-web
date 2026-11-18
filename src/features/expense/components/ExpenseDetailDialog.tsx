'use client';

import { Avatar, Box, Stack, Typography, IconButton, Tooltip } from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { useLocale, useTranslations } from 'next-intl';
import {
  AppDialog, AppCard, AppCategoryIcon, AppFinanceRow,
  AppMetricValue, AppSectionHeader,
} from '@/base/components/ui';
import FinanceStyleProvider from '@/base/providers/FinanceStyleProvider';
import { formatCurrency, formatDateTime, getUserInitials } from '@/base/utils';
import ExpenseReceiptPreview from './ExpenseReceiptPreview';
import ExpensePayerBadge from './ExpensePayerBadge';
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
  const payerInSplits = expense.splits?.some(split => String(split.userId) === String(expense.payerId));

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
        paperSx={(theme) => {
          const palette = theme.vars?.palette ?? theme.palette;
          const canvas = `color-mix(in srgb, ${palette.primary.main} 6%, ${palette.background.default})`;
          return {
            '--app-finance-background': canvas,
            backgroundColor: canvas,
            '& .MuiDialogTitle-root': { minHeight: 64, py: 0, backgroundColor: canvas },
            '& .MuiCard-root[data-expense-summary]': {
              backgroundColor: `color-mix(in srgb, ${palette.primary.main} 5%, ${palette.background.paper})`,
            },
            '@media (forced-colors: active)': {
              '--app-finance-background': 'Canvas',
              backgroundColor: 'Canvas',
              '& .MuiDialogTitle-root': { backgroundColor: 'Canvas' },
              '& .MuiCard-root[data-expense-summary]': { backgroundColor: 'Canvas' },
            },
          };
        }}
        headerActions={!readOnly && (onEdit || onDelete) ? (
          <Stack direction="row" sx={{ alignItems: 'center' }}>
            {onEdit && (
              <Tooltip title={t('row.edit')}>
                <IconButton disabled={isDeleting} aria-label={t('row.edit')} onClick={() => { onClose(); onEdit(expense); }}
                  sx={{ width: 44, height: 44, flexShrink: 0, color: 'primary.main' }}>
                  <EditRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {onDelete && (
              <Tooltip title={t('row.delete')}>
                <IconButton disabled={isDeleting} aria-label={t('row.delete')} aria-busy={isDeleting || undefined}
                  onClick={() => onDelete(expense)}
                  sx={{ width: 44, height: 44, flexShrink: 0, color: 'error.main' }}>
                  <DeleteOutlineRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        ) : undefined}
      >
        <Stack spacing={2} sx={{ minWidth: 0 }}>
          <AppCard component="section" data-expense-summary sx={detailSectionSx}>
            <Stack spacing={1.5}>
              <Stack direction="row" useFlexGap spacing={1.5} sx={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography variant="body2" color="text.secondary">{formatDateTime(expense.expenseTime)}</Typography>
                <AppCategoryIcon category={expense.category} size={36} />
              </Stack>
              <Stack spacing={1} sx={{ minWidth: 0 }}>
                <Typography variant="body2" color="text.secondary">{t('table.colAmount')}</Typography>
                <AppMetricValue sx={{ fontSize: { xs: 32, sm: 40 }, lineHeight: 1.2 }}>
                  {money(expense.amount)}
                </AppMetricValue>
                <Typography variant="body2" color="text.secondary">{t(`categories.${expense.category}`)}</Typography>
              </Stack>
            </Stack>
          </AppCard>
          <AppCard component="section" sx={detailSectionSx}>
            <Stack spacing={1.5}>
              <AppSectionHeader
                title={t('dialog.paymentAndSplit')}
                subtitle={t(`dialog.splitMethods.${splitType}`)}
              />
              <Stack>
                {!payerInSplits && (
                  <AppFinanceRow
                    dense
                    icon={<Avatar src={expense.payerAvatarUrl || undefined} sx={{ width: 32, height: 32 }}>{getUserInitials(expense.payerName || '')}</Avatar>}
                    title={user?.id != null && String(user.id) === String(expense.payerId) ? t('form.you') : expense.payerName || '—'}
                    titleAdornment={<ExpensePayerBadge />}
                    subtitle={expense.payerEmail ? <Box component="span" sx={{ overflowWrap: 'anywhere' }}>{expense.payerEmail}</Box> : undefined}
                    amount={money(expense.amount)}
                  />
                )}
                {expense.splits?.length ? expense.splits.map((split) => {
                  const isPayer = String(split.userId) === String(expense.payerId);
                  const name = split.userName || (isPayer ? expense.payerName : null) || t('dialog.memberFallback', { id: split.userId });
                  const email = split.userEmail || (isPayer ? expense.payerEmail : null);
                  return (
                  <AppFinanceRow
                    key={split.id}
                    dense
                    icon={<Avatar src={split.userAvatarUrl || (isPayer ? expense.payerAvatarUrl : undefined) || undefined} sx={{ width: 32, height: 32 }}>{getUserInitials(name)}</Avatar>}
                    title={name}
                    titleAdornment={isPayer ? <ExpensePayerBadge /> : undefined}
                    subtitle={email ? <Box component="span" sx={{ overflowWrap: 'anywhere' }}>{email}</Box> : undefined}
                    amount={money(split.allocatedAmount)}
                    amountCaption={<Typography variant="caption" color="text.secondary">{expense.amount > 0 ? Math.round(split.allocatedAmount / expense.amount * 100) : 0}%</Typography>}
                  />
                  );
                }) : null}
              </Stack>
            </Stack>
          </AppCard>

          {expense.note && (
            <AppCard component="section" sx={detailSectionSx}>
              <Stack spacing={1.5}>
                <AppSectionHeader title={t('dialog.note')} />
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', lineHeight: 1.7 }}>{expense.note}</Typography>
              </Stack>
            </AppCard>
          )}
          {expense.receiptUrl && (
            <AppCard component="section" sx={detailSectionSx}>
              <ExpenseReceiptPreview key={expense.receiptUrl} src={expense.receiptUrl} />
            </AppCard>
          )}
        </Stack>
      </AppDialog>
    </FinanceStyleProvider>
  );
};

export default ExpenseDetailDialog;
