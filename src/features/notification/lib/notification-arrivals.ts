import type { NotificationItem } from '../types';

/** One tracker per account session, shared by push and inbox refreshes. */
export const createNotificationArrivalTracker = () => {
  const seen = new Set<string>();
  let initialized = false;
  let newestTime = -Infinity;
  const remember = (id: string) => {
    if (seen.has(id)) return false;
    seen.add(id);
    if (seen.size > 1000) seen.delete(seen.values().next().value!);
    return true;
  };

  return {
    receivePush: remember,
    observe: (items: Pick<NotificationItem, 'id' | 'createdAt'>[]) => {
      let arrived = false;
      const previousTime = newestTime;
      for (const item of items) {
        const time = Date.parse(item.createdAt);
        const isNew = remember(item.id);
        // Removing a recent item can expose older history: that is not an arrival.
        if (initialized && isNew && Number.isFinite(time) && time >= previousTime) arrived = true;
        if (Number.isFinite(time)) newestTime = Math.max(newestTime, time);
      }
      initialized = true;
      return arrived;
    },
  };
};
