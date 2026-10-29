'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import AppToast, { type AppToastSeverity } from '@/base/components/ui/AppToast';

type Notify = (message: string, severity?: AppToastSeverity) => void;
const ToastContext = createContext<Notify | null>(null);

export function useAppToast(): Notify {
  const notify = useContext(ToastContext);
  if (!notify) throw new Error('useAppToast requires AppToastProvider');
  return notify;
}

export default function AppToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ message: string; severity: AppToastSeverity; id: number } | null>(null);
  const notify = useCallback<Notify>((message, severity = 'success') => {
    setToast((previous) => ({ message, severity, id: (previous?.id ?? 0) + 1 }));
  }, []);

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <AppToast
        key={toast?.id}
        open={toast !== null}
        message={toast?.message ?? ''}
        severity={toast?.severity}
        onClose={() => setToast(null)}
      />
    </ToastContext.Provider>
  );
}
