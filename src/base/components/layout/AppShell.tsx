'use client';

import { Box } from '@mui/material';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import AppTopBar from './AppTopBar';
import AppBottomNavigation from './AppBottomNavigation';
import CreateTripHost from './CreateTripHost';
import TripMembersHost from './TripMembersHost';
import GlobalLoadingHost from './GlobalLoadingHost';
import { TripProvider } from '@/features/trip/context/TripContext';
import { UserProvider } from '@/features/user/context/UserContext';
import { PUBLIC_AUTH_PATHS, PUBLIC_PATHS } from '@/base/constants';
import PolicyAcceptanceGate from '@/features/legal/components/PolicyAcceptanceGate';
import { DESKTOP_NAV_BREAKPOINT } from './navigation/config';

export interface AppShellProps {
  children: ReactNode;
  sidebarDisabledPaths?: readonly string[];
}

const AppShell = ({ children, sidebarDisabledPaths = [] }: AppShellProps) => {
  const pathname = usePathname();
  const showNavigation = !sidebarDisabledPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  const isPublic = [...PUBLIC_AUTH_PATHS, ...PUBLIC_PATHS].some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  if (isPublic) {
    return <>{children}</>;
  }

  return (
    <UserProvider>
      <PolicyAcceptanceGate>
        {!showNavigation ? (
          children
        ) : (
          <TripProvider>
            <Box
              sx={(theme) => ({
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.paper',
                height: '100dvh',
                overflow: 'hidden',
                minWidth: 0,
                [theme.breakpoints.down(DESKTOP_NAV_BREAKPOINT)]: {
                  '--app-page-surface': `color-mix(in srgb, ${(theme.vars?.palette ?? theme.palette).text.primary} calc(${(theme.vars?.palette ?? theme.palette).action.hoverOpacity} * 100%), ${(theme.vars?.palette ?? theme.palette).background.paper})`,
                  '--app-bottom-navigation-height': '72px',
                  '--app-bottom-navigation-space':
                    'calc(var(--app-bottom-navigation-height) + 12px + env(safe-area-inset-bottom, 0px))',
                },
              })}
            >
              <AppTopBar />
              <Box
                component="main"
                id="main-content"
                tabIndex={-1}
                sx={{
                  minWidth: 0,
                  minHeight: 0,
                  flex: 1,
                  overflowY: 'auto',
                  bgcolor: (theme) =>
                    `var(--app-page-surface, ${(theme.vars?.palette ?? theme.palette).action.hover})`,
                  scrollbarGutter: 'stable',
                  overscrollBehaviorY: 'contain',
                  scrollPaddingBottom:
                    'var(--app-bottom-navigation-space, 0px)',
                  pl: 'env(safe-area-inset-left, 0px)',
                  pr: 'env(safe-area-inset-right, 0px)',
                }}
              >
                {children}
              </Box>
              <AppBottomNavigation />
              <CreateTripHost />
              <TripMembersHost />
              <GlobalLoadingHost />
            </Box>
          </TripProvider>
        )}
      </PolicyAcceptanceGate>
    </UserProvider>
  );
};

export default AppShell;
