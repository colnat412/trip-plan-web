import type { ReactNode } from 'react';
import FinanceSection from '@/features/expense/components/FinanceSection';

interface LayoutProps { children: ReactNode }

export default function Layout({ children }: LayoutProps) {
  return <FinanceSection>{children}</FinanceSection>;
}
