/** Route-backed tab groups share a frame and keep their scroll position on switches. */
const tabRoutes = {
  finance: ['/expenses', '/settlement'],
  templates: ['/templates', '/saved-templates', '/my-templates'],
} as const;

export const getTabIndex = (pathname: string): number => {
  const section = getTabSection(pathname);
  return section ? (tabRoutes[section] as readonly string[]).indexOf(pathname) : -1;
};

export const getTabSection = (pathname: string): 'finance' | 'templates' | null => {
  if (pathname === '/expenses' || pathname === '/settlement') return 'finance';
  if (pathname === '/templates' || pathname === '/saved-templates' || pathname === '/my-templates') return 'templates';
  return null;
};

export const isSameTabSection = (previous: string, next: string): boolean => {
  const section = getTabSection(previous);
  return section !== null && section === getTabSection(next);
};
