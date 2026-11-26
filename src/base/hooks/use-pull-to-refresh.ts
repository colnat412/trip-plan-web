'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

export const PULL_REFRESH_THRESHOLD = 64;
const MAX_PULL = 88;
const DIRECTION_SLOP = 12;
const IGNORE_TARGETS = 'a, button, input, textarea, select, form, [contenteditable="true"], [role="slider"], [draggable="true"], [data-pull-refresh-ignore], .maplibregl-map';

/** Only take over a downward, single-finger gesture that starts at the main scroll's top. */
export default function usePullToRefresh(
  scroller: HTMLElement | null,
  routeKey: string,
  onRefresh: () => void | Promise<unknown> = () => window.location.reload(),
  enabled = true,
) {
  const context = useMemo(() => ({ scroller, routeKey, enabled }), [scroller, routeKey, enabled]);
  const [feedback, setFeedback] = useState({ context, distance: 0, refreshing: false });
  const refreshRef = useRef(onRefresh);
  useEffect(() => { refreshRef.current = onRefresh; }, [onRefresh]);

  useEffect(() => {
    if (!scroller || !enabled) return;
    const updateFeedback = (distance: number, refreshing = false) => setFeedback(previous =>
      previous.context === context && previous.distance === distance && previous.refreshing === refreshing
        ? previous : { context, distance, refreshing },
    );
    let gesture: { x: number; y: number } | null = null;
    let pull = 0;
    let pending = false;
    let disposed = false;
    let reloadTimer: ReturnType<typeof setTimeout> | undefined;

    const reset = () => {
      gesture = null;
      pull = 0;
      if (!pending) updateFeedback(0);
    };
    const blocked = () => Boolean(
      document.querySelector('[role="dialog"], [role="alertdialog"], [role="menu"]') ||
      scroller.querySelector('[aria-busy="true"]'),
    );
    const start = (event: TouchEvent) => {
      reset();
      if (pending || event.touches.length !== 1 || scroller.scrollTop > 0 || blocked()) return;
      const target = event.target;
      if (!(target instanceof Element) || target.closest(IGNORE_TARGETS)) return;
      // Nested scroll areas own their gestures even when they have reached their own top.
      for (let node: Element | null = target; node && node !== scroller; node = node.parentElement) {
        if (node.scrollHeight > node.clientHeight + 1 && /auto|scroll/.test(getComputedStyle(node).overflowY)) return;
      }
      gesture = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    };
    const move = (event: TouchEvent) => {
      if (!gesture || pending) return;
      if (event.touches.length !== 1 || scroller.scrollTop > 0 || blocked()) { reset(); return; }
      const dx = Math.abs(event.touches[0].clientX - gesture.x);
      const dy = event.touches[0].clientY - gesture.y;
      if (dy < 0 || (dx > DIRECTION_SLOP && dx > dy)) { reset(); return; }
      if (dy === 0 || (dx > dy && dx <= DIRECTION_SLOP)) return;
      // If the browser owns the gesture, do not show or trigger a second refresh.
      if (!event.cancelable) { reset(); return; }
      event.preventDefault();
      pull = Math.max(0, Math.min(MAX_PULL, (dy - DIRECTION_SLOP) * 0.5));
      updateFeedback(pull);
    };
    const end = () => {
      if (!gesture || pending) return;
      if (pull < PULL_REFRESH_THRESHOLD || blocked() || scroller.scrollTop > 0) { reset(); return; }
      pending = true;
      gesture = null;
      updateFeedback(PULL_REFRESH_THRESHOLD, true);
      // Allow the loading feedback to paint before navigating.
      reloadTimer = setTimeout(() => {
        return Promise.resolve().then(() => {
          if (!disposed) return refreshRef.current();
        }).catch(() => undefined).finally(() => {
          if (disposed) return;
          pending = false;
          pull = 0;
          updateFeedback(0);
        });
      }, 180);
    };
    scroller.addEventListener('touchstart', start, { passive: true });
    scroller.addEventListener('touchmove', move, { passive: false });
    scroller.addEventListener('touchend', end, { passive: true });
    scroller.addEventListener('touchcancel', reset, { passive: true });
    return () => {
      disposed = true;
      clearTimeout(reloadTimer);
      scroller.removeEventListener('touchstart', start);
      scroller.removeEventListener('touchmove', move);
      scroller.removeEventListener('touchend', end);
      scroller.removeEventListener('touchcancel', reset);
    };
  }, [scroller, routeKey, enabled, context]);

  const { distance, refreshing } = feedback.context === context && enabled
    ? feedback : { distance: 0, refreshing: false };
  return { distance, refreshing, ready: distance >= PULL_REFRESH_THRESHOLD };
}
