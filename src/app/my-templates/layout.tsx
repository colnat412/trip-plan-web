import type { ReactNode } from 'react';
import TemplateSection from '@/features/plan-template/components/TemplateSection';

export default function MyTemplatesLayout({ children }: { children: ReactNode }) {
  return <TemplateSection active="mine">{children}</TemplateSection>;
}
