'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Box, BottomNavigation, BottomNavigationAction } from '@mui/material';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { isNavigationActive } from '@/base/utils';
import {
  PRIMARY_NAVIGATION_ITEMS,
  DESKTOP_NAV_BREAKPOINT,
  MORE_NAVIGATION_ITEMS,
} from './navigation/config';
import AppMoreNavigationDialog from './AppMoreNavigationDialog';

const AppBottomNavigation = () => {
  const pathname = usePathname();
  const t = useTranslations('navigation');
  const [moreOpen, setMoreOpen] = useState(false);
  const primary = PRIMARY_NAVIGATION_ITEMS.find((item) =>
    isNavigationActive(pathname, item.href),
  );
  const inMore = MORE_NAVIGATION_ITEMS.some((item) =>
    isNavigationActive(pathname, item.href),
  );
  const value = moreOpen || inMore ? 'more' : primary?.id;

  return (
    <>
      <Box
        component="nav"
        aria-label={t('main')}
        sx={(theme) => ({
          display: 'block',
          [theme.breakpoints.up(DESKTOP_NAV_BREAKPOINT)]: { display: 'none' },
          flexShrink: 0,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          pb: 'env(safe-area-inset-bottom, 0px)',
          pl: 'env(safe-area-inset-left, 0px)',
          pr: 'env(safe-area-inset-right, 0px)',
        })}
      >
        <BottomNavigation
          showLabels
          value={value}
          sx={{
            height: 72,
            bgcolor: 'transparent',
            width: '100%',
            '& .MuiBottomNavigationAction-root': {
              minWidth: 0,
              maxWidth: 'none',
              minHeight: 48,
              px: 0.5,
              gap: 0.5,
            },
            '& .MuiBottomNavigationAction-label, & .MuiBottomNavigationAction-label.Mui-selected':
              {
                fontSize: { xs: '11px', sm: '12px' },
                fontWeight: 700,
                whiteSpace: 'normal',
                lineHeight: 1.25,
                maxWidth: '100%',
              },
            '& .Mui-focusVisible': {
              outline: '2px solid',
              outlineColor: 'primary.main',
              outlineOffset: -2,
            },
          }}
        >
          {PRIMARY_NAVIGATION_ITEMS.map((item) => (
            <BottomNavigationAction
              key={item.id}
              component={Link}
              href={item.href}
              value={item.id}
              label={t(`mobile.${item.id}`)}
              icon={item.icon}
              aria-current={primary?.id === item.id ? 'page' : undefined}
            />
          ))}
          <BottomNavigationAction
            value="more"
            label={t('more')}
            icon={<MoreHorizRoundedIcon />}
            onClick={() => setMoreOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={moreOpen}
            aria-current={inMore ? 'true' : undefined}
          />
        </BottomNavigation>
      </Box>
      <AppMoreNavigationDialog
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
      />
    </>
  );
};
export default AppBottomNavigation;
