'use client';

import { Box } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useLayoutEffect, useRef, type ReactNode } from 'react';

import AppTopBar from './AppTopBar';
import NotificationProvider from '@/features/notification/context/NotificationContext';
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
  hasSession?: boolean;
  sidebarDisabledPaths?: readonly string[];
}

const AppShell = ({ children, hasSession = false, sidebarDisabledPaths = [] }: AppShellProps) => {
  const pathname = usePathname();
  const mainRef = useRef<HTMLElement | null>(null);
  // Next.js manages the window scroll; this shell scrolls its own main element.
  useLayoutEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
      mainRef.current.scrollLeft = 0;
    }
  }, [pathname]);
  const showNavigation = !sidebarDisabledPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  const isPublic = [...PUBLIC_AUTH_PATHS, ...PUBLIC_PATHS].some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  const isLibrary = pathname === '/templates' || pathname.startsWith('/templates/');
  // Guest library pages keep the same chrome without mounting account-dependent controls.
  const renderFrame = (withAccount: boolean) => (
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
      <AppTopBar guest={!withAccount} />
      <Box
        component="main"
        ref={mainRef}
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
      {withAccount && <CreateTripHost />}
      {withAccount && <TripMembersHost />}
      {withAccount && <GlobalLoadingHost />}
    </Box>
  );
  if (isLibrary && !hasSession) {
    return renderFrame(false);
  }
  if (isPublic && !isLibrary) {
    return <>{children}</>;
  }

  return (
    <UserProvider>
      {isLibrary ? (
        <TripProvider><NotificationProvider>{renderFrame(true)}</NotificationProvider></TripProvider>
      ) : <PolicyAcceptanceGate>
        {!showNavigation ? (
          children
        ) : (
          <TripProvider>
            <NotificationProvider>{renderFrame(true)}</NotificationProvider>
          </TripProvider>
        )}
      </PolicyAcceptanceGate>}
    </UserProvider>
  );
};

export default AppShell;
