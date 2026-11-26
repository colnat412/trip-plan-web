'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppTripWorkspaceHeader from './AppTripWorkspaceHeader';
import { Box } from '@mui/material';
import { useTranslations } from 'next-intl';
import AppBrand from './AppBrand';
import NotificationBell from '@/features/notification/components/NotificationBell';
import { AppButton } from '@/base/components/ui';
import AppTripBar from './AppTripBar';
import AppDesktopNavigation from './AppDesktopNavigation';
import { glassSurface } from '@/base/theme/surfaces';

interface AppTopBarProps { guest?: boolean }

const AppTopBar = ({ guest = false }: AppTopBarProps) => {
  const t = useTranslations('navigation');
  const pathname = usePathname();
  const workspace = !guest && ['/plan', '/expenses', '/settlement', '/notes'].includes(pathname);
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
          minHeight: workspace ? 64 : 72,
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
          {workspace ? <AppTripWorkspaceHeader /> : <><Box
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
          {!guest && <AppTripBar />}</>}
        </Box>
        {!workspace && <AppDesktopNavigation />}
        {!guest && <NotificationBell />}
        {guest ? (
          <AppButton component={Link} href="/login" intent="secondary" size="small">
            {t('signIn')}
          </AppButton>
        ) : null}
      </Box>
    </Box>
  );
};
export default AppTopBar;
