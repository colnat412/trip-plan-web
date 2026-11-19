'use client';

import type { ReactNode } from 'react';
import { useUserContext } from '@/features/user/context/UserContext';
import { notificationsEnabled } from '../lib/firebase-config';
import NotificationSession from './NotificationSession';

const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUserContext();
  if (!notificationsEnabled || !user) return children;
  return <NotificationSession key={String(user.id)} accountKey={String(user.id)}>{children}</NotificationSession>;
};
export default NotificationProvider;
