'use client';

import { createContext, useContext } from 'react';
import type { NotificationPreferences } from '../types';

export interface NotificationContextValue {
  count: number;
  accountKey: string;
  inboxOpen: boolean;
  setInboxOpen: (open: boolean) => void;
  version: number;
  refresh: () => Promise<void>;
  preferences: NotificationPreferences | null;
  preferencesLoading: boolean;
  refreshPreferences: () => Promise<unknown>;
  pushError: boolean;
  reconnectPush: () => void;
}
export const NotificationContext = createContext<NotificationContextValue | null>(null);
export const useNotifications = () => useContext(NotificationContext);

