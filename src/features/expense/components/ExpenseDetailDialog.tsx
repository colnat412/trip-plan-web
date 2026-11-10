'use client';

import { Avatar, Box, Stack, Typography } from '@mui/material';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useLocale, useTranslations } from 'next-intl';
import {
  AppDialog,
  AppButton,
  AppCategoryChip,
  AppFinanceRow,
  AppMetricValue,
  AppSectionHeader,
  AppStatusChip,
} from '@/base/components/ui';
import { formatCurrency, formatDate, getUserInitials } from '@/base/utils';
import ExpenseReceiptPreview from './ExpenseReceiptPreview';
import type { Expense } from '../types';

export interface ExpenseDetailDialogProps {
  open: boolean;
  expense: Expense | null;
  onClose: () => void;
  onEdit?: (expense: Expense) => void;
  readOnly?: boolean;
}

const ExpenseDetailDialog = ({
  open,
  expense,
  onClose,
  onEdit,
  readOnly = false,
}: ExpenseDetailDialogProps) => {
  const t = useTranslations('expense');
  const locale = useLocale();
  if (!expense) return null;

  const splitType = ['EQUAL', 'EXACT_AMOUNT', 'PERCENTAGE', 'SHARE'].includes(
    expense.splitType,
  )
    ? expense.splitType
    : 'EQUAL';

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={t('dialog.detailTitle')}
      icon={<ReceiptLongRoundedIcon />}
      maxWidth="sm"
      actions={
        <>
          <AppButton
            intent="secondary"
            data-dialog-action="cancel"
            onClick={onClose}
          >
            {t('dialog.close')}
          </AppButton>
          {onEdit && !readOnly && (
            <AppButton
              intent="primary"
              data-dialog-action="primary"
              wrapLabel
              startIcon={<EditRoundedIcon fontSize="small" />}
              onClick={() => {
                onClose();
                onEdit(expense);
              }}
            >
              {t('row.edit')}
            </AppButton>
          )}
        </>
      }
    >
      <Stack spacing={2.5} sx={{ minWidth: 0 }}>
        <Stack
          spacing={1.5}
          sx={{
            p: 2,
            minWidth: 0,
            borderRadius: '14px',
            bgcolor: 'action.hover',
            border: 1,
            borderColor: 'divider',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 1,
              minWidth: 0,
            }}
          >
            <Stack spacing={0.5} sx={{ flex: '1 1 160px', minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: '18px',
                  fontWeight: 700,
                  overflowWrap: 'anywhere',
                }}
              >
                {expense.title}
              </Typography>
              <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
                {formatDate(expense.expenseDate)}
              </Typography>
            </Stack>
            <AppCategoryChip category={expense.category} />
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 1,
              pt: 1.5,
              borderTop: 1,
              borderColor: 'divider',
              minWidth: 0,
            }}
          >
            <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
              {t('table.colAmount')}
            </Typography>
            <AppMetricValue sx={{ fontSize: '22px', whiteSpace: 'nowrap' }}>
              {formatCurrency(expense.amount, expense.currency, locale)}
            </AppMetricValue>
          </Box>
        </Stack>

        <Stack spacing={1} sx={{ minWidth: 0 }}>
          <AppSectionHeader title={t('dialog.paidBy')} />
          <Box
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: '12px',
              minWidth: 0,
            }}
          >
            <AppFinanceRow
              icon={
                <Avatar
                  src={expense.payerAvatarUrl || undefined}
                  sx={{ width: 36, height: 36 }}
                >
                  {getUserInitials(expense.payerName || '')}
                </Avatar>
              }
              title={expense.payerName || '—'}
              subtitle={expense.payerEmail}
              amount={formatCurrency(expense.amount, expense.currency, locale)}
              amountCaption={
                <AppStatusChip
                  tone="success"
                  label={t('dialog.settled')}
                  icon={<CheckCircleRoundedIcon />}
                />
              }
            />
          </Box>
        </Stack>

        <Stack spacing={1} sx={{ minWidth: 0 }}>
          <AppSectionHeader
            title={t('dialog.splitBreakdown', {
              count: expense.splits?.length || 0,
            })}
            actions={
              <AppStatusChip
                label={t(`splits.${splitType}`)}
                variant="outlined"
              />
            }
          />
          <Stack
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: '12px',
              minWidth: 0,
            }}
          >
            {expense.splits?.length ? (
              expense.splits.map((split) => {
                const percent =
                  expense.amount > 0
                    ? Math.round((split.allocatedAmount / expense.amount) * 100)
                    : 0;
                return (
                  <AppFinanceRow
                    key={split.id}
                    icon={
                      <Avatar
                        src={split.userAvatarUrl || undefined}
                        sx={{ width: 32, height: 32 }}
                      >
                        {getUserInitials(split.userName || '')}
                      </Avatar>
                    }
                    title={
                      split.userName ||
                      t('dialog.memberFallback', { id: split.userId })
                    }
                    subtitle={split.userEmail}
                    amount={formatCurrency(
                      split.allocatedAmount,
                      expense.currency,
                      locale,
                    )}
                    amountCaption={
                      <Stack
                        spacing={0.5}
                        sx={{
                          alignItems: 'flex-end',
                          minWidth: 0,
                          maxWidth: '100%',
                        }}
                      >
                        <Typography
                          sx={{ fontSize: '11px', color: 'text.secondary' }}
                        >
                          {percent}%
                        </Typography>
                        <AppStatusChip
                          tone={split.settled ? 'success' : 'warning'}
                          label={t(
                            split.settled ? 'dialog.settled' : 'dialog.pending',
                          )}
                          icon={
                            split.settled ? (
                              <CheckCircleRoundedIcon />
                            ) : (
                              <HourglassEmptyRoundedIcon />
                            )
                          }
                        />
                      </Stack>
                    }
                  />
                );
              })
            ) : (
              <Typography
                sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}
              >
                —
              </Typography>
            )}
          </Stack>
        </Stack>

        {expense.note && (
          <Stack spacing={1} sx={{ minWidth: 0 }}>
            <AppSectionHeader title={t('dialog.note')} />
            <Typography
              sx={{
                p: 1.5,
                borderRadius: '10px',
                bgcolor: 'action.hover',
                fontSize: '13px',
                color: 'text.secondary',
                whiteSpace: 'pre-wrap',
                overflowWrap: 'anywhere',
              }}
            >
              {expense.note}
            </Typography>
          </Stack>
        )}
        {expense.receiptUrl && (
          <ExpenseReceiptPreview
            key={expense.receiptUrl}
            src={expense.receiptUrl}
          />
        )}
      </Stack>
    </AppDialog>
  );
};

export default ExpenseDetailDialog;
