export const SELECT_MENU_MAX_HEIGHT = 280;
export const SELECT_MENU_VIEWPORT_GAP = 16;

/** Choose the side with room, keeping the popup outside the select's rectangle. */
export const getSelectMenuPlacement = (
  anchor: { top: number; bottom: number },
  viewport: { top: number; height: number },
) => {
  const above = Math.max(
    0,
    anchor.top - viewport.top - SELECT_MENU_VIEWPORT_GAP,
  );
  const below = Math.max(
    0,
    viewport.top + viewport.height - anchor.bottom - SELECT_MENU_VIEWPORT_GAP,
  );
  const opensAbove = below < SELECT_MENU_MAX_HEIGHT && above > below;
  return {
    opensAbove,
    maxHeight: Math.min(SELECT_MENU_MAX_HEIGHT, opensAbove ? above : below),
  };
};
