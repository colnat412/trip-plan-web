'use client';

import Link from 'next/link';
import { Box } from '@mui/material';
import { useTranslations } from 'next-intl';
import { AppButton } from '@/base/components/ui';

const destinations = [
  { id: 'explore', href: '/templates', label: 'navExplore' },
  { id: 'saved', href: '/saved-templates', label: 'navSaved' },
  { id: 'mine', href: '/my-templates', label: 'navMine' },
] as const;

export default function TemplateNavigation({ active }: {
  active: 'explore' | 'saved' | 'mine';
}) {
  const t = useTranslations('planTemplate');
  return (
    <Box
      component="nav"
      aria-label={t('library')}
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: 0.5,
        p: 0.5,
        bgcolor: 'action.hover',
        borderRadius: '12px',
      }}
    >
      {destinations.map((item) => (
        <AppButton
          key={item.id}
          component={Link}
          href={item.href}
          intent="text"
          aria-current={active === item.id ? 'page' : undefined}
          wrapLabel
          sx={{
            minWidth: 0,
            minHeight: 44,
            px: 0.75,
            fontSize: { xs: '13px', sm: '14px' },
            borderRadius: '8px',
            ...(active === item.id ? {
              bgcolor: 'background.paper',
              boxShadow: 1,
              fontWeight: 700,
              '&:hover': { bgcolor: 'background.paper' },
            } : { color: 'text.secondary' }),
          }}
        >
          {t(item.label)}
        </AppButton>
      ))}
    </Box>
  );
}
