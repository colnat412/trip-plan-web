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

export interface AppShellProps {
  children: ReactNode;
  sidebarDisabledPaths?: readonly string[];
}

const AppShell = ({ children, sidebarDisabledPaths = [] }: AppShellProps) => {
  const pathname = usePathname();
  const showNavigation = !sidebarDisabledPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  if (!showNavigation) {
    return <>{children}</>;
  }

  return (
    <UserProvider>
      <TripProvider>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'background.paper',
            height: '100dvh',
            overflow: 'hidden',
            minWidth: 0,
          }}
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
              bgcolor: 'action.hover',
              scrollbarGutter: 'stable',
              overscrollBehaviorY: 'contain',
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
    </UserProvider>
  );
};

export default AppShell;
