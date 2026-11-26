export const SELECT_MENU_MAX_HEIGHT = 280;
export const SELECT_MENU_VIEWPORT_GAP = 16;



interface GetSelectMenuPlacementViewportParams { top: number; height: number }

/** Choose the side with room, keeping the popup outside the select's rectangle. */
interface GetSelectMenuPlacementAnchorParams { top: number; bottom: number }

export const getSelectMenuPlacement = (
  anchor: GetSelectMenuPlacementAnchorParams,
  viewport: GetSelectMenuPlacementViewportParams,
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
