'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import AppTabSection from '@/base/components/layout/AppTabSection';
import TemplateNavigation from './TemplateNavigation';

export default function TemplateSection({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const active = pathname === '/my-templates' ? 'mine' : pathname === '/saved-templates' ? 'saved' : 'explore';
  return (
    <AppTabSection navigation={<TemplateNavigation active={active} />}>
      {children}
    </AppTabSection>
  );
}
