import type { ReactNode } from 'react';
import { PasswordRecoveryProvider } from '@/features/auth/context/PasswordRecoveryContext';

interface LayoutProps { children: ReactNode }

export default function Layout({ children }: LayoutProps) {
  return <PasswordRecoveryProvider>{children}</PasswordRecoveryProvider>;
}
