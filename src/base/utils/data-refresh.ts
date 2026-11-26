'use client';

const subscribers = new Set<() => Promise<unknown>>();
let pending: Promise<unknown> | null = null;

/** Only mounted, enabled data sources subscribe; refreshing never navigates or resets React state. */
export function subscribeDataRefresh(refresh: () => Promise<unknown>) {
  subscribers.add(refresh);
  return () => { subscribers.delete(refresh); };
}

export function refreshActiveData(): Promise<unknown> {
  if (pending) return pending;
  pending = Promise.allSettled([...subscribers].map(refresh => Promise.resolve().then(refresh)))
    .finally(() => { pending = null; });
  return pending;
}
