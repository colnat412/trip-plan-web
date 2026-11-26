'use client';

import { useCallback, useEffect, useRef, type PointerEvent as ReactPointerEvent, type MouseEvent, type KeyboardEvent } from 'react';

const HOLD_MS = 500;
const MOVE_TOLERANCE = 8;

/** Context actions without consuming normal taps, image links or vertical scrolling. */
export default function useLongPress(onOpen: (element: HTMLElement) => void) {
  const callback = useRef(onOpen);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const origin = useRef<{ x: number; y: number } | null>(null);
  const suppressClick = useRef(false);
  const detach = useRef<() => void>(() => {});
  const cancel = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = undefined;
    origin.current = null;
    detach.current();
    detach.current = () => {};
  }, []);
  useEffect(() => { callback.current = onOpen; }, [onOpen]);
  useEffect(() => () => cancel(), [cancel]);

  return {
    onPointerDown(event: ReactPointerEvent<HTMLElement>) {
      cancel();
      suppressClick.current = false;
      if (event.button !== 0 || event.isPrimary === false) return;
      const element = event.currentTarget;
      const pointerId = event.pointerId;
      origin.current = { x: event.clientX, y: event.clientY };
      const anotherPointer = (next: globalThis.PointerEvent) => { if (next.pointerId !== pointerId) cancel(); };
      document.addEventListener('scroll', cancel, { capture: true, passive: true });
      document.addEventListener('pointerdown', anotherPointer, true);
      detach.current = () => {
        document.removeEventListener('scroll', cancel, true);
        document.removeEventListener('pointerdown', anotherPointer, true);
      };
      timer.current = setTimeout(() => {
        cancel();
        suppressClick.current = true;
        callback.current(element);
      }, HOLD_MS);
    },
    onPointerMove(event: ReactPointerEvent<HTMLElement>) {
      if (origin.current && Math.hypot(event.clientX - origin.current.x, event.clientY - origin.current.y) > MOVE_TOLERANCE) cancel();
    },
    onPointerUp: cancel,
    onPointerLeave: cancel,
    onPointerCancel: cancel,
    onClickCapture(event: MouseEvent<HTMLElement>) {
      if (!suppressClick.current) return;
      event.preventDefault();
      event.stopPropagation();
      suppressClick.current = false;
    },
    onContextMenu(event: MouseEvent<HTMLElement>) {
      event.preventDefault();
      event.stopPropagation();
      cancel();
      suppressClick.current = true;
      callback.current(event.currentTarget);
    },
    onKeyDown(event: KeyboardEvent<HTMLElement>) {
      suppressClick.current = false;
      if (event.target !== event.currentTarget || event.repeat) return;
      if (event.key !== 'Enter' && event.key !== ' ' && event.key !== 'ContextMenu' && !(event.shiftKey && event.key === 'F10')) return;
      event.preventDefault();
      cancel();
      callback.current(event.currentTarget);
    },
  };
}
