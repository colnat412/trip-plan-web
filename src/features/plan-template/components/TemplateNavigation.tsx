'use client';

import { useTranslations } from 'next-intl';
import AppRouteTabs from '@/base/components/ui/AppRouteTabs';

const destinations = [
  { id: 'explore', href: '/templates', label: 'navExplore' },
  { id: 'saved', href: '/saved-templates', label: 'navSaved' },
  { id: 'mine', href: '/my-templates', label: 'navMine' },
] as const;

interface TemplateNavigationProps {
  active: 'explore' | 'saved' | 'mine';
}

export default function TemplateNavigation({ active }: TemplateNavigationProps) {
  const t = useTranslations('planTemplate');
  return (
    <AppRouteTabs
      label={t('library')}
      active={active}
      items={destinations.map((item) => ({ ...item, label: t(item.label) }))}
      buttonSx={{ px: 0.75, fontSize: { xs: '13px', sm: '14px' } }}
    />
  );
}
