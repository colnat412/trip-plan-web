'use client';

import { Box } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from 'react';

import AppTopBar from './AppTopBar';
import AppPullToRefreshIndicator from './AppPullToRefreshIndicator';
import usePullToRefresh from '@/base/hooks/use-pull-to-refresh';
import NotificationProvider from '@/features/notification/context/NotificationProvider';
import NotificationTargetContent from '@/features/notification/components/NotificationTargetContent';
import AppDeviceHint from './AppDeviceHint';
import AppTripWorkspace from './AppTripWorkspace';
import AppBottomNavigation from './AppBottomNavigation';
import CreateTripHost from './CreateTripHost';
import TripMembersHost from './TripMembersHost';
import GlobalLoadingHost from './GlobalLoadingHost';
import { TripProvider } from '@/features/trip/context/TripContext';
import { UserProvider } from '@/features/user/context/UserContext';
import { PUBLIC_AUTH_PATHS, PUBLIC_PATHS } from '@/base/constants';
import PolicyAcceptanceGate from '@/features/legal/components/PolicyAcceptanceGate';
import { getTabSection, isSameTabSection } from '@/base/utils/tab-section';
import { DESKTOP_NAV_BREAKPOINT } from './navigation/config';
import AppPageLoadingProvider from '@/base/providers/AppPageLoadingProvider';
import { contentColumn } from '@/base/theme/content-layout';
import { pageBackground } from '@/base/theme/page-background';

export interface AppShellProps {
  children: ReactNode;
  hasSession?: boolean;
  sidebarDisabledPaths?: readonly string[];
}

const AppShell = ({
  children,
  hasSession = false,
  sidebarDisabledPaths = [],
}: AppShellProps) => {
  const pathname = usePathname();
  const tabSection = getTabSection(pathname);
  const tripWorkspace = ['/plan', '/expenses', '/settlement', '/notes'].includes(pathname);
  const mainRef = useRef<HTMLElement | null>(null);
  const [mainElement, setMainElement] = useState<HTMLElement | null>(null);
  const attachMain = useCallback((element: HTMLElement | null) => {
    mainRef.current = element;
    setMainElement(element);
  }, []);
  const isItinerary = pathname === '/plan' || pathname.startsWith('/export/plan/');
  const pullToRefresh = usePullToRefresh(mainElement, pathname, undefined, !isItinerary);
  const previousPath = useRef(pathname);
  useLayoutEffect(() => {
    const keepScroll = isSameTabSection(previousPath.current, pathname);
    previousPath.current = pathname;
    if (keepScroll) return;
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
  const isLibrary =
    pathname === '/templates' || pathname.startsWith('/templates/');
  const renderFrame = (withAccount: boolean) => (
    <Box
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        height: '100dvh',
        overflow: 'hidden',
        minWidth: 0,
        '--app-page-surface': pageBackground(theme).backgroundColor,
        [theme.breakpoints.down(DESKTOP_NAV_BREAKPOINT)]: {
          '--app-bottom-navigation-height': '56px',
          '--app-bottom-navigation-space':
            tripWorkspace ? 'env(safe-area-inset-bottom, 0px)' : 'calc(var(--app-bottom-navigation-height) + 12px + env(safe-area-inset-bottom, 0px))',
        },
      })}
    >
      <AppTopBar guest={!withAccount} />
      {withAccount && <AppDeviceHint />}
      <AppPullToRefreshIndicator {...pullToRefresh} />
      <Box
        component="main"
        ref={attachMain}
        id="main-content"
        tabIndex={-1}
        sx={(theme) => ({
          ...pageBackground(theme),
          ...contentColumn,
          flex: 1,
          overflowY: 'auto',
          scrollbarGutter: 'stable',
          overscrollBehaviorY: 'contain',
          scrollPaddingBottom: 'var(--app-bottom-navigation-space, 0px)',
          pl: 'env(safe-area-inset-left, 0px)',
          pr: 'env(safe-area-inset-right, 0px)',
        })}
      >
        <AppPageLoadingProvider contained={pathname === '/notes'}>
          <NotificationTargetContent>
            {tripWorkspace && withAccount ? <AppTripWorkspace>{children}</AppTripWorkspace> : children}
          </NotificationTargetContent>
          {withAccount && !tabSection && <GlobalLoadingHost />}
        </AppPageLoadingProvider>
      </Box>
      {!tripWorkspace && <AppBottomNavigation guest={!withAccount} />}
      {withAccount && <CreateTripHost />}
      {withAccount && <TripMembersHost />}
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
      <PolicyAcceptanceGate bypass={isLibrary}>
        {isLibrary || showNavigation ? <TripProvider><NotificationProvider>{renderFrame(true)}</NotificationProvider></TripProvider> : children}
      </PolicyAcceptanceGate>
    </UserProvider>
  );
};

export default AppShell;
