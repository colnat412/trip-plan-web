'use client';

import type { ReactNode } from 'react';
import { Box } from '@mui/material';
import AppPageContainer from './AppPageContainer';
import AppPageLoadingProvider from '@/base/providers/AppPageLoadingProvider';

/** Navigation stays mounted in the layout; only the body participates in loading. */
export default function AppTabSection({ navigation, children }: {
  navigation: ReactNode;
  children: ReactNode;
}) {
  return (
    <AppPageContainer>
      <Box data-tab-navigation sx={{
        position: 'sticky', top: 0, zIndex: 2, flexShrink: 0,
        bgcolor: 'background.paper', borderRadius: 'var(--app-radius-control)',
      }}>
        {navigation}
      </Box>
      <AppPageLoadingProvider scope="section">
        {children}
      </AppPageLoadingProvider>
    </AppPageContainer>
  );
}
