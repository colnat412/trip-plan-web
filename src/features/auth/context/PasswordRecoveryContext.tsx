'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface RecoveryState {
  email: string; setEmail: (email: string) => void;
  verified: boolean; setVerified: (verified: boolean) => void;
  remaining: number; deadline: number; startCooldown: () => void;
}
const Context = createContext<RecoveryState | null>(null);

export function PasswordRecoveryProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState('');
  const [verified, setVerified] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [deadline, setDeadline] = useState(0);
  useEffect(() => {
    if (!deadline) return;
    const tick = () => setRemaining(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
    const timer = window.setInterval(tick, 1000);
    window.addEventListener('focus', tick);
    return () => { window.clearInterval(timer); window.removeEventListener('focus', tick); };
  }, [deadline]);
  return <Context.Provider value={{ email, setEmail, verified, setVerified, remaining, deadline,
    startCooldown: () => { setDeadline(Date.now() + 60000); setRemaining(60); },
  }}>{children}</Context.Provider>;
}

export function usePasswordRecoveryState() {
  const state = useContext(Context);
  if (!state) throw new Error('PasswordRecoveryProvider is required');
  return state;
}
