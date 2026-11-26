/** Move one item within the complete day; invalid or unchanged moves are ignored. */
export function moveActivity<T extends { id: string }>(items: T[], activeId: string, overId: string): T[] | null {
  const from = items.findIndex(item => item.id === activeId);
  const to = items.findIndex(item => item.id === overId);
  if (from < 0 || to < 0 || from === to) return null;
  const result = [...items];
  const [item] = result.splice(from, 1);
  result.splice(to, 0, item);
  return result;
}

/** Retain newly loaded pages while previewing the reordered visible items. */
export function applyActivityOrder<T extends { id: string }>(items: T[], ids: string[] | null): T[] {
  if (!ids) return items;
  const byId = new Map(items.map(item => [item.id, item]));
  const ordered: T[] = [];
  for (const id of ids) {
    const item = byId.get(id);
    if (item) { ordered.push(item); byId.delete(id); }
  }
  return [...ordered, ...byId.values()];
}

interface SaveActivityMoveParams<T extends { id: string }> {
  loadCompleteDay: () => Promise<T[]>;
  saveOrder: (ids: string[]) => Promise<unknown>;
  isCurrent: () => boolean;
  activeId: string;
  overId: string;
}

export async function saveActivityMove<T extends { id: string }>({
  loadCompleteDay, saveOrder, isCurrent, activeId, overId,
}: SaveActivityMoveParams<T>): Promise<boolean> {
  const completeDay = await loadCompleteDay();
  if (!isCurrent()) return false;
  const ordered = moveActivity(completeDay, activeId, overId);
  if (!ordered) return false;
  await saveOrder(ordered.map(activity => activity.id));
  return true;
}
