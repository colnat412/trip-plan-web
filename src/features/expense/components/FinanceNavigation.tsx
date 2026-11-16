'use client';

import { useTranslations } from 'next-intl';
import AppRouteTabs from '@/base/components/ui/AppRouteTabs';

const destinations = [
  { id: 'expenses', href: '/expenses' },
  { id: 'settlement', href: '/settlement' },
] as const;

export default function FinanceNavigation({ active }: {
  active: 'expenses' | 'settlement';
}) {
  const t = useTranslations('finance');
  return (
    <AppRouteTabs
      pill
      label={t('navigation')}
      active={active}
      items={destinations.map((item) => ({ ...item, label: t(item.id) }))}
    />
  );
}
