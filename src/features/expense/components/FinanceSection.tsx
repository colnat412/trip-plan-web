'use client';

import type { ReactNode } from 'react';
import FinanceStyleProvider from '@/base/providers/FinanceStyleProvider';

export default function FinanceSection({ children }: { children: ReactNode }) {
  return <FinanceStyleProvider>{children}</FinanceStyleProvider>;
}
