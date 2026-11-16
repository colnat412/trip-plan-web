type Overlay = {
  id: string;
  requestClose: () => boolean;
  phase: 'queued' | 'active' | 'consumed';
};

const marker = '__viVuOverlay';

/** Keep transient mobile views in Back history without unmounting the parent page. */
export function createOverlayHistory(target: Window) {
  const overlays: Overlay[] = [];
  const retired = new Set<string>();
  let pendingBack = false;
  let listening = false;
  const sessionId = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  let sequence = 0;

  const push = (overlay: Overlay) => {
    target.history.pushState({ ...target.history.state, [marker]: overlay.id }, '');
    overlay.phase = 'active';
  };
  const stopIfIdle = () => {
    if (!overlays.length && !pendingBack && listening) {
      target.removeEventListener('popstate', onPop);
      listening = false;
    }
  };
  const onPop = () => {
    const currentId = target.history.state?.[marker];
    if (retired.has(currentId)) {
      // A parent and its child can close together after a successful mutation.
      pendingBack = true;
      target.history.back();
      return;
    }
    if (pendingBack) {
      pendingBack = false;
      overlays.filter((overlay) => overlay.phase === 'queued').forEach(push);
      stopIfIdle();
      return;
    }
    const top = overlays.at(-1);
    if (!top || top.phase !== 'active' || currentId === top.id) return;
    // The history entry has already been consumed by the browser's Back action.
    top.phase = 'consumed';
    if (!top.requestClose()) push(top);
  };

  return {
    register(requestClose: () => boolean) {
      const overlay: Overlay = { id: `overlay-${sessionId}-${++sequence}`, requestClose, phase: 'queued' };
      overlays.push(overlay);
      if (!listening) {
        target.addEventListener('popstate', onPop);
        listening = true;
      }
      if (!pendingBack) push(overlay);
      return () => {
        const index = overlays.indexOf(overlay);
        if (index < 0) return;
        overlays.splice(index, 1);
        if (overlay.phase === 'active') {
          retired.add(overlay.id);
          if (target.history.state?.[marker] === overlay.id) {
            pendingBack = true;
            target.history.back();
          }
        }
        stopIfIdle();
      };
    },
  };
}
