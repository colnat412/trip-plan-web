'use client';

import { useEffect, useEffectEvent } from 'react';
import { createOverlayHistory } from '@/base/utils/overlay-history';

let mobileHistory: ReturnType<typeof createOverlayHistory> | undefined;

export default function useMobileOverlayBack(active: boolean, requestClose: () => boolean) {
  const onBack = useEffectEvent(requestClose);
  useEffect(() => {
    if (!active) return;
    mobileHistory ??= createOverlayHistory(window);
    return mobileHistory.register(() => onBack());
  }, [active]);
}
