'use client';

import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';
import { contentColumn } from '@/base/theme/content-layout';
import { Box } from '@mui/material';
import AppLoadingOverlay from '@/base/components/ui/AppLoadingOverlay';

export const AppPageLoadingContext = createContext<{
  registerLoading: () => () => void;
} | null>(null);

const AppPageLoadingProvider = ({ children, scope = 'page' }: { children: ReactNode; scope?: 'page' | 'section' }) => {
  // Each mounted section owns a token. Keep aggregating after the first load:
  // changing trips, retrying and dependent queries must use the same boundary.
  const [pending, setPending] = useState<Set<symbol>>(() => new Set());
  const registerLoading = useCallback(() => {
    const token = Symbol();
    setPending((previous) => new Set(previous).add(token));
    return () => {
      setPending((previous) => {
        if (!previous.has(token)) return previous;
        const next = new Set(previous);
        next.delete(token);
        return next;
      });
    };
  }, []);
  const context = useMemo(() => ({ registerLoading }), [registerLoading]);
  const isPageLoading = pending.size > 0;

  return (
    <AppPageLoadingContext.Provider value={context}>
      <Box aria-busy={isPageLoading} sx={{ ...contentColumn, pb: isPageLoading && scope === 'page' ? 'var(--app-bottom-navigation-space, 0px)' : 0 }}>
        {/* Keep queries mounted while their content is hidden. */}
        <Box hidden={isPageLoading} inert={isPageLoading} sx={{ ...contentColumn, display: isPageLoading ? 'none' : 'flex' }}>
          {children}
        </Box>
        <AppLoadingOverlay open={isPageLoading} scope="content" />
      </Box>
    </AppPageLoadingContext.Provider>
  );
};

export default AppPageLoadingProvider;
