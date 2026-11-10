'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { SelectProps } from '@mui/material';
import {
  getSelectMenuPlacement,
  SELECT_MENU_MAX_HEIGHT,
  SELECT_MENU_VIEWPORT_GAP,
} from '../utils/select-menu';

/** Shared positioning for plain select menus, including short sheets and the visual viewport. */
const useSelectMenu = (
  props: Pick<SelectProps, 'MenuProps' | 'onOpen' | 'onClose'>,
) => {
  const anchorRef = useRef<HTMLElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [placement, setPlacement] = useState({
    opensAbove: false,
    maxHeight: SELECT_MENU_MAX_HEIGHT,
  });
  const updatePlacement = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;
    const viewport = window.visualViewport;
    setPlacement(
      getSelectMenuPlacement(anchor.getBoundingClientRect(), {
        top: viewport?.offsetTop ?? 0,
        height: viewport?.height ?? window.innerHeight,
      }),
    );
  }, []);
  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener('resize', updatePlacement);
    window.visualViewport?.addEventListener('resize', updatePlacement);
    window.visualViewport?.addEventListener('scroll', updatePlacement);
    return () => {
      window.removeEventListener('resize', updatePlacement);
      window.visualViewport?.removeEventListener('resize', updatePlacement);
      window.visualViewport?.removeEventListener('scroll', updatePlacement);
    };
  }, [isOpen, updatePlacement]);
  return {
    onOpen: (event: React.SyntheticEvent) => {
      const target =
        event.currentTarget instanceof HTMLElement
          ? event.currentTarget
          : event.target;
      if (target instanceof HTMLElement) anchorRef.current = target;
      updatePlacement();
      setIsOpen(true);
      props.onOpen?.(event);
    },
    onClose: (event: React.SyntheticEvent) => {
      setIsOpen(false);
      props.onClose?.(event);
    },
    MenuProps: {
      variant: 'menu',
      marginThreshold: SELECT_MENU_VIEWPORT_GAP,
      anchorOrigin: {
        vertical: placement.opensAbove ? 'top' : 'bottom',
        horizontal: 'left',
      },
      transformOrigin: {
        vertical: placement.opensAbove ? 'bottom' : 'top',
        horizontal: 'left',
      },
      ...props.MenuProps,
      slotProps: {
        ...props.MenuProps?.slotProps,
        paper: (ownerState) => {
          const suppliedPaper = props.MenuProps?.slotProps?.paper;
          const paper =
            typeof suppliedPaper === 'function'
              ? suppliedPaper(ownerState)
              : suppliedPaper;
          return {
            ...paper,
            sx: [
              ...(Array.isArray(paper?.sx)
                ? paper.sx
                : paper?.sx
                  ? [paper.sx]
                  : []),
              {
                maxHeight: placement.maxHeight,
                overflowY: 'auto',
                overscrollBehaviorY: 'contain',
              },
            ],
          };
        },
      },
    } satisfies NonNullable<SelectProps['MenuProps']>,
  };
};

export default useSelectMenu;
