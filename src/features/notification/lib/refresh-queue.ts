/** Coalesce simultaneous signals; a signal during loading always gets a trailing refresh. */
export const createRefreshQueue = (refresh: () => Promise<unknown>, onError: () => void) => {
  let pending: Promise<void> | null = null;
  let dirty = false;
  let disposed = false;
  const request = (): Promise<void> => {
    if (disposed) return Promise.resolve();
    dirty = true;
    if (pending) return pending;
    pending = (async () => {
      await Promise.resolve();
      while (dirty && !disposed) {
        dirty = false;
        try { await refresh(); } catch { if (!disposed) onError(); }
      }
    })().finally(() => {
      pending = null;
      if (dirty && !disposed) void request();
    });
    return pending;
  };
  return { request, dispose: () => { disposed = true; dirty = false; } };
};
