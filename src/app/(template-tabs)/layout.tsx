import type { ReactNode } from 'react';
import TemplateSection from '@/features/plan-template/components/TemplateSection';

export default function Layout({ children }: { children: ReactNode }) {
  return <TemplateSection>{children}</TemplateSection>;
}
