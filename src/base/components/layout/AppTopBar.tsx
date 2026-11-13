'use client';

import Link from 'next/link';
import { Box } from '@mui/material';
import { useTranslations } from 'next-intl';
import AppBrand from './AppBrand';
import { AppButton } from '@/base/components/ui';
import AppTripBar from './AppTripBar';
import AppDesktopNavigation from './AppDesktopNavigation';
import SidebarUser from './sidebar/SidebarUser';
import { glassSurface } from '@/base/theme/surfaces';

const AppTopBar = ({ guest = false }: { guest?: boolean }) => {
  const t = useTranslations('navigation');
  return (
    <Box
      component="header"
      sx={(theme) => ({
        ...glassSurface(theme, 'navigation'),
        flexShrink: 0,
        display: 'flex',
        justifyContent: 'center',
        border: 0,
        boxShadow: 'none',
        borderBottom: 1,
        borderColor: 'divider',
        pt: 'env(safe-area-inset-top, 0px)',
        pl: 'env(safe-area-inset-left, 0px)',
        pr: 'env(safe-area-inset-right, 0px)',
      })}
    >
      <Box
        sx={{
          width: '100%',
          minWidth: 0,
          minHeight: 72,
          px: { xs: 1.5, sm: 2, md: 3, xl: 4 },
          py: 0.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: { xs: 1, sm: 2 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, sm: 2, lg: 3 },
            flex: 1,
            minWidth: 0,
          }}
        >
          <Box
            component={Link}
            href="/overview"
            aria-label={t('homeLink')}
            sx={{
              display: 'inline-flex',
              minHeight: 44,
              alignItems: 'center',
              flexShrink: 0,
              borderRadius: 'var(--app-radius-control)',
              '&:focus-visible': {
                outline: '2px solid',
                outlineColor: 'primary.main',
              },
            }}
          >
            <AppBrand compactOnMobile showTag={false} />
          </Box>
          {!guest && <AppTripBar />}
        </Box>
        <AppDesktopNavigation />
        {guest ? (
          <AppButton component={Link} href="/login" intent="secondary" size="small">
            {t('signIn')}
          </AppButton>
        ) : <SidebarUser compact />}
      </Box>
    </Box>
  );
};
export default AppTopBar;
