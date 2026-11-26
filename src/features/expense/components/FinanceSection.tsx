'use client';

import type { ReactNode } from 'react';
import FinanceStyleProvider from '@/base/providers/FinanceStyleProvider';

interface FinanceSectionProps { children: ReactNode }

export default function FinanceSection({ children }: FinanceSectionProps) {
  return <FinanceStyleProvider>{children}</FinanceStyleProvider>;
}
