'use client';

import { createContext, useContext, useEffect, useEffectEvent, useState } from 'react';

export const DialogDraftContext = createContext<((check: () => boolean) => () => void) | null>(null);

/** Compare actual form values, including changes made through pickers and uploads. */
export default function useDialogDraft(getValues: () => unknown) {
  const register = useContext(DialogDraftContext);
  const [initial] = useState(() => JSON.stringify(getValues()));
  const isDirty = useEffectEvent(() => JSON.stringify(getValues()) !== initial);
  useEffect(() => register?.(() => isDirty()), [register]);
}
