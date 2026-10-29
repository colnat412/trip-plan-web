'use client';

import { Box } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import AppNavigationLink from './AppNavigationLink';
import { isAppNavigationActive } from './navigation/config';
import {
  APP_NAVIGATION_ITEMS,
  DESKTOP_NAV_BREAKPOINT,
} from './navigation/config';

const AppDesktopNavigation = () => {
  const pathname = usePathname();
  const t = useTranslations('navigation');
  return (
    <Box
      component="nav"
      aria-label={t('main')}
      sx={(theme) => ({
        display: 'none',
        [theme.breakpoints.up(DESKTOP_NAV_BREAKPOINT)]: { display: 'flex' },
        alignItems: 'center',
        gap: 0.5,
        minWidth: 0,
      })}
    >
      {APP_NAVIGATION_ITEMS.map((item) => (
        <AppNavigationLink
          key={item.id}
          item={item}
          active={isAppNavigationActive(pathname, item)}
        />
      ))}
    </Box>
  );
};
export default AppDesktopNavigation;
