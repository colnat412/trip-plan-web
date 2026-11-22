'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { Alert, type AlertProps } from '@mui/material';

/** Inline notices share the same five-second lifetime as toast messages. */
export default function AppAlert({ children, onClose, ...props }: AlertProps) {
  const [dismissedMessage, setDismissedMessage] = useState<{ value: ReactNode } | null>(null);
  useEffect(() => {
    const timer = window.setTimeout(() => setDismissedMessage({ value: children }), 5_000);
    return () => window.clearTimeout(timer);
  }, [children]);

  if (dismissedMessage?.value === children) return null;
  return <Alert {...props} onClose={(event) => {
    setDismissedMessage({ value: children });
    onClose?.(event);
  }}>{children}</Alert>;
}
