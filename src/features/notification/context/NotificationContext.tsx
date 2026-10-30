'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useUserContext } from '@/features/user/context/UserContext';
import useNotificationInbox from '../hooks/useNotificationInbox';

const NotificationContext = createContext<ReturnType<typeof useNotificationInbox> | null>(null);

function NotificationSession({ userId, children }: { userId: string | number; children: ReactNode }) {
  const inbox = useNotificationInbox(userId);
  return <NotificationContext.Provider value={inbox}>{children}</NotificationContext.Provider>;
}

export default function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useUserContext();
  if (!user?.policiesAcceptedAt || !user.policiesVersion) return <>{children}</>;
  return <NotificationSession key={user.id} userId={user.id}>{children}</NotificationSession>;
}
export function useNotifications() { return useContext(NotificationContext); }
