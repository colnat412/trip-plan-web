import type { ReactNode } from 'react';
import TemplateSection from '@/features/plan-template/components/TemplateSection';

interface LayoutProps { children: ReactNode }

export default function Layout({ children }: LayoutProps) {
  return <TemplateSection>{children}</TemplateSection>;
}
