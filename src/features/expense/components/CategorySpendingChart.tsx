'use client';

import { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import DonutLargeRoundedIcon from '@mui/icons-material/DonutLargeRounded';
import { useLocale, useTranslations } from 'next-intl';
import { AppButton, AppEmptyState } from '@/base/components/ui';
import { CATEGORY_CONFIG } from '@/base/components/ui/AppCategoryChip';
import { formatCurrency, formatCompactCurrency } from '@/base/utils';
import type { CategoryBreakdown } from '../types';

interface CategorySpendingChartProps {
  breakdown: CategoryBreakdown[];
  currency: string;
  totalBudget: number;
  compact?: boolean;
}

const CategorySpendingChart = ({ breakdown, currency, totalBudget, compact = false }: CategorySpendingChartProps) => {
  const locale = useLocale();
  const t = useTranslations('expense.spendingChart');
  const tCategories = useTranslations('expense.categories');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categories = breakdown
    .map(item => ({ ...item,
      spentAmount: Number.isFinite(item.spentAmount) ? Math.max(0, item.spentAmount) : 0,
      limitAmount: Number.isFinite(item.limitAmount) ? Math.max(0, item.limitAmount) : 0,
    }))
    .filter(item => item.spentAmount > 0 || item.limitAmount > 0)
    .sort((first, second) => second.spentAmount - first.spentAmount);
  const totalSpent = categories.reduce((sum, item) => sum + item.spentAmount, 0);
  const selectedItem = categories.find(item => item.category === selectedCategory);
  const label = (category: CategoryBreakdown['category']) => tCategories.has(category) ? tCategories(category) : tCategories('OTHER');
  const money = (value: number) => formatCurrency(value, currency, locale);
  const amountTextSx = (overBudget: boolean) => (theme: Theme) => {
    const palette = theme.vars?.palette ?? theme.palette;
    return {
      color: overBudget ? palette.error.main : palette.text.primary,
      ...theme.applyStyles('dark', { color: overBudget ? palette.error.light : palette.text.primary }),
    };
  };
  const percent = new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 });
  const centerLabel = selectedItem ? label(selectedItem.category) : t('spent');
  const centerAmount = selectedItem?.spentAmount ?? totalSpent;
  const centerBudget = selectedItem ? selectedItem.limitAmount : Math.max(0, Number.isFinite(totalBudget) ? totalBudget : 0);
  const fullAmount = money(centerAmount);
  const compactMoney = (value: number) => formatCompactCurrency(value, currency, locale);
  const displayAmount = `${compactMoney(centerAmount)} / ${centerBudget > 0 ? compactMoney(centerBudget) : t('notSet')}`;
  const summary = t('categorySummary', { category: selectedItem ? centerLabel : t('allCategories'),
    spent: fullAmount, budget: centerBudget > 0 ? money(centerBudget) : t('notSet') });
  const circumference = 2 * Math.PI * 100;
  const spending = categories.filter(item => item.spentAmount > 0);
  const segments = spending.map((item, index) => {
    const length = item.spentAmount / totalSpent * circumference;
    const previousSpent = spending.slice(0, index).reduce((sum, previous) => sum + previous.spentAmount, 0);
    return { ...item, length, offset: previousSpent / totalSpent * circumference,
      gap: spending.length > 1 ? Math.min(3, length * 0.12) : 0 };
  });

  return (
    <Box component="section" sx={{ minWidth: 0, width: '100%' }}>
      <Stack spacing={1.5}>
        <Typography component="h2" sx={{ fontSize: '14px', fontWeight: 600 }}>{t('title')}</Typography>
        {categories.length === 0 ? <AppEmptyState title={t('empty')} icon={<DonutLargeRoundedIcon />} /> : (
          <Stack direction="row" spacing={{ xs: 1.25, sm: 2 }} sx={{ alignItems: 'center', minWidth: 0 }}>
            <Box sx={{ width: compact ? { xs: 160, sm: 184 } : { xs: 184, sm: 208 }, maxWidth: '44%', flexShrink: 0, color: 'text.primary' }}>
              <svg viewBox="0 0 240 240" width="100%" role="img" aria-label={summary}
                style={{ display: 'block', fontFamily: 'inherit' }}>
                <title>{summary}</title>
                <circle cx="120" cy="120" r="100" fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="18" />
                {segments.map(segment => (
                  <circle key={segment.category} cx="120" cy="120" r="100" fill="none"
                    stroke={(CATEGORY_CONFIG[segment.category] || CATEGORY_CONFIG.OTHER).color}
                    strokeWidth={selectedItem?.category === segment.category ? 22 : 18}
                    strokeDasharray={`${segment.length - segment.gap} ${circumference - segment.length + segment.gap}`}
                    strokeDashoffset={-segment.offset} transform="rotate(-90 120 120)"
                    opacity={!selectedItem || selectedItem.category === segment.category ? 1 : 0.3} />
                ))}
                <text x="120" y="105" textAnchor="middle" fill="currentColor" fontSize="16" fontWeight="600">{centerLabel}</text>
                <Box component="text" x="120" y="136" textAnchor="middle" fill="currentColor" fontSize="22" fontWeight="700"
                  textLength={displayAmount.length > 14 ? 160 : undefined} lengthAdjust="spacingAndGlyphs"
                  sx={amountTextSx(centerBudget > 0 && centerAmount > centerBudget)}>{displayAmount}</Box>
              </svg>
            </Box>
            <Box component="ul" sx={{ display: 'flex', flexDirection: 'column',
              p: 0, m: 0, listStyle: 'none', flex: 1, minWidth: 0 }}>
              {categories.map(item => {
                const selected = selectedItem?.category === item.category;
                const percentage = percent.format(totalSpent > 0 ? item.spentAmount / totalSpent : 0);
                const overAmount = item.limitAmount > 0 ? Math.max(0, item.spentAmount - item.limitAmount) : 0;
                const details = t('categorySummary', { category: label(item.category), spent: money(item.spentAmount),
                  budget: item.limitAmount > 0 ? money(item.limitAmount) : t('notSet') });
                const accessibleLabel = `${details}. ${t('spendingShare')}: ${percentage}${overAmount > 0 ? `. ${t('overBudget', { amount: money(overAmount) })}` : ''}`;
                return (
                  <Box component="li" key={item.category} sx={{ minWidth: 0 }}>
                    <AppButton intent="text" fullWidth disableRipple aria-pressed={selected} aria-label={accessibleLabel} title={accessibleLabel}
                      onClick={() => setSelectedCategory(current => current === item.category ? null : item.category)}
                      sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 0.75, minHeight: 32,
                        px: 0.5, py: 0.25, color: 'text.primary', bgcolor: selected ? 'action.selected' : 'transparent' }}>
                      <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flex: '1 1 64px', minWidth: 0 }}>
                        <Box component="span" sx={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                          bgcolor: (CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.OTHER).color }} />
                        <Box component="span" sx={{ flex: 1, minWidth: 0, fontSize: '12px', color: 'text.primary', textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label(item.category)}</Box>
                      </Box>
                      <Box component="span" sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', flexWrap: 'wrap', gap: 0.75,
                        minWidth: 0, maxWidth: '100%', fontVariantNumeric: 'tabular-nums' }}>
                        <Box component="span" sx={{ fontSize: '12px', color: 'text.secondary' }}>{percentage}</Box>
                        <Box component="span" sx={[{ fontSize: '12px', fontWeight: 700, textAlign: 'right', whiteSpace: 'normal', overflowWrap: 'anywhere' },
                          amountTextSx(overAmount > 0)]}>{money(item.spentAmount)}</Box>
                      </Box>
                    </AppButton>
                  </Box>
                );
              })}
            </Box>
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default CategorySpendingChart;
