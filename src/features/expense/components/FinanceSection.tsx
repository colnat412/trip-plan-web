'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import AppTabSection from '@/base/components/layout/AppTabSection';
import FinanceNavigation from './FinanceNavigation';

export default function FinanceSection({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <AppTabSection navigation={<FinanceNavigation active={pathname === '/settlement' ? 'settlement' : 'expenses'} />}>
      {children}
    </AppTabSection>
  );
}
