// Remember the choice per account/browser; blocked storage falls back to this session's memory.
const seenInMemory = new Set<string>();
const keyFor = (accountKey: string) => `vivu:notification-prompt:v1:${accountKey}`;

export const hasSeenNotificationPrompt = (accountKey: string): boolean => {
  if (seenInMemory.has(accountKey)) return true;
  try { return localStorage.getItem(keyFor(accountKey)) === 'seen'; }
  catch { return false; }
};
export const rememberNotificationPrompt = (accountKey: string) => {
  seenInMemory.add(accountKey);
  try { localStorage.setItem(keyFor(accountKey), 'seen'); } catch { /* Keep the in-memory choice. */ }
};
