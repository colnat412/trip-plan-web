'use client';

import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';
import AppLoadingOverlay from '@/base/components/ui/AppLoadingOverlay';

export const AppPageLoadingContext = createContext<{
  registerLoading: () => () => void;
} | null>(null);

const AppPageLoadingProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const [pending, setPending] = useState<Map<symbol, string>>(() => new Map());

  const registerLoading = useCallback(() => {
    const token = Symbol();
    setPending((previous) => new Map(previous).set(token, pathname));
    return () => {
      setPending((previous) => {
        const next = new Map(previous);
        next.delete(token);
        return next;
      });
    };
  }, [pathname]);
  const context = useMemo(() => ({ registerLoading }), [registerLoading]);
  const isLoading = [...pending.values()].some((path) => path === pathname);

  return (
    <AppPageLoadingContext.Provider value={context}>
      {children}
      <AppLoadingOverlay open={isLoading} />
    </AppPageLoadingContext.Provider>
  );
};

export default AppPageLoadingProvider;
