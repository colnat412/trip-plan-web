'use client';

import type { ReactNode } from 'react';
import { AppPageContainer } from '@/base/components/ui';
import AppPageLoadingProvider from '@/base/providers/AppPageLoadingProvider';

interface TemplateSectionProps { children: ReactNode }

export default function TemplateSection({ children }: TemplateSectionProps) {
  return <AppPageContainer>
    <AppPageLoadingProvider scope="section">{children}</AppPageLoadingProvider>
  </AppPageContainer>;
}
