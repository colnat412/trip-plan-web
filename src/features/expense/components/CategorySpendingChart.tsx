'use client';

import { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import DonutLargeRoundedIcon from '@mui/icons-material/DonutLargeRounded';
import { useLocale, useTranslations } from 'next-intl';
import { AppButton, AppCard, AppEmptyState } from '@/base/components/ui';
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
    .map((item) => ({
      ...item,
      spentAmount: Number.isFinite(item.spentAmount) ? Math.max(0, item.spentAmount) : 0,
      limitAmount: Number.isFinite(item.limitAmount) ? Math.max(0, item.limitAmount) : 0,
    }))
    .filter((item) => item.spentAmount > 0 || item.limitAmount > 0)
    .sort((first, second) => second.spentAmount - first.spentAmount);
  const spendingCategories = categories.filter((item) => item.spentAmount > 0);
  const totalSpent = categories.reduce((total, item) => total + item.spentAmount, 0);
  const selectedItem = categories.find((item) => item.category === selectedCategory);
  const categoryLabel = (category: CategoryBreakdown['category']) =>
    tCategories.has(category) ? tCategories(category) : tCategories('OTHER');
  const money = (value: number) => formatCurrency(value, currency, locale);
  const compactMoney = (value: number) => formatCompactCurrency(value, currency, locale);
  const centerLabel = selectedItem ? categoryLabel(selectedItem.category) : t('allCategories');
  const centerAmount = selectedItem?.spentAmount ?? totalSpent;
  const fullAmount = money(centerAmount);
  const centerBudget = selectedItem ? selectedItem.limitAmount : (Number.isFinite(totalBudget) ? Math.max(0, totalBudget) : 0);
  const fullBudget = centerBudget > 0 ? money(centerBudget) : t('notSet');
  const centerSummary = t('categorySummary', { category: centerLabel, spent: fullAmount, budget: fullBudget });
  const centerValues = `${compactMoney(centerAmount)} / ${centerBudget > 0 ? compactMoney(centerBudget) : t('notSet')}`;
  const centerOverBudget = centerBudget > 0 && centerAmount > centerBudget;
  const circumference = 2 * Math.PI * 92;
  const segments = spendingCategories.map((item, index) => {
    const previousTotal = spendingCategories.slice(0, index).reduce((sum, previous) => sum + previous.spentAmount, 0);
    return { ...item, length: (item.spentAmount / totalSpent) * circumference, offset: (previousTotal / totalSpent) * circumference };
  });
  return (
    <AppCard sx={{ p: { xs: 2, sm: 2.5 }, border: 1, borderColor: 'divider' }}>
      <Stack spacing={2}>
        <Typography component="h2" variant="subtitle1" sx={{ fontWeight: 700 }}>{t('title')}</Typography>
        {categories.length === 0 ? (
          <AppEmptyState title={t('empty')} icon={<DonutLargeRoundedIcon />} />
        ) : (
          <Stack direction={compact ? 'column' : { xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: 'center' }}>
            <Box sx={{ width: { xs: 208, sm: 240 }, maxWidth: '100%', flexShrink: 0, color: 'text.primary' }}>
              <svg viewBox="0 0 240 240" width="100%" role="img"
                aria-label={centerSummary} style={{ display: 'block', fontFamily: 'inherit' }}>
                <title>{centerSummary}</title>
                <circle cx="120" cy="120" r="92" fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="24" />
                {segments.map((segment) => (
                  <circle key={segment.category} cx="120" cy="120" r="92" fill="none"
                    stroke={(CATEGORY_CONFIG[segment.category] || CATEGORY_CONFIG.OTHER).color}
                    strokeWidth={selectedItem?.category === segment.category ? 29 : 24}
                    strokeDasharray={`${segment.length} ${circumference - segment.length}`}
                    strokeDashoffset={-segment.offset} transform="rotate(-90 120 120)"
                    opacity={!selectedItem || selectedItem.category === segment.category ? 1 : 0.3} />
                ))}
                <text x="120" y="111" textAnchor="middle" fill="currentColor" fontSize="12" fontWeight="600">{centerLabel}</text>
                <Box component="text" x="120" y="137" textAnchor="middle" fontSize="15" fontWeight="700"
                  textLength={centerValues.length > 20 ? 144 : undefined} lengthAdjust="spacingAndGlyphs"
                  sx={{ fill: centerOverBudget ? 'error.main' : 'currentColor' }}>{centerValues}</Box>
              </svg>
            </Box>
            <Stack spacing={0.75} sx={{ width: '100%', minWidth: 0 }}>
              <Typography variant="caption" sx={{ px: 1, color: 'text.secondary', textAlign: 'right' }}>
                {t('spent')} ({currency})
              </Typography>
              <Stack component="ul" spacing={0.5} sx={{ p: 0, m: 0, listStyle: 'none', minWidth: 0 }}>
                {categories.map((item) => {
                  const selected = selectedItem?.category === item.category;
                  const hasBudget = item.limitAmount > 0;
                  const overAmount = hasBudget ? Math.max(0, item.spentAmount - item.limitAmount) : 0;
                  const fullBudget = hasBudget ? money(item.limitAmount) : t('notSet');
                  const summary = t('categorySummary', { category: categoryLabel(item.category), spent: money(item.spentAmount), budget: fullBudget });
                  const overLabel = overAmount > 0 ? t('overBudget', { amount: money(overAmount) }) : '';
                  return (
                    <Box component="li" key={item.category}>
                      <AppButton intent="text" selected={selected} fullWidth disableRipple
                        aria-pressed={selected}
                        aria-label={overLabel ? `${summary}. ${overLabel}` : summary}
                        title={summary}
                        onClick={() => setSelectedCategory((current) => current === item.category ? null : item.category)}
                        sx={{ display: 'flex', justifyContent: 'space-between', gap: 0.75, px: 1, py: 0.75, minHeight: 44,
                          ...(!selected && { color: 'text.primary' }) }}>
                        <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, flex: '1 1 auto' }}>
                          <Box component="span" sx={{ width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                            bgcolor: (CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.OTHER).color }} />
                          <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' }}>{categoryLabel(item.category)}</Box>
                        </Box>
                        <Box component="span" sx={{ flexShrink: 0, fontSize: '13px', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap',
                          color: selected ? 'inherit' : overAmount > 0 ? 'error.main' : 'text.secondary' }}>
                          {compactMoney(item.spentAmount)}
                        </Box>
                      </AppButton>
                    </Box>
                  );
                })}
              </Stack>
            </Stack>
          </Stack>
        )}
      </Stack>
    </AppCard>
  );
};

export default CategorySpendingChart;
