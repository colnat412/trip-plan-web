'use client';

import Link from 'next/link';
import { Box } from '@mui/material';
import { useTranslations } from 'next-intl';
import { AppButton } from '@/base/components/ui';

const destinations = [
  { id: 'expenses', href: '/expenses' },
  { id: 'settlement', href: '/settlement' },
] as const;

export default function FinanceNavigation({ active }: {
  active: 'expenses' | 'settlement';
}) {
  const t = useTranslations('finance');
  return (
    <Box
      component="nav"
      aria-label={t('navigation')}
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        width: '100%',
        minWidth: 0,
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
            borderRadius: '8px',
            ...(active === item.id ? {
              bgcolor: 'background.paper',
              boxShadow: 1,
              fontWeight: 700,
              '&:hover': { bgcolor: 'background.paper' },
            } : { color: 'text.secondary' }),
          }}
        >
          {t(item.id)}
        </AppButton>
      ))}
    </Box>
  );
}
