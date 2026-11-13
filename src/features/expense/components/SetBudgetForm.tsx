'use client';

import React, { useMemo, useState } from 'react';
import { Box, Stack, Typography, Divider } from '@mui/material';
import { useTranslations } from 'next-intl';
import { AppButton, AppLinearProgress, AppNumberInput } from '@/base/components/ui';
import { TRIP_CATEGORIES } from '@/base/constants';
import { formatCurrency } from '@/base/utils';
import type {
  ExpenseCategory,
  SetBudgetPayload,
  TripBudgetSummary,
} from '../types';

export interface SetBudgetFormProps {
  summary: TripBudgetSummary | null;
  tripCurrency?: string;
  isLoading?: boolean;
  onSubmit: (payload: SetBudgetPayload) => void;
  formId: string;
}

const CATEGORY_KEYS = TRIP_CATEGORIES;

const SetBudgetForm = ({
  summary,
  tripCurrency = 'VND',
  isLoading = false,
  onSubmit,
  formId,
}: SetBudgetFormProps) => {
  const tDialog = useTranslations('expense.dialog');
  const tForm = useTranslations('expense.form');
  const tCat = useTranslations('expense.categories');

  const categories = useMemo(
    () =>
      CATEGORY_KEYS.map((key) => ({
        key,
        label: tCat(key),
      })),
    [tCat],
  );

  const [totalBudget, setTotalBudget] = useState(
    summary?.totalBudget !== undefined && summary?.totalBudget !== null
      ? String(summary.totalBudget)
      : '',
  );

  const initialCategoryLimits: Partial<Record<ExpenseCategory, string>> = {};
  if (summary?.categoryBreakdown) {
    summary.categoryBreakdown.forEach((item) => {
      if (item.limitAmount > 0) {
        initialCategoryLimits[item.category] = String(item.limitAmount);
      }
    });
  }

  const [categoryLimits, setCategoryLimits] = useState<
    Partial<Record<ExpenseCategory, string>>
  >(initialCategoryLimits);

  const [error, setError] = useState<string | undefined>();

  const handleCategoryChange = (key: ExpenseCategory, val: string) => {
    const updatedLimits: Partial<Record<ExpenseCategory, string>> = {
      ...categoryLimits,
      [key]: val,
    };
    setCategoryLimits(updatedLimits);

    const calculatedTotal = Object.values(updatedLimits).reduce<number>(
      (sum, limitVal) => {
        if (!limitVal) return sum;
        const n = Number(limitVal);
        return !isNaN(n) && n > 0 ? sum + n : sum;
      },
      0,
    );

    setTotalBudget(calculatedTotal > 0 ? String(calculatedTotal) : '');
    if (error) setError(undefined);
  };

  const numericTotalBudget = useMemo(() => {
    if (!totalBudget || isNaN(Number(totalBudget))) return 0;
    return Math.max(0, Number(totalBudget));
  }, [totalBudget]);

  const allocatedTotal = useMemo(() => {
    return Object.values(categoryLimits).reduce<number>((sum, val) => {
      if (!val) return sum;
      const n = Number(val);
      return !isNaN(n) && n > 0 ? sum + n : sum;
    }, 0);
  }, [categoryLimits]);

  const isOverAllocated =
    numericTotalBudget > 0 && allocatedTotal > numericTotalBudget;
  const diffAmount = Math.abs(allocatedTotal - numericTotalBudget);
  const remainingToAllocate = numericTotalBudget - allocatedTotal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    if (
      totalBudget.trim() === '' ||
      isNaN(Number(totalBudget)) ||
      Number(totalBudget) < 0
    ) {
      setError(tForm('errors.totalBudgetRequired'));
      return;
    }

    const parsedLimits: Partial<Record<ExpenseCategory, number>> = {};
    CATEGORY_KEYS.forEach((key) => {
      const val = categoryLimits[key];
      if (val !== undefined && val.trim() !== '') {
        const num = Number(val);
        if (!isNaN(num) && num >= 0) {
          parsedLimits[key] = num;
        }
      } else if (initialCategoryLimits[key]) {
        parsedLimits[key] = 0;
      }
    });

    onSubmit({
      totalBudget: Number(totalBudget),
      currency: tripCurrency,
      categoryLimits: parsedLimits,
    });
  };

  return (
    <Box
      component="form"
      id={formId}
      onSubmit={handleSubmit}
      noValidate
      sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, flexShrink: 0, '& .MuiInputBase-input': { fontSize: { xs: '16px', sm: '14px' } } }}
    >
      <Stack spacing={1} sx={{ minWidth: 0 }}>
        <AppNumberInput
          label={tDialog('totalBudgetLabel')}
          placeholder={tDialog('totalBudgetPlaceholder')}
          currencySuffix={tripCurrency}
          value={totalBudget}
          onChange={(e) => {
            setTotalBudget(e.target.value);
            if (error) setError(undefined);
          }}
          error={Boolean(error)}
          helperText={error}
          disabled={isLoading}
        />

        {numericTotalBudget > 0 && (
          <Stack spacing={0.75} sx={{ minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
              flexWrap: 'wrap', columnGap: 1, rowGap: 0.25, minWidth: 0 }}>
              <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                {tDialog('allocationStatus')}
              </Typography>
              <Typography sx={{ fontSize: '12px', fontWeight: 600,
                fontVariantNumeric: 'tabular-nums', overflowWrap: 'anywhere',
                color: isOverAllocated ? 'error.main' : remainingToAllocate === 0 ? 'success.main' : 'primary.main' }}>
                {formatCurrency(allocatedTotal, tripCurrency)} /{' '}
                {formatCurrency(numericTotalBudget, tripCurrency)}
              </Typography>
            </Box>
            <AppLinearProgress
              value={(allocatedTotal / numericTotalBudget) * 100}
              height={4}
              barColor={isOverAllocated ? 'error.main' : remainingToAllocate === 0 ? 'success.main' : 'primary.main'}
              aria-label={tDialog('allocationStatus')}
            />
            {isOverAllocated ? (
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                sx={{
                  justifyContent: 'space-between',
                  alignItems: { sm: 'center' },
                  pt: 0.5,
                }}
              >
                <Typography
                  sx={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'error.main',
                  }}
                >
                  ⚠️{' '}
                  {tDialog('warningOverAllocated', {
                    amount: formatCurrency(diffAmount, tripCurrency),
                  })}
                </Typography>
                <AppButton
                  size="small"
                  disabled={isLoading}
                  intent="secondary"
                  onClick={() => setTotalBudget(String(allocatedTotal))}
                  sx={{
                    fontSize: '11px',
                    py: 0.25,
                    px: 1.25,
                    minHeight: 44,
                    whiteSpace: 'nowrap',
                    alignSelf: { xs: 'flex-start', sm: 'center' },
                  }}
                >
                  {tDialog('syncTotalBudget')}
                </AppButton>
              </Stack>
            ) : remainingToAllocate > 0 ? (
              <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                ✓{' '}
                {tDialog('remainingUnallocated', {
                  amount: formatCurrency(remainingToAllocate, tripCurrency),
                })}
              </Typography>
            ) : (
              <Typography
                sx={{
                  fontSize: '12px',
                  color: 'success.main',
                  fontWeight: 600,
                }}
              >
                ✓ {tDialog('exactAllocated')}
              </Typography>
            )}
          </Stack>
        )}
      </Stack>

      <Divider />

      <Typography
        sx={{
          fontSize: '14px',
          fontWeight: 700,
          color: 'text.primary',
        }}
      >
        {tDialog('categoryLimitsTitle')}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {categories.map((cat) => (
          <Box
            key={cat.key}
            sx={{
              flex: '1 1 calc(50% - 8px)',
              // Two columns when space permits; wrap on very narrow sheets.
              minWidth: 'min(148px, 100%)',
            }}
          >
            <AppNumberInput
              label={cat.label}
              disabled={isLoading}
              slotProps={{ inputLabel: { shrink: true } }}
              size="small"
              placeholder="0"
              currencySuffix={tripCurrency}
              value={categoryLimits[cat.key] ?? ''}
              onChange={(e) => handleCategoryChange(cat.key, e.target.value)}
            />
          </Box>
        ))}
      </Box>

    </Box>
  );
};

export default SetBudgetForm;
