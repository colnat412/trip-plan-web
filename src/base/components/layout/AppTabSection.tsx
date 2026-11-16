'use client';

import { useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { keyframes } from '@mui/material/styles';
import { Box } from '@mui/material';
import AppPageContainer from './AppPageContainer';
import AppPageLoadingProvider from '@/base/providers/AppPageLoadingProvider';
import { getTabIndex, isSameTabSection } from '@/base/utils/tab-section';

// Position offsets keep viewport-fixed actions anchored during the animation.
const slideFromRight = keyframes`from { left: 24px; } to { left: 0; }`;
const slideFromLeft = keyframes`from { left: -24px; } to { left: 0; }`;

/** Navigation stays mounted in the layout; only the body participates in loading. */
export default function AppTabSection({ navigation, children }: {
  navigation: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [visit, setVisit] = useState({ pathname, direction: 0 });
  if (visit.pathname !== pathname) {
    const direction = isSameTabSection(visit.pathname, pathname)
      ? Math.sign(getTabIndex(pathname) - getTabIndex(visit.pathname)) : 0;
    setVisit({ pathname, direction });
  }
  return (
    <AppPageContainer>
      <Box data-tab-navigation sx={{
        position: 'sticky', top: 0, zIndex: 2, flexShrink: 0,
        bgcolor: 'background.paper', borderRadius: 'var(--app-radius-control)',
      }}>
        {navigation}
      </Box>
      <AppPageLoadingProvider scope="section">
        <Box key={pathname} sx={{
          position: 'relative', display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0,
          animation: visit.direction === 0 ? 'none' : `${visit.direction > 0 ? slideFromRight : slideFromLeft} 220ms cubic-bezier(0.2, 0, 0, 1)`,
          '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
        }}>
          {children}
        </Box>
      </AppPageLoadingProvider>
    </AppPageContainer>
  );
}
