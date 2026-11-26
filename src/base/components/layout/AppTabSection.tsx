'use client';

import { useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { contentColumn } from '@/base/theme/content-layout';
import { keyframes } from '@mui/material/styles';
import { Box } from '@mui/material';
import AppPageContainer from './AppPageContainer';
import AppPageLoadingProvider from '@/base/providers/AppPageLoadingProvider';
import { SEGMENTED_RADIUS } from '@/base/theme/segmented-control';
import { getTabIndex, isSameTabSection } from '@/base/utils/tab-section';

// Fade content without shifting the layout or viewport-fixed actions.
const revealContent = keyframes`from { opacity: 0.35; } to { opacity: 1; }`;

/** Navigation stays mounted in the layout; only the body participates in loading. */
interface AppTabSectionProps {
  navigation: ReactNode;
  children: ReactNode;
  contained?: boolean;
}

export default function AppTabSection({ navigation, children, contained = false }: AppTabSectionProps) {
  const pathname = usePathname();
  const [visit, setVisit] = useState({ pathname, direction: 0 });
  if (visit.pathname !== pathname) {
    const direction = isSameTabSection(visit.pathname, pathname)
      ? Math.sign(getTabIndex(pathname) - getTabIndex(visit.pathname)) : 0;
    setVisit({ pathname, direction });
  }
  return (
    <AppPageContainer sx={{ flex: contained ? '1 1 0' : 1, minHeight: 0, ...(contained && { overflow: 'hidden' }) }}>
      <Box data-tab-navigation sx={{
        position: 'sticky', top: 0, zIndex: 2, flexShrink: 0,
        bgcolor: 'transparent', borderRadius: SEGMENTED_RADIUS,
      }}>
        {navigation}
      </Box>
      <AppPageLoadingProvider scope="section" contained={contained}>
        <Box key={pathname} sx={{
          ...contentColumn, position: 'relative', ...(contained && { flex: '1 1 0', overflow: 'hidden' }),
          animation: visit.direction === 0 ? 'none' : `${revealContent} 220ms cubic-bezier(0.2, 0, 0, 1)`,
          '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
        }}>
          {children}
        </Box>
      </AppPageLoadingProvider>
    </AppPageContainer>
  );
}
