import type { ReactNode } from 'react';
import FinanceSection from '@/features/expense/components/FinanceSection';

export default function Layout({ children }: { children: ReactNode }) {
  return <FinanceSection>{children}</FinanceSection>;
}
