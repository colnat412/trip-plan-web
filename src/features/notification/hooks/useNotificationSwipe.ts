'use client';

import { useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react';

export const NOTIFICATION_SWIPE_WIDTH = 72;
const DRAG_INTENT_DISTANCE = 8;

interface SwipeGesture {
  pointerId: number;
  startX: number;
  startY: number;
  startOffset: number;
  horizontal: boolean;
}

/** A left swipe reveals the existing delete action; only pressing that action deletes. */
const useNotificationSwipe = (disabled: boolean) => {
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const offsetRef = useRef(0);
  const gestureRef = useRef<SwipeGesture | null>(null);
  const suppressClickRef = useRef(false);

  const moveTo = (value: number) => {
    const nextOffset = Math.max(-NOTIFICATION_SWIPE_WIDTH, Math.min(0, value));
    offsetRef.current = nextOffset;
    setOffset(nextOffset);
  };

  const close = () => moveTo(0);

  const releasePointer = (event: PointerEvent<HTMLElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (disabled || !event.isPrimary || event.button !== 0 || gestureRef.current) return;
    suppressClickRef.current = false;
    // Keep receiving mouse events even if the cursor leaves the row before
    // crossing the drag threshold. Touch scrolling can still cancel capture.
    event.currentTarget.setPointerCapture(event.pointerId);
    gestureRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startOffset: offsetRef.current,
      horizontal: false,
    };
  };

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const gesture = gestureRef.current;
    if (disabled || !gesture || gesture.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - gesture.startX;
    const deltaY = event.clientY - gesture.startY;

    if (!gesture.horizontal) {
      if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < DRAG_INTENT_DISTANCE) return;
      // A vertical gesture belongs to the inbox scroll container.
      if (Math.abs(deltaY) >= Math.abs(deltaX)) {
        gestureRef.current = null;
        releasePointer(event);
        return;
      }
      gesture.horizontal = true;
      setIsDragging(true);
    }

    event.preventDefault();
    suppressClickRef.current = true;
    moveTo(gesture.startOffset + deltaX);
  };

  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    gestureRef.current = null;
    if (gesture.horizontal) {
      moveTo(offsetRef.current <= -NOTIFICATION_SWIPE_WIDTH / 2 ? -NOTIFICATION_SWIPE_WIDTH : 0);
      setIsDragging(false);
    }
    releasePointer(event);
  };

  const onPointerCancel = (event: PointerEvent<HTMLElement>) => {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    gestureRef.current = null;
    if (gesture.horizontal) {
      moveTo(gesture.startOffset);
      setIsDragging(false);
    }
    releasePointer(event);
  };

  const onClickCapture = (event: MouseEvent<HTMLElement>) => {
    // Prevent the click generated after a swipe from opening the notification.
    const isSwipeClick = suppressClickRef.current && event.detail !== 0;
    if (isSwipeClick || offsetRef.current !== 0) {
      suppressClickRef.current = false;
      event.preventDefault();
      event.stopPropagation();
      if (!isSwipeClick) close();
    }
  };

  return {
    offset,
    isDragging,
    isRevealed: offset === -NOTIFICATION_SWIPE_WIDTH,
    close,
    handlers: {
      onPointerDown, onPointerMove, onPointerUp, onPointerCancel,
      onLostPointerCapture: onPointerCancel, onClickCapture,
      onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
        if (disabled) return;
        // Keyboard users can reveal the same action without an extra visible button.
        if (event.key === 'ArrowLeft') {
          moveTo(-NOTIFICATION_SWIPE_WIDTH);
          event.preventDefault();
          event.stopPropagation();
        }
        if ((event.key === 'Escape' || event.key === 'ArrowRight') && offsetRef.current !== 0) {
          close();
          event.preventDefault();
          event.stopPropagation();
        }
      },
    },
  };
};

export default useNotificationSwipe;
