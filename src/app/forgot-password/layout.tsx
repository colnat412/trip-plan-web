import type { ReactNode } from 'react';
import { PasswordRecoveryProvider } from '@/features/auth/context/PasswordRecoveryContext';

export default function Layout({ children }: { children: ReactNode }) {
  return <PasswordRecoveryProvider>{children}</PasswordRecoveryProvider>;
}
