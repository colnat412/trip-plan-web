'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Box, BottomNavigation, BottomNavigationAction } from '@mui/material';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  isAppNavigationActive,
  MOBILE_PRIMARY_NAVIGATION_ITEMS,
  DESKTOP_NAV_BREAKPOINT,
  MORE_NAVIGATION_ITEMS,
} from './navigation/config';
import AppMoreNavigationDialog from './AppMoreNavigationDialog';
import { glassSurface } from '@/base/theme/surfaces';
import { interactionTransition } from '@/base/theme/interactions';

const AppBottomNavigation = () => {
  const pathname = usePathname();
  const t = useTranslations('navigation');
  const [moreOpen, setMoreOpen] = useState(false);
  const primary = MOBILE_PRIMARY_NAVIGATION_ITEMS.find((item) =>
    isAppNavigationActive(pathname, item),
  );
  const inMore = MORE_NAVIGATION_ITEMS.some((item) =>
    isAppNavigationActive(pathname, item),
  );
  const hasMoreNavigation = MORE_NAVIGATION_ITEMS.length > 0;
  const value = moreOpen || inMore ? 'more' : primary?.id;

  return (
    <>
      <Box
        component="nav"
        aria-label={t('main')}
        sx={(theme) => ({
          display: 'flex',
          justifyContent: 'center',
          position: 'fixed',
          insetInline: 0,
          bottom: 0,
          zIndex: theme.zIndex.appBar,
          pointerEvents: 'none',
          bgcolor: 'transparent',
          pb: 'calc(12px + env(safe-area-inset-bottom, 0px))',
          pl: 'max(12px, env(safe-area-inset-left, 0px))',
          pr: 'max(12px, env(safe-area-inset-right, 0px))',
          minWidth: 0,
          [theme.breakpoints.up(DESKTOP_NAV_BREAKPOINT)]: { display: 'none' },
        })}
      >
        <BottomNavigation
          showLabels
          value={value}
          sx={(theme) => {
            return {
              ...glassSurface(theme, 'navigation'),
              height: 'var(--app-bottom-navigation-height, 80px)',
              pointerEvents: 'auto',
              width: '100%',
              maxWidth: 560,
              minWidth: 0,
              p: 0.5,
              gap: 0.25,
              borderRadius: 'var(--app-radius-pill)',
              '& .MuiBottomNavigationAction-root': {
                minWidth: 0,
                maxWidth: 'none',
                minHeight: 48,
                borderRadius: 'var(--app-radius-pill)',
                overflow: 'hidden',
                px: 0.5,
                py: 0.5,
                gap: 0.25,
                color: 'text.secondary',
                ...interactionTransition(theme, ['background-color', 'color']),
                '@media (hover: hover) and (pointer: fine)': {
                  '&:hover': { bgcolor: 'action.hover' },
                },
                '&:active': { bgcolor: 'action.hover' },
                '&.Mui-selected': {
                  color: 'text.secondary',
                  bgcolor: 'transparent',
                  '&:hover, &:active': {
                    bgcolor: 'transparent',
                  },
                },
                '& .MuiSvgIcon-root': {
                  color: 'inherit',
                  ...interactionTransition(theme, ['color']),
                },
                '&.Mui-selected .MuiSvgIcon-root': {
                  color: 'primary.main',
                },
              },
              '& .MuiBottomNavigationAction-label, & .MuiBottomNavigationAction-label.Mui-selected':
                {
                  fontSize: '12px',
                  fontWeight: 600,
                  whiteSpace: 'normal',
                  lineHeight: 1.25,
                  maxWidth: '100%',
                },
              '& .Mui-focusVisible': {
                outline: '2px solid',
                outlineColor: 'primary.main',
                outlineOffset: -2,
              },
            };
          }}
        >
          {MOBILE_PRIMARY_NAVIGATION_ITEMS.map((item) => (
            <BottomNavigationAction
              key={item.id}
              disableRipple
              component={Link}
              href={item.href}
              value={item.id}
              label={t(`mobile.${item.id}`)}
              icon={item.icon}
              aria-current={primary?.id === item.id ? 'page' : undefined}
            />
          ))}
          {hasMoreNavigation && (
            <BottomNavigationAction
              disableRipple
              value="more"
              label={t('more')}
              icon={<MoreHorizRoundedIcon />}
              onClick={() => setMoreOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={moreOpen}
              aria-current={inMore ? 'true' : undefined}
            />
          )}
        </BottomNavigation>
      </Box>
      {hasMoreNavigation && (
        <AppMoreNavigationDialog
          open={moreOpen}
          onClose={() => setMoreOpen(false)}
        />
      )}
    </>
  );
};
export default AppBottomNavigation;
