'use client';

import { Fragment, Suspense, type ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import AppLoadingState from '@/base/components/ui/AppLoadingState';
import { NOTIFICATION_VISIT_PARAM } from '../lib/notification-navigation';

interface TargetVisitProps { children: ReactNode }

function TargetVisit({ children }: TargetVisitProps) {
  const params = useSearchParams();
  // A new click must remount client queries even on the same route and trip.
  // Keep the shell/providers mounted so navigation and the session stay intact.
  return <Fragment key={params.get(NOTIFICATION_VISIT_PARAM) ?? 'initial'}>{children}</Fragment>;
}

interface NotificationTargetContentProps { children: ReactNode }

export default function NotificationTargetContent({ children }: NotificationTargetContentProps) {
  return <Suspense fallback={<AppLoadingState />}><TargetVisit>{children}</TargetVisit></Suspense>;
}
