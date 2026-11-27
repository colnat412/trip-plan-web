/** Route-backed tab groups share a frame and keep their scroll position on switches. */
const tabRoutes = {
  finance: ['/plan', '/expenses', '/settlement', '/notes'],
} as const;

export const getTabIndex = (pathname: string): number => {
  const section = getTabSection(pathname);
  return section ? (tabRoutes[section] as readonly string[]).indexOf(pathname) : -1;
};

export const getTabSection = (pathname: string): 'finance' | null => {
  if (pathname === '/plan' || pathname === '/expenses' || pathname === '/settlement' || pathname === '/notes') return 'finance';
  return null;
};

export const isSameTabSection = (previous: string, next: string): boolean => {
  const section = getTabSection(previous);
  return section !== null && section === getTabSection(next);
};
