'use client';

import { useLocale } from 'next-intl';
import { formatMoney, formatMoneyCompact } from '@/base/utils/currency';
import AppMetricValue, { type AppMetricValueProps } from './AppMetricValue';

export interface AppMoneyTextProps extends Omit<AppMetricValueProps, 'children'> {
  amount: number | string | null | undefined;
  currency?: string;
  compact?: boolean;
}

const AppMoneyText = ({ amount, currency = 'VND', compact = false, ...props }: AppMoneyTextProps) => {
  const locale = useLocale();
  return <AppMetricValue {...props} title={compact ? formatMoney(amount, currency, locale) : props.title}>
    {(compact ? formatMoneyCompact : formatMoney)(amount, currency, locale)}
  </AppMetricValue>;
};

export default AppMoneyText;
