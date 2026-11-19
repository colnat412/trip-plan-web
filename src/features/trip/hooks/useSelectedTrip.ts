'use client';

import { useCallback, useSyncExternalStore } from 'react';

const selectionChangedEvent = 'tripbudget:trip-selection';
const memorySelections = new Map<string, string | null>();

function subscribe(onChange: () => void) {
  window.addEventListener(selectionChangedEvent, onChange);
  return () => {
    window.removeEventListener(selectionChangedEvent, onChange);
  };
}

const serverSnapshot = () => null;

export default function useSelectedTrip(userId: string | number | undefined) {
  const storageKey =
    userId === undefined ? null : `tripbudget:selected-trip:${userId}`;
  const getSnapshot = useCallback(() => {
    if (!storageKey) return null;
    if (memorySelections.has(storageKey))
      return memorySelections.get(storageKey) ?? null;
    try {
      return window.sessionStorage.getItem(storageKey) || null;
    } catch {
      return memorySelections.get(storageKey) ?? null;
    }
  }, [storageKey]);

  const selectedTripId = useSyncExternalStore(
    subscribe,
    getSnapshot,
    serverSnapshot,
  );
  const selectTrip = useCallback(
    (tripId: string | number | null) => {
      if (!storageKey) return;
      const value = tripId === null ? null : String(tripId);
      memorySelections.set(storageKey, value);
      try {
        if (value === null) window.sessionStorage.removeItem(storageKey);
        else window.sessionStorage.setItem(storageKey, value);
      } catch {}
      window.dispatchEvent(new Event(selectionChangedEvent));
    },
    [storageKey],
  );

  return { selectedTripId, selectTrip };
}
