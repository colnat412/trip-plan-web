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
}

const CategorySpendingChart = ({
  breakdown,
  currency,
}: CategorySpendingChartProps) => {
  const locale = useLocale();
  const t = useTranslations('expense.spendingChart');
  const tCategories = useTranslations('expense.categories');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = breakdown
    .filter((item) => Number.isFinite(item.spentAmount) && item.spentAmount > 0)
    .sort((first, second) => second.spentAmount - first.spentAmount);
  const totalSpent = categories.reduce(
    (total, item) => total + item.spentAmount,
    0,
  );
  const selectedItem = categories.find(
    (item) => item.category === selectedCategory,
  );
  const categoryLabel = (category: CategoryBreakdown['category']) =>
    tCategories.has(category) ? tCategories(category) : tCategories('OTHER');
  const centerLabel = selectedItem
    ? categoryLabel(selectedItem.category)
    : t('totalLabel');
  const centerAmount = selectedItem?.spentAmount ?? totalSpent;
  const fullAmount = formatCurrency(centerAmount, currency, locale);
  const displayAmount =
    fullAmount.length > 18
      ? formatCompactCurrency(centerAmount, currency, locale)
      : fullAmount;
  const percentFormat = new Intl.NumberFormat(locale, {
    style: 'percent',
    maximumFractionDigits: 1,
  });
  const circumference = 2 * Math.PI * 92;
  const segments = categories.map((item, index) => {
    const previousTotal = categories
      .slice(0, index)
      .reduce((sum, previous) => sum + previous.spentAmount, 0);
    return {
      ...item,
      length: (item.spentAmount / totalSpent) * circumference,
      offset: (previousTotal / totalSpent) * circumference,
    };
  });

  return (
    <AppCard sx={{ p: { xs: 2, sm: 2.5 }, border: 1, borderColor: 'divider' }}>
      <Stack spacing={2}>
        <Typography component="h2" variant="subtitle1" sx={{ fontWeight: 700 }}>
          {t('title')}
        </Typography>
        {categories.length === 0 ? (
          <AppEmptyState title={t('empty')} icon={<DonutLargeRoundedIcon />} />
        ) : (
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ alignItems: 'center' }}
          >
            <Box
              sx={{
                width: 240,
                maxWidth: '100%',
                flexShrink: 0,
                color: 'text.primary',
              }}
            >
              <svg
                viewBox="0 0 240 240"
                width="100%"
                role="img"
                aria-label={`${centerLabel}: ${fullAmount}`}
                style={{ display: 'block', fontFamily: 'inherit' }}
              >
                {segments.map((segment) => (
                  <circle
                    key={segment.category}
                    cx="120"
                    cy="120"
                    r="92"
                    fill="none"
                    stroke={
                      (
                        CATEGORY_CONFIG[segment.category] ||
                        CATEGORY_CONFIG.OTHER
                      ).color
                    }
                    strokeWidth={
                      selectedItem?.category === segment.category ? 29 : 24
                    }
                    strokeDasharray={`${segment.length} ${circumference - segment.length}`}
                    strokeDashoffset={-segment.offset}
                    transform="rotate(-90 120 120)"
                    opacity={
                      !selectedItem ||
                      selectedItem.category === segment.category
                        ? 1
                        : 0.3
                    }
                  />
                ))}
                <text
                  x="120"
                  y="110"
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="12"
                >
                  {centerLabel}
                </text>
                <text
                  x="120"
                  y="137"
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="16"
                  fontWeight="700"
                >
                  {displayAmount}
                </text>
              </svg>
            </Box>
            <Stack
              component="ul"
              spacing={0.5}
              sx={{ p: 0, m: 0, listStyle: 'none', width: '100%', minWidth: 0 }}
            >
              {categories.map((item) => {
                const selected = selectedItem?.category === item.category;
                const amount = formatCurrency(
                  item.spentAmount,
                  currency,
                  locale,
                );
                return (
                  <Box component="li" key={item.category}>
                    <AppButton
                      intent="text"
                      fullWidth
                      disableRipple
                      aria-pressed={selected}
                      aria-label={`${categoryLabel(item.category)}: ${amount}, ${percentFormat.format(item.spentAmount / totalSpent)}`}
                      title={amount}
                      onClick={() =>
                        setSelectedCategory(selected ? null : item.category)
                      }
                      sx={{
                        justifyContent: 'space-between',
                        gap: 1,
                        px: 1,
                        minHeight: 44,
                        color: 'text.primary',
                        bgcolor: selected ? 'action.selected' : 'transparent',
                        '&:hover, &:active': {
                          color: 'text.primary',
                          bgcolor: selected ? 'action.selected' : 'transparent',
                        },
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          minWidth: 0,
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            flexShrink: 0,
                            bgcolor: (
                              CATEGORY_CONFIG[item.category] ||
                              CATEGORY_CONFIG.OTHER
                            ).color,
                          }}
                        />
                        <Box
                          component="span"
                          sx={{ whiteSpace: 'normal', textAlign: 'left' }}
                        >
                          {categoryLabel(item.category)}
                        </Box>
                      </Box>
                      <Box
                        component="span"
                        sx={{
                          color: 'text.secondary',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {percentFormat.format(item.spentAmount / totalSpent)}
                      </Box>
                    </AppButton>
                  </Box>
                );
              })}
            </Stack>
          </Stack>
        )}
      </Stack>
    </AppCard>
  );
};

export default CategorySpendingChart;
