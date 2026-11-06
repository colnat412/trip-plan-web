'use client';

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Box } from '@mui/material';
import AppLoadingOverlay from '@/base/components/ui/AppLoadingOverlay';

export const AppPageLoadingContext = createContext<{
  registerLoading: () => () => void;
  initialPageLoad: boolean;
} | null>(null);

const AppPageLoadingProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const [visit, setVisit] = useState({ pathname, id: 0, settled: false });
  const [pending, setPending] = useState<Map<symbol, number>>(() => new Map());

  // Reset this provider's loading session without remounting page/auth state.
  // A -> B -> A is a new visit, even if B did not finish loading.
  if (visit.pathname !== pathname) {
    setVisit({ pathname, id: visit.id + 1, settled: false });
  }
  const initialPageLoad = !visit.settled;

  const registerLoading = useCallback(() => {
    if (!initialPageLoad) return () => {};
    const token = Symbol();
    setPending((previous) => new Map(previous).set(token, visit.id));
    return () => {
      setPending((previous) => {
        const next = new Map(previous);
        next.delete(token);
        return next;
      });
    };
  }, [visit.id, initialPageLoad]);
  const context = useMemo(
    () => ({ registerLoading, initialPageLoad }),
    [registerLoading, initialPageLoad],
  );
  const hasPendingSections = [...pending.values()].some((id) => id === visit.id);
  const isPageLoading = initialPageLoad && hasPendingSections;

  useEffect(() => {
    if (!initialPageLoad || hasPendingSections) return;
    // Allow dependent sections to mount/start their initial queries before
    // sealing the visit. Subsequent searches, dialogs and refetches stay local.
    const timer = window.setTimeout(() => {
      setVisit((current) => current.id === visit.id
        ? { ...current, settled: true }
        : current);
    }, 150);
    return () => window.clearTimeout(timer);
  }, [visit.id, initialPageLoad, hasPendingSections]);

  return (
    <AppPageLoadingContext.Provider value={context}>
      <Box aria-busy={isPageLoading} sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%', minWidth: 0 }}>
        {/* Keep queries mounted while their initial content is hidden. */}
        <Box hidden={isPageLoading} inert={isPageLoading} sx={{ flex: 1, minWidth: 0, display: isPageLoading ? 'none' : 'flex', flexDirection: 'column' }}>
          {children}
        </Box>
        <AppLoadingOverlay open={isPageLoading} scope="content" />
      </Box>
    </AppPageLoadingContext.Provider>
  );
};

export default AppPageLoadingProvider;
